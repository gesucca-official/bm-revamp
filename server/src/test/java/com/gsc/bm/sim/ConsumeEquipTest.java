package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.com.tokens.BrokenBeerBottle;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.bot.AggressivePolicy;
import com.gsc.bm.model.game.bot.BotPolicy;
import com.gsc.bm.model.game.bot.ResourceAwarePolicy;
import com.gsc.bm.model.game.status.Status;
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
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * SB-11a: le carte scritte con i passi consume ed equip coincidono con le classi Java che sostituiscono (Grab, BruiserGrab, ToxicGrab e
 * il token BrokenBeerBottle): stessi campi, stesse righe di rapporto, stesso stato finale, partite intere identiche, copie a metà partita.
 * I casi che il set di oggi non copre (equip in entrata, uso singolo senza conversione, BadEducation, scadenza) stanno in
 * {@link ConsumeEquipStatesTest}; il rifiuto delle definizioni errate in {@link ConsumeEquipValidationTest}.
 */
class ConsumeEquipTest {
    /** Semi per abbinamento: 25 coppie di stili × 4 coppie di personaggi × 4 = 400 partite. Più ampia con -Dsim.consumeGames. */
    private static final int GAMES = Integer.getInteger("sim.consumeGames", 4);
    private static final long FIRST_SEED = Long.getLong("sim.firstSeed", 0L);
    private static final Map<String, String> DECK_OF = Map.of(SimulationCatalog.BRUISER, "starter-bruiser", SimulationCatalog.JUNKIE, "starter-junkie");
    private static SimulationCatalog java;
    private static CardScenarios scenarios, withItems;
    private static ArrayNode raw;
    private static DataCards data;

    @BeforeAll static void load() throws Exception {
        java = new SimulationCatalog();
        scenarios = new CardScenarios(java);
        withItems = scenarios.withItems();
        raw = ConsumeEquipFixtures.read(ConsumeEquipFixtures.CARDS);
        data = DataCards.parse(raw);
    }

    // ---- carta per carta ----

    /** Le tre prese di oggetti, con oggetti presenti, assenti e spariti, e il token: come le classi Java su 200 stati casuali. */
    @TestFactory Stream<DynamicTest> everyConvertedCardMatchesItsJavaClass() {
        List<DynamicTest> tests = new ArrayList<>();
        for (String binding : ConsumeEquipFixtures.GRABS) {
            tests.add(DynamicTest.dynamicTest(binding + ", senza oggetti sul campo", () -> assertEquals(null, difference(scenarios, binding, data), binding)));
            tests.add(DynamicTest.dynamicTest(binding + ", con oggetti presenti, assenti e spariti", () -> {
                assertEquals(null, difference(withItems, binding, data), binding);
                assertEquals(gui(java.card(binding)), gui(java.dress(binding, data.create(binding))), "Il vestito del catalogo non cambia i campi");
            }));
        }
        tests.add(DynamicTest.dynamicTest(ConsumeEquipFixtures.TOKEN, () -> assertEquals(null, tokenDifference(scenarios, data), "token")));
        return tests.stream();
    }

    private static List<String> gui(Card card) {
        return List.of(card.getName(), card.getBindingName(), String.valueOf(card.isBasicAction()));
    }

    /** La prova serve solo se gli scenari con oggetti toccano davvero i tre casi: presente, assente e sparito. */
    @Test void itemScenariosCoverPresentAbsentAndVanishedItems() throws Exception {
        int consumed = 0, couldNot = 0, vanished = 0, present = 0;
        for (long seed = 0; seed < CardScenarios.SCENARIOS; seed++) {
            String outcome = withItems.outcome(java.card("com.basic.BruiserGrab"), seed);
            boolean took = outcome.contains("Grabbed and consumed Item"), refused = outcome.contains("Couldn't Grab that Item!");
            assertTrue(took ^ refused, "Una presa riesce oppure no: " + outcome);
            if (took) consumed++;
            if (refused) couldNot++;
            if (seed % 4 == 2) {
                vanished++;
                assertTrue(refused, "Sparito fra la scelta e la risoluzione: " + outcome);
            } else if (seed % 4 != 1) {
                present++;
                assertTrue(took, "Presente sul campo: " + outcome);
            } else assertTrue(refused, "Scelto ma assente: " + outcome);
        }
        assertEquals(CardScenarios.SCENARIOS, consumed + couldNot);
        assertTrue(present >= 100 && vanished >= 50 && couldNot >= 100, present + " presenti, " + vanished + " spariti, " + couldNot + " rifiutati");
    }

    private static String difference(CardScenarios scenarios, String binding, DataCards source) throws Exception {
        return scenarios.difference(() -> java.card(binding), () -> java.dress(binding, source.create(binding)));
    }

