package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.mini.RintoccoDiCampana;
import com.gsc.bm.model.game.bot.AggressivePolicy;
import com.gsc.bm.model.game.bot.BotPolicy;
import com.gsc.bm.model.game.bot.ResourceAwarePolicy;
import org.junit.jupiter.api.DynamicTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestFactory;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.function.Consumer;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * SB-6b: più set insieme e mini-espansione di prova. La mini si carica col set di oggi (bozza «attuale») e con la bozza del
 * Set Base; le partite fra mazzi di base restano identiche; le bozze composte errate si rifiutano con file, set e voce.
 */
class MultiSetTest {
    static final String MINI = "/sb-6b/mini.json";
    /** La bozza del Set Base (SB-11b e seguenti): la mini cita solo carte che ha anche la bozza «attuale». */
    static final String SET_BASE = "/set-base/bozza.json";
    private static final String BRUISER = SimulationCatalog.BRUISER, JUNKIE = SimulationCatalog.JUNKIE;
    private static final String SBUFFATA = "mini.spazienzio.bound.Sbuffata";
    private static final ObjectMapper JSON = new ObjectMapper();

    private static ObjectNode resource(String name) throws Exception {
        try (InputStream input = MultiSetTest.class.getResourceAsStream(name)) { return (ObjectNode) JSON.readTree(input); }
    }

    private static Draft composed(String base) throws Exception {
        return Draft.load(List.of("classpath:" + base, "classpath:" + MINI));
    }

    // ---- caricamento ----

    @Test void miniLoadsWithTheCurrentSet() throws Exception {
        Draft draft = composed(Draft.CURRENT);
        assertEquals("attuale.json + mini.json", draft.source);
        assertEquals(Draft.FORMAT_SETS, draft.format);
        assertEquals(List.of("base", "mini"), new ArrayList<>(draft.sets().keySet()));
        assertNull(draft.sets().get("base").version, "un file sb-6a/1 non dichiara la versione");
        assertEquals("0.1", draft.sets().get("mini").version);
        assertEquals("Mini-espansione di prova", draft.sets().get("mini").name);
        assertEquals(Map.of("base", ""), withEmpty(draft.sets().get("mini").requires));
        assertEquals(Set.of("starter-bruiser", "starter-junkie", "mini.spazienzio", "mini.tossico"), draft.deckIds());
        assertEquals(37 + 5, draft.cardBindings().size());

        // Set e rarità di ogni carta: le carte di oggi sono di base e senza rarità (Set Base 0.1, S1).
        for (String binding : draft.cardBindings()) {
            assertEquals(binding.startsWith("mini.") ? "mini" : "base", draft.setOfCard(binding), binding);
            if (!binding.startsWith("mini.")) assertNull(draft.rarityOf(binding), binding);
        }
        assertEquals("COMMON", draft.rarityOf(SBUFFATA));
        assertEquals("RARE", draft.rarityOf("mini.CalcioAlBidone"));
        assertEquals("UNCOMMON", draft.rarityOf("mini.RintoccoDiCampana"));
        assertEquals("COMMON", draft.rarityOf("mini.items.LattinaSchiacciata"));
        assertNull(draft.rarityOf("mini.Spallucce"), "R07 ammette una carta senza rarità");
        assertEquals("base", draft.setOfCharacter(BRUISER));
        assertEquals("mini", draft.setOfDeck("mini.spazienzio"));
        assertEquals("base", draft.setOfDeck("starter-bruiser"));

        // La terza bound di un personaggio esistente, che viene da un altro set.
        assertEquals(List.of("bruiser.character.LittleRage", "bruiser.character.LittleSmack", SBUFFATA), draft.boundsAvailable(BRUISER));
        assertEquals(List.of("bruiser.character.LittleSmack", SBUFFATA), draft.boundOf("mini.spazienzio"));

        // La carta Java della mini vive nei sorgenti di test e prende dalla bozza costo, priorità e parametri.
        Card rintocco = draft.card("mini.RintoccoDiCampana");
        assertTrue(rintocco instanceof RintoccoDiCampana, rintocco.getClass().getName());
        assertEquals("mini.RintoccoDiCampana", rintocco.getBindingName());
        assertEquals(Map.of(Resource.ALERTNESS, 5), rintocco.getCost());
        assertEquals("Rintocco di campana", rintocco.getName());
    }

