package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.LoadableCard;
import com.gsc.bm.model.game.ComPlayer;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.bot.AggressivePolicy;
import com.gsc.bm.model.game.bot.BotPolicy;
import com.gsc.bm.model.game.bot.PrudentPolicy;
import com.gsc.bm.model.game.bot.ResourceAwarePolicy;
import com.gsc.bm.model.game.status.Status;
import com.gsc.bm.model.game.status.StatusAmountFunction;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DynamicTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestFactory;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Random;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Ogni carta a dati deve comportarsi come la carta Java che sostituisce: stessi campi, stessi effetti, stesse partite. */
class DataCardsTest {
    private static final int SCENARIOS = 200;
    /** Partite per abbinamento; una misura più ampia si chiede con -Dsim.dataGames e -Dsim.firstSeed. */
    private static final int GAMES = Integer.getInteger("sim.dataGames", 25);
    private static final long FIRST_SEED = Long.getLong("sim.firstSeed", 0L);
    private static final ObjectMapper JSON = new ObjectMapper();
    private static SimulationCatalog java;
    private static SimulationCatalog withData;
    private static DataCards data;
    private static JsonNode raw;

    @BeforeAll static void load() throws Exception {
        java = new SimulationCatalog();
        data = DataCards.load();
        withData = new SimulationCatalog(data);
        try (InputStream input = DataCards.class.getResourceAsStream(DataCards.RESOURCE)) { raw = JSON.readTree(input); }
    }

    @TestFactory Stream<DynamicTest> everyDataCardMatchesItsJavaCard() {
        return data.bindings().stream().map(binding -> DynamicTest.dynamicTest(binding, () -> {
            String difference = difference(binding, data);
            assertEquals(null, difference, binding);
        }));
    }

    /** Il confronto serve solo se sa fallire: ogni numero, testo, enumerato e passo alterato deve essere notato. */
    @TestFactory Stream<DynamicTest> everyAlterationIsCaught() {
        List<DynamicTest> tests = new ArrayList<>();
        for (JsonNode card : raw) {
            String binding = card.get("binding").asText();
            tests.add(DynamicTest.dynamicTest(binding, () -> {
                List<JsonNode> mutants = mutants(card);
                assertFalse(mutants.isEmpty());
                for (JsonNode mutant : mutants) {
                    ArrayNode one = JSON.createArrayNode().add(mutant);
                    assertNotNull(difference(binding, DataCards.parse(one)), "Alterazione non notata: " + mutant);
                }
            }));
        }
        return tests.stream();
    }

    @Test void gamesAreIdenticalWithDataCards() throws Exception {
        SimulationRunner javaRunner = new SimulationRunner(java), dataRunner = new SimulationRunner(withData);
        List<String> characters = List.of(SimulationCatalog.BRUISER, SimulationCatalog.JUNKIE);
        List<BotPolicy[]> pairs = Arrays.asList(new BotPolicy[] {null, null},
                new BotPolicy[] {new AggressivePolicy(), new PrudentPolicy()},
                new BotPolicy[] {new ResourceAwarePolicy(), null},
                new BotPolicy[] {null, new AggressivePolicy()});
        StringBuilder traces = new StringBuilder();
        for (BotPolicy[] pair : pairs) for (String first : characters) for (String second : characters)
            for (long seed = FIRST_SEED; seed < FIRST_SEED + GAMES; seed++) {
                SimulationRunner.Contender a = new SimulationRunner.Contender(first, pair[0]);
                SimulationRunner.Contender b = new SimulationRunner.Contender(second, pair[1]);
                String expected = javaRunner.continueGame(javaRunner.newGame(seed, a, b), seed, true, g -> { }).jsonl();
                String actual = dataRunner.continueGame(dataRunner.newGame(seed, a, b), seed, true, g -> { }).jsonl();
                assertEquals(expected, actual, "Seme " + seed + ", " + first + " contro " + second);
                traces.append(actual);
            }
        String all = traces.toString();
        for (String binding : data.bindings()) {
            Card card = java.card(binding);
            String evidence = card.isItem() ? "Grabbed and consumed Item " + card.getName() : "\"card\":\"" + card.getName() + "\"";
            assertTrue(all.contains(evidence), "Mai giocata in queste partite: " + binding);
        }
    }

