package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.DynamicTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestFactory;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.stream.Stream;

import static com.gsc.bm.sim.ConsumeEquipFixtures.JSON;
import static com.gsc.bm.sim.ConsumeEquipFixtures.cardOf;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * SB-11a: i passi consume ed equip si controllano alla lettura della bozza, con un messaggio che dice file, voce e campo (come in SB-6a).
 * La bozza di partenza è quella «attuale» con le tre prese a dati più le carte di prova.
 */
class ConsumeEquipValidationTest {
    private static ObjectNode base() throws Exception { return ConsumeEquipFixtures.withFixtures(); }

    private static ObjectNode step(ObjectNode root, String binding, String list, int index) {
        return (ObjectNode) cardOf(root, binding).get(list).get(index);
    }

    private static ArrayNode steps(ObjectNode root, String binding, String list) {
        ObjectNode card = cardOf(root, binding);
        if (!card.has(list)) card.set(list, JSON.createArrayNode());
        return (ArrayNode) card.get(list);
    }

    private static ObjectNode consume() { return JSON.createObjectNode().put("op", "consume"); }

    /** La bozza di partenza è valida: nessun controllo scatta per errore. */
    @Test void theStartingDraftIsValid() throws Exception {
        assertDoesNotThrow(() -> Draft.parse("bozza.json", base()));
    }

    /** Combinazioni valide che i controlli devono lasciar passare. */
    @TestFactory Stream<DynamicTest> validCombinationsAreAccepted() {
        Map<String, Consumer<ObjectNode>> cases = new LinkedHashMap<>();
        cases.put("equip con durata e uso singolo insieme", c -> ((ObjectNode) step(c, "prova.giubbotto", "self", 0)).put("singleUse", true));
        cases.put("equip con uso singolo e durata", c -> ((ObjectNode) step(c, "prova.posacenere", "self", 0)).put("turns", 0));
        cases.put("equip: false scritto, con durata", c -> ((ObjectNode) step(c, "prova.pelle", "self", 0)).put("equip", false));
        cases.put("conversione a un altro tipo", c -> ((ObjectNode) step(c, "prova.coccio", "self", 0)).put("convertTo", "POISON"));
        cases.put("equip in un'azione con altri passi", c -> steps(c, "prova.coccio", "self").add(JSON.createObjectNode().put("op", "say").put("text", "Equipaggiato")));
        cases.put("consume seguito da altri passi", c -> steps(c, "prova.basicRocco", "self").add(JSON.createObjectNode().put("op", "gain").put("resource", "VIOLENCE").put("amount", 1)));
        List<DynamicTest> tests = new ArrayList<>();
        for (Map.Entry<String, Consumer<ObjectNode>> entry : cases.entrySet())
            tests.add(DynamicTest.dynamicTest(entry.getKey(), () -> {
                ObjectNode root = base();
                entry.getValue().accept(root);
                assertDoesNotThrow(() -> Draft.parse("bozza.json", root));
            }));
        return tests.stream();
    }

