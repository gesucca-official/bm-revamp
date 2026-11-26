package com.gsc.bm.sim;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.base.tokens.BrokenBottle;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.status.Status;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static com.gsc.bm.sim.Sb27Table.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * SB-27 Fase A (D177 (3)): the 19 cards with a Java class against their sheet in the candidate Set Base 1.0 document
 * ({@code server/src/test/resources/set-base/catalogo/sets/base.md}). Every card comes from the set file; every expected number is
 * worked out by hand from the sheet text and written as a literal, never read from the card's parameters.
 * <p>
 * Table: «s» (60 A) is faster than «b» (10 A) at equal priority; «c» (90 A), when present, is faster than both. Everyone has 500 H,
 * so nobody is downed unless a case says so. The test cards built here («Pugno», «Carica», …) are tools, not cards of the set.
 * Rules: d50 (playground). The end of turn applies T (POISON T/2), L (−A L/2, −L L/2+1), timers, then «In campo» (regolamento R06,
 * regole del playground RP-27).
 */
class Sb27SpecialCardsTest {
    @BeforeAll
    static void loadDraft() throws Exception { load(); }

    private static final String STRIKE = "Colpo cercato";
    /** Announces the strike: a search with Vulnerable ×1,5 (regole del playground, RP-13–RP-24). */
    private static Card charge() {
        return data("Carica", "{'binding':'t.Carica','kind':'ACTION','priority':2,'targets':['SELF'],'self':[{'op':'gain','resource':'VIOLENCE','amount':5},"
                + "{'op':'search','card':'t." + STRIKE + "','vulnerability':{'factor':1.5,'turnsIfNotFound':2}}]}");
    }

    private static Card strike() { return hit(STRIKE, 1, null, "HIT 30"); }

    /** b charges and finds the strike: Vulnerable to HIT on b, the strike face up in b's hand. */
    private static Game charged(Player... players) {
        Game game = game(players);
        List<Move> moves = new ArrayList<>();
        for (String id : game.getPlayers().keySet()) moves.add(id.equals("b") ? move(game, "b", "Carica", "SELF") : rest(game, id));
        turn(game, moves.toArray(new Move[0]));
        assertFalse(tokens(game, "b").isEmpty(), "the charge found the strike");
        return game;
    }

    private static Player bCharging(Card... more) {
        List<Card> hand = new ArrayList<>(List.of(charge()));
        hand.addAll(List.of(more));
        List<Card> deck = new ArrayList<>(List.of(strike()));
        deck.addAll(fillers(10));
        return player(character("b", 10, 3), hand, deck, null);
    }

    // ---- SPA-AR5 «FAI BASTA» (bruiser.YouStop) ----

    private static final String YOU_STOP = "bruiser.YouStop";

    @Test
    void faiBastaVoidsAMoveStillToResolveWhichKeepsItsCostAndDraw() {
        Player s = s(card(YOU_STOP)), b = b(hit("Pugno", 1, "VIOLENCE 5", "HIT 30"));
        ch2(s).getResources().put(Resource.VIOLENCE, 10);
        ch2(b).getResources().put(Resource.VIOLENCE, 10);
        Game game = game(s, b);
        int hand = b.getCardsInHand().size(), deck = b.getDeckSize();
        assertArrayEquals(new int[]{0, 0}, turn(game, move(game, "s", name(YOU_STOP), "b"), move(game, "b", "Pugno", "s")));
        assertTrue(voided(game, "b"));
        assertEquals(5, res(game, "s", Resource.VIOLENCE), "cost 5 V");
        assertEquals(5, res(game, "b", Resource.VIOLENCE), "the voided move's cost is paid");
        assertEquals(hand, b.getCardsInHand().size(), "its player draws as always");
        assertEquals(deck - 1, b.getDeckSize());
        assertEquals(10, res(game, "b", Resource.ALERTNESS), "nothing else: the sheet gives the opponent no A");
    }

    @Test
    void faiBastaOnAMoveAlreadyResolvedDoesNothing() {
        Player s = s(card(YOU_STOP)), b = player("b", 90, hit("Veloce", 2, null, "HIT 30"));
        ch2(s).getResources().put(Resource.VIOLENCE, 10);
        Game game = game(s, b);
        assertArrayEquals(new int[]{30, 0}, turn(game, move(game, "s", name(YOU_STOP), "b"), move(game, "b", "Veloce", "s")),
                "same priority, more A: b's move resolved first");
        assertFalse(voided(game, "b"));
    }

    @Test
    void faiBastaAtEqualPriorityAndAlertnessFollowsTheOrderOfEntry() {
        for (boolean sFirst : new boolean[]{true, false}) {
            Player s = player("s", 60, card(YOU_STOP)), b = player("b", 60, hit("Pari", 2, null, "HIT 30"));
            ch2(s).getResources().put(Resource.VIOLENCE, 10);
            Game game = sFirst ? game(s, b) : game(b, s);
            turn(game, move(game, "s", name(YOU_STOP), "b"), move(game, "b", "Pari", "s"));
            assertEquals(sFirst, voided(game, "b"), "s entered " + (sFirst ? "first: b's move is later" : "second: b's move resolved before"));
            assertEquals(sFirst ? 500 : 470, health(game, "s"));
        }
    }

    private static Character ch2(Player p) { return p.getCharacter(); }

    // ---- GEN-02 «Furto con Destrezza» (com.Steal) ----

    private static final String STEAL = "com.Steal", SANTINO = "base.items.SantinoDellaPortinaia", ESPRESSO = "base.items.EspressoDelDistributore",
            CASCO = "base.items.CascoDaLavoro", GUANTI = "base.items.GuantiDaOfficina", NEGRONI = "com.items.CocktailOnTheGround",
            CONTO = "base.items.ContoDelTavoloSei";

    @Test
    void furtoTakesTheChosenItem() {
        Game game = game(s(card(STEAL)), b());
        ch(game, "b").getItems().addAll(List.of(card(SANTINO), card(ESPRESSO)));
        turn(game, onItem(game, "s", name(STEAL), "b", name(SANTINO)), rest(game, "b"));
        assertEquals(List.of(name(SANTINO)), items(game, "s"));
        assertEquals(List.of(name(ESPRESSO)), items(game, "b"));
        assertEquals(50, res(game, "s", Resource.ALERTNESS), "cost 10 A");
    }

