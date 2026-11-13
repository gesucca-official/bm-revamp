package com.gsc.bm.sim;

import com.gsc.bm.model.game.*;
import com.gsc.bm.model.game.bot.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;

import java.lang.reflect.Field;
import java.nio.file.*;
import java.util.*;

import static com.gsc.bm.sim.StarterBalanceMeasureTest.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * D76, opt-in comparison, not a balance round (outside the D68 budget): the lethal-aware bots against the bots of step 1 of the
 * 2b, same seeds as step 1 (from 7.000.000), current draft, the four styles with the timing ALWAYS of the draft's computer.
 * Writes the matrix of the bench and a summary: share of decisive games won by the new bot against the old one, draws by
 * pairing, cost of the token per successful search by pairing.
 */
class LethalBotMeasureTest {

    static final String NEW = "d76", OLD = "passo1";

    static String group(String style) { return style.substring(0, style.indexOf('/')); }

    /** Decisions of the new bots: all, those whose moves it restricted, those where the choice changed; by shown hit or not. */
    static final java.util.concurrent.ConcurrentHashMap<String, java.util.concurrent.atomic.AtomicLong> DECISIONS =
            new java.util.concurrent.ConcurrentHashMap<>();
    static final ThreadLocal<List<LegalMove>> FULL = new ThreadLocal<>();

    static void count(String key) { DECISIONS.computeIfAbsent(key, k -> new java.util.concurrent.atomic.AtomicLong()).incrementAndGet(); }

    /** Around the lethal-aware bot: remembers the full legal list for {@link Recorder}. Draws nothing. */
    static final class Counting implements BotPolicy {
        final LethalAwarePolicy lethal;
        Counting(LethalAwarePolicy lethal) { this.lethal = lethal; }
        @Override public LegalMove choose(BotView view, List<LegalMove> legal, Random random) {
            FULL.set(legal);
            try { return lethal.choose(view, legal, random); } finally { FULL.remove(); }
        }
    }

    /** Inside it: counts restrictions and, on a copy of the Random, what the step-1 bot would have chosen from the full list. */
    static final class Recorder implements BotPolicy {
        final BotPolicy timed;
        Recorder(BotPolicy timed) { this.timed = timed; }
        @Override public LegalMove choose(BotView view, List<LegalMove> pool, Random random) {
            List<LegalMove> full = FULL.get();
            boolean shown = view.getOpponents().stream().anyMatch(o -> o.getRevealed().stream().anyMatch(r -> r.getCard().nominalDamage() > 0));
            String kind = shown ? "conColpoMostrato" : "senzaColpoMostrato";
            count("decisioni"); count("decisioni-" + kind);
            if (full != null && pool.size() < full.size()) {
                count("ristrette"); count("ristrette-" + kind);
                LegalMove before = timed.choose(view, full, copy(random));
                LegalMove now = timed.choose(view, pool, random);
                if (!before.equals(now)) { count("cambiate"); count("cambiate-" + kind); }
                return now;
            }
            return timed.choose(view, pool, random);
        }
        static Random copy(Random random) {
            try {
                java.io.ByteArrayOutputStream bytes = new java.io.ByteArrayOutputStream();
                try (java.io.ObjectOutputStream out = new java.io.ObjectOutputStream(bytes)) { out.writeObject(random); }
                try (java.io.ObjectInputStream in = new java.io.ObjectInputStream(new java.io.ByteArrayInputStream(bytes.toByteArray()))) {
                    return (Random) in.readObject();
                }
            } catch (Exception e) { throw new IllegalStateException(e); }
        }
    }

