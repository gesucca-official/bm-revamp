package com.gsc.bm.sim;

import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.bot.BotView;
import com.gsc.bm.model.game.bot.LegalMove;
import com.gsc.bm.model.game.status.Status;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

/**
 * SB-30b, phase A (B4 probe), test sources only: a table played forward several turns from what a bot can see. It is a port of
 * {@link com.gsc.bm.model.game.bot.TurnForecast}'s turn, which only returns the health at the end of the current turn, to a state
 * that carries over: resources, statuses with their duration and single use, tokens and marks of searches, items, hands and
 * decks, and the periodic effects at the end of the turn (TOXICITY, ALCOHOL, durations).
 * <p>
 * Two modes. <b>Forecast</b> (fidelity): the hidden hand and the deck are unknown, a search's outcome is a variant flag, nobody
 * draws. <b>World</b> (search): a determinized world sampled from the view and the public starter lists ({@link Catalog}); hands
 * and decks are concrete, a search finds what the sampled deck holds, the draws follow the sampled order.
 * <p>
 * Nothing here reads a game: a world is built from a {@link BotView} and public card text only. Known gaps, stated in the
 * probe's report: timers (not printed), statuses on resources, the D71 countdown of an absent copy in forecast mode.
 */
final class Sb30bWorld {

    /** Status durations and searched cards are printed on the cards but not in {@link PrintedEffects}: read from the data card. */
    static final class CardText {
        final List<DataCards.StatusStep> statuses = new ArrayList<>();
        DataCards.SearchStep search;
    }

    /** Public knowledge from the draft: the starter lists (D85, point 3) and the printed text of every card. */
    static final class Catalog {
        final Map<String, CardText> texts = new HashMap<>();
        final Map<String, Card> cards = new HashMap<>();
        final Map<String, List<String>> regular = new HashMap<>();
        final Map<String, List<String>> fixed = new HashMap<>();
        final Map<String, String> lastResort = new HashMap<>();

        Catalog(Draft draft, String... decks) throws Exception {
            for (String deck : decks) {
                Player p = draft.player(deck, "probe", new Random(0), null);
                List<Card> all = new ArrayList<>(p.getCardsInHand());
                all.addAll(p.getDeck());
                all.addAll(p.getCharacter().getItems());
                all.add(p.getLastResortCard());
                for (Card c : all) { cards.putIfAbsent(c.getBindingName(), c); texts.computeIfAbsent(c.getBindingName(), b -> text(c)); }
                regular.put(deck, p.getInitialDeckDrawOrder());
                fixed.put(deck, p.getInitialSpecialCards());
                lastResort.put(deck, p.getLastResortCard().getBindingName());
            }
        }

        BotView.CardSeen seen(String binding) { return BotView.publicText(cards.get(binding)); }

        CardText text(String binding) { return texts.getOrDefault(binding, new CardText()); }

        private static CardText text(Card card) {
            CardText text = new CardText();
            try {
                Field f = card.getClass().getDeclaredField("definition");
                f.setAccessible(true);
                DataCards.Definition d = (DataCards.Definition) f.get(card);
                List<DataCards.Step> steps = new ArrayList<>(d.self);
                steps.addAll(d.target);
                for (DataCards.Step s : steps) {
                    if (s instanceof DataCards.StatusStep) text.statuses.add((DataCards.StatusStep) s);
                    if (s instanceof DataCards.SearchStep) text.search = (DataCards.SearchStep) s;
                }
            } catch (NoSuchFieldException javaCard) {
                // A Java card: no status in the draft's Java cards (only timers), no search.
            } catch (IllegalAccessException e) {
                throw new IllegalStateException(e);
            }
            return text;
        }
    }

    /** A move: the card as public text, the target ("SELF" or a seat id), the discard and the item chosen. */
    static final class Play {
        final String seat;
        final BotView.CardSeen card;
        final String target;
        final String discard;
        final String item;

        Play(String seat, BotView.CardSeen card, String target, String discard, String item) {
            this.seat = seat;
            this.card = card;
            this.target = target;
            this.discard = discard;
            this.item = item;
        }

        static Play of(String seat, LegalMove m) { return new Play(seat, m.getCard(), m.getTargetId(), m.getDiscard(), m.getItem()); }
    }

