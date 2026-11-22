package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.bot.BotPolicy;
import com.gsc.bm.model.game.bot.LethalAwarePolicy;
import com.gsc.bm.model.game.bot.RandomPolicy;
import com.gsc.bm.model.game.bot.SoughtHitPolicy;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;

import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.function.BiConsumer;

import static com.gsc.bm.sim.StarterBalanceMeasureTest.Counts;
import static com.gsc.bm.sim.StarterBalanceMeasureTest.DECKS;
import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * SB-17 Fase B (D106 (5), D107): the round of Sergio Sommerso. prova-sergio against each of the five starters and in the mirror, with the
 * twelve lethal-aware styles of the SB-16i round (144 cells per matchup), d50, the draft of {@code -Dsim.draft}. Only with
 * {@code -Dsim.sb17Out}; writes matrix, deck observations and the counters of Sergio's new effects.
 */
class Sb17MeasureTest {
    private static final ObjectMapper JSON = new ObjectMapper();

    /** Counters of Sergio's new effects, per «deck|foe|group» of the seat that plays the card. */
    static final class SergioObserve implements BiConsumer<String, Game> {
        final Map<String, String> keys = new HashMap<>();
        final Map<String, Boolean> tokenOnTarget = new HashMap<>();
        /** SB-17 B4 (D118): at ROUND_READY, whether the player's opponent shows a found card, and the A the player's move costs. */
        final Map<String, Boolean> foeShows = new HashMap<>();
        final Map<String, Integer> alertnessCost = new HashMap<>();
        final Map<String, Counts> totals = new TreeMap<>();

        private Counts counts(String player) { return totals.computeIfAbsent(keys.get(player), k -> new Counts()); }

        @Override public void accept(String stage, Game g) {
            if (keys.isEmpty()) for (Player p : g.getPlayers().values()) {
                Player other = g.getPlayers().values().stream().filter(o -> o != p).findFirst().orElseThrow();
                String[] me = ((ChargeMeasureTest.Measured) p.getCharacter()).key.split("\\|");
                String[] foe = ((ChargeMeasureTest.Measured) other.getCharacter()).key.split("\\|");
                keys.put(p.getPlayerId(), me[0] + "|" + foe[0] + "|" + DeckSizeObserve.group(me[1], foe[1]));
            }
            if (stage.equals("ROUND_READY")) {
                tokenOnTarget.clear();
                for (Move m : g.getPendingMoves()) {
                    Player target = g.getPlayers().get(m.getTargetId());
                    tokenOnTarget.put(m.getPlayerId(), target != null
                            && target.getCharacter().getStatuses().stream().anyMatch(s -> s.getExposure() != null));
                    Player author = g.getPlayers().get(m.getPlayerId());
                    foeShows.put(m.getPlayerId(), g.getPlayers().values().stream().anyMatch(o -> o != author && !o.getRevealed().isEmpty()));
                    alertnessCost.put(m.getPlayerId(), author.getCardsInHand().stream().filter(c -> c.getName().equals(m.getPlayedCardName()))
                            .findFirst().map(c -> c.getCost().getOrDefault(com.gsc.bm.model.Resource.ALERTNESS, 0)).orElse(0));
                }
                return;
            }
            if (!stage.equals("ROUND_COMMITTED")) return;
            List<Move> moves = g.getResolvedMoves();
            if (g.isOver()) for (Player p : g.getPlayers().values()) counts(p.getPlayerId()).add("games"); // SB-17 B4: per-game readings
            for (Move m : moves) {
                String card = m.getPlayedCardName();
                boolean otherVoided = moves.stream().anyMatch(o -> o != m && o.isVoid());
                Counts c = counts(m.getPlayerId());
                // SB-24 Fase B (D166): the names of the 1.7 next to those of the earlier drafts; the counters carry the printed name.
                switch (card) {
                    case "Ricatto": case "Lo sapevo": case "Buon Vecchio Ricatto": case "Copione Già Visto":
                        if (m.isVoid()) c.add(card + "/selfVoided");
                        else c.add(card + (otherVoided ? "/voided" : "/tooSlow"));
                        break;
                    case "Conto salato": case "Conto Salato":
                        if (!m.isVoid()) c.add(card + (Boolean.TRUE.equals(tokenOnTarget.get(m.getPlayerId())) ? "/onToken" : "/noToken"));
                        break;
                    case "Fare il vago": case "Fare il Vago": // SB-17 B4 (D118): the parry bound, and how often against a found card the opponent shows
                        if (m.isVoid()) break;
                        c.add(card + "/played");
                        if (Boolean.TRUE.equals(foeShows.get(m.getPlayerId()))) c.add(card + "/foeShows");
                        break;
                    case "Lo rivendo": case "Fiuto per gli Affari": // SB-17 B3 (D114), B4 (D118): with the item sold or nothing to sell, from the report of the move
                        if (m.isVoid()) break;
                        String sold = m.getMoveReport().getOrDefault(Card.CardTarget.SELF, List.of()).stream()
                                .filter(l -> l.startsWith("Sold Item ")).findFirst().orElse(null);
                        c.add(card + (sold == null ? "/withoutItem" : "/withItem"));
                        if (sold != null) c.add(card + "/sold/" + sold.substring("Sold Item ".length()));
                        break;
                    default:
                }
                c.add("A spent", alertnessCost.getOrDefault(m.getPlayerId(), 0)); // SB-17 B4: costs are paid even by a voided move (R04)
                // The mark is set on every move Lo sapevo voids; a token is kept only if the voided card is one its author revealed.
                if (m.isKeepsToken() && g.getPlayers().get(m.getPlayerId()).getRevealed().stream()
                        .anyMatch(r -> r.getCard().getName().equalsIgnoreCase(card)))
                    counts(moves.stream().filter(o -> o != m).findFirst().map(Move::getPlayerId).orElse(m.getPlayerId())).add("Lo sapevo/keptToken");
            }
        }

