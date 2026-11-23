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
        params(expected, "bruiser.YouStop").remove("alertnessToTarget"); // SB-28 (D181 (3))
        assertEquals(expected, BozzeStoriche.adatta(original));
        assertEquals(resource(SetBaseArms.FROZEN_15), original, "the given draft does not change");
    }

    @Test
    void theK1CandidateLosesItsTwoZeroSwitchOffs() throws Exception {
        JsonNode original = resource(Sb21h.CANDIDATE);
        ObjectNode expected = original.deepCopy();
        params(expected, "base.pino.GoingBerserk").remove("selfHit");
        params(expected, "base.com.BeggingMoney").remove("alertnessFromTarget");
        params(expected, "bruiser.YouStop").remove("alertnessToTarget"); // SB-28 (D181 (3))
        assertEquals(expected, BozzeStoriche.adatta(original), "Ultimo Giro already has perPlay and perPlaySelf, the drain its poison");
    }

    @Test
    void theCurrentDraftDoesNotChange() throws Exception {
        assertEquals(resource("/set-base/bozza.json"), BozzeStoriche.adatta(resource("/set-base/bozza.json")));
    }

    @Test
    void aNonZeroRemovedParameterIsRefused() throws Exception {
        String[][] cases = {{"base.pino.GoingBerserk", "selfHit"}, {"base.pino.GoingBerserk", "maxDamage"},
                {"base.pino.UltimoGiro", "maxDamage"}, {"base.com.BeggingMoney", "alertnessFromTarget"},
                {"bruiser.YouStop", "alertnessToTarget"}};
        for (String[] c : cases) {
            ObjectNode draft = resource(Sb21h.CANDIDATE).deepCopy();
            params(draft, c[0]).put(c[1], 5);
            IllegalArgumentException error = assertThrows(IllegalArgumentException.class, () -> BozzeStoriche.adatta(draft), c[0] + "." + c[1]);
            assertTrue(error.getMessage().contains(c[1]), error.getMessage());
        }
    }

    /** SB-28: a draft written before D84 gets the 0 POISON of the class of that time. */
    @Test
    void aDrainWithoutPoisonGetsTheOldZero() throws Exception {
        ObjectNode draft = resource(Sb21h.CANDIDATE).deepCopy();
        params(draft, "junkie.ToxicBloodDrain").remove("poison");
        assertEquals(0, params(BozzeStoriche.adatta(draft), "junkie.ToxicBloodDrain").get("poison").asInt());
        assertTrue(BozzeStoriche.adatta(resource(Sb21h.CANDIDATE)).toString().contains("\"poison\":12"), "a written poison stays");
    }

    /**
     * SB-28: the two drafts of the Set Base 0.1 read the four shared cards as the live set file writes them, and nothing else changes;
     * the copy the simulator uses by default ({@link Draft#CURRENT}) is exactly that reading of sb-6a/attuale.json.
     */
    @Test
    void theSetBase01DraftsReadTheFourSharedCardsFromTheLiveSet() throws Exception {
        JsonNode live = resource(BozzeStoriche.SET_VIVO);
        for (String path : java.util.List.of("/sb-6a/attuale.json", Listino.BASE)) {
            JsonNode original = resource(path);
            assertTrue(BozzeStoriche.setBase01(original), path);
            ObjectNode expected = original.deepCopy();
            for (JsonNode card : expected.path("cards")) {
                String binding = card.path("binding").asText();
                if (!BozzeStoriche.CONDIVISE_01.contains(binding)) continue;
                for (JsonNode now : live.path("cards"))
                    if (now.path("binding").asText().equals(binding))
                        for (String field : new String[] {"cost", "priority", "params"}) ((ObjectNode) card).set(field, now.get(field));
            }
            assertEquals(expected, BozzeStoriche.adatta(original), path);
            assertDoesNotThrow(() -> BozzeStoriche.fromClasspath(path));
            assertThrows(Draft.Invalid.class, () -> Draft.fromClasspath(path), "the strict loader refuses the 0.1 form");
        }
        assertEquals(BozzeStoriche.adatta(resource("/sb-6a/attuale.json")), resource(Draft.CURRENT));
        assertEquals(BozzeStoriche.adatta(resource(Draft.CURRENT)), resource(Draft.CURRENT), "the copy is already in its final form");
        assertTrue(!BozzeStoriche.setBase01(resource("/set-base/bozza.json")) && !BozzeStoriche.setBase01(resource(SetBaseArms.FROZEN_15)));
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
