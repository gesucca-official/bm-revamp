package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.Test;

import java.io.InputStream;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * SB-27 (D177, risposta del proprietario allo STOP 1/2): l'adattamento delle bozze storiche fa esattamente ciò che {@link BozzeStoriche}
 * dichiara e nient'altro; il caricatore di produzione resta rigoroso.
 */
class BozzeStoricheTest {
    private static final ObjectMapper JSON = new ObjectMapper();

    private static JsonNode resource(String path) throws Exception {
        try (InputStream input = BozzeStoricheTest.class.getResourceAsStream(path)) {
            return JSON.readTree(input.readAllBytes());
        }
    }

    private static ObjectNode params(JsonNode draft, String binding) {
        for (JsonNode card : draft.path("cards")) if (card.path("binding").asText().equals(binding)) return (ObjectNode) card.get("params");
        throw new AssertionError(binding);
    }

    @Test
    void theFrozen15GainsTheOldDefaultsAndLosesTheZeroSelfHitOnly() throws Exception {
        JsonNode original = resource(SetBaseArms.FROZEN_15);
        ObjectNode expected = original.deepCopy();
        params(expected, "base.pino.GoingBerserk").remove("selfHit");
        params(expected, "base.pino.GoingBerserk").put("perAlcohol", 1);
        params(expected, "base.pino.UltimoGiro").put("perPlay", 0).put("perPlaySelf", 0);
        assertEquals(expected, BozzeStoriche.adatta(original));
        assertEquals(resource(SetBaseArms.FROZEN_15), original, "the given draft does not change");
    }

    @Test
    void theK1CandidateLosesItsTwoZeroSwitchOffs() throws Exception {
        JsonNode original = resource(Sb21h.CANDIDATE);
        ObjectNode expected = original.deepCopy();
        params(expected, "base.pino.GoingBerserk").remove("selfHit");
        params(expected, "base.com.BeggingMoney").remove("alertnessFromTarget");
        assertEquals(expected, BozzeStoriche.adatta(original), "Ultimo Giro already has perPlay and perPlaySelf");
    }

    @Test
    void theCurrentDraftDoesNotChange() throws Exception {
        assertEquals(resource("/set-base/bozza.json"), BozzeStoriche.adatta(resource("/set-base/bozza.json")));
    }

    @Test
    void aNonZeroRemovedParameterIsRefused() throws Exception {
        String[][] cases = {{"base.pino.GoingBerserk", "selfHit"}, {"base.pino.GoingBerserk", "maxDamage"},
                {"base.pino.UltimoGiro", "maxDamage"}, {"base.com.BeggingMoney", "alertnessFromTarget"}};
        for (String[] c : cases) {
            ObjectNode draft = resource(Sb21h.CANDIDATE).deepCopy();
            params(draft, c[0]).put(c[1], 5);
            IllegalArgumentException error = assertThrows(IllegalArgumentException.class, () -> BozzeStoriche.adatta(draft), c[0] + "." + c[1]);
            assertTrue(error.getMessage().contains(c[1]), error.getMessage());
        }
    }

    @Test
    void anythingElseIsLeftToTheStrictLoader() throws Exception {
        ObjectNode draft = resource(Sb21h.CANDIDATE).deepCopy();
        params(draft, "base.pino.UltimoGiro").put("perAlcohol", 1);
        JsonNode adapted = BozzeStoriche.adatta(draft);
        assertEquals(1, params(adapted, "base.pino.UltimoGiro").get("perAlcohol").asInt(), "not touched");
        assertThrows(Draft.Invalid.class, () -> Draft.parse("ultimo giro con perAlcohol", adapted));
    }

    @Test
    void theProductionLoaderStaysStrict() {
        assertThrows(Draft.Invalid.class, () -> Draft.fromClasspath(SetBaseArms.FROZEN_15));
        assertThrows(Draft.Invalid.class, () -> Draft.fromClasspath(Sb21h.CANDIDATE));
        assertDoesNotThrow(() -> BozzeStoriche.fromClasspath(SetBaseArms.FROZEN_15));
        assertDoesNotThrow(() -> BozzeStoriche.fromClasspath(Sb21h.CANDIDATE));
    }
}
