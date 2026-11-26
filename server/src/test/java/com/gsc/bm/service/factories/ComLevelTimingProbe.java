package com.gsc.bm.service.factories;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.bot.BotPlayer;
import com.gsc.bm.model.game.bot.ComLevel;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * SB-30a B2 (proposal §6, D85 (4)): time of one decision of the live computer, {@link BotPlayer#chooseMove(Game)} as the engine
 * calls it, at warm JVM. A measure, not a threshold test: it runs only with {@code -Dsb30a.timing=<folder>} and writes
 * {@code timing.json} there. Positions every turn of games played by computers of the live factory with {@link Ruleset#LIVE}:
 * two seats (the measured computer and a Facile stand-in for the human) and five seats (a Facile stand-in and four computers, as
 * a full FFA). The whole measure runs twice; the first pass warms the JVM and is not reported.
 */
class ComLevelTimingProbe {

    @Test @EnabledIfSystemProperty(named = "sb30a.timing", matches = ".+")
    void decisionTimeAtWarmJvm() throws Exception {
        Path out = Path.of(System.getProperty("sb30a.timing"));
        Files.createDirectories(out);
        Map<String, Object> report = null;
        long started = System.nanoTime();
        for (int pass = 0; pass < 2; pass++) report = measure(pass);
        report.put("wallSeconds", (System.nanoTime() - started) / 1e9);
        report.put("java", System.getProperty("java.vm.name") + " " + System.getProperty("java.version"));
        report.put("cpus", Runtime.getRuntime().availableProcessors());
        Files.writeString(out.resolve("timing.json"), new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(report));
        System.out.println("sb30a timing: " + report);
        assertTrue(report.containsKey("oneComputer"));
    }

    private Map<String, Object> measure(int pass) {
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("method", "BotPlayer.chooseMove(game) on a deserialized copy of each position (every turn), System.nanoTime");
        Map<String, Object> one = new LinkedHashMap<>(), four = new LinkedHashMap<>();
        for (ComLevel level : List.of(ComLevel.FACILE, ComLevel.NORMALE)) {
            PlayerFactoryServiceImpl players = LiveNoHiddenInformationTest.players(31_000_000L + level.ordinal() + 10L * pass);
            List<Long> decisions = new ArrayList<>();
            int games = 0;
            for (int g = 0; games < 300; g++) {
                Player measured = players.craftComPlayer(null, level), human = players.craftComPlayer(null, ComLevel.FACILE);
                Game game = new Game(g % 2 == 0 ? List.of(human, measured) : List.of(measured, human), "quick1vCom", false);
                if (game.getPlayers().size() < 2) continue;
                game.useRuleset(Ruleset.LIVE);
                games++;
                for (byte[] position : positions(game)) {
                    Game copy = LiveNoHiddenInformationTest.game(position);
                    if (copy.isEliminated(measured.getPlayerId())) continue;
                    BotPlayer bot = (BotPlayer) copy.getPlayers().get(measured.getPlayerId());
                    long t = System.nanoTime();
                    bot.chooseMove(copy);
                    decisions.add(System.nanoTime() - t);
                }
            }
            Map<String, Object> s = stats(decisions);
            s.put("games", games);
            one.put(level.name(), s);

            List<Long> perComputer = new ArrayList<>(), perTurn = new ArrayList<>();
            games = 0;
            for (int g = 0; games < 80; g++) {
                List<Player> seats = new ArrayList<>();
                seats.add(players.craftComPlayer(null, ComLevel.FACILE)); // the human stand-in, not measured
                for (int c = 0; c < 4; c++) seats.add(players.craftComPlayer(null, level));
                Game game = new Game(seats, "quickFFA", false);
                if (game.getPlayers().size() < 5) continue;
                game.useRuleset(Ruleset.LIVE);
                games++;
                String standIn = seats.get(0).getPlayerId();
                for (byte[] position : positions(game)) {
                    Game copy = LiveNoHiddenInformationTest.game(position);
                    long turn = 0;
                    int computers = 0;
                    for (Player p : copy.getPlayers().values()) {
                        if (p.getPlayerId().equals(standIn) || copy.isEliminated(p.getPlayerId())) continue;
                        long t = System.nanoTime();
                        ((BotPlayer) p).chooseMove(copy);
                        long d = System.nanoTime() - t;
                        perComputer.add(d);
                        turn += d;
                        computers++;
                    }
                    if (computers == 4) perTurn.add(turn);
                }
            }
            Map<String, Object> f = new LinkedHashMap<>();
            f.put("games", games);
            f.put("perDecision", stats(perComputer));
            f.put("perTurnWithFourComputers", stats(perTurn));
            four.put(level.name() + (level == ComLevel.NORMALE ? "" : " (not a live case: the FFA computers are Normale)"), f);
        }
        report.put("oneComputer", one);
        report.put("fourComputers", four);
        return report;
    }

    /** Every turn of the game, as bytes, from the start to the end (at most 200 turns). */
    private static List<byte[]> positions(Game game) {
        List<byte[]> positions = new ArrayList<>();
        positions.add(LiveNoHiddenInformationTest.bytes(game));
        List<Game> live = new ArrayList<>();
        try {
            game.resolveMoves(g -> {}, (turn, events) -> events.clear(), (stage, g) -> {
                if (!stage.equals("ROUND_COMMITTED")) return;
                if (g.getTurn() > 200) throw new IllegalStateException("turn limit");
                if (!g.isOver()) positions.add(LiveNoHiddenInformationTest.bytes(g));
            });
        } catch (IllegalStateException limit) { /* the positions taken stay */ }
        return positions;
    }

    static Map<String, Object> stats(List<Long> nanos) {
        List<Long> sorted = new ArrayList<>(nanos);
        Collections.sort(sorted);
        Map<String, Object> s = new LinkedHashMap<>();
        s.put("decisions", sorted.size());
        if (sorted.isEmpty()) return s;
        s.put("medianMs", round(sorted.get(sorted.size() / 2)));
        s.put("p90Ms", round(sorted.get((int) Math.min(sorted.size() - 1, Math.ceil(sorted.size() * 0.90) - 1))));
        s.put("p99Ms", round(sorted.get((int) Math.min(sorted.size() - 1, Math.ceil(sorted.size() * 0.99) - 1))));
        s.put("maxMs", round(sorted.get(sorted.size() - 1)));
        s.put("over5ms", sorted.stream().filter(x -> x > 5_000_000L).count());
        s.put("over50ms", sorted.stream().filter(x -> x > 50_000_000L).count());
        return s;
    }

    private static double round(long nanos) { return Math.round(nanos / 1e3) / 1e3; }
}