    @Test
    void furtoOverCapacityLosesTheOwnOldestItem() {
        Game game = game(s(card(STEAL)), b());
        ch(game, "s").getItems().addAll(List.of(card(ESPRESSO), card(CASCO), card(GUANTI)));
        ch(game, "b").getItems().add(card(SANTINO));
        turn(game, onItem(game, "s", name(STEAL), "b", name(SANTINO)), rest(game, "b"));
        assertEquals(List.of(name(CASCO), name(GUANTI), name(SANTINO)), items(game, "s"), "the Espresso, the oldest, is gone");
    }

    @Test
    void furtoOnAnItemNoLongerThereTakesNothing() {
        Player b = player("b", 90, consume());
        Game game = game(s(card(STEAL)), b);
        ch(game, "b").getItems().add(card(SANTINO));
        turn(game, onItem(game, "s", name(STEAL), "b", name(SANTINO)), onItem(game, "b", "Consuma", "b", name(SANTINO)));
        assertEquals(List.of(), items(game, "s"));
        assertEquals(List.of(), items(game, "b"));
        assertTrue(ch(game, "b").getImmunities().contains(Resource.ALCOHOL), "b consumed it first, with its effect");
    }

    @Test
    void furtoMovesTheInCampoEffectToTheThief() {
        Game game = game(s(card(STEAL)), player("b", 30));
        ch(game, "b").getItems().add(card(CONTO));
        turn(game, onItem(game, "s", name(STEAL), "b", name(CONTO)), rest(game, "b"));
        assertEquals(60 - 10 - 4, res(game, "s", Resource.ALERTNESS), "10 A of cost, then the Conto's −4 A at the end of the turn");
        assertEquals(30, res(game, "b", Resource.ALERTNESS));
    }

    // ---- TOS-AR4 «Riflessi Aumentati dalla Speed» (junkie.AmphetamineReflexes) ----

    private static final String REFLEXES = "junkie.AmphetamineReflexes";

    private static Player sReflexes() {
        Player s = s(card(REFLEXES));
        s.getCharacter().getResources().put(Resource.TOXICITY, 10); // 0 after the cost: no POISON at the end of the turn
        return s;
    }

    @Test
    void riflessiVoidsAMoveAgainstYouStillToResolve() {
        Game game = game(sReflexes(), b(hit("Pugno", 1, null, "HIT 30")));
        assertArrayEquals(new int[]{0, 0}, turn(game, move(game, "s", name(REFLEXES), "SELF"), move(game, "b", "Pugno", "s")));
        assertTrue(voided(game, "b"));
        assertEquals(0, res(game, "s", Resource.TOXICITY), "cost 10 T");
    }

    @Test
    void riflessiVoidsAMoveAgainstYourItem() {
        Player b = b(card("bruiser.BreakYourToy"));
        b.getCharacter().getResources().put(Resource.VIOLENCE, 10);
        Game game = game(sReflexes(), b);
        ch(game, "s").getItems().add(card(SANTINO));
        turn(game, move(game, "s", name(REFLEXES), "SELF"), onItem(game, "b", name("bruiser.BreakYourToy"), "s", name(SANTINO)));
        assertTrue(voided(game, "b"));
        assertEquals(List.of(name(SANTINO)), items(game, "s"));
    }

    @Test
    void riflessiLeavesAMoveTheOpponentPlaysOnHimself() {
        Game game = game(sReflexes(), b());
        turn(game, move(game, "s", name(REFLEXES), "SELF"), rest(game, "b"));
        assertFalse(voided(game, "b"));
        assertEquals(1, res(game, "b", Resource.VIOLENCE));
    }

    @Test
    void riflessiLeavesAMoveAlreadyResolved() {
        Game game = game(sReflexes(), player("b", 90, hit("Veloce", 2, null, "HIT 30")));
        assertArrayEquals(new int[]{30, 0}, turn(game, move(game, "s", name(REFLEXES), "SELF"), move(game, "b", "Veloce", "s")));
        assertFalse(voided(game, "b"));
    }

    @Test
    void riflessiVoidsTheMoveOfEveryOpponent() {
        Game game = game(sReflexes(), b(hit("Pugno", 1, null, "HIT 30")), player("c", 5, hit("Calcio", 1, null, "HIT 20")));
        assertArrayEquals(new int[]{0, 0, 0}, turn(game, move(game, "s", name(REFLEXES), "SELF"), move(game, "b", "Pugno", "s"),
                move(game, "c", "Calcio", "s")));
        assertTrue(voided(game, "b"));
        assertTrue(voided(game, "c"));
    }

    // ---- TOS-AR5 «Trascinare nel Tunnel» (junkie.ToxicBloodDrain) ----

    private static final String DRAIN = "junkie.ToxicBloodDrain";

    @Test
    void trascinareGivesTheTAfterTheCostThenPoisons() {
        Player s = s(card(DRAIN));
        s.getCharacter().getResources().put(Resource.TOXICITY, 30);
        Game game = game(s, b());
        int[] lost = turn(game, move(game, "s", name(DRAIN), "b"), rest(game, "b"));
        assertEquals(0, res(game, "s", Resource.TOXICITY), "30 − 10 of cost, then all of it lost");
        assertEquals(20, res(game, "b", Resource.TOXICITY), "b gains the 20 T you lost");
        assertEquals(10 + 10, lost[1], "10 POISON, then at the end of the turn b's 20 T poisons for 10");
        assertEquals(0, lost[0]);
        assertTrue(ch(game, "s").getImmunities().contains(Resource.TOXICITY), "at the end of this turn you are immune to T");
    }

