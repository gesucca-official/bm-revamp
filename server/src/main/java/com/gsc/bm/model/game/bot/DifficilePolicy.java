package com.gsc.bm.model.game.bot;

import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Random;
import java.util.Set;

/**
 * D85/D91, SB-30b B5b, playground rules only: the Difficile. It sees what the Normale sees (no covered hand, no draw, no pending
 * move, D77 point 4) and looks two turns ahead on a {@link ViewTable} in forecast mode.
 * <ol>
 *   <li>First the Normale's restriction of the current turn, unchanged ({@link TurnForecast#prefer}): safe first, a surely lethal
 *       hit if there is one, a draw rather than a loss (D77).</li>
 *   <li>Among the moves left, the value of an own move m1 is the worst case over the public threats of turn 1 (each hit an
 *       opponent shows face up and can pay, plus «no known move») and over the variants (order in a tied speed group, searches
 *       found or not), of the best own reply m2 from the hand left (plus the card found, when the variant says so), itself valued
 *       at its worst case over the threats shown at turn 2 and their variants.</li>
 *   <li>The value at the end of the horizon is {@link #evaluate}: simple, with declared weights; tuning is B6.</li>
 *   <li>The wrapped style breaks ties among the moves within {@link #TIE} of the best, so the personality stays.</li>
 * </ol>
 * It draws nothing from the Random itself; the wrapped style does, as with the Normale. With the live rules it is the wrapped
 * policy, like {@link LethalAwarePolicy}.
 * <p>
 * The catalog is the public text of the set's cards by binding: what a searched card does once found, the item a consumed one
 * creates. It is not hidden information. It is not Serializable (card text is not), so a game holding this policy cannot be
 * copied with Java serialization: the live wiring (SB-30a/SB-28) will pass it from a factory.
 */
public final class DifficilePolicy implements BotPolicy {

    /** Weight of one point of health difference at the horizon (§2.6 of the design: difference / 100). */
    static final double W_HEALTH = 0.01;
    /** Weight of one point of POISON that the TOXICITY held will deal at the next end of turn: worth a point of health. */
    static final double W_POISON = 0.01;
    /** Weight of each payable hit shown face up at the horizon, against the bot (negative) or by the bot (positive). */
    static final double W_SHOWN = 0.03;
    /** Weight of each vulnerability token at the horizon, on the bot (negative) or on an opponent (positive). */
    static final double W_TOKEN = 0.02;
    /** Weight of each distinct own card the bot will be able to pay at the next turn. */
    static final double W_PLAYABLE = 0.005;
    /** A position not over is worth at most this much, below a win (+1) and above a loss (−1). */
    static final double CLIP = 0.95;
    /** Moves valued within this of the best (one and a half points of health) are left to the style. */
    static final double TIE = 0.015;

    private final BotPolicy inner;
    private final Map<String, BotView.CardSeen> catalog;

    public DifficilePolicy(BotPolicy inner, Map<String, BotView.CardSeen> catalog) {
        this.inner = Objects.requireNonNull(inner);
        this.catalog = Map.copyOf(catalog);
    }

    public BotPolicy inner() { return inner; }

    /** For the match archive: the wrapped policy's name inside this one's. */
    public String archiveName() {
        String name = inner instanceof SoughtHitPolicy ? ((SoughtHitPolicy) inner).archiveName() : inner.getClass().getSimpleName();
        return "DifficilePolicy(" + name + ")";
    }

    @Override
    public LegalMove choose(BotView view, List<LegalMove> legalMoves, Random random) {
        if (!view.getRuleset().playground()) return inner.choose(view, legalMoves, random);
        return inner.choose(view, kept(view, values(view, legalMoves)), random);
    }

