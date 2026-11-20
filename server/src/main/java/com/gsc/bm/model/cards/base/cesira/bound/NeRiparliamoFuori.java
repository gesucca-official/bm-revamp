package com.gsc.bm.model.cards.base.cesira.bound;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.cards.base.cesira.Contromossa;

import java.util.List;
import java.util.Map;

/**
 * SB-21h (D159 (1c), D160 (1)), CES-BO1 del Set Base, nome di lavoro «Ne riparliamo fuori»: bound variante di Sergio. Annulla la mossa
 * del bersaglio se deve ancora risolversi e la sua carta contiene «Annuncia» (un passo di ricerca); altrimenti non fa nulla. Le op
 * a dati non esprimono la condizione, quindi è una classe Java (proposta della Fase A, «Motore e dati»). Solo bozza del Set Base:
 * la partita viva non la conosce (SB-28). Costo, priorità e rarità arrivano dalla bozza; lo scarto R02 alla risoluzione, come
 * {@code AbstractCharacterBoundCard}.
 */
public class NeRiparliamoFuori extends Contromossa {

    public NeRiparliamoFuori() {
        super();
        setBoundToCharacter("base.character.Cesira");
    }

    /** R02: the discard of a bound at resolution, as {@code AbstractCharacterBoundCard}; then the counter. */
    @Override
    public Map<CardTarget, List<String>> resolve(Game game, Move move) {
        Card toBeDiscarded = game.getCardFromHand(move.getPlayerId(), move.getChoices().get(Move.AdditionalAction.DISCARD_ONE));
        game.getSelf(move).discardCard(toBeDiscarded);
        return super.resolve(game, move);
    }

    /** Only a card that searches: the card's printed text, as the bots read it. */
    @Override
    protected boolean voids(Card pending) {
        return PrintedEffects.searches(pending);
    }

    /** SB-21h: voids the target's later move only if its card contains «Annuncia». */
    @Override
    public PrintedEffects printedEffects() {
        return new PrintedEffects(List.of(PrintedEffects.Step.builder().kind(PrintedEffects.Kind.COUNTER_TARGET).onTarget(true)
                .ifSearch(true).build()));
    }
}
