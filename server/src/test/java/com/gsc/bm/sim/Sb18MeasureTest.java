package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.Resource;
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
 * SB-18 Fase B (D124): the round of Duccio Braccio Teso. prova-duccio against each of the five starters and in the mirror, with the
 * twelve lethal-aware styles of the SB-16i round (144 cells per matchup), d50, the draft of {@code -Dsim.draft}. Only with
 * {@code -Dsim.sb18Out}; writes the matrix, the deck observations and the readings of the proposal (§ 4): health spent, recovered and
 * lost, bound plays at low health, payments down to zero and their outcome.
 */
class Sb18MeasureTest {
    private static final ObjectMapper JSON = new ObjectMapper();
    /** Proposal § 4: «giocate di bound quando la salute è sotto 30». */
    static final int LOW_HEALTH = 30;

    /** Counters per «deck|foe|group» of the seat that plays; the analysis reads the seats of prova-duccio. */
    static final class HealthObserve implements BiConsumer<String, Game> {
        final Map<String, String> keys = new HashMap<>();
        final Map<String, Integer> healthBefore = new HashMap<>(), paid = new HashMap<>();
        final Map<String, Card> chosen = new HashMap<>();
        final Map<String, Counts> totals = new TreeMap<>();
        /** The same plays by the style of the seat, «deck|timing/style», for prova-duccio only. */
        final Map<String, String> styleKeys = new HashMap<>();
        final Map<String, Counts> byStyle = new TreeMap<>();

        private Counts counts(String player) { return totals.computeIfAbsent(keys.get(player), k -> new Counts()); }

        private Counts style(String player) {
            String key = styleKeys.get(player);
            return key == null ? new Counts() : byStyle.computeIfAbsent(key, k -> new Counts());
        }

        @Override public void accept(String stage, Game g) {
            if (keys.isEmpty()) for (Player p : g.getPlayers().values()) {
                Player other = g.getPlayers().values().stream().filter(o -> o != p).findFirst().orElseThrow();
                String[] me = ((ChargeMeasureTest.Measured) p.getCharacter()).key.split("\\|");
                String[] foe = ((ChargeMeasureTest.Measured) other.getCharacter()).key.split("\\|");
                keys.put(p.getPlayerId(), me[0] + "|" + foe[0] + "|" + DeckSizeObserve.group(me[1], foe[1]));
                if (me[0].equals(Sb18.DECK)) styleKeys.put(p.getPlayerId(), me[0] + "|" + me[1]);
            }
            if (stage.equals("ROUND_READY")) {
                healthBefore.clear(); paid.clear(); chosen.clear();
                for (Player p : g.getPlayers().values()) {
                    ((ChargeMeasureTest.Measured) p.getCharacter()).resetTurn(); // the damage lost this turn, by source
                    int health = p.getResources().get(Resource.HEALTH);
                    healthBefore.put(p.getPlayerId(), health);
                    counts(p.getPlayerId()).add("seatTurns");
                    if (health < LOW_HEALTH) counts(p.getPlayerId()).add("lowHealthTurns");
                }
                // Costs are applied right after ROUND_READY, before any effect (Game.resolveMoves): what is paid is exact.
                for (Move m : g.getPendingMoves()) {
                    if (m.isVoid()) continue;
                    String id = m.getPlayerId();
                    Card card = g.getCardFromHand(id, m.getPlayedCardName());
                    chosen.put(id, card);
                    Counts c = counts(id);
                    int health = healthBefore.get(id), cost = card.getCost().getOrDefault(Resource.HEALTH, 0);
                    c.add("moves");
                    style(id).add("moves");
                    boolean bound = card.isCharacterBound();
                    if (bound) c.add("boundMoves");
                    if (health < LOW_HEALTH) { c.add("lowHealthMoves"); if (bound) c.add("lowHealthBoundMoves"); }
                    if (cost <= 0) continue;
                    String binding = card.getBindingName();
                    int pay = Math.min(cost, health);
                    paid.put(id, pay);
                    c.add("healthSpent", pay);
                    c.add("healthSpent/" + binding, pay);
                    style(id).add("plays/" + binding);
                    style(id).add("healthSpent", pay);
                    if (cost >= health) { // a payment down to zero: only «Ultimo colpo» may do it (RP-2)
                        c.add("payToZero/" + binding);
                        if (!card.isLastBlow()) c.add("payToZeroWithoutLastBlow");
                    }
                }
                return;
            }
            if (!stage.equals("ROUND_COMMITTED")) return;
            for (Player p : g.getPlayers().values()) {
                String id = p.getPlayerId();
                if (!healthBefore.containsKey(id)) continue;
                Player other = g.getPlayers().values().stream().filter(o -> o != p).findFirst().orElseThrow();
                ChargeMeasureTest.Measured character = (ChargeMeasureTest.Measured) p.getCharacter();
                Counts c = counts(id);
                int before = healthBefore.get(id), after = p.getResources().get(Resource.HEALTH), pay = paid.getOrDefault(id, 0);
                int lost = 0;
                for (int amount : character.lostBy) lost += amount;
                c.add("healthLost", lost);
                // Whatever came back: after = before - paid - damage lost + recovered.
                c.add("healthRecovered", after - before + pay + lost);
                if (g.isOver()) { c.add("games"); style(id).add("games"); }
                Card card = chosen.get(id);
                if (card == null || card.getCost().getOrDefault(Resource.HEALTH, 0) <= 0) continue;
                String binding = card.getBindingName();
                if (after <= 0) c.add("diedInPayingTurn/" + binding);
                if (card.getCost().get(Resource.HEALTH) >= before) { // a payment down to zero, and how the game ended
                    boolean otherDead = other.getResources().get(Resource.HEALTH) <= 0;
                    c.add("payToZero/" + binding + (after > 0 ? "/stillUp" : otherDead ? "/draw" : "/lost"));
                }
            }
        }

