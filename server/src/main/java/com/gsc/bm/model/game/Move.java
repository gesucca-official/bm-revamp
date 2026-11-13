package com.gsc.bm.model.game;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.service.view.model.logging.SlimMoveView;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Getter
@ToString
public class Move implements Serializable {

    public enum AdditionalAction {
        DISCARD_ONE,
        TARGET_ITEM
    }

    @JsonIgnore
    public static Move voidMove(String playerId) {
        return new Move(playerId);
    }

    private final String playedCardName;
    private final String playerId;
    private final String targetId;
    private final String gameId;

    private final Map<AdditionalAction, String> choices;

    @Setter
    private boolean isVoid;

    private final Map<Card.CardTarget, List<String>> moveReport = new EnumMap<>(Card.CardTarget.class);

    /**
     * SB-16c, playground rules only: why the engine voided the move (D50, point 1: {@link #DOWN}), or null.
     * SB-16f0 (D56): public and read-only in the view; absent when null, so always absent with the live rules.
     */
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @ToString.Exclude
    @Setter
    private String voidReason;
    /** SB-16c, playground rules only (D50, point 6): the card searched for after this move, and the one found (null if none). */
    @JsonIgnore
    @ToString.Exclude
    private String searchedFor;
    @JsonIgnore
    @ToString.Exclude
    private Card searchFound;
    /** SB-16g 2a (D58): the id of the copy found, face up in the author's hand from now on; null if none went to the hand. */
    @JsonIgnore
    @ToString.Exclude
    private Integer searchCopy;

    /**
     * SB-16f0 (D56): the search of this move as the view publishes it, null (absent) without a search, so always with the live
     * rules. Only what D50 (point 6), D52 and D54 make public: the card searched for, whether a copy was found, and the card found,
     * which is shown to everyone. Nothing else of the author's hand or deck.
     */
    @JsonProperty(value = "search", access = JsonProperty.Access.READ_ONLY)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public PublicSearch getPublicSearch() {
        return searchedFor == null ? null : new PublicSearch(searchedFor, searchFound != null, searchFound, searchCopy);
    }

    /** SB-16f0: the public search of a move: the binding searched for, whether found, and the revealed card (null if not found). */
    @Getter
    @AllArgsConstructor
    public static class PublicSearch {
        private final String card;
        private final boolean found;
        @JsonInclude(JsonInclude.Include.NON_NULL)
        private final Card revealed;
        /** SB-16g 2a (D58): the id of the copy, the same as in the hand that holds it face up; absent if none went to the hand. */
        @JsonInclude(JsonInclude.Include.NON_NULL)
        private final Integer copy;
    }

    /** The reason of a move voided because its author was down at the start of its speed group (D50, point 1). */
    public static final String DOWN = "a terra";

    /** Records the search that replaced the draw after this move and writes it in the move's report, shown to everyone. */
    public void recordSearch(String binding, Card found) {
        recordSearch(binding, found, null);
    }

    /** SB-16g 2a: as above, with the id of the copy that stays face up in the author's hand (D58), or null. */
    public void recordSearch(String binding, Card found, Integer copy) {
        this.searchedFor = binding;
        this.searchFound = found;
        this.searchCopy = copy;
        appendReport(Card.CardTarget.SELF, found != null
                ? "Searched the deck for " + binding + ": found " + found.getName() + " (shown to everyone)"
                : "Searched the deck for " + binding + ": not in the deck, normal draw");
    }

    private void appendReport(Card.CardTarget where, String line) {
        List<String> lines = new java.util.ArrayList<>(moveReport.getOrDefault(where, List.of()));
        lines.add(line);
        moveReport.put(where, lines);
    }

    @JsonCreator
    public Move(String playedCardName,
                String playerId,
                String targetId,
                String gameId,
                Map<AdditionalAction, String> choices) {
        this.playedCardName = playedCardName;
        this.playerId = playerId;
        this.targetId = targetId;
        this.gameId = gameId;
        this.choices = choices;
        this.isVoid = false;
    }

    private Move(String playerId) {
        this.playedCardName = null;
        this.playerId = playerId;
        this.targetId = null;
        this.gameId = null;
        this.choices = null;
        this.isVoid = true;
    }

    @AllArgsConstructor
    @Getter
    static class MoveCheckResult {
        boolean valid;
        String comment;
    }

