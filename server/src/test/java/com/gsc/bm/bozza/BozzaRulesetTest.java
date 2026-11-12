package com.gsc.bm.bozza;

import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.service.factories.GameFactoryServiceImpl;
import com.gsc.bm.service.factories.PlayerFactoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.support.StaticListableBeanFactory;
import org.springframework.mock.env.MockEnvironment;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/** SB-16c: the playground rules of D50 are on only with the profile bozza (default d50, or 1.13 on request), never in live matches. */
class BozzaRulesetTest {

    private static MockEnvironment development() {
        MockEnvironment env = new MockEnvironment();
        env.setActiveProfiles("local", "bozza");
        return env;
    }

    private static Player player(String id) {
        var basic = new com.gsc.bm.model.cards.bruiser.SuperImpact();
        var last = new com.gsc.bm.model.cards.bruiser.YouStop();
        basic.setGuiName("basic");
        last.setGuiName("last");
        return new Player(id, new com.gsc.bm.model.Character(50, 10, 3) { }, basic, List.of(), last, List.of());
    }

    @Test
    void theProfileBozzaPlaysD50UnlessToldOtherwise() throws Exception {
        BozzaDraft bozza = new BozzaDraft(development(), BozzaDraftTest.DRAFT, "", "pool", "risorse");
        assertEquals(Ruleset.D50, bozza.ruleset());
        assertEquals("d50", bozza.describe().get("rules"));
        BozzaDraft live = new BozzaDraft(development(), BozzaDraftTest.DRAFT, "", "pool", "risorse", "1.13");
        assertEquals(Ruleset.LIVE, live.ruleset());
        assertEquals("1.13", live.describe().get("rules"));
        IllegalStateException error = assertThrows(IllegalStateException.class,
                () -> new BozzaDraft(development(), BozzaDraftTest.DRAFT, "", "pool", "risorse", "1.14"));
        assertTrue(error.getMessage().startsWith("app.bozza.regole"), error.getMessage());
    }

    @Test
    void gamesFollowTheProfileAndLiveGamesStayLive() throws Exception {
        BozzaDraft bozza = new BozzaDraft(development(), BozzaDraftTest.DRAFT, "", "pool", "risorse");
        StaticListableBeanFactory withBozza = new StaticListableBeanFactory();
        withBozza.addBean("bozza", bozza);
        PlayerFactoryService players = new PlayerFactoryService() {
            @Override public Player craftRandomComPlayer() { return player("com"); }
            @Override public Player craftRandomPlayer(String playerId) { return player(playerId); }
            @Override public Player craftOpenPlayer(String username, String deckId) { return player(username); }
        };
        Game draft = new GameFactoryServiceImpl(development(), players, withBozza.getBeanProvider(BozzaDraft.class))
                .craftQuick1vComGame("umano");
        assertEquals(Ruleset.D50, draft.getRuleset());
        for (Player p : draft.getPlayers().values()) assertEquals(Ruleset.D50, p.getCharacter().ruleset());

        Game live = new GameFactoryServiceImpl(new MockEnvironment(), players,
                new StaticListableBeanFactory().getBeanProvider(BozzaDraft.class)).craftQuick1vComGame("umano");
        assertEquals(Ruleset.LIVE, live.getRuleset());
        for (Player p : live.getPlayers().values()) assertEquals(Ruleset.LIVE, p.getCharacter().ruleset());
    }

    @Test
    void rulesAreChosenBeforeTheFirstTurn() {
        Game game = new Game(List.of(), "vuota", false);
        game.useRuleset(Ruleset.D50);
        assertEquals(Ruleset.D50, game.getRuleset());
        assertEquals(Ruleset.LIVE, Ruleset.parse(null));
        assertEquals(Ruleset.LIVE, Ruleset.parse(" 1.13 "));
        assertEquals(Ruleset.D50, Ruleset.parse("D50"));
        assertThrows(IllegalArgumentException.class, () -> Ruleset.parse("p1"));
    }
}
