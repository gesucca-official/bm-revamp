package com.gsc.bm.model.game.bot;

import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.status.StatusFlow;

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
        /**
         * SB-16i (D95), playground only: the POISON of TOXICITY the move spares its author over {@link #TOXIC_HORIZON} turns, when
         * it empties the own TOXICITY and the author is not immune, net of the damage the move deals to its author. In
         * health points; each style weighs it like a heal.
         */
        final double toxicRelief;
        /** SB-16i («Gioca d'anticipo»), playground only: 1 if the public estimate says the move resolves before the target's, else 0. */
        final double aheadChance;
        /** SB-16i: the damage of the target's answer the move would spare if ahead (a lower output of the target), in health points. */
        final double aheadGuard;

        Plan(Situation situation, LegalMove move) {
            this.move = move;
            this.card = move.getCard();
            this.target = situation.seatOf(move.getTargetId());
            this.hostile = target != situation.me;
            boolean playground = situation.view.getRuleset().playground();
            this.aheadChance = playground && hostile ? aheadChance(situation, card, target) : 0;
            this.damage = hostile ? damageOf(card) + (playground ? extraDamage(situation, card, aheadChance, target) : 0) : 0;
            this.cost = card.getCost();
            this.healthCost = cost.getOrDefault(Resource.HEALTH, 0);
            this.costTotal = cost.values().stream().mapToInt(Integer::intValue).sum() - healthCost;
            this.suicidal = healthCost > 0 && healthCost >= situation.myHealth();
            this.usesItem = move.getItem() != null && card.getCanTarget().contains(Card.CardTarget.NEAR_ITEM);
            // SB-17: an item named by a sale (a SELF card) is not taken from afar; for the other cards nothing changes.
            this.takesFarItem = move.getItem() != null && !usesItem && !PrintedEffects.sells(card.getEffects());
            Map<Resource, Double> total = parseGains(card.getGains(), VARIABLE);
            Map<Resource, Double> fixed = parseGains(card.getGains(), 0);
            if (usesItem) situation.me.getItems().stream().filter(i -> i.getName().equals(move.getItem())).findFirst()
                    .ifPresent(item -> {
                        parseGains(item.getGains(), VARIABLE).forEach((r, v) -> total.merge(r, v, Double::sum));
                        parseGains(item.getGains(), 0).forEach((r, v) -> fixed.merge(r, v, Double::sum));
                    });
            // SB-17 («Lo rivendo», RP-25): the gains of the branch the move plays, with the item it sells or without.
            if (PrintedEffects.sells(card.getEffects())) {
                total.clear();
                fixed.clear();
                boolean withItem = move.getItem() != null;
                for (PrintedEffects.Step st : steps(card)) {
                    if (st.isOnTarget() || st.getResource() == null || !st.appliesAfterSale(withItem)) continue;
                    if (st.getKind() == PrintedEffects.Kind.GAIN) {
                        total.merge(st.getResource(), (double) st.getBase(), Double::sum);
                        fixed.merge(st.getResource(), (double) st.getBase(), Double::sum);
                    } else if (st.getKind() == PrintedEffects.Kind.LOSE) {
                        total.merge(st.getResource(), (double) -st.getBase(), Double::sum);
                        fixed.merge(st.getResource(), (double) -st.getBase(), Double::sum);
                    }
                }
            }
            if (playground && aheadChance > 0) for (PrintedEffects.Step st : steps(card))
                if (st.isAhead() && !st.isOnTarget() && st.getKind() == PrintedEffects.Kind.GAIN && st.getResource() != null)
                    total.merge(st.getResource(), aheadChance * st.getBase(), Double::sum);
            this.gains = total;
            this.fixedGains = fixed;
            this.aheadGuard = playground && aheadChance > 0 ? aheadChance * guard(situation, card, target) : 0;
            List<PrintedEffects.Step> own = new ArrayList<>(steps(card));
            if (usesItem) situation.me.getItems().stream().filter(i -> i.getName().equals(move.getItem())).findFirst()
                    .ifPresent(item -> own.addAll(steps(item)));
            this.toxicRelief = playground ? toxicRelief(situation, own, target == situation.me) : 0;
            this.repeated = situation.view.getLastRound().stream()
                    .anyMatch(m -> m.getPlayerId().equals(situation.me.getPlayerId()) && m.getCardName().equals(card.getName()));
        }

        double gain(Resource resource) { return gains.getOrDefault(resource, 0.0); }
        double spent(Resource resource) { return cost.getOrDefault(resource, 0); }
        boolean role(String role) { return role.equals(card.getRole()); }
    }

    /** SB-16i: the printed steps of a card, or none if it cannot describe itself. */
    static List<PrintedEffects.Step> steps(BotView.CardSeen card) {
        return card.getEffects() == null ? List.of() : card.getEffects().getSteps();
    }

    /** Turns over which the POISON of TOXICITY spared by a cleaning move is counted (SB-16i, proposal section 6). */
    static final int TOXIC_HORIZON = 2;

    /**
     * SB-16i: TOXICITY emptied on the author («azzera la tua T»), T/2 of POISON spared at each end of turn for
     * {@link #TOXIC_HORIZON} turns, minus the HIT the move deals to its author; zero if immune or nothing emptied.
     * <p>
     * Only EMPTY counts, not LOSE: in the 1.5 a LOSE of the own TOXICITY exists only on two cards of the character immune to it,
     * who loses the immunity only in its mirror, after the card that lifts it; valuing it there changed the 1.5 (first identity
     * step 0 of SB-16i, 81 cells of that mirror). The two cleaning cards of the 1.6 empty the TOXICITY.
     */
    static double toxicRelief(Situation s, List<PrintedEffects.Step> steps, boolean onSelf) {
        int toxicity = s.me.resource(Resource.TOXICITY);
        if (toxicity <= 0 || s.me.getImmunities().contains(Resource.TOXICITY)) return 0;
        int removed = 0, selfDamage = 0;
        for (PrintedEffects.Step st : steps) {
            boolean mine = !st.isOnTarget() || onSelf;
            if (!mine) continue;
            if (st.getResource() == Resource.TOXICITY && st.getKind() == PrintedEffects.Kind.EMPTY) removed = toxicity;
            else if (st.getKind() == PrintedEffects.Kind.DAMAGE) selfDamage += st.getBase();
        }
        if (removed <= 0) return 0;
        return Math.max(0, removed / 2 * TOXIC_HORIZON - selfDamage);
    }

    /**
     * SB-16i («Gioca d'anticipo»), a public estimate: ahead if the card's priority is above the target's typical one (the highest
     * among its cards shown face up, 1 without any), or equal with the own ALERTNESS after the card's cost above the target's.
     * In the same group, or after: 0.
     */
    static double aheadChance(Situation s, BotView.CardSeen card, BotView.Seat target) {
        if (steps(card).stream().noneMatch(PrintedEffects.Step::isAhead)) return 0;
        int typical = s.found(target).stream().mapToInt(BotView.CardSeen::getPriority).max().orElse(1);
        int mine = s.me.resource(Resource.ALERTNESS) - card.getCost().getOrDefault(Resource.ALERTNESS, 0);
        if (card.getPriority() != typical) return card.getPriority() > typical ? 1 : 0;
        return mine > target.resource(Resource.ALERTNESS) ? 1 : 0;
    }

    /** SB-16i: the hit damage a lower output of the target spares, against its strongest card shown or {@link #CHARGED_HIT}. */
    static double guard(Situation s, BotView.CardSeen card, BotView.Seat target) {
        double factor = 1;
        for (PrintedEffects.Step st : steps(card))
            if (st.isAhead() && st.isOnTarget() && st.getKind() == PrintedEffects.Kind.STATUS && st.getFlow() == StatusFlow.OUTPUT
                    && st.getFactor() != null && st.getFactor() < 1) factor = Math.min(factor, st.getFactor());
        if (factor >= 1) return 0;
        double threat = s.found(target).stream().mapToDouble(StyleSupport::damageOf).max().orElse(CHARGED_HIT);
        return (1 - factor) * Math.max(threat, CHARGED_HIT);
    }

    /**
     * SB-16i: «Rincara» (the public play count) and «Gioca d'anticipo» (weighted) added to the nominal damage to the target.
     * SB-17: the damage printed «se il bersaglio ha un gettone», if the target shows a token now.
     */
    static double extraDamage(Situation s, BotView.CardSeen card, double aheadChance, BotView.Seat target) {
        double extra = 0;
        int plays = s.me.plays(card.getName());
        for (PrintedEffects.Step st : steps(card)) {
            if (!st.isOnTarget() || st.getKind() != PrintedEffects.Kind.DAMAGE) continue;
            if (st.isIfToken()) { if (hasToken(target)) extra += st.getBase(); }
            else if (st.isAhead()) extra += aheadChance * st.getBase();
            else extra += st.getPerPlay() * plays;
        }
        return extra;
    }

    /** SB-17: the seat has a vulnerability token. */
    static boolean hasToken(BotView.Seat seat) {
        return seat.getStatuses().stream().anyMatch(st -> st.getExposure() != null);
    }

    /** The product of the distinct vulnerability tokens on the seat (1 without any). */
    static double tokenFactor(BotView.Seat seat) {
        Map<Integer, Float> tokens = new java.util.HashMap<>();
        seat.getStatuses().stream().filter(st -> st.getExposure() != null && st.getFactor() != null)
                .forEach(st -> tokens.put(st.getExposure(), st.getFactor()));
        return tokens.values().stream().mapToDouble(Float::doubleValue).reduce(1, (a, b) -> a * b);
    }

    /** Weight of the SB-17 counter values, on the scale of {@link #rhythm}: damage avoided or dealt, counted twice. */
    static final double COUNTER_WEIGHT = 2;
    /** Worth of one item more on the own side after a swap of the trays (SB-17, SWAP_ITEMS). */
    static final double SWAP_ITEM = 3;

    /**
     * SB-17, playground only, the same for every style: what the printed text of a counter or a swap adds to the move.
     * <ul>
     *   <li>reflection («Ricatto»): the reflected part of the base damage of the strongest card the target shows, times the
     *       target's tokens;</li>
     *   <li>the token that stays («Lo sapevo»), only against a shown card with a token: the extra damage the token adds to the
     *       strongest own hit in hand;</li>
     *   <li>a swap of the trays (SWAP_ITEMS): the difference in items.</li>
     * </ul>
     * A counter is worth something only if the target moves after it: the styles already weigh that ({@link #rhythm}).
     */
    static double printedValue(Situation s, Plan p) {
        if (!p.hostile) return 0;
        double value = 0;
        for (PrintedEffects.Step st : steps(p.card)) {
            if (st.getKind() == PrintedEffects.Kind.SWAP_ITEMS)
                value += SWAP_ITEM * (p.target.getItems().size() - s.me.getItems().size());
            if (st.getKind() != PrintedEffects.Kind.COUNTER_TARGET) continue;
            List<BotView.CardSeen> shown = s.found(p.target);
            if (st.getFactor() != null) {
                double best = 0;
                for (BotView.CardSeen c : shown) {
                    double reflected = 0;
                    for (int base : TurnForecast.baseOf(c).values()) reflected += PrintedEffects.reflected(base, st.getFactor());
                    best = Math.max(best, reflected);
                }
                value += best * tokenFactor(p.target) * COUNTER_WEIGHT;
            }
            if (st.isKeepsToken() && !shown.isEmpty() && hasToken(p.target)) {
                double hit = 0;
                for (BotView.CardSeen c : s.view.getSelf().getHand())
                    if (!c.getName().equals(p.card.getName())) hit = Math.max(hit, damageOf(c));
                value += hit * (tokenFactor(p.target) - 1) * COUNTER_WEIGHT;
            }
        }
        return value;
    }

    /** SB-17 («Lo rivendo»): weights of an item's gains, those of the bound bench (D33, D36), HEALTH 1. */
    static final Map<Resource, Double> ITEM_WEIGHTS = Map.of(Resource.HEALTH, 1.0, Resource.VIOLENCE, 0.75, Resource.ALERTNESS, 0.5,
            Resource.ALCOHOL, 0.35, Resource.TOXICITY, 0.15);
    /** SB-17: worth of an equip or of an emptied TOXICITY, and of an immunity, in the same units. */
    static final double ITEM_STATUS = 3, ITEM_IMMUNITY = 0.5;

    /**
     * SB-17 («Lo rivendo», RP-25): the worth of an own item from its public text, to choose the one to sell (the least valuable).
     * Gains and losses at {@link #ITEM_WEIGHTS}; a status or an emptied resource {@link #ITEM_STATUS}; an immunity
     * {@link #ITEM_IMMUNITY}. An item that cannot describe itself is read from its catalog gains. A Santino (an immunity) is worth
     * 0.5, a Peroni (+10 L) 3.5, an Espresso (+15 A) 7.5.
     */
    static double itemWorth(BotView.CardSeen item) {
        PrintedEffects text = item.getEffects() != null ? item.getEffects() : item.consumedEffects();
        double worth = 0;
        if (text == null) {
            for (Map.Entry<Resource, Double> g : parseGains(item.getGains(), VARIABLE).entrySet())
                worth += ITEM_WEIGHTS.getOrDefault(g.getKey(), 0.5) * g.getValue();
            return worth;
        }
        for (PrintedEffects.Step st : text.getSteps()) {
            double weight = st.getResource() == null ? 0 : ITEM_WEIGHTS.getOrDefault(st.getResource(), 0.5);
            switch (st.getKind()) {
                case GAIN: worth += weight * st.getBase(); break;
                case LOSE: worth -= weight * st.getBase(); break;
                case STATUS:
                case EMPTY: worth += ITEM_STATUS; break;
                case IMMUNE: worth += ITEM_IMMUNITY; break;
                default: break;
            }
        }
        return worth;
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
            if (situation.view.getRuleset().playground()) score += rhythm(situation, plan) + printedValue(situation, plan);
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
        // SB-16i: the answer of the target spared by «Gioca d'anticipo» counts like damage avoided.
        bonus += p.aheadGuard * 2;
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
