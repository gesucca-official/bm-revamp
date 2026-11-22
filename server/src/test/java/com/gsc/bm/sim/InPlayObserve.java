package com.gsc.bm.sim;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;

import java.util.*;

/**
 * SB-19 Fase B2 (D130, proposal A2 section 7, criterion 5): what the items with an «In campo» effect do in a match, without a
 * threshold. One instance per game (a thread follows one game at a time); {@link #merge} sums into a total. For each item name and
 * holder character: end-of-turn applications (turns in play), how an instance leaves its holder's field between the start of a turn
 * and its end (consumed, sold, passed to the other seat, destroyed, displaced by the capacity; still in play at the end of the match),
 * and the TOXICITY gained from the effect by holders not immune to it. Read-only: it never changes a game.
 */
final class InPlayObserve {
    /** Item name, then holder character, then counter: applied, consumed, sold, passed, destroyed, displaced, atEnd, toxicityNotImmune. */
    final Map<String, Map<String, Map<String, Long>>> totals = new TreeMap<>();
    /** The cards that destroy, steal and sell an item, by printed name: before and after SB-24 Fase B (D166). */
    private static final Set<String> DESTROYS = Set.of("Smontiamo tutto", "Disassemblare"), STEALS = Set.of("Steal", "Furto con Destrezza"),
            SELLS = Set.of("Lo rivendo", "Fiuto per gli Affari");
    /** At the start of the turn: per player, the in-play item instances near it. */
    private final Map<String, List<Card>> ready = new HashMap<>();

    static boolean any(Draft draft) {
        for (String deck : draft.deckIds()) {
            Player p = draft.player(deck, "probe", new Random(0), null);
            List<Card> cards = new ArrayList<>(p.getCardsInHand());
            cards.addAll(p.getDeck()); cards.addAll(p.getCharacter().getItems());
            for (Card c : cards) if (!PrintedEffects.inPlay(c).isEmpty()) return true;
        }
        return false;
    }

    private void add(String item, String holder, String counter, long n) {
        totals.computeIfAbsent(item, k -> new TreeMap<>()).computeIfAbsent(holder, k -> new TreeMap<>()).merge(counter, n, Long::sum);
    }

    private static List<Card> inPlayItems(Character c) {
        List<Card> found = new ArrayList<>();
        for (Card item : c.getItems()) if (!PrintedEffects.inPlay(item).isEmpty()) found.add(item);
        return found;
    }

    private static boolean holdsInstance(Character c, Card card) {
        for (Card item : c.getItems()) if (item == card) return true;
        return false;
    }

    void accept(String stage, Game g) {
        if (stage.equals("ROUND_READY")) {
            ready.clear();
            for (Player p : g.getPlayers().values()) ready.put(p.getPlayerId(), inPlayItems(p.getCharacter()));
            return;
        }
        if (!stage.equals("ROUND_COMMITTED")) return;
        for (Player p : g.getPlayers().values()) {
            Character c = p.getCharacter();
            String holder = c.getBindingName();
            for (Card item : ready.getOrDefault(p.getPlayerId(), List.of())) {
                if (holdsInstance(c, item)) continue;
                String exit;
                boolean passed = g.getPlayers().values().stream().anyMatch(o -> o != p && holdsInstance(o.getCharacter(), item));
                Move own = g.getResolvedMoves().stream().filter(m -> m.getPlayerId().equals(p.getPlayerId()) && !m.isVoid()
                        && item.getName().equals(m.getChoices().get(Move.AdditionalAction.TARGET_ITEM))).findFirst().orElse(null);
                boolean destroyed = g.getResolvedMoves().stream().anyMatch(m -> !m.isVoid() && !m.getPlayerId().equals(p.getPlayerId())
                        && DESTROYS.contains(m.getPlayedCardName()));
                boolean stolen = g.getResolvedMoves().stream().anyMatch(m -> !m.isVoid() && !m.getPlayerId().equals(p.getPlayerId())
                        && STEALS.contains(m.getPlayedCardName()));
                if (passed) exit = stolen ? "stolen" : "passed";
                else if (own != null) exit = SELLS.contains(own.getPlayedCardName()) ? "sold" : "consumed";
                else if (destroyed) exit = "destroyed";
                else exit = "displaced";
                add(item.getName(), holder, exit, 1);
            }
            if (g.isOver()) for (Card item : inPlayItems(c)) add(item.getName(), holder, "atEnd", 1);
            if (c.isDead()) continue;
            boolean immune = c.getImmunities().contains(Resource.TOXICITY);
            for (Card item : inPlayItems(c)) {
                add(item.getName(), holder, "applied", 1);
                for (PrintedEffects.Step st : PrintedEffects.inPlay(item))
                    if (st.getResource() == Resource.TOXICITY && !immune) add(item.getName(), holder, "toxicityNotImmune", PrintedEffects.inPlayChange(st));
            }
        }
    }

    synchronized void merge(InPlayObserve one) {
        one.totals.forEach((item, holders) -> holders.forEach((holder, counters) ->
                counters.forEach((counter, n) -> add(item, holder, counter, n))));
    }
}