    /**
     * The value of every move left by the Normale's restriction, in the order given; the moves the restriction drops are absent.
     * Public so that a test can compare two decisions value by value.
     */
    public Map<LegalMove, Double> values(BotView view, List<LegalMove> legalMoves) {
        List<LegalMove> pool = TurnForecast.prefer(view, legalMoves);
        Map<LegalMove, Double> values = new LinkedHashMap<>();
        if (pool.size() == 1) { values.put(pool.get(0), 0.0); return values; }
        String me = view.getSelf().getSeat().getPlayerId();
        ViewTable base = ViewTable.forecast(view, catalog);
        List<ViewTable.Play> threats = threats(view);
        for (LegalMove m1 : pool) values.put(m1, worstOverThreats(base, ViewTable.Play.of(me, m1), threats, me, true));
        return values;
    }

    /** The moves left to the style: those within {@link #TIE} of the best value. */
    static List<LegalMove> kept(BotView view, Map<LegalMove, Double> values) {
        double best = Collections.max(values.values());
        List<LegalMove> kept = new ArrayList<>();
        values.forEach((m, v) -> { if (v >= best - TIE) kept.add(m); });
        return kept;
    }

    /**
     * The worst case over the public threats (and «no known move») and the variants of one turn played from {@code table}. At
     * turn 1 each outcome still standing is valued by the best own reply; at turn 2 by {@link #evaluate}.
     */
    private double worstOverThreats(ViewTable table, ViewTable.Play mine, List<ViewTable.Play> threats, String me, boolean first) {
        double worst = Double.POSITIVE_INFINITY;
        List<ViewTable.Play> cases = new ArrayList<>(threats);
        cases.add(null);
        for (ViewTable.Play threat : cases) {
            List<ViewTable.Play> plays = Arrays.asList(mine, threat);
            for (ViewTable.Flags flags : variants(table, plays)) {
                ViewTable next = table.copy();
                next.playTurn(plays, flags);
                double value = first && !next.over() ? bestReply(next, me) : evaluate(next, me);
                if (value < worst) worst = value;
            }
        }
        return worst;
    }

    /** Turn 2: the best own reply from the hand known after turn 1, each at its worst case; a void move if none is legal. */
    private double bestReply(ViewTable table, String me) {
        BotView view = table.view(me);
        List<ViewTable.Play> threats = threats(view);
        List<LegalMove> replies = view.legalMoves();
        if (replies.isEmpty()) return worstOverThreats(table, null, threats, me, false);
        double best = Double.NEGATIVE_INFINITY;
        for (LegalMove m2 : replies) {
            double value = worstOverThreats(table, ViewTable.Play.of(me, m2), threats, me, false);
            if (value > best) best = value;
        }
        return best;
    }

    /** The hits shown face up and payable now, aimed at the bot: the Normale's threats ({@link TurnForecast#threats}). */
    private static List<ViewTable.Play> threats(BotView view) {
        List<ViewTable.Play> plays = new ArrayList<>();
        for (TurnForecast.Threat t : TurnForecast.threats(view))
            plays.add(new ViewTable.Play(t.author.getPlayerId(), t.card, t.target, null, t.item));
        return plays;
    }

    /**
     * The variants of one turn worth playing: the order inside a tied speed group always, a search found or not only for a seat
     * whose move searches for a card the catalog describes (otherwise «found» would change nothing, or have no text to play).
     */
    private List<ViewTable.Flags> variants(ViewTable table, List<ViewTable.Play> plays) {
        String first = table.sides.keySet().iterator().next();
        boolean firstSearches = false, secondSearches = false;
        for (ViewTable.Play p : plays) {
            if (p == null || !searchesKnown(p.card)) continue;
            if (p.seat.equals(first)) firstSearches = true; else secondSearches = true;
        }
        List<ViewTable.Flags> variants = new ArrayList<>();
        for (boolean order : new boolean[]{true, false})
            for (boolean f1 : firstSearches ? new boolean[]{false, true} : new boolean[]{false})
                for (boolean f2 : secondSearches ? new boolean[]{false, true} : new boolean[]{false})
                    variants.add(new ViewTable.Flags(order, f1, f2));
        return variants;
    }

    private boolean searchesKnown(BotView.CardSeen card) {
        List<String> sought = sought(card);
        if (sought.isEmpty()) return false;
        for (String binding : sought) if (!catalog.containsKey(binding)) return false;
        return true;
    }

