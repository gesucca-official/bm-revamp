package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.LoadableCard;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.status.Status;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;
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
 * SB-19 Fase B1 (D129, D130): the nine cards of the missing slots as the proposal writes them ({@code sb-19-proposta.md} § 3), played with
 * the d50 rules of the playground, and the nine decks with the additions (at most six changed copies, two copies per new card, every new
 * card in at least two decks). The expected values are those of the proposal: nothing here is a measurement.
 */
class Sb19CardsTest {
    private static final ObjectMapper JSON = new ObjectMapper();
    private static Draft draft;

    @BeforeAll
    static void load() throws Exception { draft = Draft.fromClasspath("/set-base/bozza.json"); }

    // ---- the harness: two players, the first plays the card against the second, who only waits ----

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

    private static Character character(String id, Map<Resource, Integer> start, int items) {
        Map<Resource, Integer> resources = new EnumMap<>(Resource.class);
        for (Resource r : Resource.values()) resources.put(r, 0);
        resources.put(Resource.HEALTH, 100);
        resources.putAll(start);
        return new Draft.DraftCharacter(id, resources, items, Set.of());
    }

    private static Player player(String id, Map<Resource, Integer> start, String binding) {
        Player p = new Player(id, character(id, start, 3), filler("Basic"), List.of(), filler("Last"), List.of(), new Random(1));
        p.getCardsInHand().clear();
        if (binding != null) p.getCardsInHand().add(draft.card(binding));
        p.getCardsInHand().addAll(Collections.nCopies(2, filler("Attesa")));
        for (int i = 0; i < 10; i++) p.getDeck().add(filler("Attesa"));
        return p;
    }

    private static Game game(Player a, Player b) {
        Game game = new Game(List.of(a, b), "sb-19", false);
        game.useRuleset(Ruleset.D50);
        return game;
    }

    private static Move move(Game game, String player, String card, String target) {
        return new Move(card, player, target, game.getGameId(), new EnumMap<>(Move.AdditionalAction.class));
    }

    /** One turn: «a» plays the binding on «b» (or on itself), «b» waits. */
    private static Game turn(Map<Resource, Integer> a, Map<Resource, Integer> b, String binding, boolean onSelf, java.util.function.Consumer<Game> before)
            throws Exception {
        Game game = game(player("a", a, binding), player("b", b, null));
        before.accept(game);
        String name = draft.card(binding).getName();
        game.submitMove(move(game, "a", name, onSelf ? "SELF" : "b"));
        game.submitMove(move(game, "b", "Attesa", "SELF"));
        game.resolveMoves(g -> { }, (t, events) -> { });
        return game;
    }

    private static int res(Game game, String id, Resource r) { return game.getPlayers().get(id).getCharacter().getResources().get(r); }

    private static Map<Resource, Integer> res(Object... pairs) {
        Map<Resource, Integer> map = new EnumMap<>(Resource.class);
        for (int i = 0; i < pairs.length; i += 2) map.put((Resource) pairs[i], (Integer) pairs[i + 1]);
        return map;
    }

    private static Status status(Game game, String id, String name) {
        return game.getPlayers().get(id).getCharacter().getStatuses().stream().filter(s -> s.getName().equals(name)).findFirst().orElse(null);
    }

    private static JsonNode json(String binding) {
        for (JsonNode c : draft.json().get("cards")) if (c.path("binding").asText().equals(binding)) return c;
        throw new AssertionError(binding);
    }

    // ---- the cards ----

