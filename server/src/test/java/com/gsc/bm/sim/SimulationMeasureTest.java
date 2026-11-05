package com.gsc.bm.sim;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

/** Misura esplicita, esclusa dai normali TestServer. */
@EnabledIfSystemProperty(named = "sim.games", matches = "\\d+")
class SimulationMeasureTest {
    @Test void measure() throws Exception {
        int games = Integer.parseInt(System.getProperty("sim.games"));
        if (games < 1) throw new IllegalArgumentException("sim.games deve essere positivo");
        SimulationRunner runner = new SimulationRunner(new SimulationCatalog());
        List<Integer> turns = new ArrayList<>(games);
        long bruiserWins = 0, junkieWins = 0, firstWins = 0, secondWins = 0, draws = 0, limits = 0, empty = 0;
        long bruiserFirstWins = 0, bruiserSecondWins = 0, junkieFirstWins = 0, junkieSecondWins = 0;
        // Un solo thread, niente tracce; caricamento JDBC e scrittura riepilogo esclusi dal cronometro.
        long start = System.nanoTime();
        for (long seed = 0; seed < games; seed++) {
            boolean bruiserFirst = seed % 2 == 0;
            SimulationRunner.Result result = runner.run(seed, bruiserFirst, false);
            turns.add(result.turns);
            empty += result.emptyMoves;
            if (result.outcome == SimulationRunner.Outcome.FIRST_WIN) {
                firstWins++;
                if (bruiserFirst) { bruiserWins++; bruiserFirstWins++; }
                else { junkieWins++; junkieFirstWins++; }
            } else if (result.outcome == SimulationRunner.Outcome.SECOND_WIN) {
                secondWins++;
                if (bruiserFirst) { junkieWins++; junkieSecondWins++; }
                else { bruiserWins++; bruiserSecondWins++; }
            } else if (result.outcome == SimulationRunner.Outcome.DRAW) draws++;
            else limits++;
        }
        double seconds = (System.nanoTime() - start) / 1_000_000_000.0;
        Collections.sort(turns);
        double median = (turns.get((games - 1) / 2) + turns.get(games / 2)) / 2.0;
        String summary = String.format(Locale.ROOT,
                "games=%d seeds=0..%d alternateSeats=true%n"
                        + "bruiserWins=%d junkieWins=%d firstWins=%d secondWins=%d draws=%d TURN_LIMIT=%d%n"
                        + "bruiserFirstWins=%d bruiserSecondWins=%d junkieFirstWins=%d junkieSecondWins=%d%n"
                        + "turnsMean=%.6f turnsMedian=%.1f turnsMin=%d turnsMax=%d emptyMoves=%d%n"
                        + "seconds=%.6f gamesPerSecond=%.3f threads=1 trace=false%n",
                games, games - 1, bruiserWins, junkieWins, firstWins, secondWins, draws, limits,
                bruiserFirstWins, bruiserSecondWins, junkieFirstWins, junkieSecondWins,
                turns.stream().mapToInt(Integer::intValue).average().orElseThrow(), median,
                turns.get(0), turns.get(games - 1), empty, seconds, games / seconds);
        System.out.print(summary);
        Files.writeString(SimulationCatalog.outputDirectory().resolve("measure-" + games + ".txt"),
                summary, StandardCharsets.UTF_8);
    }
}
