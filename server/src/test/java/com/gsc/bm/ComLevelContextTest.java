package com.gsc.bm;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.bot.BotPlayer;
import com.gsc.bm.model.game.bot.ComLevel;
import com.gsc.bm.repo.external.*;
import com.gsc.bm.service.catalog.LiveSet;
import com.gsc.bm.service.factories.GameFactoryService;
import com.gsc.bm.service.factories.PlayerFactoryService;
import com.gsc.bm.service.session.GameSessionService;
import com.gsc.bm.service.session.QueueService;
import com.gsc.bm.service.session.model.QueuedPlayer;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;

import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
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
 * SB-30a B2 (R01 and R03 2.2, D203 (1)(2)): the STOMP header {@code level} of the quick 1vCom and open 1vCom joins. Missing or
 * empty: Facile; FACILE or NORMALE: that level; any other value, reserved levels included: refused on {@code /user/queue/game/error}
 * before anything is queued, read or created. The computers added to the FFA play at Normale. The INITIAL event of the archive
 * records the level. Real server, real STOMP client, real factories.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Tag("context")
class ComLevelContextTest extends SqliteContextSupport {
    @LocalServerPort int port;
    @Autowired UserCredentialsRepository users;
    @SpyBean UserDecksRepository decks;
    @SpyBean GameFactoryService games;
    @SpyBean PlayerFactoryService players;
    @Autowired PasswordEncoder encoder;
    @Autowired GameSessionService sessions;
    @Autowired QueueService queues;
    @Autowired LiveSet live;
    @Autowired ObjectMapper mapper;
    @Autowired @Qualifier("applicationJdbc") JdbcTemplate jdbc;

    static final String QUICK = "/app/game/quick/1vCom/join", QUICK_READY = "/user/queue/game/quick/1vCom/ready",
            OPEN_READY = "/user/queue/game/open/1vCom/ready";

    @Test void quick1vComPlaysAtTheLevelOfTheHeaderAndFacileWithoutIt() throws Exception {
        users.createIfAbsent(new UserCredentialsRecord("lvQuick", null, encoder.encode("synthetic"), "USER"));
        var client = newClient();
        StompSession session = null;
        try {
            session = connect(client, "lvQuick");
            BlockingQueue<byte[]> ready = new LinkedBlockingQueue<>();
            subscribe(session, QUICK_READY, ready);
            for (String[] c : new String[][]{{null, "FACILE"}, {"", "FACILE"}, {"FACILE", "FACILE"}, {"NORMALE", "NORMALE"}}) {
                join(session, QUICK, "lvQuick", c[0]);
                byte[] id = ready.poll(4, TimeUnit.SECONDS);
                assertNotNull(id, c[0]);
                Game game = sessions.getGame(new String(id, StandardCharsets.UTF_8));
                assertComputerAt(game, ComLevel.valueOf(c[1]), c[0]);
                sessions.leaveGame(game.getGameId(), "lvQuick");
            }
            verify(games, times(3)).craftQuick1vComGame("lvQuick", null, ComLevel.FACILE);
            verify(games).craftQuick1vComGame("lvQuick", null, ComLevel.NORMALE);
        } finally { close(session); client.stop(); }
    }

    @Test void open1vComPlaysAtTheLevelOfTheHeaderAndFacileWithoutIt() throws Exception {
        String user = "lvOpen";
        users.createIfAbsent(new UserCredentialsRecord(user, null, encoder.encode("synthetic"), "USER"));
        saveStarter(user, "lv-deck");
        var client = newClient();
        StompSession session = null;
        try {
            session = connect(client, user);
            BlockingQueue<byte[]> ready = new LinkedBlockingQueue<>();
            subscribe(session, OPEN_READY, ready);
            for (String[] c : new String[][]{{null, "FACILE"}, {"FACILE", "FACILE"}, {"NORMALE", "NORMALE"}}) {
                join(session, "/app/game/open/1vCom/join/" + user + "/lv-deck", user, c[0]);
                byte[] id = ready.poll(4, TimeUnit.SECONDS);
                assertNotNull(id, c[0]);
                Game game = sessions.getGame(new String(id, StandardCharsets.UTF_8));
                assertComputerAt(game, ComLevel.valueOf(c[1]), c[0]);
                sessions.leaveGame(game.getGameId(), user);
            }
            verify(games, times(2)).craftOpen1vComGame(user, "lv-deck", ComLevel.FACILE);
            verify(games).craftOpen1vComGame(user, "lv-deck", ComLevel.NORMALE);
        } finally { close(session); client.stop(); }
    }

    @Test void anUnknownLevelIsRefusedOnTheErrorQueueAndNothingIsQueuedReadOrCreated() throws Exception {
        String user = "lvBad";
        users.createIfAbsent(new UserCredentialsRecord(user, null, encoder.encode("synthetic"), "USER"));
        saveStarter(user, "lv-bad-deck");
        var client = newClient();
        StompSession session = null;
        try {
            session = connect(client, user);
            BlockingQueue<byte[]> errors = new LinkedBlockingQueue<>(), ready = new LinkedBlockingQueue<>(),
                    openErrors = new LinkedBlockingQueue<>();
            subscribe(session, "/user/queue/game/error", errors);
            subscribe(session, "/user/queue/game/open/1vCom/error", openErrors);
            subscribe(session, QUICK_READY, ready);
            subscribe(session, OPEN_READY, ready);
            clearInvocations(decks);
            for (String bad : List.of("DIFFICILE", "MAESTRO", "facile", "Normale", " NORMALE", "esperto")) {
                for (String destination : List.of(QUICK, "/app/game/open/1vCom/join/" + user + "/lv-bad-deck")) {
                    join(session, destination, user, bad);
                    byte[] message = errors.poll(4, TimeUnit.SECONDS);
                    assertNotNull(message, bad + " " + destination);
                    String text = new String(message, StandardCharsets.UTF_8);
                    assertTrue(text.contains("Livello sconosciuto: " + bad) && text.contains("FACILE, NORMALE"), text);
                }
            }
            assertNull(ready.poll(200, TimeUnit.MILLISECONDS));
            assertNull(openErrors.poll(50, TimeUnit.MILLISECONDS), "the level is refused before the deck, on the game error queue");
            verify(games, never()).craftQuick1vComGame(anyString(), any(), any());
            verify(games, never()).craftOpen1vComGame(anyString(), anyString(), any());
            verify(players, never()).craftComPlayer(any(), any());
            verify(decks, never()).findById(any());
            for (var queue : QueueService.GameQueue.values())
                assertTrue(queues.getUsersInQueue(queue).isEmpty(), queue.toString());
        } finally { close(session); client.stop(); }
    }

