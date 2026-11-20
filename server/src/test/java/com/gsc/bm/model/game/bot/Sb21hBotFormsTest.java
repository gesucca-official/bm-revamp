package com.gsc.bm.model.game.bot;

import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * SB-21h (D159, D160 (4)): the heuristic styles read the new bound forms from the printed effects, never from the names. Two bounds
 * that differ only in the form under test: the defense of one turn together with a gain, the partial cleanup of the own T, the heal
 * from 1 to 30 HEALTH of ROC-BO2. With the live rules nothing changes (the support is playground only).
 */
class Sb21hBotFormsTest {
    private static final List<BotPolicy> STYLES = List.of(new AggressivePolicy(), new PrudentPolicy(), new ResourceAwarePolicy());

    private static PrintedEffects.Step gain(Resource r, int n) {
        return PrintedEffects.Step.builder().kind(PrintedEffects.Kind.GAIN).resource(r).base(n).build();
    }

    private static PrintedEffects.Step shield(Damage.DamageType t) {
        return PrintedEffects.Step.builder().kind(PrintedEffects.Kind.STATUS).flow(StatusFlow.INPUT).statusType(StatusType.GOOD).factor(0.75f)
                .damageType(t).turns(0).build();
    }

    private static BotView.CardSeen bound(String name, int priority, Card.CardTarget target, String role, PrintedEffects.Step... steps) {
        return new BotView.CardSeen(name, "t." + name, false, false, false, true, priority, Set.of(target), Map.of(), role, "—", "—", "—", false,
                new PrintedEffects(List.of(steps)), null);
    }

    private static BotView.CardSeen hit(String name, int priority, int violence, int amount) {
        return new BotView.CardSeen(name, "t." + name, false, false, false, false, priority, Set.of(Card.CardTarget.OPPONENT),
                violence > 0 ? Map.of(Resource.VIOLENCE, violence) : Map.of(), "DAMAGE", "—", "HIT", "HIT " + amount, false,
                new PrintedEffects(List.of(PrintedEffects.damage(true, Damage.DamageType.HIT, amount))), null);
    }

    private static BotView.Seat seat(String id, int health, Map<Resource, Integer> more) {
        Map<Resource, Integer> res = new EnumMap<>(Resource.class);
        for (Resource r : Resource.values()) res.put(r, 0);
        res.put(Resource.HEALTH, health);
        res.put(Resource.VIOLENCE, 30);
        res.put(Resource.ALERTNESS, 20);
        res.putAll(more);
        return new BotView.Seat(id, id, false, false, res, Set.of(), List.of(), List.of(), 1, List.of());
    }

    private static BotView view(Ruleset rules, BotView.Seat me, List<BotView.CardSeen> hand, List<BotView.RevealedSeen> shown) {
        List<BotView.CardSeen> cards = new ArrayList<>(hand);
        cards.add(hit("Unpayable", 0, 99, 40)); // the discard of R02
        return new BotView(4, new BotView.Self(me, cards, 10, List.of()),
                List.of(new BotView.Opponent(seat("foe", 60, Map.of()), 5, 10, shown)), List.of(), Map.of(), rules);
    }

    private static void everyStyleChooses(String expected, BotView v) {
        for (BotPolicy style : STYLES)
            for (long seed = 0; seed < 8; seed++)
                assertEquals(expected, style.choose(v, v.legalMoves(), new Random(seed)).getCard().getName(), style.getClass().getSimpleName());
    }

    @Test
    void theDefenseOfOneTurnIsWorthTheDamageItSpares() {
        BotView.CardSeen guarded = bound("Guarded", 2, Card.CardTarget.SELF, "DEFENSE", gain(Resource.VIOLENCE, 5), shield(Damage.DamageType.HIT),
                shield(Damage.DamageType.CUT), shield(Damage.DamageType.POISON));
        // The same bound without the status: the generator of SB-21g (role RESOURCES, as «Mi tengo al banco» was before D159).
        BotView.CardSeen plain = bound("Plain", 2, Card.CardTarget.SELF, "RESOURCES", gain(Resource.VIOLENCE, 5));
        BotView v = view(Ruleset.D50, seat("me", 40, Map.of()), List.of(plain, guarded),
                List.of(new BotView.RevealedSeen(1, hit("Impact", 0, 25, 35), 3, null)));
        everyStyleChooses("Guarded", v);
        StyleSupport.Situation s = new StyleSupport.Situation(v);
        StyleSupport.Plan p = new StyleSupport.Plan(s, v.legalMoves().stream().filter(m -> m.getCard() == guarded).findFirst().orElseThrow());
        assertTrue(p.guardForm);
        assertEquals(35 * 0.25, p.guard, 1e-9, "the shown 35 HIT resolves after the bound: a quarter spared");
        StyleSupport.Plan q = new StyleSupport.Plan(s, v.legalMoves().stream().filter(m -> m.getCard() == plain).findFirst().orElseThrow());
        assertFalse(q.guardForm);
        assertEquals(0, q.guard, 1e-9);
    }

