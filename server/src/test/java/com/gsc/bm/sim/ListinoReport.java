package com.gsc.bm.sim;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * SB-10a: il rapporto del listino in testo e in dati, dagli stessi numeri e nello stesso ordine. Nessun tempo dentro: a parità di
 * bozza, semi e partite i due file sono identici.
 */
final class ListinoReport {
    private ListinoReport() { }

    static final class Head {
        final String draft, sha256, selection, note;
        final Listino.Params params;
        final List<String> styles;
        final BoundCap.Params cap;

        Head(String draft, String sha256, String selection, Listino.Params params, List<String> styles, BoundCap.Params cap, String note) {
            this.draft = draft;
            this.sha256 = sha256;
            this.selection = selection;
            this.params = params;
            this.styles = styles;
            this.cap = cap;
            this.note = note;
        }
    }

    /** Oltre questa distanza dagli estremi la quota non si converte in salute: la retta della moneta comune non vale più. */
    static final double SATURATED = 0.1;

    static String d(double v, int digits) { return Double.isNaN(v) ? "—" : Bench.decimal(v, digits); }

    static String share(Listino.Point p) {
        double[] ci = p.ci();
        return d(p.share(), 3) + " [" + d(ci[0], 3) + "–" + d(ci[1], 3) + "]";
    }

    /** Pendenza della quota per punto di salute iniziale, per contesto: la moneta comune di bound e slot. */
    static Map<String, double[]> healthSlopes(List<Listino.CurveResult> curves) {
        Map<String, double[]> sums = new LinkedHashMap<>();
        for (Listino.CurveResult r : curves) {
            if (!r.def.group.equals("salute")) continue;
            long n = r.point.decisive();
            if (n == 0) continue;
            double w = n / 0.25, x = r.def.value, y = r.point.share() - 0.5;
            double[] s = sums.computeIfAbsent(r.def.context, k -> new double[2]);
            s[0] += w * x * y;
            s[1] += w * x * x;
        }
        Map<String, double[]> out = new LinkedHashMap<>();
        sums.forEach((ctx, s) -> out.put(ctx, new double[]{s[0] / s[1], Math.sqrt(1 / s[1])}));
        return out;
    }

    static String reading(Listino.BisectionResult r) {
        Listino.Fit f = r.fit;
        switch (r.def.group) {
            case "costo":
            case "nonspecchio":
                if (r.def.cost > 0)
                    return d((f.root - Listino.ANCHOR) / r.def.cost, 2) + " [" + d((f.rootLow - Listino.ANCHOR) / r.def.cost, 2) + "–"
                            + d((f.rootHigh - Listino.ANCHOR) / r.def.cost, 2) + "] danni per unità";
                // fall through: CUT nel non specchio
            case "tipo":
                return f.root > 0 ? d(Listino.ANCHOR / f.root, 2) + " [" + d(Listino.ANCHOR / Math.max(f.rootHigh, 1e-9), 2) + "–"
                        + (f.rootLow > 0 ? d(Listino.ANCHOR / f.rootLow, 2) : "∞") + "] HIT per unità" : "—";
            case "veleno":
                return f.root > 0 ? d(5 / f.root, 2) + " [" + d(5 / Math.max(f.rootHigh, 1e-9), 2) + "–"
                        + (f.rootLow > 0 ? d(5 / f.rootLow, 2) : "∞") + "] HIT per 1 T" : "—";
            case "priorita":
                return d(f.root - Listino.ANCHOR, 1) + " [" + d(f.rootLow - Listino.ANCHOR, 1) + "–" + d(f.rootHigh - Listino.ANCHOR, 1)
                        + "] HIT rispetto alla priorità 1";
            case "decadimento":
                return f.root > 0 ? d(10 / f.root, 2) + " [" + d(10 / Math.max(f.rootHigh, 1e-9), 2) + "–"
                        + (f.rootLow > 0 ? d(10 / f.rootLow, 2) : "∞") + "] V per 1 L" : "—";
            default:
                return d(f.root, 1) + " [" + d(f.rootLow, 1) + "–" + d(f.rootHigh, 1) + "] HIT equivalenti";
        }
    }

    /** Fuori intervallo la retta non ha una radice dentro la griglia: si scrive solo il lato. */
    static String bound(Listino.BisectionResult r) {
        if (r.status.startsWith("sotto")) return "≤ " + (r.deadLow != null ? r.def.playedLow : r.def.lo);
        if (r.status.startsWith("oltre")) return "≥ " + r.def.hi;
        return null;
    }