    @Test void gamesWithDataCardsSurviveACopy() throws Exception {
        SimulationRunner runner = new SimulationRunner(withData);
        for (long seed = 0; seed < 20; seed++) {
            SimulationRunner.Contender a = new SimulationRunner.Contender(SimulationCatalog.BRUISER, null);
            SimulationRunner.Contender b = new SimulationRunner.Contender(SimulationCatalog.JUNKIE, null);
            int midpoint = Math.max(1, runner.run(seed, a, b).turns / 2);
            Game[] snapshot = new Game[1];
            SimulationRunner.Result original = runner.continueGame(runner.newGame(seed, a, b), seed, true, state -> {
                if (state.getTurn() == midpoint) {
                    try { snapshot[0] = copy(state); } catch (Exception e) { throw new IllegalStateException(e); }
                }
            });
            SimulationRunner.Result resumed = runner.continueGame(snapshot[0], seed, true, state -> { });
            assertEquals(original.trace.subList(midpoint, original.trace.size()), resumed.trace, "Seme " + seed);
        }
    }

    @Test void badDefinitionsAreRefused() {
        for (String bad : List.of(
                "[{\"binding\":\"x\",\"kind\":\"ACTION\",\"targets\":[\"SELF\"],\"unknownField\":1}]",
                "[{\"binding\":\"x\",\"kind\":\"ACTION\",\"targets\":[\"SELF\"],\"self\":[{\"op\":\"explode\"}]}]",
                "[{\"binding\":\"x\",\"kind\":\"ACTION\"}]",
                "[{\"binding\":\"x\",\"kind\":\"ITEM\",\"priority\":2}]",
                "[{\"binding\":\"x\",\"kind\":\"ACTION\",\"targets\":[\"SELF\"],\"boundTo\":\"y\"}]",
                "[{\"binding\":\"x\",\"kind\":\"ACTION\",\"targets\":[\"SELF\"]},{\"binding\":\"x\",\"kind\":\"ACTION\",\"targets\":[\"SELF\"]}]"))
            assertThrows(Exception.class, () -> DataCards.parse(JSON.readTree(bad)), bad);
    }

    /** Ogni carta del catalogo è a dati oppure elencata in java-cards.tsv con un motivo, mai entrambe le cose. */
    @Test void everyCatalogCardIsClassified() throws Exception {
        Map<String, String[]> java = new HashMap<>();
        try (InputStream input = DataCards.class.getResourceAsStream("/sb-5/java-cards.tsv")) {
            List<String> lines = Arrays.asList(new String(Objects.requireNonNull(input).readAllBytes(), StandardCharsets.UTF_8).split("\\R"));
            for (String line : lines.subList(1, lines.size())) {
                String[] fields = line.split("\t", -1);
                assertEquals(3, fields.length, line);
                assertFalse(fields[1].isBlank(), "Motivo mancante: " + line);
                assertTrue(java.put(fields[0], fields) == null, "Ripetuta: " + fields[0]);
            }
        }
        Set<String> catalog = DataCardsTest.java.bindings();
        Set<String> both = new HashSet<>(java.keySet());
        both.retainAll(data.bindings());
        assertEquals(Set.of(), both, "A dati e in Java insieme");
        Set<String> unknown = new HashSet<>(java.keySet());
        unknown.addAll(data.bindings());
        unknown.removeAll(catalog);
        assertEquals(Set.of(), unknown, "Fuori catalogo");
        Set<String> missing = new TreeSet<>(catalog);
        missing.removeAll(java.keySet());
        missing.removeAll(data.bindings());
        assertEquals(Set.of(), missing, "Non classificate");
    }

    /** La prima differenza fra la carta Java e quella a dati, o null. */
    private static String difference(String binding, DataCards source) throws Exception {
        LoadableCard dataCard = java.dress(binding, source.create(binding));
        Card javaCard = java.card(binding);
        String expected = shape(javaCard), actual = shape(dataCard);
        if (!expected.equals(actual)) return "Campi: " + expected + " invece di " + actual;
        for (long seed = 0; seed < SCENARIOS; seed++) {
            expected = outcome(java.card(binding), seed);
            actual = outcome(java.dress(binding, source.create(binding)), seed);
            if (!expected.equals(actual)) return "Scenario " + seed + ": " + expected + " invece di " + actual;
        }
        return null;
    }

