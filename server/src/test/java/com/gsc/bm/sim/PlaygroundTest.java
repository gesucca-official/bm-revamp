package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.IntNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.bot.AggressivePolicy;
import com.gsc.bm.model.game.bot.BotPolicy;
import com.gsc.bm.model.game.bot.PrudentPolicy;
import com.gsc.bm.model.game.bot.RandomPolicy;
import com.gsc.bm.model.game.bot.ResourceAwarePolicy;
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
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

/** SB-6a: la bozza «attuale» gioca come il catalogo di oggi, i suoi numeri contano, le bozze errate si rifiutano. */
class PlaygroundTest {
    /** Semi per abbinamento: 25 coppie di stili × 4 coppie di personaggi × 4 = 400 partite. Più ampia con -Dsim.draftGames. */
    private static final int GAMES = Integer.getInteger("sim.draftGames", 4);
    private static final long FIRST_SEED = Long.getLong("sim.firstSeed", 0L);
    static final String SB9 = "/sb-6a/prova-sb9.json";
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final Map<String, String> DECK_OF = Map.of(SimulationCatalog.BRUISER, "starter-bruiser", SimulationCatalog.JUNKIE, "starter-junkie");
    private static final List<Match> MATCHES = new ArrayList<>();
    /** SHA-256 della traccia del catalogo per ogni partita: tiene poca memoria anche nella prova ampia. */
    private static final List<String> EXPECTED = new ArrayList<>();
    private static JsonNode current;
    private static SimulationCatalog CATALOG;
    private static CardScenarios SCENARIOS;

    /** Una partita della prova d'identità: personaggi, stili e seme. */
    private static final class Match {
        final String first, second, firstStyle, secondStyle;
        final long seed;

        Match(String first, String firstStyle, String second, String secondStyle, long seed) {
            this.first = first;
            this.firstStyle = firstStyle;
            this.second = second;
            this.secondStyle = secondStyle;
            this.seed = seed;
        }

        @Override public String toString() {
            return "seme " + seed + ", " + first + " (" + firstStyle + ") contro " + second + " (" + secondStyle + ")";
        }
    }

    /** I cinque modi di giocare: l'attuale ComPlayer (com) e i quattro stili di SB-4. */
    static Map<String, BotPolicy> styles() {
        Map<String, BotPolicy> styles = new LinkedHashMap<>();
        styles.put("com", null);
        styles.put("casuale", new RandomPolicy());
        styles.put("aggressivo", new AggressivePolicy());
        styles.put("prudente", new PrudentPolicy());
        styles.put("risorse", new ResourceAwarePolicy());
        return styles;
    }

    @BeforeAll static void baseline() throws Exception {
        try (InputStream input = Draft.class.getResourceAsStream(Draft.CURRENT)) { current = JSON.readTree(input); }
        List<String> characters = List.of(SimulationCatalog.BRUISER, SimulationCatalog.JUNKIE);
        for (String a : styles().keySet()) for (String b : styles().keySet())
            for (String first : characters) for (String second : characters)
                for (long seed = FIRST_SEED; seed < FIRST_SEED + GAMES; seed++) MATCHES.add(new Match(first, a, second, b, seed));
        CATALOG = new SimulationCatalog();
        SCENARIOS = new CardScenarios(CATALOG);
        SimulationRunner catalog = new SimulationRunner(CATALOG);
        for (Match match : MATCHES) EXPECTED.add(digest(trace(catalog, match, false)));
    }

    private static String trace(SimulationRunner runner, Match match, boolean draft) throws Exception {
        Map<String, BotPolicy> styles = styles();
        SimulationRunner.Contender a = new SimulationRunner.Contender(draft ? DECK_OF.get(match.first) : match.first, styles.get(match.firstStyle));
        SimulationRunner.Contender b = new SimulationRunner.Contender(draft ? DECK_OF.get(match.second) : match.second, styles.get(match.secondStyle));
        return runner.continueGame(runner.newGame(match.seed, a, b), match.seed, true, g -> { }).jsonl();
    }

