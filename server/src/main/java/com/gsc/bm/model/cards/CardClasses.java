package com.gsc.bm.model.cards;

import com.gsc.bm.model.cards.base.SetBaseClasses;
import com.gsc.bm.service.factories.CardFactoryService;

import java.lang.reflect.Modifier;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * SB-34 (D213): from a card id to its Java class and back. A live class declares its id with {@link CardId} and is listed in the
 * explicit registry {@link SetBaseClasses} (no classpath scanning: the runner works without Spring). A class outside the registry
 * keeps the rule of the historical classes of drafts 0.1 and 1.5: package {@code com.gsc.bm.model.cards.} plus id.
 */
public final class CardClasses {

    private static final String BASE_CARDS_PKG = CardFactoryService.BASE_CARDS_PKG;

    private static final ClassValue<String> IDS = new ClassValue<>() {
        @Override
        protected String computeValue(Class<?> type) {
            CardId declared = type.getAnnotation(CardId.class);
            return declared != null ? declared.value() : type.getName().replace(BASE_CARDS_PKG, "");
        }
    };

    private static final Map<String, Class<? extends AbstractCard>> REGISTRY = registry(SetBaseClasses.CLASSES);

    private CardClasses() {
    }

    /** The id of a card or character class: the declared {@link CardId}, otherwise the class name without the package root. */
    public static String idOf(Class<?> type) {
        return IDS.get(type);
    }

    /** The registered live classes by id, in registry order. */
    public static Map<String, Class<? extends AbstractCard>> registered() {
        return REGISTRY;
    }

    /**
     * The class of a card id: the registry first; only if absent, the historical rule (package + id). An id that both ways resolve
     * is refused, so a registered id can never load a historical class by mistake.
     */
    public static Class<?> forId(String id) throws ClassNotFoundException {
        return forId(id, REGISTRY);
    }

    static Class<?> forId(String id, Map<String, Class<? extends AbstractCard>> registry) throws ClassNotFoundException {
        Class<?> registered = registry.get(id);
        Class<?> byRule = byRule(id);
        if (byRule != null && byRule.isAnnotationPresent(CardId.class))
            throw new IllegalStateException("id " + id + ": è il nome della classe viva " + byRule.getName() + ", non il suo id "
                    + idOf(byRule));
        if (registered != null && byRule != null)
            throw new IllegalStateException("id " + id + " risolto sia dal registro (" + registered.getName() + ") sia dalla regola ("
                    + byRule.getName() + ")");
        if (registered != null) return registered;
        if (byRule != null) return byRule;
        throw new ClassNotFoundException(BASE_CARDS_PKG + id);
    }

    private static Class<?> byRule(String id) {
        try {
            return Class.forName(BASE_CARDS_PKG + id, false, CardClasses.class.getClassLoader());
        } catch (ClassNotFoundException | LinkageError absent) {
            return null;
        }
    }

    static Map<String, Class<? extends AbstractCard>> registry(List<Class<? extends AbstractCard>> classes) {
        Map<String, Class<? extends AbstractCard>> byId = new LinkedHashMap<>();
        for (Class<? extends AbstractCard> type : classes) {
            CardId declared = type.getAnnotation(CardId.class);
            if (declared == null) throw new IllegalStateException(type.getName() + " nel registro senza @CardId");
            if (Modifier.isAbstract(type.getModifiers())) throw new IllegalStateException(type.getName() + " è astratta");
            if (byId.put(declared.value(), type) != null)
                throw new IllegalStateException("id " + declared.value() + " dichiarato due volte nel registro");
        }
        return Collections.unmodifiableMap(byId);
    }
}
