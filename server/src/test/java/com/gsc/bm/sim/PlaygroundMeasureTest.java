package com.gsc.bm.sim;

import com.gsc.bm.model.game.bot.BotPolicy;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Misura a richiesta sulla bozza scelta (SB-6a). Si lancia con
 * -Dtest=PlaygroundMeasureTest -Dsim.playground=<partite> [-Dsim.draft=<percorso>] [-Dsim.decks=a,b] [-Dsim.styles=com,aggressivo]
 * [-Dsim.firstSeed=<seme>]. Ogni coppia ordinata di mazzi (specchi compresi) per ogni coppia ordinata di stili, a posti alternati.
 * Il banco vero, con intervalli e invarianti, è SB-7.
 */
@EnabledIfSystemProperty(named = "sim.playground", matches = "\\d+")
class PlaygroundMeasureTest {

    @Test void measure() throws Exception {
        int games = Integer.parseInt(System.getProperty("sim.playground"));
        if (games < 1) throw new IllegalArgumentException("sim.playground deve essere positivo");
        long firstSeed = Long.getLong("sim.firstSeed", 0L);
        Draft draft = Draft.selected();
        List<String> decks = list("sim.decks", new ArrayList<>(draft.deckIds()));
        for (String deck : decks) if (!draft.deckIds().contains(deck)) throw new IllegalArgumentException("Mazzo assente: " + deck + " (noti: " + draft.deckIds() + ")");
        Map<String, BotPolicy> known = PlaygroundTest.styles();
        Map<String, BotPolicy> styles = new LinkedHashMap<>();
        for (String style : list("sim.styles", new ArrayList<>(known.keySet()))) {
            if (!known.containsKey(style)) throw new IllegalArgumentException("Stile sconosciuto: " + style + " (noti: " + known.keySet() + ")");
            styles.put(style, known.get(style));
        }
        SimulationRunner runner = new SimulationRunner(draft);
        StringBuilder summary = new StringBuilder();
        summary.append("bozza ").append(draft.source).append(" sha256 ").append(sha256(draft.source)).append('\n');
        summary.append(String.format(Locale.ROOT, "partite per riga %d, semi da %d, posti alternati per seme%n", games, firstSeed));
        summary.append("mazzo A | stile A | mazzo B | stile B | partite | A | B | patte | limite | quota A | turni medi\n");
        for (String a : decks) for (String b : decks) for (Map.Entry<String, BotPolicy> sa : styles.entrySet())
            for (Map.Entry<String, BotPolicy> sb : styles.entrySet()) {
                int aWins = 0, bWins = 0, draws = 0, limits = 0, turns = 0;
                for (long seed = firstSeed; seed < firstSeed + games; seed++) {
                    boolean aFirst = seed % 2 == 0;
                    SimulationRunner.Contender ca = new SimulationRunner.Contender(a, sa.getValue());
                    SimulationRunner.Contender cb = new SimulationRunner.Contender(b, sb.getValue());
                    SimulationRunner.Result result = runner.run(seed, aFirst ? ca : cb, aFirst ? cb : ca);
                    turns += result.turns;
                    if (result.outcome == SimulationRunner.Outcome.DRAW) draws++;
                    else if (result.outcome == SimulationRunner.Outcome.TURN_LIMIT) limits++;
                    else if ((result.outcome == SimulationRunner.Outcome.FIRST_WIN) == aFirst) aWins++;
                    else bWins++;
                }
                summary.append(String.format(Locale.ROOT, "%s | %s | %s | %s | %d | %d | %d | %d | %d | %.3f | %.2f%n",
                        a, sa.getKey(), b, sb.getKey(), games, aWins, bWins, draws, limits,
                        aWins + bWins == 0 ? 0 : (double) aWins / (aWins + bWins), (double) turns / games));
            }
        System.out.print(summary);
        String name = Path.of(draft.source.replace("classpath:", "")).getFileName().toString().replace(".json", "");
        Files.writeString(SimulationCatalog.outputDirectory().resolve("playground-" + name + "-" + games
                + (firstSeed == 0 ? "" : "-from" + firstSeed) + ".txt"), summary, StandardCharsets.UTF_8);
    }

    private static List<String> list(String property, List<String> all) {
        String value = System.getProperty(property);
        if (value == null || value.isBlank()) return all;
        return Arrays.asList(value.split("\\s*,\\s*"));
    }

    private static String sha256(String source) throws Exception {
        byte[] bytes = source.startsWith("classpath:")
                ? Draft.class.getResourceAsStream(source.substring("classpath:".length())).readAllBytes()
                : Files.readAllBytes(Path.of(source));
        StringBuilder hex = new StringBuilder();
        for (byte b : MessageDigest.getInstance("SHA-256").digest(bytes)) hex.append(String.format("%02x", b));
        return hex.toString();
    }
}
