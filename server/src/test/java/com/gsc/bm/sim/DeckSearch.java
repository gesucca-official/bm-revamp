package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.bot.BotPolicy;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

/**
 * SB-7: ricerca di mazzi forti per mutazione, (1+λ) con elitismo. Un candidato si valuta contro tutti i mazzi della bozza (gli
 * starter), per ogni coppia di stili, con gli stessi semi per tutti i candidati di una generazione. I semi cambiano a ogni
 * generazione e il migliore si rivaluta: un punteggio fortunato non sopravvive. I finalisti si convalidano su semi disgiunti.
 */
final class DeckSearch {
    private static final ObjectMapper JSON = new ObjectMapper();
    static final String CANDIDATE = "cerca-candidato";

    /** Parametri fissati prima di cercare, e dichiarati nel rapporto. */
    static final class Params {
        /** SB-10a: un mutante prende il posto del mazzo in carica solo se lo supera di più di un errore standard. */
        static final double MARGIN = 1.0;
        final int lambda, gamesPerCombo, maxGenerations, patience, validationGames, finalists, threads;
        final long searchSeed, validationSeed, mutationSeed;
        /** Margine di sostituzione, in errori standard del punteggio del mazzo in carica. 0 è la regola di SB-7. */
        final double margin;

        Params(int lambda, int gamesPerCombo, int maxGenerations, int patience, int validationGames, int finalists, int threads,
               long searchSeed, long validationSeed, long mutationSeed) {
            this(lambda, gamesPerCombo, maxGenerations, patience, validationGames, finalists, threads, searchSeed, validationSeed,
                    mutationSeed, MARGIN);
        }

        Params(int lambda, int gamesPerCombo, int maxGenerations, int patience, int validationGames, int finalists, int threads,
               long searchSeed, long validationSeed, long mutationSeed, double margin) {
            if (margin < 0) throw new IllegalArgumentException("il margine di sostituzione non può essere negativo");
            this.margin = margin;
            this.lambda = lambda;
            this.gamesPerCombo = gamesPerCombo;
            this.maxGenerations = maxGenerations;
            this.patience = patience;
            this.validationGames = validationGames;
            this.finalists = finalists;
            this.threads = Math.max(1, threads);
            this.searchSeed = searchSeed;
            this.validationSeed = validationSeed;
            this.mutationSeed = mutationSeed;
            if (validationSeed < searchSeed + (long) (maxGenerations + 1) * gamesPerCombo && validationSeed + validationGames > searchSeed)
                throw new IllegalArgumentException("i semi di convalida devono essere disgiunti da quelli di ricerca");
        }

        static Params standard(int threads) {
            return new Params(12, 16, 40, 10, 300, 3, threads, 7_100_000L, 7_900_000L, 7_000_007L);
        }

        /** Errore standard del punteggio p su n partite. */
        static double standardError(double p, int games) { return Math.sqrt(Math.max(p * (1 - p), 1e-9) / games); }

        /** La regola di sostituzione: lo sfidante prende il posto del mazzo in carica? Con margine 0 basta superarlo. */
        boolean replaces(double incumbent, double challenger, int games) {
            return challenger - incumbent > margin * standardError(incumbent, games);
        }
    }

    /** Un mazzo: carte regolari con le copie, bound scelte, last resort. */
    static final class Deck {
        final TreeMap<String, Integer> cards;
        final List<String> bound;
        final String lastResort;

        Deck(Map<String, Integer> cards, List<String> bound, String lastResort) {
            this.cards = new TreeMap<>(cards);
            List<String> sorted = new ArrayList<>(bound);
            Collections.sort(sorted);
            this.bound = List.copyOf(sorted);
            this.lastResort = lastResort;
        }

        String key() { return cards + "|" + bound + "|" + lastResort; }

        int size() { return cards.values().stream().mapToInt(Integer::intValue).sum(); }

        JsonNode json(String id, String character) {
            ObjectNode deck = JSON.createObjectNode();
            deck.put("id", id).put("character", character);
            ArrayNode boundNode = deck.putArray("bound");
            bound.forEach(boundNode::add);
            deck.put("lastResort", lastResort);
            ObjectNode cardsNode = deck.putObject("cards");
            cards.forEach(cardsNode::put);
            return deck;
        }

