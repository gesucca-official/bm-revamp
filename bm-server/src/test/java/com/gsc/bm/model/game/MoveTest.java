package com.gsc.bm.model.game;

import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.bruiser.SuperImpact;
import com.gsc.bm.model.cards.com.last.Struggle;
import org.junit.jupiter.api.Test;

import java.util.List;

import static com.gsc.bm.model.game.GameFixtures.*;
import static org.junit.jupiter.api.Assertions.*;

class MoveTest {
    @Test
    void unaffordableMoveIsRejectedWithoutPendingMoveOrResourceChange() {
        Player alice = player("alice");
        Card card = named(new SuperImpact(), "impact");
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
        alice.getCardsInHand().add(named(new SuperImpact(), "impact"));
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
        alice.getCardsInHand().add(named(new SuperImpact(), "impact"));
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
        alice.getCardsInHand().add(named(new Struggle(), "alice-action"));
        bob.getCardsInHand().add(named(new Struggle(), "bob-action"));
        Game game = duel(alice, bob);
        game.submitMove(new Move("alice-action", "alice", "bob", game.getGameId(), null));
        assertFalse(game.isReadyToResolveMoves());
        game.submitMove(new Move("bob-action", "bob", "alice", game.getGameId(), null));
        assertTrue(game.isReadyToResolveMoves());
        int[] callbacks = {0};

        game.resolveMoves(updated -> callbacks[0]++, (turn, events) -> assertEquals(0, turn));

        assertEquals(85, alice.getResources().get(Resource.HEALTH));
        assertEquals(85, bob.getResources().get(Resource.HEALTH));
        assertEquals(1, game.getTurn());
        assertEquals(2, game.getResolvedMoves().size());
        assertTrue(game.getPendingMoves().isEmpty());
        assertEquals(1, callbacks[0]);
        assertFalse(game.isOver());
    }
}
