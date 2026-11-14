package com.gsc.bm.model.game.bot;

import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.status.Status;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;

import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * D85/D91, B5a: a continuing table on copies of public views and card text. No engine objects or hidden information.
 * Forecast mode leaves draws unknown and branches on searches/order. World mode accepts concrete sampled hands/decks;
 * sampling is the caller's responsibility. Timers and resource-changing statuses are outside this model.
 */
public final class ViewTable {
    private static final int HAND_LIMIT = 6;

    /** A move: the card as public text, the target ("SELF" or a seat id), the discard and the item chosen. */
    public static final class Play {
        public final String seat;
        public final BotView.CardSeen card;
        public final String target;
        public final String discard;
        public final String item;

        public Play(String seat, BotView.CardSeen card, String target, String discard, String item) {
            this.seat = seat;
            this.card = card;
            this.target = target;
            this.discard = discard;
            this.item = item;
        }

        public static Play of(String seat, LegalMove m) { return new Play(seat, m.getCard(), m.getTargetId(), m.getDiscard(), m.getItem()); }
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
        BotView.CardSeen card;
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
        int unknownOwnCards;
        /** Top of the deck last, as the engine's Stack. Null in forecast mode. */
        List<BotView.CardSeen> deck;
        int deckSize;
        BotView.CardSeen lastResort;
        List<Mark> marks = new ArrayList<>();

        int get(Resource r) { return res.getOrDefault(r, 0); }
        void set(Resource r, int value) { res.put(r, Math.max(0, value)); }
        boolean down() { return get(Resource.HEALTH) <= 0; }
        int handCount() { return handKnown ? hand.size() + unknownOwnCards : handSize; }

        boolean holds(BotView.CardSeen card) {
            for (BotView.CardSeen c : hand) if (c == card) return true;
            return false;
        }

