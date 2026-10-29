package com.gsc.bm.api.ws;

import com.gsc.bm.service.factories.GameFactoryService;
import com.gsc.bm.service.session.GameSessionService;
import com.gsc.bm.service.session.QueueService;
import com.gsc.bm.service.session.model.QueuedPlayer;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Optional;

@Controller
public class QuickGameQueuesController {

    private final SimpMessagingTemplate messagingTemplate;
    private final GameFactoryService gameFactoryService;
    private final GameSessionService gameSessionService;
    private final QueueService queueService;

    public QuickGameQueuesController(SimpMessagingTemplate messagingTemplate,
                                     GameFactoryService gameFactoryService,
                                     GameSessionService gameSessionService,
                                     QueueService queueService) {
        this.messagingTemplate = messagingTemplate;
        this.gameFactoryService = gameFactoryService;
        this.gameSessionService = gameSessionService;
        this.queueService = queueService;
    }


    @org.springframework.messaging.handler.annotation.MessageExceptionHandler(IllegalArgumentException.class)
    @SendToUser("/queue/game/error")
    public String unavailable(IllegalArgumentException error) { return error.getMessage(); }

    @MessageMapping("/game/quick/1vCom/join")
    @SendToUser("/queue/game/quick/1vCom/ready")
    public synchronized String queueForQuick1vCom(String playerId) {
        gameSessionService.checkAvailable(playerId);
        queueService.leaveAllQueues(new QueuedPlayer(playerId, true));
        return gameSessionService.newGame(
                gameFactoryService.craftQuick1vComGame(playerId));
    }

    @MessageMapping("/game/quick/1v1/join")
    public synchronized void queueForQuick1v1(String playerId) {
        String game = queueFor(QueueService.GameQueue.Q_1V1, playerId, true);
        if (game != null) {
            for (String participant : gameSessionService.getGame(game).getPlayers().keySet()) {
                messagingTemplate.convertAndSendToUser(participant, "/queue/game/quick/1v1/ready", game);
            }
        }
    }

    @MessageMapping("/game/quick/ffa/join")
    @SendTo("/topic/game/quick/ffa/joined")
    public synchronized List<QueuedPlayer> queueForQuickFfa(String playerId) {
        String game = queueFor(QueueService.GameQueue.Q_FFA, playerId, true);
        if (game != null)
            sendFfaReady(game);
        return queueService.getUsersInQueue(QueueService.GameQueue.Q_FFA);
    }

    @MessageMapping("/game/quick/ffa/join/com")
    @SendTo("/topic/game/quick/ffa/joined")
    public synchronized List<QueuedPlayer> addComPlayerToFfaQueue() {
        String game = queueFor(QueueService.GameQueue.Q_FFA, "QueuedComPlayer", false);
        if (game != null)
            sendFfaReady(game);
        return queueService.getUsersInQueue(QueueService.GameQueue.Q_FFA);
    }

    @MessageMapping("/game/quick/ffa/start")
    public synchronized void forceStartFfaGame() {
        Optional<List<QueuedPlayer>> queuedPlayers = queueService.flushQueue(QueueService.GameQueue.Q_FFA);
        if (queuedPlayers.isPresent()) {
            messagingTemplate.convertAndSend("/topic/game/quick/ffa/joined", queueService.getUsersInQueue(QueueService.GameQueue.Q_FFA));
            sendFfaReady(gameSessionService.newGame(
                    gameFactoryService.craftQuickMultiPlayerGame(queuedPlayers.get(), "quickFFA")));
        }
    }

    private void sendFfaReady(String gameId) {
        gameSessionService.getGame(gameId).getPlayers().values().stream()
                .filter(p -> !(p instanceof com.gsc.bm.model.game.ComPlayer))
                .forEach(p -> messagingTemplate.convertAndSendToUser(p.getPlayerId(), "/queue/game/quick/ffa/ready", gameId));
    }

    private String queueFor(QueueService.GameQueue queue, String playerId, boolean human) {
        if (human) { gameSessionService.checkAvailable(playerId); }
        Optional<List<QueuedPlayer>> queuedPlayers = queueService.joinQueue(
                new QueuedPlayer(playerId, human), queue);
        return queuedPlayers.map(players -> gameSessionService.newGame(
                gameFactoryService.craftQuickMultiPlayerGame(players, queue == QueueService.GameQueue.Q_FFA ? "quickFFA" : "quick1v1"))).orElse(null);
    }
}
