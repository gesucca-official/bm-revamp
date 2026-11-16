package com.gsc.bm.model.cards;

import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;
import com.gsc.bm.model.cards.com.items.AnotherRottenBeer;
import com.gsc.bm.model.cards.com.tokens.BrokenBeerBottle;
import com.gsc.bm.model.game.status.Status;
import lombok.Builder;
import lombok.Value;

import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * SB-16g, D76: what a card's printed text does, as plain numbers in resolution order, so that a bot can read a card the way a
 * player reads it. Data only: no reference to the engine, no hidden information (the card text is public). A card that cannot
 * describe itself returns null from {@link Source#printedEffects()} and is read from its nominal damage.
 */
@Value
public class PrintedEffects implements Serializable {

    public enum Kind {
        /** Damage of {@code damageType} from the author to the subject, through statuses ({@code applying}) and armour. */
        DAMAGE,
        GAIN,
        LOSE,
        EMPTY,
        /** A status on the subject multiplying a damage type by {@code factor}. */
        STATUS,
        /** The draw after the move becomes a search; a vulnerability token of {@code factor} if found (D71, D72). */
        SEARCH,
        /** The chosen near item is consumed: its own printed effects apply to the author. */
        CONSUME,
        /**
         * Like YouStop: voids the next move of the target if it resolves later. SB-17: with {@code factor} (the reflection, «Ricatto»),
         * if the voided card is a hit its base damage ({@link #baseDamage}) times {@code factor}, truncated
         * ({@link #reflected}), of the same type, goes from the author to the target; with {@code keepsToken} («Lo sapevo») the
         * voided move does not satisfy its author's vulnerability token.
         */
        COUNTER_TARGET,
        /** Like AmphetamineReflexes: voids every later opposing move that targets the author. */
        COUNTER_ALL,
        /** The subject becomes immune to {@code resource} (no periodic effect of it). */
        IMMUNE,
        /** The subject loses its immunity to {@code resource}. */
        NOT_IMMUNE,
        /** SB-17, like ShuffleFeet: the author and the target swap their near items, each tray keeping its capacity. */
        SWAP_ITEMS
    }

    /** One printed step. Amounts are {@code base + times × (resource of the author / divide) + perItem × items of the author}. */
    @Value
    @Builder
    public static class Step implements Serializable {
        Kind kind;
        /** False: the step applies to the author; true: to the move's target. */
        boolean onTarget;
        Damage.DamageType damageType;
        Resource resource;
        int base;
        Resource of;
        @Builder.Default
        int divide = 1;
        /** SB-16g passo 3 (D84): the resource part counts {@code times} over: {@code base + times × (resource / divide)}. */
        @Builder.Default
        int times = 1;
        int perItem;
        /** The variable part is read when the move starts resolving (after costs), not when the step applies. */
        boolean atStart;
        /** Status types that modify this damage; null means all. */
        Set<StatusType> applying;
        StatusFlow flow;
        StatusType statusType;
        Float factor;
        /** For a status: the damage type it turns its damage into, or null. */
        Damage.DamageType convertTo;
        /** D91: public status text, including its lifetime (null means no countdown). */
        String name;
        String description;
        Integer turns;
        boolean singleUse;
        boolean equip;
        /** D91: binding of the searched card, and precisely the damage types amplified by its token. */
        String searchedCard;
        Set<Damage.DamageType> tokenDamage;
        /** Optional public item created by this step, before its resource effect. Only the continuing table reads it. */
        String spawnedItem;
        Map<Resource, Integer> foundGains;
        Map<Resource, Integer> missedGains;
        /**
         * SB-16i (D94, D97), playground only: every binding the search may look for, in printed order («Annuncia X o Y»); the
         * player chooses among those with a copy in the deck when playing the card. {@code searchedCard} is the first. Null for
         * steps written before SB-16i, which search {@code searchedCard} only.
         */
        List<String> searchedCards;
        /** SB-16i (D97, «Gioca d'anticipo»): the step applies only if the move resolves in a speed group before the target's move. */
        boolean ahead;
        /** SB-16i («Rincara X»): added to the amount once for every earlier play of this card by its author in the match. */
        int perPlay;
        /** SB-17 («se il bersaglio ha un gettone»): the step applies only if its subject has a vulnerability token when it applies. */
        boolean ifToken;
        /** SB-17 («Lo sapevo», D106 (3)): on a COUNTER_TARGET, the voided move does not satisfy its author's token. */
        boolean keepsToken;

        /** The bindings the search may look for, in printed order: {@code searchedCards}, or {@code searchedCard} alone. */
        public List<String> searchedNames() {
            if (searchedCards != null && !searchedCards.isEmpty()) return searchedCards;
            return searchedCard == null ? List.of() : List.of(searchedCard);
        }
    }

    /** SB-16i: the bindings the card's search may look for, in printed order; empty without a search or a printed text. */
    public static List<String> searchedNames(Card card) {
        if (!(card instanceof Source)) return List.of();
        PrintedEffects effects = ((Source) card).printedEffects();
        if (effects == null) return List.of();
        for (Step s : effects.getSteps()) if (s.getKind() == Kind.SEARCH) return s.searchedNames();
        return List.of();
    }

    /** SB-16i: whether the card has a «Gioca d'anticipo» part, or a «Rincara» amount, in its printed text. */
    public static boolean hasAhead(Card card) { return anyStep(card, Step::isAhead); }

    public static boolean hasPerPlay(Card card) { return anyStep(card, s -> s.getPerPlay() != 0); }

    private static boolean anyStep(Card card, java.util.function.Predicate<Step> test) {
        if (!(card instanceof Source)) return false;
        PrintedEffects effects = ((Source) card).printedEffects();
        return effects != null && effects.getSteps().stream().anyMatch(test);
    }

    /**
     * SB-17 («Ricatto»): the base damage of a hit as printed, by type in printed order: the {@code base} of every DAMAGE step on
     * the target that always applies (not «Gioca d'anticipo», not «se il bersaglio ha un gettone»), without the parts read from
     * resources, items or plays. Empty when the card does not hit. Engine and bots read it the same way.
     */
    public static Map<Damage.DamageType, Integer> baseDamage(PrintedEffects effects) {
        Map<Damage.DamageType, Integer> base = new java.util.LinkedHashMap<>();
        if (effects == null) return base;
        for (Step s : effects.getSteps())
            if (s.getKind() == Kind.DAMAGE && s.isOnTarget() && !s.isAhead() && !s.isIfToken() && s.getDamageType() != null && s.getBase() > 0)
                base.merge(s.getDamageType(), s.getBase(), Integer::sum);
        return base;
    }

    /**
     * SB-17: the base damage of a card that cannot describe itself, read from its public damage text (for example «HIT 25» or
     * «HIT 12+x»: the first number, of the first damage type named). Empty without a number.
     */
    public static Map<Damage.DamageType, Integer> nominalDamage(String damage, String damageAmount) {
        Map<Damage.DamageType, Integer> base = new java.util.LinkedHashMap<>();
        if (damageAmount == null) return base;
        java.util.regex.Matcher number = java.util.regex.Pattern.compile("\\d+").matcher(damageAmount);
        if (!number.find()) return base;
        Damage.DamageType type = Damage.DamageType.HIT;
        String text = damage != null ? damage + " " + damageAmount : damageAmount;
        for (Damage.DamageType t : Damage.DamageType.values()) if (text.contains(t.name())) { type = t; break; }
        int amount = Integer.parseInt(number.group());
        if (amount > 0) base.put(type, amount);
        return base;
    }

    /** SB-17: a reflected amount, the same truncation for engine and bots. */
    public static int reflected(int base, float factor) { return (int) ((float) base * factor); }

    List<Step> steps;

    /** A card whose printed effects can be read as numbers. */
    public interface Source {
        PrintedEffects printedEffects();
    }

    public static Step damage(boolean onTarget, Damage.DamageType type, int base) {
        return Step.builder().kind(Kind.DAMAGE).onTarget(onTarget).damageType(type).base(base).build();
    }

    /**
     * Public consumed text for a continuing table's catalog. Legacy Java items do not implement Source; keep that boundary
     * unchanged for existing bots. Read the beer amount from its catalog text, and the bottle's public status factory.
     * This method sees only a card's text, never a player or a game. Unknown Java items still return null.
     */
    public static PrintedEffects consumedText(Card card) {
        if (card instanceof Source) return ((Source) card).printedEffects();
        if (card instanceof BrokenBeerBottle) {
            Status s = BrokenBeerBottle.newStatus();
            return new PrintedEffects(List.of(Step.builder().kind(Kind.STATUS).name(s.getName()).description(s.getDescription())
                    .statusType(s.getType()).flow(s.getFlow()).damageType((Damage.DamageType) s.getImpactedProperty())
                    .factor(s.getAmountFunction().apply(1f)).convertTo((Damage.DamageType) s.getTypeFunction().apply(Damage.DamageType.HIT))
                    .singleUse(s.isSingleUse()).equip(s.isEquip()).turns(s.getLastsForTurns()).build()));
        }
        if (card instanceof AnotherRottenBeer) {
            String gains = ((AbstractCard) card).getGains();
            java.util.regex.Matcher amount = java.util.regex.Pattern.compile("\\+(\\d+) L").matcher(gains == null ? "" : gains);
            if (amount.matches()) return new PrintedEffects(List.of(Step.builder().kind(Kind.GAIN).resource(Resource.ALCOHOL)
                    .base(Integer.parseInt(amount.group(1))).spawnedItem(new BrokenBeerBottle().getBindingName()).build()));
        }
        return null;
    }
}
