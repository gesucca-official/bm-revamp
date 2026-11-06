package com.gsc.bm.sim;

import com.fasterxml.jackson.core.util.DefaultIndenter;
import com.fasterxml.jackson.core.util.DefaultPrettyPrinter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.bot.BotPolicy;
import com.gsc.bm.model.game.bot.BotView;
import com.gsc.bm.model.game.bot.LegalMove;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.function.BiConsumer;

/**
 * SB-7: banco di misura. Matrice dei matchup per coppia di mazzi e coppia di stili, a posti alternati, con intervalli di Wilson;
 * misure per mazzo e per carta; invarianti controllati in ogni turno; tetto delle bound. Produce un testo per il proprietario e un
 * file di dati, identici byte per byte a parità di bozza, semi e impostazioni: i tempi stanno altrove.
 */
final class Bench {
    static final String VERSION = "sb-7/1";
    private static final double Z = 1.959963984540054;
    static final List<Resource> SPENDABLE = List.of(Resource.VIOLENCE, Resource.TOXICITY, Resource.ALCOHOL, Resource.ALERTNESS);
    /** Gli invarianti, nell'ordine del rapporto. */
    static final List<String> INVARIANTS = List.of("senza-mosse", "mossa-vuota", "bound-gratuite", "basic-bound-in-mano",
            "last-resort-in-mano", "last-resort-giocabile", "bound-giocabile", "limite-turni");
    static final Map<String, String> INVARIANT_TEXT = Map.of(
            "senza-mosse", "ogni giocatore vivo ha almeno una mossa legale",
            "mossa-vuota", "nessun giocatore vivo invia una mossa vuota",
            "bound-gratuite", "ogni bound della bozza è gratuita (D2)",
            "basic-bound-in-mano", "basic e bound del mazzo sono sempre in mano",
            "last-resort-in-mano", "a mazzo vuoto e mano incompleta la last resort è in mano",
            "last-resort-giocabile", "la last resort in mano è sempre una mossa legale",
            "bound-giocabile", "con una carta regolare da scartare ogni bound in mano è legale",
            "limite-turni", "nessuna partita arriva al limite di " + SimulationRunner.MAX_TURNS + " turni");
    private static final int EXAMPLES = 5;
    private static final int HIST = SimulationRunner.MAX_TURNS + 5;

    /** Tutto ciò che decide il rapporto, e che il rapporto dichiara. */
    static final class Settings {
        final int games;
        final long firstSeed;
        final List<String> decks;
        final Map<String, BotPolicy> styles;
        final int threads;
        final BoundCap.Params cap;
        final String note;

        Settings(int games, long firstSeed, List<String> decks, Map<String, BotPolicy> styles, int threads, BoundCap.Params cap, String note) {
            if (games < 1) throw new IllegalArgumentException("servono almeno una partita per cella");
            this.games = games;
            this.firstSeed = firstSeed;
            this.decks = List.copyOf(decks);
            this.styles = Collections.unmodifiableMap(new LinkedHashMap<>(styles));
            this.threads = Math.max(1, threads);
            this.cap = cap;
            this.note = note;
        }
    }

    /** Una violazione di un invariante: dice dove trovarla. */
    static final class Violation {
        final String invariant, deck, style, detail;
        final long seed;
        final int turn;

        Violation(String invariant, String deck, String style, long seed, int turn, String detail) {
            this.invariant = invariant;
            this.deck = deck;
            this.style = style;
            this.seed = seed;
            this.turn = turn;
            this.detail = detail;
        }

        String message(String draft) {
            return "[" + invariant + "] bozza " + draft + " · mazzo " + deck + (style == null ? "" : " · stile " + style)
                    + (seed < 0 ? "" : " · seme " + seed) + (turn < 0 ? "" : " · turno " + turn) + ": " + detail;
        }
    }

    /** Conteggi ed esempi delle violazioni, con i controlli fatti. */
    static final class Checks {
        final Map<String, Long> counts = new LinkedHashMap<>();
        final Map<String, List<Violation>> examples = new LinkedHashMap<>();
        long seatTurns, games;

        Checks() {
            for (String invariant : INVARIANTS) {
                counts.put(invariant, 0L);
                examples.put(invariant, new ArrayList<>());
            }
        }

