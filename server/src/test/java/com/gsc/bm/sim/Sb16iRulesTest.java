package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.LoadableCard;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.IllegalMoveException;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.status.Status;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

/**
 * SB-16i Fase B (D97), the playground rules of the 1.6, each branch with a case that fails if the branch changes:
 * «Annuncia X o Y» (order and availability of the names, the player's choice, no choice, none left), the shuffle after every
 * search behind the draft's setting, «Gioca d'anticipo» (priority, ALERTNESS after costs, same group, target without a move,
 * target down later, own move voided) and «Rincara» (public counter per player and title, voided plays counted, perPlay zero).
 * With the live rules none of them acts.
 */
class Sb16iRulesTest {
    private static final ObjectMapper JSON = new ObjectMapper();

    // ---- cards and table ----

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

    private static Card hit(String name, int priority, int amount) {
        return card(name, "{'binding':'t." + name + "','kind':'ACTION','priority':" + priority + ",'targets':['OPPONENT'],"
                + "'target':[{'op':'damage','type':'HIT','amount':" + amount + "}]}");
    }

    private static Card filler(String name) {
        return card(name, "{'binding':'t." + name + "','kind':'ACTION','targets':['SELF'],'self':[{'op':'gain','resource':'VIOLENCE','amount':1}]}");
    }

    private static Card basic() {
        return card("Basic", "{'binding':'t.Basic','kind':'ACTION','basic':true,'priority':-1,'targets':['SELF'],"
                + "'self':[{'op':'gain','resource':'ALERTNESS','amount':1}]}");
    }

    private static Card lastResort(int perPlay, int perPlaySelf) {
        return card("Ultima", "{'binding':'t.Ultima','kind':'ACTION','lastResort':true,'targets':['OPPONENT'],"
                + "'self':[{'op':'damage','type':'HIT','amount':{'base':5,'perPlay':" + perPlaySelf + "}}],"
                + "'target':[{'op':'damage','type':'HIT','amount':{'base':10,'perPlay':" + perPlay + "}}]}");
    }

    /** «Annuncia X o Y»: priority 2, on self; +10 V if found, +2 V if not. */
    private static Card charge() {
        return card("Carica", "{'binding':'t.Carica','kind':'ACTION','priority':2,'targets':['SELF'],'self':[{'op':'search',"
                + "'cards':['t.X','t.Y'],'vulnerability':{'factor':1.5},'foundGains':{'VIOLENCE':10},'missedGains':{'VIOLENCE':2}}]}");
    }

    /** «Gioca d'anticipo»: priority p, cost c of A, 3 CUT to the target; ahead: +8 A to self and +10 CUT to the target. */
    private static Card ahead(int priority, int cost) {
        return card("Anticipo", "{'binding':'t.Anticipo','kind':'ACTION','priority':" + priority + ",'targets':['OPPONENT'],"
                + "'cost':{'ALERTNESS':" + cost + "},'self':[{'op':'anticipo','steps':[{'op':'gain','resource':'ALERTNESS','amount':8}]}],"
                + "'target':[{'op':'damage','type':'CUT','amount':3},{'op':'anticipo','steps':[{'op':'damage','type':'CUT','amount':10}]}]}");
    }

    private static Character character(String id, int alertness) {
        Map<Resource, Integer> resources = new EnumMap<>(Resource.class);
        resources.put(Resource.HEALTH, 500);
        resources.put(Resource.ALERTNESS, alertness);
        return new Draft.DraftCharacter(id, resources, 3, Set.of());
    }

    /** Hand: basic, then the given cards; deck: the first card of the list is the top. */
    private static Player player(String id, int alertness, Card last, List<Card> hand, List<Card> deck) {
        Player p = new Player(id, character(id, alertness), basic(), List.of(), last, List.of(), new Random(1));
        p.getCardsInHand().clear();
        p.getCardsInHand().add(basic());
        p.getCardsInHand().addAll(hand);
        List<Card> reversed = new ArrayList<>(deck);
        Collections.reverse(reversed);
        p.getDeck().addAll(reversed);
        return p;
    }

