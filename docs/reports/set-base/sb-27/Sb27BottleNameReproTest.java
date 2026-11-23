package com.gsc.bm.sim;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static com.gsc.bm.sim.Sb27Table.*;
import static org.junit.jupiter.api.Assertions.*;

/** Nome del TOKEN effettivamente creato e selezionabile nel playground. */
class Sb27BottleNameReproTest {
    @BeforeAll
    static void loadDraft() throws Exception { load(); }

    @Test
    void doppioMaltoCreatesAnItemWithTheTokenSheetName() {
        Game game = game(s(consume()), b());
        ch(game, "s").getItems().add(card("com.items.AnotherRottenBeer"));
        turn(game, onItem(game, "s", "Consuma", "s", "Doppio Malto da Discount"), rest(game, "b"));
        Card token = ch(game, "s").getItems().element();
        assertTrue(token.isItem());
        assertEquals("com.tokens.BrokenBeerBottle", token.getBindingName());
        assertEquals("Bottiglia Spaccata", token.getName());
    }
}
