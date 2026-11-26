package com.gsc.bm.service.factories;

import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.bot.ComLevel;

public interface PlayerFactoryService {

    /**
     * SB-30a (R01 and R03 2.2, D203): a computer at {@code level} with a random starter of the category (any category when
     * {@code category} is null). The id keeps the prefix {@code ComPlayer_} (client-web/src/session.ts relies on it).
     */
    Player craftComPlayer(String category, ComLevel level);

    /** SB-29 (R01 2.1): a random starter of the category, or of any category when {@code category} is null. */
    Player craftRandomPlayer(String playerId, String category);

    /**
     * SB-29 (D190): the category a client asked for. Null or blank means no choice (null, any starter); a category with at
     * least one starter in the live set is returned as it is; any other value is an {@link IllegalArgumentException}.
     */
    String checkCategory(String category);

    Player craftOpenPlayer(String username, String deckId);
}