    @Test
    void trascinareRemovesTheTargetsImmunityEvenItsCharacters() {
        Player s = s(card(DRAIN));
        s.getCharacter().getResources().put(Resource.TOXICITY, 30);
        Player b = player(character("b", 10, 3, Resource.TOXICITY), List.of(), fillers(10), null);
        Game game = game(s, b);
        int[] lost = turn(game, move(game, "s", name(DRAIN), "b"), rest(game, "b"));
        assertFalse(ch(game, "b").getImmunities().contains(Resource.TOXICITY));
        assertEquals(20, lost[1], "so its T poisons it at the end of the turn");
        turn(game, rest(game, "s"), rest(game, "b"));
        assertFalse(ch(game, "b").getImmunities().contains(Resource.TOXICITY), "it stays removed");
    }

    @Test
    void trascinareMakesYouImmuneOnlyAfterThisTurnsPoison() {
        Player s = s(card(DRAIN));
        s.getCharacter().getResources().put(Resource.TOXICITY, 30);
        Game game = game(s, b(giveToxicity()));
        int[] lost = turn(game, move(game, "s", name(DRAIN), "b"), move(game, "b", "Regalo", "s"));
        assertEquals(10, res(game, "s", Resource.TOXICITY), "after the card, b's late move gives s 10 T");
        assertEquals(5, lost[0], "this turn's end still poisons s: 10 T / 2");
        assertFalse(ch(game, "s").getImmunities().isEmpty());
        lost = turn(game, rest(game, "s"), rest(game, "b"));
        assertEquals(0, lost[0], "from the next turn s's T no longer poisons");
        assertEquals(10, res(game, "s", Resource.TOXICITY), "the T stays");
    }

    @Test
    void trascinareIsNotImmuneBeforeTheEndOfTheTurn() {
        Player s = s(card(DRAIN));
        s.getCharacter().getResources().put(Resource.TOXICITY, 30);
        Player b = b();
        Game game = game(s, b);
        Card drain = s.getCardsInHand().get(0);
        drain.resolve(game, move(game, "s", drain.getName(), "b"));
        assertFalse(s.getCharacter().getImmunities().contains(Resource.TOXICITY), "not during the resolution");
        assertEquals(500 - 10, b.getCharacter().getResources().get(Resource.HEALTH), "10 POISON");
    }

    // ---- OGG-04 «Mescolone Micidiale» (com.items.MarvelousCocktail) ----

    private static final String MESCOLONE = "com.items.MarvelousCocktail";

    @Test
    void mescoloneBlocksTAndLForFiveTurnsThenStripsEverythingAndPoisons() {
        Player s = player(character("s", 60, 3, Resource.TOXICITY), List.of(consume(), status("Scudo", 0.5, false)), fillers(10), null);
        Game game = game(s, b());
        ch(game, "s").getItems().add(card(MESCOLONE));
        int[] lost = turn(game, onItem(game, "s", "Consuma", "s", name(MESCOLONE)), rest(game, "b"));
        assertTrue(ch(game, "s").getImmunities().containsAll(Set.of(Resource.TOXICITY, Resource.ALCOHOL)));
        assertEquals(20, res(game, "s", Resource.ALCOHOL), "+20 L, not lost at this turn's end");
        assertEquals(20, res(game, "s", Resource.TOXICITY), "+20 T, no POISON at this turn's end");
        assertEquals(60, res(game, "s", Resource.ALERTNESS), "the L takes no A");
        assertEquals(0, lost[0]);
        turn(game, move(game, "s", "Scudo", "SELF"), rest(game, "b"));
        for (int t = 3; t <= 4; t++) {
            assertEquals(0, turn(game, rest(game, "s"), rest(game, "b"))[0], "turn " + t);
            assertEquals(20, res(game, "s", Resource.ALCOHOL));
        }
        assertFalse(ch(game, "s").getStatuses().isEmpty(), "the status is still there after turn 4");
        lost = turn(game, rest(game, "s"), rest(game, "b"));
        assertEquals(20, lost[0], "end of the fifth turn: T and L still blocked, then 20 POISON that no status changes");
        assertTrue(ch(game, "s").getImmunities().isEmpty(), "every immunity, the character's too");
        assertTrue(ch(game, "s").getStatuses().isEmpty(), "every status");
        assertEquals(20, res(game, "s", Resource.ALCOHOL));
        lost = turn(game, rest(game, "s"), rest(game, "b"));
        assertEquals(10, lost[0], "the turn after, the T poisons: 20 / 2");
        assertEquals(20 - 11, res(game, "s", Resource.ALCOHOL), "and the L acts: −(20 / 2 + 1)");
    }

    // ---- LR-PIN «Ultimo Giro» (base.pino.UltimoGiro) ----

    private static final String ULTIMO = "base.pino.UltimoGiro";

    /** Piera with the last resort and an empty deck, so the card comes back to the hand after each play. */
    private static Player piera(int alcohol) {
        Player p = player(character("s", 60, 3), List.of(), List.of(), card(ULTIMO));
        p.getCharacter().getResources().put(Resource.ALCOHOL, alcohol);
        return p;
    }

    @Test
    void ultimoGiroHitsTenPlusTheLSpentAndTwoToYourself() {
        Game game = game(piera(3), b());
        assertArrayEquals(new int[]{2, 13}, turn(game, move(game, "s", name(ULTIMO), "b"), rest(game, "b")),
                "2 HIT to s (armour 3 / 4 = 0); 10 + 3 to b");
        assertEquals(0, res(game, "s", Resource.ALCOHOL), "all the L spent");
    }

    @Test
    void ultimoGiroSelfHitComesBeforeSpendingSoTheAlcoholArmourReducesIt() {
        Game game = game(piera(12), b());
        assertArrayEquals(new int[]{0, 22}, turn(game, move(game, "s", name(ULTIMO), "b"), rest(game, "b")),
                "2 HIT − 12 / 4 = 0 to s; 10 + 12 to b");
    }

