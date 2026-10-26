package com.gsc.bm.api.ws;

import com.gsc.bm.model.game.IllegalMoveException;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.service.session.GameSessionService;
import com.gsc.bm.service.view.ViewExtractorService;
import com.gsc.bm.service.view.model.client.ClientGameView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

@Controller
public class GameController {

    private final SimpMessagingTemplate messagingTemplate;
    private final GameSessionService gameSessionService;

    private final ViewExtractorService viewExtractorService;
    private final MoveCommandValidator validator;

    @Autowired
    public GameController(SimpMessagingTemplate messagingTemplate,
                          GameSessionService gameSessionService,
                          ViewExtractorService viewExtractorService, MoveCommandValidator validator) {
        this.messagingTemplate = messagingTemplate;
        this.gameSessionService = gameSessionService;
        this.viewExtractorService = viewExtractorService;
        this.validator = validator;
    }


    @MessageMapping("/game/{gameId}/move")
    @SendTo("/topic/game/{gameId}/move")
    public String makeYourMove(@DestinationVariable String gameId, @Payload com.fasterxml.jackson.databind.JsonNode command,
                              java.security.Principal principal) throws IllegalMoveException {
        Move move = validator.validate(gameSessionService.snapshotGame(gameId), principal.getName(), gameId, command);
        gameSessionService.submitMoveToGame(move, () -> messagingTemplate.convertAndSend("/topic/game/" + gameId + "/update", move.getGameId()));
        return move.getPlayerId() + " submitted a Move";
    }

    @MessageMapping("/game/{gameId}/{playerId}/view")
    @SendToUser("/queue/game/{gameId}/view")
    public ClientGameView getGameView(@DestinationVariable String gameId, @DestinationVariable String playerId) {
        return viewExtractorService.extractViewFor(gameSessionService.snapshotGame(gameId), playerId);
    }

    @MessageMapping("/game/{gameId}/{playerId}/leave")
    @SendToUser("/queue/game/{gameId}/leave")
    public boolean leaveGame(@DestinationVariable String gameId, @DestinationVariable String playerId) {
        gameSessionService.leaveGame(gameId, playerId);
        return true;
    }

    @MessageExceptionHandler
    @SendToUser(value = "/queue/illegalMove")
    public String handleException(IllegalMoveException exception) {
        return exception.getWhatHeDid();
    }

}