    /** A status: a damage multiplier as the engine applies it, or an opaque one that only ticks. */
    static final class Stat {
        String name, description;
        StatusType kind;
        StatusFlow flow;
        boolean singleUse, equip;
        Integer turnsLeft;
        Integer exposure;
        Float factor;
        String untilPlayed;
        Damage.DamageType type;
        Float scale;
        Damage.DamageType convertTo;

        Stat copy() {
            Stat s = new Stat();
            s.name = name; s.description = description; s.kind = kind; s.flow = flow; s.singleUse = singleUse; s.equip = equip;
            s.turnsLeft = turnsLeft; s.exposure = exposure; s.factor = factor; s.untilPlayed = untilPlayed; s.type = type;
            s.scale = scale; s.convertTo = convertTo;
            return s;
        }

        boolean multiplier() { return type != null && scale != null; }

        BotView.StatusSeen seen() {
            return new BotView.StatusSeen(name, description, kind, flow, singleUse, equip, turnsLeft, exposure, factor, untilPlayed,
                    type, scale, convertTo);
        }

        static Stat of(BotView.StatusSeen s) {
            Stat t = new Stat();
            t.name = s.getName(); t.description = s.getDescription(); t.kind = s.getType(); t.flow = s.getFlow();
            t.singleUse = s.isSingleUse(); t.equip = s.isEquip(); t.turnsLeft = s.getTurnsLeft(); t.exposure = s.getExposure();
            t.factor = s.getFactor(); t.untilPlayed = s.getUntilPlayed(); t.type = s.getProperty(); t.scale = s.getScale();
            t.convertTo = s.getConvertTo();
            return t;
        }
    }

    /** The mark of a card found by a search (D58, D69, D71). */
    static final class Mark {
        final int id;
        final BotView.CardSeen card;
        final int turn;
        Integer absentSince;

        Mark(int id, BotView.CardSeen card, int turn) { this.id = id; this.card = card; this.turn = turn; }
    }

    /** A seat. In forecast mode an opponent's hand is unknown ({@code handKnown} false) and only its size counts. */
    static final class Side {
        String id, character;
        final Map<Resource, Integer> res = new EnumMap<>(Resource.class);
        Set<Resource> immunities = new HashSet<>();
        List<Stat> statuses = new ArrayList<>();
        List<BotView.CardSeen> items = new ArrayList<>();
        List<BotView.TimerSeen> timers = new ArrayList<>();
        int itemCapacity;
        boolean handKnown;
        List<BotView.CardSeen> hand = new ArrayList<>();
        int handSize;
        /** Top of the deck last, as the engine's Stack. Null in forecast mode. */
        List<BotView.CardSeen> deck;
        int deckSize;
        BotView.CardSeen lastResort;
        List<Mark> marks = new ArrayList<>();

        int get(Resource r) { return res.getOrDefault(r, 0); }
        void set(Resource r, int value) { res.put(r, Math.max(0, value)); }
        boolean down() { return get(Resource.HEALTH) <= 0; }
        int handCount() { return handKnown ? hand.size() : handSize; }

        boolean holds(BotView.CardSeen card) {
            for (BotView.CardSeen c : hand) if (c == card) return true;
            return false;
        }

        Side copy() {
            Side s = new Side();
            s.id = id; s.character = character; s.res.putAll(res); s.immunities = new HashSet<>(immunities);
            for (Stat t : statuses) s.statuses.add(t.copy());
            s.items = new ArrayList<>(items); s.timers = timers; s.itemCapacity = itemCapacity; s.handKnown = handKnown;
            s.hand = new ArrayList<>(hand); s.handSize = handSize; s.deck = deck == null ? null : new ArrayList<>(deck);
            s.deckSize = deckSize; s.lastResort = lastResort;
            for (Mark m : marks) { Mark n = new Mark(m.id, m.card, m.turn); n.absentSince = m.absentSince; s.marks.add(n); }
            return s;
        }

        BotView.Seat seat() {
            Map<Resource, Integer> r = new EnumMap<>(Resource.class);
            r.putAll(res);
            List<BotView.StatusSeen> seen = new ArrayList<>();
            for (Stat t : statuses) seen.add(t.seen());
            return new BotView.Seat(id, character, down(), false, Collections.unmodifiableMap(r), Set.copyOf(immunities),
                    Collections.unmodifiableList(seen), timers, itemCapacity, List.copyOf(items));
        }