    @Test
    void ultimoGiroRincaraCountsVoidedPlaysAndOnlyTheAuthors() {
        Player b = b(card(YOU_STOP));
        b.getCharacter().getResources().put(Resource.VIOLENCE, 5);
        Game game = game(piera(0), b);
        assertArrayEquals(new int[]{0, 0}, turn(game, move(game, "s", name(ULTIMO), "b"), move(game, "b", name(YOU_STOP), "s")));
        assertTrue(voided(game, "s"), "first play, voided by FAI BASTA");
        assertArrayEquals(new int[]{2 + 2, 10 + 4}, turn(game, move(game, "s", name(ULTIMO), "b"), rest(game, "b")),
                "second play: Rincara 4 (2 a te) once, the voided play counts");
        assertArrayEquals(new int[]{2 + 4, 10 + 8}, turn(game, move(game, "s", name(ULTIMO), "b"), rest(game, "b")), "third play: twice");
    }

    @Test
    void ultimoGiroIgnoresTheOpponentsPlays() {
        Player b = player(character("b", 10, 3), List.of(), List.of(), card(ULTIMO));
        Game game = game(piera(0), b);
        turn(game, rest(game, "s"), move(game, "b", name(ULTIMO), "s"));
        assertArrayEquals(new int[]{2, 10}, turn(game, move(game, "s", name(ULTIMO), "b"), rest(game, "b")), "no Rincara from b's play");
    }

    @Test
    void ultimoGiroOnAVulnerableTargetRoundsDown() {
        Game game = charged(piera(3), bCharging()); // the charge turn's end takes 3 / 2 + 1 L: 1 L is left
        assertEquals(1, res(game, "s", Resource.ALCOHOL));
        assertEquals(16, turn(game, move(game, "s", name(ULTIMO), "b"), rest(game, "b"))[1], "(10 + 1) × 1,5 = 16,5, rounded down");
    }

    // ---- PIN-AR2 «Alla Goccia» (base.pino.GoingBerserk) ----

    private static final String GOCCIA = "base.pino.GoingBerserk";

    private static Player sWith(String binding, Resource resource, int amount) {
        Player s = s(card(binding));
        s.getCharacter().getResources().put(resource, amount);
        return s;
    }

    @Test
    void allaGocciaHitsTenPlusTheLSpent() {
        Game game = game(sWith(GOCCIA, Resource.ALCOHOL, 12), b());
        assertArrayEquals(new int[]{0, 22}, turn(game, move(game, "s", name(GOCCIA), "b"), rest(game, "b")), "no self-damage on this card");
        assertEquals(0, res(game, "s", Resource.ALCOHOL));
    }

    @Test
    void allaGocciaWithoutLHitsTen() {
        Game game = game(sWith(GOCCIA, Resource.ALCOHOL, 0), b());
        assertEquals(10, turn(game, move(game, "s", name(GOCCIA), "b"), rest(game, "b"))[1]);
    }

    @Test
    void allaGocciaOnATargetWithLIsReducedByItsArmour() {
        Player b = b();
        b.getCharacter().getResources().put(Resource.ALCOHOL, 8);
        Game game = game(sWith(GOCCIA, Resource.ALCOHOL, 12), b);
        assertEquals(22 - 2, turn(game, move(game, "s", name(GOCCIA), "b"), rest(game, "b"))[1], "a quarter of b's 8 L");
    }

    @Test
    void allaGocciaOnAVulnerableTargetRoundsDown() {
        Game game = charged(sWith(GOCCIA, Resource.ALCOHOL, 3), bCharging()); // 1 L left after the charge turn's end
        assertEquals(1, res(game, "s", Resource.ALCOHOL));
        assertEquals(16, turn(game, move(game, "s", name(GOCCIA), "b"), rest(game, "b"))[1], "(10 + 1) × 1,5 = 16,5");
    }

    // ---- PIN-AR5 «Rutto a Bruciapelo» (base.pino.RuttoADistanzaSociale) ----

    private static final String RUTTO = "base.pino.RuttoADistanzaSociale";

    @Test
    void ruttoReadsTheLAfterTheCostTakesAAndHitsFifteenPlusTwiceIt() {
        Game game = game(sWith(RUTTO, Resource.ALCOHOL, 12), b());
        assertArrayEquals(new int[]{0, 15 + 2 * 7}, turn(game, move(game, "s", name(RUTTO), "b"), rest(game, "b")), "12 − 5 of cost = 7 spent");
        assertEquals(10 - 7, res(game, "b", Resource.ALERTNESS));
        assertEquals(0, res(game, "s", Resource.ALCOHOL));
    }

    @Test
    void ruttoDoesNotTakeABelowZero() {
        Game game = game(sWith(RUTTO, Resource.ALCOHOL, 20), b());
        assertEquals(15 + 2 * 15, turn(game, move(game, "s", name(RUTTO), "b"), rest(game, "b"))[1]);
        assertEquals(0, res(game, "b", Resource.ALERTNESS), "10 A, 15 to lose");
    }

    @Test
    void ruttoWithOnlyTheCostSpendsNothing() {
        Game game = game(sWith(RUTTO, Resource.ALCOHOL, 5), b());
        assertEquals(15, turn(game, move(game, "s", name(RUTTO), "b"), rest(game, "b"))[1]);
        assertEquals(10, res(game, "b", Resource.ALERTNESS));
    }

    @Test
    void ruttoOnATargetWithLIsReducedByItsArmour() {
        Player b = b();
        b.getCharacter().getResources().put(Resource.ALCOHOL, 8);
        Game game = game(sWith(RUTTO, Resource.ALCOHOL, 12), b);
        assertEquals(29 - 2, turn(game, move(game, "s", name(RUTTO), "b"), rest(game, "b"))[1]);
    }

    // ---- OGG-03 «Doppio Malto da Discount» (com.items.AnotherRottenBeer) ----

    private static final String MALTO = "com.items.AnotherRottenBeer";

    @Test
    void doppioMaltoLeavesABottleAndGivesTenL() {
        Player s = player(character("s", 60, 3, Resource.ALCOHOL), List.of(consume()), fillers(10), null); // immune: the L stays to be read
        Game game = game(s, b());
        ch(game, "s").getItems().add(card(MALTO));
        turn(game, onItem(game, "s", "Consuma", "s", name(MALTO)), rest(game, "b"));
        assertEquals(10, res(game, "s", Resource.ALCOHOL));
        assertEquals(1, ch(game, "s").getItems().size());
        assertTrue(ch(game, "s").getItems().peek() instanceof BrokenBottle, "a Bottiglia Spaccata next to you");
    }