    @Test void currentDraftPlaysExactlyLikeTheCatalog() throws Exception {
        assertTrue(MATCHES.size() >= 400, "Almeno 400 partite per esecuzione");
        Draft draft = Draft.fromClasspath(Draft.CURRENT);
        SimulationRunner runner = new SimulationRunner(draft);
        // Le partite dicono qualcosa solo se ogni carta dei mazzi è stata giocata almeno una volta. Le altre le prova il confronto carta per carta.
        Map<String, String> unplayed = new LinkedHashMap<>();
        for (String binding : draft.deckCards()) {
            Card card = draft.card(binding);
            unplayed.put(binding, card.isItem() ? "Grabbed and consumed Item " + card.getName() : "\"card\":\"" + card.getName() + "\"");
        }
        for (int i = 0; i < MATCHES.size(); i++) {
            String actual = trace(runner, MATCHES.get(i), true);
            if (!EXPECTED.get(i).equals(digest(actual))) {
                assertEquals(trace(new SimulationRunner(CATALOG), MATCHES.get(i), false), actual, MATCHES.get(i).toString());
                fail("Impronta diversa: " + MATCHES.get(i));
            }
            unplayed.values().removeIf(actual::contains);
        }
        assertEquals(Map.of(), unplayed, "Mai giocate in queste partite");
    }

    /** Carta per carta, anche quelle che nessun mazzo usa (BeggingMoney): campi e 200 scenari come la classe Java del catalogo. */
    @TestFactory Stream<DynamicTest> everyCardOfTheCurrentDraftMatchesTheCatalogCard() throws Exception {
        Draft draft = Draft.fromClasspath(Draft.CURRENT);
        assertEquals(CATALOG.bindings(), draft.cardBindings(), "La bozza attuale ha le carte del catalogo");
        return draft.cardBindings().stream().map(binding -> DynamicTest.dynamicTest(binding, () -> {
            assertEquals(gui(CATALOG.card(binding)), gui(draft.card(binding)), "Testi del catalogo: " + binding);
            assertEquals(null, SCENARIOS.difference(() -> CATALOG.card(binding), () -> draft.card(binding)), binding);
        }));
    }

    private static List<String> gui(Card any) {
        com.gsc.bm.model.cards.AbstractCard card = (com.gsc.bm.model.cards.AbstractCard) any;
        return java.util.Arrays.asList(card.getName(), card.getEffect(), card.getImage(), card.getSprite(), card.getRole(),
                card.getGains(), card.getDamage(), card.getDamageAmount());
    }

    /**
     * La prova serve solo se sa fallire: ogni numero delle carte Java e dei personaggi, alterato, deve cambiare almeno una partita.
     * Per le carte Java vale anche il confronto carta per carta, l'unico possibile per quelle che nessun mazzo usa.
     */
    @TestFactory Stream<DynamicTest> everyAlterationOfJavaCardsAndCharactersIsNoticed() {
        List<DynamicTest> tests = new ArrayList<>();
        for (Map.Entry<String, JsonNode> mutant : mutants().entrySet())
            tests.add(DynamicTest.dynamicTest(mutant.getKey(), () -> {
                Draft draft = Draft.parse("mutante " + mutant.getKey(), mutant.getValue());
                SimulationRunner runner = new SimulationRunner(draft);
                for (int i = 0; i < MATCHES.size(); i++)
                    if (!EXPECTED.get(i).equals(digest(trace(runner, MATCHES.get(i), true)))) return;
                String binding = mutant.getKey().split(" ")[0];
                if (!draft.deckCards().contains(binding) && draft.cardBindings().contains(binding)
                        && SCENARIOS.difference(() -> CATALOG.card(binding), () -> draft.card(binding)) != null) return;
                fail("Alterazione non notata in " + MATCHES.size() + " partite: " + mutant.getKey());
            }));
        assertTrue(tests.size() > 40, "Troppe poche alterazioni: " + tests.size());
        return tests.stream();
    }

