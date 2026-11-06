package com.gsc.bm.sim;

import com.gsc.bm.model.game.bot.BotPolicy;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.fail;

/**
 * SB-7, misure a richiesta. Stesse opzioni del lanciatore di SB-6a (sim.draft, sim.decks, sim.styles, sim.firstSeed), più:
 * <ul>
 *   <li>-Dsim.bench=&lt;partite per cella&gt;: matrice, invarianti e tetto delle bound;</li>
 *   <li>-Dsim.search=&lt;personaggio,...|all&gt;: ricerca dei mazzi;</li>
 *   <li>-Dsim.threads (predefinito: i processori), -Dsim.strict=true (fallisce se un invariante è violato), -Dsim.note;</li>
 *   <li>-Dsim.boundCap, -Dsim.boundTolerance, -Dsim.boundWeights: il tetto delle bound.</li>
 * </ul>
 * Stili predefiniti: i tre euristici. Primo seme predefinito 7.000.000. I rapporti vanno in tmp/sim/, i tempi in un file a parte.
 */
class BenchMeasureTest {
    static final List<String> DEFAULT_STYLES = List.of("aggressivo", "prudente", "risorse");

    @Test
    @EnabledIfSystemProperty(named = "sim.bench", matches = "\\d+")
    void matrix() throws Exception {
        int games = Integer.parseInt(System.getProperty("sim.bench"));
        long firstSeed = Long.getLong("sim.firstSeed", 7_000_000L);
        Draft draft = Draft.selected();
        Bench.Settings settings = new Bench.Settings(games, firstSeed, list("sim.decks", new ArrayList<>(draft.deckIds())), styles(),
                threads(), BoundCap.Params.fromSystem(), System.getProperty("sim.note"));
        long start = System.nanoTime();
        Bench.Report report = Bench.run(draft, settings);
        double seconds = (System.nanoTime() - start) / 1e9;
        String base = "sb7-" + Bench.draftName(draft).replace(".json", "") + "-" + games + (firstSeed == 7_000_000L ? "" : "-from" + firstSeed);
        Path dir = SimulationCatalog.outputDirectory();
        Files.writeString(dir.resolve(base + ".md"), report.markdown(), StandardCharsets.UTF_8);
        Files.writeString(dir.resolve(base + ".json"), report.json(), StandardCharsets.UTF_8);
        String times = String.format(Locale.ROOT, "banco %s%nbozza %s%npartite %d%ncelle %d%nthread %d%nsecondi %.3f%npartite al secondo %.1f%n"
                        + "millisecondi per partita (tempo reale diviso partite) %.4f%n", Bench.VERSION, Bench.shownSource(draft),
                report.games(), report.cells.size(), settings.threads, seconds, report.games() / seconds,
                seconds * 1000 / report.games());
        Files.writeString(dir.resolve(base + ".tempi.txt"), times, StandardCharsets.UTF_8);
        System.out.println(report.markdown());
        System.out.println(times);
        if (Boolean.getBoolean("sim.strict") && (report.checks.total() > 0 || report.boundViolations() > 0))
            fail("Invarianti violati:\n" + report.failures());
    }

    @Test
    @EnabledIfSystemProperty(named = "sim.search", matches = ".+")
    void search() throws Exception {
        Draft draft = Draft.selected();
        String which = System.getProperty("sim.search");
        List<String> characters = "all".equals(which) ? new ArrayList<>(draft.characterIds()) : list("sim.search", List.of());
        DeckSearch.Params standard = DeckSearch.Params.standard(threads());
        DeckSearch.Params params = new DeckSearch.Params(standard.lambda, Integer.getInteger("sim.searchGames", standard.gamesPerCombo),
                Integer.getInteger("sim.searchGenerations", standard.maxGenerations), standard.patience,
                Integer.getInteger("sim.validationGames", standard.validationGames), standard.finalists, standard.threads,
                standard.searchSeed, standard.validationSeed, standard.mutationSeed);
        DeckSearch search = new DeckSearch(draft, styles(), params);
        long start = System.nanoTime();
        List<DeckSearch.Outcome> outcomes = new ArrayList<>();
        for (String character : characters) {
            if (!draft.characterIds().contains(character))
                throw new IllegalArgumentException("Personaggio assente: " + character + " (noti: " + draft.characterIds() + ")");
            outcomes.addAll(search.search(character));
        }
        double seconds = (System.nanoTime() - start) / 1e9;
        String base = "sb7-ricerca-" + Bench.draftName(draft).replace(".json", "") + "-" + ("all".equals(which) ? "all" : String.valueOf(characters.size()));
        Path dir = SimulationCatalog.outputDirectory();
        String note = System.getProperty("sim.note");
        Files.writeString(dir.resolve(base + ".md"), search.markdown(outcomes, note), StandardCharsets.UTF_8);
        Files.writeString(dir.resolve(base + ".json"), search.json(outcomes, note), StandardCharsets.UTF_8);
        String times = String.format(Locale.ROOT, "banco %s%nbozza %s%nricerche %d%nthread %d%nsecondi %.3f%n", Bench.VERSION,
                Bench.shownSource(draft), outcomes.size(), params.threads, seconds);
        Files.writeString(dir.resolve(base + ".tempi.txt"), times, StandardCharsets.UTF_8);
        System.out.println(search.markdown(outcomes, note));
        System.out.println(times);
    }

    static int threads() {
        return Integer.getInteger("sim.threads", Runtime.getRuntime().availableProcessors());
    }

    static Map<String, BotPolicy> styles() {
        Map<String, BotPolicy> known = PlaygroundTest.styles();
        Map<String, BotPolicy> styles = new LinkedHashMap<>();
        for (String style : list("sim.styles", DEFAULT_STYLES)) {
            if (!known.containsKey(style)) throw new IllegalArgumentException("Stile sconosciuto: " + style + " (noti: " + known.keySet() + ")");
            styles.put(style, known.get(style));
        }
        return styles;
    }

    static List<String> list(String property, List<String> all) {
        String value = System.getProperty(property);
        if (value == null || value.isBlank()) return all;
        return Arrays.asList(value.split("\\s*,\\s*"));
    }
}
