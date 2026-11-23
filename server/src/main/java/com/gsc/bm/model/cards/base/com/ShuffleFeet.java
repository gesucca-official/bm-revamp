package com.gsc.bm.model.cards.base.com;

import com.gsc.bm.model.cards.PrintedEffects;

import java.util.List;

/**
 * «Scatto Repentino», slot GEN-03 del Set Base: la scheda è quella del documento del set. L'autore e l'avversario scelto si scambiano
 * tutti gli oggetti; chi ne riceve più di quanti può tenere perde i più vecchi fra quelli ricevuti (la coda degli oggetti, R02).
 * La logica è quella della carta viva {@code com.ShuffleFeet}, qui con il testo stampato che i bot leggono; costo e priorità sono nel
 * file del set.
 */
public class ShuffleFeet extends com.gsc.bm.model.cards.com.ShuffleFeet implements PrintedEffects.Source {

    /** The author and the target swap their near items. */
    @Override
    public PrintedEffects printedEffects() {
        return new PrintedEffects(List.of(PrintedEffects.Step.builder().kind(PrintedEffects.Kind.SWAP_ITEMS).onTarget(true).build()));
    }
}
