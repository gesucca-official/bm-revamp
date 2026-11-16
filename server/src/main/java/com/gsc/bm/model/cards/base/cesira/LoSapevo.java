package com.gsc.bm.model.cards.base.cesira;

import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.Move;

import java.util.List;

/**
 * SB-17, CES-AR3 del Set Base («Lo sapevo», D106 (3)): annulla la mossa del bersaglio se arriva dopo; se annulla il colpo che il
 * bersaglio ha annunciato, il suo gettone resta. È un effetto stampato solo su questa carta (R00): la regola generale RP-15 non cambia,
 * e la carta annunciata giocata toglie il gettone anche se annullata da altro. La partita lo applica solo con le regole del playground
 * ({@link Move#isKeepsToken()}, D108).
 */
public class LoSapevo extends Contromossa {

    @Override
    protected void onVoided(Move voided) { voided.setKeepsToken(true); }

    /** SB-17: voids the target's later move; the voided move does not satisfy its author's token. */
    @Override
    public PrintedEffects printedEffects() {
        return new PrintedEffects(List.of(PrintedEffects.Step.builder().kind(PrintedEffects.Kind.COUNTER_TARGET).onTarget(true)
                .keepsToken(true).build()));
    }
}
