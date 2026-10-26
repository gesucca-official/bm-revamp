package com.gsc.bm;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.game.*;
import com.gsc.bm.model.cards.bruiser.character.BigBadBruiser;
import com.gsc.bm.repo.external.*;
import com.gsc.bm.service.factories.*;
import com.gsc.bm.service.session.*;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.jdbc.core.JdbcTemplate;
import java.time.Clock;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest(webEnvironment=SpringBootTest.WebEnvironment.RANDOM_PORT, properties="app.game.deadline-poll-ms=3600000")
@Tag("context")
class LifecycleCliTest extends SqliteContextSupport {
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
    @MockBean Clock clock;

    Player human(String user) {
        var c=new BigBadBruiser();
        return new Player(user,c,decks.craftBasicActionStarterCard(c),List.of(),decks.craftLastResortStarterCard(c),List.of());
    }
    @ParameterizedTest
    @ValueSource(strings={"pending", "before-submit", "move-exact", "ffa", "com-before", "com-exact", "com-after"})
    void realDistinctConnectionsWithControlledDeadlines(String scenario) throws Exception {
        var time=new AtomicLong(1_000_000);
        when(clock.millis()).thenAnswer(i->time.get());
        String a="life"+scenario.replace("-", "")+"A", b=a+"B", c=a+"C";
        for(String user:List.of(a,b,c)) { users.createIfAbsent(new UserCredentialsRecord(user,null,encoder.encode("synthetic"),"USER")); }
        List<Player> players=new ArrayList<>(); players.add(human(a));
        if(scenario.startsWith("com")) {
            var character=new BigBadBruiser();
            players.add(new ComPlayer(character,decks.craftBasicActionStarterCard(character),List.of(),
                decks.craftLastResortStarterCard(character),List.of()));
        } else { players.add(human(b)); if(scenario.equals("ffa")) { players.add(human(c)); } }
        var game=new Game(players,scenario.startsWith("com") ? "quick1vCom" : "quickFFA",false);
        games.newGame(game);
        Path root=Path.of("..").toAbsolutePath().normalize();
        Path controls=Files.createTempDirectory(Path.of("target"),"lifecycle-clock-").toAbsolutePath();
        Path output=Path.of("target","i14-i23-"+scenario+".json");
        var pb=new ProcessBuilder(root.resolve(".tools/node-v12.22.12-win-x64/node.exe").toString(),root.resolve("scripts/cli-lifecycle-test.cjs").toString());
        pb.environment().put("BM_URL","http://127.0.0.1:"+port+"/api");
        pb.environment().put("BM_A",a);pb.environment().put("BM_B",b);pb.environment().put("BM_C",c);
        pb.environment().put("BM_GAME",game.getGameId());pb.environment().put("BM_SCENARIO",scenario);
        pb.environment().put("BM_CONTROLS",controls.toString());
        Process process=pb.redirectErrorStream(true).redirectOutput(output.toFile()).start();
        long until=System.nanoTime()+TimeUnit.SECONDS.toNanos(40); int request=0;
        try {
            while(process.isAlive() && System.nanoTime()<until) {
                Path input=controls.resolve(request+".request");
                if(Files.exists(input)) {
                    long delta=Long.parseLong(Files.readString(input));time.addAndGet(delta);games.expireDue();
                    Files.writeString(controls.resolve(request+".response"),Long.toString(time.get())); request++;
                }
                Thread.sleep(10);
            }
            assertFalse(process.isAlive(),"CLI stalled: "+Files.readString(output));
            assertEquals(0,process.exitValue(),Files.readString(output));
            var result=mapper.readTree(Files.readString(output));assertTrue(result.path("ok").asBoolean());
            assertTrue(game.isOver());
            var saved=mapper.valueToTree(archive.export(game.getGameId(),a));
            assertTrue(saved.path("recording").path("complete").asBoolean());
            long outcomes=0;
            for(var event:saved.path("events")) { if(mapper.readTree(event.path("json").asText()).path("kind").asText().equals("OUTCOME")) { outcomes++; } }
            assertEquals(1,outcomes);
            var reread=new MatchArchiveService(new MatchEventRepository(jdbc),mapper,versions);
            assertEquals(saved,mapper.valueToTree(reread.export(game.getGameId(),a)));
            assertFalse(Files.readString(output).contains("synthetic"));
        } finally {
            process.destroyForcibly();
            for(String user:List.of(a,b,c)) { try { games.leaveGame(game.getGameId(),user); } catch(IllegalArgumentException ignored) {} }
        }
    }
}
