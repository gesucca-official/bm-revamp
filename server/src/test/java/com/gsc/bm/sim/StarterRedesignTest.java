package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.LoadableCard;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.IllegalMoveException;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.bot.BotView;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;
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

/** SB-16d, D55: effetti delle carte reali della bozza, risolti dal motore D50. Nessuna misura di bilanciamento. */
class StarterRedesignTest {
    private static Draft draft;
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final String NORMAL = "base.com.Spintone";
    private static final List<Pair> PAIRS = List.of(
            new Pair("starter-spazienzio", "bruiser.Glare", "bruiser.SuperImpact", 40),
            new Pair("starter-mara", "base.mara.Slalom", "base.mara.Sgommata", 25),
            new Pair("starter-tossico", "junkie.MethDrivenRage", "junkie.Cough", 12),
            new Pair("starter-pino", "base.pino.OffroIo", "base.pino.GoingBerserk", 17),
            new Pair("starter-gigi", "base.gigi.ColpoDiChiaveInglese", "base.gigi.LavoroFattoBene", 6));

    private static final class Pair {
        final String deck, charge, hit;
        final int damage;
        Pair(String deck, String charge, String hit, int damage) {
            this.deck = deck; this.charge = charge; this.hit = hit; this.damage = damage;
        }
    }

    @BeforeAll
    static void load() throws Exception { draft = Draft.fromClasspath("/set-base/bozza.json"); }

    /** Solo sonde dell'avversario: le carte sotto test sono sempre quelle della bozza. */
    private static Card probe(String name, int damage, int priority) {
        try {
            String effect = damage == 0 ? "'targets':['SELF'],'self':[]"
                    : "'targets':['OPPONENT'],'target':[{'op':'damage','type':'HIT','amount':" + damage + "}]";
            LoadableCard c = DataCards.instantiate(DataCards.definition(JSON.readTree(("{'binding':'probe." + name
                    + "','kind':'ACTION','priority':" + priority + "," + effect + "}").replace('\'', '"'))));
            c.setGuiName(name);
            c.setGuiRole(damage == 0 ? "OTHER" : "DAMAGE", "—");
            c.setGuiDamage(damage == 0 ? "—" : "HIT");
            c.setGuiDamageAmount(damage == 0 ? "—" : "HIT " + damage);
            return c;
        } catch (Exception e) { throw new IllegalStateException(e); }
    }

    private static Player player(String deck, String id, List<Card> hand, List<Card> topFirst) {
        Character c = draft.character(draft.characterOf(deck));
        for (Resource r : Resource.values()) c.getResources().put(r, 0);
        c.getResources().put(Resource.HEALTH, 500);
        c.getResources().put(Resource.ALERTNESS, deck.equals("starter-pino") ? 0 : 40);
        c.getResources().put(Resource.VIOLENCE, 40);
        List<Card> bounds = draft.boundOf(deck).stream().map(draft::card).collect(Collectors.toList());
        Player p = new Player(id, c, draft.card(draft.basicOf(deck)), bounds, draft.card(draft.lastResortOf(deck)), List.of(), new Random(1));
        p.getCardsInHand().clear();
        p.getCardsInHand().add(draft.card(draft.basicOf(deck)));
        p.getCardsInHand().addAll(bounds);
        p.getCardsInHand().addAll(hand);
        p.getDeck().clear();
        List<Card> reversed = new ArrayList<>(topFirst);
        Collections.reverse(reversed);
        p.getDeck().addAll(reversed);
        return p;
    }

    private static Game game(Player a, Player b) {
        Game g = new Game(List.of(a, b), "sb-16d", false);
        g.useRuleset(Ruleset.D50);
        return g;
    }

    private static Move move(Game g, Player p, Card c, String target) {
        return new Move(c.getName(), p.getPlayerId(), target, g.getGameId(), new EnumMap<>(Move.AdditionalAction.class));
    }

    private static Move waitMove(Game g, Player p) {
        Card c = probe("Attesa", 0, -1);
        if (!p.getCardsInHand().contains(c)) p.getCardsInHand().add(c);
        return move(g, p, c, "SELF");
    }

    private static void turn(Game g, Move a, Move b) {
        g.submitMove(a); g.submitMove(b); g.resolveMoves(ignored -> {}, (t, events) -> {});
    }

