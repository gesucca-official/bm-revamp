package com.gsc.bm.service.catalog;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.sim.DraftSource;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

/**
 * SB-28: the live set is the Set Base 1.0 of the set file packaged with the server; its starters are the five of D182, base and
 * advanced; «Ultimo colpo» is not in regulation 2.0 (D183 (3)) and no live card can reach it.
 */
class LiveSetTest {
    private static final ObjectMapper JSON = new ObjectMapper();

    @Test
    void theLiveSetIsTheSetBase10WithItsFiveStarters() throws Exception {
        LiveSet live = new LiveSet();
        DraftSource set = live.set();
        assertEquals("1.7", set.sets().get("base").get("version"), "the frozen draft 1.7 (D181), published as the Set Base 1.0");
        assertEquals(117, set.cardBindings().size(), "99 action and 18 item cards; the 7 characters apart");
        assertEquals(7, set.characterIds().size());
        // D182: base Spazienzio and Mara, advanced Celestina, Piera and Beppe; quick deals all five (D182 (1)).
        assertEquals(List.of("Spazienzio", "Mara", "Celestina", "Piera", "Beppe"),
                live.starters().stream().map(set::deckName).collect(Collectors.toList()));
        assertEquals(List.of("base", "base", "avanzato", "avanzato", "avanzato"),
                live.starters().stream().map(set::deckCategory).collect(Collectors.toList()));
        assertEquals(live.starters(), List.copyOf(set.deckIds()), "no test deck in the production file (they stay in the test resources)");
        for (String binding : set.cardBindings()) assertFalse(set.card(binding).isLastBlow(), binding);
    }

    @Test
    void aSetWithUltimoColpoIsRefused(@TempDir Path directory) throws Exception {
        ObjectNode root;
        try (InputStream input = LiveSetTest.class.getResourceAsStream("/sets/base.json")) {
            root = (ObjectNode) JSON.readTree(input.readAllBytes());
        }
        String binding = null;
        for (JsonNode card : root.get("cards"))
            if ("ACTION".equals(card.path("kind").asText()) && card.path("cost").has("HEALTH")) {
                ((ObjectNode) card).put("lastBlow", true);
                binding = card.get("binding").asText();
                break;
            }
        assertNotNull(binding, "a data action with a HEALTH cost");
        Path file = directory.resolve("base.json");
        Files.writeString(file, JSON.writeValueAsString(root));
        assertDoesNotThrow(() -> DraftSource.load(file.toString()), "the draft loader still reads it, for the historical drafts");
        IllegalStateException error = assertThrows(IllegalStateException.class, () -> new LiveSet(file.toString()));
        assertTrue(error.getMessage().contains("Ultimo colpo") && error.getMessage().contains(binding), error.getMessage());
    }

    @Test
    void aSetWithoutStartersIsRefused(@TempDir Path directory) throws Exception {
        ObjectNode root;
        try (InputStream input = LiveSetTest.class.getResourceAsStream("/sets/base.json")) {
            root = (ObjectNode) JSON.readTree(input.readAllBytes());
        }
        for (JsonNode deck : root.get("decks")) { ((ObjectNode) deck).remove("name"); ((ObjectNode) deck).remove("category"); }
        Path file = directory.resolve("base.json");
        Files.writeString(file, JSON.writeValueAsString(root));
        IllegalStateException error = assertThrows(IllegalStateException.class, () -> new LiveSet(file.toString()));
        assertTrue(error.getMessage().contains("starter"), error.getMessage());
    }
}
