package com.gsc.bm.sim;

import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.bot.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

import static com.gsc.bm.sim.StarterBalanceMeasureTest.DECKS;
import static com.gsc.bm.sim.StarterBalanceMeasureTest.JSON;
import static org.junit.jupiter.api.Assertions.*;

/**
 * SB-30b, phase A: the B4 probe of the bot levels proposal (D85, D89). Opt-in ({@code -Dsim.sb30b=fidelity|cost|hidden|all}),
 * never part of the normal test run, no balance measure, no ladder between levels. It changes no existing class and reads no
 * game from inside a decision: the search below sees a {@link BotView} and the public starter lists only.
 * <ul>
 *   <li>{@code fidelity}: the two-turn forecast on the view ({@link Sb30bWorld}, forecast mode) against the engine, in real d50
 *       games of the draft, with the moves actually played in both turns;</li>
 *   <li>{@code cost}: the cost per decision, one thread, of a determinized Monte Carlo search with N sampled worlds × legal moves
 *       × 2–3 turns, and the noise of its choice as N changes;</li>
 *   <li>{@code hidden}: the prototype of the permanent proof «no hidden information»: same public view, different hidden hand and
 *       deck order, same move.</li>
 * </ul>
 */
class Sb30bProbeTest {

    static final String DRAFT = "/set-base/bozza.json";

    static boolean on(String part) {
        String value = System.getProperty("sim.sb30b", "");
        return value.equals("all") || Arrays.asList(value.split(",")).contains(part);
    }

    static Path out() throws IOException {
        Path out = Path.of(System.getProperty("sim.sb30bOut", "target/sb30b"));
        Files.createDirectories(out);
        return out;
    }

    static BotPolicy normale(BotPolicy style) {
        return new LethalAwarePolicy(new SoughtHitPolicy(style, SoughtHitPolicy.Timing.ALWAYS));
    }

    // ------------------------------------------------------------------------------------------------ fidelity