    private static Move resolved(Game g, String id) {
        return g.getResolvedMoves().stream().filter(m -> m.getPlayerId().equals(id)).findFirst().orElseThrow();
    }

    private static boolean holds(Player p, String binding) {
        return p.getCardsInHand().stream().anyMatch(c -> c.getBindingName().equals(binding));
    }

    private static int res(Player p, Resource resource) { return p.getCharacter().getResources().get(resource); }

    private static Player foe() { return player("starter-tossico", "b", List.of(), List.of()); }

    @Test
    void everyChargeShowsItsExposureAndFoundCardToTheOpponent() {
        for (Pair pair : PAIRS) {
            Card charge = draft.card(pair.charge);
            assertEquals(Set.of(Card.CardTarget.SELF), charge.getCanTarget(), pair.charge);
            assertTrue(charge.getCost().isEmpty(), pair.charge);
            assertFalse(charge.isLastBlow(), "D55: nessuna eccezione Ultimo colpo");
            Player a = player(pair.deck, "a", List.of(charge), List.of(draft.card(NORMAL), draft.card(pair.hit)));
            Player b = foe(); Game g = game(a, b);
            turn(g, move(g, a, charge, "SELF"), waitMove(g, b));
            assertEquals(pair.hit, resolved(g, "a").getSearchedFor());
            assertEquals(pair.hit, resolved(g, "a").getSearchFound().getBindingName());
            assertTrue(holds(a, pair.hit), pair.charge);
            assertFalse(holds(a, NORMAL));
            assertEquals(1, a.getDeckSize(), "ricerca al posto della pesca, non aggiuntiva");
            BotView publicView = BotView.of(g, "b");
            BotView.Seat visible = publicView.getOpponents().get(0).getSeat();
            assertEquals(pair.charge.equals("bruiser.Glare") ? 1 : 3, visible.getStatuses().size());
            for (BotView.StatusSeen s : visible.getStatuses()) {
                assertTrue(s.getName().contains(draft.card(pair.hit).getName()), "il nome del colpo è pubblico");
                assertTrue(s.getDescription().contains(draft.card(pair.hit).getName()));
                assertEquals(StatusType.BAD, s.getType());
                assertEquals(StatusFlow.INPUT, s.getFlow());
                assertEquals(0, s.getTurnsLeft(), "dopo il primo fine turno resta il turno successivo");
            }
            assertEquals(pair.hit, publicView.getLastRound().stream().filter(m -> m.getPlayerId().equals("a"))
                    .findFirst().orElseThrow().getSearchFound().getBinding());
            if (pair.deck.equals("starter-pino")) {
                assertEquals(7, res(a, Resource.ALCOHOL));
                assertEquals(13, res(a, Resource.ALERTNESS), "D38/D53, SB-16e: +20 A meno 7 per la L");
            } else if (pair.deck.equals("starter-spazienzio")) {
                assertEquals(55, res(a, Resource.VIOLENCE)); assertEquals(55, res(a, Resource.ALERTNESS));
            } else if (pair.deck.equals("starter-mara")) assertEquals(55, res(a, Resource.ALERTNESS));
            else if (pair.deck.equals("starter-tossico")) assertEquals(10, res(a, Resource.TOXICITY), "D38/D53, SB-16e: Dose +10 T");
            else assertEquals(50, res(a, Resource.VIOLENCE));
        }
    }

    @Test
    void theFiveFoundHitsArePlayableWithTheirApprovedDamage() {
        for (Pair pair : PAIRS) {
            Card charge = draft.card(pair.charge);
            Player a = player(pair.deck, "a", List.of(charge), List.of(draft.card(NORMAL), draft.card(pair.hit)));
            Player b = foe(); Game g = game(a, b);
            turn(g, move(g, a, charge, "SELF"), waitMove(g, b));
            turn(g, move(g, a, draft.card(pair.hit), "b"), waitMove(g, b));
            assertFalse(resolved(g, "a").isVoid(), pair.hit);
            assertEquals(500 - pair.damage, res(b, Resource.HEALTH), pair.hit);
            assertTrue(a.getCharacter().getStatuses().isEmpty(), "esposizione scaduta anche dopo il colpo");
            if (pair.deck.equals("starter-pino")) assertEquals(0, res(a, Resource.ALCOHOL));
            if (pair.deck.equals("starter-tossico")) assertEquals(5, res(b, Resource.TOXICITY), "l'immunità ferma il periodico, non i 12 POISON");
        }
    }

