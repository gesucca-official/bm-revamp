package com.gsc.bm.model.game.bot;

import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.status.Status;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;

import java.util.ArrayList;
import java.util.Collection;
import java.util.EnumMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * D76, playground rules only: a forecast of the current turn from public information, to see whether a shown hit would bring
 * this bot down and whether one of its own hits brings an opponent down. It plays on copies of the view the bot's move and, at
 * most, one opposing move: a hit shown face up in an opponent's hand that its owner can pay now, assumed aimed at the bot. It
 * never reads a covered hand, a deck or a pending move, and it does not look beyond the end of this turn.
 * <p>
 * It follows the rules of {@code d50} as the engine applies them: costs first, speed groups by priority and ALERTNESS after
 * costs, an author down when its group starts does nothing except on itself or with «Ultimo colpo», statuses applied in order
 * with the engine's truncation, ALCOHOL armour L/4 on HIT, every resource floored at zero, the search after the move (token only
 * if found, D71–D72), counters, and the periodic POISON of TOXICITY at the end of the turn.
 * <p>
 * Where public information does not settle the outcome it plays every variant: the order inside the same speed group (decided
 * by seat order, which a bot does not use), whether its own search finds the card, the unknown part of a card that cannot
 * describe itself. An outcome holds «surely» only if it holds in every variant.
 */
public final class TurnForecast {

    /** Weight of a variable amount a card cannot state, as in {@link StyleSupport#VARIABLE}; the high variant doubles it. */
    static final int UNKNOWN_X = 2 * (int) StyleSupport.VARIABLE;

    /** Whether the bot is still up at the end of the turn: in no variant, in some, in every one. */
    enum Safety { DOWN, UNSURE, SAFE }

    /**
     * An opposing move: for the bot, a hit shown face up in an opponent's hand, payable now by its owner and aimed at the bot.
     * Public so that a test can replay a whole turn with the move actually played ({@code target} "SELF" or a seat id).
     */
    public static final class Threat {
        final BotView.Seat author;
        final BotView.CardSeen card;
        final String target;
        final String item;

        public Threat(BotView.Seat author, BotView.CardSeen card, String target, String item) {
            this.author = author;
            this.card = card;
            this.target = target;
            this.item = item;
        }
    }

    /** The forecast of one own move: its safety and the opponents surely down at the end of the turn. */
    static final class Outcome {
        final Safety safety;
        final Set<String> surelyDown;

        Outcome(Safety safety, Set<String> surelyDown) {
            this.safety = safety;
            this.surelyDown = surelyDown;
        }
    }

    private TurnForecast() { }

    /**
     * The moves a lethal-aware bot keeps, the others never chosen:
     * <ol>
     *   <li>if an opponent shows a payable hit and the moves do not all leave the bot equally safe, only the safest (parry,
     *       counter, heal, or a hit that comes first and brings the author down);</li>
     *   <li>among those, if some surely bring an opponent down who would not be down anyway, only those that are as safe as the
     *       safest move left.</li>
     * </ol>
     * Otherwise the given moves, unchanged.
     */
    static List<LegalMove> prefer(BotView view, List<LegalMove> legal) {
        List<Threat> threats = threats(view);
        Map<LegalMove, Outcome> outcomes = new LinkedHashMap<>();
        for (LegalMove move : legal) outcomes.put(move, of(view, move, threats));
        List<LegalMove> pool = new ArrayList<>(legal);
        if (!threats.isEmpty()) {
            Safety best = best(outcomes, pool);
            if (pool.stream().anyMatch(m -> outcomes.get(m).safety != best)) pool.removeIf(m -> outcomes.get(m).safety != best);
        }
        Set<String> anyway = of(view, null, threats).surelyDown;
        Safety top = best(outcomes, pool);
        List<LegalMove> kills = pool.stream().filter(m -> outcomes.get(m).safety == top
                && outcomes.get(m).surelyDown.stream().anyMatch(id -> !anyway.contains(id))).collect(Collectors.toList());
        return kills.isEmpty() ? pool : kills;
    }

    private static Safety best(Map<LegalMove, Outcome> outcomes, Collection<LegalMove> moves) {
        return moves.stream().map(m -> outcomes.get(m).safety).max(Enum::compareTo).orElse(Safety.DOWN);
    }