    @Test
    void doppioMaltoBottleAtCapacityLosesTheOldest() {
        Player s = player(character("s", 60, 3), List.of(consume()), fillers(10), null);
        Game game = game(s, b());
        ch(game, "s").getItems().addAll(List.of(card(MALTO), card(ESPRESSO), card(CASCO)));
        turn(game, onItem(game, "s", "Consuma", "s", name(MALTO)), rest(game, "b"));
        assertEquals(List.of(name(ESPRESSO), name(CASCO)), items(game, "s").subList(0, 2));
        assertEquals(3, ch(game, "s").getItems().size(), "the bottle takes the consumed beer's place");
    }

    // ---- GIG-AR1 «Disassemblare» (bruiser.BreakYourToy) ----

    private static final String BREAK = "bruiser.BreakYourToy";

    @Test
    void disassemblareDestroysTheChosenItemWithoutEffect() {
        Player s = sWith(BREAK, Resource.VIOLENCE, 10);
        Game game = game(s, b());
        ch(game, "b").getItems().addAll(List.of(card(SANTINO), card(ESPRESSO)));
        turn(game, onItem(game, "s", name(BREAK), "b", name(SANTINO)), rest(game, "b"));
        assertEquals(List.of(name(ESPRESSO)), items(game, "b"));
        assertFalse(ch(game, "b").getImmunities().contains(Resource.ALCOHOL), "without the Santino's effect");
        assertEquals(List.of(), items(game, "s"));
        assertEquals(5, res(game, "s", Resource.VIOLENCE), "cost 5 V");
    }

    @Test
    void disassemblareOnAnItemNoLongerThereDoesNothing() {
        Game game = game(sWith(BREAK, Resource.VIOLENCE, 10), player("b", 90, consume()));
        ch(game, "b").getItems().addAll(List.of(card(SANTINO), card(ESPRESSO)));
        turn(game, onItem(game, "s", name(BREAK), "b", name(SANTINO)), onItem(game, "b", "Consuma", "b", name(SANTINO)));
        assertEquals(List.of(name(ESPRESSO)), items(game, "b"), "the Espresso is not destroyed instead");
        assertTrue(ch(game, "b").getImmunities().contains(Resource.ALCOHOL), "b consumed the Santino first");
    }

    // ---- GIG-AR5 «Lavoro Fatto Bene» (base.gigi.LavoroFattoBene) ----

    private static final String LAVORO = "base.gigi.LavoroFattoBene";

    @Test
    void lavoroHitsFifteenWithoutItems() {
        Game game = game(sWith(LAVORO, Resource.VIOLENCE, 20), b());
        assertEquals(15, turn(game, move(game, "s", name(LAVORO), "b"), rest(game, "b"))[1]);
        assertEquals(10, res(game, "s", Resource.VIOLENCE), "cost 10 V");
    }

    @Test
    void lavoroAddsFourPerItemTokensIncluded() {
        Game game = game(sWith(LAVORO, Resource.VIOLENCE, 20), b());
        ch(game, "s").getItems().addAll(List.of(new BrokenBottle(), card(ESPRESSO)));
        assertEquals(15 + 4 * 2, turn(game, move(game, "s", name(LAVORO), "b"), rest(game, "b"))[1]);
    }

    @Test
    void lavoroDoesNotCountEquipments() {
        Game game = game(sWith(LAVORO, Resource.VIOLENCE, 20), b());
        apply(status("Attrezzo", 1.0, true), ch(game, "s"));
        assertFalse(ch(game, "s").getStatuses().isEmpty());
        assertEquals(15, turn(game, move(game, "s", name(LAVORO), "b"), rest(game, "b"))[1]);
    }

    @Test
    void lavoroCountsTheItemsAtTheStartOfItsResolution() {
        Player b = player("b", 90, card(BREAK));
        b.getCharacter().getResources().put(Resource.VIOLENCE, 10);
        Game game = game(sWith(LAVORO, Resource.VIOLENCE, 20), b);
        ch(game, "s").getItems().addAll(List.of(card(SANTINO), card(ESPRESSO)));
        assertEquals(15 + 4, turn(game, move(game, "s", name(LAVORO), "b"), onItem(game, "b", name(BREAK), "s", name(ESPRESSO)))[1],
                "b destroyed one item before: one is left");
    }

    @Test
    void lavoroOnAVulnerableTargetRoundsDown() {
        Game game = charged(sWith(LAVORO, Resource.VIOLENCE, 20), bCharging());
        assertEquals(22, turn(game, move(game, "s", name(LAVORO), "b"), rest(game, "b"))[1], "15 × 1,5 = 22,5");
    }

    // ---- CES-BO1 «Discutiamone in Privato» (base.cesira.bound.NeRiparliamoFuori) ----

    private static final String PRIVATO = "base.cesira.bound.NeRiparliamoFuori";

    @Test
    void discutiamoneVoidsALaterMoveThatAnnouncesAndStaysInHand() {
        Game game = game(s(card(PRIVATO)), bCharging());
        int hand = game.getPlayers().get("s").getCardsInHand().size();
        assertArrayEquals(new int[]{0, 0}, turn(game, bound(game, "s", name(PRIVATO), "b"), move(game, "b", "Carica", "SELF")));
        assertTrue(voided(game, "b"));
        assertTrue(tokens(game, "b").isEmpty(), "the voided charge announces nothing");
        assertTrue(inHand(game, "s", name(PRIVATO)), "a bound stays in hand (R02)");
        assertEquals(hand, game.getPlayers().get("s").getCardsInHand().size(), "one other card discarded, one drawn: the bound is not discarded");
    }

    @Test
    void discutiamoneLetsAMoveWithoutAnnunciaResolve() {
        Game game = game(s(card(PRIVATO)), b(hit("Pugno", 1, null, "HIT 30")));
        assertArrayEquals(new int[]{30, 0}, turn(game, bound(game, "s", name(PRIVATO), "b"), move(game, "b", "Pugno", "s")));
        assertFalse(voided(game, "b"));
    }

