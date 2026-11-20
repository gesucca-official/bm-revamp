package com.gsc.bm.sim;

/**
 * SB-21h Fase B (D159, D160): the candidate measured with the new bounds, kept as a test resource after the STOP of point 4 (the
 * draft went back to the SB-21g delivery, D149 (4)). It is {@code k1} of the report plus two decks that carry the Java variants.
 */
final class Sb21h {
    /** The candidate: bounds (a) and (b) of D160 with the kept values, the variants (c), the decks of the reference. */
    static final String CANDIDATE = "/set-base/sb-21h/candidata-k1.json";
    /** prova-sergio with «Ne riparliamo fuori» for (b), prova-duccio with «Mi rialzo dal marciapiede» for (b). */
    static final String[] VARIANT_DECKS = {"sb21h-sergio-c", "sb21h-duccio-c"};
    /** Printed names of the two Java variants. */
    static final String COUNTER = "Ne riparliamo fuori", RISE = "Mi rialzo dal marciapiede";

    private Sb21h() { }
}