    static String grid(Listino.BisectionResult r) {
        List<String> parts = new ArrayList<>();
        for (Listino.Point p : r.grid) parts.add(Bench.plain(p.x) + ": " + d(p.share(), 3));
        return String.join(" · ", parts);
    }

    static String markdown(Head head, List<Listino.BisectionResult> bisections, List<Listino.CurveResult> curves,
                           List<BoundCap.Result> cap) {
        StringBuilder o = new StringBuilder();
        o.append("# Listino di potenza SB-10a — misure\n\n");
        if (head.note != null) o.append("> ").append(head.note).append("\n\n");
        o.append("| Voce | Valore |\n|---|---|\n");
        o.append("| Banco | ").append(Listino.VERSION).append(" su ").append(Bench.VERSION).append(" |\n");
        o.append("| Bozza base | `").append(head.draft).append("` |\n");
        o.append("| SHA-256 | `").append(head.sha256).append("` |\n");
        if (Listino.ANCHOR != Listino.DEFAULT_ANCHOR) o.append("| Àncora | ").append(Listino.ANCHOR).append(" HIT (SB-11a, -Dsim.listinoAnchor; SB-10a e SB-10b: ").append(Listino.DEFAULT_ANCHOR).append(") |\n");
        o.append("| Misure | ").append(head.selection).append(" |\n");
        o.append("| Stili | ").append(String.join(", ", head.styles)).append(", stesso stile sui due lati salvo dove indicato |\n");
        o.append("| Bisezione | ").append(head.params.bisectGames).append(" partite per stile e punto, semi da ").append(Listino.BISECT_SEED).append(" |\n");
        o.append("| Griglia | 5 punti, ").append(head.params.gridGames).append(" partite per stile e punto, semi da ").append(Listino.GRID_SEED)
                .append(" (disgiunti) |\n");
        o.append("| Curve | ").append(head.params.curveGames).append(" partite per stile e cella, semi da ").append(Listino.CURVE_SEED).append(" |\n");
        o.append("| Tempi | nel file `.tempi.txt` accanto |\n\n");
        o.append("Quota: vittorie / (vittorie + sconfitte) del mazzo sonda, patte escluse, Wilson al 95%. Punto di indifferenza: radice della retta ")
                .append("pesata fra quota e x sulla griglia, intervallo al 95% col metodo delta (bersaglio compreso nei non specchi). Ogni bozza derivata ")
                .append("ha il suo SHA-256 nel file di dati. I valori misurano come giocano **questi bot**.\n");
        String group = null;
        for (Listino.BisectionResult r : bisections) {
            if (!r.def.group.equals(group)) {
                group = r.def.group;
                o.append("\n## ").append(title(group)).append("\n\n");
                o.append("| misura | contesto | sonda | x di indifferenza [IC 95%] | lettura | pendenza (quota per x) | x per stile (aggr./prud./ris.) | griglia | stato |\n");
                o.append("|---|---|---|---|---|---:|---|---|---|\n");
            }
            Listino.Fit f = r.fit;
            List<String> styles = new ArrayList<>();
            for (Listino.Fit s : r.byStyle.values()) styles.add(s.flat ? "piatta" : d(s.root, 1));
            o.append("| ").append(r.def.id).append(" | ").append(r.def.context).append(" | ").append(r.def.question).append(" | ")
                    .append(bound(r) != null ? bound(r) : f.flat ? "pendenza non distinguibile da zero"
                            : d(f.root, 1) + " [" + d(f.rootLow, 1) + "–" + d(f.rootHigh, 1) + "]")
                    .append(" | ").append(bound(r) != null || f.flat ? "—" : reading(r)).append(" | ").append(d(f.b, 4)).append(" | ")
                    .append(String.join(" / ", styles)).append(" | ").append(grid(r)).append(" | ").append(r.status).append(" |\n");
        }
        Map<String, double[]> slopes = healthSlopes(curves);
        group = null;
        for (Listino.CurveResult r : curves) {
            if (!r.def.group.equals(group)) {
                group = r.def.group;
                o.append("\n## ").append(title(group)).append("\n\n");
                if (group.equals("salute")) {
                    o.append("Pendenza per contesto, retta per (0; 0,5): ");
                    List<String> parts = new ArrayList<>();
                    slopes.forEach((ctx, s) -> parts.add(ctx + " " + d(s[0] * 100, 2) + " ± " + d(Listino.Z_SE * s[1] * 100, 2) + " punti per 1 HEALTH"));
                    o.append(String.join("; ", parts)).append(".\n\n");
                }
                o.append("| cella | contesto | variante | quota sonda [IC 95%] | patte | giocate per partita | quota delle mosse | salute equivalente per partita | per uso |\n");
                o.append("|---|---|---|---|---:|---:|---:|---:|---:|\n");
            }
            Listino.Point p = r.point;
            double perGame = Bench.ratio(p.watchedPlays, p.probeGames), moveShare = Bench.ratio(p.watchedPlays, p.plays);
            double[] k = slopes.get(r.def.context);
            boolean saturated = p.share() < SATURATED || p.share() > 1 - SATURATED;
            double heq = k == null || saturated ? Double.NaN : (p.share() - 0.5) / k[0];
            o.append("| ").append(r.def.id).append(" | ").append(r.def.context).append(" | ").append(r.def.label).append(" | ").append(share(p))
                    .append(" | ").append(d(Bench.ratio(p.draws, p.games) * 100, 1)).append("% | ")
                    .append(r.def.group.equals("salute") || r.def.group.equals("allerta") ? "—" : d(perGame, 2)).append(" | ")
                    .append(r.def.group.equals("salute") || r.def.group.equals("allerta") ? "—" : d(moveShare * 100, 1) + "%").append(" | ")
                    .append(r.def.group.equals("salute") ? "—" : saturated ? "saturato" : d(heq, 1)).append(" | ")
                    .append((r.def.group.equals("bound") || r.def.group.equals("tettopartita") || r.def.group.equals("tettostarter")) && perGame > 0
                            ? d(heq / perGame, 2) : "—").append(" |\n");
        }
        if (cap != null && !cap.isEmpty()) {
            o.append("\n## Tetto delle bound contro il manichino\n\nParametri: ").append(head.cap.describe()).append(".\n\n");
            o.append("| bound | personaggio | valore per uso (medio / massimo) | danno | parato | guadagni pesati | viola | motivi |\n|---|---|---:|---:|---:|---:|---|---|\n");
            for (BoundCap.Result r : cap)
                o.append("| ").append(r.bound).append(" | ").append(r.character).append(" | ").append(d(r.mean(), 2)).append(" / ")
                        .append(d(r.max(), 2)).append(" | ").append(d(avg(r.damage), 2)).append(" | ").append(d(avg(r.prevented), 2)).append(" | ")
                        .append(d(avg(r.gainValue), 2)).append(" | ").append(r.violates() ? "sì" : "no").append(" | ")
                        .append(r.violates() ? r.reasons(head.cap) : String.join(", ", r.notes)).append(" |\n");
        }
        return o.toString();
    }

