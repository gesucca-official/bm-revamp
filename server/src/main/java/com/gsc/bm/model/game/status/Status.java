package com.gsc.bm.model.game.status;

import com.gsc.bm.model.Statistic;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Builder
@Getter
public class Status implements Serializable {

    public static final Set<StatusType> ALL = Set.of(StatusType.GOOD, StatusType.BAD);

    private final String name;
    private final String description;
    private final StatusType type;
    private final StatusFlow flow;
    private final Statistic impactedProperty;
    private final StatusAmountFunction amountFunction;

    @Builder.Default
    private final StatusAmountTypeFunction typeFunction = (type) -> type; // identity if not changed by builder
    @Builder.Default
    private final boolean singleUse = false;
    @Builder.Default
    private final boolean equip = false;

    @Builder.Default
    private Integer lastsForTurns = null; // boxing allows null value

    /**
     * SB-16g 2a, playground rules only (D59, D64–D66, D69): the vulnerability token of a charge, one status per damage type (HIT,
     * CUT, POISON) with the same id. Null, and absent from the views, for every other status and always with the live rules.
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Builder.Default
    private Integer exposure = null;
    /** SB-16g 2a: the factor of the vulnerability, public so that it can be read where it applies; null for other statuses. */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Builder.Default
    private Float factor = null;
    /**
     * SB-16g 2a (D69): the name of the card that ends this token when its owner plays one, any copy with that name (the one found
     * by the search or another). D71: no timer while copies remain; after exhaustion it has one last whole turn. A satisfied token
     * expires after periodic effects. Null for every other status; D72 creates no token on a miss.
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Builder.Default
    private String untilPlayed = null;

    public void aTurnIsPassed() {
        if (lastsForTurns != null)
            this.lastsForTurns--;
    }

    public void expended() {
        this.lastsForTurns = 0; // character clears this out at the end of turn
    }

    /** D71: the last copy is gone; one whole following turn remains, including periodic damage. */
    public void lastCopyGone() { this.lastsForTurns = 1; }

    public void copyAvailableAgain() { this.lastsForTurns = null; }

    public static Set<StatusType> invertViewPoint(Set<StatusType> s) {
        if (ALL.containsAll(s))
            return ALL;
        else {
            Set<StatusType> inverted = new HashSet<>(ALL);
            inverted.removeAll(s);
            return inverted;
        }
    }
}