    @JsonIgnore
    public MoveCheckResult isValidFor(Game game) {
        if (this.isVoid)
            return new MoveCheckResult(true, "is empty and you do nothing");

        try { // TODO for the love of god...
            // check if the discarded card is valid if character bound move
            if (game.getCardFromHand(playerId, playedCardName).isCharacterBound()) {
                if (choices == null || choices.isEmpty())
                    return new MoveCheckResult(false, "character bound cards should discard something else");
                Card toBeDiscarded = game.getCardFromHand(playerId, choices.get(AdditionalAction.DISCARD_ONE));
                if (toBeDiscarded.isCharacterBound())
                    return new MoveCheckResult(false, "can't discard character bound card");
                if (toBeDiscarded.isBasicAction())
                    return new MoveCheckResult(false, "can't discard basic action card");
                if (toBeDiscarded.isLastResort())
                    return new MoveCheckResult(false, "can't discard last resort card");
            }

            // check if target object is valid
            if (game.getCardFromHand(playerId, playedCardName).getCanTarget().contains(Card.CardTarget.NEAR_ITEM)) {
                if (choices == null || choices.isEmpty())
                    return new MoveCheckResult(false, "cards that use items should explicit which one is targeted");
                // this already throws IllegalMoveException if item is not present
                game.getItem(playerId, choices.get(AdditionalAction.TARGET_ITEM));
            }
            if (game.getCardFromHand(playerId, playedCardName).getCanTarget().contains(Card.CardTarget.FAR_ITEM)) {
                if (choices == null || choices.isEmpty())
                    return new MoveCheckResult(false, "cards that use items should explicit which one is targeted");
                // as above
                game.getItem(targetId, choices.get(AdditionalAction.TARGET_ITEM));
            }

            // check if player has already submitted a move
            if (game.getPendingMoves().stream().anyMatch(m -> m.getPlayerId().equalsIgnoreCase(playerId)))
                return new MoveCheckResult(false, "already submitted a move");
            // getting this card also checks if it is in that player's hand
            Card playedCard = game.getCardFromHand(playerId, playedCardName);
            Map<Resource, Integer> playerResources = game.getPlayers().get(playerId).getCharacter().getResources();

            // check if costs can be satisfied
            for (Map.Entry<Resource, Integer> cost : playedCard.getCost().entrySet()) {
                int availableResource = playerResources.getOrDefault(cost.getKey(), 0);
                if (availableResource < cost.getValue())
                    return new MoveCheckResult(false, "cant be cast with current resources");
            }
            // D50, point 2 (playground only): a HEALTH cost cannot bring its payer to 0 or below, except with «Ultimo colpo».
            if (!healthCostAllowed(game.getRuleset(), playedCard, playerResources.getOrDefault(Resource.HEALTH, 0)))
                return new MoveCheckResult(false, "cant pay health down to zero");
        } catch (IllegalMoveException e) {
            return new MoveCheckResult(false, e.getWhatHeDid());
        }
        return new MoveCheckResult(true, "good, cast it");
    }

    /** D50, point 2: with the playground rules a HEALTH cost must leave its payer above 0, unless the card has «Ultimo colpo». */
    public static boolean healthCostAllowed(Ruleset ruleset, Card card, int health) {
        int cost = card.getCost().getOrDefault(Resource.HEALTH, 0);
        return !ruleset.playground() || cost == 0 || card.isLastBlow() || health > cost;
    }

    @JsonIgnore
    public void applyCostTo(Game game) {
        if (this.isVoid)
            return;
        game.getCardFromHand(playerId, playedCardName).getCost().forEach(
                (key, value) -> game.getSelf(this).getCharacter().loseResource(key, value)
        );
    }

    @JsonIgnore
    public void applyEffectTo(Game game) {
        if (this.isVoid) {
            moveReport.put(Card.CardTarget.SELF, voidReason == null ? List.of("Didn't do anything!")
                    : List.of("Didn't do anything! (voided: " + voidReason + ")"));
            return;
        }
        moveReport.putAll(
                game.getCardFromHand(playerId, playedCardName).resolve(game, this)
        );
    }

    @JsonIgnore
    public SlimMoveView getSlimView() {
        return SlimMoveView.builder()
                .playerId(playerId)
                .targetId(targetId)
                .playedCardName(playedCardName)
                .choices(choices)
                .moveReport(moveReport)
                .build();
    }

}