    @TestFactory Stream<DynamicTest> badStepsAreRefusedWithFileCardAndField() {
        Map<String, Object[]> cases = new LinkedHashMap<>();
        // consume fuori posto
        cases.put("consume nella lista target", new Object[] {(Consumer<ObjectNode>) c -> {
            ObjectNode grab = cardOf(c, "com.Grab");
            grab.set("self", JSON.createArrayNode());
            grab.set("target", JSON.createArrayNode().add(consume()));
        }, "carta com.Grab", "target[0]", "consume vale solo in self"});
        cases.put("consume in una bound", new Object[] {(Consumer<ObjectNode>) c -> steps(c, "bruiser.character.LittleSmack", "self").add(consume()),
                "carta bruiser.character.LittleSmack", "consume non è ammesso in una bound"});
        cases.put("consume in una last resort", new Object[] {(Consumer<ObjectNode>) c -> steps(c, "com.last.Struggle", "self").add(consume()),
                "carta com.last.Struggle", "consume non è ammesso in una last resort"});
        cases.put("consume in un oggetto", new Object[] {(Consumer<ObjectNode>) c -> steps(c, "com.items.RottenBeer", "self").add(consume()),
                "carta com.items.RottenBeer", "consume non è ammesso in un oggetto"});
        cases.put("consume in un'azione senza oggetto vicino", new Object[] {(Consumer<ObjectNode>) c -> steps(c, "bruiser.SuperImpact", "self").add(consume()),
                "carta bruiser.SuperImpact", "self[0]", "consume richiede targets NEAR_ITEM"});
        cases.put("consume in un'azione che bersaglia un oggetto avversario", new Object[] {(Consumer<ObjectNode>) c ->
                cardOf(c, "com.Grab").set("targets", JSON.createArrayNode().add("FAR_ITEM")),
                "carta com.Grab", "self[0]", "NEAR_ITEM"});
        cases.put("due consume", new Object[] {(Consumer<ObjectNode>) c -> steps(c, "com.Grab", "self").add(consume()),
                "carta com.Grab", "self[1]", "consume ripetuto"});
        cases.put("consume con un campo", new Object[] {(Consumer<ObjectNode>) c -> step(c, "com.Grab", "self", 0).put("count", 2),
                "carta com.Grab", "self[0]", "count"});
        // equip
        cases.put("equip: campo mancante", new Object[] {(Consumer<ObjectNode>) c -> step(c, "prova.giubbotto", "self", 0).remove("factor"),
                "carta prova.giubbotto", "self[0]", "factor"});
        cases.put("equip: flusso mancante", new Object[] {(Consumer<ObjectNode>) c -> step(c, "prova.giubbotto", "self", 0).remove("flow"),
                "carta prova.giubbotto", "self[0]", "flow"});
        cases.put("equip: campo sconosciuto", new Object[] {(Consumer<ObjectNode>) c -> step(c, "prova.giubbotto", "self", 0).put("permanent", true),
                "carta prova.giubbotto", "self[0]", "permanent"});
        cases.put("equip: moltiplicatore zero", new Object[] {(Consumer<ObjectNode>) c -> step(c, "prova.giubbotto", "self", 0).put("factor", 0),
                "carta prova.giubbotto", "self[0]", "factor", "positivo"});
        cases.put("equip: moltiplicatore negativo", new Object[] {(Consumer<ObjectNode>) c -> step(c, "prova.posacenere", "self", 0).put("factor", -1.5),
                "carta prova.posacenere", "self[0]", "factor", "positivo"});
        cases.put("equip: conversione verso un tipo inesistente", new Object[] {(Consumer<ObjectNode>) c -> step(c, "prova.coccio", "self", 0).put("convertTo", "ACID"),
                "carta prova.coccio", "self[0].convertTo", "ACID"});
        cases.put("equip: conversione verso lo stesso tipo", new Object[] {(Consumer<ObjectNode>) c -> step(c, "prova.coccio", "self", 0).put("convertTo", "HIT"),
                "carta prova.coccio", "self[0]", "convertTo", "se stesso"});
        cases.put("equip: né durata né uso singolo", new Object[] {(Consumer<ObjectNode>) c -> step(c, "prova.giubbotto", "self", 0).remove("turns"),
                "carta prova.giubbotto", "self[0]", "equip senza durata né uso singolo"});
        cases.put("equip: uso singolo falso e nessuna durata", new Object[] {(Consumer<ObjectNode>) c -> step(c, "prova.posacenere", "self", 0).put("singleUse", false),
                "carta prova.posacenere", "self[0]", "equip senza durata né uso singolo"});
        cases.put("uso singolo senza equip", new Object[] {(Consumer<ObjectNode>) c -> step(c, "prova.pelle", "self", 0).put("singleUse", true),
                "carta prova.pelle", "self[0]", "singleUse", "equip: true"});
        cases.put("conversione senza equip", new Object[] {(Consumer<ObjectNode>) c -> step(c, "prova.pelle", "self", 0).put("convertTo", "CUT"),
                "carta prova.pelle", "self[0]", "convertTo", "equip: true"});
        cases.put("stato senza durata (come in SB-6a)", new Object[] {(Consumer<ObjectNode>) c -> step(c, "prova.pelle", "self", 0).remove("turns"),
                "carta prova.pelle", "self[0]", "turns"});
        cases.put("equip non booleano", new Object[] {(Consumer<ObjectNode>) c -> step(c, "prova.giubbotto", "self", 0).put("equip", "si"),
                "carta prova.giubbotto", "self[0].equip"});
        // basic
        cases.put("basic e last resort insieme", new Object[] {(Consumer<ObjectNode>) c -> cardOf(c, "prova.basicMara").put("lastResort", true),
                "carta prova.basicMara", "basic e lastResort"});
        cases.put("basic su un oggetto", new Object[] {(Consumer<ObjectNode>) c -> cardOf(c, "prova.giubbotto").put("basic", true),
                "carta prova.giubbotto", "basic vale solo per ACTION"});
        cases.put("basic su una bound", new Object[] {(Consumer<ObjectNode>) c -> cardOf(c, "bruiser.character.LittleSmack").put("basic", true),
                "carta bruiser.character.LittleSmack", "basic vale solo per ACTION"});
        List<DynamicTest> tests = new ArrayList<>();
        for (Map.Entry<String, Object[]> entry : cases.entrySet())
            tests.add(DynamicTest.dynamicTest(entry.getKey(), () -> {
                @SuppressWarnings("unchecked") Consumer<ObjectNode> change = (Consumer<ObjectNode>) entry.getValue()[0];
                ObjectNode root = base();
                change.accept(root);
                Draft.Invalid error = assertThrows(Draft.Invalid.class, () -> Draft.parse("bozza-errata.json", root));
                assertTrue(error.getMessage().startsWith("bozza-errata.json: "), error.getMessage());
                for (int i = 1; i < entry.getValue().length; i++)
                    assertTrue(error.getMessage().contains((String) entry.getValue()[i]), "Manca «" + entry.getValue()[i] + "» in: " + error.getMessage());
            }));
        return tests.stream();
    }

