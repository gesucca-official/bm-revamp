package com.gsc.bm.model.game.bot;

import com.gsc.bm.model.Damage.DamageType;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;
import org.junit.jupiter.api.Test;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

/**
 * SB-30b B5b: the Difficile on explicit two-turn scenarios. In each one the same style (it prefers a given card, else the first
 * move offered) sits inside the Normale ({@link LethalAwarePolicy}) and inside the Difficile; the test states the Normale's move,
 * the Difficile's, the moves offered to the style and the values that decide it.
 */
class DifficilePolicyTest {

    /** The style: records what it is offered, takes the preferred card if offered, else the first move. */
    static final class Prefer implements BotPolicy {
        final String card;
        List<LegalMove> offered;

        Prefer(String card) { this.card = card; }

        @Override public LegalMove choose(BotView view, List<LegalMove> legal, Random random) {
            offered = legal;
            return legal.stream().filter(m -> m.getCard().getName().equals(card)).findFirst().orElse(legal.get(0));
        }
    }

    static BotView.CardSeen card(String name, int priority, Map<Resource, Integer> cost, Set<Card.CardTarget> targets,
                                 PrintedEffects.Step... steps) {
        return new BotView.CardSeen(name, name, false, false, false, false, priority, targets, cost, "", "", "", "", false,
                new PrintedEffects(List.of(steps)));
    }

    static BotView.CardSeen hit(String name, int damage, int priority, Map<Resource, Integer> cost) {
        return card(name, priority, cost, Set.of(Card.CardTarget.OPPONENT), PrintedEffects.damage(true, DamageType.HIT, damage));
    }

    /** Halves HIT taken from the turn it is played: {@code turns} 0 ends at that end of turn, 1 lasts the next turn too. */
    static BotView.CardSeen guard(Map<Resource, Integer> cost, int turns) {
        return card("Guard", 5, cost, Set.of(Card.CardTarget.SELF), PrintedEffects.Step.builder().kind(PrintedEffects.Kind.STATUS)
                .damageType(DamageType.HIT).flow(StatusFlow.INPUT).statusType(StatusType.GOOD).factor(.5f).turns(turns).build());
    }

    static BotView.Seat seat(String id, Map<Resource, Integer> resources, List<BotView.StatusSeen> statuses) {
        Map<Resource, Integer> res = new EnumMap<>(Resource.class);
        for (Resource r : Resource.values()) res.put(r, 0);
        res.put(Resource.HEALTH, 100);
        res.putAll(resources);
        return new BotView.Seat(id, id, false, false, res, Set.of(), statuses, List.of(), 1, List.of());
    }

    static BotView view(BotView.Seat me, List<BotView.CardSeen> hand, List<BotView.RevealedSeen> mine,
                        BotView.Seat foe, List<BotView.CardSeen> shown) {
        List<BotView.RevealedSeen> revealed = new ArrayList<>();
        for (BotView.CardSeen c : shown) revealed.add(new BotView.RevealedSeen(100 + revealed.size(), c, 3, null));
        return new BotView(4, new BotView.Self(me, hand, 10, mine), List.of(new BotView.Opponent(foe, 5, 10, revealed)),
                List.of(), Map.of(), Ruleset.D50);
    }

    /** What both levels did in one scenario. */
    static final class Run {
        final String normale, difficile;
        final List<String> offeredByNormale, offeredByDifficile;
        final Map<String, Double> values;

        Run(BotView v, String preferred) {
            Prefer inNormale = new Prefer(preferred), inDifficile = new Prefer(preferred);
            DifficilePolicy d = new DifficilePolicy(inDifficile, Map.of());
            normale = new LethalAwarePolicy(inNormale).choose(v, v.legalMoves(), new Random(1)).getCard().getName();
            difficile = d.choose(v, v.legalMoves(), new Random(1)).getCard().getName();
            offeredByNormale = names(inNormale.offered);
            offeredByDifficile = names(inDifficile.offered);
            values = new LinkedHashMap<>();
            d.values(v, v.legalMoves()).forEach((m, x) -> values.merge(m.getCard().getName(), x, Math::max));
        }

        static List<String> names(List<LegalMove> moves) {
            return moves.stream().map(m -> m.getCard().getName()).distinct().collect(Collectors.toList());
        }
    }