    /** The hits shown face up in the hands of live opponents that their owners can pay now. */
    static List<Threat> threats(BotView view) {
        List<Threat> threats = new ArrayList<>();
        for (BotView.Opponent o : view.getOpponents()) {
            BotView.Seat seat = o.getSeat();
            if (seat.isDead() || seat.isForfeited() || seat.resource(Resource.HEALTH) <= 0) continue;
            for (BotView.RevealedSeen r : o.getRevealed()) {
                BotView.CardSeen card = r.getCard();
                if (card.getCanTarget().contains(Card.CardTarget.OPPONENT) && hits(card) && payable(seat, card))
                    threats.add(new Threat(seat, card, view.getSelf().getSeat().getPlayerId(), null));
            }
        }
        return threats;
    }

    /**
     * The forecast of an own move (null: the bot does nothing) against each threat; with no threat, against an opponent whose
     * move is unknown and so not played. Safety counts the threats only, when there are any; «surely down» needs every case.
     */
    static Outcome of(BotView view, LegalMove move, List<Threat> threats) {
        String me = view.getSelf().getSeat().getPlayerId();
        Set<String> foes = view.getOpponents().stream().map(BotView.Opponent::getSeat)
                .filter(s -> !s.isDead() && !s.isForfeited() && s.resource(Resource.HEALTH) > 0)
                .map(BotView.Seat::getPlayerId).collect(Collectors.toSet());
        int runs = 0, alive = 0;
        Set<String> surelyDown = new HashSet<>(foes);
        List<Threat> cases = new ArrayList<>(threats);
        cases.add(null);
        for (Threat threat : cases) {
            for (Map<String, Integer> end : variants(view, move, threat)) {
                if (threat != null || threats.isEmpty()) {
                    runs++;
                    if (end.get(me) > 0) alive++;
                }
                surelyDown.removeIf(id -> end.get(id) > 0);
            }
        }
        Safety safety = alive == runs ? Safety.SAFE : alive == 0 ? Safety.DOWN : Safety.UNSURE;
        return new Outcome(safety, Set.copyOf(surelyDown));
    }

    /** The health of every seat at the end of the turn, one map per variant. Public for the fidelity test against the engine. */
    public static List<Map<String, Integer>> variants(BotView view, LegalMove move, Threat threat) {
        boolean searches = move != null && searches(move.getCard());
        boolean theySearch = threat != null && searches(threat.card);
        boolean myX = move != null && unknownX(move.getCard());
        boolean theirX = threat != null && unknownX(threat.card);
        List<Map<String, Integer>> ends = new ArrayList<>();
        for (int bits = 0; bits < 32; bits++) {
            boolean mineFirst = (bits & 1) == 0, found = (bits & 2) != 0, myHigh = (bits & 4) != 0, theirHigh = (bits & 8) != 0,
                    theyFind = (bits & 16) != 0;
            if ((found && !searches) || (myHigh && !myX) || (theirHigh && !theirX) || (theyFind && !theySearch)) continue;
            Turn turn = new Turn(view, move, threat, found, theyFind, myHigh, theirHigh);
            if (!mineFirst && !turn.tied()) continue;
            ends.add(turn.play(mineFirst));
        }
        return ends;
    }

    private static boolean searches(BotView.CardSeen card) {
        return steps(card, false).stream().anyMatch(s -> s.getKind() == PrintedEffects.Kind.SEARCH);
    }

    private static boolean hits(BotView.CardSeen card) {
        if (card.getEffects() == null) return card.nominalDamage() > 0;
        return card.getEffects().getSteps().stream().anyMatch(s -> s.getKind() == PrintedEffects.Kind.DAMAGE && s.isOnTarget());
    }

    /** The owner can pay it now, as {@link BotView#legalMoves()} decides for the own hand (D50, point 2; D73). */
    static boolean payable(BotView.Seat seat, BotView.CardSeen card) {
        for (Map.Entry<Resource, Integer> cost : card.getCost().entrySet())
            if (seat.resource(cost.getKey()) < cost.getValue() && !(card.isLastBlow() && cost.getKey() == Resource.HEALTH)) return false;
        int health = card.getCost().getOrDefault(Resource.HEALTH, 0);
        return health == 0 || card.isLastBlow() || seat.resource(Resource.HEALTH) > health;
    }

