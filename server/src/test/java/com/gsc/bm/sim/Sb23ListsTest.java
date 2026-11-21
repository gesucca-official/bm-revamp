package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.InputStream;
import java.util.*;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/** SB-23 (D164): the 25/3 lists of the seven reference decks are valid, nest the 20/2 lists, keep fixed parts and single rare/tutor. */
class Sb23ListsTest {
    private static final ObjectMapper JSON = new ObjectMapper();
    static final List<String> DECKS = Sb19.REFERENCES;

    static JsonNode lists() throws Exception {
        try (InputStream in = Sb23ListsTest.class.getResourceAsStream("/set-base/sb-23/25-3.json")) {
            return JSON.readTree(Objects.requireNonNull(in));
        }
    }

    /** The reference draft with only the seven decks, size 25 and 3 copies, as the measure loads it. */
    static Draft bigger(Draft reference) throws Exception {
        JsonNode spec = lists();
        ObjectNode root = reference.json().deepCopy();
        ObjectNode rules = (ObjectNode) root.get("rules");
        rules.set("deckSize", spec.get("deckSize"));
        rules.set("maxCopies", spec.get("maxCopies"));
        var decks = JSON.createArrayNode();
        for (JsonNode deck : root.path("decks")) {
            JsonNode cards = spec.path("decks").get(deck.path("id").asText());
            if (cards == null) continue;
            ((ObjectNode) deck).set("cards", cards.deepCopy());
            decks.add(deck);
        }
        root.set("decks", decks);
        return Draft.parse(reference.source + " + 25-3", root);
    }

    /** The tutor of a character is its sixth action (xxx-AR6): it announces the rare or the hit and stays a single copy. */
    private static boolean isTutor(JsonNode draft, String binding) {
        for (JsonNode card : draft.path("cards"))
            if (card.path("binding").asText().equals(binding))
                return card.path("gui").path("description").asText().matches("^[A-Z]{3}-AR6 ·.*");
        return false;
    }

    @Test void the25x3ListsAreValidNestAndKeepEveryFixedPart() throws Exception {
        Draft base = Draft.fromClasspath("/set-base/bozza.json");
        assertEquals(20, base.rules.deckSize);
        assertEquals(2, base.rules.maxCopies);
        Draft big = bigger(base);
        assertEquals(25, big.rules.deckSize);
        assertEquals(3, big.rules.maxCopies);
        assertEquals(7, lists().path("decks").size());
        for (String section : List.of("characters", "cards", "format", "set")) assertEquals(base.json().get(section), big.json().get(section));
        for (String deck : DECKS) {
            assertEquals(base.characterOf(deck), big.characterOf(deck));
            assertEquals(base.basicOf(deck), big.basicOf(deck));
            assertEquals(base.boundOf(deck), big.boundOf(deck));
            assertEquals(base.lastResortOf(deck), big.lastResortOf(deck));
            Map<String, Integer> small = base.cardsOf(deck), large = big.cardsOf(deck);
            assertEquals(20, small.values().stream().mapToInt(Integer::intValue).sum());
            assertEquals(25, large.values().stream().mapToInt(Integer::intValue).sum());
            assertTrue(large.values().stream().allMatch(n -> n <= 3), deck);
            assertEquals(small.keySet(), large.keySet(), deck + ": same titles, only counts change");
            int added = 0;
            for (var e : small.entrySet()) {
                int n = large.get(e.getKey());
                assertTrue(n >= e.getValue(), deck + " nesting " + e.getKey());
                added += n - e.getValue();
                boolean rare = StarterBalanceMeasureTest.card(base.json(), e.getKey()).path("rarity").asText().equals("RARE");
                if (rare || isTutor(base.json(), e.getKey())) assertEquals(1, n, deck + " single copy " + e.getKey());
            }
            assertEquals(5, added, deck);
        }
    }
}