        /** Le differenze rispetto a un altro mazzo, per il rapporto. */
        String diff(Deck from) {
            List<String> parts = new ArrayList<>();
            TreeSet<String> all = new TreeSet<>(cards.keySet());
            all.addAll(from.cards.keySet());
            for (String binding : all) {
                int d = cards.getOrDefault(binding, 0) - from.cards.getOrDefault(binding, 0);
                if (d != 0) parts.add((d > 0 ? "+" : "−") + Math.abs(d) + " " + binding);
            }
            if (!bound.equals(from.bound)) parts.add("bound " + bound);
            if (!lastResort.equals(from.lastResort)) parts.add("last resort " + lastResort);
            return parts.isEmpty() ? "uguale" : String.join(", ", parts);
        }
    }

    /** Esiti dal punto di vista del candidato. */
    static final class Score {
        long games, wins, losses, draws, limits;

        void add(Score o) {
            games += o.games;
            wins += o.wins;
            losses += o.losses;
            draws += o.draws;
            limits += o.limits;
        }

        /** Punteggio della ricerca: patte e limite valgono mezza vittoria. */
        double points() { return games == 0 ? 0 : (wins + 0.5 * (draws + limits)) / games; }

        double share() { return Bench.ratio(wins, wins + losses); }
    }

    static final class Finalist {
        final String label;
        final Deck deck;
        final double searchPoints;
        final Score validation = new Score();
        final Map<String, Score> byOpponent = new LinkedHashMap<>();

        Finalist(String label, Deck deck, double searchPoints) {
            this.label = label;
            this.deck = deck;
            this.searchPoints = searchPoints;
        }
    }

    /** Una ricerca da un punto di partenza. */
    static final class Outcome {
        final String character, start;
        final Deck origin, starter;
        final List<Double> history = new ArrayList<>();
        /** Per ogni sostituzione: generazione, guadagno sul mazzo in carica, errore standard di quel momento. */
        final List<double[]> replacements = new ArrayList<>();
        final List<Finalist> finalists = new ArrayList<>();
        Finalist baseline;
        int generations;
        String stop;

        Outcome(String character, String start, Deck origin, Deck starter) {
            this.character = character;
            this.start = start;
            this.origin = origin;
            this.starter = starter;
        }

        Finalist best() { return finalists.get(0); }
    }

    private final Draft draft;
    private final Map<String, BotPolicy> styles;
    private final Params params;
    private final List<String> gauntlet;

    DeckSearch(Draft draft, Map<String, BotPolicy> styles, Params params) {
        this.draft = draft;
        this.styles = Collections.unmodifiableMap(new LinkedHashMap<>(styles));
        this.params = params;
        this.gauntlet = new ArrayList<>(draft.deckIds());
    }

    List<String> gauntlet() { return gauntlet; }

    Map<String, BotPolicy> styles() { return styles; }

    Params params() { return params; }

    Draft draft() { return draft; }

    /** Il primo mazzo della bozza per quel personaggio, come mazzo da mutare. */
    Deck starter(String character) {
        for (String deck : draft.deckIds())
            if (draft.characterOf(deck).equals(character))
                return new Deck(draft.cardsOf(deck), draft.boundOf(deck), draft.lastResortOf(deck));
        return null;
    }

    /** Le due ricerche per un personaggio: dallo starter (se c'è) e da un mazzo casuale conforme. */
    List<Outcome> search(String character) throws Exception {
        List<Outcome> outcomes = new ArrayList<>();
        Deck starter = starter(character);
        Random random = new Random(params.mutationSeed ^ character.hashCode());
        if (starter != null) outcomes.add(search(character, "starter", starter, starter, random));
        outcomes.add(search(character, "casuale", randomDeck(character, random), starter, random));
        return outcomes;
    }

