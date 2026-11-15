package com.gsc.bm.service.view.model.client;

import com.gsc.bm.model.cards.Card;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Builder
@Getter
public class ClientSelfPlayerView extends AbstractClientPlayerView {
    private final String playerId;
    private final ClientCharacterView character;
    private final List<Card> cardsInHand;
    /** SB-16g 2a (D58), playground rules only: the copies found by a search, face up in this hand; absent when there are none. */
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private final List<RevealedCardView> revealed;
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private final List<String> lastTokenCopies;
    private final int deck;
    /**
     * SB-16i (D97, D102), playground rules only: for each card in this hand that announces two names («Annuncia X o Y»), by its
     * binding, the announced names with at least one copy in this player's deck, in the order printed on the card (nothing about
     * the order of the deck or the number of copies). Absent with the live rules and when no card in hand announces two names.
     */
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private final Map<String, List<String>> searchable;
}
