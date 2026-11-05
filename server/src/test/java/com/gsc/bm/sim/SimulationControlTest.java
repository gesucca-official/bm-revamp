package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.service.session.MatchSnapshot;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Controllo esplicito: rigioca nel motore gli export di partite vere del server, con carte caricate dal catalogo
 * del runner, stesso ordine di mazzo e stesse mosse. Il server non ha seme: non si confrontano partite con lo stesso seme.
 */
@EnabledIfSystemProperty(named = "sim.control", matches = ".+")
class SimulationControlTest {
    private static final ObjectMapper JSON = new ObjectMapper();

    /** Con mazzo gia' ordinato, Collections.shuffle scambia ogni carta con se stessa. */
    private static final class IdentityShuffle extends Random {
        @Override public int nextInt(int bound) { return bound - 1; }
    }

    private static final class Tally {
        int games, rounds, beggingAmbiguousGames, bruiserWins, junkieWins, draws, mixedGames, mixedTurns, mirrorGames;
        final List<String> divergences = new ArrayList<>();
    }

    @Test void replayServerExports() throws Exception {
        SimulationCatalog catalog = new SimulationCatalog();
        Tally tally = new Tally();
        List<Path> exports;
        try (Stream<Path> files = Files.list(Path.of(System.getProperty("sim.control")))) {
            exports = files.filter(file -> file.toString().endsWith(".json")).sorted().collect(Collectors.toList());
        }
        assertTrue(!exports.isEmpty(), "Nessun export");
        for (Path file : exports) replay(catalog, JSON.readTree(file.toFile()), file.getFileName().toString(), tally);
        ObjectNode summary = JSON.createObjectNode();
        summary.put("games", tally.games).put("roundsCompared", tally.rounds)
                .put("beggingAmbiguousGames", tally.beggingAmbiguousGames)
                .put("divergences", tally.divergences.size())
                .put("mirrorGames", tally.mirrorGames).put("mixedGames", tally.mixedGames)
                .put("mixedBruiserWins", tally.bruiserWins).put("mixedJunkieWins", tally.junkieWins)
                .put("mixedDraws", tally.draws)
                .put("mixedTurnsMean", tally.mixedGames == 0 ? 0 : (double) tally.mixedTurns / tally.mixedGames);
        String text = JSON.writerWithDefaultPrettyPrinter().writeValueAsString(summary);
        System.out.println(text);
        Files.writeString(SimulationCatalog.outputDirectory().resolve("control-summary.json"), text);
        assertEquals(List.of(), tally.divergences);
    }

    private void replay(SimulationCatalog catalog, JsonNode export, String name, Tally tally) throws Exception {
        assertTrue(export.path("recording").path("complete").asBoolean(), name);
        List<JsonNode> events = new ArrayList<>();
        for (JsonNode entry : export.path("events")) events.add(JSON.readTree(entry.path("json").asText()));
        JsonNode initial = events.get(0).path("data").path("state");
        List<Player> players = new ArrayList<>();
        for (JsonNode seat : initial.path("players")) players.add(player(catalog, seat, name));
        Game game = new Game(players, initial.path("mode").asText(), false);
        String serverId = export.path("gameId").asText();
        tally.games++;
        boolean diverged = !same(game, initial, serverId, name + " INITIAL", tally);
        JsonNode ready = null;
        for (JsonNode event : events) {
            if (diverged) break;
            String kind = event.path("kind").asText();
            if ("ROUND_READY".equals(kind)) ready = event.path("data");
            if (!"ROUND_COMMITTED".equals(kind)) continue;
            boolean ambiguous = beggingWithChoice(game, ready);
            for (JsonNode move : ready.path("pendingMoves")) game.submitMove(move(move));
            game.resolveMoves(g -> {}, (turn, log) -> log.clear());
            tally.rounds++;
            if (!comparable(game, event.path("data"), serverId).equals(comparable(null, event.path("data"), serverId))) {
                if (ambiguous) tally.beggingAmbiguousGames++;
                else same(game, event.path("data"), serverId, name + " turno " + game.getTurn(), tally);
                diverged = true;
            }
        }
        JsonNode last = events.get(events.size() - 1);
        if (!"OUTCOME".equals(last.path("kind").asText())) tally.divergences.add(name + " senza OUTCOME");
        JsonNode outcome = last.path("data").path("outcome");
        if (!diverged && !game.getWinner().map(id -> id.equals(outcome.path("winner").asText())).orElse(outcome.path("winner").isNull()))
            tally.divergences.add(name + " esito diverso");
        // Le statistiche sono quelle della partita vera, a prescindere dal rigioco.
        String first = initial.path("players").get(0).path("character").asText();
        String second = initial.path("players").get(1).path("character").asText();
        if (first.equals(second)) { tally.mirrorGames++; return; }
        tally.mixedGames++;
        tally.mixedTurns += last.path("data").path("turn").asInt();
        if (outcome.path("winner").isNull()) { tally.draws++; return; }
        boolean firstWon = outcome.path("winner").asText().equals(initial.path("players").get(0).path("playerId").asText());
        if ((firstWon ? first : second).equals(SimulationCatalog.BRUISER)) tally.bruiserWins++;
        else tally.junkieWins++;
    }