    private static List<Card> fillers(String name, int n) {
        List<Card> cards = new ArrayList<>();
        for (int i = 0; i < n; i++) cards.add(filler(name));
        return cards;
    }

    private static Game game(Ruleset rules, Player... players) {
        Game game = new Game(List.of(players), "sb-16i", false);
        game.useRuleset(rules);
        return game;
    }

    private static Move move(Game game, String player, String card, String target) {
        return new Move(card, player, target, game.getGameId(), new EnumMap<>(Move.AdditionalAction.class));
    }

    private static Move resolved(Game game, String player) {
        return game.getResolvedMoves().stream().filter(m -> m.getPlayerId().equals(player)).findFirst().orElseThrow();
    }

    private static void turn(Game game, Move... moves) {
        for (Move m : moves) game.submitMove(m);
        game.resolveMoves(g -> { }, (t, events) -> { });
    }

    private static int resource(Player p, Resource r) { return p.getCharacter().getResources().get(r); }

    private static Player idle(String id) { return player(id, 10, lastResort(0, 0), fillers("Attesa", 4), fillers("Attesa", 10)); }

    /** a plays the charge with the given deck (top first) and choice; b waits. */
    private static Game charged(List<Card> deck, String choice, Ruleset rules) {
        Player a = player("a", 10, lastResort(0, 0), List.of(charge(), filler("Riempitivo")), deck);
        Game game = game(rules, a, idle("b"));
        Move m = move(game, "a", "Carica", "SELF");
        if (choice != null) m.setSearchChoice(choice);
        turn(game, m, move(game, "b", "Attesa", "SELF"));
        return game;
    }

    private static List<Card> deck(String... names) {
        List<Card> deck = new ArrayList<>();
        for (String n : names) deck.add(n.startsWith("Riempitivo") ? filler("Riempitivo") : hit(n, 1, 20));
        return deck;
    }

    private static List<String> tokenNames(Player p) {
        return p.getCharacter().getStatuses().stream().map(Status::getUntilPlayed).filter(java.util.Objects::nonNull).distinct()
                .collect(Collectors.toList());
    }

    // ---- «Annuncia X o Y» ----

    @Test
    void theChosenNameIsFoundAndBindsTheToken() {
        Game game = charged(deck("Riempitivo", "X", "Y", "Riempitivo"), "t.Y", Ruleset.D50);
        Player a = game.getPlayers().get("a");
        Move m = resolved(game, "a");
        assertEquals("t.Y", m.getSearchedFor());
        assertEquals("Y", m.getSearchFound().getName());
        assertEquals(List.of("t.X", "t.Y"), m.getPublicSearch().getAnnounced());
        assertEquals(List.of("Y"), tokenNames(a), "the token is bound to the name chosen and found");
        assertEquals(10, resource(a, Resource.VIOLENCE));
        assertTrue(a.getDeck().stream().anyMatch(c -> c.getName().equals("X")), "the other name stays in the deck");
    }

    @Test
    void withoutAChoiceTheFirstPrintedNameWithACopyIsSearched() {
        Game both = charged(deck("Riempitivo", "Y", "X"), null, Ruleset.D50);
        assertEquals("t.X", resolved(both, "a").getSearchedFor(), "both in the deck: the first printed name, not the nearest copy");
        assertEquals("X", resolved(both, "a").getSearchFound().getName());
        Game second = charged(deck("Riempitivo", "Y", "Riempitivo"), null, Ruleset.D50);
        assertEquals("Y", resolved(second, "a").getSearchFound().getName(), "only the second in the deck: the second, automatically");
        assertEquals(List.of("t.Y"), resolved(second, "a").getSearchAvailable());
    }

