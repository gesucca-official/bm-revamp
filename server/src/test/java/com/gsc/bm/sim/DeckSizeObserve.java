package com.gsc.bm.sim;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.*;
import java.util.*;
import java.util.function.BiConsumer;
import static com.gsc.bm.sim.StarterBalanceMeasureTest.Counts;

/** D83 read-only boundary counters. Turns are one-based; a title is counted once per hand/turn, even with multiple copies. */
final class DeckSizeObserve implements BiConsumer<String, Game> {
    static final class Seat {
        final String key;
        final Counts counts = new Counts();
        final Set<String> played = new HashSet<>();
        final Map<String, Integer> first = new HashMap<>();
        int exhausted = -1, announcements;
        Card chosen;
        Seat(String key) { this.key = key; }
    }
    final Map<String, Seat> seats = new LinkedHashMap<>();
    final Map<String, Counts> totals = new TreeMap<>();
    boolean usedLastResort;

    synchronized void merge(DeckSizeObserve game) {
        for (Seat seat : game.seats.values()) totals.computeIfAbsent(seat.key, k -> new Counts()).merge(seat.counts);
    }

    static String group(String a, String b) {
        boolean ca = a.endsWith("/com"), cb = b.endsWith("/com");
        return !ca && !cb ? "heur" : ca && cb ? "com" : "mixed";
    }

    void initialize(Game g) {
        for (Player p : g.getPlayers().values()) {
            Player other = g.getPlayers().values().stream().filter(o -> o != p).findFirst().orElseThrow();
            String[] me = ((ChargeMeasureTest.Measured) p.getCharacter()).key.split("\\|");
            String[] foe = ((ChargeMeasureTest.Measured) other.getCharacter()).key.split("\\|");
            seats.put(p.getPlayerId(), new Seat(me[0] + "|" + foe[0] + "|" + group(me[1], foe[1])));
        }
    }

    @Override public void accept(String stage, Game g) {
        if (seats.isEmpty()) initialize(g);
        if (stage.equals("ROUND_READY")) {
            int turn = g.getTurn() + 1;
            for (Player p : g.getPlayers().values()) {
                Seat seat = seats.get(p.getPlayerId());
                observeExhaustion(seat, p, turn);
                seat.chosen = null;
                for (Move m : g.getPendingMoves()) if (m.getPlayerId().equals(p.getPlayerId()) && !m.isVoid())
                    seat.chosen = g.getCardFromHand(p.getPlayerId(), m.getPlayedCardName());
                Set<String> hand = new HashSet<>();
                for (Card card : p.getCardsInHand()) hand.add(card.getBindingName());
                for (String binding : hand) {
                    String pre = "card/" + binding + "/";
                    seat.counts.add(pre + "handTurns");
                    if (seat.chosen == null || !binding.equals(seat.chosen.getBindingName())) seat.counts.add(pre + "unchosenTurns");
                }
                if (seat.chosen != null) {
                    String binding = seat.chosen.getBindingName();
                    seat.played.add(binding);
                    seat.first.putIfAbsent(binding, turn);
                    seat.counts.add("card/" + binding + "/plays");
                }
            }
        } else {
            boolean anyLastResort = false, anyChosenLastResort = false;
            for (Move m : g.getResolvedMoves()) {
                Seat seat = seats.get(m.getPlayerId());
                if (seat.chosen != null && seat.chosen.isLastResort()) {
                    anyChosenLastResort = true;
                    if (!m.isVoid()) anyLastResort = true;
                }
                if (m.getSearchedFor() != null) {
                    seat.announcements++;
                    seat.counts.add(m.getSearchFound() == null ? "searchMissed" : "searchFound");
                }
            }
            usedLastResort |= anyLastResort;
            for (Player p : g.getPlayers().values()) {
                Seat seat = seats.get(p.getPlayerId());
                observeExhaustion(seat, p, g.getTurn());
                if (!g.isOver()) continue;
                seat.counts.add("games");
                seat.counts.add("turns", g.getTurn());
                seat.counts.add("announcements", seat.announcements);
                seat.counts.add("announcements-" + Math.min(3, seat.announcements));
                if (seat.exhausted >= 0) {
                    seat.counts.add("exhausted");
                    seat.counts.add("exhaustionTurn/" + seat.exhausted);
                }
                for (String binding : seat.played) {
                    seat.counts.add("card/" + binding + "/playedGames");
                    if (ChargeFrequency.isHit(binding)) seat.counts.add("first/" + binding + "/" + seat.first.get(binding));
                }
                if (anyLastResort) seat.counts.add("endWithAnyLastResort");
                if (anyChosenLastResort) seat.counts.add("endWithAnyChosenLastResort");
                if (usedLastResort) seat.counts.add("endAfterAnyLastResort");
                if (anyLastResort && seat.chosen != null && seat.chosen.getBindingName().equals("com.last.Struggle"))
                    seat.counts.add("endWithOwnStruggleChosen");
            }
        }
    }

    private static void observeExhaustion(Seat seat, Player p, int turn) {
        if (seat.exhausted < 0 && p.getDeckSize() == 0) seat.exhausted = turn;
    }
}
