package com.gsc.bm.sim;

import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.ComPlayer;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.bot.BotPolicy;
import com.gsc.bm.model.game.bot.BotView;
import com.gsc.bm.model.game.bot.LegalMove;
import com.gsc.bm.model.game.bot.RandomPolicy;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

class BotViewTest {
    private static SimulationRunner runner;
    private static final SimulationRunner.Contender RANDOM_BRUISER =
            new SimulationRunner.Contender(SimulationCatalog.BRUISER, new RandomPolicy());
    private static final SimulationRunner.Contender RANDOM_JUNKIE =
            new SimulationRunner.Contender(SimulationCatalog.JUNKIE, new RandomPolicy());

    @BeforeAll static void catalog() throws Exception { runner = new SimulationRunner(new SimulationCatalog()); }

    private static final Set<Class<?>> ENGINE = Set.of(Game.class, Player.class, Card.class, Move.class,
            com.gsc.bm.model.Character.class, com.gsc.bm.model.game.status.Status.class, com.gsc.bm.model.game.Timer.class);

    /** Il bot non puo' arrivare al motore: nessun campo della vista, a qualunque profondita', ha un tipo del motore. */
    @Test void viewHoldsNoEngineObject() {
        Set<Type> seen = new HashSet<>();
        walk(BotView.class, seen);
        walk(LegalMove.class, seen);
        assertTrue(seen.contains(BotView.CardSeen.class), "La visita deve scendere nelle classi annidate");
    }

    private void walk(Type type, Set<Type> seen) {
        if (!seen.add(type)) return;
        if (type instanceof ParameterizedType) {
            for (Type argument : ((ParameterizedType) type).getActualTypeArguments()) walk(argument, seen);
            return;
        }
        if (!(type instanceof Class) || ((Class<?>) type).isEnum() || ((Class<?>) type).isPrimitive()) return;
        Class<?> clazz = (Class<?>) type;
        for (Class<?> engine : ENGINE)
            assertFalse(engine.isAssignableFrom(clazz), "Tipo del motore raggiungibile dalla vista: " + clazz);
        if (!clazz.getName().startsWith("com.gsc.bm")) return;
        for (Field field : clazz.getDeclaredFields())
            if (!Modifier.isStatic(field.getModifiers())) walk(field.getGenericType(), seen);
    }

    private static final class Leaky { List<Card> cards; }

    @Test void theWalkReallyFindsEngineObjects() {
        assertThrows(org.opentest4j.AssertionFailedError.class, () -> walk(Leaky.class, new HashSet<>()));
    }

    /** In 1v1 la partita finisce alla prima morte: il bersaglio morto si vede solo con piu' giocatori. */
    @Test void deadOpponentsCannotBeTargeted() throws Exception {
        SimulationCatalog catalog = new SimulationCatalog();
        Player me = catalog.player(SimulationCatalog.BRUISER, "seat-1", new Random(1), new RandomPolicy());
        Player alive = catalog.player(SimulationCatalog.JUNKIE, "seat-2", new Random(2), new RandomPolicy());
        Player dead = catalog.player(SimulationCatalog.JUNKIE, "seat-3", new Random(3), new RandomPolicy());
        Game game = new Game(List.of(me, alive, dead), "sim", false);
        dead.getCharacter().getResources().put(Resource.HEALTH, 0);
        List<LegalMove> legal = BotView.of(game, "seat-1").legalMoves();
        assertTrue(legal.stream().anyMatch(move -> move.getTargetId().equals("seat-2")));
        assertTrue(legal.stream().noneMatch(move -> move.getTargetId().equals("seat-3")));
        assertEquals(accepted(game, me), legal.stream()
                .map(move -> key(move.getCard().getName(), move.getTargetId(), move.getDiscard(), move.getItem()))
                .collect(Collectors.toCollection(TreeSet::new)));
    }

    @Test void policySeesOnlyViewMovesAndRandom() {
        Method choose = BotPolicy.class.getMethods()[0];
        assertEquals(List.of(BotView.class, List.class, Random.class), List.of(choose.getParameterTypes()));
    }

