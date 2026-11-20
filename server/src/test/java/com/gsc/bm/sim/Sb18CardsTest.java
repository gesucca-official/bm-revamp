package com.gsc.bm.sim;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.LoadableCard;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.IllegalMoveException;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.bot.BotView;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * SB-18 Fase B2 (D126; proposal § 7 without «Ultimo colpo», out by D125 (3)): the HEALTH cost on Duccio's real cards with the d50 rules of
 * the playground. A card is offered only with health <b>above</b> its cost (RP-2): refused by the engine and absent from {@link BotView} at
 * health equal to the cost, offered and paid one point above, and nobody dies paying. Also the D36 cap on his three bounds, with the
 * bound bench ({@link BoundCap}), as SB-10b asked for SB-18.
 */
class Sb18CardsTest {
    private static final ObjectMapper JSON = new ObjectMapper();
    /** The calibrated costs (B2: ×1,85 of the V3, then ×1,95 with the reserve R1 of the final round), in the order of the proposal. */
    static final Map<String, Integer> COSTS = new LinkedHashMap<>();
    static {
        COSTS.put(Sb18.NOCCHE, 16);
        COSTS.put(Sb18.E_ALLORA, 10);
        COSTS.put(Sb18.CAPOCCIATA, 28);
        COSTS.put(Sb18.TESTA_DURA, 35); // D158
    }
    private static Draft draft;

    @BeforeAll
    static void load() throws Exception { draft = Draft.fromClasspath("/set-base/bozza.json"); }

