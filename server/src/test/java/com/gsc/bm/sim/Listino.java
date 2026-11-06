package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.bot.BotPolicy;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

/**
 * SB-10a: listino di potenza. Duelli fra un mazzo con una carta sonda a numero variabile e un mazzo di riferimento, uguali in tutto
 * il resto; il numero si cerca per bisezione fino al punto di indifferenza (quota del 50% negli specchi, quota del riferimento nei
 * non specchi), poi una griglia di conferma su semi disgiunti e una retta pesata danno la stima con l'intervallo. Le curve misurano
 * invece la quota a valori fissi: salute e allerta iniziali, bound, slot occupati. Vive nei test: nessuna carta del Set Base è qui.
 */
final class Listino {
    static final String VERSION = "sb-10a/1";
    static final String BASE = "/sb-10a/listino-base.json";
    static final List<String> STYLES = List.of("aggressivo", "prudente", "risorse");
    static final long BISECT_SEED = 8_000_000L, GRID_SEED = 8_500_000L, CURVE_SEED = 8_200_000L;
    /** Il valore di SB-10a e SB-10b dell'àncora, in HIT. */
    static final int DEFAULT_ANCHOR = 10;
    /**
     * L'àncora: gratuita, priorità 1, 10 HIT (SB-11a: parametro, -Dsim.listinoAnchor; D33 prezza le carte rispetto a una gratuita da circa
     * 6–8 HIT, quindi 7 per misurare con quell'unità). Occupa i quattro slot sonda dei contesti (due carte, due copie ciascuna). Con
     * il valore di difetto la bozza base è il file di SB-10a, byte per byte, e i rapporti non cambiano.
     */
    static final int ANCHOR = checkedAnchor(Integer.getInteger("sim.listinoAnchor", DEFAULT_ANCHOR));
    /**
     * Se a x = 0 la gemella vince senza essere mai giocata, fa da carta morta e la curva è a U (sale di nuovo solo quando la gemella
     * spreca risorse): la ricerca riparte da qui, un danno che i bot giocano.
     */
    static final int TWIN_LOW = 10;
    /** Salute tolta a Spazienzio nei non specchi contro Mara, scelta con la curva «handicap». */
    static final int HANDICAP = Integer.getInteger("sim.listinoHandicap", 25);
    static final String SLOT1 = "listino.Ancora1", SLOT2 = "listino.Ancora2";
    static final String NEUTRO = "ctx-neutro", SPAZIENZIO = "ctx-spazienzio", TOSSICO = "ctx-tossico", MARA = "ctx-mara", ROCCO = "ctx-rocco";
    static final List<String> GROUPS = List.of("costo", "tipo", "priorita", "veleno", "decadimento", "nonspecchio", "carte",
            "salute", "allerta", "bound", "slot", "handicap");
    /** Gruppi aggiunti dopo SB-10a: si chiedono per nome e non entrano in «all», così la misura di SB-10a resta la stessa. */
    static final List<String> EXTRA_GROUPS = List.of("tettopartita");
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final double Z = 1.959963984540054;
    /** Lo stesso quantile, per il rapporto. */
    static final double Z_SE = Z;

    /** Partite per stile: punti della bisezione, punti della griglia, celle delle curve. */
    static final class Params {
        final int bisectGames, gridGames, curveGames, threads;

        Params(int bisectGames, int gridGames, int curveGames, int threads) {
            this.bisectGames = bisectGames;
            this.gridGames = gridGames;
            this.curveGames = curveGames;
            this.threads = Math.max(1, threads);
        }

        static Params fromSystem(int threads) {
            return new Params(Integer.getInteger("sim.listinoBisect", 400), Integer.getInteger("sim.listinoGrid", 2000),
                    Integer.getInteger("sim.listinoCurve", 2000), threads);
        }
    }

    /** Una bozza derivata e i suoi mazzi: sonda, riferimento e, nei non specchi, la base che fissa il bersaglio. */
    static final class Variant {
        final JsonNode root;
        final String probe, reference, baseline;
        final List<String> watched;

        Variant(JsonNode root, String probe, String reference, String baseline, List<String> watched) {
            this.root = root;
            this.probe = probe;
            this.reference = reference;
            this.baseline = baseline;
            this.watched = watched;
        }
    }

    interface Builder {
        Variant build(int x) throws Exception;
    }

    /** Una ricerca del punto di indifferenza sul numero x della sonda; la quota della sonda cresce con x. */
    static final class Bisection {
        final String id, group, context, question, reading;
        final int lo, hi, step;
        final boolean allPairs;
        final Builder builder;
        /** Per la lettura: risorsa e costo della sonda, se è una domanda di costo. */
        Resource resource;
        int cost;
        String card;
        /** Vedi TWIN_LOW: da dove ripartire se all'estremo basso la sonda non è mai giocata e vale già più del riferimento. -1: mai. */
        int playedLow = -1;

        Bisection(String id, String group, String context, String question, String reading, int lo, int hi, int step, boolean allPairs,
                  Builder builder) {
            this.id = id;
            this.group = group;
            this.context = context;
            this.question = question;
            this.reading = reading;
            this.lo = lo;
            this.hi = hi;
            this.step = step;
            this.allPairs = allPairs;
            this.builder = builder;
        }
    }

    /** Una cella di curva: la sonda contro il riferimento a un valore fisso. */
    static final class Curve {
        final String id, group, context, label;
        final double value;
        final Builder builder;

        Curve(String id, String group, String context, String label, double value, Builder builder) {
            this.id = id;
            this.group = group;
            this.context = context;
            this.label = label;
            this.value = value;
            this.builder = builder;
        }
    }

    /** Un punto misurato: esiti della sonda, per stile, e giocate delle carte osservate. */
    static final class Point {
        final double x;
        long wins, losses, draws, games, plays, watchedPlays, probeGames;
        final Map<String, long[]> byStyle = new LinkedHashMap<>(); // vittorie, sconfitte
        double target = 0.5, targetVar = 0;
        /** Nei non specchi: vittorie e sconfitte della base contro il riferimento, per stile. */
        Map<String, long[]> baseline;

        Point(double x) { this.x = x; }

        long decisive() { return wins + losses; }

        double share() { return Bench.ratio(wins, decisive()); }

        double[] ci() { return Bench.wilson(wins, decisive()); }
    }

