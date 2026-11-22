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
import com.gsc.bm.model.game.bot.AggressivePolicy;
import com.gsc.bm.model.game.bot.BotPolicy;
import com.gsc.bm.model.game.bot.BotView;
import com.gsc.bm.model.game.bot.LethalAwarePolicy;
import com.gsc.bm.model.game.bot.PrudentPolicy;
import com.gsc.bm.model.game.bot.RandomPolicy;
import com.gsc.bm.model.game.bot.ResourceAwarePolicy;
import com.gsc.bm.model.game.bot.SoughtHitPolicy;
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
 * SB-17 Fase B (D106–D108), B3 and B4 (D114, D118): the new cards of Sergio Sommerso in the engine, with the d50 rules of the playground. «s» is Sergio, faster
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
        int[] lost = turn(game, move(game, "s", "Buon Vecchio Ricatto", "b"), move(game, "b", "Pugno", "s"));
        assertTrue(voided(game, "b"));
        assertArrayEquals(new int[]{0, 15}, lost, "30 HIT voided, 15 HIT to b");
        assertEquals(45, game.getPlayers().get("s").getCharacter().getResources().get(Resource.ALERTNESS), "15 A paid");
    }

    @Test
    void ricattoReflectsEachTypeTruncated() {
        Player b = opponent(List.of(hit("Misto", 1, "HIT 10", "CUT 11")), fillers(10));
        Game game = game(sergio("base.cesira.Ricatto"), b);
        assertArrayEquals(new int[]{0, 10}, turn(game, move(game, "s", "Buon Vecchio Ricatto", "b"), move(game, "b", "Misto", "s")), "5 HIT + 5 CUT (5,5 truncated)");
    }

    @Test
    void ricattoOnAMoveWithoutDamageReflectsNothing() {
        Player b = opponent(List.of(charge()), strikeOnTop());
        Game game = game(sergio("base.cesira.Ricatto"), b);
        assertArrayEquals(new int[]{0, 0}, turn(game, move(game, "s", "Buon Vecchio Ricatto", "b"), move(game, "b", "Carica", "SELF")));
        assertTrue(voided(game, "b"));
        assertTrue(tokens(game, "b").isEmpty(), "a voided charge gives no token (D72)");
    }

    @Test
    void ricattoTooSlowVoidsNothingAndReflectsNothing() {
        Player b = player("b", 90, List.of(hit("Veloce", 2, "HIT 30")), fillers(10)); // same priority, more A: b first
        Game game = game(sergio("base.cesira.Ricatto"), b);
        assertArrayEquals(new int[]{30, 0}, turn(game, move(game, "s", "Buon Vecchio Ricatto", "b"), move(game, "b", "Veloce", "s")));
        assertFalse(voided(game, "b"));
    }

    @Test
    void ricattoOnTheAnnouncedStrikeReflectsTheBaseAndTheTokenEnds() {
        Game game = charged(sergio("base.cesira.Ricatto"), opponent(List.of(charge()), strikeOnTop()));
        int[] lost = turn(game, move(game, "s", "Buon Vecchio Ricatto", "b"), move(game, "b", STRIKE, "s"));
        assertTrue(voided(game, "b"));
        assertEquals(0, lost[0]);
        assertEquals(22, lost[1], "15 reflected from the base 30, ×1,5 on b's token, truncated");
        assertTrue(tokens(game, "b").isEmpty(), "RP-15: the announced card played ends the token even if voided");
    }

    @Test
    void theBaseDamageIgnoresAheadVariablePartsAndPerPlay() {
        // Cinghiata di traverso: 20 + half the author's A, ahead +5 → base 20 (SB-21z, D162: was 18). Struggle: 10 + 5 per play, 5 + 2 to self → base 10.
        assertEquals(Map.of(Damage.DamageType.CUT, 20), base("base.mara.CinghiataDiTraverso"));
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
        assertArrayEquals(new int[]{0, 10}, turn(game, move(game, "s", "Buon Vecchio Ricatto", "b"), move(game, "b", cinghiata.getName(), "s")),
                "20 CUT of base (SB-21z, D162), half reflected; the A of b and the ahead bonus do not count");
    }

    @Test
    void aReflectionThatDownsTheTargetEndsTheGame() {
        Player b = opponent(List.of(hit("Pugno", 1, "HIT 30")), fillers(10));
        b.getCharacter().getResources().put(Resource.HEALTH, 10);
        Game game = game(sergio("base.cesira.Ricatto"), b);
        turn(game, move(game, "s", "Buon Vecchio Ricatto", "b"), move(game, "b", "Pugno", "s"));
        assertTrue(game.getPlayers().get("b").getCharacter().isDead(), "15 reflected on 10 health: b is down");
        assertEquals(500, health(game, "s"));
        assertEquals("s", game.getWinner().orElseThrow());
    }

    // ---- Lo sapevo (CES-AR3, D106 (3), D108) ----

    @Test
    void loSapevoKeepsTheTokenOfTheVoidedStrikeWithoutOtherCopies() {
        Game game = charged(sergio("base.cesira.LoSapevo", "base.cesira.ContoSalato"), opponent(List.of(charge()), strikeOnTop()));
        assertArrayEquals(new int[]{0, 0}, turn(game, move(game, "s", "Copione Già Visto", "b"), move(game, "b", STRIKE, "s")));
        assertTrue(voided(game, "b"));
        assertFalse(tokens(game, "b").isEmpty(), "the voided strike does not satisfy the token");
        assertFalse(game.getPlayers().get("b").getRevealed().isEmpty(), "the mark of the found card stays with the token");
        assertEquals(50, game.getPlayers().get("s").getCharacter().getResources().get(Resource.ALERTNESS), "60 − 10 A paid");
        // As after a discard (D71): with no copy left, the token lasts one more whole turn.
        assertEquals(21, turn(game, move(game, "s", "Conto Salato", "b"), move(game, "b", "Riempitivo", "SELF"))[1], "(8 + 6) × 1,5, B2 (D110)");
        assertTrue(tokens(game, "b").isEmpty(), "ended a turn after the last copy left the hand");
    }

    @Test
    void loSapevoKeepsTheTokenWhileAnotherCopyIsInHand() {
        Game game = charged(sergio("base.cesira.LoSapevo"), opponent(List.of(charge(), strike()), strikeOnTop()));
        turn(game, move(game, "s", "Copione Già Visto", "b"), move(game, "b", STRIKE, "s"));
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
        assertArrayEquals(new int[]{0, 0}, turn(game, move(game, "s", "Copione Già Visto", "b"), move(game, "b", "Pugno", "s")));
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
    void contoSalatoDealsEightOrFourteenOnAToken() {
        List<Card> deck = new ArrayList<>(List.of(filler("Riempitivo")));
        deck.addAll(strikeOnTop()); // the first draw is a filler: the strike is still in the deck for the charge
        Player b = opponent(List.of(charge()), deck);
        Game game = game(sergio("base.cesira.ContoSalato", "base.cesira.ContoSalato"), b);
        assertEquals(8, turn(game, move(game, "s", "Conto Salato", "b"), move(game, "b", "Riempitivo", "SELF"))[1], "no token");
        turn(game, move(game, "s", "Riempitivo", "SELF"), move(game, "b", "Carica", "SELF"));
        assertFalse(tokens(game, "b").isEmpty());
        assertEquals(21, turn(game, move(game, "s", "Conto Salato", "b"), move(game, "b", "Riempitivo", "SELF"))[1], "(8 + 6) × 1,5, B2 (D110)");
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
        assertEquals(1, printed.getSteps().stream().filter(PrintedEffects.Step::isIfToken).count(), "the +6 HIT (B2, D110) only on a token");
    }

    // ---- Oh, guarda là (CES-AR1, D106 (1)): Sergio's charge ----

    @Test
    void ohGuardaLaAnnouncesLoSannoTuttiOrContoSalato() {
        // SB-17 B2 (D110): Lo sanno tutti o Conto salato (era Conto salato o Malelingue).
        assertEquals(List.of("base.cesira.LoSannoTutti", "base.cesira.ContoSalato"), PrintedEffects.searchedNames(draft.card("base.cesira.OhGuardaLa")));
    }

    // ---- Lo sanno tutti (CES-AR5, D110 (1)): the unconditional strike ----

    @Test
    void loSannoTuttiCostsFifteenAlertnessAndDealsTwentyFiveHit() {
        Card card = draft.card("base.cesira.LoSannoTutti");
        assertEquals(1, card.getPriority());
        assertEquals(Map.of(Damage.DamageType.HIT, 25), base("base.cesira.LoSannoTutti"), "25 nel bilanciamento SB-21g");
        Player b = opponent(List.of(filler("Riempitivo")), fillers(10));
        Game game = game(sergio("base.cesira.LoSannoTutti"), b);
        int before = game.getPlayers().get("s").getCharacter().getResources().get(Resource.ALERTNESS);
        assertEquals(25, turn(game, move(game, "s", "Segreto di Pulcinella", "b"), move(game, "b", "Riempitivo", "SELF"))[1]);
        assertEquals(before - 15, game.getPlayers().get("s").getCharacter().getResources().get(Resource.ALERTNESS), "15 A paid: R3 (20 A) tolta, stato del giro 2 (D112)");
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
        assertEquals(List.of("Guanti da Officina"), names(small.getItems()), "the last item fits the capacity 1");
        assertEquals(List.of("Espresso della Macchinetta"), names(large.getItems()));
        assertEquals(PrintedEffects.Kind.SWAP_ITEMS, ((PrintedEffects.Source) shuffle).printedEffects().getSteps().get(0).getKind());
    }

    // ---- Lo metto in conto (CES-BA) and Lo rivendo (CES-AR7, D121; regole del playground 1.4, RP-25, RP-26) ----

    private static final String RIVENDO = "base.cesira.LoRivendo";
    private static final String SANTINO = "Santino di San Briaco", ESPRESSO = "Espresso della Macchinetta", PERONI = "Bionda da 66, calda";
    private static final Map<String, String> ITEM_BINDINGS = Map.of(SANTINO, "base.items.SantinoDellaPortinaia",
            ESPRESSO, "base.items.EspressoDelDistributore", PERONI, "com.items.RottenBeer");

    /** Sergio with Lo rivendo (a regular card since D121) in hand and the given items on the field, oldest first; b only plays fillers. */
    private static Game rivendo(String... items) {
        Game game = game(sergio(RIVENDO), opponent(List.of(), fillers(10)));
        for (String item : items) game.getPlayers().get("s").getCharacter().getItems().add(draft.card(ITEM_BINDINGS.get(item)));
        return game;
    }

    private static Move sell(Game game, String item) {
        Map<Move.AdditionalAction, String> choices = new EnumMap<>(Move.AdditionalAction.class);
        if (item != null) choices.put(Move.AdditionalAction.TARGET_ITEM, item);
        return new Move("Fiuto per gli Affari", "s", "SELF", game.getGameId(), choices);
    }

    private static List<String> items(Game game, String id) { return names(game.getPlayers().get(id).getCharacter().getItems()); }

    private static int alertness(Game game, String id) { return game.getPlayers().get(id).getCharacter().getResources().get(Resource.ALERTNESS); }

    private static List<String> selfReport(Game game) {
        return game.getResolvedMoves().stream().filter(m -> m.getPlayerId().equals("s")).findFirst().orElseThrow()
                .getMoveReport().getOrDefault(Card.CardTarget.SELF, List.of());
    }

    @Test
    void loMettoInContoIsSergiosBasicAndLoRivendoARegularCard() {
        Card basic = draft.card("base.cesira.LoMettoInConto");
        assertTrue(basic.isBasicAction());
        assertFalse(basic.isCharacterBound());
        assertEquals(1, basic.getPriority());
        assertEquals(Set.of(Card.CardTarget.NEAR_ITEM), basic.getCanTarget());
        assertEquals("base.cesira.LoMettoInConto", draft.characterBasic(Sb17.SERGIO), "D121 (1): the basic is back, D118 (1) withdrawn for it");
        Card card = draft.card(RIVENDO);
        assertFalse(card.isBasicAction(), "D121 (1): Lo rivendo is a deck card");
        assertFalse(card.isCharacterBound());
        assertEquals(1, card.getPriority());
        assertEquals(Set.of(Card.CardTarget.NEAR_ITEM), card.getCanTarget(), "R03: a regular card may target an item");
    }

    @Test
    void loMettoInContoGivesAlertnessThenConsumesTheItem() {
        Game game = game(sergio("base.cesira.LoMettoInConto"), opponent(List.of(), fillers(10)));
        game.getPlayers().get("s").getCharacter().getItems().add(draft.card(ITEM_BINDINGS.get(SANTINO)));
        int a = alertness(game, "s");
        Map<Move.AdditionalAction, String> choices = new EnumMap<>(Move.AdditionalAction.class);
        choices.put(Move.AdditionalAction.TARGET_ITEM, SANTINO);
        turn(game, new Move("Messo in Conto", "s", "SELF", game.getGameId(), choices), move(game, "b", "Riempitivo", "SELF"));
        assertEquals(a + 8, alertness(game, "s"), "+8 A (SB-21g, D158)");
        assertEquals(List.of(), items(game, "s"), "the item is consumed with its effect");
        assertTrue(game.getPlayers().get("s").getCharacter().getImmunities().contains(Resource.ALCOHOL), "the Santino's effect applies");
    }

    @Test
    void loRivendoSellsTheTargetedItemWithoutItsEffect() {
        for (String target : List.of(SANTINO, ESPRESSO)) {
            Game game = rivendo(ESPRESSO, SANTINO);
            int a = alertness(game, "s");
            int[] lost = turn(game, sell(game, target), move(game, "b", "Riempitivo", "SELF"));
            assertEquals(-8, lost[0], target + ": +8 HEALTH (D118 (1): +6; reserve R1 of the B4 round: +8)");
            assertEquals(List.of(SANTINO.equals(target) ? ESPRESSO : SANTINO), items(game, "s"), "the targeted one leaves, not the oldest");
            assertFalse(game.getPlayers().get("s").getCharacter().getImmunities().contains(Resource.ALCOHOL), "without the Santino's effect");
            assertEquals(a, alertness(game, "s"), "without the Espresso's +15 A");
            assertTrue(selfReport(game).contains("Sold Item " + target), selfReport(game).toString());
        }
    }

    @Test
    void loRivendoNeedsAnItemToBePlayed() {
        Game game = rivendo();
        assertThrows(Exception.class, () -> game.submitMove(sell(game, SANTINO)), "R03: the item the card targets must be there");
        Game none = rivendo(ESPRESSO);
        assertThrows(Exception.class, () -> none.submitMove(sell(none, null)), "a card on an item says which one");
    }

    @Test
    void loRivendoOnAnItemDestroyedEarlierInTheTurnGainsNothing() {
        Card breaker = draft.card("bruiser.BreakYourToy"); // «Smontiamo tutto», priority 1 like Lo rivendo: b is faster (90 A against 60)
        Game game = game(sergio(RIVENDO), player("b", 90, List.of(breaker), fillers(10)));
        game.getPlayers().get("b").getCharacter().getResources().put(Resource.VIOLENCE, 10);
        game.getPlayers().get("s").getCharacter().getItems().add(draft.card(ITEM_BINDINGS.get(SANTINO)));
        game.getPlayers().get("s").getCharacter().getItems().add(draft.card(ITEM_BINDINGS.get(ESPRESSO)));
        Map<Move.AdditionalAction, String> destroy = new EnumMap<>(Move.AdditionalAction.class);
        destroy.put(Move.AdditionalAction.TARGET_ITEM, SANTINO);
        int a = alertness(game, "s");
        int[] lost = turn(game, sell(game, SANTINO), new Move(breaker.getName(), "b", "s", game.getGameId(), destroy));
        assertFalse(voided(game, "b"));
        assertEquals(0, lost[0], "D118 (2): the targeted item is gone at resolution, no sale and no gain");
        assertEquals(List.of(ESPRESSO), items(game, "s"), "no fallback: the other item stays");
        assertEquals(a, alertness(game, "s"));
        assertEquals(List.of("Nothing to sell"), selfReport(game));
    }

    @Test
    void loRivendoPrintsTheSaleAndItsProceeds() {
        List<PrintedEffects.Step> steps = ((PrintedEffects.Source) draft.card(RIVENDO)).printedEffects().getSteps();
        assertEquals(2, steps.size());
        assertEquals(PrintedEffects.Kind.SELL, steps.get(0).getKind());
        assertNull(steps.get(0).getSold());
        assertEquals(PrintedEffects.Kind.GAIN, steps.get(1).getKind());
        assertEquals(Resource.HEALTH, steps.get(1).getResource());
        assertEquals(8, steps.get(1).getBase(), "R1 of the B4 round: +6 → +8");
        assertTrue(steps.get(1).appliesAfterSale(true) && !steps.get(1).appliesAfterSale(false), "the proceeds only after a sale");
        assertTrue(PrintedEffects.sells(((PrintedEffects.Source) draft.card(RIVENDO)).printedEffects()));
    }

    @Test
    void theBotsSellTheLeastValuableItemWithASingleMove() {
        Object[][] cases = {{new String[] {ESPRESSO, SANTINO}, SANTINO}, {new String[] {ESPRESSO, PERONI}, PERONI},
                {new String[] {SANTINO, ESPRESSO}, SANTINO}, {new String[] {ESPRESSO}, ESPRESSO}};
        for (Object[] c : cases) {
            Game game = rivendo((String[]) c[0]);
            List<com.gsc.bm.model.game.bot.LegalMove> sales = com.gsc.bm.model.game.bot.BotView.of(game, "s").legalMoves().stream()
                    .filter(m -> m.getCard().getName().equals("Fiuto per gli Affari")).collect(Collectors.toList());
            assertEquals(1, sales.size(), java.util.Arrays.toString((String[]) c[0]) + ": one move, the rule shared by every bot");
            assertEquals(c[1], sales.get(0).getItem(), java.util.Arrays.toString((String[]) c[0]) + ": never an Espresso while a Santino is there");
        }
        assertTrue(com.gsc.bm.model.game.bot.BotView.of(rivendo(), "s").legalMoves().stream()
                .noneMatch(m -> m.getCard().getName().equals("Fiuto per gli Affari")), "without items the card cannot be played");
    }

    @Test
    void theForecastSellsTheTargetedItem() {
        Game game = rivendo(ESPRESSO, SANTINO);
        com.gsc.bm.model.game.bot.BotView view = com.gsc.bm.model.game.bot.BotView.of(game, "s");
        com.gsc.bm.model.game.bot.LegalMove sale = view.legalMoves().stream().filter(m -> m.getCard().getName().equals("Fiuto per gli Affari"))
                .findFirst().orElseThrow();
        List<Map<String, Integer>> ends = com.gsc.bm.model.game.bot.TurnForecast.variants(view, sale, null);
        assertFalse(ends.isEmpty());
        for (Map<String, Integer> end : ends) assertEquals(health(game, "s") + 8, end.get("s"), ends.toString());
        // The step shared by the forecast and the view table: the targeted item leaves; nothing without a target or once it is gone.
        List<com.gsc.bm.model.game.bot.BotView.CardSeen> tray = new ArrayList<>();
        for (String item : List.of(ESPRESSO, SANTINO)) tray.add(com.gsc.bm.model.game.bot.BotView.publicText(draft.card(ITEM_BINDINGS.get(item))));
        assertTrue(com.gsc.bm.model.game.bot.TurnForecast.sell(tray, SANTINO));
        assertEquals(List.of(ESPRESSO), tray.stream().map(com.gsc.bm.model.game.bot.BotView.CardSeen::getName).collect(Collectors.toList()));
        assertFalse(com.gsc.bm.model.game.bot.TurnForecast.sell(tray, SANTINO), "gone: no sale");
        assertFalse(com.gsc.bm.model.game.bot.TurnForecast.sell(tray, null), "no fallback on the oldest");
        assertEquals(1, tray.size());
    }

    @Test
    void theLoaderRefusesASaleOutOfPlace() {
        String sale = "{'op':'vendi','seHai':[{'op':'gain','resource':'HEALTH','amount':6}]}";
        String basic = "{'binding':'t.V','kind':'ACTION','basic':true,";
        String bound = "{'binding':'t.V','kind':'BOUND','boundTo':'x',";
        Map<String, String> cases = new java.util.LinkedHashMap<>();
        cases.put(bound + "'targets':['SELF'],'self':[" + sale + "]}", "non è ammesso in una bound");
        cases.put(bound + "'targets':['NEAR_ITEM'],'self':[" + sale + "]}", "non è ammesso in una bound");
        // B5e (D120, deroga del playground, sim): una regolare può vendere, ma solo con bersaglio NEAR_ITEM e mai come last resort.
        cases.put("{'binding':'t.V','kind':'ACTION','targets':['SELF'],'self':[" + sale + "]}", "richiede targets solo NEAR_ITEM");
        cases.put("{'binding':'t.V','kind':'ACTION','lastResort':true,'targets':['NEAR_ITEM'],'self':[" + sale + "]}", "non è ammesso in una last resort");
        cases.put(basic + "'targets':['SELF'],'self':[" + sale + "]}", "richiede targets solo NEAR_ITEM");
        cases.put(basic + "'targets':['SELF','NEAR_ITEM'],'self':[" + sale + "]}", "richiede targets solo NEAR_ITEM");
        cases.put(basic + "'targets':['NEAR_ITEM'],'target':[" + sale + "]}", "vendi vale solo in self");
        cases.put(basic + "'targets':['NEAR_ITEM'],'self':[" + sale + "," + sale + "]}", "ripetuto");
        cases.put(basic + "'targets':['NEAR_ITEM'],'self':[{'op':'consume'}," + sale + "]}", "consume");
        cases.put("{'binding':'t.V','kind':'ITEM','self':[" + sale + "]}", "non è ammesso in un oggetto");
        cases.put(basic + "'targets':['NEAR_ITEM'],'self':[{'op':'vendi','seHai':[{'op':'damage','type':'HIT','amount':3}]}]}",
                "vendi contiene solo gain, lose e say");
        cases.put(basic + "'targets':['NEAR_ITEM'],'self':[{'op':'vendi'}]}", "seHai mancante");
        cases.put(basic + "'targets':['NEAR_ITEM'],'self':[{'op':'vendi','seHai':[{'op':'gain','resource':'HEALTH','amount':6}],'seNo':[]}]}", "seNo");
        cases.put("{'binding':'t.V','kind':'ACTION','targets':['SELF'],'self':[{'op':'anticipo','steps':[" + sale + "]}]}", "anticipo non contiene");
        cases.put("{'binding':'t.V','kind':'ACTION','targets':['OPPONENT'],'target':[{'op':'gettone','steps':[" + sale + "]}]}", "gettone non contiene");
        cases.forEach((json, message) -> {
            Exception e = assertThrows(Exception.class, () -> DataCards.definition(JSON.readTree(json.replace('\'', '"'))), json);
            StringBuilder text = new StringBuilder();
            for (Throwable t = e; t != null; t = t.getCause()) text.append(t.getMessage()).append(" | ");
            assertTrue(text.toString().contains(message), json + " -> " + text);
        });
        assertDoesNotThrow(() -> DataCards.definition(JSON.readTree((basic + "'targets':['NEAR_ITEM'],'self':[" + sale + "]}").replace('\'', '"'))));
        assertDoesNotThrow(() -> DataCards.definition(JSON.readTree(("{'binding':'t.V','kind':'ACTION','targets':['NEAR_ITEM'],'self':[" + sale + "]}")
                .replace('\'', '"'))), "B5e: a regular card with only NEAR_ITEM may sell");
    }

    // ---- Fare il vago (CES-BO3, D118 (4)): the light parry bound ----

    private static final String VAGO = "base.cesira.bound.FareIlVago";

    @Test
    void fareIlVagoIsAParryOfTheTurnWithoutGains() {
        Card card = draft.card(VAGO);
        assertTrue(card.isCharacterBound());
        assertEquals(2, card.getPriority());
        assertEquals(Set.of(Card.CardTarget.SELF), card.getCanTarget());
        assertTrue(card.getCost().isEmpty());
        List<PrintedEffects.Step> steps = ((PrintedEffects.Source) card).printedEffects().getSteps();
        assertEquals(3, steps.stream().filter(st -> st.getKind() == PrintedEffects.Kind.STATUS).count(), "SB-21z (D162): HIT, CUT and POISON");
        assertTrue(steps.stream().filter(st -> st.getKind() == PrintedEffects.Kind.STATUS)
                .allMatch(st -> Math.abs(st.getFactor() - 0.75) < 1e-6), "HIT, CUT and POISON ×0,75");
        assertTrue(steps.stream().noneMatch(st -> st.getKind() == PrintedEffects.Kind.GAIN), "one function only (lesson 2 of SB-4)");
        assertEquals(List.of("base.cesira.bound.Battutina", VAGO), draft.boundOf(Sb17.DECK));
    }

    @Test
    void fareIlVagoParriesHitAndCutOnlyThisTurn() {
        Player b = opponent(List.of(hit("Misto", 1, "HIT 20", "CUT 8"), hit("Misto", 1, "HIT 20", "CUT 8")), fillers(10));
        Game game = game(sergio(VAGO), b);
        Map<Move.AdditionalAction, String> discard = new EnumMap<>(Move.AdditionalAction.class);
        discard.put(Move.AdditionalAction.DISCARD_ONE, "Riempitivo");
        int[] lost = turn(game, new Move("Fare il Vago", "s", "SELF", game.getGameId(), discard), move(game, "b", "Misto", "s"));
        assertEquals(21, lost[0], "20 × 0,75 + 8 × 0,75 = 15 + 6");
        assertEquals(28, turn(game, move(game, "s", "Riempitivo", "SELF"), move(game, "b", "Misto", "s"))[0], "the turn after: in full");
    }

    @Test
    void theBotParriesAShownLethalHitWithFareIlVago() {
        // GARGANTUESCO IMPATTO (HIT 35 in D139, priority 0) shown and payable against 30 health: Fare il vago (priority 2) leaves 35 × 0,75 = 26.
        BotView.CardSeen impact = BotView.publicText(draft.card("bruiser.SuperImpact"));
        BotView v = new BotView(4, new BotView.Self(LethalAwarePolicyTest.seat("me", 30, 30, 10, 0, List.of()),
                List.of(BotView.publicText(draft.card(VAGO)), BotView.publicText(draft.card("base.com.Spintone"))), 10, List.of()),
                List.of(new BotView.Opponent(LethalAwarePolicyTest.seat("foe", 60, 20, 30, 0, List.of()), 5, 10,
                        List.of(new BotView.RevealedSeen(1, impact, 3, null)))), List.of(), Map.of(), Ruleset.D50);
        assertEquals(Set.of("Fare il Vago"), offered(v), "the only move that keeps Sergio up");
        for (BotPolicy style : List.of(new AggressivePolicy(), new PrudentPolicy(), new ResourceAwarePolicy(), new RandomPolicy()))
            for (long seed = 0; seed < 5; seed++)
                assertEquals("Fare il Vago", new LethalAwarePolicy(new SoughtHitPolicy(style, SoughtHitPolicy.Timing.ALWAYS))
                        .choose(v, v.legalMoves(), new Random(seed)).getCard().getName(), style.getClass().getSimpleName());
        BotView safe = new BotView(4, new BotView.Self(LethalAwarePolicyTest.seat("me", 60, 30, 10, 0, List.of()),
                List.of(BotView.publicText(draft.card(VAGO)), BotView.publicText(draft.card("base.com.Spintone"))), 10, List.of()),
                List.of(new BotView.Opponent(LethalAwarePolicyTest.seat("foe", 60, 20, 30, 0, List.of()), 5, 10,
                        List.of(new BotView.RevealedSeen(1, impact, 3, null)))), List.of(), Map.of(), Ruleset.D50);
        assertEquals(Set.of("Fare il Vago", "Spintone"), offered(safe), "not lethal: nothing is forced");
    }

    /** The cards the lethal-aware bot leaves to its style. */
    private static Set<String> offered(BotView v) {
        Set<String> names = new java.util.TreeSet<>();
        new LethalAwarePolicy((view, legal, random) -> {
            legal.forEach(m -> names.add(m.getCard().getName()));
            return legal.get(0);
        }).choose(v, v.legalMoves(), new Random(1));
        return names;
    }

    private static List<String> names(java.util.Collection<Card> cards) {
        return cards.stream().map(Card::getName).collect(Collectors.toList());
    }
}
