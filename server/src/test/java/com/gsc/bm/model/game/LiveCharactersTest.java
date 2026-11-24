package com.gsc.bm.model.game;

import com.gsc.bm.LiveFixtures;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * SB-28, D184 (1): the live counterpart of the historical R01 test (MissingResourceTest): every character of the live set
 * (Set Base 1.0) has all five resources, at 0 when its sheet does not state them, and plays in a live match (regulation 2.0).
 */
class LiveCharactersTest {
    @Test void everyLiveCharacterHasAllFiveResources() {
        for (String id : LiveFixtures.set().characterIds()) {
            Character c = LiveFixtures.character(id);
            for (Resource r : Resource.values()) assertNotNull(c.getResources().get(r), id + " has no " + r);
            assertTrue(c.getResources().get(Resource.HEALTH) > 0, id);
        }
    }

    @Test void spazienzioOfTheSetBase10StartsAsHisSheetStates() {
        Character c = LiveFixtures.character("bruiser.character.BigBadBruiser");
        assertEquals(70, c.getResources().get(Resource.HEALTH));
        assertEquals(20, c.getResources().get(Resource.ALERTNESS));
        assertEquals(25, c.getResources().get(Resource.VIOLENCE));
        assertEquals(0, c.getResources().get(Resource.TOXICITY));
        assertEquals(0, c.getResources().get(Resource.ALCOHOL));
    }

    @Test void theFixtureDuelIsALiveMatch() {
        Game game = GameFixtures.duel(GameFixtures.player("a"), GameFixtures.player("b"));
        assertTrue(game.getRuleset().playground(), "regulation 2.0, Ruleset.LIVE");
    }
}
