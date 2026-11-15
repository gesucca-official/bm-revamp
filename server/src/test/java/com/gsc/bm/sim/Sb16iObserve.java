package com.gsc.bm.sim;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.*;
import java.util.*;
import java.util.function.BiConsumer;
import static com.gsc.bm.sim.StarterBalanceMeasureTest.Counts;

/**
 * SB-16i (D97), read-only counters of the 1.6 round, per seat as {@code deck|opponent deck|group} like {@link DeckSizeObserve}:
 * <ul>
 *   <li>{@code choice/<charge>/avail-k}: announced names with a copy in the deck when the charge is played (k = 0, 1, 2);
 *       {@code choice/<charge>/chose/<binding>} when both are there;</li>
 *   <li>{@code search/<charge>/found/<binding>} and {@code search/<charge>/missed} for every search that ran;</li>
 *   <li>{@code lrPlays/n} last resort plays of the seat in the game (voided included, 5 = five or more),
 *       {@code lrPhaseTurns/n} turns from the first last resort played by anyone to the end, and {@code lrGames};</li>
 *   <li>{@code ahead/<card>/yes|no} for every move of a card with «Gioca d'anticipo»;</li>
 *   <li>{@code perPlay/<card>/k}: plays of a card with «Rincara» by the earlier plays of its author.</li>
 * </ul>
 * It only reads the game: the matrix, observations and the SB-16h counters are written as before.
 */
final class Sb16iObserve implements BiConsumer<String, Game> {
    static final class Seat {
        final String key;
        final Counts counts = new Counts();
        Card chosen;
        int lastResorts;
        Seat(String key) { this.key = key; }
    }

    final Map<String, Seat> seats = new LinkedHashMap<>();
    final Map<String, Counts> totals = new TreeMap<>();
    int firstLastResortTurn = -1;

    synchronized void merge(Sb16iObserve game) {
        for (Seat seat : game.seats.values()) totals.computeIfAbsent(seat.key, k -> new Counts()).merge(seat.counts);
    }

    private void initialize(Game g) {
        for (Player p : g.getPlayers().values()) {
            Player other = g.getPlayers().values().stream().filter(o -> o != p).findFirst().orElseThrow();
            String[] me = ((ChargeMeasureTest.Measured) p.getCharacter()).key.split("\\|");
            String[] foe = ((ChargeMeasureTest.Measured) other.getCharacter()).key.split("\\|");
            seats.put(p.getPlayerId(), new Seat(me[0] + "|" + foe[0] + "|" + DeckSizeObserve.group(me[1], foe[1])));
        }
    }

    @Override public void accept(String stage, Game g) {
        if (seats.isEmpty()) initialize(g);
        if (stage.equals("ROUND_READY")) {
            for (Seat seat : seats.values()) seat.chosen = null;
            for (Move m : g.getPendingMoves()) {
                if (m.isVoid()) continue;
                Seat seat = seats.get(m.getPlayerId());
                Card card = g.getCardFromHand(m.getPlayerId(), m.getPlayedCardName());
                seat.chosen = card;
                List<String> names = PrintedEffects.searchedNames(card);
                if (names.size() < 2 || m.getSearchAvailable() == null) continue;
                String pre = "choice/" + card.getBindingName() + "/";
                List<String> available = m.getSearchAvailable();
                seat.counts.add(pre + "avail-" + available.size());
                if (available.size() == 2)
                    seat.counts.add(pre + "chose/" + (m.getSearchChoice() != null ? m.getSearchChoice() : available.get(0)));
            }
            return;
        }
        for (Move m : g.getResolvedMoves()) {
            Seat seat = seats.get(m.getPlayerId());
            if (seat == null || seat.chosen == null) continue;
            String binding = seat.chosen.getBindingName();
            if (m.getSearchedFor() != null)
                seat.counts.add("search/" + binding + "/" + (m.getSearchFound() != null ? "found/" + m.getSearchFound().getBindingName() : "missed"));
            if (m.getAhead() != null) seat.counts.add("ahead/" + binding + "/" + (m.getAhead() ? "yes" : "no"));
            if (m.getPlays() != null) seat.counts.add("perPlay/" + binding + "/" + Math.min(5, m.getPlays()));
            if (seat.chosen.isLastResort()) {
                seat.lastResorts++;
                if (firstLastResortTurn < 0) firstLastResortTurn = g.getTurn() - 1;
            }
        }
        if (!g.isOver()) return;
        for (Seat seat : seats.values()) {
            seat.counts.add("games");
            seat.counts.add("lrPlays/" + Math.min(5, seat.lastResorts));
            if (firstLastResortTurn >= 0) {
                seat.counts.add("lrGames");
                seat.counts.add("lrPhaseTurns/" + Math.min(10, g.getTurn() - firstLastResortTurn));
            }
        }
    }
}
