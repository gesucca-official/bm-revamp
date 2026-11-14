package com.gsc.bm.sim;

import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.bot.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

import static com.gsc.bm.sim.StarterBalanceMeasureTest.DECKS;
import static com.gsc.bm.sim.StarterBalanceMeasureTest.JSON;
import static org.junit.jupiter.api.Assertions.*;

/**
 * SB-30b B5b, opt-in ({@code -Dsim.b5b=cost|sanity|all}), never part of the normal run, no balance measure, no ladder.
 * <ul>
 *   <li>{@code cost}: the Difficile's cost per decision, one thread, on the probe's 150 decisions from real d50 games of the
 *       draft ({@link Sb30bProbeTest#points}, same seeds as §3.3 of the design); D85 point 4 asks P90 under 50 ms.</li>
 *   <li>{@code sanity}: a few hundred games Difficile against Normale with the same style, seats alternated, mixed decks, on the
 *       reference arm B: only to rule out a bug that makes the Difficile weaker. Not a strength measure: that is B6.</li>
 * </ul>
 */
class DifficileMeasureTest {

    static boolean on(String part) {
        String value = System.getProperty("sim.b5b", "");
        return value.equals("all") || Arrays.asList(value.split(",")).contains(part);
    }

    static Path out() throws Exception {
        Path out = Path.of(System.getProperty("sim.b5bOut", "target/b5b"));
        Files.createDirectories(out);
        return out;
    }

    static BotPolicy sought(BotPolicy style) { return new SoughtHitPolicy(style, SoughtHitPolicy.Timing.ALWAYS); }

    @Test @EnabledIfSystemProperty(named = "sim.b5b", matches = ".+")
    void costPerDecision() throws Exception {
        org.junit.jupiter.api.Assumptions.assumeTrue(on("cost"));
        long started = System.nanoTime();
        Draft draft = Draft.fromClasspath(Sb30bProbeTest.DRAFT);
        Map<String, BotView.CardSeen> catalog = PublicCatalog.of(draft);
        List<Sb30bProbeTest.Point> points = Sb30bProbeTest.points(draft, Integer.getInteger("sim.b5bPoints", 150), 7_200_000L, false);
        List<BotPolicy> styles = List.of(new AggressivePolicy(), new PrudentPolicy(), new ResourceAwarePolicy());
        List<Long> nanos = new ArrayList<>(), normale = new ArrayList<>();
        List<Integer> moves = new ArrayList<>();
        for (int rep = 0; rep < 2; rep++)
            for (int i = 0; i < points.size(); i++) {
                BotView v = points.get(i).view;
                BotPolicy style = styles.get(i % 3);
                DifficilePolicy d = new DifficilePolicy(sought(style), catalog);
                BotPolicy n = new LethalAwarePolicy(sought(style));
                long t0 = System.nanoTime();
                d.choose(v, v.legalMoves(), new Random(i));
                long t1 = System.nanoTime();
                n.choose(v, v.legalMoves(), new Random(i));
                long t2 = System.nanoTime();
                if (rep == 1) { nanos.add(t1 - t0); normale.add(t2 - t1); moves.add(v.legalMoves().size()); }
            }
        Collections.sort(moves);
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("draft", Sb30bProbeTest.DRAFT);
        summary.put("thread", 1);
        summary.put("points", points.size());
        summary.put("legalMovesMedian", moves.get(moves.size() / 2));
        summary.put("legalMovesMax", moves.get(moves.size() - 1));
        summary.put("difficile", Sb30bProbeTest.stats(nanos));
        summary.put("normale", Sb30bProbeTest.stats(normale));
        summary.put("seconds", (System.nanoTime() - started) / 1e9);
        Files.writeString(out().resolve("cost.json"), JSON.writeValueAsString(summary));
        System.out.println("b5b cost: " + JSON.writeValueAsString(summary));
        assertTrue((double) ((Map<?, ?>) summary.get("difficile")).get("p90Ms") < 50, "D85 punto 4: P90 sotto 50 ms");
    }

    /** Times every decision of the policy it wraps, inside real games. */
    static final class Timed implements BotPolicy {
        final BotPolicy inner;
        final List<Long> nanos;

        Timed(BotPolicy inner, List<Long> nanos) { this.inner = inner; this.nanos = nanos; }

        @Override public LegalMove choose(BotView view, List<LegalMove> legal, Random random) {
            long t0 = System.nanoTime();
            LegalMove m = inner.choose(view, legal, random);
            nanos.add(System.nanoTime() - t0);
            return m;
        }
    }

    @Test @EnabledIfSystemProperty(named = "sim.b5b", matches = ".+")
    void sanityAgainstTheNormale() throws Exception {
        org.junit.jupiter.api.Assumptions.assumeTrue(on("sanity"));
        long started = System.nanoTime();
        Draft draft = SetBaseArms.arm("B", Draft.fromClasspath(Sb30bProbeTest.DRAFT));
        Map<String, BotView.CardSeen> catalog = PublicCatalog.of(draft);
        SimulationRunner runner = new SimulationRunner(draft, Ruleset.D50);
        List<BotPolicy> styles = List.of(new AggressivePolicy(), new PrudentPolicy(), new ResourceAwarePolicy());
        int games = Integer.getInteger("sim.b5bGames", 300);
        int wins = 0, losses = 0, draws = 0, limits = 0;
        int[][] byStyle = new int[3][2];
        List<Long> nanos = new ArrayList<>();
        for (long seed = 7_500_000; seed < 7_500_000 + games; seed++) {
            String a = DECKS[(int) (seed % 5)], b = DECKS[(int) ((seed / 5) % 5)];
            int s = (int) ((seed / 25) % 3);
            boolean difficileFirst = seed % 2 == 0;
            BotPolicy d = new Timed(new DifficilePolicy(sought(styles.get(s)), catalog), nanos);
            BotPolicy n = new LethalAwarePolicy(sought(styles.get(s)));
            SimulationRunner.Result r = runner.run(seed, new SimulationRunner.Contender(a, difficileFirst ? d : n),
                    new SimulationRunner.Contender(b, difficileFirst ? n : d));
            switch (r.outcome) {
                case FIRST_WIN: if (difficileFirst) { wins++; byStyle[s][0]++; } else { losses++; byStyle[s][1]++; } break;
                case SECOND_WIN: if (difficileFirst) { losses++; byStyle[s][1]++; } else { wins++; byStyle[s][0]++; } break;
                case DRAW: draws++; break;
                default: limits++;
            }
        }
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("draft", Sb30bProbeTest.DRAFT + " arm B");
        summary.put("games", games);
        summary.put("seeds", "7500000-" + (7_500_000 + games - 1));
        summary.put("difficileWins", wins);
        summary.put("normaleWins", losses);
        summary.put("draws", draws);
        summary.put("turnLimit", limits);
        summary.put("difficileShareOfDecided", wins + losses == 0 ? 0 : (double) wins / (wins + losses));
        Map<String, Object> styleMap = new LinkedHashMap<>();
        String[] labels = {"aggressive", "prudent", "resources"};
        for (int s = 0; s < 3; s++) styleMap.put(labels[s], Map.of("difficile", byStyle[s][0], "normale", byStyle[s][1]));
        summary.put("byStyle", styleMap);
        summary.put("difficileDecisionsInGames", Sb30bProbeTest.stats(nanos));
        summary.put("seconds", (System.nanoTime() - started) / 1e9);
        Files.writeString(out().resolve("sanity.json"), JSON.writeValueAsString(summary));
        System.out.println("b5b sanity: " + JSON.writeValueAsString(summary));
        assertTrue(wins + losses > 0);
    }
}