    /** Anche letta fuori dalla bozza (DataCards.parse, come in SB-5) la carta errata è rifiutata, con il nome della carta. */
    @Test void dataCardsAloneAlsoRefuseMisplacedSteps() throws Exception {
        ArrayNode prove = ConsumeEquipFixtures.read(ConsumeEquipFixtures.PROVE);
        ObjectNode vest = ConsumeEquipFixtures.definition(prove, "prova.giubbotto");
        ((ObjectNode) vest.get("self").get(0)).remove("turns");
        IllegalArgumentException error = assertThrows(IllegalArgumentException.class, () -> DataCards.parse(JSON.createArrayNode().add(vest)));
        assertEquals("Carta prova.giubbotto: self[0]: equip senza durata né uso singolo: serve turns oppure singleUse", error.getMessage());
        ObjectNode grab = ConsumeEquipFixtures.definition(ConsumeEquipFixtures.read(ConsumeEquipFixtures.CARDS), "com.Grab");
        grab.set("kind", JSON.getNodeFactory().textNode("BOUND"));
        grab.put("boundTo", "x");
        error = assertThrows(IllegalArgumentException.class, () -> DataCards.parse(JSON.createArrayNode().add(grab)));
        assertEquals("Carta com.Grab: self[0]: consume non è ammesso in una bound: una bound non può bersagliare oggetti", error.getMessage());
    }

    /** Le definizioni valide dei file di SB-11a si leggono e il token ha davvero la forma attesa. */
    @Test void sb11aFilesAreReadCompletely() throws Exception {
        DataCards cards = DataCards.parse(ConsumeEquipFixtures.read(ConsumeEquipFixtures.CARDS));
        assertEquals(List.of("com.Grab", "com.basic.BruiserGrab", "com.basic.ToxicGrab", "com.tokens.BrokenBeerBottle"), new ArrayList<>(cards.bindings()));
        DataCards prove = DataCards.parse(ConsumeEquipFixtures.read(ConsumeEquipFixtures.PROVE));
        assertEquals(8, prove.bindings().size());
        JsonNode token = ConsumeEquipFixtures.read(ConsumeEquipFixtures.CARDS).get(3);
        assertTrue(token.get("self").get(0).get("equip").asBoolean() && token.get("self").get(0).get("singleUse").asBoolean());
    }
}