    @Test
    void discutiamoneOnAnAnnounceAlreadyResolvedDoesNothing() {
        Player b = player(character("b", 90, 3), List.of(charge()), List.of(strike()), null);
        Game game = game(s(card(PRIVATO)), b);
        turn(game, bound(game, "s", name(PRIVATO), "b"), move(game, "b", "Carica", "SELF"));
        assertFalse(voided(game, "b"));
        assertFalse(tokens(game, "b").isEmpty());
    }

    @Test
    void discutiamoneOnAMoveAlreadyVoidedDoesNothing() {
        Player c = c(card(YOU_STOP));
        c.getCharacter().getResources().put(Resource.VIOLENCE, 5);
        Game game = game(s(card(PRIVATO)), bCharging(), c);
        turn(game, bound(game, "s", name(PRIVATO), "b"), move(game, "b", "Carica", "SELF"), move(game, "c", name(YOU_STOP), "b"));
        assertTrue(voided(game, "b"), "voided by c, faster");
        assertTrue(report(game, "s").stream().noneMatch(line -> line.startsWith("Countered")), report(game, "s").toString());
    }

    // ---- CES-AR2 «Buon Vecchio Ricatto» (base.cesira.Ricatto) ----

    private static final String RICATTO = "base.cesira.Ricatto";

    private static int[] ricatto(Player b, String card) {
        Game game = game(s(card(RICATTO)), b);
        return turn(game, move(game, "s", name(RICATTO), "b"), move(game, "b", card, "s"));
    }

    @Test
    void ricattoVoidsAnAttackAndSendsBackHalfItsFixedDamage() {
        Game game = game(s(card(RICATTO)), b(hit("Pugno", 1, null, "HIT 30")));
        assertArrayEquals(new int[]{0, 15}, turn(game, move(game, "s", name(RICATTO), "b"), move(game, "b", "Pugno", "s")));
        assertTrue(voided(game, "b"));
        assertEquals(45, res(game, "s", Resource.ALERTNESS), "cost 15 A");
    }

    @Test
    void ricattoRoundsDownEachTypeOfDamage() {
        assertEquals(12, ricatto(b(hit("Dispari", 1, null, "HIT 25")), "Dispari")[1], "25 / 2 = 12,5");
        assertEquals(5 + 5, ricatto(b(hit("Misto", 1, null, "HIT 10", "CUT 11")), "Misto")[1], "5 HIT and 5 CUT (5,5)");
    }

    @Test
    void ricattoOnAMoveThatIsNotAnAttackSendsBackNothing() {
        Game game = game(s(card(RICATTO)), bCharging());
        assertArrayEquals(new int[]{0, 0}, turn(game, move(game, "s", name(RICATTO), "b"), move(game, "b", "Carica", "SELF")));
        assertTrue(voided(game, "b"));
    }

    @Test
    void ricattoOnAMoveAlreadyResolvedDoesNothing() {
        Game game = game(s(card(RICATTO)), player("b", 90, hit("Veloce", 2, null, "HIT 30")));
        assertArrayEquals(new int[]{30, 0}, turn(game, move(game, "s", name(RICATTO), "b"), move(game, "b", "Veloce", "s")));
        assertFalse(voided(game, "b"));
    }

    @Test
    void ricattoOnAMoveAlreadyVoidedSendsBackNothing() {
        Player c = c(card(YOU_STOP));
        c.getCharacter().getResources().put(Resource.VIOLENCE, 5);
        Game game = game(s(card(RICATTO)), b(hit("Pugno", 1, null, "HIT 30")), c);
        assertArrayEquals(new int[]{0, 0, 0}, turn(game, move(game, "s", name(RICATTO), "b"), move(game, "b", "Pugno", "s"),
                move(game, "c", name(YOU_STOP), "b")));
        assertTrue(voided(game, "b"));
    }

    @Test
    void ricattoSendsBackOnlyTheFixedPartAgainstTheOpponent() {
        Player lazo = player("b", 40, card("base.mara.CinghiataDiTraverso"));
        assertEquals(10, ricatto(lazo, name("base.mara.CinghiataDiTraverso"))[1], "«Lazo del Rider»: fixed 20 CUT; the part read from A does not count");
        Player scompenso = b(card("base.pino.TestataDaUltimoGiro"));
        scompenso.getCharacter().getResources().put(Resource.ALCOHOL, 5);
        assertEquals(17, ricatto(scompenso, name("base.pino.TestataDaUltimoGiro"))[1],
                "«Scompenso da Ultimo Giro»: half of the 35 HIT; its 5 HIT to itself do not count");
    }

    @Test
    void ricattoDoesNotSendBackRincara() {
        Player b = player(character("b", 10, 3), List.of(), fillers(10), card("com.last.Struggle"));
        b.getCharacter().countPlay(name("com.last.Struggle"));
        b.getCharacter().countPlay(name("com.last.Struggle"));
        assertEquals(5, ricatto(b, name("com.last.Struggle"))[1], "«Addosso!!!»: half of the fixed 10 HIT, not of the 10 of Rincara");
    }

    @Test
    void ricattoDamagePassesThroughTheTargetsStatuses() {
        Game game = charged(s(card(RICATTO)), bCharging(hit("Pugno", 1, null, "HIT 30")));
        assertEquals(22, turn(game, move(game, "s", name(RICATTO), "b"), move(game, "b", "Pugno", "s"))[1], "15 on Vulnerable ×1,5 = 22,5");
    }

    // ---- CES-AR3 «Copione Già Visto» (base.cesira.LoSapevo) ----

    private static final String COPIONE = "base.cesira.LoSapevo";

    @Test
    void copioneVoidsAMoveStillToResolve() {
        Game game = game(s(card(COPIONE)), b(hit("Pugno", 1, null, "HIT 30")));
        assertArrayEquals(new int[]{0, 0}, turn(game, move(game, "s", name(COPIONE), "b"), move(game, "b", "Pugno", "s")));
        assertTrue(voided(game, "b"));
        assertEquals(50, res(game, "s", Resource.ALERTNESS), "cost 10 A");
    }