    @Test
    void withNoAnnouncedNameInTheDeckTheSearchFailsAndDraws() {
        Game game = charged(deck("Riempitivo", "Riempitivo"), null, Ruleset.D50);
        Player a = game.getPlayers().get("a");
        Move m = resolved(game, "a");
        assertNull(m.getSearchFound());
        assertEquals("t.X", m.getSearchedFor());
        assertEquals(List.of(), m.getSearchAvailable());
        assertTrue(tokenNames(a).isEmpty(), "D72: no token after a failed search");
        assertEquals(2, resource(a, Resource.VIOLENCE));
        assertEquals(1, a.getDeckSize(), "a normal draw");
        assertTrue(m.getMoveReport().get(Card.CardTarget.SELF).stream().anyMatch(l -> l.contains("none in the deck")));
    }

    @Test
    void aChoiceNotPrintedOrWithoutACopyIsRefused() {
        Player a = player("a", 10, lastResort(0, 0), List.of(charge()), deck("X", "Riempitivo"));
        Game game = game(Ruleset.D50, a, idle("b"));
        Move absent = move(game, "a", "Carica", "SELF");
        absent.setSearchChoice("t.Y");
        assertThrows(IllegalMoveException.class, () -> game.submitMove(absent));
        Move foreign = move(game, "a", "Carica", "SELF");
        foreign.setSearchChoice("t.Riempitivo");
        assertThrows(IllegalMoveException.class, () -> game.submitMove(foreign));
        Game live = game(Ruleset.LIVE, player("a", 10, lastResort(0, 0), List.of(charge()), deck("X")), idle("b"));
        Move liveChoice = move(live, "a", "Carica", "SELF");
        liveChoice.setSearchChoice("t.X");
        assertThrows(IllegalMoveException.class, () -> live.submitMove(liveChoice), "no choice with the live rules");
    }

    @Test
    void theEngineStopsIfTheDeckChangedBetweenThePlayAndTheSearch() {
        Player a = player("a", 10, lastResort(0, 0), List.of(charge(), filler("Riempitivo")), deck("X", "Y"));
        Game game = game(Ruleset.D50, a, idle("b"));
        game.submitMove(move(game, "a", "Carica", "SELF"));
        game.submitMove(move(game, "b", "Attesa", "SELF"));
        a.getDeck().removeIf(c -> c.getName().equals("X"));
        assertThrows(IllegalStateException.class, () -> game.resolveMoves(g -> { }, (t, e) -> { }));
    }

    // ---- shuffle after every search (setting of the draft) ----

    private static List<String> deckAfter(boolean shuffle, List<Card> deck) {
        Player a = player("a", 10, lastResort(0, 0), List.of(charge(), filler("Riempitivo")), deck);
        a.getCharacter().useSearchShuffle(shuffle);
        Game game = game(Ruleset.D50, a, idle("b"));
        turn(game, move(game, "a", "Carica", "SELF"), move(game, "b", "Attesa", "SELF"));
        return a.getDeck().stream().map(c -> c.getName() + "@" + System.identityHashCode(c)).collect(Collectors.toList());
    }

    @Test
    void theDeckIsShuffledAfterEverySearchOnlyWithTheSetting() {
        List<Card> found = new ArrayList<>(deck("A1", "A2", "X", "A3", "A4", "A5", "A6", "A7", "A8"));
        List<String> kept = deckAfter(false, found);
        List<String> expected = new ArrayList<>();
        for (int i = found.size() - 1; i >= 0; i--) if (!found.get(i).getName().equals("X")) expected.add(found.get(i).getName() + "@" + System.identityHashCode(found.get(i)));
        assertEquals(expected, kept, "no setting: the deck keeps its order (historical drafts)");
        List<String> shuffled = deckAfter(true, found);
        List<String> again = new ArrayList<>(expected);
        Collections.shuffle(again, new Random(1));
        assertEquals(again, shuffled, "setting on: the remaining deck shuffled with the player's generator");
        assertNotEquals(expected, shuffled);
        List<Card> missed = new ArrayList<>(deck("A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9"));
        List<String> plain = deckAfter(false, missed), mixed = deckAfter(true, missed);
        assertNotEquals(plain, mixed, "a failed search shuffles too");
        assertEquals(new java.util.HashSet<>(plain), new java.util.HashSet<>(mixed));
    }

