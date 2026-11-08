package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
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
import java.util.TreeMap;
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
 * delle carte di Spazienzio sono in maiuscolo. SB-12a: la bozza porta i valori scelti nei giri coi bot. SB-13: lo starter del Tossico
 * «Tutto è droga», con le correzioni dei suoi giri. Le misure lunghe restano a richiesta (BenchMeasureTest, ListinoMeasureTest).
 * La bozza cresce blocco dopo blocco: i controlli sull'insieme (personaggi, mazzi, bound, partite del banco) contano tutti gli starter;
 * quelli che riguardano i soli starter base (copertura delle meccaniche, correzioni di SB-12a) usano {@link #BASE_STARTERS}.
 */
class SetBaseDraftTest {
    static final String RESOURCE = "/set-base/bozza.json";
    static final String SPAZIENZIO = "bruiser.character.BigBadBruiser", MARA = "base.character.Mara", TOSSICO = "junkie.character.ToxicJunkie";
    static final List<String> BASE_STARTERS = List.of("starter-spazienzio", "starter-mara");
    static final List<String> STARTERS = List.of("starter-spazienzio", "starter-mara", "starter-tossico");

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
        // SB-13 aggiunge il Tossico: tre personaggi e tre starter, ciascuno con la sua terza bound fuori dallo starter.
        assertEquals(Set.of(SPAZIENZIO, MARA, TOSSICO), draft.characterIds());
        assertEquals(new TreeSet<>(STARTERS), new TreeSet<>(draft.deckIds()));
        // Le terze bound stanno nella collezione: nella bozza, in nessuno starter.
        for (String third : List.of("base.spazienzio.bound.TestaAlMuro", "base.mara.bound.ColpoDiStriscio", "junkie.character.RottenSmile")) {
            assertTrue(draft.cardBindings().contains(third), third);
            assertFalse(draft.deckCards().contains(third), third + " non va negli starter");
        }
        // Tutte le risorse di R01 (1.11) scritte per ogni personaggio.
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
        assertEquals(9, report.bounds.size(), "le nove bound della bozza, comprese le terze (tre per personaggio)");
        assertEquals(6L * 9 * 12, report.games(), "sei coppie di mazzi fra tre starter");
        assertTrue(report.checks.seatTurns > report.games() * 2, "i turni sono controllati");
    }

    /** Poche partite per ogni coppia ordinata dei cinque stili, compresi il bot attuale e il casuale: nessun errore, nessun limite. */
    @Test
    void everyPairOfStylesFinishesItsGames() throws Exception {
        Map<String, BotPolicy> styles = PlaygroundTest.styles();
        Bench.Report report = Bench.run(draft, new Bench.Settings(2, 7_300_000L, new ArrayList<>(draft.deckIds()), styles, 2,
                BoundCap.Params.DEFAULT, null));
        assertEquals(6L * styles.size() * styles.size() * 2, report.games(), "sei coppie di mazzi fra tre starter");
        assertEquals(0L, report.checks.total(), report.failures());
        for (Bench.Cell cell : report.cells) assertEquals(0L, cell.tally.limits, cell.deckA + " contro " + cell.deckB);
    }

    /** SB-11 chiede che danno dei tre tipi, difesa, priorità, oggetti, equip e contromossa compaiano in almeno uno dei due mazzi. */
    @Test
    void everyBasicMechanicIsInOneOfTheTwoStarters() {
        Set<String> found = new TreeSet<>();
        for (String deck : BASE_STARTERS) {
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

    /**
     * SB-12a, tre giri coi bot: salute iniziale di Spazienzio 85 e di Mara 80, costi di Mara −5 A su cinque carte (D38), Sgommata 25 CUT;
     * poi, con l'approvazione del proprietario, Cambio marcia +6 A.
     * I numeri dei giri stanno nel rapporto; qui si controlla che la bozza porti i valori scelti, testi compresi, perché i bot leggono il
     * danno nominale da gui.damageAmount.
     */
    @Test
    void theStartersCarryTheSb12aCorrections() {
        Map<String, Integer> health = new LinkedHashMap<>();
        for (JsonNode c : json.get("characters"))
            if (!c.get("id").asText().equals(TOSSICO)) health.put(c.get("id").asText(), c.get("resources").get("HEALTH").asInt());
        assertEquals(Map.of(SPAZIENZIO, 85, MARA, 80), health, "i due personaggi base; il Tossico ha il suo test");
        Map<String, Integer> alertnessCosts = Map.of("base.mara.CinghiataDiTraverso", 5, "base.mara.Sgommata", 15, "base.mara.Slalom", 10,
                "base.mara.TraDueParaurti", 5, "base.com.SputoDaPosacenere", 5);
        alertnessCosts.forEach((binding, cost) -> {
            JsonNode c = card(binding);
            assertEquals(cost, c.get("cost").get("ALERTNESS").asInt(), binding);
            assertTrue(c.get("gui").get("description").asText().contains("· " + cost + " A:"), binding + ": costo nel testo");
        });
        JsonNode sgommata = card("base.mara.Sgommata");
        assertEquals(25, sgommata.get("target").get(0).get("amount").asInt());
        assertEquals("CUT 25", sgommata.get("gui").get("damageAmount").asText());
        assertTrue(sgommata.get("gui").get("description").asText().contains("25 CUT"));
        // B2 approvata dal proprietario dopo SB-12a: Cambio marcia +6 A (circa 3,3 HEALTH equivalenti per uso invece di 4,5).
        JsonNode cambio = card("base.mara.bound.CambioMarcia");
        assertEquals(6, cambio.get("self").get(0).get("amount").asInt());
        assertEquals("+6 A", cambio.get("gui").get("gains").asText());
        assertTrue(cambio.get("gui").get("description").asText().contains("+6 A"));
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

    // ---- SB-13: lo starter del Tossico «Tutto è droga» ----

    private static JsonNode character(String id) {
        for (JsonNode c : json.get("characters")) if (c.get("id").asText().equals(id)) return c;
        throw new IllegalArgumentException(id);
    }

    /**
     * SB-13: lo starter del Tossico come nella griglia (basic, due bound comuni, last resort propria, 9 carte d'archetipo, 6 generiche,
     * 5 oggetti), con le correzioni dei giri coi bot: salute 80 (SB-9 meno 15 come ipotesi, poi meno 5), T iniziale 20 e Tossicone
     * Scatarrante 8 POISON (giro 2), Raschiare il fondo +7 T (giro 3: con +10 valeva circa 4,6 HEALTH equivalenti per uso, sopra il tetto
     * di 4). Testi compresi, perché i bot leggono costi, guadagni e danno nominale; la bound di T resta entro +10 (D34).
     */
    @Test
    void theToxicStarterFollowsTheGridWithTheSb13Corrections() {
        JsonNode tossico = character(TOSSICO);
        Map<String, Integer> resources = new TreeMap<>();
        tossico.get("resources").fields().forEachRemaining(e -> resources.put(e.getKey(), e.getValue().asInt()));
        assertEquals(Map.of("HEALTH", 80, "ALERTNESS", 35, "VIOLENCE", 0, "TOXICITY", 20, "ALCOHOL", 0), resources);
        assertEquals(2, tossico.get("items").asInt(), "capacità 2 (SB-9)");
        assertEquals(Set.of(Resource.TOXICITY), draft.character(TOSSICO).getImmunities(), "immune all'effetto periodico di T");

        String deck = "starter-tossico";
        assertEquals(TOSSICO, draft.characterOf(deck));
        assertEquals("com.basic.ToxicGrab", draft.basicOf(deck));
        assertEquals(List.of("junkie.character.PatheticBlade", "base.tossico.bound.RaschiareIlFondo"), draft.boundOf(deck));
        assertEquals("junkie.LethalHeroinDose", draft.lastResortOf(deck));
        assertEquals(TOSSICO, card("junkie.LethalHeroinDose").get("exclusiveTo").asText(), "last resort propria (D29)");
        Map<String, Integer> expected = new TreeMap<>();
        expected.put("junkie.MethDrivenRage", 2);
        expected.put("junkie.Cough", 2);
        expected.put("junkie.PervertedMetabolism", 2);
        expected.put("junkie.AmphetamineReflexes", 2);
        expected.put("junkie.ToxicBloodDrain", 1);
        expected.put("com.Grab", 2);
        expected.put("base.com.RincorsaDalMarciapiede", 2);
        expected.put("com.Steal", 1);
        expected.put("base.com.FasciaturaColFazzolettaccio", 1);
        expected.put("base.items.PasticcaTrovataSulBancone", 2);
        expected.put("base.items.PaninoDelKebab", 2);
        expected.put("com.items.MarvelousCocktail", 1);
        assertEquals(expected, new TreeMap<>(draft.cardsOf(deck)), "archetipo 9, generiche 6, oggetti 5, come nella griglia");

        // D34, punto 4: la bound di T dà al massimo +10; giro 3: +7, testi compresi.
        JsonNode raschiare = card("base.tossico.bound.RaschiareIlFondo");
        assertTrue(raschiare.get("self").get(0).get("amount").asInt() <= 10);
        assertEquals(7, raschiare.get("self").get(0).get("amount").asInt());
        assertEquals("+7 T", raschiare.get("gui").get("gains").asText());
        assertTrue(raschiare.get("gui").get("description").asText().contains("+7 T a sé"));
        // Le quattro carte pagate in T costano 10 T (decisione 4 della griglia), e il testo lo dice.
        for (String binding : List.of("junkie.MethDrivenRage", "junkie.Cough", "junkie.AmphetamineReflexes", "junkie.ToxicBloodDrain")) {
            JsonNode c = card(binding);
            assertEquals(1, c.get("cost").size(), binding);
            assertEquals(10, c.get("cost").get("TOXICITY").asInt(), binding);
            assertTrue(c.get("gui").get("description").asText().contains("· 10 T:"), binding + ": costo nel testo");
        }
        // Giro 2: Tossicone Scatarrante da 5 a 8 POISON, testi compresi.
        JsonNode cough = card("junkie.Cough");
        assertEquals(8, cough.get("target").get(0).get("amount").asInt());
        assertEquals("POISON 8", cough.get("gui").get("damageAmount").asText());
        assertTrue(cough.get("gui").get("description").asText().contains("8 POISON e +5 T"));
        // Lo slot apre la descrizione delle dieci carte del Tossico.
        Pattern slot = Pattern.compile("^(TOS-(BA|BO\\d|AR\\d)|LR-TOS) · .*");
        int slots = 0;
        for (JsonNode c : json.get("cards"))
            if (slot.matcher(c.get("gui").path("description").asText("")).matches()) slots++;
        assertEquals(10, slots, "basic, tre bound, last resort e cinque carte d'archetipo");
    }

    /** Le meccaniche del Tossico su stati costruiti a mano: immunità al periodico di T, veleno al bersaglio, cura col veleno, ultima dose. */
    @Test
    void theToxicMechanicsWorkOnHandBuiltStates() {
        Character tossico = draft.character(TOSSICO), spazienzio = draft.character(SPAZIENZIO);
        // Effetto periodico di T (R06): il Tossico, immune, non lo subisce; gli altri perdono T / 2 di salute a fine turno.
        spazienzio.getResources().put(Resource.TOXICITY, 20);
        tossico.resolveTimeBasedEffects();
        spazienzio.resolveTimeBasedEffects();
        assertEquals(80, tossico.getResources().get(Resource.HEALTH));
        assertEquals(20, tossico.getResources().get(Resource.TOXICITY));
        assertEquals(75, spazienzio.getResources().get(Resource.HEALTH));
        // Tossicone Scatarrante: 8 POISON e +5 T al bersaglio.
        ((AbstractCard) draft.card("junkie.Cough")).applyEffectOnTarget(tossico, spazienzio);
        assertEquals(67, spazienzio.getResources().get(Resource.HEALTH));
        assertEquals(25, spazienzio.getResources().get(Resource.TOXICITY));
        // Metabolismo Corrotto: HEALTH pari a T / 2, poi perde tutta la T.
        tossico.getResources().put(Resource.HEALTH, 50);
        tossico.getResources().put(Resource.TOXICITY, 31);
        ((AbstractCard) draft.card("junkie.PervertedMetabolism")).applyEffectOnSelf(tossico);
        assertEquals(65, tossico.getResources().get(Resource.HEALTH));
        assertEquals(0, tossico.getResources().get(Resource.TOXICITY));
        // L'ultima dose: 5 HIT a sé; 7 POISON e +4 T al bersaglio.
        AbstractCard last = (AbstractCard) draft.card("junkie.LethalHeroinDose");
        last.applyEffectOnSelf(tossico);
        last.applyEffectOnTarget(tossico, spazienzio);
        assertEquals(60, tossico.getResources().get(Resource.HEALTH));
        assertEquals(60, spazienzio.getResources().get(Resource.HEALTH));
        assertEquals(29, spazienzio.getResources().get(Resource.TOXICITY));
        // Raschiare il fondo: carburante a sé.
        ((AbstractCard) draft.card("base.tossico.bound.RaschiareIlFondo")).applyEffectOnSelf(tossico);
        assertEquals(7, tossico.getResources().get(Resource.TOXICITY));
    }

    /** SB-13: la base del listino ha anche il contesto del Tossico, e il gruppo «tettoavanzati» misura le sue tre bound e due sonde. */
    @Test
    void theListinoBaseHasTheToxicContextAndItsBoundCurves() throws Exception {
        Draft base = Listino.setBaseContexts(draft, 7);
        List<String> spec = Listino.SET_BASE_CONTEXTS.get(Listino.TOSSICO);
        Map<String, Integer> cards = base.cardsOf(Listino.TOSSICO), starter = draft.cardsOf(spec.get(0));
        assertEquals(2, cards.get(Listino.SLOT1));
        assertEquals(2, cards.get(Listino.SLOT2));
        assertFalse(cards.containsKey(spec.get(1)) || cards.containsKey(spec.get(2)));
        assertEquals(20, cards.values().stream().mapToInt(Integer::intValue).sum());
        assertEquals(starter, base.cardsOf(spec.get(0)), "lo starter resta com'è");
        Listino listino = new Listino(base, new Listino.Params(1, 1, 1, 1), heuristic());
        assertEquals(5, listino.curves().stream().filter(c -> c.group.equals("tettoavanzati")).count(), "tre bound e due sonde");
        // Senza lo starter del Tossico il contesto non nasce.
        ObjectNode root = json.deepCopy();
        ArrayNode decks = (ArrayNode) root.get("decks");
        for (int i = decks.size() - 1; i >= 0; i--) if (decks.get(i).get("id").asText().equals("starter-tossico")) decks.remove(i);
        Draft withoutToxic = Draft.parse("bozza senza lo starter del Tossico", root);
        assertFalse(Listino.setBaseContexts(withoutToxic, 7).deckIds().contains(Listino.TOSSICO));
    }
}
