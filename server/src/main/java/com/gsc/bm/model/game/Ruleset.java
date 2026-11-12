package com.gsc.bm.model.game;

import java.util.Locale;

/**
 * The rules a match follows. {@link #LIVE} is regulation 1.13, the live game. {@link #D50} adds the rules decided in SB-16b
 * (docs/set-base-plan.md, D50 points 1, 2, 3, 5 and 6) for the playground only: the profile {@code bozza} and the runner turn it
 * on, never the live game, until the transfer of SB-28 (D12).
 * <ol>
 *   <li>speed groups: an author down (HEALTH &lt;= 0) when its group starts does not act, except on itself or its own items;</li>
 *   <li>costs are paid only with what one has: a HEALTH cost cannot bring its payer to 0, except on cards with «Ultimo colpo»;</li>
 *   <li>no resource goes below zero;</li>
 *   <li>ALCOHOL armour: HIT received reduced by ALCOHOL / 4, after statuses, not below zero;</li>
 *   <li>search: a card may replace the draw that follows its move with a search of a given card in the deck.</li>
 * </ol>
 */
public enum Ruleset {
    LIVE("1.13"),
    D50("d50");

    /** ALCOHOL / this divisor is the HIT absorbed by the armour (D50, point 5). */
    public static final int ALCOHOL_ARMOR_DIVISOR = 4;

    private final String id;

    Ruleset(String id) { this.id = id; }

    public String id() { return id; }

    public boolean playground() { return this == D50; }

    /** {@code 1.13} or {@code d50}; blank means {@link #LIVE}. */
    public static Ruleset parse(String value) {
        if (value == null || value.isBlank()) return LIVE;
        String wanted = value.trim().toLowerCase(Locale.ROOT);
        for (Ruleset r : values()) if (r.id.equals(wanted)) return r;
        throw new IllegalArgumentException("regole sconosciute: " + value + " (note: 1.13, d50)");
    }
}
