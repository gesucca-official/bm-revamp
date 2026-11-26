package com.gsc.bm.service.factories;

import com.gsc.bm.bozza.BozzaDraft;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.bot.*;
import com.gsc.bm.service.catalog.LiveSet;
import com.gsc.bm.service.session.model.QueuedPlayer;
import com.gsc.bm.model.cards.base.SetBaseIds;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.support.StaticListableBeanFactory;
import org.springframework.mock.env.MockEnvironment;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * SB-30a B2 (R01 and R03 2.2, D203): the level of the live computer, the per-player factory of its policy and the three ways a
 * computer enters a live game (quick 1vCom and open 1vCom at the level asked for, FFA at Normale).
 */
class ComLevelFactoryTest {

    static LiveSet live;

    @BeforeAll static void load() throws Exception { live = new LiveSet(); }

    @Test void aMissingLevelIsFacileAnOfferedOneIsItselfAnyOtherIsRefused() {
        assertEquals(ComLevel.FACILE, ComLevel.parse(null));
        assertEquals(ComLevel.FACILE, ComLevel.parse(""));
        assertEquals(ComLevel.FACILE, ComLevel.parse("  "));
        assertEquals(ComLevel.FACILE, ComLevel.parse("FACILE"));
        assertEquals(ComLevel.NORMALE, ComLevel.parse("NORMALE"));
        for (String bad : List.of("DIFFICILE", "MAESTRO", "facile", "Normale", " NORMALE", "NORMALE ", "esperto")) {
            ComLevel.UnknownLevelException refused = assertThrows(ComLevel.UnknownLevelException.class, () -> ComLevel.parse(bad), bad);
            assertTrue(refused.getMessage().contains(bad) && refused.getMessage().contains("FACILE, NORMALE"), refused.getMessage());
        }
        assertEquals(List.of(ComLevel.FACILE, ComLevel.NORMALE),
                Arrays.stream(ComLevel.values()).filter(ComLevel::offered).collect(java.util.stream.Collectors.toList()));
    }

    @Test void theStyleOfEveryStarterIsTheOneOfItsSheetInTheSetFile() {
        ComPolicies policies = LiveNoHiddenInformationTest.players(1).policies();
        Map<String, String> seen = new TreeMap<>();
        for (String deck : live.starters()) {
            String character = live.set().characterOf(deck);
            assertEquals(live.set().characterBotStyle(character), policies.styleOf(character), character);
            seen.put(character, policies.styleOf(character));
        }
        // D203 (4), Set Base 1.0.2: Spazienzio and Piera aggressivo, Mara prudente, Celestina and Beppe risorse.
        assertEquals(Map.of(SetBaseIds.SPAZIENZIO, "aggressivo", SetBaseIds.PIERA, "aggressivo",
                SetBaseIds.MARA, "prudente", SetBaseIds.CELESTINA, "risorse", SetBaseIds.BEPPE, "risorse"), seen);
    }

    @Test void facileIsRandomNormaleIsTheMeasuredChainAndEveryPlayerHasItsOwnInstance() {
        ComPolicies policies = LiveNoHiddenInformationTest.players(2).policies();
        Map<String, String> names = Map.of("aggressivo", "AggressivePolicy", "prudente", "PrudentPolicy", "risorse", "ResourceAwarePolicy");
        for (String deck : live.starters()) {
            String character = live.set().characterOf(deck);
            BotPolicy facile = policies.policyFor(ComLevel.FACILE, character);
            assertEquals(RandomPolicy.class, facile.getClass(), character);
            assertNotSame(facile, policies.policyFor(ComLevel.FACILE, character));
            BotPolicy normale = policies.policyFor(ComLevel.NORMALE, character);
            assertEquals(LethalAwarePolicy.class, normale.getClass(), character);
            assertNotSame(normale, policies.policyFor(ComLevel.NORMALE, character));
            // The chain of BozzaDraft.newPolicy() and of the Set Base measures (D74, D76, D77).
            assertEquals("LethalAwarePolicy(SoughtHitPolicy(ALWAYS," + names.get(policies.styleOf(character)) + "))",
                    ((LethalAwarePolicy) normale).archiveName(), character);
            for (ComLevel reserved : List.of(ComLevel.DIFFICILE, ComLevel.MAESTRO))
                assertThrows(IllegalArgumentException.class, () -> policies.policyFor(reserved, character), reserved.name());
        }
    }

    @Test void aStarterWithoutStyleOrWithAnUnknownOneStopsTheStart() {
        Map<String, String> missing = new HashMap<>();
        missing.put(SetBaseIds.MARA, null);
        assertThrows(IllegalStateException.class, () -> new ComPolicies(missing));
        assertThrows(IllegalStateException.class, () -> new ComPolicies(Map.of(SetBaseIds.MARA, "furbo")));
        assertThrows(IllegalArgumentException.class,
                () -> new ComPolicies(Map.of(SetBaseIds.MARA, "prudente")).styleOf(SetBaseIds.PIERA));
    }

