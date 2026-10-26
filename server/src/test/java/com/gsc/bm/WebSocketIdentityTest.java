package com.gsc.bm;

import com.gsc.bm.repo.external.*;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import java.lang.reflect.Type;
import java.nio.file.*;
import java.util.concurrent.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Tag("context")
class WebSocketIdentityTest extends SqliteContextSupport {
    @LocalServerPort int port;
    @org.springframework.boot.test.mock.mockito.SpyBean UserCredentialsRepository users;
    @Autowired PasswordEncoder encoder;
    @Autowired org.springframework.boot.test.web.client.TestRestTemplate rest;
    @Autowired com.gsc.bm.service.session.GameSessionService games;
    @Autowired com.gsc.bm.service.factories.CardFactoryService cards;
    @Autowired com.gsc.bm.service.factories.DeckFactoryService decks;
    @Autowired com.gsc.bm.service.view.ViewExtractorService views;
    @org.springframework.boot.test.mock.mockito.SpyBean com.gsc.bm.service.factories.GameFactoryService gameFactory;
    @Autowired com.fasterxml.jackson.databind.ObjectMapper mapper;
    private com.gsc.bm.model.game.Player wirePlayer(String id) {
        var character = new com.gsc.bm.model.cards.bruiser.character.BigBadBruiser();
        var p = new com.gsc.bm.model.game.Player(id,character,decks.craftBasicActionStarterCard(character),
                decks.craftCharacterBoundStarterCards(character),decks.craftLastResortStarterCard(character),decks.craftCharacterStarterDeck(character.getBindingName()));
        p.getCardsInHand().clear(); p.getCardsInHand().add(cards.craftCard("bruiser.SuperImpact"));
        return p;
    }
    private StompFrameHandler collect(BlockingQueue<byte[]> queue) {
        return new StompFrameHandler() {
            public Type getPayloadType(StompHeaders headers) { return byte[].class; }
            public void handleFrame(StompHeaders headers, Object payload) { queue.add((byte[])payload); }
        };
    }
    @Test void quickJoinReadyAndFirstRoundAgainstRealBot() throws Exception {
        users.createIfAbsent(new UserCredentialsRecord("roundHuman",null,encoder.encode("synthetic"),"USER"));
        users.createIfAbsent(new UserCredentialsRecord("roundObserver",null,encoder.encode("synthetic"),"USER"));
        var human = wirePlayer("roundHuman");
        human.getDeck().clear(); human.getDeck().push(cards.craftCard("com.Grab"));
        var character = new com.gsc.bm.model.cards.bruiser.character.BigBadBruiser();
        var bot = new com.gsc.bm.model.game.ComPlayer(character,decks.craftBasicActionStarterCard(character),
                decks.craftCharacterBoundStarterCards(character),decks.craftLastResortStarterCard(character),java.util.List.of());
        bot.getCardsInHand().clear(); bot.getCardsInHand().add(cards.craftCard("com.last.Struggle"));
        bot.getDeck().push(cards.craftCard("bruiser.SuperImpact"));
        var game = new com.gsc.bm.model.game.Game(java.util.List.of(human,bot),"quick1vCom",false);
        org.mockito.Mockito.doReturn(game).when(gameFactory).craftQuick1vComGame("roundHuman");
        var client = newClient(); StompSession session = null, observer = null;
        boolean joined = false;
        try {
            session = connect(client,"roundHuman","synthetic",new StompSessionHandlerAdapter() {});
            observer = connect(client,"roundObserver","synthetic",new StompSessionHandlerAdapter() {});
            var ready = new LinkedBlockingQueue<byte[]>(); var others = new LinkedBlockingQueue<byte[]>();
            session.subscribe("/user/queue/game/quick/1vCom/ready",collect(ready));
            observer.subscribe("/user/queue/game/quick/1vCom/ready",collect(others));
            session.send("/app/game/quick/1vCom/join","roundHuman".getBytes(java.nio.charset.StandardCharsets.UTF_8));
            var reply = ready.poll(4,TimeUnit.SECONDS); assertNotNull(reply); joined = true;
            String id = new String(reply,java.nio.charset.StandardCharsets.UTF_8);
            assertEquals(game.getGameId(),id); assertEquals(2,games.getGame(id).getPlayers().size());
            assertNull(others.poll(200,TimeUnit.MILLISECONDS));
            org.mockito.Mockito.verify(gameFactory,org.mockito.Mockito.times(1)).craftQuick1vComGame("roundHuman");
            var updates = new LinkedBlockingQueue<byte[]>(); var privateViews = new LinkedBlockingQueue<byte[]>(); var errors = new LinkedBlockingQueue<byte[]>();
            session.subscribe("/topic/game/"+id+"/update",collect(updates));
            session.subscribe("/user/queue/game/"+id+"/view",collect(privateViews));
            session.subscribe("/user/queue/illegalMove",collect(errors));
            var command = mapper.createObjectNode().put("playedCardName",human.getCardsInHand().get(0).getName())
                    .put("playerId","roundHuman").put("targetId",bot.getPlayerId()).put("gameId",id);
            session.send("/app/game/"+id+"/move",mapper.writeValueAsBytes(command.deepCopy().putNull("targetId")));
            assertNotNull(errors.poll(4,TimeUnit.SECONDS)); assertEquals(0,game.getTurn()); assertTrue(game.getPendingMoves().isEmpty());
            session.send("/app/game/"+id+"/move",mapper.writeValueAsBytes(command));
            assertNotNull(updates.poll(4,TimeUnit.SECONDS));
            session.send("/app/game/"+id+"/roundHuman/view",new byte[0]);
            var viewBytes = privateViews.poll(4,TimeUnit.SECONDS); assertNotNull(viewBytes);
            var view = mapper.readTree(viewBytes);
            assertEquals(1,game.getTurn()); assertEquals(2,game.getResolvedMoves().size());
            assertEquals(1,game.getResolvedMoves().stream().filter(m -> m.getPlayerId().equals(bot.getPlayerId())).count());
            assertEquals(90,human.getResources().get(com.gsc.bm.model.Resource.HEALTH));
            assertEquals(0,human.getResources().get(com.gsc.bm.model.Resource.VIOLENCE));
            assertEquals(55,bot.getResources().get(com.gsc.bm.model.Resource.HEALTH));
            assertEquals(cards.craftCard("com.Grab").getName(),view.path("players").path("roundHuman").path("cardsInHand").get(0).path("name").asText());
            assertEquals(0,view.path("players").path("roundHuman").path("deck").asInt());
            assertEquals(1,game.getPendingMoves().size()); // bot has selected exactly one move for the next turn
            assertEquals(bot.getPlayerId(),game.getPendingMoves().get(0).getPlayerId());
            assertNull(ready.poll(100,TimeUnit.MILLISECONDS)); assertNull(others.poll(100,TimeUnit.MILLISECONDS));
        } finally {
            org.mockito.Mockito.reset(gameFactory); close(session); close(observer); client.stop();
            if (joined) { games.leaveGame(game.getGameId(),"roundHuman"); }
        }
    }
    @Test void privateGameViewValidMoveAndRejectedCommandsPreserveState() throws Exception {
        users.createIfAbsent(new UserCredentialsRecord("wireAlice",null,encoder.encode("synthetic"),"USER"));
        users.createIfAbsent(new UserCredentialsRecord("wireEve",null,encoder.encode("synthetic"),"USER"));
        var alice = wirePlayer("wireAlice"); var bob = wirePlayer("wireBob");
        var game = new com.gsc.bm.model.game.Game(java.util.List.of(alice,bob),"wire-fixture",false);
        String id = games.newGame(game);
        var client = newClient(); StompSession session = null, stranger = null;
        try {
            var transportErrors = new LinkedBlockingQueue<byte[]>();
            session = connect(client,"wireAlice","synthetic",new StompSessionHandlerAdapter() {
                public void handleFrame(StompHeaders h,Object payload) { transportErrors.add(new byte[0]); }
                public void handleTransportError(StompSession s,Throwable error) { transportErrors.add(new byte[0]); }
            });
            var replies = new LinkedBlockingQueue<byte[]>(); var errors = new LinkedBlockingQueue<byte[]>(); var accepted = new LinkedBlockingQueue<byte[]>();
            session.subscribe("/user/queue/game/"+id+"/view",collect(replies));
            session.subscribe("/user/queue/illegalMove",collect(errors));
            session.subscribe("/topic/game/"+id+"/move",collect(accepted));
            session.send("/app/game/"+id+"/wireAlice/view",new byte[0]);
            var raw = replies.poll(4,TimeUnit.SECONDS); assertNotNull(raw);
            var view = mapper.readTree(raw); var players = view.path("players");
            assertTrue(players.path("wireAlice").path("cardsInHand").isArray());
            assertTrue(players.path("wireBob").path("cardsInHand").isInt());
            assertTrue(players.path("wireAlice").path("deck").isInt());
            assertFalse(players.path("wireAlice").path("character").path("dead").asBoolean());
            assertTrue(players.path("wireAlice").path("character").has("dead"));
            bob.getResources().put(com.gsc.bm.model.Resource.HEALTH,0);
            assertTrue(mapper.valueToTree(views.extractViewFor(game,"wireAlice")).path("players").path("wireBob").path("character").path("dead").asBoolean());
            bob.getResources().put(com.gsc.bm.model.Resource.HEALTH,100);
            var command = mapper.createObjectNode().put("playedCardName",alice.getCardsInHand().get(0).getName())
                    .put("playerId","wireAlice").put("targetId","wireBob").put("gameId",id);
            var invalid = command.deepCopy().putNull("targetId");
            session.send("/app/game/"+id+"/move",mapper.writeValueAsBytes(invalid));
            assertNotNull(errors.poll(4,TimeUnit.SECONDS)); assertTrue(game.getPendingMoves().isEmpty());
            session.send("/app/game/"+id+"/move",mapper.writeValueAsBytes(command));
            assertNotNull(accepted.poll(4,TimeUnit.SECONDS)); assertEquals(1,game.getPendingMoves().size());
            assertEquals(100,alice.getResources().get(com.gsc.bm.model.Resource.HEALTH));
            assertEquals(25,alice.getResources().get(com.gsc.bm.model.Resource.VIOLENCE));
            session.send("/app/game/"+id+"/move",mapper.writeValueAsBytes(command));
            assertNotNull(errors.poll(4,TimeUnit.SECONDS)); assertEquals(1,game.getPendingMoves().size());
            assertEquals(0,game.getTurn());
            var denied = new LinkedBlockingQueue<byte[]>();
            stranger = connect(client,"wireEve","synthetic",new StompSessionHandlerAdapter() {
                public void handleFrame(StompHeaders h,Object p) { denied.add(new byte[0]); }
                public void handleTransportError(StompSession s,Throwable e) { denied.add(new byte[0]); }
            });
            stranger.subscribe("/user/queue/game/"+id+"/view",collect(new LinkedBlockingQueue<>()));
            assertNotNull(denied.poll(4,TimeUnit.SECONDS));
            command.put("gameId","wrong"); session.send("/app/game/"+id+"/move",mapper.writeValueAsBytes(command));
            assertNotNull(transportErrors.poll(4,TimeUnit.SECONDS)); assertEquals(1,game.getPendingMoves().size());
        } finally { close(session); close(stranger); client.stop(); games.leaveGame(id,"wireAlice"); games.leaveGame(id,"wireBob"); }
    }
    @Test void databaseFailureReturnsPrivateGenericError() throws Exception {
        users.createIfAbsent(new UserCredentialsRecord("profileFailure", null, encoder.encode("synthetic"), "USER"));
        var client = newClient(); StompSession session = null;
        try {
            session = connect(client, "profileFailure", "synthetic", new StompSessionHandlerAdapter() {});
            org.mockito.Mockito.doThrow(new org.springframework.dao.DataAccessResourceFailureException("private database details"))
                    .when(users).findById("profileFailure");
            BlockingQueue<byte[]> errors = new LinkedBlockingQueue<>();
            session.subscribe("/user/queue/account/error", new StompFrameHandler() {
                public Type getPayloadType(StompHeaders h) { return byte[].class; }
                public void handleFrame(StompHeaders h, Object payload) { errors.add((byte[]) payload); }
            });
            session.send("/app/user/profileFailure/account", new byte[0]);
            var error = errors.poll(4, TimeUnit.SECONDS); assertNotNull(error);
            assertEquals("Account data unavailable", new String(error, java.nio.charset.StandardCharsets.UTF_8));
        } finally { org.mockito.Mockito.reset(users); close(session); client.stop(); }
    }
    @Test void anonymousHttpCannotReadLogs() {
        assertEquals(401, rest.getForEntity("/api/rest/v1/logs/back/games/drain", String.class).getStatusCodeValue());
        assertEquals(401, rest.getForEntity("/api/rest/v1/logs/client/web/qty", String.class).getStatusCodeValue());
    }
    @Test void maliciousSendsAreRejectedOnRealTransport() throws Exception {
        WebSocketStompClient client = newClient();
        try {
            int i = 0;
            for (String destination : new String[]{"/app/user/socketAlice/account", "/app/user/socketAlice/deck/delete", "/topic/connections/users", "/app/game/quick/1v1/join"}) {
                String user = "intruder" + i++;
                users.createIfAbsent(new UserCredentialsRecord(user, null, encoder.encode("synthetic"), "USER"));
                BlockingQueue<String> errors = new LinkedBlockingQueue<>();
                StompSession session = connect(client, user, "synthetic", new StompSessionHandlerAdapter() {
                    public void handleFrame(StompHeaders headers, Object payload) { errors.add("denied"); }
                    public void handleTransportError(StompSession s, Throwable ex) { errors.add("closed"); }
                });
                try {
                    session.send(destination, "socketAlice".getBytes(java.nio.charset.StandardCharsets.UTF_8));
                    assertNotNull(errors.poll(4, TimeUnit.SECONDS), destination);
                } finally { close(session); }
            }
        } finally { client.stop(); }
    }
    private WebSocketStompClient newClient() {
        var container = javax.websocket.ContainerProvider.getWebSocketContainer();
        container.setDefaultMaxTextMessageBufferSize(1024 * 1024);
        return new WebSocketStompClient(new StandardWebSocketClient(container));
    }
    private void close(StompSession session) {
        try { if (session != null && session.isConnected()) { session.disconnect(); } }
        catch (org.springframework.messaging.MessageDeliveryException ignored) { /* transport already closed */ }
    }
    private StompSession connect(WebSocketStompClient client, String name, String password, StompSessionHandler handler) throws Exception {
        StompHeaders headers = new StompHeaders(); headers.setLogin(name); headers.setPasscode(password);
        return client.connect("ws://127.0.0.1:" + port + "/api/ws/v1/websocket", (org.springframework.web.socket.WebSocketHttpHeaders) null, headers, handler).get(4, TimeUnit.SECONDS);
    }
    @Test void directConnectPrivateReplyDuplicateRejectionAndReconnect() throws Exception {
        users.createIfAbsent(new UserCredentialsRecord("socketAlice", null, encoder.encode("synthetic"), "USER"));
        users.createIfAbsent(new UserCredentialsRecord("socketBob", null, encoder.encode("synthetic"), "USER"));
        WebSocketStompClient client = newClient();
        StompSession alice = null, bob = null;
        try {
            alice = connect(client, "socketAlice", "synthetic", new StompSessionHandlerAdapter() {});
            assertThrows(Exception.class, () -> connect(client, "socketAlice", "synthetic", new StompSessionHandlerAdapter() {}));
            assertThrows(Exception.class, () -> connect(client, "socketBob", "wrong", new StompSessionHandlerAdapter() {}));
            BlockingQueue<byte[]> privateReply = new LinkedBlockingQueue<>();
            alice.subscribe("/user/queue/account/data", new StompFrameHandler() {
                public Type getPayloadType(StompHeaders headers) { return byte[].class; }
                public void handleFrame(StompHeaders headers, Object payload) { privateReply.add((byte[]) payload); }
            });
            alice.send("/app/user/socketAlice/account", new byte[0]);
            byte[] reply = privateReply.poll(4, TimeUnit.SECONDS);
            assertNotNull(reply); assertTrue(new String(reply, java.nio.charset.StandardCharsets.UTF_8).contains("socketAlice"));
            BlockingQueue<String> errors = new LinkedBlockingQueue<>();
            bob = connect(client, "socketBob", "synthetic", new StompSessionHandlerAdapter() {
                public void handleFrame(StompHeaders headers, Object payload) { errors.add("denied"); }
                public void handleTransportError(StompSession session, Throwable ex) { errors.add("closed"); }
            });
            bob.subscribe("/user/socketAlice/account/data", new StompFrameHandler() {
                public Type getPayloadType(StompHeaders headers) { return byte[].class; }
                public void handleFrame(StompHeaders headers, Object payload) { fail("Private data leaked"); }
            });
            assertNotNull(errors.poll(4, TimeUnit.SECONDS));
            alice.disconnect(); alice = null;
            // Disconnect event can follow transport close asynchronously; bounded retry.
            for (int i = 0; i < 20 && alice == null; i++) {
                try { alice = connect(client, "socketAlice", "synthetic", new StompSessionHandlerAdapter() {}); }
                catch (Exception e) { Thread.sleep(50); }
            }
            assertNotNull(alice);
        } finally {
            close(alice);
            close(bob);
            client.stop();
        }
    }
    @Test void cliAuthenticatesReadsCatalogAndResolvesFixtureRound() throws Exception {
        users.createIfAbsent(new com.gsc.bm.repo.external.UserCredentialsRecord("cliHuman", null, encoder.encode("synthetic"), "USER"));
        var character = new com.gsc.bm.model.cards.bruiser.character.BigBadBruiser();
        var human = new com.gsc.bm.model.game.Player("cliHuman", character, decks.craftBasicActionStarterCard(character),
                decks.craftCharacterBoundStarterCards(character), decks.craftLastResortStarterCard(character), java.util.List.of());
        human.getCardsInHand().clear(); human.getCardsInHand().add(cards.craftCard("bruiser.SuperImpact"));
        var botCharacter = new com.gsc.bm.model.cards.bruiser.character.BigBadBruiser();
        var bot = new com.gsc.bm.model.game.ComPlayer(botCharacter, decks.craftBasicActionStarterCard(botCharacter),
                decks.craftCharacterBoundStarterCards(botCharacter), decks.craftLastResortStarterCard(botCharacter), java.util.List.of());
        bot.getCardsInHand().clear(); bot.getCardsInHand().add(cards.craftCard("com.last.Struggle"));
        var game = new com.gsc.bm.model.game.Game(java.util.List.of(human, bot), "quick1vCom", false);
        org.mockito.Mockito.doReturn(game).when(gameFactory).craftQuick1vComGame("cliHuman");
        Path root = Path.of("..").toAbsolutePath().normalize();
        Path input = Files.createTempFile(Path.of("target"), "cli-", ".jsonl");
        Path output = Files.createTempFile(Path.of("target"), "cli-", ".out");
        var move = mapper.createObjectNode().put("gameId", game.getGameId()).put("playerId", "cliHuman")
                .put("playedCardName", human.getCardsInHand().get(0).getName()).put("targetId", bot.getPlayerId());
        String view = "/user/queue/game/" + game.getGameId() + "/view";
        Files.writeString(input, "{\"command\":\"profile\"}\n" +
                "{\"command\":\"join\",\"mode\":\"quick/1vCom\"}\n" +
                "{\"command\":\"wait\",\"destination\":\"/user/queue/game/quick/1vCom/ready\"}\n" +
                "{\"command\":\"view\",\"gameId\":\"" + game.getGameId() + "\"}\n" +
                "{\"command\":\"move\",\"move\":" + move.deepCopy().putNull("targetId") + "}\n" +
                "{\"command\":\"wait\",\"destination\":\"/user/queue/illegalMove\"}\n" +
                "{\"command\":\"watch\",\"gameId\":\"" + game.getGameId() + "\"}\n" +
                "{\"command\":\"move\",\"move\":" + move + "}\n" +
                "{\"command\":\"wait\",\"destination\":\"/topic/game/" + game.getGameId() + "/update\"}\n" +
                "{\"command\":\"view\",\"gameId\":\"" + game.getGameId() + "\"}\n");
        var pb = new ProcessBuilder(root.resolve(".tools/node-v12.22.12-win-x64/node.exe").toString(),
                root.resolve("scripts/bm-cli.cjs").toString(), input.toAbsolutePath().toString());
        pb.environment().put("BM_USER", "cliHuman"); pb.environment().put("BM_PASSWORD", "synthetic");
        pb.environment().put("BM_URL", "http://localhost:" + port + "/api");
        pb.redirectErrorStream(true).redirectOutput(output.toFile());
        Process process = pb.start();
        try {
            assertTrue(process.waitFor(35, TimeUnit.SECONDS), "CLI must terminate");
            String result = Files.readString(output);
            assertEquals(0, process.exitValue(), result);
            assertTrue(result.contains("collection"), result);
            assertFalse(result.contains("synthetic"));
            assertEquals(1, game.getTurn());
            assertEquals(90, human.getResources().get(com.gsc.bm.model.Resource.HEALTH));
            assertEquals(55, bot.getResources().get(com.gsc.bm.model.Resource.HEALTH));
        } finally {
            process.destroyForcibly(); org.mockito.Mockito.reset(gameFactory);
            if (game.getTurn() > 0) games.leaveGame(game.getGameId(), "cliHuman");
        }
    }
    @Test void cliCardChoicesResolveItemsDiscardAndTokenAcrossThreeRounds() throws Exception {
        for(String name:java.util.List.of("cliCardsA","cliCardsB"))
            users.createIfAbsent(new UserCredentialsRecord(name,null,encoder.encode("synthetic"),"USER"));
        var a=wirePlayer("cliCardsA"); a.getDeck().clear(); a.getCardsInHand().clear();
        var character=new com.gsc.bm.model.cards.junkie.character.ToxicJunkie();
        var b=new com.gsc.bm.model.game.Player("cliCardsB",character,decks.craftBasicActionStarterCard(character),
            decks.craftCharacterBoundStarterCards(character),decks.craftLastResortStarterCard(character),java.util.List.of());
        b.getCardsInHand().clear();
        var steal=cards.craftCard("com.Steal"); var smack=cards.craftCard("bruiser.character.LittleSmack");
        var spare=cards.craftCard("bruiser.SuperImpact"); var struggle=cards.craftCard("com.last.Struggle");
        var grab=cards.craftCard("com.basic.ToxicGrab");
        a.getCardsInHand().addAll(java.util.List.of(steal,smack,spare,struggle));
        b.getCardsInHand().addAll(java.util.List.of(grab,cards.craftCard("com.last.Struggle")));
        var beer=cards.craftCard("com.items.AnotherRottenBeer"); character.getItems().add(beer);
        var game=new com.gsc.bm.model.game.Game(java.util.List.of(a,b),"cli-cards",false);
        String id=games.newGame(game);
        var rounds=mapper.createArrayNode();
        var first=rounds.addArray();
        first.addPOJO(new com.gsc.bm.model.game.Move(steal.getName(),"cliCardsA","cliCardsB",id,java.util.Map.of(com.gsc.bm.model.game.Move.AdditionalAction.TARGET_ITEM,beer.getName())));
        first.addPOJO(new com.gsc.bm.model.game.Move(grab.getName(),"cliCardsB","SELF",id,java.util.Map.of(com.gsc.bm.model.game.Move.AdditionalAction.TARGET_ITEM,beer.getName())));
        var second=rounds.addArray();
        second.addPOJO(new com.gsc.bm.model.game.Move(smack.getName(),"cliCardsA","cliCardsB",id,java.util.Map.of(com.gsc.bm.model.game.Move.AdditionalAction.DISCARD_ONE,spare.getName())));
        second.addPOJO(new com.gsc.bm.model.game.Move(grab.getName(),"cliCardsB","SELF",id,java.util.Map.of(com.gsc.bm.model.game.Move.AdditionalAction.TARGET_ITEM,"Broken Beer Bottle")));
        var third=rounds.addArray();
        third.addPOJO(new com.gsc.bm.model.game.Move(struggle.getName(),"cliCardsA","cliCardsB",id,null));
        third.addPOJO(new com.gsc.bm.model.game.Move(struggle.getName(),"cliCardsB","cliCardsA",id,null));
        Path root=Path.of("..").toAbsolutePath().normalize(); Path output=Files.createTempFile(Path.of("target"),"cli-cards-",".out");
        var pb=new ProcessBuilder(root.resolve(".tools/node-v12.22.12-win-x64/node.exe").toString(),root.resolve("scripts/cli-card-choices-test.cjs").toString());
        pb.environment().put("BM_URL","http://localhost:"+port+"/api"); pb.environment().put("BM_GAME",id); pb.environment().put("BM_ROUNDS",rounds.toString());
        Process process=pb.redirectErrorStream(true).redirectOutput(output.toFile()).start();
        try {
            assertTrue(process.waitFor(25,TimeUnit.SECONDS),"CLI card scenario must terminate");
            assertEquals(0,process.exitValue(),Files.readString(output));
            // Rejected submissions may restore the graph (I11): inspect committed players.
            a=game.getPlayers().get("cliCardsA"); b=game.getPlayers().get("cliCardsB");
            assertEquals(3,game.getTurn());
            assertEquals(80,a.getResources().get(com.gsc.bm.model.Resource.HEALTH));
            assertEquals(78,b.getResources().get(com.gsc.bm.model.Resource.HEALTH));
            assertEquals(15,a.getResources().get(com.gsc.bm.model.Resource.ALERTNESS));
            assertEquals(5,b.getResources().get(com.gsc.bm.model.Resource.ALERTNESS)); // R06: ALCOHOL 1/2 truncates to zero
            assertTrue(a.getCardsInHand().contains(smack)); assertFalse(a.getCardsInHand().contains(spare));
            assertFalse(a.getCardsInHand().contains(steal)); assertTrue(b.getCardsInHand().contains(grab));
            assertEquals(1,a.getCardsInHand().stream().filter(com.gsc.bm.model.cards.Card::isLastResort).count());
            assertEquals(1,b.getCardsInHand().stream().filter(com.gsc.bm.model.cards.Card::isLastResort).count());
            assertTrue(b.getCharacter().getItems().isEmpty()); assertTrue(b.getCharacter().getStatuses().isEmpty());
        } finally { process.destroyForcibly(); games.leaveGame(id,"cliCardsA"); games.leaveGame(id,"cliCardsB"); }
    }
    @Test void cliRejectsDuplicateMoveAndForeignAccess() throws Exception {
        for (String name : java.util.List.of("cliSecurity", "cliStranger", "cliModesA", "cliModesB"))
            users.createIfAbsent(new UserCredentialsRecord(name, null, encoder.encode("synthetic"), "USER"));
        var alice = wirePlayer("cliSecurity"); var bob = wirePlayer("cliOther");
        var bound = decks.craftCharacterBoundStarterCards(new com.gsc.bm.model.cards.bruiser.character.BigBadBruiser()).get(0);
        alice.getCardsInHand().add(bound);
        var game = new com.gsc.bm.model.game.Game(java.util.List.of(alice, bob), "cli-security", false);
        String id = games.newGame(game);
        Path root = Path.of("..").toAbsolutePath().normalize();
        Path output = Files.createTempFile(Path.of("target"), "cli-security-", ".out");
        var pb = new ProcessBuilder(root.resolve(".tools/node-v12.22.12-win-x64/node.exe").toString(),
                root.resolve("scripts/cli-security-test.cjs").toString());
        pb.environment().put("BM_URL", "http://localhost:" + port + "/api");
        pb.environment().put("BM_GAME", id);
        var command = mapper.createObjectNode().put("gameId", id).put("playerId", "cliSecurity")
                .put("playedCardName", bound.getName()).put("targetId",
                    bound.getCanTarget().contains(com.gsc.bm.model.cards.Card.CardTarget.SELF) ? "SELF" : "cliOther");
        command.putObject("choices").put("DISCARD_ONE", alice.getCardsInHand().get(0).getName());
        pb.environment().put("BM_MOVE", command.toString());
        Process process = pb.redirectErrorStream(true).redirectOutput(output.toFile()).start();
        try {
            assertTrue(process.waitFor(25, TimeUnit.SECONDS), "CLI must release resources");
            String result = Files.readString(output);
            assertEquals(0, process.exitValue(), result);
            assertFalse(result.contains("synthetic"), result);
            assertEquals(1, game.getPendingMoves().size());
            assertEquals(0, game.getTurn());
        } finally { process.destroyForcibly(); games.leaveGame(id, "cliSecurity"); games.leaveGame(id, "cliOther"); }
    }

}
