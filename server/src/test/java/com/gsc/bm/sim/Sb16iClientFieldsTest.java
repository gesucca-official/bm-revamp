package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.api.ws.MoveCommandValidator;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.LoadableCard;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.IllegalMoveException;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.service.catalog.CatalogSource;
import com.gsc.bm.service.view.ViewExtractorServiceImpl;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.TreeSet;

import static org.junit.jupiter.api.Assertions.*;

/**
 * SB-16i, client step (D97 (2) and (4), D101, D102): the fields the client of the 1.6b reads or writes.
 * <ul>
 *     <li>{@code searchChoice} in the move command: accepted by the validator, checked by the engine, refused with the live rules
 *     («no search choice with these rules»), never shown when a move is read;</li>
 *     <li>{@code searchable} in the own view: for each card in hand announcing two names, the names with a copy in the deck;</li>
 *     <li>{@code plays} in the character view: the public play counter, per title.</li>
 * </ul>
 * All of them exist only with {@code d50}; with the live rules the views have exactly the fields of before.
 */
class Sb16iClientFieldsTest {
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final MoveCommandValidator VALIDATOR = new MoveCommandValidator();
    private static final ViewExtractorServiceImpl VIEWS = new ViewExtractorServiceImpl(new CatalogSource() {
        public List<String> cardBindings() { return List.of(); }
        public List<String> characterBindings() { return List.of(); }
        public boolean hasCard(String binding) { return false; }
        public boolean hasCharacter(String binding) { return true; }
        public Optional<CharacterGui> characterGui(String binding) { return Optional.of(new CharacterGui(binding, null)); }
    });

    // ---- cards and table (as in Sb16iRulesTest) ----

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

    private static Card hit(String name) {
        return card(name, "{'binding':'t." + name + "','kind':'ACTION','priority':1,'targets':['OPPONENT'],"
                + "'target':[{'op':'damage','type':'HIT','amount':20}]}");
    }

    private static Card filler(String name) {
        return card(name, "{'binding':'t." + name + "','kind':'ACTION','targets':['SELF'],'self':[{'op':'gain','resource':'VIOLENCE','amount':1}]}");
    }

    private static Card basic() {
        return card("Basic", "{'binding':'t.Basic','kind':'ACTION','basic':true,'priority':-1,'targets':['SELF'],"
                + "'self':[{'op':'gain','resource':'ALERTNESS','amount':1}]}");
    }

    private static Card lastResort() {
        return card("Ultima Dose", "{'binding':'t.Ultima','kind':'ACTION','lastResort':true,'targets':['OPPONENT'],"
                + "'self':[{'op':'damage','type':'HIT','amount':{'base':5,'perPlay':2}}],"
                + "'target':[{'op':'damage','type':'HIT','amount':{'base':10,'perPlay':5}}]}");
    }

    /** «Annuncia X o Y». */
    private static Card charge() {
        return card("Carica", "{'binding':'t.Carica','kind':'ACTION','priority':2,'targets':['SELF'],'self':[{'op':'search',"
                + "'cards':['t.X','t.Y'],'vulnerability':{'factor':1.5},'foundGains':{'VIOLENCE':10},'missedGains':{'VIOLENCE':2}}]}");
    }

    /** «Annuncia Z o X», a second two-name card. */
    private static Card otherCharge() {
        return card("Altra carica", "{'binding':'t.Altra','kind':'ACTION','priority':2,'targets':['SELF'],'self':[{'op':'search',"
                + "'cards':['t.Z','t.X']}]}");
    }

    /** «Annuncia X», one name only. */
    private static Card single() {
        return card("Solo", "{'binding':'t.Solo','kind':'ACTION','targets':['SELF'],'self':[{'op':'search','card':'t.X'}]}");
    }

    private static Character character(String id) {
        Map<Resource, Integer> resources = new EnumMap<>(Resource.class);
        resources.put(Resource.HEALTH, 500);
        resources.put(Resource.ALERTNESS, 10);
        return new Draft.DraftCharacter(id, resources, 3, Set.of());
    }

    /** Hand: basic, then the given cards; deck: the first card of the list is the top. */
    private static Player player(String id, List<Card> hand, List<Card> deck) {
        Player p = new Player(id, character(id), basic(), List.of(), lastResort(), List.of(), new Random(1));
        p.getCardsInHand().clear();
        p.getCardsInHand().add(basic());
        p.getCardsInHand().addAll(hand);
        List<Card> reversed = new ArrayList<>(deck);
        Collections.reverse(reversed);
        p.getDeck().addAll(reversed);
        return p;
    }

    private static List<Card> deck(String... names) {
        List<Card> deck = new ArrayList<>();
        for (String n : names) deck.add(n.startsWith("Riempitivo") ? filler("Riempitivo") : hit(n));
        return deck;
    }

    private static Player idle(String id) {
        List<Card> hand = new ArrayList<>(), deck = new ArrayList<>();
        for (int i = 0; i < 4; i++) hand.add(filler("Attesa"));
        for (int i = 0; i < 10; i++) deck.add(filler("Attesa"));
        return player(id, hand, deck);
    }

