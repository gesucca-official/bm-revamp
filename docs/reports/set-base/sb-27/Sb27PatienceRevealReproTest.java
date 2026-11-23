package com.gsc.bm.sim;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.List;

import static com.gsc.bm.model.Resource.ALERTNESS;
import static com.gsc.bm.model.Resource.VIOLENCE;
import static com.gsc.bm.sim.Sb27Table.*;
import static org.junit.jupiter.api.Assertions.*;

/** Riproduzione dello STOP della fase B per SPA-AR3. */
class Sb27PatienceRevealReproTest {
    @BeforeAll
    static void loadDraft() throws Exception { load(); }

    @Test
    void patienceKeepsTheFoundCopyVisibleWhileItStaysInHand() throws Exception {
        Draft draft = Draft.fromClasspath("/set-base/bozza.json");
        String actor = "bruiser.character.BigBadBruiser";
        Card patience = card("bruiser.Glare");
        Card alreadyHeld = card("bruiser.SuperImpact");
        Card found = card("bruiser.SuperImpact");
        Player spazienzio = player(draft.character(actor), List.of(patience, alreadyHeld),
                List.of(filler(), found, filler()), null);
        Game game = game(spazienzio, b());

        turn(game, move(game, actor, "PAZIENZA: FINITA", "SELF"), rest(game, "b"));
        assertEquals(50, res(game, actor, VIOLENCE));
        assertEquals(35, res(game, actor, ALERTNESS));
        assertEquals(1, spazienzio.getShownRevealed().size());
        assertSame(found, spazienzio.getShownRevealed().get(0).getCard());
        assertSame(alreadyHeld, game.getCardFromHand(actor, "GARGANTUESCO IMPATTO SUL TU"));

        assertArrayEquals(new int[]{0, 35}, turn(game, move(game, actor, "GARGANTUESCO IMPATTO SUL TU", "b"), rest(game, "b")));
        assertFalse(spazienzio.holds(alreadyHeld), "è stata giocata la copia già in mano");
        assertTrue(spazienzio.holds(found), "la copia annunciata è rimasta in mano");
        assertTrue(tokens(game, actor).isEmpty(), "giocare il nome chiude Vulnerabile");
        assertEquals(1, spazienzio.getShownRevealed().size(), "la scheda mostra la copia trovata finché è in mano");
    }
}
