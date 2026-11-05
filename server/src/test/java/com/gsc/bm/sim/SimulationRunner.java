package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Timer;
import com.gsc.bm.model.game.bot.BotPolicy;
import com.gsc.bm.model.game.status.Status;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.function.Consumer;
import java.util.stream.Collectors;

/** Runner in-process: nessun contesto, clock o servizio applicativo. */
final class SimulationRunner {
    enum Outcome { FIRST_WIN, SECOND_WIN, DRAW, TURN_LIMIT }
    static final int MAX_TURNS = 200;
    private static final ObjectMapper JSON = new ObjectMapper();
    private final SimulationCatalog catalog;

    static final class Result {
        final Outcome outcome;
        final int turns;
        final int emptyMoves;
        final List<String> trace;

        Result(Outcome outcome, int turns, int emptyMoves, List<String> trace) {
            this.outcome = outcome;
            this.turns = turns;
            this.emptyMoves = emptyMoves;
            this.trace = trace;
        }

        String jsonl() { return String.join("\n", trace) + "\n"; }
    }

    private static final class TurnLimit extends RuntimeException { }

    /** Un personaggio e chi lo gioca: senza policy, l'attuale ComPlayer casuale. */
    static final class Contender {
        final String character;
        final BotPolicy policy;

        Contender(String character, BotPolicy policy) {
            this.character = character;
            this.policy = policy;
        }
    }

    SimulationRunner(SimulationCatalog catalog) { this.catalog = catalog; }

    Game newGame(long seed, boolean bruiserFirst) throws Exception {
        return newGame(seed, new Contender(bruiserFirst ? SimulationCatalog.BRUISER : SimulationCatalog.JUNKIE, null),
                new Contender(bruiserFirst ? SimulationCatalog.JUNKIE : SimulationCatalog.BRUISER, null));
    }

    Game newGame(long seed, Contender first, Contender second) throws Exception {
        Random source = new Random(seed);
        Player a = catalog.player(first.character, "seat-1", new Random(source.nextLong()), first.policy);
        Player b = catalog.player(second.character, "seat-2", new Random(source.nextLong()), second.policy);
        return new Game(List.of(a, b), "sim", false);
    }

    Result run(long seed, Contender first, Contender second) throws Exception {
        return continueGame(newGame(seed, first, second), seed, false, game -> {});
    }

    Result run(long seed, boolean bruiserFirst, boolean trace) throws Exception {
        return continueGame(newGame(seed, bruiserFirst), seed, trace, game -> {});
    }

    Result continueGame(Game game, long seed, boolean trace, Consumer<Game> committed) {
        List<String> lines = new ArrayList<>();
        List<String> turnEvents = new ArrayList<>();
        int[] emptyMoves = {0};
        Outcome outcome;
        try {
            game.resolveMoves(g -> {}, (turn, events) -> {
                if (trace) turnEvents.addAll(events);
                events.clear(); // Come GameSessionServiceImpl: il drain consuma gli eventi.
            }, (stage, state) -> {
                if ("ROUND_READY".equals(stage)) {
                    for (Move move : state.getPendingMoves()) if (move.isVoid()) emptyMoves[0]++;
                } else if ("ROUND_COMMITTED".equals(stage)) {
                    if (trace) {
                        lines.add(line(state, seed, "TURN", null, turnEvents));
                        turnEvents.clear();
                    }
                    committed.accept(state);
                    // Il turno 200 può finire normalmente; interrompi prima della ricorsione al 202.
                    if (state.getTurn() > MAX_TURNS) throw new TurnLimit();
                }
            });
            outcome = game.getWinner().map(id -> "seat-1".equals(id)
                    ? Outcome.FIRST_WIN : Outcome.SECOND_WIN).orElse(Outcome.DRAW);
        } catch (TurnLimit limit) {
            outcome = Outcome.TURN_LIMIT;
        }
        if (trace) lines.add(line(game, seed, "FINAL", outcome, game.getLoggedTurnEvents()));
        game.getLoggedTurnEvents().clear();
        return new Result(outcome, game.getTurn(), emptyMoves[0], lines);
    }

    private static Map<String, Object> fields(Object... entries) {
        Map<String, Object> fields = new LinkedHashMap<>();
        for (int i = 0; i < entries.length; i += 2) fields.put((String) entries[i], entries[i + 1]);
        return fields;
    }

    private static List<String> cards(Iterable<Card> cards) {
        List<String> names = new ArrayList<>();
        cards.forEach(card -> names.add(card.getBindingName()));
        return names;
    }

    private static Map<String, Object> player(Player player) {
        Character character = player.getCharacter();
        List<Object> statuses = new ArrayList<>();
        for (Status status : character.getStatuses()) statuses.add(fields("name", status.getName(),
                "description", status.getDescription(), "type", status.getType(), "flow", status.getFlow(),
                "property", status.getImpactedProperty(), "singleUse", status.isSingleUse(),
                "equip", status.isEquip(), "turns", status.getLastsForTurns()));
        List<Object> timers = new ArrayList<>();
        for (Timer timer : character.getTimers())
            timers.add(fields("name", timer.getName(), "turns", timer.getTimer()));
        return fields("id", player.getPlayerId(), "character", character.getBindingName(),
                "resources", character.getResources(), "hand", cards(player.getCardsInHand()),
                "deckSize", player.getDeckSize(), "items", cards(character.getItems()),
                "statuses", statuses, "timers", timers);
    }

    private static String line(Game game, long seed, String kind, Outcome outcome, List<String> events) {
        List<Object> moves = new ArrayList<>();
        for (Move move : game.getResolvedMoves()) moves.add(fields("player", move.getPlayerId(),
                "card", move.getPlayedCardName(), "target", move.getTargetId(), "gameId", move.getGameId(),
                "choices", move.getChoices(), "void", move.isVoid(), "report", move.getMoveReport()));
        Map<String, Object> row = fields("kind", kind, "seed", seed, "gameId", game.getGameId(),
                "turn", game.getTurn(), "moves", moves, "report", game.getTimeBasedEffects(),
                "players", game.getPlayers().values().stream().map(SimulationRunner::player).collect(Collectors.toList()),
                "events", new ArrayList<>(events));
        if (outcome != null) row.put("outcome", outcome);
        try {
            // Solo i due dati instabili autorizzati: nessun ordinamento o altra normalizzazione.
            return JSON.writeValueAsString(row).replace(game.getGameId(), "GAME_ID")
                    .replaceAll("@[0-9a-fA-F]+", "@IDENTITY");
        } catch (Exception error) {
            throw new IllegalStateException("Impossibile scrivere la traccia", error);
        }
    }

    /** Due JVM dei test scrivono esclusivamente sotto tmp/sim/. */
    public static void main(String[] args) throws Exception {
        Path output = SimulationCatalog.outputDirectory().resolve(args[0]).normalize();
        if (!output.getParent().equals(SimulationCatalog.outputDirectory()) || !args[0].endsWith(".jsonl"))
            throw new IllegalArgumentException("Usare un nome .jsonl sotto tmp/sim/");
        // Varia le allocazioni di hash identita precedenti al caricamento degli enum.
        int warmup = args.length > 1 ? Integer.parseInt(args[1]) : 0;
        for (int i = 0; i < warmup; i++) System.identityHashCode(new Object());
        SimulationRunner runner = new SimulationRunner(new SimulationCatalog());
        StringBuilder lines = new StringBuilder();
        for (long seed = 0; seed < 20; seed++) lines.append(runner.run(seed, seed % 2 == 0, true).jsonl());
        Files.writeString(output, lines, StandardCharsets.UTF_8);
    }
}