    /** A card that cannot describe itself and writes a variable amount: its estimate is uncertain. */
    private static boolean unknownX(BotView.CardSeen card) {
        return card.getEffects() == null && card.nominalDamage() > 0 && card.getDamageAmount() != null
                && card.getDamageAmount().contains("x");
    }

    /** The printed steps, or a single damage read from the nominal text for a card that cannot describe itself. */
    private static List<PrintedEffects.Step> steps(BotView.CardSeen card, boolean high) {
        if (card.getEffects() != null) return card.getEffects().getSteps();
        if (card.nominalDamage() <= 0) return List.of();
        int amount = card.nominalDamage() + (high ? UNKNOWN_X : 0);
        return List.of(PrintedEffects.damage(true, nominalType(card.getDamage()), amount));
    }

    private static Damage.DamageType nominalType(String text) {
        if (text != null) for (Damage.DamageType type : Damage.DamageType.values()) if (text.contains(type.name())) return type;
        return Damage.DamageType.HIT;
    }

    /** A status as the forecast applies it: a multiplier of one damage type. */
    private static final class Multiplier {
        final Damage.DamageType type;
        final StatusFlow flow;
        final StatusType kind;
        final float scale;
        final Damage.DamageType convertTo;

        Multiplier(Damage.DamageType type, StatusFlow flow, StatusType kind, float scale, Damage.DamageType convertTo) {
            this.type = type;
            this.flow = flow;
            this.kind = kind;
            this.scale = scale;
            this.convertTo = convertTo;
        }

        /** As Character.applyStatusToDamage: the type first, then the amount, truncated. */
        Damage.DamageType turn(Damage.DamageType damage) { return convertTo == null ? damage : convertTo; }

        int apply(int amount) { return (int) ((float) amount * scale); }
    }

    /** A seat as copies of its public numbers. */
    private static final class Body {
        final String id;
        final Map<Resource, Integer> res = new EnumMap<>(Resource.class);
        final List<Multiplier> statuses = new ArrayList<>();
        final List<BotView.CardSeen> items;
        boolean toxicImmune;
        final boolean upAtStart;

        Body(BotView.Seat seat) {
            this.id = seat.getPlayerId();
            for (Resource r : Resource.values()) res.put(r, seat.resource(r));
            for (BotView.StatusSeen s : seat.getStatuses())
                if (s.getProperty() != null && s.getScale() != null)
                    statuses.add(new Multiplier(s.getProperty(), s.getFlow(), s.getType(), s.getScale(), s.getConvertTo()));
            this.items = new ArrayList<>(seat.getItems());
            this.toxicImmune = seat.getImmunities().contains(Resource.TOXICITY);
            this.upAtStart = !seat.isDead() && res.get(Resource.HEALTH) > 0;
        }

        int get(Resource r) { return res.get(r); }
        void set(Resource r, int value) { res.put(r, Math.max(0, value)); }
        boolean down() { return res.get(Resource.HEALTH) <= 0; }
    }

    /** One move of the turn. */
    private static final class Act {
        final Body author;
        final Body target;
        final BotView.CardSeen card;
        final String item;
        final List<PrintedEffects.Step> steps;
        final boolean mine;
        long speed;
        boolean voided;

        Act(Body author, Body target, BotView.CardSeen card, String item, List<PrintedEffects.Step> steps, boolean mine) {
            this.author = author;
            this.target = target;
            this.card = card;
            this.item = item;
            this.steps = steps;
            this.mine = mine;
        }
    }

    /** One variant of the turn, played on copies. */
    private static final class Turn {
        final Map<String, Body> bodies = new LinkedHashMap<>();
        final List<Act> acts = new ArrayList<>();
        final boolean found, theyFind;