    @Test
    void anAbsentHitFallsBackToTheOrdinaryDrawForEveryCharge() {
        for (Pair pair : PAIRS) {
            Card charge = draft.card(pair.charge);
            Player a = player(pair.deck, "a", List.of(charge), List.of(draft.card(NORMAL)));
            Player b = foe(); Game g = game(a, b);
            turn(g, move(g, a, charge, "SELF"), waitMove(g, b));
            assertEquals(pair.hit, resolved(g, "a").getSearchedFor());
            assertNull(resolved(g, "a").getSearchFound());
            assertTrue(holds(a, NORMAL)); assertFalse(holds(a, pair.hit));
            assertFalse(a.getCharacter().getStatuses().isEmpty(), "esposizione anche se la ricerca manca");
        }
    }

    @Test
    void anEmptyDeckStillGivesTheLastResortForEveryCharge() {
        for (Pair pair : PAIRS) {
            Card charge = draft.card(pair.charge);
            Player a = player(pair.deck, "a", List.of(charge), List.of());
            Player b = foe(); Game g = game(a, b);
            turn(g, move(g, a, charge, "SELF"), waitMove(g, b));
            assertNull(resolved(g, "a").getSearchFound());
            assertTrue(holds(a, draft.lastResortOf(pair.deck)));
            assertEquals(0, a.getDeckSize());
        }
    }

    @Test
    void anAlreadyHeldHitDoesNotStopSearchingForAnotherCopy() {
        for (Pair pair : PAIRS) {
            Card charge = draft.card(pair.charge);
            Player a = player(pair.deck, "a", List.of(charge, draft.card(pair.hit)), List.of(draft.card(pair.hit)));
            Player b = foe(); Game g = game(a, b);
            turn(g, move(g, a, charge, "SELF"), waitMove(g, b));
            assertEquals(2, a.getCardsInHand().stream().filter(c -> c.getBindingName().equals(pair.hit)).count());
        }
    }

    @Test
    void exposureAmplifiesTheAdvertisedTypesForExactlyTwoTurns() {
        for (Pair pair : PAIRS) for (Damage.DamageType type : Damage.DamageType.values()) {
            Character c = draft.character(draft.characterOf(pair.deck));
            c.useRuleset(Ruleset.D50);
            for (Resource r : Resource.values()) c.getResources().put(r, 0);
            c.getResources().put(Resource.HEALTH, 500);
            ((AbstractCard) draft.card(pair.charge)).applyEffectOnSelf(c);
            // Isola i moltiplicatori dai periodici e dalla corazza; le risorse sono verificate nei turni completi sopra.
            c.getResources().put(Resource.ALCOHOL, 0); c.getResources().put(Resource.TOXICITY, 0);
            int amplified = !pair.charge.equals("bruiser.Glare") || type == Damage.DamageType.HIT ? 15 : 10;
            c.takeDamage(new Damage(type, 10)); assertEquals(500 - amplified, c.getResources().get(Resource.HEALTH));
            c.resolveTimeBasedEffects();
            c.takeDamage(new Damage(type, 10)); assertEquals(500 - 2 * amplified, c.getResources().get(Resource.HEALTH));
            c.resolveTimeBasedEffects(); assertTrue(c.getStatuses().isEmpty());
            c.takeDamage(new Damage(type, 10)); assertEquals(490 - 2 * amplified, c.getResources().get(Resource.HEALTH));
        }
    }

    @Test
    void exposureStartsWhenTheChargeResolvesAndArmorStillComesAfterIt() {
        for (Pair pair : PAIRS) for (boolean before : List.of(true, false)) {
            Card charge = draft.card(pair.charge), attack = probe("Colpo", 10, before ? 3 : -1);
            Player a = player(pair.deck, "a", List.of(charge), List.of(draft.card(pair.hit)));
            Player b = player("starter-tossico", "b", List.of(attack), List.of()); Game g = game(a, b);
            turn(g, move(g, a, charge, "SELF"), move(g, b, attack, "a"));
            int damage = before ? 10 : pair.deck.equals("starter-pino") ? 12 : 15;
            assertEquals(500 - damage, res(a, Resource.HEALTH), pair.charge + ": niente effetto retroattivo; corazza L/4 dopo ×1,5");
        }
    }