    // ---- «Gioca d'anticipo» ----

    /** a plays the keyword card (priority, cost) with ALERTNESS aA; b plays a 1 HIT at priority bP with ALERTNESS bA. */
    private static Move aheadTurn(int priority, int cost, int aA, int bP, int bA, boolean bMoves) {
        Player a = player("a", aA, lastResort(0, 0), List.of(ahead(priority, cost), filler("Riempitivo")), fillers("Riempitivo", 6));
        Player b = player("b", bA, lastResort(0, 0), List.of(hit("Spinta", bP, 1), filler("Attesa")), fillers("Attesa", 6));
        Game game = game(Ruleset.D50, a, b);
        if (bMoves) turn(game, move(game, "a", "Anticipo", "b"), move(game, "b", "Spinta", "a"));
        else turn(game, move(game, "a", "Anticipo", "b"), Move.voidMove("b"));
        Move m = resolved(game, "a");
        int cut = 500 - resource(b, Resource.HEALTH);
        assertEquals(m.getAhead() ? 13 : 3, cut, "the extra applies exactly when ahead");
        assertEquals(aA - cost + (m.getAhead() ? 8 : 0), resource(a, Resource.ALERTNESS));
        return m;
    }

    @Test
    void aheadByPriority() {
        assertTrue(aheadTurn(2, 0, 10, 1, 50, true).getAhead(), "higher priority: ahead, whatever the ALERTNESS");
        assertFalse(aheadTurn(1, 0, 50, 2, 10, true).getAhead(), "lower priority: after");
    }

    @Test
    void aheadByAlertnessAfterCosts() {
        assertTrue(aheadTurn(1, 0, 30, 1, 20, true).getAhead());
        assertFalse(aheadTurn(1, 15, 30, 1, 20, true).getAhead(), "30 - 15 = 15 < 20 after the cost: after");
    }

    @Test
    void noAheadInTheSameGroupOrWithoutAMove() {
        assertFalse(aheadTurn(1, 10, 30, 1, 20, true).getAhead(), "same priority and ALERTNESS after costs: simultaneous");
        assertFalse(aheadTurn(2, 0, 30, 1, 20, false).getAhead(), "the target sends no move: nothing to precede");
    }

    @Test
    void aheadHoldsWhenTheTargetIsBroughtDownAndNotWhenTheOwnMoveIsVoided() {
        Player a = player("a", 10, lastResort(0, 0), List.of(ahead(2, 0), filler("Riempitivo")), fillers("Riempitivo", 6));
        Player b = player("b", 10, lastResort(0, 0), List.of(hit("Spinta", 1, 1), filler("Attesa")), fillers("Attesa", 6));
        b.getCharacter().getResources().put(Resource.HEALTH, 12);
        Game game = game(Ruleset.D50, a, b);
        turn(game, move(game, "a", "Anticipo", "b"), move(game, "b", "Spinta", "a"));
        assertTrue(resolved(game, "a").getAhead(), "the target's move is voided later («a terra»): the move still came first");
        assertTrue(resolved(game, "b").isVoid());
        assertEquals(500, resource(a, Resource.HEALTH));

        // Three seats: c brings a down first; a's move would come before b's, but it is voided.
        Player a2 = player("a", 10, lastResort(0, 0), List.of(ahead(2, 0), filler("Riempitivo")), fillers("Riempitivo", 6));
        Player b2 = player("b", 10, lastResort(0, 0), List.of(hit("Spinta", 1, 1), filler("Attesa")), fillers("Attesa", 6));
        Player c2 = player("c", 10, lastResort(0, 0), List.of(hit("Colpaccio", 3, 600), filler("Attesa")), fillers("Attesa", 6));
        Game down = game(Ruleset.D50, a2, b2, c2);
        turn(down, move(down, "a", "Anticipo", "b"), move(down, "b", "Spinta", "c"), move(down, "c", "Colpaccio", "a"));
        assertTrue(resolved(down, "a").isVoid());
        assertFalse(resolved(down, "a").getAhead(), "own move voided: no effect, so no «anticipo»");
        assertEquals(500, resource(b2, Resource.HEALTH));
    }

