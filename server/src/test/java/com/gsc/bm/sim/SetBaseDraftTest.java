package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.bot.BotPolicy;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Random;
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
 * «Tutto è droga», con le correzioni dei suoi giri. SB-14: lo starter di Pino «Chiude quando dico io», con la classe che spende tutta la
 * L (B1). SB-15: la bozza nel formato sb-6b/1 con le rarità della griglia, e lo starter di Gigi «Intervento sul posto», con la classe
 * che conta gli oggetti (D35). Le misure lunghe restano a richiesta (BenchMeasureTest, ListinoMeasureTest).
 * La bozza cresce blocco dopo blocco: i controlli sull'insieme (personaggi, mazzi, bound, partite del banco) contano tutti gli starter;
 * quelli che riguardano i soli starter base (copertura delle meccaniche, correzioni di SB-12a) usano {@link #BASE_STARTERS}.
 */
class SetBaseDraftTest {
    static final String RESOURCE = "/set-base/bozza.json";
    static final String SPAZIENZIO = "bruiser.character.BigBadBruiser", MARA = "base.character.Mara", TOSSICO = "junkie.character.ToxicJunkie",
            PINO = "base.character.Pino", GIGI = "base.character.Gigi";
    static final List<String> BASE_STARTERS = List.of("starter-spazienzio", "starter-mara");
    static final List<String> STARTERS = List.of("starter-spazienzio", "starter-mara", "starter-tossico", "starter-pino", "starter-gigi");

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
        // SB-13 aggiunge il Tossico, SB-14 Pino e SB-15 Gigi: cinque personaggi e cinque starter, ciascuno con la sua terza bound fuori dallo
        // starter.
        assertEquals(Set.of(SPAZIENZIO, MARA, TOSSICO, PINO, GIGI), draft.characterIds());
        assertEquals(new TreeSet<>(STARTERS), new TreeSet<>(draft.deckIds()));
        // Le terze bound stanno nella collezione: nella bozza, in nessuno starter.
        for (String third : List.of("base.spazienzio.bound.TestaAlMuro", "base.mara.bound.ColpoDiStriscio", "junkie.character.RottenSmile",
                "base.pino.bound.Coccio", "base.gigi.bound.Lima")) {
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
        assertEquals(15, report.bounds.size(), "le quindici bound della bozza, comprese le terze (tre per personaggio)");
        assertEquals(15L * 9 * 12, report.games(), "quindici coppie di mazzi fra cinque starter");
        assertTrue(report.checks.seatTurns > report.games() * 2, "i turni sono controllati");
    }

    /** Poche partite per ogni coppia ordinata dei cinque stili, compresi il bot attuale e il casuale: nessun errore, nessun limite. */
    @Test
    void everyPairOfStylesFinishesItsGames() throws Exception {
        Map<String, BotPolicy> styles = PlaygroundTest.styles();
        Bench.Report report = Bench.run(draft, new Bench.Settings(2, 7_300_000L, new ArrayList<>(draft.deckIds()), styles, 2,
                BoundCap.Params.DEFAULT, null));
        assertEquals(15L * styles.size() * styles.size() * 2, report.games(), "quindici coppie di mazzi fra cinque starter");
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
        assertEquals(11, checked, "D64/D71/D72: le 13 esposizioni dei cinque caricamenti diventano gettoni di ricerca");
        assertEquals(2, card("base.items.GuantiDaOfficina").get("self").get(0).get("turns").asInt());
        assertEquals(2, card("base.items.CascoDaLavoro").get("self").get(0).get("turns").asInt());
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
        assertEquals(10, shouting, "basic, tre bound e cinque carte d'archetipo");
    }

    /**
     * SB-12a, tre giri coi bot: salute iniziale di Spazienzio 85 e di Mara 80, costi di Mara −5 A su cinque carte (D38), Sgommata 25 CUT;
     * poi, con l'approvazione del proprietario, Cambio marcia +6 A. SB-16e/D38/D53: salute 75/70 per la durata.
     * I numeri dei giri stanno nel rapporto; qui si controlla che la bozza porti i valori scelti, testi compresi, perché i bot leggono il
     * danno nominale da gui.damageAmount.
     */
    @Test
    void theStartersCarryTheSb12aCorrections() {
        Map<String, Integer> health = new LinkedHashMap<>();
        for (JsonNode c : json.get("characters"))
            if (!Set.of(TOSSICO, PINO, GIGI).contains(c.get("id").asText())) health.put(c.get("id").asText(), c.get("resources").get("HEALTH").asInt());
        assertEquals(Map.of(SPAZIENZIO, 75, MARA, 70), health, "D38/D53, SB-16e: salute dei due base; gli avanzati hanno il loro test");
        Map<String, Integer> alertnessCosts = Map.of("base.mara.CinghiataDiTraverso", 5, "base.mara.Sgommata", 15,
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
        // D79 removes the double generic slots used by these historical SB-11/SB-15 price probes.
        Draft draft = Draft.fromFile(java.nio.file.Path.of("../docs/reports/set-base/sb-16g-2b1/draft.json"));
        JsonNode json = draft.json();
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
     * SB-16e/D38/D53 aggiorna salute e T iniziale a 70/15, senza cambiare le meccaniche qui provate.
     */
    @Test
    void theToxicStarterFollowsTheGridWithTheSb13Corrections() {
        JsonNode tossico = character(TOSSICO);
        Map<String, Integer> resources = new TreeMap<>();
        tossico.get("resources").fields().forEachRemaining(e -> resources.put(e.getKey(), e.getValue().asInt()));
        assertEquals(Map.of("HEALTH", 70, "ALERTNESS", 35, "VIOLENCE", 0, "TOXICITY", 15, "ALCOHOL", 0), resources, "D38/D53, SB-16e giro 3");
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
        expected.put("base.com.RincorsaDalMarciapiede", 1);
        expected.put("com.Steal", 1);
        expected.put("base.com.FasciaturaColFazzolettaccio", 1);
        expected.put("base.items.PasticcaTrovataSulBancone", 2);
        expected.put("base.items.PaninoDelKebab", 2);
        expected.put("com.items.MarvelousCocktail", 1);
        expected.put("base.tossico.UnAssaggino", 1);
        assertEquals(expected, new TreeMap<>(draft.cardsOf(deck)), "archetipo 10, generiche 5, oggetti 5, D79");

        // D34, punto 4: la bound di T dà al massimo +10; giro 3: +7, testi compresi.
        JsonNode raschiare = card("base.tossico.bound.RaschiareIlFondo");
        assertTrue(raschiare.get("self").get(0).get("amount").asInt() <= 10);
        assertEquals(7, raschiare.get("self").get(0).get("amount").asInt());
        assertEquals("+7 T", raschiare.get("gui").get("gains").asText());
        assertTrue(raschiare.get("gui").get("description").asText().contains("+7 T a sé"));
        // D55: MethDrivenRage diventa un caricamento gratuito; le altre tre carte restano a 10 T.
        assertTrue(draft.card("junkie.MethDrivenRage").getCost().isEmpty());
        for (String binding : List.of("junkie.Cough", "junkie.AmphetamineReflexes", "junkie.ToxicBloodDrain")) {
            JsonNode c = card(binding);
            assertEquals(1, c.get("cost").size(), binding);
            assertEquals(10, c.get("cost").get("TOXICITY").asInt(), binding);
            assertTrue(c.get("gui").get("description").asText().contains("· 10 T:"), binding + ": costo nel testo");
        }
        // D55/SB-16d: Tossicone Scatarrante da 8 a 12 POISON, testi compresi.
        JsonNode cough = card("junkie.Cough");
        assertEquals(12, cough.get("target").get(0).get("amount").asInt());
        assertEquals("POISON 12", cough.get("gui").get("damageAmount").asText());
        assertTrue(cough.get("gui").get("description").asText().contains("12 POISON e +5 T"));
        // Lo slot apre la descrizione delle dieci carte del Tossico.
        Pattern slot = Pattern.compile("^(TOS-(BA|BO\\d|AR\\d)|LR-TOS) · .*");
        int slots = 0;
        for (JsonNode c : json.get("cards"))
            if (slot.matcher(c.get("gui").path("description").asText("")).matches()) slots++;
        assertEquals(11, slots, "basic, tre bound, last resort e cinque carte d'archetipo");
    }

    /** Le meccaniche del Tossico su stati costruiti a mano: immunità al periodico di T, veleno al bersaglio, cura col veleno, ultima dose. */
    @Test
    void theToxicMechanicsWorkOnHandBuiltStates() {
        Character tossico = draft.character(TOSSICO), spazienzio = draft.character(SPAZIENZIO);
        // Effetto periodico di T (R06): il Tossico, immune, non lo subisce; gli altri perdono T / 2 di salute a fine turno.
        spazienzio.getResources().put(Resource.TOXICITY, 20);
        tossico.resolveTimeBasedEffects();
        spazienzio.resolveTimeBasedEffects();
        assertEquals(70, tossico.getResources().get(Resource.HEALTH));
        assertEquals(15, tossico.getResources().get(Resource.TOXICITY));
        assertEquals(65, spazienzio.getResources().get(Resource.HEALTH));
        // D55: Tossicone Scatarrante 12 POISON e +5 T al bersaglio.
        ((AbstractCard) draft.card("junkie.Cough")).applyEffectOnTarget(tossico, spazienzio);
        assertEquals(53, spazienzio.getResources().get(Resource.HEALTH));
        assertEquals(25, spazienzio.getResources().get(Resource.TOXICITY));
        // Metabolismo Corrotto: HEALTH pari a T / 2, poi perde tutta la T.
        tossico.getResources().put(Resource.HEALTH, 50);
        tossico.getResources().put(Resource.TOXICITY, 31);
        ((AbstractCard) draft.card("junkie.PervertedMetabolism")).applyEffectOnSelf(tossico);
        assertEquals(65, tossico.getResources().get(Resource.HEALTH));
        assertEquals(0, tossico.getResources().get(Resource.TOXICITY));
        // L'ultima dose: 2 HIT a sé (SB-16e2, D56/D38: era 5); 7 POISON e +4 T al bersaglio.
        AbstractCard last = (AbstractCard) draft.card("junkie.LethalHeroinDose");
        last.applyEffectOnSelf(tossico);
        last.applyEffectOnTarget(tossico, spazienzio);
        assertEquals(63, tossico.getResources().get(Resource.HEALTH), "SB-16e2, D56: 2 HIT a sé");
        assertEquals(46, spazienzio.getResources().get(Resource.HEALTH));
        assertEquals(29, spazienzio.getResources().get(Resource.TOXICITY));
        // Raschiare il fondo: carburante a sé.
        ((AbstractCard) draft.card("base.tossico.bound.RaschiareIlFondo")).applyEffectOnSelf(tossico);
        assertEquals(7, tossico.getResources().get(Resource.TOXICITY));
    }

    /** SB-13: la base del listino ha anche il contesto del Tossico, e il gruppo «tettoavanzati» misura le sue tre bound e due sonde. */
    @Test
    void theListinoBaseHasTheToxicContextAndItsBoundCurves() throws Exception {
        // D79 removes the double generic slots used by these historical SB-11/SB-15 price probes.
        Draft draft = Draft.fromFile(java.nio.file.Path.of("../docs/reports/set-base/sb-16g-2b1/draft.json"));
        JsonNode json = draft.json();
        Draft base = Listino.setBaseContexts(draft, 7);
        List<String> spec = Listino.SET_BASE_CONTEXTS.get(Listino.TOSSICO);
        Map<String, Integer> cards = base.cardsOf(Listino.TOSSICO), starter = draft.cardsOf(spec.get(0));
        assertEquals(2, cards.get(Listino.SLOT1));
        assertEquals(2, cards.get(Listino.SLOT2));
        assertFalse(cards.containsKey(spec.get(1)) || cards.containsKey(spec.get(2)));
        assertEquals(20, cards.values().stream().mapToInt(Integer::intValue).sum());
        assertEquals(starter, base.cardsOf(spec.get(0)), "lo starter resta com'è");
        Listino listino = new Listino(base, new Listino.Params(1, 1, 1, 1), heuristic());
        assertEquals(5, listino.curves().stream().filter(c -> c.group.equals("tettoavanzati") && c.context.equals("starter-tossico")).count(),
                "tre bound e due sonde (SB-14 aggiunge le cinque di Pino, che hanno la loro prova)");
        // Senza lo starter del Tossico il contesto non nasce.
        ObjectNode root = json.deepCopy();
        ArrayNode decks = (ArrayNode) root.get("decks");
        for (int i = decks.size() - 1; i >= 0; i--) if (decks.get(i).get("id").asText().equals("starter-tossico")) decks.remove(i);
        Draft withoutToxic = Draft.parse("bozza senza lo starter del Tossico", root);
        assertFalse(Listino.setBaseContexts(withoutToxic, 7).deckIds().contains(Listino.TOSSICO));
    }

    // ---- SB-14: lo starter di Pino «Chiude quando dico io» ----

    /** La salute iniziale di Pino (SB-9 meno 15, ipotesi della scala di D41, poi i giri coi bot di SB-14). */
    static final int PINO_HEALTH = 85; // SB-16e giro 3, delega D38/D53: durata dopo la prova sulla L.
    /** La L iniziale di Pino: 20 in SB-14, 10 nel giro 2 di SB-16e (D38/D53). */
    static final int PINO_ALCOHOL = 10;

    /**
     * SB-14: lo starter di Pino come nella griglia (basic, due bound comuni, last resort propria, 9 carte d'archetipo, 6 generiche, 5 oggetti).
     * D34, punto 7: costi di 5 L o meno e bound di L entro +10; nessuna carta a costo A nello starter, perché la sua A scende sotto zero
     * (griglia, «L e Pino»). Testi compresi, perché i bot leggono costi, guadagni e danno nominale.
     */
    @Test
    void thePinoStarterFollowsTheGrid() {
        JsonNode pino = character(PINO);
        Map<String, Integer> resources = new TreeMap<>();
        pino.get("resources").fields().forEachRemaining(e -> resources.put(e.getKey(), e.getValue().asInt()));
        assertEquals(Map.of("HEALTH", PINO_HEALTH, "ALERTNESS", 15, "VIOLENCE", 0, "TOXICITY", 0, "ALCOHOL", PINO_ALCOHOL), resources);
        assertEquals(2, pino.get("items").asInt(), "capacità 2 (SB-9)");
        assertTrue(draft.character(PINO).getImmunities().isEmpty(), "nessuna immunità a L (D28)");
        assertEquals("Piera Ultimo Giro", pino.get("name").asText());

        String deck = "starter-pino";
        assertEquals(PINO, draft.characterOf(deck));
        assertEquals("base.pino.QuestoLoFiniscoIo", draft.basicOf(deck));
        assertEquals(List.of("base.pino.bound.CinqueMinutiEVado", "base.pino.bound.SpallataAlBancone"), draft.boundOf(deck));
        assertEquals("base.pino.UltimoGiro", draft.lastResortOf(deck));
        assertEquals(PINO, card("base.pino.UltimoGiro").get("exclusiveTo").asText(), "last resort propria (D29)");
        Map<String, Integer> expected = new TreeMap<>();
        expected.put("base.pino.TestataDaUltimoGiro", 2);
        expected.put("base.pino.GoingBerserk", 2);
        expected.put("base.pino.IlBanconeRegge", 2);
        expected.put("base.pino.OffroIo", 2);
        expected.put("base.pino.RuttoADistanzaSociale", 1);
        expected.put("com.Grab", 2);
        expected.put("base.com.Spintone", 2);
        expected.put("base.com.FasciaturaColFazzolettaccio", 1);
        expected.put("base.items.AmaroNelBicchiereDiPlastica", 2);
        expected.put("com.items.RottenBeer", 2);
        expected.put("com.items.AnotherRottenBeer", 1);
        expected.put("base.pino.PrimaIlBrindisi", 1);
        assertEquals(expected, new TreeMap<>(draft.cardsOf(deck)), "archetipo 10, generiche 5, oggetti 5, D79");

        // D34, punto 7 (e D33): ogni carta di Pino costa al massimo 5 L e nessuna carta dello starter costa A.
        for (String binding : draft.cardsOf(deck).keySet()) {
            Map<Resource, Integer> cost = draft.card(binding).getCost();
            assertFalse(cost.containsKey(Resource.ALERTNESS), binding + ": niente costi in A nello starter di Pino");
            assertTrue(cost.getOrDefault(Resource.ALCOHOL, 0) <= 5, binding + ": costo in L entro 5");
        }
        for (String binding : List.of("base.pino.TestataDaUltimoGiro", "base.pino.RuttoADistanzaSociale")) {
            assertEquals(Map.of(Resource.ALCOHOL, 5), draft.card(binding).getCost(), binding);
            assertTrue(card(binding).get("gui").get("description").asText().contains("· 5 L:"), binding + ": costo nel testo");
        }
        // Le due carte che spendono tutta la L sono gratuite (B1, D33).
        assertTrue(draft.card("base.pino.GoingBerserk").getCost().isEmpty());
        assertTrue(draft.card("base.pino.UltimoGiro").getCost().isEmpty());
        // Giro 2 di SB-14: le due carte che spendono tutta la L partono da 10 e da 12 (erano 3 e 6), testi compresi, perché i bot leggono
        // Il numero del danno nominale; la last resort tiene un danno a sé (D29), 2 HIT da SB-16e2 (D56/D38, era 5). SB-16e/D38/D53: Testata a 25 HIT con salute ridotta.
        JsonNode berserk = card("base.pino.GoingBerserk"), last = card("base.pino.UltimoGiro"), testata = card("base.pino.TestataDaUltimoGiro");
        assertEquals(10, berserk.get("params").get("base").asInt());
        assertEquals(0, berserk.get("params").get("selfHit").asInt());
        assertEquals("HIT 10+x", berserk.get("gui").get("damageAmount").asText());
        assertTrue(berserk.get("gui").get("description").asText().contains("HIT pari a 10 più la propria L residua"));
        assertEquals(12, last.get("params").get("base").asInt());
        assertEquals(2, last.get("params").get("selfHit").asInt(), "SB-16e2, D56/D38");
        assertEquals("HIT 12+x", last.get("gui").get("damageAmount").asText());
        assertTrue(last.get("gui").get("description").asText().contains("2 HIT a sé; HIT pari a 12 più la propria L residua"));
        assertEquals(25, testata.get("target").get(0).get("amount").asInt(), "D38/D53: pressione di Piera con meno salute, SB-16e");
        assertEquals("HIT 25", testata.get("gui").get("damageAmount").asText());
        assertTrue(testata.get("gui").get("description").asText().contains("5 HIT a sé; 25 HIT al bersaglio"));
        // D34, punto 7: la bound di L dà al massimo +10, testi compresi.
        JsonNode cinque = card("base.pino.bound.CinqueMinutiEVado");
        int alcohol = cinque.get("self").get(0).get("amount").asInt();
        assertTrue(alcohol <= 10);
        assertEquals("+" + alcohol + " L", cinque.get("gui").get("gains").asText());
        assertTrue(cinque.get("gui").get("description").asText().contains("+" + alcohol + " L a sé"));
        // Lo slot apre la descrizione delle dieci carte di Pino.
        Pattern slot = Pattern.compile("^(PIN-(BA|BO\\d|AR\\d)|LR-PIN) · .*");
        int slots = 0;
        for (JsonNode c : json.get("cards"))
            if (slot.matcher(c.get("gui").path("description").asText("")).matches()) slots++;
        assertEquals(11, slots, "basic, tre bound, last resort e cinque carte d'archetipo");
    }

    /** Una partita fra Pino e Spazienzio, per giocare una carta di Pino con la sua logica speciale (la L memorizzata). */
    private static Game pinoAgainstSpazienzio() {
        Player a = draft.player("starter-pino", "seat-1", new Random(1), null);
        Player b = draft.player("starter-spazienzio", "seat-2", new Random(2), null);
        return new Game(List.of(a, b), "sim", false);
    }

    private static void resolveOnOpponent(Game game, String binding) {
        Card card = draft.card(binding);
        game.getPlayers().get("seat-1").getCardsInHand().add(card);
        card.resolve(game, new Move(card.getName(), "seat-1", "seat-2", game.getGameId(), new java.util.HashMap<>()));
    }

    /**
     * Le meccaniche di Pino su stati costruiti a mano: la L che cala (R06) e la A che va sotto zero (R01, Q10 della scheda); le due carte che
     * spendono tutta la L con la classe di B1, che memorizza, azzera e colpisce (R04 applica gli effetti su sé prima di quelli sul bersaglio);
     * il Rutto che legge la L senza consumarla, «Offro io» e il Bancone.
     */
    @Test
    void thePinoMechanicsWorkOnHandBuiltStates() {
        // R06: con L 10 a fine turno Pino perde 5 A e resta con 4 L.
        Character pino = draft.character(PINO);
        pino.getResources().put(Resource.ALCOHOL, 10);
        pino.resolveTimeBasedEffects();
        assertEquals(10, pino.getResources().get(Resource.ALERTNESS));
        assertEquals(4, pino.getResources().get(Resource.ALCOHOL));
        // A sotto zero (R01): con 20 L perde 10 A, poi Fasciatura ne toglie altri 5; nessuna carta si rompe.
        pino.getResources().put(Resource.ALCOHOL, 20);
        pino.resolveTimeBasedEffects();
        assertEquals(0, pino.getResources().get(Resource.ALERTNESS));
        ((AbstractCard) draft.card("base.com.FasciaturaColFazzolettaccio")).applyEffectOnSelf(pino);
        assertEquals(-5, pino.getResources().get(Resource.ALERTNESS));

        // Estasi da Coca Etilene: HIT pari a 3 più la L residua, poi la L a zero; nessun danno a sé.
        Game game = pinoAgainstSpazienzio();
        Character me = game.getPlayers().get("seat-1").getCharacter(), spazienzio = game.getPlayers().get("seat-2").getCharacter();
        me.getResources().put(Resource.ALCOHOL, 12);
        int berserk = card("base.pino.GoingBerserk").get("params").get("base").asInt(),
                last = card("base.pino.UltimoGiro").get("params").get("base").asInt();
        int health = 75 - berserk - 12; // SB-16e: salute iniziale di Spazienzio.
        resolveOnOpponent(game, "base.pino.GoingBerserk");
        assertEquals(health, spazienzio.getResources().get(Resource.HEALTH));
        assertEquals(0, me.getResources().get(Resource.ALCOHOL));
        assertEquals(PINO_HEALTH, me.getResources().get(Resource.HEALTH));
        // Con L a zero resta il danno fisso.
        resolveOnOpponent(game, "base.pino.GoingBerserk");
        health -= berserk;
        assertEquals(health, spazienzio.getResources().get(Resource.HEALTH));
        // L'ultimo giro: 2 HIT a sé (SB-16e2, D56), HIT pari a 12 più la L residua, poi la L a zero; è una last resort.
        me.getResources().put(Resource.ALCOHOL, 9);
        resolveOnOpponent(game, "base.pino.UltimoGiro");
        health -= last + 9;
        assertEquals(health, spazienzio.getResources().get(Resource.HEALTH));
        assertEquals(PINO_HEALTH - 2, me.getResources().get(Resource.HEALTH), "SB-16e2, D56: 2 HIT a sé");
        assertEquals(0, me.getResources().get(Resource.ALCOHOL));
        assertTrue(draft.card("base.pino.UltimoGiro").isLastResort());
        assertFalse(draft.card("base.pino.GoingBerserk").isLastResort());
        // Rutto: il bersaglio perde A pari alla L residua di Pino, che non si consuma; poi 5 HIT.
        me.getResources().put(Resource.ALCOHOL, 6);
        resolveOnOpponent(game, "base.pino.RuttoADistanzaSociale");
        assertEquals(20 - 6, spazienzio.getResources().get(Resource.ALERTNESS));
        assertEquals(health - 5, spazienzio.getResources().get(Resource.HEALTH));
        assertEquals(6, me.getResources().get(Resource.ALCOHOL));
        // D55: Offro io diventa Un altro e arrivo, caricamento SELF; niente L regalata al bersaglio.
        Card charge = draft.card("base.pino.OffroIo");
        game.getPlayers().get("seat-1").getCardsInHand().add(charge);
        charge.resolve(game, new Move(charge.getName(), "seat-1", "SELF", game.getGameId(), new java.util.HashMap<>()));
        assertEquals(6, me.getResources().get(Resource.ALCOHOL), "D72: il guadagno attende l'esito della ricerca nel motore d50");
        assertEquals(15, me.getResources().get(Resource.ALERTNESS));
        assertEquals(Map.of(Resource.ALCOHOL, 15, Resource.ALERTNESS, 35), me.takeSearchGains(true));
        assertEquals(0, spazienzio.getResources().get(Resource.ALCOHOL));
        assertEquals(14, spazienzio.getResources().get(Resource.ALERTNESS));
        // Il bancone regge: HIT ricevuto a metà in questo turno, +5 L.
        Character standing = draft.character(PINO), hitter = draft.character(SPAZIENZIO);
        ((AbstractCard) draft.card("base.pino.IlBanconeRegge")).applyEffectOnSelf(standing);
        assertEquals(PINO_ALCOHOL + 5, standing.getResources().get(Resource.ALCOHOL));
        hitter.inflictDamage(standing, new Damage(Damage.DamageType.HIT, 20));
        assertEquals(PINO_HEALTH - 10, standing.getResources().get(Resource.HEALTH));
    }

    /** SB-14: la base del listino ha anche il contesto di Pino, e il gruppo «tettoavanzati» misura le sue tre bound e due sonde. */
    @Test
    void theListinoBaseHasThePinoContextAndItsBoundCurves() throws Exception {
        // D79 removes the double generic slots used by these historical SB-11/SB-15 price probes.
        Draft draft = Draft.fromFile(java.nio.file.Path.of("../docs/reports/set-base/sb-16g-2b1/draft.json"));
        JsonNode json = draft.json();
        Draft base = Listino.setBaseContexts(draft, 7);
        List<String> spec = Listino.SET_BASE_CONTEXTS.get(Listino.PINO);
        Map<String, Integer> cards = base.cardsOf(Listino.PINO), starter = draft.cardsOf(spec.get(0));
        assertEquals(2, cards.get(Listino.SLOT1));
        assertEquals(2, cards.get(Listino.SLOT2));
        assertFalse(cards.containsKey(spec.get(1)) || cards.containsKey(spec.get(2)));
        assertTrue(cards.containsKey("com.Grab"), "Grab resta: la L arriva dagli oggetti");
        assertEquals(20, cards.values().stream().mapToInt(Integer::intValue).sum());
        assertEquals(starter, base.cardsOf(spec.get(0)), "lo starter resta com'è");
        Listino listino = new Listino(base, new Listino.Params(1, 1, 1, 1), heuristic());
        assertEquals(15, listino.curves().stream().filter(c -> c.group.equals("tettoavanzati")).count(),
                "tre bound e due sonde per Tossico, Pino e Gigi (SB-15)");
        assertEquals(5, listino.curves().stream().filter(c -> c.group.equals("tettoavanzati") && c.context.equals("starter-pino")).count());
        assertTrue(listino.bisections().stream().anyMatch(b -> b.context.equals(Listino.PINO) && b.group.equals("costo")), "il prezzo della L di Pino");
        // Ogni bozza derivata per Pino è valida: anche le curve «salute», che clonano il personaggio con la sua last resort Java.
        int derived = 0;
        for (Listino.Curve c : listino.curves())
            if (c.context.equals(Listino.PINO) || c.context.equals("starter-pino")) {
                base.derive(c.id, c.builder.build(0).root);
                derived++;
            }
        for (Listino.Bisection b : listino.bisections())
            if (b.context.equals(Listino.PINO)) {
                base.derive(b.id, b.builder.build(b.lo).root);
                derived++;
            }
        assertEquals(10, derived, "quattro curve di salute, cinque di tetto e il prezzo della L");
        // Senza lo starter di Pino il contesto non nasce.
        ObjectNode root = json.deepCopy();
        ArrayNode decks = (ArrayNode) root.get("decks");
        for (int i = decks.size() - 1; i >= 0; i--) if (decks.get(i).get("id").asText().equals("starter-pino")) decks.remove(i);
        Draft withoutPino = Draft.parse("bozza senza lo starter di Pino", root);
        assertFalse(Listino.setBaseContexts(withoutPino, 7).deckIds().contains(Listino.PINO));
    }

    // ---- SB-15, parte 1: le rarità della griglia nella bozza (D44, punto 6; Q5 di SB-6b) ----

    /** Lo slot della griglia di ogni personaggio della bozza. */
    static final Map<String, String> CHARACTER_SLOTS = Map.of(SPAZIENZIO, "PG-SPA", MARA, "PG-MAR", TOSSICO, "PG-TOS", PINO, "PG-PIN",
            GIGI, "PG-GIG");
    /**
     * Le rarità della griglia (colonna «Rarità»: C, NC, R) per ogni slot che la bozza contiene, elencate qui perché la prova non legga i
     * documenti. Le stesse le scrive e le confronta col file della griglia docs/reports/set-base/sb-6b/rarita-bozza.py (--check).
     */
    // D79: approved step-2 rarities, including the five new NC titles.
    static final Map<String, Set<String>> GRID_RARITIES = Map.of(
            "COMMON", Set.of("GEN-01", "GEN-02", "GEN-05", "GEN-06", "GEN-12", "GEN-13", "GEN-14", "GEN-16", "GEN-17", "GEN-18", "GIG-AR4", "GIG-BO1", "GIG-BO2", "LR-STR", "MAR-AR3", "MAR-BA", "MAR-BO1", "MAR-BO2", "OGG-01", "OGG-02", "OGG-05", "OGG-06", "OGG-07", "OGG-10", "OGG-11", "OGG-12", "PG-MAR", "PG-SPA", "PIN-AR1", "PIN-AR3", "PIN-BO1", "PIN-BO2", "SPA-AR4", "SPA-BA", "SPA-BO1", "SPA-BO2", "TOS-AR3", "TOS-BO1", "TOS-BO2"),
            "UNCOMMON", Set.of("GEN-07", "GIG-AR1", "GIG-AR2", "GIG-AR3", "GIG-AR6", "GIG-BA", "GIG-BO3", "LR-PIN", "LR-TOS", "MAR-AR2", "MAR-AR4", "MAR-AR5", "MAR-AR6", "MAR-BO3", "OGG-03", "OGG-09", "OGG-13", "PG-GIG", "PG-PIN", "PG-TOS", "PIN-AR2", "PIN-AR4", "PIN-AR6", "PIN-BA", "PIN-BO3", "SPA-AR1", "SPA-AR3", "SPA-AR5", "SPA-AR6", "SPA-BO3", "TOS-AR1", "TOS-AR2", "TOS-AR4", "TOS-AR6", "TOS-BA", "TOS-BO3"),
            "RARE", Set.of("GIG-AR5", "MAR-AR1", "OGG-04", "PIN-AR5", "SPA-AR2", "TOS-AR5"));

    private static String gridRarity(String slot) {
        List<String> found = new ArrayList<>();
        GRID_RARITIES.forEach((rarity, slots) -> { if (slots.contains(slot)) found.add(rarity); });
        assertEquals(1, found.size(), slot + ": una e una sola rarità nell'elenco della griglia");
        return found.get(0);
    }

    /**
     * SB-15, parte 1: la bozza è nel formato sb-6b/1, set «base» in versione «bozza», e ogni carta e personaggio ha la rarità della griglia,
     * nel vocabolario di R07. Lo slot si legge all'inizio della descrizione delle carte. Le rare negli starter sono 1 o 2 (griglia, «Per rarità»).
     */
    @Test
    void everyCardAndCharacterHasTheGridRarity() {
        assertEquals(Draft.FORMAT_SETS, draft.format);
        assertEquals(List.of("base"), new ArrayList<>(draft.sets().keySet()));
        Draft.SetInfo base = draft.sets().get("base");
        assertEquals("Set Base", base.name);
        assertEquals("bozza", base.version, "una bozza in lavorazione, non il Set Base 0.1 del documento di set");
        assertTrue(base.requires.isEmpty());

        Pattern slot = Pattern.compile("^([A-Z]{2,3}-[A-Z0-9]+) · .*");
        Map<String, Integer> counts = new TreeMap<>();
        for (String binding : draft.cardBindings()) {
            Matcher m = slot.matcher(card(binding).get("gui").path("description").asText(""));
            assertTrue(m.matches(), binding + ": lo slot apre la descrizione");
            String rarity = draft.rarityOf(binding);
            assertTrue(Draft.RARITIES.contains(rarity), binding + ": rarità " + rarity + " fuori dal vocabolario di R07");
            assertEquals(gridRarity(m.group(1)), rarity, binding + " (" + m.group(1) + ")");
            assertEquals("base", draft.setOfCard(binding));
            counts.merge(rarity, 1, Integer::sum);
        }
        assertEquals(new TreeSet<>(CHARACTER_SLOTS.keySet()), new TreeSet<>(draft.characterIds()), "ogni personaggio ha il suo slot");
        for (String id : draft.characterIds()) {
            String rarity = draft.characterRarity(id);
            assertTrue(Draft.RARITIES.contains(rarity), id + ": rarità " + rarity + " fuori dal vocabolario di R07");
            assertEquals(gridRarity(CHARACTER_SLOTS.get(id)), rarity, id);
        }
        assertEquals(Map.of("COMMON", 37, "RARE", 6, "UNCOMMON", 33), counts, "le 76 carte della bozza, D79");
        for (String deck : STARTERS) {
            long rares = draft.cardsOf(deck).keySet().stream().filter(b -> "RARE".equals(draft.rarityOf(b))).count();
            assertTrue(rares >= 1 && rares <= 2, deck + ": " + rares + " rare distinte");
        }
    }

    // ---- SB-15, parte 2: lo starter di Gigi «Intervento sul posto» ----

    /** La salute iniziale di Gigi: 100 nella scheda, 85 nel giro 1 di SB-15 (SB-9 meno 15, la scala di D41), 95 dal giro 2. */
    static final int GIGI_HEALTH = 80; // SB-16e/D38/D53: durata e patte dello specchio.
    /** La V iniziale di Gigi: 15 nella scheda, 25 dal giro 2 di SB-15 (le carte pagate in V restavano morte in mano). */
    static final int GIGI_VIOLENCE = 25;

    /**
     * SB-15: lo starter di Gigi come nella griglia (basic, due bound comuni, Struggle, 7 carte d'archetipo, 6 generiche, 7 oggetti), capacità
     * 3, costi in V. Testi compresi, perché i bot leggono costi, guadagni e danno nominale. Giro 2: salute 95, V iniziale 25, «Lavoro fatto
     * bene» a 5 V invece di 10, Chiave da tredici a 12 CUT invece di 10 (la linea della fascia F1).
     */
    @Test
    void theGigiStarterFollowsTheGrid() {
        JsonNode gigi = character(GIGI);
        Map<String, Integer> resources = new TreeMap<>();
        gigi.get("resources").fields().forEachRemaining(e -> resources.put(e.getKey(), e.getValue().asInt()));
        assertEquals(Map.of("HEALTH", GIGI_HEALTH, "ALERTNESS", 25, "VIOLENCE", GIGI_VIOLENCE, "TOXICITY", 0, "ALCOHOL", 0), resources);
        assertEquals(3, gigi.get("items").asInt(), "capacità 3, l'unico (SB-9)");
        assertTrue(draft.character(GIGI).getImmunities().isEmpty());
        assertEquals("Beppe Bulletta", gigi.get("name").asText());

        String deck = "starter-gigi";
        assertEquals(GIGI, draft.characterOf(deck));
        assertEquals("base.gigi.QuestoTornaUtile", draft.basicOf(deck));
        assertEquals(List.of("base.gigi.bound.UnaStrettaEPassa", "base.gigi.bound.ColpoDiCacciavite"), draft.boundOf(deck));
        assertEquals("com.last.Struggle", draft.lastResortOf(deck), "nessuna last resort propria (scheda di Gigi)");
        Map<String, Integer> expected = new TreeMap<>();
        expected.put("bruiser.BreakYourToy", 2);
        expected.put("base.gigi.ChiaveDaTredici", 2);
        expected.put("base.gigi.ColpoDiChiaveInglese", 2);
        expected.put("base.gigi.SottoIlCofano", 1);
        expected.put("base.gigi.LavoroFattoBene", 1);
        expected.put("com.Steal", 2);
        expected.put("bruiser.SeagullFly", 1);
        expected.put("base.com.Spintone", 1);
        expected.put("base.items.GuantiDaOfficina", 2);
        expected.put("base.items.GiubbottoDiFintaPelle", 2);
        expected.put("base.items.CascoDaLavoro", 2);
        expected.put("base.items.EspressoDelDistributore", 1);
        expected.put("base.gigi.UnaStrettaDiProva", 1);
        assertEquals(expected, new TreeMap<>(draft.cardsOf(deck)), "archetipo 9, generiche 4, oggetti 7, D79");
        assertEquals(7, draft.cardsOf(deck).entrySet().stream().filter(e -> draft.card(e.getKey()).isItem()).mapToInt(Map.Entry::getValue).sum());

        // Costi in V delle carte d'archetipo, testi compresi; Smontiamo tutto è la classe di oggi con costo e priorità della bozza.
        Map<String, Integer> violence = Map.of("bruiser.BreakYourToy", 5, "base.gigi.ChiaveDaTredici", 5, "base.gigi.SottoIlCofano", 5,
                "base.gigi.LavoroFattoBene", 5);
        violence.forEach((binding, cost) -> {
            assertEquals(Map.of(Resource.VIOLENCE, cost), draft.card(binding).getCost(), binding);
            assertTrue(card(binding).get("gui").get("description").asText().contains("· " + cost + " V:"), binding + ": costo nel testo");
        });
        assertTrue(draft.card("base.gigi.ColpoDiChiaveInglese").getCost().isEmpty());
        assertEquals(1, draft.card("bruiser.BreakYourToy").getPriority());
        assertEquals(Set.of(Card.CardTarget.FAR_ITEM), draft.card("bruiser.BreakYourToy").getCanTarget(), "distrugge un oggetto lontano");
        // I numeri d'attacco, testi compresi: i bot leggono il danno nominale.
        JsonNode chiave = card("base.gigi.ChiaveDaTredici"), colpo = card("base.gigi.ColpoDiChiaveInglese"), lavoro = card("base.gigi.LavoroFattoBene");
        assertEquals(12, chiave.get("target").get(0).get("amount").asInt());
        assertEquals("CUT 12", chiave.get("gui").get("damageAmount").asText());
        assertTrue(chiave.get("gui").get("description").asText().contains("12 CUT"));
        // D55: il piccolo HIT diventa Preparo il lavoro, generatore con ricerca.
        assertEquals(10, colpo.get("self").get(0).get("foundGains").get("VIOLENCE").asInt());
        assertEquals(5, colpo.get("self").get(0).get("missedGains").get("VIOLENCE").asInt(), "D72");
        assertEquals("RESOURCES", colpo.get("gui").get("role").asText());
        assertEquals("—", colpo.get("gui").get("damageAmount").asText());
        int base = lavoro.get("params").get("base").asInt(), perItem = lavoro.get("params").get("perItem").asInt();
        assertEquals(6, base);
        assertEquals(4, perItem);
        assertEquals("HIT " + base + "+x", lavoro.get("gui").get("damageAmount").asText());
        assertTrue(lavoro.get("gui").get("description").asText().contains("HIT pari a " + base + " più " + perItem + " per ogni proprio oggetto"));
        // Le bound: +5 V e 3 HIT nello starter (D33, D36), 2 CUT veloce nella collezione; nessuna tocca gli oggetti.
        assertEquals(5, card("base.gigi.bound.UnaStrettaEPassa").get("self").get(0).get("amount").asInt());
        assertEquals("+5 V", card("base.gigi.bound.UnaStrettaEPassa").get("gui").get("gains").asText());
        assertEquals(3, card("base.gigi.bound.ColpoDiCacciavite").get("target").get(0).get("amount").asInt());
        assertEquals(2, card("base.gigi.bound.Lima").get("target").get(0).get("amount").asInt());
        assertEquals(2, draft.card("base.gigi.bound.Lima").getPriority());
        for (String b : List.of("base.gigi.bound.UnaStrettaEPassa", "base.gigi.bound.ColpoDiCacciavite", "base.gigi.bound.Lima"))
            for (Card.CardTarget target : draft.card(b).getCanTarget())
                assertFalse(target == Card.CardTarget.NEAR_ITEM || target == Card.CardTarget.FAR_ITEM, b + ": nessuna bound tocca gli oggetti");
        // Gli equip di Gigi: Guanti HIT inflitto ×1,25, Casco HIT ricevuto ×0,8, per 3 turni.
        JsonNode guanti = card("base.items.GuantiDaOfficina").get("self").get(0), casco = card("base.items.CascoDaLavoro").get("self").get(0);
        assertTrue(guanti.get("equip").asBoolean() && casco.get("equip").asBoolean());
        assertEquals("OUTPUT", guanti.get("flow").asText());
        assertEquals(1.25, guanti.get("factor").asDouble());
        assertEquals("INPUT", casco.get("flow").asText());
        assertEquals(0.8, casco.get("factor").asDouble());
        // Lo slot apre la descrizione delle nove carte di Gigi (Struggle è generica).
        Pattern slot = Pattern.compile("^GIG-(BA|BO\\d|AR\\d) · .*");
        int slots = 0;
        for (JsonNode c : json.get("cards"))
            if (slot.matcher(c.get("gui").path("description").asText("")).matches()) slots++;
        assertEquals(10, slots, "basic, tre bound e cinque carte d'archetipo");
    }

    /** Una partita fra Gigi e Spazienzio, coi tavoli svuotati: gli oggetti si mettono a mano. */
    private static Game gigiAgainstSpazienzio() {
        Player a = draft.player("starter-gigi", "seat-1", new Random(1), null);
        Player b = draft.player("starter-spazienzio", "seat-2", new Random(2), null);
        Game game = new Game(List.of(a, b), "sim", false);
        a.getCharacter().getItems().clear();
        b.getCharacter().getItems().clear();
        return game;
    }

    private static void resolveOnOpponentItem(Game game, String binding, String item) {
        Card card = draft.card(binding);
        game.getPlayers().get("seat-1").getCardsInHand().add(card);
        Map<Move.AdditionalAction, String> choices = new java.util.HashMap<>();
        choices.put(Move.AdditionalAction.TARGET_ITEM, item);
        card.resolve(game, new Move(card.getName(), "seat-1", "seat-2", game.getGameId(), choices));
    }

    /**
     * Le meccaniche di Gigi su stati costruiti a mano: «Lavoro fatto bene» con 0, 1 e 3 oggetti sul campo (la classe nuova, D35), la capacità
     * 3 che scaccia l'oggetto più vecchio, Smontiamo tutto che distrugge un oggetto lontano e non fa nulla a tavolo vuoto, i Guanti che
     * moltiplicano l'HIT inflitto, Sotto il cofano e il Casco.
     */
    @Test
    void theGigiMechanicsWorkOnHandBuiltStates() {
        Game game = gigiAgainstSpazienzio();
        Character me = game.getPlayers().get("seat-1").getCharacter(), spazienzio = game.getPlayers().get("seat-2").getCharacter();
        JsonNode lavoro = card("base.gigi.LavoroFattoBene");
        int base = lavoro.get("params").get("base").asInt(), perItem = lavoro.get("params").get("perItem").asInt();
        int health = spazienzio.getResources().get(Resource.HEALTH);
        // Tavolo vuoto: il solo danno fisso.
        resolveOnOpponent(game, "base.gigi.LavoroFattoBene");
        health -= base;
        assertEquals(health, spazienzio.getResources().get(Resource.HEALTH), "0 oggetti");
        // Un oggetto.
        me.getItems().add(draft.card("base.items.CascoDaLavoro"));
        resolveOnOpponent(game, "base.gigi.LavoroFattoBene");
        health -= base + perItem;
        assertEquals(health, spazienzio.getResources().get(Resource.HEALTH), "1 oggetto");
        // Tre oggetti, la capacità; il quarto scaccia il più vecchio e il conto resta 3.
        me.getItems().add(draft.card("base.items.GiubbottoDiFintaPelle"));
        me.getItems().add(draft.card("base.items.EspressoDelDistributore"));
        resolveOnOpponent(game, "base.gigi.LavoroFattoBene");
        health -= base + 3 * perItem;
        assertEquals(health, spazienzio.getResources().get(Resource.HEALTH), "3 oggetti");
        me.getItems().add(draft.card("base.items.GuantiDaOfficina"));
        assertEquals(3, me.getItems().size(), "capacità 3");
        assertFalse(me.getItems().stream().anyMatch(i -> i.getName().equals("Casco da lavoro")), "il più vecchio esce");
        // Gli equip non contano: consumati i Guanti (equip, HIT inflitto ×1,25), restano 2 oggetti; il danno sale di un quarto.
        Card guanti = me.getItems().stream().filter(i -> i.getName().equals("Guanti da officina")).findFirst().orElseThrow();
        me.getItems().remove(guanti);
        ((AbstractCard) guanti).applyEffectOnSelf(me);
        assertTrue(me.getStatuses().stream().anyMatch(s -> s.isEquip()), "i Guanti sono un equip");
        Character reference = draft.character(SPAZIENZIO);
        me.inflictDamage(reference, new Damage(Damage.DamageType.HIT, base + 2 * perItem));
        int gloved = 75 - reference.getResources().get(Resource.HEALTH);
        assertTrue(gloved > base + 2 * perItem, "i Guanti moltiplicano l'HIT inflitto: " + gloved);
        resolveOnOpponent(game, "base.gigi.LavoroFattoBene");
        health -= gloved;
        assertEquals(health, spazienzio.getResources().get(Resource.HEALTH), "2 oggetti e i Guanti");

        // Smontiamo tutto: a tavolo vuoto non fa nulla; con un oggetto lontano lo distrugge.
        resolveOnOpponentItem(game, "bruiser.BreakYourToy", "Negroni Trovato per Terra");
        assertTrue(spazienzio.getItems().isEmpty());
        Card cocktail = draft.card("com.items.CocktailOnTheGround");
        spazienzio.getItems().add(cocktail);
        resolveOnOpponentItem(game, "bruiser.BreakYourToy", cocktail.getName());
        assertTrue(spazienzio.getItems().isEmpty(), "l'oggetto è distrutto");
        assertEquals(2, me.getItems().size(), "gli oggetti di Gigi restano");

        // Sotto il cofano: HIT ricevuto ×0,5 e CUT ×0,75 in questo turno; il Casco HIT ×0,8.
        Character standing = draft.character(GIGI), hitter = draft.character(SPAZIENZIO);
        ((AbstractCard) draft.card("base.gigi.SottoIlCofano")).applyEffectOnSelf(standing);
        hitter.inflictDamage(standing, new Damage(Damage.DamageType.HIT, 20));
        hitter.inflictDamage(standing, new Damage(Damage.DamageType.CUT, 20));
        assertEquals(GIGI_HEALTH - 10 - 15, standing.getResources().get(Resource.HEALTH));
        Character helmeted = draft.character(GIGI);
        ((AbstractCard) draft.card("base.items.CascoDaLavoro")).applyEffectOnSelf(helmeted);
        hitter.inflictDamage(helmeted, new Damage(Damage.DamageType.HIT, 20));
        assertEquals(GIGI_HEALTH - 16, helmeted.getResources().get(Resource.HEALTH));
    }

    /** SB-15: la classe di «Lavoro fatto bene» si carica dalla bozza solo coi suoi due parametri, e costo e priorità vengono dal file. */
    @Test
    void lavoroFattoBeneLoadsFromTheDraftWithItsParameters() {
        Card lavoro = draft.card("base.gigi.LavoroFattoBene");
        assertEquals("Lavoro fatto bene", lavoro.getName());
        assertEquals(Map.of(Resource.VIOLENCE, 5), lavoro.getCost());
        assertEquals(1, lavoro.getPriority());
        assertEquals(Set.of(Card.CardTarget.OPPONENT), lavoro.getCanTarget());
        for (String missing : List.of("base", "perItem")) {
            ObjectNode root = json.deepCopy();
            for (JsonNode c : root.get("cards"))
                if (c.get("binding").asText().equals("base.gigi.LavoroFattoBene")) ((ObjectNode) c.get("params")).remove(missing);
            IllegalArgumentException e = org.junit.jupiter.api.Assertions.assertThrows(IllegalArgumentException.class,
                    () -> Draft.parse("bozza senza " + missing, root));
            assertTrue(e.getMessage().contains("parametro mancante params." + missing), e.getMessage());
        }
        ObjectNode root = json.deepCopy();
        for (JsonNode c : root.get("cards"))
            if (c.get("binding").asText().equals("base.gigi.LavoroFattoBene")) ((ObjectNode) c.get("params")).put("perOggetto", 4);
        IllegalArgumentException e = org.junit.jupiter.api.Assertions.assertThrows(IllegalArgumentException.class,
                () -> Draft.parse("bozza con un parametro sconosciuto", root));
        assertTrue(e.getMessage().contains("parametro sconosciuto params.perOggetto"), e.getMessage());
    }

    /** SB-15: la base del listino ha anche il contesto di Gigi, e il gruppo «tettoavanzati» misura le sue tre bound e due sonde. */
    @Test
    void theListinoBaseHasTheGigiContextAndItsBoundCurves() throws Exception {
        // D79 removes the double generic slots used by these historical SB-11/SB-15 price probes.
        Draft draft = Draft.fromFile(java.nio.file.Path.of("../docs/reports/set-base/sb-16g-2b1/draft.json"));
        JsonNode json = draft.json();
        Draft base = Listino.setBaseContexts(draft, 7);
        List<String> spec = Listino.SET_BASE_CONTEXTS.get(Listino.GIGI);
        Map<String, Integer> cards = base.cardsOf(Listino.GIGI), starter = draft.cardsOf(spec.get(0));
        assertEquals(2, cards.get(Listino.SLOT1));
        assertEquals(2, cards.get(Listino.SLOT2));
        assertFalse(cards.containsKey(spec.get(1)) || cards.containsKey(spec.get(2)));
        assertTrue(cards.containsKey("base.items.GuantiDaOfficina") && cards.containsKey("bruiser.BreakYourToy"), "oggetti e archetipo restano");
        assertEquals(20, cards.values().stream().mapToInt(Integer::intValue).sum());
        assertEquals(starter, base.cardsOf(spec.get(0)), "lo starter resta com'è");
        Listino listino = new Listino(base, new Listino.Params(1, 1, 1, 1), heuristic());
        assertEquals(5, listino.curves().stream().filter(c -> c.group.equals("tettoavanzati") && c.context.equals("starter-gigi")).count());
        assertEquals(2, listino.bisections().stream().filter(b -> b.context.equals(Listino.GIGI) && b.group.equals("costo")).count(),
                "il prezzo di 5 e 10 V di Gigi");
        int derived = 0;
        for (Listino.Curve c : listino.curves())
            if (c.context.equals(Listino.GIGI) || c.context.equals("starter-gigi")) {
                base.derive(c.id, c.builder.build(0).root);
                derived++;
            }
        for (Listino.Bisection b : listino.bisections())
            if (b.context.equals(Listino.GIGI)) {
                base.derive(b.id, b.builder.build(b.lo).root);
                derived++;
            }
        assertEquals(11, derived, "quattro curve di salute, cinque di tetto e i due prezzi della V");
        // Senza lo starter di Gigi il contesto non nasce, e nemmeno le sue misure.
        ObjectNode root = json.deepCopy();
        ArrayNode decks = (ArrayNode) root.get("decks");
        for (int i = decks.size() - 1; i >= 0; i--) if (decks.get(i).get("id").asText().equals("starter-gigi")) decks.remove(i);
        Draft withoutGigi = Draft.parse("bozza senza lo starter di Gigi", root);
        Draft baseWithout = Listino.setBaseContexts(withoutGigi, 7);
        assertFalse(baseWithout.deckIds().contains(Listino.GIGI));
        Listino without = new Listino(baseWithout, new Listino.Params(1, 1, 1, 1), heuristic());
        assertTrue(without.bisections().stream().noneMatch(b -> b.context.equals(Listino.GIGI)));
        assertTrue(without.curves().stream().noneMatch(c -> c.context.equals(Listino.GIGI) || c.context.equals("starter-gigi")));
    }
}