    private static Map<String, String> withEmpty(Map<String, String> requires) {
        Map<String, String> out = new LinkedHashMap<>();
        requires.forEach((set, version) -> out.put(set, version == null ? "" : version));
        return out;
    }

    @Test void theOrderOfTheFilesDoesNotMatter() throws Exception {
        Draft one = composed(Draft.CURRENT);
        Draft other = Draft.load(List.of("classpath:" + MINI, "classpath:" + Draft.CURRENT));
        assertEquals(one.cardBindings(), other.cardBindings());
        assertEquals(one.deckIds(), other.deckIds());
        assertEquals(new TreeSet<>(one.sets().keySet()), new TreeSet<>(other.sets().keySet()));
        SimulationRunner a = new SimulationRunner(one), b = new SimulationRunner(other);
        for (long seed = 0; seed < 4; seed++) {
            SimulationRunner.Contender x = new SimulationRunner.Contender("mini.spazienzio", new AggressivePolicy());
            SimulationRunner.Contender y = new SimulationRunner.Contender("mini.tossico", new ResourceAwarePolicy());
            assertEquals(a.continueGame(a.newGame(seed, x, y), seed, true, g -> { }).jsonl(),
                    b.continueGame(b.newGame(seed, x, y), seed, true, g -> { }).jsonl(), "seme " + seed);
        }
    }

    @Test void miniLoadsWithTheSetBaseDraft() throws Exception {
        Draft base = Draft.fromClasspath(SET_BASE), draft = composed(SET_BASE);
        assertEquals("bozza.json + mini.json", draft.source);
        List<String> before = base.boundsAvailable(BRUISER), after = draft.boundsAvailable(BRUISER);
        assertFalse(before.contains(SBUFFATA));
        List<String> expected = new ArrayList<>(before);
        expected.add(SBUFFATA);
        assertEquals(new TreeSet<>(expected), new TreeSet<>(after), "una bound in più per Spazienzio, quelle della bozza restano");
        for (String deck : base.deckIds()) assertTrue(draft.deckIds().contains(deck), deck);
        // Una partita intera per ogni mazzo della mini contro ogni starter della bozza.
        SimulationRunner runner = new SimulationRunner(draft);
        for (String mini : List.of("mini.spazienzio", "mini.tossico"))
            for (String starter : base.deckIds()) {
                SimulationRunner.Result result = runner.run(11, new SimulationRunner.Contender(mini, new AggressivePolicy()),
                        new SimulationRunner.Contender(starter, new AggressivePolicy()));
                assertNotEquals(SimulationRunner.Outcome.TURN_LIMIT, result.outcome, mini + " contro " + starter);
                assertEquals(0, result.emptyMoves, mini + " contro " + starter);
            }
    }

    // ---- la mini non tocca il set base ----

    /** Le partite fra starter di base sono identiche evento per evento, con o senza la mini: la mini non cambia nessuna carta di base. */
    @Test void baseGamesAreIdenticalWithTheExpansion() throws Exception {
        for (String resource : List.of(Draft.CURRENT, SET_BASE)) {
            Draft alone = Draft.fromClasspath(resource), with = composed(resource);
            SimulationRunner a = new SimulationRunner(alone), b = new SimulationRunner(with);
            Map<String, BotPolicy> styles = PlaygroundTest.styles();
            int games = 0;
            for (String first : alone.deckIds())
                for (String second : alone.deckIds())
                    for (Map.Entry<String, BotPolicy> style : styles.entrySet())
                        for (long seed = 0; seed < 4; seed++) {
                            SimulationRunner.Contender x = new SimulationRunner.Contender(first, style.getValue());
                            SimulationRunner.Contender y = new SimulationRunner.Contender(second, styles.get("aggressivo"));
                            assertEquals(a.continueGame(a.newGame(seed, x, y), seed, true, g -> { }).jsonl(),
                                    b.continueGame(b.newGame(seed, x, y), seed, true, g -> { }).jsonl(),
                                    resource + ": " + first + " (" + style.getKey() + ") contro " + second + ", seme " + seed);
                            games++;
                        }
            assertTrue(games >= 40, resource + ": " + games + " partite");
        }
    }