        List<BotView.RevealedSeen> revealed(boolean own) {
            List<BotView.RevealedSeen> shown = new ArrayList<>();
            for (Mark m : marks) {
                int slot = -1;
                for (int i = 0; i < hand.size(); i++) if (hand.get(i) == m.card) slot = i;
                if (slot >= 0) shown.add(new BotView.RevealedSeen(m.id, m.card, m.turn, own ? slot : null));
            }
            return shown;
        }
    }

    /** Variant flags of one turn, for forecast mode: order inside a tied speed group, searches found. */
    static final class Flags {
        final boolean firstSeatFirst, firstFinds, secondFinds;

        Flags(boolean firstSeatFirst, boolean firstFinds, boolean secondFinds) {
            this.firstSeatFirst = firstSeatFirst;
            this.firstFinds = firstFinds;
            this.secondFinds = secondFinds;
        }

        static List<Flags> all() {
            List<Flags> all = new ArrayList<>();
            for (int bits = 0; bits < 8; bits++) all.add(new Flags((bits & 1) == 0, (bits & 2) != 0, (bits & 4) != 0));
            return all;
        }
    }

    final Map<String, Side> sides = new LinkedHashMap<>();
    final Catalog catalog;
    final Ruleset ruleset;
    final boolean worldMode;
    int turn;
    int serial;
    List<BotView.SeenMove> lastRound;

    private Sb30bWorld(Catalog catalog, Ruleset ruleset, boolean worldMode) {
        this.catalog = catalog;
        this.ruleset = ruleset;
        this.worldMode = worldMode;
    }

    Sb30bWorld copy() {
        Sb30bWorld w = new Sb30bWorld(catalog, ruleset, worldMode);
        sides.forEach((id, s) -> w.sides.put(id, s.copy()));
        w.turn = turn; w.serial = serial; w.lastRound = lastRound;
        return w;
    }

    /** Seat order of the table: the engine breaks ties inside a speed group by it. Public (who sits where). */
    static List<String> seatOrder(BotView view) {
        List<String> ids = new ArrayList<>();
        ids.add(view.getSelf().getSeat().getPlayerId());
        for (BotView.Opponent o : view.getOpponents()) ids.add(o.getSeat().getPlayerId());
        ids.sort(String::compareTo);
        return ids;
    }

    private static Side side(BotView.Seat seat) {
        Side s = new Side();
        s.id = seat.getPlayerId();
        s.character = seat.getCharacter();
        for (Resource r : Resource.values()) s.res.put(r, seat.resource(r));
        s.immunities = new HashSet<>(seat.getImmunities());
        for (BotView.StatusSeen t : seat.getStatuses()) s.statuses.add(Stat.of(t));
        s.items = new ArrayList<>(seat.getItems());
        s.timers = seat.getTimers();
        s.itemCapacity = seat.getItemCapacity();
        return s;
    }

    /** Forecast mode from a bot's view: own hand known, the opponent's hand only as a size, no deck, searches as flags. */
    static Sb30bWorld forecast(BotView view, Catalog catalog) {
        Sb30bWorld w = new Sb30bWorld(catalog, view.getRuleset(), false);
        w.turn = view.getTurn();
        w.lastRound = view.getLastRound();
        Map<String, Side> byId = new HashMap<>();
        Side me = side(view.getSelf().getSeat());
        me.handKnown = true;
        me.hand = new ArrayList<>(view.getSelf().getHand());
        me.deckSize = view.getSelf().getDeckSize();
        for (BotView.RevealedSeen r : view.getSelf().getRevealed()) me.marks.add(new Mark(r.getCopy(), me.hand.get(r.getSlot()), r.getTurn()));
        byId.put(me.id, me);
        for (BotView.Opponent o : view.getOpponents()) {
            Side s = side(o.getSeat());
            s.handSize = o.getHandSize();
            s.deckSize = o.getDeckSize();
            for (BotView.RevealedSeen r : o.getRevealed()) s.marks.add(new Mark(r.getCopy(), r.getCard(), r.getTurn()));
            byId.put(s.id, s);
        }
        addTokenMarks(byId.values());
        for (String id : seatOrder(view)) w.sides.put(id, byId.get(id));
        w.serial = maxId(byId.values());
        return w;
    }

