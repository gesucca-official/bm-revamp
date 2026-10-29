package com.gsc.bm;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.bruiser.character.BigBadBruiser;
import com.gsc.bm.model.cards.junkie.character.ToxicJunkie;
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
class OpenCompleteCliTest extends SqliteContextSupport {
    @LocalServerPort int port;
    @Autowired UserCredentialsRepository users;
    @Autowired PasswordEncoder encoder;
    @Autowired CardFactoryService cards;
    @Autowired DeckFactoryService decks;
    @Autowired GameSessionService games;
    @Autowired MatchVersions versions;
    @Autowired ObjectMapper mapper;
    @Autowired @Qualifier("applicationJdbc") JdbcTemplate jdbc;
    @SpyBean PlayerFactoryService factory;
    @SpyBean UserDecksRepository savedDecks;

    @org.junit.jupiter.api.Test
    void savedDecksCompleteThroughRealOpenFactory() throws Exception {
        String user = "i16Human";
        for (String name : List.of(user,"i16Other"))
            users.createIfAbsent(new UserCredentialsRecord(name,null,encoder.encode("synthetic"),"USER"));
        // Only the opponent is fixed. Saved human decks, factories, shuffle and dealing stay real.
        doAnswer(call -> {
            Character bc = new BigBadBruiser();
            ComPlayer bot = new ComPlayer(bc,decks.craftBasicActionStarterCard(bc),
                    decks.craftCharacterBoundStarterCards(bc),decks.craftLastResortStarterCard(bc),List.of());
            bot.getCardsInHand().removeIf(Card::isLastResort);
            return bot;
        }).when(factory).craftRandomComPlayer();
        Path root=Path.of("..").toAbsolutePath().normalize();
        Path output=Files.createTempFile(Path.of("target"),"i16-cli-",".json");
        ProcessBuilder pb=new ProcessBuilder(root.resolve(".tools/node-v12.22.12-win-x64/node.exe").toString(),root.resolve("scripts/cli-open-complete-test.cjs").toString());
        pb.environment().put("BM_URL","http://127.0.0.1:"+port+"/api");
        pb.environment().put("BM_RULES_VERSION",versions.get().get("rulesVersion").toString());
        pb.environment().put("BM_USER",user); pb.environment().put("BM_PASSWORD","synthetic");
        Process process=pb.redirectErrorStream(true).redirectOutput(output.toFile()).start();
        try {
            assertTrue(process.waitFor(60,TimeUnit.SECONDS),"CLI stalled; runner deadline is not a game rule");
            assertEquals(0,process.exitValue(),Files.readString(output));
            var result=mapper.readTree(Files.readString(output));
            assertTrue(result.path("ok").asBoolean());
            var reread=new MatchArchiveService(new MatchEventRepository(jdbc),mapper,versions);
            for (var exported : result.path("exports")) {
                String id=exported.path("gameId").asText();
                assertEquals(exported,mapper.valueToTree(reread.export(id,user)));
                assertThrows(IllegalArgumentException.class,()->games.getGame(id));
            }
            verify(savedDecks,times(1)).findById(new UserDeckRecordKey(user,"i16-bruiser"));
            verify(savedDecks,times(1)).findById(new UserDeckRecordKey(user,"i16-junkie"));
            verify(factory,times(2)).craftRandomComPlayer();
            verify(factory).craftOpenPlayer(user,"i16-bruiser");
            verify(factory).craftOpenPlayer(user,"i16-junkie");
            assertFalse(Files.readString(output).contains("synthetic"));
            Files.copy(output,root.resolve(".build-logs/i16-exports.json"),StandardCopyOption.REPLACE_EXISTING);
        } finally { process.destroyForcibly(); reset(factory); }
    }
}
