package com.gsc.bm.model.game.bot;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.status.Status;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;
import lombok.AllArgsConstructor;
import lombok.Value;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * What a player can see according to R08, as copies of plain data: own hand, everyone's resources and items, no one
 * else's hand, no deck order, no pending moves. It holds no reference to the engine, so a policy cannot reach it.
 */
@Value
public class BotView {

    int turn;
    Self self;
    List<Opponent> opponents;
    List<SeenMove> lastRound;
    Map<String, List<String>> periodicEffects;
    /** SB-16c: the rules of the match, public like the table (D50 in the playground, 1.13 in the live game). */
    Ruleset ruleset;

    @Value
    @AllArgsConstructor
    public static class Self {
        Seat seat;
        List<CardSeen> hand;
        int deckSize;
        /** SB-16g 2a (D58): the own copies found by a search, face up for everyone; {@code slot} is their index in {@link #hand}. */
        List<RevealedSeen> revealed;
        /**
         * SB-16i (D97), playground only: for the cards in hand that announce two names, the announced cards with at least one
         * copy in the own deck, by binding. A player knows it (own list minus what has been seen); no order and no count.
         */
        Map<String, CardSeen> searchable;

        public Self(Seat seat, List<CardSeen> hand, int deckSize, List<RevealedSeen> revealed) {
            this(seat, hand, deckSize, revealed, Map.of());
        }
    }

    @Value
    public static class Opponent {
        Seat seat;
        int handSize;
        int deckSize;
        /** SB-16g 2a (D58, D69): the cards of this hand found by a search and shown face up for everyone; no slot. */
        List<RevealedSeen> revealed;
    }

    /**
     * SB-16g 2a (D58, D69), playground rules only: a card found by a search, face up in a hand, as a human sees it: its id, the
     * card, the turn it was found and, in the own hand only, its index. Its vulnerability token, if any, is the statuses with
     * {@code exposure} = copy.
     */
    @Value
    public static class RevealedSeen {
        int copy;
        CardSeen card;
        int turn;
        Integer slot;
    }

    @Value
    @AllArgsConstructor
    public static class Seat {
        String playerId;
        String character;
        boolean dead;
        boolean forfeited;
        Map<Resource, Integer> resources;
        Set<Resource> immunities;
        List<StatusSeen> statuses;
        List<TimerSeen> timers;
        int itemCapacity;
        List<CardSeen> items;
        /** SB-16i («Rincara»), playground only: how many times this seat played each card, by name in lower case; public. */
        Map<String, Integer> plays;

        public Seat(String playerId, String character, boolean dead, boolean forfeited, Map<Resource, Integer> resources,
                    Set<Resource> immunities, List<StatusSeen> statuses, List<TimerSeen> timers, int itemCapacity, List<CardSeen> items) {
            this(playerId, character, dead, forfeited, resources, immunities, statuses, timers, itemCapacity, items, Map.of());
        }

        public int resource(Resource resource) {
            return resources.getOrDefault(resource, 0);
        }

        /** SB-16i: the earlier plays of the named card by this seat. */
        public int plays(String cardName) {
            return cardName == null ? 0 : plays.getOrDefault(cardName.toLowerCase(java.util.Locale.ROOT), 0);
        }
    }

    @Value
    public static class StatusSeen {
        String name;
        String description;
        StatusType type;
        StatusFlow flow;
        boolean singleUse;
        boolean equip;
        Integer turnsLeft;
        /**
         * SB-16g 2a (D64, D66, D69): the id of the vulnerability token this status belongs to, its factor, and the name of the card
         * whose play ends it (null for the token of a failed search, which lasts {@code turnsLeft}).
         */
        Integer exposure;
        Float factor;
        String untilPlayed;
        /**
         * D76: the damage type the status multiplies and its multiplier, as its text states («Hit Damage taken: x0.6»); null when
         * it does not act on a damage type or is not a plain multiplier; the type it turns that damage into, or null.
         */
        Damage.DamageType property;
        Float scale;
        Damage.DamageType convertTo;
    }

    @Value
    public static class TimerSeen {
        String name;
        int turnsLeft;
    }

    @Value
    public static class SeenMove {
        String playerId;
        String cardName;
        String targetId;
        boolean voided;
        Map<String, String> choices;
        Map<String, List<String>> report;
        /** SB-16c: why the engine voided the move («a terra»), or null. */
        String voidReason;
        /** SB-16c: the card the move searched for (binding) and the card found, shown to everyone; null if none. */
        String searchedFor;
        CardSeen searchFound;
        String role;
    }

    /** Public card text and numbers. Policies decide on these, never on card names. */
    @Value
    @AllArgsConstructor
    public static class CardSeen {
        private static final Pattern FIRST_NUMBER = Pattern.compile("\\d+");

