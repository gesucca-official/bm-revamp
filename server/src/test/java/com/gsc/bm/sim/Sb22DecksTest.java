package com.gsc.bm.sim;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * SB-22 (D162): the seven constructed decks of SB-21z, in a file of their own next to the draft, so the server of the profile
 * {@code bozza} offers them in «Con un tuo mazzo» with {@code -Draft "src/test/resources/set-base/bozza.json;src/test/resources/set-base/sb-22/costruiti.json"}.
 * The lists are those of {@code docs/reports/set-base/sb-21z/liste-z2.json}.
 */
class Sb22DecksTest {

    static final String DECKS = "/set-base/sb-22/costruiti.json";
    static final Map<String, String> CHARACTERS = new TreeMap<>(Map.of(
            "sb22.costruito-spazienzio", "bruiser.character.BigBadBruiser", "sb22.costruito-mara", "base.character.Mara",
            "sb22.costruito-celestina", "junkie.character.ToxicJunkie", "sb22.costruito-piera", "base.character.Pino",
            "sb22.costruito-beppe", "base.character.Gigi", "sb22.costruito-sergio", "base.character.Cesira",
            "sb22.costruito-duccio", "base.character.Rocco"));

    @Test
    void theSevenConstructedDecksLoadOnTopOfTheDraft() throws Exception {
        DraftSource both = DraftSource.load("classpath:/set-base/bozza.json;classpath:" + DECKS);
        DraftSource draft = DraftSource.load("classpath:/set-base/bozza.json");
        assertEquals(Set.of("base", "sb22"), both.sets().keySet());
        assertEquals(draft.cardBindings(), both.cardBindings(), "the file adds no card");
        for (Map.Entry<String, String> e : CHARACTERS.entrySet()) {
            String deck = e.getKey();
            assertTrue(both.deckIds().contains(deck), deck);
            assertEquals(e.getValue(), both.characterOf(deck), deck);
            assertEquals(20, both.regularOf(deck).size(), deck + ": 20 cards (D94)");
            assertEquals(2, both.boundOf(deck).size(), deck + ": two bounds");
        }
        List<String> added = new java.util.ArrayList<>(both.deckIds());
        added.removeAll(draft.deckIds());
        assertEquals(CHARACTERS.keySet(), new java.util.TreeSet<>(added));
    }
}