    static double avg(double[] v) {
        double s = 0;
        for (double x : v) s += x;
        return v.length == 0 ? 0 : s / v.length;
    }

    static String title(String group) {
        switch (group) {
            case "costo": return "Danno per unità di risorsa pagata";
            case "tipo": return "Tipi di danno";
            case "priorita": return "Priorità";
            case "veleno": return "T al bersaglio";
            case "decadimento": return "L che decade";
            case "nonspecchio": return "Non specchio";
            case "carte": return "Carte attuali: gemella a solo danno";
            case "salute": return "Salute iniziale (moneta comune)";
            case "allerta": return "A iniziale (precedenza)";
            case "bound": return "Bound: una sonda e una nulla contro due nulle";
            case "slot": return "Slot della mano";
            case "handicap": return "Handicap per il non specchio";
            case "tettopartita": return "Tetto in partita (SB-10b): bound da 4 unità e una nulla contro due nulle";
            case "tettostarter": return "Tetto sugli starter veri (SB-11b): ogni bound, o una sonda, e una nulla contro due nulle";
            default: return group;
        }
    }

    static String json(Head head, List<Listino.BisectionResult> bisections, List<Listino.CurveResult> curves, List<BoundCap.Result> cap)
            throws Exception {
        Map<String, Object> root = new LinkedHashMap<>();
        Map<String, Object> h = new LinkedHashMap<>();
        h.put("banco", Listino.VERSION);
        h.put("bozza", head.draft);
        h.put("sha256", head.sha256);
        if (Listino.ANCHOR != Listino.DEFAULT_ANCHOR) h.put("ancora", Listino.ANCHOR);
        h.put("misure", head.selection);
        h.put("stili", head.styles);
        h.put("partiteBisezione", head.params.bisectGames);
        h.put("partiteGriglia", head.params.gridGames);
        h.put("partiteCurve", head.params.curveGames);
        h.put("semeBisezione", Listino.BISECT_SEED);
        h.put("semeGriglia", Listino.GRID_SEED);
        h.put("semeCurve", Listino.CURVE_SEED);
        if (head.note != null) h.put("nota", head.note);
        root.put("intestazione", h);
        List<Object> list = new ArrayList<>();
        for (Listino.BisectionResult r : bisections) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", r.def.id);
            m.put("gruppo", r.def.group);
            m.put("contesto", r.def.context);
            m.put("sonda", r.def.question);
            m.put("sha256Bozza", r.sha256);
            m.put("tuttiGliAbbinamenti", r.def.allPairs);
            if (r.def.resource != null) {
                m.put("risorsa", BoundCap.letter(r.def.resource));
                m.put("costo", r.def.cost);
            }
            if (r.def.card != null) m.put("carta", r.def.card);
            m.put("stato", r.status);
            m.put("radice", fit(r.fit));
            Map<String, Object> styles = new LinkedHashMap<>();
            r.byStyle.forEach((s, f) -> styles.put(s, fit(f)));
            m.put("perStile", styles);
            m.put("lettura", r.fit.flat ? null : reading(r));
            m.put("ricerca", points(r.search));
            if (r.deadLow != null) m.put("cartaMorta", point(r.deadLow));
            m.put("griglia", points(r.grid));
            m.put("partite", r.games());
            list.add(m);
        }
        root.put("bisezioni", list);
        Map<String, double[]> slopes = healthSlopes(curves);
        Map<String, Object> sl = new LinkedHashMap<>();
        slopes.forEach((ctx, s) -> sl.put(ctx, List.of(Bench.round(s[0]), Bench.round(s[1]))));
        root.put("pendenzaSalute", sl);
        List<Object> cl = new ArrayList<>();
        for (Listino.CurveResult r : curves) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", r.def.id);
            m.put("gruppo", r.def.group);
            m.put("contesto", r.def.context);
            m.put("variante", r.def.label);
            m.put("valore", Bench.round(r.def.value));
            m.put("sha256Bozza", r.sha256);
            m.put("punto", point(r.point));
            cl.add(m);
        }
        root.put("curve", cl);
        if (cap != null) {
            List<Object> caps = new ArrayList<>();
            for (BoundCap.Result r : cap) caps.add(BoundCap.json(r, head.cap));
            root.put("tetto", caps);
        }
        return Bench.pretty(root);
    }

    static Map<String, Object> fit(Listino.Fit f) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("x", Double.isNaN(f.root) ? null : Bench.round(f.root));
        m.put("basso", Double.isNaN(f.rootLow) ? null : Bench.round(f.rootLow));
        m.put("alto", Double.isNaN(f.rootHigh) ? null : Bench.round(f.rootHigh));
        m.put("pendenza", Bench.round(f.b));
        m.put("zPendenza", Bench.round(f.slopeZ));
        m.put("piatta", f.flat);
        return m;
    }

    static List<Object> points(List<Listino.Point> points) {
        List<Object> out = new ArrayList<>();
        for (Listino.Point p : points) out.add(point(p));
        return out;
    }

    static Map<String, Object> point(Listino.Point p) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("x", Bench.round(p.x));
        m.put("vittorie", p.wins);
        m.put("sconfitte", p.losses);
        m.put("patte", p.draws);
        m.put("partite", p.games);
        m.put("quota", Bench.round(p.share()));
        m.put("ic", Bench.rounded(p.ci()));
        m.put("bersaglio", Bench.round(p.target));
        m.put("giocateOsservate", p.watchedPlays);
        m.put("giocateTotali", p.plays);
        m.put("partiteSonda", p.probeGames);
        Map<String, Object> s = new LinkedHashMap<>();
        p.byStyle.forEach((k, v) -> s.put(k, List.of(v[0], v[1])));
        m.put("perStile", s);
        if (p.baseline != null) {
            Map<String, Object> b = new LinkedHashMap<>();
            p.baseline.forEach((k, v) -> b.put(k, List.of(v[0], v[1])));
            m.put("base", b);
        }
        return m;
    }
}
