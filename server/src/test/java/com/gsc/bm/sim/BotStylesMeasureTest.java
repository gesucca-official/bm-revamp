package com.gsc.bm.sim;

import com.gsc.bm.model.game.bot.AggressivePolicy;
import com.gsc.bm.model.game.bot.BotPolicy;
import com.gsc.bm.model.game.bot.PrudentPolicy;
import com.gsc.bm.model.game.bot.RandomPolicy;
import com.gsc.bm.model.game.bot.ResourceAwarePolicy;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/** Misura esplicita: ogni stile contro l'attuale ComPlayer casuale, in tutti gli abbinamenti di personaggi e a posti alternati. */
@EnabledIfSystemProperty(named = "sim.bots", matches = "\\d+")
class BotStylesMeasureTest {
    /** Gli stili da misurare. RandomPolicy resta come controllo: deve stare intorno al 50%. */
    static Map<String, BotPolicy> styles() {
        Map<String, BotPolicy> styles = new LinkedHashMap<>();
        styles.put("casuale sulla vista", new RandomPolicy());
        styles.put("aggressivo", new AggressivePolicy());
        styles.put("prudente", new PrudentPolicy());
        styles.put("risorse", new ResourceAwarePolicy());
        return styles;
    }

    /** Bruiser con ogni stile contro Junkie con ogni stile: la quota dice quanto pesa il personaggio, non chi gioca meglio. */
    @Test void matrix() throws Exception {
        int games = Integer.parseInt(System.getProperty("sim.bots"));
        long firstSeed = Long.getLong("sim.firstSeed", 0L);
        SimulationRunner runner = new SimulationRunner(new SimulationCatalog());
        StringBuilder summary = new StringBuilder("Bruiser con | Junkie con | partite | Bruiser | Junkie | patte | limite | quota Bruiser | turni medi\n");
        for (Map.Entry<String, BotPolicy> bruiser : styles().entrySet())
            for (Map.Entry<String, BotPolicy> junkie : styles().entrySet()) {
                int bruiserWins = 0, junkieWins = 0, draws = 0, limits = 0, turns = 0;
                for (long seed = firstSeed; seed < firstSeed + games; seed++) {
                    boolean bruiserFirst = seed % 2 == 0;
                    SimulationRunner.Contender b = new SimulationRunner.Contender(SimulationCatalog.BRUISER, bruiser.getValue());
                    SimulationRunner.Contender j = new SimulationRunner.Contender(SimulationCatalog.JUNKIE, junkie.getValue());
                    SimulationRunner.Result result = runner.run(seed, bruiserFirst ? b : j, bruiserFirst ? j : b);
                    turns += result.turns;
                    if (result.outcome == SimulationRunner.Outcome.DRAW) draws++;
                    else if (result.outcome == SimulationRunner.Outcome.TURN_LIMIT) limits++;
                    else if ((result.outcome == SimulationRunner.Outcome.FIRST_WIN) == bruiserFirst) bruiserWins++;
                    else junkieWins++;
                }
                summary.append(String.format(Locale.ROOT, "%s | %s | %d | %d | %d | %d | %d | %.3f | %.2f%n",
                        bruiser.getKey(), junkie.getKey(), games, bruiserWins, junkieWins, draws, limits,
                        bruiserWins + junkieWins == 0 ? 0 : (double) bruiserWins / (bruiserWins + junkieWins), (double) turns / games));
            }
        System.out.print(summary);
        Files.writeString(SimulationCatalog.outputDirectory().resolve("bot-matrix-" + games + (firstSeed == 0 ? "" : "-from" + firstSeed) + ".txt"),
                summary, StandardCharsets.UTF_8);
    }

    @Test void measure() throws Exception {
        int games = Integer.parseInt(System.getProperty("sim.bots"));
        if (games < 1) throw new IllegalArgumentException("sim.bots deve essere positivo");
        long firstSeed = Long.getLong("sim.firstSeed", 0L);
        SimulationRunner runner = new SimulationRunner(new SimulationCatalog());
        List<String> characters = List.of(SimulationCatalog.BRUISER, SimulationCatalog.JUNKIE);
        StringBuilder summary = new StringBuilder("stile | stile con | casuale con | partite | vittorie | sconfitte | patte | limite | quota | turni medi\n");
        for (Map.Entry<String, BotPolicy> style : styles().entrySet())
            for (String mine : characters)
                for (String theirs : characters) {
                    int wins = 0, losses = 0, draws = 0, limits = 0, turns = 0;
                    for (long seed = firstSeed; seed < firstSeed + games; seed++) {
                        boolean styleFirst = seed % 2 == 0;
                        SimulationRunner.Contender bot = new SimulationRunner.Contender(mine, style.getValue());
                        SimulationRunner.Contender random = new SimulationRunner.Contender(theirs, null);
                        SimulationRunner.Result result = runner.run(seed, styleFirst ? bot : random, styleFirst ? random : bot);
                        turns += result.turns;
                        if (result.outcome == SimulationRunner.Outcome.DRAW) draws++;
                        else if (result.outcome == SimulationRunner.Outcome.TURN_LIMIT) limits++;
                        else if ((result.outcome == SimulationRunner.Outcome.FIRST_WIN) == styleFirst) wins++;
                        else losses++;
                    }
                    summary.append(String.format(Locale.ROOT, "%s | %s | %s | %d | %d | %d | %d | %d | %.3f | %.2f%n",
                            style.getKey(), mine, theirs, games, wins, losses, draws, limits,
                            wins + losses == 0 ? 0 : (double) wins / (wins + losses), (double) turns / games));
                }
        System.out.print(summary);
        Files.writeString(SimulationCatalog.outputDirectory().resolve("bot-styles-" + games + (firstSeed == 0 ? "" : "-from" + firstSeed) + ".txt"),
                summary, StandardCharsets.UTF_8);
    }
}
