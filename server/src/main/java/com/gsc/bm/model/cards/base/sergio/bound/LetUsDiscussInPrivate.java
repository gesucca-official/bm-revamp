package com.gsc.bm.model.cards.base.sergio.bound;

import com.gsc.bm.model.cards.CardId;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.cards.base.sergio.Countermove;

import java.util.List;
import java.util.Map;

/**
 * «Discutiamone in Privato», slot CES-BO1 del Set Base, legata a Sergio Sommerso: la scheda è quella del documento del set. Annulla la
 * mossa dell'avversario scelto se deve ancora risolversi, nessun'altra carta l'ha già annullata e la sua carta contiene Annuncia (un
 * passo di ricerca); altrimenti non fa nulla. Lo scarto di R02 avviene all'inizio dell'effetto, come in
 * {@code AbstractCharacterBoundCard}. Costo, priorità e rarità sono nel file del set.
 */
@CardId("base.cesira.bound.NeRiparliamoFuori")
public class LetUsDiscussInPrivate extends Countermove {

    public LetUsDiscussInPrivate() {
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

    /** Voids the target's later move only if its card contains «Annuncia». */
    @Override
    public PrintedEffects printedEffects() {
        return new PrintedEffects(List.of(PrintedEffects.Step.builder().kind(PrintedEffects.Kind.COUNTER_TARGET).onTarget(true)
                .ifSearch(true).build()));
    }
}
