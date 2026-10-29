package com.gsc.bm.model.game;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.bruiser.MadeOfStone;
import com.gsc.bm.model.cards.com.tokens.BrokenBeerBottle;
import com.gsc.bm.service.session.*;
import com.gsc.bm.service.view.ViewExtractorService;
import org.junit.jupiter.api.Test;
import java.util.*;
import java.util.concurrent.*;
import static com.gsc.bm.model.game.GameFixtures.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RoundIsolationTest {
    @Test void publicationFailureDoesNotUndoCommittedRound() {
        var logs=mock(GameLoggingService.class); var service=service(logs);
        var game=duel(player("alice"),player("bob")); service.newGame(game);
        service.submitMoveToGame(move(game,"alice","last-resort","bob"),()->{});
        doThrow(new IllegalStateException("synthetic logger failure")).when(logs).log(any(),any(),any());
        assertDoesNotThrow(()->service.submitMoveToGame(move(game,"bob","last-resort","alice"),()->{ throw new IllegalStateException("synthetic transport failure"); }));
        assertEquals(1,game.getTurn()); assertTrue(game.getPendingMoves().isEmpty());
        assertEquals(85,game.getPlayers().get("alice").getResources().get(Resource.HEALTH));
        assertEquals(85,game.getPlayers().get("bob").getResources().get(Resource.HEALTH));
    }
    private static CountDownLatch entered, release;
    static class FaultCard extends AbstractCard {
        boolean fail = true;
        FaultCard() { setGuiName("fault"); setPriority(2); setCost(Map.of(Resource.VIOLENCE,5)); setCanTarget(Set.of(Card.CardTarget.SELF)); }
        public void applyOtherUnfathomableLogic(Game g,Move m) {}
        public List<String> applyEffectOnSelf(Character c) {
            c.gainResource(Resource.ALERTNESS,7);
            c.getTimers().add(new Timer("local", x -> x.gainResource(Resource.VIOLENCE,1),2));
            new BrokenBeerBottle().applyEffectOnSelf(c);
            if (entered != null) {
                entered.countDown();
                try { if (!release.await(3,TimeUnit.SECONDS)) { throw new IllegalStateException("test timeout"); } }
                catch (InterruptedException e) { Thread.currentThread().interrupt(); throw new IllegalStateException(e); }
            }
            if (fail) { throw new IllegalStateException("synthetic effect failure"); }
            return List.of();
        }
        public List<String> applyEffectOnTarget(Character c,Character t) { return null; }
    }
    private GameSessionServiceImpl service(GameLoggingService logs) {
        return new GameSessionServiceImpl(mock(ConnectionsService.class),logs,mock(ViewExtractorService.class));
    }
    private Move move(Game game,String who,String card,String target) { return new Move(card,who,target,game.getGameId(),null); }
    @Test void failureRestoresWholeGraphAndCanRetryWithoutPublishing() {
        var logs=mock(GameLoggingService.class); var service=service(logs);
        var alice=player("alice"); alice.getCardsInHand().add(new FaultCard());
        var game=duel(alice,player("bob")); service.newGame(game);
        service.submitMoveToGame(move(game,"bob","last-resort","alice"),()->fail("not ready"));
        clearInvocations(logs); int[] notifications={0};
        assertThrows(IllegalMoveException.class,()->service.submitMoveToGame(move(game,"alice","fault","SELF"),()->notifications[0]++));
        assertEquals(0,game.getTurn()); assertEquals(1,game.getPendingMoves().size());
        assertEquals("bob",game.getPendingMoves().get(0).getPlayerId());
        var restored=game.getPlayers().get("alice");
        assertEquals(25,restored.getResources().get(Resource.VIOLENCE)); assertEquals(20,restored.getResources().get(Resource.ALERTNESS));
        assertTrue(restored.getCharacter().getTimers().isEmpty()); assertTrue(restored.getCharacter().getStatuses().isEmpty());
        assertEquals(100,game.getPlayers().get("bob").getResources().get(Resource.HEALTH));
        assertEquals(0,notifications[0]); verifyNoInteractions(logs);
        ((FaultCard)game.getCardFromHand("alice","fault")).fail=false;
        service.submitMoveToGame(move(game,"alice","fault","SELF"),()->notifications[0]++);
        assertEquals(1,game.getTurn()); assertEquals(1,notifications[0]); assertTrue(game.getPendingMoves().isEmpty());
        assertEquals(20,game.getPlayers().get("alice").getResources().get(Resource.VIOLENCE));
        assertEquals(27,game.getPlayers().get("alice").getResources().get(Resource.ALERTNESS));
    }
    @Test void timerFailureRollsBackEarlierDamageCostsAndCountdown() {
        var service=service(mock(GameLoggingService.class)); var alice=player("alice"); var bob=player("bob");
        alice.getCardsInHand().add(named(new com.gsc.bm.model.cards.bruiser.SuperImpact(),"impact"));
        bob.getCharacter().getTimers().add(new Timer("failure", c -> { c.loseResource(Resource.ALERTNESS,9); throw new IllegalStateException("timer failure"); },1));
        var game=duel(alice,bob); service.newGame(game);
        service.submitMoveToGame(move(game,"bob","last-resort","alice"),()->{});
        assertThrows(IllegalMoveException.class,()->service.submitMoveToGame(move(game,"alice","impact","bob"),()->fail("not committed")));
        for(var p:game.getPlayers().values()) { assertEquals(100,p.getResources().get(Resource.HEALTH)); }
        assertEquals(25,game.getPlayers().get("alice").getResources().get(Resource.VIOLENCE));
        assertEquals(1,game.getPlayers().get("bob").getCharacter().getTimers().iterator().next().getTimer());
        assertEquals(1,game.getPendingMoves().size()); assertEquals(0,game.getTurn());
    }
    @Test void snapshotsWaitForResolutionAndOnlySeeRestoredState() throws Exception {
        var service=service(mock(GameLoggingService.class)); var alice=player("alice"); alice.getCardsInHand().add(new FaultCard());
        var game=duel(alice,player("bob")); service.newGame(game);
        service.submitMoveToGame(move(game,"bob","last-resort","alice"),()->{});
        entered=new CountDownLatch(1); release=new CountDownLatch(1); var pool=Executors.newFixedThreadPool(2);
        try {
            var submit=pool.submit(()->assertThrows(IllegalMoveException.class,()->service.submitMoveToGame(move(game,"alice","fault","SELF"),()->{})));
            assertTrue(entered.await(2,TimeUnit.SECONDS));
            var snapshot=pool.submit(()->service.snapshotGame(game.getGameId()));
            assertThrows(TimeoutException.class,()->snapshot.get(100,TimeUnit.MILLISECONDS));
            release.countDown(); submit.get(3,TimeUnit.SECONDS);
            var coherent=snapshot.get(3,TimeUnit.SECONDS);
            assertEquals(20,coherent.getPlayers().get("alice").getResources().get(Resource.ALERTNESS));
            assertEquals(1,coherent.getPendingMoves().size());
        } finally { release.countDown(); entered=null; release=null; pool.shutdownNow(); }
    }
    @Test void statesAreIndependentAcrossGamesAndRepeatedApplications() {
        var one=duel(player("one"),player("other")); var two=duel(player("two"),player("other"));
        var a=one.getPlayers().get("one").getCharacter(); var b=two.getPlayers().get("two").getCharacter();
        var card=new MadeOfStone(); card.applyEffectOnSelf(a); card.applyEffectOnSelf(b);
        a.getStatuses().get(0).aTurnIsPassed();
        assertEquals(2,a.getStatuses().get(0).getLastsForTurns()); assertEquals(3,b.getStatuses().get(0).getLastsForTurns());
        card.applyEffectOnSelf(a); assertNotSame(a.getStatuses().get(0),a.getStatuses().get(1));
        assertEquals(3,a.getStatuses().get(1).getLastsForTurns());
        a.getStatuses().clear(); b.getStatuses().clear(); var bottle=new BrokenBeerBottle();
        bottle.applyEffectOnSelf(a); bottle.applyEffectOnSelf(b); a.getStatuses().get(0).expended();
        assertNull(b.getStatuses().get(0).getLastsForTurns());
    }
}