    /** Retta pesata di quota su x e radice al bersaglio, con l'intervallo dal metodo delta. */
    static final class Fit {
        final double a, b, varA, varB, cov, root, rootLow, rootHigh, slopeZ;
        final boolean flat;

        Fit(double a, double b, double varA, double varB, double cov, double target, double targetVar) {
            this.a = a;
            this.b = b;
            this.varA = varA;
            this.varB = varB;
            this.cov = cov;
            this.slopeZ = varB > 0 ? b / Math.sqrt(varB) : 0;
            this.flat = !(slopeZ > Z);
            this.root = b == 0 ? Double.NaN : (target - a) / b;
            double var = (varA + root * root * varB + 2 * root * cov + targetVar) / (b * b);
            double half = Z * Math.sqrt(Math.max(var, 0));
            this.rootLow = root - half;
            this.rootHigh = root + half;
        }

        /** Minimi quadrati pesati, con la varianza di ogni punto dalla quota media della griglia. */
        static Fit of(double[] xs, long[] wins, long[] decisive, double target, double targetVar) {
            long w = 0, n = 0;
            for (int i = 0; i < xs.length; i++) {
                w += wins[i];
                n += decisive[i];
            }
            double pBar = Math.min(0.99, Math.max(0.01, Bench.ratio(w, n)));
            double s = 0, sx = 0, sy = 0, sxx = 0, sxy = 0;
            for (int i = 0; i < xs.length; i++) {
                if (decisive[i] == 0) continue;
                double weight = decisive[i] / (pBar * (1 - pBar)), y = (double) wins[i] / decisive[i];
                s += weight;
                sx += weight * xs[i];
                sy += weight * y;
                sxx += weight * xs[i] * xs[i];
                sxy += weight * xs[i] * y;
            }
            double delta = s * sxx - sx * sx;
            if (delta <= 0) return new Fit(Double.NaN, 0, 0, 0, 0, target, targetVar);
            double b = (s * sxy - sx * sy) / delta, a = (sxx * sy - sx * sxy) / delta;
            return new Fit(a, b, sxx / delta, s / delta, -sx / delta, target, targetVar);
        }
    }

    /** L'esito di una bisezione. */
    static final class BisectionResult {
        final Bisection def;
        final List<Point> search = new ArrayList<>(), grid = new ArrayList<>();
        String status = "dentro l'intervallo";
        /** Il punto a x = lo, se la sonda non vi è mai giocata e vince: la carta vale meno di una carta morta. */
        Point deadLow;
        Fit fit;
        final Map<String, Fit> byStyle = new LinkedHashMap<>();
        String sha256;

        BisectionResult(Bisection def) { this.def = def; }

        long games() {
            long g = 0;
            for (Point p : search) g += p.games;
            for (Point p : grid) g += p.games;
            return g;
        }
    }

    static final class CurveResult {
        final Curve def;
        Point point;
        String sha256;

        CurveResult(Curve def) { this.def = def; }
    }

    final Draft base;
    final Params params;
    final Map<String, BotPolicy> styles;

    Listino(Draft base, Params params, Map<String, BotPolicy> styles) {
        this.base = base;
        this.params = params;
        this.styles = styles;
    }

    static int checkedAnchor(int value) {
        if (value < 1 || value > 100) throw new IllegalArgumentException("sim.listinoAnchor vale " + value + ": atteso un intero da 1 a 100 (HIT)");
        return value;
    }

    /** La bozza base di SB-10a; con un'àncora diversa dal difetto, la stessa con le due carte àncora a quel danno. */
    static Draft baseDraft() throws Exception {
        Draft base = Draft.fromClasspath(BASE);
        return ANCHOR == DEFAULT_ANCHOR ? base : withAnchor(base, ANCHOR);
    }

    /** Le carte àncora (danno e testo nominale) a {@code hit} HIT, il resto della bozza com'è. */
    static Draft withAnchor(Draft base, int hit) {
        ObjectNode root = (ObjectNode) base.json();
        for (String binding : List.of(SLOT1, SLOT2)) {
            ObjectNode card = null;
            for (JsonNode candidate : root.get("cards")) if (candidate.get("binding").asText().equals(binding)) card = (ObjectNode) candidate;
            if (card == null) throw new IllegalStateException(BASE + ": carta àncora assente: " + binding);
            ((ObjectNode) card.get("target").get(0)).put("amount", hit);
            ((ObjectNode) card.get("gui")).put("damageAmount", "HIT " + hit);
        }
        return base.derive("derivata ancora " + hit + " HIT", root);
    }

    // ---- esecuzione ----

    Point evaluate(Variant v, int gamesPerStyle, long seed, boolean allPairs, double x) throws Exception {
        Draft draft = base.derive(base.source + " (sonda)", v.root);
        Point point = new Point(x);
        List<Bench.Cell> cells = cells(v.probe, v.reference, allPairs);
        play(draft, cells, gamesPerStyle, seed);
        for (Bench.Cell cell : cells) {
            point.wins += cell.tally.aWins;
            point.losses += cell.tally.bWins;
            point.draws += cell.tally.draws;
            point.games += cell.tally.games;
            point.probeGames += cell.a.games;
            if (cell.styleA.equals(cell.styleB)) point.byStyle.put(cell.styleA, new long[]{cell.tally.aWins, cell.tally.bWins});
            for (Map.Entry<String, Bench.CardStat> e : cell.a.cards.entrySet()) {
                point.plays += e.getValue().plays;
                if (v.watched.contains(e.getKey())) point.watchedPlays += e.getValue().plays;
            }
        }
        if (v.baseline != null) {
            List<Bench.Cell> base = cells(v.baseline, v.reference, allPairs);
            play(draft, base, gamesPerStyle, seed);
            long w = 0, l = 0;
            Map<String, long[]> byStyle = new LinkedHashMap<>();
            for (Bench.Cell cell : base) {
                w += cell.tally.aWins;
                l += cell.tally.bWins;
                point.games += cell.tally.games;
                if (cell.styleA.equals(cell.styleB)) byStyle.put(cell.styleA, new long[]{cell.tally.aWins, cell.tally.bWins});
            }
            point.target = Bench.ratio(w, w + l);
            point.targetVar = w + l == 0 ? 0 : point.target * (1 - point.target) / (w + l);
            point.baseline = byStyle;
        }
        return point;
    }