        Turn(BotView view, LegalMove move, Threat threat, boolean found, boolean theyFind, boolean myHigh, boolean theirHigh) {
            this.found = found;
            this.theyFind = theyFind;
            Body me = new Body(view.getSelf().getSeat());
            bodies.put(me.id, me);
            for (BotView.Opponent o : view.getOpponents()) bodies.put(o.getSeat().getPlayerId(), new Body(o.getSeat()));
            if (move != null) {
                Body target = "SELF".equals(move.getTargetId()) ? me : bodies.getOrDefault(move.getTargetId(), me);
                acts.add(new Act(me, target, move.getCard(), move.getItem(), steps(move.getCard(), myHigh), true));
            }
            if (threat != null) {
                Body author = bodies.get(threat.author.getPlayerId());
                Body target = "SELF".equals(threat.target) ? author : bodies.getOrDefault(threat.target, me);
                acts.add(new Act(author, target, threat.card, threat.item, steps(threat.card, theirHigh), false));
            }
            // R04: every cost first, then the speed groups by priority and ALERTNESS after costs (D50, point 1).
            for (Act act : acts) pay(act);
            for (Act act : acts) act.speed = ((long) act.card.getPriority() << 32) + act.author.get(Resource.ALERTNESS);
        }

        boolean tied() { return acts.size() == 2 && acts.get(0).speed == acts.get(1).speed; }

        Map<String, Integer> play(boolean mineFirst) {
            List<Act> order = new ArrayList<>(acts);
            order.sort((a, b) -> a.speed != b.speed ? Long.compare(b.speed, a.speed)
                    : Boolean.compare(b.mine == mineFirst, a.mine == mineFirst));
            Long group = null;
            Set<Body> downAtGroupStart = new HashSet<>();
            for (int i = 0; i < order.size(); i++) {
                Act act = order.get(i);
                if (group == null || act.speed != group) {
                    group = act.speed;
                    downAtGroupStart.clear();
                    for (Body b : bodies.values()) if (b.down()) downAtGroupStart.add(b);
                }
                if (downAtGroupStart.contains(act.author) && act.target != act.author && !act.card.isLastBlow()) act.voided = true;
                if (!act.voided) resolve(act, order.subList(i + 1, order.size()));
            }
            // End of turn: the POISON of TOXICITY, through the statuses still on (tokens included).
            for (Body b : bodies.values())
                if (b.upAtStart && !b.toxicImmune && b.get(Resource.TOXICITY) > 0)
                    damage(null, b, Damage.DamageType.POISON, b.get(Resource.TOXICITY) / 2, null);
            Map<String, Integer> end = new LinkedHashMap<>();
            bodies.forEach((id, b) -> end.put(id, b.get(Resource.HEALTH)));
            return end;
        }

        private static void pay(Act act) {
            for (Map.Entry<Resource, Integer> cost : act.card.getCost().entrySet())
                act.author.set(cost.getKey(), act.author.get(cost.getKey()) - cost.getValue());
        }

        private void resolve(Act act, List<Act> later) {
            Map<Resource, Integer> start = new EnumMap<>(act.author.res);
            int itemsAtStart = act.author.items.size();
            boolean searched = false;
            Map<Resource, Integer> foundGains = Map.of(), missedGains = Map.of();
            Float token = null;
            for (PrintedEffects.Step step : act.steps) {
                Body subject = step.isOnTarget() ? act.target : act.author;
                switch (step.getKind()) {
                    case DAMAGE:
                        damage(act.author, subject, step.getDamageType(), amount(step, act.author, start, itemsAtStart), step.getApplying());
                        break;
                    case GAIN:
                        if (step.getResource() != null)
                            subject.set(step.getResource(), subject.get(step.getResource()) + amount(step, act.author, start, itemsAtStart));
                        break;
                    case LOSE:
                        if (step.getResource() != null)
                            subject.set(step.getResource(), subject.get(step.getResource()) - amount(step, act.author, start, itemsAtStart));
                        break;
                    case EMPTY:
                        if (step.getResource() != null) subject.set(step.getResource(), 0);
                        break;
                    case STATUS:
                        if (step.getDamageType() != null && step.getFactor() != null)
                            subject.statuses.add(new Multiplier(step.getDamageType(), step.getFlow(), step.getStatusType(), step.getFactor(),
                                    step.getConvertTo()));
                        break;
                    case SEARCH:
                        searched = true;
                        token = step.getFactor();
                        foundGains = step.getFoundGains() == null ? Map.of() : step.getFoundGains();
                        missedGains = step.getMissedGains() == null ? Map.of() : step.getMissedGains();
                        break;
                    case CONSUME:
                        consume(act);
                        break;
                    case IMMUNE:
                    case NOT_IMMUNE:
                        if (step.getResource() == Resource.TOXICITY) subject.toxicImmune = step.getKind() == PrintedEffects.Kind.IMMUNE;
                        break;
                    case COUNTER_TARGET:
                        for (Act next : later)
                            if (next.author == act.target) { next.voided = true; break; }
                        break;
                    case COUNTER_ALL:
                        for (Body foe : bodies.values()) {
                            if (foe == act.author) continue;
                            for (Act next : later)
                                if (next.author == foe) { if (next.target == act.author) next.voided = true; break; }
                        }
                        break;
                    default:
                        break;
                }
            }
            if (!searched) return;
            // D71–D72: the search after the move; the token and the full gains only if the card is found.
            boolean hit = act.mine ? found : theyFind;
            (hit ? foundGains : missedGains).forEach((r, n) -> act.author.set(r, act.author.get(r) + n));
            if (hit && token != null)
                for (Damage.DamageType type : Damage.DamageType.values())
                    act.author.statuses.add(new Multiplier(type, StatusFlow.INPUT, StatusType.BAD, token, null));
        }

