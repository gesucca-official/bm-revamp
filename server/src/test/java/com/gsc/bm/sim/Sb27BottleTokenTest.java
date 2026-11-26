package com.gsc.bm.sim;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.status.Status;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.List;

import static com.gsc.bm.model.Resource.*;
import static com.gsc.bm.sim.Sb27Table.*;
import static org.junit.jupiter.api.Assertions.*;
import static com.gsc.bm.model.cards.base.SetBaseIds.*;

/** Scheda TOKEN del Set Base 1.0 candidato, dalla creazione alla rimozione dell'equipaggiamento. */
class Sb27BottleTokenTest {
    private static final String MALTO = DISCOUNT_DOUBLE_MALT;
    private static final String BOTTLE = BROKEN_BOTTLE;

    @BeforeAll
    static void loadDraft() throws Exception { load(); }

    @Test
    void eachCreatedBottleMakesAnIndependentEquipmentThatConvertsHitToCut() {
        Card attack = hit("Colpo di prova", 0, null, "HIT 7");
        Player actor = player(character("s", 60, 3, ALCOHOL), List.of(consume(), consume(), attack),
                List.of(consume(), consume(), filler(), attack, attack, filler()), null);
        Player opponent = player(character("b", 10, 3, ALCOHOL), List.of(), fillers(10), null);
        opponent.getCharacter().getResources().put(ALCOHOL, 12);
        Game game = game(actor, opponent);
        ch(game, "s").getItems().addAll(List.of(card(MALTO), card(MALTO)));

        consumeItem(game, "Doppio Malto da Discount");
        consumeItem(game, "Doppio Malto da Discount");
        assertEquals(2, ch(game, "s").getItems().size());
        List<Card> bottles = List.copyOf(ch(game, "s").getItems());
        assertTrue(bottles.stream().allMatch(item -> item.isItem() && BOTTLE.equals(item.getBindingName())));
        assertNotSame(bottles.get(0), bottles.get(1));
        assertTrue(ch(game, "s").getStatuses().isEmpty(), "il token in campo non equipaggia");

        // Il nome runtime è qui solo la chiave con cui il banco seleziona l'oggetto.
        consumeItem(game, bottles.get(0).getName());
        consumeItem(game, bottles.get(1).getName());
        assertTrue(items(game, "s").isEmpty());
        List<Status> statuses = ch(game, "s").getStatuses();
        assertEquals(2, statuses.size());
        assertNotSame(statuses.get(0), statuses.get(1));

        assertEquals(10, attack(game), "7 HIT diventano 10 CUT e ignorano la corazza");
        assertEquals(1, statuses.size(), "si esaurisce il solo equipaggiamento che ha convertito");
        assertEquals(10, attack(game), "l'altro equipaggiamento resta attivo fino al suo uso");
        assertTrue(statuses.isEmpty());
        assertEquals(4, attack(game), "tornano 7 HIT meno 3 di corazza");
    }

    @Test
    void bottleWaitsForItsFirstHitAndCanConvertMultipleHitsThatTurn() {
        Card attack = hit("Doppio HIT", 0, null, "HIT 7", "HIT 5");
        Player actor = player(character("s", 60, 3), List.of(consume(), consume(), attack),
                List.of(filler(), filler(), filler(), attack, filler()), null);
        Game game = game(actor, b());
        ch(game, "s").getItems().add(card(MALTO));
        consumeItem(game, "Doppio Malto da Discount");
        Card bottle = ch(game, "s").getItems().element();
        consumeItem(game, bottle.getName());
        turn(game, rest(game, "s"), rest(game, "b"));
        assertEquals(1, ch(game, "s").getStatuses().size());
        assertEquals(17, turn(game, move(game, "s", "Doppio HIT", "b"), rest(game, "b"))[1], "10 CUT e 7 CUT");
        assertTrue(ch(game, "s").getStatuses().isEmpty());
        assertEquals(12, turn(game, move(game, "s", "Doppio HIT", "b"), rest(game, "b"))[1]);
    }

    private static void consumeItem(Game game, String name) {
        turn(game, onItem(game, "s", "Consuma", "s", name), rest(game, "b"));
    }

    private static int attack(Game game) {
        return turn(game, move(game, "s", "Colpo di prova", "b"), rest(game, "b"))[1];
    }
}