    private static String shape(Card card) {
        return card.getBindingName() + "|" + card.isItem() + "|" + card.isBasicAction() + "|" + card.isLastResort()
                + "|" + card.getBoundToCharacter() + "|" + card.getPriority() + "|" + new TreeSet<>(card.getCanTarget())
                + "|" + new TreeMap<>(card.getCost());
    }

    /** Applica la carta a uno stato ricavato dal seme e descrive tutto ciò che ne risulta. */
    private static String outcome(Card card, long seed) throws Exception {
        Random random = new Random(seed);
        ComPlayer a = java.player(random.nextBoolean() ? SimulationCatalog.BRUISER : SimulationCatalog.JUNKIE, "seat-1", new Random(seed));
        ComPlayer b = java.player(random.nextBoolean() ? SimulationCatalog.BRUISER : SimulationCatalog.JUNKIE, "seat-2", new Random(seed + 1));
        Game game = new Game(List.of(a, b), "sim", false);
        arrange(a.getCharacter(), random);
        arrange(b.getCharacter(), random);
        String report;
        try {
            report = card.isItem() ? consume((AbstractCard) card, a.getCharacter(), b.getCharacter()) : play(card, game, a);
        } catch (RuntimeException failure) {
            report = failure.getClass().getSimpleName();
        }
        return report + " " + describe(a) + " " + describe(b);
    }

    /** Gli oggetti non stanno mai in mano: nel gioco li consuma solo Grab, che ne chiama gli effetti direttamente. */
    private static String consume(AbstractCard item, Character self, Character other) {
        return item.applyEffectOnSelf(self) + "/" + item.applyEffectOnTarget(self, other);
    }

    private static String play(Card card, Game game, ComPlayer player) {
        player.getCardsInHand().add(card);
        String target = card.getCanTarget().contains(Card.CardTarget.OPPONENT) ? "seat-2" : "SELF";
        Map<Move.AdditionalAction, String> choices = new HashMap<>();
        if (card.isCharacterBound()) {
            String discard = player.getCardsInHand().stream().map(Card::getName)
                    .filter(name -> !name.equals(card.getName())).findFirst().orElseThrow();
            choices.put(Move.AdditionalAction.DISCARD_ONE, discard);
        }
        Move move = new Move(card.getName(), player.getPlayerId(), target, game.getGameId(), choices);
        return new TreeMap<>(card.resolve(game, move)).toString();
    }

    private static void arrange(Character character, Random random) {
        Map<Resource, Integer> resources = character.getResources();
        for (Resource resource : List.of(Resource.VIOLENCE, Resource.ALERTNESS, Resource.TOXICITY, Resource.ALCOHOL)) {
            if (random.nextInt(8) == 0) resources.remove(resource);
            else resources.put(resource, random.nextInt(60));
        }
        resources.put(Resource.HEALTH, 1 + random.nextInt(100));
        for (Resource immunity : List.of(Resource.TOXICITY, Resource.ALCOHOL))
            if (random.nextInt(4) == 0) character.getImmunities().add(immunity);
        int statuses = random.nextInt(4);
        for (int i = 0; i < statuses; i++) {
            final float factor = new float[] {0.5f, 1.5f, 2f}[random.nextInt(3)];
            character.getStatuses().add(Status.builder().name("arranged " + i)
                    .type(random.nextBoolean() ? StatusType.GOOD : StatusType.BAD)
                    .flow(random.nextBoolean() ? StatusFlow.INPUT : StatusFlow.OUTPUT)
                    .impactedProperty(Damage.DamageType.values()[random.nextInt(3)])
                    .amountFunction((StatusAmountFunction) n -> n * factor)
                    .singleUse(random.nextBoolean()).lastsForTurns(random.nextInt(3)).build());
        }
    }

    private static String describe(ComPlayer player) {
        Character character = player.getCharacter();
        List<String> statuses = character.getStatuses().stream().map(status -> status.getName() + "," + status.getDescription()
                + "," + status.getType() + "," + status.getFlow() + "," + status.getImpactedProperty() + "," + status.isSingleUse()
                + "," + status.isEquip() + "," + status.getLastsForTurns() + "," + status.getAmountFunction().apply(100f)
                + "," + status.getTypeFunction().apply(Damage.DamageType.HIT)).collect(Collectors.toList());
        return new TreeMap<>(character.getResources()) + " " + new TreeSet<>(character.getImmunities()) + " " + statuses
                + " " + character.getTimers().stream().map(t -> t.getName() + t.getTimer()).collect(Collectors.toList())
                + " " + character.getItems().stream().map(Card::getBindingName).collect(Collectors.toList())
                + " " + player.getCardsInHand().stream().map(Card::getBindingName).collect(Collectors.toList())
                + " " + player.getDeckSize();
    }