    @Test @EnabledIfSystemProperty(named = "sim.sb30b", matches = ".+")
    void twoTurnForecastAgainstTheEngine() throws Exception {
        org.junit.jupiter.api.Assumptions.assumeTrue(on("fidelity"));
        long started = System.nanoTime();
        Draft draft = Draft.fromClasspath(DRAFT);
        Sb30bWorld.Catalog catalog = new Sb30bWorld.Catalog(draft, DECKS);
        SimulationRunner runner = new SimulationRunner(draft, Ruleset.D50);
        int games = Integer.getInteger("sim.sb30bFidelityGames", 300);
        long[] one = new long[2], two = new long[2], twoRes = new long[2], drawn = new long[2];
        long[] skipped = new long[1];
        List<String> misses = new ArrayList<>();
        Map<String, Long> missCards = new TreeMap<>();
        for (long seed = 7_100_000; seed < 7_100_000 + games; seed++) {
            String a = DECKS[(int) (seed % 5)], b = DECKS[(int) ((seed / 5) % 5)];
            BotPolicy pa = new LethalAwarePolicy(new SoughtHitPolicy(new AggressivePolicy(), SoughtHitPolicy.Timing.ALWAYS));
            BotPolicy pb = new SoughtHitPolicy(seed % 2 == 0 ? new PrudentPolicy() : new RandomPolicy(), SoughtHitPolicy.Timing.ALWAYS);
            Map<Integer, Map<String, BotView>> views = new HashMap<>();
            Map<Integer, List<Sb30bWorld.Play>> plays = new HashMap<>();
            Map<String, Set<Map<String, Integer>>> pending1 = new HashMap<>(), pending2 = new HashMap<>();
            Map<String, Set<Map<String, Map<Resource, Integer>>>> pending2Res = new HashMap<>();
            Map<String, Boolean> pendingDrawn = new HashMap<>();
            String[] labels = new String[1];
            long s = seed;
            runner.run(seed, new SimulationRunner.Contender(a, pa), new SimulationRunner.Contender(b, pb), (stage, g) -> {
                if (stage.equals("ROUND_READY")) {
                    pending1.clear(); pending2.clear(); pending2Res.clear();
                    int t = g.getTurn();
                    boolean valid = g.getPendingMoves().size() == 2 && g.getPendingMoves().stream().noneMatch(Move::isVoid)
                            && g.getPlayers().values().stream().allMatch(p -> p.getCharacter().getTimers().isEmpty());
                    if (!valid) { skipped[0]++; return; }
                    List<Sb30bWorld.Play> now = new ArrayList<>();
                    Map<String, BotView> seen = new HashMap<>();
                    for (Move m : g.getPendingMoves()) {
                        now.add(new Sb30bWorld.Play(m.getPlayerId(), BotView.publicText(g.getCardFromHand(m.getPlayerId(), m.getPlayedCardName())),
                                m.getTargetId(), m.getChoices().get(Move.AdditionalAction.DISCARD_ONE),
                                m.getChoices().get(Move.AdditionalAction.TARGET_ITEM)));
                        seen.put(m.getPlayerId(), BotView.of(g, m.getPlayerId()));
                    }
                    views.put(t, seen);
                    plays.put(t, now);
                    labels[0] = "seed " + s + " turn " + t + " moves " + now.stream().map(p -> p.seat + ":" + p.card.getName())
                            .reduce((x, y) -> x + ", " + y).orElse("") + (plays.containsKey(t - 1) ? " after " + plays.get(t - 1).stream()
                            .map(p -> p.seat + ":" + p.card.getName()).reduce((x, y) -> x + ", " + y).orElse("") : "");
                    for (String me : seen.keySet()) {
                        Set<Map<String, Integer>> ends = new HashSet<>();
                        for (Sb30bWorld.Flags f : Sb30bWorld.Flags.all()) {
                            Sb30bWorld w = Sb30bWorld.forecast(seen.get(me), catalog);
                            w.playTurn(now, f);
                            ends.add(w.health());
                        }
                        pending1.put(me, ends);
                        if (!views.containsKey(t - 1)) continue;
                        Set<Map<String, Integer>> ends2 = new HashSet<>();
                        Set<Map<String, Map<Resource, Integer>>> res2 = new HashSet<>();
                        boolean itemsKnown = false;
                        for (Sb30bWorld.Flags f1 : Sb30bWorld.Flags.all()) {
                            Sb30bWorld w1 = Sb30bWorld.forecast(views.get(t - 1).get(me), catalog);
                            w1.playTurn(plays.get(t - 1), f1);
                            if (w1.over()) continue;
                            // An item drawn to the field after turn 1 is public only at turn 2: no forecast at turn 1 can know it.
                            boolean same = true;
                            for (Player p : g.getPlayers().values())
                                if (!names(p.getCharacter().getItems()).equals(seenNames(w1.sides.get(p.getPlayerId()).items))) same = false;
                            itemsKnown |= same;
                            for (Sb30bWorld.Flags f2 : Sb30bWorld.Flags.all()) {
                                Sb30bWorld w2 = w1.copy();
                                w2.playTurn(now, f2);
                                ends2.add(w2.health());
                                res2.add(w2.resources());
                            }
                        }
                        pending2.put(me, ends2);
                        pending2Res.put(me, res2);
                        pendingDrawn.put(me, !itemsKnown);
                    }
                } else if (!pending1.isEmpty()) {
                    Map<String, Integer> actual = new HashMap<>();
                    Map<String, Map<Resource, Integer>> actualRes = new HashMap<>();
                    for (Player p : g.getPlayers().values()) {
                        actual.put(p.getPlayerId(), p.getCharacter().getResources().get(Resource.HEALTH));
                        actualRes.put(p.getPlayerId(), new EnumMap<>(p.getCharacter().getResources()));
                    }
                    pending1.forEach((id, ends) -> { one[0]++; if (ends.contains(actual)) one[1]++; });
                    pending2.forEach((id, ends) -> {
                        if (pendingDrawn.get(id)) {
                            drawn[0]++;
                            if (ends.contains(actual)) drawn[1]++;
                            return;
                        }
                        two[0]++;
                        if (ends.contains(actual)) two[1]++;
                        else {
                            if (misses.size() < 12) misses.add(labels[0] + " seen by " + id + ": " + actual + " not in " + ends);
                            for (String card : labels[0].replaceAll(".*moves ", "").split(", | after "))
                                missCards.merge(card.replaceAll("seat-\\d:", ""), 1L, Long::sum);
                        }
                        twoRes[0]++;
                        if (pending2Res.get(id).stream().anyMatch(r -> sameResources(r, actualRes))) twoRes[1]++;
                    });
                    pending1.clear(); pending2.clear(); pending2Res.clear(); pendingDrawn.clear();
                }
            });
        }
        double seconds = (System.nanoTime() - started) / 1e9;
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("draft", DRAFT);
        summary.put("games", games);
        summary.put("seeds", "7100000-" + (7_100_000 + games - 1));
        summary.put("oneTurnHealth", Map.of("checked", one[0], "matched", one[1]));
        summary.put("twoTurnHealth", Map.of("checked", two[0], "matched", two[1]));
        summary.put("twoTurnAllResources", Map.of("checked", twoRes[0], "matched", twoRes[1]));
        summary.put("twoTurnHealthWithItemDrawnBetween", Map.of("checked", drawn[0], "matched", drawn[1]));
        summary.put("roundsSkipped", skipped[0]);
        summary.put("missesFirst", misses);
        summary.put("cardsInMissedPairs", missCards);
        summary.put("seconds", seconds);
        Files.writeString(out().resolve("fidelity.json"), JSON.writerWithDefaultPrettyPrinter().writeValueAsString(summary));
        System.out.println("sb30b fidelity: one turn " + one[1] + "/" + one[0] + ", two turns " + two[1] + "/" + two[0]
                + ", two turns all resources " + twoRes[1] + "/" + twoRes[0] + ", item drawn between " + drawn[1] + "/" + drawn[0]
                + ", " + seconds + " s");
        assertTrue(two[0] > 1000, "coppie di turni controllate: " + two[0]);
    }

