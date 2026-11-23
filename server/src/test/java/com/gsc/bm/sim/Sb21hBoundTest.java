package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.LoadableCard;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * SB-21h (D159 (1c), D160 (1)): the two variant bounds that the data ops do not express, on the cards of the measured candidate
 * ({@link Sb21h#CANDIDATE}; {@code bozza.json} went back to SB-21g at the STOP of D160 (4)).
 * «Ne riparliamo fuori» (CES-BO1) voids the target's later move only if its card contains «Annuncia»; «Mi rialzo dal marciapiede»
 * (ROC-BO2) heals only with 1 to 30 HEALTH at resolution. Both discard one card at resolution (R02) and print what the bots read.
 */
class Sb21hBoundTest {
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final String COUNTER = "base.cesira.bound.NeRiparliamoFuori", RISE = "base.rocco.bound.MiRialzo";
    private static Draft draft;

    @BeforeAll
    static void load() throws Exception { draft = BozzeStoriche.fromClasspath(Sb21h.CANDIDATE); }

    private static Card card(String name, String json) {
        try {
            LoadableCard card = DataCards.instantiate(DataCards.definition(JSON.readTree(json.replace('\'', '"'))));
            card.setGuiName(name);
            card.setGuiRole("DAMAGE", "—");
            card.setGuiDamage("—");
            card.setGuiDamageAmount("—");
            return card;
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    private static Card filler() {
        return card("Riempitivo", "{'binding':'t.Riempitivo','kind':'ACTION','targets':['SELF'],'self':[{'op':'gain','resource':'VIOLENCE','amount':1}]}");
    }

    private static Card punch() {
        return card("Pugno", "{'binding':'t.Pugno','kind':'ACTION','priority':0,'targets':['OPPONENT'],'target':[{'op':'damage','type':'HIT','amount':30}]}");
    }

    /** A late card that announces: 5 V and a search («Annuncia»), with a hit so its voiding is visible. */
    private static Card announce() {
        return card("Annuncio", "{'binding':'t.Annuncio','kind':'ACTION','priority':0,'targets':['OPPONENT'],"
                + "'self':[{'op':'gain','resource':'VIOLENCE','amount':5},{'op':'search','card':'t.Pugno','vulnerability':{'factor':1.5,'turnsIfNotFound':2}}],"
                + "'target':[{'op':'damage','type':'HIT','amount':30}]}");
    }

    private static Player player(String id, List<Card> hand) {
        Map<Resource, Integer> resources = new EnumMap<>(Resource.class);
        resources.put(Resource.HEALTH, 500);
        resources.put(Resource.ALERTNESS, 60);
        Character character = new Draft.DraftCharacter(id, resources, 3, Set.of());
        Player p = new Player(id, character, filler(), List.of(), filler(), List.of(), new Random(1));
        p.getCardsInHand().clear();
        p.getCardsInHand().addAll(hand);
        p.getCardsInHand().add(filler());
        p.getCardsInHand().add(filler());
        List<Card> deck = new ArrayList<>();
        for (int i = 0; i < 10; i++) deck.add(filler());
        Collections.reverse(deck);
        p.getDeck().addAll(deck);
        return p;
    }

    private static Game game(Player... players) {
        Game game = new Game(List.of(players), "sb-21h", false);
        game.useRuleset(Ruleset.D50);
        return game;
    }

    private static int health(Game game, String id) { return game.getPlayers().get(id).getCharacter().getResources().get(Resource.HEALTH); }

    private static Move bound(Game game, String card, String target) {
        Map<Move.AdditionalAction, String> discard = new EnumMap<>(Move.AdditionalAction.class);
        discard.put(Move.AdditionalAction.DISCARD_ONE, "Riempitivo");
        return new Move(card, "s", target, game.getGameId(), discard);
    }

    private static Move plain(Game game, String player, String card, String target) {
        return new Move(card, player, target, game.getGameId(), new EnumMap<>(Move.AdditionalAction.class));
    }

    private static void turn(Game game, Move... moves) {
        for (Move m : moves) game.submitMove(m);
        game.resolveMoves(g -> { }, (t, events) -> { });
    }

    private static boolean voided(Game game, String id) {
        return game.getResolvedMoves().stream().anyMatch(m -> m.getPlayerId().equals(id) && m.isVoid());
    }

    // ---- Ne riparliamo fuori (CES-BO1) ----

    @Test
    void neRiparliamoFuoriVoidsALaterCardThatAnnounces() {
        Card counter = draft.card(COUNTER);
        assertEquals(2, counter.getPriority(), "D160 (1): priority 2, ahead of the priority-0 announce");
        Game game = game(player("s", List.of(counter)), player("b", List.of(announce())));
        turn(game, bound(game, counter.getName(), "b"), plain(game, "b", "Annuncio", "s"));
        assertTrue(voided(game, "b"));
        assertEquals(500, health(game, "s"), "the announce and its 30 HIT never resolve");
        assertTrue(game.getPlayers().get("s").getCardsInHand().stream().anyMatch(c -> c.getName().equals(counter.getName())), "R02: the bound stays");
    }

    @Test
    void neRiparliamoFuoriLetsACardWithoutAnnounceResolve() {
        Card counter = draft.card(COUNTER);
        Game game = game(player("s", List.of(counter)), player("b", List.of(punch())));
        turn(game, bound(game, counter.getName(), "b"), plain(game, "b", "Pugno", "s"));
        assertFalse(voided(game, "b"));
        assertEquals(470, health(game, "s"), "30 HIT in full: nothing happens");
    }

    @Test
    void neRiparliamoFuoriPrintsAConditionalCounter() {
        List<PrintedEffects.Step> steps = ((PrintedEffects.Source) draft.card(COUNTER)).printedEffects().getSteps();
        assertEquals(1, steps.size());
        assertEquals(PrintedEffects.Kind.COUNTER_TARGET, steps.get(0).getKind());
        assertTrue(steps.get(0).isIfSearch(), "the bots read the condition, not the name");
        assertTrue(PrintedEffects.searches(announce()));
        assertFalse(PrintedEffects.searches(punch()));
    }

    // ---- Mi rialzo dal marciapiede (ROC-BO2) ----

    private static int rise(int health) {
        Card rise = draft.card(RISE);
        Game game = game(player("s", List.of(rise)), player("b", List.of()));
        game.getPlayers().get("s").getCharacter().getResources().put(Resource.HEALTH, health);
        turn(game, bound(game, rise.getName(), "SELF"), plain(game, "b", "Riempitivo", "SELF"));
        return health(game, "s") - health;
    }

    @Test
    void miRialzoHealsFourOnlyFromOneToThirtyHealth() {
        assertEquals(4, rise(1));
        assertEquals(4, rise(30));
        assertEquals(0, rise(31), "above 30: nothing to recover");
        assertEquals(0, rise(200));
    }

    @Test
    void miRialzoPrintsAConditionalHeal() {
        List<PrintedEffects.Step> steps = ((PrintedEffects.Source) draft.card(RISE)).printedEffects().getSteps();
        assertEquals(1, steps.size());
        PrintedEffects.Step heal = steps.get(0);
        assertEquals(PrintedEffects.Kind.GAIN, heal.getKind());
        assertEquals(Resource.HEALTH, heal.getResource());
        assertEquals(4, heal.getBase());
        assertTrue(heal.healthAllows(1) && heal.healthAllows(30));
        assertFalse(heal.healthAllows(0) || heal.healthAllows(31), "the bots read the window from the text");
        assertTrue(PrintedEffects.Step.builder().kind(PrintedEffects.Kind.GAIN).build().healthAllows(500), "older cards: no condition");
    }
}
