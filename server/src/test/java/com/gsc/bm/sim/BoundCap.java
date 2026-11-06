package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.bot.BotPolicy;
import com.gsc.bm.model.game.bot.BotView;
import com.gsc.bm.model.game.bot.LegalMove;
import com.gsc.bm.model.game.status.Status;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Random;
import java.util.TreeSet;

/**
 * SB-7: tetto di debolezza delle bound misurato sulla ripetizione. Il personaggio gioca solo la bound per USES turni contro un
 * manichino, e la stessa partita si ripete senza la bound e con il manichino che colpisce. Dalle differenze si ricava, uso per uso,
 * il danno inflitto, il danno parato, la salute propria e i guadagni immediati pesati. Il tetto e i pesi sono parametri.
 */
final class BoundCap {
    static final int USES = 8;
    static final int HIT = 10;
    static final int HEALTH = 1000;
    static final String DUMMY = "banco.manichino";
    private static final String WAIT = "banco.Aspetta", STRIKE = "banco.Colpo", LAST = "banco.UltimaVuota", NOTHING = "banco.manichino.Nulla";
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final List<Resource> GAINS = List.of(Resource.VIOLENCE, Resource.TOXICITY, Resource.ALCOHOL, Resource.ALERTNESS);

    /**
     * Tetto per uso, tolleranza e pesi dei guadagni. Il peso di T vale solo per chi è immune a T: per gli altri è 0. I predefiniti sono
     * quelli di D33 (SB-10a, adottati in SB-10b); SB7 conserva i parametri di SB-7 per le prove che controllano la stessa cosa di prima.
     */
    static final class Params {
        static final Params SB7 = new Params(5, 0.2, weights(1, 1, 1, 0.5));
        static final Params DEFAULT = new Params(4, 0, weights(0.75, 0.5, 0.15, 0.35));
        final double cap, tolerance;
        final Map<Resource, Double> weights;

        Params(double cap, double tolerance, Map<Resource, Double> weights) {
            if (cap <= 0 || tolerance < 0) throw new IllegalArgumentException("tetto positivo e tolleranza non negativa");
            this.cap = cap;
            this.tolerance = tolerance;
            this.weights = weights;
        }

        static Map<Resource, Double> weights(double v, double a, double t, double l) {
            Map<Resource, Double> weights = new EnumMap<>(Resource.class);
            weights.put(Resource.VIOLENCE, v);
            weights.put(Resource.ALERTNESS, a);
            weights.put(Resource.TOXICITY, t);
            weights.put(Resource.ALCOHOL, l);
            return weights;
        }

        /** -Dsim.boundCap=4 -Dsim.boundTolerance=0 -Dsim.boundWeights=V:0.75,A:0.5,T:0.15,L:0.35 (predefiniti di D33). */
        static Params fromSystem() {
            double cap = Double.parseDouble(System.getProperty("sim.boundCap", Double.toString(DEFAULT.cap)));
            double tolerance = Double.parseDouble(System.getProperty("sim.boundTolerance", Double.toString(DEFAULT.tolerance)));
            Map<Resource, Double> weights = new EnumMap<>(DEFAULT.weights);
            String raw = System.getProperty("sim.boundWeights");
            if (raw != null && !raw.isBlank()) for (String entry : raw.split("\\s*,\\s*")) {
                String[] pair = entry.split(":");
                if (pair.length != 2) throw new IllegalArgumentException("sim.boundWeights: atteso V:1,A:1,T:1,L:0.5, trovato " + entry);
                weights.put(letter(pair[0].trim()), Double.parseDouble(pair[1].trim()));
            }
            return new Params(cap, tolerance, weights);
        }

        private static Resource letter(String letter) {
            switch (letter) {
                case "V": return Resource.VIOLENCE;
                case "A": return Resource.ALERTNESS;
                case "T": return Resource.TOXICITY;
                case "L": return Resource.ALCOHOL;
                default: throw new IllegalArgumentException("sim.boundWeights: risorsa " + letter + " sconosciuta (V, A, T, L)");
            }
        }

        double limit() { return cap * (1 + tolerance); }

