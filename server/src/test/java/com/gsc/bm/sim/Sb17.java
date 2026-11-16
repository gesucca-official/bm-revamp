package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.List;
import java.util.Set;

/**
 * SB-17 Fase B (D106, D107), Fase B2 (D110: Lo sanno tutti in place of Fare il vago): what the draft gained for Sergio Sommerso — the character, his cards, the generics and items of his test
 * deck that the 1.6b did not have, and the deck {@code prova-sergio}. The tests about the five starters strip these entries, so the
 * 1.6b they check stays byte for byte what SB-16i approved.
 */
final class Sb17 {

    static final String SERGIO = "base.character.Cesira";
    static final String DECK = "prova-sergio";
    static final List<String> CARDS = List.of("base.cesira.LoMettoInConto", "base.cesira.bound.MiInformo", "base.cesira.bound.Battutina",
            "base.cesira.bound.FrecciatinaAlVolo", "base.cesira.OhGuardaLa", "base.cesira.Ricatto", "base.cesira.LoSapevo",
            "base.cesira.ContoSalato", "base.cesira.LoSannoTutti", "base.cesira.Malelingue", "bruiser.StunningBlow", "base.com.Sgambetto",
            "base.com.ShuffleFeet", "base.com.AcquaInFaccia", "base.items.SantinoDellaPortinaia");

    private Sb17() {
    }

    /** A copy of the draft without Sergio, his cards and his deck. */
    static JsonNode without(JsonNode draft) {
        ObjectNode copy = draft.deepCopy();
        remove((ArrayNode) copy.get("characters"), "id", Set.of(SERGIO));
        remove((ArrayNode) copy.get("cards"), "binding", Set.copyOf(CARDS));
        remove((ArrayNode) copy.get("decks"), "id", Set.of(DECK));
        return copy;
    }

    private static void remove(ArrayNode array, String key, Set<String> ids) {
        for (int i = array.size() - 1; i >= 0; i--) if (ids.contains(array.get(i).path(key).asText())) array.remove(i);
    }
}
