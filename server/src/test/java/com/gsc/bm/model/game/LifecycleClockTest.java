package com.gsc.bm.model.game;

import com.gsc.bm.service.session.*;
import com.gsc.bm.service.session.model.ActionLog;
import com.gsc.bm.service.view.ViewExtractorService;
import com.gsc.bm.model.Resource;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import java.time.*;
import java.util.*;
import java.util.concurrent.*;
import static com.gsc.bm.model.game.GameFixtures.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LifecycleClockTest {
    static class Time extends Clock {
        long now = 1_000_000;
        public ZoneId getZone() { return ZoneOffset.UTC; }
        public Clock withZone(ZoneId zone) { return this; }
        public Instant instant() { return Instant.ofEpochMilli(now); }
        public long millis() { return now; }
    }
    final Time time = new Time();
    final GameLoggingService logs = mock(GameLoggingService.class);
    final GameSessionServiceImpl service = new GameSessionServiceImpl(mock(ConnectionsService.class), logs,
            mock(ViewExtractorService.class), time);
    Game game(String... users) {
        Game g = new Game(Arrays.stream(users).map(GameFixtures::player).collect(java.util.stream.Collectors.toList()), "quickFFA", false);
        service.newGame(g); return g;
    }
    Move move(Game g, String user, String target) { return new Move("last-resort", user, target, g.getGameId(), null); }
    long outcomes() {
        return mockingDetails(logs).getInvocations().stream().filter(i -> i.getMethod().getName().equals("committed"))
                .mapToLong(i -> ((List<ActionLog>)i.getArgument(1)).stream().filter(a -> a.getWhat().equals("OUTCOME")).count()).sum();
    }
    @ParameterizedTest @ValueSource(longs={29999,30000,30001})
    void firstMoveBoundaryAndSimultaneousDraw(long elapsed) {
        Game g=game("a","b"); assertEquals(time.now+30000,g.getMoveDeadlines().get("a"));
        time.now+=elapsed;
        if (elapsed<30000) { service.submitMoveToGame(move(g,"a","b"),()->{}); assertFalse(g.isOver()); }
        else {
            assertThrows(IllegalMoveException.class,()->service.submitMoveToGame(move(g,"a","b"),()->{}));
            assertTrue(g.isOver()); assertTrue(g.getWinner().isEmpty()); assertEquals(2,g.getForfeits().size());
            assertEquals(1,outcomes()); service.expireDue(); assertEquals(1,outcomes());
        }
    }
    @Test void nextTurnStartsAfterCommitAndPendingStopsOnlyOwnClock() {
        Game g=game("a","b"); time.now+=17000;
        service.submitMoveToGame(move(g,"a","b"),()->{});
        assertFalse(g.getMoveDeadlines().containsKey("a")); assertEquals(1_030_000L,g.getMoveDeadlines().get("b"));
        time.now+=1000; service.submitMoveToGame(move(g,"b","a"),()->{});
        assertEquals(1,g.getTurn()); assertEquals(1_048_000L,g.getMoveDeadlines().get("a"));
    }
    @Test void ffaBatchEliminatesOnlyExpiredAndKeepsOtherPendingMoves() {
        Game g=game("a","b","c","d");
        service.submitMoveToGame(move(g,"c","d"),()->{}); service.submitMoveToGame(move(g,"d","c"),()->{});
        time.now+=30000; service.expireDue();
        assertEquals(Set.of("a","b"),g.getForfeits().keySet()); assertFalse(g.isOver()); assertEquals(1,g.getTurn());
        assertEquals(100,g.getPlayers().get("a").getResources().get(Resource.HEALTH));
        assertEquals(85,g.getPlayers().get("c").getResources().get(Resource.HEALTH)); assertEquals(0,outcomes());
    }
    @Test void ffaOneSurvivorWinsAndDuplicateLeaveDoesNotRecordTwice() {
        Game g=game("a","b","c"); service.submitMoveToGame(move(g,"c","a"),()->{});
        time.now+=30000; service.expireDue(); assertEquals("c",g.getWinner().orElseThrow()); assertEquals(1,outcomes());
        for(String u:List.of("a","b","c")) { service.leaveGame(g.getGameId(),u); service.leaveGame(g.getGameId(),u); }
        assertEquals(1,outcomes()); assertThrows(IllegalArgumentException.class,()->service.getGame(g.getGameId()));
        verify(logs,times(1)).flush(g);
    }
    @Test void simultaneousDeadlinesUseEarlierInstantEvenWhenPollIsLate() {
        Game g=game("a","b");
        service.submitMoveToGame(move(g,"a","b"),()->{});
        time.now+=1000; service.disconnected("a");
        time.now+=50000; service.expireDue();
        assertEquals("a",g.getWinner().orElseThrow()); assertEquals(Map.of("b","move timeout"),g.getForfeits());
    }
    @Test void leaveCancelsOwnPendingMoveAndOthersContinue() {
        Game g=game("a","b","c"); service.submitMoveToGame(move(g,"a","b"),()->{});
        service.leaveGame(g.getGameId(),"a"); service.leaveGame(g.getGameId(),"a");
        assertFalse(g.isOver()); assertTrue(g.getPendingMoves().stream().noneMatch(m -> !m.isVoid() && m.getPlayerId().equals("a")));
        service.leaveGame(g.getGameId(),"b"); assertEquals("c",g.getWinner().orElseThrow()); assertEquals(1,outcomes());
        assertEquals("none",((Map<?,?>)service.resume("a")).get("status"));
    }
    Game versusComputer() {
        Player a=player("a");
        var bot=new ComPlayer(new com.gsc.bm.model.cards.bruiser.character.BigBadBruiser(),
            named(new com.gsc.bm.model.cards.com.basic.BruiserGrab(),"basic"),List.of(),
            named(new com.gsc.bm.model.cards.com.last.Struggle(),"last-resort"),List.of());
        Game g=new Game(List.of(a,bot),"quick1vCom",false); service.newGame(g); return g;
    }
    @ParameterizedTest @ValueSource(longs={29999,30000,30001})
    void reconnectBoundaryAlsoAgainstComputerAndRepeatedDropDoesNotExtend(long elapsed) {
        Game g=versusComputer(); time.now+=900000; service.expireDue(); assertFalse(g.isOver());
        assertTrue(g.getMoveDeadlines().isEmpty()); service.disconnected("a");
        long deadline=g.getReconnectDeadlines().get("a"); time.now+=10000; service.disconnected("a");
        assertEquals(deadline,g.getReconnectDeadlines().get("a"));
        time.now=deadline-30000+elapsed; service.resume("a");
        assertEquals(elapsed>=30000,g.isOver()); assertTrue(g.getReconnectDeadlines().isEmpty());
        if(elapsed>=30000) { assertEquals(1,outcomes()); assertDoesNotThrow(()->service.resume("a")); }
    }
    @Test void multiplayerDisconnectPreservesMoveDeadlineAndAcceptedMove() {
        Game g=game("a","b"); service.submitMoveToGame(move(g,"a","b"),()->{});
        long deadline=g.getMoveDeadlines().get("b"); time.now+=15000; service.disconnected("a"); service.disconnected("b");
        assertEquals(deadline,g.getMoveDeadlines().get("b"));
        service.resume("a"); assertEquals(1,g.getPendingMoves().size());
        time.now=deadline; service.expireDue(); assertEquals("a",g.getWinner().orElseThrow());
    }
    @Test void coincidentMoveAndReconnectDeadlinesProduceOneForfeitPerPlayerAndOneDraw() {
        Game g=game("a","b"); service.disconnected("a"); service.disconnected("b");
        time.now+=30000; service.expireDue();
        assertEquals(Map.of("a","move timeout","b","move timeout"),g.getForfeits());
        assertTrue(g.getWinner().isEmpty()); assertEquals(1,outcomes());
        assertThrows(IllegalArgumentException.class,()->service.getGame(g.getGameId()));
        assertDoesNotThrow(()->service.resume("a")); assertDoesNotThrow(()->service.resume("a"));
    }
    @Test void detachedFfaForfeitCanBeAcknowledgedWhileOthersContinue() {
        Game g=game("a","b","c","d"); service.disconnected("a");
        for(String user:List.of("b","c","d")) { service.submitMoveToGame(move(g,user,"a"),()->{}); }
        time.now+=30000; service.expireDue(); assertFalse(g.isOver());
        assertEquals("finished",((Map<?,?>)service.resume("a")).get("status"));
        service.leaveGame(g.getGameId(),"a"); service.leaveGame(g.getGameId(),"a");
        assertEquals("none",((Map<?,?>)service.resume("a")).get("status"));
        assertDoesNotThrow(()->service.checkAvailable("a"));
    }
    @Test void naturalDeathClosesReconnectClockWithoutInventingAForfeit() {
        Game g=game("a","b","c"); service.disconnected("a");
        g.getPlayers().get("a").getResources().put(Resource.HEALTH,0);
        service.submitMoveToGame(move(g,"b","c"),()->{}); service.submitMoveToGame(move(g,"c","b"),()->{});
        assertTrue(g.getReconnectDeadlines().isEmpty()); assertTrue(g.getForfeits().isEmpty());
        assertFalse(g.isOver()); assertEquals(1,g.getTurn());
    }
    @Test void concurrentLeaveTimeoutAndLogoutFinalizeOnce() throws Exception {
        Game g=game("a","b"); time.now+=30000;
        var pool=Executors.newFixedThreadPool(3);
        try {
            var tasks=List.<Callable<Object>>of(()->{service.leaveGame(g.getGameId(),"a");return null;},
                ()->{service.expireDue();return null;},()->{service.logout("b");return null;});
            for(var f:pool.invokeAll(tasks)) { f.get(); }
            assertEquals(1,outcomes()); assertTrue(g.getWinner().isEmpty());
        } finally { pool.shutdownNow(); }
    }
}