    /** Stessa vista anche cambiando cio' che un giocatore non vede: mano e ordine del mazzo altrui, mossa altrui appena presentata. */
    @Test void hiddenInformationDoesNotChangeTheView() throws Exception {
        for (long seed = 0; seed < 20; seed++) {
            Game game = runner.newGame(seed, RANDOM_BRUISER, RANDOM_JUNKIE);
            BotView before = BotView.of(game, "seat-1");
            Player other = game.getPlayers().get("seat-2");

            Collections.shuffle(other.getDeck(), new Random(seed));
            List<Card> hand = other.getCardsInHand();
            Card swappedOut = hand.remove(hand.size() - 1);
            hand.add(other.getDeck().remove(0));
            other.getDeck().add(swappedOut);
            assertEquals(before, BotView.of(game, "seat-1"), "Mano o mazzo altrui visibili, seme " + seed);

            List<LegalMove> legal = BotView.of(game, "seat-2").legalMoves();
            assertFalse(legal.isEmpty());
            game.getPendingMoves().add(new Move(legal.get(0).getCard().getName(), "seat-2", legal.get(0).getTargetId(),
                    game.getGameId(), Map.of()));
            assertEquals(before, BotView.of(game, "seat-1"), "Mossa altrui visibile, seme " + seed);
        }
    }

    /** Quello che R08 dichiara pubblico deve invece arrivare, e la vista e' una copia che il motore non sente. */
    @Test void publicInformationArrivesAsACopy() throws Exception {
        Game game = runner.newGame(1, RANDOM_BRUISER, RANDOM_JUNKIE);
        Player other = game.getPlayers().get("seat-2");
        BotView view = BotView.of(game, "seat-1");
        BotView.Opponent seen = view.getOpponents().get(0);
        assertEquals(other.getCharacter().getResources(), seen.getSeat().getResources());
        assertEquals(other.getCardsInHand().size(), seen.getHandSize());
        assertEquals(other.getDeckSize(), seen.getDeckSize());
        assertEquals(other.getCharacter().getItems().size(), seen.getSeat().getItems().size());

        int health = other.getCharacter().getResources().get(Resource.HEALTH);
        assertThrows(UnsupportedOperationException.class, () -> seen.getSeat().getResources().put(Resource.HEALTH, 1));
        assertThrows(UnsupportedOperationException.class, () -> view.getSelf().getHand().clear());
        other.getCharacter().getResources().put(Resource.HEALTH, health - 7);
        assertEquals(health, seen.getSeat().resource(Resource.HEALTH), "La vista non segue il motore");
    }

    /** legalMoves e' esattamente cio' che accetta Move.isValidFor, sui bersagli previsti dalla carta (R03), turno per turno. */
    @Test void legalMovesAreExactlyWhatTheRulesAccept() throws Exception {
        int compared = 0;
        for (long seed = 0; seed < 300; seed++) {
            Game game = runner.newGame(seed, seed % 2 == 0 ? RANDOM_BRUISER : RANDOM_JUNKIE, seed % 3 == 0 ? RANDOM_BRUISER : RANDOM_JUNKIE);
            Set<String> checked = new HashSet<>();
            runner.continueGame(game, seed, false, state -> {
                if (state.isOver() || !checked.add(state.getTurn() + "")) return;
                for (Player player : state.getPlayers().values()) {
                    assertEquals(accepted(state, player), BotView.of(state, player.getPlayerId()).legalMoves().stream()
                            .map(move -> key(move.getCard().getName(), move.getTargetId(), move.getDiscard(), move.getItem()))
                            .collect(Collectors.toCollection(TreeSet::new)), "Turno " + state.getTurn());
                }
            });
            compared += checked.size();
        }
        assertTrue(compared > 1000, "Stati confrontati: " + compared);
    }

    private static String key(String card, String target, String discard, String item) {
        return card + " -> " + target + " / " + discard + " / " + item;
    }

    private Set<String> accepted(Game game, Player player) {
        Set<String> accepted = new TreeSet<>();
        List<String> nothing = Collections.singletonList(null);
        for (Card card : new HashSet<>(player.getCardsInHand())) {
            List<String> discards = card.isCharacterBound() ? player.getCardsInHand().stream()
                    .map(Card::getName).distinct().collect(Collectors.toList()) : nothing;
            for (String target : targets(game, player, card))
                for (String discard : discards)
                    for (String item : items(game, player, card, target)) {
                        Map<Move.AdditionalAction, String> choices = new EnumMap<>(Move.AdditionalAction.class);
                        if (discard != null) choices.put(Move.AdditionalAction.DISCARD_ONE, discard);
                        if (item != null) choices.put(Move.AdditionalAction.TARGET_ITEM, item);
                        if (valid(game, new Move(card.getName(), player.getPlayerId(), target, game.getGameId(), choices)))
                            accepted.add(key(card.getName(), target, discard, item));
                    }
        }
        return accepted;
    }

    private List<String> targets(Game game, Player player, Card card) {
        List<String> targets = new ArrayList<>();
        if (card.getCanTarget().contains(Card.CardTarget.SELF) || card.getCanTarget().contains(Card.CardTarget.NEAR_ITEM))
            targets.add("SELF");
        if (card.getCanTarget().contains(Card.CardTarget.OPPONENT) || card.getCanTarget().contains(Card.CardTarget.FAR_ITEM))
            game.getOpponents(player.getPlayerId()).forEach(o -> targets.add(o.getPlayerId()));
        return targets;
    }

