package com.gsc.bm.sim;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.List;

import static com.gsc.bm.model.Resource.HEALTH;
import static com.gsc.bm.sim.Sb27Table.*;
import static org.junit.jupiter.api.Assertions.*;

/** Verifica incrociata di SPA-AR3 (D178) e OGG-04 (RP-29). */
class Sb27MescoloneRevealReproTest {
    @BeforeAll
    static void loadDraft() throws Exception { load(); }

    @Test
    void patienceStopsShowingTheFoundCopyWhenMescoloneRemovesVulnerability() throws Exception {
        Draft draft = Draft.fromClasspath("/set-base/bozza.json");
        String actor = "bruiser.character.BigBadBruiser";
        Card patience = card("bruiser.Glare");
        Card found = card("bruiser.SuperImpact");
        Card mescolone = card("com.items.MarvelousCocktail");
        Player spazienzio = player(draft.character(actor), List.of(patience, consume()),
                List.of(filler(), found, filler(), filler(), filler(), filler(), filler()), null);
        Game game = game(spazienzio, b());
        ch(game, actor).getItems().add(mescolone);

        turn(game, move(game, actor, "PAZIENZA: FINITA", "SELF"), rest(game, "b"));
        assertSame(found, spazienzio.getShownRevealed().get(0).getCard());
        assertFalse(tokens(game, actor).isEmpty());

        turn(game, onItem(game, actor, "Consuma", actor, "Mescolone Micidiale"), rest(game, "b"));
        for (int turnAfterConsuming = 1; turnAfterConsuming <= 3; turnAfterConsuming++) {
            turn(game, rest(game, actor), rest(game, "b"));
        }
        assertEquals(70, res(game, actor, HEALTH));
        assertFalse(tokens(game, actor).isEmpty());
        assertSame(found, spazienzio.getShownRevealed().get(0).getCard());

        turn(game, rest(game, actor), rest(game, "b"));
        assertEquals(50, res(game, actor, HEALTH), "il timer di quinto turno è scattato e ha inflitto 20 POISON");
        assertTrue(tokens(game, actor).isEmpty(), "RP-29: il timer rimuove Vulnerabile");
        assertTrue(spazienzio.holds(found), "la copia annunciata non è stata giocata o scartata");
        assertEquals(0, spazienzio.getShownRevealed().size(), "D178: la visibilità richiede che il Vulnerabile legato duri ancora");
    }
}
