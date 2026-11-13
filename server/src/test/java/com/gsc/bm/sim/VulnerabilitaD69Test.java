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
 * SB-16g, D69 rivista da D71–D73: gettoni e carta trovata con le sole regole d50.
 * Giocata omonima: il più vecchio gettone resta fino a fine turno; senza copie resta un turno successivo intero.
 * La ricerca fallita pesca senza gettone; il pugno da 10 misura l'esposizione (15 = ×1,5).
 */
class VulnerabilitaD69Test {
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

    /** Il caricamento di prova: priorità 2, +5 V, cerca il colpo al posto della pesca e dà il gettone di vulnerabilità. */
    private static Card charge(String extra) {
        return card("Carica", "{'binding':'t.Carica','kind':'ACTION','priority':2,'targets':['SELF'],'self':[{'op':'gain','resource':'VIOLENCE','amount':5},"
                + "{'op':'search','card':'t." + STRIKE + "','vulnerability':{'factor':1.5,'turnsIfNotFound':2" + extra + "}}]}");
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

    private static List<Status> bound(Player p) {
        return vulnerabilities(p).stream().filter(s -> s.getUntilPlayed() != null).collect(Collectors.toList());
    }

    // ---- D72: la ricerca fallita non dà gettoni ----

    @Test
    void aFailedSearchDrawsWithoutATokenD72() {
        Player a = player("a", aHand(charge()), fillers("Riempitivo", 8));
        Game game = game(Ruleset.D50, a, puncher());
        assertEquals(10, turn(game, "Carica"), "D72: ricerca fallita, nessuna vulnerabilità");
        assertTrue(vulnerabilities(a).isEmpty());
        assertTrue(a.getRevealed().isEmpty());
        assertEquals(10, turn(game, "Riempitivo"), "N+1");
        assertEquals(10, turn(game, "Riempitivo"), "N+2: finito");
        assertTrue(vulnerabilities(a).isEmpty());
    }

    @Test
    void aMissDoesNotExposeAnAlreadyHeldCopyD72() {
        // D72: il colpo è già in mano, la ricerca fallisce e non crea gettoni.
        Player a = player("a", aHand(charge(), strike()), fillers("Riempitivo", 8));
        Game game = game(Ruleset.D50, a, puncher());
        turn(game, "Carica");
        assertTrue(a.getRevealed().isEmpty());
        assertFalse(viewFor(game, "b").path("players").path("a").has("revealed"), "la copia già in mano resta coperta");
        assertEquals(10, turn(game, STRIKE), "D72: nessun gettone dalla ricerca fallita");
        assertEquals(10, turn(game, "Riempitivo"), "N+2: finito col suo tempo");
    }

    @Test
    void theVulnerabilityMultipliesHitCutAndPoison() {
        Player a = player("a", aHand(charge()), withStrikeOnTop(8));
        List<Card> mixed = new ArrayList<>();
        for (int i = 0; i < 6; i++) mixed.add(hit("Misto", 1, "HIT 10", "CUT 10", "POISON 10"));
        Player b = player("b", List.of(hit("Misto", 1, "HIT 10", "CUT 10", "POISON 10")), mixed);
        Game game = game(Ruleset.D50, a, b);
        assertEquals(45, turn(game, move(game, "a", "Carica", "SELF"), move(game, "b", "Misto", "a")));
        assertEquals(45, turn(game, move(game, "a", "Riempitivo", "SELF"), move(game, "b", "Misto", "a")), "N+1: ancora ×1,5");
        assertEquals(45, turn(game, move(game, "a", "Riempitivo", "SELF"), move(game, "b", "Misto", "a")), "D71: il nome non è stato giocato");
    }

    @Test
    void theDamageTypesComeFromTheCard() {
        Player a = player("a", aHand(charge(",'damage':['HIT']")), withStrikeOnTop(8));
        List<Card> mixed = new ArrayList<>();
        for (int i = 0; i < 6; i++) mixed.add(hit("Misto", 1, "HIT 10", "CUT 10"));
        Player b = player("b", List.of(hit("Misto", 1, "HIT 10", "CUT 10")), mixed);
        Game game = game(Ruleset.D50, a, b);
        assertEquals(25, turn(game, move(game, "a", "Carica", "SELF"), move(game, "b", "Misto", "a")), "solo HIT ×1,5");
        assertEquals(1, vulnerabilities(a).size());
    }

    // ---- D69 (a): carta trovata, gettone legato al nome e senza timer ----

    @Test
    void aFoundCardGivesATokenWithoutTimerUntilItsNameIsPlayed() {
        Player a = player("a", aHand(charge()), withStrikeOnTop(8));
        Game game = game(Ruleset.D50, a, puncher());
        assertEquals(15, turn(game, "Carica"));
        assertEquals(1, a.getRevealed().size());
        int copy = a.getRevealed().get(0).getId();
        assertTrue(vulnerabilities(a).stream().allMatch(s -> STRIKE.equals(s.getUntilPlayed()) && s.getLastsForTurns() == null
                && Integer.valueOf(copy).equals(s.getExposure())), "legato al nome, nessun timer, stesso id della carta trovata");
        for (int n = 1; n <= 4; n++) assertEquals(15, turn(game, "Riempitivo"), "N+" + n + ": nessun timer");
        assertEquals(15, turn(game, STRIKE), "il colpo esce nel gruppo prima del pugno: il pugno non è più moltiplicato");
        assertTrue(vulnerabilities(a).isEmpty());
        assertTrue(a.getRevealed().isEmpty());
        assertEquals(10, turn(game, "Riempitivo"));
    }

    @Test
    void thereIsNoMinimum() {
        Player a = player("a", aHand(charge()), withStrikeOnTop(8));
        Game game = game(Ruleset.D50, a, puncher());
        assertEquals(15, turn(game, "Carica"));
        assertEquals(15, turn(game, STRIKE), "N+1: il colpo esce prima del pugno e il gettone se ne va subito");
        assertTrue(vulnerabilities(a).isEmpty());
    }

    @Test
    void aTokenStaysThroughTheWholeSpeedGroupAndEndsAtTurnEnd() {
        // D50, punto 1: dentro un gruppo le mosse restano simultanee. Il colpo e il pugno hanno la stessa velocità: il pugno resta
        // moltiplicato qualunque sia l'ordine dei posti.
        for (boolean aFirst : List.of(true, false)) {
            Player a = player("a", aHand(charge()), withStrikeOnTop(8));
            Player b = puncher();
            Game game = aFirst ? game(Ruleset.D50, a, b) : game(Ruleset.D50, b, a);
            turn(game, "Carica");
            b.getCardsInHand().add(hit("Pugno veloce", 2, "HIT 10")); // priorità 2 come il colpo: stesso gruppo
            assertEquals(15, turn(game, move(game, "a", STRIKE, "b"), move(game, "b", "Pugno veloce", "a")), "posti a prima: " + aFirst);
            assertTrue(vulnerabilities(a).isEmpty(), "D71: tolto a fine turno");
        }
    }

    @Test
    void anotherCopyWithTheSameNameEndsTheTokenAndTheFaceUpCard() {
        // a ha già una copia coperta del colpo; la ricerca ne trova un'altra, disegnata a faccia in su. Giocare il colpo per nome
        // gioca la prima copia in mano, quella coperta: il gettone è soddisfatto e la carta trovata non si mostra più.
        Card hidden = strike();
        Player a = player("a", aHand(charge(), hidden), withStrikeOnTop(8));
        Game game = game(Ruleset.D50, a, puncher());
        turn(game, "Carica");
        Card found = a.getRevealed().get(0).getCard();
        assertNotSame(hidden, found);
        JsonNode own = viewFor(game, "a").path("players").path("a"), seen = viewFor(game, "b").path("players").path("a");
        assertEquals(1, own.path("revealed").size(), "una sola carta a faccia in su");
        assertSame(found, a.getCardsInHand().get(own.path("revealed").get(0).path("slot").asInt()), "il posto indica la copia trovata");
        assertEquals(1, seen.path("revealed").size());
        assertFalse(seen.path("revealed").get(0).has("slot"), "l'avversario non vede il posto nella mano");
        assertEquals(15, turn(game, STRIKE), "N+1: gettone soddisfatto, nessun minimo");
        assertTrue(a.holds(found), "la copia trovata è ancora in mano");
        assertFalse(a.holds(hidden), "è uscita l'altra");
        assertTrue(vulnerabilities(a).isEmpty());
        assertTrue(a.getRevealed().isEmpty());
        assertFalse(viewFor(game, "b").path("players").path("a").has("revealed"), "l'informazione è spesa: non si mostra più");
        assertFalse(viewFor(game, "a").path("players").path("a").has("revealed"));
    }

    @Test
    void discardingTheFoundCardDoesNotEndTheToken() {
        Player a = player("a", aHand(charge()), withStrikeOnTop(8));
        Player b = puncher();
        Game game = game(Ruleset.D50, a, b);
        turn(game, "Carica");
        // La bound scarta il colpo: la carta non è più in mano né a faccia in su, il gettone resta.
        assertEquals(15, turn(game, boundMove(game, "a", STRIKE), move(game, "b", "Pugno", "a")));
        assertEquals(0, copiesInHand(a, STRIKE));
        assertFalse(viewFor(game, "b").path("players").path("a").has("revealed"));
        assertEquals(3, bound(a).size(), "lo scarto non conta");
        assertEquals(15, turn(game, "Riempitivo"));
        assertEquals(10, turn(game, "Riempitivo"), "D71: un turno dopo l'ultima copia, gettone finito");
        // Solo una carta con quel nome, giocata, lo toglie.
        a.getCardsInHand().add(strike());
        assertFalse(viewFor(game, "b").path("players").path("a").has("revealed"), "un'altra copia non diventa scoperta");
        assertEquals(10, turn(game, STRIKE));
        assertTrue(vulnerabilities(a).isEmpty());
        assertTrue(a.getRevealed().isEmpty(), "nessun segno rimasto");
    }

    @Test
    void aVoidedStrikeStillEndsTheToken() {
        Player a = player("a", aHand(charge()), withStrikeOnTop(8));
        Player b = puncher();
        Game game = game(Ruleset.D50, a, b);
        turn(game, "Carica");
        b.getCharacter().getResources().put(Resource.VIOLENCE, 5);
        b.getCardsInHand().add(youStop());
        b.getCharacter().getResources().put(Resource.ALERTNESS, 11); // «Fermo» e il colpo hanno priorità 2: b va prima
        int before = health(b);
        turn(game, move(game, "a", STRIKE, "b"), move(game, "b", "Fermo", "a"));
        assertTrue(game.getResolvedMoves().stream().anyMatch(m -> m.getPlayerId().equals("a") && m.isVoid()));
        assertEquals(before, health(b), "il colpo è annullato");
        assertTrue(vulnerabilities(a).isEmpty(), "giocato, anche se annullato");
        assertTrue(a.getRevealed().isEmpty());
    }

    @Test
    void aVoidedChargeGivesNeitherTokenNorSearch() {
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

    // ---- D69 (c) e D66: più gettoni ----

    @Test
    void twoTokensMultiplyAndOnePlayEndsTheOldest() {
        List<Card> deck = new ArrayList<>(List.of(strike(), strike()));
        deck.addAll(fillers("Riempitivo", 8));
        Player a = player("a", aHand(charge(), charge()), deck);
        Game game = game(Ruleset.D50, a, puncher());
        assertEquals(15, turn(game, "Carica"));
        assertEquals(22, turn(game, "Carica"), "N+1: due gettoni, 10 × 1,5 × 1,5 = 22,5, troncato come ogni stato");
        assertEquals(2, a.getRevealed().size());
        int first = a.getRevealed().get(0).getId(), second = a.getRevealed().get(1).getId();
        assertNotEquals(first, second);
        assertEquals(6, bound(a).size());
        assertEquals(22, turn(game, "Riempitivo"), "N+2");
        assertEquals(22, turn(game, STRIKE), "D71: entrambi attivi fino a fine turno, poi cade solo il più vecchio");
        assertEquals(1, a.getRevealed().size());
        assertEquals(second, a.getRevealed().get(0).getId());
        assertTrue(vulnerabilities(a).stream().allMatch(s -> Integer.valueOf(second).equals(s.getExposure())));
        assertEquals(15, turn(game, STRIKE), "D71: anche il secondo fino a fine turno");
        assertTrue(vulnerabilities(a).isEmpty());
    }

    @Test
    void aFailedSearchAfterASuccessfulOneAddsNoTokenD72() {
        List<Card> deck = new ArrayList<>(List.of(strike()));
        deck.addAll(fillers("Riempitivo", 8));
        Player a = player("a", aHand(charge(), charge()), deck);
        Game game = game(Ruleset.D50, a, puncher());
        turn(game, "Carica");
        int first = a.getRevealed().get(0).getId();
        assertEquals(15, turn(game, "Carica"), "D72: la seconda ricerca fallisce, nessun gettone aggiunto");
        assertEquals(1, a.getRevealed().size());
        assertEquals(3, bound(a).size());
        assertTrue(bound(a).stream().allMatch(s -> s.getExposure() == first));
        assertEquals(15, turn(game, "Riempitivo"), "N+2");
        assertEquals(15, turn(game, "Riempitivo"), "D72: resta soltanto il gettone della ricerca riuscita");
        assertEquals(15, turn(game, STRIKE));
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
        assertEquals(copy, forA.path("players").path("a").path("revealed").get(0).path("copy").asInt(), "stesso id per tutti");
        assertTrue(forB.path("players").path("a").path("cardsInHand").isNumber(), "la mano resta un numero");
        assertFalse(forB.toString().contains("Segreta"), "nessun'altra carta della mano");
        for (JsonNode s : forB.path("players").path("a").path("character").path("statuses")) {
            assertEquals(copy, s.path("exposure").asInt(), "il gettone ha l'id della carta trovata");
            assertEquals(STRIKE, s.path("untilPlayed").asText(), "e dice quale nome lo toglie");
            assertEquals(1.5, s.path("factor").asDouble());
            assertTrue(s.path("lastsForTurns").isNull(), "nessun timer");
        }
        // Riconnessione: la vista si ricostruisce dalla partita; anche dopo il giro di serializzazione dello stato salvato.
        Game restored = (Game) SerializationUtils.deserialize(SerializationUtils.serialize(game));
        Game again = game(Ruleset.D50, player("a", List.of(), List.of()), player("b", List.of(), List.of()));
        again.restoreFrom(restored);
        assertEquals(forB, viewFor(game, "b"));
        assertEquals(stripIds(forB), stripIds(viewFor(again, "b")));
        assertEquals(stripIds(forA), stripIds(viewFor(again, "a")));
        // Dopo il ripristino il gettone funziona: giocare il colpo lo toglie.
        assertEquals(15, turn(again, "Riempitivo"));
        assertEquals(15, turn(again, STRIKE), "D71: resta fino al fine turno anche dopo restore");
    }

    private static JsonNode stripIds(JsonNode view) {
        com.fasterxml.jackson.databind.node.ObjectNode copy = view.deepCopy();
        copy.remove("gameId");
        return copy;
    }

    @Test
    void theEndOfTheMatchDropsEveryTokenAndFaceUpCard() {
        Player a = player("a", aHand(charge()), withStrikeOnTop(8));
        Player b = puncher();
        Game game = game(Ruleset.D50, a, b);
        turn(game, "Carica");
        assertEquals(1, a.getRevealed().size());
        b.getCharacter().getResources().put(Resource.HEALTH, 5);
        a.getCardsInHand().add(hit("Finale", 2, "HIT 10"));
        turn(game, move(game, "a", "Finale", "b"), move(game, "b", "Pugno", "a"));
        assertTrue(game.isOver());
        assertEquals("a", game.getWinner().orElseThrow());
        assertEquals(1, copiesInHand(a, STRIKE), "il colpo è ancora in mano");
        assertTrue(a.getRevealed().isEmpty(), "ma non più a faccia in su");
        assertTrue(vulnerabilities(a).isEmpty(), "e nessun gettone");
        assertFalse(viewFor(game, "b").path("players").path("a").has("revealed"));
    }

    @Test
    void theEliminationOfTheOwnerDropsItsTokensWithoutChangingTheWinner() {
        Player a = player("a", aHand(charge()), withStrikeOnTop(8));
        Player b = puncher();
        Game game = game(Ruleset.D50, a, b);
        turn(game, "Carica");
        a.getCharacter().getResources().put(Resource.HEALTH, 12);
        turn(game, "Riempitivo"); // 10 × 1,5 = 15 ≥ 12
        assertTrue(game.isOver());
        assertEquals("b", game.getWinner().orElseThrow());
        assertTrue(a.getRevealed().isEmpty());
        assertTrue(vulnerabilities(a).isEmpty());
    }

    @Test
    void aForfeitEndsTheMatchAndDropsTheTokens() {
        Player a = player("a", aHand(charge()), withStrikeOnTop(8));
        Game game = game(Ruleset.D50, a, puncher());
        turn(game, "Carica");
        game.forfeit("b", "LEFT");
        assertTrue(game.isOver());
        assertTrue(a.getRevealed().isEmpty());
        assertTrue(vulnerabilities(a).isEmpty());
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
        // Uno stato che non è un gettone di vulnerabilità non porta i campi nuovi, con qualunque regola.
        for (Ruleset rules : Ruleset.values()) {
            Player a = player("a", List.of(filler("Attesa")), fillers("Riempitivo", 3));
            Game game = game(rules, a, puncher());
            a.getCharacter().getStatuses().add(Status.builder().name("Parata").description("HIT x0.4").type(com.gsc.bm.model.game.status.StatusType.GOOD)
                    .flow(com.gsc.bm.model.game.status.StatusFlow.INPUT).impactedProperty(com.gsc.bm.model.Damage.DamageType.HIT)
                    .amountFunction((com.gsc.bm.model.game.status.StatusAmountFunction) n -> n * 0.4f).lastsForTurns(1).build());
            JsonNode status = viewFor(game, "b").path("players").path("a").path("character").path("statuses").get(0);
            for (String field : List.of("exposure", "factor", "untilPlayed")) assertFalse(status.has(field), rules + " " + field);
        }
    }

    // ---- bot: la vista legge le carte a faccia in su e i gettoni ----

    @Test
    void theBotViewReadsTheFaceUpCardsAndTheTokens() {
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
        assertTrue(seenA.getSeat().getStatuses().stream().allMatch(s -> Integer.valueOf(shown.getCopy()).equals(s.getExposure())
                && STRIKE.equals(s.getUntilPlayed()) && s.getFactor() == 1.5f && s.getTurnsLeft() == null));
        BotView.RevealedSeen own = forA.getSelf().getRevealed().get(0);
        assertEquals(shown.getCopy(), own.getCopy());
        assertEquals(STRIKE, forA.getSelf().getHand().get(own.getSlot()).getName());
        assertTrue(forB.getSelf().getRevealed().isEmpty());
        // La vista dei bot non contiene altre carte della mano di a.
        assertFalse(forB.toString().contains("Segreta"));
    }

    // ---- formato della bozza ----

    @Test void aSearchOfItsOwnNameDoesNotSatisfyTheNewTokenM3() {
        String json = "{'binding':'t.Eco','kind':'ACTION','priority':2,'targets':['SELF'],'self':["
                + "{'op':'search','card':'t.Eco','vulnerability':{'factor':1.5}}]}";
        Player a = player("a", aHand(card("Eco", json)), List.of(card("Eco", json), filler("Riempitivo")));
        Game g = game(Ruleset.D50, a, puncher());
        assertEquals(15, turn(g, "Eco"));
        assertEquals(3, bound(a).size()); assertEquals(1, a.getShownRevealed().size());
        assertEquals(15, turn(g, "Eco"), "la giocata successiva soddisfa il vecchio gettone");
        assertTrue(bound(a).isEmpty()); assertTrue(a.getRevealed().isEmpty());
    }

    @Test void conditionalSearchResourcesAreAppliedExactlyOnceAndOnlyWithD50() {
        for (Ruleset rules : Ruleset.values()) for (boolean finds : List.of(true, false)) {
            Card charge = card("Condizionale", "{'binding':'t.C','kind':'ACTION','priority':2,'targets':['SELF'],'self':["
                    + "{'op':'search','card':'t." + STRIKE + "','foundGains':{'VIOLENCE':15},'missedGains':{'VIOLENCE':5},"
                    + "'vulnerability':{'factor':1.5}}]}");
            Player a = player("a", aHand(charge), finds ? withStrikeOnTop(8) : fillers("Riempitivo", 8));
            Game g = game(rules, a, puncher());
            turn(g, "Condizionale");
            if (rules.playground()) assertTrue(g.getResolvedMoves().stream().filter(m -> m.getPlayerId().equals("a"))
                    .flatMap(m -> m.getMoveReport().get(Card.CardTarget.SELF).stream()).anyMatch(line -> line.contains("VIOLENCE:")),
                    "D72: i guadagni condizionali restano leggibili nel riepilogo");
            assertEquals(rules.playground() ? finds ? 15 : 5 : 0, a.getResources().get(Resource.VIOLENCE));
            assertEquals(rules.playground() && finds ? 3 : 0, vulnerabilities(a).size());
            turn(g, "Riempitivo");
            assertEquals(rules.playground() ? finds ? 16 : 6 : 1, a.getResources().get(Resource.VIOLENCE), "nessun guadagno ripetuto");
        }
    }

    @Test void malformedConditionalResourceMapsAreRejected() {
        for(String invalid:List.of("null","{'VIOLENCE':-1}","{'VIOLENCE':null}","{'UNKNOWN':5}"))
            for(String field:List.of("foundGains","missedGains"))assertThrows(Exception.class,()->DataCards.definition(JSON.readTree(
                    ("{'binding':'t.C','kind':'ACTION','targets':['SELF'],'self':[{'op':'search','card':'t.X','"+field+"':"+invalid+"}]}").replace('\'', '"'))));
    }

    @Test void periodicPoisonIsAmplifiedOnTheTurnThatSatisfiesTheToken() {
        Player a = player("a", aHand(charge()), withStrikeOnTop(8));
        Game g = game(Ruleset.D50, a, puncher()); turn(g, "Carica");
        a.getResources().put(Resource.TOXICITY, 10);
        assertEquals(22, turn(g, STRIKE), "15 avversario + floor(5 × 1,5) periodico");
        assertTrue(bound(a).isEmpty());
    }

    @Test void discardingOneCopyKeepsTheTokenWhileAnotherIsInTheDeck() {
        List<Card> deck = new ArrayList<>(withStrikeOnTop(8)); deck.add(strike());
        Player a = player("a", aHand(charge()), deck); Player b = puncher();
        Game g = game(Ruleset.D50, a, b); turn(g, "Carica");
        assertFalse(viewFor(g, "a").path("players").path("a").has("lastTokenCopies"));
        turn(g, boundMove(g, "a", STRIKE), move(g, "b", "Pugno", "a"));
        for (int i = 0; i < 3; i++) assertEquals(15, turn(g, "Riempitivo"));
        assertTrue(bound(a).stream().allMatch(s -> s.getLastsForTurns() == null));
    }

    @Test void theLastCopyWarningIsPrivateAndTheExitSurvivesRestore() {
        Player a = player("a", aHand(charge()), withStrikeOnTop(8)); Player b = puncher();
        Game g = game(Ruleset.D50, a, b); turn(g, "Carica");
        assertEquals(STRIKE, viewFor(g, "a").path("players").path("a").path("lastTokenCopies").get(0).asText());
        assertFalse(viewFor(g, "b").path("players").path("a").has("lastTokenCopies"));
        turn(g, boundMove(g, "a", STRIKE), move(g, "b", "Pugno", "a"));
        assertTrue(bound(a).stream().allMatch(s -> s.getLastsForTurns() == 0));
        Game copy = (Game) SerializationUtils.deserialize(SerializationUtils.serialize(g));
        assertEquals(15, turn(copy, "Riempitivo"));
        assertTrue(bound(copy.getPlayers().get("a")).isEmpty());
        assertEquals(10, turn(copy, "Riempitivo"));
    }

    @Test void aFastPlayStaysExposedToEverySlowerFfaOpponent() {
        Player a = player("a", aHand(charge()), withStrikeOnTop(8));
        Player b = puncher(); Player c = player("c", List.of(hit("Terzo", 0, "CUT 10")), List.of(hit("Terzo", 0, "CUT 10")));
        Game g = game(Ruleset.D50, a, b, c);
        assertEquals(30, turn(g, move(g, "a", "Carica", "SELF"), move(g, "b", "Pugno", "a"), move(g, "c", "Terzo", "a")));
        assertEquals(30, turn(g, move(g, "a", STRIKE, "b"), move(g, "b", "Pugno", "a"), move(g, "c", "Terzo", "a")));
        assertTrue(bound(a).isEmpty());
    }

    @Test void aDownAuthorCanHealWhileTheTokenStillAmplifiesDamageD48() {
        Card cure = card("Cura", "{'binding':'t.Cura','kind':'ACTION','priority':-1,'targets':['SELF'],'self':[{'op':'gain','resource':'HEALTH','amount':30}]}");
        Player a = player("a", aHand(charge(), cure), withStrikeOnTop(8)); Player b = puncher();
        Game g = game(Ruleset.D50, a, b); turn(g, "Carica"); a.getResources().put(Resource.HEALTH, 1);
        turn(g, "Cura"); assertEquals(30, health(a));
        assertFalse(g.getResolvedMoves().stream().filter(m -> m.getPlayerId().equals("a")).findFirst().orElseThrow().isVoid());
        assertEquals(3, bound(a).size());
    }

    @Test
    void theDraftFormatDescribesSearchVulnerabilityFactorAndDuration() throws Exception {
        DataCards.Definition ok = DataCards.definition(JSON.readTree(("{'binding':'t.C','kind':'ACTION','targets':['SELF'],'self':[{'op':'search',"
                + "'card':'t.X','vulnerability':{'factor':2,'turnsIfNotFound':3,'damage':['CUT','POISON']}}]}").replace('\'', '"')));
        Vulnerability v = ((DataCards.SearchStep) ok.self.get(0)).vulnerability;
        assertEquals("t.X", ok.searches());
        assertEquals(2f, v.factor.floatValue());
        assertEquals(3, v.turnsIfNotFound.intValue());
        assertEquals(Set.of(com.gsc.bm.model.Damage.DamageType.CUT, com.gsc.bm.model.Damage.DamageType.POISON), v.damage);
        List<Status> timed = v.statuses(7, null), named = v.statuses(8, "X");
        assertTrue(timed.isEmpty(), "D72: nessun gettone quando manca la carta, anche leggendo il vecchio campo durata");
        assertTrue(named.stream().allMatch(s -> s.getLastsForTurns() == null && s.getExposure() == 8 && "X".equals(s.getUntilPlayed())));
        for (String bad : List.of("{'factor':0,'turnsIfNotFound':2}", "{'factor':1.5,'turnsIfNotFound':0}", "{'turnsIfNotFound':2}",
                "{'factor':1.5,'turnsIfNotFound':2,'damage':[]}", "{'factor':1.5,'turnsIfNotFound':2,'altro':1}",
                "{'factor':1.5,'minTurns':2}")) {
            String json = ("{'binding':'t.C','kind':'ACTION','targets':['SELF'],'self':[{'op':'search','card':'t.X','vulnerability':" + bad + "}]}")
                    .replace('\'', '"');
            assertThrows(Exception.class, () -> DataCards.definition(JSON.readTree(json)), bad);
        }
    }

    @Test
    void aDraftSearchCannotTargetAnObject() throws Exception {
        // D70: per ora una ricerca cerca solo carte che vanno in mano. La bozza com'è passa; con PAZIENZA: FINITA che cerca un oggetto
        // il caricatore la rifiuta.
        com.fasterxml.jackson.databind.node.ObjectNode root = (com.fasterxml.jackson.databind.node.ObjectNode) Draft.fromClasspath(Listino.SET_BASE).json();
        Draft.parse("bozza.json", root.deepCopy());
        for (JsonNode card : root.get("cards"))
            if ("bruiser.Glare".equals(card.get("binding").asText()))
                for (JsonNode step : card.get("self"))
                    if ("search".equals(step.get("op").asText()))
                        ((com.fasterxml.jackson.databind.node.ObjectNode) step).put("card", "base.items.PosacenereDiVetro");
        Exception refused = assertThrows(Exception.class, () -> Draft.parse("ricerca-di-oggetto.json", root));
        assertTrue(refused.getMessage().contains("una ricerca non può cercare un oggetto (D70)"), refused.getMessage());
    }

    private static List<Card> withStrikeOnTop(int fillers) {
        List<Card> deck = new ArrayList<>();
        deck.add(filler("Cima"));
        deck.add(strike());
        deck.addAll(fillers("Riempitivo", fillers));
        return deck;
    }
}
