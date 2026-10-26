package com.gsc.bm.model.game;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import lombok.Getter;

import java.io.Serializable;
import java.util.*;

@Getter
public class Player implements Serializable {

    public static final int CARDS_IN_HAND = 6;

    private final String playerId;
    private final Character character;

    private final List<Card> cardsInHand = new ArrayList<>();
    private final Stack<Card> deck = new Stack<>();

    private final Card lastResortCard;
    // Observation only: top of stack first, before dealing any item/action.
    private final List<String> initialDeckDrawOrder;
    private final List<String> initialSpecialCards;

    public Player(String id, Character character,
                  Card basicActionCard, List<Card> characterBoundCards, Card lastResortCard,
                  List<Card> deck) {
        this.playerId = id;
        this.character = character;

        this.cardsInHand.add(basicActionCard);
        this.cardsInHand.addAll(characterBoundCards);
        this.lastResortCard = lastResortCard;
        this.initialSpecialCards = Collections.unmodifiableList(new ArrayList<>(
                this.cardsInHand.stream().map(Card::getBindingName).collect(java.util.stream.Collectors.toList())));

        this.deck.addAll(deck);
        Collections.shuffle(this.deck);
        List<String> drawOrder = this.deck.stream().map(Card::getBindingName).collect(java.util.stream.Collectors.toList());
        Collections.reverse(drawOrder);
        this.initialDeckDrawOrder = Collections.unmodifiableList(drawOrder);
        drawCards(CARDS_IN_HAND - cardsInHand.size());
    }

    @JsonProperty
    public int getDeckSize() {
        return deck.size();
    }

    public void drawCard() {
        while (!deck.isEmpty()) {
            Card card = deck.pop();
            if (card.isItem()) {
                character.getItems().add(card);
            } else {
                cardsInHand.add(card);
                return;
            }
        }
        if (!cardsInHand.contains(lastResortCard)) cardsInHand.add(lastResortCard);
    }

    public void drawCards(int howMany) {
        for (int i = 0; i < howMany; i++)
            drawCard();
    }

    public void discardCard(Card card) {
        if (!card.isCharacterBound() && !card.isBasicAction())
            cardsInHand.remove(card);
    }

    @JsonIgnore
    public Map<Resource, Integer> getResources() {
        return character.getResources();
    }

}