    private static Map<String, JsonNode> mutants() {
        Map<String, JsonNode> result = new LinkedHashMap<>();
        for (JsonNode card : current.get("cards")) {
            if (!card.has("java")) continue;
            String binding = card.get("binding").asText();
            for (String group : List.of("cost", "params"))
                if (card.has(group)) card.get(group).fieldNames().forEachRemaining(name ->
                        result.put(binding + " " + group + "." + name, alter(c -> bump((ObjectNode) cardOf(c, binding).get(group), name))));
            if (card.has("priority")) result.put(binding + " priority", alter(c -> bump(cardOf(c, binding), "priority")));
        }
        for (JsonNode character : current.get("characters")) {
            String id = character.get("id").asText();
            character.get("resources").fieldNames().forEachRemaining(name ->
                    result.put(id + " resources." + name, alter(c -> bump((ObjectNode) characterOf(c, id).get("resources"), name))));
            result.put(id + " items", alter(c -> bump(characterOf(c, id), "items")));
            result.put(id + " immunities", alter(c -> {
                ArrayNode immunities = (ArrayNode) characterOf(c, id).get("immunities");
                if (immunities.isEmpty()) immunities.add("ALCOHOL");
                else immunities.removeAll();
            }));
        }
        return result;
    }

    /** Un valore ripreso dal file, cambiato: senza ricompilare, l'esito cambia. Si sceglie la copia con -Dsim.draft, come al lancio. */
    @Test void changingANumberInACopyChangesTheOutcomeWithoutRecompiling() throws Exception {
        Draft original = Draft.selected();
        assertTrue(original.source.endsWith(Draft.CURRENT), "Senza -Dsim.draft vale la bozza attuale: " + original.source);
        int[] base = bruiserWins(original);
        int[] harder = bruiserWins(selectCopy(c -> ((ObjectNode) cardOf(c, "bruiser.SuperImpact").get("target").get(0)).put("amount", 400)));
        assertTrue(harder[0] > base[0], "SuperImpact da 400: Bruiser vince " + harder[0] + " volte invece di " + base[0]);
        int[] poisoned = bruiserWins(selectCopy(c -> ((ObjectNode) cardOf(c, "com.items.MarvelousCocktail").get("params")).put("poison", 200)));
        assertTrue(poisoned[1] < base[1], "Veleno di MarvelousCocktail a 200: Junkie vince " + poisoned[1] + " volte invece di " + base[1]);
    }

    private static Draft selectCopy(Consumer<ObjectNode> change) throws Exception {
        Path copy = Files.createTempFile(SimulationCatalog.outputDirectory(), "sb-6a-copia-", ".json");
        try {
            Files.writeString(copy, JSON.writerWithDefaultPrettyPrinter().writeValueAsString(alter(change)), StandardCharsets.UTF_8);
            System.setProperty("sim.draft", copy.toString());
            Draft draft = Draft.selected();
            assertEquals(copy.toString(), draft.source);
            return draft;
        } finally {
            System.clearProperty("sim.draft");
            Files.deleteIfExists(copy);
        }
    }

    /** Bruiser aggressivo contro Junkie aggressivo, 100 partite a posti alternati: vittorie di Bruiser e di Junkie. */
    private static int[] bruiserWins(Draft draft) throws Exception {
        SimulationRunner runner = new SimulationRunner(draft);
        int[] wins = new int[2];
        for (long seed = 0; seed < 100; seed++) {
            boolean bruiserFirst = seed % 2 == 0;
            SimulationRunner.Contender b = new SimulationRunner.Contender("starter-bruiser", new AggressivePolicy());
            SimulationRunner.Contender j = new SimulationRunner.Contender("starter-junkie", new AggressivePolicy());
            SimulationRunner.Outcome outcome = runner.run(seed, bruiserFirst ? b : j, bruiserFirst ? j : b).outcome;
            if (outcome == SimulationRunner.Outcome.FIRST_WIN) wins[bruiserFirst ? 0 : 1]++;
            else if (outcome == SimulationRunner.Outcome.SECOND_WIN) wins[bruiserFirst ? 1 : 0]++;
        }
        return wins;
    }

