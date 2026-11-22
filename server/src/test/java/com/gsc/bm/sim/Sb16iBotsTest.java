package com.gsc.bm.sim;

import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.bot.*;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

/**
 * SB-16i Fase B (D97): what the bots learn. The choice between two announced names, one rule for every bot; the cleaning of
 * the own TOXICITY in the styles; «Gioca d'anticipo» and «Rincara» in {@link TurnForecast} and {@link ViewTable}.
 */
class Sb16iBotsTest {

    static BotView.CardSeen card(String name, int priority, Set<Card.CardTarget> targets, Map<Resource, Integer> cost, String damageAmount,
                                 PrintedEffects effects) {
        return new BotView.CardSeen(name, "t." + name, false, false, false, false, priority, targets, cost, "DAMAGE", "—",
                damageAmount == null ? "—" : "HIT", damageAmount == null ? "—" : damageAmount, false, effects);
    }

    static PrintedEffects.Step damage(boolean onTarget, int base) {
        return PrintedEffects.Step.builder().kind(PrintedEffects.Kind.DAMAGE).onTarget(onTarget).damageType(Damage.DamageType.HIT).base(base).build();
    }

    static BotView.CardSeen hit(String name, int cost, int amount) {
        return card(name, 1, Set.of(Card.CardTarget.OPPONENT), cost == 0 ? Map.of() : Map.of(Resource.VIOLENCE, cost), "HIT " + amount,
                new PrintedEffects(List.of(damage(true, amount))));
    }

    static BotView.CardSeen hitAt(String name, int priority, int amount) {
        return card(name, priority, Set.of(Card.CardTarget.OPPONENT), Map.of(), "HIT " + amount, new PrintedEffects(List.of(damage(true, amount))));
    }

    static BotView.CardSeen charge(int reward) {
        PrintedEffects.Step search = PrintedEffects.Step.builder().kind(PrintedEffects.Kind.SEARCH).searchedCard("t.X")
                .searchedCards(List.of("t.X", "t.Y")).factor(1.5f).tokenDamage(EnumSet.allOf(Damage.DamageType.class))
                .foundGains(Map.of(Resource.VIOLENCE, reward)).missedGains(Map.of()).build();
        return card("Carica", 1, Set.of(Card.CardTarget.SELF), Map.of(), null, new PrintedEffects(List.of(search)));
    }

    static BotView.Seat seat(String id, int health, int violence, int alertness, int toxicity, Map<String, Integer> plays) {
        Map<Resource, Integer> r = new EnumMap<>(Resource.class);
        r.put(Resource.HEALTH, health); r.put(Resource.VIOLENCE, violence); r.put(Resource.ALERTNESS, alertness);
        r.put(Resource.TOXICITY, toxicity); r.put(Resource.ALCOHOL, 0);
        return new BotView.Seat(id, id, false, false, r, Set.of(), List.of(), List.of(), 3, List.of(), plays);
    }

    static BotView view(BotView.Seat me, List<BotView.CardSeen> hand, Map<String, BotView.CardSeen> searchable, BotView.Seat foe) {
        return new BotView(3, new BotView.Self(me, hand, 10, List.of(), searchable), List.of(new BotView.Opponent(foe, 5, 10, List.of())),
                List.of(), Map.of(), Ruleset.D50);
    }

    static String choice(int violence, int reward, BotView.CardSeen x, BotView.CardSeen y) {
        BotView v = view(seat("me", 50, violence, 20, 0, Map.of()), List.of(charge(reward)), Map.of("t.X", x, "t.Y", y),
                seat("foe", 50, 0, 20, 0, Map.of()));
        return v.legalMoves().get(0).getSearch();
    }

    @Test
    void theSharedRuleChoosesTheHitPayableNextTurnThenTheStronger() {
        // Only Y is payable after the reward (0 + 10 >= 10, not 25): Y although X is stronger.
        assertEquals("t.Y", choice(0, 10, hit("X", 25, 30), hit("Y", 10, 12)));
        // Both payable: the stronger by nominal damage, whatever the printed order.
        assertEquals("t.Y", choice(30, 10, hit("X", 10, 12), hit("Y", 25, 30)));
        assertEquals("t.X", choice(30, 10, hit("X", 25, 30), hit("Y", 10, 12)));
        // Neither payable: the cheaper first.
        assertEquals("t.Y", choice(0, 0, hit("X", 25, 30), hit("Y", 20, 12)));
        // Same cost and damage: the first printed.
        assertEquals("t.X", choice(0, 0, hit("X", 20, 12), hit("Y", 20, 12)));
    }

