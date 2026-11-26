package com.gsc.bm.sim;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static com.gsc.bm.sim.Sb27Table.*;
import static org.junit.jupiter.api.Assertions.*;
import static com.gsc.bm.model.cards.base.SetBaseIds.*;

/** D168 (4), applicata in SB-28: il token creato da «Doppio Malto da Discount» porta il nome della scheda. */
class Sb27BottleNameTest {
    @BeforeAll
    static void loadDraft() throws Exception { load(); }

    @Test
    void doppioMaltoCreatesAnItemWithTheTokenSheetName() {
        Game game = game(s(consume()), b());
        ch(game, "s").getItems().add(card(DISCOUNT_DOUBLE_MALT));
        turn(game, onItem(game, "s", "Consuma", "s", "Doppio Malto da Discount"), rest(game, "b"));
        Card token = ch(game, "s").getItems().element();
        assertTrue(token.isItem());
        assertEquals(BROKEN_BOTTLE, token.getBindingName());
        assertEquals("Bottiglia Spaccata", token.getName());
    }
}
