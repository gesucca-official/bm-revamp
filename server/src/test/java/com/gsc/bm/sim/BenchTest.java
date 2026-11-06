package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.bot.AggressivePolicy;
import com.gsc.bm.model.game.bot.BotPlayer;
import com.gsc.bm.model.game.bot.BotPolicy;
import com.gsc.bm.model.game.bot.BotView;
import com.gsc.bm.model.game.bot.LegalMove;
import com.gsc.bm.model.game.bot.PrudentPolicy;
import com.gsc.bm.model.game.bot.ResourceAwarePolicy;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * SB-7: il banco sa misurare e sa fallire. Ogni invariante viene violato da una bozza costruita apposta (o, per quelli che oggi
 * garantisce il motore, da un giocatore manomesso), il rapporto è riproducibile byte per byte e la ricerca ritrova una carta
 * volutamente superiore. Prove brevi: le misure lunghe sono in BenchMeasureTest, a richiesta.
 */
class BenchTest {
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final String BRUISER = "bruiser.character.BigBadBruiser", JUNKIE = "junkie.character.ToxicJunkie";

    private static Map<String, BotPolicy> heuristic() {
        Map<String, BotPolicy> styles = new LinkedHashMap<>();
        styles.put("aggressivo", new AggressivePolicy());
        styles.put("prudente", new PrudentPolicy());
        styles.put("risorse", new ResourceAwarePolicy());
        return styles;
    }

    private static Bench.Settings settings(Draft draft, int games, Map<String, BotPolicy> styles, int threads) {
        return new Bench.Settings(games, 7_000_000L, new ArrayList<>(draft.deckIds()), styles, threads, BoundCap.Params.SB7, null);
    }

    private static ObjectNode current() throws Exception {
        return (ObjectNode) Draft.fromClasspath(Draft.CURRENT).json();
    }

    private static ObjectNode card(ObjectNode root, String binding) {
        for (JsonNode card : root.get("cards")) if (binding.equals(card.get("binding").asText())) return (ObjectNode) card;
        throw new IllegalArgumentException(binding);
    }

    private static ObjectNode deck(ObjectNode root, String id) {
        for (JsonNode deck : root.get("decks")) if (id.equals(deck.get("id").asText())) return (ObjectNode) deck;
        throw new IllegalArgumentException(id);
    }

    private static void addCard(ObjectNode root, String json) throws Exception {
        ((ArrayNode) root.get("cards")).add(JSON.readTree(json));
    }

    private static String dataCard(String binding, String body, String name, String role, String damage, String amount) {
        return "{\"binding\":\"" + binding + "\"," + body + ",\"gui\":{\"name\":\"" + name + "\",\"role\":\"" + role
                + "\",\"gains\":\"—\",\"damage\":\"" + damage + "\",\"damageAmount\":\"" + amount + "\"}}";
    }

    private static void health(ObjectNode root, int health) {
        for (JsonNode character : root.get("characters")) ((ObjectNode) character.get("resources")).put("HEALTH", health);
    }

    private static void assertLocated(Bench.Report report, String invariant) {
        long count = report.checks.counts.get(invariant);
        assertTrue(count > 0, invariant + " non segnalato:\n" + report.failures());
        Bench.Violation first = report.checks.examples.get(invariant).get(0);
        String message = first.message(Bench.draftName(report.draft));
        for (String part : List.of("[" + invariant + "]", "bozza ", "mazzo ", "seme ", "turno "))
            assertTrue(message.contains(part), "messaggio senza «" + part + "»: " + message);
        assertTrue(report.failures().contains(invariant), report.failures());
    }

    @Test
    void conformingDraftsBreakNoInvariant() throws Exception {
        for (String resource : List.of(Draft.CURRENT, "/sb-6a/prova-sb9.json")) {
            Draft draft = Draft.fromClasspath(resource);
            Bench.Report report = Bench.run(draft, settings(draft, 12, heuristic(), 2));
            for (String invariant : Bench.INVARIANTS)
                assertEquals(0L, report.checks.counts.get(invariant), resource + ": " + invariant + "\n" + report.failures());
            assertEquals(3L * 9 * 12, report.games(), resource);
            assertTrue(report.checks.seatTurns > report.games() * 2, "i turni sono controllati");
        }
    }

