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
     * SB-16g 2a, playground rules only (D58, D69): the marks of the cards found by a search, oldest first. A mark is bound to the
     * name of the card found and ends when its owner plays a card with that name, that copy or another; its vulnerability token, if
     * any, ends with it. While the very copy found is in hand it is shown face up to everyone: a view of what everyone has seen,
     * not a physical state of the card. Always empty with the live rules.
     */
    @JsonIgnore
    private final List<Revealed> revealed = new ArrayList<>();

    /** SB-16g 2a (D58, D69): the mark of a card found by a search, with a stable id and the turn it was found. */
    @Getter
    public static final class Revealed implements Serializable {
        private final int id;
        private final Card card;
        private final int turn;
        /** D71: when the last copy left both hand and deck; null while copies remain. */
        private Integer absentSince;

        public void observeAbsence(boolean absent, int now) {
            if (!absent) absentSince = null;
            else if (absentSince == null) absentSince = now;
        }

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
        if (!card.isCharacterBound() && !card.isBasicAction())
            cardsInHand.remove(card);
    }

    /** SB-16g 2a (D58): whether this very copy is in hand (cards are equal by name, so this compares the objects). */
    public boolean holds(Card card) {
        for (Card c : cardsInHand) if (c == card) return true;
        return false;
    }

    /**
     * SB-16g 2a (D58, D69): the marks shown face up, those whose very copy found is in hand. A copy that left the hand does not come
     * back (a card returning to the hand is another object), so a mark not shown is never shown again.
     */
    @JsonIgnore
    public List<Revealed> getShownRevealed() {
        List<Revealed> shown = new ArrayList<>();
        for (Revealed r : revealed) if (holds(r.card)) shown.add(r);
        return shown;
    }

    /** D71/M5: private warning names only; never the deck's contents or order. Empty with live rules. */
    @JsonIgnore
    public List<String> getLastTokenCopies() {
        List<String> names = new ArrayList<>();
        for (com.gsc.bm.model.game.status.Status s : character.getStatuses()) {
            String name = s.getUntilPlayed();
            if (s.getExposure() == null || name == null || names.contains(name)) continue;
            long hand = cardsInHand.stream().filter(c -> c.getName().equalsIgnoreCase(name)).count();
            if (hand == 1 && deck.stream().noneMatch(c -> c.getName().equalsIgnoreCase(name))) names.add(name);
        }
        return names;
    }

    @JsonIgnore
    public Map<Resource, Integer> getResources() {
        return character.getResources();
    }

}
