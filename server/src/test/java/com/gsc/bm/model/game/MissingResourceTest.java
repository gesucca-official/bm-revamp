package com.gsc.bm.model.game;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.bruiser.ExtremelyViolentBlow;
import com.gsc.bm.model.cards.bruiser.character.BigBadBruiser;
import com.gsc.bm.model.cards.bruiser.character.LittleRage;
import com.gsc.bm.model.cards.bruiser.character.LittleSmack;
import com.gsc.bm.model.cards.com.basic.BruiserGrab;
import com.gsc.bm.model.cards.com.basic.ToxicGrab;
import com.gsc.bm.model.cards.com.last.Struggle;
import com.gsc.bm.model.cards.junkie.BadTrip;
import com.gsc.bm.model.cards.junkie.LethalHeroinDose;
import com.gsc.bm.model.cards.junkie.PervertedMetabolism;
import com.gsc.bm.model.cards.junkie.ToxicBloodDrain;
import com.gsc.bm.model.cards.junkie.character.ToxicJunkie;
import com.gsc.bm.service.session.ConnectionsService;
import com.gsc.bm.service.session.GameLoggingService;
import com.gsc.bm.service.session.GameSessionServiceImpl;
import com.gsc.bm.service.view.ViewExtractorService;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.Random;

import static com.gsc.bm.model.game.GameFixtures.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Regulation 1.11 R01: every character has all five resources, at 0 when its sheet does not state them.
 * Before 1.11 Spazienzio had no TOXICITY: BadTrip, LethalHeroinDose and PervertedMetabolism, reachable with a custom deck in
 * open 1vCom, threw a NullPointerException during resolution and the service rolled the round back (rules-1.11 report).
 */
class MissingResourceTest {
    private Move move(Game g, String who, String card, String target) { return new Move(card, who, target, g.getGameId(), null); }

    private Player spazienzioWith(String id, AbstractCard card) {
        Player p = player(id);
        p.getCardsInHand().add(named(card, card.getClass().getSimpleName()));
        return p;
    }

    /** Cost, then effect, as the round does for one move. */
    private Character playAlone(AbstractCard card) {
        Player a = spazienzioWith("a", card);
        Game g = duel(a, player("b"));
        Move m = move(g, "a", card.getName(), "SELF");
        assertTrue(m.isValidFor(g).isValid());
        m.applyCostTo(g);
        assertDoesNotThrow(() -> m.applyEffectTo(g));
        return a.getCharacter();
    }

    @Test void r01_sheetResourcesNotStatedStartAtZero() {
        assertEquals(Map.of(Resource.HEALTH, 100, Resource.ALERTNESS, 20, Resource.VIOLENCE, 25, Resource.TOXICITY, 0, Resource.ALCOHOL, 0),
                new BigBadBruiser().getResources());
        assertEquals(Map.of(Resource.HEALTH, 100, Resource.ALERTNESS, 35, Resource.VIOLENCE, 0, Resource.TOXICITY, 10, Resource.ALCOHOL, 0),
                new ToxicJunkie().getResources());
    }

    /** The reproduced case: a human Spazienzio plays BadTrip against the computer, as in open 1vCom with a custom deck. */
    @Test void reproduced_spazienzioPlaysBadTripAgainstTheComputer() {
        var logs = mock(GameLoggingService.class);
        var service = new GameSessionServiceImpl(mock(ConnectionsService.class), logs, mock(ViewExtractorService.class));
        Player human = spazienzioWith("human", new BadTrip());
        ComPlayer bot = new ComPlayer("ComPlayer_1", new BigBadBruiser(), named(new BruiserGrab(), "basic"),
                List.of(named(new LittleSmack(), "bound-one"), named(new LittleRage(), "bound-two")),
                named(new Struggle(), "last-resort"), List.of(), new Random(1));
        Game game = new Game(List.of(human, bot), "open1vCom", false);
        service.newGame(game);
        int[] published = {0};
        assertDoesNotThrow(() -> service.submitMoveToGame(move(game, "human", "BadTrip", "SELF"), () -> published[0]++));
        assertEquals(1, game.getTurn());
        assertEquals(1, published[0]);
        verify(logs).committed(eq(game), anyList());
        Character c = game.getPlayers().get("human").getCharacter();
        assertEquals(10, c.getResources().get(Resource.ALERTNESS));
        assertEquals(0, c.getResources().get(Resource.TOXICITY));
        assertEquals(1, c.getTimers().size());
        assertFalse(game.getPlayers().get("human").getCardsInHand().stream().anyMatch(card -> card.getName().equals("BadTrip")));
    }

    @Test void badTrip_spazienzioAddsAbsZeroAndGetsTheTimer() {
        Character c = playAlone(new BadTrip());
        assertEquals(10, c.getResources().get(Resource.ALERTNESS));
        assertEquals(0, c.getResources().get(Resource.TOXICITY));
        assertFalse(c.getImmunities().contains(Resource.TOXICITY));
        // R07: the timer of 3 adds the immunity to the player, even to one who never had it.
        for (int tick = 1; tick <= 3; tick++) {
            c.resolveTimeBasedEffects();
            assertEquals(tick == 3, c.getImmunities().contains(Resource.TOXICITY));
            assertEquals(100, c.getResources().get(Resource.HEALTH));
        }
    }

    @Test void lethalHeroinDose_spazienzioLosesNoHealthAndGainsThirty() {
        Character c = playAlone(new LethalHeroinDose());
        assertEquals(100, c.getResources().get(Resource.HEALTH));
        assertEquals(30, c.getResources().get(Resource.TOXICITY));
    }

    @Test void pervertedMetabolism_spazienzioGainsAndLosesZero() {
        Character c = playAlone(new PervertedMetabolism());
        assertEquals(Map.of(Resource.HEALTH, 100, Resource.ALERTNESS, 20, Resource.VIOLENCE, 25, Resource.TOXICITY, 0, Resource.ALCOHOL, 0),
                c.getResources());
    }

    @Test void r06_resourcesAtZeroHaveNoPeriodicEffect() {
        for (Character c : List.of(new BigBadBruiser(), new ToxicJunkie())) {
            c.getImmunities().clear();
            c.getResources().put(Resource.TOXICITY, 0);
            Map<Resource, Integer> before = Map.copyOf(c.getResources());
            assertEquals(List.of(), c.resolveTimeBasedEffects());
            assertEquals(before, c.getResources());
        }
    }

    /** The readers protected by their own cost stay unplayable at 0: the zero does not open a payment. */
    @Test void costGuardedReadersStayUnplayableAtZero() {
        Player a = spazienzioWith("a", new ToxicBloodDrain());
        Game g = duel(a, player("b"));
        assertEquals("cant be cast with current resources", move(g, "a", "ToxicBloodDrain", "b").isValidFor(g).getComment());
        Player j = new Player("j", new ToxicJunkie(), named(new ToxicGrab(), "basic"), List.of(), named(new Struggle(), "last-resort"), List.of());
        j.getCardsInHand().add(named(new ExtremelyViolentBlow(), "ExtremelyViolentBlow"));
        Game g2 = duel(j, player("x"));
        assertEquals("cant be cast with current resources", move(g2, "j", "ExtremelyViolentBlow", "x").isValidFor(g2).getComment());
    }
}
