package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.Test;

import java.io.InputStream;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * SB-28 (D182, D183): the live set file carries the five starters with name and category; the test decks left it for a decks-only
 * file of the test resources, which composes with it; the loader refuses a name without a category and a category outside the
 * vocabulary. The live set plus the test decks is the same game as the frozen draft 1.7, deck by deck.
 */
class LiveSetDecksTest {
    static final String LIVE = "/sets/base.json", TEST_DECKS = "/set-base/mazzi-prova.json", DRAFT = "/set-base/bozza.json";
    private static final ObjectMapper JSON = new ObjectMapper();

    private static ObjectNode resource(String path) throws Exception {
        try (InputStream input = LiveSetDecksTest.class.getResourceAsStream(path)) { return (ObjectNode) JSON.readTree(input.readAllBytes()); }
    }

    @Test
    void theLiveSetWithTheTestDecksIsTheDraftDeckByDeck() throws Exception {
        Draft live = Draft.fromClasspath(LIVE);
        Draft composed = Draft.load(List.of("classpath:" + LIVE, "classpath:" + TEST_DECKS));
        Draft draft = Draft.fromClasspath(DRAFT);
        assertEquals(List.of("starter-spazienzio", "starter-mara", "starter-tossico", "starter-pino", "starter-gigi"), List.copyOf(live.deckIds()));
        assertEquals(draft.deckIds(), composed.deckIds());
        assertEquals(draft.cardBindings(), composed.cardBindings());
        for (String deck : draft.deckIds()) {
            assertEquals(draft.characterOf(deck), composed.characterOf(deck), deck);
            assertEquals(draft.cardsOf(deck), composed.cardsOf(deck), deck);
            assertEquals(draft.boundOf(deck), composed.boundOf(deck), deck);
            assertEquals(draft.lastResortOf(deck), composed.lastResortOf(deck), deck);
            assertEquals(draft.deckName(deck), composed.deckName(deck), deck);
            assertEquals(draft.deckCategory(deck), composed.deckCategory(deck), deck);
        }
        Map<String, String> categories = new LinkedHashMap<>();
        for (String deck : composed.deckIds()) if (composed.deckCategory(deck) != null) categories.put(composed.deckName(deck), composed.deckCategory(deck));
        assertEquals(Map.of("Spazienzio", "base", "Mara", "base", "Celestina", "avanzato", "Piera", "avanzato", "Beppe", "avanzato"), categories);
        assertNull(composed.deckCategory("prova-sergio"), "a test deck is not a starter");
    }

    @Test
    void nameAndCategoryGoTogetherAndTheCategoryIsInTheVocabulary() throws Exception {
        Map<String, java.util.function.Consumer<ObjectNode>> cases = new LinkedHashMap<>();
        cases.put("name e category vanno insieme", d -> d.remove("category"));
        cases.put("fuori vocabolario", d -> d.put("category", "esperto"));
        for (var c : cases.entrySet()) {
            ObjectNode root = resource(LIVE);
            c.getValue().accept((ObjectNode) root.get("decks").get(0));
            Draft.Invalid error = assertThrows(Draft.Invalid.class, () -> Draft.parse("errato.json", root), c.getKey());
            assertTrue(error.getMessage().contains(c.getKey()), error.getMessage());
        }
    }

    @Test
    void aDecksOnlyFileHoldsOnlyDecks() throws Exception {
        ObjectNode decks = resource(TEST_DECKS);
        decks.set("cards", JSON.createArrayNode());
        Map<String, JsonNode> files = new LinkedHashMap<>();
        files.put("base.json", resource(LIVE));
        files.put("mazzi-prova.json", decks);
        Draft.Invalid error = assertThrows(Draft.Invalid.class, () -> Draft.parse(files));
        assertTrue(error.getMessage().contains("mazzi-prova.json"), error.getMessage());
        assertThrows(Draft.Invalid.class, () -> Draft.fromClasspath(TEST_DECKS), "alone it is not a set");
    }
}