        String describe() {
            return String.format(Locale.ROOT, "%s unità ±%s%%; pesi V %s · A %s · T %s se immune, 0 se no · L %s · HEALTH 1",
                    Bench.plain(cap), Bench.plain(tolerance * 100), Bench.plain(weights.get(Resource.VIOLENCE)),
                    Bench.plain(weights.get(Resource.ALERTNESS)), Bench.plain(weights.get(Resource.TOXICITY)),
                    Bench.plain(weights.get(Resource.ALCOHOL))).replace('.', ',');
        }
    }

    /** L'esito di una bound: i valori uso per uso, ciò che resta sull'avversario e le note che non fanno fallire. */
    static final class Result {
        final String bound, character;
        final int uses;
        final double[] value, damage, prevented, ownHealth, gainValue;
        final Map<Resource, Double> gains = new EnumMap<>(Resource.class);
        final List<String> residue = new ArrayList<>(), notes = new ArrayList<>();
        boolean overCap, accumulates, playable = true;

        Result(String bound, String character, int uses) {
            this.bound = bound;
            this.character = character;
            this.uses = uses;
            value = new double[uses];
            damage = new double[uses];
            prevented = new double[uses];
            ownHealth = new double[uses];
            gainValue = new double[uses];
        }

        boolean violates() { return overCap || accumulates || !residue.isEmpty() || !playable; }

        double max() {
            double max = Double.NEGATIVE_INFINITY;
            for (double v : value) max = Math.max(max, v);
            return uses == 0 ? 0 : max;
        }

        double mean() {
            double sum = 0;
            for (double v : value) sum += v;
            return uses == 0 ? 0 : sum / uses;
        }

        String reasons(Params params) {
            List<String> reasons = new ArrayList<>();
            if (!playable) reasons.add("non giocabile nella prova");
            if (overCap) reasons.add("valore per uso " + Bench.decimal(max(), 2) + " oltre il tetto " + Bench.decimal(params.limit(), 2));
            if (accumulates) reasons.add("si accumula: danno " + Bench.decimal(damage[0], 2) + " al primo uso, "
                    + Bench.decimal(damage[uses - 1], 2) + " all'uso " + uses);
            if (!residue.isEmpty()) reasons.add("resta sull'avversario: " + String.join(", ", residue));
            return String.join("; ", reasons);
        }
    }

    private BoundCap() { }

    /** Tutte le bound della bozza, nell'ordine dei binding. */
    static List<Result> run(Draft draft, Params params) throws Exception {
        List<String> bounds = new ArrayList<>();
        for (String binding : new TreeSet<>(draft.cardBindings())) if (draft.card(binding).isCharacterBound()) bounds.add(binding);
        if (bounds.isEmpty()) return List.of();
        Draft bench = draft.derive(draft.source + " (prova delle bound)", benchDraft(draft, bounds));
        SimulationRunner runner = new SimulationRunner(bench);
        List<Result> results = new ArrayList<>();
        for (String bound : bounds) results.add(measure(draft, bench, runner, bound, params));
        return results;
    }