    @Test
    void nothingToChooseWithOneNameOrNoneInTheDeck() {
        BotView one = view(seat("me", 50, 0, 20, 0, Map.of()), List.of(charge(10)), Map.of("t.Y", hit("Y", 10, 12)),
                seat("foe", 50, 0, 20, 0, Map.of()));
        assertNull(one.legalMoves().get(0).getSearch(), "one name left: the engine takes it");
        BotView none = view(seat("me", 50, 0, 20, 0, Map.of()), List.of(charge(10)), Map.of(), seat("foe", 50, 0, 20, 0, Map.of()));
        assertNull(none.legalMoves().get(0).getSearch());
    }

    @Test
    void theStylesValueEmptyingTheirOwnToxicity() {
        PrintedEffects clean = new PrintedEffects(List.of(damage(false, 5),
                PrintedEffects.Step.builder().kind(PrintedEffects.Kind.EMPTY).resource(Resource.TOXICITY).build()));
        BotView.CardSeen dita = card("Dita", 1, Set.of(Card.CardTarget.SELF), Map.of(), null, clean);
        BotView.CardSeen idle = card("Attesa", 1, Set.of(Card.CardTarget.SELF), Map.of(), null, new PrintedEffects(List.of()));
        // Dita first: a tie between the two moves goes to the second (Random(1).nextInt(2) is 1), so only a better score picks Dita.
        assertEquals(1, new Random(1).nextInt(2));
        for (BotPolicy style : List.of(new AggressivePolicy(), new PrudentPolicy(), new ResourceAwarePolicy())) {
            BotView poisoned = view(seat("me", 50, 0, 20, 20, Map.of()), List.of(dita, idle), Map.of(), seat("foe", 50, 0, 20, 0, Map.of()));
            assertEquals("Dita", style.choose(poisoned, poisoned.legalMoves(), new Random(1)).getCard().getName(),
                    style.getClass().getSimpleName() + ": 20 T, 10 POISON a turn spared for two turns, minus 5 HIT");
            BotView neat = view(seat("me", 50, 0, 20, 0, Map.of()), List.of(dita, idle), Map.of(), seat("foe", 50, 0, 20, 0, Map.of()));
            assertEquals("Attesa", style.choose(neat, neat.legalMoves(), new Random(1)).getCard().getName(),
                    style.getClass().getSimpleName() + ": no TOXICITY, nothing to spare: a tie");
        }
    }

    // ---- TurnForecast: «Gioca d'anticipo» and «Rincara» from public data ----

    static BotView.CardSeen aheadHit(int priority) {
        PrintedEffects e = new PrintedEffects(List.of(damage(true, 3),
                PrintedEffects.Step.builder().kind(PrintedEffects.Kind.DAMAGE).onTarget(true).damageType(Damage.DamageType.HIT).base(10).ahead(true).build()));
        return card("Anticipo", priority, Set.of(Card.CardTarget.OPPONENT), Map.of(), "HIT 3", e);
    }

    static BotView.CardSeen growing() {
        PrintedEffects e = new PrintedEffects(List.of(
                PrintedEffects.Step.builder().kind(PrintedEffects.Kind.DAMAGE).onTarget(false).damageType(Damage.DamageType.HIT).base(5).perPlay(2).build(),
                PrintedEffects.Step.builder().kind(PrintedEffects.Kind.DAMAGE).onTarget(true).damageType(Damage.DamageType.HIT).base(10).perPlay(5).build()));
        return card("Ultima", 1, Set.of(Card.CardTarget.OPPONENT), Map.of(), "HIT 10", e);
    }

    static Map<String, Integer> forecast(BotView.CardSeen mine, int foePriority, Map<String, Integer> plays) {
        BotView v = view(seat("me", 100, 0, 20, 0, plays), List.of(mine), Map.of(), seat("foe", 100, 0, 20, 0, Map.of()));
        LegalMove move = v.legalMoves().stream().filter(m -> m.getCard().getName().equals(mine.getName())).findFirst().orElseThrow();
        TurnForecast.Threat threat = new TurnForecast.Threat(v.getOpponents().get(0).getSeat(), hitAt("Spinta", foePriority, 1), "me", null);
        List<Map<String, Integer>> ends = TurnForecast.variants(v, move, threat);
        assertEquals(1, new HashSet<>(ends).size());
        return ends.get(0);
    }

