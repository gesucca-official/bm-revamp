package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.LoadableCard;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.status.Status;
import org.junit.jupiter.api.BeforeAll;
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
 * SB-17 Fase B (D106–D108): the new cards of Sergio Sommerso in the engine, with the d50 rules of the playground. «s» is Sergio, faster
 * than «b» at equal priority (more A); «b» plays test cards built as in {@link VulnerabilitaD69Test}.
 */
class Sb17CardsTest {
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final String STRIKE = "Colpo cercato";
    private static Draft draft;

    @BeforeAll
    static void load() throws Exception { draft = Draft.fromClasspath("/set-base/bozza.json"); }

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

    private static Card hit(String name, int priority, String... damages) {
        String steps = java.util.Arrays.stream(damages).map(d -> "{'op':'damage','type':'" + d.split(" ")[0] + "','amount':" + d.split(" ")[1] + "}")
                .collect(Collectors.joining(","));
        return card(name, "{'binding':'t." + name + "','kind':'ACTION','priority':" + priority + ",'targets':['OPPONENT'],'target':[" + steps + "]}");
    }

    private static Card strike() { return hit(STRIKE, 2, "HIT 30"); }

    private static Card filler(String name) {
        return card(name, "{'binding':'t." + name + "','kind':'ACTION','targets':['SELF'],'self':[{'op':'gain','resource':'VIOLENCE','amount':1}]}");
    }