    @Test
    void theNineCardsArePricedAsTheProposalWritesThem() {
        // binding -> slot, rarity, cost, priority
        Map<String, Object[]> expected = new LinkedHashMap<>();
        expected.put(Sb19.ELEMOSINA, new Object[]{"GEN-04", "RARE", Map.of(Resource.ALERTNESS, 0), 0});
        expected.put(Sb19.COLPO, new Object[]{"GEN-08", "COMMON", Map.of(Resource.VIOLENCE, 15), 1});
        expected.put(Sb19.MALEDUCAZIONE, new Object[]{"GEN-10", "UNCOMMON", Map.of(Resource.VIOLENCE, 5), 1});
        expected.put(Sb19.NON_SENTO_NIENTE, new Object[]{"GEN-11", "UNCOMMON", Map.of(Resource.VIOLENCE, 5), 2});
        expected.put(Sb19.MANO_LESTA, new Object[]{"GEN-19", "COMMON", Map.of(), 1});
        expected.put(Sb19.SECONDO_FIATO, new Object[]{"GEN-20", "RARE", Map.of(), 0});
        expected.put(Sb19.COCCIO, new Object[]{"GEN-21", "RARE", Map.of(Resource.VIOLENCE, 5), 1});
        expected.put(Sb19.MINERALE, new Object[]{"OGG-08", "UNCOMMON", null, null});
        expected.put(Sb19.GRAPPA, new Object[]{"OGG-16", "RARE", null, null});
        assertEquals(Sb19.CARDS, new ArrayList<>(expected.keySet()), "the nine cards, in the order of the slots");
        for (Map.Entry<String, Object[]> e : expected.entrySet()) {
            String binding = e.getKey();
            Object[] want = e.getValue();
            assertTrue(json(binding).get("gui").get("description").asText().startsWith(want[0] + " · "), binding + ": the slot opens the description");
            assertEquals(want[1], draft.rarityOf(binding), binding);
            Card card = draft.card(binding);
            if (want[2] != null) {
                assertEquals(want[2], card.getCost(), binding + ": cost");
                assertEquals(want[3], card.getPriority(), binding + ": priority");
            } else assertTrue(card.isItem(), binding + ": an item");
        }
    }

    @Test
    void manoLestaTakes5AlertnessFromTheTargetAndGivesThemToItsAuthor() throws Exception {
        Game g = turn(res(Resource.ALERTNESS, 10), res(Resource.ALERTNESS, 20), Sb19.MANO_LESTA, false, x -> { });
        assertEquals(15, res(g, "a", Resource.ALERTNESS), "+5 A to the author, free");
        assertEquals(15, res(g, "b", Resource.ALERTNESS), "−5 A to the target");
        Game floor = turn(res(Resource.ALERTNESS, 10), res(Resource.ALERTNESS, 3), Sb19.MANO_LESTA, false, x -> { });
        assertEquals(15, res(floor, "a", Resource.ALERTNESS), "the author gains the 5 even if the target has less (RP-4: only the target's floor)");
        assertEquals(0, res(floor, "b", Resource.ALERTNESS));
    }

    @Test
    void colpoAlloStomacoHits10AndGivesTheTargetTenToxicity() throws Exception {
        Game g = turn(res(Resource.VIOLENCE, 15), res(Resource.HEALTH, 100), Sb19.COLPO, false, x -> { });
        assertEquals(0, res(g, "a", Resource.VIOLENCE), "15 V");
        assertEquals(10, res(g, "b", Resource.TOXICITY), "+10 T to the target");
        assertEquals(0, res(g, "a", Resource.TOXICITY));
        // The target's T poisons it at the end of the turn: only the HIT is read here, with a target immune to T that keeps the 10 T.
        Game immune = game(player("a", res(Resource.VIOLENCE, 15), Sb19.COLPO), new Player("b", new Draft.DraftCharacter("b",
                new EnumMap<>(res(Resource.HEALTH, 100, Resource.ALERTNESS, 0, Resource.VIOLENCE, 0, Resource.TOXICITY, 0, Resource.ALCOHOL, 0)),
                3, Set.of(Resource.TOXICITY)), filler("Basic"), List.of(), filler("Last"), List.of(), new Random(1)));
        Player waiting = immune.getPlayers().get("b");
        waiting.getCardsInHand().clear();
        waiting.getCardsInHand().addAll(Collections.nCopies(2, filler("Attesa")));
        for (int i = 0; i < 10; i++) waiting.getDeck().add(filler("Attesa"));
        immune.submitMove(move(immune, "a", draft.card(Sb19.COLPO).getName(), "b"));
        immune.submitMove(move(immune, "b", "Attesa", "SELF"));
        immune.resolveMoves(x -> { }, (t, events) -> { });
        assertEquals(90, res(immune, "b", Resource.HEALTH), "10 HIT");
        assertEquals(10, res(immune, "b", Resource.TOXICITY), "the T stays, without the poison");
    }

