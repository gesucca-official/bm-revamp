package com.gsc.bm;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.bruiser.character.BigBadBruiser;
import com.gsc.bm.model.cards.junkie.character.ToxicJunkie;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.repo.external.*;
import com.gsc.bm.service.factories.*;
import com.gsc.bm.service.session.*;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
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
import java.util.concurrent.atomic.AtomicLong;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/** Real queue/controller/session/archive; only the shuffled player fixture and time are controlled. */
@SpringBootTest(webEnvironment=SpringBootTest.WebEnvironment.RANDOM_PORT,
    properties="app.game.deadline-poll-ms=3600000")
@Tag("context")
class QuickFfaCliTest extends SqliteContextSupport {
    @LocalServerPort int port;
    @Autowired UserCredentialsRepository users;
    @Autowired PasswordEncoder encoder;
    @Autowired CardFactoryService cards;
    @Autowired DeckFactoryService decks;
    @Autowired GameSessionService games;
    @Autowired MatchVersions versions;
    @Autowired ObjectMapper mapper;
    @Autowired @Qualifier("applicationJdbc") JdbcTemplate jdbc;
    @SpyBean PlayerFactoryService players;
    @MockBean Clock clock;

    @ParameterizedTest @ValueSource(strings={"early","full","bots","concurrent","leave",
        "batch","all-timeout","move-before","move-exact","move-after",
        "reconnect-before","reconnect-exact","reconnect-after"})
    void ffaQueueAndLifecycle(String scenario) throws Exception { run(scenario); }

    void run(String scenario) throws Exception {
        var time=new AtomicLong(2_000_000);
        when(clock.millis()).thenAnswer(i->time.get());
        String prefix="ffa"+scenario.replace("-", "");
        List<String> accounts=new ArrayList<>();
        for(String suffix:List.of("A","B","C","D","E","F")) {
            String user=prefix+suffix; accounts.add(user);
            users.createIfAbsent(new UserCredentialsRecord(user,null,encoder.encode("synthetic"),"USER"));
            Character character=new BigBadBruiser();
            List<Card> regular=new ArrayList<>();
            var fixture=new Player(user,character,decks.craftBasicActionStarterCard(character),List.of(),
                decks.craftLastResortStarterCard(character),regular);
            doAnswer(i -> (Player) org.springframework.util.SerializationUtils.deserialize(
                org.springframework.util.SerializationUtils.serialize(fixture))).when(players).craftRandomPlayer(user);
        }
        doAnswer(i -> new com.gsc.bm.model.game.ComPlayer(new BigBadBruiser(),
            cards.craftCard("com.ShuffleFeet"), List.of(), cards.craftCard("com.last.Struggle"),
            java.util.stream.IntStream.range(0,50).mapToObj(n -> cards.craftCard("com.ShuffleFeet")).collect(java.util.stream.Collectors.toList())))
            .when(players).craftRandomComPlayer();
        Path root=Path.of("..").toAbsolutePath().normalize();
        Path controls=Files.createTempDirectory(Path.of("target"),"i17b-clock-").toAbsolutePath();
        Path output=Path.of("target","i17b-"+scenario+".json");
        var pb=new ProcessBuilder(root.resolve(".tools/node-v12.22.12-win-x64/node.exe").toString(),
            root.resolve("scripts/cli-quick-ffa-test.cjs").toString());
        pb.environment().put("BM_URL","http://127.0.0.1:"+port+"/api");
        pb.environment().put("BM_ACCOUNTS",mapper.writeValueAsString(accounts));
        pb.environment().put("BM_SCENARIO",scenario); pb.environment().put("BM_CONTROLS",controls.toString());
        Process process=pb.redirectErrorStream(true).redirectOutput(output.toFile()).start();
        long until=System.nanoTime()+TimeUnit.SECONDS.toNanos(60); int request=0;
        try {
            while(process.isAlive() && System.nanoTime()<until) {
                Path input=controls.resolve(request+".request");
                if(Files.exists(input)) {
                    time.addAndGet(Long.parseLong(Files.readString(input))); games.expireDue();
                    Files.writeString(controls.resolve(request+".response"),Long.toString(time.get())); request++;
                }
                Thread.sleep(10);
            }
            assertFalse(process.isAlive(),"CLI stalled: "+Files.readString(output));
            assertEquals(0,process.exitValue(),Files.readString(output));
            var result=mapper.readTree(Files.readString(output)); assertTrue(result.path("ok").asBoolean());
            var reread=new MatchArchiveService(new MatchEventRepository(jdbc),mapper,versions);
            for(var exported:result.path("exports")) {
                String id=exported.path("gameId").asText();
                var initial=mapper.readTree(exported.path("events").get(0).path("json").asText()).path("data").path("state");
                assertEquals("quickFFA",initial.path("mode").asText());
                assertTrue(initial.path("players").size()>=2 && initial.path("players").size()<=5);
                for(var player:initial.path("players")) {
                    if (!player.path("controller").asText().equals("human")) { continue; }
                    assertEquals(exported,mapper.valueToTree(reread.export(id,player.path("playerId").asText())));
                }
                assertThrows(IllegalArgumentException.class,()->games.getGame(id));
            }
            assertFalse(Files.readString(output).contains("synthetic"));
            Files.copy(output,root.resolve(".build-logs/i17b-"+scenario+"-exports.json"),StandardCopyOption.REPLACE_EXISTING);
        } finally {
            process.destroyForcibly(); reset(players);
            for(String account:accounts) { games.logout(account); }
        }
    }
}