    private static Game game(Ruleset rules, Player... players) {
        Game game = new Game(List.of(players), "sb-16i-client", false);
        game.useRuleset(rules);
        return game;
    }

    private static ObjectNode command(Game game, String player, String card, String target) {
        return JSON.createObjectNode().put("playedCardName", card).put("playerId", player).put("targetId", target)
                .put("gameId", game.getGameId());
    }

    /** The protocol path of a human move: the validator of the command, then the engine (GameController, GameSessionService). */
    private static Move send(Game game, ObjectNode command) {
        Move move = VALIDATOR.validate(game, command.path("playerId").asText(), game.getGameId(), command);
        game.submitMove(move);
        return move;
    }

    private static void resolve(Game game) { game.resolveMoves(g -> { }, (t, events) -> { }); }

    private static Move resolved(Game game, String player) {
        return game.getResolvedMoves().stream().filter(m -> m.getPlayerId().equals(player)).findFirst().orElseThrow();
    }

    private static JsonNode viewFor(Game game, String viewer) { return JSON.valueToTree(VIEWS.extractViewFor(game, viewer)); }

    private static Set<String> fieldNames(JsonNode node) {
        Set<String> names = new TreeSet<>();
        node.fieldNames().forEachRemaining(names::add);
        return names;
    }

    // ---- searchChoice in the move command ----

    @Test
    void theChoiceTravelsInTheCommandAndTheResolvedSearchShowsIt() {
        Game game = game(Ruleset.D50, player("a", List.of(charge(), filler("Riempitivo")), deck("Riempitivo", "X", "Y")), idle("b"));
        Move sent = send(game, command(game, "a", "Carica", "SELF").put("searchChoice", "t.Y"));
        assertEquals("t.Y", sent.getSearchChoice());
        assertFalse(JSON.valueToTree(sent).has("searchChoice"), "never shown when the move is read");
        assertFalse(viewFor(game, "a").path("pendingMove").has("searchChoice"), "not even in the own pending move");
        assertEquals("Carica", viewFor(game, "a").path("pendingMove").path("playedCardName").asText());
        send(game, command(game, "b", "Attesa", "SELF"));
        resolve(game);
        JsonNode search = JSON.valueToTree(resolved(game, "a")).path("search");
        assertEquals("t.Y", search.path("card").asText(), "the name chosen");
        assertTrue(search.path("found").asBoolean());
        assertEquals("Y", search.path("revealed").path("name").asText());
        assertEquals(List.of("t.X", "t.Y"), List.of(search.path("announced").get(0).asText(), search.path("announced").get(1).asText()));
        assertFalse(viewFor(game, "b").toString().contains("searchChoice"));
    }

    @Test
    void withoutTheFieldTheCommandIsAsBeforeAndTheFirstPrintedNameIsSearched() {
        Game game = game(Ruleset.D50, player("a", List.of(charge()), deck("Riempitivo", "Y", "X")), idle("b"));
        Move sent = send(game, command(game, "a", "Carica", "SELF"));
        assertNull(sent.getSearchChoice());
        send(game, command(game, "b", "Attesa", "SELF"));
        resolve(game);
        assertEquals("t.X", resolved(game, "a").getSearchedFor());
    }

    @Test
    void aMalformedChoiceIsRefusedByTheValidatorAndAWrongOneByTheEngine() {
        for (JsonNode bad : List.of(JSON.getNodeFactory().numberNode(3), JSON.getNodeFactory().textNode(" "),
                JSON.getNodeFactory().nullNode(), JSON.createObjectNode())) {
            Game game = game(Ruleset.D50, player("a", List.of(charge()), deck("X", "Y")), idle("b"));
            ObjectNode body = command(game, "a", "Carica", "SELF");
            body.set("searchChoice", bad);
            IllegalMoveException e = assertThrows(IllegalMoveException.class, () -> send(game, body), bad.toString());
            assertEquals("Invalid search choice", e.getWhatHeDid());
            assertTrue(game.getPendingMoves().isEmpty());
        }
        Game game = game(Ruleset.D50, player("a", List.of(charge()), deck("X", "Riempitivo")), idle("b"));
        IllegalMoveException absent = assertThrows(IllegalMoveException.class,
                () -> send(game, command(game, "a", "Carica", "SELF").put("searchChoice", "t.Y")));
        assertEquals("no copy of t.Y in the deck", absent.getWhatHeDid());
        IllegalMoveException foreign = assertThrows(IllegalMoveException.class,
                () -> send(game, command(game, "a", "Carica", "SELF").put("searchChoice", "t.Riempitivo")));
        assertEquals("the card does not announce t.Riempitivo", foreign.getWhatHeDid());
        assertTrue(game.getPendingMoves().isEmpty());
    }

