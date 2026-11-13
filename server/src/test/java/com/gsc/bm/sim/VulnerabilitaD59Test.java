package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.LoadableCard;
import com.gsc.bm.model.cards.bruiser.YouStop;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.bot.BotView;
import com.gsc.bm.model.game.status.Status;
import com.gsc.bm.model.game.status.Vulnerability;
import com.gsc.bm.service.catalog.CatalogSource;
import com.gsc.bm.service.view.ViewExtractorServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.util.SerializationUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

/**
 * SB-16g, Fase 2a: il supporto tecnico di D58 (la copia trovata resta scoperta in mano) e della conseguenza F (D59, D64–D66), con
 * le regole del playground ({@link Ruleset#D50}). Le carte sono di prova, scritte nel formato della bozza: nessuna carta della bozza
 * cambia in questa fase. Il turno del caricamento è N; i danni dell'avversario misurano la vulnerabilità di chi carica.
 */
class VulnerabilitaD59Test {
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final String STRIKE = "Colpo cercato";

    // ---- carte e tavolo di prova ----

    private static Card card(String name, String json) {
        try {
            LoadableCard card = DataCards.instantiate(DataCards.definition(JSON.readTree(json.replace('\'', '"'))));
            card.setGuiName(name);
            card.setGuiRole("DAMAGE", "—");
            card.setGuiDamage("—");
            card.setGuiDamageAmount("—");
            return card;
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    /** Un colpo: i danni dati, in ordine, sull'avversario. */
    private static Card hit(String name, int priority, String... damages) {
        String steps = java.util.Arrays.stream(damages).map(d -> "{'op':'damage','type':'" + d.split(" ")[0] + "','amount':" + d.split(" ")[1] + "}")
                .collect(Collectors.joining(","));
        return card(name, "{'binding':'t." + name + "','kind':'ACTION','priority':" + priority + ",'targets':['OPPONENT'],'target':[" + steps + "]}");
    }

    private static Card strike() { return hit(STRIKE, 2, "HIT 30"); }

    private static Card filler(String name) {
        return card(name, "{'binding':'t." + name + "','kind':'ACTION','targets':['SELF'],'self':[{'op':'gain','resource':'VIOLENCE','amount':1}]}");
    }

    private static Card basic() {
        return card("Basic", "{'binding':'t.Basic','kind':'ACTION','basic':true,'priority':-1,'targets':['SELF'],"
                + "'self':[{'op':'gain','resource':'ALERTNESS','amount':1}]}");
    }

    private static Card lastResort() {
        return card("Last", "{'binding':'t.Last','kind':'ACTION','lastResort':true,'targets':['OPPONENT'],'target':[{'op':'damage','type':'HIT','amount':3}]}");
    }

    private static Card bound(String owner) {
        return card("Bound " + owner, "{'binding':'t.Bound" + owner + "','kind':'BOUND','boundTo':'" + owner
                + "','targets':['SELF'],'self':[{'op':'gain','resource':'VIOLENCE','amount':2}]}");
    }

    /** Il caricamento di prova: priorità 2, +5 V, cerca il colpo al posto della pesca ed espone con la conseguenza F. */
    private static Card charge(String extra) {
        return card("Carica", "{'binding':'t.Carica','kind':'ACTION','priority':2,'targets':['SELF'],'self':[{'op':'gain','resource':'VIOLENCE','amount':5},"
                + "{'op':'search','card':'t." + STRIKE + "','vulnerability':{'factor':1.5,'minTurns':2" + extra + "}}]}");
    }

    private static Card charge() { return charge(""); }

    private static Card youStop() {
        YouStop stop = new YouStop();
        stop.setGuiName("Fermo");
        return stop;
    }

    private static Character character(String id) {
        Map<Resource, Integer> resources = new EnumMap<>(Resource.class);
        resources.put(Resource.HEALTH, 500);
        resources.put(Resource.ALERTNESS, 10);
        return new Draft.DraftCharacter(id, resources, 3, Set.of());
    }

    /** Mano: basic, bound, poi le carte date; mazzo: la prima carta della lista è la cima. */
    private static Player player(String id, List<Card> hand, List<Card> deck) {
        Player p = new Player(id, character(id), basic(), List.of(bound(id)), lastResort(), List.of(), new Random(1));
        p.getCardsInHand().clear();
        p.getCardsInHand().add(basic());
        p.getCardsInHand().add(bound(id));
        p.getCardsInHand().addAll(hand);
        List<Card> reversed = new ArrayList<>(deck);
        Collections.reverse(reversed);
        p.getDeck().addAll(reversed);
        return p;
    }

    /** La mano di a: le carte date più due riempitivi, così a ha sempre qualcosa di neutro da giocare. */
    private static List<Card> aHand(Card... cards) {
        List<Card> hand = new ArrayList<>(List.of(cards));
        hand.addAll(fillers("Riempitivo", 2));
        return hand;
    }

    private static List<Card> fillers(String prefix, int n) {
        List<Card> cards = new ArrayList<>();
        for (int i = 0; i < n; i++) cards.add(filler(prefix));
        return cards;
    }

    /** L'avversario b colpisce a ogni turno con un pugno da 10 HIT a priorità 1, dopo il caricamento. */
    private static Player puncher() {
        List<Card> punches = new ArrayList<>();
        for (int i = 0; i < 12; i++) punches.add(hit("Pugno", 1, "HIT 10"));
        return player("b", List.of(hit("Pugno", 1, "HIT 10"), youStop()), punches);
    }

    private static Game game(Ruleset rules, Player... players) {
        Game game = new Game(List.of(players), "sb-16g", false);
        game.useRuleset(rules);
        return game;
    }

    private static Move move(Game game, String player, String card, String target) {
        return new Move(card, player, target, game.getGameId(), new EnumMap<>(Move.AdditionalAction.class));
    }

    private static Move boundMove(Game game, String player, String discard) {
        Map<Move.AdditionalAction, String> choices = new EnumMap<>(Move.AdditionalAction.class);
        choices.put(Move.AdditionalAction.DISCARD_ONE, discard);
        return new Move("Bound " + player, player, "SELF", game.getGameId(), choices);
    }

    private static int health(Player p) { return p.getCharacter().getResources().get(Resource.HEALTH); }

    /** Un turno con le mosse date; restituisce la salute persa da a. */
    private static int turn(Game game, Move... moves) {
        int before = health(game.getPlayers().get("a"));
        for (Move m : moves) game.submitMove(m);
        game.resolveMoves(g -> { }, (t, events) -> { });
        return before - health(game.getPlayers().get("a"));
    }

    /** Il turno tipico: a gioca la carta data su di sé (o il colpo su b), b il pugno su a. */
    private static int turn(Game game, String aCard) {
        String target = aCard.equals(STRIKE) ? "b" : "SELF";
        return turn(game, move(game, "a", aCard, target), move(game, "b", "Pugno", "a"));
    }

    private static List<Status> vulnerabilities(Player p) {
        return p.getCharacter().getStatuses().stream().filter(s -> s.getExposure() != null).collect(Collectors.toList());
    }

    private static long copiesInHand(Player p, String name) {
        return p.getCardsInHand().stream().filter(c -> c.getName().equals(name)).count();
    }

    private static final ViewExtractorServiceImpl VIEWS = new ViewExtractorServiceImpl(new CatalogSource() {
        public List<String> cardBindings() { return List.of(); }
        public List<String> characterBindings() { return List.of(); }
        public boolean hasCard(String binding) { return false; }
        public boolean hasCharacter(String binding) { return true; }
        public Optional<CharacterGui> characterGui(String binding) { return Optional.of(new CharacterGui(binding, null)); }
    });

    private static JsonNode viewFor(Game game, String viewer) { return JSON.valueToTree(VIEWS.extractViewFor(game, viewer)); }

    // ---- D59: il minimo dei due turni, la ricerca fallita ----

    @Test
    void aFailedSearchLeavesOnlyTheMinimumOfTwoTurns() {
        Player a = player("a", aHand(charge()), fillers("Riempitivo", 8));
        Game game = game(Ruleset.D50, a, puncher());
        assertEquals(15, turn(game, "Carica"), "N: il pugno arriva dopo il caricamento");
        assertEquals(3, vulnerabilities(a).size(), "HIT, CUT e POISON");
        assertTrue(vulnerabilities(a).stream().allMatch(s -> s.getHeldBy() == null), "nessuna copia trovata, nessun legame");
        assertTrue(a.getRevealed().isEmpty());
        assertEquals(15, turn(game, "Riempitivo"), "N+1");
        assertEquals(10, turn(game, "Riempitivo"), "N+2: finito il minimo");
        assertTrue(vulnerabilities(a).isEmpty());
    }

    @Test
    void aFailedSearchDoesNotBindACopyAlreadyInHand() {
        // Il colpo è già in mano e il mazzo non ne ha: la ricerca fallisce, pesca normale; la copia in mano resta coperta e slegata.
        Player a = player("a", aHand(charge(), strike()), fillers("Riempitivo", 8));
        Game game = game(Ruleset.D50, a, puncher());
        turn(game, "Carica");
        assertTrue(a.getRevealed().isEmpty());
        assertEquals(15, turn(game, "Riempitivo"));
        assertEquals(10, turn(game, "Riempitivo"), "N+2: il colpo è ancora in mano, ma non è la copia trovata");
        assertEquals(1, copiesInHand(a, STRIKE));
        assertFalse(viewFor(game, "b").path("players").path("a").has("revealed"));
    }

    @Test
    void theVulnerabilityMultipliesHitCutAndPoison() {
        Player a = player("a", aHand(charge()), fillers("Riempitivo", 8));
        List<Card> mixed = new ArrayList<>();
        for (int i = 0; i < 6; i++) mixed.add(hit("Misto", 1, "HIT 10", "CUT 10", "POISON 10"));
        Player b = player("b", List.of(hit("Misto", 1, "HIT 10", "CUT 10", "POISON 10")), mixed);
        Game game = game(Ruleset.D50, a, b);
        assertEquals(45, turn(game, move(game, "a", "Carica", "SELF"), move(game, "b", "Misto", "a")));
        assertEquals(45, turn(game, move(game, "a", "Riempitivo", "SELF"), move(game, "b", "Misto", "a")), "N+1: ancora ×1,5");
        assertEquals(30, turn(game, move(game, "a", "Riempitivo", "SELF"), move(game, "b", "Misto", "a")), "N+2: ×1");
    }

    @Test
    void theDamageTypesComeFromTheCard() {
        Player a = player("a", aHand(charge(",'damage':['HIT']")), fillers("Riempitivo", 8));
        List<Card> mixed = new ArrayList<>();
        for (int i = 0; i < 6; i++) mixed.add(hit("Misto", 1, "HIT 10", "CUT 10"));
        Player b = player("b", List.of(hit("Misto", 1, "HIT 10", "CUT 10")), mixed);
        Game game = game(Ruleset.D50, a, b);
        assertEquals(25, turn(game, move(game, "a", "Carica", "SELF"), move(game, "b", "Misto", "a")), "solo HIT ×1,5");
        assertEquals(1, vulnerabilities(a).size());
    }

    // ---- D58 e D65: la copia trovata, l'uscita anticipata, il prolungamento ----

    @Test
    void anEarlyExitStillKeepsTheMinimum() {
        Player a = player("a", aHand(charge()), withStrikeOnTop(8));
        Game game = game(Ruleset.D50, a, puncher());
        assertEquals(15, turn(game, "Carica"));
        assertEquals(1, a.getRevealed().size());
        int copy = a.getRevealed().get(0).getId();
        assertTrue(vulnerabilities(a).stream().allMatch(s -> Integer.valueOf(copy).equals(s.getHeldBy())), "legata alla copia trovata");
        assertEquals(15, turn(game, STRIKE), "N+1: il colpo esce prima del pugno, ma il minimo resta");
        assertTrue(a.getRevealed().isEmpty(), "la copia giocata non è più scoperta");
        assertEquals(10, turn(game, "Riempitivo"), "N+2");
        assertTrue(vulnerabilities(a).isEmpty());
    }

    @Test
    void theCopyHoldsTheVulnerabilityUntilItLeavesTheHand() {
        Player a = player("a", aHand(charge()), withStrikeOnTop(8));
        Game game = game(Ruleset.D50, a, puncher());
        turn(game, "Carica");
        assertEquals(15, turn(game, "Riempitivo"), "N+1");
        assertEquals(15, turn(game, "Riempitivo"), "N+2: la copia è ancora in mano");
        assertEquals(15, turn(game, "Riempitivo"), "N+3");
        assertTrue(vulnerabilities(a).stream().allMatch(s -> s.getLastsForTurns() == -1), "minimo finito, tenuta dalla copia");
        assertEquals(10, turn(game, STRIKE), "N+4: il colpo esce nel gruppo prima del pugno: il pugno non è più moltiplicato");
        assertTrue(vulnerabilities(a).isEmpty(), "finisce subito, il minimo era già passato");
        assertEquals(10, turn(game, "Riempitivo"));
    }

    @Test
    void insideASpeedGroupTheExitWaitsForTheEndOfTheGroup() {
        // D50, punto 1: dentro un gruppo le mosse restano simultanee. Il colpo e il pugno hanno la stessa velocità: il pugno resta
        // moltiplicato qualunque sia l'ordine dei posti.
        for (boolean aFirst : List.of(true, false)) {
            Player a = player("a", aHand(charge()), withStrikeOnTop(8));
            Player b = puncher();
            Game game = aFirst ? game(Ruleset.D50, a, b) : game(Ruleset.D50, b, a);
            turn(game, "Carica");
            turn(game, "Riempitivo");
            turn(game, "Riempitivo");
            assertEquals(1, copiesInHand(a, STRIKE));
            // Il pugno di b a priorità 2 come il colpo: stesso gruppo.
            b.getCardsInHand().add(hit("Pugno veloce", 2, "HIT 10"));
            assertEquals(15, turn(game, move(game, "a", STRIKE, "b"), move(game, "b", "Pugno veloce", "a")), "posti a prima: " + aFirst);
            assertTrue(vulnerabilities(a).isEmpty(), "liberata a fine gruppo");
        }
    }

    @Test
    void aSameNameCopyNeitherRevealsNorReleases() {
        // a ha già una copia coperta del colpo; la ricerca ne trova un'altra, che diventa la copia scoperta.
        Card hidden = strike();
        Player a = player("a", aHand(charge(), hidden), withStrikeOnTop(8));
        Player b = puncher();
        Game game = game(Ruleset.D50, a, b);
        turn(game, "Carica");
        Card found = a.getRevealed().get(0).getCard();
        assertNotSame(hidden, found);
        assertEquals(2, copiesInHand(a, STRIKE));
        JsonNode own = viewFor(game, "a").path("players").path("a"), seen = viewFor(game, "b").path("players").path("a");
        assertEquals(1, own.path("revealed").size(), "una sola copia scoperta");
        int slot = own.path("revealed").get(0).path("slot").asInt();
        assertSame(found, a.getCardsInHand().get(slot), "il posto indica la copia trovata");
        assertNotSame(hidden, a.getCardsInHand().get(slot), "non l'omonima già in mano");
        assertEquals(1, seen.path("revealed").size());
        assertFalse(seen.path("revealed").get(0).has("slot"), "l'avversario non vede il posto nella mano");
        // L'omonima coperta esce dalla mano (scarto diretto del motore): la copia trovata resta scoperta e legata.
        a.discardCard(hidden);
        assertSame(found, a.getCardsInHand().stream().filter(c -> c.getName().equals(STRIKE)).findFirst().orElseThrow());
        assertEquals(15, turn(game, "Riempitivo"), "N+1");
        assertEquals(15, turn(game, "Riempitivo"), "N+2: tenuta dalla copia trovata");
        assertEquals(1, a.getRevealed().size());
    }

    @Test
    void playingByNameTakesTheFaceUpCopyFirst() {
        // Con due omonime, la mossa che nomina il colpo gioca la copia scoperta: l'omonima coperta resta in mano, coperta.
        Card hidden = strike();
        Player a = player("a", aHand(charge(), hidden), withStrikeOnTop(8));
        Game game = game(Ruleset.D50, a, puncher());
        turn(game, "Carica");
        turn(game, "Riempitivo");
        turn(game, "Riempitivo");
        assertEquals(10, turn(game, STRIKE), "la copia scoperta esce nel gruppo prima del pugno");
        assertEquals(1, copiesInHand(a, STRIKE));
        assertTrue(a.holds(hidden), "l'omonima coperta è ancora in mano");
        assertTrue(a.getRevealed().isEmpty());
        assertFalse(viewFor(game, "b").path("players").path("a").has("revealed"), "e resta coperta");
    }

    @Test
    void aBoundThatDiscardsTheFoundCopyReleasesIt() {
        Player a = player("a", aHand(charge()), withStrikeOnTop(8));
        Player b = puncher();
        Game game = game(Ruleset.D50, a, b);
        turn(game, "Carica");
        turn(game, "Riempitivo");
        turn(game, "Riempitivo");
        // La bound (priorità 1, stessa velocità del pugno) scarta il colpo: il pugno dello stesso gruppo resta moltiplicato.
        assertEquals(15, turn(game, boundMove(game, "a", STRIKE), move(game, "b", "Pugno", "a")));
        assertEquals(0, copiesInHand(a, STRIKE));
        assertTrue(vulnerabilities(a).isEmpty());
        assertEquals(10, turn(game, "Riempitivo"));
    }

    @Test
    void aVoidedBoundDoesNotDiscardAndKeepsTheLink() {
        Player a = player("a", aHand(charge()), withStrikeOnTop(8));
        Player b = puncher();
        Game game = game(Ruleset.D50, a, b);
        turn(game, "Carica");
        turn(game, "Riempitivo");
        turn(game, "Riempitivo");
        b.getCharacter().getResources().put(Resource.VIOLENCE, 5);
        // «Fermo» (priorità 2) annulla la mossa successiva di a: la bound non si risolve e non scarta.
        turn(game, boundMove(game, "a", STRIKE), move(game, "b", "Fermo", "a"));
        assertTrue(game.getResolvedMoves().stream().anyMatch(m -> m.getPlayerId().equals("a") && m.isVoid()));
        assertEquals(1, copiesInHand(a, STRIKE));
        assertEquals(1, a.getRevealed().size());
        assertEquals(15, turn(game, "Riempitivo"), "il legame resta");
    }

    @Test
    void aVoidedStrikeStillLeavesTheHandAndReleases() {
        // D65: conta l'uscita effettiva. Una mossa annullata ha già pagato e scarta la carta (R04).
        Player a = player("a", aHand(charge()), withStrikeOnTop(8));
        Player b = puncher();
        Game game = game(Ruleset.D50, a, b);
        turn(game, "Carica");
        turn(game, "Riempitivo");
        turn(game, "Riempitivo");
        b.getCharacter().getResources().put(Resource.VIOLENCE, 5);
        b.getCardsInHand().add(youStop());
        b.getCharacter().getResources().put(Resource.ALERTNESS, 11); // «Fermo» e il colpo hanno priorità 2: b va prima
        int before = health(b);
        turn(game, move(game, "a", STRIKE, "b"), move(game, "b", "Fermo", "a"));
        assertEquals(before, health(b), "il colpo è annullato");
        assertEquals(0, copiesInHand(a, STRIKE));
        assertTrue(a.getRevealed().isEmpty());
        assertTrue(vulnerabilities(a).isEmpty());
    }

    @Test
    void aVoidedChargeGivesNeitherVulnerabilityNorSearch() {
        // Proposta, contratto comune: un caricamento annullato non dà risorse, esposizione o ricerca.
        Player a = player("a", aHand(charge()), withStrikeOnTop(8));
        Player b = puncher();
        Game game = game(Ruleset.D50, a, b);
        b.getCharacter().getResources().put(Resource.VIOLENCE, 5);
        b.getCharacter().getResources().put(Resource.ALERTNESS, 11); // «Fermo» va prima del caricamento (priorità 2 entrambi)
        turn(game, move(game, "a", "Carica", "SELF"), move(game, "b", "Fermo", "a"));
        assertTrue(game.getResolvedMoves().stream().anyMatch(m -> m.getPlayerId().equals("a") && m.isVoid()));
        assertTrue(vulnerabilities(a).isEmpty());
        assertTrue(a.getRevealed().isEmpty());
        assertEquals(0, copiesInHand(a, STRIKE), "pesca normale: la cima, non il colpo");
        assertEquals(10, turn(game, "Riempitivo"));
    }

    // ---- D66: due legami cumulati ----

    @Test
    void twoLinksMultiplyAndEndOneAtATime() {
        List<Card> deck = new ArrayList<>(List.of(strike(), strike()));
        deck.addAll(fillers("Riempitivo", 8));
        Player a = player("a", aHand(charge(), charge()), deck);
        Game game = game(Ruleset.D50, a, puncher());
        assertEquals(15, turn(game, "Carica"));
        assertEquals(22, turn(game, "Carica"), "N+1: due vulnerabilità, 10 × 1,5 × 1,5 = 22,5, troncato come ogni stato");
        assertEquals(2, a.getRevealed().size());
        int first = a.getRevealed().get(0).getId(), second = a.getRevealed().get(1).getId();
        assertNotEquals(first, second);
        assertEquals(6, vulnerabilities(a).size());
        assertEquals(22, turn(game, "Riempitivo"), "N+2: la prima è oltre il minimo ma tenuta, la seconda nel minimo");
        assertEquals(15, turn(game, STRIKE), "N+3: esce la copia più vecchia; resta l'altra");
        assertEquals(1, a.getRevealed().size());
        assertEquals(second, a.getRevealed().get(0).getId());
        assertTrue(vulnerabilities(a).stream().allMatch(s -> Integer.valueOf(second).equals(s.getHeldBy())));
        assertEquals(10, turn(game, STRIKE), "N+4: esce anche la seconda");
        assertTrue(vulnerabilities(a).isEmpty());
    }

    @Test
    void aFailedSearchAfterASuccessfulOneDoesNotRenewTheOldLink() {
        List<Card> deck = new ArrayList<>(List.of(strike()));
        deck.addAll(fillers("Riempitivo", 8));
        Player a = player("a", aHand(charge(), charge()), deck);
        Game game = game(Ruleset.D50, a, puncher());
        turn(game, "Carica");
        int first = a.getRevealed().get(0).getId();
        turn(game, "Carica");
        assertEquals(1, a.getRevealed().size(), "la seconda ricerca fallisce");
        assertEquals(3, vulnerabilities(a).stream().filter(s -> Integer.valueOf(first).equals(s.getHeldBy())).count());
        assertEquals(3, vulnerabilities(a).stream().filter(s -> s.getHeldBy() == null).count(), "la seconda: solo il minimo");
        assertEquals(22, turn(game, "Riempitivo"), "N+2");
        assertEquals(15, turn(game, "Riempitivo"), "N+3: finito il minimo della seconda, resta la prima");
    }

    // ---- riconnessione, fine partita, regole vive ----

    @Test
    void theViewIsRebuiltFromTheMatchAtReconnection() {
        Player a = player("a", aHand(charge(), filler("Segreta")), withStrikeOnTop(8));
        Game game = game(Ruleset.D50, a, puncher());
        turn(game, "Carica");
        turn(game, "Riempitivo");
        JsonNode forB = viewFor(game, "b"), forA = viewFor(game, "a");
        JsonNode shown = forB.path("players").path("a").path("revealed");
        assertEquals(1, shown.size());
        assertEquals(STRIKE, shown.get(0).path("card").path("name").asText());
        assertEquals(0, shown.get(0).path("turn").asInt(), "trovata al turno N");
        int copy = shown.get(0).path("copy").asInt();
        assertEquals(copy, forA.path("players").path("a").path("revealed").get(0).path("copy").asInt(), "stessa identità per tutti");
        assertTrue(forB.path("players").path("a").path("cardsInHand").isNumber(), "la mano resta un numero");
        assertFalse(forB.toString().contains("Segreta"), "nessun'altra carta della mano");
        for (JsonNode s : forB.path("players").path("a").path("character").path("statuses")) {
            assertEquals(copy, s.path("heldBy").asInt(), "la vulnerabilità dice quale copia la tiene");
            assertEquals(1.5, s.path("factor").asDouble());
        }
        // Riconnessione: la vista si ricostruisce dalla partita; anche dopo il giro di serializzazione dello stato salvato.
        Game restored = (Game) SerializationUtils.deserialize(SerializationUtils.serialize(game));
        Game again = game(Ruleset.D50, player("a", List.of(), List.of()), player("b", List.of(), List.of()));
        again.restoreFrom(restored);
        assertEquals(forB, viewFor(game, "b"));
        assertEquals(stripIds(forB), stripIds(viewFor(again, "b")));
        assertEquals(stripIds(forA), stripIds(viewFor(again, "a")));
        // Dopo il ripristino l'identità tiene: giocare il colpo libera la copia scoperta.
        assertEquals(15, turn(again, "Riempitivo"));
        assertEquals(10, turn(again, STRIKE));
    }

    private static JsonNode stripIds(JsonNode view) {
        com.fasterxml.jackson.databind.node.ObjectNode copy = view.deepCopy();
        copy.remove("gameId");
        return copy;
    }

    @Test
    void theEndOfTheMatchDropsEveryLink() {
        Player a = player("a", aHand(charge()), withStrikeOnTop(8));
        Player b = puncher();
        Game game = game(Ruleset.D50, a, b);
        turn(game, "Carica");
        turn(game, "Riempitivo");
        turn(game, "Riempitivo");
        assertEquals(1, a.getRevealed().size());
        b.getCharacter().getResources().put(Resource.HEALTH, 5);
        a.getCardsInHand().add(hit("Finale", 2, "HIT 10"));
        turn(game, move(game, "a", "Finale", "b"), move(game, "b", "Pugno", "a"));
        assertTrue(game.isOver());
        assertEquals("a", game.getWinner().orElseThrow());
        assertEquals(1, copiesInHand(a, STRIKE), "il colpo è ancora in mano");
        assertTrue(a.getRevealed().isEmpty(), "ma non più scoperto");
        assertTrue(vulnerabilities(a).isEmpty(), "e non tiene più nulla");
        assertFalse(viewFor(game, "b").path("players").path("a").has("revealed"));
    }

    @Test
    void theEliminationOfTheOwnerDropsItsLinksWithoutChangingTheWinner() {
        Player a = player("a", aHand(charge()), withStrikeOnTop(8));
        Player b = puncher();
        Game game = game(Ruleset.D50, a, b);
        turn(game, "Carica");
        a.getCharacter().getResources().put(Resource.HEALTH, 12);
        turn(game, "Riempitivo"); // 10 × 1,5 = 15 ≥ 12
        assertTrue(game.isOver());
        assertEquals("b", game.getWinner().orElseThrow());
        assertTrue(a.getRevealed().isEmpty());
        assertTrue(vulnerabilities(a).stream().allMatch(s -> s.getHeldBy() == null));
    }

    @Test
    void aForfeitEndsTheMatchAndDropsTheLinks() {
        Player a = player("a", aHand(charge()), withStrikeOnTop(8));
        Game game = game(Ruleset.D50, a, puncher());
        turn(game, "Carica");
        game.forfeit("b", "LEFT");
        assertTrue(game.isOver());
        assertTrue(a.getRevealed().isEmpty());
        assertTrue(vulnerabilities(a).stream().allMatch(s -> s.getHeldBy() == null));
    }

    @Test
    void withTheLiveRulesNothingChanges() {
        Player a = player("a", aHand(charge()), withStrikeOnTop(8));
        Game game = game(Ruleset.LIVE, a, puncher());
        assertEquals(10, turn(game, "Carica"));
        assertTrue(a.getCharacter().getStatuses().isEmpty());
        assertTrue(a.getRevealed().isEmpty());
        for (String viewer : List.of("a", "b")) {
            JsonNode view = viewFor(game, viewer);
            for (JsonNode p : view.path("players")) assertFalse(p.has("revealed"), viewer);
            for (JsonNode m : view.path("resolvedMoves")) assertFalse(m.has("search"), viewer);
        }
        assertEquals(10, turn(game, "Riempitivo"));
    }

    @Test
    void theLiveStatusesKeepTheirShapeInTheView() {
        // Uno stato che non è una vulnerabilità non porta i campi nuovi, con qualunque regola.
        for (Ruleset rules : Ruleset.values()) {
            Player a = player("a", List.of(filler("Attesa")), fillers("Riempitivo", 3));
            Game game = game(rules, a, puncher());
            a.getCharacter().getStatuses().add(Status.builder().name("Parata").description("HIT x0.4").type(com.gsc.bm.model.game.status.StatusType.GOOD)
                    .flow(com.gsc.bm.model.game.status.StatusFlow.INPUT).impactedProperty(com.gsc.bm.model.Damage.DamageType.HIT)
                    .amountFunction((com.gsc.bm.model.game.status.StatusAmountFunction) n -> n * 0.4f).lastsForTurns(1).build());
            JsonNode status = viewFor(game, "b").path("players").path("a").path("character").path("statuses").get(0);
            for (String field : List.of("exposure", "factor", "heldBy")) assertFalse(status.has(field), rules + " " + field);
        }
    }

    // ---- bot: la vista legge le carte scoperte ----

    @Test
    void theBotViewReadsTheFaceUpCards() {
        Player a = player("a", aHand(charge(), filler("Segreta")), withStrikeOnTop(8));
        Game game = game(Ruleset.D50, a, puncher());
        turn(game, "Carica");
        BotView forB = BotView.of(game, "b"), forA = BotView.of(game, "a");
        BotView.Opponent seenA = forB.getOpponents().get(0);
        assertEquals(1, seenA.getRevealed().size());
        BotView.RevealedSeen shown = seenA.getRevealed().get(0);
        assertEquals(STRIKE, shown.getCard().getName());
        assertNull(shown.getSlot(), "l'avversario non vede il posto");
        assertEquals(0, shown.getTurn());
        assertTrue(seenA.getSeat().getStatuses().stream().allMatch(s -> Integer.valueOf(shown.getCopy()).equals(s.getHeldBy()) && s.getFactor() == 1.5f));
        BotView.RevealedSeen own = forA.getSelf().getRevealed().get(0);
        assertEquals(shown.getCopy(), own.getCopy());
        assertEquals(STRIKE, forA.getSelf().getHand().get(own.getSlot()).getName());
        assertTrue(forB.getSelf().getRevealed().isEmpty());
        // La vista dei bot non contiene altre carte della mano di a.
        assertFalse(forB.toString().contains("Segreta"));
    }

    // ---- formato della bozza ----

    @Test
    void theDraftFormatDescribesSearchVulnerabilityFactorAndMinimum() throws Exception {
        DataCards.Definition ok = DataCards.definition(JSON.readTree(("{'binding':'t.C','kind':'ACTION','targets':['SELF'],'self':[{'op':'search',"
                + "'card':'t.X','vulnerability':{'factor':2,'minTurns':3,'damage':['CUT','POISON']}}]}").replace('\'', '"')));
        Vulnerability v = ((DataCards.SearchStep) ok.self.get(0)).vulnerability;
        assertEquals("t.X", ok.searches());
        assertEquals(2f, v.factor.floatValue());
        assertEquals(3, v.minTurns.intValue());
        assertEquals(Set.of(com.gsc.bm.model.Damage.DamageType.CUT, com.gsc.bm.model.Damage.DamageType.POISON), v.damage);
        List<Status> statuses = v.statuses(7);
        assertEquals(2, statuses.size());
        assertTrue(statuses.stream().allMatch(s -> s.getLastsForTurns() == 2 && s.getExposure() == 7 && s.getHeldBy() == null));
        for (String bad : List.of("{'factor':0,'minTurns':2}", "{'factor':1.5,'minTurns':0}", "{'minTurns':2}", "{'factor':1.5}",
                "{'factor':1.5,'minTurns':2,'damage':[]}", "{'factor':1.5,'minTurns':2,'altro':1}")) {
            String json = ("{'binding':'t.C','kind':'ACTION','targets':['SELF'],'self':[{'op':'search','card':'t.X','vulnerability':" + bad + "}]}")
                    .replace('\'', '"');
            assertThrows(Exception.class, () -> DataCards.definition(JSON.readTree(json)), bad);
        }
    }

    private static List<Card> withStrikeOnTop(int fillers) {
        List<Card> deck = new ArrayList<>();
        deck.add(filler("Cima"));
        deck.add(strike());
        deck.addAll(fillers("Riempitivo", fillers));
        return deck;
    }
}