        String name;
        String binding;
        boolean item;
        boolean basicAction;
        boolean lastResort;
        boolean characterBound;
        int priority;
        Set<Card.CardTarget> canTarget;
        Map<Resource, Integer> cost;
        String role;
        String gains;
        String damage;
        String damageAmount;
        /** SB-16c: «Ultimo colpo» written on the card (D50, point 2). */
        boolean lastBlow;
        /** D76: the printed text as numbers, or null when the card cannot describe itself. */
        PrintedEffects effects;
        /**
         * SB-17 B2 (D111): for an item that cannot describe itself (a legacy Java item, {@code effects} null), its public consumed
         * text read by {@link PrintedEffects#consumedText}; null otherwise. Only the forecast of a grab reads it: the styles keep
         * reading {@code effects}, so the boundary of the legacy items for their choices does not move.
         */
        PrintedEffects consumed;

        /** The text without a consumed part, as before SB-17 B2. */
        public CardSeen(String name, String binding, boolean item, boolean basicAction, boolean lastResort, boolean characterBound,
                        int priority, Set<Card.CardTarget> canTarget, Map<Resource, Integer> cost, String role, String gains,
                        String damage, String damageAmount, boolean lastBlow, PrintedEffects effects) {
            this(name, binding, item, basicAction, lastResort, characterBound, priority, canTarget, cost, role, gains, damage,
                    damageAmount, lastBlow, effects, null);
        }

        /** What a grab of this item applies to its author: the printed effects, else the consumed text, else null. */
        public PrintedEffects consumedEffects() {
            return effects != null ? effects : consumed;
        }

        /** Fixed part of the catalog's nominal damage: "HIT 20+x" gives 20, no damage gives 0. */
        public int nominalDamage() {
            if (damageAmount == null) return 0;
            Matcher number = FIRST_NUMBER.matcher(damageAmount);
            return number.find() ? Integer.parseInt(number.group()) : 0;
        }
    }

    public static BotView of(Game game, String playerId) {
        Player me = game.getPlayers().get(playerId);
        List<Opponent> opponents = game.getPlayers().values().stream()
                .filter(p -> !p.getPlayerId().equals(playerId))
                .map(p -> new Opponent(seat(game, p), p.getCardsInHand().size(), p.getDeckSize(), revealed(p, false)))
                .collect(Collectors.toUnmodifiableList());
        return new BotView(game.getTurn(),
                new Self(seat(game, me), cards(me.getCardsInHand()), me.getDeckSize(), revealed(me, true),
                        game.getRuleset().playground() ? searchable(me) : Map.of()),
                opponents,
                game.getResolvedMoves().stream().map(BotView::seen).collect(Collectors.toUnmodifiableList()),
                reports(game.getTimeBasedEffects()), game.getRuleset());
    }

    /** SB-16i: the announced cards of the two-name searches in hand with a copy in the deck, by binding (sorted). */
    private static Map<String, CardSeen> searchable(Player me) {
        Map<String, CardSeen> searchable = new java.util.TreeMap<>();
        for (Card card : me.getCardsInHand()) {
            List<String> names = PrintedEffects.searchedNames(card);
            if (names.size() < 2) continue;
            for (String name : names)
                if (!searchable.containsKey(name))
                    me.getDeck().stream().filter(c -> c.getBindingName().equals(name)).findFirst().ifPresent(c -> searchable.put(name, seen(c)));
        }
        return searchable.isEmpty() ? Map.of() : Collections.unmodifiableMap(searchable);
    }

    /** Every move the rules accept now, one per distinct name, target and choice. */
    public List<LegalMove> legalMoves() {
        List<LegalMove> legal = new ArrayList<>();
        Set<String> names = new LinkedHashSet<>();
        for (CardSeen card : self.hand) {
            if (!names.add(card.name) || !affordable(card)) continue;
            List<String> discards = discards(card);
            String search = searchChoice(card);
            for (String discard : discards) addTargets(card, discard, search, legal);
        }
        return Collections.unmodifiableList(legal);
    }

