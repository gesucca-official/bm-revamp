package com.gsc.bm.service.factories;

import com.gsc.bm.model.game.Game;
import com.gsc.bm.service.session.model.QueuedPlayer;

import java.util.List;

public interface GameFactoryService {

    /** SB-29: the human starter is drawn in {@code category} (null: any), and the computer one in the same category (Q1, D190). */
    Game craftQuick1vComGame(String playerId, String category);

    Game craftOpen1vComGame(String username, String deckId);

    Game craftQuickMultiPlayerGame(List<QueuedPlayer> players, String mode);

}
