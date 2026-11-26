package com.gsc.bm;

import com.gsc.bm.model.game.Game;
import com.gsc.bm.repo.external.UserCredentialsRecord;
import com.gsc.bm.repo.external.UserCredentialsRepository;
import com.gsc.bm.service.catalog.LiveSet;
import com.gsc.bm.service.factories.GameFactoryService;
import com.gsc.bm.service.factories.PlayerFactoryService;
import com.gsc.bm.service.session.GameSessionService;
import com.gsc.bm.service.session.QueueService;
import com.gsc.bm.service.session.model.QueuedPlayer;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;

import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * SB-29 (R01 2.1, D190): the quick joins take an optional STOMP header {@code category}; the real factories deal the starters, so
 * the matches show the category the human chose. Real server, real STOMP client; nothing of the factories is stubbed.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Tag("context")
class QuickCategoryContextTest extends SqliteContextSupport {
    @LocalServerPort int port;
    @SpyBean UserCredentialsRepository users;
    @SpyBean GameFactoryService games;
    @SpyBean PlayerFactoryService players;
    @Autowired PasswordEncoder encoder;
    @Autowired GameSessionService sessions;
    @Autowired QueueService queues;
    @Autowired LiveSet live;
    @Autowired com.fasterxml.jackson.databind.ObjectMapper mapper;

    private String category(com.gsc.bm.model.game.Player player) {
        String character = player.getCharacter().getBindingName();
        return live.starters().stream().filter(d -> live.set().characterOf(d).equals(character))
                .map(live.set()::deckCategory).findFirst().orElseThrow(() -> new AssertionError("not a starter: " + character));
    }

    @Test void humanAndComputerOfQuick1vComShareTheChosenCategory() throws Exception {
        users.createIfAbsent(new UserCredentialsRecord("catSolo", null, encoder.encode("synthetic"), "USER"));
        var client = newClient();
        StompSession session = null;
        try {
            session = connect(client, "catSolo");
            BlockingQueue<byte[]> ready = new LinkedBlockingQueue<>();
            subscribe(session, "/user/queue/game/quick/1vCom/ready", ready);
            for (String chosen : live.starters().stream().map(live.set()::deckCategory).distinct().toArray(String[]::new)) {
                for (int i = 0; i < 6; i++) { // the draw is random: every one must be inside the category
                    join(session, "/app/game/quick/1vCom/join", "catSolo", chosen);
                    byte[] id = ready.poll(4, TimeUnit.SECONDS);
                    assertNotNull(id, chosen);
                    Game game = sessions.getGame(new String(id, StandardCharsets.UTF_8));
                    assertEquals(2, game.getPlayers().size());
                    for (var p : game.getPlayers().values()) assertEquals(chosen, category(p), p.getPlayerId());
                    sessions.leaveGame(game.getGameId(), "catSolo");
                }
            }
            verify(players, atLeastOnce()).craftRandomPlayer("catSolo", "avanzato");
            verify(players, atLeastOnce()).craftComPlayer("avanzato", com.gsc.bm.model.game.bot.ComLevel.FACILE);
        } finally { close(session); client.stop(); }
    }

    @Test void withoutHeaderTheFactoryIsAskedForAnyStarter() throws Exception {
        users.createIfAbsent(new UserCredentialsRecord("catNone", null, encoder.encode("synthetic"), "USER"));
        var client = newClient();
        StompSession session = null;
        try {
            session = connect(client, "catNone");
            BlockingQueue<byte[]> ready = new LinkedBlockingQueue<>();
            subscribe(session, "/user/queue/game/quick/1vCom/ready", ready);
            join(session, "/app/game/quick/1vCom/join", "catNone", null);
            byte[] id = ready.poll(4, TimeUnit.SECONDS);
            assertNotNull(id);
            // D190 (2): no category = any of the five starters, as before SB-29 (not «base»).
            verify(players).craftRandomPlayer("catNone", null);
            verify(players).craftComPlayer(null, com.gsc.bm.model.game.bot.ComLevel.FACILE);
            sessions.leaveGame(new String(id, StandardCharsets.UTF_8), "catNone");
            // An empty header is the same as none.
            join(session, "/app/game/quick/1vCom/join", "catNone", "");
            id = ready.poll(4, TimeUnit.SECONDS);
            assertNotNull(id);
            verify(players, times(2)).craftRandomPlayer("catNone", null);
            sessions.leaveGame(new String(id, StandardCharsets.UTF_8), "catNone");
        } finally { close(session); client.stop(); }
    }

    @Test void unknownCategoryIsRefusedOnTheErrorQueueAndNothingIsQueuedOrCreated() throws Exception {
        users.createIfAbsent(new UserCredentialsRecord("catBad", null, encoder.encode("synthetic"), "USER"));
        var client = newClient();
        StompSession session = null;
        try {
            session = connect(client, "catBad");
            BlockingQueue<byte[]> errors = new LinkedBlockingQueue<>(), ready = new LinkedBlockingQueue<>();
            subscribe(session, "/user/queue/game/error", errors);
            subscribe(session, "/user/queue/game/quick/1vCom/ready", ready);
            for (String bad : List.of("esperto", "Base", "AVANZATO", " base")) {
                for (String destination : List.of("/app/game/quick/1vCom/join", "/app/game/quick/1v1/join", "/app/game/quick/ffa/join")) {
                    join(session, destination, "catBad", bad);
                    byte[] message = errors.poll(4, TimeUnit.SECONDS);
                    assertNotNull(message, bad + " " + destination);
                    assertTrue(new String(message, StandardCharsets.UTF_8).contains(bad), bad);
                }
            }
            assertNull(ready.poll(200, TimeUnit.MILLISECONDS));
            verify(games, never()).craftQuick1vComGame(anyString(), any(), any());
            verify(games, never()).craftQuickMultiPlayerGame(any(), anyString());
            for (var queue : QueueService.GameQueue.values())
                assertTrue(queues.getUsersInQueue(queue).isEmpty(), queue.toString());
        } finally { close(session); client.stop(); }
    }