    /** Bound a costo e carte regolari impagabili: nessuna mossa, mossa vuota, bound non legale, bound non gratuita. */
    @Test
    void costlyBoundAndUnpayableHandAreFlagged() throws Exception {
        ObjectNode root = current();
        ((ObjectNode) root.get("rules")).put("maxCopies", 20);
        for (String bound : List.of("bruiser.character.LittleSmack", "bruiser.character.LittleRage"))
            card(root, bound).putObject("cost").put("VIOLENCE", 99);
        addCard(root, dataCard("prova.Impagabile", "\"kind\":\"ACTION\",\"priority\":0,\"targets\":[\"OPPONENT\"],\"cost\":{\"VIOLENCE\":99},"
                + "\"target\":[{\"op\":\"damage\",\"type\":\"HIT\",\"amount\":1}]", "PROVA IMPAGABILE", "DAMAGE", "HIT", "HIT 1"));
        ObjectNode bruiser = deck(root, "starter-bruiser");
        bruiser.putObject("cards").put("prova.Impagabile", 20);
        Draft draft = Draft.parse("violazione-senza-mosse.json", root);
        Bench.Report report = Bench.run(draft, settings(draft, 2, Map.of("aggressivo", new AggressivePolicy()), 1));
        for (String invariant : List.of("senza-mosse", "mossa-vuota", "bound-giocabile")) assertLocated(report, invariant);
        assertTrue(report.checks.counts.get("bound-gratuite") == 2, report.failures());
        assertTrue(report.failures().contains("bruiser.character.LittleSmack"), report.failures());
    }

    /** Una last resort a costo passa solo dalla lettura indulgente: in partita non è giocabile e il banco lo dice. */
    @Test
    void lastResortThatCannotBePlayedIsFlagged() throws Exception {
        ObjectNode root = current();
        card(root, "com.last.Struggle").putObject("cost").put("VIOLENCE", 999);
        health(root, 1000);
        Draft draft = Draft.parseLenient("violazione-last-resort.json", root);
        Bench.Report report = Bench.run(draft, settings(draft, 2, Map.of("aggressivo", new AggressivePolicy()), 1));
        assertLocated(report, "last-resort-giocabile");
    }

    /**
     * Basic, bound e last resort in mano li garantisce oggi Player, non la bozza: nessuna bozza può violarli. Un giocatore manomesso
     * (scarta le bound giocate e non riprende la last resort) prova che il banco se ne accorgerebbe.
     */
    @Test
    void tamperedHandIsFlagged() throws Exception {
        ObjectNode root = current();
        health(root, 1000);
        Draft draft = Draft.parse("giocatore-manomesso.json", root);
        PlayerSource tampered = (deck, id, random, policy) -> {
            Character character = draft.character(draft.characterOf(deck));
            List<Card> regular = new ArrayList<>();
            draft.cardsOf(deck).forEach((binding, copies) -> { for (int i = 0; i < copies; i++) regular.add(draft.card(binding)); });
            List<Card> bound = new ArrayList<>();
            for (String binding : draft.boundOf(deck)) bound.add(draft.card(binding));
            Card lastResort = draft.card(draft.lastResortOf(deck));
            return new BotPlayer(id, character, draft.card(draft.basicOf(deck)), bound, lastResort, regular, random, policy) {
                @Override public void drawCard() {
                    super.drawCard();
                    getCardsInHand().remove(lastResort);
                }

                @Override public void discardCard(Card card) {
                    super.discardCard(card);
                    if (card.isCharacterBound()) getCardsInHand().remove(card);
                }
            };
        };
        Bench.Report report = Bench.run(draft, settings(draft, 2, Map.of("aggressivo", new AggressivePolicy()), 1), tampered);
        assertLocated(report, "basic-bound-in-mano");
        assertLocated(report, "last-resort-in-mano");
    }

