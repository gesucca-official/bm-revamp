package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Player;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import static com.gsc.bm.sim.PotenzaD82Test.playAndForecast;
import static com.gsc.bm.sim.PotenzaD82Test.seat;
import static com.gsc.bm.sim.StarterRedesignTest.foe;
import static org.junit.jupiter.api.Assertions.*;
import static com.gsc.bm.model.cards.base.SetBaseIds.*;

/**
 * SB-16g, correction 1.5 (D90): on the reference draft, arm B of step 3 (D89), only three numbers of three cards change. Impatto
 * 30 → 34 HIT, Chiave da tredici 22 → 18 CUT, Lavoro fatto bene 14 + 7 → 14 + 4 per item. Bindings, rarities, priorities, costs, lists
 * and the Bancone of arm B stay as measured in step 3 (snapshots {@code draft-A.json} and {@code draft-B.json}).
 */
class Correzione15Test {
    static final ObjectMapper JSON = new ObjectMapper();
    static final String IMPATTO = PotenzaD82Test.IMPATTO, CHIAVE = PotenzaD82Test.CHIAVE, LAVORO = PotenzaD82Test.LAVORO;
    static final Path STEP3 = Path.of("../docs/reports/set-base/sb-16g-2b3");
    static Draft a, b;

    @BeforeAll static void load() throws Exception {
        StarterRedesignTest.load();
        a = BozzeStoriche.fromClasspath(SetBaseArms.FROZEN_15); // SB-16i (D97): historical measure of the 1.5, read from the frozen copy.
        b = SetBaseArms.arm("B", a);
    }

    /** SB-27 (D177 (1)): the snapshot read through the same adaptation as the draft, so the comparison stays like for like. */
    static JsonNode snapshot(String name) throws Exception { return BozzeStoriche.adatta(JSON.readTree(Files.readString(STEP3.resolve(name)))); }

    /** Every card equal to the snapshot except the three; for those, only the expected fields, with the 1.5 values. */
    static void onlyTheThreeNumbersChange(JsonNode before, JsonNode now) {
        for (String key : List.of("characters", "decks", "rules", "format", "set")) assertEquals(before.path(key), now.path(key), key);
        assertEquals(before.path("cards").size(), now.path("cards").size());
        Set<String> changed = new TreeSet<>();
        for (int i = 0; i < before.path("cards").size(); i++) {
            JsonNode x = before.path("cards").get(i), y = now.path("cards").get(i);
            assertEquals(x.path("binding"), y.path("binding"), "same order of the cards: same shuffles (D88)");
            if (!x.equals(y)) changed.add(x.path("binding").asText());
        }
        assertEquals(new TreeSet<>(Set.of(IMPATTO, CHIAVE, LAVORO)), changed);

        ObjectNode impatto = card(before, IMPATTO);
        impatto.set("target", json("[{'op':'damage','type':'HIT','amount':34}]"));
        gui(impatto).put("description", "SPA-AR1 · 25 V: Infliggi 34 danni da colpo al bersaglio.").put("damageAmount", "HIT 34");
        assertEquals(impatto, StarterBalanceMeasureTest.card(now, IMPATTO));

        ObjectNode chiave = card(before, CHIAVE);
        chiave.set("target", json("[{'op':'damage','type':'CUT','amount':18}]"));
        gui(chiave).put("description", "GIG-AR2 · 10 V: Infliggi 18 danni da taglio al bersaglio.").put("damageAmount", "CUT 18");
        assertEquals(chiave, StarterBalanceMeasureTest.card(now, CHIAVE));

        ObjectNode lavoro = card(before, LAVORO);
        lavoro.set("params", json("{'base':14,'perItem':4}"));
        gui(lavoro).put("description", "GIG-AR5 · 10 V: Infliggi danni da colpo pari a 14 più 4 per ogni tuo oggetto sul campo.");
        assertEquals(lavoro, StarterBalanceMeasureTest.card(now, LAVORO));
    }

    static ObjectNode card(JsonNode root, String binding) { return StarterBalanceMeasureTest.card(root, binding).deepCopy(); }

    static ObjectNode gui(ObjectNode card) { return (ObjectNode) card.get("gui"); }

    static JsonNode json(String text) {
        try { return JSON.readTree(text.replace('\'', '"')); } catch (Exception e) { throw new IllegalStateException(e); }
    }

    @Test void theDraftDiffersFromStepThreeOnlyByTheThreeNumbers() throws Exception {
        onlyTheThreeNumbersChange(snapshot("draft-A.json"), a.json());
    }

    @Test void armBDiffersFromTheMeasuredArmBOnlyByTheThreeNumbers() throws Exception {
        onlyTheThreeNumbersChange(snapshot("draft-B.json"), b.json());
    }

    @Test void costsAndFundingStay() {
        JsonNode now = b.json();
        assertEquals(json("{'VIOLENCE':25}"), StarterBalanceMeasureTest.card(now, IMPATTO).get("cost"));
        assertEquals(json("{'VIOLENCE':10}"), StarterBalanceMeasureTest.card(now, CHIAVE).get("cost"));
        assertEquals(json("{'VIOLENCE':10}"), StarterBalanceMeasureTest.card(now, LAVORO).get("cost"));
        // From zero: PAZIENZA +25 V pays Impatto, Preparo +15 V pays Chiave, Una stretta +10 V pays Lavoro (D63).
        assertEquals(25, StarterBalanceMeasureTest.card(now, PATIENCE_OVER).get("self").get(0).get("foundGains").get("VIOLENCE").asInt());
        assertEquals(15, StarterBalanceMeasureTest.card(now, PotenzaD82Test.PREPARO).get("self").get(0).get("foundGains").get("VIOLENCE").asInt());
        assertEquals(10, StarterBalanceMeasureTest.card(now, PotenzaD82Test.STRETTA).get("self").get(0).get("foundGains").get("VIOLENCE").asInt());
    }

    /** The three hits on arm B, resolved by the engine and among the forecast's variants; Lavoro with 0 to 3 own items. */
    @Test void theThreeHitsResolveWithTheirNumbersAndForecast() {
        Object[][] cases = {
                {STARTER_SPAZIENZIO, IMPATTO, Map.of(Resource.VIOLENCE, 25), 0, 34},
                {STARTER_BEPPE, CHIAVE, Map.of(Resource.VIOLENCE, 10), 0, 18},
                {STARTER_BEPPE, LAVORO, Map.of(Resource.VIOLENCE, 10), 0, 14},
                {STARTER_BEPPE, LAVORO, Map.of(Resource.VIOLENCE, 10), 1, 18},
                {STARTER_BEPPE, LAVORO, Map.of(Resource.VIOLENCE, 10), 2, 22},
                {STARTER_BEPPE, LAVORO, Map.of(Resource.VIOLENCE, 10), 3, 26},
        };
        for (Object[] c : cases) {
            @SuppressWarnings("unchecked") Map<Resource, Integer> res = (Map<Resource, Integer>) c[2];
            Card card = b.card((String) c[1]);
            Player me = seat((String) c[0], "a", card, res);
            if (c[1].equals(LAVORO)) {
                me.getCharacter().getItems().clear();
                for (int i = 0; i < (int) c[3]; i++) me.getCharacter().getItems().add(b.card(SITE_HELMET));
            }
            Player foe = foe();
            playAndForecast(me, card, foe, null);
            assertEquals(500 - (int) c[4], foe.getResources().get(Resource.HEALTH), c[1] + " with " + c[3] + " items");
        }
    }
}