    Outcome search(String character, String label, Deck origin, Deck starter, Random random) throws Exception {
        Pool pool = new Pool(character);
        Outcome outcome = new Outcome(character, label, origin, starter);
        Deck incumbent = origin;
        double score = evaluate(List.of(incumbent), character, params.searchSeed, params.gamesPerCombo).get(0).points();
        outcome.history.add(score);
        int games = gauntlet.size() * styles.size() * styles.size() * params.gamesPerCombo;
        Map<String, Double> accepted = new LinkedHashMap<>();
        Map<String, Deck> decks = new LinkedHashMap<>();
        accepted.put(incumbent.key(), score);
        decks.put(incumbent.key(), incumbent);
        int stale = 0;
        outcome.stop = "numero massimo di generazioni (" + params.maxGenerations + ")";
        for (int gen = 1; gen <= params.maxGenerations; gen++) {
            long base = params.searchSeed + (long) gen * params.gamesPerCombo;
            List<Deck> batch = new ArrayList<>();
            batch.add(incumbent);
            for (int i = 0; i < params.lambda; i++) batch.add(mutate(incumbent, pool, random));
            List<Score> scores = evaluate(batch, character, base, params.gamesPerCombo);
            double current = scores.get(0).points();
            accepted.put(incumbent.key(), current); // Rivalutato sui semi nuovi: vale l'ultimo punteggio.
            int best = 0;
            for (int i = 1; i < batch.size(); i++) if (scores.get(i).points() > scores.get(best).points()) best = i;
            outcome.generations = gen;
            double gain = scores.get(best).points() - current;
            double se = Params.standardError(current, games);
            if (best > 0 && params.replaces(current, scores.get(best).points(), games)) {
                outcome.replacements.add(new double[]{gen, gain, se});
                incumbent = batch.get(best);
                accepted.put(incumbent.key(), scores.get(best).points());
                decks.put(incumbent.key(), incumbent);
                stale = gain > se ? 0 : stale + 1;
                outcome.history.add(scores.get(best).points());
            } else {
                stale++;
                outcome.history.add(current);
            }
            if (stale >= params.patience) {
                outcome.stop = "nessun miglioramento oltre un errore standard per " + params.patience + " generazioni";
                break;
            }
        }
        List<String> order = new ArrayList<>(accepted.keySet());
        String last = incumbent.key();
        order.sort((a, b) -> a.equals(last) ? -1 : b.equals(last) ? 1 : Double.compare(accepted.get(b), accepted.get(a)));
        for (String key : order.subList(0, Math.min(params.finalists, order.size())))
            outcome.finalists.add(new Finalist(key.equals(last) ? "ultimo" : "precedente", decks.get(key), accepted.get(key)));
        List<Deck> toValidate = new ArrayList<>();
        for (Finalist f : outcome.finalists) toValidate.add(f.deck);
        if (starter != null) toValidate.add(starter);
        List<Map<String, Score>> validation = evaluateByOpponent(toValidate, character, params.validationSeed, params.validationGames);
        for (int i = 0; i < outcome.finalists.size(); i++) fill(outcome.finalists.get(i), validation.get(i));
        if (starter != null) {
            outcome.baseline = new Finalist("starter", starter, Double.NaN);
            fill(outcome.baseline, validation.get(validation.size() - 1));
        }
        return outcome;
    }

    private static void fill(Finalist f, Map<String, Score> byOpponent) {
        f.byOpponent.putAll(byOpponent);
        byOpponent.values().forEach(f.validation::add);
    }

    /** Le carte fra cui la ricerca può scegliere, per un personaggio. */
    final class Pool {
        final List<String> regular = new ArrayList<>(), bounds = new ArrayList<>(), lastResorts = new ArrayList<>();

        Pool(String character) {
            for (String binding : new TreeSet<>(draft.cardBindings())) {
                Card card = draft.card(binding);
                if (card.isBasicAction()) continue;
                if (card.isCharacterBound()) {
                    if (character.equals(card.getBoundToCharacter())) bounds.add(binding);
                } else if (card.isLastResort()) {
                    String exclusive = draft.exclusiveTo(binding);
                    if (exclusive == null || exclusive.equals(character)) lastResorts.add(binding);
                } else regular.add(binding);
            }
            if (bounds.size() < draft.rules.boundChoices) throw new IllegalArgumentException(character + ": bound insufficienti per il formato");
            if (lastResorts.isEmpty()) throw new IllegalArgumentException(character + ": nessuna last resort ammessa");
            if ((long) regular.size() * draft.rules.maxCopies < draft.rules.deckSize)
                throw new IllegalArgumentException(character + ": troppe poche carte regolari per un mazzo da " + draft.rules.deckSize);
        }
    }