    /** Carte senza effetto e uno stile che gioca solo quelle: la partita arriva al limite di turni. */
    @Test
    void endlessGameIsFlagged() throws Exception {
        ObjectNode root = current();
        ((ObjectNode) root.get("rules")).put("maxCopies", 20);
        addCard(root, dataCard("prova.Nulla", "\"kind\":\"ACTION\",\"priority\":0,\"targets\":[\"SELF\"]", "PROVA NULLA", "NONE", "—", "—"));
        addCard(root, dataCard("prova.UltimaNulla", "\"kind\":\"ACTION\",\"lastResort\":true,\"targets\":[\"SELF\"]", "PROVA ULTIMA NULLA",
                "NONE", "—", "—"));
        for (String id : List.of("starter-bruiser", "starter-junkie")) {
            ObjectNode d = deck(root, id);
            d.putObject("cards").put("prova.Nulla", 20);
            d.put("lastResort", "prova.UltimaNulla");
        }
        Draft draft = Draft.parse("violazione-limite.json", root);
        BotPolicy still = new Still();
        Bench.Settings settings = new Bench.Settings(1, 7_000_000L, List.of("starter-bruiser"), Map.of("fermo", still), 1,
                BoundCap.Params.SB7, null);
        Bench.Report report = Bench.run(draft, settings);
        assertLocated(report, "limite-turni");
        assertEquals(1L, report.cells.get(0).tally.limits);
    }

    /** Gioca solo carte che non fanno nulla. */
    private static final class Still implements BotPolicy {
        @Override
        public LegalMove choose(BotView view, List<LegalMove> legalMoves, Random random) {
            for (LegalMove move : legalMoves) if (move.getCard().getName().startsWith("PROVA ")) return move;
            return legalMoves.get(0);
        }
    }

    /** Il tetto delle bound: una troppo forte, una che lascia T sull'avversario, una pulita; e PatheticBlade nella bozza attuale. */
    @Test
    void boundCapSeparatesWeakFromStrongAndLingering() throws Exception {
        ObjectNode root = current();
        String body = "\"kind\":\"BOUND\",\"boundTo\":\"" + BRUISER + "\",\"targets\":[\"OPPONENT\"],\"target\":";
        addCard(root, dataCard("prova.Mazzata", body + "[{\"op\":\"damage\",\"type\":\"HIT\",\"amount\":20}]", "PROVA MAZZATA", "DAMAGE", "HIT", "HIT 20"));
        addCard(root, dataCard("prova.Spruzzo", body + "[{\"op\":\"gain\",\"resource\":\"TOXICITY\",\"amount\":5}]", "PROVA SPRUZZO", "DISRUPT", "—", "—"));
        addCard(root, dataCard("prova.Buffetto", body + "[{\"op\":\"damage\",\"type\":\"HIT\",\"amount\":5}]", "PROVA BUFFETTO", "DAMAGE", "HIT", "HIT 5"));
        Draft draft = Draft.parse("prova-tetto.json", root);
        Map<String, BoundCap.Result> results = new LinkedHashMap<>();
        for (BoundCap.Result r : BoundCap.run(draft, BoundCap.Params.SB7)) results.put(r.bound, r);

        BoundCap.Result strong = results.get("prova.Mazzata");
        assertTrue(strong.overCap && strong.violates(), strong.reasons(BoundCap.Params.SB7));
        assertEquals(20, strong.damage[0], 1e-9);

        BoundCap.Result lingering = results.get("prova.Spruzzo");
        assertTrue(lingering.violates(), "+5 T al bersaglio deve violare");
        assertTrue(lingering.residue.stream().anyMatch(r -> r.startsWith("T +")), lingering.residue.toString());
        assertTrue(lingering.accumulates, "il veleno cresce a ogni uso");

        BoundCap.Result clean = results.get("prova.Buffetto");
        assertFalse(clean.violates(), clean.reasons(BoundCap.Params.SB7));
        assertEquals(BoundCap.USES, clean.uses);
        for (double v : clean.value) assertEquals(5, v, 1e-9);

        BoundCap.Result blade = results.get("junkie.character.PatheticBlade");
        assertTrue(blade.violates() && !blade.residue.isEmpty(), "PatheticBlade lascia T sull'avversario: " + blade.reasons(BoundCap.Params.SB7));

        BoundCap.Params loose = new BoundCap.Params(25, 0, BoundCap.Params.SB7.weights);
        for (BoundCap.Result r : BoundCap.run(draft, loose))
            if (r.bound.equals("prova.Mazzata")) assertFalse(r.overCap, "il tetto è un parametro");
    }