    @TestFactory Stream<DynamicTest> badDraftsAreRefusedWithFileCardAndField() {
        Map<String, Object[]> cases = new LinkedHashMap<>();
        cases.put("campo sconosciuto in testa", new Object[] {(Consumer<ObjectNode>) c -> c.put("sets", 1), "bozza", "sets"});
        cases.put("formato diverso", new Object[] {(Consumer<ObjectNode>) c -> c.put("format", "sb-6b/1"), "format", "sb-6b/1"});
        cases.put("rules mancante", new Object[] {(Consumer<ObjectNode>) c -> c.remove("rules"), "rules", "mancante"});
        cases.put("rules: campo sconosciuto", new Object[] {(Consumer<ObjectNode>) c -> ((ObjectNode) c.get("rules")).put("handSize", 6), "rules", "handSize"});
        cases.put("rules: dimensione non intera", new Object[] {(Consumer<ObjectNode>) c -> ((ObjectNode) c.get("rules")).put("deckSize", 20.5), "rules", "deckSize", "intero"});
        cases.put("rules: last resort facoltativa", new Object[] {(Consumer<ObjectNode>) c -> ((ObjectNode) c.get("rules")).put("lastResortRequired", false), "rules", "lastResortRequired"});
        cases.put("rules: troppe bound per la mano", new Object[] {(Consumer<ObjectNode>) c -> ((ObjectNode) c.get("rules")).put("boundChoices", 5), "rules", "boundChoices"});
        cases.put("carta a dati: campo sconosciuto", new Object[] {(Consumer<ObjectNode>) c -> cardOf(c, "bruiser.SuperImpact").put("rarity", "rara"), "carta bruiser.SuperImpact", "rarity"});
        cases.put("passo: campo mancante", new Object[] {(Consumer<ObjectNode>) c -> ((ObjectNode) cardOf(c, "bruiser.SuperImpact").get("target").get(0)).remove("amount"), "carta bruiser.SuperImpact", "target[0]", "amount"});
        cases.put("passo: campo sconosciuto", new Object[] {(Consumer<ObjectNode>) c -> ((ObjectNode) cardOf(c, "bruiser.SuperImpact").get("target").get(0)).put("crit", 2), "carta bruiser.SuperImpact", "target[0]", "crit"});
        cases.put("passo: stato senza durata", new Object[] {(Consumer<ObjectNode>) c -> ((ObjectNode) cardOf(c, "bruiser.MadeOfStone").get("self").get(0)).remove("turns"), "carta bruiser.MadeOfStone", "self[0]", "turns"});
        cases.put("passo: base mancante", new Object[] {(Consumer<ObjectNode>) c -> ((ObjectNode) cardOf(c, "bruiser.ExtremelyViolentBlow").get("target").get(0).get("amount")).remove("base"), "carta bruiser.ExtremelyViolentBlow", "amount.base"});
        cases.put("passo: divisione per zero", new Object[] {(Consumer<ObjectNode>) c -> ((ObjectNode) cardOf(c, "bruiser.ExtremelyViolentBlow").get("target").get(0).get("amount")).put("divide", 0), "carta bruiser.ExtremelyViolentBlow", "divide"});
        cases.put("passo sconosciuto", new Object[] {(Consumer<ObjectNode>) c -> ((ObjectNode) cardOf(c, "bruiser.SuperImpact").get("target").get(0)).put("op", "explode"), "carta bruiser.SuperImpact", "explode"});
        cases.put("gui mancante", new Object[] {(Consumer<ObjectNode>) c -> cardOf(c, "bruiser.SuperImpact").remove("gui"), "carta bruiser.SuperImpact", "gui"});
        cases.put("gui: nome mancante", new Object[] {(Consumer<ObjectNode>) c -> ((ObjectNode) cardOf(c, "com.Grab").get("gui")).remove("name"), "carta com.Grab", "gui", "name"});
        cases.put("nomi uguali", new Object[] {(Consumer<ObjectNode>) c -> ((ObjectNode) cardOf(c, "com.Grab").get("gui")).put("name", "fai basta"), "gui.name", "bruiser.YouStop"});
        cases.put("java: classe sconosciuta", new Object[] {(Consumer<ObjectNode>) c -> cardOf(c, "com.Grab").put("binding", "com.Grabbo"), "carta com.Grabbo", "classe"});
        cases.put("java: parametro sconosciuto", new Object[] {(Consumer<ObjectNode>) c -> ((ObjectNode) cardOf(c, "bruiser.YouStop").get("params")).put("alertness", 10), "carta bruiser.YouStop", "params.alertness", "alertnessToTarget"});
        cases.put("java: parametro mancante", new Object[] {(Consumer<ObjectNode>) c -> ((ObjectNode) cardOf(c, "junkie.LethalHeroinDose").get("params")).remove("threshold"), "carta junkie.LethalHeroinDose", "params.threshold"});
        cases.put("java: parametro testuale", new Object[] {(Consumer<ObjectNode>) c -> ((ObjectNode) cardOf(c, "bruiser.YouStop").get("params")).put("alertnessToTarget", "10"), "carta bruiser.YouStop", "params.alertnessToTarget", "intero"});
        cases.put("java: parametro decimale", new Object[] {(Consumer<ObjectNode>) c -> ((ObjectNode) cardOf(c, "com.items.MarvelousCocktail").get("params")).put("turns", 1.5), "carta com.items.MarvelousCocktail", "params.turns", "intero"});
        cases.put("java: params mancante", new Object[] {(Consumer<ObjectNode>) c -> cardOf(c, "com.Grab").remove("params"), "carta com.Grab", "params"});
        cases.put("java: campo a dati", new Object[] {(Consumer<ObjectNode>) c -> cardOf(c, "com.Grab").set("targets", JSON.createArrayNode().add("SELF")), "carta com.Grab", "targets"});
        cases.put("java: costo mancante", new Object[] {(Consumer<ObjectNode>) c -> cardOf(c, "com.Steal").remove("cost"), "carta com.Steal", "cost"});
        cases.put("java: risorsa sconosciuta", new Object[] {(Consumer<ObjectNode>) c -> ((ObjectNode) cardOf(c, "com.Steal").get("cost")).put("MONEY", 1), "carta com.Steal", "MONEY"});
        cases.put("java: oggetto con priorità", new Object[] {(Consumer<ObjectNode>) c -> cardOf(c, "com.items.MarvelousCocktail").put("priority", 2), "carta com.items.MarvelousCocktail", "priority"});
        cases.put("bound che bersaglia oggetti", new Object[] {(Consumer<ObjectNode>) c -> cardOf(c, "bruiser.character.LittleSmack").set("targets", JSON.createArrayNode().add("FAR_ITEM")), "carta bruiser.character.LittleSmack", "bound", "oggetti"});
        cases.put("bound di un personaggio assente", new Object[] {(Consumer<ObjectNode>) c -> cardOf(c, "bruiser.character.LittleSmack").put("boundTo", "nessuno"), "carta bruiser.character.LittleSmack", "nessuno"});
        cases.put("last resort con un costo", new Object[] {(Consumer<ObjectNode>) c -> cardOf(c, "com.last.Struggle").set("cost", JSON.createObjectNode().put("VIOLENCE", 1)), "carta com.last.Struggle", "last resort", "costo"});
        cases.put("exclusiveTo su una carta regolare", new Object[] {(Consumer<ObjectNode>) c -> cardOf(c, "com.Grab").put("exclusiveTo", "junkie.character.ToxicJunkie"), "carta com.Grab", "exclusiveTo"});
        cases.put("personaggio: HEALTH mancante", new Object[] {(Consumer<ObjectNode>) c -> ((ObjectNode) characterOf(c, SimulationCatalog.BRUISER).get("resources")).remove("HEALTH"), "personaggio " + SimulationCatalog.BRUISER, "HEALTH"});
        cases.put("personaggio: capacità zero", new Object[] {(Consumer<ObjectNode>) c -> characterOf(c, SimulationCatalog.BRUISER).put("items", 0), "personaggio " + SimulationCatalog.BRUISER, "items"});
        cases.put("personaggio: immunità sconosciuta", new Object[] {(Consumer<ObjectNode>) c -> ((ArrayNode) characterOf(c, SimulationCatalog.JUNKIE).get("immunities")).add("BOOZE"), "personaggio " + SimulationCatalog.JUNKIE, "BOOZE"});
        cases.put("personaggio: basic non basic", new Object[] {(Consumer<ObjectNode>) c -> characterOf(c, SimulationCatalog.BRUISER).put("basic", "com.Grab"), "personaggio " + SimulationCatalog.BRUISER, "basic", "com.Grab"});
        cases.put("mazzo da 19", new Object[] {(Consumer<ObjectNode>) c -> ((ObjectNode) deckOf(c, "starter-bruiser").get("cards")).put("bruiser.Glare", 1), "mazzo starter-bruiser", "19", "20"});
        cases.put("mazzo da 21", new Object[] {(Consumer<ObjectNode>) c -> ((ObjectNode) deckOf(c, "starter-bruiser").get("cards")).put("com.Grab", 1), "mazzo starter-bruiser", "21", "20"});
        cases.put("terza copia", new Object[] {(Consumer<ObjectNode>) c -> {
            ObjectNode cards = (ObjectNode) deckOf(c, "starter-bruiser").get("cards");
            cards.remove("bruiser.SuperImpact");
            cards.put("bruiser.Glare", 3);
        }, "mazzo starter-bruiser", "bruiser.Glare", "3"});
        cases.put("bound altrui", new Object[] {(Consumer<ObjectNode>) c -> ((ArrayNode) deckOf(c, "starter-bruiser").get("bound")).set(0, TextNode.valueOf("junkie.character.RottenSmile")), "mazzo starter-bruiser", "junkie.character.RottenSmile"});
        cases.put("bound ripetuta", new Object[] {(Consumer<ObjectNode>) c -> ((ArrayNode) deckOf(c, "starter-bruiser").get("bound")).set(1, TextNode.valueOf("bruiser.character.LittleSmack")), "mazzo starter-bruiser", "ripetuta"});
        cases.put("una bound sola", new Object[] {(Consumer<ObjectNode>) c -> ((ArrayNode) deckOf(c, "starter-bruiser").get("bound")).remove(1), "mazzo starter-bruiser", "bound sono 1"});
        cases.put("basic altrui", new Object[] {(Consumer<ObjectNode>) c -> deckOf(c, "starter-bruiser").put("basic", "com.basic.ToxicGrab"), "mazzo starter-bruiser", "com.basic.ToxicGrab"});
        cases.put("senza last resort", new Object[] {(Consumer<ObjectNode>) c -> deckOf(c, "starter-bruiser").remove("lastResort"), "mazzo starter-bruiser", "lastResort"});
        cases.put("last resort che non lo è", new Object[] {(Consumer<ObjectNode>) c -> deckOf(c, "starter-bruiser").put("lastResort", "bruiser.SuperImpact"), "mazzo starter-bruiser", "bruiser.SuperImpact"});
        cases.put("bound fra le regolari", new Object[] {(Consumer<ObjectNode>) c -> {
            ObjectNode cards = (ObjectNode) deckOf(c, "starter-bruiser").get("cards");
            cards.remove("bruiser.SuperImpact");
            cards.put("bruiser.character.LittleRage", 1);
        }, "mazzo starter-bruiser", "bruiser.character.LittleRage"});
        cases.put("carta sconosciuta nel mazzo", new Object[] {(Consumer<ObjectNode>) c -> {
            ObjectNode cards = (ObjectNode) deckOf(c, "starter-bruiser").get("cards");
            cards.remove("bruiser.SuperImpact");
            cards.put("bruiser.MegaImpact", 1);
        }, "mazzo starter-bruiser", "bruiser.MegaImpact"});
        cases.put("mazzo di un personaggio assente", new Object[] {(Consumer<ObjectNode>) c -> deckOf(c, "starter-bruiser").put("character", "nessuno"), "mazzo starter-bruiser", "nessuno"});
        List<DynamicTest> tests = new ArrayList<>();
        for (Map.Entry<String, Object[]> entry : cases.entrySet())
            tests.add(DynamicTest.dynamicTest(entry.getKey(), () -> {
                @SuppressWarnings("unchecked") Consumer<ObjectNode> change = (Consumer<ObjectNode>) entry.getValue()[0];
                Draft.Invalid error = assertThrows(Draft.Invalid.class, () -> Draft.parse("bozza-errata.json", alter(change)));
                assertTrue(error.getMessage().startsWith("bozza-errata.json: "), error.getMessage());
                for (int i = 1; i < entry.getValue().length; i++)
                    assertTrue(error.getMessage().contains((String) entry.getValue()[i]), "Manca «" + entry.getValue()[i] + "» in: " + error.getMessage());
            }));
        tests.add(DynamicTest.dynamicTest("file assente", () -> {
            Draft.Invalid error = assertThrows(Draft.Invalid.class, () -> Draft.fromFile(Path.of("tmp/sim/nessuna-bozza.json")));
            assertTrue(error.getMessage().contains("nessuna-bozza.json"), error.getMessage());
        }));
        return tests.stream();
    }

