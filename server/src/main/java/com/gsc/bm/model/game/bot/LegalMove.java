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

    LegalMove(BotView.CardSeen card, String targetId, String discard, String item) {
        this.card = card;
        this.targetId = targetId;
        this.discard = discard;
        this.item = item;
    }

    Move toMove(String playerId, String gameId) {
        Map<Move.AdditionalAction, String> choices = new EnumMap<>(Move.AdditionalAction.class);
        if (discard != null) choices.put(Move.AdditionalAction.DISCARD_ONE, discard);
        if (item != null) choices.put(Move.AdditionalAction.TARGET_ITEM, item);
        return new Move(card.getName(), playerId, targetId, gameId, choices);
    }
}