        synchronized void merge(SergioObserve game) { game.totals.forEach((k, v) -> totals.computeIfAbsent(k, x -> new Counts()).merge(v)); }
    }

    @Test @EnabledIfSystemProperty(named = "sim.sb17Out", matches = ".+")
    void round() throws Exception {
        assertEquals(Ruleset.D50, SimulationRunner.selectedRuleset());
        Path out = Path.of(System.getProperty("sim.sb17Out"));
        Files.createDirectories(out);
        Draft draft = Draft.selected();
        Map<String, BotPolicy> styles = new LinkedHashMap<>();
        for (SoughtHitPolicy.Timing t : SoughtHitPolicy.Timing.values()) for (Map.Entry<String, BotPolicy> s : PlaygroundTest.styles().entrySet()) {
            if (s.getKey().equals("casuale")) continue;
            BotPolicy base = s.getValue() == null ? new RandomPolicy() : s.getValue();
            styles.put(t.name() + "/" + s.getKey(), new LethalAwarePolicy(new SoughtHitPolicy(base, t)));
        }
        assertEquals(12, styles.size());
        List<String> decks = new ArrayList<>(List.of(Sb17.DECK));
        decks.addAll(List.of(DECKS));
        Bench.Settings settings = new Bench.Settings(Integer.getInteger("sim.sb17Games", 300), 7_000_000L, decks, styles,
                Integer.getInteger("sim.threads", 8), BoundCap.Params.DEFAULT, "SB-17 Fase B: Sergio against the five starters and the mirror");
        List<Bench.Cell> cells = new ArrayList<>();
        for (String foe : decks) for (String sa : styles.keySet()) for (String sb : styles.keySet())
            cells.add(new Bench.Cell(Sb17.DECK, sa, foe, sb));
        PlayerSource source = (deck, id, rng, policy) -> {
            Player p = draft.player(deck, id, rng, policy);
            String style = styles.entrySet().stream().filter(e -> e.getValue() == policy).findFirst().orElseThrow().getKey();
            Field f = Player.class.getDeclaredField("character");
            f.setAccessible(true);
            f.set(p, new ChargeMeasureTest.Measured(p.getCharacter(), deck + "|" + style));
            return p;
        };
        ThreadLocal<DeckSizeObserve> deckWatches = new ThreadLocal<>();
        DeckSizeObserve deckAggregate = new DeckSizeObserve();
        ThreadLocal<SergioObserve> sergioWatches = new ThreadLocal<>();
        SergioObserve sergioAggregate = new SergioObserve();
        long started = System.nanoTime();
        BiConsumer<String, Game> observation = (stage, g) -> {
            if (stage.equals("ROUND_READY") && g.getTurn() == 0) { deckWatches.remove(); sergioWatches.remove(); }
            DeckSizeObserve dw = deckWatches.get();
            if (dw == null) { dw = new DeckSizeObserve(); deckWatches.set(dw); }
            dw.accept(stage, g);
            SergioObserve sw = sergioWatches.get();
            if (sw == null) { sw = new SergioObserve(); sergioWatches.set(sw); }
            sw.accept(stage, g);
            if (stage.equals("ROUND_COMMITTED") && g.isOver()) {
                deckAggregate.merge(dw); deckWatches.remove();
                sergioAggregate.merge(sw); sergioWatches.remove();
            }
        };
        Bench.Report report = Bench.runCells(draft, settings, cells, source, observation);
        double seconds = (System.nanoTime() - started) / 1e9;
        Files.writeString(out.resolve("matrix.json"), JSON.writeValueAsString(JSON.readTree(report.json())));
        Files.writeString(out.resolve("matrix.md"), report.markdown());
        Files.writeString(out.resolve("deck-observations.json"), JSON.writeValueAsString(deckAggregate.totals));
        Files.writeString(out.resolve("sergio-observations.json"), JSON.writeValueAsString(sergioAggregate.totals));
        Files.writeString(out.resolve("draft.json"), JSON.writeValueAsString(draft.json()));
        Files.writeString(out.resolve("seconds.txt"), String.valueOf(seconds));
        assertEquals(0, report.checks.total(), report.failures());
        assertEquals(0, report.boundViolations(), report.failures());
        System.out.println("sb-17 round: " + report.games() + " games, " + seconds + " seconds");
    }
}
