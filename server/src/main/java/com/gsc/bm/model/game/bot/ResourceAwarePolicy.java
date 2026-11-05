package com.gsc.bm.model.game.bot;

import com.gsc.bm.model.Resource;

import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * Plays the economy: it values what a move gains or spends against what the hand wants to pay and against the periodic
 * effects (R06). Toxicity poisons its owner and alcohol drains alertness, so it spends them before they hurt, avoids
 * taking more unless the hand needs it, and wants alertness when it is behind the opponent's in turn order.
 */
public class ResourceAwarePolicy implements BotPolicy, StyleSupport.Scorer {

    @Override
    public LegalMove choose(BotView view, List<LegalMove> legalMoves, Random random) {
        return StyleSupport.choose(this, view, legalMoves, random);
    }

    @Override
    public double score(StyleSupport.Situation s, StyleSupport.Plan p) {
        Map<Resource, Integer> demand = s.demand();
        double score = 0;
        if (p.hostile) {
            score += p.damage * 2.2;
            if (p.damage >= p.target.resource(Resource.HEALTH)) score += 1000;
        }
        for (Resource r : new Resource[] {Resource.VIOLENCE, Resource.TOXICITY, Resource.ALCOHOL, Resource.ALERTNESS}) {
            double have = s.me.resource(r);
            double gain = p.gain(r);
            double spend = p.spent(r);
            double wanted = Math.max(0, demand.getOrDefault(r, 0) - have);
            double useful = Math.min(Math.max(gain, 0), wanted);
            double surplus = Math.max(gain, 0) - useful;
            score += useful * 0.9;
            switch (r) {
                case TOXICITY:
                    if (s.me.getImmunities().contains(r)) score += surplus * 0.15;
                    else score -= surplus * 1.4;
                    if (s.poisoned()) score += Math.min(spend, have) * 0.6;
                    break;
                case ALCOHOL:
                    if (s.me.getImmunities().contains(r)) score += surplus * 0.15;
                    else score -= surplus * 0.5;
                    if (s.drunk()) score += Math.min(spend, have) * 0.5;
                    break;
                case ALERTNESS:
                    boolean behind = have <= s.foe.resource(Resource.ALERTNESS) + 10;
                    score += surplus * (behind ? 0.7 : 0.25);
                    score -= spend * 0.5;
                    break;
                default:
                    score += surplus * 0.2;
                    score -= spend * 0.25;
            }
        }
        score += p.gain(Resource.HEALTH) * (s.myHealth() < s.foeHealth() ? 1.5 : 0.6);
        if (p.usesItem && s.me.getItems().size() >= s.me.getItemCapacity()) score += 5;
        if (p.takesFarItem) score += 3 + s.foe.getItems().size();
        if ("DISRUPT".equals(p.card.getRole()))
            score += s.foe.resource(Resource.ALERTNESS) >= s.me.resource(Resource.ALERTNESS) ? 4 : 2;
        if ("COUNTER".equals(p.card.getRole())) score += 2;
        if (p.repeated && p.damage == 0) score -= 6;
        if (StyleSupport.Situation.soonestTimer(s.me) <= 2 && "DEFENSE".equals(p.card.getRole())) score += 4;
        score += p.card.getPriority() * 0.5;
        return score;
    }

    @Override
    public double keep(StyleSupport.Situation s, BotView.CardSeen card) {
        double value = StyleSupport.damageOf(card) * 1.2;
        for (Map.Entry<Resource, Double> gain : StyleSupport.parseGains(card.getGains()).entrySet())
            if (gain.getKey() != Resource.TOXICITY || s.me.getImmunities().contains(Resource.TOXICITY)) value += gain.getValue() * 0.4;
        return value;
    }
}
