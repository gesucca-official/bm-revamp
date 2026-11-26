package com.gsc.bm.sim;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.LoadableCard;
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
import static com.gsc.bm.model.cards.base.SetBaseIds.*;

/**
 * SB-25 B2, D171 (1): the timer of «Mescolone Micidiale» (com.items.MarvelousCocktail, bozza 1.7), which at the end of the fifth turn
 * counting the one it is consumed in clears every immunity and every status, also removes the vulnerability tokens of «Annuncia»
 * (playground rules RP-14, written in regole-playground.md 1.7). It pins what the engine already does: no behaviour changes.
 * The opponent hits with CUT every turn, which the alcohol armour (RP-6) does not reduce: 15 while vulnerable, 10 after.
 */
class MescoloneD171Test {
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final String MESCOLONE = LETHAL_MIX, STRIKE = "Colpo cercato";
    private static Draft draft;

    @BeforeAll
    static void load() throws Exception { draft = Draft.fromClasspath("/set-base/bozza.json"); }

    private static Card card(String name, String json) {
        try {
            LoadableCard card = DataCards.instantiate(DataCards.definition(JSON.readTree(json.replace('\'', '"'))));
            card.setGuiName(name);
            card.setGuiRole("OTHER", "—");
            card.setGuiDamage("—");
            card.setGuiDamageAmount("—");
            return card;
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    private static Card filler(String name) {
        return card(name, "{'binding':'t." + name + "','kind':'ACTION','targets':['SELF'],'self':[{'op':'gain','resource':'VIOLENCE','amount':1}]}");
    }

    private static Card cut(String name) {
        return card(name, "{'binding':'t." + name + "','kind':'ACTION','priority':1,'targets':['OPPONENT'],'target':[{'op':'damage','type':'CUT','amount':10}]}");
    }

    private static Card strike() {
        return card(STRIKE, "{'binding':'t." + STRIKE + "','kind':'ACTION','priority':2,'targets':['OPPONENT'],'target':[{'op':'damage','type':'HIT','amount':30}]}");
    }

    /** As the charges of the draft: +5 V, searches the strike in place of the draw and, found, gives the vulnerability token (×1,5). */
    private static Card charge() {
        return card("Carica", "{'binding':'t.Carica','kind':'ACTION','priority':2,'targets':['SELF'],'self':[{'op':'gain','resource':'VIOLENCE','amount':5},"
                + "{'op':'search','card':'t." + STRIKE + "','vulnerability':{'factor':1.5,'turnsIfNotFound':2}}]}");
    }

    /** The basic that consumes the item it targets. */
    private static Card consumer() {
        return card("Basic", "{'binding':'t.Basic','kind':'ACTION','basic':true,'priority':-1,'targets':['NEAR_ITEM'],'self':[{'op':'consume'}]}");
    }

    private static Card lastResort() {
        return card("Last", "{'binding':'t.Last','kind':'ACTION','lastResort':true,'targets':['OPPONENT'],'target':[{'op':'damage','type':'HIT','amount':3}]}");
    }

    private static Character character(String id) {
        Map<Resource, Integer> resources = new EnumMap<>(Resource.class);
        for (Resource r : Resource.values()) resources.put(r, 0);
        resources.put(Resource.HEALTH, 500);
        resources.put(Resource.ALERTNESS, 10);
        return new Draft.DraftCharacter(id, resources, 3, Set.of());
    }

    /** Hand: the basic, then the cards given; deck: the first card of the list is the top. */
    private static Player player(String id, List<Card> hand, List<Card> deck) {
        Player p = new Player(id, character(id), consumer(), List.of(), lastResort(), List.of(), new Random(1));
        p.getCardsInHand().clear();
        p.getCardsInHand().add(consumer());
        p.getCardsInHand().addAll(hand);
        List<Card> reversed = new ArrayList<>(deck);
        Collections.reverse(reversed);
        p.getDeck().addAll(reversed);
        return p;
    }

    private static List<Card> fillers(int n) {
        List<Card> cards = new ArrayList<>();
        for (int i = 0; i < n; i++) cards.add(filler("Riempitivo"));
        return cards;
    }

    private static Move move(Game game, String player, String card, String target, String item) {
        Map<Move.AdditionalAction, String> choices = new EnumMap<>(Move.AdditionalAction.class);
        if (item != null) choices.put(Move.AdditionalAction.TARGET_ITEM, item);
        return new Move(card, player, target, game.getGameId(), choices);
    }

    private static int health(Player p) { return p.getCharacter().getResources().get(Resource.HEALTH); }

    /** One turn: a plays the card given (on itself, or consuming the Mescolone), b cuts a; returns the health a loses. */
    private static int turn(Game game, String aCard, String item) {
        Player a = game.getPlayers().get("a");
        int before = health(a);
        game.submitMove(move(game, "a", aCard, "SELF", item));
        game.submitMove(move(game, "b", "Taglio", "a", null));
        game.resolveMoves(g -> { }, (t, events) -> { });
        return before - health(a);
    }

    private static List<Status> vulnerabilities(Player p) {
        return p.getCharacter().getStatuses().stream().filter(s -> s.getExposure() != null).collect(Collectors.toList());
    }

    @Test
    void theTimerOfMescoloneAlsoRemovesTheVulnerabilityTokensD171() {
        Card mescolone = draft.card(MESCOLONE);
        String name = mescolone.getName();
        assertEquals("Mescolone Micidiale", name);
        List<Card> deck = new ArrayList<>(List.of(filler("Cima"), strike()));
        deck.addAll(fillers(10));
        List<Card> hand = new ArrayList<>(List.of(charge()));
        hand.addAll(fillers(3)); // a hand with room: the search replaces a draw
        Player a = player("a", hand, deck);
        a.getCharacter().getItems().add(mescolone);
        List<Card> cuts = new ArrayList<>();
        for (int i = 0; i < 12; i++) cuts.add(cut("Taglio"));
        Player b = player("b", List.of(cut("Taglio")), cuts);
        Game game = new Game(List.of(a, b), "sb-25-d171", false);
        game.useRuleset(Ruleset.D50);

        // Turn 1: the charge finds the strike, a is Vulnerabile (a token on HIT, CUT and POISON) and takes the cut ×1,5.
        assertEquals(15, turn(game, "Carica", null));
        assertEquals(3, vulnerabilities(a).size());
        // Turn 2: a consumes the Mescolone (priority -1, after the cut): immune to T and L, +20 L, +20 T, the timer of five turns.
        assertEquals(15, turn(game, "Basic", name));
        assertTrue(a.getCharacter().getItems().isEmpty());
        assertEquals(Set.of(Resource.TOXICITY, Resource.ALCOHOL), a.getCharacter().getImmunities());
        assertEquals(1, a.getCharacter().getTimers().size());
        // Turns 3, 4 and 5: still vulnerable, the strike stays in hand.
        for (int t = 3; t <= 5; t++) assertEquals(15, turn(game, "Riempitivo", null), "turn " + t);
        assertEquals(3, vulnerabilities(a).size());
        assertTrue(a.getCardsInHand().stream().anyMatch(c -> c.getName().equals(STRIKE)));
        // Turn 6, the fifth counting the one of the consume: cut ×1,5, then the timer clears immunities and statuses, the
        // vulnerability tokens with them, before its 20 POISON, which therefore is not multiplied (35, not 15 + 30).
        assertEquals(35, turn(game, "Riempitivo", null));
        assertTrue(vulnerabilities(a).isEmpty(), "D171 (1): the Mescolone also removes Vulnerabile");
        assertTrue(a.getCharacter().getStatuses().isEmpty());
        assertTrue(a.getCharacter().getImmunities().isEmpty());
        assertTrue(a.getCharacter().getTimers().isEmpty());
        // Turn 7: the cut is no longer multiplied (10), and the T of 20 poisons at the end of the turn without immunity (10).
        assertEquals(20, turn(game, "Riempitivo", null));
    }
}
