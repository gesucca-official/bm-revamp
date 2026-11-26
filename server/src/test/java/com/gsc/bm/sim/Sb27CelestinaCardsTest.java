package com.gsc.bm.sim;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.cards.base.SetBaseIds;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static com.gsc.bm.model.Resource.*;
import static com.gsc.bm.sim.Sb27Table.*;
import static org.junit.jupiter.api.Assertions.*;
import static com.gsc.bm.model.cards.base.SetBaseIds.*;

/** Attesi dalle schede di Celestina Bucatina del Set Base 1.0 candidato. */
class Sb27CelestinaCardsTest {
    private static final String CELESTINA = SetBaseIds.CELESTINA;
    private static final String DESIDERIO = UNCONTROLLABLE_CRAVING;
    private static final String FONDO = ASHTRAY_BOTTOM;
    private static final String CAPPOTTO = BURROW_INTO_THE_COAT;
    private static final String DOSE = CUT_THE_DOSE;
    private static final String ULTIMO = THE_LAST_DRAG;
    private static final String TOSSICONE = PHLEGMY_COUGH;
    private static final String TUNNEL = DRAG_INTO_THE_TUNNEL;
    private static final String ESPRESSO = VENDING_MACHINE_ESPRESSO;
    private static Draft draft;

    @BeforeAll
    static void loadDraft() throws Exception {
        load();
        draft = Draft.fromClasspath("/set-base/bozza.json");
    }

    private static Player celestina(Card... hand) {
        return player(draft.character(CELESTINA), List.of(hand), fillers(10), null);
    }

    @Test
    void desiderioAddsFiveTAndConsumesOnlyTheChosenObject() {
        Card basic = card(DESIDERIO);
        Game game = game(celestina(basic), b());
        ch(game, CELESTINA).getItems().addAll(List.of(card(ESPRESSO), card(WARM_BLONDE_66)));
        assertArrayEquals(new int[]{0, 0}, turn(game,
                onItem(game, CELESTINA, "Desiderio Incontrollabile", CELESTINA, "Espresso della Macchinetta"), rest(game, "b")));
        assertTrue(basic.isBasicAction());
        assertEquals(1, basic.getPriority());
        assertEquals(25, res(game, CELESTINA, TOXICITY));
        assertEquals(50, res(game, CELESTINA, ALERTNESS));
        assertEquals(List.of("Bionda da 66, Calda"), items(game, CELESTINA));
        assertTrue(inHand(game, CELESTINA, "Desiderio Incontrollabile"));
    }

    @Test
    void desiderioStillAddsFiveTAfterTheChosenObjectIsDestroyed() {
        Player opponent = player("b", 90, card(DISASSEMBLE));
        opponent.getCharacter().getResources().put(VIOLENCE, 5);
        Game game = game(celestina(card(DESIDERIO)), opponent);
        ch(game, CELESTINA).getItems().add(card(ESPRESSO));
        turn(game, onItem(game, CELESTINA, "Desiderio Incontrollabile", CELESTINA, "Espresso della Macchinetta"),
                onItem(game, "b", "Disassemblare", CELESTINA, "Espresso della Macchinetta"));
        assertEquals(25, res(game, CELESTINA, TOXICITY));
        assertEquals(35, res(game, CELESTINA, ALERTNESS));
        assertTrue(items(game, CELESTINA).isEmpty());
    }

    @Test
    void fondoGainsTwoTAndDealsTwoCutEvenAgainstAlcoholArmour() {
        Game game = game(celestina(card(FONDO)), b());
        ch(game, "b").getResources().put(ALCOHOL, 12);
        assertArrayEquals(new int[]{0, 2}, turn(game, bound(game, CELESTINA, "Fondo del Posacenere", "b"), rest(game, "b")));
        assertEquals(22, res(game, CELESTINA, TOXICITY));
        assertTrue(inHand(game, CELESTINA, "Fondo del Posacenere"));
    }

    @Test
    void cappottoGainsTwoTAndReducesThreeDamageTypesAndThePeriodicPoison() {
        Game game = game(celestina(card(CAPPOTTO)), b(hit("Tre danni", 1, null, "HIT 7", "CUT 7", "POISON 7")));
        ch(game, CELESTINA).getImmunities().clear();
        assertArrayEquals(new int[]{23, 0}, turn(game, bound(game, CELESTINA, "Rintanarsi nel Cappotto", "SELF"),
                move(game, "b", "Tre danni", CELESTINA)), "5 per tipo e 8 POISON periodici");
        assertEquals(22, res(game, CELESTINA, TOXICITY));
        assertTrue(ch(game, CELESTINA).getStatuses().isEmpty());
    }

    @Test
    void tagliareLaDoseHealsTheRoundedQuarterBeforeLosingTheRoundedHalf() {
        Game game = game(celestina(card(DOSE)), b());
        ch(game, CELESTINA).getResources().put(HEALTH, 40);
        ch(game, CELESTINA).getResources().put(TOXICITY, 15);
        assertArrayEquals(new int[]{-3, 0}, turn(game, bound(game, CELESTINA, "Tagliare la Dose", "SELF"), rest(game, "b")));
        assertEquals(43, health(game, CELESTINA));
        assertEquals(8, res(game, CELESTINA, TOXICITY));
    }

