package com.gsc.bm.model.cards.base;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.cards.base.tokens.BrokenBottle;
import org.junit.jupiter.api.Test;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * SB-34 B3 (D213): the ids of the live set are frozen identifiers and never change. This test reads them from the set file
 * (cards, characters, starters, and the token the code creates), sorts them, joins them with newlines and compares the SHA-256
 * of that list with a literal written here. It does not derive the expected value from {@link SetBaseIds} or from the table
 * of names: a changed id must make it fail, whatever the constants say.
 *
 * <p>A new card adds an id, and only then the literal changes, together with the set document (its version and its note).
 */
class FrozenIdsFingerprintTest {

    /** The number of ids of the live set at SB-34 B3: 117 cards, 7 characters, 1 token, 5 starters. */
    private static final int EXPECTED_COUNT = 130;

    /** SHA-256 of the sorted ids, one per line, joined by {@code \n} without a final newline. */
    private static final String EXPECTED_FINGERPRINT = "f5d65b8feede47bf39bf80f050af9218552778db252bee49cf829bc8bc91baf8";

    @Test
    void theFrozenIdsOfTheLiveSetAreUnchanged() throws Exception {
        List<String> ids = liveIds();
        assertEquals(EXPECTED_COUNT, ids.size(), "numero di id del set vivo");

        Collections.sort(ids);
        String fingerprint = sha256(String.join("\n", ids));
        assertEquals(EXPECTED_FINGERPRINT, fingerprint,
                "Gli id del set vivo sono identificativi congelati (D213): non cambiano mai. Una carta nuova aggiunge un id "
                        + "alla nascita e allora, e solo allora, si aggiorna questo valore insieme al documento del set. "
                        + "Se un id è cambiato, ripristinarlo.");
    }

    private static List<String> liveIds() throws Exception {
        List<String> ids = new ArrayList<>();
        try (InputStream input = FrozenIdsFingerprintTest.class.getResourceAsStream("/sets/base.json")) {
            assertNotNull(input, "/sets/base.json");
            JsonNode set = new ObjectMapper().readTree(input);
            set.path("cards").forEach(card -> ids.add(card.path("binding").asText()));
            set.path("characters").forEach(character -> ids.add(character.path("id").asText()));
            set.path("decks").forEach(deck -> ids.add(deck.path("id").asText()));
        }
        ids.add(new BrokenBottle().getBindingName()); // the token: the code creates it, it is not in the set file
        return ids;
    }

    private static String sha256(String text) throws Exception {
        byte[] digest = MessageDigest.getInstance("SHA-256").digest(text.getBytes(StandardCharsets.UTF_8));
        StringBuilder hex = new StringBuilder();
        for (byte b : digest) hex.append(String.format("%02x", b));
        return hex.toString();
    }
}
