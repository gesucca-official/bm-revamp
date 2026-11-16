package com.gsc.bm.model.cards.base.cesira;

import com.gsc.bm.model.Damage;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.cards.Tunable;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * SB-17, CES-AR2 del Set Base («Ricatto», D106 (2), al posto di {@code WhatchaDoin}): annulla la mossa del bersaglio se arriva dopo;
 * se era un colpo, gli infligge {@code percent}% del suo danno base, dello stesso tipo, troncato. Il danno base è quello stampato
 * ({@link PrintedEffects#baseDamage}): mai le parti lette dalle risorse, dagli oggetti o dalle giocate, e mai le risorse di Sergio.
 */
public class Ricatto extends Contromossa {

    @Tunable
    private int percent = 50;

    private float factor() { return percent / 100f; }

    @Override
    protected Map<Damage.DamageType, Integer> afterVoid(Card voided) {
        Map<Damage.DamageType, Integer> reflected = new LinkedHashMap<>();
        baseDamage(voided).forEach((type, base) -> reflected.put(type, PrintedEffects.reflected(base, factor())));
        return reflected;
    }

    /** SB-17: voids the target's later move and reflects {@code percent}% of its base damage. */
    @Override
    public PrintedEffects printedEffects() {
        return new PrintedEffects(List.of(PrintedEffects.Step.builder().kind(PrintedEffects.Kind.COUNTER_TARGET).onTarget(true)
                .factor(factor()).build()));
    }
}