    @Test
    void aCounterCancelsGainsExposureAndSearchTogether() {
        for (Pair pair : PAIRS) {
            Card charge = draft.card(pair.charge), counter = draft.card("bruiser.YouStop");
            Player a = player(pair.deck, "a", List.of(charge), List.of(draft.card(NORMAL), draft.card(pair.hit)));
            Player b = player("starter-spazienzio", "b", List.of(counter), List.of());
            b.getCharacter().getResources().put(Resource.ALERTNESS, 100);
            Game g = game(a, b);
            turn(g, move(g, a, charge, "SELF"), move(g, b, counter, "a"));
            assertTrue(resolved(g, "a").isVoid(), pair.charge);
            assertNull(resolved(g, "a").getSearchedFor());
            assertTrue(holds(a, NORMAL)); assertFalse(holds(a, pair.hit));
            assertTrue(a.getCharacter().getStatuses().isEmpty());
            assertEquals(40, res(a, Resource.VIOLENCE)); assertEquals(0, res(a, Resource.TOXICITY));
            assertEquals(0, res(a, Resource.ALCOHOL));
            assertEquals(pair.deck.equals("starter-pino") ? 0 : 40, res(a, Resource.ALERTNESS));
        }
    }

    @Test
    void aDownAuthorCanFinishTheChargeButCannotSaveThemselfWithIt() {
        for (Pair pair : PAIRS) {
            Card charge = draft.card(pair.charge), lethal = probe("Letale", 20, 3);
            Player a = player(pair.deck, "a", List.of(charge), List.of(draft.card(pair.hit)));
            a.getCharacter().getResources().put(Resource.HEALTH, 10);
            Player b = player("starter-tossico", "b", List.of(lethal), List.of()); Game g = game(a, b);
            turn(g, move(g, a, charge, "SELF"), move(g, b, lethal, "a"));
            assertFalse(resolved(g, "a").isVoid()); assertTrue(holds(a, pair.hit));
            assertEquals(0, res(a, Resource.HEALTH)); assertEquals("b", g.getWinner().orElseThrow());
        }
    }

    @Test
    void aDownAuthorCannotDeliverAnyOfTheFiveHits() {
        for (Pair pair : PAIRS) {
            Card hit = draft.card(pair.hit), lethal = probe("Letale", 20, 3);
            Player a = player(pair.deck, "a", List.of(hit), List.of(draft.card(NORMAL)));
            a.getCharacter().getResources().put(Resource.HEALTH, 10);
            a.getCharacter().getResources().put(Resource.TOXICITY, 10);
            Player b = player("starter-tossico", "b", List.of(lethal), List.of()); Game g = game(a, b);
            turn(g, move(g, a, hit, "b"), move(g, b, lethal, "a"));
            assertTrue(resolved(g, "a").isVoid()); assertEquals(Move.DOWN, resolved(g, "a").getVoidReason());
            assertEquals(500, res(b, Resource.HEALTH)); assertTrue(holds(a, NORMAL));
            assertFalse(hit.isLastBlow());
        }
    }

    @Test
    void theThreeDefensesPayTheirRewardEvenWithoutAnAttack() {
        String[] bindings = {"base.com.TartarugaSulMarciapiede", "base.mara.TraDueParaurti", "base.gigi.SottoIlCofano"};
        for (String binding : bindings) {
            Card defense = draft.card(binding);
            Player a = player("starter-mara", "a", List.of(defense), List.of(draft.card(NORMAL)));
            Player b = foe(); Game g = game(a, b);
            turn(g, move(g, a, defense, "SELF"), waitMove(g, b));
            assertEquals(binding.contains("Tartaruga") ? 503 : 500, res(a, Resource.HEALTH));
            assertEquals(binding.contains("Tartaruga") ? 35 : 40, res(a, Resource.ALERTNESS));
            assertEquals(40, res(a, Resource.VIOLENCE), "Cofano rimborsa il costo, non genera 5 V nette");
            assertTrue(a.getCharacter().getStatuses().isEmpty(), "la parata dura solo il turno corrente");
            for (Resource cost : defense.getCost().keySet()) {
                Player poor = player("starter-mara", "a", List.of(defense), List.of());
                poor.getCharacter().getResources().put(cost, 0);
                Game invalid = game(poor, foe());
                assertThrows(IllegalMoveException.class, () -> invalid.submitMove(move(invalid, poor, defense, "SELF")));
            }
        }
    }

