package com.gsc.bm.service.catalog;

import com.gsc.bm.repo.external.UserDecksRecord;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * SB-8: where the collection, the deck checks and the character texts come from. The live implementation,
 * {@link SqliteCatalogSource}, runs the same SQLite queries as before; the development profile {@code bozza} replaces it with
 * the set draft. Card and character objects are still crafted by the factories.
 */
public interface CatalogSource {

    /** Bindings of every card of the collection. */
    List<String> cardBindings();

    /** Bindings of every character of the collection. */
    List<String> characterBindings();

    boolean hasCard(String binding);

    boolean hasCharacter(String binding);

    /** Display name and sprite of a character, by binding. */
    Optional<CharacterGui> characterGui(String binding);

    /** Read-only decks offered to every account, by deck id. None in the live catalog. */
    default Map<String, UserDecksRecord.UserStoredDeck> readyDecks() { return Map.of(); }

    final class CharacterGui {
        private final String name, sprite;

        public CharacterGui(String name, String sprite) {
            this.name = name;
            this.sprite = sprite;
        }

        public String getName() { return name; }

        public String getSprite() { return sprite; }
    }
}