    private static Card charge() {
        return card("Carica", "{'binding':'t.Carica','kind':'ACTION','priority':2,'targets':['SELF'],'self':[{'op':'gain','resource':'VIOLENCE','amount':5},"
                + "{'op':'search','card':'t." + STRIKE + "','vulnerability':{'factor':1.5,'turnsIfNotFound':2}}]}");
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

    private static Character character(String id, int alertness) {
        Map<Resource, Integer> resources = new EnumMap<>(Resource.class);
        resources.put(Resource.HEALTH, 500);
        resources.put(Resource.ALERTNESS, alertness);
        return new Draft.DraftCharacter(id, resources, 3, Set.of());
    }

    private static List<Card> fillers(int n) {
        List<Card> cards = new ArrayList<>();
        for (int i = 0; i < n; i++) cards.add(filler("Riempitivo"));
        return cards;
    }

    /** Hand: basic, bound, the given cards and two fillers; deck: the first card of the list is the top. */
    private static Player player(String id, int alertness, List<Card> hand, List<Card> deck) {
        Player p = new Player(id, character(id, alertness), basic(), List.of(bound(id)), lastResort(), List.of(), new Random(1));
        p.getCardsInHand().clear();
        p.getCardsInHand().add(basic());
        p.getCardsInHand().add(bound(id));
        p.getCardsInHand().addAll(hand);
        p.getCardsInHand().addAll(fillers(2));
        List<Card> reversed = new ArrayList<>(deck);
        Collections.reverse(reversed);
        p.getDeck().addAll(reversed);
        return p;
    }

    /** Sergio: 60 A, his cards from the draft in hand, fillers in the deck. */
    private static Player sergio(String... bindings) {
        List<Card> hand = new ArrayList<>();
        for (String b : bindings) hand.add(draft.card(b));
        return player("s", 60, hand, fillers(12));
    }

    private static Player opponent(List<Card> hand, List<Card> deck) { return player("b", 10, hand, deck); }

    private static List<Card> strikeOnTop() {
        List<Card> deck = new ArrayList<>(List.of(strike()));
        deck.addAll(fillers(10));
        return deck;
    }

    private static Game game(Player... players) {
        Game game = new Game(List.of(players), "sb-17", false);
        game.useRuleset(Ruleset.D50);
        return game;
    }

    private static Move move(Game game, String player, String card, String target) {
        return new Move(card, player, target, game.getGameId(), new EnumMap<>(Move.AdditionalAction.class));
    }

    private static int health(Game game, String id) { return game.getPlayers().get(id).getCharacter().getResources().get(Resource.HEALTH); }

    /** One turn; returns the health lost by s and by b. */
    private static int[] turn(Game game, Move... moves) {
        int s = health(game, "s"), b = health(game, "b");
        for (Move m : moves) game.submitMove(m);
        game.resolveMoves(g -> { }, (t, events) -> { });
        return new int[]{s - health(game, "s"), b - health(game, "b")};
    }

    private static List<Status> tokens(Game game, String id) {
        return game.getPlayers().get(id).getCharacter().getStatuses().stream().filter(st -> st.getExposure() != null).collect(Collectors.toList());
    }

    private static boolean voided(Game game, String id) {
        return game.getResolvedMoves().stream().anyMatch(m -> m.getPlayerId().equals(id) && m.isVoid());
    }

    /** b charges and finds the strike: a token on b, the strike face up in b's hand. */
    private static Game charged(Player s, Player b) {
        Game game = game(s, b);
        turn(game, move(game, "s", "Riempitivo", "SELF"), move(game, "b", "Carica", "SELF"));
        assertFalse(tokens(game, "b").isEmpty(), "the charge found the strike: a token per damage type");
        return game;
    }

    // ---- Ricatto (CES-AR2, D106 (2)) ----

    @Test
    void ricattoVoidsALaterHitAndReflectsHalfItsBaseDamage() {
        Player b = opponent(List.of(hit("Pugno", 1, "HIT 30")), fillers(10));
        Game game = game(sergio("base.cesira.Ricatto"), b);
        int[] lost = turn(game, move(game, "s", "Ricatto", "b"), move(game, "b", "Pugno", "s"));
        assertTrue(voided(game, "b"));
        assertArrayEquals(new int[]{0, 15}, lost, "30 HIT voided, 15 HIT to b");
        assertEquals(45, game.getPlayers().get("s").getCharacter().getResources().get(Resource.ALERTNESS), "15 A paid");
    }

    @Test
    void ricattoReflectsEachTypeTruncated() {
        Player b = opponent(List.of(hit("Misto", 1, "HIT 10", "CUT 11")), fillers(10));
        Game game = game(sergio("base.cesira.Ricatto"), b);
        assertArrayEquals(new int[]{0, 10}, turn(game, move(game, "s", "Ricatto", "b"), move(game, "b", "Misto", "s")), "5 HIT + 5 CUT (5,5 truncated)");
    }

    @Test
    void ricattoOnAMoveWithoutDamageReflectsNothing() {
        Player b = opponent(List.of(charge()), strikeOnTop());
        Game game = game(sergio("base.cesira.Ricatto"), b);
        assertArrayEquals(new int[]{0, 0}, turn(game, move(game, "s", "Ricatto", "b"), move(game, "b", "Carica", "SELF")));
        assertTrue(voided(game, "b"));
        assertTrue(tokens(game, "b").isEmpty(), "a voided charge gives no token (D72)");
    }

    @Test
    void ricattoTooSlowVoidsNothingAndReflectsNothing() {
        Player b = player("b", 90, List.of(hit("Veloce", 2, "HIT 30")), fillers(10)); // same priority, more A: b first
        Game game = game(sergio("base.cesira.Ricatto"), b);
        assertArrayEquals(new int[]{30, 0}, turn(game, move(game, "s", "Ricatto", "b"), move(game, "b", "Veloce", "s")));
        assertFalse(voided(game, "b"));
    }

    @Test
    void ricattoOnTheAnnouncedStrikeReflectsTheBaseAndTheTokenEnds() {
        Game game = charged(sergio("base.cesira.Ricatto"), opponent(List.of(charge()), strikeOnTop()));
        int[] lost = turn(game, move(game, "s", "Ricatto", "b"), move(game, "b", STRIKE, "s"));
        assertTrue(voided(game, "b"));
        assertEquals(0, lost[0]);
        assertEquals(22, lost[1], "15 reflected from the base 30, ×1,5 on b's token, truncated");
        assertTrue(tokens(game, "b").isEmpty(), "RP-15: the announced card played ends the token even if voided");
    }

    @Test
    void theBaseDamageIgnoresAheadVariablePartsAndPerPlay() {
        // Cinghiata di traverso: 18 + half the author's A, ahead +5 → base 18. Struggle: 10 + 5 per play, 5 + 2 to self → base 10.
        assertEquals(Map.of(Damage.DamageType.CUT, 18), base("base.mara.CinghiataDiTraverso"));
        assertEquals(Map.of(Damage.DamageType.HIT, 10), base("com.last.Struggle"));
        assertEquals(Map.of(Damage.DamageType.HIT, 8), base("base.cesira.ContoSalato"), "the part on the token is not base");
        assertEquals(Map.of(Damage.DamageType.HIT, 5), base("base.cesira.Malelingue"));
        assertEquals(Map.of(), base("base.cesira.Ricatto"));
    }

    private static Map<Damage.DamageType, Integer> base(String binding) {
        Card c = draft.card(binding);
        return PrintedEffects.baseDamage(((PrintedEffects.Source) c).printedEffects());
    }

    @Test
    void ricattoOnAnAheadHitReflectsOnlyTheBase() {
        Card cinghiata = draft.card("base.mara.CinghiataDiTraverso");
        Player b = player("b", 40, List.of(cinghiata), fillers(10));
        Game game = game(sergio("base.cesira.Ricatto"), b);
        assertArrayEquals(new int[]{0, 9}, turn(game, move(game, "s", "Ricatto", "b"), move(game, "b", cinghiata.getName(), "s")),
                "18 CUT of base, half reflected; the A of b and the ahead bonus do not count");
    }

    @Test
    void aReflectionThatDownsTheTargetEndsTheGame() {
        Player b = opponent(List.of(hit("Pugno", 1, "HIT 30")), fillers(10));
        b.getCharacter().getResources().put(Resource.HEALTH, 10);
        Game game = game(sergio("base.cesira.Ricatto"), b);
        turn(game, move(game, "s", "Ricatto", "b"), move(game, "b", "Pugno", "s"));
        assertTrue(game.getPlayers().get("b").getCharacter().isDead(), "15 reflected on 10 health: b is down");
        assertEquals(500, health(game, "s"));
        assertEquals("s", game.getWinner().orElseThrow());
    }

    // ---- Lo sapevo (CES-AR3, D106 (3), D108) ----

    @Test
    void loSapevoKeepsTheTokenOfTheVoidedStrikeWithoutOtherCopies() {
        Game game = charged(sergio("base.cesira.LoSapevo", "base.cesira.ContoSalato"), opponent(List.of(charge()), strikeOnTop()));
        assertArrayEquals(new int[]{0, 0}, turn(game, move(game, "s", "Lo sapevo", "b"), move(game, "b", STRIKE, "s")));
        assertTrue(voided(game, "b"));
        assertFalse(tokens(game, "b").isEmpty(), "the voided strike does not satisfy the token");
        assertFalse(game.getPlayers().get("b").getRevealed().isEmpty(), "the mark of the found card stays with the token");
        assertEquals(50, game.getPlayers().get("s").getCharacter().getResources().get(Resource.ALERTNESS), "60 − 10 A paid");
        // As after a discard (D71): with no copy left, the token lasts one more whole turn.
        assertEquals(30, turn(game, move(game, "s", "Conto salato", "b"), move(game, "b", "Riempitivo", "SELF"))[1], "(8 + 12) × 1,5, riserva del giro 3");
        assertTrue(tokens(game, "b").isEmpty(), "ended a turn after the last copy left the hand");
    }

    @Test
    void loSapevoKeepsTheTokenWhileAnotherCopyIsInHand() {
        Game game = charged(sergio("base.cesira.LoSapevo"), opponent(List.of(charge(), strike()), strikeOnTop()));
        turn(game, move(game, "s", "Lo sapevo", "b"), move(game, "b", STRIKE, "s"));
        assertTrue(voided(game, "b"));
        for (int n = 1; n <= 3; n++) {
            turn(game, move(game, "s", "Riempitivo", "SELF"), move(game, "b", "Riempitivo", "SELF"));
            assertFalse(tokens(game, "b").isEmpty(), "N+" + n + ": another copy in hand, the name not played yet");
        }
        turn(game, move(game, "s", "Riempitivo", "SELF"), move(game, "b", STRIKE, "s"));
        assertTrue(tokens(game, "b").isEmpty(), "the other copy played ends it");
    }

    @Test
    void loSapevoOnAnUnannouncedMoveOnlyVoids() {
        Player b = opponent(List.of(hit("Pugno", 1, "HIT 30")), fillers(10));
        Game game = game(sergio("base.cesira.LoSapevo"), b);
        assertArrayEquals(new int[]{0, 0}, turn(game, move(game, "s", "Lo sapevo", "b"), move(game, "b", "Pugno", "s")));
        assertTrue(voided(game, "b"));
        assertTrue(tokens(game, "b").isEmpty());
    }

    @Test
    void outsideThePlaygroundTheMarkIsIgnored() {
        // D108: the condition in Game is behind Ruleset.playground(); with the live rules there are no tokens to keep.
        Move m = new Move("x", "b", "s", "g", new EnumMap<>(Move.AdditionalAction.class));
        assertFalse(m.isKeepsToken());
        m.setKeepsToken(true);
        assertTrue(m.isKeepsToken());
        assertFalse(Ruleset.LIVE.playground());
    }

    // ---- Conto salato (CES-AR4): the condition on the token ----

    @Test
    void contoSalatoDealsEightOrTwentyOnAToken() {
        List<Card> deck = new ArrayList<>(List.of(filler("Riempitivo")));
        deck.addAll(strikeOnTop()); // the first draw is a filler: the strike is still in the deck for the charge
        Player b = opponent(List.of(charge()), deck);
        Game game = game(sergio("base.cesira.ContoSalato", "base.cesira.ContoSalato"), b);
        assertEquals(8, turn(game, move(game, "s", "Conto salato", "b"), move(game, "b", "Riempitivo", "SELF"))[1], "no token");
        turn(game, move(game, "s", "Riempitivo", "SELF"), move(game, "b", "Carica", "SELF"));
        assertFalse(tokens(game, "b").isEmpty());
        assertEquals(30, turn(game, move(game, "s", "Conto salato", "b"), move(game, "b", "Riempitivo", "SELF"))[1], "(8 + 12) × 1,5, riserva del giro 3");
    }

    @Test
    void theTokenStepIsOnlyOnTheTargetAndHoldsNoSearch() {
        assertThrows(Exception.class, () -> DataCards.definition(JSON.readTree(("{'binding':'t.X','kind':'ACTION','targets':['SELF'],"
                + "'self':[{'op':'gettone','steps':[{'op':'gain','resource':'ALERTNESS','amount':1}]}]}").replace('\'', '"'))));
        assertThrows(Exception.class, () -> DataCards.definition(JSON.readTree(("{'binding':'t.X','kind':'ACTION','targets':['OPPONENT'],"
                + "'target':[{'op':'gettone','steps':[{'op':'search','card':'t.Y'}]}]}").replace('\'', '"'))));
        assertThrows(Exception.class, () -> DataCards.definition(JSON.readTree(("{'binding':'t.X','kind':'ACTION','targets':['OPPONENT'],"
                + "'target':[{'op':'gettone','steps':[{'op':'gettone','steps':[]}]}]}").replace('\'', '"'))));
        PrintedEffects printed = ((PrintedEffects.Source) draft.card("base.cesira.ContoSalato")).printedEffects();
        assertEquals(2, printed.getSteps().stream().filter(st -> st.getKind() == PrintedEffects.Kind.DAMAGE).count());
        assertEquals(1, printed.getSteps().stream().filter(PrintedEffects.Step::isIfToken).count(), "the second 8 HIT only on a token");
    }

    // ---- Oh, guarda là (CES-AR1, D106 (1)): Sergio's charge ----

    @Test
    void ohGuardaLaAnnouncesContoSalatoOrMalelingue() {
        assertEquals(List.of("base.cesira.ContoSalato", "base.cesira.Malelingue"), PrintedEffects.searchedNames(draft.card("base.cesira.OhGuardaLa")));
    }

    // ---- generics and items of the test deck (D107) ----

    @Test
    void santinoGivesATemporaryImmunityToAlcohol() {
        Card santino = draft.card("base.items.SantinoDellaPortinaia");
        Character c = character("s", 10);
        ((com.gsc.bm.model.cards.AbstractCard) santino).applyEffectOnSelf(c);
        assertTrue(c.getImmunities().contains(Resource.ALCOHOL));
        assertFalse(c.getImmunities().contains(Resource.TOXICITY), "only alcohol, unlike MarvelousCocktail");
        assertEquals(1, c.getTimers().size());
        assertEquals(PrintedEffects.Kind.IMMUNE, ((PrintedEffects.Source) santino).printedEffects().getSteps().get(0).getKind());
    }

    @Test
    void shuffleFeetSwapsTheTraysKeepingCapacities() {
        Card shuffle = draft.card("base.com.ShuffleFeet");
        assertEquals(-1, shuffle.getPriority());
        Map<Resource, Integer> r = new EnumMap<>(Resource.class);
        r.put(Resource.HEALTH, 50);
        r.put(Resource.ALERTNESS, 10);
        Character small = new Draft.DraftCharacter("s", r, 1, Set.of()), large = new Draft.DraftCharacter("b", r, 3, Set.of());
        small.getItems().add(draft.card("base.items.EspressoDelDistributore"));
        for (String b : List.of("com.items.CocktailOnTheGround", "base.items.CascoDaLavoro", "base.items.GuantiDaOfficina"))
            large.getItems().add(draft.card(b));
        ((com.gsc.bm.model.cards.AbstractCard) shuffle).applyEffectOnTarget(small, large);
        assertEquals(List.of("Guanti da officina"), names(small.getItems()), "the last item fits the capacity 1");
        assertEquals(List.of("Espresso del distributore"), names(large.getItems()));
        assertEquals(PrintedEffects.Kind.SWAP_ITEMS, ((PrintedEffects.Source) shuffle).printedEffects().getSteps().get(0).getKind());
    }

    private static List<String> names(java.util.Collection<Card> cards) {
        return cards.stream().map(Card::getName).collect(Collectors.toList());
    }
}
