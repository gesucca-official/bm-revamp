package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.model.game.Ruleset;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.concurrent.*;

import static com.gsc.bm.sim.StarterBalanceMeasureTest.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * SB-16e2 (D56): one numeric lot after the SB-16e STOP. Control = round 3 profile, plus three fixed variants.
 * Opt-in measurement, never used by the application. Same seeds, matrix, styles and d50 rules as SB-16e.
 */
class StarterLotMeasureTest {
    static final String CHARGE_PIERA = "base.pino.OffroIo";
    static final String LAST_CELESTINA = "junkie.LethalHeroinDose";
    static final String LAST_PIERA = "base.pino.UltimoGiro";
    /** Run order: variants first, so a timeout can only cost the control, already measured in SB-16e round 3. */
    static final List<String> ORDER = List.of("a", "b", "c", "control");

    static Draft variant(Draft base, String name) {
        ObjectNode root = (ObjectNode) base.json();
        boolean a = name.equals("a") || name.equals("c"), b = name.equals("b") || name.equals("c");
        if (!a && !b && !name.equals("control")) throw new IllegalArgumentException(name);
        if (a) {
            ObjectNode charge = card(root, CHARGE_PIERA);
            int changed = 0;
            for (JsonNode s : charge.path("self"))
                if (s.path("op").asText().equals("gain") && s.path("resource").asText().equals("ALERTNESS")) {
                    assertEquals(20, s.path("amount").asInt()); ((ObjectNode) s).put("amount", 35); changed++;
                }
            assertEquals(1, changed);
            replaceGui(charge, "+20 A", "+35 A");
        }
        if (b) {
            ObjectNode dose = card(root, LAST_CELESTINA);
            int changed = 0;
            for (JsonNode s : dose.path("self"))
                if (s.path("op").asText().equals("damage")) { assertEquals(5, s.path("amount").asInt()); ((ObjectNode) s).put("amount", 2); changed++; }
            assertEquals(1, changed);
            replaceGui(dose, "5 HIT a sé", "2 HIT a sé");
            ObjectNode last = card(root, LAST_PIERA);
            assertEquals(5, last.path("params").path("selfHit").asInt());
            ((ObjectNode) last.get("params")).put("selfHit", 2);
            replaceGui(last, "5 HIT a sé", "2 HIT a sé");
        }
        return name.equals("control") ? base : base.derive(base.source + " [sb16e2-" + name + "]", root);
    }

    static void replaceGui(ObjectNode card, String from, String to) {
        ObjectNode gui = (ObjectNode) card.get("gui");
        boolean any = false;
        for (String field : List.of("description", "gains")) {
            String text = gui.path(field).asText();
            if (text.contains(from)) { gui.put(field, text.replace(from, to)); any = true; }
        }
        assertTrue(any, "metadata of " + card.path("binding").asText() + " must follow the effect");
    }

    /** The SB-16e round 3 snapshot the lot started from (the control). */
    static final Path ROUND_3 = Path.of("../docs/reports/set-base/sb-16e/round-3/draft.json");

    @Test void variantsChangeOnlyTheDeclaredNumbers() throws Exception {
        Draft draft = Draft.fromFile(ROUND_3);
        JsonNode base = draft.json();
        // SB-16e2 adopted variant (c) under D56/D38: the current draft is exactly the measured profile.
        assertEquals(variant(draft, "c").json(), Draft.fromClasspath("/set-base/bozza.json").json());
        Map<String, Set<String>> touched = Map.of("control", Set.of(), "a", Set.of(CHARGE_PIERA),
                "b", Set.of(LAST_CELESTINA, LAST_PIERA), "c", Set.of(CHARGE_PIERA, LAST_CELESTINA, LAST_PIERA));
        for (String name : ORDER) {
            JsonNode v = variant(draft, name).json();
            assertEquals(base.get("decks"), v.get("decks"), name);
            ArrayNode cards = (ArrayNode) base.get("cards");
            for (JsonNode c : cards) {
                String binding = c.path("binding").asText();
                assertEquals(!touched.get(name).contains(binding), c.equals(card(v, binding)), name + " " + binding);
            }
        }
        JsonNode c = variant(draft, "c").json();
        assertTrue(card(c, CHARGE_PIERA).toString().contains("\"amount\":35"));
        assertEquals("+15 L, +35 A", card(c, CHARGE_PIERA).path("gui").path("gains").asText());
        assertEquals(2, card(c, LAST_PIERA).path("params").path("selfHit").asInt());
        assertEquals(12, card(c, LAST_PIERA).path("params").path("base").asInt());
        assertTrue(card(c, LAST_CELESTINA).path("gui").path("description").asText().contains("2 HIT a sé; 7 POISON"));
        assertThrows(IllegalArgumentException.class, () -> variant(draft, "d"));
    }

