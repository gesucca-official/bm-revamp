package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.InputStream;
import java.util.Objects;

/**
 * SB-16g passo 3 (proposta 1.4, D80, D82): the two arms of the final round. Arm A is the draft as it is; arm B is the same draft with
 * «Il bancone regge, io pure» replaced by {@code set-base/bancone-b.json}, which adds POISON ×0.5 for the turn (D67). Nothing else
 * differs: {@code PotenzaD82Test} checks it. The bench picks the arm with {@code -Dsim.arm=A|B} (A when absent).
 */
final class SetBaseArms {
    static final String BANCONE = "base.pino.IlBanconeRegge";
    static final String ARM_B = "/set-base/bancone-b.json";
    private static final ObjectMapper JSON = new ObjectMapper();

    private SetBaseArms() { }

    /** The card of arm B, as written in the resource. */
    static JsonNode banconeB() throws Exception {
        try (InputStream input = SetBaseArms.class.getResourceAsStream(ARM_B)) {
            return JSON.readTree(Objects.requireNonNull(input, ARM_B));
        }
    }

    /** A copy of the draft of arm A with the single Bancone card replaced by the one of arm B. */
    static JsonNode armB(JsonNode armA) throws Exception {
        JsonNode card = banconeB();
        if (!BANCONE.equals(card.path("binding").asText())) throw new IllegalStateException(ARM_B + ": not the Bancone");
        ObjectNode root = armA.deepCopy();
        ArrayNode cards = (ArrayNode) root.get("cards");
        int replaced = 0;
        for (int i = 0; i < cards.size(); i++)
            if (BANCONE.equals(cards.get(i).path("binding").asText())) { cards.set(i, card.deepCopy()); replaced++; }
        if (replaced != 1) throw new IllegalStateException("arm B: " + replaced + " Bancone cards in the draft");
        return root;
    }

    /** The arm named by {@code -Dsim.arm} over the given draft of arm A. */
    static Draft arm(String name, Draft armA) throws Exception {
        if ("A".equals(name)) return armA;
        // Not a classpath source: the bench fingerprints arm B from its JSON (Bench.sha256), arm A from the file.
        if ("B".equals(name)) return Draft.parse(Bench.draftName(armA) + " + bancone-b.json", armB(armA.json()));
        throw new IllegalArgumentException("sim.arm: A or B, not " + name);
    }

    static String selected() { return System.getProperty("sim.arm", "A"); }
}
