package com.gsc.bm.sim;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.cards.LoadableCard;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * SB-8: the public face of a set draft for the development server (profile {@code bozza}). {@link Draft} stays package-private
 * and unchanged, as the runner and the bench use it; this class only exposes what the server needs to build players, the
 * collection and the ready decks. Nothing in the live match uses it: without the profile no bean reaches it.
 */
public final class DraftSource {

    private final Draft draft;

    private DraftSource(Draft draft) {
        this.draft = draft;
    }

    /**
     * One or more sources separated by «;», each a file path or {@code classpath:/resource.json}, as {@code -Dsim.draft}.
     * A draft that is not valid is refused with the loader's message.
     */
    public static DraftSource load(String sources) throws Exception {
        List<String> parts = new ArrayList<>();
        for (String part : sources.split(";")) if (!part.isBlank()) parts.add(part.trim());
        return new DraftSource(Draft.load(parts));
    }

    /** The source of every set, as the loader names it. */
    public String source() { return draft.source; }

    /** The loaded sets, in reading order: id → name and version (null when the file does not state them). */
    public Map<String, Map<String, String>> sets() {
        Map<String, Map<String, String>> out = new LinkedHashMap<>();
        draft.sets().forEach((id, set) -> {
            Map<String, String> fields = new LinkedHashMap<>();
            fields.put("name", set.name);
            fields.put("version", set.version);
            out.put(id, Collections.unmodifiableMap(fields));
        });
        return Collections.unmodifiableMap(out);
    }

    public Set<String> deckIds() { return draft.deckIds(); }

    public Set<String> cardBindings() { return draft.cardBindings(); }

    public Set<String> characterIds() { return draft.characterIds(); }

    public String characterName(String id) { return draft.characterName(id); }

    /** The fixed basic of a character, or null when the format does not fix it. */
    public String characterBasic(String id) { return draft.characterBasic(id); }

    /** The character a last resort is reserved to, or null. */
    public String exclusiveTo(String binding) { return draft.exclusiveTo(binding); }

    public String characterOf(String deck) { return draft.characterOf(deck); }

    public String basicOf(String deck) { return draft.basicOf(deck); }

    public List<String> boundOf(String deck) { return draft.boundOf(deck); }

    public String lastResortOf(String deck) { return draft.lastResortOf(deck); }

    /** The regular cards of a deck, one binding per copy, in the draft's order. */
    public List<String> regularOf(String deck) {
        List<String> out = new ArrayList<>();
        draft.cardsOf(deck).forEach((binding, copies) -> {
            for (int i = 0; i < copies; i++) out.add(binding);
        });
        return out;
    }

    /** A new instance of the card, with the draft's numbers and texts. */
    public LoadableCard card(String binding) { return (LoadableCard) draft.card(binding); }

    /** A new character as a deck creates it. */
    public Character character(String id) { return draft.character(id); }
}
