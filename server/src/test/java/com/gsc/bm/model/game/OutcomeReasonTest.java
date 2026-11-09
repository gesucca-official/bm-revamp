package com.gsc.bm.model.game;

import com.gsc.bm.model.Resource;
import com.gsc.bm.service.session.*;
import com.gsc.bm.service.view.ViewExtractorService;
import org.junit.jupiter.api.Test;

import java.util.*;

import static com.gsc.bm.model.game.GameFixtures.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

/**
 * O20: {@code outcomeReason} says why the match ended. A forfeit reason ("timeout", "leave") is valid only when the
 * forfeits themselves ended the match; when the round resolved after a forfeit ends it, the reason is "combat".
 */
class OutcomeReasonTest {
    final LifecycleClockTest.Time time = new LifecycleClockTest.Time();
    final GameSessionServiceImpl service = new GameSessionServiceImpl(mock(ConnectionsService.class),
            mock(GameLoggingService.class), mock(ViewExtractorService.class), time);

    ComPlayer computer(String id, long seed) {
        return new ComPlayer(id, new com.gsc.bm.model.cards.bruiser.character.BigBadBruiser(),
                named(new com.gsc.bm.model.cards.com.basic.BruiserGrab(), "basic"), List.of(),
                named(new com.gsc.bm.model.cards.com.last.Struggle(), "last-resort"), List.of(), new Random(seed));
    }

    Game start(String type, Player... players) {
        Game g = new Game(List.of(players), type, false);
        service.newGame(g);
        return g;
    }

    Game humans(String... users) {
        return start("quickFFA", Arrays.stream(users).map(GameFixtures::player).toArray(Player[]::new));
    }

    Move move(Game g, String user, String target) { return new Move("last-resort", user, target, g.getGameId(), null); }

    /** The two humans of a FFA with three computers both time out together; the computers then fight alone. */
    @Test void ffaTwoHumansTimeOutAndComputersFinishByCombat() {
        Game g = start("quickFFA", player("a"), player("b"), computer("c1", 1), computer("c2", 2), computer("c3", 3));
        time.now += 30000; service.expireDue();
        assertEquals(Set.of("a", "b"), g.getForfeits().keySet());
        assertTrue(g.isOver());
        assertTrue(g.getTurn() > 0, "the computers resolved rounds after the forfeits");
        String winner = g.getWinner().orElseThrow();
        assertTrue(g.getPlayers().get(winner) instanceof ComPlayer);
        assertEquals("combat", g.getOutcomeReason());
        assertEquals(Map.of("a", "move timeout", "b", "move timeout"), g.getForfeits(), "forfeit reasons are unchanged");
    }

    @Test void duelSimultaneousTimeoutIsDrawByTimeout() {
        Game g = humans("a", "b");
        time.now += 30000; service.expireDue();
        assertTrue(g.isOver()); assertTrue(g.getWinner().isEmpty());
        assertEquals(0, g.getTurn());
        assertEquals("timeout", g.getOutcomeReason());
    }

    @Test void forfeitsLeavingOneSurvivorEndByTimeout() {
        Game g = humans("a", "b", "c");
        service.submitMoveToGame(move(g, "c", "a"), () -> {});
        time.now += 30000; service.expireDue();
        assertEquals("c", g.getWinner().orElseThrow());
        assertEquals(0, g.getTurn());
        assertEquals("timeout", g.getOutcomeReason());
    }

    @Test void leaveOfLastHumanInFfaWithComputersEndsByCombat() {
        Game g = start("quickFFA", player("a"), computer("c1", 4), computer("c2", 5));
        service.leaveGame(g.getGameId(), "a");
        assertTrue(g.isOver());
        assertTrue(g.getTurn() > 0);
        // Two identical computers may kill each other in the same round (draw): the reason is "combat" either way.
        g.getWinner().ifPresent(w -> assertTrue(g.getPlayers().get(w) instanceof ComPlayer));
        assertEquals("combat", g.getOutcomeReason());
    }

    @Test void leaveAgainstSingleComputerEndsByLeave() {
        Game g = start("quick1vCom", player("a"), computer("c1", 1));
        service.leaveGame(g.getGameId(), "a");
        assertTrue(g.isOver());
        assertEquals("c1", g.getWinner().orElseThrow());
        assertEquals(0, g.getTurn());
        assertEquals("leave", g.getOutcomeReason());
    }

    /** The forfeit completes the round's moves; that round kills the last opponent. */
    @Test void timeoutCompletingTheRoundThatKillsTheLastOpponentEndsByCombat() {
        Game g = humans("a", "b", "c");
        g.getPlayers().get("c").getResources().put(Resource.HEALTH, 15);
        service.submitMoveToGame(move(g, "b", "c"), () -> {});
        service.submitMoveToGame(move(g, "c", "b"), () -> {});
        assertFalse(g.isOver());
        time.now += 30000; service.expireDue();
        assertEquals(Set.of("a"), g.getForfeits().keySet());
        assertEquals("b", g.getWinner().orElseThrow());
        assertEquals(1, g.getTurn());
        assertEquals("combat", g.getOutcomeReason());
    }

    @Test void leaveCompletingTheRoundThatKillsTheLastOpponentEndsByCombat() {
        Game g = humans("a", "b", "c");
        g.getPlayers().get("c").getResources().put(Resource.HEALTH, 15);
        service.submitMoveToGame(move(g, "b", "c"), () -> {});
        service.submitMoveToGame(move(g, "c", "b"), () -> {});
        service.leaveGame(g.getGameId(), "a");
        assertEquals("b", g.getWinner().orElseThrow());
        assertEquals(1, g.getTurn());
        assertEquals("combat", g.getOutcomeReason());
    }

    @Test void moveThatKillsTheLastOpponentStaysCombat() {
        Game g = humans("a", "b");
        g.getPlayers().get("b").getResources().put(Resource.HEALTH, 15);
        service.submitMoveToGame(move(g, "a", "b"), () -> {});
        service.submitMoveToGame(move(g, "b", "a"), () -> {});
        assertTrue(g.isOver());
        assertEquals("combat", g.getOutcomeReason());
    }
}
