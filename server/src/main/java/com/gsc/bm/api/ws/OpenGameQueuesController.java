package com.gsc.bm.api.ws;

import com.gsc.bm.service.factories.GameFactoryService;
import com.gsc.bm.service.session.GameSessionService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

@Controller
public class OpenGameQueuesController {

    private final GameFactoryService gameFactoryService;
    private final GameSessionService gameSessionService;
    private final com.gsc.bm.service.session.QueueService queueService;

    public OpenGameQueuesController(GameFactoryService gameFactoryService,
                                    GameSessionService gameSessionService, com.gsc.bm.service.session.QueueService queueService) {
        this.gameFactoryService = gameFactoryService;
        this.gameSessionService = gameSessionService;
        this.queueService = queueService;
    }

    @org.springframework.messaging.handler.annotation.MessageExceptionHandler({
            com.gsc.bm.service.factories.ValueNotFoundException.class, IllegalArgumentException.class,
            org.springframework.dao.DataAccessException.class})
    @SendToUser("/queue/game/open/1vCom/error")
    public String deckUnavailable(Exception ignored) {
        return "Deck unavailable. Choose a saved deck from your account and retry.";
    }

    @MessageMapping("/game/open/1vCom/join/{username}/{deckId}")
    @SendToUser("/queue/game/open/1vCom/ready")
    public String queueForOpen1vCom(@DestinationVariable String username, @DestinationVariable String deckId) {
        gameSessionService.checkAvailable(username);
        com.gsc.bm.model.game.Game game = gameFactoryService.craftOpen1vComGame(username, deckId);
        queueService.leaveAllQueues(new com.gsc.bm.service.session.model.QueuedPlayer(username, true));
        return gameSessionService.newGame(game);
    }

}
