package com.gsc.bm;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.cards.bruiser.character.BigBadBruiser;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.game.*;
import com.gsc.bm.repo.external.*;
import com.gsc.bm.service.factories.*;
import com.gsc.bm.service.session.*;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Qualifier;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.TimeUnit;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Tag("context")
class MatchArchiveCliTest extends SqliteContextSupport {
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
    @SpyBean GameFactoryService gameFactory;
    @SpyBean MatchEventRepository events;

    @ParameterizedTest @ValueSource(booleans = {false, true})
    void cliQuickOutcomeExportAndPostCommitWriteFailure(boolean fault) throws Exception {
        String user = fault ? "archiveFault" : "archiveSuccess";
        users.createIfAbsent(new UserCredentialsRecord(user,null,encoder.encode("synthetic"),"USER"));
        users.createIfAbsent(new UserCredentialsRecord(user+"Observer",null,encoder.encode("synthetic"),"USER"));
        var humanCharacter = new BigBadBruiser();
        var regular = new ArrayList<com.gsc.bm.model.cards.Card>();
        for (int i=0;i<20;i++) { regular.add(cards.craftCard("com.last.Struggle")); }
        var human = new Player(user,humanCharacter,decks.craftBasicActionStarterCard(humanCharacter),
                decks.craftCharacterBoundStarterCards(humanCharacter),decks.craftLastResortStarterCard(humanCharacter),regular);
        var botCharacter = new BigBadBruiser();
        var bot = new ComPlayer(botCharacter,decks.craftBasicActionStarterCard(botCharacter),
                decks.craftCharacterBoundStarterCards(botCharacter),decks.craftLastResortStarterCard(botCharacter),List.of());
        bot.getCardsInHand().clear(); bot.getCardsInHand().add(cards.craftCard("com.last.Struggle"));
        bot.getResources().put(Resource.HEALTH,10);
        var game = new Game(List.of(human,bot),"quick1vCom",false); String id = game.getGameId();
        doReturn(game).when(gameFactory).craftQuick1vComGame(user);
        if (fault) {
            doThrow(new org.springframework.dao.DataAccessResourceFailureException("synthetic write failure"))
                    .when(events).append(eq(id),argThat(batch -> batch != null && !batch.isEmpty() && batch.get(0).getSequence() > 0));
        }
        Path root=Path.of("..").toAbsolutePath().normalize();
        Path output=Files.createTempFile(Path.of("target"),"cli-match-export-",".out");
        var pb=new ProcessBuilder(root.resolve(".tools/node-v12.22.12-win-x64/node.exe").toString(),root.resolve("scripts/cli-match-export-test.cjs").toString());
        pb.environment().put("BM_URL","http://127.0.0.1:"+port+"/api"); pb.environment().put("BM_USER",user); pb.environment().put("BM_PASSWORD","synthetic");
        pb.environment().put("BM_GAME",id); pb.environment().put("BM_FAULT",Boolean.toString(fault));
        pb.environment().put("BM_OBSERVER",user+"Observer");
        pb.environment().put("BM_MOVE",mapper.writeValueAsString(new Move(cards.craftCard("com.last.Struggle").getName(),user,bot.getPlayerId(),id,null)));
        Process process=pb.redirectErrorStream(true).redirectOutput(output.toFile()).start();
        try {
            assertTrue(process.waitFor(25,TimeUnit.SECONDS),"CLI did not close");
            assertEquals(0,process.exitValue(),Files.readString(output));
            var result=mapper.readTree(Files.readString(output).trim()); assertTrue(result.path("ok").asBoolean());
            assertEquals(1,game.getTurn()); assertEquals(85,human.getResources().get(Resource.HEALTH)); assertEquals(-5,bot.getResources().get(Resource.HEALTH));
            assertEquals(fault ? 1 : 7,events.read(id).size());
            assertFalse(Files.readString(output).contains("synthetic"));
            assertFalse(Files.readString(output).contains("password")); assertFalse(Files.readString(output).contains("saltedHash"));
            // Read persisted data with fresh repository/service objects, no live-game lookup or restore.
            var reread=new MatchArchiveService(new MatchEventRepository(jdbc),mapper,versions);
            if (!fault) {
                assertEquals(result.path("exported"),mapper.valueToTree(reread.export(id,user)));
                assertThrows(org.springframework.security.access.AccessDeniedException.class,()->reread.export(id,"stranger"));
            } else {
                assertThrows(org.springframework.security.access.AccessDeniedException.class,()->reread.export(id,user));
                assertFalse(result.path("exported").path("recording").path("complete").asBoolean());
            }
        } finally {
            process.destroyForcibly(); reset(gameFactory); reset(events);
            try { games.leaveGame(id,user); } catch(IllegalArgumentException ignored) { /* CLI already left */ }
        }
    }
}
