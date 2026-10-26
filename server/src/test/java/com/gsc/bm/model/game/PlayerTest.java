package com.gsc.bm.model.game;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.bruiser.SuperImpact;
import com.gsc.bm.model.cards.com.items.RottenBeer;
import org.junit.jupiter.api.Test;

import static com.gsc.bm.model.game.GameFixtures.*;
import static org.junit.jupiter.api.Assertions.*;

class PlayerTest {
    @Test void longItemChainDoesNotOverflowAndPreservesCapacity() {
        Player player = player("alice");
        player.getCardsInHand().clear();
        Card action = named(new SuperImpact(), "action");
        Card item = named(new RottenBeer(), "item");
        player.getDeck().push(action);
        for (int i = 0; i < 20000; i++) player.getDeck().push(item);
        player.drawCard();
        assertEquals(java.util.List.of(action), player.getCardsInHand());
        assertEquals(1, player.getCharacter().getItems().size());
        assertTrue(player.getDeck().isEmpty());
    }

    @Test
    void drawingItemsPlacesThemOnFieldAndContinuesUntilAction() {
        Player player = player("alice");
        player.getCardsInHand().clear();
        Card action = named(new SuperImpact(), "action");
        Card item = named(new RottenBeer(), "item");
        player.getDeck().push(action);
        player.getDeck().push(item); // deterministic top of stack, no random draw

        player.drawCard();

        assertEquals(1, player.getCardsInHand().size());
        assertSame(action, player.getCardsInHand().get(0));
        assertSame(item, player.getCharacter().getItems().peek());
        assertTrue(player.getDeck().isEmpty());
    }

    @Test
    void excessItemsAreForgottenInFifoOrder() {
        Player player = player("alice"); // Bruiser has capacity one
        Card older = named(new RottenBeer(), "older");
        Card newer = named(new RottenBeer(), "newer");
        player.getDeck().push(named(new SuperImpact(), "action"));
        player.getDeck().push(newer);
        player.getDeck().push(older);

        player.drawCard();

        assertEquals(1, player.getCharacter().getItems().size());
        assertSame(newer, player.getCharacter().getItems().peek());
    }

    @Test
    void emptyDeckSuppliesOnlyOneLastResortUntilUsed() {
        Player player = player("alice");
        player.getCardsInHand().clear();
        player.drawCard();
        player.drawCard();
        assertEquals(1, player.getCardsInHand().size());
        assertSame(player.getLastResortCard(), player.getCardsInHand().get(0));

        player.discardCard(player.getLastResortCard());
        assertTrue(player.getCardsInHand().isEmpty());
        player.drawCard();
        assertSame(player.getLastResortCard(), player.getCardsInHand().get(0));
    }

    @Test
    void basicAndBoundCardsStayInHandButRegularActionsAreDiscarded() {
        Player player = player("alice");
        Card basic = player.getCardsInHand().get(0);
        Card bound = player.getCardsInHand().get(1);
        Card regular = named(new SuperImpact(), "regular");
        player.getCardsInHand().add(regular);

        player.discardCard(basic);
        player.discardCard(bound);
        player.discardCard(regular);

        assertTrue(player.getCardsInHand().contains(basic));
        assertTrue(player.getCardsInHand().contains(bound));
        assertFalse(player.getCardsInHand().contains(regular));
    }
}
