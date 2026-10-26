package com.gsc.bm;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.cards.bruiser.character.BigBadBruiser;
import com.gsc.bm.model.game.*;
import com.gsc.bm.repo.external.*;
import com.gsc.bm.service.factories.*;
import com.gsc.bm.service.session.*;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.*;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.nio.file.*;
import java.time.Clock;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest(webEnvironment=SpringBootTest.WebEnvironment.RANDOM_PORT,
    properties={"app.game.deadline-poll-ms=3600000","app.archive.retry-ms=3600000"})
@Tag("context")
class ArchiveLifecycleCliTest extends SqliteContextSupport {
    @LocalServerPort int port;
    @Autowired UserCredentialsRepository users;
    @Autowired PasswordEncoder encoder;
    @Autowired CardFactoryService cards;
    @Autowired DeckFactoryService decks;
    @Autowired GameSessionService games;
    @Autowired MatchArchiveService archive;
    @Autowired MatchVersions versions;
    @Autowired ObjectMapper mapper;
    @Autowired @Qualifier("applicationJdbc") JdbcTemplate jdbc;
    @SpyBean GameFactoryService factory;
    @SpyBean MatchEventRepository repository;
    @MockBean Clock clock;
    static java.util.stream.Stream<org.junit.jupiter.params.provider.Arguments> cases() {
        return java.util.stream.Stream.of("quick1vCom","open1vCom","quick1v1","quickFFA").flatMap(mode ->
            java.util.stream.Stream.of("leave","timeout","recover").map(s -> org.junit.jupiter.params.provider.Arguments.of(mode,s)));
    }
    @ParameterizedTest @MethodSource("cases")
    void recordsExactLifecycleAndRecoversViaRealCli(String mode,String scenario) throws Exception {
        var time=new AtomicLong(1_000_000); when(clock.millis()).thenAnswer(i->time.get());
        var fault=new AtomicBoolean(scenario.equals("recover"));
        int humans=mode.equals("quickFFA")?3:mode.equals("quick1v1")?2:1;
        List<String> accounts=new ArrayList<>();List<Player> players=new ArrayList<>();
        for(int i=0;i<humans;i++) {
            String user="archive"+mode+scenario+i;accounts.add(user);
            users.createIfAbsent(new UserCredentialsRecord(user,null,encoder.encode("synthetic"),"USER"));
            var character=new BigBadBruiser();
            players.add(new Player(user,character,decks.craftBasicActionStarterCard(character),List.of(),decks.craftLastResortStarterCard(character),List.of()));
        }
        if(humans==1) {
            var character=new BigBadBruiser();
            players.add(new ComPlayer(character,decks.craftBasicActionStarterCard(character),List.of(),decks.craftLastResortStarterCard(character),List.of()));
        }
        var game=new Game(players,mode,false);String id=game.getGameId();
        if(mode.equals("quick1vCom")) doReturn(game).when(factory).craftQuick1vComGame(accounts.get(0));
        else if(mode.equals("open1vCom")) doReturn(game).when(factory).craftOpen1vComGame(accounts.get(0),"fixture");
        else doReturn(game).when(factory).craftQuickMultiPlayerGame(anyList(),eq(mode));
        doAnswer(i->{if(fault.get() && !((List<MatchEventRepository.Entry>)i.getArgument(1)).isEmpty()
                && ((List<MatchEventRepository.Entry>)i.getArgument(1)).get(0).getSequence()>0)
                    throw new org.springframework.dao.DataAccessResourceFailureException("synthetic outage");
                return i.callRealMethod();}).when(repository).append(eq(id),anyList());
        Path root=Path.of("..").toAbsolutePath().normalize(), controls=Files.createTempDirectory(Path.of("target"),"i19b-controls-").toAbsolutePath();
        Path output=Path.of("target","i19b-"+mode+"-"+scenario+".json");
        var pb=new ProcessBuilder(root.resolve(".tools/node-v12.22.12-win-x64/node.exe").toString(),root.resolve("scripts/cli-archive-lifecycle-test.cjs").toString());
        pb.environment().put("BM_URL","http://127.0.0.1:"+port+"/api");pb.environment().put("BM_MODE",mode);pb.environment().put("BM_SCENARIO",scenario);
        pb.environment().put("BM_GAME",id);pb.environment().put("BM_ACCOUNTS",mapper.writeValueAsString(accounts));pb.environment().put("BM_CONTROLS",controls.toString());
        Process process=pb.redirectErrorStream(true).redirectOutput(output.toFile()).start();int request=0;
        long until=System.nanoTime()+TimeUnit.SECONDS.toNanos(50);
        try {
            while(process.isAlive() && System.nanoTime()<until) {
                Path input=controls.resolve(request+".request");
                if(Files.exists(input)) {
                    String command=Files.readString(input);
                    if(command.equals("active")) assertTrue(repository.activeMatchIds().contains(id));
                    else if(command.equals("recover")) {fault.set(false);archive.retryPending();}
                    else {time.addAndGet(Long.parseLong(command));games.expireDue();}
                    Files.writeString(controls.resolve(request+".response"),"ok");request++;
                }
                Thread.sleep(10);
            }
            assertFalse(process.isAlive(),"CLI stalled: "+Files.readString(output));
            assertEquals(0,process.exitValue(),Files.readString(output));var result=mapper.readTree(Files.readString(output));
            assertTrue(result.path("ok").asBoolean());assertEquals(1,game.getTurn()-(mode.equals("quickFFA") && scenario.equals("timeout")?1:0));
            var fresh=new MatchEventRepository(new JdbcTemplate(com.gsc.bm.conf.db.ApplicationDatabase.open(DATABASE)));
            assertFalse(fresh.activeMatchIds().contains(id));
            var registration=jdbc.queryForMap("SELECT * FROM LOG004_MATCH_REGISTRY WHERE C_GAME_ID=?",id);
            assertEquals(mode,registration.get("T_MODE"));assertEquals(fresh.read(id).size()-1,((Number)registration.get("N_OUTCOME_SEQUENCE")).intValue());
            assertEquals(fresh.read(id).get(fresh.read(id).size()-1).getHash(),registration.get("T_OUTCOME_HASH"));
            var reread=new MatchArchiveService(fresh,mapper,versions);
            for(String user:accounts) assertEquals(result.path("exported"),mapper.valueToTree(reread.export(id,user)));
            assertThrows(IllegalArgumentException.class,()->games.getGame(id));
            assertFalse(Files.readString(output).contains("synthetic"));assertFalse(Files.readString(output).contains("saltedHash"));
            Files.copy(output,root.resolve(".build-logs/i19b-"+mode+"-"+scenario+".json"),StandardCopyOption.REPLACE_EXISTING);
            Path evidence=root.resolve(".build-logs/i19b-"+mode+"-"+scenario+"-evidence");Files.createDirectories(evidence);
            // VACUUM INTO requires a new file. Keep earlier evidence and bind this snapshot to its export.
            Path snapshot=evidence.resolve(id+".sqlite");
            jdbc.execute("VACUUM INTO '"+snapshot.toString().replace("'","''")+"'");
        } finally {
            process.destroyForcibly();fault.set(false);archive.retryPending();reset(factory);reset(repository);
            for(String user:accounts) games.logout(user);
        }
    }
}
