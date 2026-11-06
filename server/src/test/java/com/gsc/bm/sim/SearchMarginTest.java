package com.gsc.bm.sim;

import com.gsc.bm.model.game.bot.AggressivePolicy;
import org.junit.jupiter.api.Test;

import java.util.Map;
import java.util.Random;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * SB-10a, decisione approvata dal proprietario: nella ricerca dei mazzi un mutante prende il posto del mazzo in carica solo se lo
 * supera di più di un errore standard. Con la regola di SB-7 bastava superarlo, e il mazzo finale vagava fra candidati fortunati.
 */
class SearchMarginTest {
    private static final String BRUISER = "bruiser.character.BigBadBruiser";

    private static DeckSearch.Params params(double margin) {
        return new DeckSearch.Params(8, 16, 8, 99, 20, 1, 1, 7_100_000L, 7_900_000L, 7_000_007L, margin);
    }

    @Test
    void theRuleNeedsMoreThanOneStandardError() {
        DeckSearch.Params standard = DeckSearch.Params.standard(1), old = params(0);
        int games = 288;
        double se = DeckSearch.Params.standardError(0.5, games);
        assertEquals(DeckSearch.Params.MARGIN, standard.margin, "la ricerca normale usa il margine");
        assertEquals(1.0, DeckSearch.Params.MARGIN);
        assertFalse(standard.replaces(0.5, 0.5 + 0.9 * se, games), "sotto un errore standard il mazzo in carica resta");
        assertTrue(standard.replaces(0.5, 0.5 + 1.1 * se, games), "oltre un errore standard lo sfidante subentra");
        assertTrue(old.replaces(0.5, 0.5 + 0.1 * se, games), "con margine 0 vale la regola di SB-7: basta superarlo");
        assertFalse(old.replaces(0.5, 0.5, games), "a pari punteggio nessuno subentra, nemmeno con la regola di SB-7");
        assertThrows(IllegalArgumentException.class, () -> params(-1));
    }

    /**
     * Stessa ricerca, stessi semi: con la regola di SB-7 almeno una sostituzione avviene per meno di un errore standard (la prova
     * distingue le due regole); con il margine nessuna. Se il margine non fosse applicato, la seconda parte fallirebbe.
     */
    @Test
    void theSearchNoLongerReplacesForLuck() throws Exception {
        Draft draft = Draft.fromClasspath(Draft.CURRENT);
        int oldSmall = 0, oldTotal = 0;
        for (double margin : new double[]{0, DeckSearch.Params.MARGIN}) {
            DeckSearch.Params params = params(margin);
            DeckSearch search = new DeckSearch(draft, Map.of("aggressivo", new AggressivePolicy()), params);
            DeckSearch.Deck starter = search.starter(BRUISER);
            DeckSearch.Outcome outcome = search.search(BRUISER, "starter", starter, starter, new Random(params.mutationSeed));
            int small = 0;
            for (double[] r : outcome.replacements) if (r[1] <= r[2]) small++;
            System.out.printf("SB-10a margine %.1f: %d sostituzioni, %d entro un errore standard%n", margin, outcome.replacements.size(), small);
            if (margin == 0) {
                oldSmall = small;
                oldTotal = outcome.replacements.size();
            } else {
                assertEquals(0, small, "con il margine nessuna sostituzione entro un errore standard");
                assertTrue(outcome.replacements.size() < oldTotal, "il margine riduce le sostituzioni: " + outcome.replacements.size()
                        + " contro " + oldTotal);
                assertTrue(search.markdown(java.util.List.of(outcome), null).contains("solo oltre 1,0 errori standard"));
            }
        }
        assertTrue(oldSmall > 0, "la prova deve distinguere le regole: con quella di SB-7 serve una sostituzione per poco");
    }
}
