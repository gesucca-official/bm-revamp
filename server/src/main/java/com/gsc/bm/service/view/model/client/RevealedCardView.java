package com.gsc.bm.service.view.model.client;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.gsc.bm.model.cards.Card;
import lombok.Builder;
import lombok.Getter;

/**
 * SB-16g 2a, playground rules only (D58, D69): a card found by a search, shown face up in its owner's hand for everyone, a view of
 * what everyone has seen. It goes when its owner plays a card with its name (this copy or another) or when this copy leaves the hand.
 * {@code copy} is its id (the same as the move's {@code search.copy} and as {@code exposure} on its vulnerability token, if any);
 * {@code turn} the turn it was found. {@code slot}, only in the owner's own view, is its index in {@code cardsInHand}. Nothing else
 * of a hidden hand is shown.
 */
@Builder
@Getter
public class RevealedCardView {
    private final int copy;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private final Integer slot;
    private final Card card;
    private final int turn;
}