    private static List<String> names(Collection<Card> cards) {
        List<String> n = new ArrayList<>();
        for (Card c : cards) n.add(c.getName());
        Collections.sort(n);
        return n;
    }

    private static List<String> seenNames(Collection<BotView.CardSeen> cards) {
        List<String> n = new ArrayList<>();
        for (BotView.CardSeen c : cards) n.add(c.getName());
        Collections.sort(n);
        return n;
    }

    private static boolean sameResources(Map<String, Map<Resource, Integer>> forecast, Map<String, Map<Resource, Integer>> actual) {
        for (Map.Entry<String, Map<Resource, Integer>> e : actual.entrySet()) {
            Map<Resource, Integer> f = forecast.get(e.getKey());
            for (Resource r : Resource.values())
                if (!Objects.equals(e.getValue().getOrDefault(r, 0), f.getOrDefault(r, 0))) return false;
        }
        return true;
    }

    // ------------------------------------------------------------------------------------------------ search

    /** A decision point: what seat-1 sees between two turns, and the public starter lists of both seats. */
    static final class Point {
        final BotView view;
        final String myDeck, foeDeck;
        final byte[] game;

        Point(BotView view, String myDeck, String foeDeck, byte[] game) {
            this.view = view;
            this.myDeck = myDeck;
            this.foeDeck = foeDeck;
            this.game = game;
        }
    }

    /** One decision of the probe search: the move chosen, the value of each move in each world, the time. */
    static final class Decision {
        final List<LegalMove> legal;
        final double[][] values;
        final int worldsDone;
        final long nanos;

