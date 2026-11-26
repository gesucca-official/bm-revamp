package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.List;
import java.util.Set;
import com.gsc.bm.model.cards.base.SetBaseIds;

import static com.gsc.bm.model.cards.base.SetBaseIds.*;

/**
 * SB-17 Fase B (D106, D107), Fase B2 (D110: Lo sanno tutti in place of Fare il vago), Fase B3 (D114: Lo rivendo in place of Frecciatina al volo), Fase B4 (D118: Lo rivendo becomes the basic in place of Lo metto in conto, Fare il vago the bound), Fase B6 (D121: Lo metto in conto is the basic again and Lo rivendo a regular card): what the draft gained for Sergio Sommerso — the character, his cards, the generics and items of his test
 * deck that the 1.6b did not have, and the deck {@code prova-sergio}. The tests about the five starters strip these entries, so the
 * 1.6b they check stays byte for byte what SB-16i approved.
 */
final class Sb17 {

    static final String SERGIO = SetBaseIds.SERGIO;
    static final String DECK = "prova-sergio";
    // SB-21z (D162): Mi informo diventa Ne riparliamo fuori.
    static final List<String> CARDS = List.of(NOSE_FOR_BUSINESS, PUT_ON_THE_TAB, LET_US_DISCUSS_IN_PRIVATE, MANIPULATIVE_TECHNIQUE,
            ACT_VAGUE, TIMELY_DISTRACTION, GOOD_OLD_BLACKMAIL, SEEN_THAT_SCRIPT,
            STEEP_BILL, OPEN_SECRET, PRANK_TOO_FAR, STUN_YOU_I_SAID, TRIP,
            SUDDEN_DASH, WAKE_UUUP, SAINT_BRIACO_HOLY_CARD);

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
