package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static com.gsc.bm.model.cards.base.SetBaseIds.*;

/**
 * SB-19 Fase B1 (D129, D130): what the draft gained for the nine slots that were missing (GEN-04, 08, 10, 11, 19, 20, 21, OGG-08, OGG-16)
 * and the nine decks with the additions of {@code docs/reports/set-base/sb-19/make-bozza.py}. The tests about the five starters strip these
 * entries, as they strip Sergio and Duccio ({@link Sb17#without}, {@link Sb18#without}), so the 1.6b they check stays byte for byte what
 * SB-16i approved. The cards are new bindings or Java cards of the draft only: none of the five starters and none of the 1.6b's cards use them.
 */
final class Sb19 {

    static final String ELEMOSINA = GOT_ANY_SPARE_CHANGE, COLPO = CHARM_YOU_WITH_BLOWS, MALEDUCAZIONE = EXCUSE_ME_SORRY_CAN_YOU_STOP,
            NON_SENTO_NIENTE = KIND_YOUR_CARESS, MANO_LESTA = LIGHT_FINGERS, SECONDO_FIATO = CATCH_YOUR_BREATH,
            COCCIO = BOTTLE_SHARD, MINERALE = FLAT_MINERAL_WATER, GRAPPA = HOUSE_GRAPPA;
    /** The nine cards, in the order of the slots. */
    static final List<String> CARDS = List.of(ELEMOSINA, COLPO, MALEDUCAZIONE, NON_SENTO_NIENTE, MANO_LESTA, SECONDO_FIATO, COCCIO, MINERALE, GRAPPA);
    /** SB-19 B2 (D130): the two items with the «In campo» effect, OGG-17 and OGG-18 (RP-27, RP-28). */
    static final String CONTO = TABLE_SIX_BILL, SIGARETTA = LIT_CIGARETTE;
    static final List<String> CARDS_B2 = List.of(CONTO, SIGARETTA);
    /** SB-19 B2 (D130): the ten decks of the phase: seven test decks and three isolation decks (make-bozza-b2.py). */
    static final List<String> DECKS_B2 = List.of("prova-b2-spazienzio", "prova-b2-beppe", "prova-b2-sergio-conto", "prova-b2-sergio-sigaretta",
            "prova-b2-celestina", "prova-b2-rischio9", "prova-b2-rischio10", "iso-b2-conto", "iso-b2-sigaretta", "iso-b2-sigaretta-sergio");
    /** The decks with the additions: the seven characters, then the two of the risks 3 (equip stack) and 1 (Estasi and Grappa). */
    static final List<String> DECKS = List.of("prova-b1-spazienzio", "prova-b1-mara", "prova-b1-celestina", "prova-b1-piera", "prova-b1-beppe",
            "prova-b1-sergio", "prova-b1-duccio", "prova-b1-equip", "prova-b1-estasi");
    /** The seven reference decks, in the order of the round: the five starters and the two test decks. */
    static final List<String> REFERENCES = List.of(STARTER_SPAZIENZIO, STARTER_MARA, STARTER_CELESTINA, STARTER_PIERA, STARTER_BEPPE,
            Sb17.DECK, Sb18.DECK);

    private Sb19() {
    }

    /**
     * A copy of the draft without the nine cards and the nine decks of the B1, nor the two items and the ten decks of the B2 (D130); and
     * not Sergio and Duccio: strip those with their own classes.
     */
    static JsonNode without(JsonNode draft) {
        ObjectNode copy = draft.deepCopy();
        remove((ArrayNode) copy.get("cards"), "binding", Set.copyOf(CARDS));
        remove((ArrayNode) copy.get("cards"), "binding", Set.copyOf(CARDS_B2));
        remove((ArrayNode) copy.get("decks"), "id", Set.copyOf(DECKS));
        remove((ArrayNode) copy.get("decks"), "id", Set.copyOf(DECKS_B2));
        return copy;
    }

    /** The additions only, for the tests that look at what the draft gained. */
    static List<JsonNode> cards(JsonNode draft) {
        List<JsonNode> found = new ArrayList<>();
        for (JsonNode c : draft.get("cards")) if (CARDS.contains(c.path("binding").asText())) found.add(c);
        return found;
    }

    private static void remove(ArrayNode array, String key, Set<String> ids) {
        for (int i = array.size() - 1; i >= 0; i--) if (ids.contains(array.get(i).path(key).asText())) array.remove(i);
    }
}
