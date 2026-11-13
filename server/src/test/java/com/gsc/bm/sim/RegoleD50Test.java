package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.LoadableCard;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.IllegalMoveException;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.Timer;
import com.gsc.bm.model.game.bot.AggressivePolicy;
import com.gsc.bm.model.game.bot.BotView;
import com.gsc.bm.model.game.bot.LegalMove;
import com.gsc.bm.model.game.bot.ResourceAwarePolicy;
import com.gsc.bm.model.game.status.Status;
import com.gsc.bm.model.game.status.StatusAmountFunction;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

/**
 * SB-16c: conformità delle regole di D50 (punti 1, 2, 3, 5 e 6, più la verifica del punto 7) con le regole del playground
 * ({@link Ruleset#D50}), e lo stesso caso con le regole del gioco vivo ({@link Ruleset#LIVE}) dove il confronto dice qualcosa.
 * Ogni caso è quello elencato nel «Completamento verificabile» di SB-16c (docs/set-base-plan.md).
 */
class RegoleD50Test {
    private static final ObjectMapper JSON = new ObjectMapper();

    // ---- carte e tavolo di prova ----

    /** Una carta a dati: il JSON di DataCards, con nome, ruolo e danno nominale scritti come nella bozza. */
    private static Card card(String name, String role, String damageAmount, String json) {
        try {
            LoadableCard card = DataCards.instantiate(DataCards.definition(JSON.readTree(json.replace('\'', '"'))));
            card.setGuiName(name);
            card.setGuiRole(role, "—");
            card.setGuiDamage(damageAmount.startsWith("HIT") ? "HIT" : "—");
            card.setGuiDamageAmount(damageAmount);
            return card;
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    private static Card hit(String name, int amount, int priority) {
        return card(name, "DAMAGE", "HIT " + amount, "{'binding':'t." + name + "','kind':'ACTION','priority':" + priority
                + ",'targets':['OPPONENT'],'target':[{'op':'damage','type':'HIT','amount':" + amount + "}]}");
    }

    private static Card heal(String name, int amount, int priority) {
        return card(name, "HEAL", "—", "{'binding':'t." + name + "','kind':'ACTION','priority':" + priority
                + ",'targets':['SELF'],'self':[{'op':'gain','resource':'HEALTH','amount':" + amount + "}]}");
    }

    private static Card filler(String name) {
        return card(name, "RESOURCES", "—", "{'binding':'t." + name + "','kind':'ACTION','targets':['SELF'],"
                + "'self':[{'op':'gain','resource':'VIOLENCE','amount':1}]}");
    }

    private static Card basic() {
        return card("Basic", "RESOURCES", "—", "{'binding':'t.Basic','kind':'ACTION','basic':true,'priority':-1,'targets':['SELF'],"
                + "'self':[{'op':'gain','resource':'ALERTNESS','amount':1}]}");
    }

    private static Card lastResort() {
        return card("Last", "DAMAGE", "HIT 3", "{'binding':'t.Last','kind':'ACTION','lastResort':true,'targets':['OPPONENT'],"
                + "'target':[{'op':'damage','type':'HIT','amount':3}]}");
    }

    private static Card bound(String owner) {
        return card("Bound " + owner, "DAMAGE", "HIT 6", "{'binding':'t.Bound" + owner + "','kind':'BOUND','boundTo':'" + owner
                + "','targets':['OPPONENT'],'target':[{'op':'damage','type':'HIT','amount':6}]}");
    }

    /** Una carta di caricamento: +5 V a sé e cerca la carta indicata al posto della pesca. */
    private static Card charge(String name, String searched, String target) {
        return card(name, "RESOURCES", "—", "{'binding':'t." + name + "','kind':'ACTION','targets':['" + target + "'],"
                + "'self':[{'op':'gain','resource':'VIOLENCE','amount':5},{'op':'search','card':'" + searched + "'}]}");
    }

    private static Card item(String name) {
        return card(name, "RESOURCES", "—", "{'binding':'t." + name + "','kind':'ITEM','self':[{'op':'gain','resource':'HEALTH','amount':5}]}");
    }

    private static Character character(String id, int health, int alertness) {
        Map<Resource, Integer> resources = new EnumMap<>(Resource.class);
        resources.put(Resource.HEALTH, health);
        resources.put(Resource.ALERTNESS, alertness);
        return new Draft.DraftCharacter(id, resources, 3, Set.of());
    }

    /**
     * Un giocatore con la mano data (basic, bound, poi le carte) e il mazzo dato, dall'ultima carta pescata alla prima: la prima
     * carta della lista {@code deck} è la cima del mazzo.
     */
    private static Player player(String id, int health, int alertness, List<Card> hand, List<Card> deck) {
        Player p = new Player(id, character(id, health, alertness), basic(), List.of(bound(id)), lastResort(), List.of(), new Random(1));
        p.getCardsInHand().clear();
        p.getCardsInHand().add(basic());
        p.getCardsInHand().add(bound(id));
        p.getCardsInHand().addAll(hand);
        List<Card> reversed = new ArrayList<>(deck);
        java.util.Collections.reverse(reversed);
        p.getDeck().addAll(reversed);
        return p;
    }

    private static Game game(Ruleset ruleset, Player a, Player b) {
        Game game = new Game(List.of(a, b), "sb-16c", false);
        game.useRuleset(ruleset);
        return game;
    }

    private static Move move(Game game, String player, String card, String target) {
        return new Move(card, player, target, game.getGameId(), new EnumMap<>(Move.AdditionalAction.class));
    }

    private static Move boundMove(Game game, String player, String target, String discard) {
        Map<Move.AdditionalAction, String> choices = new EnumMap<>(Move.AdditionalAction.class);
        choices.put(Move.AdditionalAction.DISCARD_ONE, discard);
        return new Move("Bound " + player, player, target, game.getGameId(), choices);
    }

    /** Un turno: le due mosse, poi la risoluzione. Restituisce le mosse risolte, nell'ordine di risoluzione. */
    private static List<Move> turn(Game game, Move first, Move second) {
        game.submitMove(first);
        game.submitMove(second);
        game.resolveMoves(g -> { }, (t, events) -> { });
        return new ArrayList<>(game.getResolvedMoves());
    }

    private static Move of(List<Move> moves, String player) {
        return moves.stream().filter(m -> m.getPlayerId().equals(player)).findFirst().orElseThrow();
    }

    private static int res(Player p, Resource r) { return p.getCharacter().getResources().get(r); }

    private static List<String> hand(Player p) {
        return p.getCardsInHand().stream().map(Card::getName).collect(Collectors.toList());
    }

    // ---- punto 1: chi è a terra non colpisce ----

    @Test
    void theHitOfAnAuthorAlreadyDownIsVoided() {
        for (Ruleset rules : Ruleset.values()) {
            Player a = player("a", 10, 10, List.of(hit("Lento", 15, 1)), List.of(filler("Fa"), filler("Fa2")));
            Player b = player("b", 40, 10, List.of(hit("Veloce", 20, 2)), List.of(filler("Fb"), filler("Fb2")));
            Game game = game(rules, a, b);
            List<Move> moves = turn(game, move(game, "a", "Lento", "b"), move(game, "b", "Veloce", "a"));
            Move slow = of(moves, "a");
            if (rules == Ruleset.D50) {
                assertTrue(slow.isVoid());
                assertEquals(Move.DOWN, slow.getVoidReason());
                assertEquals(List.of("Didn't do anything! (voided: a terra)"), slow.getMoveReport().get(Card.CardTarget.SELF));
                assertTrue(game.getLoggedTurnEvents().stream().anyMatch(e -> e.contains("is voided: a terra")), "registro del turno");
                assertEquals(40, res(b, Resource.HEALTH));
                assertEquals("b", game.getWinner().orElseThrow());
                // Una mossa annullata ha già pagato, scarta e pesca (R04).
                assertFalse(hand(a).contains("Lento"));
                assertTrue(hand(a).contains("Fa"));
            } else {
                assertFalse(slow.isVoid());
                assertNull(slow.getVoidReason());
                assertEquals(25, res(b, Resource.HEALTH));
            }
        }
    }

    @Test
    void aHealOnSelfStillSavesTheAuthorDown() {
        // D48: chi è a terra può ancora salvarsi con la mossa già presentata.
        Player a = player("a", 10, 10, List.of(heal("Cura", 30, 1)), List.of(filler("Fa")));
        Player b = player("b", 40, 10, List.of(hit("Veloce", 20, 2)), List.of(filler("Fb")));
        Game game = game(Ruleset.D50, a, b);
        List<Move> moves = turn(game, move(game, "a", "Cura", "SELF"), move(game, "b", "Veloce", "a"));
        assertFalse(of(moves, "a").isVoid());
        assertEquals(30, res(a, Resource.HEALTH)); // 10 − 20 → 0 col pavimento, poi + 30
        assertFalse(game.isOver());
    }

    @Test
    void mutualHitsInTheSameSpeedGroupStaySimultaneous() {
        Player a = player("a", 10, 10, List.of(hit("Colpo A", 15, 1)), List.of(filler("Fa")));
        Player b = player("b", 10, 10, List.of(hit("Colpo B", 15, 1)), List.of(filler("Fb")));
        Game game = game(Ruleset.D50, a, b);
        List<Move> moves = turn(game, move(game, "a", "Colpo A", "b"), move(game, "b", "Colpo B", "a"));
        assertFalse(of(moves, "a").isVoid());
        assertFalse(of(moves, "b").isVoid());
        assertTrue(game.isOver());
        assertTrue(game.getWinner().isEmpty(), "patta: nessuno spareggio (D50, punto 4)");
    }

    @Test
    void sameSpeedButMoreAlertnessIsAnotherGroup() {
        // Stessa priorità, A diversa dopo i costi: due gruppi, il più veloce colpisce prima.
        Player a = player("a", 10, 11, List.of(hit("Colpo A", 15, 1)), List.of(filler("Fa")));
        Player b = player("b", 10, 10, List.of(hit("Colpo B", 15, 1)), List.of(filler("Fb")));
        Game game = game(Ruleset.D50, a, b);
        List<Move> moves = turn(game, move(game, "a", "Colpo A", "b"), move(game, "b", "Colpo B", "a"));
        assertFalse(of(moves, "a").isVoid());
        assertTrue(of(moves, "b").isVoid());
        assertEquals("a", game.getWinner().orElseThrow());
    }

    @Test
    void aVoidedBoundDoesNotDiscard() {
        // Mano piena (6 carte): se la bound scartasse, si pescherebbe.
        Player a = player("a", 10, 10, List.of(filler("Scarto"), filler("M1"), filler("M2"), filler("M3")), List.of(filler("Fa")));
        Player b = player("b", 40, 10, List.of(hit("Veloce", 20, 2)), List.of(filler("Fb")));
        Game game = game(Ruleset.D50, a, b);
        assertEquals(Player.CARDS_IN_HAND, a.getCardsInHand().size());
        List<Move> moves = turn(game, boundMove(game, "a", "b", "Scarto"), move(game, "b", "Veloce", "a"));
        assertTrue(of(moves, "a").isVoid());
        assertEquals(Move.DOWN, of(moves, "a").getVoidReason());
        assertTrue(hand(a).contains("Scarto"), "la carta aggiuntiva resta in mano");
        assertFalse(hand(a).contains("Fa"), "niente scarto, niente pesca");
        assertEquals(40, res(b, Resource.HEALTH));
    }

    // ---- punto 2: costi pagati solo con quello che si ha ----

    private static Card healthCost(String name, int cost, boolean lastBlow) {
        return card(name, "DAMAGE", "HIT 25", "{'binding':'t." + name + "','kind':'ACTION','lastBlow':" + lastBlow
                + ",'targets':['OPPONENT'],'cost':{'HEALTH':" + cost + "},'target':[{'op':'damage','type':'HIT','amount':25}]}");
    }

    @Test
    void aHealthCostThatWouldBringToZeroIsRefused() {
        for (Ruleset rules : Ruleset.values()) {
            Player a = player("a", 10, 10, List.of(healthCost("Sangue", 10, false)), List.of(filler("Fa")));
            Player b = player("b", 40, 10, List.of(filler("Attesa")), List.of(filler("Fb")));
            Game game = game(rules, a, b);
            Move bloody = move(game, "a", "Sangue", "b");
            boolean legal = BotView.of(game, "a").legalMoves().stream().anyMatch(m -> m.getCard().getName().equals("Sangue"));
            if (rules == Ruleset.D50) {
                IllegalMoveException refused = assertThrows(IllegalMoveException.class, () -> game.submitMove(bloody));
                assertEquals("cant pay health down to zero", refused.getWhatHeDid());
                assertFalse(legal, "i bot vedono la stessa regola");
            } else {
                game.submitMove(bloody);
                assertTrue(legal);
            }
        }
        // Con HEALTH sopra il costo si paga.
        Player a = player("a", 11, 10, List.of(healthCost("Sangue", 10, false)), List.of(filler("Fa")));
        Player b = player("b", 40, 10, List.of(filler("Attesa")), List.of(filler("Fb")));
        Game game = game(Ruleset.D50, a, b);
        turn(game, move(game, "a", "Sangue", "b"), move(game, "b", "Attesa", "SELF"));
        assertEquals(1, res(a, Resource.HEALTH));
        assertEquals(15, res(b, Resource.HEALTH));
    }

    @Test
    void ultimoColpoPaysDownToZeroAndResolvesFromTheGround() {
        Player a = player("a", 10, 10, List.of(healthCost("Ultimo", 10, true)), List.of(filler("Fa")));
        Player b = player("b", 25, 10, List.of(filler("Attesa")), List.of(filler("Fb")));
        Game game = game(Ruleset.D50, a, b);
        assertTrue(BotView.of(game, "a").legalMoves().stream().anyMatch(m -> m.getCard().getName().equals("Ultimo")));
        List<Move> moves = turn(game, move(game, "a", "Ultimo", "b"), move(game, "b", "Attesa", "SELF"));
        assertFalse(of(moves, "a").isVoid(), "a terra dopo il costo, ma «Ultimo colpo» si risolve");
        assertEquals(0, res(a, Resource.HEALTH));
        assertEquals(0, res(b, Resource.HEALTH));
        assertTrue(game.getWinner().isEmpty());
    }

    @Test
    void ultimoColpoAlsoResolvesWhenDownedByAFasterHit() {
        Player a = player("a", 10, 10, List.of(healthCost("Ultimo", 1, true)), List.of(filler("Fa")));
        Player b = player("b", 25, 10, List.of(hit("Veloce", 20, 2)), List.of(filler("Fb")));
        Game game = game(Ruleset.D50, a, b);
        List<Move> moves = turn(game, move(game, "a", "Ultimo", "b"), move(game, "b", "Veloce", "a"));
        assertFalse(of(moves, "a").isVoid());
        assertEquals(0, res(b, Resource.HEALTH));
    }

    // ---- punto 3: pavimento a zero ----

    @Test
    void resourcesDoNotGoBelowZero() {
        for (Ruleset rules : Ruleset.values()) {
            Character c = character("c", 10, 3);
            c.useRuleset(rules);
            c.getResources().put(Resource.VIOLENCE, 4);
            c.loseResource(Resource.VIOLENCE, 10);
            c.takeDamage(new Damage(Damage.DamageType.CUT, 25));
            // Fine turno: L 20 toglie 10 di A (ne ha 3) e 11 di L.
            c.getResources().put(Resource.ALCOHOL, 20);
            c.resolveTimeBasedEffects();
            if (rules == Ruleset.D50) {
                assertEquals(0, c.getResources().get(Resource.VIOLENCE));
                assertEquals(0, c.getResources().get(Resource.HEALTH));
                assertEquals(0, c.getResources().get(Resource.ALERTNESS));
                assertTrue(c.isDead());
            } else {
                assertEquals(-6, c.getResources().get(Resource.VIOLENCE));
                assertEquals(-15, c.getResources().get(Resource.HEALTH));
                assertEquals(-7, c.getResources().get(Resource.ALERTNESS));
            }
            assertEquals(9, c.getResources().get(Resource.ALCOHOL));
        }
    }

    // ---- punto 5: corazza dell'alcol ----

    private static Character drunk(Ruleset rules, int alcohol) {
        Character c = character("c", 100, 10);
        c.useRuleset(rules);
        c.getResources().put(Resource.ALCOHOL, alcohol);
        return c;
    }

    @Test
    void alcoholArmorReducesHitsOnly() {
        Character c = drunk(Ruleset.D50, 20);
        String line = c.takeDamage(new Damage(Damage.DamageType.HIT, 15));
        assertEquals(90, c.getResources().get(Resource.HEALTH), "15 − 20/4");
        assertTrue(line.endsWith("(ALCOHOL armor: -5 HIT)"), line);
        c.takeDamage(new Damage(Damage.DamageType.CUT, 15));
        assertEquals(75, c.getResources().get(Resource.HEALTH), "CUT intero");
        c.takeDamage(new Damage(Damage.DamageType.POISON, 15));
        assertEquals(60, c.getResources().get(Resource.HEALTH), "POISON intero");
        c.takeDamage(new Damage(Damage.DamageType.HIT, 3));
        assertEquals(60, c.getResources().get(Resource.HEALTH), "non sotto zero");
        c.getResources().put(Resource.ALCOHOL, 3);
        c.takeDamage(new Damage(Damage.DamageType.HIT, 10));
        assertEquals(50, c.getResources().get(Resource.HEALTH), "3/4 = 0, divisione intera");

        Character live = drunk(Ruleset.LIVE, 20);
        assertFalse(live.takeDamage(new Damage(Damage.DamageType.HIT, 15)).contains("armor"));
        assertEquals(85, live.getResources().get(Resource.HEALTH));
    }

    @Test
    void alcoholArmorComesAfterStatuses() {
        Character c = drunk(Ruleset.D50, 20);
        c.getStatuses().add(Status.builder().name("Esposto").description("HIT ricevuti doppi").type(StatusType.BAD)
                .flow(StatusFlow.INPUT).impactedProperty(Damage.DamageType.HIT).amountFunction((StatusAmountFunction) n -> n * 2)
                .lastsForTurns(1).build());
        c.takeDamage(new Damage(Damage.DamageType.HIT, 10));
        assertEquals(85, c.getResources().get(Resource.HEALTH), "10 × 2 − 5");
    }

    @Test
    void alcoholArmorAlsoOnDamageToSelf() {
        Card selfHit = card("Autolesione", "DAMAGE", "—", "{'binding':'t.Autolesione','kind':'ACTION','targets':['SELF'],"
                + "'self':[{'op':'damage','type':'HIT','amount':12}]}");
        Player a = player("a", 50, 10, List.of(selfHit), List.of(filler("Fa")));
        Player b = player("b", 50, 10, List.of(filler("Attesa")), List.of(filler("Fb")));
        a.getCharacter().getResources().put(Resource.ALCOHOL, 8);
        Game game = game(Ruleset.D50, a, b);
        turn(game, move(game, "a", "Autolesione", "SELF"), move(game, "b", "Attesa", "SELF"));
        assertEquals(40, res(a, Resource.HEALTH), "12 − 8/4");
    }

    // ---- punto 6: ricerca al posto della pesca ----

    @Test
    void searchFindsTheCardInTheDeckAndShowsIt() {
        Card target = hit("Colpo cercato", 20, 1);
        Player a = player("a", 50, 10, List.of(charge("Carica", "t.Colpo cercato", "SELF")),
                List.of(filler("Cima"), filler("Seconda"), target, filler("Fondo")));
        Player b = player("b", 50, 10, List.of(filler("Attesa")), List.of(filler("Fb")));
        Game game = game(Ruleset.D50, a, b);
        Move charge = of(turn(game, move(game, "a", "Carica", "SELF"), move(game, "b", "Attesa", "SELF")), "a");
        assertTrue(hand(a).contains("Colpo cercato"));
        assertFalse(hand(a).contains("Cima"), "la ricerca sostituisce la pesca");
        assertEquals(3, a.getDeckSize());
        assertEquals("t.Colpo cercato", charge.getSearchedFor());
        assertEquals("Colpo cercato", charge.getSearchFound().getName());
        assertTrue(charge.getMoveReport().get(Card.CardTarget.SELF).contains(
                "Searched the deck for t.Colpo cercato: found Colpo cercato (shown to everyone)"));
        assertTrue(game.getLoggedTurnEvents().stream().anyMatch(e -> e.contains("searched the deck for t.Colpo cercato: found")));
        // L'avversario la vede.
        BotView.SeenMove seen = BotView.of(game, "b").getLastRound().stream().filter(m -> m.getPlayerId().equals("a")).findFirst().orElseThrow();
        assertEquals("Colpo cercato", seen.getSearchFound().getName());
        assertEquals(20, seen.getSearchFound().nominalDamage());
    }

    @Test
    void withTheLiveRulesTheSearchStepDoesNothing() {
        Player a = player("a", 50, 10, List.of(charge("Carica", "t.Colpo cercato", "SELF")),
                List.of(filler("Cima"), hit("Colpo cercato", 20, 1)));
        Player b = player("b", 50, 10, List.of(filler("Attesa")), List.of(filler("Fb")));
        Game game = game(Ruleset.LIVE, a, b);
        Move charge = of(turn(game, move(game, "a", "Carica", "SELF"), move(game, "b", "Attesa", "SELF")), "a");
        assertTrue(hand(a).contains("Cima"));
        assertNull(charge.getSearchedFor());
    }

    /** La ricerca non trova la carta: pesca normale e riga «not in the deck». */
    private static void searchFallsBackToTheDraw(Player a, String expectedDraw) {
        Player b = player("b", 50, 10, List.of(filler("Attesa")), List.of(filler("Fb")));
        Game game = game(Ruleset.D50, a, b);
        Move charge = of(turn(game, move(game, "a", "Carica", "SELF"), move(game, "b", "Attesa", "SELF")), "a");
        assertNull(charge.getSearchFound());
        assertTrue(charge.getMoveReport().get(Card.CardTarget.SELF).contains(
                "Searched the deck for t.Colpo cercato: not in the deck, normal draw"));
        assertTrue(hand(a).contains(expectedDraw), hand(a).toString());
    }

    @Test
    void searchedCardAlreadyInHand() {
        Player a = player("a", 50, 10, List.of(charge("Carica", "t.Colpo cercato", "SELF"), hit("Colpo cercato", 20, 1)),
                List.of(filler("Cima")));
        searchFallsBackToTheDraw(a, "Cima");
        assertEquals(1, hand(a).stream().filter("Colpo cercato"::equals).count());
    }

    @Test
    void searchedCardAlreadyDiscarded() {
        Card target = hit("Colpo cercato", 20, 1);
        Player a = player("a", 50, 10, List.of(target, charge("Carica", "t.Colpo cercato", "SELF")),
                List.of(filler("Cima"), filler("Seconda"), filler("Terza")));
        Player b = player("b", 50, 10, List.of(filler("Attesa"), filler("Attesa2")), List.of(filler("Fb"), filler("Fb2")));
        Game game = game(Ruleset.D50, a, b);
        turn(game, move(game, "a", "Colpo cercato", "b"), move(game, "b", "Attesa", "SELF"));
        Move charge = of(turn(game, move(game, "a", "Carica", "SELF"), move(game, "b", "Attesa2", "SELF")), "a");
        assertNull(charge.getSearchFound());
        assertTrue(hand(a).contains("Seconda"));
    }

    @Test
    void searchedCardAbsentFromTheDeck() {
        Player a = player("a", 50, 10, List.of(charge("Carica", "t.Colpo cercato", "SELF")), List.of(filler("Cima")));
        searchFallsBackToTheDraw(a, "Cima");
    }

    @Test
    void searchWithAnEmptyDeckGivesTheLastResort() {
        Player a = player("a", 50, 10, List.of(charge("Carica", "t.Colpo cercato", "SELF")), List.of());
        searchFallsBackToTheDraw(a, "Last");
    }

    @Test
    void searchFindsAnItem() {
        // Un oggetto trovato va sul campo, come quando si pesca, e la pesca continua: un oggetto non riempie la mano.
        Player a = player("a", 50, 10, List.of(charge("Carica", "t.Birra", "SELF")),
                List.of(filler("Cima"), item("Birra"), filler("Fondo")));
        Player b = player("b", 50, 10, List.of(filler("Attesa")), List.of(filler("Fb")));
        Game game = game(Ruleset.D50, a, b);
        Move charge = of(turn(game, move(game, "a", "Carica", "SELF"), move(game, "b", "Attesa", "SELF")), "a");
        assertEquals("Birra", charge.getSearchFound().getName());
        assertEquals(List.of("Birra"), a.getCharacter().getItems().stream().map(Card::getName).collect(Collectors.toList()));
        assertTrue(hand(a).contains("Cima"));
        assertEquals(1, a.getDeckSize());
    }

    @Test
    void searchCardDiscardedWithABoundDoesNotSearch() {
        Player a = player("a", 50, 10, List.of(charge("Carica", "t.Colpo cercato", "SELF")),
                List.of(filler("Cima"), hit("Colpo cercato", 20, 1)));
        Player b = player("b", 50, 10, List.of(filler("Attesa")), List.of(filler("Fb")));
        Game game = game(Ruleset.D50, a, b);
        Move played = of(turn(game, boundMove(game, "a", "b", "Carica"), move(game, "b", "Attesa", "SELF")), "a");
        assertNull(played.getSearchedFor());
        assertTrue(hand(a).contains("Cima"));
        assertFalse(hand(a).contains("Colpo cercato"));
    }

    @Test
    void foundCardDiscardedWithABoundLeavesTheHand() {
        Player a = player("a", 50, 10, List.of(charge("Carica", "t.Colpo cercato", "SELF")),
                List.of(filler("Cima"), hit("Colpo cercato", 20, 1), filler("Seconda")));
        Player b = player("b", 50, 10, List.of(filler("Attesa"), filler("Attesa2")), List.of(filler("Fb"), filler("Fb2")));
        Game game = game(Ruleset.D50, a, b);
        turn(game, move(game, "a", "Carica", "SELF"), move(game, "b", "Attesa", "SELF"));
        assertTrue(hand(a).contains("Colpo cercato"));
        turn(game, boundMove(game, "a", "b", "Colpo cercato"), move(game, "b", "Attesa2", "SELF"));
        assertFalse(hand(a).contains("Colpo cercato"));
        assertTrue(hand(a).contains("Cima"), "la bound pesca normalmente");
    }

    @Test
    void twoSearchesInTheSameTurn() {
        Player a = player("a", 50, 10, List.of(charge("Carica", "t.Colpo cercato", "SELF")),
                List.of(filler("Cima A"), hit("Colpo cercato", 20, 1)));
        Player b = player("b", 50, 10, List.of(charge("Carica", "t.Colpo cercato", "SELF")),
                List.of(filler("Cima B"), hit("Colpo cercato", 20, 1)));
        Game game = game(Ruleset.D50, a, b);
        List<Move> moves = turn(game, move(game, "a", "Carica", "SELF"), move(game, "b", "Carica", "SELF"));
        for (Player p : List.of(a, b)) {
            assertEquals("Colpo cercato", of(moves, p.getPlayerId()).getSearchFound().getName());
            assertTrue(hand(p).contains("Colpo cercato"));
            assertEquals(1, p.getDeckSize());
        }
    }

    @Test
    void searchOfAnAuthorDown() {
        // Carica diretta all'avversario: annullata, nessuna ricerca, pesca normale.
        Player a = player("a", 10, 10, List.of(charge("Carica", "t.Colpo cercato", "OPPONENT")),
                List.of(filler("Cima"), hit("Colpo cercato", 20, 1)));
        Player b = player("b", 40, 10, List.of(hit("Veloce", 20, 2)), List.of(filler("Fb")));
        Game game = game(Ruleset.D50, a, b);
        Move voided = of(turn(game, move(game, "a", "Carica", "b"), move(game, "b", "Veloce", "a")), "a");
        assertTrue(voided.isVoid());
        assertNull(voided.getSearchedFor());
        assertTrue(hand(a).contains("Cima"));

        // Carica su di sé: si risolve anche a terra, e la ricerca con lei.
        Player c = player("a", 10, 10, List.of(charge("Carica", "t.Colpo cercato", "SELF")),
                List.of(filler("Cima"), hit("Colpo cercato", 20, 1)));
        Player d = player("b", 40, 10, List.of(hit("Veloce", 20, 2)), List.of(filler("Fb")));
        Game other = game(Ruleset.D50, c, d);
        Move self = of(turn(other, move(other, "a", "Carica", "SELF"), move(other, "b", "Veloce", "a")), "a");
        assertFalse(self.isVoid());
        assertEquals("Colpo cercato", self.getSearchFound().getName());
    }

    @Test
    void theDraftRefusesAMisplacedSearch() {
        assertThrows(IllegalArgumentException.class, () -> DataCards.definition(JSON.readTree(("{'binding':'x','kind':'ACTION',"
                + "'targets':['OPPONENT'],'target':[{'op':'search','card':'y'}]}").replace('\'', '"'))));
        assertThrows(IllegalArgumentException.class, () -> DataCards.definition(JSON.readTree(("{'binding':'x','kind':'ACTION',"
                + "'basic':true,'targets':['SELF'],'self':[{'op':'search','card':'y'}]}").replace('\'', '"'))));
        assertThrows(IllegalArgumentException.class, () -> DataCards.definition(JSON.readTree(("{'binding':'x','kind':'ACTION',"
                + "'targets':['SELF'],'self':[{'op':'search','card':'y'},{'op':'search','card':'z'}]}").replace('\'', '"'))));
        assertThrows(IllegalArgumentException.class, () -> DataCards.definition(JSON.readTree(("{'binding':'x','kind':'ACTION',"
                + "'targets':['SELF'],'self':[{'op':'search'}]}").replace('\'', '"'))));
        assertThrows(IllegalArgumentException.class, () -> DataCards.definition(JSON.readTree(
                "{'binding':'x','kind':'ITEM','lastBlow':true,'self':[]}".replace('\'', '"'))));
    }

    // ---- SB-16f0 (D56): ricerca e motivo dell'annullamento nella vista pubblica, nient'altro ----

    private static final com.gsc.bm.service.view.ViewExtractorServiceImpl VIEWS = new com.gsc.bm.service.view.ViewExtractorServiceImpl(
            new com.gsc.bm.service.catalog.CatalogSource() {
                public List<String> cardBindings() { return List.of(); }
                public List<String> characterBindings() { return List.of(); }
                public boolean hasCard(String binding) { return false; }
                public boolean hasCharacter(String binding) { return true; }
                public java.util.Optional<CharacterGui> characterGui(String binding) { return java.util.Optional.of(new CharacterGui(binding, null)); }
            });

    /** La vista che il server manda al giocatore {@code viewer}, come JSON. */
    private static com.fasterxml.jackson.databind.JsonNode viewFor(Game game, String viewer) {
        return JSON.valueToTree(VIEWS.extractViewFor(game, viewer));
    }

    private static com.fasterxml.jackson.databind.JsonNode publicMove(com.fasterxml.jackson.databind.JsonNode view, String player) {
        for (com.fasterxml.jackson.databind.JsonNode m : view.path("resolvedMoves")) if (player.equals(m.path("playerId").asText())) return m;
        throw new AssertionError("nessuna mossa di " + player);
    }

    @Test
    void theViewPublishesTheFoundCardToEveryoneAndNothingElseOfTheHandOrDeck() {
        Player a = player("a", 50, 10, List.of(charge("Carica", "t.Colpo cercato", "SELF"), filler("Segreta")),
                List.of(filler("Cima"), filler("Seconda"), hit("Colpo cercato", 20, 1), filler("Fondo")));
        Player b = player("b", 50, 10, List.of(filler("Attesa")), List.of(filler("Fb")));
        Game game = game(Ruleset.D50, a, b);
        turn(game, move(game, "a", "Carica", "SELF"), move(game, "b", "Attesa", "SELF"));
        com.fasterxml.jackson.databind.JsonNode forB = viewFor(game, "b"), forA = viewFor(game, "a");
        com.fasterxml.jackson.databind.JsonNode search = publicMove(forB, "a").path("search");
        assertEquals("t.Colpo cercato", search.path("card").asText());
        assertTrue(search.path("found").asBoolean());
        assertEquals("Colpo cercato", search.path("revealed").path("name").asText());
        assertEquals("t.Colpo cercato", search.path("revealed").path("bindingName").asText());
        // SB-16g 2a (D58): in più l'identità della copia, la stessa che la tiene scoperta nella mano.
        assertEquals(Set.of("card", "found", "revealed", "copy"), fieldNames(search), "solo binding, esito, carta rivelata e sua copia");
        assertEquals(search.path("copy"), forB.path("players").path("a").path("revealed").get(0).path("copy"));
        assertEquals(search, publicMove(forA, "a").path("search"), "la stessa ricerca per tutti");
        assertFalse(publicMove(forB, "a").has("voidReason"), "mossa non annullata: nessun motivo");
        assertFalse(publicMove(forB, "b").has("search"), "mossa senza ricerca: nessun campo");
        // L'avversario continua a vedere solo il numero di carte in mano e nel mazzo: nessun nome della mano o del mazzo di a.
        assertTrue(forB.path("players").path("a").path("cardsInHand").isNumber());
        assertTrue(forB.path("players").path("a").path("deck").isNumber());
        String wire = forB.toString();
        for (String hidden : List.of("Segreta", "Cima", "Seconda", "Fondo", "Bound a")) assertFalse(wire.contains(hidden), hidden);
        assertTrue(forA.toString().contains("Segreta"), "la propria mano resta nella propria vista");
    }

    @Test
    void theViewPublishesASearchThatFoundNothingWithoutTheDraw() {
        Player a = player("a", 50, 10, List.of(charge("Carica", "t.Colpo cercato", "SELF")), List.of(filler("Cima"), filler("Seconda")));
        Player b = player("b", 50, 10, List.of(filler("Attesa")), List.of(filler("Fb")));
        Game game = game(Ruleset.D50, a, b);
        turn(game, move(game, "a", "Carica", "SELF"), move(game, "b", "Attesa", "SELF"));
        assertTrue(hand(a).contains("Cima"), "pesca normale");
        com.fasterxml.jackson.databind.JsonNode forB = viewFor(game, "b"), search = publicMove(forB, "a").path("search");
        assertEquals("t.Colpo cercato", search.path("card").asText());
        assertFalse(search.path("found").asBoolean());
        assertFalse(search.has("revealed"), "nessuna carta rivelata");
        assertFalse(forB.toString().contains("Cima"), "la carta pescata al posto della ricerca resta privata");
    }

    @Test
    void theViewPublishesTheReasonOfAMoveVoidedDown() {
        Player a = player("a", 10, 10, List.of(charge("Carica", "t.Colpo cercato", "OPPONENT")),
                List.of(filler("Cima"), hit("Colpo cercato", 20, 1)));
        Player b = player("b", 40, 10, List.of(hit("Veloce", 20, 2)), List.of(filler("Fb")));
        Game game = game(Ruleset.D50, a, b);
        turn(game, move(game, "a", "Carica", "b"), move(game, "b", "Veloce", "a"));
        com.fasterxml.jackson.databind.JsonNode voided = publicMove(viewFor(game, "b"), "a");
        assertTrue(voided.path("void").asBoolean());
        assertEquals("a terra", voided.path("voidReason").asText());
        assertFalse(voided.has("search"), "una mossa annullata non cerca");
        assertFalse(publicMove(viewFor(game, "b"), "b").has("voidReason"));
    }

    @Test
    void withTheLiveRulesTheViewHasNeitherSearchNorReason() {
        Player a = player("a", 10, 10, List.of(charge("Carica", "t.Colpo cercato", "OPPONENT")),
                List.of(filler("Cima"), hit("Colpo cercato", 20, 1)));
        Player b = player("b", 40, 10, List.of(hit("Veloce", 20, 2)), List.of(filler("Fb")));
        Game game = game(Ruleset.LIVE, a, b);
        turn(game, move(game, "a", "Carica", "b"), move(game, "b", "Veloce", "a"));
        for (String viewer : List.of("a", "b"))
            for (com.fasterxml.jackson.databind.JsonNode m : viewFor(game, viewer).path("resolvedMoves")) {
                assertFalse(m.has("search"), viewer);
                assertFalse(m.has("voidReason"), viewer);
            }
    }

    @Test
    void aMoveCommandCannotCarryTheNewFields() {
        for (String field : List.of("search", "voidReason")) {
            Player a = player("a", 50, 10, List.of(filler("Attesa")), List.of(filler("Fa")));
            Player b = player("b", 50, 10, List.of(filler("Attesa")), List.of(filler("Fb")));
            Game game = game(Ruleset.D50, a, b);
            com.fasterxml.jackson.databind.node.ObjectNode body = JSON.createObjectNode().put("playedCardName", "Attesa")
                    .put("playerId", "a").put("targetId", "SELF").put("gameId", game.getGameId()).put(field, "a terra");
            IllegalMoveException e = assertThrows(IllegalMoveException.class,
                    () -> new com.gsc.bm.api.ws.MoveCommandValidator().validate(game, "a", game.getGameId(), body));
            assertEquals("Unexpected move field", e.getWhatHeDid());
        }
    }

    private static Set<String> fieldNames(com.fasterxml.jackson.databind.JsonNode node) {
        Set<String> names = new java.util.TreeSet<>();
        node.fieldNames().forEachRemaining(names::add);
        return names;
    }

    // ---- punto 7: ordine dei timer ----

    @Test
    void timersExpiringInTheSameTurnRunInCreationOrder() {
        for (Ruleset rules : Ruleset.values()) {
            Character c = character("c", 50, 10);
            c.useRuleset(rules);
            c.getTimers().add(new Timer("primo", ch -> ch.getResources().put(Resource.VIOLENCE, 1), 2));
            c.getTimers().add(new Timer("secondo", ch -> ch.getResources().put(Resource.VIOLENCE,
                    ch.getResources().get(Resource.VIOLENCE) * 10 + 2), 1));
            c.getTimers().add(new Timer("terzo", ch -> ch.getResources().put(Resource.VIOLENCE,
                    ch.getResources().get(Resource.VIOLENCE) * 10 + 3), 2));
            c.resolveTimeBasedEffects();
            assertEquals(2, c.getResources().get(Resource.VIOLENCE), "solo il secondo scade al primo turno");
            c.resolveTimeBasedEffects();
            assertEquals(13, c.getResources().get(Resource.VIOLENCE), "primo, poi terzo: ordine di creazione");
        }
    }

    // ---- bot: il ritmo caricare-colpire-parare ----

    @Test
    void botsPlayTheHitAfterTheirCharge() {
        for (Ruleset rules : Ruleset.values()) {
            Player a = player("a", 50, 10, List.of(charge("Carica", "t.Colpo cercato", "SELF"), hit("Altro colpo", 14, 1)),
                    List.of(hit("Colpo cercato", 12, 1), filler("Cima")));
            Player b = player("b", 80, 10, List.of(filler("Attesa"), filler("Attesa2")), List.of(filler("Fb"), filler("Fb2")));
            Game game = game(rules, a, b);
            turn(game, move(game, "a", "Carica", "SELF"), move(game, "b", "Attesa", "SELF"));
            BotView view = BotView.of(game, "a");
            String chosen = new AggressivePolicy().choose(view, view.legalMoves(), new Random(3)).getCard().getName();
            // Con le 1.13 la ricerca non c'è: pesca «Colpo cercato» comunque (è in cima) e sceglie il colpo più forte.
            assertEquals(rules == Ruleset.D50 ? "Colpo cercato" : "Altro colpo", chosen, rules.id());
        }
    }

    @Test
    void botsBraceForAVisibleCharge() {
        for (int strength : new int[] {20, 0}) {
            Card defense = card("Parata", "DEFENSE", "—", "{'binding':'t.Parata','kind':'ACTION','priority':2,'targets':['SELF'],"
                    + "'self':[{'op':'status','name':'Parata','description':'HIT dimezzati','statusType':'GOOD','flow':'INPUT',"
                    + "'property':'HIT','factor':0.5,'turns':0}]}");
            Player a = player("a", 50, 10, List.of(defense, hit("Colpetto", 5, 1)), List.of(filler("Fa"), filler("Fa2")));
            Card shown = strength > 0 ? hit("Colpo cercato", strength, 1) : filler("Colpo cercato");
            Player b = player("b", 50, 10, List.of(charge("Carica", "t.Colpo cercato", "SELF")), List.of(filler("Cima"), shown));
            Game game = game(Ruleset.D50, a, b);
            turn(game, move(game, "a", "Basic", "SELF"), move(game, "b", "Carica", "SELF"));
            BotView view = BotView.of(game, "a");
            LegalMove chosen = new ResourceAwarePolicy().choose(view, view.legalMoves(), new Random(3));
            // Senza un colpo annunciato attacca (la bound o il colpetto); con un colpo da 20 mostrato si para.
            if (strength > 0) assertEquals("Parata", chosen.getCard().getName());
            else assertNotEquals("Parata", chosen.getCard().getName());
        }
    }
}
