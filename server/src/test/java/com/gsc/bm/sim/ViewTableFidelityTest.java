package com.gsc.bm.sim;

import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.cards.com.tokens.BrokenBeerBottle;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.bot.*;
import org.junit.jupiter.api.Test;
import java.util.*;

import static com.gsc.bm.sim.StarterBalanceMeasureTest.DECKS;
import static org.junit.jupiter.api.Assertions.*;

/** D91 B5a: permanent first-turn equivalence and two-turn fidelity, on the unchanged forecast fidelity sample. */
class ViewTableFidelityTest {

    static final String DRAFT = "/set-base/bozza.json";

    @Test
    void equivalenceAndTwoTurnFidelity() throws Exception {
        Draft a = Draft.fromClasspath(DRAFT);
        check(a, "A");
        check(SetBaseArms.arm("B", a), "B");
    }

    private static Map<String, BotView.CardSeen> text(Draft draft) throws Exception {
        Map<String, BotView.CardSeen> text = new HashMap<>();
        for (String deck : DECKS) {
            Player p = draft.player(deck, "text", new Random(0), null);
            List<Card> cards = new ArrayList<>(p.getCardsInHand());
            cards.addAll(p.getDeck()); cards.addAll(p.getCharacter().getItems()); cards.add(p.getLastResortCard());
            cards.add(new BrokenBeerBottle());
            for (Card c : cards) {
                BotView.CardSeen seen = BotView.publicText(c);
                PrintedEffects effects = c.isItem() ? PrintedEffects.consumedText(c) : seen.getEffects();
                text.putIfAbsent(c.getBindingName(), new BotView.CardSeen(seen.getName(), seen.getBinding(), seen.isItem(),
                        seen.isBasicAction(), seen.isLastResort(), seen.isCharacterBound(), seen.getPriority(), seen.getCanTarget(),
                        seen.getCost(), seen.getRole(), seen.getGains(), seen.getDamage(), seen.getDamageAmount(), seen.isLastBlow(), effects));
            }
        }
        return text;
    }