    /**
     * World mode: one determinized world, from the view and the public starter lists only. The own deck is sampled from the own
     * list minus the hand and the items on the field; the opponent's hidden hand and deck from its list minus the cards it shows,
     * its items and the cards seen played last round. Approximate (no memory of the whole match: see the design, B5).
     */
    static Sb30bWorld sample(BotView view, Catalog catalog, String myDeck, String foeDeck, Random random) {
        Sb30bWorld w = new Sb30bWorld(catalog, view.getRuleset(), true);
        w.turn = view.getTurn();
        w.lastRound = view.getLastRound();
        Map<String, Side> byId = new HashMap<>();
        Side me = side(view.getSelf().getSeat());
        me.handKnown = true;
        me.hand = new ArrayList<>(view.getSelf().getHand());
        for (BotView.RevealedSeen r : view.getSelf().getRevealed()) me.marks.add(new Mark(r.getCopy(), me.hand.get(r.getSlot()), r.getTurn()));
        List<String> mine = new ArrayList<>(catalog.regular.get(myDeck));
        for (BotView.CardSeen c : me.hand) mine.remove(c.getBinding());
        for (BotView.CardSeen c : me.items) mine.remove(c.getBinding());
        me.deck = draw(mine, view.getSelf().getDeckSize(), catalog, random);
        me.deckSize = me.deck.size();
        me.lastResort = catalog.seen(catalog.lastResort.get(myDeck));
        byId.put(me.id, me);
        for (BotView.Opponent o : view.getOpponents()) {
            Side s = side(o.getSeat());
            s.handKnown = true;
            List<String> pool = new ArrayList<>(catalog.regular.get(foeDeck));
            for (String binding : catalog.fixed.get(foeDeck)) s.hand.add(catalog.seen(binding));
            for (BotView.RevealedSeen r : o.getRevealed()) {
                s.hand.add(r.getCard());
                s.marks.add(new Mark(r.getCopy(), r.getCard(), r.getTurn()));
                pool.remove(r.getCard().getBinding());
            }
            for (BotView.CardSeen c : s.items) pool.remove(c.getBinding());
            for (BotView.SeenMove m : view.getLastRound())
                if (m.getPlayerId().equals(s.id)) pool.removeIf(new java.util.function.Predicate<String>() {
                    boolean done;
                    @Override public boolean test(String b) {
                        if (done || !b.equals(bindingOf(catalog, m.getCardName()))) return false;
                        done = true;
                        return true;
                    }
                });
            Collections.shuffle(pool, random);
            int hidden = Math.max(0, o.getHandSize() - s.hand.size());
            for (int i = 0; i < hidden && !pool.isEmpty(); i++) s.hand.add(catalog.seen(pool.remove(pool.size() - 1)));
            s.deck = draw(pool, o.getDeckSize(), catalog, random);
            s.deckSize = s.deck.size();
            s.lastResort = catalog.seen(catalog.lastResort.get(foeDeck));
            byId.put(s.id, s);
        }
        addTokenMarks(byId.values());
        for (String id : seatOrder(view)) w.sides.put(id, byId.get(id));
        w.serial = maxId(byId.values());
        return w;
    }

    private static String bindingOf(Catalog catalog, String name) {
        for (Map.Entry<String, Card> e : catalog.cards.entrySet()) if (e.getValue().getName().equals(name)) return e.getKey();
        return null;
    }

    private static List<BotView.CardSeen> draw(List<String> pool, int size, Catalog catalog, Random random) {
        List<String> copy = new ArrayList<>(pool);
        Collections.shuffle(copy, random);
        List<BotView.CardSeen> deck = new ArrayList<>();
        for (int i = 0; i < size && i < copy.size(); i++) deck.add(catalog.seen(copy.get(i)));
        return deck;
    }

    /** A token whose mark is not shown (the copy left the hand) still has a mark in the engine: keep it, without a card. */
    private static void addTokenMarks(Iterable<Side> sides) {
        for (Side s : sides)
            for (Stat t : s.statuses)
                if (t.exposure != null && s.marks.stream().noneMatch(m -> m.id == t.exposure))
                    s.marks.add(new Mark(t.exposure, null, -1));
        for (Side s : sides) s.marks.sort((a, b) -> Integer.compare(a.id, b.id));
    }

    private static int maxId(Iterable<Side> sides) {
        int max = 0;
        for (Side s : sides) for (Mark m : s.marks) max = Math.max(max, m.id);
        return max + 1000; // the engine's serial is not public; ids only need to be new
    }

    boolean over() { return sides.values().stream().anyMatch(Side::down); }

