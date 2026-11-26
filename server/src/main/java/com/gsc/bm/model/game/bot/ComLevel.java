package com.gsc.bm.model.game.bot;

import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * SB-30a (R01 and R03 2.2, D203): the level of a computer player of the live game. Only {@link #FACILE} and {@link #NORMALE} are
 * offered; {@link #DIFFICILE} and {@link #MAESTRO} are reserved (D85) and a request never chooses them.
 */
public enum ComLevel {
    FACILE, NORMALE, DIFFICILE, MAESTRO;

    /** The STOMP header of the quick 1vCom and open 1vCom joins (docs/api.md). */
    public static final String HEADER = "level";

    /** A level a request may choose. */
    public boolean offered() { return this == FACILE || this == NORMALE; }

    /**
     * R03 2.2: the level a join asked for. Missing or blank means {@link #FACILE}; the name of an offered level, exact, is that
     * level; any other value, reserved levels included, is an {@link UnknownLevelException}.
     */
    public static ComLevel parse(String value) {
        if (value == null || value.isBlank()) return FACILE;
        for (ComLevel level : values()) if (level.offered() && level.name().equals(value)) return level;
        throw new UnknownLevelException(value);
    }

    /** A join with a level that is not offered: refused before anything is queued or created. */
    public static final class UnknownLevelException extends IllegalArgumentException {
        public UnknownLevelException(String value) {
            super("Livello sconosciuto: " + value + " (noti: " + Arrays.stream(values()).filter(ComLevel::offered)
                    .map(Enum::name).collect(Collectors.joining(", ")) + ")");
        }
    }
}
