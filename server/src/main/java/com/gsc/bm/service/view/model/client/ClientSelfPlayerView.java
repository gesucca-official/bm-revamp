package com.gsc.bm.service.view.model.client;

import com.gsc.bm.model.cards.Card;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class ClientSelfPlayerView extends AbstractClientPlayerView {
    private final String playerId;
    private final ClientCharacterView character;
    private final List<Card> cardsInHand;
    /** SB-16g 2a (D58), playground rules only: the copies found by a search, face up in this hand; absent when there are none. */
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private final List<RevealedCardView> revealed;
    private final int deck;
}