    @Test
    @EnabledIfSystemProperty(named = "sim.sb16e2Out", matches = ".+")
    void lot() throws Exception {
        assertEquals(Ruleset.D50, SimulationRunner.selectedRuleset());
        Path root = Path.of(System.getProperty("sim.sb16e2Out"));
        Draft draft = Draft.selected();
        List<String> failures = new ArrayList<>();
        for (String name : ORDER) {
            long start = System.nanoTime();
            Path out = root.resolve(name); Files.createDirectories(out);
            Draft d = variant(draft, name);
            Files.writeString(out.resolve("draft.json"), JSON.writeValueAsString(d.json()));
            // Invariant or bound failures are recorded (matrix.json is written first) without skipping the other variants.
            try { measureBench(d, out, "matrix", 2000); } catch (AssertionError e) { failures.add(name + ": " + e.getMessage()); }
            observeMirrors(d, out);
            Files.writeString(out.resolve("seconds.txt"), Double.toString((System.nanoTime() - start) / 1e9));
        }
        assertTrue(failures.isEmpty(), String.join("\n", failures));
    }

    /** Same observer and seeds as SB-16e (first 400 per cell), only the Celestina and Piera mirrors. */
    static void observeMirrors(Draft draft, Path out) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(8);
        List<Future<Object>> futures = new ArrayList<>();
        try {
            for (int i : new int[] {2, 3})
                for (String sa : BenchMeasureTest.styles().keySet()) for (String sb : BenchMeasureTest.styles().keySet()) {
                    final int deck = i;
                    futures.add(pool.submit(() -> {
                        Counts ca = new Counts(), cb = new Counts();
                        for (long seed = 7_000_000; seed < 7_000_400; seed++) {
                            boolean first = seed % 2 == 0;
                            Map<String, Counts> counts = new HashMap<>(); Watch watch = new Watch(counts);
                            SimulationRunner runner = new SimulationRunner(observedSource(draft, counts), Ruleset.D50);
                            SimulationRunner.Contender x = new SimulationRunner.Contender(DECKS[deck], BenchMeasureTest.styles().get(sa));
                            SimulationRunner.Contender y = new SimulationRunner.Contender(DECKS[deck], BenchMeasureTest.styles().get(sb));
                            SimulationRunner.Result r = runner.run(seed, first ? x : y, first ? y : x, watch); watch.finish(r);
                            counts.get("seat-1").add("games"); counts.get("seat-1").add("turns", r.turns);
                            ca.merge(counts.get(first ? "seat-1" : "seat-2")); cb.merge(counts.get(first ? "seat-2" : "seat-1"));
                        }
                        Map<String, Object> row = new LinkedHashMap<>(); row.put("a", DECKS[deck]); row.put("b", DECKS[deck]);
                        row.put("styleA", sa); row.put("styleB", sb); row.put("aCounts", ca); row.put("bCounts", cb); return row;
                    }));
                }
            List<Object> rows = new ArrayList<>(); for (Future<Object> f : futures) rows.add(f.get());
            Files.writeString(out.resolve("mirrors.json"), JSON.writeValueAsString(rows));
        } finally { pool.shutdownNow(); }
    }
}