    /**
     * A shown hit that arrives the turn after. The opponent shows two payable hits, 30 and 12. The bot has 35 health, a Strike
     * and a Guard that halves HIT this turn and the next, both free. Turn 1 alone every move is safe (35 − 30 = 5), so the
     * Normale leaves the style its Strike. Over two turns the worst case is the 30 now and the 12 next turn: after the Strike,
     * 5 left and even a Guard next turn takes 6, down. After the Guard now, 15 and 6, or 6 and 15: 14 left.
     */
    @Test void aShownHitThatArrivesNextTurn() {
        BotView.CardSeen h30 = hit("Big", 30, 2, Map.of()), h12 = hit("Small", 12, 2, Map.of());
        BotView.CardSeen strike = hit("Strike", 15, 2, Map.of());
        BotView v = view(seat("me", Map.of(Resource.HEALTH, 35), List.of()), List.of(strike, guard(Map.of(), 1)), List.of(),
                seat("foe", Map.of(), List.of()), List.of(h30, h12));
        Run r = new Run(v, "Strike");
        // Normale: Strike vs 30 → 5 alive, vs 12 → 23 alive: every move safe, no restriction, the style takes Strike.
        assertEquals(List.of("Strike", "Guard"), r.offeredByNormale);
        assertEquals("Strike", r.normale);
        // Difficile: Strike now, the 30 now (5 left) and the 12 next turn: down even with the Guard then (6): −1.
        // Guard now: halved in both turns, 14 left in the worst order.
        assertEquals(-1.0, r.values.get("Strike"));
        assertTrue(r.values.get("Guard") > -1);
        assertEquals(List.of("Guard"), r.offeredByDifficile);
        assertEquals("Guard", r.difficile);
    }

    /**
     * A token that closes. The bot holds its found «Finisher» (shown, its own copy) and has the vulnerability token ×1.5 on HIT
     * until it plays it. The opponent shows payable hits of 20 and 10; the bot has 45 health. Turn 1 alone every move is safe
     * (45 − 30 = 15), so the Normale leaves the style its Jab. Over two turns, after the Jab the token is still on: the 20 now
     * (30) and the 10 next turn (15) bring it to 0. Playing the Finisher now closes the token at this end of turn: the 10 next
     * turn is 10, 5 left; the other order is 15 now and 20 next turn, 10 left.
     */
    @Test void aTokenThatClosesThisTurn() {
        BotView.CardSeen finisher = hit("Finisher", 10, 2, Map.of()), jab = hit("Jab", 5, 2, Map.of());
        List<BotView.StatusSeen> token = List.of(new BotView.StatusSeen("Vulnerable", "HIT received x1.5", StatusType.BAD,
                StatusFlow.INPUT, false, false, null, 1, 1.5f, "Finisher", DamageType.HIT, 1.5f, null));
        List<BotView.CardSeen> hand = List.of(jab, finisher);
        BotView v = view(seat("me", Map.of(Resource.HEALTH, 45), token), hand, List.of(new BotView.RevealedSeen(1, finisher, 3, 1)),
                seat("foe", Map.of(), List.of()), List.of(hit("Twenty", 20, 2, Map.of()), hit("Ten", 10, 2, Map.of())));
        Run r = new Run(v, "Jab");
        assertEquals(List.of("Jab", "Finisher"), r.offeredByNormale);
        assertEquals("Jab", r.normale);
        assertEquals(-1.0, r.values.get("Jab"));
        assertTrue(r.values.get("Finisher") > -1);
        assertEquals("Finisher", r.difficile);
    }

    /**
     * Poison that matures at the end of the turn. Swig hits for 30 but gives the bot 30 TOXICITY: 15 POISON at each end of turn.
     * With 25 health the Normale sees the first end of turn only (10 left) and, with no threat, leaves the style its Swig. The
     * Difficile sees the second end of turn too: 10 − 15, down whatever the reply, so Swig is worth −1 and it plays the Jab.
     */
    @Test void poisonThatMaturesAtTheEndOfTheNextTurn() {
        BotView.CardSeen swig = card("Swig", 2, Map.of(), Set.of(Card.CardTarget.OPPONENT),
                PrintedEffects.damage(true, DamageType.HIT, 30),
                PrintedEffects.Step.builder().kind(PrintedEffects.Kind.GAIN).onTarget(false).resource(Resource.TOXICITY).base(30).build());
        BotView v = view(seat("me", Map.of(Resource.HEALTH, 25), List.of()), List.of(swig, hit("Jab", 5, 2, Map.of())), List.of(),
                seat("foe", Map.of(), List.of()), List.of());
        Run r = new Run(v, "Swig");
        assertEquals(List.of("Swig", "Jab"), r.offeredByNormale);
        assertEquals("Swig", r.normale);
        assertEquals(-1.0, r.values.get("Swig"));
        assertTrue(r.values.get("Jab") > -1);
        assertEquals("Jab", r.difficile);
    }

    /**
     * A resource that will not be enough to parry next turn. The bot has 40 health and 5 ALERTNESS; Guard and Lunge cost 5
     * ALERTNESS each, the Jab is free. The opponent shows payable hits of 30 and 12. Turn 1 alone every move is safe (40 − 30 =
     * 10), so the Normale leaves the style its Lunge. Over two turns the bot needs one Guard, now or next turn: after the Lunge
     * it can no longer pay it, and the 30 now with the 12 next turn bring it down. After the Jab the Guard is still payable.
     */
    @Test void aResourceThatWillNotBeEnoughToParryNextTurn() {
        Map<Resource, Integer> five = Map.of(Resource.ALERTNESS, 5);
        BotView v = view(seat("me", Map.of(Resource.HEALTH, 40, Resource.ALERTNESS, 5), List.of()),
                List.of(hit("Lunge", 20, 2, five), guard(five, 0), hit("Jab", 5, 2, Map.of())), List.of(),
                seat("foe", Map.of(), List.of()), List.of(hit("Big", 30, 1, Map.of()), hit("Small", 12, 1, Map.of())));
        Run r = new Run(v, "Lunge");
        assertEquals(List.of("Lunge", "Guard", "Jab"), r.offeredByNormale);
        assertEquals("Lunge", r.normale);
        assertEquals(-1.0, r.values.get("Lunge"));
        assertTrue(r.values.get("Jab") > -1 && r.values.get("Guard") > -1);
        assertNotEquals("Lunge", r.difficile);
        assertFalse(r.offeredByDifficile.contains("Lunge"));
    }