    /** A view for one seat, as {@link BotView#of} would build it from this table. */
    BotView view(String id) {
        Side me = sides.get(id);
        List<BotView.Opponent> opponents = new ArrayList<>();
        for (Side s : sides.values())
            if (s != me) opponents.add(new BotView.Opponent(s.seat(), s.handCount(), s.deckSize, s.revealed(false)));
        return new BotView(turn, new BotView.Self(me.seat(), List.copyOf(me.hand), me.deckSize, me.revealed(true)),
                opponents, lastRound, Map.of(), ruleset);
    }

    // ---- one turn ----

    private static final class Act {
        final Side author, target;
        final Play play;
        final List<PrintedEffects.Step> steps;
        final int seatIndex;
        long speed;
        boolean voided;

        Act(Side author, Side target, Play play, int seatIndex) {
            this.author = author;
            this.target = target;
            this.play = play;
            this.seatIndex = seatIndex;
            this.steps = steps(play.card);
        }
    }

    static List<PrintedEffects.Step> steps(BotView.CardSeen card) {
        if (card.getEffects() != null) return card.getEffects().getSteps();
        if (card.nominalDamage() <= 0) return List.of();
        Damage.DamageType type = Damage.DamageType.HIT;
        if (card.getDamage() != null) for (Damage.DamageType t : Damage.DamageType.values()) if (card.getDamage().contains(t.name())) type = t;
        return List.of(PrintedEffects.damage(true, type, card.nominalDamage()));
    }

    /**
     * Plays one turn with the given moves (null: a void move) and the end of the turn. In forecast mode the flags decide the
     * order inside a tied group and the searches; in world mode the order is the seat order and the searches use the deck.
     */
    void playTurn(List<Play> plays, Flags flags) {
        List<String> order = new ArrayList<>(sides.keySet());
        List<Act> acts = new ArrayList<>();
        for (Play p : plays) {
            if (p == null) continue;
            Side author = sides.get(p.seat);
            Side target = "SELF".equals(p.target) ? author : sides.getOrDefault(p.target, author);
            int index = order.indexOf(p.seat);
            if (!worldMode && flags != null && !flags.firstSeatFirst) index = order.size() - 1 - index;
            acts.add(new Act(author, target, p, index));
        }
        // R04: every cost first, then the speed groups by priority and ALERTNESS after costs (D50, point 1).
        for (Act a : acts)
            for (Map.Entry<Resource, Integer> cost : a.play.card.getCost().entrySet())
                a.author.set(cost.getKey(), a.author.get(cost.getKey()) - cost.getValue());
        for (Act a : acts) a.speed = ((long) a.play.card.getPriority() << 32) + a.author.get(Resource.ALERTNESS);
        acts.sort((a, b) -> a.speed != b.speed ? Long.compare(b.speed, a.speed) : Integer.compare(a.seatIndex, b.seatIndex));
        Long group = null;
        Set<Side> downAtGroupStart = new HashSet<>();
        Set<Mark> satisfied = new HashSet<>();
        List<BotView.SeenMove> seen = new ArrayList<>();
        for (int i = 0; i < acts.size(); i++) {
            Act act = acts.get(i);
            if (group == null || act.speed != group) {
                group = act.speed;
                downAtGroupStart.clear();
                for (Side s : sides.values()) if (s.down()) downAtGroupStart.add(s);
            }
            if (downAtGroupStart.contains(act.author) && act.target != act.author && !act.play.card.isLastBlow()) act.voided = true;
            for (Mark m : act.author.marks)
                if (!satisfied.contains(m) && m.card != null && m.card.getName().equalsIgnoreCase(act.play.card.getName())) {
                    satisfied.add(m); break;
                }
                else if (!satisfied.contains(m) && m.card == null && untilPlayed(act.author, m.id, act.play.card.getName())) {
                    satisfied.add(m); break;
                }
            String searchedFor = null;
            BotView.CardSeen found = null;
            if (!act.voided) {
                if (act.play.discard != null) removeByName(act.author, act.play.discard);
                Search search = resolve(act, acts.subList(i + 1, acts.size()));
                // The played card leaves the hand (not bound or basic cards), then the draw or the search.
                if (!act.play.card.isCharacterBound() && !act.play.card.isBasicAction()) removeByName(act.author, act.play.card.getName());
                if (search != null && act.author.handCount() < Player.CARDS_IN_HAND) {
                    searchedFor = search.binding;
                    boolean finds = worldMode ? false : (order.indexOf(act.play.seat) == 0 ? flags.firstFinds : flags.secondFinds);
                    found = find(act.author, search, finds);
                    (found != null ? search.foundGains : search.missedGains).forEach((r, n) -> act.author.set(r, act.author.get(r) + n));
                    if (found != null && !found.isItem() && search.vulnerability != null && search.vulnerability.factor != null) {
                        int id = ++serial;
                        for (Damage.DamageType type : EnumSet.copyOf(search.vulnerability.damage)) {
                            Stat t = new Stat();
                            t.name = "Vulnerable"; t.description = type + " received x" + search.vulnerability.factor;
                            t.kind = StatusType.BAD; t.flow = StatusFlow.INPUT; t.type = type; t.scale = search.vulnerability.factor;
                            t.exposure = id; t.factor = search.vulnerability.factor; t.untilPlayed = found.getName();
                            act.author.statuses.add(t);
                        }
                        act.author.marks.add(new Mark(id, found, turn));
                    }
                } else if (act.author.handCount() < Player.CARDS_IN_HAND) drawCard(act.author);
            } else {
                if (!act.play.card.isCharacterBound() && !act.play.card.isBasicAction()) removeByName(act.author, act.play.card.getName());
                if (act.author.handCount() < Player.CARDS_IN_HAND) drawCard(act.author);
            }
            seen.add(new BotView.SeenMove(act.play.seat, act.play.card.getName(), act.play.target, act.voided, Map.of(), Map.of(),
                    act.voided ? "a terra" : null, searchedFor, found, act.play.card.getRole()));
        }
        endOfTurn(satisfied);
        lastRound = Collections.unmodifiableList(seen);
        turn++;
    }