    @Test
    void ultimoTiroDealsSelfHitOpponentPoisonAndTAndIncreasesTheNextPlay() {
        Card lastResort = card(ULTIMO);
        Player actor = player(draft.character(CELESTINA), List.of(), List.of(), lastResort);
        Game game = game(actor, b());

        assertTrue(lastResort.isLastResort());
        assertArrayEquals(new int[]{2, 10}, turn(game, move(game, CELESTINA, "L'Ultimo Tiro", "b"), rest(game, "b")),
                "8 POISON subito e 2 a fine turno");
        assertEquals(4, res(game, "b", TOXICITY));
        assertArrayEquals(new int[]{2, 17}, turn(game, move(game, CELESTINA, "L'Ultimo Tiro", "b"), rest(game, "b")),
                "13 POISON alla seconda giocata e 4 a fine turno");
        assertEquals(8, res(game, "b", TOXICITY));
    }

    @Test
    void ultimoTiroIncreasesAfterACanceledPlay() {
        Player actor = player(draft.character(CELESTINA), List.of(), List.of(), card(ULTIMO));
        Player opponent = b(card(THATS_ENOUGH));
        opponent.getCharacter().getResources().put(VIOLENCE, 5);
        Game game = game(actor, opponent);

        assertArrayEquals(new int[]{0, 0}, turn(game, move(game, CELESTINA, "L'Ultimo Tiro", "b"),
                move(game, "b", "FAI BASTA", CELESTINA)));
        assertTrue(voided(game, CELESTINA));
        assertEquals(0, res(game, "b", TOXICITY));
        assertArrayEquals(new int[]{2, 15}, turn(game, move(game, CELESTINA, "L'Ultimo Tiro", "b"), rest(game, "b")));
    }

    @Test
    void tossiconePaysTenTDealsTwentyPoisonAndAddsFiveTDespiteImmunity() {
        Card action = card(TOSSICONE);
        Player immune = player(character("b", 10, 3, TOXICITY), List.of(), fillers(10), null);
        Game game = game(celestina(action), immune);
        assertArrayEquals(new int[]{0, 20}, turn(game, move(game, CELESTINA, "Tossicone Scatarrante", "b"), rest(game, "b")));
        assertEquals(Map.of(TOXICITY, 10), action.getCost());
        assertEquals(10, res(game, CELESTINA, TOXICITY));
        assertEquals(5, res(game, "b", TOXICITY));
    }

    @Test
    void metabolismoHealsHalfTheTReadAfterAnEarlierMoveThenLosesItAll() {
        Card earlier = data("Regalo precoce",
                "{'binding':'t.TPrima','kind':'ACTION','priority':2,'targets':['OPPONENT'],"
                        + "'target':[{'op':'gain','resource':'TOXICITY','amount':4}]}");
        Game game = game(celestina(card(CORRUPTED_METABOLISM)), b(earlier));
        ch(game, CELESTINA).getResources().put(HEALTH, 40);
        ch(game, CELESTINA).getResources().put(TOXICITY, 11);

        assertArrayEquals(new int[]{-7, 0}, turn(game, move(game, CELESTINA, "Metabolismo Corrotto", "SELF"),
                move(game, "b", "Regalo precoce", CELESTINA)));
        assertEquals(47, health(game, CELESTINA));
        assertEquals(0, res(game, CELESTINA, TOXICITY));
    }

    @Test
    void fareInventarioFindsTossiconeAndUsesTheSmallerRewardWhenNeitherNameIsAvailable() {
        assertAnnouncement(TAKE_INVENTORY, "Fare l'Inventario", TOSSICONE, TUNNEL, 30, 40);
    }

    @Test
    void unAssagginoFindsTunnelAndUsesTheSmallerRewardWhenNeitherNameIsAvailable() {
        assertAnnouncement(JUST_A_TASTE, "Un Assaggino", TUNNEL, TOSSICONE, 40, 35);
    }

    private static void assertAnnouncement(String binding, String name, String first, String second, int foundT, int foundA) {
        Card found = card(first);
        Player actor = player(draft.character(CELESTINA), List.of(card(binding)), List.of(card(second), found), null);
        Game game = game(actor, b());
        turn(game, move(game, CELESTINA, name, "SELF"), rest(game, "b"));
        assertEquals(foundT, res(game, CELESTINA, TOXICITY));
        assertEquals(foundA, res(game, CELESTINA, ALERTNESS));
        assertEquals(3, tokens(game, CELESTINA).size());
        assertSame(found, actor.getShownRevealed().get(0).getCard());

        Card normal = hit("Pesca normale", 0, null, "HIT 1");
        Player miss = player(draft.character(CELESTINA), List.of(card(binding)), List.of(normal), null);
        Game missed = game(miss, b());
        turn(missed, move(missed, CELESTINA, name, "SELF"), rest(missed, "b"));
        assertEquals(25, res(missed, CELESTINA, TOXICITY));
        assertEquals(35, res(missed, CELESTINA, ALERTNESS));
        assertTrue(miss.holds(normal));
        assertTrue(tokens(missed, CELESTINA).isEmpty());
        assertTrue(miss.getShownRevealed().isEmpty());
    }
}
