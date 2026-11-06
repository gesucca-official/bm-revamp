package com.gsc.bm.model.game.bot;

import com.gsc.bm.model.Resource;

import java.util.List;
import java.util.Random;

/**
 * Protects its own health first: defenses, counters and heals weigh more the worse it stands, it refuses toxicity it
 * would suffer from, avoids paying costs that leave it unable to defend, and attacks mainly when it is not in danger.
 */
public class PrudentPolicy implements BotPolicy, StyleSupport.Scorer {

    @Override
    public LegalMove choose(BotView view, List<LegalMove> legalMoves, Random random) {
        return StyleSupport.choose(this, view, legalMoves, random);
    }

    /** 0.2 when well ahead, 1 when far behind. */
    private static double need(StyleSupport.Situation s) {
        double need = 0.5 + (s.foeHealth() - s.myHealth()) / 100.0;
        return Math.max(0.2, Math.min(1.0, need));
    }

    @Override
    public double score(StyleSupport.Situation s, StyleSupport.Plan p) {
        double need = need(s);
        double score = 0;
        if (p.hostile) {
            score += p.damage * (1.0 + 2.0 * (1 - need));
            if (p.damage >= p.target.resource(Resource.HEALTH)) score += 1000;
        }
        String role = p.card.getRole();
        if ("DEFENSE".equals(role)) score += 40 * need + 2 * p.card.getPriority();
        if ("COUNTER".equals(role)) score += 25 * need + 2 * p.card.getPriority();
        score += p.gain(Resource.HEALTH) * 2 * need;
        if (s.poisoned()) {
            score -= p.gain(Resource.TOXICITY) * 1.5;
            score += p.spent(Resource.TOXICITY) * 0.4;
        } else if (!s.me.getImmunities().contains(Resource.TOXICITY)) {
            score -= p.gain(Resource.TOXICITY) * 1.0;
        }
        if (!s.me.getImmunities().contains(Resource.ALCOHOL)) score -= p.gain(Resource.ALCOHOL) * 0.4;
        score += p.gain(Resource.ALERTNESS) * 0.3;
        if (p.card.isLastResort()) score -= 8;
        if (StyleSupport.Situation.soonestTimer(s.me) <= 2) score += ("DEFENSE".equals(role) ? 5 : 0);
        score -= p.costTotal * 0.2;
        // Health paid is damage taken, weighed like the heals it wants: more the worse it stands.
        score -= p.healthCost * 2 * need;
        if (s.wouldLose("DEFENSE", p.cost)) score -= 10;
        if (s.wouldLose("COUNTER", p.cost)) score -= 5;
        return score;
    }

    @Override
    public double keep(StyleSupport.Situation s, BotView.CardSeen card) {
        double value = StyleSupport.damageOf(card);
        if ("DEFENSE".equals(card.getRole()) || "COUNTER".equals(card.getRole())) value += 12;
        value += StyleSupport.parseGains(card.getGains()).getOrDefault(Resource.HEALTH, 0.0) * 2;
        return value - card.getCost().values().stream().mapToInt(Integer::intValue).sum() * 0.3;
    }
}
