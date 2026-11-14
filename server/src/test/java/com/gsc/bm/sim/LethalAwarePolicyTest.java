package com.gsc.bm.sim;

import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.bot.*;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

/**
 * D76: the lethal-aware bot on explicit turns built from the draft's cards. Each case states the numbers that decide it; the
 * wrapped policy records the moves it is offered and prefers a given card, so a test sees both the restriction and its effect.
 */
class LethalAwarePolicyTest {

    static Draft draft;

    static final String SUPER_IMPACT = "bruiser.SuperImpact", SGOMMATA = "base.mara.Sgommata", CINGHIATA = "base.mara.CinghiataDiTraverso",
            PARAURTI = "base.mara.TraDueParaurti", SLALOM = "base.mara.Slalom", SPINTONE = "base.com.Spintone",
            FASCIATURA = "base.com.FasciaturaColFazzolettaccio", TARTARUGA = "base.com.TartarugaSulMarciapiede",
            YOU_STOP = "bruiser.YouStop";

    @BeforeAll static void load() throws Exception { draft = Draft.fromClasspath("/set-base/bozza.json"); }

    static BotView.CardSeen card(String binding) { return BotView.publicText(draft.card(binding)); }

    static String name(String binding) { return card(binding).getName(); }

    /** A card that cannot describe itself, read only from its nominal text, like a live Java card. */
    static BotView.CardSeen unknown(String name, String amount, int priority) {
        return new BotView.CardSeen(name, name, false, false, false, false, priority, Set.of(Card.CardTarget.OPPONENT), Map.of(),
                "DAMAGE", "—", "HIT", amount, false, null);
    }

    static List<BotView.StatusSeen> token() {
        List<BotView.StatusSeen> token = new ArrayList<>();
        for (Damage.DamageType type : Damage.DamageType.values())
            token.add(new BotView.StatusSeen("Vulnerable", "", StatusType.BAD, StatusFlow.INPUT, false, false, null, 1, 1.5f,
                    "X", type, 1.5f, null));
        return token;
    }

    static BotView.Seat seat(String id, int health, int alertness, int violence, int alcohol, List<BotView.StatusSeen> statuses) {
        Map<Resource, Integer> r = new EnumMap<>(Resource.class);
        r.put(Resource.HEALTH, health); r.put(Resource.ALERTNESS, alertness); r.put(Resource.VIOLENCE, violence);
        r.put(Resource.TOXICITY, 0); r.put(Resource.ALCOHOL, alcohol);
        return new BotView.Seat(id, id, false, false, r, Set.of(), statuses, List.of(), 1, List.of());
    }

    static BotView view(BotView.Seat me, List<String> hand, BotView.Seat foe, List<BotView.CardSeen> shown, Ruleset rules) {
        List<BotView.RevealedSeen> revealed = new ArrayList<>();
        for (BotView.CardSeen c : shown) revealed.add(new BotView.RevealedSeen(revealed.size() + 1, c, 3, null));
        return new BotView(4, new BotView.Self(me, hand.stream().map(LethalAwarePolicyTest::card).collect(Collectors.toList()), 10, List.of()),
                List.of(new BotView.Opponent(foe, 5, 10, revealed)), List.of(), Map.of(), rules);
    }

    static BotView view(BotView.Seat me, List<String> hand, BotView.Seat foe, List<BotView.CardSeen> shown) {
        return view(me, hand, foe, shown, Ruleset.D50);
    }

    /** The wrapped policy: records the moves offered and takes the preferred card if offered, else the first move. */
    static final class Record implements BotPolicy {
        final String prefer;
        List<LegalMove> offered;

        Record(String preferBinding) { this.prefer = name(preferBinding); }

        @Override public LegalMove choose(BotView view, List<LegalMove> legal, Random random) {
            offered = legal;
            return legal.stream().filter(m -> m.getCard().getName().equals(prefer)).findFirst().orElse(legal.get(0));
        }

        Set<String> names() { return offered.stream().map(m -> m.getCard().getName()).collect(Collectors.toCollection(TreeSet::new)); }
    }

    /** The card the policy plays, its pool recorded; asserts that every style chooses the same card when the pool is a single card. */
    static Record run(BotView v, String prefer) {
        Record record = new Record(prefer);
        new LethalAwarePolicy(record).choose(v, v.legalMoves(), new Random(1));
        return record;
    }