    @Test
    void theThreeDefensesStillParryTheirTypesBeforeExpiring() {
        String[] bindings = {"base.com.TartarugaSulMarciapiede", "base.mara.TraDueParaurti", "base.gigi.SottoIlCofano"};
        int[] damage = {3, 4, 5}; // 6 meno cura 3; HIT ×0,4; HIT ×0,5.
        for (int i = 0; i < bindings.length; i++) {
            Card defense = draft.card(bindings[i]), attack = probe("Colpo", 10, 0);
            Player a = player("starter-mara", "a", List.of(defense), List.of(draft.card(NORMAL)));
            Player b = player("starter-tossico", "b", List.of(attack), List.of()); Game g = game(a, b);
            turn(g, move(g, a, defense, "SELF"), move(g, b, attack, "a"));
            assertEquals(500 - damage[i], res(a, Resource.HEALTH));
            a.getCharacter().takeDamage(new Damage(Damage.DamageType.HIT, 10));
            assertEquals(490 - damage[i], res(a, Resource.HEALTH));
        }
    }

    @Test
    void tartarugaCanStillSaveAnAuthorAlreadyDown() {
        Card defense = draft.card("base.com.TartarugaSulMarciapiede"), lethal = probe("Letale", 20, 3);
        Player a = player("starter-mara", "a", List.of(defense), List.of(draft.card(NORMAL)));
        a.getCharacter().getResources().put(Resource.HEALTH, 2);
        Player b = player("starter-tossico", "b", List.of(lethal), List.of()); Game g = game(a, b);
        turn(g, move(g, a, defense, "SELF"), move(g, b, lethal, "a"));
        assertFalse(resolved(g, "a").isVoid()); assertEquals(3, res(a, Resource.HEALTH));
        assertTrue(g.getWinner().isEmpty(), "D48: la cura salva, il caricamento no");
    }

    @Test
    void theAlcoholBoundReturnsUnderTheUnchangedCapWithANumericChangeOnly() throws Exception {
        String saved = System.getProperty("sim.rules");
        try {
            System.setProperty("sim.rules", "d50");
            BoundCap.Result corrected = alcoholBound(draft);
            BoundCap.Result previous = alcoholBound(withAlcoholGain(10));
            BoundCap.Result six = alcoholBound(withAlcoholGain(6));
            System.out.println("SB-16d bound D50: +10=" + previous.max() + ", +6=" + six.max() + ", +5=" + corrected.max());
            assertFalse(corrected.violates(), corrected.reasons(BoundCap.Params.DEFAULT));
            assertEquals(3.75, corrected.max(), 1e-9);
            assertTrue(previous.overCap); assertEquals(8.5, previous.max(), 1e-9);
            assertTrue(six.overCap, "+6 L supera il tetto 4 con la corazza");
            assertEquals(4, BoundCap.Params.DEFAULT.limit());
        } finally {
            if (saved == null) System.clearProperty("sim.rules"); else System.setProperty("sim.rules", saved);
        }
    }

    private static BoundCap.Result alcoholBound(Draft d) throws Exception {
        return BoundCap.run(d, BoundCap.Params.DEFAULT).stream()
                .filter(r -> r.bound.equals("base.pino.bound.CinqueMinutiEVado")).findFirst().orElseThrow();
    }

    private static Draft withAlcoholGain(int amount) {
        ObjectNode json = (ObjectNode) draft.json();
        // Historical SB-16d probes used L=20. Keep that fixture explicit when SB-16e changes the starter to L=10;
        // alcoholBound(draft) above still checks the current starter and its unchanged +5 bound/cap.
        for (JsonNode c : json.get("characters")) if (c.get("id").asText().equals("base.character.Pino"))
            ((ObjectNode) c.get("resources")).put("ALCOHOL", 20);
        for (JsonNode c : json.get("cards")) if (c.get("binding").asText().equals("base.pino.bound.CinqueMinutiEVado")) {
            ((ObjectNode) c.get("self").get(0)).put("amount", amount);
            ((ObjectNode) c.get("gui")).put("gains", "+" + amount + " L");
        }
        return draft.derive("sonda storica con L iniziale 20, guadagno " + amount, json);
    }
}
