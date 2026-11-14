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
        Draft armA = Draft.fromClasspath("/set-base/bozza.json");
        check(armA, "A");
        check(SetBaseArms.arm("B", armA), "B"); // SB-16g passo 3 (D82): the Bancone of arm B is a public effect too.
    }

    private static void check(Draft draft, String arm) throws Exception {
        SimulationRunner runner = new SimulationRunner(draft, Ruleset.D50);
        int[] turns = new int[3]; // checked, matched, skipped
        List<String> misses = new ArrayList<>();
        for (long seed = 7_100_000; seed < 7_100_300; seed++) {
            String a = DECKS[(int) (seed % 5)], b = DECKS[(int) ((seed / 5) % 5)];
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
                } else if (!forecasts.isEmpty()) {
                    Map<String, Integer> actual = new HashMap<>();
                    for (Player p : g.getPlayers().values()) actual.put(p.getPlayerId(), p.getCharacter().getResources().get(Resource.HEALTH));
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
    }
}
