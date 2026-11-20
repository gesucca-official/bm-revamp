package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.bot.BotPolicy;
import com.gsc.bm.model.game.bot.LethalAwarePolicy;
import com.gsc.bm.model.game.bot.RandomPolicy;
import com.gsc.bm.model.game.bot.SoughtHitPolicy;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;

import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.function.BiConsumer;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * SB-19 Fase B1 (D129, D130): the round of the nine cards of the missing slots. Rows against foes, with the twelve lethal-aware styles of the
 * SB-16i round (144 cells per matchup), d50, the draft of {@code -Dsim.draft}, the same seeds as SB-17 and SB-18. Only with
 * {@code -Dsim.sb19Out}. Each pair of decks is played once (the seats alternate by seed): a row against a foe that is itself a row is skipped
 * if the reverse pair is already in the list.
 * <ul>
 * <li>{@code -Dsim.sb19Rows}: comma-separated deck ids, the first named of every matchup; default the seven reference decks ({@link Sb19#REFERENCES}).</li>
 * <li>{@code -Dsim.sb19Foes}: the same for the other side; default the seven reference decks. Rows equal to foes give the 28 pairs of the
 * «Rif» arm (the seven decks among themselves, mirrors included); the nine decks with the additions against the seven give the 63 of the arms.</li>
 * <li>{@code -Dsim.sb19Games}: seeds per cell (4 for the feasibility, 100 for the round).</li>
 * <li>{@code -Dsim.sb19Seed}: first seed (SB-21h, independent confirmations; 7,000,000 by default, as every earlier round).</li>
 * </ul>
 * Writes the matrix, the deck observations (plays of every card, as in SB-17 and SB-18) and the draft read; nothing about the engine changes.
 * SB-19 Fase B2: with a draft that has items with an «In campo» effect (RP-27), also {@code in-play.json} ({@link InPlayObserve});
 * without them nothing more is written, so the output of the «Rif» arm stays the same.
 */
class Sb19MeasureTest {
    private static final ObjectMapper JSON = new ObjectMapper();

    private static List<String> list(String property, List<String> fallback) {
        String value = System.getProperty(property, "");
        return value.isBlank() ? fallback : Arrays.asList(value.split(","));
    }

    @Test @EnabledIfSystemProperty(named = "sim.sb19Out", matches = ".+")
    void round() throws Exception {
        assertEquals(Ruleset.D50, SimulationRunner.selectedRuleset());
        Path out = Path.of(System.getProperty("sim.sb19Out"));
        Files.createDirectories(out);
        Draft draft = Draft.selected();
        Map<String, BotPolicy> styles = new LinkedHashMap<>();
        for (SoughtHitPolicy.Timing t : SoughtHitPolicy.Timing.values()) for (Map.Entry<String, BotPolicy> s : PlaygroundTest.styles().entrySet()) {
            if (s.getKey().equals("casuale")) continue;
            BotPolicy base = s.getValue() == null ? new RandomPolicy() : s.getValue();
            styles.put(t.name() + "/" + s.getKey(), new LethalAwarePolicy(new SoughtHitPolicy(base, t)));
        }
        assertEquals(12, styles.size());
        List<String> rows = list("sim.sb19Rows", Sb19.REFERENCES), foes = list("sim.sb19Foes", Sb19.REFERENCES);
        List<String> decks = new ArrayList<>(rows);
        for (String foe : foes) if (!decks.contains(foe)) decks.add(foe);
        Bench.Settings settings = new Bench.Settings(Integer.getInteger("sim.sb19Games", 100), Long.getLong("sim.sb19Seed", 7_000_000L), decks, styles,
                Integer.getInteger("sim.threads", 8), BoundCap.Params.DEFAULT, "SB-19 Fase B1: " + rows + " against " + foes);
        List<Bench.Cell> cells = new ArrayList<>();
        Set<String> pairs = new HashSet<>();
        for (String row : rows) for (String foe : foes) {
            if (!pairs.add(row + "|" + foe) || pairs.contains(foe + "|" + row) && !row.equals(foe)) continue;
            for (String sa : styles.keySet()) for (String sb : styles.keySet()) cells.add(new Bench.Cell(row, sa, foe, sb));
        }
        PlayerSource source = (deck, id, rng, policy) -> {
            Player p = draft.player(deck, id, rng, policy);
            String style = styles.entrySet().stream().filter(e -> e.getValue() == policy).findFirst().orElseThrow().getKey();
            Field f = Player.class.getDeclaredField("character");
            f.setAccessible(true);
            f.set(p, new ChargeMeasureTest.Measured(p.getCharacter(), deck + "|" + style));
            return p;
        };
        ThreadLocal<DeckSizeObserve> deckWatches = new ThreadLocal<>();
        DeckSizeObserve deckAggregate = new DeckSizeObserve();
        boolean inPlay = InPlayObserve.any(draft);
        ThreadLocal<InPlayObserve> inPlayWatches = new ThreadLocal<>();
        InPlayObserve inPlayAggregate = new InPlayObserve();
        long started = System.nanoTime();
        BiConsumer<String, Game> observation = (stage, g) -> {
            if (stage.equals("ROUND_READY") && g.getTurn() == 0) deckWatches.remove();
            DeckSizeObserve dw = deckWatches.get();
            if (dw == null) { dw = new DeckSizeObserve(); deckWatches.set(dw); }
            dw.accept(stage, g);
            if (inPlay) {
                if (stage.equals("ROUND_READY") && g.getTurn() == 0) inPlayWatches.remove();
                InPlayObserve iw = inPlayWatches.get();
                if (iw == null) { iw = new InPlayObserve(); inPlayWatches.set(iw); }
                iw.accept(stage, g);
                if (stage.equals("ROUND_COMMITTED") && g.isOver()) { inPlayAggregate.merge(iw); inPlayWatches.remove(); }
            }
            if (stage.equals("ROUND_COMMITTED") && g.isOver()) { deckAggregate.merge(dw); deckWatches.remove(); }
        };
        Bench.Report report = Bench.runCells(draft, settings, cells, source, observation);
        double seconds = (System.nanoTime() - started) / 1e9;
        Files.writeString(out.resolve("matrix.json"), JSON.writeValueAsString(JSON.readTree(report.json())));
        Files.writeString(out.resolve("matrix.md"), report.markdown());
        Files.writeString(out.resolve("deck-observations.json"), JSON.writeValueAsString(deckAggregate.totals));
        Files.writeString(out.resolve("draft.json"), JSON.writeValueAsString(draft.json()));
        Files.writeString(out.resolve("seconds.txt"), String.valueOf(seconds));
        if (inPlay) Files.writeString(out.resolve("in-play.json"), JSON.writeValueAsString(inPlayAggregate.totals));
        assertEquals(0, report.checks.total(), report.failures());
        // SB-21h (D159 (2), D160): the unit cap of D33/D36 no longer holds for the bounds; its quantities stay in matrix.json as
        // diagnostics and the bounds are judged against null bounds (+10 points at most), not here.
        System.out.println("sb-19 round: " + report.games() + " games, " + seconds + " seconds");
    }
}