    static void everyStylePlays(BotView v, String binding) {
        for (BotPolicy style : List.of(new AggressivePolicy(), new PrudentPolicy(), new ResourceAwarePolicy(), new RandomPolicy()))
            for (long seed = 0; seed < 5; seed++)
                assertEquals(name(binding), new LethalAwarePolicy(new SoughtHitPolicy(style, SoughtHitPolicy.Timing.ALWAYS))
                        .choose(v, v.legalMoves(), new Random(seed)).getCard().getName(), style.getClass().getSimpleName());
    }

    static Set<String> names(String... bindings) {
        return Arrays.stream(bindings).map(LethalAwarePolicyTest::name).collect(Collectors.toCollection(TreeSet::new));
    }

    static Set<String> all(BotView v) { return v.legalMoves().stream().map(m -> m.getCard().getName()).collect(Collectors.toCollection(TreeSet::new)); }

    // --- 1. Defence -------------------------------------------------------------------------------------------------------

    /** HIT 34 shown (D90, was 30 in D82 and 40 before) and payable (V 30 ≥ 25) against 25 health: only «Tra due paraurti» (×0.4, priority 2) keeps Mara up. */
    @Test void parriesAShownLethalHit() {
        BotView v = view(seat("me", 25, 30, 0, 0, List.of()), List.of(CINGHIATA, SGOMMATA, PARAURTI, SPINTONE),
                seat("foe", 60, 20, 30, 0, List.of()), List.of(card(SUPER_IMPACT)));
        assertEquals(names(PARAURTI), run(v, CINGHIATA).names());
        everyStylePlays(v, PARAURTI);
    }

    /** The same hit with V 20 cannot be paid: no threat, every move offered. */
    @Test void aShownHitThatCannotBePaidChangesNothing() {
        BotView v = view(seat("me", 25, 30, 0, 0, List.of()), List.of(CINGHIATA, SGOMMATA, PARAURTI, SPINTONE),
                seat("foe", 60, 20, 20, 0, List.of()), List.of(card(SUPER_IMPACT)));
        assertEquals(all(v), run(v, CINGHIATA).names());
    }

    /** At 40 health HIT 34 (D90) is not lethal: nothing changes. With the own token (×1.5) it is 51: parry. */
    @Test void theOwnTokenMakesTheShownHitLethal() {
        BotView plain = view(seat("me", 40, 30, 0, 0, List.of()), List.of(CINGHIATA, PARAURTI, SPINTONE),
                seat("foe", 60, 20, 30, 0, List.of()), List.of(card(SUPER_IMPACT)));
        assertEquals(all(plain), run(plain, CINGHIATA).names());
        BotView exposed = view(seat("me", 40, 30, 0, 0, token()), List.of(CINGHIATA, PARAURTI, SPINTONE),
                seat("foe", 60, 20, 30, 0, List.of()), List.of(card(SUPER_IMPACT)));
        assertEquals(names(PARAURTI), run(exposed, CINGHIATA).names());
    }

    /** ALCOHOL 40 absorbs 10 HIT (L/4): 24 of the HIT 34 (D90) against 25 health is not lethal, against 20 it is. */
    @Test void theAlcoholArmourIsCounted() {
        BotView armoured = view(seat("me", 25, 30, 0, 40, List.of()), List.of(CINGHIATA, PARAURTI, SPINTONE),
                seat("foe", 60, 20, 30, 0, List.of()), List.of(card(SUPER_IMPACT)));
        assertEquals(all(armoured), run(armoured, CINGHIATA).names());
        BotView short_ = view(seat("me", 20, 30, 0, 40, List.of()), List.of(CINGHIATA, PARAURTI, SPINTONE),
                seat("foe", 60, 20, 30, 0, List.of()), List.of(card(SUPER_IMPACT)));
        assertEquals(names(PARAURTI), run(short_, CINGHIATA).names());
    }

    /** «Sgommata» (priority 1) brings the author (25 health) down before its HIT 34 (priority 0): hitting first is safe and kills. */
    @Test void hitsFirstWhenItsGroupComesFirstAndKills() {
        BotView v = view(seat("me", 35, 30, 0, 0, List.of()), List.of(CINGHIATA, SGOMMATA, PARAURTI, SPINTONE),
                seat("foe", 25, 20, 30, 0, List.of()), List.of(card(SUPER_IMPACT)));
        assertEquals(names(SGOMMATA), run(v, PARAURTI).names());
        everyStylePlays(v, SGOMMATA);
    }