        Decision(List<LegalMove> legal, double[][] values, int worldsDone, long nanos) {
            this.legal = legal;
            this.values = values;
            this.worldsDone = worldsDone;
            this.nanos = nanos;
        }

        double mean(int m) {
            double sum = 0;
            for (int w = 0; w < worldsDone; w++) sum += values[m][w];
            return sum / worldsDone;
        }

        int chosen() {
            int best = 0;
            for (int m = 1; m < legal.size(); m++) if (mean(m) > mean(best)) best = m;
            return best;
        }

        /** Standard error of the mean of a move. */
        double se(int m) {
            double mu = mean(m), sq = 0;
            for (int w = 0; w < worldsDone; w++) sq += (values[m][w] - mu) * (values[m][w] - mu);
            return worldsDone < 2 ? 0 : Math.sqrt(sq / (worldsDone - 1) / worldsDone);
        }
    }

    /**
     * The probe search: determinization with common random numbers. Each world is sampled from the view and the public lists;
     * every legal move is played in every world against the opponent model of that world (the three Normale styles in turn),
     * then both seats play the Normale for the remaining turns; the value at the horizon is +1 win, −1 loss, 0 draw, otherwise
     * the health difference / 100 clipped to ±0.95. Worlds are the outer loop, so a deadline stops between worlds with every
     * move scored on the same worlds (anytime).
     */
    static final class Search {
        final Sb30bWorld.Catalog catalog;
        final BotPolicy[] models = {normale(new AggressivePolicy()), normale(new PrudentPolicy()), normale(new ResourceAwarePolicy())};
        final BotPolicy rollout = normale(new AggressivePolicy());

        Search(Sb30bWorld.Catalog catalog) { this.catalog = catalog; }

        Decision decide(BotView view, String myDeck, String foeDeck, int n, int horizon, long seed, long deadlineNanos) {
            long started = System.nanoTime();
            List<LegalMove> legal = view.legalMoves();
            String me = view.getSelf().getSeat().getPlayerId();
            String foe = view.getOpponents().get(0).getSeat().getPlayerId();
            double[][] values = new double[legal.size()][n];
            int done = 0;
            for (int w = 0; w < n; w++) {
                if (deadlineNanos > 0 && w > 0 && System.nanoTime() - started > deadlineNanos) break;
                long worldSeed = seed * 1_000_003L + w;
                Sb30bWorld base = Sb30bWorld.sample(view, catalog, myDeck, foeDeck, new Random(worldSeed));
                BotPolicy model = models[w % models.length];
                for (int m = 0; m < legal.size(); m++) {
                    Sb30bWorld c = base.copy();
                    Random r = new Random(worldSeed ^ 0x5DEECE66DL);
                    for (int t = 0; t < horizon && !c.over(); t++) {
                        Sb30bWorld.Play mine = t == 0 ? Sb30bWorld.Play.of(me, legal.get(m)) : choose(rollout, c, me, r);
                        Sb30bWorld.Play theirs = choose(model, c, foe, r);
                        c.playTurn(Arrays.asList(mine, theirs), null);
                    }
                    values[m][w] = value(c, me, foe);
                }
                done++;
            }
            return new Decision(legal, values, done, System.nanoTime() - started);
        }

        private static Sb30bWorld.Play choose(BotPolicy policy, Sb30bWorld world, String id, Random random) {
            BotView v = world.view(id);
            List<LegalMove> legal = v.legalMoves();
            if (legal.isEmpty()) return null;
            return Sb30bWorld.Play.of(id, policy.choose(v, legal, random));
        }

        static double value(Sb30bWorld world, String me, String foe) {
            boolean meDown = world.sides.get(me).down(), foeDown = world.sides.get(foe).down();
            if (meDown && foeDown) return 0;
            if (meDown) return -1;
            if (foeDown) return 1;
            double diff = (world.sides.get(me).get(Resource.HEALTH) - world.sides.get(foe).get(Resource.HEALTH)) / 100.0;
            return Math.max(-0.95, Math.min(0.95, diff));
        }
    }