        Side copy() {
            Side s = new Side();
            s.id = id; s.character = character; s.res.putAll(res); s.immunities = new HashSet<>(immunities);
            for (Stat t : statuses) s.statuses.add(t.copy());
            s.items = new ArrayList<>(items); s.timers = timers; s.itemCapacity = itemCapacity; s.handKnown = handKnown;
            s.hand = new ArrayList<>(hand); s.handSize = handSize; s.unknownOwnCards = unknownOwnCards;
            s.deck = deck == null ? null : new ArrayList<>(deck);
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
    public static final class Flags {
        final boolean firstSeatFirst, firstFinds, secondFinds;

        public Flags(boolean firstSeatFirst, boolean firstFinds, boolean secondFinds) {
            this.firstSeatFirst = firstSeatFirst;
            this.firstFinds = firstFinds;
            this.secondFinds = secondFinds;
        }

        public static List<Flags> all() {
            List<Flags> all = new ArrayList<>();
            for (int bits = 0; bits < 8; bits++) all.add(new Flags((bits & 1) == 0, (bits & 2) != 0, (bits & 4) != 0));
            return all;
        }
    }

    final Map<String, Side> sides = new LinkedHashMap<>();
    final Map<String, BotView.CardSeen> catalog;
    final Ruleset ruleset;
    final boolean worldMode;
    int turn;
    int serial;
    List<BotView.SeenMove> lastRound;

    private ViewTable(Map<String, BotView.CardSeen> catalog, Ruleset ruleset, boolean worldMode) {
        this.catalog = Map.copyOf(catalog);
        this.ruleset = ruleset;
        this.worldMode = worldMode;
    }

    public ViewTable copy() {
        ViewTable w = new ViewTable(catalog, ruleset, worldMode);
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
    public static ViewTable forecast(BotView view, Map<String, BotView.CardSeen> catalog) {
        ViewTable w = new ViewTable(catalog, view.getRuleset(), false);
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
            for (BotView.RevealedSeen r : o.getRevealed()) {
                s.hand.add(r.getCard());
                s.marks.add(new Mark(r.getCopy(), r.getCard(), r.getTurn()));
            }
            byId.put(s.id, s);
        }
        addTokenMarks(byId.values());
        for (String id : seatOrder(view)) w.sides.put(id, byId.get(id));
        w.serial = maxId(byId.values());
        return w;
    }

    /** Concrete world supplied by a sampler, top of each deck last. All collections are copied. */
    public static ViewTable world(BotView view, Map<String, BotView.CardSeen> catalog,
                                  Map<String, List<BotView.CardSeen>> hands, Map<String, List<BotView.CardSeen>> decks,
                                  Map<String, BotView.CardSeen> lastResorts) {
        ViewTable w = forecast(view, catalog);
        ViewTable result = new ViewTable(catalog, view.getRuleset(), true);
        result.turn = w.turn; result.serial = w.serial; result.lastRound = w.lastRound;
        w.sides.forEach((id, s) -> {
            // Preserve the exact public found copies so their marks continue to refer to the hand.
            List<BotView.RevealedSeen> shown = id.equals(view.getSelf().getSeat().getPlayerId())
                    ? view.getSelf().getRevealed() : view.getOpponents().stream()
                    .filter(o -> o.getSeat().getPlayerId().equals(id)).findFirst().orElseThrow().getRevealed();
            s.hand = copyCards(hands.get(id));
            boolean[] used = new boolean[s.hand.size()];
            for (BotView.RevealedSeen r : shown) {
                for (int i = 0; i < s.hand.size(); i++)
                    if (!used[i] && (r.getSlot() == null || r.getSlot() == i)
                            && s.hand.get(i).getBinding().equals(r.getCard().getBinding())) {
                        s.hand.set(i, r.getCard()); used[i] = true;
                        for (Mark m : s.marks) if (m.id == r.getCopy()) m.card = r.getCard();
                        break;
                    }
            }
            s.handKnown = true; s.deck = copyCards(decks.get(id)); s.deckSize = s.deck.size();
            s.lastResort = lastResorts.get(id); result.sides.put(id, s);
        });
        return result;
    }

    private static List<BotView.CardSeen> copyCards(List<BotView.CardSeen> cards) {
        List<BotView.CardSeen> result = new ArrayList<>();
        for (BotView.CardSeen card : cards) result.add(copyCard(card));
        return result;
    }

    /** Text is immutable, but found-copy marks must distinguish two physical copies with the same name. */
    private static BotView.CardSeen copyCard(BotView.CardSeen c) {
        return new BotView.CardSeen(c.getName(), c.getBinding(), c.isItem(), c.isBasicAction(), c.isLastResort(),
                c.isCharacterBound(), c.getPriority(), c.getCanTarget(), c.getCost(), c.getRole(), c.getGains(),
                c.getDamage(), c.getDamageAmount(), c.isLastBlow(), c.getEffects());
    }

    /** A token whose mark is not shown (the copy left the hand) still has a mark in the engine: keep it, without a card. */
    private static void addTokenMarks(Iterable<Side> sides) {
        for (Side s : sides)
            for (Stat t : s.statuses)
                if (t.exposure != null && s.marks.stream().noneMatch(m -> m.id == t.exposure)) {
                    Mark mark = new Mark(t.exposure, null, -1);
                    if (t.turnsLeft != null) mark.absentSince = -1;
                    s.marks.add(mark);
                }
        for (Side s : sides) s.marks.sort((a, b) -> Integer.compare(a.id, b.id));
    }

    private static int maxId(Iterable<Side> sides) {
        int max = 0;
        for (Side s : sides) for (Mark m : s.marks) max = Math.max(max, m.id);
        return max + 1000; // the engine's serial is not public; ids only need to be new
    }

    public boolean over() { return sides.values().stream().anyMatch(Side::down); }

    /** A view for one seat, as a live view would build it from this table. */
    public BotView view(String id) {
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
    public void playTurn(List<Play> plays, Flags flags) {
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
                if (search != null && act.author.handCount() < HAND_LIMIT) {
                    searchedFor = search.binding;
                    boolean finds = worldMode ? false : (order.indexOf(act.play.seat) == 0 ? flags.firstFinds : flags.secondFinds);
                    found = find(act.author, search, finds);
                    (found != null ? search.foundGains : search.missedGains).forEach((r, n) -> act.author.set(r, act.author.get(r) + n));
                    if (found != null && !found.isItem()) {
                        int id = ++serial;
                        for (Damage.DamageType type : search.factor == null ? Set.<Damage.DamageType>of() : search.damage) {
                            Stat t = new Stat();
                            t.name = "Vulnerable"; t.description = type + " received x" + search.factor;
                            t.kind = StatusType.BAD; t.flow = StatusFlow.INPUT; t.type = type; t.scale = search.factor;
                            t.exposure = id; t.factor = search.factor; t.untilPlayed = found.getName();
                            act.author.statuses.add(t);
                        }
                        act.author.marks.add(new Mark(id, found, turn));
                    }
                } else if (act.author.handCount() < HAND_LIMIT) drawCard(act.author);
            } else {
                if (!act.play.card.isCharacterBound() && !act.play.card.isBasicAction()) removeByName(act.author, act.play.card.getName());
                if (act.author.handCount() < HAND_LIMIT) drawCard(act.author);
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
        if (!s.handKnown) s.handSize = Math.max(0, s.handSize - 1);
        for (int i = 0; i < s.hand.size(); i++) if (s.hand.get(i).getName().equals(name)) { s.hand.remove(i); return; }
        if (s.handKnown) s.unknownOwnCards = Math.max(0, s.unknownOwnCards - 1);
    }

    private void drawCard(Side s) {
        if (!worldMode) {
            if (!s.handKnown) s.handSize++; else s.unknownOwnCards++;
            s.deckSize = Math.max(0, s.deckSize - 1);
            return;
        }
        while (!s.deck.isEmpty()) {
            BotView.CardSeen c = s.deck.remove(s.deck.size() - 1);
            s.deckSize = s.deck.size();
            if (c.isItem()) addItem(s, c);
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
                if (c.isItem()) { addItem(s, c); drawCard(s); } else s.hand.add(c);
                return c;
            }
            drawCard(s);
            return null;
        }
        if (!flag) { drawCard(s); return null; }
        BotView.CardSeen c = copyCard(catalog.get(search.binding));
        s.deckSize = Math.max(0, s.deckSize - 1);
        if (c.isItem()) { addItem(s, c); drawCard(s); }
        else if (s.handKnown) s.hand.add(c);
        else { s.handSize++; s.hand.add(c); }
        return c;
    }

    private static final class Search {
        String binding;
        Float factor;
        Set<Damage.DamageType> damage;
        Map<Resource, Integer> foundGains = Map.of(), missedGains = Map.of();
    }

    private Search resolve(Act act, List<Act> later) {
        Map<Resource, Integer> start = new EnumMap<>(act.author.res);
        int itemsAtStart = act.author.items.size();
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
                    if (step.getDamageType() != null && step.getFactor() != null) subject.statuses.add(status(step));
                    break;
                case SEARCH:
                    search = new Search();
                    search.binding = step.getSearchedCard();
                    search.factor = step.getFactor();
                    search.damage = step.getTokenDamage() == null ? Set.of() : step.getTokenDamage();
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

    private static Stat status(PrintedEffects.Step step) {
        Stat t = new Stat();
        t.name = step.getName();
        t.description = step.getDescription();
        t.kind = step.getStatusType();
        t.flow = step.getFlow();
        t.type = step.getDamageType();
        t.scale = step.getFactor();
        t.convertTo = step.getConvertTo();
        t.turnsLeft = step.getTurns();
        t.singleUse = step.isSingleUse();
        t.equip = step.isEquip();
        return t;
    }

    private void consume(Act act) {
        for (int i = 0; i < act.author.items.size(); i++) {
            BotView.CardSeen item = act.author.items.get(i);
            if (!item.getName().equals(act.play.item)) continue;
            act.author.items.remove(i);
            // The completed public catalog also describes legacy Java items, without changing old BotViews or bots.
            if (item.getEffects() == null) item = catalog.getOrDefault(item.getBinding(), item);
            if (item.getEffects() == null) return;
            Map<Resource, Integer> start = new EnumMap<>(act.author.res);
            for (PrintedEffects.Step step : item.getEffects().getSteps()) {
                if (step.getSpawnedItem() != null) addItem(act.author, catalog.get(step.getSpawnedItem()));
                if (step.getKind() == PrintedEffects.Kind.GAIN && step.getResource() != null)
                    act.author.set(step.getResource(), act.author.get(step.getResource()) + amount(step, act.author, start, 0));
                else if (step.getKind() == PrintedEffects.Kind.LOSE && step.getResource() != null)
                    act.author.set(step.getResource(), act.author.get(step.getResource()) - amount(step, act.author, start, 0));
                else if (step.getKind() == PrintedEffects.Kind.STATUS) {
                    if (step.getDamageType() != null && step.getFactor() != null) act.author.statuses.add(status(step));
                } else if (step.getKind() == PrintedEffects.Kind.IMMUNE && step.getResource() != null)
                    act.author.immunities.add(step.getResource());
                else if (step.getKind() == PrintedEffects.Kind.DAMAGE)
                    damage(act.author, act.author, step.getDamageType(), amount(step, act.author, start, 0), step.getApplying());
            }
            return;
        }
    }

    /** Circular item tray: the oldest item leaves when a new one arrives at capacity. */
    private static void addItem(Side side, BotView.CardSeen item) {
        if (side.items.size() == side.itemCapacity) side.items.remove(0);
        side.items.add(java.util.Objects.requireNonNull(item, "public text of spawned item"));
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
                if (worldMode) {
                    String name = m.card != null ? m.card.getName() : s.statuses.stream()
                            .filter(t -> t.exposure != null && t.exposure == m.id).map(t -> t.untilPlayed)
                            .filter(java.util.Objects::nonNull).findFirst().orElse(null);
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

    public Map<String, Integer> health() {
        Map<String, Integer> h = new LinkedHashMap<>();
        sides.forEach((id, s) -> h.put(id, s.get(Resource.HEALTH)));
        return h;
    }

    public Map<String, Map<Resource, Integer>> resources() {
        Map<String, Map<Resource, Integer>> r = new LinkedHashMap<>();
        sides.forEach((id, s) -> r.put(id, new EnumMap<>(s.res)));
        return r;
    }
}