    @Test void ffaComputersPlayAtNormaleAndTheArchiveRecordsTheLevels() throws Exception {
        users.createIfAbsent(new UserCredentialsRecord("lvFfa", null, encoder.encode("synthetic"), "USER"));
        var client = newClient();
        StompSession session = null;
        try {
            session = connect(client, "lvFfa");
            BlockingQueue<byte[]> ready = new LinkedBlockingQueue<>(), joined = new LinkedBlockingQueue<>();
            subscribe(session, "/user/queue/game/quick/ffa/ready", ready);
            subscribe(session, "/topic/game/quick/ffa/joined", joined);
            join(session, "/app/game/quick/ffa/join", "lvFfa", null);
            assertNotNull(joined.poll(4, TimeUnit.SECONDS));
            // A level header on the computer join of the FFA is not read: the FFA computers are Normale (D203 (1)).
            join(session, "/app/game/quick/ffa/join/com", "", "FACILE");
            assertNotNull(joined.poll(4, TimeUnit.SECONDS));
            join(session, "/app/game/quick/ffa/join/com", "", null);
            assertNotNull(joined.poll(4, TimeUnit.SECONDS));
            join(session, "/app/game/quick/ffa/start", "", null);
            byte[] id = ready.poll(4, TimeUnit.SECONDS);
            assertNotNull(id);
            Game game = sessions.getGame(new String(id, StandardCharsets.UTF_8));
            List<BotPlayer> computers = computers(game);
            assertEquals(2, computers.size());
            for (BotPlayer bot : computers) assertEquals(ComLevel.NORMALE, bot.level(), bot.getPlayerId());
            verify(players, times(2)).craftComPlayer(null, ComLevel.NORMALE);

            var initial = mapper.readTree(new MatchEventRepository(jdbc).read(game.getGameId()).get(0).getJson());
            var recorded = initial.path("data").path("configuration").path("computers");
            assertEquals(2, recorded.size(), recorded.toString());
            for (int i = 0; i < 2; i++) {
                assertEquals(computers.get(i).getPlayerId(), recorded.get(i).path("playerId").asText());
                assertEquals("NORMALE", recorded.get(i).path("level").asText());
                assertEquals(computers.get(i).policyName(), recorded.get(i).path("policy").asText());
                assertTrue(recorded.get(i).path("policy").asText().startsWith("LethalAwarePolicy(SoughtHitPolicy(ALWAYS,"));
            }
            assertEquals(computers.get(0).policyName(), initial.path("data").path("configuration").path("botPolicy").asText());
            sessions.leaveGame(game.getGameId(), "lvFfa");
        } finally { queues.leaveAllQueues(new QueuedPlayer("lvFfa", true)); close(session); client.stop(); }
    }

    private void assertComputerAt(Game game, ComLevel level, String header) throws Exception {
        List<BotPlayer> computers = computers(game);
        assertEquals(1, computers.size(), header);
        BotPlayer bot = computers.get(0);
        assertEquals(level, bot.level(), header);
        assertTrue(bot.getPlayerId().startsWith("ComPlayer_"), bot.getPlayerId());
        assertEquals(level == ComLevel.FACILE ? "RandomPolicy" : "LethalAwarePolicy", bot.policyName().replaceAll("\\(.*", ""), header);
        var initial = mapper.readTree(new MatchEventRepository(jdbc).read(game.getGameId()).get(0).getJson());
        var recorded = initial.path("data").path("configuration").path("computers");
        assertEquals(1, recorded.size());
        assertEquals(bot.getPlayerId(), recorded.get(0).path("playerId").asText());
        assertEquals(level.name(), recorded.get(0).path("level").asText());
        assertEquals(bot.policyName(), recorded.get(0).path("policy").asText());
    }

    private static List<BotPlayer> computers(Game game) {
        List<BotPlayer> out = new ArrayList<>();
        for (Player p : game.getPlayers().values()) if (p instanceof BotPlayer) out.add((BotPlayer) p);
        return out;
    }

    /** A saved deck: the first starter of the live set, as it is (R02). */
    private void saveStarter(String user, String id) {
        var set = live.set();
        String starter = live.starters().get(0);
        decks.save(new UserDecksRecord(user, id, new UserDecksRecord.UserStoredDeck(set.characterOf(starter), set.basicOf(starter),
                set.lastResortOf(starter), set.boundOf(starter), set.regularOf(starter))));
    }

    private void join(StompSession session, String destination, String body, String level) {
        StompHeaders headers = new StompHeaders();
        headers.setDestination(destination);
        if (level != null) headers.set(ComLevel.HEADER, level);
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