        void add(Violation v) {
            counts.merge(v.invariant, 1L, Long::sum);
            if (examples.get(v.invariant).size() < EXAMPLES) examples.get(v.invariant).add(v);
        }

        void merge(Checks o) {
            seatTurns += o.seatTurns;
            games += o.games;
            o.counts.forEach((k, v) -> counts.merge(k, v, Long::sum));
            o.examples.forEach((k, list) -> {
                for (Violation v : list) if (examples.get(k).size() < EXAMPLES) examples.get(k).add(v);
            });
        }

        long total() { return counts.values().stream().mapToLong(Long::longValue).sum(); }
    }

    /** Una carta in un mazzo: giocate, partite in cui è giocata e loro esito, turni in mano, morta o ferma. */
    static final class CardStat {
        long plays, gamesPlayed, playedWon, playedLost, gamesInHand, inHand, dead, idle;

        void add(CardStat o) {
            plays += o.plays;
            gamesPlayed += o.gamesPlayed;
            playedWon += o.playedWon;
            playedLost += o.playedLost;
            gamesInHand += o.gamesInHand;
            inHand += o.inHand;
            dead += o.dead;
            idle += o.idle;
        }
    }

    /** Un mazzo con uno stile, visto da una parte del tavolo. */
    static final class Side {
        long games, wins, losses, draws, limits, exhausted, lrArrived, lrTurnSum, healthDeaths, healthDeathsNoKill,
                healthDeathsLost, healthDeathsDraw, healthSpent, endWonGames, endLostGames;
        final int[] lrHist = new int[HIST];
        final long[] endWon = new long[SPENDABLE.size()], endLost = new long[SPENDABLE.size()];
        final Map<String, CardStat> cards = new TreeMap<>();

        void add(Side o) {
            games += o.games;
            wins += o.wins;
            losses += o.losses;
            draws += o.draws;
            limits += o.limits;
            exhausted += o.exhausted;
            lrArrived += o.lrArrived;
            lrTurnSum += o.lrTurnSum;
            healthDeaths += o.healthDeaths;
            healthDeathsNoKill += o.healthDeathsNoKill;
            healthDeathsLost += o.healthDeathsLost;
            healthDeathsDraw += o.healthDeathsDraw;
            healthSpent += o.healthSpent;
            endWonGames += o.endWonGames;
            endLostGames += o.endLostGames;
            for (int i = 0; i < HIST; i++) lrHist[i] += o.lrHist[i];
            for (int i = 0; i < endWon.length; i++) {
                endWon[i] += o.endWon[i];
                endLost[i] += o.endLost[i];
            }
            o.cards.forEach((k, v) -> cards.computeIfAbsent(k, x -> new CardStat()).add(v));
        }
    }

    /** Esiti di un incontro fra A e B: vittorie, patte, limite, primo posto, turni. */
    static final class Tally {
        long games, aWins, bWins, draws, limits, firstWins, decisive;
        final int[] turns = new int[HIST];
        long turnSum;
        double turnSquares;

        void add(Tally o) {
            games += o.games;
            aWins += o.aWins;
            bWins += o.bWins;
            draws += o.draws;
            limits += o.limits;
            firstWins += o.firstWins;
            decisive += o.decisive;
            turnSum += o.turnSum;
            turnSquares += o.turnSquares;
            for (int i = 0; i < HIST; i++) turns[i] += o.turns[i];
        }
    }

    /** Una cella: mazzo A con lo stile A contro mazzo B con lo stile B, N partite. */
    static final class Cell {
        final String deckA, styleA, deckB, styleB;
        final Tally tally = new Tally();
        final Side a = new Side(), b = new Side();
        final Checks checks = new Checks();

        Cell(String deckA, String styleA, String deckB, String styleB) {
            this.deckA = deckA;
            this.styleA = styleA;
            this.deckB = deckB;
            this.styleB = styleB;
        }
    }

    /** Il risultato completo di una misura. */
    static final class Report {
        final Draft draft;
        final String sha256;
        final Settings settings;
        final List<Cell> cells;
        final Checks checks = new Checks();
        final List<BoundCap.Result> bounds;

        Report(Draft draft, String sha256, Settings settings, List<Cell> cells, List<BoundCap.Result> bounds) {
            this.draft = draft;
            this.sha256 = sha256;
            this.settings = settings;
            this.cells = cells;
            this.bounds = bounds;
        }