    @Test
    void maleducazioneRemovesTheEquipsOfTheTargetAndHits8() throws Exception {
        Game g = turn(res(Resource.VIOLENCE, 5), res(Resource.HEALTH, 100), Sb19.MALEDUCAZIONE, false, game -> {
            Character target = game.getPlayers().get("b").getCharacter();
            target.getStatuses().add(Status.builder().name("EQUIP").description("e").type(StatusType.GOOD).flow(StatusFlow.INPUT)
                    .impactedProperty(com.gsc.bm.model.Damage.DamageType.HIT).amountFunction(x -> x * 0.5f).equip(true).build());
            target.getStatuses().add(Status.builder().name("NOT AN EQUIP").description("s").type(StatusType.GOOD).flow(StatusFlow.INPUT)
                    .impactedProperty(com.gsc.bm.model.Damage.DamageType.CUT).amountFunction(x -> x).build());
        });
        assertNull(status(g, "b", "EQUIP"), "the equip is gone");
        assertNotNull(status(g, "b", "NOT AN EQUIP"), "a status that is not an equip stays");
        assertEquals(0, res(g, "a", Resource.VIOLENCE), "5 V");
        assertEquals(92, res(g, "b", Resource.HEALTH), "8 HIT, and the equip does not reduce them: it goes first");
    }

    @Test
    void nonSentoNienteParriesHitsAndGives5Alertness() throws Exception {
        Game g = turn(res(Resource.VIOLENCE, 10, Resource.ALERTNESS, 0), res(), Sb19.NON_SENTO_NIENTE, true, x -> { });
        assertEquals(5, res(g, "a", Resource.VIOLENCE), "5 V of 10 (B1b: 10 → 5 V)");
        assertEquals(5, res(g, "a", Resource.ALERTNESS), "+5 A (D52 (1))");
        // The status lasts this turn only (turns 0): it is gone after the turn, and it multiplies HIT by 0,25 (B1b: 0,35 → 0,25).
        Card card = draft.card(Sb19.NON_SENTO_NIENTE);
        Character self = character("x", res(Resource.VIOLENCE, 10), 2);
        ((AbstractCard) card).applyEffectOnSelf(self);
        Status s = self.getStatuses().stream().filter(x -> x.getName().equals("NON SENTO NIENTE")).findFirst().orElseThrow();
        assertEquals(StatusType.GOOD, s.getType());
        assertEquals(StatusFlow.INPUT, s.getFlow());
        assertEquals(25f, s.getAmountFunction().apply(100f), 1e-3, "HIT ×0,25");
        assertEquals(0, s.getLastsForTurns());
    }