    private static void check(Draft draft, String arm) throws Exception {
        long started = System.nanoTime();
        Map<String, BotView.CardSeen> catalog = text(draft);
        SimulationRunner runner = new SimulationRunner(draft, Ruleset.D50);
        int games = 300;
        long[] one = new long[2], two = new long[2], twoRes = new long[2], drawn = new long[2];
        long[] skipped = new long[1];
        int[] regressionWindows = new int[1];
        List<String> misses = new ArrayList<>();
        for (long seed = 7_100_000; seed < 7_100_000 + games; seed++) {
            String a = DECKS[(int) (seed % 5)], b = DECKS[(int) ((seed / 5) % 5)];
            BotPolicy pa = new LethalAwarePolicy(new SoughtHitPolicy(new AggressivePolicy(), SoughtHitPolicy.Timing.ALWAYS));
            BotPolicy pb = new SoughtHitPolicy(seed % 2 == 0 ? new PrudentPolicy() : new RandomPolicy(), SoughtHitPolicy.Timing.ALWAYS);
            Map<Integer, Map<String, BotView>> views = new HashMap<>();
            Map<Integer, List<ViewTable.Play>> plays = new HashMap<>();
            Map<String, Set<Map<String, Integer>>> pending1 = new HashMap<>(), pending2 = new HashMap<>();
            Map<String, Set<Map<String, Map<Resource, Integer>>>> pending2Res = new HashMap<>();
            Map<String, Boolean> pendingDrawn = new HashMap<>();
            String[] labels = new String[1];
            long s = seed;
            runner.run(seed, new SimulationRunner.Contender(a, pa), new SimulationRunner.Contender(b, pb), (stage, g) -> {
                if (stage.equals("ROUND_READY")) {
                    pending1.clear(); pending2.clear(); pending2Res.clear();
                    int t = g.getTurn();
                    boolean valid = g.getPendingMoves().size() == 2 && g.getPendingMoves().stream().noneMatch(Move::isVoid)
                            && g.getPlayers().values().stream().allMatch(p -> p.getCharacter().getTimers().isEmpty());
                    if (!valid) { skipped[0]++; return; }
                    List<ViewTable.Play> now = new ArrayList<>();
                    Map<String, BotView> seen = new HashMap<>();
                    for (Move m : g.getPendingMoves()) {
                        now.add(new ViewTable.Play(m.getPlayerId(), BotView.publicText(g.getCardFromHand(m.getPlayerId(), m.getPlayedCardName())),
                                m.getTargetId(), m.getChoices().get(Move.AdditionalAction.DISCARD_ONE),
                                m.getChoices().get(Move.AdditionalAction.TARGET_ITEM)));
                        seen.put(m.getPlayerId(), BotView.of(g, m.getPlayerId()));
                    }
                    views.put(t, seen);
                    plays.put(t, now);
                    labels[0] = "seed " + s + " turn " + t + " moves " + now.stream().map(p -> p.seat + ":" + p.card.getName())
                            .reduce((x, y) -> x + ", " + y).orElse("") + (plays.containsKey(t - 1) ? " after " + plays.get(t - 1).stream()
                            .map(p -> p.seat + ":" + p.card.getName()).reduce((x, y) -> x + ", " + y).orElse("") : "");
                    for (String me : seen.keySet()) {
                        Set<Map<String, Integer>> ends = new HashSet<>();
                        for (ViewTable.Flags f : ViewTable.Flags.all()) {
                            ViewTable w = ViewTable.forecast(seen.get(me), catalog);
                            w.playTurn(now, f);
                            ends.add(w.health());
                        }
                        ViewTable.Play mine = now.stream().filter(p -> p.seat.equals(me)).findFirst().orElseThrow();
                        ViewTable.Play theirs = now.stream().filter(p -> !p.seat.equals(me)).findFirst().orElseThrow();
                        LegalMove legal = seen.get(me).legalMoves().stream().filter(m -> m.getCard().getName().equals(mine.card.getName())
                                && m.getTargetId().equals(mine.target) && Objects.equals(m.getDiscard(), mine.discard)
                                && Objects.equals(m.getItem(), mine.item)).findFirst().orElseThrow();
                        TurnForecast.Threat threat = new TurnForecast.Threat(seen.get(me).getOpponents().get(0).getSeat(),
                                theirs.card, theirs.target, theirs.item);
                        assertEquals(new HashSet<>(TurnForecast.variants(seen.get(me), legal, threat)), ends,
                                labels[0] + " first-turn equivalence seen by " + me);
                        pending1.put(me, ends);
                        if (!views.containsKey(t - 1)) continue;
                        Set<Map<String, Integer>> ends2 = new HashSet<>();
                        Set<Map<String, Map<Resource, Integer>>> res2 = new HashSet<>();
                        boolean itemsKnown = false;
                        for (ViewTable.Flags f1 : ViewTable.Flags.all()) {
                            ViewTable w1 = ViewTable.forecast(views.get(t - 1).get(me), catalog);
                            w1.playTurn(plays.get(t - 1), f1);
                            if (w1.over()) continue;
                            // An item drawn to the field after turn 1 is public only at turn 2: no forecast at turn 1 can know it.
                            boolean same = true;
                            for (Player p : g.getPlayers().values())
                                if (!names(p.getCharacter().getItems()).equals(seenNames(w1.view(p.getPlayerId()).getSelf().getSeat().getItems()))) same = false;
                            itemsKnown |= same;
                            for (ViewTable.Flags f2 : ViewTable.Flags.all()) {
                                ViewTable w2 = w1.copy();
                                w2.playTurn(now, f2);
                                ends2.add(w2.health());
                                res2.add(w2.resources());
                            }
                        }
                        pending2.put(me, ends2);
                        pending2Res.put(me, res2);
                        pendingDrawn.put(me, !itemsKnown);
                    }
                } else if (!pending1.isEmpty()) {
                    Map<String, Integer> actual = new HashMap<>();
                    Map<String, Map<Resource, Integer>> actualRes = new HashMap<>();
                    for (Player p : g.getPlayers().values()) {
                        actual.put(p.getPlayerId(), p.getCharacter().getResources().get(Resource.HEALTH));
                        actualRes.put(p.getPlayerId(), new EnumMap<>(p.getCharacter().getResources()));
                    }
                    pending1.forEach((id, ends) -> { one[0]++; if (ends.contains(actual)) one[1]++; });
                    pending2.forEach((id, ends) -> {
                        if (pendingDrawn.get(id)) {
                            drawn[0]++;
                            if (ends.contains(actual)) drawn[1]++;
                            return;
                        }
                        two[0]++;
                        if ((s == 7_100_093 && g.getTurn() - 1 == 8) || (s == 7_100_115 && g.getTurn() - 1 == 9)) {
                            regressionWindows[0]++;
                            assertTrue(ends.contains(actual), labels[0] + " legacy bottle regression " + id);
                        }
                        if (ends.contains(actual)) two[1]++;
                        else {
                            if (misses.size() < 12) misses.add(labels[0] + " seen by " + id + ": " + actual + " not in " + ends);
                        }
                        twoRes[0]++;
                        if (pending2Res.get(id).stream().anyMatch(r -> sameResources(r, actualRes))) twoRes[1]++;
                        else if (misses.size() < 20) misses.add(labels[0] + " seen by " + id + " resources " + actualRes
                                + " not in " + pending2Res.get(id));
                    });
                    pending1.clear(); pending2.clear(); pending2Res.clear(); pendingDrawn.clear();
                }
            });
        }
        double seconds = (System.nanoTime() - started) / 1e9;
        System.out.println("ViewTable fidelity " + arm + ": first " + one[1] + "/" + one[0] + ", two health "
                + two[1] + "/" + two[0] + ", resources " + twoRes[1] + "/" + twoRes[0] + ", excluded items " + drawn[0]
                + ", skipped " + skipped[0] + ", seconds " + seconds);
        assertTrue(one[0] > 5000);
        assertTrue(two[0] > 1000);
        assertEquals(4, regressionWindows[0], "both seats of the two probe regressions remain covered in arm " + arm);
        assertEquals(one[0], one[1], String.join("\n", misses));
        assertEquals(two[0], two[1], String.join("\n", misses));
        assertEquals(twoRes[0], twoRes[1], String.join("\n", misses));
    }

    private static List<String> names(Collection<Card> cards) {
        List<String> n = new ArrayList<>();
        for (Card c : cards) n.add(c.getName());
        Collections.sort(n);
        return n;
    }

    private static List<String> seenNames(Collection<BotView.CardSeen> cards) {
        List<String> n = new ArrayList<>();
        for (BotView.CardSeen c : cards) n.add(c.getName());
        Collections.sort(n);
        return n;
    }

    private static boolean sameResources(Map<String, Map<Resource, Integer>> forecast, Map<String, Map<Resource, Integer>> actual) {
        for (Map.Entry<String, Map<Resource, Integer>> e : actual.entrySet()) {
            Map<Resource, Integer> f = forecast.get(e.getKey());
            for (Resource r : Resource.values())
                if (!Objects.equals(e.getValue().getOrDefault(r, 0), f.getOrDefault(r, 0))) return false;
        }
        return true;
    }

}