    /** Valori iniziali di SB-9 per Mara e Rocco, con carte di prova: solo test, non è il set. */
    @Test void sb9DraftWithMaraAndRoccoCompletesGames() throws Exception {
        Draft draft = Draft.fromClasspath(SB9);
        SimulationRunner runner = new SimulationRunner(draft);
        List<String> decks = List.of("prova-mara", "prova-rocco");
        Map<String, BotPolicy> styles = styles();
        int games = 0;
        StringBuilder all = new StringBuilder();
        for (String a : styles.keySet()) for (String b : styles.keySet()) for (String first : decks) for (String second : decks)
            for (long seed = 0; seed < 2; seed++) {
                SimulationRunner.Result result = runner.continueGame(runner.newGame(seed, new SimulationRunner.Contender(first, styles.get(a)),
                        new SimulationRunner.Contender(second, styles.get(b))), seed, true, g -> { });
                String where = "seme " + seed + ", " + first + " (" + a + ") contro " + second + " (" + b + ")";
                assertNotEquals(SimulationRunner.Outcome.TURN_LIMIT, result.outcome, where);
                assertEquals(0, result.emptyMoves, "Mosse vuote: " + where);
                all.append(result.jsonl());
                games++;
            }
        assertEquals(200, games);
        String traces = all.toString();
        Map<Resource, Integer> start = draft.player("prova-rocco", "x", new java.util.Random(0), null).getCharacter().getResources();
        assertEquals(Map.of(Resource.HEALTH, 130, Resource.ALERTNESS, 15, Resource.VIOLENCE, 0, Resource.TOXICITY, 0, Resource.ALCOHOL, 0), start);
        for (String binding : List.of("prova.rocco.ColpoPagato", "prova.rocco.Contrattacco", "prova.rocco.PorgiLAltraGuancia", "prova.mara.TaglioRapido"))
            assertTrue(traces.contains("\"card\":\"" + draft.card(binding).getName() + "\""), "Mai giocata: " + binding);
    }

