package com.gsc.bm.model.cards.base;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.cards.base.tokens.BrokenBottle;
import org.junit.jupiter.api.Test;

import java.io.InputStream;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/** SB-34 B2 (D213 (3)): every constant of {@link SetBaseIds} is an id of the live set, and every id has exactly one constant. */
class SetBaseIdsTest {

    @Test
    void theConstantsAreExactlyTheIdsOfTheLiveSet() throws Exception {
        List<String> ids = new ArrayList<>();
        try (InputStream input = SetBaseIdsTest.class.getResourceAsStream("/sets/base.json")) {
            assertNotNull(input, "/sets/base.json");
            JsonNode set = new ObjectMapper().readTree(input);
            set.path("cards").forEach(card -> ids.add(card.path("binding").asText()));
            set.path("characters").forEach(character -> ids.add(character.path("id").asText()));
            set.path("decks").forEach(deck -> ids.add(deck.path("id").asText()));
        }
        ids.add(new BrokenBottle().getBindingName()); // the token: the code creates it, it is not in the set file
        assertEquals(130, ids.size());

        List<String> constants = new ArrayList<>();
        for (Field field : SetBaseIds.class.getFields()) constants.add((String) field.get(null));

        // Sorted lists, not sets: a repeated constant or a repeated id is a difference too.
        Collections.sort(ids);
        Collections.sort(constants);
        assertEquals(ids, constants);
    }
}
