package com.gsc.bm.sim;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * SB-10a, misure a richiesta: -Dsim.listino=all oppure un elenco di gruppi (costo, tipo, priorita, veleno, decadimento, nonspecchio,
 * carte, salute, allerta, bound, slot, tetto). Partite per stile: -Dsim.listinoBisect (400), -Dsim.listinoGrid (2000),
 * -Dsim.listinoCurve (2000). Tetto delle bound: -Dsim.boundCap, -Dsim.boundTolerance, -Dsim.boundWeights come in SB-7. Thread:
 * -Dsim.threads. Il rapporto va in tmp/sim/sb10a-listino-*.md e .json, i tempi in un file a parte.
 */
class ListinoMeasureTest {

    @Test
    @EnabledIfSystemProperty(named = "sim.listino", matches = ".+")
    void listino() throws Exception {
        String raw = System.getProperty("sim.listino");
        List<String> groups = "all".equals(raw) ? new ArrayList<>(Listino.GROUPS) : Arrays.asList(raw.split("\\s*,\\s*"));
        boolean cap = "all".equals(raw) || groups.contains("tetto");
        for (String g : groups)
            if (!Listino.GROUPS.contains(g) && !"tetto".equals(g))
                throw new IllegalArgumentException("Gruppo sconosciuto: " + g + " (noti: " + Listino.GROUPS + ", tetto)");
        Draft base = Listino.baseDraft();
        Listino.Params params = Listino.Params.fromSystem(BenchMeasureTest.threads());
        Map<String, com.gsc.bm.model.game.bot.BotPolicy> styles = BenchMeasureTest.styles();
        Listino listino = new Listino(base, params, styles);
        List<Listino.Bisection> bisections = new ArrayList<>();
        for (Listino.Bisection b : listino.bisections()) if (groups.contains(b.group)) bisections.add(b);
        List<Listino.Curve> curves = new ArrayList<>();
        for (Listino.Curve c : listino.curves()) if (groups.contains(c.group)) curves.add(c);
        long start = System.nanoTime();
        Map<String, Object> results = listino.run(bisections, curves);
        List<Listino.BisectionResult> b = new ArrayList<>();
        List<Listino.CurveResult> c = new ArrayList<>();
        for (Object r : results.values()) {
            if (r instanceof Listino.BisectionResult) b.add((Listino.BisectionResult) r);
            else c.add((Listino.CurveResult) r);
        }
        BoundCap.Params capParams = BoundCap.Params.fromSystem();
        List<BoundCap.Result> capResults = null;
        if (cap) capResults = BoundCap.run(base.derive(base.source + " (bound sonda)", listino.capDraft()), capParams);
        double seconds = (System.nanoTime() - start) / 1e9;
        String selection = "all".equals(raw) ? "all" : String.join("+", groups);
        ListinoReport.Head head = new ListinoReport.Head(Bench.shownSource(base), Bench.sha256(base), selection, params,
                new ArrayList<>(styles.keySet()), capParams, System.getProperty("sim.note"));
        String name = "sb10a-listino-" + selection;
        Path dir = SimulationCatalog.outputDirectory();
        String md = ListinoReport.markdown(head, b, c, capResults);
        Files.writeString(dir.resolve(name + ".md"), md, StandardCharsets.UTF_8);
        Files.writeString(dir.resolve(name + ".json"), ListinoReport.json(head, b, c, capResults), StandardCharsets.UTF_8);
        long games = 0;
        for (Listino.BisectionResult r : b) games += r.games();
        for (Listino.CurveResult r : c) games += r.point.games;
        String times = String.format(Locale.ROOT, "banco %s%nmisure %s%nthread %d%npartite %d%nsecondi %.1f%nmillisecondi per partita (tempo reale) %.4f%n",
                Listino.VERSION, selection, params.threads, games, seconds, games == 0 ? 0 : seconds * 1000 / games);
        Files.writeString(dir.resolve(name + ".tempi.txt"), times, StandardCharsets.UTF_8);
        System.out.println(md);
        System.out.println(times);
    }
}
