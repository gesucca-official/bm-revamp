package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.LoadableCard;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.Timer;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * SB-19 Fase B2 (D130, regole del playground 1.5): the loader of the field {@code inPlay} (RP-28) and the engine's «In campo»
 * effect (RP-27), with the two items of the draft (OGG-17 Conto del tavolo sei, OGG-18 Sigaretta accesa). «s» and «b» are two
 * players on the d50 rules; «s» is the faster.
 */
class Sb19InPlayTest {
    private static final ObjectMapper JSON = new ObjectMapper();
    private static Draft draft;

    @BeforeAll
    static void load() throws Exception { draft = Draft.fromClasspath("/set-base/bozza.json"); }

    // ---- the table ----

    private static Card card(String name, String json) {
        try {
            LoadableCard card = DataCards.instantiate(DataCards.definition(JSON.readTree(json.replace('\'', '"'))));
            card.setGuiName(name);
            card.setGuiRole("RESOURCES", "+1 V");
            card.setGuiDamage("—");
            card.setGuiDamageAmount("—");
            return card;
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    private static Card filler() {
        return card("Riempitivo", "{'binding':'t.R','kind':'ACTION','targets':['SELF'],'self':[{'op':'gain','resource':'VIOLENCE','amount':1}]}");
    }

    /** The basic that consumes the item it targets. */
    private static Card consumer() {
        return card("Basic", "{'binding':'t.Basic','kind':'ACTION','basic':true,'priority':-1,'targets':['NEAR_ITEM'],'self':[{'op':'consume'}]}");
    }

    private static Card lastResort() {
        return card("Last", "{'binding':'t.Last','kind':'ACTION','lastResort':true,'targets':['OPPONENT'],'target':[{'op':'damage','type':'HIT','amount':3}]}");
    }

    private static Character character(String id, int capacity, Map<Resource, Integer> start, Set<Resource> immune) {
        Map<Resource, Integer> resources = new EnumMap<>(Resource.class);
        for (Resource r : Resource.values()) resources.put(r, 0);
        resources.put(Resource.HEALTH, 100);
        resources.put(Resource.ALERTNESS, id.equals("s") ? 60 : 10);
        resources.putAll(start);
        return new Draft.DraftCharacter(id, resources, capacity, immune);
    }

    private static Map<Resource, Integer> res(Object... pairs) {
        Map<Resource, Integer> map = new EnumMap<>(Resource.class);
        for (int i = 0; i < pairs.length; i += 2) map.put((Resource) pairs[i], (Integer) pairs[i + 1]);
        return map;
    }

    private static Player player(String id, Map<Resource, Integer> start, Set<Resource> immune, List<Card> hand) {
        Player p = new Player(id, character(id, 3, start, immune), consumer(), List.of(), lastResort(), List.of(), new Random(1));
        p.getCardsInHand().clear();
        p.getCardsInHand().add(consumer());
        p.getCardsInHand().addAll(hand);
        p.getCardsInHand().addAll(Collections.nCopies(2, filler()));
        for (int i = 0; i < 12; i++) p.getDeck().add(filler());
        return p;
    }

    private static Game game(Ruleset rules, Player... players) {
        Game game = new Game(List.of(players), "sb-19-inplay", false);
        game.useRuleset(rules);
        return game;
    }

    private static Card conto() { return draft.card(Sb19.CONTO); }

    private static Card sigaretta() { return draft.card(Sb19.SIGARETTA); }

    private static Move move(Game game, String player, String card, String target, String item) {
        Map<Move.AdditionalAction, String> choices = new EnumMap<>(Move.AdditionalAction.class);
        if (item != null) choices.put(Move.AdditionalAction.TARGET_ITEM, item);
        return new Move(card, player, target, game.getGameId(), choices);
    }

    private static void turn(Game game, Move s, Move b) {
        game.submitMove(s);
        game.submitMove(b);
        game.resolveMoves(g -> { }, (t, events) -> { });
    }

    private static int res(Game game, String id, Resource r) { return game.getPlayers().get(id).getCharacter().getResources().get(r); }

    private static List<String> names(Character c) {
        List<String> names = new ArrayList<>();
        for (Card item : c.getItems()) names.add(item.getName());
        return names;
    }

    // ---- RP-28, the loader ----

    private static ObjectNode card(JsonNode root, String binding) {
        for (JsonNode c : root.get("cards")) if (c.path("binding").asText().equals(binding)) return (ObjectNode) c;
        throw new AssertionError(binding);
    }

    private static ObjectNode step(String op, String resource, Object amount) {
        ObjectNode step = JSON.createObjectNode().put("op", op);
        if (resource != null) step.put("resource", resource);
        if (amount instanceof Integer) step.put("amount", (Integer) amount);
        else if (amount != null) step.set("amount", (JsonNode) amount);
        return step;
    }

    private static ArrayNode steps(ObjectNode... steps) {
        ArrayNode array = JSON.createArrayNode();
        for (ObjectNode step : steps) array.add(step);
        return array;
    }

    /** The draft with the Conto's inPlay (and its gui.inPlay) replaced; a null array takes the field away. */
    private static String loadWith(ArrayNode inPlay, String guiInPlay) {
        ObjectNode root = draft.json().deepCopy();
        ObjectNode conto = card(root, Sb19.CONTO);
        if (inPlay == null) conto.remove("inPlay"); else conto.set("inPlay", inPlay);
        ObjectNode gui = (ObjectNode) conto.get("gui");
        if (guiInPlay == null) gui.remove("inPlay"); else gui.put("inPlay", guiInPlay);
        try {
            Draft.parse("prova inPlay", root);
            return null;
        } catch (IllegalArgumentException e) {
            return e.getMessage();
        }
    }

    private static void assertRefused(String message, String expected) {
        assertNotNull(message, "the loader accepted what RP-28 refuses");
        assertTrue(message.contains(expected), message);
    }

    @Test
    void theDraftOfTheSetCarriesTheFieldOnlyInTheTwoItems() {
        for (JsonNode c : draft.json().get("cards")) {
            boolean has = c.has("inPlay");
            assertEquals(Set.of(Sb19.CONTO, Sb19.SIGARETTA).contains(c.get("binding").asText()), has, c.get("binding").asText());
            assertEquals(has, c.get("gui").has("inPlay"), c.get("binding").asText() + ": gui.inPlay goes with the field");
            if (has) assertEquals("ITEM", c.get("kind").asText());
        }
        assertEquals(List.of("LOSE ALERTNESS 4"), shapeOf(conto()), "OGG-17: −4 A (SB-21z, D162: was −3)");
        assertEquals(List.of("GAIN TOXICITY 2"), shapeOf(sigaretta()), "OGG-18: +2 T");
        assertNull(loadWith((ArrayNode) card(draft.json(), Sb19.CONTO).get("inPlay").deepCopy(), "−4 A"), "the draft as it is loads");
    }

    private static List<String> shapeOf(Card item) {
        List<String> shape = new ArrayList<>();
        for (com.gsc.bm.model.cards.PrintedEffects.Step s : com.gsc.bm.model.cards.PrintedEffects.inPlay(item))
            shape.add(s.getKind() + " " + s.getResource() + " " + s.getBase());
        return shape;
    }

    @Test
    void theFieldIsAcceptedWithOneOrTwoAllowedSteps() {
        assertNull(loadWith(steps(step("lose", "VIOLENCE", 2)), "−2 V"));
        assertNull(loadWith(steps(step("gain", "ALCOHOL", 3)), "+3 L"));
        assertNull(loadWith(steps(step("lose", "ALERTNESS", 3), step("gain", "TOXICITY", 1)), "−3 A, +1 T"));
        assertNull(loadWith(null, null), "the Conto without the field and without its text: a plain item");
    }

    @Test
    void theFieldIsRefusedOutsideAnItem() {
        ObjectNode root = draft.json().deepCopy();
        ObjectNode action = null;
        for (JsonNode c : root.get("cards")) if (c.path("kind").asText().equals("ACTION") && !c.has("java")) { action = (ObjectNode) c; break; }
        assertNotNull(action);
        action.set("inPlay", steps(step("lose", "ALERTNESS", 3)));
        ((ObjectNode) action.get("gui")).put("inPlay", "−3 A");
        try {
            Draft.parse("inPlay in un'azione", root);
            fail("an inPlay on an action must be refused");
        } catch (IllegalArgumentException e) {
            assertTrue(e.getMessage().contains("inPlay vale solo per un oggetto"), e.getMessage());
        }
    }

    @Test
    void anyOtherStepIsRefused() {
        assertRefused(loadWith(steps(step("lose", "HEALTH", 3)), "−3 H"), "lose vale solo per ALERTNESS o VIOLENCE");
        assertRefused(loadWith(steps(step("gain", "HEALTH", 3)), "+3 H"), "gain vale solo per TOXICITY o ALCOHOL");
        assertRefused(loadWith(steps(step("lose", "TOXICITY", 3)), "−3 T"), "lose vale solo per ALERTNESS o VIOLENCE");
        assertRefused(loadWith(steps(step("lose", "ALCOHOL", 3)), "−3 L"), "lose vale solo per ALERTNESS o VIOLENCE");
        assertRefused(loadWith(steps(step("gain", "ALERTNESS", 3)), "+3 A"), "gain vale solo per TOXICITY o ALCOHOL");
        assertRefused(loadWith(steps(step("gain", "VIOLENCE", 3)), "+3 V"), "gain vale solo per TOXICITY o ALCOHOL");
        assertRefused(loadWith(steps(step("empty", "TOXICITY", null)), "azzera T"), "ammessi solo lose e gain");
        assertRefused(loadWith(steps(step("consume", null, null)), "consuma"), "ammessi solo lose e gain");
        ObjectNode hit = JSON.createObjectNode().put("op", "damage").put("type", "HIT").put("amount", 3);
        assertRefused(loadWith(steps(hit), "3 HIT"), "ammessi solo lose e gain");
    }

    @Test
    void aVariableOrNonPositiveAmountOrTooManyStepsIsRefused() {
        ObjectNode variable = JSON.createObjectNode().put("base", 1).put("of", "ALERTNESS");
        assertRefused(loadWith(steps(step("lose", "ALERTNESS", variable)), "−x A"), "la quantità è fissa");
        ObjectNode divided = JSON.createObjectNode().put("base", 1).put("divide", 2);
        assertRefused(loadWith(steps(step("lose", "ALERTNESS", divided)), "−x A"), "la quantità è fissa");
        ObjectNode perPlay = JSON.createObjectNode().put("base", 1).put("perPlay", 1);
        assertRefused(loadWith(steps(step("lose", "ALERTNESS", perPlay)), "−x A"), "la quantità è fissa");
        assertRefused(loadWith(steps(step("lose", "ALERTNESS", 0)), "−0 A"), "la quantità è positiva");
        assertRefused(loadWith(steps(step("lose", "ALERTNESS", -2)), "−-2 A"), "la quantità è positiva");
        assertRefused(loadWith(steps(step("lose", "ALERTNESS", 1), step("lose", "VIOLENCE", 1), step("gain", "TOXICITY", 1)), "tre"), "al più due passi");
    }

    @Test
    void theShortTextGoesWithTheField() {
        assertRefused(loadWith(steps(step("lose", "ALERTNESS", 3)), null), "campo gui.inPlay mancante");
        assertRefused(loadWith(null, "−3 A"), "gui.inPlay senza il campo inPlay");
        // The same for a card written in Java: it cannot have the text.
        ObjectNode root = draft.json().deepCopy();
        for (JsonNode c : root.get("cards"))
            if (c.path("java").asBoolean()) { ((ObjectNode) c.get("gui")).put("inPlay", "−3 A"); break; }
        try {
            Draft.parse("gui.inPlay in una carta Java", root);
            fail("gui.inPlay on a Java card must be refused");
        } catch (IllegalArgumentException e) {
            assertTrue(e.getMessage().contains("gui.inPlay senza il campo inPlay"), e.getMessage());
        }
    }

    @Test
    void theTextAndTheViewOfAnItemAreThereOnlyWhenTheItemHasTheEffect() throws Exception {
        assertTrue(JSON.writeValueAsString(conto()).contains("\"inPlay\":\"−4 A\""), "the view carries the text");
        Card espresso = draft.card("base.items.EspressoDelDistributore");
        assertFalse(JSON.writeValueAsString(espresso).contains("inPlay"), "the views of today stay as they are, byte for byte");
    }

    // ---- RP-27, the engine ----

    @Test
    void theEffectActsAfterThePoisonAndTheTimersOneItemAtATimeFromTheOldest() {
        Character c = character("s", 3, res(Resource.TOXICITY, 4, Resource.ALERTNESS, 10), Set.of());
        c.useRuleset(Ruleset.D50);
        c.getItems().add(sigaretta());
        c.getItems().add(conto());
        c.getTimers().add(new Timer("Prova", x -> { }, 1));
        List<String> report = c.resolveTimeBasedEffects();
        assertEquals(4, report.size(), report.toString());
        assertTrue(report.get(0).startsWith("(TOXICITY effect)"), report.toString());
        assertTrue(report.get(1).startsWith("Timer expired for Prova"), report.toString());
        assertTrue(report.get(2).startsWith("(Sigaretta Accesa) TOXICITY: 4->6"), "the oldest first: " + report);
        assertTrue(report.get(3).startsWith("(Conto del Tavolo Sei) ALERTNESS: 10->6 (-4)"), report.toString());
        assertEquals(100 - 2, c.getResources().get(Resource.HEALTH), "the poison of T 4 (2), taken before the +2 T");
        c.resolveTimeBasedEffects();
        assertEquals(100 - 2 - 3, c.getResources().get(Resource.HEALTH), "the T that the Sigaretta gave poisons from the next turn: 6/2");
    }

    @Test
    void anImmuneHolderKeepsTheResourceWithoutThePoison() {
        Character c = character("s", 3, res(), Set.of(Resource.TOXICITY));
        c.useRuleset(Ruleset.D50);
        c.getItems().add(sigaretta());
        for (int i = 0; i < 3; i++) c.resolveTimeBasedEffects();
        assertEquals(6, c.getResources().get(Resource.TOXICITY));
        assertEquals(100, c.getResources().get(Resource.HEALTH));
    }

    @Test
    void theLossStopsAtZeroAndCostsNothingOnAResourceAtZero() {
        Character c = character("s", 3, res(Resource.ALERTNESS, 2), Set.of());
        c.useRuleset(Ruleset.D50);
        c.getItems().add(conto());
        c.resolveTimeBasedEffects();
        assertEquals(0, c.getResources().get(Resource.ALERTNESS), "RP-4: the floor is zero");
        c.resolveTimeBasedEffects();
        assertEquals(0, c.getResources().get(Resource.ALERTNESS));
        Character other = character("b", 3, res(Resource.ALERTNESS, 2, Resource.VIOLENCE, 0), Set.of());
        other.useRuleset(Ruleset.D50);
        other.getItems().add(card("Tassa V", "{'binding':'t.Tassa','kind':'ITEM','inPlay':[{'op':'lose','resource':'VIOLENCE','amount':5}],'self':[]}"));
        other.resolveTimeBasedEffects();
        assertEquals(0, other.getResources().get(Resource.VIOLENCE));
        assertEquals(2, other.getResources().get(Resource.ALERTNESS), "only the resource of the effect");
    }

    @Test
    void itNeverTouchesHealthAndNoStatusChangesIt() {
        Character c = character("s", 3, res(Resource.ALERTNESS, 10), Set.of());
        c.useRuleset(Ruleset.D50);
        c.getItems().add(conto());
        c.getStatuses().add(com.gsc.bm.model.game.status.Status.builder().name("EQUIP").description("e")
                .type(com.gsc.bm.model.game.status.StatusType.GOOD).flow(com.gsc.bm.model.game.status.StatusFlow.INPUT)
                .impactedProperty(Damage.DamageType.HIT).amountFunction(x -> x * 0.5f).equip(true).build());
        c.resolveTimeBasedEffects();
        assertEquals(6, c.getResources().get(Resource.ALERTNESS), "a status that halves what the character takes does not halve it");
        assertEquals(100, c.getResources().get(Resource.HEALTH));
    }

    @Test
    void aCharacterEliminatedByThePoisonOfTheSameEndOfTurnTakesNoEffect() {
        Character c = character("s", 3, res(Resource.TOXICITY, 10, Resource.ALERTNESS, 10, Resource.HEALTH, 4), Set.of());
        c.useRuleset(Ruleset.D50);
        c.getItems().add(conto());
        c.getItems().add(sigaretta());
        List<String> report = c.resolveTimeBasedEffects();
        assertTrue(c.isDead());
        assertEquals(10, c.getResources().get(Resource.ALERTNESS), "R06: the dead has no periodic effects");
        assertEquals(10, c.getResources().get(Resource.TOXICITY));
        assertTrue(report.stream().noneMatch(line -> line.startsWith("(Conto") || line.startsWith("(Sigaretta")), report.toString());
    }

    @Test
    void theLiveRulesDoNotKnowTheEffect() {
        Character c = character("s", 3, res(Resource.ALERTNESS, 10), Set.of());
        c.getItems().add(conto());
        assertTrue(c.resolveTimeBasedEffects().isEmpty());
        assertEquals(10, c.getResources().get(Resource.ALERTNESS));
    }

    @Test
    void whoHasTheItemNowPaysAlsoInTheTurnItArrives() {
        // «Steal» (GEN-02): s takes the Conto from b and pays it at the end of this same turn; b, who had it, does not.
        Game game = game(Ruleset.D50, player("s", res(), Set.of(), List.of(draft.card("com.Steal"))), player("b", res(Resource.ALERTNESS, 30), Set.of(), List.of()));
        game.getPlayers().get("b").getCharacter().getItems().add(conto());
        turn(game, move(game, "s", "Furto con Destrezza", "b", "Conto del Tavolo Sei"), move(game, "b", "Riempitivo", "SELF", null));
        assertEquals(List.of("Conto del Tavolo Sei"), names(game.getPlayers().get("s").getCharacter()));
        assertEquals(60 - 10 - 4, res(game, "s", Resource.ALERTNESS), "10 A for the Steal, then −4");
        assertEquals(30, res(game, "b", Resource.ALERTNESS), "the previous holder pays nothing");
    }

    @Test
    void anItemPassedWithScattoRepentinoCostsTheOtherSide() {
        Game game = game(Ruleset.D50, player("s", res(), Set.of(), List.of(draft.card("base.com.ShuffleFeet"))), player("b", res(Resource.ALERTNESS, 30), Set.of(), List.of()));
        game.getPlayers().get("s").getCharacter().getItems().add(conto());
        turn(game, move(game, "s", "Scatto Repentino", "b", null), move(game, "b", "Riempitivo", "SELF", null));
        assertEquals(List.of(), names(game.getPlayers().get("s").getCharacter()));
        assertEquals(List.of("Conto del Tavolo Sei"), names(game.getPlayers().get("b").getCharacter()));
        assertEquals(60, res(game, "s", Resource.ALERTNESS));
        assertEquals(26, res(game, "b", Resource.ALERTNESS)); // SB-21z (D162): −4 A, was −3
    }

    @Test
    void aConsumedItemGivesItsGainAndNoMoreEffect() {
        Game game = game(Ruleset.D50, player("s", res(), Set.of(), List.of()), player("b", res(), Set.of(), List.of()));
        game.getPlayers().get("s").getCharacter().getItems().add(conto());
        turn(game, move(game, "s", "Basic", "SELF", "Conto del Tavolo Sei"), move(game, "b", "Riempitivo", "SELF", null));
        assertEquals(List.of(), names(game.getPlayers().get("s").getCharacter()));
        assertEquals(15, res(game, "s", Resource.VIOLENCE), "+15 V");
        assertEquals(60, res(game, "s", Resource.ALERTNESS), "consumed before the end of the turn: no −3");
    }

    @Test
    void aSoldItemGivesNothingNotEvenItsEffect() {
        Game game = game(Ruleset.D50, player("s", res(Resource.HEALTH, 50), Set.of(), List.of(draft.card("base.cesira.LoRivendo"))),
                player("b", res(), Set.of(), List.of()));
        game.getPlayers().get("s").getCharacter().getItems().add(conto());
        turn(game, move(game, "s", "Fiuto per gli Affari", "SELF", "Conto del Tavolo Sei"), move(game, "b", "Riempitivo", "SELF", null));
        assertEquals(List.of(), names(game.getPlayers().get("s").getCharacter()));
        assertEquals(58, res(game, "s", Resource.HEALTH), "+8 HEALTH");
        assertEquals(60, res(game, "s", Resource.ALERTNESS), "RP-25: sold, so no −3 and no +15 V");
        assertEquals(0, res(game, "s", Resource.VIOLENCE));
    }

    @Test
    void anItemDisplacedByAnotherLeavesWithoutActing() {
        Character c = character("s", 1, res(Resource.ALERTNESS, 10), Set.of());
        c.useRuleset(Ruleset.D50);
        c.getItems().add(conto());
        c.getItems().add(draft.card("base.items.EspressoDelDistributore"));
        assertEquals(List.of("Espresso della Macchinetta"), names(c), "capacity 1: the newest stays (R02)");
        List<String> report = c.resolveTimeBasedEffects();
        assertEquals(10, c.getResources().get(Resource.ALERTNESS));
        assertTrue(report.isEmpty(), report.toString());
    }

    @Test
    void theItemWithoutTheEffectKeepsDoingNothingInPlay() {
        Character c = character("s", 3, res(Resource.ALERTNESS, 10), Set.of());
        c.useRuleset(Ruleset.D50);
        c.getItems().add(draft.card("base.items.EspressoDelDistributore"));
        assertTrue(c.resolveTimeBasedEffects().isEmpty(), "R02 stands for every other item");
        assertEquals(10, c.getResources().get(Resource.ALERTNESS));
    }
}
