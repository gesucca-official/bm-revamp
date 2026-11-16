package com.gsc.bm.sim;

import com.gsc.bm.model.Resource;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.bot.*;
import org.junit.jupiter.api.Test;

import java.util.*;

import static com.gsc.bm.sim.StarterBalanceMeasureTest.DECKS;
import static org.junit.jupiter.api.Assertions.*;

/**
 * D76: the forecast of the lethal-aware bot against the engine. In real d50 matches of the draft, each turn is replayed by the
 * forecast with the two moves actually chosen (the opponent's as if shown); the health of both seats at the end of the turn
 * must be one of the forecast's variants. Only turns whose seats carry timers are excluded: their callbacks are not printed.
 */
class TurnForecastFidelityTest {

    @Test
    void theForecastMatchesTheEngineTurnByTurn() throws Exception {
        // SB-16i (D97): the 1.5 frozen, both arms as before, and the 1.6 of bozza.json with its three new effects.
        Draft armA = Draft.fromClasspath(SetBaseArms.FROZEN_15);
        check(armA, "A");
        check(SetBaseArms.arm("B", armA), "B"); // SB-16g passo 3 (D82): the Bancone of arm B is a public effect too.
        check(Draft.fromClasspath("/set-base/bozza.json"), "1.6");
        // SB-17: prova-sergio in one seat (alternating), the starters in the other: reflection, kept token, token condition, swap.
        // SB-17 B2 (D110): Scatto Repentino left prova-sergio; the fourth counter is now Lo sanno tutti, the new strike.
        check(Draft.fromClasspath("/set-base/bozza.json"), "sergio");
    }

    private static void check(Draft draft, String arm) throws Exception {
        SimulationRunner runner = new SimulationRunner(draft, Ruleset.D50);
        int[] turns = new int[3]; // checked, matched, skipped
        int[] sergio = new int[4]; // SB-17, in checked turns: reflections, kept tokens, Conto salato on a token, Lo sanno tutti resolved (B2, D110)
        int[] sales = new int[2]; // SB-17 B3 (D114, D115): Lo rivendo resolved in checked turns, with an item and without
        List<String> misses = new ArrayList<>();
        for (long seed = 7_100_000; seed < 7_100_300; seed++) {
            String a = DECKS[(int) (seed % 5)], b = DECKS[(int) ((seed / 5) % 5)];
            if (arm.equals("sergio")) { if (seed % 2 == 0) a = Sb17.DECK; else b = Sb17.DECK; }
            BotPolicy pa = new LethalAwarePolicy(new SoughtHitPolicy(new AggressivePolicy(), SoughtHitPolicy.Timing.ALWAYS));
            BotPolicy pb = new SoughtHitPolicy(seed % 2 == 0 ? new PrudentPolicy() : new RandomPolicy(), SoughtHitPolicy.Timing.ALWAYS);
            Map<String, List<Map<String, Integer>>> forecasts = new HashMap<>();
            long s = seed;
            runner.run(seed, new SimulationRunner.Contender(a, pa), new SimulationRunner.Contender(b, pb), (stage, g) -> {
                if (stage.equals("ROUND_READY")) {
                    forecasts.clear();
                    if (g.getPendingMoves().size() != 2 || g.getPendingMoves().stream().anyMatch(Move::isVoid)) return;
                    if (g.getPlayers().values().stream().anyMatch(p -> !p.getCharacter().getTimers().isEmpty())) { turns[2]++; return; }
                    for (Move mine : g.getPendingMoves()) {
                        Move theirs = g.getPendingMoves().stream().filter(m -> m != mine).findFirst().orElseThrow();
                        BotView view = BotView.of(g, mine.getPlayerId());
                        LegalMove legal = view.legalMoves().stream().filter(l -> l.getCard().getName().equals(mine.getPlayedCardName())
                                && l.getTargetId().equals(mine.getTargetId())
                                && Objects.equals(l.getDiscard(), mine.getChoices().get(Move.AdditionalAction.DISCARD_ONE))
                                && Objects.equals(l.getItem(), mine.getChoices().get(Move.AdditionalAction.TARGET_ITEM)))
                                .findFirst().orElseThrow();
                        BotView.Seat author = view.getOpponents().get(0).getSeat();
                        TurnForecast.Threat other = new TurnForecast.Threat(author,
                                BotView.publicText(g.getCardFromHand(theirs.getPlayerId(), theirs.getPlayedCardName())),
                                theirs.getTargetId(), theirs.getChoices().get(Move.AdditionalAction.TARGET_ITEM));
                        forecasts.put(mine.getPlayerId(), TurnForecast.variants(view, legal, other));
                    }
                    for (Move m : g.getPendingMoves())
                        if (m.getPlayedCardName().equals("Conto salato") && g.getPlayers().containsKey(m.getTargetId()) && g.getPlayers()
                                .get(m.getTargetId()).getCharacter().getStatuses().stream().anyMatch(st -> st.getExposure() != null)) sergio[2]++;
                } else if (!forecasts.isEmpty()) {
                    Map<String, Integer> actual = new HashMap<>();
                    for (Player p : g.getPlayers().values()) actual.put(p.getPlayerId(), p.getCharacter().getResources().get(Resource.HEALTH));
                    for (Move m : g.getResolvedMoves()) {
                        if (m.getPlayedCardName().equals("Ricatto") && g.getResolvedMoves().stream().anyMatch(o -> o != m && o.isVoid())) sergio[0]++;
                        if (m.isKeepsToken()) sergio[1]++;
                        if (m.getPlayedCardName().equals("Lo sanno tutti") && !m.isVoid()) sergio[3]++;
                        if (m.getPlayedCardName().equals("Lo rivendo") && !m.isVoid())
                            sales[m.getChoices().get(Move.AdditionalAction.TARGET_ITEM) != null ? 0 : 1]++;
                    }
                    forecasts.forEach((id, ends) -> {
                        turns[0]++;
                        if (ends.contains(actual)) turns[1]++;
                        else if (misses.size() < 5) misses.add("seed " + s + " turn " + (g.getTurn() - 1) + " seen by " + id + ": "
                                + actual + " not in " + ends + " moves " + g.getResolvedMoves());
                    });
                }
            });
        }
        System.out.println("forecast fidelity, arm " + arm + ": " + turns[1] + "/" + turns[0] + " turns, " + turns[2] + " skipped for timers");
        assertTrue(turns[0] > 5000, "turni controllati: " + turns[0]);
        assertEquals(turns[0], turns[1], String.join("\n", misses));
        if (arm.equals("sergio")) {
            System.out.println("forecast fidelity, sergio: reflections " + sergio[0] + ", kept tokens " + sergio[1]
                    + ", Conto salato on a token " + sergio[2] + ", Lo sanno tutti " + sergio[3]);
            for (int n : sergio) assertTrue(n > 0, "every new effect is in the checked sample");
            System.out.println("forecast fidelity, sergio: Lo rivendo with an item " + sales[0] + ", without " + sales[1]);
            for (int n : sales) assertTrue(n > 0, "both branches of Lo rivendo are in the checked sample");
        }
    }
}
