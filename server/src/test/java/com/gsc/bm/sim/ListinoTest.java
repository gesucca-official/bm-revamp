package com.gsc.bm.sim;

import com.gsc.bm.model.game.bot.AggressivePolicy;
import com.gsc.bm.model.game.bot.BotPolicy;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * SB-10a: prove brevi del listino. La retta trova la radice giusta, ogni bozza derivata è valida agli estremi della ricerca, una
 * sonda uguale all'àncora sta al 50% e una sonda più forte sta sopra. Le misure vere sono in ListinoMeasureTest, a richiesta.
 */
class ListinoTest {

    @Test
    void theFitFindsTheRootAndItsInterval() {
        double[] xs = {10, 12, 14, 16, 18};
        long[] decisive = {4000, 4000, 4000, 4000, 4000}, wins = new long[5];
        for (int i = 0; i < 5; i++) wins[i] = Math.round((0.5 + 0.025 * (xs[i] - 14)) * 4000); // 0,5 a x = 14
        Listino.Fit fit = Listino.Fit.of(xs, wins, decisive, 0.5, 0);
        assertEquals(14, fit.root, 0.05);
        assertTrue(fit.rootLow < 14 && fit.rootHigh > 14 && fit.rootHigh - fit.rootLow < 2, fit.rootLow + " " + fit.rootHigh);
        assertFalse(fit.flat);
        long[] flat = {2000, 2000, 2000, 2000, 2000};
        assertTrue(Listino.Fit.of(xs, flat, decisive, 0.5, 0).flat, "una retta piatta non ha radice");
    }

    @Test
    void everyDerivedDraftIsValid() throws Exception {
        Draft base = Listino.baseDraft();
        Listino listino = new Listino(base, new Listino.Params(1, 1, 1, 1), Map.of("aggressivo", new AggressivePolicy()));
        int drafts = 0;
        for (Listino.Bisection b : listino.bisections())
            for (int x : new int[]{b.lo, b.hi}) {
                Listino.Variant v = b.builder.build(x);
                Draft d = base.derive(b.id, v.root);
                assertTrue(d.deckIds().contains(v.probe) && d.deckIds().contains(v.reference), b.id);
                drafts++;
            }
        for (Listino.Curve c : listino.curves()) {
            base.derive(c.id, c.builder.build(0).root);
            drafts++;
        }
        base.derive("tetto", listino.capDraft());
        assertTrue(drafts > 150, "bozze derivate: " + drafts);
    }

    /** Sonda gratuita da 10 HIT, cioè l'àncora con un altro nome: 50% entro l'intervallo. Da 30 HIT: nettamente sopra. */
    @Test
    void aProbeEqualToTheAnchorIsIndifferent() throws Exception {
        Draft base = Listino.baseDraft();
        Map<String, BotPolicy> styles = new java.util.LinkedHashMap<>(PlaygroundTest.styles());
        styles.remove("com");
        styles.remove("casuale");
        Listino listino = new Listino(base, new Listino.Params(1, 1, 1, 1), styles);
        Listino.Bisection cut = null;
        for (Listino.Bisection b : listino.bisections()) if (b.id.equals("priorita-2-neutro")) cut = b;
        Listino.Point same = listino.evaluate(listino.slotProbe(Listino.NEUTRO, null,
                id -> Listino.hitter(id, Map.of(), 1, "HIT", Listino.ANCHOR)), 300, Listino.GRID_SEED, false, 10);
        double[] ci = same.ci();
        assertTrue(ci[0] < 0.5 && ci[1] > 0.5, "la sonda uguale all'àncora deve stare al 50%: " + same.share());
        Listino.Point strong = listino.evaluate(listino.slotProbe(Listino.NEUTRO, null,
                id -> Listino.hitter(id, Map.of(), 1, "HIT", 30)), 300, Listino.GRID_SEED, false, 30);
        assertTrue(strong.ci()[0] > 0.5, "una sonda da 30 HIT batte l'àncora: " + strong.share());
        assertTrue(cut != null);
    }
}
