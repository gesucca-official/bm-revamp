package com.gsc.bm.model.cards;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import lombok.Getter;

import java.util.List;
import java.util.Map;
import java.util.Set;

@JsonDeserialize(as = Card.DeserializedCard.class)
public interface Card {

    enum CardTarget {
        SELF, OPPONENT, NEAR_ITEM, FAR_ITEM
    }

    String getName();

    String getBindingName();

    String getEffect();

    boolean isItem();

    boolean isBasicAction();

    boolean isLastResort();

    boolean isCharacterBound();

    String getBoundToCharacter();

    // Regulation 1.12 R02: the character a basic or last resort is reserved to (null = generic); read only by deck validation.
    String getExclusiveToCharacter();

    int getPriority();  // higher priority resolved first (2 before 1)

    Set<CardTarget> getCanTarget();

    Map<Resource, Integer> getCost();

    Map<CardTarget, List<String>> resolve(Game game, Move move);

    /**
     * SB-16c, playground rules only (D50, point 2): «Ultimo colpo» written on the card. Its HEALTH cost may be paid down to 0 or
     * below and its move resolves even if its author is down. No live card has it; views never carry it.
     */
    @com.fasterxml.jackson.annotation.JsonIgnore
    default boolean isLastBlow() { return false; }

    @Getter
    class DeserializedCard implements Card {
        String name;
        String bindingName;
        String effect;
        boolean item;
        boolean basicAction;
        boolean lastResort;
        boolean characterBound;
        String boundToCharacter;
        String exclusiveToCharacter;
        int priority;
        Set<CardTarget> canTarget;
        Map<Resource, Integer> cost;

        @Override
        public Map<CardTarget, List<String>> resolve(Game game, Move move) {
            return null;
        }
    }

}