    @Test
    void theForecastAppliesTheConditionalStepsAndTheCounter() {
        assertEquals(87, forecast(aheadHit(2), 1, Map.of()).get("foe"), "ahead of a priority 1 move: 3 + 10");
        assertEquals(97, forecast(aheadHit(1), 2, Map.of()).get("foe"), "after: 3 only");
        assertEquals(97, forecast(aheadHit(1), 1, Map.of()).get("foe"), "same group: 3 only");
        Map<String, Integer> third = forecast(growing(), 1, Map.of("ultima", 2));
        assertEquals(80, third.get("foe"), "third play: 10 + 2 x 5");
        assertEquals(100 - 9 - 1, third.get("me"), "and 5 + 2 x 2 to self, plus the push");
    }

    /** Proposal, section 6: against a shown lethal Impatto (priority 0) a Sgommata (priority 1) comes first and scales it (1.6: halves it, a save). */
    static Set<String> kept(String draftPath) throws Exception {
        Draft d = Draft.fromClasspath(draftPath);
        List<BotView.CardSeen> hand = new ArrayList<>();
        for (String b : List.of("base.mara.CinghiataDiTraverso", "base.mara.Sgommata", "base.mara.TraDueParaurti", "base.com.Spintone"))
            hand.add(BotView.publicText(d.card(b)));
        BotView.Opponent foe = new BotView.Opponent(seat("foe", 60, 30, 20, 0, Map.of()), 5, 10,
                List.of(new BotView.RevealedSeen(1, BotView.publicText(d.card("bruiser.SuperImpact")), 3, null)));
        BotView v = new BotView(4, new BotView.Self(seat("me", 25, 0, 30, 0, Map.of()), hand, 10, List.of()), List.of(foe), List.of(),
                Map.of(), Ruleset.D50);
        Set<String> kept = new TreeSet<>();
        BotPolicy record = (view, legal, random) -> { legal.forEach(m -> kept.add(m.getCard().getName())); return legal.get(0); };
        new LethalAwarePolicy(record).choose(v, v.legalMoves(), new Random(1));
        return kept;
    }

    @Test
    void anAheadSgommataIsASaveAgainstAShownLethalHit() throws Exception {
        assertEquals(Set.of("Tra due paraurti"), kept("/set-base/storico/1.5/bozza.json"), "1.5: only the parry");
        // D99 (7): the 1.6 kept the Sgommata (x0.5: 17 of 34 on 25 health); the 1.6b (x0.8) leaves 28 of 35 (D139), still lethal.
        assertEquals(Set.of("Unta e Bisunta"), kept("/set-base/bozza.json"), "1.6b: the Sgommata ahead (x0.8) is no save from 35 on 25");
    }

    @Test
    void theTableAppliesTheConditionalStepsAndCountsEveryPlay() {
        Map<String, BotView.CardSeen> catalog = new HashMap<>();
        BotView v = view(seat("me", 100, 0, 20, 0, Map.of("ultima", 1)), List.of(growing(), aheadHit(2)), Map.of(),
                seat("foe", 100, 0, 20, 0, Map.of()));
        ViewTable t = ViewTable.forecast(v, catalog);
        t.playTurn(List.of(new ViewTable.Play("me", growing(), "foe", null, null), new ViewTable.Play("foe", hit("Spinta", 0, 1), "me", null, null)),
                new ViewTable.Flags(true, false, false));
        assertEquals(85, t.health().get("foe"), "second play: 10 + 5");
        assertEquals(2, t.view("me").getSelf().getSeat().plays("Ultima"), "the counter of the table grows with the play");
        t.playTurn(List.of(new ViewTable.Play("me", aheadHit(2), "foe", null, null), new ViewTable.Play("foe", hit("Spinta", 0, 1), "me", null, null)),
                new ViewTable.Flags(true, false, false));
        assertEquals(72, t.health().get("foe"), "then ahead: 3 + 10");
    }
}
