package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.Set;

import static com.gsc.bm.model.cards.base.SetBaseIds.*;

/**
 * SB-27 (D177, risposta del proprietario allo STOP 1/2): legge una bozza storica, precedente alla forma definitiva delle carte Java,
 * adattandola in memoria prima del caricamento. Le bozze storiche sono evidenze e non si modificano; il caricatore di produzione
 * resta rigoroso. L'adattamento fa solo questo, e rifiuta tutto il resto:
 * <ul>
 *   <li>toglie i parametri che spegnevano una parte della carta, tolti con la loro logica, se valgono 0: {@code selfHit} e
 *       {@code maxDamage} di «Alla Goccia», {@code alertnessFromTarget} di «Ce l'Hai Due Spicci?», {@code maxDamage} di «Ultimo Giro»;</li>
 *   <li>scrive i numeri che la classe di allora usava quando la bozza li taceva: {@code perPlay} 0 e {@code perPlaySelf} 0 per
 *       «Ultimo Giro», {@code perAlcohol} 1 per «Alla Goccia».</li>
 * </ul>
 * SB-28, con la pulizia delle otto classi condivise (lista di SB-27): con la stessa regola si toglie {@code alertnessToTarget} a 0 di
 * «FAI BASTA» e si scrive {@code poison} 0 di «Trascinare nel Tunnel» dove la bozza lo taceva (prima di D84). Le due bozze del Set
 * Base 0.1 ({@code sb-6a/attuale.json}, {@code sb-10a/listino-base.json}, riconosciute da {@code alertnessToTarget} 10 di «FAI
 * BASTA») non si possono rappresentare: le quattro carte condivise la cui forma 0.1 è uscita col set
 * ({@link #CONDIVISE_01}) si leggono come le scrive il file del set vivo, cioè come le gioca ora il catalogo 0.1 dei test
 * ({@link SimulationCatalog}). Il resto della bozza 0.1 non cambia.
 * <p>
 * Su una bozza già nella forma definitiva (la 1.7 di oggi) non cambia nulla.
 */
final class BozzeStoriche {
    private static final ObjectMapper JSON = new ObjectMapper();

    /** I parametri tolti, per carta: si tolgono solo se valgono 0. */
    static final Map<String, Set<String>> TOLTI = Map.of(
            DOWN_IN_ONE, Set.of("selfHit", "maxDamage"),
            LAST_ROUND, Set.of("maxDamage"),
            GOT_ANY_SPARE_CHANGE, Set.of("alertnessFromTarget"),
            THATS_ENOUGH, Set.of("alertnessToTarget"));
    /** I numeri che la classe di allora usava quando la bozza li taceva, per carta. */
    static final Map<String, Map<String, Integer>> TACIUTI = Map.of(
            DOWN_IN_ONE, Map.of("perAlcohol", 1),
            LAST_ROUND, Map.of("perPlay", 0, "perPlaySelf", 0),
            DRAG_INTO_THE_TUNNEL, Map.of("poison", 0));
    /** SB-28: le carte condivise la cui forma del Set Base 0.1 è uscita col set; nelle bozze 0.1 prendono costo e numeri del set vivo. */
    static final Set<String> CONDIVISE_01 = Set.of(THATS_ENOUGH, DRAG_INTO_THE_TUNNEL, DISASSEMBLE,
            EXCUSE_ME_SORRY_CAN_YOU_STOP);
    /** Il file del set vivo, da cui le bozze 0.1 prendono le quattro carte condivise. */
    static final String SET_VIVO = "/sets/base.json";

    private BozzeStoriche() { }

    static Draft fromClasspath(String resource) throws Exception {
        try (InputStream input = BozzeStoriche.class.getResourceAsStream(resource)) {
            if (input == null) throw new IllegalArgumentException(resource + ": file assente");
            return Draft.parse("classpath:" + resource, adatta(JSON.readTree(input.readAllBytes())));
        }
    }

    static Draft fromFile(Path path) throws Exception {
        return Draft.parse(path.toString(), adatta(JSON.readTree(Files.readAllBytes(path))));
    }

    /** Una copia della bozza adattata; la bozza data non cambia. */
    static JsonNode adatta(JsonNode root) {
        JsonNode copy = root.deepCopy();
        if (setBase01(copy)) {
            JsonNode live = vivo();
            for (JsonNode card : copy.path("cards")) {
                String binding = card.path("binding").asText();
                if (!CONDIVISE_01.contains(binding)) continue;
                JsonNode now = null;
                for (JsonNode c : live.path("cards")) if (c.path("binding").asText().equals(binding)) now = c;
                if (now == null) throw new IllegalStateException(binding + ": assente dal set vivo");
                for (String field : new String[] {"cost", "priority", "params"})
                    if (now.has(field)) ((ObjectNode) card).set(field, now.get(field).deepCopy());
                    else ((ObjectNode) card).remove(field);
            }
        }
        for (JsonNode card : copy.path("cards")) {
            String binding = card.path("binding").asText();
            if (!card.has("params")) continue;
            ObjectNode params = (ObjectNode) card.get("params");
            for (String name : TOLTI.getOrDefault(binding, Set.of()))
                if (params.has(name)) {
                    if (!params.get(name).isInt() || params.get(name).asInt() != 0)
                        throw new IllegalArgumentException(binding + ": params." + name + " vale " + params.get(name)
                                + ", non 0: la forma definitiva non lo rappresenta");
                    params.remove(name);
                }
            TACIUTI.getOrDefault(binding, Map.of()).forEach((name, value) -> {
                if (!params.has(name)) params.put(name, value);
            });
        }
        return copy;
    }

    /** Una bozza del Set Base 0.1: «FAI BASTA» con il guadagno di A dello 0.1 (10). */
    static boolean setBase01(JsonNode draft) {
        for (JsonNode card : draft.path("cards"))
            if (card.path("binding").asText().equals(THATS_ENOUGH) && card.path("params").path("alertnessToTarget").asInt(0) == 10)
                return true;
        return false;
    }

    private static JsonNode vivo() {
        try (InputStream input = BozzeStoriche.class.getResourceAsStream(SET_VIVO)) {
            if (input == null) throw new IllegalStateException(SET_VIVO + ": file assente");
            return JSON.readTree(input.readAllBytes());
        } catch (java.io.IOException e) {
            throw new IllegalStateException(SET_VIVO, e);
        }
    }
}