    /** Il token non è nel catalogo: la carta Java è la classe, senza testi; il confronto non guarda i nomi. */
    private static String tokenDifference(CardScenarios scenarios, DataCards source) throws Exception {
        return scenarios.difference(BrokenBeerBottle::new, () -> source.create(ConsumeEquipFixtures.TOKEN));
    }

    // ---- il confronto sa fallire ----

    /** Ogni numero, enumerato, testo e campo alterato o tolto, ogni passo tolto o scambiato: o la carta è rifiutata, o il confronto se ne accorge. */
    @TestFactory Stream<DynamicTest> everyAlterationIsCaught() {
        List<DynamicTest> tests = new ArrayList<>();
        for (JsonNode card : raw) {
            String binding = card.get("binding").asText();
            List<JsonNode> mutants = ConsumeEquipFixtures.mutants(card);
            tests.add(DynamicTest.dynamicTest(binding + " (" + mutants.size() + " alterazioni)", () -> {
                assertFalse(mutants.isEmpty());
                int refused = 0;
                for (JsonNode mutant : mutants) {
                    DataCards altered;
                    try {
                        altered = DataCards.parse(ConsumeEquipFixtures.JSON.createArrayNode().add(mutant));
                    } catch (Exception rejected) {
                        refused++; // Rifiutata alla lettura: l'alterazione è notata prima ancora di giocare.
                        continue;
                    }
                    String difference = binding.equals(ConsumeEquipFixtures.TOKEN) ? tokenDifference(scenarios, altered)
                            : difference(withItems, binding, altered);
                    assertNotNull(difference, "Alterazione non notata: " + mutant);
                }
                assertTrue(refused < mutants.size(), "Nessuna alterazione ha raggiunto il confronto: " + binding);
            }));
        }
        return tests.stream();
    }

    // ---- partite intere ----

    /**
     * La bozza «attuale» con Grab, BruiserGrab e ToxicGrab a dati gioca partite identiche, evento per evento, a quella di SB-6a.
     * Ogni carta convertita viene giocata almeno una volta.
     */
    @Test void convertedCurrentDraftPlaysExactlyLikeSb6a() throws Exception {
        Draft expected = Draft.fromClasspath(Draft.CURRENT);
        Draft converted = Draft.parse("attuale con consume", ConsumeEquipFixtures.convertedCurrent());
        List<Match> matches = matches();
        assertTrue(matches.size() >= 400, "Almeno 400 partite per esecuzione");
        Map<String, String> unplayed = new java.util.LinkedHashMap<>();
        for (String binding : ConsumeEquipFixtures.GRABS) unplayed.put(binding, "\"card\":\"" + converted.card(binding).getName() + "\"");
        int consumed = 0;
        for (Match match : matches) {
            String before = trace(new SimulationRunner(expected), match), after = trace(new SimulationRunner(converted), match);
            assertEquals(before, after, match.toString());
            unplayed.values().removeIf(after::contains);
            if (after.contains("Grabbed and consumed Item")) consumed++;
        }
        assertEquals(Map.of(), unplayed, "Mai giocate in queste partite");
        assertTrue(consumed > 100, "Poche partite con una presa riuscita: " + consumed);
    }

    /**
     * Il token a dati, con il passo equip, in un mazzo per parte: partite identiche a quelle col token Java. Gli equip sono davvero in
     * gioco: il token si consuma e BadEducation toglie stati equipaggiamento.
     */
    @Test void dataTokenPlaysExactlyLikeTheJavaToken() throws Exception {
        Draft javaToken = Draft.parse("attuale con token Java", ConsumeEquipFixtures.withToken(false));
        Draft dataToken = Draft.parse("attuale con token a dati", ConsumeEquipFixtures.withToken(true));
        List<Match> matches = matches();
        int equipped = 0, removed = 0;
        for (Match match : matches) {
            String before = trace(new SimulationRunner(javaToken), match), after = trace(new SimulationRunner(dataToken), match);
            assertEquals(before, after, match.toString());
            if (after.contains("Equipped status: BROKEN BEER")) equipped++;
            if (after.contains("Removed BROKEN BEER status!")) removed++;
        }
        assertTrue(equipped > 50, "Il token si consuma in poche partite: " + equipped);
        assertTrue(removed > 0, "BadEducation non ha mai tolto l'equip del token a dati");
    }