    private List<Bench.Cell> cells(String a, String b, boolean allPairs) {
        List<Bench.Cell> cells = new ArrayList<>();
        for (String sa : STYLES) for (String sb : STYLES)
            if (allPairs || sa.equals(sb)) cells.add(new Bench.Cell(a, sa, b, sb));
        return cells;
    }

    private void play(Draft draft, List<Bench.Cell> cells, int games, long seed) throws Exception {
        List<String> decks = new ArrayList<>();
        for (Bench.Cell c : cells) {
            if (!decks.contains(c.deckA)) decks.add(c.deckA);
            if (!decks.contains(c.deckB)) decks.add(c.deckB);
        }
        Bench.Settings settings = new Bench.Settings(games, seed, decks, styles, 1, BoundCap.Params.DEFAULT, null);
        Bench.playCells(draft, settings, cells, draft);
    }

    BisectionResult bisect(Bisection def) throws Exception {
        BisectionResult r = new BisectionResult(def);
        r.sha256 = sha(def.builder.build(def.lo));
        int lo = def.lo, hi = def.hi;
        Point pLo = point(def, lo, params.bisectGames, BISECT_SEED), pHi = point(def, hi, params.bisectGames, BISECT_SEED);
        r.search.add(pLo);
        r.search.add(pHi);
        if (pLo.share() > pLo.target && pLo.watchedPlays == 0 && def.playedLow > lo) {
            r.deadLow = pLo;
            lo = def.playedLow;
            pLo = point(def, lo, params.bisectGames, BISECT_SEED);
            r.search.add(pLo);
        }
        double center;
        if (pLo.share() > pLo.target) {
            r.status = "sotto l'intervallo: già a x = " + lo + " la sonda vale più del riferimento"
                    + (r.deadLow != null ? " (e a x = " + def.lo + " la sonda, mai giocata, vale più della carta)" : "");
            center = lo + 2 * def.step;
        } else if (pHi.share() < pHi.target) {
            r.status = "oltre l'intervallo: anche a x = " + hi + " la sonda vale meno del riferimento";
            center = hi - 2 * def.step;
        } else {
            while (hi - lo > def.step) {
                int mid = lo + Math.max(1, ((hi - lo) / 2 / def.step)) * def.step;
                if (mid >= hi) mid = hi - 1;
                Point p = point(def, mid, params.bisectGames, BISECT_SEED);
                r.search.add(p);
                if (p.share() >= p.target) {
                    hi = mid;
                    pHi = p;
                } else {
                    lo = mid;
                    pLo = p;
                }
            }
            double dLo = pLo.target - pLo.share(), dHi = pHi.share() - pHi.target;
            center = dLo + dHi <= 0 ? (lo + hi) / 2.0 : lo + (hi - lo) * dLo / (dLo + dHi);
            if (r.deadLow != null) r.status = "dentro l'intervallo da x = " + def.playedLow + "; a x = " + def.lo
                    + " la sonda, mai giocata, vale più della carta";
        }
        int c = (int) Math.round(center / def.step) * def.step;
        int floor = r.deadLow != null ? def.playedLow : def.lo;
        c = Math.max(floor + 2 * def.step, Math.min(def.hi - 2 * def.step, c));
        for (int k = -2; k <= 2; k++) r.grid.add(point(def, c + k * def.step, params.gridGames, GRID_SEED));
        r.fit = fit(r.grid, null);
        for (String style : STYLES) r.byStyle.put(style, fit(r.grid, style));
        return r;
    }

    private Point point(Bisection def, int x, int games, long seed) throws Exception {
        return evaluate(def.builder.build(x), games, seed, def.allPairs, x);
    }

    private Fit fit(List<Point> grid, String style) {
        int n = grid.size();
        double[] xs = new double[n];
        long[] wins = new long[n], decisive = new long[n];
        long tw = 0, tl = 0;
        for (int i = 0; i < n; i++) {
            Point p = grid.get(i);
            xs[i] = p.x;
            if (style == null) {
                wins[i] = p.wins;
                decisive[i] = p.decisive();
            } else {
                long[] s = p.byStyle.get(style);
                wins[i] = s == null ? 0 : s[0];
                decisive[i] = s == null ? 0 : s[0] + s[1];
            }
            Map<String, long[]> base = p.baseline;
            if (base != null) {
                if (style == null) {
                    for (long[] s : base.values()) { tw += s[0]; tl += s[1]; }
                } else if (base.get(style) != null) {
                    tw += base.get(style)[0];
                    tl += base.get(style)[1];
                }
            }
        }
        double target = 0.5, targetVar = 0;
        if (tw + tl > 0) {
            target = (double) tw / (tw + tl);
            targetVar = target * (1 - target) / (tw + tl);
        }
        return Fit.of(xs, wins, decisive, target, targetVar);
    }

    CurveResult curve(Curve def) throws Exception {
        CurveResult r = new CurveResult(def);
        Variant v = def.builder.build(0);
        r.sha256 = sha(v);
        r.point = evaluate(v, params.curveGames, CURVE_SEED, false, def.value);
        return r;
    }

    private String sha(Variant v) throws Exception {
        return Bench.sha256(base.derive("derivata", v.root));
    }

