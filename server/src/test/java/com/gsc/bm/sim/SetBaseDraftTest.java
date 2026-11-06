package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.bot.BotPolicy;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * SB-11b: la bozza del Set Base (set-base/bozza.json) con gli starter di Spazienzio («Pazienza finita») e Mara («Consegna sul muso»).
 * Prove brevi della suite: la bozza si carica e passa gli invarianti in modo stretto, gli starter rispettano il formato, poche partite
 * per ogni coppia di stili finiscono senza errori, ogni meccanica di base compare in uno dei due mazzi, le durate seguono R05 e i nomi
 * delle carte di Spazienzio sono in maiuscolo. Le misure lunghe restano a richiesta (BenchMeasureTest, ListinoMeasureTest).
 */
class SetBaseDraftTest {
    static final String RESOURCE = "/set-base/bozza.json";
    static final String SPAZIENZIO = "bruiser.character.BigBadBruiser", MARA = "base.character.Mara";
    static final List<String> STARTERS = List.of("starter-spazienzio", "starter-mara");

    private static Draft draft;
    private static JsonNode json;

    @BeforeAll
    static void load() throws Exception {
        draft = Draft.fromClasspath(RESOURCE);
        json = draft.json();
    }

    private static JsonNode card(String binding) {
        for (JsonNode c : json.get("cards")) if (c.get("binding").asText().equals(binding)) return c;
        throw new IllegalArgumentException(binding);
    }

    private static Map<String, BotPolicy> heuristic() {
        Map<String, BotPolicy> styles = new LinkedHashMap<>(PlaygroundTest.styles());
        styles.remove("com");
        styles.remove("casuale");
        return styles;
    }

    @Test
    void theDraftLoadsWithTheTwoStartersAndAllTheirCards() {
        assertEquals(Set.of(SPAZIENZIO, MARA), draft.characterIds());
        assertEquals(new TreeSet<>(STARTERS), new TreeSet<>(draft.deckIds()));
        // Le terze bound stanno nella collezione: nella bozza, in nessuno starter.
        for (String third : List.of("base.spazienzio.bound.TestaAlMuro", "base.mara.bound.ColpoDiStriscio")) {
            assertTrue(draft.cardBindings().contains(third), third);
            assertFalse(draft.deckCards().contains(third), third + " non va negli starter");
        }
        // Tutte le risorse di R01 (1.11) scritte per i due personaggi.
        for (JsonNode c : json.get("characters"))
            for (String r : List.of("HEALTH", "ALERTNESS", "VIOLENCE", "TOXICITY", "ALCOHOL"))
                assertTrue(c.get("resources").has(r), c.get("id").asText() + " senza " + r);
    }

    @Test
    void theStartersRespectTheFormat() {
        for (String deck : STARTERS) {
            String character = draft.characterOf(deck);
            Map<String, Integer> cards = draft.cardsOf(deck);
            assertEquals(20, cards.values().stream().mapToInt(Integer::intValue).sum(), deck + ": 20 carte regolari");
            cards.forEach((binding, copies) -> assertTrue(copies >= 1 && copies <= 2, deck + ": " + binding + " in " + copies + " copie"));
            assertEquals(draft.characterBasic(character), draft.basicOf(deck), deck + ": basic fissa");
            assertTrue(draft.card(draft.basicOf(deck)).isBasicAction(), deck + ": la basic è una basic");
            List<String> bound = draft.boundOf(deck);
            assertEquals(2, bound.size(), deck + ": due bound");
            assertEquals(2, new TreeSet<>(bound).size(), deck + ": due bound diverse");
            for (String b : bound) {
                Card c = draft.card(b);
                assertTrue(c.isCharacterBound() && character.equals(c.getBoundToCharacter()), deck + ": " + b + " è una bound propria");
                assertTrue(c.getCost().isEmpty(), deck + ": " + b + " gratuita");
            }
            Card last = draft.card(draft.lastResortOf(deck));
            assertTrue(last.isLastResort() && last.getCost().isEmpty(), deck + ": last resort gratuita");
            for (String binding : cards.keySet()) {
                Card c = draft.card(binding);
                assertFalse(c.isBasicAction() || c.isCharacterBound() || c.isLastResort(), deck + ": " + binding + " fra le regolari");
            }
        }
    }

    /** Invarianti di SB-7 in modo stretto, tetto delle bound coi predefiniti D33/D36, stili euristici. */
    @Test
    void theDraftPassesTheBenchInvariantsStrictly() throws Exception {
        Bench.Report report = Bench.run(draft, new Bench.Settings(12, 7_000_000L, new ArrayList<>(draft.deckIds()), heuristic(), 2,
                BoundCap.Params.DEFAULT, null));
        assertEquals(0L, report.checks.total(), report.failures());
        assertEquals(0L, report.boundViolations(), report.failures());
        assertEquals(6, report.bounds.size(), "le sei bound della bozza, comprese le terze");
        assertEquals(3L * 9 * 12, report.games());
        assertTrue(report.checks.seatTurns > report.games() * 2, "i turni sono controllati");
    }

    /** Poche partite per ogni coppia ordinata dei cinque stili, compresi il bot attuale e il casuale: nessun errore, nessun limite. */
    @Test
    void everyPairOfStylesFinishesItsGames() throws Exception {
        Map<String, BotPolicy> styles = PlaygroundTest.styles();
        Bench.Report report = Bench.run(draft, new Bench.Settings(2, 7_300_000L, new ArrayList<>(draft.deckIds()), styles, 2,
                BoundCap.Params.DEFAULT, null));
        assertEquals(3L * styles.size() * styles.size() * 2, report.games());
        assertEquals(0L, report.checks.total(), report.failures());
        for (Bench.Cell cell : report.cells) assertEquals(0L, cell.tally.limits, cell.deckA + " contro " + cell.deckB);
    }

