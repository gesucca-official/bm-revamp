package com.gsc.bm;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.cards.Card;
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
class QuickCompleteCliTest extends SqliteContextSupport {
    @LocalServerPort int port;
    @Autowired UserCredentialsRepository users;
    @Autowired PasswordEncoder encoder;
    @Autowired CardFactoryService cards;
    @Autowired DeckFactoryService decks;
    @Autowired GameSessionService games;
    @Autowired MatchVersions versions;
    @Autowired ObjectMapper mapper;
    @Autowired @Qualifier("applicationJdbc") JdbcTemplate jdbc;
    @SpyBean GameFactoryService factory;

    private Game fixture(String user, boolean junkie, boolean draw) {
        Character ch = junkie ? LiveFixtures.character("junkie.character.ToxicJunkie") : LiveFixtures.character("bruiser.character.BigBadBruiser");
        List<Card> regular = new ArrayList<>();
        // Homogeneous deck: shuffle remains real but cannot change the fixture.
        for (int i=0; i<(draw ? 0 : 20); i++) regular.add(cards.craftCard("base.com.ShuffleFeet"));
        // SB-28: the Junkie starter of the Set Base 1.0 has its own last resort; the fixture keeps the generic Struggle («Addosso!!!»).
        Player human = new Player(user,ch,decks.craftBasicActionStarterCard(ch),
                decks.craftCharacterBoundStarterCards(ch),cards.craftCard("com.last.Struggle"),regular);
        Character bc = LiveFixtures.character("bruiser.character.BigBadBruiser");
        ComPlayer bot = new ComPlayer(bc,decks.craftBasicActionStarterCard(bc),
                decks.craftCharacterBoundStarterCards(bc),decks.craftLastResortStarterCard(bc),List.of());
        // No items/discard => basic/bound invalid. Draw retains the only valid action.
        if (!draw) bot.getCardsInHand().removeIf(Card::isLastResort);
        // SB-28, D184 (1): both play «Addosso!!!» every turn in the draw; they fall in the same round only with the same HEALTH, which the
        // characters of the live set (70 and 65) no longer have by themselves: the bot gets the HEALTH of the human.
        else bot.getResources().put(com.gsc.bm.model.Resource.HEALTH, human.getResources().get(com.gsc.bm.model.Resource.HEALTH));
        return LiveFixtures.live(new Game(List.of(human,bot),"quick1vCom",false));
    }

    @ParameterizedTest @ValueSource(booleans={false,true})
    void completeQuickGamesAndSecondMatchInSameCliSession(boolean junkie) throws Exception {
        String user = junkie ? "i13Junkie" : "i13Bruiser";
        users.createIfAbsent(new UserCredentialsRecord(user,null,encoder.encode("synthetic"),"USER"));
        Game win=fixture(user,junkie,false), draw=fixture(user,junkie,true);
        doReturn(win,draw).when(factory).craftQuick1vComGame(user);
        Path root=Path.of("..").toAbsolutePath().normalize();
        Path output=Files.createTempFile(Path.of("target"),"i13-cli-",".json");
        ProcessBuilder pb=new ProcessBuilder(root.resolve(".tools/node-v12.22.12-win-x64/node.exe").toString(),root.resolve("scripts/cli-quick-complete-test.cjs").toString());
        pb.environment().put("BM_URL","http://127.0.0.1:"+port+"/api");
        pb.environment().put("BM_RULES_VERSION",versions.get().get("rulesVersion").toString());
        pb.environment().put("BM_SETS",mapper.writeValueAsString(versions.get().get("sets")));
        pb.environment().put("BM_USER",user); pb.environment().put("BM_PASSWORD","synthetic");
        pb.environment().put("BM_IDS",mapper.writeValueAsString(List.of(win.getGameId(),draw.getGameId())));
        Process process=pb.redirectErrorStream(true).redirectOutput(output.toFile()).start();
        try {
            assertTrue(process.waitFor(60,TimeUnit.SECONDS),"CLI stalled; runner deadline is not a game rule");
            assertEquals(0,process.exitValue(),Files.readString(output));
            var result=mapper.readTree(Files.readString(output));
            assertTrue(result.path("ok").asBoolean());
            // SB-28, D184 (1): «Addosso!!!» of the Set Base 1.0 (5 to the author and 10 to the target, Rincara 5 with 2 to the author):
            // the win is 20 turns of «Scatto Repentino» and 4 of «Addosso!!!» (10+15+20+25 = 70 HEALTH of the bot; before: 30 turns with 5/10 at 100);
            // the draw falls in the round where both HEALTH (70, or 65 of Celestina) go to 0: 15k+3.5k(k-1) per player is 66 at k=3, 102 at k=4
            // (before: 7 turns at 100 HEALTH with 15 a turn).
            assertEquals(24,win.getTurn()); assertEquals(junkie ? 3 : 4,draw.getTurn());
            var reread=new MatchArchiveService(new MatchEventRepository(jdbc),mapper,versions);
            for (int i=0;i<2;i++) {
                Game game=i==0 ? win : draw;
                assertTrue(game.isOver());
                assertEquals(result.path("exports").get(i),mapper.valueToTree(reread.export(game.getGameId(),user)));
                assertThrows(IllegalArgumentException.class,()->games.getGame(game.getGameId()));
            }
            verify(factory,times(2)).craftQuick1vComGame(user);
            assertFalse(Files.readString(output).contains("synthetic"));
            Files.copy(output,root.resolve(".build-logs/i13-"+user+"-exports.json"),StandardCopyOption.REPLACE_EXISTING);
        } finally {
            process.destroyForcibly(); reset(factory);
            for(Game game:List.of(win,draw)) {
                try { games.leaveGame(game.getGameId(),user); } catch(IllegalArgumentException ignored) { }
            }
        }
    }
}
