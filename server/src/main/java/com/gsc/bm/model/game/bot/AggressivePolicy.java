package com.gsc.bm.model.game.bot;

import com.gsc.bm.model.Resource;

import java.util.List;
import java.util.Random;

/**
 * Maximises damage to the opponent and goes for the kill. It ignores its own health, pays any cost for a stronger hit,
 * prefers hits that resolve first, and spends quiet turns on gains that unlock a bigger hit it holds but cannot pay.
 */
public class AggressivePolicy implements BotPolicy, StyleSupport.Scorer {

    @Override
    public LegalMove choose(BotView view, List<LegalMove> legalMoves, Random random) {
        return StyleSupport.choose(this, view, legalMoves, random);
    }

    @Override
    public double score(StyleSupport.Situation s, StyleSupport.Plan p) {
        double score = 0;
        if (p.hostile) {
            score += p.damage * 3;
            if (p.damage > 0) score += p.card.getPriority() * 2;
            if (p.damage >= p.target.resource(Resource.HEALTH)) score += 1000;
            else if (p.damage * 2 >= p.target.resource(Resource.HEALTH)) score += 10;
            score -= p.target.resource(Resource.HEALTH) * 0.05;
        }
        if ("DISRUPT".equals(p.card.getRole())) score += 8;
        if ("COUNTER".equals(p.card.getRole())) score += 9;
        if (s.myHealth() <= s.foeHealth()) score += p.gain(Resource.HEALTH) * 2;
        if ("DEFENSE".equals(p.card.getRole())) score += 1;
        if (p.takesFarItem) score += 2;
        score += s.unlockedDamage(p.fixedGains) * 1.5;
        score += p.gain(Resource.VIOLENCE) * 0.3;
        // A dead attacker closes nothing: toxicity it cannot shrug off poisons it every turn, so it does not take more.
        if (!s.me.getImmunities().contains(Resource.TOXICITY)) score -= p.gain(Resource.TOXICITY) * 2;
        if (s.poisoned()) score += Math.min(p.spent(Resource.TOXICITY), s.me.resource(Resource.TOXICITY)) * 0.8;
        score -= p.costTotal * 0.1;
        // Health paid is damage taken: it trades it for damage dealt (worth 3 a point), so a strong hit is still worth paying.
        score -= p.healthCost * 1.0;
        return score;
    }

    @Override
    public double keep(StyleSupport.Situation s, BotView.CardSeen card) {
        return StyleSupport.damageOf(card) * 2 + ("COUNTER".equals(card.getRole()) ? 3 : 0);
    }
}
