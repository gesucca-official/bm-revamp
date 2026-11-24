package com.gsc.bm.model.game;

import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.LiveFixtures;
import org.junit.jupiter.api.Test;

import java.util.List;

import static com.gsc.bm.model.game.GameFixtures.*;
import static org.junit.jupiter.api.Assertions.*;

class MoveTest {
    @Test
    void unaffordableMoveIsRejectedWithoutPendingMoveOrResourceChange() {
        Player alice = player("alice");
        Card card = LiveFixtures.card("bruiser.SuperImpact", "impact");
        alice.getCardsInHand().add(card);
        alice.getResources().put(Resource.VIOLENCE, 24);
        Game game = duel(alice, player("bob"));
        Move move = new Move("impact", "alice", "bob", game.getGameId(), null);

        assertFalse(move.isValidFor(game).isValid());
        assertThrows(IllegalMoveException.class, () -> game.submitMove(move));
        assertTrue(game.getPendingMoves().isEmpty());
        assertEquals(24, alice.getResources().get(Resource.VIOLENCE));
    }

    @Test
    void costIsPaidOnlyWhenAppliedAndChangesOnlyTheActingPlayer() {
        Player alice = player("alice");
        Player bob = player("bob");
        alice.getCardsInHand().add(LiveFixtures.card("bruiser.SuperImpact", "impact"));
        Game game = duel(alice, bob);
        Move move = new Move("impact", "alice", "bob", game.getGameId(), null);

        game.submitMove(move);
        assertEquals(25, alice.getResources().get(Resource.VIOLENCE));
        move.applyCostTo(game);
        assertEquals(0, alice.getResources().get(Resource.VIOLENCE));
        assertEquals(25, bob.getResources().get(Resource.VIOLENCE));
    }

    @Test
    void secondMoveFromSamePlayerDoesNotReplaceTheFirst() {
        Player alice = player("alice");
        alice.getCardsInHand().add(LiveFixtures.card("bruiser.SuperImpact", "impact"));
        Game game = duel(alice, player("bob"));
        Move first = new Move("impact", "alice", "bob", game.getGameId(), null);
        game.submitMove(first);

        assertThrows(IllegalMoveException.class, () -> game.submitMove(
                new Move("impact", "alice", "bob", game.getGameId(), null)));
        assertEquals(List.of(first), game.getPendingMoves());
    }

    @Test
    void oneRoundResolvesBothActionsAndAdvancesTurn() {
        Player alice = player("alice");
        Player bob = player("bob");
        alice.getCardsInHand().clear();
        bob.getCardsInHand().clear();
        alice.getCardsInHand().add(LiveFixtures.card("com.last.Struggle", "alice-action"));
        bob.getCardsInHand().add(LiveFixtures.card("com.last.Struggle", "bob-action"));
        Game game = duel(alice, bob);
        game.submitMove(new Move("alice-action", "alice", "bob", game.getGameId(), null));
        assertFalse(game.isReadyToResolveMoves());
        game.submitMove(new Move("bob-action", "bob", "alice", game.getGameId(), null));
        assertTrue(game.isReadyToResolveMoves());
        int[] callbacks = {0};

        game.resolveMoves(updated -> callbacks[0]++, (turn, events) -> assertEquals(0, turn));

        // SB-28, D184 (1): live game, Spazienzio of the Set Base 1.0 (70 HEALTH), «Addosso!!!» (the sheet of the last resort):
        // 5 HIT to oneself and 10 to the opponent, 15 each: 70 - 15 = 55 (before: 100 - 15 = 85 with the Set Base 0.1).
        assertEquals(55, alice.getResources().get(Resource.HEALTH));
        assertEquals(55, bob.getResources().get(Resource.HEALTH));
        assertEquals(1, game.getTurn());
        assertEquals(2, game.getResolvedMoves().size());
        assertTrue(game.getPendingMoves().isEmpty());
        assertEquals(1, callbacks[0]);
        assertFalse(game.isOver());
    }
}