    /** Decision points from real d50 games of the draft, Normale against Normale, mixed styles and decks. */
    static List<Point> points(Draft draft, int wanted, long firstSeed, boolean keepGames) throws Exception {
        SimulationRunner runner = new SimulationRunner(draft, Ruleset.D50);
        List<BotPolicy> styles = List.of(new AggressivePolicy(), new PrudentPolicy(), new ResourceAwarePolicy());
        List<Point> points = new ArrayList<>();
        for (long seed = firstSeed; points.size() < wanted; seed++) {
            String a = DECKS[(int) (seed % 5)], b = DECKS[(int) ((seed / 5) % 5)];
            BotPolicy pa = normale(styles.get((int) (seed % 3))), pb = normale(styles.get((int) ((seed / 3) % 3)));
            runner.run(seed, new SimulationRunner.Contender(a, pa), new SimulationRunner.Contender(b, pb), (stage, g) -> {
                if (!stage.equals("ROUND_COMMITTED") || g.isOver() || g.getTurn() % 3 != 1 || points.size() >= wanted) return;
                points.add(new Point(BotView.of(g, "seat-1"), a, b, keepGames ? bytes(g) : null));
            });
        }
        return points;
    }

    static byte[] bytes(Game g) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            try (ObjectOutputStream o = new ObjectOutputStream(out)) { o.writeObject(g); }
            return out.toByteArray();
        } catch (IOException e) { throw new UncheckedIOException(e); }
    }

    static Game game(byte[] bytes) {
        try (ObjectInputStream in = new ObjectInputStream(new ByteArrayInputStream(bytes))) { return (Game) in.readObject(); }
        catch (Exception e) { throw new IllegalStateException(e); }
    }

    static Map<String, Object> stats(List<Long> nanos) {
        List<Long> sorted = new ArrayList<>(nanos);
        Collections.sort(sorted);
        Map<String, Object> s = new LinkedHashMap<>();
        if (sorted.isEmpty()) return s;
        s.put("decisions", sorted.size());
        s.put("medianMs", sorted.get(sorted.size() / 2) / 1e6);
        s.put("p90Ms", sorted.get((int) Math.min(sorted.size() - 1, Math.ceil(sorted.size() * 0.9) - 1)) / 1e6);
        s.put("maxMs", sorted.get(sorted.size() - 1) / 1e6);
        s.put("meanMs", sorted.stream().mapToLong(Long::longValue).average().orElse(0) / 1e6);
        s.put("over1s", sorted.stream().filter(x -> x > 1_000_000_000L).count());
        s.put("over2s", sorted.stream().filter(x -> x > 2_000_000_000L).count());
        return s;
    }

    @Test @EnabledIfSystemProperty(named = "sim.sb30b", matches = ".+")
    void costAndNoisePerDecision() throws Exception {
        org.junit.jupiter.api.Assumptions.assumeTrue(on("cost"));
        long started = System.nanoTime();
        double budget = Double.parseDouble(System.getProperty("sim.sb30bCostBudget", "480"));
        int wanted = Integer.getInteger("sim.sb30bPoints", 60);
        int reference = Integer.getInteger("sim.sb30bReference", 400);
        Draft draft = Draft.fromClasspath(DRAFT);
        Sb30bWorld.Catalog catalog = new Sb30bWorld.Catalog(draft, DECKS);
        Search search = new Search(catalog);
        List<Point> points = points(draft, wanted, 7_200_000L, false);
        double collect = (System.nanoTime() - started) / 1e9;

        // Cost of one Normale decision (the rollout and opponent policy), for scale.
        List<Long> normaleNanos = new ArrayList<>();
        BotPolicy normale = normale(new AggressivePolicy());
        for (int rep = 0; rep < 3; rep++)
            for (Point p : points) {
                long t0 = System.nanoTime();
                normale.choose(p.view, p.view.legalMoves(), new Random(1));
                if (rep == 2) normaleNanos.add(System.nanoTime() - t0);
            }
        // JIT warm-up, untimed.
        for (int i = 0; i < Math.min(5, points.size()); i++) search.decide(points.get(i).view, points.get(i).myDeck, points.get(i).foeDeck, 10, 2, 1, 0);

        int[] ns = {10, 40, 100};
        int[] hs = {2, 3};
        Map<String, List<Long>> nanos = new LinkedHashMap<>();
        Map<Integer, long[]> agree = new TreeMap<>();
        Map<Integer, double[]> regret = new TreeMap<>(), se = new TreeMap<>();
        List<Long> refNanos = new ArrayList<>();
        List<Integer> moves = new ArrayList<>();
        long[] horizonAgree = new long[2];
        int single = 0, done = 0;
        for (int i = 0; i < points.size(); i++) {
            if ((System.nanoTime() - started) / 1e9 > budget) break;
            Point p = points.get(i);
            List<LegalMove> legal = p.view.legalMoves();
            if (legal.size() < 2) { single++; continue; }
            moves.add(legal.size());
            Decision ref = search.decide(p.view, p.myDeck, p.foeDeck, reference, 2, 9_000_000L + i, 0);
            refNanos.add(ref.nanos);
            int refBest = ref.chosen();
            Map<Integer, Integer> choiceH = new HashMap<>();
            for (int h : hs)
                for (int n : ns) {
                    Decision d = search.decide(p.view, p.myDeck, p.foeDeck, n, h, i, 0);
                    nanos.computeIfAbsent("N" + n + "-H" + h, k -> new ArrayList<>()).add(d.nanos);
                    if (n == 100) choiceH.put(h, d.chosen());
                    if (h != 2) continue;
                    int c = d.chosen();
                    long[] a = agree.computeIfAbsent(n, k -> new long[2]);
                    a[0]++;
                    if (c == refBest || ref.mean(c) == ref.mean(refBest)) a[1]++;
                    double[] r = regret.computeIfAbsent(n, k -> new double[2]);
                    r[0]++;
                    r[1] += ref.mean(refBest) - ref.mean(c);
                    double[] e = se.computeIfAbsent(n, k -> new double[2]);
                    e[0]++;
                    e[1] += d.se(c);
                }
            horizonAgree[0]++;
            if (choiceH.get(2).equals(choiceH.get(3))) horizonAgree[1]++;
            done++;
        }
        double seconds = (System.nanoTime() - started) / 1e9;

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("draft", DRAFT);
        summary.put("thread", 1);
        summary.put("pointsCollected", points.size());
        summary.put("pointsMeasured", done);
        summary.put("pointsWithOneMove", single);
        Collections.sort(moves);
        summary.put("legalMovesMedian", moves.isEmpty() ? 0 : moves.get(moves.size() / 2));
        summary.put("legalMovesMax", moves.isEmpty() ? 0 : moves.get(moves.size() - 1));
        summary.put("normaleDecision", stats(normaleNanos));
        Map<String, Object> cost = new LinkedHashMap<>();
        nanos.forEach((k, v) -> cost.put(k, stats(v)));
        cost.put("N" + reference + "-H2 (riferimento)", stats(refNanos));
        summary.put("cost", cost);
        Map<String, Object> noise = new LinkedHashMap<>();
        for (int n : ns) {
            long[] a = agree.getOrDefault(n, new long[2]);
            double[] r = regret.getOrDefault(n, new double[2]), e = se.getOrDefault(n, new double[2]);
            noise.put("N" + n, Map.of("sameChoiceAsReference", a[0] == 0 ? 0 : (double) a[1] / a[0],
                    "meanRegretVsReference", r[0] == 0 ? 0 : r[1] / r[0], "meanStandardErrorOfChosen", e[0] == 0 ? 0 : e[1] / e[0]));
        }
        summary.put("noiseH2_vsN" + reference, noise);
        summary.put("sameChoiceH2vsH3_N100", horizonAgree[0] == 0 ? 0 : (double) horizonAgree[1] / horizonAgree[0]);
        summary.put("secondsCollectingPoints", collect);
        summary.put("seconds", seconds);
        Files.writeString(out().resolve("cost.json"), JSON.writerWithDefaultPrettyPrinter().writeValueAsString(summary));
        System.out.println("sb30b cost: " + JSON.writeValueAsString(summary));
        assertTrue(done > 0);
    }

    // ------------------------------------------------------------------------------------------------ Difficile, exhaustive

    /** The hits an opponent shows face up and can pay, aimed at {@code me}: what the Difficile assumes, nothing covered. */
    static List<Sb30bWorld.Play> shown(BotView view) {
        List<Sb30bWorld.Play> threats = new ArrayList<>();
        String me = view.getSelf().getSeat().getPlayerId();
        for (BotView.Opponent o : view.getOpponents())
            for (BotView.RevealedSeen r : o.getRevealed()) {
                BotView.CardSeen c = r.getCard();
                boolean payable = c.getCost().entrySet().stream().allMatch(e -> o.getSeat().resource(e.getKey()) >= e.getValue());
                if (payable && c.nominalDamage() > 0 && c.getCanTarget().contains(Card.CardTarget.OPPONENT))
                    threats.add(new Sb30bWorld.Play(o.getSeat().getPlayerId(), c, me, null, null));
            }
        return threats;
    }

    /**
     * The cost of a two-turn forecast without sampling (the Difficile of the design): every own move, against no move and every
     * shown hit, every variant; then every own reply from the hand left, against the hits shown then, every variant. An upper
     * bound: no pruning, no cache.
     */
    @Test @EnabledIfSystemProperty(named = "sim.sb30b", matches = ".+")
    void costOfTheExhaustiveTwoTurnForecast() throws Exception {
        org.junit.jupiter.api.Assumptions.assumeTrue(on("difficile"));
        long started = System.nanoTime();
        Draft draft = Draft.fromClasspath(DRAFT);
        Sb30bWorld.Catalog catalog = new Sb30bWorld.Catalog(draft, DECKS);
        List<Point> points = points(draft, Integer.getInteger("sim.sb30bPoints", 150), 7_200_000L, false);
        List<Long> nanos = new ArrayList<>();
        List<Long> turns = new ArrayList<>();
        for (int rep = 0; rep < 2; rep++)
            for (Point p : points) {
                long t0 = System.nanoTime(), count = 0;
                BotView view = p.view;
                String me = view.getSelf().getSeat().getPlayerId();
                List<Sb30bWorld.Play> threats = new ArrayList<>(shown(view));
                threats.add(null);
                for (LegalMove m1 : view.legalMoves())
                    for (Sb30bWorld.Play threat : threats)
                        for (Sb30bWorld.Flags f1 : Sb30bWorld.Flags.all()) {
                            Sb30bWorld w1 = Sb30bWorld.forecast(view, catalog);
                            w1.playTurn(Arrays.asList(Sb30bWorld.Play.of(me, m1), threat), f1);
                            count++;
                            if (w1.over()) continue;
                            BotView v1 = w1.view(me);
                            List<Sb30bWorld.Play> threats2 = new ArrayList<>(shown(v1));
                            threats2.add(null);
                            for (LegalMove m2 : v1.legalMoves())
                                for (Sb30bWorld.Play threat2 : threats2)
                                    for (Sb30bWorld.Flags f2 : Sb30bWorld.Flags.all()) {
                                        Sb30bWorld w2 = w1.copy();
                                        w2.playTurn(Arrays.asList(Sb30bWorld.Play.of(me, m2), threat2), f2);
                                        count++;
                                    }
                        }
                if (rep == 1) { nanos.add(System.nanoTime() - t0); turns.add(count); }
            }
        Collections.sort(turns);
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("points", points.size());
        summary.put("exhaustiveTwoTurn", stats(nanos));
        summary.put("turnsSimulatedMedian", turns.get(turns.size() / 2));
        summary.put("turnsSimulatedMax", turns.get(turns.size() - 1));
        summary.put("seconds", (System.nanoTime() - started) / 1e9);
        Files.writeString(out().resolve("difficile.json"), JSON.writerWithDefaultPrettyPrinter().writeValueAsString(summary));
        System.out.println("sb30b difficile: " + JSON.writeValueAsString(summary));
    }

    // ------------------------------------------------------------------------------------------------ hidden information

    @Test @EnabledIfSystemProperty(named = "sim.sb30b", matches = ".+")
    void hiddenInformationDoesNotChangeTheChoice() throws Exception {
        org.junit.jupiter.api.Assumptions.assumeTrue(on("hidden"));
        long started = System.nanoTime();
        Draft draft = Draft.fromClasspath(DRAFT);
        Sb30bWorld.Catalog catalog = new Sb30bWorld.Catalog(draft, DECKS);
        Search search = new Search(catalog);
        List<Point> points = points(draft, Integer.getInteger("sim.sb30bHiddenPoints", 20), 7_300_000L, true);
        int checked = 0, differed = 0;
        for (int i = 0; i < points.size(); i++) {
            Point p = points.get(i);
            Game same = game(p.game), other = game(p.game);
            Random random = new Random(i);
            Player foe = other.getPlayers().get("seat-2"), mine = other.getPlayers().get("seat-1");
            List<Card> before = new ArrayList<>(foe.getCardsInHand());
            List<Card> shown = new ArrayList<>();
            foe.getShownRevealed().forEach(r -> shown.add(r.getCard()));
            for (int h = 0; h < foe.getCardsInHand().size(); h++) {
                Card c = foe.getCardsInHand().get(h);
                if (c.isCharacterBound() || c.isBasicAction() || c.isLastResort() || shown.stream().anyMatch(x -> x == c)) continue;
                List<Integer> swappable = new ArrayList<>();
                for (int d = 0; d < foe.getDeck().size(); d++)
                    if (!foe.getDeck().get(d).isItem() && !foe.getDeck().get(d).getName().equals(c.getName())) swappable.add(d);
                if (swappable.isEmpty()) continue;
                int d = swappable.get(random.nextInt(swappable.size()));
                Card fromDeck = foe.getDeck().get(d);
                foe.getDeck().set(d, c);
                foe.getCardsInHand().set(h, fromDeck);
            }
            Collections.shuffle(foe.getDeck(), random);
            Collections.shuffle(mine.getDeck(), random);
            if (!before.stream().map(Card::getName).sorted().collect(java.util.stream.Collectors.toList()).equals(
                    foe.getCardsInHand().stream().map(Card::getName).sorted().collect(java.util.stream.Collectors.toList()))) differed++;
            BotView v1 = BotView.of(same, "seat-1"), v2 = BotView.of(other, "seat-1");
            assertEquals(v1, v2, "la vista pubblica deve restare la stessa");
            if (v1.legalMoves().size() < 2) continue;
            Decision d1 = search.decide(v1, p.myDeck, p.foeDeck, 10, 2, 42 + i, 0);
            Decision d2 = search.decide(v2, p.myDeck, p.foeDeck, 10, 2, 42 + i, 0);
            assertEquals(d1.legal.get(d1.chosen()), d2.legal.get(d2.chosen()), "stessa mossa con la stessa vista e lo stesso seme");
            assertArrayEquals(d1.values, d2.values);
            checked++;
        }
        double seconds = (System.nanoTime() - started) / 1e9;
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("points", points.size());
        summary.put("checked", checked);
        summary.put("hiddenHandChanged", differed);
        summary.put("seconds", seconds);
        Files.writeString(out().resolve("hidden.json"), JSON.writerWithDefaultPrettyPrinter().writeValueAsString(summary));
        System.out.println("sb30b hidden: " + summary);
        assertTrue(checked > 5 && differed > 5, summary.toString());
    }
}
