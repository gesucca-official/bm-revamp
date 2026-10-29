package com.gsc.bm.api.ws;

import com.fasterxml.jackson.databind.JsonNode;
import com.gsc.bm.model.game.*;
import com.gsc.bm.model.cards.Card;
import org.springframework.stereotype.Component;
import java.util.*;

/** Validate the wire command against R03 before calling the legacy engine. */
@Component
public class MoveCommandValidator {
    private void require(boolean value, String user, String reason) {
        if (!value) { throw new IllegalMoveException(user, reason); }
    }
    public Move validate(Game game, String user, String pathGame, JsonNode body) {
        require(body != null && body.isObject(), user, "Invalid move command");
        Set<String> allowed = Set.of("playedCardName", "playerId", "targetId", "gameId", "choices");
        body.fieldNames().forEachRemaining(key -> require(allowed.contains(key), user, "Unexpected move field"));
        for (String key : List.of("playedCardName", "playerId", "targetId", "gameId")) {
            require(body.path(key).isTextual() && !body.path(key).asText().isBlank(), user, "Missing " + key);
        }
        require(user != null && user.equals(body.path("playerId").asText()), user, "Invalid player");
        require(pathGame.equals(body.path("gameId").asText()) && pathGame.equals(game.getGameId()), user, "Invalid game");
        require(game.getPlayers().containsKey(user) && !(game.getPlayers().get(user) instanceof ComPlayer), user, "Invalid player");
        require(!game.isOver(), user, "Game is over");
        require(!game.isEliminated(user), user, "Player eliminated");
        String target = body.path("targetId").asText();
        String owner = "SELF".equalsIgnoreCase(target) ? user : target;
        require(game.getPlayers().containsKey(owner), user, "Invalid target");
        Card card = game.getCardFromHand(user, body.path("playedCardName").asText());
        Set<Card.CardTarget> targets = card.getCanTarget();
        require(targets != null && (user.equals(owner)
                ? targets.contains(Card.CardTarget.SELF) || targets.contains(Card.CardTarget.NEAR_ITEM)
                : targets.contains(Card.CardTarget.OPPONENT) || targets.contains(Card.CardTarget.FAR_ITEM)), user, "Invalid target category");
        Map<Move.AdditionalAction, String> choices = new EnumMap<>(Move.AdditionalAction.class);
        JsonNode raw = body.get("choices");
        if (raw != null && !raw.isNull()) {
            require(raw.isObject(), user, "Invalid choices");
            raw.fields().forEachRemaining(entry -> {
                require(Set.of("DISCARD_ONE", "TARGET_ITEM").contains(entry.getKey()) && entry.getValue().isTextual()
                        && !entry.getValue().asText().isBlank(), user, "Invalid choice");
                choices.put(Move.AdditionalAction.valueOf(entry.getKey()), entry.getValue().asText());
            });
        }
        require(!card.isCharacterBound() || choices.containsKey(Move.AdditionalAction.DISCARD_ONE), user, "Discard required");
        require(!(targets.contains(Card.CardTarget.NEAR_ITEM) || targets.contains(Card.CardTarget.FAR_ITEM))
                || choices.containsKey(Move.AdditionalAction.TARGET_ITEM), user, "Item required");
        require(card.isCharacterBound() || !choices.containsKey(Move.AdditionalAction.DISCARD_ONE), user, "Unexpected discard");
        require(targets.contains(Card.CardTarget.NEAR_ITEM) || targets.contains(Card.CardTarget.FAR_ITEM)
                || !choices.containsKey(Move.AdditionalAction.TARGET_ITEM), user, "Unexpected item");
        return new Move(card.getName(), user, target, pathGame, choices.isEmpty() ? null : choices);
    }
}
