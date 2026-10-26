package com.gsc.bm;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.conf.ws.*;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.service.session.GameSessionService;
import org.junit.jupiter.api.Test;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.messaging.support.GenericMessage;
import java.util.Map;
import java.util.concurrent.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DestinationPolicyTest {
    @Test void previouslyAuthorizedFrameIsCheckedAgainBeforeHandlerAfterReconnect() {
        var sessions = new ActiveSessions(); sessions.claim("alice", "old");
        var interceptor = new AuthChannelInterceptorAdapter(mock(com.gsc.bm.service.session.AuthService.class), sessions, policy());
        var h = org.springframework.messaging.simp.stomp.StompHeaderAccessor.create(org.springframework.messaging.simp.stomp.StompCommand.SEND);
        h.setUser(() -> "alice"); h.setSessionId("old"); h.setDestination("/app/user/alice/account");
        var message = org.springframework.messaging.support.MessageBuilder.createMessage(new byte[0], h.getMessageHeaders());
        assertNotNull(interceptor.preSend(message, mock(org.springframework.messaging.MessageChannel.class)));
        sessions.disconnected(new SessionDisconnectEvent(this, new GenericMessage<>(new byte[0]), "old", org.springframework.web.socket.CloseStatus.NORMAL));
        sessions.claim("alice", "replacement");
        assertThrows(AccessDeniedException.class, () -> interceptor.beforeHandle(message, mock(org.springframework.messaging.MessageChannel.class), mock(org.springframework.messaging.MessageHandler.class)));
        assertTrue(sessions.owns("alice", "replacement"));
    }
    @Test void inboundRequiresAuthenticationEvenWithoutRestPreflight() {
        var auth = mock(com.gsc.bm.service.session.AuthService.class);
        var sessions = new ActiveSessions();
        var interceptor = new AuthChannelInterceptorAdapter(auth, sessions, policy());
        var headers = org.springframework.messaging.simp.stomp.StompHeaderAccessor.create(org.springframework.messaging.simp.stomp.StompCommand.SEND);
        headers.setSessionId("anonymous"); headers.setDestination("/app/user/alice/account");
        var message = org.springframework.messaging.support.MessageBuilder.createMessage(new byte[0], headers.getMessageHeaders());
        assertThrows(AccessDeniedException.class, () -> interceptor.preSend(message, mock(org.springframework.messaging.MessageChannel.class)));
    }
    private DestinationPolicy policy() {
        GameSessionService games = mock(GameSessionService.class);
        Game game = mock(Game.class);
        when(game.getPlayers()).thenReturn(Map.of("alice", mock(Player.class)));
        when(games.getGame("match")).thenReturn(game);
        when(games.getGame("missing")).thenThrow(new IllegalArgumentException());
        return new DestinationPolicy(games, new ObjectMapper());
    }
    @Test void accountAndQueueIdentityCannotBeSpoofed() {
        DestinationPolicy p = policy();
        assertDoesNotThrow(() -> p.check("alice", "/app/user/alice/account", false, ""));
        assertDoesNotThrow(() -> p.check("alice", "/app/user/alice/deck", false, "{}"));
        for (String path : new String[]{"account", "deck", "deck/delete"}) {
            assertThrows(AccessDeniedException.class, () -> p.check("alice", "/app/user/bob/" + path, false, "{}"));
        }
        assertThrows(AccessDeniedException.class, () -> p.check("alice", "/app/game/quick/1v1/join", false, "bob"));
        assertDoesNotThrow(() -> p.check("alice", "/app/game/quick/1v1/join", false, "alice"));
        assertThrows(AccessDeniedException.class, () -> p.check("alice", "/app/game/open/1vCom/join/bob/deck", false, ""));
        assertDoesNotThrow(() -> p.check("alice", "/app/game/quick/ffa/start", false, ""));
    }
    @Test void onlyParticipantsCanReadActOrLeaveAndMoveIdentityMustMatch() {
        DestinationPolicy p = policy();
        assertDoesNotThrow(() -> p.check("alice", "/app/game/match/alice/view", false, ""));
        assertDoesNotThrow(() -> p.check("alice", "/app/game/match/move", false, "{\"playerId\":\"alice\",\"gameId\":\"match\"}"));
        for (String path : new String[]{"/app/game/match/bob/view", "/app/game/match/bob/leave"}) {
            assertThrows(AccessDeniedException.class, () -> p.check("bob", path, false, ""));
        }
        for (String body : new String[]{"{}", "invalid", "{\"playerId\":\"bob\",\"gameId\":\"match\"}", "{\"playerId\":\"alice\",\"gameId\":\"other\"}"}) {
            assertThrows(AccessDeniedException.class, () -> p.check("alice", "/app/game/match/move", false, body));
        }
        assertThrows(AccessDeniedException.class, () -> p.check("alice", "/app/game/missing/alice/view", false, ""));
    }
    @Test void subscriptionsAndBrokerWritesAreDeniedByDefault() {
        DestinationPolicy p = policy();
        assertDoesNotThrow(() -> p.check("alice", "/user/queue/account/data", true, ""));
        assertDoesNotThrow(() -> p.check("alice", "/user/queue/game/quick/1v1/ready", true, ""));
        assertThrows(AccessDeniedException.class, () -> p.check("alice", "/topic/game/quick/1v1/ready", true, ""));
        assertDoesNotThrow(() -> p.check("alice", "/user/queue/game/quick/ffa/ready", true, ""));
        assertThrows(AccessDeniedException.class, () -> p.check("alice", "/topic/game/quick/ffa/ready", true, ""));
        assertDoesNotThrow(() -> p.check("alice", "/topic/game/match/update", true, ""));
        assertThrows(AccessDeniedException.class, () -> p.check("bob", "/topic/game/match/update", true, ""));
        for (String path : new String[]{"/topic/**", "/user/alice/account/data", "/queue/account/data-user123", "/user/queue/game/missing/view"}) {
            assertThrows(AccessDeniedException.class, () -> p.check("alice", path, true, ""));
        }
        assertThrows(AccessDeniedException.class, () -> p.check("alice", "/topic/connections/users", false, ""));
        assertThrows(AccessDeniedException.class, () -> p.check(null, "/app/user/alice/account", false, ""));
    }
    @Test void simultaneousClaimsHaveOneWinnerAndStaleDisconnectCannotReleaseReplacement() throws Exception {
        ActiveSessions sessions = new ActiveSessions();
        var pool = Executors.newFixedThreadPool(2);
        CountDownLatch start = new CountDownLatch(1);
        try {
            Callable<Boolean> claim = () -> { start.await(); try { sessions.claim("alice", Thread.currentThread().getName()); return true; } catch (AccessDeniedException e) { return false; } };
            Future<Boolean> a = pool.submit(claim), b = pool.submit(claim); start.countDown();
            assertNotEquals(a.get(2, TimeUnit.SECONDS), b.get(2, TimeUnit.SECONDS));
        } finally { pool.shutdownNow(); }
        ActiveSessions fresh = new ActiveSessions(); fresh.claim("alice", "old");
        fresh.disconnected(new SessionDisconnectEvent(this, new GenericMessage<>(new byte[0]), "old", org.springframework.web.socket.CloseStatus.NORMAL));
        fresh.claim("alice", "new");
        fresh.disconnected(new SessionDisconnectEvent(this, new GenericMessage<>(new byte[0]), "old", org.springframework.web.socket.CloseStatus.NORMAL));
        assertTrue(fresh.owns("alice", "new"));
    }
}