    /**
     * SB-16i (D97), the rule shared by every bot (styles and Normale): for a card that announces two names, both with a copy in
     * the deck, the hit it can pay next turn, counting the printed reward if found (own resources after the card's cost, plus
     * {@code foundGains}). If both or neither can be paid, the stronger by nominal damage (neither: the cheaper first); the first
     * printed on a tie. Null when there is nothing to choose: the engine then takes the only name left, or the search fails.
     */
    String searchChoice(CardSeen card) {
        if (card.effects == null || self.searchable.isEmpty()) return null;
        PrintedEffects.Step search = card.effects.getSteps().stream().filter(s -> s.getKind() == PrintedEffects.Kind.SEARCH)
                .findFirst().orElse(null);
        if (search == null || search.searchedNames().size() < 2) return null;
        List<CardSeen> options = new ArrayList<>();
        for (String name : search.searchedNames()) if (self.searchable.containsKey(name)) options.add(self.searchable.get(name));
        if (options.size() < 2) return null;
        Map<Resource, Integer> after = new EnumMap<>(Resource.class);
        after.putAll(self.seat.resources);
        card.cost.forEach((r, c) -> after.merge(r, -c, Integer::sum));
        if (search.getFoundGains() != null) search.getFoundGains().forEach((r, g) -> after.merge(r, g, Integer::sum));
        CardSeen best = null;
        boolean bestPays = false;
        for (CardSeen option : options) {
            boolean pays = paysWith(option, after);
            if (best == null || better(option, pays, best, bestPays)) { best = option; bestPays = pays; }
        }
        return best.binding;
    }

    private static boolean better(CardSeen a, boolean aPays, CardSeen b, boolean bPays) {
        if (aPays != bPays) return aPays;
        if (!aPays) {
            int ca = a.cost.values().stream().mapToInt(Integer::intValue).sum(), cb = b.cost.values().stream().mapToInt(Integer::intValue).sum();
            if (ca != cb) return ca < cb;
        }
        return a.nominalDamage() > b.nominalDamage();
    }

    private static boolean paysWith(CardSeen card, Map<Resource, Integer> resources) {
        for (Map.Entry<Resource, Integer> cost : card.cost.entrySet())
            if (resources.getOrDefault(cost.getKey(), 0) < cost.getValue() && !(card.lastBlow && cost.getKey() == Resource.HEALTH)) return false;
        int health = card.cost.getOrDefault(Resource.HEALTH, 0);
        return health == 0 || card.lastBlow || resources.getOrDefault(Resource.HEALTH, 0) > health;
    }

    private boolean affordable(CardSeen card) {
        if (!card.cost.entrySet().stream().allMatch(c -> self.seat.resource(c.getKey()) >= c.getValue()
                || (ruleset.playground() && card.lastBlow && c.getKey() == Resource.HEALTH))) return false;
        // D50, point 2 (playground only), as Move.healthCostAllowed: a HEALTH cost cannot bring its payer to 0, except with «Ultimo colpo».
        int health = card.cost.getOrDefault(Resource.HEALTH, 0);
        return !ruleset.playground() || health == 0 || card.lastBlow || self.seat.resource(Resource.HEALTH) > health;
    }

    private List<String> discards(CardSeen card) {
        if (!card.characterBound) return Collections.singletonList(null);
        return self.hand.stream()
                .filter(c -> !c.characterBound && !c.basicAction && !c.lastResort)
                .map(CardSeen::getName).distinct().collect(Collectors.toList());
    }

    private void addTargets(CardSeen card, String discard, String search, List<LegalMove> legal) {
        if (card.canTarget.contains(Card.CardTarget.NEAR_ITEM)) {
            for (String item : itemNames(self.seat)) legal.add(new LegalMove(card, "SELF", discard, item, search));
            return;
        }
        if (card.canTarget.contains(Card.CardTarget.FAR_ITEM)) {
            for (Opponent opponent : aliveOpponents())
                for (String item : itemNames(opponent.seat))
                    legal.add(new LegalMove(card, opponent.seat.playerId, discard, item, search));
            return;
        }
        if (card.canTarget.contains(Card.CardTarget.SELF))
            legal.add(new LegalMove(card, "SELF", discard, null, search));
        if (card.canTarget.contains(Card.CardTarget.OPPONENT))
            for (Opponent opponent : aliveOpponents())
                legal.add(new LegalMove(card, opponent.seat.playerId, discard, null, search));
    }

    private List<Opponent> aliveOpponents() {
        return opponents.stream().filter(o -> !o.seat.dead).collect(Collectors.toList());
    }

    private static List<String> itemNames(Seat seat) {
        return seat.items.stream().map(CardSeen::getName).distinct().collect(Collectors.toList());
    }

    private static Seat seat(Game game, Player player) {
        Character c = player.getCharacter();
        Map<Resource, Integer> resources = new EnumMap<>(Resource.class);
        resources.putAll(c.getResources());
        return new Seat(player.getPlayerId(), c.getBindingName(), c.isDead(),
                game.getForfeits().containsKey(player.getPlayerId()),
                Collections.unmodifiableMap(resources), Set.copyOf(c.getImmunities()),
                c.getStatuses().stream().map(s -> new StatusSeen(s.getName(), s.getDescription(), s.getType(), s.getFlow(),
                        s.isSingleUse(), s.isEquip(), s.getLastsForTurns(), s.getExposure(), s.getFactor(), s.getUntilPlayed(),
                        s.getImpactedProperty() instanceof Damage.DamageType && scale(s) != null
                                ? (Damage.DamageType) s.getImpactedProperty() : null, scale(s), converted(s)))
                        .collect(Collectors.toUnmodifiableList()),
                c.getTimers().stream().map(t -> new TimerSeen(t.getName(), t.getTimer())).collect(Collectors.toUnmodifiableList()),
                c.getItemsSize(), cards(c.getItems()), c.playCounts().isEmpty() ? Map.of() : Map.copyOf(c.playCounts()));
    }