    @Test
    void secondoFiatoHeals10AndMakesHitAndCutTaken125ForTwoTurns() throws Exception {
        Game g = turn(res(Resource.HEALTH, 40), res(), Sb19.SECONDO_FIATO, true, x -> { });
        assertEquals(50, res(g, "a", Resource.HEALTH), "+10 HEALTH, free (SB-21z, D162: was 12)");
        Card card = draft.card(Sb19.SECONDO_FIATO);
        Character self = character("x", res(Resource.HEALTH, 40), 2);
        ((AbstractCard) card).applyEffectOnSelf(self);
        Map<String, Status> byName = new LinkedHashMap<>();
        for (Status s : self.getStatuses()) byName.put(s.getName(), s);
        assertEquals(Set.of("SECONDO FIATO - HIT", "SECONDO FIATO - CUT"), byName.keySet(), "HIT and CUT, not POISON: against the poison the malus is nil");
        for (Status s : byName.values()) {
            assertEquals(StatusType.BAD, s.getType(), s.getName());
            assertEquals(StatusFlow.INPUT, s.getFlow(), s.getName());
            assertEquals(125f, s.getAmountFunction().apply(100f), 1e-3, s.getName() + ": ×1,25");
            assertEquals(1, s.getLastsForTurns(), s.getName() + ": «per 2 turni» is turns 1 (R05)");
        }
    }

    @Test
    void cocciodiBottigliaEquipsASingleUseHitToCut() throws Exception {
        Game g = turn(res(Resource.VIOLENCE, 5), res(), Sb19.COCCIO, true, x -> { });
        assertEquals(0, res(g, "a", Resource.VIOLENCE), "5 V");
        Status s = status(g, "a", "COCCIO DI BOTTIGLIA");
        assertNotNull(s);
        assertTrue(s.isEquip() && s.isSingleUse(), "an equip, single use");
        assertEquals(StatusFlow.OUTPUT, s.getFlow());
        assertEquals(150f, s.getAmountFunction().apply(100f), 1e-3, "×1,5");
        assertEquals(com.gsc.bm.model.Damage.DamageType.CUT, s.getTypeFunction().apply(com.gsc.bm.model.Damage.DamageType.HIT), "HIT turned to CUT");
        assertEquals(com.gsc.bm.model.Damage.DamageType.POISON, s.getTypeFunction().apply(com.gsc.bm.model.Damage.DamageType.POISON), "the rest as it is");
    }

    @Test
    void elemosinaMolestaCopiesAnItemNextToItsAuthorAndTakesNoAlertness() throws Exception {
        Game g = turn(res(Resource.ALERTNESS, 20), res(Resource.ALERTNESS, 30), Sb19.ELEMOSINA, false, game -> {
            game.getPlayers().get("b").getCharacter().getItems().add(draft.card(Sb19.GRAPPA));
        });
        assertEquals(20, res(g, "a", Resource.ALERTNESS), "free (B1b: 10 → 0 A)");
        assertEquals(30, res(g, "b", Resource.ALERTNESS), "the −10 A of the live card is gone");
        assertEquals(1, g.getPlayers().get("a").getCharacter().getItems().size(), "a copy next to the author");
        assertEquals(1, g.getPlayers().get("b").getCharacter().getItems().size(), "the target keeps its own");
        Game none = turn(res(Resource.ALERTNESS, 20), res(Resource.ALERTNESS, 30), Sb19.ELEMOSINA, false, x -> { });
        assertEquals(0, none.getPlayers().get("a").getCharacter().getItems().size(), "nothing to copy: nothing");
        assertEquals(20, res(none, "a", Resource.ALERTNESS), "free, nothing paid");
    }

    @Test
    void theTwoItemsGiveWhatTheGridWrites() {
        Character self = character("x", res(Resource.ALCOHOL, 17, Resource.ALERTNESS, 3), 2);
        ((AbstractCard) draft.card(Sb19.MINERALE)).applyEffectOnSelf(self);
        assertEquals(0, self.getResources().get(Resource.ALCOHOL), "OGG-08 empties the L");
        assertEquals(23, self.getResources().get(Resource.ALERTNESS), "and gives 20 A (B1b: +5 → +20)");
        Character other = character("y", res(Resource.ALCOHOL, 10, Resource.ALERTNESS, 10), 2);
        ((AbstractCard) draft.card(Sb19.GRAPPA)).applyEffectOnSelf(other);
        assertEquals(35, other.getResources().get(Resource.ALCOHOL), "OGG-16: +25 L");
        assertEquals(5, other.getResources().get(Resource.ALERTNESS), "−5 A");
    }

