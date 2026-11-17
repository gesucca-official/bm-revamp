package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.List;
import java.util.Set;

/**
 * SB-18 Fase B (D124): Duccio Braccio Teso and the deck {@code prova-duccio}, first in the draft copies of {@code docs/reports/set-base/sb-18/}.
 * Fase B2 (D126): they are in {@code bozza.json} with the costs of the calibration (×1,85 of the V3, then the reserve R1 of the final round:
 * Nocche sbucciate 16, E allora? 10, Capocciata 28, Testa dura 33 HEALTH; and the reserve R2, health 115). The tests about the five starters strip them, as they strip Sergio ({@link Sb17#without}). His deck uses generics and
 * items the draft already had, so only his own cards go.
 */
final class Sb18 {

    static final String DUCCIO = "base.character.Rocco";
    static final String DECK = "prova-duccio";
    static final String NOCCHE = "base.rocco.NoccheSbucciate", E_ALLORA = "base.rocco.EAllora", CAPOCCIATA = "base.rocco.Capocciata",
            TESTA_DURA = "base.rocco.TestaDura";
    static final List<String> CARDS = List.of("base.rocco.PrimaIo", "base.rocco.bound.Colpetto", "base.rocco.bound.Gomitata",
            "base.rocco.bound.AlzoLaVoce", "base.rocco.NeHoPreseDiPeggio", NOCCHE, "base.rocco.Incassare", E_ALLORA, CAPOCCIATA,
            "base.rocco.TeLoSpiegoIo", TESTA_DURA);

    private Sb18() {
    }

    /** A copy of the draft without Duccio, his cards and his deck. */
    static JsonNode without(JsonNode draft) {
        ObjectNode copy = draft.deepCopy();
        remove((ArrayNode) copy.get("characters"), "id", Set.of(DUCCIO));
        remove((ArrayNode) copy.get("cards"), "binding", Set.copyOf(CARDS));
        remove((ArrayNode) copy.get("decks"), "id", Set.of(DECK));
        return copy;
    }

    private static void remove(ArrayNode array, String key, Set<String> ids) {
        for (int i = array.size() - 1; i >= 0; i--) if (ids.contains(array.get(i).path(key).asText())) array.remove(i);
    }
}
