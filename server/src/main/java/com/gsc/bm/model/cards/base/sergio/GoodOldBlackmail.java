package com.gsc.bm.model.cards.base.cesira;

import com.gsc.bm.model.Damage;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.cards.Tunable;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * «Buon Vecchio Ricatto», slot CES-AR2 del Set Base: la scheda è quella del documento del set. Annulla la mossa dell'avversario scelto
 * se deve ancora risolversi e nessun'altra carta l'ha già annullata; se era un attacco, gli infligge {@code percent}% dei suoi danni
 * fissi, dello stesso tipo, arrotondando per difetto. I danni fissi sono quelli stampati contro l'avversario
 * ({@link PrintedEffects#baseDamage}): mai le parti lette dalle risorse o dagli oggetti, mai Rincara. Il numero è nel file del set.
 */
public class Ricatto extends Contromossa {

    /** La parte dei danni fissi rimandata, in percento. */
    @Tunable
    private int percent;

    private float factor() { return percent / 100f; }

    @Override
    protected Map<Damage.DamageType, Integer> afterVoid(Card voided) {
        Map<Damage.DamageType, Integer> reflected = new LinkedHashMap<>();
        baseDamage(voided).forEach((type, base) -> reflected.put(type, PrintedEffects.reflected(base, factor())));
        return reflected;
    }

    /** Voids the target's later move and reflects {@code percent}% of its base damage. */
    @Override
    public PrintedEffects printedEffects() {
        return new PrintedEffects(List.of(PrintedEffects.Step.builder().kind(PrintedEffects.Kind.COUNTER_TARGET).onTarget(true)
                .factor(factor()).build()));
    }
}