    @Test
    void theKeywordMeansNothingWithTheLiveRules() {
        Player a = player("a", 30, lastResort(0, 0), List.of(ahead(2, 0), filler("Riempitivo")), fillers("Riempitivo", 6));
        Player b = player("b", 10, lastResort(0, 0), List.of(hit("Spinta", 1, 1), filler("Attesa")), fillers("Attesa", 6));
        Game game = game(Ruleset.LIVE, a, b);
        turn(game, move(game, "a", "Anticipo", "b"), move(game, "b", "Spinta", "a"));
        assertNull(resolved(game, "a").getAhead());
        assertEquals(497, resource(b, Resource.HEALTH));
        assertNull(resolved(game, "a").getPlays());
        assertTrue(a.getCharacter().playCounts().isEmpty());
    }

    @Test
    void thePrintedEffectsMarkTheConditionalSteps() {
        PrintedEffects effects = ((PrintedEffects.Source) ahead(2, 0)).printedEffects();
        assertEquals(List.of(true, false, true), effects.getSteps().stream().map(PrintedEffects.Step::isAhead).collect(Collectors.toList()));
        assertTrue(PrintedEffects.hasAhead(ahead(2, 0)));
        assertFalse(PrintedEffects.hasAhead(hit("Spinta", 1, 1)));
        assertEquals(List.of("t.X", "t.Y"), PrintedEffects.searchedNames(charge()));
    }

    // ---- «Rincara» ----

    @Test
    void theLastResortGrowsWithEveryEarlierPlayVoidedOnesIncluded() {
        Player a = player("a", 10, lastResort(5, 2), List.of(), List.of());
        a.getCardsInHand().add(lastResort(5, 2));
        Player b = player("b", 10, lastResort(0, 0), List.of(), fillers("Attesa", 20));
        b.getCardsInHand().addAll(fillers("Attesa", 5));
        Game game = game(Ruleset.D50, a, b);
        int[] dealt = new int[3], taken = new int[3];
        for (int k = 0; k < 3; k++) {
            int hb = resource(b, Resource.HEALTH), ha = resource(a, Resource.HEALTH);
            turn(game, move(game, "a", "Ultima", "b"), move(game, "b", "Attesa", "SELF"));
            dealt[k] = hb - resource(b, Resource.HEALTH);
            taken[k] = ha - resource(a, Resource.HEALTH);
            assertEquals(k, resolved(game, "a").getPlays());
            assertNull(resolved(game, "b").getPlays(), "a card without «Rincara» shows no count");
        }
        assertArrayEquals(new int[]{10, 15, 20}, dealt);
        assertArrayEquals(new int[]{5, 7, 9}, taken);
        assertEquals(3, a.getCharacter().playsOf("Ultima"));
        assertEquals(0, b.getCharacter().playsOf("Ultima"), "per player: the opponent's plays do not count");

        Player c = player("a", 10, lastResort(5, 2), List.of(), List.of());
        c.getCardsInHand().add(lastResort(5, 2));
        Player d = player("b", 10, lastResort(0, 0), List.of(hit("Colpaccio", 2, 490)), fillers("Attesa", 20));
        d.getCardsInHand().addAll(fillers("Attesa", 4));
        Game voided = game(Ruleset.D50, c, d);
        c.getCharacter().getResources().put(Resource.HEALTH, 400);
        turn(voided, move(voided, "a", "Ultima", "b"), move(voided, "b", "Colpaccio", "a"));
        assertTrue(resolved(voided, "a").isVoid());
        assertEquals(1, c.getCharacter().playsOf("Ultima"), "a voided play counts");
    }