        synchronized void merge(HealthObserve game) {
            game.totals.forEach((k, v) -> totals.computeIfAbsent(k, x -> new Counts()).merge(v));
            game.byStyle.forEach((k, v) -> byStyle.computeIfAbsent(k, x -> new Counts()).merge(v));
        }
    }

    @Test @EnabledIfSystemProperty(named = "sim.sb18Out", matches = ".+")
    void round() throws Exception {
        assertEquals(Ruleset.D50, SimulationRunner.selectedRuleset());
        Path out = Path.of(System.getProperty("sim.sb18Out"));
        Files.createDirectories(out);
        Draft draft = SetBaseArms.measureDraft();
        Map<String, BotPolicy> styles = new LinkedHashMap<>();
        for (SoughtHitPolicy.Timing t : SoughtHitPolicy.Timing.values()) for (Map.Entry<String, BotPolicy> s : PlaygroundTest.styles().entrySet()) {
            if (s.getKey().equals("casuale")) continue;
            BotPolicy base = s.getValue() == null ? new RandomPolicy() : s.getValue();
            styles.put(t.name() + "/" + s.getKey(), new LethalAwarePolicy(new SoughtHitPolicy(base, t)));
        }
        assertEquals(12, styles.size());
        List<String> decks = new ArrayList<>(List.of(Sb18.DECK));
        decks.addAll(List.of(DECKS));
        Bench.Settings settings = new Bench.Settings(Integer.getInteger("sim.sb18Games", 300), 7_000_000L, decks, styles,
                Integer.getInteger("sim.threads", 8), BoundCap.Params.DEFAULT, "SB-18 Fase B: Duccio against the five starters and the mirror");
        List<Bench.Cell> cells = new ArrayList<>();
        for (String foe : decks) for (String sa : styles.keySet()) for (String sb : styles.keySet())
            cells.add(new Bench.Cell(Sb18.DECK, sa, foe, sb));
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
        ThreadLocal<HealthObserve> healthWatches = new ThreadLocal<>();
        HealthObserve healthAggregate = new HealthObserve();
        long started = System.nanoTime();
        BiConsumer<String, Game> observation = (stage, g) -> {
            if (stage.equals("ROUND_READY") && g.getTurn() == 0) { deckWatches.remove(); healthWatches.remove(); }
            DeckSizeObserve dw = deckWatches.get();
            if (dw == null) { dw = new DeckSizeObserve(); deckWatches.set(dw); }
            dw.accept(stage, g);
            HealthObserve hw = healthWatches.get();
            if (hw == null) { hw = new HealthObserve(); healthWatches.set(hw); }
            hw.accept(stage, g);
            if (stage.equals("ROUND_COMMITTED") && g.isOver()) {
                deckAggregate.merge(dw); deckWatches.remove();
                healthAggregate.merge(hw); healthWatches.remove();
            }
        };
        Bench.Report report = Bench.runCells(draft, settings, cells, source, observation);
        double seconds = (System.nanoTime() - started) / 1e9;
        Files.writeString(out.resolve("matrix.json"), JSON.writeValueAsString(JSON.readTree(report.json())));
        Files.writeString(out.resolve("matrix.md"), report.markdown());
        Files.writeString(out.resolve("deck-observations.json"), JSON.writeValueAsString(deckAggregate.totals));
        Files.writeString(out.resolve("health-observations.json"), JSON.writeValueAsString(healthAggregate.totals));
        Files.writeString(out.resolve("health-styles.json"), JSON.writeValueAsString(healthAggregate.byStyle));
        Files.writeString(out.resolve("draft.json"), JSON.writeValueAsString(draft.json()));
        Files.writeString(out.resolve("seconds.txt"), String.valueOf(seconds));
        assertEquals(0, report.checks.total(), report.failures());
        assertEquals(0, report.boundViolations(), report.failures());
        System.out.println("sb-18 round: " + report.games() + " games, " + seconds + " seconds");
    }
}