    // ---- partite con la mini ----

    @Test void miniDecksPlayFullGamesAndUseEveryExpansionCard() throws Exception {
        Draft draft = composed(Draft.CURRENT);
        SimulationRunner runner = new SimulationRunner(draft);
        Map<String, String> unplayed = new LinkedHashMap<>();
        for (String binding : draft.cardBindings()) {
            if (!binding.startsWith("mini.")) continue;
            Card card = draft.card(binding);
            unplayed.put(binding, card.isItem() ? "Grabbed and consumed Item " + card.getName() : "\"card\":\"" + card.getName() + "\"");
        }
        List<String> decks = List.of("mini.spazienzio", "mini.tossico", "starter-bruiser", "starter-junkie");
        int games = 0;
        for (String first : decks.subList(0, 2))
            for (String second : decks)
                for (Map.Entry<String, BotPolicy> style : PlaygroundTest.styles().entrySet())
                    for (long seed = 0; seed < 3; seed++) {
                        SimulationRunner.Result result = runner.continueGame(runner.newGame(seed,
                                new SimulationRunner.Contender(first, style.getValue()),
                                new SimulationRunner.Contender(second, new AggressivePolicy())), seed, true, g -> { });
                        String where = first + " (" + style.getKey() + ") contro " + second + ", seme " + seed;
                        assertNotEquals(SimulationRunner.Outcome.TURN_LIMIT, result.outcome, where);
                        assertEquals(0, result.emptyMoves, where);
                        String trace = result.jsonl();
                        unplayed.values().removeIf(trace::contains);
                        games++;
                    }
        assertEquals(2 * 4 * 5 * 3, games);
        assertEquals(Map.of(), unplayed, "Carte della mini mai giocate");
    }

    /** Una piccola matrice col banco di SB-7: invarianti in ogni turno, tetto delle bound misurato anche sulla bound della mini. */
    @Test void smallBenchMatrixOnTheComposedDraft() throws Exception {
        Draft draft = composed(Draft.CURRENT);
        Map<String, BotPolicy> styles = new LinkedHashMap<>();
        styles.put("aggressivo", new AggressivePolicy());
        styles.put("risorse", new ResourceAwarePolicy());
        Bench.Settings settings = new Bench.Settings(4, 6_600_000L, List.of("starter-bruiser", "starter-junkie", "mini.spazienzio",
                "mini.tossico"), styles, 1, BoundCap.Params.SB7, "SB-6b: prova della mini");
        Bench.Report report = Bench.run(draft, settings);
        assertEquals(10L * 4 * 4, report.games(), "10 coppie di mazzi, specchi compresi, × 4 coppie di stili × 4 partite");
        long violations = report.checks.counts.values().stream().mapToLong(Long::longValue).sum();
        assertEquals(0, violations, report.failures());
        Set<String> measured = new LinkedHashSet<>();
        for (BoundCap.Result r : report.bounds) measured.add(r.bound);
        assertTrue(measured.contains(SBUFFATA), "la bound della mini passa dal tetto: " + measured);
        assertTrue(report.markdown().contains("| Formato | sb-6b/1:"), "il rapporto dice il formato letto");
        assertEquals(report.json(), Bench.run(composed(Draft.CURRENT), settings).json(), "stesso seme e stessi file, stesso rapporto");
    }

    // ---- vista unita, derive e proprietà ----

