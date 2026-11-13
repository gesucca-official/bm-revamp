package com.gsc.bm.model.game.bot;

import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;

class SoughtHitPolicyTest {
    private static BotView.CardSeen card(String name, int damage) {
        return new BotView.CardSeen(name, name, false, false, false, false, 1, Set.of(Card.CardTarget.OPPONENT),
                Map.of(), "DAMAGE", "—", "HIT", "HIT " + damage, false, null);
    }
    private static BotView.Seat seat(String id, boolean token) {
        return new BotView.Seat(id, id, false, false, Map.of(Resource.HEALTH, 100), Set.of(), token
                ? List.of(new BotView.StatusSeen("Vulnerable", "", StatusType.BAD, StatusFlow.INPUT, false, false,
                null, 1, 1.5f, "Announced", null, null, null)) : List.of(), List.of(), 0, List.of());
    }
    private static BotView view(boolean defended, boolean shown, Ruleset rules) {
        return new BotView(5, new BotView.Self(seat("me", true), List.of(card("Other", 5), card("Announced", 20)), 5, List.of()),
                List.of(new BotView.Opponent(seat("a", false), 6, 5, shown
                        ? List.of(new BotView.RevealedSeen(2, card("Visible", 40), 1, null)) : List.of()),
                        new BotView.Opponent(seat("b", true), 6, 5, List.of())),
                defended ? List.of(new BotView.SeenMove("a", "Parry", "SELF", false, Map.of(), Map.of(), null, null, null, "DEFENSE"))
                        : List.of(), Map.of(), rules);
    }
    private static List<LegalMove> legal(BotView v) { return v.legalMoves(); }
    private static final BotPolicy FIRST = (v, moves, random) -> moves.get(0);

    @Test void timingsUseTheTokenAndOnlyThePreviousPublicDefense() {
        BotView v = view(true, false, Ruleset.D50);
        assertEquals("Announced", new SoughtHitPolicy(FIRST, SoughtHitPolicy.Timing.ALWAYS).choose(v, legal(v), new Random(1)).getCard().getName());
        assertEquals("Other", new SoughtHitPolicy(FIRST, SoughtHitPolicy.Timing.HOLD_IF_DEFENDED).choose(v, legal(v), new Random(1)).getCard().getName());
        BotView noParry = view(false, false, Ruleset.D50);
        assertEquals("Announced", new SoughtHitPolicy(FIRST, SoughtHitPolicy.Timing.HOLD_IF_DEFENDED).choose(noParry, legal(noParry), new Random(1)).getCard().getName());
        Set<String> choices = new HashSet<>(); Random random = new Random(7);
        BotPolicy coin = new SoughtHitPolicy(FIRST, SoughtHitPolicy.Timing.RANDOM);
        for (int i = 0; i < 100; i++) choices.add(coin.choose(v, legal(v), random).getCard().getName());
        assertEquals(Set.of("Other", "Announced"), choices);
        assertEquals(coin.choose(v, legal(v), new Random(71)), coin.choose(v, legal(v), new Random(71)));
    }

    @Test void theSameAttackPrefersTheExposedFfaTargetAndLiveIsUnchanged() {
        for (Ruleset rules : Ruleset.values()) {
            BotView v = view(false, false, rules);
            LegalMove m = new SoughtHitPolicy(FIRST, SoughtHitPolicy.Timing.ALWAYS).choose(v, legal(v), new Random(1));
            assertEquals(rules.playground() ? "b" : "a", m.getTargetId());
            assertEquals(rules.playground() ? "Announced" : "Other", m.getCard().getName());
        }
    }

    @Test void aStillRevealedCardIsReadAfterSeveralRoundsAndADiscardedOneIsNot() {
        BotView shown = view(false, true, Ruleset.D50), hidden = view(false, false, Ruleset.D50);
        StyleSupport.Situation a = new StyleSupport.Situation(shown), b = new StyleSupport.Situation(hidden);
        assertTrue(StyleSupport.charged(a, shown.getOpponents().get(0).getSeat()));
        assertFalse(StyleSupport.charged(b, hidden.getOpponents().get(0).getSeat()));
        assertEquals("Visible", a.found(shown.getOpponents().get(0).getSeat()).get(0).getName());
        StyleSupport.Plan exposed = new StyleSupport.Plan(a, new LegalMove(card("Attack", 10), "b", null, null));
        StyleSupport.Plan normal = new StyleSupport.Plan(a, new LegalMove(card("Attack", 10), "a", null, null));
        assertTrue(StyleSupport.rhythm(a, exposed) > StyleSupport.rhythm(a, normal));
    }
}
