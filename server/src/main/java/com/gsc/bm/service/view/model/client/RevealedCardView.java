package com.gsc.bm.service.view.model.client;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.gsc.bm.model.cards.Card;
import lombok.Builder;
import lombok.Getter;

/**
 * SB-16g 2a, playground rules only (D58): a copy found by a search, face up in its owner's hand for everyone until it is played or
 * discarded. {@code copy} is its stable id (the same as the move's {@code search.copy} and as {@code heldBy} on the vulnerability it
 * holds, if any); {@code turn} the turn it was found. {@code slot}, only in the owner's own view, is its index in {@code cardsInHand}.
 * Nothing else of a hidden hand is shown.
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
