package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.Set;

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
 * Su una bozza già nella forma definitiva (la 1.7 di oggi) non cambia nulla.
 */
final class BozzeStoriche {
    private static final ObjectMapper JSON = new ObjectMapper();

    /** I parametri tolti, per carta: si tolgono solo se valgono 0. */
    static final Map<String, Set<String>> TOLTI = Map.of(
            "base.pino.GoingBerserk", Set.of("selfHit", "maxDamage"),
            "base.pino.UltimoGiro", Set.of("maxDamage"),
            "base.com.BeggingMoney", Set.of("alertnessFromTarget"));
    /** I numeri che la classe di allora usava quando la bozza li taceva, per carta. */
    static final Map<String, Map<String, Integer>> TACIUTI = Map.of(
            "base.pino.GoingBerserk", Map.of("perAlcohol", 1),
            "base.pino.UltimoGiro", Map.of("perPlay", 0, "perPlaySelf", 0));

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
}
