package com.gsc.bm.sim;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static com.gsc.bm.sim.Sb27Table.*;
import static org.junit.jupiter.api.Assertions.*;

/** RP-15, RP-16 e RP-29, due annunci omonimi separati dal timer del Mescolone. */
class Sb27RepeatAfterMescoloneReproTest {
    @BeforeAll
    static void loadDraft() throws Exception { load(); }

    @Test
    void matchingPlayEndsTheOnlyRemainingVulnerabilityAfterMescolone() throws Exception {
        Draft draft = Draft.fromClasspath("/set-base/bozza.json");
        String actor = "bruiser.character.BigBadBruiser";
        Card first = card("bruiser.SuperImpact");
        Card second = card("bruiser.SuperImpact");
        List<Card> deck = new ArrayList<>(fillers(12));
        deck.add(0, first);
        deck.add(2, second); // Col seme del banco resta nel mazzo fino al secondo annuncio.
        Player spazienzio = player(draft.character(actor),
                List.of(card("bruiser.Glare"), consume(), card("base.bruiser.TiFaccioSpazio")), deck, null);
        Game game = game(spazienzio, b());
        ch(game, actor).getItems().add(card("com.items.MarvelousCocktail"));

        turn(game, move(game, actor, "PAZIENZA: FINITA", "SELF"), rest(game, "b"));
        assertSame(first, spazienzio.getShownRevealed().get(0).getCard());
        assertEquals(3, tokens(game, actor).size());

        turn(game, onItem(game, actor, "Consuma", actor, "Mescolone Micidiale"), rest(game, "b"));
        for (int afterConsumption = 1; afterConsumption <= 4; afterConsumption++) {
            turn(game, rest(game, actor), rest(game, "b"));
        }
        assertTrue(tokens(game, actor).isEmpty(), "RP-29: il primo Vulnerabile è finito");
        assertSame(first, spazienzio.getShownRevealed().get(0).getCard(), "D179: il primo promemoria è ancora mostrato");
        assertTrue(spazienzio.getDeck().stream().anyMatch(copy -> copy == second));

        turn(game, move(game, actor, "SGOMBERIAMOVI", "SELF"), rest(game, "b"));
        assertEquals(2, spazienzio.getShownRevealed().size());
        assertSame(second, spazienzio.getShownRevealed().get(1).getCard());
        assertEquals(3, tokens(game, actor).size(), "c'è un solo gettone, del secondo annuncio");
        assertSame(first, game.getCardFromHand(actor, "GARGANTUESCO IMPATTO SUL TU"));

        turn(game, move(game, actor, "GARGANTUESCO IMPATTO SUL TU", "b"), rest(game, "b"));
        assertFalse(spazienzio.holds(first));
        assertTrue(spazienzio.holds(second));
        assertTrue(tokens(game, actor).isEmpty(), "RP-15 e RP-16: giocare il nome soddisfa l'unico Vulnerabile presente");
    }
}
