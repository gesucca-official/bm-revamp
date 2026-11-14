package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.InputStream;
import java.util.List;
import java.util.Objects;

/** D83: approved deck lists, strictly reparsed, in test resources only. No card or fixed part is replaced. */
final class DeckSizeVariants {
    static final List<String> NAMES = List.of("20-2", "25-2", "25-3", "30-2", "30-3");
    private static final ObjectMapper JSON = new ObjectMapper();
    private DeckSizeVariants() { }

    static JsonNode specification(String name) throws Exception {
        if (!NAMES.contains(name)) throw new IllegalArgumentException("Unknown deck variant: " + name);
        String path = "/set-base/sb-16h/" + name + ".json";
        try (InputStream in = DeckSizeVariants.class.getResourceAsStream(path)) {
            return JSON.readTree(Objects.requireNonNull(in, path));
        }
    }

    static Draft apply(Draft reference, String name) throws Exception {
        JsonNode spec = specification(name);
        ObjectNode root = reference.json().deepCopy();
        ObjectNode rules = (ObjectNode) root.get("rules");
        rules.set("deckSize", spec.get("deckSize"));
        rules.set("maxCopies", spec.get("maxCopies"));
        for (JsonNode deck : root.path("decks")) {
            JsonNode cards = spec.path("decks").get(deck.path("id").asText());
            if (cards == null) throw new IllegalArgumentException("Missing variant deck: " + deck.path("id"));
            ((ObjectNode) deck).set("cards", cards.deepCopy());
        }
        // Preserve the reference source and JSON order for the byte identity gate (D88).
        return Draft.parse(name.equals("20-2") ? reference.source : reference.source + " + " + name, root);
    }
}