    @Test void queuedPlayerKeepsTheCategoryLeavesWithoutItAndTheFfaListDoesNotShowIt() throws Exception {
        users.createIfAbsent(new UserCredentialsRecord("catQueue", null, encoder.encode("synthetic"), "USER"));
        var client = newClient();
        StompSession session = null;
        try {
            session = connect(client, "catQueue");
            BlockingQueue<byte[]> joined = new LinkedBlockingQueue<>();
            subscribe(session, "/topic/game/quick/ffa/joined", joined);
            join(session, "/app/game/quick/ffa/join", "catQueue", "avanzato");
            byte[] list = joined.poll(4, TimeUnit.SECONDS);
            assertNotNull(list);
            var published = mapper.readTree(list);
            assertEquals(1, published.size());
            assertEquals("catQueue", published.get(0).path("playerId").asText());
            assertFalse(published.get(0).has("category"), "the public queue does not carry the category: " + published);
            List<QueuedPlayer> inQueue = queues.getUsersInQueue(QueueService.GameQueue.Q_FFA);
            assertEquals(1, inQueue.size());
            assertEquals("avanzato", inQueue.get(0).getCategory());
            // leaveAllQueues compares with a player rebuilt without the category (SessionLifecycleController does the same).
            queues.leaveAllQueues(new QueuedPlayer("catQueue", true));
            assertTrue(queues.getUsersInQueue(QueueService.GameQueue.Q_FFA).isEmpty());
        } finally { queues.leaveAllQueues(new QueuedPlayer("catQueue", true)); close(session); client.stop(); }
    }

    @Test void quick1v1WithOneBaseAndOneAdvancedGivesEachTheirCategory() throws Exception {
        users.createIfAbsent(new UserCredentialsRecord("catBase", null, encoder.encode("synthetic"), "USER"));
        users.createIfAbsent(new UserCredentialsRecord("catAdv", null, encoder.encode("synthetic"), "USER"));
        var client = newClient();
        StompSession base = null, advanced = null;
        try {
            base = connect(client, "catBase");
            advanced = connect(client, "catAdv");
            BlockingQueue<byte[]> baseReady = new LinkedBlockingQueue<>(), advancedReady = new LinkedBlockingQueue<>();
            subscribe(base, "/user/queue/game/quick/1v1/ready", baseReady);
            subscribe(advanced, "/user/queue/game/quick/1v1/ready", advancedReady);
            join(base, "/app/game/quick/1v1/join", "catBase", "base");
            join(advanced, "/app/game/quick/1v1/join", "catAdv", "avanzato");
            byte[] id = baseReady.poll(4, TimeUnit.SECONDS);
            assertNotNull(id);
            assertArrayEquals(id, advancedReady.poll(4, TimeUnit.SECONDS));
            Game game = sessions.getGame(new String(id, StandardCharsets.UTF_8));
            assertEquals("base", category(game.getPlayers().get("catBase")));
            assertEquals("avanzato", category(game.getPlayers().get("catAdv")));
            sessions.leaveGame(game.getGameId(), "catBase");
            sessions.leaveGame(game.getGameId(), "catAdv");
        } finally { close(base); close(advanced); client.stop(); }
    }

    private void join(StompSession session, String destination, String body, String category) {
        StompHeaders headers = new StompHeaders();
        headers.setDestination(destination);
        if (category != null) headers.set("category", category);
        session.send(headers, body.getBytes(StandardCharsets.UTF_8));
    }

    private StompFrameHandler collect(BlockingQueue<byte[]> queue) {
        return new StompFrameHandler() {
            public Type getPayloadType(StompHeaders headers) { return byte[].class; }
            public void handleFrame(StompHeaders headers, Object payload) { queue.add((byte[]) payload); }
        };
    }

    private void subscribe(StompSession session, String destination, BlockingQueue<byte[]> queue) throws Exception {
        StompHeaders headers = new StompHeaders();
        headers.setDestination(destination);
        headers.setReceipt("subscribed-" + java.util.UUID.randomUUID());
        var confirmed = new CountDownLatch(1);
        session.subscribe(headers, collect(queue)).addReceiptTask(confirmed::countDown);
        assertTrue(confirmed.await(4, TimeUnit.SECONDS), "Subscription not confirmed: " + destination);
    }

    private WebSocketStompClient newClient() {
        var container = javax.websocket.ContainerProvider.getWebSocketContainer();
        container.setDefaultMaxTextMessageBufferSize(1024 * 1024);
        var client = new WebSocketStompClient(new StandardWebSocketClient(container));
        var scheduler = new org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler(); // needed to track receipts
        scheduler.setDaemon(true); scheduler.initialize(); client.setTaskScheduler(scheduler);
        return client;
    }

    private StompSession connect(WebSocketStompClient client, String name) throws Exception {
        StompHeaders headers = new StompHeaders();
        headers.setLogin(name); headers.setPasscode("synthetic");
        return client.connect("ws://127.0.0.1:" + port + "/api/ws/v1/websocket", (org.springframework.web.socket.WebSocketHttpHeaders) null,
                headers, new StompSessionHandlerAdapter() {}).get(4, TimeUnit.SECONDS);
    }

    private void close(StompSession session) {
        try { if (session != null && session.isConnected()) { session.disconnect(); } }
        catch (org.springframework.messaging.MessageDeliveryException ignored) { /* transport already closed */ }
    }
}