    /** SB-16g 2a (D58, D69): the cards shown face up in a hand; the slot only for the own hand. Always empty with the live rules. */
    /** D76: the damage type a status turns its damage into, as its text says («turned to Cut Damage»), or null. */
    private static Damage.DamageType converted(Status status) {
        if (!(status.getImpactedProperty() instanceof Damage.DamageType) || status.getTypeFunction() == null) return null;
        Object type = status.getTypeFunction().apply(status.getImpactedProperty());
        return type instanceof Damage.DamageType && type != status.getImpactedProperty() ? (Damage.DamageType) type : null;
    }

    private static List<RevealedSeen> revealed(Player player, boolean own) {
        List<RevealedSeen> shown = new ArrayList<>();
        for (Player.Revealed r : player.getShownRevealed()) {
            int slot = -1;
            for (int i = 0; i < player.getCardsInHand().size(); i++) if (player.getCardsInHand().get(i) == r.getCard()) slot = i;
            shown.add(new RevealedSeen(r.getId(), seen(r.getCard()), r.getTurn(), own ? slot : null));
        }
        return Collections.unmodifiableList(shown);
    }

    private static List<CardSeen> cards(Collection<Card> cards) {
        return cards.stream().map(BotView::seen).collect(Collectors.toUnmodifiableList());
    }

    /** A card as a player reads it when it is public; for tests that replay a turn, never for a policy's hidden information. */
    public static CardSeen publicText(Card card) { return seen(card); }

    private static CardSeen seen(Card card) {
        AbstractCard text = card instanceof AbstractCard ? (AbstractCard) card : null;
        PrintedEffects effects = card instanceof PrintedEffects.Source ? ((PrintedEffects.Source) card).printedEffects() : null;
        // SB-17 B2 (D111): a legacy Java item keeps effects null for the styles; its consumed text is for the forecast only.
        PrintedEffects consumed = effects == null && card.isItem() ? PrintedEffects.consumedText(card) : null;
        return new CardSeen(card.getName(), card.getBindingName(), card.isItem(), card.isBasicAction(), card.isLastResort(),
                card.isCharacterBound(), card.getPriority(), Set.copyOf(card.getCanTarget()), Map.copyOf(card.getCost()),
                text == null ? null : text.getRole(), text == null ? null : text.getGains(),
                text == null ? null : text.getDamage(), text == null ? null : text.getDamageAmount(), card.isLastBlow(),
                effects, consumed);
    }

    /**
     * D76: the multiplier of a status on a damage type, read as its text reads: the amount of one point of damage. Exact for the
     * statuses of the draft ({@code n × factor} in float, so 1 × factor is the factor itself); null if it is not a plain
     * multiplier (zero not kept at zero).
     */
    private static Float scale(Status status) {
        if (!(status.getImpactedProperty() instanceof Damage.DamageType) || status.getAmountFunction() == null) return null;
        Float zero = status.getAmountFunction().apply(0f), one = status.getAmountFunction().apply(1f);
        return zero == null || one == null || zero != 0f ? null : one;
    }

    private static SeenMove seen(Move move) {
        Map<String, String> choices = new LinkedHashMap<>();
        if (move.getChoices() != null)
            move.getChoices().forEach((action, value) -> choices.put(action.name(), value));
        Map<String, List<String>> report = new LinkedHashMap<>();
        move.getMoveReport().forEach((target, lines) -> report.put(target.name(), List.copyOf(lines)));
        return new SeenMove(move.getPlayerId(), move.getPlayedCardName(), move.getTargetId(), move.isVoid(),
                Collections.unmodifiableMap(choices), Collections.unmodifiableMap(report), move.getVoidReason(),
                move.getSearchedFor(), move.getSearchFound() == null ? null : seen(move.getSearchFound()), move.getPlayedRole());
    }

    private static Map<String, List<String>> reports(Map<String, List<String>> effects) {
        Map<String, List<String>> copy = new java.util.TreeMap<>();
        effects.forEach((player, lines) -> copy.put(player, List.copyOf(lines)));
        return Collections.unmodifiableMap(copy);
    }
}
