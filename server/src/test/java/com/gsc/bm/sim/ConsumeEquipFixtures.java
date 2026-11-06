package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

/**
 * SB-11a: i file e gli strumenti comuni alle prove dei passi consume ed equip. Le carte «prova.*» sono attrezzi di test, non carte del set.
 */
final class ConsumeEquipFixtures {
    static final ObjectMapper JSON = new ObjectMapper();
    static final String CARDS = "/sb-11a/cards.json", PROVE = "/sb-11a/prove.json", JAVA = "/sb-11a/java-cards.tsv";
    /** Le tre carte dell'attuale che il passo consume rende dati (le classi Java Grab, BruiserGrab, ToxicGrab). */
    static final List<String> GRABS = List.of("com.Grab", "com.basic.BruiserGrab", "com.basic.ToxicGrab");
    /** Il token BrokenBeerBottle scritto con il passo equip. */
    static final String TOKEN = "com.tokens.BrokenBeerBottle";

    private ConsumeEquipFixtures() { }

    static ArrayNode read(String resource) throws Exception {
        try (InputStream input = ConsumeEquipFixtures.class.getResourceAsStream(resource)) {
            return (ArrayNode) JSON.readTree(Objects.requireNonNull(input, resource));
        }
    }

    static ObjectNode definition(ArrayNode cards, String binding) {
        for (JsonNode card : cards) if (card.get("binding").asText().equals(binding)) return (ObjectNode) card.deepCopy();
        throw new IllegalArgumentException(binding);
    }

    static ObjectNode currentJson() throws Exception {
        try (InputStream input = Draft.class.getResourceAsStream(Draft.CURRENT)) { return (ObjectNode) JSON.readTree(input); }
    }

    static ObjectNode cardOf(ObjectNode root, String binding) {
        for (JsonNode card : root.get("cards")) if (card.get("binding").asText().equals(binding)) return (ObjectNode) card;
        throw new IllegalArgumentException(binding);
    }

    static ObjectNode deckOf(ObjectNode root, String id) {
        for (JsonNode deck : root.get("decks")) if (deck.get("id").asText().equals(id)) return (ObjectNode) deck;
        throw new IllegalArgumentException(id);
    }

    static ObjectNode gui(String name, String role) {
        ObjectNode gui = JSON.createObjectNode();
        gui.put("name", name).put("image", "no-img.png").put("role", role).put("gains", "—").put("damage", "—")
                .put("damageAmount", "—");
        return gui;
    }

    /** La bozza «attuale» di SB-6a con Grab, BruiserGrab e ToxicGrab scritte a dati: stessi testi, stessa posizione, nient'altro cambia. */
    static ObjectNode convertedCurrent() throws Exception {
        ObjectNode root = currentJson();
        ArrayNode data = read(CARDS), cards = (ArrayNode) root.get("cards");
        for (String binding : GRABS) {
            for (int i = 0; i < cards.size(); i++) {
                if (!cards.get(i).get("binding").asText().equals(binding)) continue;
                ObjectNode converted = definition(data, binding);
                converted.set("gui", cards.get(i).get("gui").deepCopy());
                cards.set(i, converted);
            }
        }
        return root;
    }

    /**
     * La bozza convertita con il token BrokenBeerBottle in un mazzo per parte (al posto di una copia di CocktailOnTheGround e di una di
     * RottenBeer), come classe Java oppure come dati con il passo equip. Il token pescato va sul campo e lo consuma Grab.
     */
    static ObjectNode withToken(boolean asData) throws Exception {
        ObjectNode root = convertedCurrent();
        ObjectNode token;
        if (asData) token = definition(read(CARDS), TOKEN);
        else {
            token = JSON.createObjectNode();
            token.put("binding", TOKEN).put("java", true).set("params", JSON.createObjectNode());
        }
        ObjectNode gui = gui("Broken Beer Bottle", "OTHER");
        gui.put("description", "Equip: Hit Damage x1.5, converted to Cut. Removed at turn end after use.");
        token.set("gui", gui);
        ((ArrayNode) root.get("cards")).add(token);
        ObjectNode bruiser = (ObjectNode) deckOf(root, "starter-bruiser").get("cards"), junkie = (ObjectNode) deckOf(root, "starter-junkie").get("cards");
        bruiser.put("com.items.CocktailOnTheGround", 1);
        bruiser.put(TOKEN, 1);
        junkie.put("com.items.RottenBeer", 1);
        junkie.put(TOKEN, 1);
        return root;
    }

