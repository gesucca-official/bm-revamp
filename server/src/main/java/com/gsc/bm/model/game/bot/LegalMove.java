package com.gsc.bm.model.game.bot;

import com.gsc.bm.model.game.Move;
import lombok.Value;

import java.util.EnumMap;
import java.util.Map;

/** One move the rules accept. Only BotView creates them, so a policy can only pick among legal moves. */
@Value
public class LegalMove {

    BotView.CardSeen card;
    String targetId;
    String discard;
    String item;
    /** SB-16i (D97): the card chosen for «Annuncia X o Y» (a binding), or null when there is nothing to choose. */
    String search;

    LegalMove(BotView.CardSeen card, String targetId, String discard, String item) {
        this(card, targetId, discard, item, null);
    }

    LegalMove(BotView.CardSeen card, String targetId, String discard, String item, String search) {
        this.card = card;
        this.targetId = targetId;
        this.discard = discard;
        this.item = item;
        this.search = search;
    }

    Move toMove(String playerId, String gameId) {
        Map<Move.AdditionalAction, String> choices = new EnumMap<>(Move.AdditionalAction.class);
        if (discard != null) choices.put(Move.AdditionalAction.DISCARD_ONE, discard);
        if (item != null) choices.put(Move.AdditionalAction.TARGET_ITEM, item);
        Move move = new Move(card.getName(), playerId, targetId, gameId, choices);
        if (search != null) move.setSearchChoice(search);
        return move;
    }
}
