package com.gsc.bm.model.cards.base.com;

import com.gsc.bm.model.cards.PrintedEffects;

import java.util.List;

/**
 * SB-17, GEN-03 del Set Base ({@code ShuffleFeet}, conservata, D107): la stessa logica della carta viva, con il testo stampato che i
 * bot leggono (scambio di tutti gli oggetti). È una sottoclasse della bozza per non toccare la carta viva; costo e priorità arrivano
 * dalla bozza. Solo bozza del Set Base (SB-28).
 */
public class ShuffleFeet extends com.gsc.bm.model.cards.com.ShuffleFeet implements PrintedEffects.Source {

    /** SB-17 (D107 (2)): the author and the target swap their near items. */
    @Override
    public PrintedEffects printedEffects() {
        return new PrintedEffects(List.of(PrintedEffects.Step.builder().kind(PrintedEffects.Kind.SWAP_ITEMS).onTarget(true).build()));
    }
}
