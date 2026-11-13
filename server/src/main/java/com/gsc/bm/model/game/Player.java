package com.gsc.bm.model.game;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import lombok.Getter;
import lombok.AccessLevel;

import java.io.Serializable;
import java.util.*;

@Getter
public class Player implements Serializable {

    public static final int CARDS_IN_HAND = 6;

    private final String playerId;
    private final Character character;

    @Getter(AccessLevel.NONE)
    @JsonIgnore
    private final Random rng;

    private final List<Card> cardsInHand = new ArrayList<>();
    private final Stack<Card> deck = new Stack<>();

    /**
     * SB-16g 2a, playground rules only (D58): the copies found by a search and still in this hand, oldest first. Each one keeps its
     * id and stays face up for everyone until it is played or discarded. The copy is the card object itself, not its name: another
     * copy with the same name stays hidden. Always empty with the live rules.
     */
    @JsonIgnore
    private final List<Revealed> revealed = new ArrayList<>();

    /** SB-16g 2a (D58): a copy found by a search, face up in its owner's hand, with a stable id and the turn it was found. */
    @Getter
    public static final class Revealed implements Serializable {
        private final int id;
        private final Card card;
        private final int turn;

        public Revealed(int id, Card card, int turn) {
            this.id = id;
            this.card = Objects.requireNonNull(card);
            this.turn = turn;
        }
    }

    private final Card lastResortCard;
    // Observation only: top of stack first, before dealing any item/action.
    private final List<String> initialDeckDrawOrder;
    private final List<String> initialSpecialCards;

    public Player(String id, Character character,
                  Card basicActionCard, List<Card> characterBoundCards, Card lastResortCard,
                  List<Card> deck) {
        this(id, character, basicActionCard, characterBoundCards, lastResortCard, deck, new Random());
    }

    public Player(String id, Character character,
                  Card basicActionCard, List<Card> characterBoundCards, Card lastResortCard,
                  List<Card> deck, Random rng) {
        this.rng = Objects.requireNonNull(rng);
        this.playerId = id;
        this.character = character;

        this.cardsInHand.add(basicActionCard);
        this.cardsInHand.addAll(characterBoundCards);
        this.lastResortCard = lastResortCard;
        this.initialSpecialCards = Collections.unmodifiableList(new ArrayList<>(
                this.cardsInHand.stream().map(Card::getBindingName).collect(java.util.stream.Collectors.toList())));

        this.deck.addAll(deck);
        Collections.shuffle(this.deck, rng);
        List<String> drawOrder = this.deck.stream().map(Card::getBindingName).collect(java.util.stream.Collectors.toList());
        Collections.reverse(drawOrder);
        this.initialDeckDrawOrder = Collections.unmodifiableList(drawOrder);
        drawCards(CARDS_IN_HAND - cardsInHand.size());
    }

    @JsonIgnore
    public Random random() {
        return rng;
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

    /**
     * SB-16c, playground rules only (D50, point 6): the draw replaced by a search. The copy of the card nearest to the top of the
     * deck leaves the deck: an action goes to the hand, an item to the field (as when drawn), and then the draw goes on as usual
     * because an item never fills the hand. Returns the card found, shown to everyone, or null if the deck has no copy: then
     * the player draws normally (also with an empty deck, which gives the last resort).
     */
    public Card searchCard(String binding) {
        for (int i = deck.size() - 1; i >= 0; i--) {
            Card card = deck.get(i);
            if (!card.getBindingName().equals(binding)) continue;
            deck.remove(i);
            if (card.isItem()) {
                character.getItems().add(card);
                drawCard();
            } else cardsInHand.add(card);
            return card;
        }
        drawCard();
        return null;
    }

    public void drawCards(int howMany) {
        for (int i = 0; i < howMany; i++)
            drawCard();
    }

    public void discardCard(Card card) {
        if (card.isCharacterBound() || card.isBasicAction()) return;
        // SB-16g 2a (D58): the very copy leaves, not the first one with its name. The card comes from this hand, so with the live
        // rules this is the copy remove(Object) took before (cards are equal by name and the first equal one is the same object).
        for (int i = 0; i < cardsInHand.size(); i++)
            if (cardsInHand.get(i) == card) {
                cardsInHand.remove(i);
                return;
            }
        cardsInHand.remove(card);
    }

    /** SB-16g 2a (D58): whether this very copy is in hand. */
    public boolean holds(Card card) {
        for (Card c : cardsInHand) if (c == card) return true;
        return false;
    }

    /** SB-16g 2a (D58): the face-up copy with this id, still in hand, or null. */
    public Revealed revealedCopy(int id) {
        for (Revealed r : revealed) if (r.id == id) return r;
        return null;
    }

    @JsonIgnore
    public Map<Resource, Integer> getResources() {
        return character.getResources();
    }

}
