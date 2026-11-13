package com.gsc.bm.model.cards;

import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;
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
        /** Like YouStop: voids the next move of the target if it resolves later. */
        COUNTER_TARGET,
        /** Like AmphetamineReflexes: voids every later opposing move that targets the author. */
        COUNTER_ALL,
        /** The subject becomes immune to {@code resource} (no periodic effect of it). */
        IMMUNE,
        /** The subject loses its immunity to {@code resource}. */
        NOT_IMMUNE
    }

    /** One printed step. Amounts are {@code base + resource of the author / divide + perItem × items of the author}. */
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
        Map<Resource, Integer> foundGains;
        Map<Resource, Integer> missedGains;
    }

    List<Step> steps;

    /** A card whose printed effects can be read as numbers. */
    public interface Source {
        PrintedEffects printedEffects();
    }

    public static Step damage(boolean onTarget, Damage.DamageType type, int base) {
        return Step.builder().kind(Kind.DAMAGE).onTarget(onTarget).damageType(type).base(base).build();
    }
}
