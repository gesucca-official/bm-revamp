package com.gsc.bm.service.session;

import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.IllegalMoveException;
import com.gsc.bm.model.game.Move;

public interface GameSessionService {

    String newGame(Game game);

    void checkAvailable(String user);
    boolean canLeave(String game, String user);
    void disconnected(String user);
    void logout(String user);
    Object resume(String user);
    void expireDue();

    Game getGame(String gameId);

    Game snapshotGame(String gameId);

    void leaveGame(String gameId, String playerId);

    void submitMoveToGame(Move move, Runnable callback) throws IllegalMoveException;
}