    /** Esegue le misure scelte in parallelo, una per thread; i risultati non dipendono dall'ordine. */
    Map<String, Object> run(List<Bisection> bisections, List<Curve> curves) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(params.threads);
        Map<String, Future<?>> futures = new LinkedHashMap<>();
        try {
            for (Bisection b : bisections) futures.put(b.id, pool.submit(() -> bisect(b)));
            for (Curve c : curves) futures.put(c.id, pool.submit(() -> curve(c)));
            Map<String, Object> out = new LinkedHashMap<>();
            for (Map.Entry<String, Future<?>> e : futures.entrySet()) out.put(e.getKey(), e.getValue().get());
            return out;
        } finally {
            pool.shutdownNow();
        }
    }

    // ---- bozze derivate ----

    static ObjectNode root(Draft base) { return (ObjectNode) base.json(); }

    static ObjectNode deck(ObjectNode root, String id) {
        for (JsonNode d : root.get("decks")) if (id.equals(d.get("id").asText())) return (ObjectNode) d;
        throw new IllegalArgumentException("mazzo assente: " + id);
    }

    static ObjectNode characterNode(ObjectNode root, String id) {
        for (JsonNode c : root.get("characters")) if (id.equals(c.get("id").asText())) return (ObjectNode) c;
        throw new IllegalArgumentException("personaggio assente: " + id);
    }

    static ObjectNode cardNode(ObjectNode root, String binding) {
        for (JsonNode c : root.get("cards")) if (binding.equals(c.get("binding").asText())) return (ObjectNode) c;
        throw new IllegalArgumentException("carta assente: " + binding);
    }

    /** Una copia del mazzo con un nuovo id, aggiunta alla bozza. */
    static ObjectNode copyDeck(ObjectNode root, String from, String id) {
        ObjectNode copy = deck(root, from).deepCopy();
        copy.put("id", id);
        ((ArrayNode) root.get("decks")).add(copy);
        return copy;
    }

    /** Mette la carta al posto di uno slot sonda (due copie), sommandola alle copie già nel mazzo. */
    static void slot(ObjectNode deck, String slot, String binding) {
        ObjectNode cards = (ObjectNode) deck.get("cards");
        int copies = cards.get(slot).asInt();
        cards.remove(slot);
        cards.put(binding, (cards.has(binding) ? cards.get(binding).asInt() : 0) + copies);
    }

    static ObjectNode step(String op) { return JSON.createObjectNode().put("op", op); }

    static ObjectNode damage(String type, int amount) { return step("damage").put("type", type).put("amount", amount); }

    static ObjectNode gain(Resource r, int amount) { return step("gain").put("resource", r.name()).put("amount", amount); }

    static ObjectNode guard(String name, String property, double factor) {
        return step("status").put("name", name).put("description", property + " ricevuto x" + factor).put("statusType", "GOOD")
                .put("flow", "INPUT").put("property", property).put("factor", factor).put("turns", 0);
    }

    /** Una carta a dati. Le voci descrittive sono quelle che i bot leggono: ruolo, guadagni, danno nominale. */
    static ObjectNode card(String binding, String kind, String name, String role, String gains, String damageType, int damageAmount,
                           String target, Map<Resource, Integer> cost, int priority, List<ObjectNode> self, List<ObjectNode> onTarget) {
        ObjectNode c = JSON.createObjectNode().put("binding", binding).put("kind", kind);
        c.putArray("targets").add(target);
        ObjectNode costs = c.putObject("cost");
        cost.forEach((r, n) -> costs.put(r.name(), n));
        c.put("priority", priority);
        if (!self.isEmpty()) self.forEach(c.putArray("self")::add);
        if (!onTarget.isEmpty()) onTarget.forEach(c.putArray("target")::add);
        ObjectNode gui = c.putObject("gui");
        gui.put("name", name).put("image", "no-img.png").put("role", role).put("gains", gains)
                .put("damage", damageType == null ? "—" : damageType)
                .put("damageAmount", damageType == null ? "—" : damageType + " " + damageAmount);
        return c;
    }

    static void add(ObjectNode root, ObjectNode card) { ((ArrayNode) root.get("cards")).add(card); }

    /** Due carte sonda uguali (1 e 2), così la sonda occupa i quattro slot con due copie ciascuna. */
    static void addPair(ObjectNode root, String binding, String name, java.util.function.Function<String[], ObjectNode> make) {
        for (int i = 1; i <= 2; i++) add(root, make.apply(new String[]{binding + i, name + " " + i}));
    }

    static String letter(Resource r) { return r == Resource.HEALTH ? "H" : BoundCap.letter(r); }

    /** Sonda nei quattro slot di un contesto, contro il contesto con l'àncora. Nei non specchi il riferimento è l'avversario. */
    Variant slotProbe(String context, String opponent, java.util.function.Function<String[], ObjectNode> make) {
        ObjectNode root = root(base);
        addPair(root, "listino.Sonda", "LISTINO SONDA", make);
        ObjectNode probe = copyDeck(root, context, "sonda");
        slot(probe, SLOT1, "listino.Sonda1");
        slot(probe, SLOT2, "listino.Sonda2");
        if (opponent == null) {
            copyDeck(root, context, "riferimento");
            return new Variant(root, "sonda", "riferimento", null, List.of("listino.Sonda1", "listino.Sonda2"));
        }
        copyDeck(root, opponent, "riferimento");
        copyDeck(root, context, "base");
        return new Variant(root, "sonda", "riferimento", "base", List.of("listino.Sonda1", "listino.Sonda2"));
    }

    static ObjectNode hitter(String[] id, Map<Resource, Integer> cost, int priority, String type, int x) {
        return card(id[0], "ACTION", id[1], "DAMAGE", "—", type, x, "OPPONENT", cost, priority, List.of(),
                x > 0 ? List.of(damage(type, x)) : List.of());
    }

    // ---- le domande ----

    List<Bisection> bisections() throws Exception {
        List<Bisection> list = new ArrayList<>();
        // Costo: c della risorsa per x HIT, contro l'àncora gratuita (10 HIT di difetto).
        Object[][] costs = {
                {Resource.VIOLENCE, SPAZIENZIO, new int[]{10, 20, 30}}, {Resource.VIOLENCE, NEUTRO, new int[]{10, 20, 30}},
                {Resource.ALERTNESS, MARA, new int[]{10, 20}}, {Resource.ALERTNESS, NEUTRO, new int[]{10, 20}},
                {Resource.ALERTNESS, SPAZIENZIO, new int[]{10}},
                {Resource.TOXICITY, TOSSICO, new int[]{10, 20}}, {Resource.ALCOHOL, NEUTRO, new int[]{5, 10}},
                {Resource.ALCOHOL, SPAZIENZIO, new int[]{5}},
                {Resource.HEALTH, ROCCO, new int[]{10, 20}}, {Resource.HEALTH, NEUTRO, new int[]{10, 20}}};
        for (Object[] row : costs) {
            Resource r = (Resource) row[0];
            String ctx = (String) row[1];
            for (int c : (int[]) row[2]) {
                boolean pairs = c == 20 && (r == Resource.VIOLENCE && ctx.equals(SPAZIENZIO) || r == Resource.ALERTNESS && ctx.equals(MARA)
                        || r == Resource.HEALTH && ctx.equals(ROCCO));
                Bisection b = new Bisection("costo-" + letter(r) + c + "-" + ctx.substring(4), "costo", ctx,
                        "Sonda: costo " + c + " " + letter(r) + ", priorità 1, x HIT", "danni per unità = (x − " + ANCHOR + ") / " + c,
                        0, ANCHOR + 5 * Math.max(c, 10), c >= 20 ? 3 : 2, pairs,
                        x -> slotProbe(ctx, null, id -> hitter(id, Map.of(r, c), 1, "HIT", x)));
                b.resource = r;
                b.cost = c;
                list.add(b);
            }
        }
        // Tipo di danno: x CUT o x POISON gratuiti contro l'àncora gratuita.
        for (String ctx : List.of(SPAZIENZIO, MARA, ROCCO, NEUTRO))
            for (String type : List.of("CUT", "POISON"))
                list.add(new Bisection("tipo-" + type + "-" + ctx.substring(4), "tipo", ctx, "Sonda: gratuita, priorità 1, x " + type,
                        "1 " + type + " vale " + ANCHOR + " / x HIT", 0, 30, 1, false,
                        x -> slotProbe(ctx, null, id -> hitter(id, Map.of(), 1, type, x))));
        // Priorità: x HIT gratuiti a priorità 0 o 2 contro l'àncora a priorità 1.
        for (String ctx : List.of(SPAZIENZIO, MARA, NEUTRO))
            for (int p : new int[]{0, 2})
                list.add(new Bisection("priorita-" + p + "-" + ctx.substring(4), "priorita", ctx, "Sonda: gratuita, priorità " + p + ", x HIT",
                        "un punto di priorità vale ±(x − " + ANCHOR + ") HIT", 0, 30, 1, false,
                        x -> slotProbe(ctx, null, id -> hitter(id, Map.of(), p, "HIT", x))));
        // Veleno: 5 HIT e x T al bersaglio, gratuita, contro l'àncora. I 5 HIT fanno giocare la sonda: i bot non leggono T sul bersaglio.
        for (String ctx : List.of(SPAZIENZIO, MARA, NEUTRO, TOSSICO))
            list.add(new Bisection("veleno-" + ctx.substring(4), "veleno", ctx, "Sonda: gratuita, priorità 1, 5 HIT e +x T al bersaglio",
                    "1 T al bersaglio vale 5 / x HIT", 0, 40, 2, false,
                    x -> slotProbe(ctx, null, id -> card(id[0], "ACTION", id[1], "DAMAGE", "—", "HIT", 5, "OPPONENT", Map.of(), 1,
                            List.of(), x > 0 ? List.of(damage("HIT", 5), gain(Resource.TOXICITY, x)) : List.of(damage("HIT", 5))))));
        // L che decade: +x L contro +10 V, con e senza una spesa dedicata da 10 per 25 HIT.
        list.add(new Bisection("decadimento-spesa-neutro", "decadimento", NEUTRO,
                "Sonda: 2 × (+x L) e 2 × (10 L → 25 HIT) contro 2 × (+10 V) e 2 × (10 V → 25 HIT)", "1 L vale 10 / x V",
                0, 40, 2, false, x -> decay(x, true)));
        list.add(new Bisection("decadimento-neutro", "decadimento", NEUTRO, "Sonda: 2 × (+x L) contro 2 × (+10 V), spese del contesto",
                "1 L vale 10 / x V", 0, 40, 2, false, x -> decay(x, false)));
        // Non specchio: Spazienzio con la sonda contro Mara, bersaglio la quota di Spazienzio con l'àncora. Spazienzio parte con
        // HANDICAP salute in meno, scelto con la curva «handicap» perché la base stia vicino al 50%, dove la misura vede.
        String handicap = " (Spazienzio con " + HANDICAP + " HEALTH in meno)";
        for (int c : new int[]{10, 20}) {
            Bisection ns = new Bisection("nonspecchio-V" + c + "-spazienzio-mara", "nonspecchio", SPAZIENZIO,
                    "Sonda: costo " + c + " V, priorità 1, x HIT; Spazienzio contro Mara" + handicap, "danni per unità = (x − " + ANCHOR + ") / " + c,
                    0, ANCHOR + 5 * c, c >= 20 ? 3 : 2, false,
                    x -> handicapProbe(id -> hitter(id, Map.of(Resource.VIOLENCE, c), 1, "HIT", x)));
            ns.resource = Resource.VIOLENCE;
            ns.cost = c;
            list.add(ns);
        }
        list.add(new Bisection("nonspecchio-CUT-spazienzio-mara", "nonspecchio", SPAZIENZIO, "Sonda: gratuita, priorità 1, x CUT; Spazienzio contro Mara" + handicap,
                "1 CUT vale " + ANCHOR + " / x HIT", 0, 30, 1, false,
                x -> handicapProbe(id -> hitter(id, Map.of(), 1, "CUT", x))));
        list.add(new Bisection("nonspecchio-CUT-mara-spazienzio", "nonspecchio", MARA, "Sonda: gratuita, priorità 1, x CUT; Mara contro Spazienzio" + handicap,
                "1 CUT vale " + ANCHOR + " / x HIT", 0, 30, 1, false,
                x -> handicapProbeMara(id -> hitter(id, Map.of(), 1, "CUT", x))));
        // Carte attuali: la gemella con lo stesso costo e la stessa priorità e x HIT, contro la carta.
        String[] spazienzio = {"bruiser.Glare", "bruiser.MadeOfStone", "bruiser.CantFeelAnything", "bruiser.HealingBlow", "bruiser.SickeningBlow",
                "bruiser.StunningBlow", "bruiser.ExtremelyViolentBlow", "bruiser.SeagullFly", "bruiser.SuperImpact", "bruiser.YouStop",
                "bruiser.WhatchaDoin", "bruiser.BadEducation", "bruiser.BreakYourToy"};
        String[] tossico = {"junkie.MethDrivenRage", "junkie.Cough", "junkie.GoingBerserk", "junkie.PervertedMetabolism", "junkie.EverythingIsDrug",
                "junkie.AmphetamineReflexes", "junkie.ToxicBloodDrain", "junkie.BadTrip", "junkie.BeggingMoney", "junkie.LethalHeroinDose"};
        for (String[] group : new String[][]{spazienzio, tossico}) {
            String ctx = group == spazienzio ? SPAZIENZIO : TOSSICO;
            for (String binding : group) {
                Card card = base.card(binding);
                Map<Resource, Integer> cost = new TreeMap<>(card.getCost());
                int priority = card.getPriority();
                String costText = cost.isEmpty() ? "gratuita" : costText(cost);
                Bisection b = new Bisection("carta-" + binding.substring(binding.indexOf('.') + 1), "carte", ctx,
                        "Gemella di " + binding + ": " + costText + ", priorità " + priority + ", x HIT", "la carta vale x HIT a quel costo",
                        0, 60, 2, false, x -> twin(ctx, binding, cost, priority, x));
                b.playedLow = TWIN_LOW;
                b.card = binding;
                list.add(b);
            }
        }
        return list;
    }

    static String costText(Map<Resource, Integer> cost) {
        List<String> parts = new ArrayList<>();
        cost.forEach((r, n) -> parts.add(n + " " + letter(r)));
        return "costo " + String.join(" + ", parts);
    }

    /** Spazienzio con l'handicap e la sonda contro Mara; la base è Spazienzio con l'handicap e l'àncora. */
    Variant handicapProbe(java.util.function.Function<String[], ObjectNode> make) {
        ObjectNode root = root(base);
        addPair(root, "listino.Sonda", "LISTINO SONDA", make);
        shifted(root, SPAZIENZIO, Resource.HEALTH, -HANDICAP, "base");
        ObjectNode probe = copyDeck(root, "base", "sonda");
        slot(probe, SLOT1, "listino.Sonda1");
        slot(probe, SLOT2, "listino.Sonda2");
        copyDeck(root, MARA, "riferimento");
        return new Variant(root, "sonda", "riferimento", "base", List.of("listino.Sonda1", "listino.Sonda2"));
    }

    /** Mara con la sonda contro Spazienzio con l'handicap; la base è Mara con l'àncora. */
    Variant handicapProbeMara(java.util.function.Function<String[], ObjectNode> make) {
        ObjectNode root = root(base);
        addPair(root, "listino.Sonda", "LISTINO SONDA", make);
        ObjectNode probe = copyDeck(root, MARA, "sonda");
        slot(probe, SLOT1, "listino.Sonda1");
        slot(probe, SLOT2, "listino.Sonda2");
        copyDeck(root, MARA, "base");
        shifted(root, SPAZIENZIO, Resource.HEALTH, -HANDICAP, "riferimento");
        return new Variant(root, "sonda", "riferimento", "base", List.of("listino.Sonda1", "listino.Sonda2"));
    }

    Variant twin(String ctx, String binding, Map<Resource, Integer> cost, int priority, int x) {
        ObjectNode root = root(base);
        add(root, hitter(new String[]{"listino.Gemella", "LISTINO GEMELLA"}, cost, priority, "HIT", x));
        ObjectNode probe = copyDeck(root, ctx, "sonda");
        slot(probe, SLOT1, "listino.Gemella");
        ObjectNode reference = copyDeck(root, ctx, "riferimento");
        slot(reference, SLOT1, binding);
        return new Variant(root, "sonda", "riferimento", null, List.of("listino.Gemella"));
    }

    Variant decay(int x, boolean spender) {
        ObjectNode root = root(base);
        add(root, card("listino.CaricaL", "ACTION", "LISTINO CARICA L", "RESOURCES", "+" + x + " L", null, 0, "SELF", Map.of(), 0,
                x > 0 ? List.of(gain(Resource.ALCOHOL, x)) : List.of(), List.of()));
        add(root, card("listino.CaricaV", "ACTION", "LISTINO CARICA V", "RESOURCES", "+10 V", null, 0, "SELF", Map.of(), 0,
                List.of(gain(Resource.VIOLENCE, 10)), List.of()));
        add(root, hitter(new String[]{"listino.SpesaL", "LISTINO SPESA L"}, Map.of(Resource.ALCOHOL, 10), 1, "HIT", 25));
        add(root, hitter(new String[]{"listino.SpesaV", "LISTINO SPESA V"}, Map.of(Resource.VIOLENCE, 10), 1, "HIT", 25));
        ObjectNode probe = copyDeck(root, NEUTRO, "sonda"), reference = copyDeck(root, NEUTRO, "riferimento");
        slot(probe, SLOT1, "listino.CaricaL");
        slot(reference, SLOT1, "listino.CaricaV");
        if (spender) {
            slot(probe, SLOT2, "listino.SpesaL");
            slot(reference, SLOT2, "listino.SpesaV");
        }
        return new Variant(root, "sonda", "riferimento", null, List.of("listino.CaricaL", "listino.SpesaL"));
    }

    /** Un personaggio clonato con una risorsa iniziale spostata, con le sue bound clonate e un mazzo che lo usa. */
    static String shifted(ObjectNode root, String context, Resource resource, int delta, String deckId) {
        ObjectNode deck = deck(root, context);
        String character = deck.get("character").asText(), id = character + "~" + deckId;
        ObjectNode clone = characterNode(root, character).deepCopy();
        clone.put("id", id).put("name", clone.get("name").asText() + " ~" + deckId);
        ObjectNode resources = (ObjectNode) clone.get("resources");
        int value = (resources.has(resource.name()) ? resources.get(resource.name()).asInt() : 0) + delta;
        if (value < 0) throw new IllegalArgumentException(context + ": " + resource + " " + value);
        resources.put(resource.name(), value);
        ((ArrayNode) root.get("characters")).add(clone);
        ObjectNode copy = copyDeck(root, context, deckId);
        copy.put("character", id);
        ArrayNode bound = copy.putArray("bound");
        for (JsonNode b : deck.get("bound")) {
            ObjectNode card = cardNode(root, b.asText()).deepCopy();
            card.put("binding", b.asText() + "~" + deckId).put("boundTo", id);
            ((ObjectNode) card.get("gui")).put("name", card.get("gui").get("name").asText() + " ~" + deckId);
            add(root, card);
            bound.add(b.asText() + "~" + deckId);
        }
        ObjectNode last = cardNode(root, deck.get("lastResort").asText());
        if (last.has("exclusiveTo") && character.equals(last.get("exclusiveTo").asText())) { // Last resort riservata: si clona anche lei.
            ObjectNode card = last.deepCopy();
            card.put("binding", last.get("binding").asText() + "~" + deckId).put("exclusiveTo", id);
            ((ObjectNode) card.get("gui")).put("name", card.get("gui").get("name").asText() + " ~" + deckId);
            add(root, card);
            copy.put("lastResort", card.get("binding").asText());
        }
        return id;
    }

    Variant shift(String context, Resource resource, int delta) {
        ObjectNode root = root(base);
        shifted(root, context, resource, delta, "sonda");
        copyDeck(root, context, "riferimento");
        return new Variant(root, "sonda", "riferimento", null, List.of());
    }

    static ObjectNode nullBound(String binding, String name, String character) {
        return card(binding, "BOUND", name, "NONE", "—", null, 0, "SELF", Map.of(), 0, List.of(), List.of()).put("boundTo", character);
    }

    /** Bound: la sonda e una bound nulla contro due bound nulle, nello stesso contesto. */
    Variant bound(String context, java.util.function.Function<String, ObjectNode> probe, String existing) {
        ObjectNode root = root(base);
        String character = deck(root, context).get("character").asText();
        add(root, nullBound("listino.bound.Nulla1", "LISTINO BOUND NULLA 1", character));
        add(root, nullBound("listino.bound.Nulla2", "LISTINO BOUND NULLA 2", character));
        String binding = existing;
        if (probe != null) {
            binding = "listino.bound.Sonda";
            add(root, probe.apply(character));
        }
        ObjectNode p = copyDeck(root, context, "sonda"), r = copyDeck(root, context, "riferimento");
        p.putArray("bound").add(binding).add("listino.bound.Nulla1");
        r.putArray("bound").add("listino.bound.Nulla1").add("listino.bound.Nulla2");
        return new Variant(root, "sonda", "riferimento", null, List.of(binding));
    }

    static ObjectNode boundCard(String character, String name, String role, String gains, String damageType, int amount, String target,
                                int priority, List<ObjectNode> self, List<ObjectNode> onTarget) {
        return card("listino.bound.Sonda", "BOUND", name, role, gains, damageType, amount, target, Map.of(), priority, self, onTarget)
                .put("boundTo", character);
    }

    /** Le famiglie di bound sonda, per valore: ciascuna dà la carta per un personaggio. */
    static Map<String, java.util.function.Function<String, ObjectNode>> boundFamilies(String context) {
        Map<String, java.util.function.Function<String, ObjectNode>> f = new LinkedHashMap<>();
        for (int x : new int[]{2, 4, 6, 8, 10})
            f.put("danno-" + x, ch -> boundCard(ch, "LISTINO BOUND DANNO", "DAMAGE", "—", "HIT", x, "OPPONENT", 1, List.of(),
                    List.of(damage("HIT", x))));
        Resource own = context.equals(MARA) ? Resource.ALERTNESS : context.equals(TOSSICO) ? Resource.TOXICITY : Resource.VIOLENCE;
        for (int x : new int[]{2, 4, 6, 8, 10})
            f.put("risorsa-" + x, ch -> boundCard(ch, "LISTINO BOUND RISORSA", "RESOURCES", "+" + x + " " + letter(own), null, 0, "SELF", 0,
                    List.of(gain(own, x)), List.of()));
        for (double factor : new double[]{0.75, 0.5, 0.25})
            f.put("parata-" + factor, ch -> boundCard(ch, "LISTINO BOUND PARATA", "DEFENSE", "—", null, 0, "SELF", 2,
                    List.of(guard("LISTINO PARATA HIT", "HIT", factor), guard("LISTINO PARATA CUT", "CUT", factor)), List.of()));
        f.put("struggle", ch -> boundCard(ch, "LISTINO BOUND STRUGGLE", "DAMAGE", "—", "HIT", 10, "OPPONENT", 1,
                List.of(damage("HIT", 5)), List.of(damage("HIT", 10))));
        for (int x : new int[]{2, 5})
            f.put("veleno-" + x, ch -> boundCard(ch, "LISTINO BOUND VELENO", "DISRUPT", "—", null, 0, "OPPONENT", 1, List.of(),
                    List.of(gain(Resource.TOXICITY, x))));
        return f;
    }

    /**
     * SB-10b, tetto in partita: bound di una sola funzione da 4 unità con i pesi di D33, in tutti e cinque i contesti. Il danno è 4 HIT,
     * con 3 e 2 HIT per trovare il tetto se 4 supera il criterio dei +10 punti; la
     * risorsa è quella propria del contesto alla quantità più alta entro 4 unità (+5 V, +8 A, +26 T per il Tossico immune). Per il
     * Tossico anche +10 T, il limite scelto nella griglia.
     */
    static Map<String, java.util.function.Function<String, ObjectNode>> capFamilies(String context) {
        Map<String, java.util.function.Function<String, ObjectNode>> f = new LinkedHashMap<>();
        for (int x : new int[]{4, 3, 2})
            f.put("danno-" + x + "HIT", ch -> boundCard(ch, "LISTINO TETTO DANNO", "DAMAGE", "—", "HIT", x, "OPPONENT", 1, List.of(),
                    List.of(damage("HIT", x))));
        Resource own = context.equals(MARA) || context.equals(ROCCO) ? Resource.ALERTNESS
                : context.equals(TOSSICO) ? Resource.TOXICITY : Resource.VIOLENCE;
        List<Integer> amounts = own == Resource.ALERTNESS ? List.of(8) : own == Resource.TOXICITY ? List.of(26, 10) : List.of(5);
        for (int x : amounts)
            f.put("risorsa-" + x + letter(own), ch -> boundCard(ch, "LISTINO TETTO RISORSA", "RESOURCES", "+" + x + " " + letter(own), null, 0,
                    "SELF", 0, List.of(gain(own, x)), List.of()));
        return f;
    }

    static final List<String> CAP_CONTEXTS = List.of(NEUTRO, SPAZIENZIO, MARA, ROCCO, TOSSICO);

    /** Una bozza con le bound del tetto in partita, per controllarle anche contro il manichino con i parametri scelti. */
    JsonNode capDraftInGame() {
        ObjectNode root = root(base);
        for (String ctx : CAP_CONTEXTS) {
            String character = deck(root, ctx).get("character").asText();
            for (Map.Entry<String, java.util.function.Function<String, ObjectNode>> e : capFamilies(ctx).entrySet()) {
                ObjectNode card = e.getValue().apply(character);
                String suffix = e.getKey() + "-" + ctx.substring(4);
                card.put("binding", "listino.tetto." + suffix);
                ((ObjectNode) card.get("gui")).put("name", "LISTINO TETTO " + suffix.toUpperCase(java.util.Locale.ROOT));
                add(root, card);
            }
        }
        return root;
    }

    List<Curve> curves() throws Exception {
        List<Curve> list = new ArrayList<>();
        for (String ctx : CAP_CONTEXTS)
            for (Map.Entry<String, java.util.function.Function<String, ObjectNode>> e : capFamilies(ctx).entrySet())
                list.add(new Curve("tettopartita-" + e.getKey() + "-" + ctx.substring(4), "tettopartita", ctx, e.getKey(), 4,
                        x -> bound(ctx, e.getValue(), null)));
        for (String ctx : List.of(NEUTRO, SPAZIENZIO, MARA, ROCCO, TOSSICO))
            for (int d : new int[]{-10, -5, 5, 10})
                list.add(new Curve("salute" + (d > 0 ? "+" : "") + d + "-" + ctx.substring(4), "salute", ctx, "HEALTH iniziale " + (d > 0 ? "+" : "") + d,
                        d, x -> shift(ctx, Resource.HEALTH, d)));
        for (String ctx : List.of(NEUTRO, SPAZIENZIO, MARA))
            for (int d : new int[]{-10, -3, -1, 1, 3, 10})
                list.add(new Curve("allerta" + (d > 0 ? "+" : "") + d + "-" + ctx.substring(4), "allerta", ctx, "A iniziale " + (d > 0 ? "+" : "") + d,
                        d, x -> shift(ctx, Resource.ALERTNESS, d)));
        for (String ctx : List.of(NEUTRO, SPAZIENZIO, MARA)) {
            for (Map.Entry<String, java.util.function.Function<String, ObjectNode>> e : boundFamilies(ctx).entrySet()) {
                if (e.getKey().startsWith("veleno") && ctx.equals(MARA)) continue;
                String[] parts = e.getKey().split("-");
                double value = parts.length > 1 ? Double.parseDouble(parts[1]) : 0;
                list.add(new Curve("bound-" + e.getKey() + "-" + ctx.substring(4), "bound", ctx, e.getKey(), value,
                        x -> bound(ctx, e.getValue(), null)));
            }
        }
        String[][] existing = {{SPAZIENZIO, "bruiser.character.LittleSmack"}, {SPAZIENZIO, "bruiser.character.LittleRage"},
                {TOSSICO, "junkie.character.PatheticBlade"}, {TOSSICO, "junkie.character.RottenSmile"},
                {MARA, "prova.mara.ColpoDiStriscio"}, {MARA, "prova.mara.Scarto"}, {ROCCO, "prova.rocco.Colpetto"}, {ROCCO, "prova.rocco.Fiato"},
                {NEUTRO, "sonda.neutro.Colpetto"}, {NEUTRO, "sonda.neutro.Riparo"}};
        for (String[] e : existing)
            list.add(new Curve("bound-attuale-" + e[1].substring(e[1].lastIndexOf('.') + 1) + "-" + e[0].substring(4), "bound", e[0],
                    e[1], 0, x -> bound(e[0], null, e[1])));
        for (int h : new int[]{20, 30, 40, 50, 60})
            list.add(new Curve("handicap-" + h, "handicap", SPAZIENZIO, "Spazienzio con " + h + " HEALTH in meno contro Mara", -h, x -> {
                ObjectNode root = root(base);
                shifted(root, SPAZIENZIO, Resource.HEALTH, -h, "sonda");
                copyDeck(root, MARA, "riferimento");
                return new Variant(root, "sonda", "riferimento", null, List.of());
            }));
        for (String ctx : List.of(NEUTRO, SPAZIENZIO, MARA)) {
            list.add(new Curve("slot-morte-" + ctx.substring(4), "slot", ctx, "4 carte morte contro 4 carte di passo", 4, x -> slots(ctx, true)));
            list.add(new Curve("slot-passo-" + ctx.substring(4), "slot", ctx, "4 carte di passo contro 4 àncore", 4, x -> slots(ctx, false)));
        }
        return list;
    }

    /** Slot: carte morte (costo 999 V, 10 HIT nominali) contro carte di passo, oppure carte di passo contro le àncore. */
    Variant slots(String ctx, boolean dead) {
        ObjectNode root = root(base);
        addPair(root, "listino.Morta", "LISTINO MORTA", id -> hitter(id, Map.of(Resource.VIOLENCE, 999), 1, "HIT", 10));
        addPair(root, "listino.Passo", "LISTINO PASSO", id -> card(id[0], "ACTION", id[1], "NONE", "—", null, 0, "SELF", Map.of(), 0,
                List.of(), List.of()));
        ObjectNode p = copyDeck(root, ctx, "sonda"), r = copyDeck(root, ctx, "riferimento");
        String probe = dead ? "listino.Morta" : "listino.Passo";
        slot(p, SLOT1, probe + "1");
        slot(p, SLOT2, probe + "2");
        if (dead) {
            slot(r, SLOT1, "listino.Passo1");
            slot(r, SLOT2, "listino.Passo2");
        }
        return new Variant(root, "sonda", "riferimento", null, List.of(probe + "1", probe + "2"));
    }

    /** Una bozza con tutte le bound sonda, per misurarle col tetto di SB-7 contro il manichino. */
    JsonNode capDraft() {
        ObjectNode root = root(base);
        for (String ctx : List.of(NEUTRO, SPAZIENZIO, MARA)) {
            String character = deck(root, ctx).get("character").asText();
            for (Map.Entry<String, java.util.function.Function<String, ObjectNode>> e : boundFamilies(ctx).entrySet()) {
                ObjectNode card = e.getValue().apply(character);
                String suffix = e.getKey() + "-" + ctx.substring(4);
                card.put("binding", "listino.bound." + suffix);
                ((ObjectNode) card.get("gui")).put("name", "LISTINO BOUND " + suffix.toUpperCase(java.util.Locale.ROOT));
                add(root, card);
            }
        }
        return root;
    }
}