    /** BeggingMoney mescola gli oggetti del bersaglio con il generatore del server, che qui non c'e'. */
    private boolean beggingWithChoice(Game game, JsonNode ready) {
        for (JsonNode move : ready.path("pendingMoves")) {
            if (move.path("void").asBoolean()) continue;
            Card card = game.getCardFromHand(move.path("playerId").asText(), move.path("card").asText());
            Player target = game.getPlayers().get(move.path("targetId").asText());
            if (card.getBindingName().endsWith("BeggingMoney") && target != null && target.getCharacter().getItems().size() > 1)
                return true;
        }
        return false;
    }

    private Player player(SimulationCatalog catalog, JsonNode seat, String name) throws Exception {
        String character = seat.path("character").asText();
        List<String> order = new ArrayList<>();
        seat.path("initialDeckDrawOrder").forEach(card -> order.add(card.asText()));
        List<String> sortedOrder = new ArrayList<>(order);
        Collections.sort(sortedOrder);
        assertEquals(catalog.starterDeck(character), sortedOrder, name + " mazzo starter " + character);
        Collections.reverse(order);
        List<Card> deck = new ArrayList<>();
        for (String card : order) deck.add(catalog.card(card));
        List<Card> bound = new ArrayList<>();
        JsonNode specials = seat.path("specialCards");
        for (int i = 1; i < specials.size(); i++) bound.add(catalog.card(specials.get(i).asText()));
        return new Player(seat.path("playerId").asText(), (Character) catalog.instantiate(character),
                catalog.card(specials.get(0).asText()), bound,
                catalog.card(seat.path("lastResort").asText()), deck, new IdentityShuffle());
    }

    private Move move(JsonNode move) {
        if (move.path("void").asBoolean()) return Move.voidMove(move.path("playerId").asText());
        Map<Move.AdditionalAction, String> choices = null;
        if (move.path("choices").isObject()) {
            choices = new EnumMap<>(Move.AdditionalAction.class);
            for (Map.Entry<String, JsonNode> choice : (Iterable<Map.Entry<String, JsonNode>>) move.path("choices")::fields)
                choices.put(Move.AdditionalAction.valueOf(choice.getKey()), choice.getValue().isNull() ? null : choice.getValue().asText());
        }
        return new Move(move.path("card").asText(), move.path("playerId").asText(), move.path("targetId").asText(),
                move.path("gameId").asText(), choices);
    }

    private boolean same(Game game, JsonNode server, String serverId, String where, Tally tally) {
        String ours = comparable(game, server, serverId);
        String theirs = comparable(null, server, serverId);
        if (ours.equals(theirs)) return true;
        int at = 0;
        while (at < Math.min(ours.length(), theirs.length()) && ours.charAt(at) == theirs.charAt(at)) at++;
        tally.divergences.add(where + "\n  motore: " + ours.substring(Math.max(0, at - 120), Math.min(ours.length(), at + 120))
                + "\n  server: " + theirs.substring(Math.max(0, at - 120), Math.min(theirs.length(), at + 120)));
        return false;
    }

    /** Toglie solo cio' che dipende dalla sessione: identificativo, clock, ruolo umano/bot e prove interne del bot. */
    private String comparable(Game game, JsonNode server, String serverId) {
        JsonNode source = game == null ? server : JSON.valueToTree(MatchSnapshot.state(game));
        ObjectNode copy = source.deepCopy();
        copy.remove(List.of("gameId", "moveDeadlines", "reconnectDeadlines", "engineReport"));
        // INITIAL puo' gia' contenere la scelta del bot; dopo un round le mosse pendenti sono vuote.
        copy.remove("pendingMoves");
        for (JsonNode player : (ArrayNode) copy.path("players")) ((ObjectNode) player).remove("controller");
        String id = game == null ? serverId : game.getGameId();
        return copy.toString().replace(id, "GAME").replace(serverId, "GAME");
    }
}