    /**
     * The Normale's restriction comes first and is never skipped: a shown 40 brings the bot (35 health) down now unless it
     * plays the Guard, so the Normale offers the style only the Guard. The Difficile values only the moves the restriction
     * keeps and offers the style the same Guard, although the style prefers the Strike.
     */
    @Test void theNormaleRestrictionComesFirst() {
        BotView v = view(seat("me", Map.of(Resource.HEALTH, 35), List.of()), List.of(hit("Strike", 15, 2, Map.of()), guard(Map.of(), 0)),
                List.of(), seat("foe", Map.of(), List.of()), List.of(hit("Huge", 40, 2, Map.of())));
        Run r = new Run(v, "Strike");
        assertEquals(List.of("Guard"), r.offeredByNormale);
        assertEquals(List.of("Guard"), r.offeredByDifficile);
        assertEquals(Set.of("Guard"), r.values.keySet());
        assertEquals("Guard", r.difficile);
    }

    /**
     * Within {@link DifficilePolicy#TIE} the style decides. No threat; free hits of 10, 11, 9 and 8. Two turns of own hits are
     * worth 21 (10 + 11, either order), 20 starting with the 9 and 19 starting with the 8: the 9 is within one and a half points
     * of the best and stays, the 8 does not. The style prefers the 9 and plays it; the Normale plays it too.
     */
    @Test void theStyleBreaksTiesWithinTheThreshold() {
        BotView v = view(seat("me", Map.of(), List.of()), List.of(hit("A", 10, 2, Map.of()), hit("B", 11, 2, Map.of()),
                hit("C", 9, 2, Map.of()), hit("D", 8, 2, Map.of())), List.of(), seat("foe", Map.of(), List.of()), List.of());
        Run r = new Run(v, "C");
        assertEquals("C", r.normale);
        assertEquals(List.of("A", "B", "C"), r.offeredByDifficile);
        assertEquals("C", r.difficile);
        assertEquals(r.values.get("A"), r.values.get("B"), 1e-9);
        assertEquals(0.01, r.values.get("A") - r.values.get("C"), 1e-9);
        assertEquals(0.02, r.values.get("A") - r.values.get("D"), 1e-9);
    }

    /** With the live rules the Difficile is the wrapped style, like the Normale. */
    @Test void liveRulesPassTheHand() {
        BotView d50 = view(seat("me", Map.of(Resource.HEALTH, 25), List.of()), List.of(hit("A", 10, 2, Map.of())), List.of(),
                seat("foe", Map.of(), List.of()), List.of());
        BotView live = new BotView(d50.getTurn(), d50.getSelf(), d50.getOpponents(), d50.getLastRound(), Map.of(), Ruleset.LIVE);
        Prefer style = new Prefer("A");
        assertEquals("A", new DifficilePolicy(style, Map.of()).choose(live, live.legalMoves(), new Random(1)).getCard().getName());
        assertEquals(1, style.offered.size());
    }

    /** D94: the searched cards are read in one place, as a list. */
    @Test void soughtCardsAreAList() {
        BotView.CardSeen search = card("Search", 1, Map.of(), Set.of(Card.CardTarget.SELF),
                PrintedEffects.Step.builder().kind(PrintedEffects.Kind.SEARCH).searchedCard("x.Hit").build());
        assertEquals(List.of("x.Hit"), DifficilePolicy.sought(search));
        assertEquals(List.of(), DifficilePolicy.sought(hit("Jab", 5, 1, Map.of())));
    }

    /**
     * §4 of the design, part 1: the new classes of the bot package import no engine type and no reflection. The folder can be
     * pointed elsewhere ({@code -Db5b.botSources}) only to run the same check on a mutant.
     */
    @Test void newClassesImportNoEngineTypeNorReflection() throws Exception {
        Path root = Path.of(System.getProperty("b5b.botSources", "src/main/java/com/gsc/bm/model/game/bot"));
        java.util.regex.Pattern banned = java.util.regex.Pattern.compile(
                "(?m)^import .*\\b(Game|Player|ComPlayer|Character|Move);|java\\.lang\\.reflect|\\bClass\\.forName\\b|getDeclared");
        for (String name : List.of("DifficilePolicy", "ViewTable")) {
            String source = Files.readString(root.resolve(name + ".java"));
            assertFalse(banned.matcher(source).find(), name);
        }
    }
}