    /** I passi nuovi si serializzano: la copia presa quando un equip è in gioco ha lo stesso seguito. */
    @Test void gamesWithNewStepsSurviveACopy() throws Exception {
        SimulationRunner runner = new SimulationRunner(Draft.parse("attuale con token a dati", ConsumeEquipFixtures.withToken(true)));
        int copies = 0;
        for (long seed = 0; seed < 60; seed++) {
            SimulationRunner.Contender a = new SimulationRunner.Contender("starter-bruiser", seed % 2 == 0 ? null : new AggressivePolicy());
            SimulationRunner.Contender b = new SimulationRunner.Contender("starter-junkie", seed % 3 == 0 ? null : new ResourceAwarePolicy());
            Game[] snapshot = new Game[1];
            int[] turn = new int[1];
            SimulationRunner.Result original = runner.continueGame(runner.newGame(seed, a, b), seed, true, state -> {
                if (snapshot[0] == null && !state.isOver() && state.getPlayers().values().stream().anyMatch(p -> p.getCharacter().getStatuses().stream().anyMatch(Status::isEquip))) {
                    try { snapshot[0] = copy(state); } catch (Exception e) { throw new IllegalStateException(e); }
                    turn[0] = state.getTurn();
                }
            });
            if (snapshot[0] == null) continue;
            copies++;
            SimulationRunner.Result resumed = runner.continueGame(snapshot[0], seed, true, state -> { });
            assertEquals(original.trace.subList(turn[0], original.trace.size()), resumed.trace, "Seme " + seed);
        }
        assertTrue(copies >= 5, "Copie con un equip in gioco: " + copies);
    }

    // ---- il conteggio di SB-5, aggiornato ----

    /** Ogni carta del catalogo è a dati (SB-5 o SB-11a) oppure in Java con un motivo, mai entrambe; il conto è 23 a dati e 14 in Java. */
    @Test void everyCatalogCardIsClassifiedAfterSb11a() throws Exception {
        Set<String> sb5 = DataCards.load().bindings(), sb11a = new TreeSet<>(data.bindings());
        sb11a.remove(ConsumeEquipFixtures.TOKEN); // il token non è nel catalogo
        assertEquals(new TreeSet<>(ConsumeEquipFixtures.GRABS), sb11a, "Le carte rese dati da SB-11a");
        Map<String, String[]> javaCards = new HashMap<>();
        try (InputStream input = ConsumeEquipTest.class.getResourceAsStream(ConsumeEquipFixtures.JAVA)) {
            List<String> lines = List.of(new String(Objects.requireNonNull(input).readAllBytes(), StandardCharsets.UTF_8).split("\\R"));
            for (String line : lines.subList(1, lines.size())) {
                String[] fields = line.split("\t", -1);
                assertEquals(3, fields.length, line);
                assertFalse(fields[1].isBlank(), "Motivo mancante: " + line);
                assertEquals(null, javaCards.put(fields[0], fields), "Ripetuta: " + fields[0]);
            }
        }
        Set<String> catalog = java.bindings();
        Set<String> dataCards = new HashSet<>(sb5);
        dataCards.addAll(sb11a);
        Set<String> both = new HashSet<>(javaCards.keySet());
        both.retainAll(dataCards);
        assertEquals(Set.of(), both, "A dati e in Java insieme");
        Set<String> unknown = new HashSet<>(javaCards.keySet());
        unknown.addAll(dataCards);
        unknown.removeAll(catalog);
        assertEquals(Set.of(), unknown, "Fuori catalogo");
        Set<String> missing = new TreeSet<>(catalog);
        missing.removeAll(javaCards.keySet());
        missing.removeAll(dataCards);
        assertEquals(Set.of(), missing, "Non classificate");
        assertEquals(37, catalog.size());
        assertEquals(23, dataCards.size());
        assertEquals(14, javaCards.size());
    }

    // ---- strumenti ----

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

    private static List<Match> matches() {
        List<Match> matches = new ArrayList<>();
        List<String> characters = List.of(SimulationCatalog.BRUISER, SimulationCatalog.JUNKIE);
        for (String a : PlaygroundTest.styles().keySet()) for (String b : PlaygroundTest.styles().keySet())
            for (String first : characters) for (String second : characters)
                for (long seed = FIRST_SEED; seed < FIRST_SEED + GAMES; seed++) matches.add(new Match(first, a, second, b, seed));
        return matches;
    }

    private static String trace(SimulationRunner runner, Match match) throws Exception {
        Map<String, BotPolicy> styles = PlaygroundTest.styles();
        SimulationRunner.Contender a = new SimulationRunner.Contender(DECK_OF.get(match.first), styles.get(match.firstStyle));
        SimulationRunner.Contender b = new SimulationRunner.Contender(DECK_OF.get(match.second), styles.get(match.secondStyle));
        return runner.continueGame(runner.newGame(match.seed, a, b), match.seed, true, g -> { }).jsonl();
    }

    static Game copy(Game game) throws Exception {
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        try (ObjectOutputStream out = new ObjectOutputStream(bytes)) { out.writeObject(game); }
        try (ObjectInputStream in = new ObjectInputStream(new ByteArrayInputStream(bytes.toByteArray()))) {
            return (Game) in.readObject();
        }
    }
}