        long games() { return cells.stream().mapToLong(c -> c.tally.games).sum(); }

        long boundViolations() { return bounds.stream().filter(BoundCap.Result::violates).count(); }

        /** Il messaggio di tutte le violazioni, per il modo rigoroso. */
        String failures() {
            StringBuilder out = new StringBuilder();
            String name = draftName(draft);
            checks.counts.forEach((invariant, count) -> {
                if (count == 0) return;
                out.append(invariant).append(": ").append(count).append(" violazioni\n");
                for (Violation v : checks.examples.get(invariant)) out.append("  ").append(v.message(name)).append('\n');
            });
            for (BoundCap.Result r : bounds)
                if (r.violates()) out.append("[tetto-bound] bozza ").append(name).append(" · bound ").append(r.bound).append(": ")
                        .append(r.reasons(settings.cap)).append('\n');
            return out.toString();
        }

        String markdown() { return BenchReport.markdown(this); }

        String json() { return BenchReport.json(this); }
    }

    private Bench() { }

    /** La misura completa: matrice, invarianti e tetto delle bound. */
    static Report run(Draft draft, Settings settings) throws Exception {
        return run(draft, settings, draft);
    }

    /**
     * Come run, con i giocatori creati da un'altra fonte. Serve solo alle prove: un giocatore manomesso dimostra che gli invarianti
     * sulla mano, garantiti oggi da Player e non dalla bozza, saprebbero accorgersi di una regressione del motore.
     */
    static Report run(Draft draft, Settings settings, PlayerSource players) throws Exception {
        for (String deck : settings.decks)
            if (!draft.deckIds().contains(deck)) throw new IllegalArgumentException("Mazzo assente: " + deck + " (noti: " + draft.deckIds() + ")");
        List<Cell> cells = new ArrayList<>();
        for (int i = 0; i < settings.decks.size(); i++) for (int j = i; j < settings.decks.size(); j++)
            for (String sa : settings.styles.keySet()) for (String sb : settings.styles.keySet())
                cells.add(new Cell(settings.decks.get(i), sa, settings.decks.get(j), sb));
        SimulationRunner runner = new SimulationRunner(players);
        if (settings.threads == 1) {
            for (Cell cell : cells) play(draft, runner, settings, cell);
        } else {
            ExecutorService pool = Executors.newFixedThreadPool(settings.threads);
            try {
                List<Future<?>> futures = new ArrayList<>();
                for (Cell cell : cells) futures.add(pool.submit(() -> { play(draft, runner, settings, cell); return null; }));
                for (Future<?> future : futures) future.get();
            } finally {
                pool.shutdownNow();
            }
        }
        Report report = new Report(draft, sha256(draft), settings, cells, BoundCap.run(draft, settings.cap));
        staticChecks(draft, report.checks);
        for (Cell cell : cells) report.checks.merge(cell.checks); // In ordine di cella: gli esempi non dipendono dai thread.
        return report;
    }

    /** Controlli sulla bozza, senza giocare. */
    private static void staticChecks(Draft draft, Checks checks) {
        for (String binding : new java.util.TreeSet<>(draft.cardBindings())) {
            Card card = draft.card(binding);
            if (card.isCharacterBound() && !card.getCost().isEmpty())
                checks.add(new Violation("bound-gratuite", "—", null, -1, -1, "la bound " + binding + " costa " + card.getCost()));
        }
    }

    private static void play(Draft draft, SimulationRunner runner, Settings settings, Cell cell) throws Exception {
        BotPolicy pa = settings.styles.get(cell.styleA), pb = settings.styles.get(cell.styleB);
        for (long seed = settings.firstSeed; seed < settings.firstSeed + settings.games; seed++) {
            boolean aFirst = seed % 2 == 0;
            SimulationRunner.Contender ca = new SimulationRunner.Contender(cell.deckA, pa);
            SimulationRunner.Contender cb = new SimulationRunner.Contender(cell.deckB, pb);
            Watch watch = new Watch(draft, cell, seed,
                    aFirst ? cell.deckA : cell.deckB, aFirst ? cell.styleA : cell.styleB,
                    aFirst ? cell.deckB : cell.deckA, aFirst ? cell.styleB : cell.styleA);
            SimulationRunner.Result result = runner.run(seed, aFirst ? ca : cb, aFirst ? cb : ca, watch);
            watch.finish(result, aFirst);
        }
    }

