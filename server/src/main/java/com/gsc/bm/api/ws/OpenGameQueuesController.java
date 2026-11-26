package com.gsc.bm.api.ws;

import com.gsc.bm.model.game.bot.ComLevel;
import com.gsc.bm.service.factories.GameFactoryService;
import com.gsc.bm.service.session.GameSessionService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
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
    public String deckUnavailable(Exception error) {
        // R02 1.12: a deck saved under older rules is kept but refused here, with the broken rule.
        if (error instanceof com.gsc.bm.service.account.InvalidDeckException)
            return "Invalid deck: " + error.getMessage() + ". Edit or delete it in your collection.";
        return "Deck unavailable. Choose a saved deck from your account and retry.";
    }

    /**
     * SB-30a (R03 2.2, D203 (2)): a join with an unknown level is refused on {@code /user/queue/game/error}, as in the quick, before
     * the deck is read. More specific than the {@link IllegalArgumentException} of the deck, so it wins over that handler.
     */
    @org.springframework.messaging.handler.annotation.MessageExceptionHandler(ComLevel.UnknownLevelException.class)
    @SendToUser("/queue/game/error")
    public String unknownLevel(ComLevel.UnknownLevelException error) { return error.getMessage(); }

    @MessageMapping("/game/open/1vCom/join/{username}/{deckId}")
    @SendToUser("/queue/game/open/1vCom/ready")
    public String queueForOpen1vCom(@DestinationVariable String username, @DestinationVariable String deckId,
                                    @Header(name = ComLevel.HEADER, required = false) String level) {
        ComLevel computer = ComLevel.parse(level); // SB-30a: missing level = Facile, before anything is created
        gameSessionService.checkAvailable(username);
        com.gsc.bm.model.game.Game game = gameFactoryService.craftOpen1vComGame(username, deckId, computer);
        queueService.leaveAllQueues(new com.gsc.bm.service.session.model.QueuedPlayer(username, true));
        return gameSessionService.newGame(game);
    }

}
