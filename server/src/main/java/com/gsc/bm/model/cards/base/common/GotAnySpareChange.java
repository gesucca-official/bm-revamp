package com.gsc.bm.model.cards.base.common;

import com.gsc.bm.model.cards.CardId;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * «Ce l'Hai Due Spicci?», slot GEN-04 del Set Base: la scheda è quella del documento del set. Alla risoluzione l'autore copia accanto a
 * sé un oggetto a caso fra quelli dell'avversario scelto, che tiene il suo; senza oggetti dell'avversario non succede niente. Se così
 * l'autore supera gli oggetti che può tenere, sparisce il suo più vecchio (la coda degli oggetti, R02). Il caso è il generatore
 * dell'autore, come nella carta viva {@code junkie.BeggingMoney}, di cui questa è la copia senza la perdita di A. Nessun testo
 * stampato: i bot la leggono dal file del set (ruolo ITEMS, nessun danno). Costo e priorità sono nel file del set.
 */
@CardId("base.com.BeggingMoney")
public class GotAnySpareChange extends AbstractCard {

    public GotAnySpareChange() {
        super();
        setCanTarget(Set.of(CardTarget.OPPONENT));
        setCost(Map.of());
        setPriority(0);
    }

    @Override
    public void applyOtherUnfathomableLogic(Game g, Move m) {
        List<Card> items = new ArrayList<>(g.getTarget(m).getCharacter().getItems());
        Collections.shuffle(items, g.getSelf(m).random());
        if (!items.isEmpty()) g.getSelf(m).getCharacter().getItems().add(items.get(0));
    }

    @Override
    public List<String> applyEffectOnSelf(Character self) {
        return null;
    }

    @Override
    public List<String> applyEffectOnTarget(Character self, Character target) {
        return null;
    }
}
