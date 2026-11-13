package com.gsc.bm.model.game.bot;

import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Common machinery of the heuristic styles: it reads a move only through public view data (costs, priority, target,
 * role, nominal damage, gains, resources, items, timers) and picks the best score, breaking ties with the given Random.
 * Static and stateless on purpose: a style must survive the engine's serialization copies.
 */
final class StyleSupport {

    /** Guess for the quantity that the catalog writes as "x" (variable gains or damage). */
    static final double VARIABLE = 5;
    private static final Pattern GAIN = Pattern.compile("([+-]?)(\\d+|x) ([VTLAH])");

    private StyleSupport() { }

    /** What a style is: a score for each legal move and how much a card is worth keeping when a bound card discards it. */
    interface Scorer {
        double score(Situation situation, Plan plan);
        double keep(Situation situation, BotView.CardSeen card);
    }

    /** Everything a policy may know about the table right now. */
    static final class Situation {
        final BotView view;
        final BotView.Seat me;
        final List<BotView.Opponent> foes;
        final BotView.Seat foe;

        Situation(BotView view) {
            this.view = view;
            this.me = view.getSelf().getSeat();
            this.foes = view.getOpponents().stream().filter(o -> !o.getSeat().isDead() && !o.getSeat().isForfeited())
                    .collect(Collectors.toList());
            this.foe = foes.stream().map(BotView.Opponent::getSeat)
                    .min((a, b) -> Integer.compare(a.resource(Resource.HEALTH), b.resource(Resource.HEALTH)))
                    .orElse(view.getOpponents().get(0).getSeat());
        }

        BotView.Seat seatOf(String id) {
            if ("SELF".equals(id)) return me;
            for (BotView.Opponent o : view.getOpponents()) if (o.getSeat().getPlayerId().equals(id)) return o.getSeat();
            return me;
        }

        /** D58/D71: only copies currently shown in this hand, including searches from earlier rounds. */
        List<BotView.CardSeen> found(BotView.Seat seat) {
            List<BotView.CardSeen> found = new ArrayList<>();
            if (seat == me) view.getSelf().getRevealed().forEach(r -> found.add(r.getCard()));
            else for (BotView.Opponent o : view.getOpponents())
                if (o.getSeat().getPlayerId().equals(seat.getPlayerId())) o.getRevealed().forEach(r -> found.add(r.getCard()));
            return found;
        }

        int myHealth() { return me.resource(Resource.HEALTH); }
        int foeHealth() { return foe.resource(Resource.HEALTH); }
        boolean poisoned() { return me.resource(Resource.TOXICITY) > 0 && !me.getImmunities().contains(Resource.TOXICITY); }
        boolean drunk() { return me.resource(Resource.ALCOHOL) > 0 && !me.getImmunities().contains(Resource.ALCOHOL); }

        /** Highest cost per resource among the cards in hand: what the hand would like to spend. */
        Map<Resource, Integer> demand() {
            Map<Resource, Integer> demand = new EnumMap<>(Resource.class);
            for (BotView.CardSeen card : view.getSelf().getHand())
                card.getCost().forEach((r, c) -> demand.merge(r, c, Math::max));
            return demand;
        }

        /** Best nominal damage in hand that cannot be paid today but would be after adding the given gains. */
        double unlockedDamage(Map<Resource, Double> gains) {
            double best = 0;
            for (BotView.CardSeen card : view.getSelf().getHand()) {
                double damage = damageOf(card);
                if (damage <= best || card.getCost().isEmpty()) continue;
                boolean payableNow = true, payableThen = true;
                for (Map.Entry<Resource, Integer> cost : card.getCost().entrySet()) {
                    double have = me.resource(cost.getKey());
                    if (have < cost.getValue()) payableNow = false;
                    if (have + gains.getOrDefault(cost.getKey(), 0.0) < cost.getValue()) payableThen = false;
                }
                if (!payableNow && payableThen) best = damage;
            }
            return best;
        }

        boolean affordableAfter(BotView.CardSeen card, Map<Resource, Integer> spent) {
            return card.getCost().entrySet().stream()
                    .allMatch(c -> me.resource(c.getKey()) - spent.getOrDefault(c.getKey(), 0) >= c.getValue());
        }

        boolean affordableNow(BotView.CardSeen card) { return affordableAfter(card, Map.of()); }