    @Test
    void withTheLiveRulesAChoiceIsRefusedAsBefore() {
        Game game = game(Ruleset.LEGACY, player("a", List.of(charge()), deck("X", "Y")), idle("b"));
        IllegalMoveException e = assertThrows(IllegalMoveException.class,
                () -> send(game, command(game, "a", "Carica", "SELF").put("searchChoice", "t.X")));
        assertEquals("no search choice with these rules", e.getWhatHeDid());
        assertTrue(game.getPendingMoves().isEmpty());
        send(game, command(game, "a", "Carica", "SELF"));
        assertEquals(1, game.getPendingMoves().size(), "the same command without the field is accepted, as before");
    }

    // ---- searchable in the own view ----

    @Test
    void theOwnViewSaysWhichAnnouncedNamesHaveACopyInTheDeck() {
        Player a = player("a", List.of(charge(), charge(), otherCharge(), single()), deck("Riempitivo", "Y", "Riempitivo", "Y", "X"));
        Game game = game(Ruleset.D50, a, idle("b"));
        JsonNode forA = viewFor(game, "a"), searchable = forA.path("players").path("a").path("searchable");
        assertEquals(Set.of("t.Altra", "t.Carica"), fieldNames(searchable), "only the cards announcing two names, once per card");
        assertEquals("[\"t.X\",\"t.Y\"]", searchable.path("t.Carica").toString(), "printed order, not the order of the deck; no count");
        assertEquals("[\"t.X\"]", searchable.path("t.Altra").toString(), "a name without copies is left out");
        a.getDeck().removeIf(c -> c.getBindingName().equals("t.X"));
        searchable = viewFor(game, "a").path("players").path("a").path("searchable");
        assertEquals("[\"t.Y\"]", searchable.path("t.Carica").toString(), "one name left: the client plays it without asking");
        assertEquals("[]", searchable.path("t.Altra").toString(), "none left: the search will fail");
        JsonNode forB = viewFor(game, "b");
        assertFalse(forB.path("players").path("a").has("searchable"), "never in an opponent's view");
        assertFalse(forB.toString().contains("t.Y"), "nothing of a's deck reaches b");
        assertFalse(forA.path("players").path("b").has("searchable"));
    }

    @Test
    void withoutTwoNameCardsOrWithTheLiveRulesTheFieldIsAbsent() {
        Game none = game(Ruleset.D50, player("a", List.of(single(), filler("Riempitivo")), deck("X")), idle("b"));
        assertFalse(viewFor(none, "a").path("players").path("a").has("searchable"));
        Game live = game(Ruleset.LEGACY, player("a", List.of(charge()), deck("X", "Y")), idle("b"));
        assertFalse(viewFor(live, "a").path("players").path("a").has("searchable"));
    }

    // ---- plays in the character view ----

    @Test
    void theCharacterViewCountsThePlaysPerTitleForEveryone() {
        Player a = player("a", List.of(), List.of());
        a.getCardsInHand().add(lastResort());
        Game game = game(Ruleset.D50, a, idle("b"));
        JsonNode before = viewFor(game, "b").path("players").path("a").path("character").path("plays");
        assertTrue(before.isObject() && before.isEmpty(), "with these rules always present, empty before the first play");
        for (int k = 0; k < 2; k++) {
            send(game, command(game, "a", "Ultima Dose", "b"));
            send(game, command(game, "b", "Attesa", "SELF"));
            resolve(game);
        }
        for (String viewer : List.of("a", "b")) {
            JsonNode view = viewFor(game, viewer);
            JsonNode plays = view.path("players").path("a").path("character").path("plays");
            assertEquals(2, plays.path("ultima dose").asInt(), viewer + ": per title, in lower case, the same for everyone");
            assertEquals(Set.of("ultima dose"), fieldNames(plays));
            assertEquals(2, view.path("players").path("b").path("character").path("plays").path("attesa").asInt());
        }
        assertEquals(1, resolved(game, "a").getPlays(), "the move still says the earlier plays");
    }

    @Test
    void withTheLiveRulesTheViewsHaveTheFieldsOfBefore() {
        Player a = player("a", List.of(charge(), filler("Riempitivo")), deck("X", "Y"));
        Game game = game(Ruleset.LEGACY, a, idle("b"));
        send(game, command(game, "a", "Riempitivo", "SELF"));
        send(game, command(game, "b", "Attesa", "SELF"));
        resolve(game);
        JsonNode forA = viewFor(game, "a");
        assertEquals(Set.of("playerId", "character", "cardsInHand", "deck"), fieldNames(forA.path("players").path("a")));
        assertEquals(Set.of("playerId", "character", "cardsInHand", "deck"), fieldNames(forA.path("players").path("b")));
        assertEquals(Set.of("name", "bindingName", "dead", "itemsSize", "items", "resources", "statuses", "immunities", "timers", "sprite"),
                fieldNames(forA.path("players").path("a").path("character")));
        for (JsonNode m : forA.path("resolvedMoves")) {
            assertFalse(m.has("searchChoice") || m.has("search") || m.has("ahead") || m.has("plays"));
        }
    }
}
