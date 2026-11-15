package com.gsc.bm;

import com.gsc.bm.repo.external.UserCredentialsRecord;
import com.gsc.bm.repo.external.UserCredentialsRepository;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;

import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.*;

import static org.junit.jupiter.api.Assertions.*;

/**
 * SB-16i, client step (D102): through the real protocol (STOMP over WebSocket, validator, engine) a move command may carry
 * {@code searchChoice}; with the live rules the engine refuses it as before, «no search choice with these rules», and the same
 * command without the field is accepted. The private view never shows the field.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Tag("context")
class SearchChoiceWireTest extends SqliteContextSupport {
    @LocalServerPort int port;
    @Autowired UserCredentialsRepository users;
    @Autowired PasswordEncoder encoder;
    @Autowired com.gsc.bm.service.session.GameSessionService games;
    @Autowired com.gsc.bm.service.factories.CardFactoryService cards;
    @Autowired com.gsc.bm.service.factories.DeckFactoryService decks;
    @Autowired com.fasterxml.jackson.databind.ObjectMapper mapper;

    private com.gsc.bm.model.game.Player wirePlayer(String id) {
        var character = new com.gsc.bm.model.cards.bruiser.character.BigBadBruiser();
        var p = new com.gsc.bm.model.game.Player(id, character, decks.craftBasicActionStarterCard(character),
                decks.craftCharacterBoundStarterCards(character), decks.craftLastResortStarterCard(character),
                decks.craftCharacterStarterDeck(character.getBindingName()));
        p.getCardsInHand().clear(); p.getCardsInHand().add(cards.craftCard("bruiser.SuperImpact"));
        return p;
    }

    private StompFrameHandler collect(BlockingQueue<byte[]> queue) {
        return new StompFrameHandler() {
            public Type getPayloadType(StompHeaders headers) { return byte[].class; }
            public void handleFrame(StompHeaders headers, Object payload) { queue.add((byte[]) payload); }
        };
    }

    @Test void withTheLiveRulesTheChoiceIsRefusedThroughTheProtocol() throws Exception {
        users.createIfAbsent(new UserCredentialsRecord("choiceAlice", null, encoder.encode("synthetic"), "USER"));
        var alice = wirePlayer("choiceAlice"); var bob = wirePlayer("choiceBob");
        var game = new com.gsc.bm.model.game.Game(java.util.List.of(alice, bob), "search-choice-wire", false);
        assertFalse(game.getRuleset().playground(), "a match of the live rules");
        String id = games.newGame(game);
        var client = newClient(); StompSession session = null;
        try {
            session = connect(client, "choiceAlice", "synthetic", new StompSessionHandlerAdapter() {});
            var errors = new LinkedBlockingQueue<byte[]>(); var accepted = new LinkedBlockingQueue<byte[]>(); var views = new LinkedBlockingQueue<byte[]>();
            subscribeConfirmed(session, "/user/queue/illegalMove", collect(errors));
            subscribeConfirmed(session, "/topic/game/" + id + "/move", collect(accepted));
            subscribeConfirmed(session, "/user/queue/game/" + id + "/view", collect(views));
            String card = alice.getCardsInHand().get(0).getName();
            var command = mapper.createObjectNode().put("playedCardName", card)
                    .put("playerId", "choiceAlice").put("targetId", "choiceBob").put("gameId", id);
            session.send("/app/game/" + id + "/move", mapper.writeValueAsBytes(command.deepCopy().put("searchChoice", "bruiser.SuperImpact")));
            byte[] refused = errors.poll(4, TimeUnit.SECONDS);
            assertNotNull(refused);
            assertEquals("no search choice with these rules", new String(refused, StandardCharsets.UTF_8));
            assertTrue(game.getPendingMoves().isEmpty());
            session.send("/app/game/" + id + "/move", mapper.writeValueAsBytes(command.deepCopy().put("searchChoice", 7)));
            refused = errors.poll(4, TimeUnit.SECONDS);
            assertNotNull(refused);
            assertEquals("Invalid search choice", new String(refused, StandardCharsets.UTF_8));
            assertTrue(game.getPendingMoves().isEmpty());
            session.send("/app/game/" + id + "/move", mapper.writeValueAsBytes(command));
            assertNotNull(accepted.poll(4, TimeUnit.SECONDS));
            assertEquals(1, game.getPendingMoves().size());
            session.send("/app/game/" + id + "/choiceAlice/view", new byte[0]);
            byte[] raw = views.poll(4, TimeUnit.SECONDS);
            assertNotNull(raw);
            var view = mapper.readTree(raw);
            assertEquals(card, view.path("pendingMove").path("playedCardName").asText());
            assertFalse(view.path("pendingMove").has("searchChoice"));
            assertFalse(view.path("players").path("choiceAlice").has("searchable"));
            assertFalse(view.path("players").path("choiceAlice").path("character").has("plays"));
            assertNull(errors.poll(100, TimeUnit.MILLISECONDS));
        } finally { close(session); client.stop(); games.leaveGame(id, "choiceAlice"); games.leaveGame(id, "choiceBob"); }
    }

    private WebSocketStompClient newClient() {
        var container = javax.websocket.ContainerProvider.getWebSocketContainer();
        container.setDefaultMaxTextMessageBufferSize(1024 * 1024);
        var client = new WebSocketStompClient(new StandardWebSocketClient(container));
        var scheduler = new org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler(); // needed to track receipts
        scheduler.setDaemon(true); scheduler.initialize(); client.setTaskScheduler(scheduler);
        return client;
    }

    private void subscribeConfirmed(StompSession session, String destination, StompFrameHandler handler) throws Exception {
        StompHeaders headers = new StompHeaders(); headers.setDestination(destination);
        headers.setReceipt("subscribed-" + java.util.UUID.randomUUID());
        var confirmed = new CountDownLatch(1);
        session.subscribe(headers, handler).addReceiptTask(confirmed::countDown);
        assertTrue(confirmed.await(4, TimeUnit.SECONDS), "Subscription not confirmed: " + destination);
    }

    private void close(StompSession session) {
        try { if (session != null && session.isConnected()) { session.disconnect(); } }
        catch (org.springframework.messaging.MessageDeliveryException ignored) { /* transport already closed */ }
    }

    private StompSession connect(WebSocketStompClient client, String name, String password, StompSessionHandler handler) throws Exception {
        StompHeaders headers = new StompHeaders(); headers.setLogin(name); headers.setPasscode(password);
        return client.connect("ws://127.0.0.1:" + port + "/api/ws/v1/websocket", (org.springframework.web.socket.WebSocketHttpHeaders) null, headers, handler).get(4, TimeUnit.SECONDS);
    }
}