    /**
     * D94: the one place that reads what a card's search looks for, as bindings. Today a search names one card; the «Annuncia» of
     * the 1.6 proposal will name up to two, and this returns them all. The rest of the policy never assumes a single name.
     */
    static List<String> sought(BotView.CardSeen card) {
        if (card.getEffects() == null) return List.of();
        List<String> sought = new ArrayList<>();
        for (PrintedEffects.Step step : card.getEffects().getSteps())
            if (step.getKind() == PrintedEffects.Kind.SEARCH && step.getSearchedCard() != null) sought.add(step.getSearchedCard());
        return sought;
    }

    /**
     * §2.6, kept simple, for the bot {@code me}: +1 if every opponent is down and the bot is not, −1 if the bot is down and some
     * opponent is not, 0 if all are down. Otherwise, clipped to ±{@link #CLIP}: health difference against the healthiest opponent
     * still up, the POISON due at the next end of turn, payable hits shown face up, vulnerability tokens, and own cards payable
     * at the next turn, with the weights above. ALCOHOL is played by the table within the horizon (armour, ALERTNESS) and not
     * valued beyond it.
     */
    static double evaluate(ViewTable table, String me) {
        ViewTable.Side self = table.sides.get(me);
        boolean anyFoeUp = false, anyFoe = false;
        ViewTable.Side strongest = null;
        for (ViewTable.Side s : table.sides.values()) {
            if (s == self) continue;
            anyFoe = true;
            if (!s.down()) {
                anyFoeUp = true;
                if (strongest == null || s.get(Resource.HEALTH) > strongest.get(Resource.HEALTH)) strongest = s;
            }
        }
        if (self.down()) return anyFoeUp ? -1 : 0;
        if (anyFoe && !anyFoeUp) return 1;
        if (strongest == null) return CLIP;
        double value = W_HEALTH * (self.get(Resource.HEALTH) - strongest.get(Resource.HEALTH))
                - W_POISON * poisonDue(self) + W_POISON * poisonDue(strongest)
                - W_SHOWN * shownHits(strongest) + W_SHOWN * shownHits(self)
                - W_TOKEN * tokens(self) + W_TOKEN * tokens(strongest)
                + W_PLAYABLE * playable(self);
        return Math.max(-CLIP, Math.min(CLIP, value));
    }

    private static int poisonDue(ViewTable.Side s) {
        return s.immunities.contains(Resource.TOXICITY) ? 0 : s.get(Resource.TOXICITY) / 2;
    }

    /** Hits shown face up in this seat's hand (its found copies) that it can pay. */
    private static int shownHits(ViewTable.Side s) {
        int n = 0;
        BotView.Seat seat = null;
        for (ViewTable.Mark m : s.marks) {
            if (m.card == null || !s.holds(m.card) || !m.card.getCanTarget().contains(Card.CardTarget.OPPONENT) || !hits(m.card)) continue;
            if (seat == null) seat = s.seat();
            if (TurnForecast.payable(seat, m.card)) n++;
        }
        return n;
    }

    private static boolean hits(BotView.CardSeen card) {
        if (card.getEffects() == null) return card.nominalDamage() > 0;
        for (PrintedEffects.Step s : card.getEffects().getSteps())
            if (s.getKind() == PrintedEffects.Kind.DAMAGE && s.isOnTarget()) return true;
        return false;
    }

    private static int tokens(ViewTable.Side s) {
        Set<Integer> ids = new HashSet<>();
        for (ViewTable.Stat t : s.statuses) if (t.exposure != null) ids.add(t.exposure);
        return ids.size();
    }

    /** Distinct own known cards payable now, as {@link TurnForecast#payable} decides. */
    private static int playable(ViewTable.Side s) {
        if (!s.handKnown || s.hand.isEmpty()) return 0;
        BotView.Seat seat = s.seat();
        Set<String> names = new HashSet<>();
        for (BotView.CardSeen c : s.hand) if (TurnForecast.payable(seat, c)) names.add(c.getName());
        return names.size();
    }
}
