package com.gsc.bm.service.account;

import com.gsc.bm.model.cards.Card;

import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Deck rules of regulation 1.12 R02, the same for starters and saved decks: the character's own basic, two different
 * bound cards of the character, a generic or own last resort, exactly 20 regular cards with at most 2 copies each.
 * The cards are catalog cards (crafted by the factory), so subtype and ownership come from the catalog, not the client.
 * Ownership: a bound belongs to its {@code boundToCharacter}; a basic or last resort to its {@code exclusiveToCharacter}.
 */
public final class DeckRules {

    public static final int REGULAR_CARDS = 20, MAX_COPIES = 2, BOUND_CARDS = 2;

    private DeckRules() {
    }

    /** Throws {@link InvalidDeckException} with the first broken rule. */
    public static void check(String character, Card basic, List<Card> bound, Card lastResort, List<Card> regular) {
        if (basic == null || !basic.isBasicAction() || lastResort == null || !lastResort.isLastResort())
            throw new InvalidDeckException("Basic and last resort required");
        if (!character.equals(basic.getExclusiveToCharacter()))
            throw new InvalidDeckException("Basic of another character: " + basic.getBindingName());
        if (lastResort.getExclusiveToCharacter() != null && !character.equals(lastResort.getExclusiveToCharacter()))
            throw new InvalidDeckException("Last resort reserved to another character: " + lastResort.getBindingName());
        if (bound == null || bound.size() != BOUND_CARDS)
            throw new InvalidDeckException("Two different bound cards of the character required, found "
                    + (bound == null ? 0 : bound.size()));
        Set<String> seen = new HashSet<>();
        for (Card card : bound) {
            if (!card.isCharacterBound()) throw new InvalidDeckException("Bound card required");
            if (!character.equals(card.getBoundToCharacter()))
                throw new InvalidDeckException("Bound card of another character: " + card.getBindingName());
            if (!seen.add(card.getBindingName()))
                throw new InvalidDeckException("Bound cards must be different: " + card.getBindingName());
        }
        if (regular == null) throw new InvalidDeckException("Exactly " + REGULAR_CARDS + " regular cards required, found 0");
        Map<String, Integer> copies = new LinkedHashMap<>();
        for (Card card : regular) {
            if (card.isBasicAction() || card.isLastResort() || card.isCharacterBound())
                throw new InvalidDeckException("Regular card required");
            copies.merge(card.getBindingName(), 1, Integer::sum);
        }
        if (regular.size() != REGULAR_CARDS)
            throw new InvalidDeckException("Exactly " + REGULAR_CARDS + " regular cards required, found " + regular.size());
        for (Map.Entry<String, Integer> entry : copies.entrySet())
            if (entry.getValue() > MAX_COPIES)
                throw new InvalidDeckException("At most " + MAX_COPIES + " copies per card: "
                        + entry.getKey() + " has " + entry.getValue());
    }
}