    private static Card filler(String name) {
        try {
            LoadableCard card = DataCards.instantiate(DataCards.definition(JSON.readTree(("{'binding':'t." + name
                    + "','kind':'ACTION','targets':['SELF'],'self':[{'op':'gain','resource':'VIOLENCE','amount':1}]}").replace('\'', '"'))));
            card.setGuiName(name);
            card.setGuiRole("RESOURCES", "+1 V");
            card.setGuiDamage("—");
            card.setGuiDamageAmount("—");
            return card;
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    private static Character character(String id, int health, int alertness) {
        Map<Resource, Integer> resources = new EnumMap<>(Resource.class);
        resources.put(Resource.HEALTH, health);
        resources.put(Resource.ALERTNESS, alertness);
        return new Draft.DraftCharacter(id, resources, 2, Set.of());
    }

    /** Duccio («d») with his basic, bounds and last resort from the draft, the given card and a filler in hand; fillers in the deck. */
    private static Player duccio(int health, String binding) {
        String deck = Sb18.DECK;
        List<Card> bound = new ArrayList<>();
        for (String b : draft.boundOf(deck)) bound.add(draft.card(b));
        Player p = new Player("d", character("d", health, 15), draft.card(draft.basicOf(deck)), bound, draft.card(draft.lastResortOf(deck)),
                List.of(), new Random(1));
        p.getCardsInHand().clear();
        p.getCardsInHand().add(draft.card(draft.basicOf(deck)));
        p.getCardsInHand().addAll(bound);
        p.getCardsInHand().add(draft.card(binding));
        p.getCardsInHand().add(filler("Riempitivo"));
        for (int i = 0; i < 10; i++) p.getDeck().add(filler("Riempitivo"));
        return p;
    }

    /** An opponent that only waits. */
    private static Player waiting() {
        Player p = new Player("b", character("b", 200, 10), filler("Basic"), List.of(), filler("Last"), List.of(), new Random(1));
        p.getCardsInHand().clear();
        p.getCardsInHand().addAll(Collections.nCopies(3, filler("Attesa")));
        for (int i = 0; i < 10; i++) p.getDeck().add(filler("Attesa"));
        return p;
    }

    private static Game game(Player d, Player b) {
        Game game = new Game(List.of(d, b), "sb-18", false);
        game.useRuleset(Ruleset.D50);
        return game;
    }

    private static Move move(Game game, String player, String card, String target) {
        return new Move(card, player, target, game.getGameId(), new EnumMap<>(Move.AdditionalAction.class));
    }

    private static com.fasterxml.jackson.databind.JsonNode gui(String binding) {
        for (com.fasterxml.jackson.databind.JsonNode c : draft.json().get("cards")) if (c.path("binding").asText().equals(binding)) return c.get("gui");
        throw new AssertionError(binding);
    }

    private static int health(Game game, String id) { return game.getPlayers().get(id).getCharacter().getResources().get(Resource.HEALTH); }

    private static boolean offered(Game game, String name) {
        return BotView.of(game, "d").legalMoves().stream().anyMatch(m -> m.getCard().getName().equals(name));
    }

    @Test
    void duccioIsInTheDraftWithTheCalibratedCosts() {
        Map<String, Integer> resources = new LinkedHashMap<>();
        draft.character(Sb18.DUCCIO).getResources().forEach((r, v) -> resources.put(r.name(), v));
        assertEquals(115, resources.get("HEALTH"), "D124 (1), D126 (1); reserve R2 of the B2 round");
        assertEquals(15, resources.get("ALERTNESS"));
        assertEquals("base.rocco.PrimaIo", draft.characterBasic(Sb18.DUCCIO));
        int[] hits = {18, 8, 26, 30};
        int i = 0;
        for (Map.Entry<String, Integer> e : COSTS.entrySet()) {
            Card card = draft.card(e.getKey());
            assertEquals(Map.of(Resource.HEALTH, e.getValue()), card.getCost(), e.getKey() + ": HEALTH costs of the current draft (D126 and D158)");
            assertFalse(card.isLastBlow(), e.getKey() + ": no «Ultimo colpo» (D125 (3))");
            assertEquals("HIT " + hits[i++], gui(e.getKey()).get("damageAmount").asText(), e.getKey() + ": the V3 hits");
        }
        assertEquals(20, draft.cardsOf(Sb18.DECK).values().stream().mapToInt(Integer::intValue).sum(), "prova-duccio: 20 cards (D94)");
        assertEquals(List.of("base.rocco.bound.Colpetto", "base.rocco.bound.AlzoLaVoce"), draft.boundOf(Sb18.DECK));
        assertEquals("base.rocco.NeHoPreseDiPeggio", draft.lastResortOf(Sb18.DECK));
    }

    @Test
    void aHealthCostIsOfferedOnlyAboveItsCostAndNobodyDiesPaying() {
        for (Map.Entry<String, Integer> e : COSTS.entrySet()) {
            String name = draft.card(e.getKey()).getName();
            int cost = e.getValue();
            // At health equal to the cost: refused by the engine, not offered to the bots (RP-2).
            Game equal = game(duccio(cost, e.getKey()), waiting());
            assertFalse(offered(equal, name), name + " at " + cost + " health: not offered by BotView");
            Move refused = move(equal, "d", name, "b");
            IllegalMoveException ex = assertThrows(IllegalMoveException.class, () -> equal.submitMove(refused), name);
            assertEquals("cant pay health down to zero", ex.getWhatHeDid());
            // One point above: offered, paid, and Duccio stays up at 1.
            Game above = game(duccio(cost + 1, e.getKey()), waiting());
            assertTrue(offered(above, name), name + " at " + (cost + 1) + " health: offered by BotView");
            above.submitMove(move(above, "d", name, "b"));
            above.submitMove(move(above, "b", "Attesa", "SELF"));
            above.resolveMoves(g -> { }, (t, events) -> { });
            assertEquals(1, health(above, "d"), name + ": paid " + cost + " of " + (cost + 1));
            assertFalse(above.getPlayers().get("d").getCharacter().isDead(), name + ": no death paying");
        }
    }

    @Test
    void duccioBoundsStayUnderTheD36Cap() throws Exception {
        int seen = 0;
        for (BoundCap.Result r : BoundCap.run(draft, BoundCap.Params.DEFAULT)) {
            if (!r.character.equals(Sb18.DUCCIO)) continue;
            assertFalse(r.violates(), r.bound + ": " + r.reasons(BoundCap.Params.DEFAULT));
            assertTrue(r.max() <= BoundCap.Params.DEFAULT.limit() + 1e-9, r.bound + ": " + r.max());
            System.out.println("D36 cap, " + r.bound + ": max " + r.max() + " of " + BoundCap.Params.DEFAULT.limit());
            seen++;
        }
        assertEquals(3, seen, "Colpetto, Gomitata, Alzo la voce");
    }
}
