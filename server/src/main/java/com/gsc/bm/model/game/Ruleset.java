package com.gsc.bm.model.game;

import java.util.Locale;

/**
 * The rules a match follows.
 * <p>
 * SB-28 (regulation 2.0): {@link #LIVE}, the rules of the live game, is {@link #D50}, the rules decided in SB-16b and after
 * (docs/game-rules.md 2.0; D50, D78, D182, D183), which until SB-28 ran in the playground only; its id stays {@code d50}, so
 * the identities of the measurements made before the transfer do not change. {@link #LEGACY} is regulation 1.13 (with the
 * Set Base 0.1): it stays only to read archived matches and for the historical measurements, and it is the default of a
 * {@link Game} built without {@link Game#useRuleset}, as the tests and measurements written before SB-28 expect. The live
 * factory always sets {@link #LIVE}.
 * <ol>
 *   <li>speed groups: an author down (HEALTH 0) when its group starts does not act, except on itself or its own items;</li>
 *   <li>costs are paid only with what one has: a HEALTH cost cannot bring its payer to 0, except on cards with «Ultimo colpo»
 *   (kept in the engine for the historical drafts: regulation 2.0 does not have it and no live card uses it, D183 (3));</li>
 *   <li>no resource goes below zero;</li>
 *   <li>ALCOHOL armour: HIT received reduced by ALCOHOL / 4, after statuses, not below zero;</li>
 *   <li>search: a card may replace the draw that follows its move with a search of a given card in the deck.</li>
 *   <li>D58/D71: found copies are shown only in hand; named tokens expire at turn end on play or one turn after exhaustion;</li>
 *   <li>D72/D73: failed searches give reduced printed resources without tokens.</li>
 * </ol>
 */
public enum Ruleset {
    LEGACY("1.13"),
    D50("d50");

    /** SB-28: the rules of the live game, regulation 2.0. */
    public static final Ruleset LIVE = D50;

    /** ALCOHOL / this divisor is the HIT absorbed by the armour (D50, point 5). */
    public static final int ALCOHOL_ARMOR_DIVISOR = 4;

    private final String id;

    Ruleset(String id) { this.id = id; }

    public String id() { return id; }

    /** The rules of regulation 2.0 (the playground rules of D50 before SB-28). */
    public boolean playground() { return this == D50; }

    /** {@code 1.13}, {@code d50} or {@code 2.0} (the same rules as {@code d50}); blank means {@link #LEGACY}. */
    public static Ruleset parse(String value) {
        if (value == null || value.isBlank()) return LEGACY;
        String wanted = value.trim().toLowerCase(Locale.ROOT);
        if (wanted.equals("2.0")) return D50;
        for (Ruleset r : values()) if (r.id.equals(wanted)) return r;
        throw new IllegalArgumentException("regole sconosciute: " + value + " (note: 1.13, d50 o 2.0)");
    }
}
