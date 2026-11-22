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
    /** SB-18 B2 (D126): Duccio's cards paid in HEALTH, by their printed names. */
    static final List<String> HEALTH_COSTS = List.of("Nocche Sbucciate", "E Allora...?", "Craniata Patriottica", "Testa Dura");

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
        // SB-18 B2 (D126): prova-duccio in one seat (alternating), the starters in the other: the four cards paid in HEALTH.
        check(Draft.fromClasspath("/set-base/bozza.json"), "duccio");
        // SB-19 B2 (D130, RP-27): a deck with the in-play items in one seat (alternating), the starters in the other.
        check(Draft.fromClasspath("/set-base/bozza.json"), "malus");
        // SB-21h (D159, D160): the measured candidate, with the defense of one turn plus a gain, the partial cleanup and the two Java
        // variants (counter on «Annuncia», heal from 1 to 30): the starters among themselves, then a variant deck in one seat.
        check(Draft.fromClasspath(Sb21h.CANDIDATE), "1.6");
        check(Draft.fromClasspath(Sb21h.CANDIDATE), "sb21h");
    }

    private static void check(Draft draft, String arm) throws Exception {
        SimulationRunner runner = new SimulationRunner(draft, Ruleset.D50);
        int[] turns = new int[3]; // checked, matched, skipped
        int[] sergio = new int[4]; // SB-17, in checked turns: reflections, kept tokens, Conto salato on a token, Lo sanno tutti resolved (B2, D110)
        int[] duccio = new int[4]; // SB-18 B2 (D126), resolved in checked turns: Nocche sbucciate, E allora?, Capocciata, Testa dura (HEALTH costs)
        int[] sales = new int[2]; // SB-17 B4 (D118): resolved in checked turns, Lo rivendo (the basic that sells) and Fare il vago (the parry bound)
        int[] variants = new int[2]; // SB-21h: resolved in checked turns, «Ne riparliamo fuori» and «Mi rialzo dal marciapiede»
        long[] malus = new long[3]; // SB-19 B2 (RP-27), in checked turns: turns with an in-play item, effects applied, items that changed seat
        List<String> misses = new ArrayList<>();
        // SB-18 B2 (D126): Duccio's games are shorter, so his arm takes 400 seeds to keep the floor of 5,000 checked turns.
        int games = arm.equals("duccio") || arm.equals("malus") ? 400 : 300;
        for (long seed = 7_100_000; seed < 7_100_000 + games; seed++) {
            String a = DECKS[(int) (seed % 5)], b = DECKS[(int) ((seed / 5) % 5)];
            if (arm.equals("sergio")) { if (seed % 2 == 0) a = Sb17.DECK; else b = Sb17.DECK; }
            if (arm.equals("duccio")) { if (seed % 2 == 0) a = Sb18.DECK; else b = Sb18.DECK; }
            if (arm.equals("sb21h")) { String v = Sb21h.VARIANT_DECKS[(int) ((seed / 2) % 2)]; if (seed % 2 == 0) a = v; else b = v; }
            if (arm.equals("malus")) {
                String m = ViewTableFidelityTest.MALUS_DECKS[(int) ((seed / 2) % ViewTableFidelityTest.MALUS_DECKS.length)];
                if (seed % 2 == 0) a = m; else b = m;
            }
            BotPolicy pa = new LethalAwarePolicy(new SoughtHitPolicy(new AggressivePolicy(), SoughtHitPolicy.Timing.ALWAYS));
            BotPolicy pb = new SoughtHitPolicy(seed % 2 == 0 ? new PrudentPolicy() : new RandomPolicy(), SoughtHitPolicy.Timing.ALWAYS);
            Map<String, List<Map<String, Integer>>> forecasts = new HashMap<>();
            Map<com.gsc.bm.model.cards.Card, String> holdersAtReady = new IdentityHashMap<>();
            long s = seed;
            runner.run(seed, new SimulationRunner.Contender(a, pa), new SimulationRunner.Contender(b, pb), (stage, g) -> {
                if (stage.equals("ROUND_READY")) {
                    forecasts.clear();
                    if (g.getPendingMoves().size() != 2 || g.getPendingMoves().stream().anyMatch(Move::isVoid)) return;
                    if (g.getPlayers().values().stream().anyMatch(p -> !p.getCharacter().getTimers().isEmpty())) { turns[2]++; return; }
                    holdersAtReady.clear(); holdersAtReady.putAll(ViewTableFidelityTest.inPlayHolders(g));
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
                        if (m.getPlayedCardName().equals("Conto Salato") && g.getPlayers().containsKey(m.getTargetId()) && g.getPlayers()
                                .get(m.getTargetId()).getCharacter().getStatuses().stream().anyMatch(st -> st.getExposure() != null)) sergio[2]++;
                } else if (!forecasts.isEmpty()) {
                    Map<String, Integer> actual = new HashMap<>();
                    for (Player p : g.getPlayers().values()) actual.put(p.getPlayerId(), p.getCharacter().getResources().get(Resource.HEALTH));
                    for (Move m : g.getResolvedMoves()) {
                        if (m.getPlayedCardName().equals("Buon Vecchio Ricatto") && g.getResolvedMoves().stream().anyMatch(o -> o != m && o.isVoid())) sergio[0]++;
                        if (m.isKeepsToken()) sergio[1]++;
                        if (m.getPlayedCardName().equals("Segreto di Pulcinella") && !m.isVoid()) sergio[3]++;
                        if (m.getPlayedCardName().equals("Fiuto per gli Affari") && !m.isVoid()) sales[0]++;
                        if (m.getPlayedCardName().equals("Fare il Vago") && !m.isVoid()) sales[1]++;
                        if (m.getPlayedCardName().equals(Sb21h.COUNTER) && !m.isVoid()) variants[0]++;
                        if (m.getPlayedCardName().equals(Sb21h.RISE) && !m.isVoid()) variants[1]++;
                        int paid = HEALTH_COSTS.indexOf(m.getPlayedCardName());
                        if (paid >= 0 && !m.isVoid()) duccio[paid]++;
                    }
                    Map<com.gsc.bm.model.cards.Card, String> after = ViewTableFidelityTest.inPlayHolders(g);
                    if (!after.isEmpty()) malus[0]++;
                    for (Map.Entry<com.gsc.bm.model.cards.Card, String> e : after.entrySet())
                        if (!g.getPlayers().get(e.getValue()).getCharacter().isDead()) malus[1]++;
                    for (Map.Entry<com.gsc.bm.model.cards.Card, String> e : holdersAtReady.entrySet())
                        if (after.containsKey(e.getKey()) && !after.get(e.getKey()).equals(e.getValue())) malus[2]++;
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
            System.out.println("forecast fidelity, sergio: Lo rivendo " + sales[0] + ", Fare il vago " + sales[1]);
            for (int n : sales) assertTrue(n > 0, "the selling basic and the parry bound are in the checked sample");
        }
        if (arm.equals("malus")) {
            System.out.println("forecast fidelity, malus: turns with an in-play item " + malus[0] + ", effects applied " + malus[1]
                    + ", items that changed seat " + malus[2]);
            assertTrue(malus[0] >= 500, "turns with an in-play item in the checked sample: " + malus[0]);
            assertTrue(malus[1] >= 500, "in-play effects applied in the checked sample: " + malus[1]);
            assertTrue(malus[2] >= 5, "in-play items that changed seat in the checked sample: " + malus[2]);
        }
        if (arm.equals("sb21h")) {
            System.out.println("forecast fidelity, sb21h: " + Sb21h.COUNTER + " " + variants[0] + ", " + Sb21h.RISE + " " + variants[1]);
            for (int n : variants) assertTrue(n > 0, "both Java variants are in the checked sample");
        }
        if (arm.equals("duccio")) {
            System.out.println("forecast fidelity, duccio: " + HEALTH_COSTS + " " + java.util.Arrays.toString(duccio));
            for (int n : duccio) assertTrue(n > 0, "every card paid in HEALTH is in the checked sample");
        }
    }
}
