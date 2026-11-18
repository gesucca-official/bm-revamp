package com.gsc.bm.model.game.bot;

import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.Ruleset;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * SB-19 B2 (D130, proposal A2 section 5): how the bots read an item with an «In campo» effect (RP-27), at the numbers of the
 * proposal: V 0,75, A 0,5, L 0,35, T 0,15 for an immune holder and 1 a point for the others, two turns, weight 2. Every correction
 * is zero when no item on the table has the effect, which is what keeps the reference identical.
 */
class InPlayBotsTest {
    private static final double EPS = 1e-9;

    private static PrintedEffects.Step step(PrintedEffects.Kind kind, Resource resource, int base) {
        return PrintedEffects.Step.builder().kind(kind).resource(resource).base(base).build();
    }

    private static BotView.CardSeen item(String name, List<PrintedEffects.Step> consumed, List<PrintedEffects.Step> inPlay) {
        return new BotView.CardSeen(name, name, true, false, false, false, 1, Set.of(), Map.of(), "RESOURCES", "—", "—", "—", false,
                new PrintedEffects(consumed, inPlay));
    }

    /** OGG-17: in play −3 A, consumed +15 V. */
    private static BotView.CardSeen conto() {
        return item("Conto", List.of(step(PrintedEffects.Kind.GAIN, Resource.VIOLENCE, 15)),
                List.of(step(PrintedEffects.Kind.LOSE, Resource.ALERTNESS, 3)));
    }

    /** OGG-18: in play +2 T, consumed +10 A. */
    private static BotView.CardSeen sigaretta() {
        return item("Sigaretta", List.of(step(PrintedEffects.Kind.GAIN, Resource.ALERTNESS, 10)),
                List.of(step(PrintedEffects.Kind.GAIN, Resource.TOXICITY, 2)));
    }

    private static BotView.CardSeen plain(String name, Resource resource, int base) {
        return item(name, List.of(step(PrintedEffects.Kind.GAIN, resource, base)), List.of());
    }

    private static BotView.CardSeen move(String name, Card.CardTarget target, PrintedEffects effects) {
        return new BotView.CardSeen(name, name, false, false, false, false, 1, Set.of(target), Map.of(), "ITEMS", "—", "—", "—", false, effects);
    }

    private static BotView.Seat seat(String id, Set<Resource> immunities, int capacity, List<BotView.CardSeen> items) {
        return new BotView.Seat(id, id, false, false, Map.of(Resource.HEALTH, 100), immunities, List.of(), List.of(), capacity, items);
    }

    private static StyleSupport.Situation table(int capacity, Set<Resource> mineImmune, List<BotView.CardSeen> mine, List<BotView.CardSeen> theirs) {
        BotView view = new BotView(5, new BotView.Self(seat("me", mineImmune, capacity, mine), List.of(), 5, List.of()),
                List.of(new BotView.Opponent(seat("b", Set.of(), 3, theirs), 6, 5, List.of())), List.of(), Map.of(), Ruleset.D50);
        return new StyleSupport.Situation(view);
    }

    private static StyleSupport.Situation table(Set<Resource> mineImmune, List<BotView.CardSeen> mine, List<BotView.CardSeen> theirs) {
        return table(3, mineImmune, mine, theirs);
    }

    private static final Set<Resource> NOT_IMMUNE = Set.of(), IMMUNE_T = Set.of(Resource.TOXICITY);

    @Test
    void anItemWithoutTheEffectIsReadAsBefore() {
        BotView.CardSeen espresso = plain("Espresso", Resource.ALERTNESS, 15);
        assertEquals(0, StyleSupport.inPlayPerTurn(espresso, NOT_IMMUNE), EPS);
        assertEquals(7.5, StyleSupport.itemWorth(espresso, NOT_IMMUNE), EPS);
    }

    @Test
    void theEffectIsWeighedPerTurnAtTheWeightsOfTheListino() {
        assertEquals(-1.5, StyleSupport.inPlayPerTurn(conto(), NOT_IMMUNE), EPS, "−3 A at 0,5");
        assertEquals(-2, StyleSupport.inPlayPerTurn(sigaretta(), NOT_IMMUNE), EPS, "+2 T poisons a holder that is not immune: 1 a point");
        assertEquals(0.3, StyleSupport.inPlayPerTurn(sigaretta(), IMMUNE_T), EPS, "+2 T at 0,15 for an immune holder");
        BotView.CardSeen alcohol = item("Alcol", List.of(), List.of(step(PrintedEffects.Kind.GAIN, Resource.ALCOHOL, 4)));
        assertEquals(-1.4, StyleSupport.inPlayPerTurn(alcohol, NOT_IMMUNE), EPS, "L at its weight, 0,35 a point, costs");
        assertEquals(1.4, StyleSupport.inPlayPerTurn(alcohol, Set.of(Resource.ALCOHOL)), EPS);
    }