    @Test
    void perPlayZeroLeavesTheCardAsPrinted() {
        Player a = player("a", 10, lastResort(0, 0), List.of(), List.of());
        a.getCardsInHand().add(lastResort(0, 0));
        Player b = player("b", 10, lastResort(0, 0), List.of(), fillers("Attesa", 20));
        b.getCardsInHand().addAll(fillers("Attesa", 5));
        Game game = game(Ruleset.D50, a, b);
        for (int k = 0; k < 3; k++) {
            int hb = resource(b, Resource.HEALTH);
            turn(game, move(game, "a", "Ultima", "b"), move(game, "b", "Attesa", "SELF"));
            assertEquals(10, hb - resource(b, Resource.HEALTH));
            assertNull(resolved(game, "a").getPlays(), "no «Rincara» printed: no public count on the move");
        }
        assertEquals(3, a.getCharacter().playsOf("Ultima"), "the engine counts anyway; the card ignores it");
    }

    // ---- public view of the move ----

    @Test
    void theNewFieldsArePublicOnlyWhenTheyApply() {
        Game game = charged(deck("X", "Y"), "t.Y", Ruleset.D50);
        JsonNode charge = JSON.valueToTree(resolved(game, "a"));
        assertEquals("t.Y", charge.path("search").path("card").asText());
        assertEquals(2, charge.path("search").path("announced").size());
        assertFalse(charge.has("ahead"));
        assertFalse(charge.has("plays"));
        assertFalse(charge.has("searchChoice"), "the choice is not a protocol field yet (client step of SB-16i)");
        JsonNode idle = JSON.valueToTree(resolved(game, "b"));
        assertFalse(idle.has("search") || idle.has("ahead") || idle.has("plays"));
        Game one = game(Ruleset.D50, player("a", 10, lastResort(0, 0), List.of(card("Solo", "{'binding':'t.Solo','kind':'ACTION',"
                + "'targets':['SELF'],'self':[{'op':'search','card':'t.X'}]}"), filler("Riempitivo")), deck("X")), idle("b"));
        turn(one, move(one, "a", "Solo", "SELF"), move(one, "b", "Attesa", "SELF"));
        assertFalse(JSON.valueToTree(resolved(one, "a")).path("search").has("announced"), "one name: the field is absent, as before");
    }

    // ---- the draft loader ----

    @Test
    void theLoaderChecksTheNewFields() throws Exception {
        String base = "{'binding':'t.C','kind':'ACTION','targets':['SELF'],'self':[{'op':'search',";
        assertThrows(IllegalArgumentException.class, () -> DataCards.definition(JSON.readTree((base + "'cards':['t.X','t.X']}]}").replace('\'', '"'))));
        assertThrows(IllegalArgumentException.class, () -> DataCards.definition(JSON.readTree((base + "'cards':['t.X','t.Y','t.Z']}]}").replace('\'', '"'))));
        assertThrows(IllegalArgumentException.class, () -> DataCards.definition(JSON.readTree((base + "'card':'t.X','cards':['t.Y']}]}").replace('\'', '"'))));
        assertEquals(List.of("t.X", "t.Y"), DataCards.definition(JSON.readTree((base + "'cards':['t.X','t.Y']}]}").replace('\'', '"'))).searchesAll());
        String anticipo = "{'binding':'t.A','kind':'ACTION','targets':['OPPONENT'],'target':[{'op':'anticipo','steps':[%s]}]}";
        assertThrows(IllegalArgumentException.class, () -> DataCards.definition(JSON.readTree(String.format(anticipo, "").replace('\'', '"'))));
        assertThrows(IllegalArgumentException.class, () -> DataCards.definition(JSON.readTree(String.format(anticipo,
                "{'op':'search','card':'t.X'}").replace('\'', '"'))));
        assertThrows(IllegalArgumentException.class, () -> DataCards.definition(JSON.readTree(
                "{'binding':'t.R','kind':'ACTION','targets':['OPPONENT'],'target':[{'op':'damage','type':'HIT','amount':{'base':1,'perPlay':-1}}]}".replace('\'', '"'))));
    }
}