    @Test void theLoaderRefusesAStyleOutsideTheVocabulary(@org.junit.jupiter.api.io.TempDir Path dir) throws Exception {
        String set;
        try (var in = LiveSet.class.getResourceAsStream("/sets/base.json")) { set = new String(in.readAllBytes(), StandardCharsets.UTF_8); }
        assertTrue(set.contains("\"botStyle\": \"prudente\""));
        Path bad = dir.resolve("base.json");
        Files.writeString(bad, set.replace("\"botStyle\": \"prudente\"", "\"botStyle\": \"furbo\""));
        Exception refused = assertThrows(Exception.class, () -> new LiveSet(bad.toString()));
        assertTrue(refused.getMessage().contains("botStyle sconosciuto: furbo"), refused.getMessage());
    }

    @Test void theLiveFactoryCreatesABotPlayerAtTheLevelWithAComPlayerId() {
        PlayerFactoryServiceImpl players = LiveNoHiddenInformationTest.players(3);
        for (int i = 0; i < 40; i++) {
            for (ComLevel level : List.of(ComLevel.FACILE, ComLevel.NORMALE)) {
                Player p = players.craftComPlayer(null, level);
                assertEquals(BotPlayer.class, p.getClass());
                BotPlayer bot = (BotPlayer) p;
                assertTrue(bot.getPlayerId().matches("ComPlayer_\\d{1,4}"), bot.getPlayerId()); // client-web/src/session.ts
                assertEquals(level, bot.level());
                String style = players.policies().styleOf(bot.getCharacter().getBindingName());
                assertEquals(level == ComLevel.FACILE ? "RandomPolicy"
                        : "LethalAwarePolicy(SoughtHitPolicy(ALWAYS," + ComPolicies.STYLES.get(style).get().getClass().getSimpleName() + "))",
                        bot.policyName());
            }
        }
        for (ComLevel reserved : List.of(ComLevel.DIFFICILE, ComLevel.MAESTRO))
            assertThrows(ComLevel.UnknownLevelException.class, () -> players.craftComPlayer(null, reserved));
    }

    @Test void theSameSeedGivesTheSameComputers() {
        PlayerFactoryServiceImpl a = LiveNoHiddenInformationTest.players(4), b = LiveNoHiddenInformationTest.players(4);
        for (int i = 0; i < 10; i++) {
            BotPlayer x = (BotPlayer) a.craftComPlayer(null, ComLevel.NORMALE), y = (BotPlayer) b.craftComPlayer(null, ComLevel.NORMALE);
            assertEquals(x.getPlayerId(), y.getPlayerId());
            assertEquals(x.getInitialDeckDrawOrder(), y.getInitialDeckDrawOrder());
            assertEquals(x.random().nextLong(), y.random().nextLong());
        }
    }

    @Test void quickAndOpenGiveTheComputerTheLevelAskedForAndTheFfaNormale() {
        PlayerFactoryServiceImpl real = LiveNoHiddenInformationTest.players(5);
        GameFactoryServiceImpl games = LiveNoHiddenInformationTest.games(real);
        for (ComLevel level : List.of(ComLevel.FACILE, ComLevel.NORMALE)) {
            Game game = games.craftQuick1vComGame("umano", null, level);
            assertEquals(List.of(level), computers(game).stream().map(BotPlayer::level).collect(java.util.stream.Collectors.toList()));
        }
        Game ffa = games.craftQuickMultiPlayerGame(List.of(new QueuedPlayer("umano", true), new QueuedPlayer("QueuedComPlayer", false),
                new QueuedPlayer("QueuedComPlayer", false), new QueuedPlayer("QueuedComPlayer", false)), "quickFFA");
        assertFalse(computers(ffa).isEmpty());
        for (BotPlayer bot : computers(ffa)) assertEquals(ComLevel.NORMALE, bot.level(), bot.getPlayerId());

        // The open asks the factory for any starter at the level; the human deck comes from the account (stubbed here).
        PlayerFactoryService stub = mock(PlayerFactoryService.class);
        when(stub.craftOpenPlayer("umano", "mazzo")).thenAnswer(i -> real.craftRandomPlayer("umano", null));
        when(stub.craftComPlayer(any(), any())).thenAnswer(i -> real.craftComPlayer(i.getArgument(0), i.getArgument(1)));
        GameFactoryServiceImpl open = new GameFactoryServiceImpl(new MockEnvironment(), stub,
                new StaticListableBeanFactory().getBeanProvider(BozzaDraft.class));
        for (ComLevel level : List.of(ComLevel.FACILE, ComLevel.NORMALE)) {
            assertEquals(level, computers(open.craftOpen1vComGame("umano", "mazzo", level)).get(0).level());
            verify(stub).craftComPlayer(null, level);
        }
    }

    static List<BotPlayer> computers(Game game) {
        List<BotPlayer> out = new ArrayList<>();
        for (Player p : game.getPlayers().values()) if (p instanceof BotPlayer) out.add((BotPlayer) p);
        return out;
    }
}