        /** A grab: the chosen near item leaves the field and its own printed effects apply to the author. */
        private void consume(Act act) {
            for (int i = 0; i < act.author.items.size(); i++) {
                BotView.CardSeen item = act.author.items.get(i);
                if (!item.getName().equals(act.item)) continue;
                act.author.items.remove(i);
                if (item.getEffects() == null) return;
                Map<Resource, Integer> start = new EnumMap<>(act.author.res);
                for (PrintedEffects.Step step : item.getEffects().getSteps()) {
                    if (step.getKind() == PrintedEffects.Kind.GAIN && step.getResource() != null)
                        act.author.set(step.getResource(), act.author.get(step.getResource()) + amount(step, act.author, start, 0));
                    else if (step.getKind() == PrintedEffects.Kind.LOSE && step.getResource() != null)
                        act.author.set(step.getResource(), act.author.get(step.getResource()) - amount(step, act.author, start, 0));
                    else if (step.getKind() == PrintedEffects.Kind.STATUS && step.getDamageType() != null && step.getFactor() != null)
                        act.author.statuses.add(new Multiplier(step.getDamageType(), step.getFlow(), step.getStatusType(), step.getFactor(),
                                step.getConvertTo()));
                    else if (step.getKind() == PrintedEffects.Kind.IMMUNE && step.getResource() == Resource.TOXICITY)
                        act.author.toxicImmune = true;
                    else if (step.getKind() == PrintedEffects.Kind.DAMAGE)
                        damage(act.author, act.author, step.getDamageType(), amount(step, act.author, start, 0), step.getApplying());
                }
                return;
            }
        }

        private static int amount(PrintedEffects.Step step, Body author, Map<Resource, Integer> start, int itemsAtStart) {
            int amount = step.getBase();
            if (step.getOf() != null)
                amount += (step.isAtStart() ? start.get(step.getOf()) : author.get(step.getOf())) / Math.max(1, step.getDivide());
            return amount + step.getPerItem() * (step.isAtStart() ? itemsAtStart : author.items.size());
        }

        /** As Character.inflictDamage and takeDamage: the author's OUTPUT statuses, the subject's INPUT ones, armour, floor. */
        private static void damage(Body author, Body subject, Damage.DamageType type, int amount, Set<StatusType> applying) {
            Set<StatusType> types = applying == null ? Status.ALL : applying;
            int damage = amount;
            if (author != null)
                for (Multiplier m : author.statuses)
                    if (m.flow == StatusFlow.OUTPUT && m.type == type && types.contains(m.kind)) { type = m.turn(type); damage = m.apply(damage); }
            Set<StatusType> received = author == null ? Status.ALL : Status.invertViewPoint(types);
            for (Multiplier m : subject.statuses)
                if (m.flow == StatusFlow.INPUT && m.type == type && received.contains(m.kind)) { type = m.turn(type); damage = m.apply(damage); }
            if (type == Damage.DamageType.HIT && subject.get(Resource.ALCOHOL) > 0)
                damage = Math.max(0, damage - subject.get(Resource.ALCOHOL) / com.gsc.bm.model.game.Ruleset.ALCOHOL_ARMOR_DIVISOR);
            subject.set(Resource.HEALTH, subject.get(Resource.HEALTH) - damage);
        }
    }
}
