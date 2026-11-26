package com.gsc.bm.service.factories;

import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.bot.ComLevel;
import com.gsc.bm.service.session.model.QueuedPlayer;

import java.util.List;

public interface GameFactoryService {

    /**
     * SB-29: the human starter is drawn in {@code category} (null: any), and the computer one in the same category (Q1, D190).
     * SB-30a (R01 2.2): the computer plays at {@code level}.
     */
    Game craftQuick1vComGame(String playerId, String category, ComLevel level);

    /** SB-30a (R01 2.2): the computer plays any starter at {@code level}. */
    Game craftOpen1vComGame(String username, String deckId, ComLevel level);

    /** SB-30a (R01 2.2, D203 (1)): the computers added to the FFA play at Normale. */

    Game craftQuickMultiPlayerGame(List<QueuedPlayer> players, String mode);

}