    Deck randomDeck(String character, Random random) {
        Pool pool = new Pool(character);
        List<String> bounds = new ArrayList<>(pool.bounds);
        Collections.shuffle(bounds, random);
        Map<String, Integer> cards = new TreeMap<>();
        int size = 0;
        while (size < draft.rules.deckSize) {
            String binding = pool.regular.get(random.nextInt(pool.regular.size()));
            if (cards.getOrDefault(binding, 0) >= draft.rules.maxCopies) continue;
            cards.merge(binding, 1, Integer::sum);
            size++;
        }
        return new Deck(cards, bounds.subList(0, draft.rules.boundChoices),
                pool.lastResorts.get(random.nextInt(pool.lastResorts.size())));
    }

    /** Da una a tre modifiche: una copia sostituita (di norma), una bound o la last resort cambiate. */
    Deck mutate(Deck parent, Pool pool, Random random) {
        for (int attempt = 0; attempt < 20; attempt++) {
            TreeMap<String, Integer> cards = new TreeMap<>(parent.cards);
            List<String> bound = new ArrayList<>(parent.bound);
            String lastResort = parent.lastResort;
            int changes = 1 + random.nextInt(3);
            for (int c = 0; c < changes; c++) {
                double r = random.nextDouble();
                if (r < 0.1 && pool.bounds.size() > bound.size()) {
                    List<String> others = new ArrayList<>(pool.bounds);
                    others.removeAll(bound);
                    bound.set(random.nextInt(bound.size()), others.get(random.nextInt(others.size())));
                } else if (r < 0.2 && pool.lastResorts.size() > 1) {
                    List<String> others = new ArrayList<>(pool.lastResorts);
                    others.remove(lastResort);
                    lastResort = others.get(random.nextInt(others.size()));
                } else {
                    List<String> copies = new ArrayList<>();
                    cards.forEach((binding, n) -> { for (int i = 0; i < n; i++) copies.add(binding); });
                    String out = copies.get(random.nextInt(copies.size()));
                    List<String> in = new ArrayList<>();
                    for (String binding : pool.regular)
                        if (!binding.equals(out) && cards.getOrDefault(binding, 0) < draft.rules.maxCopies) in.add(binding);
                    if (in.isEmpty()) continue;
                    if (cards.merge(out, -1, Integer::sum) == 0) cards.remove(out);
                    cards.merge(in.get(random.nextInt(in.size())), 1, Integer::sum);
                }
            }
            Deck child = new Deck(cards, bound, lastResort);
            if (!child.key().equals(parent.key())) return child;
        }
        return parent;
    }

    /** La bozza con il candidato fra i mazzi: passa dalla validazione, quindi il candidato è conforme per costruzione. */
    Draft withCandidate(Deck deck, String character) {
        ObjectNode root = (ObjectNode) draft.json();
        ObjectNode candidate = (ObjectNode) deck.json(CANDIDATE, character);
        if (!draft.rules.basicFixedPerCharacter) {
            String basic = draft.characterBasic(character);
            for (String id : draft.deckIds()) if (basic == null && draft.characterOf(id).equals(character)) basic = draft.basicOf(id);
            if (basic == null) throw new IllegalArgumentException(character + ": nessuna basic nota per il candidato");
            candidate.put("basic", basic);
        }
        ((ArrayNode) root.get("decks")).add(candidate);
        return draft.derive(draft.source + " + " + CANDIDATE, root);
    }

    List<Score> evaluate(List<Deck> decks, String character, long firstSeed, int games) throws Exception {
        List<Score> out = new ArrayList<>();
        for (Map<String, Score> byOpponent : evaluateByOpponent(decks, character, firstSeed, games)) {
            Score total = new Score();
            byOpponent.values().forEach(total::add);
            out.add(total);
        }
        return out;
    }

    /** Per ogni mazzo, gli esiti contro ciascun avversario: tutte le coppie di stili, stessi semi, posti alternati. */
    List<Map<String, Score>> evaluateByOpponent(List<Deck> decks, String character, long firstSeed, int games) throws Exception {
        List<Map<String, Score>> results = new ArrayList<>();
        if (params.threads == 1 || decks.size() == 1) {
            for (Deck deck : decks) results.add(play(deck, character, firstSeed, games));
            return results;
        }
        ExecutorService pool = Executors.newFixedThreadPool(Math.min(params.threads, decks.size()));
        try {
            List<Future<Map<String, Score>>> futures = new ArrayList<>();
            for (Deck deck : decks) futures.add(pool.submit(() -> play(deck, character, firstSeed, games)));
            for (Future<Map<String, Score>> future : futures) results.add(future.get());
        } finally {
            pool.shutdownNow();
        }
        return results;
    }