    private List<String> items(Game game, Player player, Card card, String target) {
        if (card.getCanTarget().contains(Card.CardTarget.NEAR_ITEM))
            return player.getCharacter().getItems().stream().map(Card::getName).distinct().collect(Collectors.toList());
        if (card.getCanTarget().contains(Card.CardTarget.FAR_ITEM))
            return game.getPlayers().get(target).getCharacter().getItems().stream().map(Card::getName).distinct().collect(Collectors.toList());
        return Collections.singletonList(null);
    }

    /** isValidFor e' del pacchetto del motore: si passa da submitMove, poi si ritira la mossa. */
    private boolean valid(Game game, Move move) {
        try {
            game.submitMove(move);
            game.getPendingMoves().remove(move);
            return true;
        } catch (com.gsc.bm.model.game.IllegalMoveException refused) {
            return false;
        }
    }

    @Test void policyCannotPlayAMoveItDidNotGet() throws Exception {
        BotPolicy cheat = (view, legal, random) -> null;
        SimulationRunner.Contender cheater = new SimulationRunner.Contender(SimulationCatalog.BRUISER,
                (BotPolicy & java.io.Serializable) cheat);
        assertThrows(IllegalStateException.class, () -> runner.run(0, cheater, RANDOM_JUNKIE));
    }

    /** Il casuale sulla vista gioca come ComPlayer: se la vista togliesse mosse o informazioni utili, perderebbe. */
    @Test void randomPolicyPlaysLikeTheOldRandomBot() throws Exception {
        int games = 4000, newWins = 0, oldWins = 0, newTurns = 0;
        for (long seed = 0; seed < games; seed++) {
            boolean newFirst = seed % 2 == 0;
            String character = seed % 4 < 2 ? SimulationCatalog.BRUISER : SimulationCatalog.JUNKIE;
            SimulationRunner.Contender fresh = new SimulationRunner.Contender(character, new RandomPolicy());
            SimulationRunner.Contender old = new SimulationRunner.Contender(character, null);
            SimulationRunner.Result result = runner.run(seed, newFirst ? fresh : old, newFirst ? old : fresh);
            assertNotEquals(SimulationRunner.Outcome.TURN_LIMIT, result.outcome);
            newTurns += result.turns;
            if (result.outcome == SimulationRunner.Outcome.DRAW) continue;
            if ((result.outcome == SimulationRunner.Outcome.FIRST_WIN) == newFirst) newWins++; else oldWins++;
        }
        double share = (double) newWins / (newWins + oldWins);
        assertTrue(share > 0.47 && share < 0.53, "Quota del casuale sulla vista: " + share);
        double turns = (double) newTurns / games;
        assertTrue(turns > 11 && turns < 16, "Turni medi: " + turns);
    }

    @Test void gamesWithBotsAreReproducibleAndSurviveACopy() throws Exception {
        for (long seed = 0; seed < 20; seed++) {
            final long fixed = seed;
            assertEquals(runner.continueGame(runner.newGame(seed, RANDOM_BRUISER, RANDOM_JUNKIE), seed, true, g -> {}).jsonl(),
                    runner.continueGame(runner.newGame(seed, RANDOM_BRUISER, RANDOM_JUNKIE), seed, true, g -> {}).jsonl());
            int midpoint = Math.max(1, runner.run(seed, RANDOM_BRUISER, RANDOM_JUNKIE).turns / 2);
            Game[] snapshot = new Game[1];
            SimulationRunner.Result original = runner.continueGame(runner.newGame(seed, RANDOM_BRUISER, RANDOM_JUNKIE), seed, true, state -> {
                if (state.getTurn() == midpoint) {
                    try { snapshot[0] = copy(state); } catch (Exception e) { throw new IllegalStateException(e); }
                }
            });
            SimulationRunner.Result resumed = runner.continueGame(snapshot[0], fixed, true, state -> {});
            assertEquals(original.trace.subList(midpoint, original.trace.size()), resumed.trace);
        }
    }

    private static Game copy(Game game) throws Exception {
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        try (ObjectOutputStream out = new ObjectOutputStream(bytes)) { out.writeObject(game); }
        try (ObjectInputStream in = new ObjectInputStream(new ByteArrayInputStream(bytes.toByteArray()))) {
            return (Game) in.readObject();
        }
    }

    @Test void comPlayerIsStillTheMetric() throws Exception {
        Game game = runner.newGame(0, true);
        assertEquals(ComPlayer.class, game.getPlayers().get("seat-1").getClass());
    }
}
