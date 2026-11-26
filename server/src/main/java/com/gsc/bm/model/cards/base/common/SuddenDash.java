package com.gsc.bm.model.cards.base.common;

import com.gsc.bm.model.cards.CardId;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import org.apache.commons.collections4.queue.CircularFifoQueue;

import java.util.List;
import java.util.Queue;
import java.util.Set;

/**
 * «Scatto Repentino», slot GEN-03 del Set Base: la scheda è quella del documento del set. L'autore e l'avversario scelto si scambiano
 * tutti gli oggetti; chi ne riceve più di quanti può tenere perde i più vecchi fra quelli ricevuti (la coda degli oggetti, R02).
 * Costo e priorità sono nel file del set. SB-28: la logica è copiata qui, identica, dalla carta {@code com.ShuffleFeet} dello 0.1, uscita
 * dal set (che resta nei sorgenti di test per le bozze storiche).
 */
@CardId("base.com.ShuffleFeet")
public class SuddenDash extends AbstractCard implements PrintedEffects.Source {

    public SuddenDash() {
        setCanTarget(Set.of(CardTarget.OPPONENT));
        setPriority(-1);
    }

    @Override
    public void applyOtherUnfathomableLogic(Game g, Move m) {
    }

    @Override
    public List<String> applyEffectOnSelf(Character self) {
        return null;
    }

    @Override
    public List<String> applyEffectOnTarget(Character self, Character target) {
        Queue<Card> targetItems = new CircularFifoQueue<>(target.getItemsSize());
        targetItems.addAll(target.getItems());
        Queue<Card> myItems = new CircularFifoQueue<>(self.getItemsSize());
        myItems.addAll(self.getItems());
        target.getItems().clear();
        target.getItems().addAll(myItems);
        self.getItems().clear();
        self.getItems().addAll(targetItems);
        return List.of(
                "Switched Place with Target, Items that were near Him now are near You"
        );
    }

    /** The author and the target swap their near items. */
    @Override
    public PrintedEffects printedEffects() {
        return new PrintedEffects(List.of(PrintedEffects.Step.builder().kind(PrintedEffects.Kind.SWAP_ITEMS).onTarget(true).build()));
    }
}