    @Test
    void aDefenseWithoutAGainKeepsTheOlderReading() {
        // «Fare il vago» of SB-21g (HIT and CUT ×0,75, no gain): the drafts before SB-21h stay identical (step 0).
        BotView.CardSeen vago = bound("Vago", 2, Card.CardTarget.SELF, "DEFENSE", shield(Damage.DamageType.HIT), shield(Damage.DamageType.CUT));
        BotView v = view(Ruleset.D50, seat("me", 40, Map.of()), List.of(vago), List.of());
        StyleSupport.Plan p = new StyleSupport.Plan(new StyleSupport.Situation(v), v.legalMoves().get(0));
        assertFalse(p.guardForm);
        assertEquals(0, p.guard, 1e-9);
    }

    @Test
    void theLiveRulesReadNoNewForm() {
        BotView.CardSeen guarded = bound("Guarded", 2, Card.CardTarget.SELF, "DEFENSE", gain(Resource.VIOLENCE, 5), shield(Damage.DamageType.HIT));
        BotView v = view(Ruleset.LIVE, seat("me", 40, Map.of()), List.of(guarded), List.of(new BotView.RevealedSeen(1, hit("Impact", 0, 25, 35), 3, null)));
        StyleSupport.Plan p = new StyleSupport.Plan(new StyleSupport.Situation(v), v.legalMoves().get(0));
        assertFalse(p.guardForm);
        assertEquals(0, p.guard, 1e-9);
    }

    @Test
    void thePartialCleanupIsWorthThePoisonItSpares() {
        PrintedEffects.Step cleanup = PrintedEffects.Step.builder().kind(PrintedEffects.Kind.LOSE).resource(Resource.TOXICITY).of(Resource.TOXICITY)
                .divide(4).build();
        BotView.CardSeen clean = bound("Clean", 1, Card.CardTarget.OPPONENT, "DAMAGE", cleanup, PrintedEffects.damage(true, Damage.DamageType.HIT, 2));
        BotView.CardSeen dirty = bound("Dirty", 1, Card.CardTarget.OPPONENT, "DAMAGE", PrintedEffects.damage(true, Damage.DamageType.HIT, 2));
        BotView v = view(Ruleset.D50, seat("me", 60, Map.of(Resource.TOXICITY, 40)), List.of(dirty, clean), List.of());
        everyStyleChooses("Clean", v);
        StyleSupport.Situation s = new StyleSupport.Situation(v);
        StyleSupport.Plan p = new StyleSupport.Plan(s, v.legalMoves().stream().filter(m -> m.getCard() == clean).findFirst().orElseThrow());
        assertTrue(p.toxicRelief > 0, "40 T, 10 removed: 20 → 15 POISON at each end of turn");
        BotView w = view(Ruleset.D50, seat("me", 60, Map.of()), List.of(clean), List.of());
        assertEquals(0, new StyleSupport.Plan(new StyleSupport.Situation(w), w.legalMoves().get(0)).toxicRelief, 1e-9, "nothing to remove");
    }

    @Test
    void theConditionalHealCountsOnlyInsideItsWindow() {
        BotView.CardSeen rise = bound("Rise", 0, Card.CardTarget.SELF, "RESOURCES", PrintedEffects.Step.builder().kind(PrintedEffects.Kind.GAIN)
                .resource(Resource.HEALTH).base(4).healthAtLeast(1).healthAtMost(30).build());
        for (int[] c : new int[][]{{20, 4}, {30, 4}, {31, 0}, {80, 0}}) {
            BotView v = view(Ruleset.D50, seat("me", c[0], Map.of()), List.of(rise), List.of());
            StyleSupport.Plan p = new StyleSupport.Plan(new StyleSupport.Situation(v), v.legalMoves().get(0));
            assertEquals(c[1], p.gain(Resource.HEALTH), 1e-9, c[0] + " HEALTH");
        }
    }
}