    @Test void theJoinedViewReadsBackAndASingleFileStaysAsItIs() throws Exception {
        Draft draft = composed(Draft.CURRENT);
        JsonNode view = draft.json();
        assertEquals(Draft.FORMAT_SETS, view.get("format").asText());
        assertEquals(2, view.get("sets").size());
        for (JsonNode card : view.get("cards")) assertTrue(card.has("set"), card.toString());
        Draft again = draft.derive("vista unita", view);
        assertEquals(draft.cardBindings(), again.cardBindings());
        assertEquals(draft.deckIds(), again.deckIds());
        assertEquals(draft.sets().keySet(), again.sets().keySet());
        assertEquals("mini", again.setOfCard(SBUFFATA));
        assertEquals("COMMON", again.rarityOf(SBUFFATA));
        // Una voce senza set nella vista unita è libera, come i mazzi costruiti dalla ricerca o le sonde del banco.
        ObjectNode free = view.deepCopy();
        ObjectNode deck = ((ObjectNode) free.get("decks").get(2)).deepCopy();
        deck.remove("set");
        deck.put("id", "costruito");
        ((ArrayNode) free.get("decks")).add(deck);
        assertNull(draft.derive("con un mazzo libero", free).setOfDeck("costruito"));

        assertEquals(resource(Draft.CURRENT), Draft.fromClasspath(Draft.CURRENT).json(), "un file sb-6a/1 resta com'è");
        assertEquals(Draft.FORMAT, Draft.fromClasspath(Draft.CURRENT).format);
    }

    @Test void theLaunchPropertyAcceptsMoreSources() throws Exception {
        Draft draft = Draft.fromProperty(" classpath:" + Draft.CURRENT + " ; classpath:" + MINI + " ");
        assertEquals("attuale.json + mini.json", draft.source);
        assertEquals(List.of("base", "mini"), new ArrayList<>(draft.sets().keySet()));
        Draft single = Draft.fromProperty("classpath:" + Draft.CURRENT);
        assertEquals("classpath:" + Draft.CURRENT, single.source);
    }

    @Test void aCharacterCanHaveARarity() throws Exception {
        ObjectNode mini = resource(MINI);
        ((ArrayNode) mini.get("characters")).add(JSON.readTree("{\"id\":\"mini.character.Bidello\",\"name\":\"Bidello di prova\","
                + "\"rarity\":\"RARE\",\"resources\":{\"HEALTH\":90,\"ALERTNESS\":20},\"items\":1,\"immunities\":[],"
                + "\"basic\":\"com.basic.BruiserGrab\"}"));
        Draft draft = Draft.parse(files(resource(Draft.CURRENT), mini));
        assertEquals("RARE", draft.characterRarity("mini.character.Bidello"));
        assertEquals("mini", draft.setOfCharacter("mini.character.Bidello"));
        assertNull(draft.characterRarity(BRUISER));
    }

    // ---- bozze composte errate ----

    private static Map<String, JsonNode> files(JsonNode base, JsonNode mini) {
        Map<String, JsonNode> files = new LinkedHashMap<>();
        files.put("attuale.json", base);
        files.put("mini.json", mini);
        return files;
    }

    private static ObjectNode cardOf(ObjectNode root, String binding) {
        for (JsonNode card : root.get("cards")) if (binding.equals(card.get("binding").asText())) return (ObjectNode) card;
        throw new IllegalArgumentException(binding);
    }

    private static ObjectNode deckOf(ObjectNode root, String id) {
        for (JsonNode deck : root.get("decks")) if (id.equals(deck.get("id").asText())) return (ObjectNode) deck;
        throw new IllegalArgumentException(id);
    }

    /** Un caso: come cambiare i file e cosa deve dire il messaggio, che comincia sempre col file o con la bozza composta. */
    private static final class Case {
        final Consumer<Map<String, JsonNode>> change;
        final String[] expected;

        Case(Consumer<Map<String, JsonNode>> change, String... expected) {
            this.change = change;
            this.expected = expected;
        }
    }

    private static Consumer<Map<String, JsonNode>> mini(Consumer<ObjectNode> change) {
        return files -> change.accept((ObjectNode) files.get("mini.json"));
    }

    private static Consumer<Map<String, JsonNode>> base(Consumer<ObjectNode> change) {
        return files -> change.accept((ObjectNode) files.get("attuale.json"));
    }

    private static JsonNode read(String json) {
        try {
            return JSON.readTree(json);
        } catch (Exception error) {
            throw new IllegalStateException(error);
        }
    }