    private static Result measure(Draft draft, Draft bench, SimulationRunner runner, String bound, Params params) throws Exception {
        String character = draft.card(bound).getBoundToCharacter();
        String author = "banco-autore-" + bound, boundName = bench.card(bound).getName(), waitName = bench.card(WAIT).getName();
        boolean immune = bench.character(character).getImmunities().contains(Resource.TOXICITY);
        Run played = play(runner, author, new Only(boundName), "banco-attesa", new Only(waitName), true, boundName);
        Run idle = play(runner, author, new Only(waitName), "banco-attesa", new Only(waitName), false, null);
        Run struck = play(runner, author, new Only(boundName), "banco-colpo", new Only(bench.card(STRIKE).getName()), false, null);
        Run hit = play(runner, author, new Only(waitName), "banco-colpo", new Only(bench.card(STRIKE).getName()), false, null);
        int uses = Math.min(Math.min(played.turns(), idle.turns()), Math.min(struck.turns(), hit.turns()));
        Result result = new Result(bound, character, uses);
        result.playable = played.boundPlays == played.turns() && uses == USES;
        for (int k = 0; k < uses; k++) {
            double dealt = (idle.foeHealth(k) - played.foeHealth(k)) - (idle.foeHealth(k - 1) - played.foeHealth(k - 1));
            double own = (played.ownHealth(k) - idle.ownHealth(k)) - (played.ownHealth(k - 1) - idle.ownHealth(k - 1));
            double shielded = (struck.ownHealth(k) - hit.ownHealth(k)) - (struck.ownHealth(k - 1) - hit.ownHealth(k - 1)) - own;
            double gained = 0;
            for (Resource resource : GAINS) {
                double amount = played.gains.get(k).getOrDefault(resource, 0);
                result.gains.merge(resource, amount, Double::sum);
                double weight = resource == Resource.TOXICITY && !immune ? 0 : params.weights.get(resource);
                gained += weight * amount;
            }
            result.damage[k] = dealt;
            result.ownHealth[k] = own;
            result.prevented[k] = shielded;
            result.gainValue[k] = gained;
            result.value[k] = dealt + shielded + own + gained;
        }
        result.overCap = uses > 0 && result.max() > params.limit() + 1e-9;
        result.accumulates = uses > 1 && result.damage[uses - 1] > result.damage[0] + 0.5;
        if (uses > 0) {
            Snapshot a = played.snapshots.get(uses - 1), b = idle.snapshots.get(uses - 1);
            TreeSet<Resource> resources = new TreeSet<>(a.foeResources.keySet());
            resources.addAll(b.foeResources.keySet());
            for (Resource resource : resources) {
                if (resource == Resource.HEALTH) continue;
                int diff = a.foeResources.getOrDefault(resource, 0) - b.foeResources.getOrDefault(resource, 0);
                if (diff != 0) result.residue.add(String.format(Locale.ROOT, "%s %+d", letter(resource), diff));
            }
            for (String status : a.foeStatuses) if (!b.foeStatuses.contains(status)) result.residue.add("stato " + status);
            for (String timer : a.foeTimers) if (!b.foeTimers.contains(timer)) result.residue.add("timer " + timer);
            boolean heals = false, total = false;
            for (int k = 0; k < uses; k++) {
                if (result.ownHealth[k] > 0.5) heals = true;
                if (result.prevented[k] >= HIT - 0.01) total = true;
            }
            if (heals) result.notes.add("cura");
            if (a.ownItems > b.ownItems) result.notes.add("oggetti");
            for (String status : a.ownEquip) if (!b.ownEquip.contains(status)) { result.notes.add("equip " + status); break; }
            if (total) result.notes.add("para tutto il colpo di prova");
            int functions = 0;
            if (max(result.damage) > 0.5) functions++;
            if (max(result.prevented) > 0.5) functions++;
            if (max(result.gainValue) > 0.5 || heals) functions++;
            if (functions > 1) result.notes.add("più di una funzione");
        }
        return result;
    }

    private static double max(double[] values) {
        double max = 0;
        for (double v : values) max = Math.max(max, v);
        return max;
    }

    static String letter(Resource resource) {
        switch (resource) {
            case VIOLENCE: return "V";
            case TOXICITY: return "T";
            case ALCOHOL: return "L";
            case ALERTNESS: return "A";
            default: return "HEALTH";
        }
    }

    /** Gioca sempre la carta col nome dato, se è legale; sennò la prima mossa legale. Bersaglio: l'avversario se possibile. */
    private static final class Only implements BotPolicy {
        private final String name;

        Only(String name) { this.name = name; }

        @Override
        public LegalMove choose(BotView view, List<LegalMove> legalMoves, Random random) {
            LegalMove chosen = null;
            for (LegalMove move : legalMoves) {
                if (!move.getCard().getName().equals(name)) continue;
                if (chosen == null || "SELF".equals(chosen.getTargetId()) && !"SELF".equals(move.getTargetId())) chosen = move;
            }
            return chosen != null ? chosen : legalMoves.get(0);
        }
    }

    private static final class Snapshot {
        int foeHealth, ownHealth, ownItems;
        Map<Resource, Integer> foeResources;
        List<String> foeStatuses, foeTimers, ownEquip;
    }

    private static final class Run {
        final List<Snapshot> snapshots = new ArrayList<>();
        final List<Map<Resource, Integer>> gains = new ArrayList<>();
        Snapshot start;
        int boundPlays;

        int turns() { return snapshots.size(); }
        int foeHealth(int k) { return k < 0 ? start.foeHealth : snapshots.get(k).foeHealth; }
        int ownHealth(int k) { return k < 0 ? start.ownHealth : snapshots.get(k).ownHealth; }
    }