    /** SB-10b: i predefiniti sono quelli di D33. 4 HIT sta nel tetto, 5 HIT no (con SB-7 sì); +5 V vale 3,75 unità. */
    @Test
    void defaultsAreTheD33Cap() throws Exception {
        BoundCap.Params d33 = BoundCap.Params.DEFAULT;
        assertEquals(4, d33.cap, 1e-9);
        assertEquals(0, d33.tolerance, 1e-9);
        assertEquals(0.75, d33.weights.get(com.gsc.bm.model.Resource.VIOLENCE), 1e-9);
        assertEquals(0.5, d33.weights.get(com.gsc.bm.model.Resource.ALERTNESS), 1e-9);
        assertEquals(0.15, d33.weights.get(com.gsc.bm.model.Resource.TOXICITY), 1e-9);
        assertEquals(0.35, d33.weights.get(com.gsc.bm.model.Resource.ALCOHOL), 1e-9);
        ObjectNode root = current();
        String hit = "\"kind\":\"BOUND\",\"boundTo\":\"" + BRUISER + "\",\"targets\":[\"OPPONENT\"],\"target\":";
        addCard(root, dataCard("prova.Quattro", hit + "[{\"op\":\"damage\",\"type\":\"HIT\",\"amount\":4}]", "PROVA QUATTRO", "DAMAGE", "HIT", "HIT 4"));
        addCard(root, dataCard("prova.Cinque", hit + "[{\"op\":\"damage\",\"type\":\"HIT\",\"amount\":5}]", "PROVA CINQUE", "DAMAGE", "HIT", "HIT 5"));
        addCard(root, dataCard("prova.Carica", "\"kind\":\"BOUND\",\"boundTo\":\"" + BRUISER + "\",\"targets\":[\"SELF\"],\"self\":"
                + "[{\"op\":\"gain\",\"resource\":\"VIOLENCE\",\"amount\":5}]", "PROVA CARICA", "RESOURCES", "—", "—"));
        Draft draft = Draft.parse("prova-tetto-d33.json", root);
        Map<String, BoundCap.Result> d33Results = new LinkedHashMap<>(), sb7Results = new LinkedHashMap<>();
        for (BoundCap.Result r : BoundCap.run(draft, d33)) d33Results.put(r.bound, r);
        for (BoundCap.Result r : BoundCap.run(draft, BoundCap.Params.SB7)) sb7Results.put(r.bound, r);

        assertFalse(d33Results.get("prova.Quattro").violates(), d33Results.get("prova.Quattro").reasons(d33));
        assertTrue(d33Results.get("prova.Cinque").overCap, "5 HIT supera il tetto di D33");
        assertFalse(sb7Results.get("prova.Cinque").violates(), "con i parametri di SB-7 5 HIT stava nel tetto");
        BoundCap.Result charge = d33Results.get("prova.Carica");
        assertFalse(charge.violates(), charge.reasons(d33));
        assertEquals(3.75, charge.max(), 1e-9);
    }

    @Test
    void sameSeedSameReportByteForByte() throws Exception {
        Draft draft = Draft.fromClasspath("/sb-6a/prova-sb9.json");
        Bench.Report one = Bench.run(draft, settings(draft, 8, heuristic(), 1));
        Bench.Report two = Bench.run(Draft.fromClasspath("/sb-6a/prova-sb9.json"), settings(draft, 8, heuristic(), 3));
        assertEquals(one.markdown(), two.markdown());
        assertEquals(one.json(), two.json());
        Bench.Report other = Bench.run(draft, new Bench.Settings(8, 7_000_100L, new ArrayList<>(draft.deckIds()), heuristic(), 1,
                BoundCap.Params.SB7, null));
        assertNotEquals(one.json(), other.json(), "semi diversi, numeri diversi");
        assertFalse(one.markdown().contains("secondi"), "i tempi non stanno nel rapporto");
    }