    /** Ciò che una parte fa in una partita. */
    private static final class Seat {
        final String deck, style, basic, lastResort;
        final List<String> bound;
        final Map<String, long[]> cards = new TreeMap<>(); // giocate, in mano, morta, ferma
        boolean exhausted, killCheck, healthDeath, healthDeathNoKill;
        int lrTurn = -1;
        long healthSpent;
        Map<Resource, Integer> end;

        Seat(Draft draft, String deck, String style) {
            this.deck = deck;
            this.style = style;
            this.basic = draft.basicOf(deck);
            this.bound = draft.boundOf(deck);
            this.lastResort = draft.lastResortOf(deck);
        }
    }

    /** Osserva una partita: misure per parte e invarianti a ogni ROUND_READY. Non cambia nulla della partita. */
    private static final class Watch implements BiConsumer<String, Game> {
        private final Cell cell;
        private final long seed;
        private final Map<String, Seat> seats = new LinkedHashMap<>();

        Watch(Draft draft, Cell cell, long seed, String deck1, String style1, String deck2, String style2) {
            this.cell = cell;
            this.seed = seed;
            seats.put("seat-1", new Seat(draft, deck1, style1));
            seats.put("seat-2", new Seat(draft, deck2, style2));
        }

        @Override
        public void accept(String stage, Game game) {
            if ("ROUND_READY".equals(stage)) ready(game);
            else if ("ROUND_COMMITTED".equals(stage)) for (Map.Entry<String, Seat> e : seats.entrySet()) {
                Seat seat = e.getValue();
                if (!seat.killCheck) continue;
                seat.killCheck = false;
                String other = "seat-1".equals(e.getKey()) ? "seat-2" : "seat-1";
                if (!game.isEliminated(other)) seat.healthDeathNoKill = true;
            }
        }

        private void violation(Seat seat, String invariant, int turn, String detail) {
            cell.checks.add(new Violation(invariant, seat.deck, seat.style, seed, turn, detail));
        }

        private void ready(Game game) {
            int turn = game.getTurn() + 1;
            for (Map.Entry<String, Seat> e : seats.entrySet()) {
                String id = e.getKey();
                Seat seat = e.getValue();
                if (game.isEliminated(id)) continue;
                cell.checks.seatTurns++;
                Player player = game.getPlayers().get(id);
                List<Card> hand = player.getCardsInHand();
                List<LegalMove> legal = BotView.of(game, id).legalMoves();
                Set<String> legalNames = new HashSet<>();
                for (LegalMove move : legal) legalNames.add(move.getCard().getName());
                Move move = null;
                for (Move m : game.getPendingMoves()) if (id.equals(m.getPlayerId())) move = m;
                Card played = null;
                if (move != null && !move.isVoid())
                    for (Card card : hand) if (card.getName().equals(move.getPlayedCardName())) played = card;
                Set<String> inHand = new LinkedHashSet<>();
                boolean regular = false;
                for (Card card : hand) {
                    inHand.add(card.getBindingName());
                    if (!card.isBasicAction() && !card.isCharacterBound() && !card.isLastResort()) regular = true;
                }
                // La mappa delle risorse è quella viva del personaggio: a fine partita contiene i valori finali.
                if (seat.end == null) seat.end = player.getCharacter().getResources();
                if (player.getDeckSize() == 0) seat.exhausted = true;
                if (inHand.contains(seat.lastResort) && seat.lrTurn < 0) seat.lrTurn = turn;

                String where = "mano " + inHand + ", mazzo " + player.getDeckSize() + ", risorse " + player.getCharacter().getResources();
                if (legal.isEmpty()) violation(seat, "senza-mosse", turn, "nessuna mossa legale; " + where);
                if (move == null || move.isVoid()) violation(seat, "mossa-vuota", turn, "mossa vuota; " + where);
                if (!inHand.contains(seat.basic)) violation(seat, "basic-bound-in-mano", turn, "basic " + seat.basic + " assente; " + where);
                for (String b : seat.bound)
                    if (!inHand.contains(b)) violation(seat, "basic-bound-in-mano", turn, "bound " + b + " assente; " + where);
                if (player.getDeckSize() == 0 && hand.size() < Player.CARDS_IN_HAND && !inHand.contains(seat.lastResort))
                    violation(seat, "last-resort-in-mano", turn, "last resort " + seat.lastResort + " assente; " + where);
                for (Card card : hand) {
                    if (card.isLastResort() && !legalNames.contains(card.getName()))
                        violation(seat, "last-resort-giocabile", turn, "last resort " + card.getBindingName() + " non legale; " + where);
                    if (regular && card.isCharacterBound() && !legalNames.contains(card.getName()))
                        violation(seat, "bound-giocabile", turn, "bound " + card.getBindingName() + " non legale; " + where);
                }

                Set<String> seen = new HashSet<>();
                for (Card card : hand) {
                    if (!seen.add(card.getBindingName())) continue;
                    long[] stat = seat.cards.computeIfAbsent(card.getBindingName(), k -> new long[4]);
                    stat[1]++;
                    if (!legalNames.contains(card.getName())) stat[2]++;
                    else if (played == null || !played.getBindingName().equals(card.getBindingName())) stat[3]++;
                }
                if (played != null) {
                    seat.cards.computeIfAbsent(played.getBindingName(), k -> new long[4])[0]++;
                    int cost = played.getCost().getOrDefault(Resource.HEALTH, 0);
                    if (cost > 0) {
                        seat.healthSpent += cost;
                        if (cost >= player.getCharacter().getResources().get(Resource.HEALTH)) {
                            seat.healthDeath = true;
                            seat.killCheck = true;
                        }
                    }
                }
            }
        }

