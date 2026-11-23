package com.gsc.bm.model.cards.base.cesira;

import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.Move;

import java.util.List;

/**
 * «Copione Già Visto», slot CES-AR3 del Set Base: la scheda è quella del documento del set. Annulla la mossa dell'avversario scelto se
 * deve ancora risolversi e nessun'altra carta l'ha già annullata; se la carta annullata ha il nome a cui è legato il Vulnerabile
 * dell'avversario, quella giocata non lo fa finire. È un effetto di questa sola carta (R00): la carta annunciata annullata da altro
 * toglie il Vulnerabile come sempre. La partita lo applica con le regole del playground ({@link Move#isKeepsToken()}).
 */
public class LoSapevo extends Contromossa {

    @Override
    protected void onVoided(Move voided) { voided.setKeepsToken(true); }

    /** Voids the target's later move; the voided move does not satisfy its author's token. */
    @Override
    public PrintedEffects printedEffects() {
        return new PrintedEffects(List.of(PrintedEffects.Step.builder().kind(PrintedEffects.Kind.COUNTER_TARGET).onTarget(true)
                .keepsToken(true).build()));
    }
}