    private static ObjectNode thirdSet() {
        return (ObjectNode) read("{\"format\":\"sb-6b/1\",\"set\":{\"id\":\"terzo\",\"name\":\"Terzo\",\"version\":\"0.1\"},"
                + "\"requires\":[{\"set\":\"base\"}],\"characters\":[],\"cards\":[{\"binding\":\"terzo.Gomitata\",\"kind\":\"ACTION\","
                + "\"priority\":1,\"targets\":[\"OPPONENT\"],\"target\":[{\"op\":\"damage\",\"type\":\"HIT\",\"amount\":6}],"
                + "\"gui\":{\"name\":\"Gomitata\",\"role\":\"DAMAGE\",\"gains\":\"—\",\"damage\":\"HIT\",\"damageAmount\":\"HIT 6\"}}],"
                + "\"decks\":[]}");
    }

    private static void swap(ObjectNode deck, String out, String in) {
        ObjectNode cards = (ObjectNode) deck.get("cards");
        int copies = cards.get(out).asInt();
        cards.remove(out);
        cards.put(in, copies);
    }

    @TestFactory Stream<DynamicTest> badComposedDraftsAreRefused() {
        Map<String, Case> cases = new LinkedHashMap<>();
        // Set mancanti, ripetuti, versioni e dipendenze.
        cases.put("set richiesto non caricato", new Case(files -> files.remove("attuale.json"),
                "mini.json: ", "set mini", "richiede il set base", "non è caricato"));
        cases.put("set caricato due volte", new Case(files -> files.put("mini-copia.json", files.get("mini.json").deepCopy()),
                "set mini", "caricato due volte", "mini.json", "mini-copia.json"));
        cases.put("due set di partenza", new Case(files -> files.put("altra.json", files.get("attuale.json").deepCopy()),
                "altra.json: ", "regole del formato già dichiarate da attuale.json"));
        cases.put("versione richiesta diversa", new Case(mini(m -> ((ObjectNode) m.get("requires").get(0)).put("version", "0.1")),
                "set mini", "richiede base 0.1", "non dichiarata"));
        cases.put("richiede sé stesso", new Case(mini(m -> ((ArrayNode) m.get("requires")).add(read("{\"set\":\"mini\"}"))),
                "set mini", "richiede sé stesso"));
        cases.put("requires circolare", new Case(files -> {
            ObjectNode third = thirdSet();
            ((ArrayNode) third.get("requires")).add(read("{\"set\":\"mini\"}"));
            files.put("terzo.json", third);
            ((ArrayNode) files.get("mini.json").get("requires")).add(read("{\"set\":\"terzo\"}"));
        }, "requires circolare"));
        cases.put("regole in un'espansione", new Case(mini(m -> m.set("rules", read("{\"deckSize\":20}"))),
                "mini.json: ", "rules non ammesso"));
        cases.put("set di partenza senza regole", new Case(files -> {
            files.remove("attuale.json");
            ((ObjectNode) files.get("mini.json")).remove("requires");
        }, "mini.json: ", "campo rules mancante"));
        cases.put("formato sconosciuto", new Case(mini(m -> m.put("format", "sb-6c/1")), "mini.json: ", "sb-6c/1", "sb-6b/1"));
        cases.put("testata mancante", new Case(mini(m -> m.remove("set")), "mini.json: ", "campo set mancante"));
        cases.put("testata senza versione", new Case(mini(m -> ((ObjectNode) m.get("set")).remove("version")), "mini.json: ", "version"));
        cases.put("id del set non valido", new Case(mini(m -> ((ObjectNode) m.get("set")).put("id", "Mini")), "set Mini", "non valido"));
        cases.put("vista unita insieme a un file", new Case(files -> {
            try {
                files.put("vista.json", Draft.load(List.of("classpath:" + Draft.CURRENT, "classpath:" + MINI)).json());
            } catch (Exception error) {
                throw new IllegalStateException(error);
            }
        }, "vista.json: ", "si legge da sola"));
        // Voci dei set: campo set, prefisso, id ripetuti fra set.
        cases.put("campo set su una voce", new Case(mini(m -> cardOf(m, "mini.Spallucce").put("set", "mini")),
                "mini.json: ", "carta mini.Spallucce", "campo set non ammesso"));
        cases.put("set su una voce di sb-6a/1", new Case(base(b -> cardOf(b, "com.Grab").put("set", "base")),
                "attuale.json: ", "carta com.Grab", "campo sconosciuto set"));
        cases.put("rarità in un file sb-6a/1", new Case(base(b -> cardOf(b, "com.Grab").put("rarity", "COMMON")),
                "attuale.json: ", "carta com.Grab", "campo sconosciuto rarity"));
        cases.put("carta senza prefisso del set", new Case(mini(m -> cardOf(m, "mini.Spallucce").put("binding", "Spallucce")),
                "carta Spallucce (set mini)", "«mini.»"));
        cases.put("mazzo senza prefisso del set", new Case(mini(m -> deckOf(m, "mini.tossico").put("id", "tossico")),
                "mazzo tossico (set mini)", "«mini.»"));
        cases.put("carta definita in due set", new Case(files -> ((ArrayNode) files.get("attuale.json").get("cards"))
                .add(cardOf((ObjectNode) files.get("mini.json"), "mini.Spallucce").deepCopy()),
                "carta mini.Spallucce (set mini)", "binding ripetuto", "sia nel set base (attuale.json) sia nel set mini (mini.json)"));
        cases.put("mazzo definito in due set", new Case(files -> ((ArrayNode) files.get("attuale.json").get("decks"))
                .add(deckOf((ObjectNode) files.get("attuale.json"), "starter-bruiser").deepCopy().put("id", "mini.tossico")),
                "mazzo mini.tossico (set mini)", "id ripetuto", "sia nel set base", "sia nel set mini"));
        cases.put("nome di carta già usato da un altro set", new Case(mini(m -> ((ObjectNode) cardOf(m, "mini.Spallucce").get("gui"))
                .put("name", "fai basta")), "carta mini.Spallucce (set mini)", "gui.name", "bruiser.YouStop del set base"));
        // Rarità.
        cases.put("rarità fuori vocabolario", new Case(mini(m -> cardOf(m, "mini.Spallucce").put("rarity", "LEGENDARY")),
                "carta mini.Spallucce (set mini)", "rarity LEGENDARY fuori vocabolario", "COMMON, UNCOMMON, RARE"));
        cases.put("rarità in minuscolo", new Case(mini(m -> cardOf(m, "mini.Spallucce").put("rarity", "common")),
                "carta mini.Spallucce (set mini)", "rarity common fuori vocabolario"));
        cases.put("rarità di una carta Java fuori vocabolario", new Case(mini(m -> cardOf(m, "mini.RintoccoDiCampana").put("rarity", "MYTHIC")),
                "carta mini.RintoccoDiCampana (set mini)", "MYTHIC"));
        cases.put("rarità non testuale", new Case(mini(m -> cardOf(m, "mini.Spallucce").put("rarity", 3)),
                "carta mini.Spallucce (set mini)", "rarity"));
        // Carte di set non caricati o non richiesti.
        cases.put("carta di un set non caricato", new Case(mini(m -> swap(deckOf(m, "mini.tossico"), "mini.Spallucce", "terzo.Gomitata")),
                "mazzo mini.tossico (set mini)", "carta sconosciuta: terzo.Gomitata", "set caricati: base, mini"));
        cases.put("carta di un set caricato ma non richiesto", new Case(files -> {
            files.put("terzo.json", thirdSet());
            swap(deckOf((ObjectNode) files.get("mini.json"), "mini.tossico"), "mini.Spallucce", "terzo.Gomitata");
        }, "mazzo mini.tossico (set mini): cards", "terzo.Gomitata è del set terzo", "che il set mini non richiede (richiede: base)"));
        cases.put("set base che usa una carta della mini", new Case(files -> swap(deckOf((ObjectNode) files.get("attuale.json"),
                "starter-bruiser"), "bruiser.Glare", "mini.CalcioAlBidone"),
                "mazzo starter-bruiser (set base): cards", "mini.CalcioAlBidone è del set mini", "che il set base non richiede (richiede: nessuno)"));
        cases.put("bound legata a un personaggio di un set non richiesto", new Case(files -> {
            ObjectNode third = thirdSet();
            ((ArrayNode) third.get("characters")).add(read("{\"id\":\"terzo.character.Pippo\",\"name\":\"Pippo\","
                    + "\"resources\":{\"HEALTH\":90,\"ALERTNESS\":20},\"items\":1,\"immunities\":[],\"basic\":\"com.basic.BruiserGrab\"}"));
            files.put("terzo.json", third);
            cardOf((ObjectNode) files.get("mini.json"), SBUFFATA).put("boundTo", "terzo.character.Pippo");
        }, "carta " + SBUFFATA + " (set mini)", "il personaggio terzo.character.Pippo è del set terzo"));
        // Mazzi che violano le regole dei mazzi (R02 1.12) mescolando set.
        cases.put("bound della mini a un altro personaggio", new Case(mini(m -> ((ArrayNode) deckOf(m, "mini.tossico").get("bound"))
                .set(1, TextNode.valueOf(SBUFFATA))), "mazzo mini.tossico (set mini)", SBUFFATA, "è legata a " + BRUISER));
        cases.put("tre bound", new Case(mini(m -> ((ArrayNode) deckOf(m, "mini.spazienzio").get("bound"))
                .add("bruiser.character.LittleRage")), "mazzo mini.spazienzio (set mini)", "bound sono 3", "ne chiede 2"));
        cases.put("bound ripetuta", new Case(mini(m -> ((ArrayNode) deckOf(m, "mini.spazienzio").get("bound"))
                .set(0, TextNode.valueOf(SBUFFATA))), "mazzo mini.spazienzio (set mini)", "ripetuta"));
        cases.put("bound della mini fra le regolari", new Case(mini(m -> swap(deckOf(m, "mini.spazienzio"), "mini.Spallucce", SBUFFATA)),
                "mazzo mini.spazienzio (set mini)", "cards." + SBUFFATA, "non vanno fra le carte regolari"));
        cases.put("mazzo misto da 21", new Case(mini(m -> ((ObjectNode) deckOf(m, "mini.spazienzio").get("cards")).put("com.Grab", 1)),
                "mazzo mini.spazienzio (set mini)", "21", "20"));
        cases.put("terza copia di una carta della mini", new Case(mini(m -> {
            ObjectNode cards = (ObjectNode) deckOf(m, "mini.spazienzio").get("cards");
            cards.put("mini.CalcioAlBidone", 3);
            cards.put("bruiser.SuperImpact", 1);
        }), "mazzo mini.spazienzio (set mini)", "mini.CalcioAlBidone", "3 copie"));
        cases.put("basic diversa da quella fissa", new Case(mini(m -> deckOf(m, "mini.spazienzio").put("basic", "com.basic.ToxicGrab")),
                "mazzo mini.spazienzio (set mini)", "com.basic.ToxicGrab", "diversa da quella fissa"));
        cases.put("last resort che non lo è", new Case(mini(m -> deckOf(m, "mini.spazienzio").put("lastResort", "mini.Spallucce")),
                "mazzo mini.spazienzio (set mini)", "mini.Spallucce", "non è una last resort"));

        List<DynamicTest> tests = new ArrayList<>();
        for (Map.Entry<String, Case> entry : cases.entrySet())
            tests.add(DynamicTest.dynamicTest(entry.getKey(), () -> {
                Map<String, JsonNode> files = files(resource(Draft.CURRENT), resource(MINI));
                entry.getValue().change.accept(files);
                Draft.Invalid error = assertThrows(Draft.Invalid.class, () -> Draft.parse(files));
                String message = error.getMessage();
                assertTrue(files.keySet().stream().anyMatch(name -> message.startsWith(name + ": "))
                        || message.startsWith(String.join(" + ", files.keySet()) + ": "), "Il messaggio comincia col file: " + message);
                for (String expected : entry.getValue().expected)
                    assertTrue(message.contains(expected), "Manca «" + expected + "» in: " + message);
            }));
        tests.add(DynamicTest.dynamicTest("le due fonti valide si caricano", () -> Draft.parse(files(resource(Draft.CURRENT), resource(MINI)))));
        tests.add(DynamicTest.dynamicTest("file della mini assente", () -> {
            Draft.Invalid error = assertThrows(Draft.Invalid.class,
                    () -> Draft.load(List.of("classpath:" + Draft.CURRENT, "classpath:/sb-6b/nessuna.json")));
            assertTrue(error.getMessage().contains("nessuna.json"), error.getMessage());
        }));
        return tests.stream();
    }
}