    /** «Fai basta» (priority 2) voids the later HIT 34 (D90). */
    @Test void countersTheShownHit() {
        BotView v = view(seat("me", 30, 20, 10, 0, List.of()), List.of(YOU_STOP, SPINTONE),
                seat("foe", 60, 20, 30, 0, List.of()), List.of(card(SUPER_IMPACT)));
        assertEquals(names(YOU_STOP), run(v, SPINTONE).names());
        everyStylePlays(v, YOU_STOP);
    }

    /**
     * Uncertain order: «Fasciatura» (+8 HEALTH, priority 0) in the same group as HIT 34 (D90; priority 0, ALERTNESS 20 both). Healing
     * after the blow saves (0 → 8, D48), before it does not (18 − 34): unsure, still better than the sure fall of «Spintone».
     * With the author faster (ALERTNESS 21) the heal surely comes after: the same choice, now safe.
     */
    @Test void aHealInTheSameGroupIsUnsureButPreferred() {
        BotView tied = view(seat("me", 10, 20, 0, 0, List.of()), List.of(FASCIATURA, SPINTONE),
                seat("foe", 60, 20, 30, 0, List.of()), List.of(card(SUPER_IMPACT)));
        assertEquals(names(FASCIATURA), run(tied, SPINTONE).names());
        BotView faster = view(seat("me", 10, 20, 0, 0, List.of()), List.of(FASCIATURA, SPINTONE),
                seat("foe", 60, 21, 30, 0, List.of()), List.of(card(SUPER_IMPACT)));
        assertEquals(names(FASCIATURA), run(faster, SPINTONE).names());
    }

    /**
     * Uncertain amount: a card that cannot describe itself, «HIT 20+x», is read as 20 to 30. At 25 health it may be lethal:
     * the parry (8 to 12) is surely safe and preferred. At 35 health it is not lethal in any reading: nothing changes.
     */
    @Test void anUnknownVariableHitIsReadAsARange() {
        BotView.CardSeen blow = unknown("Colpo ignoto", "HIT 20+x", 1);
        BotView risky = view(seat("me", 25, 30, 0, 0, List.of()), List.of(CINGHIATA, PARAURTI, SPINTONE),
                seat("foe", 60, 20, 30, 0, List.of()), List.of(blow));
        assertEquals(names(PARAURTI), run(risky, CINGHIATA).names());
        BotView safe = view(seat("me", 35, 30, 0, 0, List.of()), List.of(CINGHIATA, PARAURTI, SPINTONE),
                seat("foe", 60, 20, 30, 0, List.of()), List.of(blow));
        assertEquals(all(safe), run(safe, CINGHIATA).names());
    }

    /**
     * Uncertain search: «Slalom» (priority 2) would put the token on Mara before HIT 34 (D90) if it finds «Sgommata» (51 against
     * 40 health), not if it misses. Unsure against the sure safety of the other moves: it is left out.
     */
    @Test void aChargeThatWouldExposeToTheShownHitIsLeftOut() {
        BotView v = view(seat("me", 40, 20, 0, 0, List.of()), List.of(SLALOM, CINGHIATA, SPINTONE),
                seat("foe", 60, 20, 30, 0, List.of()), List.of(card(SUPER_IMPACT)));
        Record record = run(v, SLALOM);
        assertEquals(names(CINGHIATA, SPINTONE), record.names());
    }

    // --- 2. Attack --------------------------------------------------------------------------------------------------------

    /** «Sgommata» CUT 25 against 30 health is not lethal; with the opponent's token (×1.5) it is 37: played by every style. */
    @Test void playsTheHitThatTheOpponentsTokenMakesLethal() {
        BotView plain = view(seat("me", 70, 20, 0, 0, List.of()), List.of(SGOMMATA, CINGHIATA, PARAURTI),
                seat("foe", 30, 20, 0, 0, List.of()), List.of());
        assertEquals(all(plain), run(plain, PARAURTI).names());
        BotView exposed = view(seat("me", 70, 20, 0, 0, List.of()), List.of(SGOMMATA, CINGHIATA, PARAURTI),
                seat("foe", 30, 20, 0, 0, token()), List.of());
        assertEquals(names(SGOMMATA), run(exposed, PARAURTI).names());
        everyStylePlays(exposed, SGOMMATA);
    }