    @Test
    void copioneOnTheAnnouncedCardKeepsTheOpponentVulnerable() {
        Game game = charged(s(card(COPIONE), hit("Schiaffo", 0, null, "HIT 10")), bCharging());
        assertArrayEquals(new int[]{0, 0}, turn(game, move(game, "s", name(COPIONE), "b"), move(game, "b", STRIKE, "s")));
        assertTrue(voided(game, "b"));
        assertFalse(tokens(game, "b").isEmpty(), "that play does not end the Vulnerable");
        assertEquals(15, turn(game, move(game, "s", "Schiaffo", "b"), rest(game, "b"))[1], "still Vulnerable: 10 × 1,5");
    }

    @Test
    void copioneOnAnotherCardOnlyVoids() {
        Game game = charged(s(card(COPIONE)), bCharging(hit("Pugno", 1, null, "HIT 30")));
        int marks = tokens(game, "b").size();
        turn(game, move(game, "s", name(COPIONE), "b"), move(game, "b", "Pugno", "s"));
        assertTrue(voided(game, "b"));
        assertEquals(marks, tokens(game, "b").size(), "the Vulnerable of the strike, untouched");
    }

    @Test
    void copioneOnAnAnnouncedCardAlreadyVoidedDoesNothing() {
        Player c = c(card(YOU_STOP));
        c.getCharacter().getResources().put(Resource.VIOLENCE, 5);
        Game game = charged(s(card(COPIONE)), bCharging(), c);
        turn(game, move(game, "s", name(COPIONE), "b"), move(game, "b", STRIKE, "s"), move(game, "c", name(YOU_STOP), "b"));
        assertTrue(voided(game, "b"));
        assertTrue(tokens(game, "b").isEmpty(), "voided by FAI BASTA: the announced card played ends the Vulnerable (RP-15)");
    }

    // ---- GEN-03 «Scatto Repentino» (base.com.ShuffleFeet) ----

    private static final String SCATTO = "base.com.ShuffleFeet";

    @Test
    void scattoSwapsAllTheItems() {
        Game game = game(s(card(SCATTO)), b());
        ch(game, "s").getItems().add(card(ESPRESSO));
        ch(game, "b").getItems().addAll(List.of(card(CASCO), card(GUANTI)));
        turn(game, move(game, "s", name(SCATTO), "b"), rest(game, "b"));
        assertEquals(List.of(name(CASCO), name(GUANTI)), items(game, "s"));
        assertEquals(List.of(name(ESPRESSO)), items(game, "b"));
    }

    @Test
    void scattoOverCapacityLosesTheOldestReceived() {
        Player s = player(character("s", 60, 1), List.of(card(SCATTO)), fillers(10), null);
        Game game = game(s, b());
        ch(game, "s").getItems().add(card(ESPRESSO));
        ch(game, "b").getItems().addAll(List.of(card(NEGRONI), card(CASCO), card(GUANTI)));
        turn(game, move(game, "s", name(SCATTO), "b"), rest(game, "b"));
        assertEquals(List.of(name(GUANTI)), items(game, "s"), "s keeps one: Negroni and Casco, the oldest received, are gone");
        assertEquals(List.of(name(ESPRESSO)), items(game, "b"));
    }

    @Test
    void scattoWithNoItemsOnOneSideMovesThemAll() {
        Game game = game(s(card(SCATTO)), b());
        ch(game, "b").getItems().add(card(CONTO));
        turn(game, move(game, "s", name(SCATTO), "b"), rest(game, "b"));
        assertEquals(List.of(name(CONTO)), items(game, "s"));
        assertEquals(List.of(), items(game, "b"));
        assertEquals(60 - 4, res(game, "s", Resource.ALERTNESS), "the In campo effect follows the item");
    }

    // ---- OGG-15 «Santino di San Briaco» (base.items.SantinoDellaPortinaia) ----

    private static Game santino(int copies) {
        List<Card> hand = new ArrayList<>();
        for (int i = 0; i < copies; i++) hand.add(consume());
        Player s = player(character("s", 60, 3), hand, fillers(10), null);
        s.getCharacter().getResources().put(Resource.ALCOHOL, 10);
        Game game = game(s, b());
        for (int i = 0; i < copies; i++) ch(game, "s").getItems().add(card(SANTINO));
        return game;
    }

    @Test
    void santinoBlocksTheLForThreeTurnsCountingThisOne() {
        Game game = santino(1);
        turn(game, onItem(game, "s", "Consuma", "s", name(SANTINO)), rest(game, "b"));
        assertTrue(ch(game, "s").getImmunities().contains(Resource.ALCOHOL));
        for (int t = 2; t <= 3; t++) turn(game, rest(game, "s"), rest(game, "b"));
        assertEquals(10, res(game, "s", Resource.ALCOHOL), "blocked in all three turns");
        assertEquals(60, res(game, "s", Resource.ALERTNESS));
        assertFalse(ch(game, "s").getImmunities().contains(Resource.ALCOHOL), "ended after the third turn's L effect");
        turn(game, rest(game, "s"), rest(game, "b"));
        assertEquals(10 - 6, res(game, "s", Resource.ALCOHOL), "fourth turn: −(10 / 2 + 1)");
        assertEquals(60 - 5, res(game, "s", Resource.ALERTNESS), "and −10 / 2 A");
    }

    @Test
    void santinoEndsTheImmunityEvenIfASecondOneGaveIt() {
        Game game = santino(2);
        turn(game, onItem(game, "s", "Consuma", "s", name(SANTINO)), rest(game, "b"));
        turn(game, onItem(game, "s", "Consuma", "s", name(SANTINO)), rest(game, "b"));
        turn(game, rest(game, "s"), rest(game, "b"));
        assertFalse(ch(game, "s").getImmunities().contains(Resource.ALCOHOL), "the first one's end removes it");
        turn(game, rest(game, "s"), rest(game, "b"));
        assertEquals(10 - 6, res(game, "s", Resource.ALCOHOL), "so the L acts in the fourth turn");
    }