    /** Ogni alterazione di un campo della carta, tranne quelli che la identificano, più togliere o scambiare passi. */
    private static List<JsonNode> mutants(JsonNode card) {
        List<JsonNode> result = new ArrayList<>();
        alter(card, card, new ArrayList<>(), result);
        return result;
    }

    private static void alter(JsonNode root, JsonNode node, List<Object> path, List<JsonNode> result) {
        if (node.isObject()) {
            node.fields().forEachRemaining(field -> {
                if (Set.of("binding", "kind", "boundTo", "op").contains(field.getKey())) return;
                if (node == root.get("cost")) {
                    ObjectNode mutant = root.deepCopy();
                    ObjectNode cost = (ObjectNode) mutant.get("cost");
                    JsonNode value = cost.remove(field.getKey());
                    cost.set(next(field.getKey()), value);
                    result.add(mutant);
                }
                List<Object> deeper = new ArrayList<>(path);
                deeper.add(field.getKey());
                alter(root, field.getValue(), deeper, result);
            });
        } else if (node.isArray()) {
            for (int i = 0; i < node.size(); i++) {
                List<Object> deeper = new ArrayList<>(path);
                deeper.add(i);
                if (node.get(i).isObject()) {
                    ObjectNode removed = root.deepCopy();
                    ((ArrayNode) locate(removed, path)).remove(i);
                    result.add(removed);
                    // Aggiungere uno stato non scrive righe e tocca solo i danni: spostarlo rispetto ad altro che non sia danno è equivalente.
                    if (i + 1 < node.size() && !independent(node.get(i), node.get(i + 1))) {
                        ObjectNode swapped = root.deepCopy();
                        ArrayNode steps = (ArrayNode) locate(swapped, path);
                        JsonNode first = steps.get(i);
                        steps.set(i, steps.get(i + 1));
                        steps.set(i + 1, first);
                        result.add(swapped);
                    }
                }
                alter(root, node.get(i), deeper, result);
            }
        } else {
            ObjectNode mutant = root.deepCopy();
            JsonNode parent = locate(mutant, path.subList(0, path.size() - 1));
            Object key = path.get(path.size() - 1);
            JsonNode changed = node.isBoolean() ? JSON.valueToTree(!node.asBoolean())
                    : node.isIntegralNumber() ? JSON.valueToTree(node.asInt() + 1)
                    : node.isNumber() ? JSON.valueToTree(node.asDouble() + 0.5)
                    : JSON.valueToTree(next(node.asText()));
            if (key instanceof Integer) ((ArrayNode) parent).set((Integer) key, changed);
            else ((ObjectNode) parent).set((String) key, changed);
            result.add(mutant);
        }
    }

    private static boolean independent(JsonNode first, JsonNode second) {
        String a = first.path("op").asText(), b = second.path("op").asText();
        return ("status".equals(a) && !"damage".equals(b)) || ("status".equals(b) && !"damage".equals(a));
    }

    private static JsonNode locate(JsonNode root, List<Object> path) {
        JsonNode node = root;
        for (Object key : path) node = key instanceof Integer ? node.get((Integer) key) : node.get((String) key);
        return node;
    }

    /** Il valore successivo se è un enumerato, altrimenti lo stesso testo con un carattere in più. */
    private static String next(String text) {
        for (Object[] values : new Object[][] {Resource.values(), Damage.DamageType.values(), StatusType.values(), StatusFlow.values(), Card.CardTarget.values()})
            for (int i = 0; i < values.length; i++)
                if (values[i].toString().equals(text)) return values[(i + 1) % values.length].toString();
        return text + "!";
    }

    private static Game copy(Game game) throws Exception {
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        try (ObjectOutputStream out = new ObjectOutputStream(bytes)) { out.writeObject(game); }
        try (ObjectInputStream in = new ObjectInputStream(new ByteArrayInputStream(bytes.toByteArray()))) {
            return (Game) in.readObject();
        }
    }
}
