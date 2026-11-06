package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.gsc.bm.model.game.bot.BotPolicy;
import org.junit.jupiter.api.Test;

import java.util.LinkedHashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

/**
 * SB-11a: l'àncora del listino è un parametro (-Dsim.listinoAnchor, 10 di difetto). Con il difetto la bozza base e i testi delle domande
 * sono quelli di SB-10a e SB-10b; con un altro valore cambiano solo le due carte àncora. Le misure vere sono in ListinoMeasureTest.
 */
class ListinoAnchorTest {
    /** SHA-256 di listino-base.json, quello scritto nei rapporti di SB-10a e SB-10b. */
    private static final String SB10_SHA = "87fa95f18772385258c51c05de784487beb4fa0dc9a67062d6783fff35b7b1b1";

    @Test
    void theDefaultAnchorIsTenAndLeavesTheSb10BaseAndQuestionsUntouched() throws Exception {
        assumeTrue(System.getProperty("sim.listinoAnchor") == null, "Il difetto vale solo senza -Dsim.listinoAnchor");
        assertEquals(10, Listino.ANCHOR);
        assertEquals(SB10_SHA, Bench.sha256(Listino.baseDraft()));
        Listino listino = new Listino(Listino.baseDraft(), new Listino.Params(1, 1, 1, 1), Map.of());
        Map<String, String> readings = new LinkedHashMap<>();
        for (Listino.Bisection b : listino.bisections()) readings.put(b.id, b.reading + "|" + b.hi);
        assertEquals("danni per unità = (x − 10) / 10|60", readings.get("costo-V10-spazienzio"));
        assertEquals("danni per unità = (x − 10) / 20|110", readings.get("costo-V20-spazienzio"));
        assertEquals("1 CUT vale 10 / x HIT|30", readings.get("tipo-CUT-spazienzio"));
        assertEquals("un punto di priorità vale ±(x − 10) HIT|30", readings.get("priorita-2-mara"));
    }

    @Test
    void anotherAnchorChangesOnlyTheTwoAnchorCards() throws Exception {
        Draft base = Draft.fromClasspath(Listino.BASE), seven = Listino.withAnchor(base, 7);
        JsonNode before = base.json(), after = seven.json();
        for (String binding : new String[] {Listino.SLOT1, Listino.SLOT2}) {
            JsonNode card = card(after, binding);
            assertEquals(7, card.get("target").get(0).get("amount").asInt());
            assertEquals("HIT 7", card.get("gui").get("damageAmount").asText());
            assertEquals("HIT", card.get("target").get(0).get("type").asText());
        }
        // Rimessi a 10 i due campi, il resto è lo stesso albero.
        com.fasterxml.jackson.databind.node.ObjectNode restored = (com.fasterxml.jackson.databind.node.ObjectNode) after.deepCopy();
        for (String binding : new String[] {Listino.SLOT1, Listino.SLOT2}) {
            JsonNode card = card(restored, binding);
            ((com.fasterxml.jackson.databind.node.ObjectNode) card.get("target").get(0)).put("amount", 10);
            ((com.fasterxml.jackson.databind.node.ObjectNode) card.get("gui")).put("damageAmount", "HIT 10");
        }
        assertEquals(before, restored);
        assertEquals(base.deckIds(), seven.deckIds());
        assertTrue(!Bench.sha256(base).equals(Bench.sha256(seven)), "Una bozza diversa ha un'altra impronta");
    }

    /** Con l'àncora a 7 una sonda da 7 HIT sta al 50% e una da 10 è sopra; con la base di SB-10a è la sonda da 10 a stare al 50%. */
    @Test
    void theAnchorValueIsWhatTheProbesAreComparedWith() throws Exception {
        Map<String, BotPolicy> styles = new LinkedHashMap<>(PlaygroundTest.styles());
        styles.remove("com");
        styles.remove("casuale");
        Draft ten = Draft.fromClasspath(Listino.BASE), seven = Listino.withAnchor(ten, 7);
        Listino onSeven = new Listino(seven, new Listino.Params(1, 1, 1, 1), styles);
        Listino onTen = new Listino(ten, new Listino.Params(1, 1, 1, 1), styles);
        Listino.Point same = onSeven.evaluate(onSeven.slotProbe(Listino.NEUTRO, null, id -> Listino.hitter(id, Map.of(), 1, "HIT", 7)),
                300, Listino.GRID_SEED, false, 7);
        assertTrue(same.ci()[0] < 0.5 && same.ci()[1] > 0.5, "7 contro un'àncora da 7: " + same.share());
        Listino.Point stronger = onSeven.evaluate(onSeven.slotProbe(Listino.NEUTRO, null, id -> Listino.hitter(id, Map.of(), 1, "HIT", 10)),
                300, Listino.GRID_SEED, false, 10);
        assertTrue(stronger.ci()[0] > 0.5, "10 contro un'àncora da 7: " + stronger.share());
        Listino.Point tenAgainstTen = onTen.evaluate(onTen.slotProbe(Listino.NEUTRO, null, id -> Listino.hitter(id, Map.of(), 1, "HIT", 10)),
                300, Listino.GRID_SEED, false, 10);
        assertTrue(tenAgainstTen.ci()[0] < 0.5 && tenAgainstTen.ci()[1] > 0.5, "10 contro un'àncora da 10: " + tenAgainstTen.share());
    }

    @Test
    void anchorsOutsideTheSensibleRangeAreRefused() {
        assertEquals(7, Listino.checkedAnchor(7));
        for (int bad : new int[] {0, -3, 101}) {
            IllegalArgumentException error = assertThrows(IllegalArgumentException.class, () -> Listino.checkedAnchor(bad));
            assertTrue(error.getMessage().contains("sim.listinoAnchor") && error.getMessage().contains(String.valueOf(bad)), error.getMessage());
        }
    }

    private static JsonNode card(JsonNode root, String binding) {
        for (JsonNode card : root.get("cards")) if (card.get("binding").asText().equals(binding)) return card;
        throw new IllegalArgumentException(binding);
    }
}