    // ---- the decks ----

    @Test
    void theNineDecksWithTheAdditionsFollowTheRulesOfTheProposal() {
        Map<String, Integer> decksOfCard = new LinkedHashMap<>();
        List<String> bases = List.of("starter-spazienzio", "starter-mara", "starter-tossico", "starter-pino", "starter-gigi", Sb17.DECK, Sb18.DECK,
                "starter-gigi", "starter-gigi");
        for (int i = 0; i < Sb19.DECKS.size(); i++) {
            String id = Sb19.DECKS.get(i);
            Map<String, Integer> deck = draft.cardsOf(id), base = draft.cardsOf(bases.get(i));
            assertEquals(20, deck.values().stream().mapToInt(Integer::intValue).sum(), id + ": 20 cards (D94)");
            assertEquals(draft.boundOf(bases.get(i)), draft.boundOf(id), id);
            assertEquals(draft.lastResortOf(bases.get(i)), draft.lastResortOf(id), id);
            int added = 0;
            for (Map.Entry<String, Integer> e : deck.entrySet()) {
                int more = e.getValue() - base.getOrDefault(e.getKey(), 0);
                if (more > 0) added += more;
                if (Sb19.CARDS.contains(e.getKey())) {
                    assertEquals(2, e.getValue(), id + ": two copies of " + e.getKey());
                    decksOfCard.merge(e.getKey(), 1, Integer::sum);
                }
            }
            assertTrue(added <= 6, id + ": at most six changed copies, got " + added);
        }
        for (String card : Sb19.CARDS) assertTrue(decksOfCard.getOrDefault(card, 0) >= 2, card + " in at least two decks: " + decksOfCard.get(card));
        // The risk decks of the proposal (§ 4): Grappa in Piera's deck, Estasi ×2 and Grappa ×2 in a starter without L, the equip stack.
        assertEquals(2, draft.cardsOf("prova-b1-piera").get(Sb19.GRAPPA));
        Map<String, Integer> estasi = draft.cardsOf("prova-b1-estasi");
        assertEquals(2, estasi.get("base.pino.GoingBerserk"));
        assertEquals(2, estasi.get(Sb19.GRAPPA));
        Map<String, Integer> equip = draft.cardsOf("prova-b1-equip");
        assertEquals(2, equip.get(Sb19.COCCIO));
        assertEquals(2, equip.get("base.items.PosacenereDiVetro"));
        assertEquals(2, equip.get("base.items.GuantiDaOfficina"), "Coccio ×1,5, Posacenere ×1,5 and Guanti ×1,25 in one deck (rischio 3)");
        // B1b (report § 6): Mano lesta (DISRUPT) no longer takes the place of damage cards in the decks of Mara and Duccio.
        Map<String, Integer> mara = draft.cardsOf("prova-b1-mara"), maraBase = draft.cardsOf("starter-mara");
        assertEquals(maraBase.get("base.com.Spintone"), mara.get("base.com.Spintone"), "Mara keeps her damage cards");
        assertEquals(maraBase.get("base.com.SputoDaPosacenere"), mara.get("base.com.SputoDaPosacenere"));
        assertNull(mara.get("base.mara.Slalom"), "Mano lesta takes the place of the two Slalom (A generators)");
        Map<String, Integer> duccio = draft.cardsOf("prova-b1-duccio"), duccioBase = draft.cardsOf(Sb18.DECK);
        assertEquals(duccioBase.get("base.com.Spintone"), duccio.get("base.com.Spintone"), "Duccio keeps his damage cards");
        assertEquals(1, duccio.get("base.rocco.TeLoSpiegoIo"), "Mano lesta takes one Te lo spiego io and the Tartaruga");
        assertNull(duccio.get("base.com.TartarugaSulMarciapiede"));
    }
}
