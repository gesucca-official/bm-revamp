package com.gsc.bm.sim;

import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.cards.base.tokens.BrokenBottle;
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
        // SB-16i (D97): the 1.5 frozen, both arms with their probe regressions, and the 1.6 of bozza.json.
        Draft a = BozzeStoriche.fromClasspath(SetBaseArms.FROZEN_15);
        check(a, "A", true);
        check(SetBaseArms.arm("B", a), "B", true);
        check(Draft.fromClasspath(DRAFT), "1.6", false);
        // SB-17: prova-sergio in one seat (alternating), the starters in the other.
        check(Draft.fromClasspath(DRAFT), "sergio", false);
        // SB-18 B2 (D126): prova-duccio in one seat (alternating), the starters in the other: the four cards paid in HEALTH.
        check(Draft.fromClasspath(DRAFT), "duccio", false);
        // SB-19 B2 (D130, RP-27): a deck with the items of the «In campo» effect in one seat (alternating), the starters in the other.
        check(Draft.fromClasspath(DRAFT), "malus", false);
        // SB-21h (D159, D160): the measured candidate with the new bounds, the starters and then a variant deck in one seat.
        check(BozzeStoriche.fromClasspath(Sb21h.CANDIDATE), "1.6", false);
        check(BozzeStoriche.fromClasspath(Sb21h.CANDIDATE), "sb21h", false);
    }

    /** SB-19 B2: the decks of the «malus» arm, by seed: the two items, Scatto Repentino, «Lo rivendo»; Steal is in two starters. */
    static final String[] MALUS_DECKS = {"prova-b2-rischio9", "prova-b2-rischio10", "prova-b2-sergio-sigaretta", "prova-b2-beppe"};

    /** SB-19 B2a (D133): the causes of the draw exclusion of a compared turn, in the order they are tried. */
    static final String DRAW_ARRIVED = "an in-play item arrived by a draw", DRAW_DISPLACED = "an in-play item was displaced by a drawn item";

    /** SB-19 B2a: the cards in a player's deck, by identity (the deck has no getter: the engine does not show it, the test may). */
    @SuppressWarnings("unchecked")
    static Set<Card> deckOf(Player p) {
        try {
            java.lang.reflect.Field f = Player.class.getDeclaredField("deck");
            f.setAccessible(true);
            Set<Card> deck = Collections.newSetFromMap(new IdentityHashMap<>());
            deck.addAll((Collection<Card>) f.get(p));
            return deck;
        } catch (ReflectiveOperationException e) {
            throw new AssertionError(e);
        }
    }

    /**
     * SB-19 B2a (D133, RP-27): why the compared turn cannot be forecast from the turn before, or null. What a draw puts on the field
     * ends the turn already acting (RP-27), and the table cannot know the draw. Only two things count: an item with an «In campo»
     * effect that a draw of the turn put on a field ({@link #DRAW_ARRIVED}), and one that was on a field at the start of the turn and is
     * gone while a drawn item arrived at a field now full ({@link #DRAW_DISPLACED}). Every other change of the field stays compared.
     * {@code deckAtReady} and {@code fieldAtReady} are the decks and the fields at the start of the compared turn.
     */
    static String drawCause(com.gsc.bm.model.game.Game g, Map<String, Set<Card>> deckAtReady, Map<String, List<Card>> fieldAtReady) {
        boolean arrived = false, displaced = false;
        for (Player p : g.getPlayers().values()) {
            Set<Card> deck = deckAtReady.getOrDefault(p.getPlayerId(), Set.of());
            List<Card> field = new ArrayList<>(p.getCharacter().getItems());
            boolean drawn = false;
            for (Card c : field) if (deck.contains(c)) { drawn = true; if (!PrintedEffects.inPlay(c).isEmpty()) arrived = true; }
            if (drawn && field.size() == p.getCharacter().getItemsSize())
                for (Card c : fieldAtReady.getOrDefault(p.getPlayerId(), List.of()))
                    if (!PrintedEffects.inPlay(c).isEmpty() && field.stream().noneMatch(x -> x == c)) displaced = true;
        }
        return arrived ? DRAW_ARRIVED : displaced ? DRAW_DISPLACED : null;
    }

    /** SB-19 B2: the in-play item instances near each player. */
    static Map<Card, String> inPlayHolders(com.gsc.bm.model.game.Game g) {
        Map<Card, String> holders = new IdentityHashMap<>();
        for (Player p : g.getPlayers().values())
            for (Card c : p.getCharacter().getItems()) if (!PrintedEffects.inPlay(c).isEmpty()) holders.put(c, p.getPlayerId());
        return holders;
    }

    private static Map<String, BotView.CardSeen> text(Draft draft) throws Exception {
        Map<String, BotView.CardSeen> text = new HashMap<>();
        List<String> decks = new ArrayList<>(List.of(DECKS));
        if (draft.deckIds().contains(Sb17.DECK)) decks.add(Sb17.DECK); // SB-17
        if (draft.deckIds().contains(Sb18.DECK)) decks.add(Sb18.DECK); // SB-18 B2
        for (String d : MALUS_DECKS) if (draft.deckIds().contains(d)) decks.add(d); // SB-19 B2
        for (String deck : decks) {
            Player p = draft.player(deck, "text", new Random(0), null);
            List<Card> cards = new ArrayList<>(p.getCardsInHand());
            cards.addAll(p.getDeck()); cards.addAll(p.getCharacter().getItems()); cards.add(p.getLastResortCard());
            cards.add(new BrokenBottle());
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

    private static void check(Draft draft, String arm, boolean probeRegressions) throws Exception {
        long started = System.nanoTime();
        Map<String, BotView.CardSeen> catalog = text(draft);
        SimulationRunner runner = new SimulationRunner(draft, Ruleset.D50);
        int games = arm.equals("duccio") || arm.equals("malus") ? 400 : 300; // SB-18 B2 (D126): Duccio's games are shorter; 400 seeds keep the floor of 5,000 compared turns
        long[] one = new long[2], two = new long[2], twoRes = new long[2], drawn = new long[2];
        long[] skipped = new long[1], unmodeled = new long[1];
        int[] regressionWindows = new int[1];
        int[] duccio = new int[4]; // SB-18 B2 (D126): in compared turns, the four cards paid in HEALTH (TurnForecastFidelityTest.HEALTH_COSTS)
        long[] malus = new long[3]; // SB-19 B2 (RP-27), in compared two-turn windows: turns with an in-play item, effects applied, items that changed seat
        Map<String, Long> drawExcluded = new TreeMap<>(); // SB-19 B2a (D133): two-turn windows left out for a draw of the compared turn, by cause
        long[] timerTurns = new long[1]; // SB-19 B2a (D133): compared turns that begin with a timer on some character
        int[] sales = new int[2]; // SB-17 B4 (D118): in compared turns, Lo rivendo (the basic that sells) and Fare il vago (the parry bound)
        List<String> misses = new ArrayList<>();
        for (long seed = 7_100_000; seed < 7_100_000 + games; seed++) {
            String a = DECKS[(int) (seed % 5)], b = DECKS[(int) ((seed / 5) % 5)];
            if (arm.equals("sergio")) { if (seed % 2 == 0) a = Sb17.DECK; else b = Sb17.DECK; }
            if (arm.equals("duccio")) { if (seed % 2 == 0) a = Sb18.DECK; else b = Sb18.DECK; }
            if (arm.equals("sb21h")) { String v = Sb21h.VARIANT_DECKS[(int) ((seed / 2) % 2)]; if (seed % 2 == 0) a = v; else b = v; }
            if (arm.equals("malus")) { String m = MALUS_DECKS[(int) ((seed / 2) % MALUS_DECKS.length)]; if (seed % 2 == 0) a = m; else b = m; }
            BotPolicy pa = new LethalAwarePolicy(new SoughtHitPolicy(new AggressivePolicy(), SoughtHitPolicy.Timing.ALWAYS));
            BotPolicy pb = new SoughtHitPolicy(seed % 2 == 0 ? new PrudentPolicy() : new RandomPolicy(), SoughtHitPolicy.Timing.ALWAYS);
            Map<Integer, Map<String, BotView>> views = new HashMap<>();
            Map<Integer, List<ViewTable.Play>> plays = new HashMap<>();
            Map<String, Set<Map<String, Integer>>> pending1 = new HashMap<>(), pending2 = new HashMap<>();
            Map<String, Set<Map<String, Map<Resource, Integer>>>> pending2Res = new HashMap<>();
            Map<String, Boolean> pendingDrawn = new HashMap<>();
            String[] labels = new String[1];
            Map<Card, String> holdersAtReady = new IdentityHashMap<>();
            Map<String, Set<Card>> deckAtReady = new HashMap<>();
            Map<String, List<Card>> fieldAtReady = new HashMap<>();
            long s = seed;
            runner.run(seed, new SimulationRunner.Contender(a, pa), new SimulationRunner.Contender(b, pb), (stage, g) -> {
                if (stage.equals("ROUND_READY")) {
                    pending1.clear(); pending2.clear(); pending2Res.clear();
                    int t = g.getTurn();
                    boolean valid = g.getPendingMoves().size() == 2 && g.getPendingMoves().stream().noneMatch(Move::isVoid);
                    if (!valid) { skipped[0]++; return; }
                    // SB-19 B2a (D133): the table runs timers now, so a turn that begins with one is compared; only the one-turn
                    // forecast of TurnForecast, which has no timers (TurnForecastFidelityTest still leaves them out), is not asked to agree.
                    boolean timers = g.getPlayers().values().stream().anyMatch(p -> !p.getCharacter().getTimers().isEmpty());
                    if (timers) timerTurns[0]++;
                    List<ViewTable.Play> now = new ArrayList<>();
                    Map<String, BotView> seen = new HashMap<>();
                    for (Move m : g.getPendingMoves()) {
                        // SB-16i: the card the move will search, as the engine decides it when the move is sent (D97).
                        String search = m.getSearchChoice() != null ? m.getSearchChoice()
                                : m.getSearchAvailable() != null && !m.getSearchAvailable().isEmpty() ? m.getSearchAvailable().get(0) : null;
                        now.add(new ViewTable.Play(m.getPlayerId(), BotView.publicText(g.getCardFromHand(m.getPlayerId(), m.getPlayedCardName())),
                                m.getTargetId(), m.getChoices().get(Move.AdditionalAction.DISCARD_ONE),
                                m.getChoices().get(Move.AdditionalAction.TARGET_ITEM), search));
                        seen.put(m.getPlayerId(), BotView.of(g, m.getPlayerId()));
                    }
                    views.put(t, seen);
                    plays.put(t, now);
                    holdersAtReady.clear(); holdersAtReady.putAll(inPlayHolders(g));
                    deckAtReady.clear(); fieldAtReady.clear();
                    for (Player p : g.getPlayers().values()) {
                        deckAtReady.put(p.getPlayerId(), deckOf(p));
                        fieldAtReady.put(p.getPlayerId(), new ArrayList<>(p.getCharacter().getItems()));
                    }
                    for (ViewTable.Play p : now) {
                        if (p.card.getName().equals("Fiuto per gli Affari")) sales[0]++;
                        if (p.card.getName().equals("Fare il Vago")) sales[1]++;
                        int paid = TurnForecastFidelityTest.HEALTH_COSTS.indexOf(p.card.getName());
                        if (paid >= 0) duccio[paid]++;
                    }
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
                        if (!timers) assertEquals(new HashSet<>(TurnForecast.variants(seen.get(me), legal, threat)), ends,
                                labels[0] + " first-turn equivalence seen by " + me);
                        pending1.put(me, ends);
                        if (!views.containsKey(t - 1)) continue;
                        // SB-16i: a card without printed text that takes or destroys a far item (Steal, «Smontiamo tutto») is outside
                        // the table's model; on the 1.6 the windows after one are counted apart (first seen at seed 7100197, turn 12).
                        if (!probeRegressions && plays.get(t - 1).stream().anyMatch(p -> p.card.getEffects() == null
                                && p.card.getCanTarget().contains(Card.CardTarget.FAR_ITEM))) { unmodeled[0]++; continue; }
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
                    // SB-19 B2a (D133): a draw of this turn that puts an in-play item on a field, or pushes one off, is hidden information.
                    String drawCause = pending2.isEmpty() ? null : drawCause(g, deckAtReady, fieldAtReady);
                    if (drawCause == null && pendingDrawn.values().stream().anyMatch(d -> !d)) {
                        Map<Card, String> after = inPlayHolders(g);
                        if (!after.isEmpty()) malus[0]++;
                        for (Map.Entry<Card, String> e : after.entrySet()) if (!g.getPlayers().get(e.getValue()).getCharacter().isDead()) malus[1]++;
                        for (Map.Entry<Card, String> e : holdersAtReady.entrySet())
                            if (after.containsKey(e.getKey()) && !after.get(e.getKey()).equals(e.getValue())) malus[2]++;
                    }
                    pending2.forEach((id, ends) -> {
                        if (pendingDrawn.get(id)) {
                            drawn[0]++;
                            if (ends.contains(actual)) drawn[1]++;
                            return;
                        }
                        if (drawCause != null) { drawExcluded.merge(drawCause, 1L, Long::sum); return; }
                        two[0]++;
                        if (probeRegressions && ((s == 7_100_093 && g.getTurn() - 1 == 8) || (s == 7_100_115 && g.getTurn() - 1 == 9))) {
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
                + ", skipped " + skipped[0] + ", unmodeled far item " + unmodeled[0] + ", timer turns " + timerTurns[0]
                + ", excluded by a draw of the compared turn " + drawExcluded + ", seconds " + seconds);
        assertTrue(one[0] > 5000);
        assertTrue(two[0] > 1000);
        if (probeRegressions) assertEquals(4, regressionWindows[0], "both seats of the two probe regressions remain covered in arm " + arm);
        if (arm.equals("sergio")) {
            System.out.println("ViewTable fidelity sergio: Lo rivendo " + sales[0] + ", Fare il vago " + sales[1]);
            for (int n : sales) assertTrue(n > 0, "the selling basic and the parry bound are in the compared sample");
        }
        // SB-19 B2a (D133): an arm without in-play items leaves no window out for a draw: its compared windows are what they were.
        if (!arm.equals("malus")) assertTrue(drawExcluded.isEmpty(), "windows left out for a draw in arm " + arm + ": " + drawExcluded);
        if (arm.equals("malus")) {
            System.out.println("ViewTable fidelity malus: turns with an in-play item " + malus[0] + ", effects applied " + malus[1]
                    + ", items that changed seat " + malus[2]);
            assertTrue(two[0] >= 4000, "compared two-turn windows in the malus arm: " + two[0]);
            assertTrue(malus[0] >= 500, "turns with an in-play item in the compared sample: " + malus[0]);
            assertTrue(malus[1] >= 500, "in-play effects applied in the compared sample: " + malus[1]);
            assertTrue(malus[2] >= 5, "in-play items that changed seat in the compared sample: " + malus[2]);
        }
        if (arm.equals("duccio")) {
            System.out.println("ViewTable fidelity duccio: " + TurnForecastFidelityTest.HEALTH_COSTS + " " + java.util.Arrays.toString(duccio));
            for (int n : duccio) assertTrue(n > 0, "every card paid in HEALTH is in the compared sample");
        }
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