        /** True when a card of the given role is payable now but would not be after paying the given cost. */
        boolean wouldLose(String role, Map<Resource, Integer> spent) {
            for (BotView.CardSeen card : view.getSelf().getHand())
                if (role.equals(card.getRole()) && affordableNow(card) && !affordableAfter(card, spent)) return true;
            return false;
        }

        /** Soonest timer on a seat, or a large number when it has none. */
        static int soonestTimer(BotView.Seat seat) {
            return seat.getTimers().stream().mapToInt(BotView.TimerSeen::getTurnsLeft).min().orElse(99);
        }
    }

    /** One legal move read as numbers. */
    static final class Plan {
        final LegalMove move;
        final BotView.CardSeen card;
        final boolean hostile;
        final BotView.Seat target;
        final double damage;
        final Map<Resource, Double> gains;
        /** Gains the catalog states as numbers: the variable ones ("x") are guesses and unlock nothing. */
        final Map<Resource, Double> fixedGains;
        final boolean repeated;
        final Map<Resource, Integer> cost;
        /** Resources spent, HEALTH excluded: health paid is weighed apart, as damage taken. */
        final int costTotal;
        /** HEALTH paid to play the move (R04: costs are paid before any effect). */
        final int healthCost;
        /** The move costs at least the health left: paying it kills its player, whatever the move then does. */
        final boolean suicidal;
        final boolean usesItem;
        final boolean takesFarItem;

        Plan(Situation situation, LegalMove move) {
            this.move = move;
            this.card = move.getCard();
            this.target = situation.seatOf(move.getTargetId());
            this.hostile = target != situation.me;
            this.damage = hostile ? damageOf(card) : 0;
            this.cost = card.getCost();
            this.healthCost = cost.getOrDefault(Resource.HEALTH, 0);
            this.costTotal = cost.values().stream().mapToInt(Integer::intValue).sum() - healthCost;
            this.suicidal = healthCost > 0 && healthCost >= situation.myHealth();
            this.usesItem = move.getItem() != null && card.getCanTarget().contains(Card.CardTarget.NEAR_ITEM);
            this.takesFarItem = move.getItem() != null && !usesItem;
            Map<Resource, Double> total = parseGains(card.getGains(), VARIABLE);
            Map<Resource, Double> fixed = parseGains(card.getGains(), 0);
            if (usesItem) situation.me.getItems().stream().filter(i -> i.getName().equals(move.getItem())).findFirst()
                    .ifPresent(item -> {
                        parseGains(item.getGains(), VARIABLE).forEach((r, v) -> total.merge(r, v, Double::sum));
                        parseGains(item.getGains(), 0).forEach((r, v) -> fixed.merge(r, v, Double::sum));
                    });
            this.gains = total;
            this.fixedGains = fixed;
            this.repeated = situation.view.getLastRound().stream()
                    .anyMatch(m -> m.getPlayerId().equals(situation.me.getPlayerId()) && m.getCardName().equals(card.getName()));
        }

        double gain(Resource resource) { return gains.getOrDefault(resource, 0.0); }
        double spent(Resource resource) { return cost.getOrDefault(resource, 0); }
        boolean role(String role) { return role.equals(card.getRole()); }
    }

    static double damageOf(BotView.CardSeen card) {
        double damage = card.nominalDamage();
        if (damage > 0 && card.getDamageAmount() != null && card.getDamageAmount().contains("x")) damage += VARIABLE;
        return damage;
    }

    static Map<Resource, Double> parseGains(String gains) { return parseGains(gains, VARIABLE); }

    static Map<Resource, Double> parseGains(String gains, double variable) {
        Map<Resource, Double> result = new EnumMap<>(Resource.class);
        if (gains == null) return result;
        Matcher m = GAIN.matcher(gains);
        while (m.find()) {
            double amount = "x".equals(m.group(2)) ? variable : Double.parseDouble(m.group(2));
            if ("-".equals(m.group(1))) amount = -amount;
            result.merge(resource(m.group(3).charAt(0)), amount, Double::sum);
        }
        return result;
    }

    private static Resource resource(char letter) {
        switch (letter) {
            case 'V': return Resource.VIOLENCE;
            case 'T': return Resource.TOXICITY;
            case 'L': return Resource.ALCOHOL;
            case 'H': return Resource.HEALTH;
            default: return Resource.ALERTNESS;
        }
    }