    private static boolean untilPlayed(Side s, int id, String name) {
        for (Stat t : s.statuses) if (t.exposure != null && t.exposure == id) return name.equalsIgnoreCase(t.untilPlayed);
        return false;
    }

    private static void removeByName(Side s, String name) {
        if (!s.handKnown) { s.handSize = Math.max(0, s.handSize - 1); return; }
        for (int i = 0; i < s.hand.size(); i++) if (s.hand.get(i).getName().equals(name)) { s.hand.remove(i); return; }
    }

    private void drawCard(Side s) {
        if (!worldMode) { if (!s.handKnown) s.handSize++; return; }
        while (!s.deck.isEmpty()) {
            BotView.CardSeen c = s.deck.remove(s.deck.size() - 1);
            s.deckSize = s.deck.size();
            if (c.isItem()) s.items.add(c);
            else { s.hand.add(c); return; }
        }
        if (s.lastResort != null && s.hand.stream().noneMatch(c -> c.getName().equals(s.lastResort.getName()))) s.hand.add(s.lastResort);
    }

    /** The search after the move: in world mode from the sampled deck, in forecast mode as the flag says. */
    private BotView.CardSeen find(Side s, Search search, boolean flag) {
        if (worldMode) {
            for (int i = s.deck.size() - 1; i >= 0; i--) {
                BotView.CardSeen c = s.deck.get(i);
                if (!c.getBinding().equals(search.binding)) continue;
                s.deck.remove(i);
                s.deckSize = s.deck.size();
                if (c.isItem()) { s.items.add(c); drawCard(s); } else s.hand.add(c);
                return c;
            }
            drawCard(s);
            return null;
        }
        if (!flag) { drawCard(s); return null; }
        BotView.CardSeen c = catalog.seen(search.binding);
        if (c.isItem()) { s.items.add(c); drawCard(s); }
        else if (s.handKnown) s.hand.add(c);
        else { s.handSize++; s.hand.add(c); }
        return c;
    }

    private static final class Search {
        String binding;
        com.gsc.bm.model.game.status.Vulnerability vulnerability;
        Map<Resource, Integer> foundGains = Map.of(), missedGains = Map.of();
    }