    @Test @EnabledIfSystemProperty(named = "sim.lethalOut", matches = ".+")
    void newAgainstStepOne() throws Exception {
        assertEquals(Ruleset.D50, SimulationRunner.selectedRuleset());
        Path out = Path.of(System.getProperty("sim.lethalOut"));
        Files.createDirectories(out);
        Draft draft = Draft.selected();
        Map<String, BotPolicy> styles = new LinkedHashMap<>();
        for (String group : List.of(OLD, NEW))
            for (Map.Entry<String, BotPolicy> s : PlaygroundTest.styles().entrySet()) {
                if (s.getKey().equals("casuale")) continue;
                BotPolicy timed = new SoughtHitPolicy(s.getValue() == null ? new RandomPolicy() : s.getValue(), SoughtHitPolicy.Timing.ALWAYS);
                styles.put(group + "/" + s.getKey(), group.equals(NEW) ? new Counting(new LethalAwarePolicy(new Recorder(timed))) : timed);
            }
        assertEquals(8, styles.size());
        Map<String, Counts> totals = new TreeMap<>();
        ThreadLocal<ChargeMeasureTest.Observe> watches = new ThreadLocal<>();
        PlayerSource source = (deck, id, rng, policy) -> {
            Player p = draft.player(deck, id, rng, policy);
            String style = styles.entrySet().stream().filter(e -> e.getValue() == policy).findFirst().orElseThrow().getKey();
            Field f = Player.class.getDeclaredField("character");
            f.setAccessible(true);
            f.set(p, new ChargeMeasureTest.Measured(p.getCharacter(), deck + "|" + style));
            return p;
        };
        long started = System.nanoTime();
        Bench.Settings settings = new Bench.Settings(Integer.getInteger("sim.lethalGames", 300), 7_000_000L, List.of(DECKS), styles,
                Integer.getInteger("sim.threads", 8), BoundCap.Params.DEFAULT, "D76: bot letale contro bot del passo 1, fuori budget D68");
        Bench.Report report = Bench.run(draft, settings, source, (stage, g) -> {
            if (stage.equals("ROUND_READY") && g.getTurn() == 0) watches.set(new ChargeMeasureTest.Observe());
            ChargeMeasureTest.Observe watch = watches.get();
            if (watch == null) { watch = new ChargeMeasureTest.Observe(); watches.set(watch); }
            watch.accept(stage, g);
            if (stage.equals("ROUND_COMMITTED") && g.isOver()) {
                List<Player> seats = new ArrayList<>(g.getPlayers().values());
                for (Player p : seats) {
                    Player q = seats.get(0) == p ? seats.get(1) : seats.get(0);
                    ChargeMeasureTest.Measured me = (ChargeMeasureTest.Measured) p.getCharacter();
                    String mine = group(me.key.substring(me.key.indexOf('|') + 1));
                    String theirs = group(((ChargeMeasureTest.Measured) q.getCharacter()).key.substring(
                            ((ChargeMeasureTest.Measured) q.getCharacter()).key.indexOf('|') + 1));
                    String deck = me.key.substring(0, me.key.indexOf('|'));
                    synchronized (totals) {
                        totals.computeIfAbsent(mine + " vs " + theirs, k -> new Counts()).merge(me.counts);
                        totals.computeIfAbsent(deck + "|" + mine + " vs " + theirs, k -> new Counts()).merge(me.counts);
                    }
                }
                watches.remove();
            }
        });
        double seconds = (System.nanoTime() - started) / 1e9;

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("games", report.games());
        summary.put("seconds", seconds);
        summary.put("seeds", "7000000-" + (7_000_000L + settings.games - 1) + " per cella");
        // The new bot against the old one, decisive games only (D51), overall, by style of the new side and by its deck.
        Map<String, long[]> cross = new TreeMap<>(), draws = new TreeMap<>(), byMatchup = new TreeMap<>();
        for (Bench.Cell c : report.cells) {
            String ga = group(c.styleA), gb = group(c.styleB);
            String pairing = ga.equals(gb) ? ga + " vs " + gb : "misto";
            long[] d = draws.computeIfAbsent(pairing, k -> new long[2]);
            d[0] += c.tally.draws; d[1] += c.tally.games;
            if (ga.equals(gb)) {
                long[] m = byMatchup.computeIfAbsent(ga + "|" + c.deckA + "–" + c.deckB, k -> new long[2]);
                m[0] += c.tally.draws; m[1] += c.tally.games;
                continue;
            }
            boolean aNew = ga.equals(NEW);
            long newWins = aNew ? c.tally.aWins : c.tally.bWins, oldWins = aNew ? c.tally.bWins : c.tally.aWins;
            String newStyle = (aNew ? c.styleA : c.styleB).substring(NEW.length() + 1);
            String oldStyle = (aNew ? c.styleB : c.styleA).substring(OLD.length() + 1);
            String newDeck = aNew ? c.deckA : c.deckB;
            for (String key : List.of("tutti", "stile/" + newStyle + (newStyle.equals(oldStyle) ? " (stesso stile)" : " vs " + oldStyle),
                    "mazzo nuovo/" + newDeck)) {
                long[] t = cross.computeIfAbsent(key, k -> new long[3]);
                t[0] += newWins; t[1] += oldWins; t[2] += c.tally.games;
            }
        }
        Map<String, Object> crossOut = new LinkedHashMap<>();
        cross.forEach((k, t) -> crossOut.put(k, Map.of("vittorieNuovo", t[0], "vittorieVecchio", t[1], "partite", t[2],
                "quotaNuovoDecisive", t[0] + t[1] == 0 ? 0 : (double) t[0] / (t[0] + t[1]))));
        summary.put("nuovoControVecchio", crossOut);
        Map<String, Object> drawsOut = new LinkedHashMap<>();
        draws.forEach((k, d) -> drawsOut.put(k, Map.of("patte", d[0], "partite", d[1], "quota", (double) d[0] / d[1])));
        summary.put("patte", drawsOut);
        Map<String, Object> matchupOut = new LinkedHashMap<>();
        byMatchup.forEach((k, d) -> matchupOut.put(k, Map.of("patte", d[0], "partite", d[1], "quota", (double) d[0] / d[1])));
        summary.put("patteIncontri", matchupOut);
        Map<String, Object> tokens = new LinkedHashMap<>();
        totals.forEach((k, c) -> {
            long found = c.getOrDefault("found", 0L);
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("ricerche", c.getOrDefault("searches", 0L));
            row.put("trovate", found);
            row.put("dannoAvversarioConGettonePerTrovata", found == 0 ? 0 : (double) c.getOrDefault("tokenDamage-opponent", 0L) / found);
            row.put("amplificazionePerTrovata", found == 0 ? 0 : (double) c.getOrDefault("tokenExtra-opponent", 0L) / found);
            row.put("vittorie", c.getOrDefault("wins", 0L));
            row.put("patte", c.getOrDefault("draws", 0L));
            row.put("partite", c.getOrDefault("seatGames", 0L));
            row.put("turni", c.getOrDefault("turns", 0L));
            tokens.put(k, row);
        });
        summary.put("gettone", tokens);
        Map<String, Long> decisions = new TreeMap<>();
        DECISIONS.forEach((k, v) -> decisions.put(k, v.get()));
        summary.put("decisioniBotNuovo", decisions);

        Files.writeString(out.resolve("matrix.json"), JSON.writeValueAsString(JSON.readTree(report.json())));
        Files.writeString(out.resolve("matrix.md"), report.markdown());
        Files.writeString(out.resolve("summary.json"), JSON.writerWithDefaultPrettyPrinter().writeValueAsString(summary));
        Files.writeString(out.resolve("observations.json"), JSON.writeValueAsString(totals));
        assertEquals(0, report.checks.total(), report.failures());
        assertEquals(0, report.boundViolations(), report.failures());
        System.out.println("lethal comparison: " + report.games() + " games, " + seconds + " seconds");
    }
}