    @Test
    void theWorthOfAnItemCountsTwoTurnsOfItsEffect() {
        assertEquals(11.25 - 3, StyleSupport.itemWorth(conto(), NOT_IMMUNE), EPS);
        assertEquals(5 - 4, StyleSupport.itemWorth(sigaretta(), NOT_IMMUNE), EPS);
        assertEquals(5 + 0.6, StyleSupport.itemWorth(sigaretta(), IMMUNE_T), EPS);
        // The sale throws away the least valuable: a Sigaretta in a poisonable hand is worth less than a Peroni (+10 L, 3,5), not so
        // without the effect (5) or in the hand of an immune one.
        BotView.CardSeen peroni = plain("Peroni", Resource.ALCOHOL, 10);
        assertTrue(StyleSupport.itemWorth(sigaretta(), NOT_IMMUNE) < StyleSupport.itemWorth(peroni, NOT_IMMUNE));
        assertTrue(StyleSupport.itemWorth(sigaretta(), IMMUNE_T) > StyleSupport.itemWorth(peroni, IMMUNE_T));
    }

    private static final PrintedEffects NOTHING = new PrintedEffects(List.of());

    private static StyleSupport.Plan consume(StyleSupport.Situation s, String item) {
        return new StyleSupport.Plan(s, new LegalMove(move("Basic", Card.CardTarget.NEAR_ITEM, NOTHING), "SELF", null, item));
    }

    private static StyleSupport.Plan grab(StyleSupport.Situation s, String item) {
        return new StyleSupport.Plan(s, new LegalMove(move("Steal", Card.CardTarget.FAR_ITEM, NOTHING), "b", null, item));
    }

    private static StyleSupport.Plan swap(StyleSupport.Situation s) {
        return new StyleSupport.Plan(s, new LegalMove(move("Scatto", Card.CardTarget.OPPONENT,
                new PrintedEffects(List.of(step(PrintedEffects.Kind.SWAP_ITEMS, null, 0)))), "b", null, null));
    }

    @Test
    void consumingAnItemAvoidsTheNextEndOfTurnWithWeightTwo() {
        StyleSupport.Situation s = table(NOT_IMMUNE, List.of(conto(), sigaretta()), List.of());
        assertEquals(2 * 1.5, StyleSupport.inPlayValue(s, consume(s, "Conto")), EPS);
        assertEquals(2 * 2, StyleSupport.inPlayValue(s, consume(s, "Sigaretta")), EPS);
        StyleSupport.Situation plainTable = table(NOT_IMMUNE, List.of(plain("Espresso", Resource.ALERTNESS, 15)), List.of());
        assertEquals(0, StyleSupport.inPlayValue(plainTable, consume(plainTable, "Espresso")), EPS);
    }

    @Test
    void sellingAnItemIsNotAConsumption() {
        // RP-25: a sale is not a consumption, so the correction of the consumption is not taken for it.
        StyleSupport.Situation s = table(NOT_IMMUNE, List.of(conto()), List.of());
        PrintedEffects sale = new PrintedEffects(List.of(step(PrintedEffects.Kind.SELL, null, 0)));
        StyleSupport.Plan sells = new StyleSupport.Plan(s, new LegalMove(move("Lo rivendo", Card.CardTarget.NEAR_ITEM, sale), "SELF", null, "Conto"));
        assertEquals(0, StyleSupport.inPlayValue(s, sells), EPS);
    }

    @Test
    void takingAFarItemCostsTwoTurnsOfItsEffectToTheAuthor() {
        StyleSupport.Situation s = table(NOT_IMMUNE, List.of(), List.of(conto(), sigaretta()));
        assertEquals(2 * 2 * -1.5, StyleSupport.inPlayValue(s, grab(s, "Conto")), EPS, "a bot does not steal the Conto");
        assertEquals(2 * 2 * -2, StyleSupport.inPlayValue(s, grab(s, "Sigaretta")), EPS);
        StyleSupport.Situation immune = table(IMMUNE_T, List.of(), List.of(sigaretta()));
        assertEquals(2 * 2 * 0.3, StyleSupport.inPlayValue(immune, grab(immune, "Sigaretta")), EPS, "an immune holder steals the Sigaretta");
        StyleSupport.Situation plainTable = table(NOT_IMMUNE, List.of(), List.of(plain("Espresso", Resource.ALERTNESS, 15)));
        assertEquals(0, StyleSupport.inPlayValue(plainTable, grab(plainTable, "Espresso")), EPS);
    }

    @Test
    void aSwapOfTheTraysReceivesTheirEffectsAndGivesAwayMine() {
        // me: Sigaretta; they: Conto. Received (−1,5 a turn) minus given away (−2 a turn), two turns each, weight 2.
        StyleSupport.Situation s = table(NOT_IMMUNE, List.of(sigaretta()), List.of(conto()));
        assertEquals(2 * 2 * (-1.5 + 2), StyleSupport.inPlayValue(s, swap(s)), EPS);
        // The author keeps only as many of the most recent items as its capacity.
        StyleSupport.Situation small = table(1, NOT_IMMUNE, List.of(), List.of(conto(), sigaretta()));
        assertEquals(2 * 2 * -2, StyleSupport.inPlayValue(small, swap(small)), EPS, "capacity 1: only the Sigaretta, the most recent, arrives");
        StyleSupport.Situation plainTable = table(NOT_IMMUNE, List.of(plain("A", Resource.ALERTNESS, 1)), List.of(plain("B", Resource.ALERTNESS, 1)));
        assertEquals(0, StyleSupport.inPlayValue(plainTable, swap(plainTable)), EPS);
    }
}