    /** Il costo in HEALTH si presenta solo con salute sufficiente (D27): lo dice il motore, non la bozza. */
    @Test void healthCostNeedsEnoughHealth() throws Exception {
        Draft draft = Draft.fromClasspath(SB9);
        com.gsc.bm.model.game.Player rocco = draft.player("prova-rocco", "seat-1", new java.util.Random(1), null);
        com.gsc.bm.model.game.Player mara = draft.player("prova-mara", "seat-2", new java.util.Random(2), null);
        Game game = new Game(List.of(rocco, mara), "sim", false);
        Card paid = draft.card("prova.rocco.ColpoPagato");
        rocco.getCardsInHand().add(paid);
        com.gsc.bm.model.game.Move move = new com.gsc.bm.model.game.Move(paid.getName(), "seat-1", "seat-2", game.getGameId(), Map.of());
        rocco.getCharacter().getResources().put(Resource.HEALTH, 14);
        assertThrows(com.gsc.bm.model.game.IllegalMoveException.class, () -> game.submitMove(move));
        rocco.getCharacter().getResources().put(Resource.HEALTH, 15);
        game.submitMove(move);
        game.resolveMoves(g -> { }, (turn, events) -> events.clear());
        assertTrue(rocco.getCharacter().isDead(), "Pagare tutta la salute uccide");
        assertTrue(game.getResolvedMoves().stream().anyMatch(m -> m.getPlayerId().equals("seat-1")
                && !m.getMoveReport().getOrDefault(Card.CardTarget.OPPONENT, List.of()).isEmpty()), "La mossa prosegue (R04)");
    }