    /** SB-11 chiede che danno dei tre tipi, difesa, priorità, oggetti, equip e contromossa compaiano in almeno uno dei due mazzi. */
    @Test
    void everyBasicMechanicIsInOneOfTheTwoStarters() {
        Set<String> found = new TreeSet<>();
        for (String deck : STARTERS) {
            List<String> used = new ArrayList<>(draft.cardsOf(deck).keySet());
            used.addAll(draft.boundOf(deck));
            used.add(draft.basicOf(deck));
            used.add(draft.lastResortOf(deck));
            for (String binding : used) {
                JsonNode c = card(binding);
                Card instance = draft.card(binding);
                if (instance.isItem()) found.add("oggetti");
                else if (instance.getPriority() != 1) found.add("priorità");
                String role = c.get("gui").get("role").asText();
                if (role.equals("COUNTER")) found.add("annullamento");
                if (role.equals("DISRUPT")) found.add("contromossa senza annullare");
                for (String list : List.of("self", "target"))
                    if (c.has(list)) for (JsonNode step : c.get(list)) {
                        String op = step.get("op").asText();
                        if (op.equals("damage") && list.equals("target")) found.add("danno " + step.get("type").asText());
                        if (op.equals("consume")) found.add("presa di oggetti");
                        if (op.equals("status") && step.path("equip").asBoolean()) found.add("equip");
                        if (op.equals("status") && !step.path("equip").asBoolean() && step.get("flow").asText().equals("INPUT")
                                && step.get("factor").asDouble() < 1) found.add("difesa");
                    }
            }
        }
        assertEquals(new TreeSet<>(List.of("annullamento", "contromossa senza annullare", "danno CUT", "danno HIT", "danno POISON", "difesa",
                "equip", "oggetti", "presa di oggetti", "priorità")), found);
    }

    /** «Per N turni» conta il turno in corso: turns = N − 1 (R05); «in questo turno» è turns = 0. Vale per ogni stato della bozza. */
    @Test
    void durationsFollowTheR05Reading() {
        Pattern turns = Pattern.compile("per (\\d+) turni");
        int checked = 0;
        for (JsonNode c : json.get("cards")) {
            String description = c.get("gui").path("description").asText("");
            for (String list : List.of("self", "target"))
                if (c.has(list)) for (JsonNode step : c.get(list)) {
                    if (!step.get("op").asText().equals("status") || !step.has("turns")) continue;
                    Matcher m = turns.matcher(description);
                    int expected = m.find() ? Integer.parseInt(m.group(1)) - 1 : description.contains("in questo turno") ? 0 : -1;
                    assertEquals(expected, step.get("turns").asInt(), c.get("binding").asText() + ": " + description);
                    checked++;
                }
        }
        assertEquals(7, checked, "Glare, MadeOfStone, Giubbotto e le due parate da due stati");
        assertEquals(2, card("base.items.GiubbottoDiFintaPelle").get("self").get(0).get("turns").asInt());
        assertEquals(3, card("bruiser.MadeOfStone").get("self").get(0).get("turns").asInt());
    }

    /** Decisione del proprietario (SB-11b): Spazienzio ha perso la pazienza e urla, quindi le sue carte si mostrano in maiuscolo. */
    @Test
    void spazienziosCardsShoutTheirNames() {
        int shouting = 0;
        for (JsonNode c : json.get("cards")) {
            String description = c.get("gui").path("description").asText("");
            if (!description.startsWith("SPA-")) continue;
            String name = c.get("gui").get("name").asText();
            assertEquals(name.toUpperCase(Locale.ITALIAN), name, c.get("binding").asText());
            shouting++;
        }
        assertEquals(9, shouting, "basic, tre bound e cinque carte d'archetipo");
    }

    /** La base del listino ricavata dalla bozza: contesti con le àncore al posto di due coppie di generiche, starter intatti. */
    @Test
    void theListinoBaseFromTheDraftHasTheNewContexts() throws Exception {
        Draft base = Listino.setBaseContexts(draft, 7);
        for (String ctx : List.of(Listino.SPAZIENZIO, Listino.MARA)) {
            List<String> spec = Listino.SET_BASE_CONTEXTS.get(ctx);
            Map<String, Integer> cards = base.cardsOf(ctx), starter = draft.cardsOf(spec.get(0));
            assertEquals(2, cards.get(Listino.SLOT1));
            assertEquals(2, cards.get(Listino.SLOT2));
            assertFalse(cards.containsKey(spec.get(1)) || cards.containsKey(spec.get(2)), ctx);
            assertEquals(starter, base.cardsOf(spec.get(0)), "lo starter resta com'è");
            assertEquals(draft.boundOf(spec.get(0)), base.boundOf(ctx));
        }
        for (JsonNode c : base.json().get("cards"))
            if (c.get("binding").asText().startsWith("listino.Ancora")) {
                assertEquals(7, c.get("target").get(0).get("amount").asInt(), "àncora a 7 HIT");
                assertTrue(!c.has("cost") || c.get("cost").isEmpty(), "àncora gratuita");
            }
        Listino listino = new Listino(base, new Listino.Params(1, 1, 1, 1), heuristic());
        long onStarters = listino.curves().stream().filter(c -> c.group.equals("tettostarter")).count();
        assertEquals(10, onStarters, "tre bound e due sonde per starter");
        Listino sb10 = new Listino(Draft.fromClasspath(Listino.BASE), new Listino.Params(1, 1, 1, 1), heuristic());
        assertTrue(sb10.curves().stream().noneMatch(c -> c.group.equals("tettostarter")), "la base di SB-10a non ha starter nuovi");
    }
}