    private static final class Stop extends RuntimeException {
        Stop() { super(null, null, false, false); }
    }

    private static Run play(SimulationRunner runner, String authorDeck, BotPolicy author, String foeDeck, BotPolicy foe,
                            boolean measureGains, String boundName) throws Exception {
        Game game = runner.newGame(0, new SimulationRunner.Contender(authorDeck, author), new SimulationRunner.Contender(foeDeck, foe));
        Run run = new Run();
        run.start = snapshot(game);
        try {
            game.resolveMoves(g -> {}, (turn, events) -> events.clear(), (stage, state) -> {
                if ("ROUND_READY".equals(stage)) {
                    if (boundName != null) for (Move move : state.getPendingMoves())
                        if ("seat-1".equals(move.getPlayerId()) && boundName.equals(move.getPlayedCardName())) run.boundPlays++;
                    if (measureGains) run.gains.add(immediateGains(state));
                } else if ("ROUND_COMMITTED".equals(stage)) {
                    run.snapshots.add(snapshot(state));
                    if (run.snapshots.size() >= USES) throw new Stop();
                }
            });
        } catch (Stop stop) {
            // Fine della prova dopo USES turni.
        }
        game.getLoggedTurnEvents().clear();
        return run;
    }

    /** Guadagni immediati dell'autore: su una copia della partita paga la sua mossa e la risolve, prima degli effetti periodici. */
    private static Map<Resource, Integer> immediateGains(Game state) {
        try {
            ByteArrayOutputStream bytes = new ByteArrayOutputStream();
            try (ObjectOutputStream out = new ObjectOutputStream(bytes)) { out.writeObject(state); }
            Game copy;
            try (ObjectInputStream in = new ObjectInputStream(new ByteArrayInputStream(bytes.toByteArray()))) { copy = (Game) in.readObject(); }
            Move move = copy.getPendingMoves().stream().filter(m -> "seat-1".equals(m.getPlayerId())).findFirst().orElseThrow();
            Map<Resource, Integer> before = new EnumMap<>(copy.getPlayers().get("seat-1").getCharacter().getResources());
            move.applyCostTo(copy);
            move.applyEffectTo(copy);
            Map<Resource, Integer> after = copy.getPlayers().get("seat-1").getCharacter().getResources();
            Map<Resource, Integer> gains = new EnumMap<>(Resource.class);
            for (Resource resource : GAINS) {
                int diff = after.getOrDefault(resource, 0) - before.getOrDefault(resource, 0);
                if (diff != 0) gains.put(resource, diff);
            }
            copy.getLoggedTurnEvents().clear();
            return gains;
        } catch (Exception error) {
            throw new IllegalStateException("Copia della partita non riuscita nella prova delle bound", error);
        }
    }

    private static Snapshot snapshot(Game game) {
        Player author = game.getPlayers().get("seat-1"), foe = game.getPlayers().get("seat-2");
        Snapshot s = new Snapshot();
        s.foeHealth = foe.getCharacter().getResources().get(Resource.HEALTH);
        s.ownHealth = author.getCharacter().getResources().get(Resource.HEALTH);
        s.ownItems = author.getCharacter().getItems().size();
        s.foeResources = new EnumMap<>(foe.getCharacter().getResources());
        s.foeStatuses = new ArrayList<>();
        for (Status status : foe.getCharacter().getStatuses()) s.foeStatuses.add(status.getName());
        s.foeTimers = new ArrayList<>();
        foe.getCharacter().getTimers().forEach(timer -> s.foeTimers.add(timer.getName()));
        s.ownEquip = new ArrayList<>();
        for (Status status : author.getCharacter().getStatuses()) if (status.isEquip()) s.ownEquip.add(status.getName());
        return s;
    }