        void finish(SimulationRunner.Result result, boolean aFirst) {
            Tally t = cell.tally;
            t.games++;
            t.turns[Math.min(result.turns, HIST - 1)]++;
            t.turnSum += result.turns;
            t.turnSquares += (double) result.turns * result.turns;
            cell.checks.games++;
            String winnerSeat = result.outcome == SimulationRunner.Outcome.FIRST_WIN ? "seat-1"
                    : result.outcome == SimulationRunner.Outcome.SECOND_WIN ? "seat-2" : null;
            if (winnerSeat != null) {
                t.decisive++;
                if ("seat-1".equals(winnerSeat)) t.firstWins++;
                if ("seat-1".equals(winnerSeat) == aFirst) t.aWins++;
                else t.bWins++;
            } else if (result.outcome == SimulationRunner.Outcome.DRAW) t.draws++;
            else {
                t.limits++;
                Seat first = seats.get("seat-1");
                cell.checks.add(new Violation("limite-turni", first.deck + " contro " + seats.get("seat-2").deck,
                        first.style + " contro " + seats.get("seat-2").style, seed, result.turns, "partita al limite di "
                        + SimulationRunner.MAX_TURNS + " turni"));
            }
            for (Map.Entry<String, Seat> e : seats.entrySet()) {
                boolean isA = "seat-1".equals(e.getKey()) == aFirst;
                Side side = isA ? cell.a : cell.b;
                Seat seat = e.getValue();
                boolean won = e.getKey().equals(winnerSeat), lost = winnerSeat != null && !won;
                side.games++;
                if (won) side.wins++;
                else if (lost) side.losses++;
                else if (result.outcome == SimulationRunner.Outcome.DRAW) side.draws++;
                else side.limits++;
                if (seat.exhausted) side.exhausted++;
                if (seat.lrTurn > 0) {
                    side.lrArrived++;
                    side.lrTurnSum += seat.lrTurn;
                    side.lrHist[Math.min(seat.lrTurn, HIST - 1)]++;
                }
                side.healthSpent += seat.healthSpent;
                if (seat.healthDeath) {
                    side.healthDeaths++;
                    if (seat.healthDeathNoKill) side.healthDeathsNoKill++;
                    if (lost) side.healthDeathsLost++;
                    else if (!won) side.healthDeathsDraw++;
                }
                if (seat.end != null && (won || lost)) {
                    long[] sums = won ? side.endWon : side.endLost;
                    for (int i = 0; i < SPENDABLE.size(); i++) sums[i] += seat.end.getOrDefault(SPENDABLE.get(i), 0);
                    if (won) side.endWonGames++;
                    else side.endLostGames++;
                }
                seat.cards.forEach((binding, s) -> {
                    CardStat stat = side.cards.computeIfAbsent(binding, k -> new CardStat());
                    stat.plays += s[0];
                    stat.inHand += s[1];
                    stat.dead += s[2];
                    stat.idle += s[3];
                    if (s[1] > 0) stat.gamesInHand++;
                    if (s[0] > 0) {
                        stat.gamesPlayed++;
                        if (won) stat.playedWon++;
                        else if (lost) stat.playedLost++;
                    }
                });
            }
        }
    }