    // ---- ROC-BO2 «Rialziamoci e Partite!» (base.rocco.bound.MiRialzo) ----

    private static final String RIALZO = "base.rocco.bound.MiRialzo";

    private static int rialzo(int health, Card bMove) {
        Player s = s(card(RIALZO));
        s.getCharacter().getResources().put(Resource.HEALTH, health);
        Game game = game(s, bMove == null ? b() : b(bMove));
        turn(game, bound(game, "s", name(RIALZO), "SELF"), bMove == null ? rest(game, "b") : move(game, "b", bMove.getName(), "s"));
        assertTrue(inHand(game, "s", name(RIALZO)), "a bound stays in hand (R02)");
        return health(game, "s");
    }

    @Test
    void rialziamociHealsFourFromOneToThirty() {
        assertEquals(34, rialzo(30, null));
        assertEquals(5, rialzo(1, null));
        assertEquals(31, rialzo(31, null), "above 30: nothing");
    }

    @Test
    void rialziamociReadsTheHealthAfterTheEarlierMoves() {
        assertEquals(35 - 7 + 4, rialzo(35, hit("Pugno", 1, null, "HIT 7")), "28 when it resolves");
    }

    @Test
    void rialziamociResolvesWhenDownButGivesNothingAtZero() {
        Player s = s(card(RIALZO));
        s.getCharacter().getResources().put(Resource.HEALTH, 5);
        Game game = game(s, b(hit("Pugno", 1, null, "HIT 30")));
        turn(game, bound(game, "s", name(RIALZO), "SELF"), move(game, "b", "Pugno", "s"));
        assertFalse(voided(game, "s"), "a card on yourself resolves even when down (RP-1)");
        assertEquals(0, health(game, "s"));
    }

    // ---- GEN-04 «Ce l'Hai Due Spicci?» (base.com.BeggingMoney) ----

    private static final String SPICCI = "base.com.BeggingMoney";

    @Test
    void spicciCopiesAnItemTheOpponentKeeps() {
        Game game = game(s(card(SPICCI)), b());
        ch(game, "b").getItems().add(card(SANTINO));
        turn(game, move(game, "s", name(SPICCI), "b"), rest(game, "b"));
        assertEquals(List.of(name(SANTINO)), items(game, "s"));
        assertEquals(List.of(name(SANTINO)), items(game, "b"));
        assertEquals(60, res(game, "s", Resource.ALERTNESS), "no cost");
        assertEquals(10, res(game, "b", Resource.ALERTNESS), "nothing else to the opponent");
    }

    @Test
    void spicciCopiesOneOfTheOpponentsItems() {
        Game game = game(s(card(SPICCI)), b());
        ch(game, "b").getItems().addAll(List.of(card(ESPRESSO), card(CASCO)));
        turn(game, move(game, "s", name(SPICCI), "b"), rest(game, "b"));
        assertEquals(1, items(game, "s").size());
        assertTrue(List.of(name(ESPRESSO), name(CASCO)).contains(items(game, "s").get(0)));
        assertEquals(List.of(name(ESPRESSO), name(CASCO)), items(game, "b"));
    }

    @Test
    void spicciWithoutOpponentsItemsDoesNothing() {
        Game game = game(s(card(SPICCI)), b());
        turn(game, move(game, "s", name(SPICCI), "b"), rest(game, "b"));
        assertEquals(List.of(), items(game, "s"));
    }

    @Test
    void spicciOverCapacityLosesTheOwnOldest() {
        Player s = player(character("s", 60, 1), List.of(card(SPICCI)), fillers(10), null);
        Game game = game(s, b());
        ch(game, "s").getItems().add(card(GUANTI));
        ch(game, "b").getItems().add(card(SANTINO));
        turn(game, move(game, "s", name(SPICCI), "b"), rest(game, "b"));
        assertEquals(List.of(name(SANTINO)), items(game, "s"));
    }

    @Test
    void spicciCopyIsYoursAlone() {
        Game game = game(s(card(SPICCI), consume()), b());
        ch(game, "b").getItems().add(card(SANTINO));
        turn(game, move(game, "s", name(SPICCI), "b"), rest(game, "b"));
        turn(game, onItem(game, "s", "Consuma", "s", name(SANTINO)), rest(game, "b"));
        assertTrue(ch(game, "s").getImmunities().contains(Resource.ALCOHOL), "you consume your copy with its effect");
        assertEquals(List.of(name(SANTINO)), items(game, "b"), "the opponent keeps his");
        assertFalse(ch(game, "b").getImmunities().contains(Resource.ALCOHOL));
    }

    // ---- GEN-10 «PERMESSO SCUSA PUOI SMETTERLA» (bruiser.BadEducation) ----

    private static final String PERMESSO = "bruiser.BadEducation";

    @Test
    void permessoRemovesTheEquipmentsThenHitsEight() {
        Game game = game(sWith(PERMESSO, Resource.VIOLENCE, 10), b());
        apply(status("Corazza", 0.5, true), ch(game, "b"));
        ch(game, "b").getItems().add(card(SANTINO));
        assertEquals(8, turn(game, move(game, "s", name(PERMESSO), "b"), rest(game, "b"))[1], "the halving equipment is gone first");
        assertTrue(ch(game, "b").getStatuses().isEmpty());
        assertEquals(List.of(name(SANTINO)), items(game, "b"), "items are not equipments");
        assertEquals(5, res(game, "s", Resource.VIOLENCE), "cost 5 V");
    }

    @Test
    void permessoLeavesTheOtherStatuses() {
        Game game = game(sWith(PERMESSO, Resource.VIOLENCE, 10), b());
        apply(status("Corazza", 0.5, true), ch(game, "b"));
        apply(status("Guardia", 0.75, false), ch(game, "b"));
        assertEquals(6, turn(game, move(game, "s", name(PERMESSO), "b"), rest(game, "b"))[1], "8 × 0,75");
        assertEquals(List.of("Guardia"), ch(game, "b").getStatuses().stream().map(Status::getName).collect(Collectors.toList()));
    }
}