    private Search resolve(Act act, List<Act> later) {
        Map<Resource, Integer> start = new EnumMap<>(act.author.res);
        int itemsAtStart = act.author.items.size();
        CardText text = catalog.text(act.play.card.getBinding());
        int statusIndex = 0;
        Search search = null;
        for (PrintedEffects.Step step : act.steps) {
            Side subject = step.isOnTarget() ? act.target : act.author;
            switch (step.getKind()) {
                case DAMAGE:
                    damage(act.author, subject, step.getDamageType(), amount(step, act.author, start, itemsAtStart), step.getApplying());
                    break;
                case GAIN:
                    if (step.getResource() != null)
                        subject.set(step.getResource(), subject.get(step.getResource()) + amount(step, act.author, start, itemsAtStart));
                    break;
                case LOSE:
                    if (step.getResource() != null)
                        subject.set(step.getResource(), subject.get(step.getResource()) - amount(step, act.author, start, itemsAtStart));
                    break;
                case EMPTY:
                    if (step.getResource() != null) subject.set(step.getResource(), 0);
                    break;
                case STATUS:
                    DataCards.StatusStep printed = statusIndex < text.statuses.size() ? text.statuses.get(statusIndex) : null;
                    statusIndex++;
                    if (step.getDamageType() != null && step.getFactor() != null) subject.statuses.add(status(step, printed));
                    break;
                case SEARCH:
                    search = new Search();
                    search.binding = text.search == null ? null : text.search.card;
                    search.vulnerability = text.search == null ? null : text.search.vulnerability;
                    search.foundGains = step.getFoundGains() == null ? Map.of() : step.getFoundGains();
                    search.missedGains = step.getMissedGains() == null ? Map.of() : step.getMissedGains();
                    if (search.binding == null) search = null;
                    break;
                case CONSUME:
                    consume(act);
                    break;
                case IMMUNE:
                case NOT_IMMUNE:
                    if (step.getResource() != null) {
                        if (step.getKind() == PrintedEffects.Kind.IMMUNE) subject.immunities.add(step.getResource());
                        else subject.immunities.remove(step.getResource());
                    }
                    break;
                case COUNTER_TARGET:
                    for (Act next : later) if (next.author == act.target) { next.voided = true; break; }
                    break;
                case COUNTER_ALL:
                    for (Side foe : sides.values()) {
                        if (foe == act.author) continue;
                        for (Act next : later)
                            if (next.author == foe) { if (next.target == act.author) next.voided = true; break; }
                    }
                    break;
                default:
                    break;
            }
        }
        return search;
    }

    private static Stat status(PrintedEffects.Step step, DataCards.StatusStep printed) {
        Stat t = new Stat();
        t.name = printed == null ? "status" : printed.name;
        t.description = printed == null ? "" : printed.description;
        t.kind = step.getStatusType();
        t.flow = step.getFlow();
        t.type = step.getDamageType();
        t.scale = step.getFactor();
        t.convertTo = step.getConvertTo();
        t.turnsLeft = printed == null ? null : printed.turns;
        t.singleUse = printed != null && printed.singleUse;
        t.equip = printed != null && printed.equip;
        return t;
    }

    private void consume(Act act) {
        for (int i = 0; i < act.author.items.size(); i++) {
            BotView.CardSeen item = act.author.items.get(i);
            if (!item.getName().equals(act.play.item)) continue;
            act.author.items.remove(i);
            if (item.getEffects() == null) return;
            CardText text = catalog.text(item.getBinding());
            int statusIndex = 0;
            Map<Resource, Integer> start = new EnumMap<>(act.author.res);
            for (PrintedEffects.Step step : item.getEffects().getSteps()) {
                if (step.getKind() == PrintedEffects.Kind.GAIN && step.getResource() != null)
                    act.author.set(step.getResource(), act.author.get(step.getResource()) + amount(step, act.author, start, 0));
                else if (step.getKind() == PrintedEffects.Kind.LOSE && step.getResource() != null)
                    act.author.set(step.getResource(), act.author.get(step.getResource()) - amount(step, act.author, start, 0));
                else if (step.getKind() == PrintedEffects.Kind.STATUS) {
                    DataCards.StatusStep printed = statusIndex < text.statuses.size() ? text.statuses.get(statusIndex) : null;
                    statusIndex++;
                    if (step.getDamageType() != null && step.getFactor() != null) act.author.statuses.add(status(step, printed));
                } else if (step.getKind() == PrintedEffects.Kind.IMMUNE && step.getResource() != null)
                    act.author.immunities.add(step.getResource());
                else if (step.getKind() == PrintedEffects.Kind.DAMAGE)
                    damage(act.author, act.author, step.getDamageType(), amount(step, act.author, start, 0), step.getApplying());
            }
            return;
        }
    }

    private static int amount(PrintedEffects.Step step, Side author, Map<Resource, Integer> start, int itemsAtStart) {
        int amount = step.getBase();
        if (step.getOf() != null)
            amount += step.getTimes() * ((step.isAtStart() ? start.getOrDefault(step.getOf(), 0) : author.get(step.getOf()))
                    / Math.max(1, step.getDivide()));
        return amount + step.getPerItem() * (step.isAtStart() ? itemsAtStart : author.items.size());
    }

