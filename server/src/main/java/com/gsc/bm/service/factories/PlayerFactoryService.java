package com.gsc.bm.service.factories;

import com.gsc.bm.model.game.Player;

public interface PlayerFactoryService {

    /** SB-29 (R01 2.1): a random starter of the category, or of any category when {@code category} is null. */
    Player craftRandomComPlayer(String category);

    /** SB-29 (R01 2.1): a random starter of the category, or of any category when {@code category} is null. */
    Player craftRandomPlayer(String playerId, String category);

    /**
     * SB-29 (D190): the category a client asked for. Null or blank means no choice (null, any starter); a category with at
     * least one starter in the live set is returned as it is; any other value is an {@link IllegalArgumentException}.
     */
    String checkCategory(String category);

    Player craftOpenPlayer(String username, String deckId);
}
