package com.gsc.bm.model.game.status;

import com.gsc.bm.model.Statistic;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

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
     * SB-16g 2a, playground rules only (D59, D64–D66): the vulnerability of a charge, three statuses (HIT, CUT, POISON) with the
     * same id. Null, and absent from the views, for every other status and always with the live rules.
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Builder.Default
    private Integer exposure = null;
    /** SB-16g 2a: the factor of the vulnerability, public so that it can be read where it applies; null for other statuses. */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Builder.Default
    private Float factor = null;
    /**
     * SB-16g 2a (D65): the id of the copy found by the search that holds this vulnerability, while that copy is in its owner's
     * hand. A held status outlives its minimum duration; once released it ends at once if the minimum is over.
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Setter
    @Builder.Default
    private Integer heldBy = null;

    public void aTurnIsPassed() {
        // A held status past its minimum stays at -1: the minimum is spent, the copy still holds it (D59).
        if (lastsForTurns != null && !(heldBy != null && lastsForTurns < 0))
            this.lastsForTurns--;
    }

    /** SB-16g 2a: the minimum duration is over (it would have been cleared at the last end of turn if not held). */
    public boolean minimumSpent() {
        return lastsForTurns != null && lastsForTurns < 0;
    }

    public void expended() {
        this.lastsForTurns = 0; // character clears this out at the end of turn
    }

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