    /** As Character.inflictDamage and takeDamage: OUTPUT statuses, INPUT statuses (single use expended), armour, floor. */
    private static void damage(Side author, Side subject, Damage.DamageType type, int amount, Set<StatusType> applying) {
        Set<StatusType> types = applying == null ? Status.ALL : applying;
        int damage = amount;
        if (author != null)
            for (Stat m : author.statuses)
                if (m.multiplier() && m.flow == StatusFlow.OUTPUT && m.type == type && types.contains(m.kind)) {
                    if (m.convertTo != null) type = m.convertTo;
                    damage = (int) ((float) damage * m.scale);
                    if (m.singleUse) m.turnsLeft = 0;
                }
        Set<StatusType> received = author == null ? Status.ALL : Status.invertViewPoint(types);
        for (Stat m : subject.statuses)
            if (m.multiplier() && m.flow == StatusFlow.INPUT && m.type == type && received.contains(m.kind)) {
                if (m.convertTo != null) type = m.convertTo;
                damage = (int) ((float) damage * m.scale);
                if (m.singleUse) m.turnsLeft = 0;
            }
        if (type == Damage.DamageType.HIT && subject.get(Resource.ALCOHOL) > 0)
            damage = Math.max(0, damage - subject.get(Resource.ALCOHOL) / Ruleset.ALCOHOL_ARMOR_DIVISOR);
        subject.set(Resource.HEALTH, subject.get(Resource.HEALTH) - damage);
    }

    /** As Game.prepareEndOfTurn and Character.resolveTimeBasedEffects, without timers. */
    private void endOfTurn(Set<Mark> satisfied) {
        for (Side s : sides.values())
            for (Mark m : s.marks) {
                boolean wasAbsent = m.absentSince != null;
                Boolean absent = null;
                if (worldMode && m.card != null) {
                    String name = m.card.getName();
                    absent = s.hand.stream().noneMatch(c -> c.getName().equalsIgnoreCase(name))
                            && s.deck.stream().noneMatch(c -> c.getName().equalsIgnoreCase(name));
                    if (!absent) m.absentSince = null; else if (m.absentSince == null) m.absentSince = turn;
                }
                for (Stat t : s.statuses) {
                    if (t.exposure == null || t.exposure != m.id) continue;
                    if (satisfied.contains(m)) t.turnsLeft = 0;
                    else if (absent != null && absent && !wasAbsent) t.turnsLeft = 1;
                    else if (absent != null && !absent && wasAbsent) t.turnsLeft = null;
                }
            }
        for (Side s : sides.values()) {
            if (s.down()) continue;
            if (!s.immunities.contains(Resource.TOXICITY) && s.get(Resource.TOXICITY) > 0)
                damage(null, s, Damage.DamageType.POISON, s.get(Resource.TOXICITY) / 2, null);
            if (!s.immunities.contains(Resource.ALCOHOL) && s.get(Resource.ALCOHOL) > 0) {
                int alcohol = s.get(Resource.ALCOHOL);
                s.set(Resource.ALERTNESS, s.get(Resource.ALERTNESS) - alcohol / 2);
                s.set(Resource.ALCOHOL, alcohol - (alcohol / 2 + 1));
            }
            List<Stat> kept = new ArrayList<>();
            for (Stat t : s.statuses) {
                if (t.turnsLeft != null) t.turnsLeft--;
                if (t.turnsLeft == null || t.turnsLeft >= 0) kept.add(t);
            }
            s.statuses = kept;
        }
        for (Side s : sides.values())
            s.marks.removeIf(m -> satisfied.contains(m) || ((m.card == null || !s.holds(m.card))
                    && s.statuses.stream().noneMatch(t -> t.exposure != null && t.exposure == m.id)));
        if (over())
            for (Side s : sides.values()) { s.marks.clear(); s.statuses.removeIf(t -> t.exposure != null); }
    }

    Map<String, Integer> health() {
        Map<String, Integer> h = new LinkedHashMap<>();
        sides.forEach((id, s) -> h.put(id, s.get(Resource.HEALTH)));
        return h;
    }

    Map<String, Map<Resource, Integer>> resources() {
        Map<String, Map<Resource, Integer>> r = new LinkedHashMap<>();
        sides.forEach((id, s) -> r.put(id, new EnumMap<>(s.res)));
        return r;
    }
}