    /** La bozza convertita più le carte di prova (fuori dai mazzi), per verificare i messaggi di errore sul file. */
    static ObjectNode withFixtures() throws Exception {
        ObjectNode root = convertedCurrent();
        ArrayNode cards = (ArrayNode) root.get("cards");
        for (JsonNode fixture : read(PROVE)) {
            ObjectNode card = (ObjectNode) fixture.deepCopy();
            card.set("gui", gui("Prova " + card.get("binding").asText(), "OTHER"));
            cards.add(card);
        }
        return root;
    }

    // ---- alterazioni (come DataCardsTest, più i campi tolti) ----

    /** Ogni alterazione di un campo della carta, ogni campo tolto, ogni passo tolto o scambiato col successivo. */
    static List<JsonNode> mutants(JsonNode card) {
        List<JsonNode> result = new ArrayList<>();
        alter(card, card, new ArrayList<>(), result);
        return result;
    }

    private static final Set<String> IDENTITY = Set.of("binding", "kind", "boundTo", "op");

    private static void alter(JsonNode root, JsonNode node, List<Object> path, List<JsonNode> result) {
        if (node.isObject()) {
            node.fields().forEachRemaining(field -> {
                if (IDENTITY.contains(field.getKey())) return;
                List<Object> deeper = new ArrayList<>(path);
                deeper.add(field.getKey());
                ObjectNode removed = ((ObjectNode) root).deepCopy();
                ((ObjectNode) locate(removed, path)).remove(field.getKey());
                result.add(removed);
                if (node == root.get("cost")) {
                    ObjectNode mutant = ((ObjectNode) root).deepCopy();
                    ObjectNode cost = (ObjectNode) mutant.get("cost");
                    JsonNode value = cost.remove(field.getKey());
                    cost.set(next(field.getKey()), value);
                    result.add(mutant);
                }
                alter(root, field.getValue(), deeper, result);
            });
        } else if (node.isArray()) {
            for (int i = 0; i < node.size(); i++) {
                List<Object> deeper = new ArrayList<>(path);
                deeper.add(i);
                if (node.get(i).isObject()) {
                    ObjectNode removed = ((ObjectNode) root).deepCopy();
                    ((ArrayNode) locate(removed, path)).remove(i);
                    result.add(removed);
                    // Aggiungere uno stato non scrive righe e tocca solo i danni: spostarlo rispetto ad altro che non sia danno è equivalente.
                    if (i + 1 < node.size() && !independent(node.get(i), node.get(i + 1))) {
                        ObjectNode swapped = ((ObjectNode) root).deepCopy();
                        ArrayNode steps = (ArrayNode) locate(swapped, path);
                        JsonNode first = steps.get(i);
                        steps.set(i, steps.get(i + 1));
                        steps.set(i + 1, first);
                        result.add(swapped);
                    }
                }
                alter(root, node.get(i), deeper, result);
            }
        } else {
            ObjectNode mutant = ((ObjectNode) root).deepCopy();
            JsonNode parent = locate(mutant, path.subList(0, path.size() - 1));
            Object key = path.get(path.size() - 1);
            JsonNode changed = node.isBoolean() ? JSON.valueToTree(!node.asBoolean())
                    : node.isIntegralNumber() ? JSON.valueToTree(node.asInt() + 1)
                    : node.isNumber() ? JSON.valueToTree(node.asDouble() + 0.5)
                    : JSON.valueToTree(next(node.asText()));
            if (key instanceof Integer) ((ArrayNode) parent).set((Integer) key, changed);
            else ((ObjectNode) parent).set((String) key, changed);
            result.add(mutant);
        }
    }

    private static boolean independent(JsonNode first, JsonNode second) {
        String a = first.path("op").asText(), b = second.path("op").asText();
        return ("status".equals(a) && !"damage".equals(b)) || ("status".equals(b) && !"damage".equals(a));
    }

    static JsonNode locate(JsonNode root, List<Object> path) {
        JsonNode node = root;
        for (Object key : path) node = key instanceof Integer ? node.get((Integer) key) : node.get((String) key);
        return node;
    }

    /** Il valore successivo se è un enumerato, altrimenti lo stesso testo con un carattere in più. */
    private static String next(String text) {
        for (Object[] values : new Object[][] {Resource.values(), Damage.DamageType.values(), StatusType.values(), StatusFlow.values(), Card.CardTarget.values()})
            for (int i = 0; i < values.length; i++)
                if (values[i].toString().equals(text)) return values[(i + 1) % values.length].toString();
        return text + "!";
    }
}