    /**
     * La bozza della prova: le carte e i personaggi della bozza, salute alzata a HEALTH perché la prova non si chiuda, un manichino
     * senza risorse e quattro carte senza effetto o col solo colpo di prova. Formato allargato: una bound, copie libere.
     */
    private static JsonNode benchDraft(Draft draft, List<String> bounds) throws Exception {
        ObjectNode root = (ObjectNode) draft.json();
        ObjectNode rules = root.putObject("rules");
        rules.put("deckSize", 20).put("maxCopies", 20).put("basicFixedPerCharacter", false).put("boundChoices", 1)
                .put("lastResortRequired", true);
        for (JsonNode character : root.get("characters")) ((ObjectNode) character.get("resources")).put("HEALTH", HEALTH);
        ((ArrayNode) root.get("characters")).add(JSON.readTree("{\"id\":\"" + DUMMY + "\",\"name\":\"Manichino del banco\","
                + "\"resources\":{\"HEALTH\":" + HEALTH + ",\"ALERTNESS\":0},\"items\":1,\"immunities\":[]}"));
        ArrayNode cards = (ArrayNode) root.get("cards");
        cards.add(card(WAIT, "\"kind\":\"ACTION\",\"priority\":0,\"targets\":[\"SELF\"]", "BANCO ASPETTA", "—", "—"));
        cards.add(card(STRIKE, "\"kind\":\"ACTION\",\"priority\":0,\"targets\":[\"OPPONENT\"],\"target\":[{\"op\":\"damage\",\"type\":\"HIT\",\"amount\":"
                + HIT + "}]", "BANCO COLPO", "HIT", "HIT " + HIT));
        cards.add(card(LAST, "\"kind\":\"ACTION\",\"lastResort\":true,\"targets\":[\"SELF\"]", "BANCO ULTIMA", "—", "—"));
        cards.add(card(NOTHING, "\"kind\":\"BOUND\",\"boundTo\":\"" + DUMMY + "\",\"targets\":[\"SELF\"]", "BANCO NULLA", "—", "—"));
        String anyBasic = null;
        for (String character : draft.characterIds()) if (anyBasic == null) anyBasic = draft.characterBasic(character);
        if (anyBasic == null) for (String binding : new TreeSet<>(draft.cardBindings()))
            if (anyBasic == null && draft.card(binding).isBasicAction()) anyBasic = binding;
        if (anyBasic == null) throw new IllegalArgumentException(draft.source + ": nessuna basic per la prova delle bound");
        ArrayNode decks = root.putArray("decks");
        for (String bound : bounds) {
            String character = draft.card(bound).getBoundToCharacter();
            String basic = draft.characterBasic(character) != null ? draft.characterBasic(character) : anyBasic;
            decks.add(deck("banco-autore-" + bound, character, basic, bound, WAIT));
        }
        decks.add(deck("banco-attesa", DUMMY, anyBasic, NOTHING, WAIT));
        decks.add(deck("banco-colpo", DUMMY, anyBasic, NOTHING, STRIKE));
        return root;
    }

    private static JsonNode card(String binding, String body, String name, String damage, String amount) throws Exception {
        return JSON.readTree("{\"binding\":\"" + binding + "\"," + body + ",\"gui\":{\"name\":\"" + name + "\",\"role\":\"NONE\","
                + "\"gains\":\"—\",\"damage\":\"" + damage + "\",\"damageAmount\":\"" + amount + "\"}}");
    }

    private static JsonNode deck(String id, String character, String basic, String bound, String regular) {
        ObjectNode deck = JSON.createObjectNode();
        deck.put("id", id).put("character", character).put("basic", basic);
        deck.putArray("bound").add(bound);
        deck.put("lastResort", LAST);
        deck.putObject("cards").put(regular, 20);
        return deck;
    }

    /** I numeri di una bound per il rapporto dati, in ordine fisso. */
    static Map<String, Object> json(Result r, Params params) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("bound", r.bound);
        row.put("personaggio", r.character);
        row.put("usi", r.uses);
        row.put("valore", Bench.rounded(r.value));
        row.put("danno", Bench.rounded(r.damage));
        row.put("parato", Bench.rounded(r.prevented));
        row.put("saluteSua", Bench.rounded(r.ownHealth));
        row.put("guadagniPesati", Bench.rounded(r.gainValue));
        Map<String, Object> gains = new LinkedHashMap<>();
        r.gains.forEach((resource, amount) -> gains.put(letter(resource), Bench.round(amount)));
        row.put("guadagni", gains);
        row.put("massimo", Bench.round(r.max()));
        row.put("medio", Bench.round(r.mean()));
        row.put("restaSullAvversario", r.residue);
        row.put("note", r.notes);
        row.put("viola", r.violates());
        row.put("motivi", r.reasons(params));
        return row;
    }
}