    @Test void draftGamesSurviveACopy() throws Exception {
        for (String resource : List.of(Draft.CURRENT, SB9)) {
            Draft draft = Draft.fromClasspath(resource);
            List<String> decks = new ArrayList<>(draft.deckIds());
            SimulationRunner runner = new SimulationRunner(draft);
            for (long seed = 0; seed < 10; seed++) {
                SimulationRunner.Contender a = new SimulationRunner.Contender(decks.get(0), null);
                SimulationRunner.Contender b = new SimulationRunner.Contender(decks.get(1), new ResourceAwarePolicy());
                int midpoint = Math.max(1, runner.run(seed, a, b).turns / 2);
                Game[] snapshot = new Game[1];
                SimulationRunner.Result original = runner.continueGame(runner.newGame(seed, a, b), seed, true, state -> {
                    if (state.getTurn() == midpoint) {
                        try { snapshot[0] = copy(state); } catch (Exception e) { throw new IllegalStateException(e); }
                    }
                });
                assertFalse(snapshot[0] == null, resource + ", seme " + seed);
                SimulationRunner.Result resumed = runner.continueGame(snapshot[0], seed, true, state -> { });
                assertEquals(original.trace.subList(midpoint, original.trace.size()), resumed.trace, resource + ", seme " + seed);
            }
        }
    }