    /** Una carta gratuita e devastante, assente dagli starter: la ricerca la trova e il mazzo vince nettamente sui semi di convalida. */
    /** Danno della carta superiore, come nella proposta approvata: gratuita, priorità 3, 30 HIT. */
    private static final int SUPERIOR = 30;

    @Test
    void searchFindsADeliberatelySuperiorCard() throws Exception {
        ObjectNode root = current();
        addCard(root, dataCard("prova.ColpoTruccato", "\"kind\":\"ACTION\",\"priority\":3,\"targets\":[\"OPPONENT\"],\"cost\":{},"
                + "\"target\":[{\"op\":\"damage\",\"type\":\"HIT\",\"amount\":" + SUPERIOR + "}]", "PROVA COLPO TRUCCATO", "DAMAGE", "HIT", "HIT " + SUPERIOR));
        Draft draft = Draft.parse("prova-ricerca.json", root);
        DeckSearch.Params params = new DeckSearch.Params(8, 16, 15, 6, 200, 1, 4, 7_100_000L, 7_900_000L, 7_000_007L);
        DeckSearch search = new DeckSearch(draft, Map.of("aggressivo", new AggressivePolicy()), params);
        DeckSearch.Deck starter = search.starter(BRUISER);
        assertFalse(starter.cards.containsKey("prova.ColpoTruccato"));
        DeckSearch.Outcome outcome = search.search(BRUISER, "starter", starter, starter, new Random(params.mutationSeed));
        DeckSearch.Finalist best = outcome.best();
        assertTrue(best.deck.cards.getOrDefault("prova.ColpoTruccato", 0) > 0, "la ricerca non ha trovato la carta: " + best.deck.cards);
        DeckSearch.Score found = best.validation, base = outcome.baseline.validation;
        double[] foundCi = Bench.wilson(found.wins, found.wins + found.losses), baseCi = Bench.wilson(base.wins, base.wins + base.losses);
        System.out.printf("SB-7 prova di ricerca: %d HIT, quota di convalida %.3f [%.3f-%.3f], starter %.3f [%.3f-%.3f], carte %s%n", SUPERIOR,
                found.share(), foundCi[0], foundCi[1], base.share(), baseCi[0], baseCi[1], best.deck.cards);
        assertTrue(found.share() >= 0.70, "quota di convalida " + found.share());
        assertTrue(foundCi[0] > 0.60, "limite inferiore di Wilson " + foundCi[0]);
        assertTrue(foundCi[0] > baseCi[1], "il mazzo trovato deve battere nettamente lo starter: " + found.share() + " contro " + base.share());
        for (String opponent : search.gauntlet())
            assertTrue(best.byOpponent.get(opponent).share() > outcome.baseline.byOpponent.get(opponent).share(), opponent);
        assertEquals(search.gauntlet().size() * 200L, found.games, "convalida su semi propri");
        assertTrue(search.markdown(List.of(outcome), null).contains("prova.ColpoTruccato"));
    }

    @Test
    void searchRespectsTheFormat() throws Exception {
        Draft draft = Draft.fromClasspath(Draft.CURRENT);
        DeckSearch search = new DeckSearch(draft, Map.of("aggressivo", new AggressivePolicy()), DeckSearch.Params.standard(1));
        Random random = new Random(1);
        DeckSearch.Pool pool = search.new Pool(JUNKIE);
        DeckSearch.Deck deck = search.randomDeck(JUNKIE, random);
        for (int i = 0; i < 300; i++) {
            deck = search.mutate(deck, pool, random);
            assertEquals(draft.rules.deckSize, deck.size());
            for (int copies : deck.cards.values()) assertTrue(copies >= 1 && copies <= draft.rules.maxCopies);
            assertEquals(draft.rules.boundChoices, deck.bound.size());
            Draft withCandidate = search.withCandidate(deck, JUNKIE); // La validazione di Draft rifiuterebbe un mazzo fuori formato.
            assertTrue(withCandidate.deckIds().contains(DeckSearch.CANDIDATE));
        }
    }
}