    private Map<String, Score> play(Deck deck, String character, long firstSeed, int games) throws Exception {
        SimulationRunner runner = new SimulationRunner(withCandidate(deck, character));
        Map<String, Score> byOpponent = new LinkedHashMap<>();
        for (String opponent : gauntlet) {
            Score score = new Score();
            for (BotPolicy mine : styles.values()) for (BotPolicy theirs : styles.values())
                for (long seed = firstSeed; seed < firstSeed + games; seed++) {
                    boolean first = seed % 2 == 0;
                    SimulationRunner.Contender me = new SimulationRunner.Contender(CANDIDATE, mine);
                    SimulationRunner.Contender them = new SimulationRunner.Contender(opponent, theirs);
                    SimulationRunner.Result r = runner.run(seed, first ? me : them, first ? them : me);
                    score.games++;
                    if (r.outcome == SimulationRunner.Outcome.DRAW) score.draws++;
                    else if (r.outcome == SimulationRunner.Outcome.TURN_LIMIT) score.limits++;
                    else if ((r.outcome == SimulationRunner.Outcome.FIRST_WIN) == first) score.wins++;
                    else score.losses++;
                }
            byOpponent.put(opponent, score);
        }
        return byOpponent;
    }

    // ---- rapporto ----

    private static String share(Score s) {
        double[] ci = Bench.wilson(s.wins, s.wins + s.losses);
        return Bench.decimal(s.share(), 3) + " [" + Bench.decimal(ci[0], 3) + "–" + Bench.decimal(ci[1], 3) + "]";
    }

    String markdown(List<Outcome> outcomes, String note) throws Exception {
        StringBuilder o = new StringBuilder();
        o.append("# Ricerca dei mazzi SB-7 — ").append(Bench.draftName(draft)).append("\n\n");
        if (note != null) o.append("> ").append(note).append("\n\n");
        o.append("| Voce | Valore |\n|---|---|\n");
        o.append("| Bozza | `").append(Bench.shownSource(draft)).append("` |\n");
        o.append("| SHA-256 | `").append(Bench.sha256(draft)).append("` |\n");
        o.append("| Banco | ").append(Bench.VERSION).append(" |\n");
        o.append("| Avversari | ").append(String.join(", ", gauntlet)).append(" |\n");
        o.append("| Stili | ").append(String.join(", ", styles.keySet())).append(": ").append(styles.size() * styles.size()).append(" coppie |\n");
        o.append("| Ricerca | (1+").append(params.lambda).append("), ").append(params.gamesPerCombo)
                .append(" partite per avversario e coppia di stili, al massimo ").append(params.maxGenerations).append(" generazioni, pazienza ")
                .append(params.patience).append(", semi da ").append(params.searchSeed).append(" (un blocco nuovo a generazione) |\n");
        o.append("| Sostituzione | ").append(params.margin == 0 ? "basta superare il mazzo in carica (regola di SB-7)"
                : "solo oltre " + Bench.decimal(params.margin, 1) + " errori standard del mazzo in carica (SB-10a)").append(" |\n");
        o.append("| Convalida | ").append(params.finalists).append(" finalisti e lo starter, ").append(params.validationGames)
                .append(" partite per avversario e coppia di stili, semi ").append(params.validationSeed).append("–")
                .append(params.validationSeed + params.validationGames - 1).append(" |\n");
        o.append("| Mutazioni | seme ").append(params.mutationSeed).append(" combinato col personaggio |\n");
        o.append("| Tempi | nel file `.tempi.txt` accanto |\n\n");
        o.append("Punteggio di ricerca: (vittorie + ½ patte e limite) / partite. Quota di convalida: vittorie / (vittorie + sconfitte), ")
                .append("Wilson al 95%. La ricerca trova ciò che **i bot** sanno giocare.\n");
        for (Outcome out : outcomes) {
            o.append("\n## ").append(out.character).append(", partenza ").append(out.start).append("\n\n");
            o.append("Generazioni: ").append(out.generations).append("; arresto: ").append(out.stop).append(".\n\n");
            o.append("Punteggio del migliore a ogni generazione: ");
            List<String> h = new ArrayList<>();
            for (double v : out.history) h.add(Bench.decimal(v, 3));
            o.append(String.join(" · ", h)).append("\n\n");
            o.append("| mazzo | punteggio di ricerca | quota di convalida [IC 95%] | punteggio di convalida |");
            for (String opp : gauntlet) o.append(" contro ").append(opp).append(" |");
            o.append("\n|---|---:|---|---:|");
            for (int i = 0; i < gauntlet.size(); i++) o.append("---|");
            o.append('\n');
            List<Finalist> rows = new ArrayList<>(out.finalists);
            if (out.baseline != null) rows.add(out.baseline);
            for (Finalist f : rows) {
                o.append("| ").append(f.label).append(" | ").append(Double.isNaN(f.searchPoints) ? "—" : Bench.decimal(f.searchPoints, 3))
                        .append(" | ").append(share(f.validation)).append(" | ").append(Bench.decimal(f.validation.points(), 3)).append(" |");
                for (String opp : gauntlet) o.append(' ').append(share(f.byOpponent.get(opp))).append(" |");
                o.append('\n');
            }
            Finalist best = out.best();
            o.append("\nMazzo «ultimo»: bound ").append(best.deck.bound).append(", last resort ").append(best.deck.lastResort).append(", carte ")
                    .append(best.deck.cards).append(".\n");
            if (out.starter != null) o.append("Rispetto allo starter: ").append(best.deck.diff(out.starter)).append(".\n");
            o.append("Scarto ricerca − convalida (punteggio): ").append(Bench.decimal(best.searchPoints - best.validation.points(), 3)).append(".\n");
        }
        return o.toString();
    }

