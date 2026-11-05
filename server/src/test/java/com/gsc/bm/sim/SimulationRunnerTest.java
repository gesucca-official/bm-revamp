package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

class SimulationRunnerTest {
    private static SimulationRunner runner;

    @BeforeAll static void catalog() throws Exception { runner = new SimulationRunner(new SimulationCatalog()); }

    @Test void sameSeedSameJvm() throws Exception {
        for (long seed = 0; seed < 20; seed++) {
            boolean bruiserFirst = seed % 2 == 0;
            assertEquals(runner.run(seed, bruiserFirst, true).jsonl(),
                    runner.run(seed, bruiserFirst, true).jsonl(), "Seme " + seed);
        }
    }

    @Test void sameSeedSeparateJvms() throws Exception {
        Path directory = SimulationCatalog.outputDirectory();
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        StringBuilder local = new StringBuilder();
        for (long seed = 0; seed < 20; seed++) local.append(runner.run(seed, seed % 2 == 0, true).jsonl());
        byte[] expected = digest.digest(local.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8));
        // Due JVM possono vedere lo stesso ordine di un HashMap su enum per caso: servono piu' hash d'identita'.
        for (int i = 0; i < 6; i++) {
            Path output = Files.createTempFile(directory, "jvm-", ".jsonl");
            child(output, i * 1337 + i * i * 7);
            assertArrayEquals(expected, digest.digest(Files.readAllBytes(output)), "SHA-256 diverso: " + output);
            // I file restano solo se il confronto fallisce, per poterli esaminare.
            Files.delete(output);
            Files.delete(output.resolveSibling(output.getFileName() + ".log"));
        }
    }

    private static void child(Path output, int warmup) throws Exception {
        String executable = System.getProperty("os.name").startsWith("Windows") ? "java.exe" : "java";
        Path log = output.resolveSibling(output.getFileName() + ".log");
        Process process = new ProcessBuilder(Path.of(System.getProperty("java.home"), "bin", executable).toString(),
                "-cp", System.getProperty("surefire.test.class.path", System.getProperty("java.class.path")),
                SimulationRunner.class.getName(), output.getFileName().toString(), Integer.toString(warmup))
                .redirectErrorStream(true).redirectOutput(log.toFile()).start();
        try {
            assertTrue(process.waitFor(30, TimeUnit.SECONDS), "JVM del runner non terminata: " + log);
            assertEquals(0, process.exitValue(), () -> {
                try { return Files.readString(log); } catch (Exception e) { return e.toString(); }
            });
        } finally {
            if (process.isAlive()) process.destroyForcibly();
        }
    }

    @Test void differentSeedsProduceDifferentTraces() throws Exception {
        Set<String> traces = new HashSet<>();
        ObjectMapper mapper = new ObjectMapper();
        for (long seed = 0; seed < 20; seed++) {
            StringBuilder withoutSeed = new StringBuilder();
            for (String line : runner.run(seed, true, true).trace) {
                // Solo per questo controllo: evitare che il campo seme da solo renda il test tautologico.
                JsonNode row = mapper.readTree(line);
                ((com.fasterxml.jackson.databind.node.ObjectNode) row).remove("seed");
                withoutSeed.append(row);
            }
            traces.add(withoutSeed.toString());
        }
        assertTrue(traces.size() >= 2, "Venti semi devono cambiare almeno una decisione o uno stato");
    }

    @Test void twoHundredCompleteGames() throws Exception {
        for (long seed = 0; seed < 200; seed++) {
            final long fixedSeed = seed;
            SimulationRunner.Result result = assertDoesNotThrow(() -> runner.run(fixedSeed, fixedSeed % 2 == 0, false));
            assertNotEquals(SimulationRunner.Outcome.TURN_LIMIT, result.outcome, "Seme " + seed);
            assertTrue(result.turns > 0, "Seme " + seed);
            assertEquals(0, result.emptyMoves, "Seme " + seed);
            assertTrue(result.trace.isEmpty());
        }
    }

    @Test void turnLimitStopsRecursiveVoidMoves() throws Exception {
        Game game = runner.newGame(42, true);
        for (Player player : new java.util.ArrayList<>(game.getPlayers().values())) {
            // Bot sintetico solo per provare il watchdog, fuori dalla misura del bot casuale.
            game.getPlayers().put(player.getPlayerId(), new com.gsc.bm.model.game.ComPlayer(
                    player.getPlayerId(), player.getCharacter(), player.getCardsInHand().get(0),
                    player.getCardsInHand().subList(1, 3), player.getLastResortCard(),
                    java.util.List.of(), new java.util.Random(0)) {
                @Override public com.gsc.bm.model.game.Move chooseMove(Game state) {
                    return com.gsc.bm.model.game.Move.voidMove(getPlayerId());
                }
            });
        }
        SimulationRunner.Result result = runner.continueGame(game, 42, true, state -> {});
        assertEquals(SimulationRunner.Outcome.TURN_LIMIT, result.outcome);
        assertEquals(201, result.turns);
        assertEquals(402, result.emptyMoves);
        assertEquals(202, result.trace.size());
        assertTrue(game.getLoggedTurnEvents().isEmpty());
    }

    @Test void traceContainsEachRoundAndDrainsItsEvents() throws Exception {
        SimulationRunner.Result result = runner.run(0, true, true);
        ObjectMapper mapper = new ObjectMapper();
        assertEquals(result.turns + 1, result.trace.size());
        for (int i = 0; i < result.turns; i++) {
            JsonNode row = mapper.readTree(result.trace.get(i));
            assertEquals("TURN", row.path("kind").asText());
            assertEquals(i + 1, row.path("turn").asInt());
            assertEquals("GAME_ID", row.path("gameId").asText());
            assertEquals(2, row.path("players").size());
            assertTrue(row.path("moves").isArray());
            assertTrue(row.path("report").isObject());
            int roundEnds = 0;
            for (JsonNode event : row.path("events"))
                if (event.asText().matches("Turn [0-9]+ has been Resolved[.]")) roundEnds++;
            assertEquals(1, roundEnds, "I log dei turni precedenti devono essere consumati");
            for (JsonNode player : row.path("players"))
                for (String field : java.util.List.of("resources", "hand", "deckSize", "items", "statuses"))
                    assertTrue(player.has(field), field);
        }
        JsonNode last = mapper.readTree(result.trace.get(result.turns));
        assertEquals("FINAL", last.path("kind").asText());
        assertEquals(result.outcome.name(), last.path("outcome").asText());
        assertEquals(0, last.path("events").size());
    }

    private static Game copy(Game game) throws Exception {
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        try (ObjectOutputStream out = new ObjectOutputStream(bytes)) { out.writeObject(game); }
        try (ObjectInputStream in = new ObjectInputStream(new ByteArrayInputStream(bytes.toByteArray()))) {
            return (Game) in.readObject();
        }
    }

    @Test void serializedMidgameContinuesIdentically() throws Exception {
        for (long seed = 0; seed < 20; seed++) {
            boolean bruiserFirst = seed % 2 == 0;
            int midpoint = Math.max(1, runner.run(seed, bruiserFirst, false).turns / 2);
            Game[] snapshot = new Game[1];
            Game originalGame = runner.newGame(seed, bruiserFirst);
            SimulationRunner.Result original = runner.continueGame(originalGame, seed, true, state -> {
                if (state.getTurn() == midpoint) {
                    try { snapshot[0] = copy(state); } catch (Exception e) { throw new IllegalStateException(e); }
                }
            });
            assertNotNull(snapshot[0]);
            assertFalse(snapshot[0].isOver(), "Il checkpoint deve essere a partita ancora aperta");
            SimulationRunner.Result resumed = runner.continueGame(snapshot[0], seed, true, state -> {});
            assertEquals(original.trace.subList(midpoint, original.trace.size()), resumed.trace, "Seme " + seed);
            assertEquals(original.outcome, resumed.outcome);
            assertEquals(original.turns, resumed.turns);
            // Anche il percorso usato dal rollback del servizio rimette in gioco giocatori clonati.
            Game restored = runner.newGame(seed, bruiserFirst);
            restored.restoreFrom(copyCheckpoint(seed, bruiserFirst, midpoint));
            assertEquals(resumed.trace, runner.continueGame(restored, seed, true, state -> {}).trace);
        }
    }

    private static Game copyCheckpoint(long seed, boolean first, int midpoint) throws Exception {
        Game[] snapshot = new Game[1];
        runner.continueGame(runner.newGame(seed, first), seed, false, state -> {
            if (state.getTurn() == midpoint) {
                try { snapshot[0] = copy(state); } catch (Exception e) { throw new IllegalStateException(e); }
            }
        });
        return snapshot[0];
    }

    @Test void jacksonDoesNotExposeRandom() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        Player player = runner.newGame(42, true).getPlayers().get("seat-1");
        String before = mapper.writeValueAsString(player);
        for (int i = 0; i < 100; i++) { player.random().nextLong(); player.random().nextGaussian(); }
        assertEquals(before, mapper.writeValueAsString(player));
        assertNoRandomFields(mapper.readTree(before));
        assertTrue(Arrays.stream(Player.class.getMethods()).noneMatch(method -> method.getName().equals("getRng")
                || method.getName().equals("getRandom")), "Nessun getter Lombok del generatore");
    }

    private static void assertNoRandomFields(JsonNode node) {
        Iterator<String> names = node.fieldNames();
        while (names.hasNext()) {
            String name = names.next();
            assertFalse(name.toLowerCase(java.util.Locale.ROOT).matches(".*(random|rng|seed|gaussian).*"), name);
        }
        node.elements().forEachRemaining(SimulationRunnerTest::assertNoRandomFields);
    }
}