    // ---- strumenti ----

    private static String digest(String trace) throws Exception {
        StringBuilder hex = new StringBuilder();
        for (byte b : java.security.MessageDigest.getInstance("SHA-256").digest(trace.getBytes(StandardCharsets.UTF_8)))
            hex.append(String.format("%02x", b));
        return hex.toString();
    }

    private static JsonNode alter(Consumer<ObjectNode> change) {
        ObjectNode copy = current.deepCopy();
        change.accept(copy);
        return copy;
    }

    private static void bump(ObjectNode node, String field) {
        node.set(field, IntNode.valueOf(node.get(field).asInt() + 1));
    }

    private static ObjectNode cardOf(ObjectNode root, String binding) {
        for (JsonNode card : root.get("cards")) if (card.get("binding").asText().equals(binding)) return (ObjectNode) card;
        throw new IllegalArgumentException(binding);
    }

    private static ObjectNode characterOf(ObjectNode root, String id) {
        for (JsonNode character : root.get("characters")) if (character.get("id").asText().equals(id)) return (ObjectNode) character;
        throw new IllegalArgumentException(id);
    }

    private static ObjectNode deckOf(ObjectNode root, String id) {
        for (JsonNode deck : root.get("decks")) if (deck.get("id").asText().equals(id)) return (ObjectNode) deck;
        throw new IllegalArgumentException(id);
    }

    private static Game copy(Game game) throws Exception {
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        try (ObjectOutputStream out = new ObjectOutputStream(bytes)) { out.writeObject(game); }
        try (ObjectInputStream in = new ObjectInputStream(new ByteArrayInputStream(bytes.toByteArray()))) {
            return (Game) in.readObject();
        }
    }
}
