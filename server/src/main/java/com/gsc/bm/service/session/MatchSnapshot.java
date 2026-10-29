package com.gsc.bm.service.session;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.*;
import java.util.*;
import java.util.stream.Collectors;

/** Explicit allowlist: never serializes sessions, credentials, callbacks or UI data. */
public final class MatchSnapshot {
    private MatchSnapshot() { }
    public static Map<String, Object> fields(Object... pairs) {
        Map<String, Object> result = new LinkedHashMap<>();
        for (int i = 0; i < pairs.length; i += 2) { result.put((String) pairs[i], pairs[i + 1]); }
        return result;
    }
    private static List<String> cards(Collection<Card> cards) {
        return cards.stream().map(Card::getBindingName).collect(Collectors.toList());
    }
    public static Object move(Move move) {
        return fields("playerId", move.getPlayerId(), "gameId", move.getGameId(), "card", move.getPlayedCardName(),
                "targetId", move.getTargetId(), "choices", move.getChoices(), "void", move.isVoid(), "report", move.getMoveReport());
    }
    public static Object state(Game game) {
        List<Object> players = new ArrayList<>();
        for (Player player : game.getPlayers().values()) {
            var character = player.getCharacter();
            List<Object> statuses = character.getStatuses().stream().map(s -> fields("name", s.getName(), "description", s.getDescription(),
                    "type", s.getType(), "flow", s.getFlow(), "property", s.getImpactedProperty(), "singleUse", s.isSingleUse(),
                    "equip", s.isEquip(), "lastsForTurns", s.getLastsForTurns())).collect(Collectors.toList());
            List<Object> timers = character.getTimers().stream().map(t -> fields("name", t.getName(), "remaining", t.getTimer())).collect(Collectors.toList());
            List<String> deck = cards(player.getDeck()); Collections.reverse(deck);
            players.add(fields("playerId", player.getPlayerId(), "controller", player instanceof ComPlayer ? "computer" : "human",
                    "character", character.getBindingName(), "resources", character.getResources(), "dead", character.isDead(),
                    "itemCapacity", character.getItemsSize(), "items", cards(character.getItems()), "hand", cards(player.getCardsInHand()),
                    "deckDrawOrder", deck, "initialDeckDrawOrder", player.getInitialDeckDrawOrder(), "specialCards", player.getInitialSpecialCards(),
                    "lastResort", player.getLastResortCard().getBindingName(), "immunities", new TreeSet<>(character.getImmunities()),
                    "statuses", statuses, "timers", timers));
        }
        return fields("gameId", game.getGameId(), "mode", game.getType(), "turn", game.getTurn(),
                "forfeits", new LinkedHashMap<>(game.getForfeits()), "moveDeadlines", new LinkedHashMap<>(game.getMoveDeadlines()),
                "reconnectDeadlines", new LinkedHashMap<>(game.getReconnectDeadlines()), "outcomeReason", game.getOutcomeReason(), "players", players,
                "pendingMoves", game.getPendingMoves().stream().map(MatchSnapshot::move).collect(Collectors.toList()),
                "resolvedMoves", game.getResolvedMoves().stream().map(MatchSnapshot::move).collect(Collectors.toList()),
                "timeBasedEffects", game.getTimeBasedEffects(), "engineReport", new ArrayList<>(game.getLoggedTurnEvents()),
                "outcome", fields("over", game.isOver(), "result", !game.isOver() ? "in_progress" : game.getWinner().isPresent() ? "win" : "draw",
                        "winner", game.getWinner().orElse(null)));
    }
}