    String json(List<Outcome> outcomes, String note) throws Exception {
        Map<String, Object> root = new LinkedHashMap<>();
        Map<String, Object> head = new LinkedHashMap<>();
        head.put("banco", Bench.VERSION);
        head.put("bozza", Bench.shownSource(draft));
        head.put("sha256", Bench.sha256(draft));
        head.put("avversari", gauntlet);
        head.put("stili", new ArrayList<>(styles.keySet()));
        head.put("lambda", params.lambda);
        head.put("partitePerCombinazione", params.gamesPerCombo);
        head.put("generazioniMassime", params.maxGenerations);
        head.put("pazienza", params.patience);
        head.put("margineSostituzione", Bench.round(params.margin));
        head.put("semeRicerca", params.searchSeed);
        head.put("semeConvalida", params.validationSeed);
        head.put("partiteConvalida", params.validationGames);
        head.put("semeMutazioni", params.mutationSeed);
        if (note != null) head.put("nota", note);
        root.put("intestazione", head);
        List<Object> list = new ArrayList<>();
        for (Outcome out : outcomes) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("personaggio", out.character);
            m.put("partenza", out.start);
            m.put("generazioni", out.generations);
            m.put("arresto", out.stop);
            List<Object> h = new ArrayList<>();
            for (double v : out.history) h.add(Bench.round(v));
            m.put("storia", h);
            List<Object> rows = new ArrayList<>();
            List<Finalist> all = new ArrayList<>(out.finalists);
            if (out.baseline != null) all.add(out.baseline);
            for (Finalist f : all) {
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("etichetta", f.label);
                row.put("bound", f.deck.bound);
                row.put("lastResort", f.deck.lastResort);
                row.put("carte", f.deck.cards);
                row.put("punteggioRicerca", Double.isNaN(f.searchPoints) ? null : Bench.round(f.searchPoints));
                Map<String, Object> by = new LinkedHashMap<>();
                f.byOpponent.forEach((opp, s) -> {
                    Map<String, Object> sm = new LinkedHashMap<>();
                    sm.put("partite", s.games);
                    sm.put("vittorie", s.wins);
                    sm.put("sconfitte", s.losses);
                    sm.put("patte", s.draws);
                    sm.put("limite", s.limits);
                    by.put(opp, sm);
                });
                row.put("convalida", by);
                rows.add(row);
            }
            m.put("mazzi", rows);
            list.add(m);
        }
        root.put("ricerche", list);
        return Bench.pretty(root);
    }
}