    // ---- statistica e formati ----

    /** Intervallo di Wilson al 95% per k successi su n prove; per n = 0 vale [0, 1]. */
    static double[] wilson(long k, long n) {
        if (n == 0) return new double[]{0, 1};
        double p = (double) k / n, z2 = Z * Z;
        double denominator = 1 + z2 / n;
        double centre = (p + z2 / (2.0 * n)) / denominator;
        double half = Z * Math.sqrt(p * (1 - p) / n + z2 / (4.0 * n * n)) / denominator;
        return new double[]{Math.max(0, centre - half), Math.min(1, centre + half)};
    }

    /** Il più piccolo valore t con almeno la frazione q delle osservazioni ≤ t (rango più vicino). */
    static int percentile(int[] hist, long n, double q) {
        if (n == 0) return 0;
        long rank = Math.max(1, (long) Math.ceil(q * n)), seen = 0;
        for (int t = 0; t < hist.length; t++) {
            seen += hist[t];
            if (seen >= rank) return t;
        }
        return hist.length - 1;
    }

    static int min(int[] hist) {
        for (int t = 0; t < hist.length; t++) if (hist[t] > 0) return t;
        return 0;
    }

    static int max(int[] hist) {
        for (int t = hist.length - 1; t >= 0; t--) if (hist[t] > 0) return t;
        return 0;
    }

    static double ratio(long a, long b) { return b == 0 ? 0 : (double) a / b; }

    static BigDecimal round(double value) { return BigDecimal.valueOf(value).setScale(4, RoundingMode.HALF_UP).stripTrailingZeros(); }

    static List<BigDecimal> rounded(double[] values) {
        List<BigDecimal> out = new ArrayList<>();
        for (double v : values) out.add(round(v));
        return out;
    }

    /** Un decimale per il testo in italiano: virgola, cifre fisse. */
    static String decimal(double value, int digits) {
        return String.format(Locale.ROOT, "%." + digits + "f", value).replace('.', ',');
    }

    /** Un numero senza zeri inutili, col punto (le descrizioni lo cambiano in virgola). */
    static String plain(double value) { return BigDecimal.valueOf(value).stripTrailingZeros().toPlainString(); }

    /** La bozza come la scrive il rapporto: relativa alla radice del repository quando ci sta dentro, con le barre normali. */
    static String shownSource(Draft draft) {
        String source = draft.source;
        if (!source.startsWith("classpath:")) try {
            Path root = SimulationCatalog.outputDirectory().getParent().getParent();
            Path path = Path.of(source).toAbsolutePath().normalize();
            if (path.startsWith(root)) source = root.relativize(path).toString();
        } catch (Exception error) {
            // Resta il percorso dato.
        }
        return source.replace(java.io.File.separatorChar, '/');
    }

    static String draftName(Draft draft) {
        return Path.of(draft.source.replace("classpath:", "")).getFileName().toString();
    }

    static String sha256(Draft draft) throws Exception {
        String source = draft.source;
        byte[] bytes = source.startsWith("classpath:")
                ? Draft.class.getResourceAsStream(source.substring("classpath:".length())).readAllBytes()
                : Files.isRegularFile(Path.of(source)) ? Files.readAllBytes(Path.of(source))
                : new ObjectMapper().writeValueAsBytes(draft.json());
        StringBuilder hex = new StringBuilder();
        for (byte b : MessageDigest.getInstance("SHA-256").digest(bytes)) hex.append(String.format("%02x", b));
        return hex.toString();
    }

    static String pretty(Object tree) throws Exception {
        DefaultPrettyPrinter printer = new DefaultPrettyPrinter().withObjectIndenter(new DefaultIndenter("  ", "\n"));
        printer.indentArraysWith(new DefaultIndenter("  ", "\n"));
        return new ObjectMapper().writer(printer).writeValueAsString(tree) + "\n";
    }
}