    /**
     * Best score wins; moves within a hair of it are tied and the given Random breaks the tie. A move that costs at least the
     * health left is never chosen while another legal move exists: paying it kills the player, so at best it trades a kill for
     * a draw, and a counter can leave only the death.
     */
    static LegalMove choose(Scorer scorer, BotView view, List<LegalMove> legalMoves, Random random) {
        Situation situation = new Situation(view);
        List<Plan> plans = new ArrayList<>();
        for (LegalMove move : legalMoves) plans.add(new Plan(situation, move));
        if (plans.stream().anyMatch(p -> !p.suicidal)) plans.removeIf(p -> p.suicidal);
        List<LegalMove> best = new ArrayList<>();
        double top = Double.NEGATIVE_INFINITY;
        for (Plan plan : plans) {
            LegalMove move = plan.move;
            double score = scorer.score(situation, plan);
            if (situation.view.getRuleset().playground()) score += rhythm(situation, plan);
            if (move.getDiscard() != null) score -= keepValue(scorer, situation, move.getDiscard());
            if (score > top + 1e-9) {
                top = score;
                best.clear();
                best.add(move);
            } else if (score >= top - 1e-9) {
                best.add(move);
            }
        }
        return best.get(random.nextInt(best.size()));
    }

    /** A charge in progress this bot reads as dangerous: the shown card is a hit at least this strong (nominal damage). */
    static final int CHARGED_HIT = 10;
    /** Weights of the rhythm heuristic, on the scale of the styles' scores (a nominal hit of 15 is worth 30–45 there). */
    static final double FOLLOW_UP = 20, CHARGED_ATTACK = 10, BRACE = 15;

    /**
     * SB-16c, playground rules only (D50 and D52, point 2): the rhythm charge–hit–parry, the same for every style.
     * <ul>
     *   <li>after its own charge, play the hit: a currently revealed searched card in its hand, or any hit while one of its
     *       temporary GOOD OUTPUT statuses (a damage boost) is on;</li>
     *   <li>react to a visible charge of the opponent (a hit of at least {@value #CHARGED_HIT} still shown in its hand, or a
     *       temporary GOOD OUTPUT status): defend, counter or heal now.</li>
     * </ul>
     * It reads only public data: the moves of the last round with their search, the statuses on the table, the own hand.
     */
    static double rhythm(Situation s, Plan p) {
        double bonus = 0;
        if (p.hostile && p.damage > 0) {
            Map<Integer, Float> tokens = new java.util.HashMap<>();
            p.target.getStatuses().stream().filter(st -> st.getExposure() != null && st.getFactor() != null)
                    .forEach(st -> tokens.put(st.getExposure(), st.getFactor()));
            double factor = tokens.values().stream().mapToDouble(Float::doubleValue).reduce(1, (a, b) -> a * b);
            bonus += p.damage * Math.max(0, factor - 1) * 3;
            if (s.found(s.me).stream().anyMatch(c -> c.getName().equals(p.card.getName()))) bonus += FOLLOW_UP;
            if (boosted(s.me)) bonus += CHARGED_ATTACK;
        }
        if (charged(s, s.foe) && !p.hostile) {
            String role = p.card.getRole();
            if ("DEFENSE".equals(role) || "COUNTER".equals(role)) bonus += BRACE;
            bonus += Math.max(0, p.gain(Resource.HEALTH)) * 0.5;
        }
        if (charged(s, s.foe) && "COUNTER".equals(p.card.getRole()) && p.hostile) bonus += BRACE;
        return bonus;
    }

    /** A temporary damage boost on the seat: a GOOD status on its output that is not an equipment. */
    static boolean boosted(BotView.Seat seat) {
        return seat.getStatuses().stream().anyMatch(st -> st.getType() == com.gsc.bm.model.game.status.StatusType.GOOD
                && st.getFlow() == com.gsc.bm.model.game.status.StatusFlow.OUTPUT && !st.isEquip());
    }

    /** The seat announced a hit: a searched copy is still shown in hand, or a damage boost is on. */
    static boolean charged(Situation s, BotView.Seat seat) {
        if (seat == s.me) return false;
        return boosted(seat) || s.found(seat).stream().anyMatch(c -> c.nominalDamage() >= CHARGED_HIT);
    }

    private static double keepValue(Scorer scorer, Situation situation, String name) {
        return situation.view.getSelf().getHand().stream().filter(c -> c.getName().equals(name))
                .mapToDouble(c -> scorer.keep(situation, c)).min().orElse(0);
    }
}