    /** Armour on the target: HIT 34 (D90, was 30) minus L 20/4 is 29, lethal at 29 health, not at 30 (D90: were 25 and 26). */
    @Test void theTargetsArmourIsCounted() {
        BotView lethal = view(seat("me", 70, 20, 30, 0, List.of()), List.of(SUPER_IMPACT, SPINTONE, TARTARUGA),
                seat("foe", 29, 20, 0, 20, List.of()), List.of());
        assertEquals(names(SUPER_IMPACT), run(lethal, TARTARUGA).names());
        BotView short_ = view(seat("me", 70, 20, 30, 0, List.of()), List.of(SUPER_IMPACT, SPINTONE, TARTARUGA),
                seat("foe", 30, 20, 0, 20, List.of()), List.of());
        assertEquals(all(short_), run(short_, TARTARUGA).names());
    }

    /**
     * Known order: the opponent's «Sgommata» (priority 1) comes before HIT 34 (priority 0, D90) and brings the bot (20 health) down,
     * so its own lethal hit (34 against 30) would be voided. The parry («Tartaruga», ×0.6 then 15 against 23) is chosen instead.
     */
    @Test void aLethalHitThatComesTooLateIsNotPlayed() {
        BotView v = view(seat("me", 20, 20, 30, 0, List.of()), List.of(SUPER_IMPACT, TARTARUGA, SPINTONE),
                seat("foe", 30, 40, 0, 0, List.of()), List.of(card(SGOMMATA)));
        assertEquals(names(TARTARUGA), run(v, SUPER_IMPACT).names());
        everyStylePlays(v, TARTARUGA);
    }

    /** Same group, both hits lethal, no defence: the bot falls whatever it does, so it takes the draw rather than the loss. */
    @Test void takesTheDrawWhenItFallsAnyway() {
        BotView v = view(seat("me", 20, 30, 0, 0, List.of()), List.of(SGOMMATA, CINGHIATA, SPINTONE),
                seat("foe", 25, 30, 0, 0, List.of()), List.of(card(SGOMMATA)));
        assertEquals(names(SGOMMATA), run(v, SPINTONE).names());
    }

    /** Uncertain kill: «HIT 20+x» from a card that cannot describe itself, against 25 health, may not kill: nothing forced. */
    @Test void anUncertainKillIsNotForced() {
        BotView.CardSeen blow = unknown("Colpo ignoto", "HIT 20+x", 1);
        BotView v = new BotView(4, new BotView.Self(seat("me", 70, 20, 0, 0, List.of()), List.of(blow, card(SPINTONE)), 10, List.of()),
                List.of(new BotView.Opponent(seat("foe", 25, 20, 0, 0, List.of()), 5, 10, List.of())), List.of(), Map.of(), Ruleset.D50);
        assertEquals(all(v), run(v, SPINTONE).names());
    }

    // --- 3. Elsewhere, today's behaviour ----------------------------------------------------------------------------------

    @Test void theLiveRulesAreUntouched() {
        BotView v = view(seat("me", 25, 30, 0, 0, List.of()), List.of(CINGHIATA, SGOMMATA, PARAURTI, SPINTONE),
                seat("foe", 60, 20, 30, 0, List.of()), List.of(card(SUPER_IMPACT)), Ruleset.LIVE);
        Record record = run(v, CINGHIATA);
        assertSame(record.offered.size(), v.legalMoves().size());
        assertEquals(all(v), record.names());
    }

    /** Every card of the draft that deals damage, parries or counters is read from its printed numbers, not guessed. */
    @Test void everyDraftCardIsReadable() {
        for (String binding : draft.cardBindings()) {
            BotView.CardSeen seen = card(binding);
            if (seen.nominalDamage() > 0) {
                assertNotNull(seen.getEffects(), binding);
                assertTrue(seen.getEffects().getSteps().stream().anyMatch(s -> s.getKind() == PrintedEffects.Kind.DAMAGE && s.isOnTarget()), binding);
            }
            if ("DEFENSE".equals(seen.getRole()))
                assertTrue(seen.getEffects().getSteps().stream().anyMatch(s -> s.getKind() == PrintedEffects.Kind.STATUS), binding);
            if ("COUNTER".equals(seen.getRole()))
                assertTrue(seen.getEffects().getSteps().stream().anyMatch(s -> s.getKind().name().startsWith("COUNTER")), binding);
        }
    }
}
