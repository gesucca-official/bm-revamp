package com.gsc.bm.model.game.bot;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.function.Supplier;

/**
 * SB-30a (R03 2.2, D203): the policy of each computer player of the live game, a new instance per player. Facile is
 * {@link RandomPolicy}; Normale is {@link LethalAwarePolicy} around {@link SoughtHitPolicy} (ALWAYS) around the style of the
 * character's sheet ({@code botStyle} of the set file), the same chain as the measures of the Set Base (D74, D76, D77). Every
 * policy decides from {@link BotView} only: no engine type is imported here.
 */
public final class ComPolicies {

    /** The styles of the set file's {@code botStyle} (docs/formato-file-set.md). */
    public static final Map<String, Supplier<BotPolicy>> STYLES;

    static {
        Map<String, Supplier<BotPolicy>> styles = new LinkedHashMap<>();
        styles.put("aggressivo", AggressivePolicy::new);
        styles.put("prudente", PrudentPolicy::new);
        styles.put("risorse", ResourceAwarePolicy::new);
        STYLES = Collections.unmodifiableMap(styles);
    }

    private final Map<String, String> styleByCharacter;

    /** The style of each character the computer may play; a missing or unknown style stops the start. */
    public ComPolicies(Map<String, String> styleByCharacter) {
        for (Map.Entry<String, String> entry : styleByCharacter.entrySet())
            if (entry.getValue() == null || !STYLES.containsKey(entry.getValue()))
                throw new IllegalStateException("Stile del computer mancante o sconosciuto per " + entry.getKey() + ": "
                        + entry.getValue() + " (noti: " + STYLES.keySet() + ")");
        this.styleByCharacter = Collections.unmodifiableMap(new LinkedHashMap<>(styleByCharacter));
    }

    /** The style of the character's sheet. */
    public String styleOf(String character) {
        String style = styleByCharacter.get(character);
        if (style == null) throw new IllegalArgumentException("Il personaggio non ha uno stile del computer: " + character);
        return style;
    }

    /** A new policy for one computer player of the character at the level. Reserved levels are refused. */
    public BotPolicy policyFor(ComLevel level, String character) {
        switch (level) {
            case FACILE:
                return new RandomPolicy();
            case NORMALE:
                return new LethalAwarePolicy(new SoughtHitPolicy(STYLES.get(styleOf(character)).get(), SoughtHitPolicy.Timing.ALWAYS));
            default:
                throw new IllegalArgumentException("Livello riservato, non giocabile: " + level);
        }
    }
}
