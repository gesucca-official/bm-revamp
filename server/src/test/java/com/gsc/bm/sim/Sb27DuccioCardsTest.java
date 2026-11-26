package com.gsc.bm.sim;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.IllegalMoveException;
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

/** Attesi dalle schede di Duccio Braccio Teso del Set Base 1.0 candidato. */
class Sb27DuccioCardsTest {
    private static final String DUCCIO = SetBaseIds.DUCCIO;
    private static final String PRIMA = ITALIANS_FIRST;
    private static final String NOCCHE = SKINNED_KNUCKLES;
    private static final String CRANIATA = PATRIOTIC_HEADBUTT;
    private static final String TESTA = HARDHEAD;
    private static final String ESPRESSO = VENDING_MACHINE_ESPRESSO;
    private static Draft draft;

    @BeforeAll
    static void loadDraft() throws Exception {
        load();
        draft = Draft.fromClasspath("/set-base/bozza.json");
    }

    private static Player duccio(Card... hand) {
        return player(draft.character(DUCCIO), List.of(hand), fillers(10), null);
    }

    @Test
    void primaGliItalianiConsumesTheItemAndHealsFour() {
        Game game = game(duccio(card(PRIMA)), b());
        ch(game, DUCCIO).getItems().addAll(List.of(card(ESPRESSO), card(WARM_BLONDE_66)));
        ch(game, DUCCIO).getResources().put(HEALTH, 60);
        assertArrayEquals(new int[]{-4, 0}, turn(game, onItem(game, DUCCIO, "Prima gli Italiani", DUCCIO, "Espresso della Macchinetta"),
                rest(game, "b")));
        assertEquals(30, res(game, DUCCIO, ALERTNESS));
        assertEquals(List.of("Bionda da 66, Calda"), items(game, DUCCIO));
        assertTrue(inHand(game, DUCCIO, "Prima gli Italiani"));
    }

    @Test
    void primaGliItalianiStillHealsFourIfTheItemWasDestroyed() {
        Player opponent = b(card(DISASSEMBLE));
        opponent.getCharacter().getResources().put(VIOLENCE, 5);
        Game game = game(duccio(card(PRIMA)), opponent);
        ch(game, DUCCIO).getResources().put(HEALTH, 60);
        ch(game, DUCCIO).getItems().add(card(ESPRESSO));
        assertArrayEquals(new int[]{-4, 0}, turn(game, onItem(game, DUCCIO, "Prima gli Italiani", DUCCIO, "Espresso della Macchinetta"),
                onItem(game, "b", "Disassemblare", DUCCIO, "Espresso della Macchinetta")));
        assertEquals(15, res(game, DUCCIO, ALERTNESS));
        assertTrue(items(game, DUCCIO).isEmpty());
    }

    @Test
    void rinfrescataRoundsDownBothQuartersThenDealsTwoHit() {
        Game game = game(duccio(card(ARROGANT_REFRESH)), b());
        ch(game, DUCCIO).getResources().put(TOXICITY, 15);
        ch(game, DUCCIO).getResources().put(ALCOHOL, 15);
        assertArrayEquals(new int[]{6, 2}, turn(game, bound(game, DUCCIO, "Rinfrescata Arrogante", "b"), rest(game, "b")));
        assertEquals(12, res(game, DUCCIO, TOXICITY));
        assertEquals(5, res(game, DUCCIO, ALCOHOL));
    }

    @Test
    void disonoreGainsEightAAndReducesTheThreeDamageTypesThroughEndOfTurn() {
        Game game = game(duccio(card(DISHONOUR_TO_THE_FLAG)), b(hit("Tre danni", 1, null, "HIT 7", "CUT 7", "POISON 7")));
        ch(game, DUCCIO).getResources().put(TOXICITY, 10);
        assertArrayEquals(new int[]{18, 0}, turn(game, bound(game, DUCCIO, "(Dis)onore alla Bandiera", "SELF"),
                move(game, "b", "Tre danni", DUCCIO)));
        assertEquals(23, res(game, DUCCIO, ALERTNESS));
        assertTrue(ch(game, DUCCIO).getStatuses().isEmpty());
    }

    @Test
    void nonMiHaiFattoNienteIncreasesBothHitsOnItsSecondPlay() {
        Card action = card(YOU_DID_NOTHING_TO_ME);
        Game game = game(player(draft.character(DUCCIO), List.of(), List.of(), action), b());
        assertTrue(action.isLastResort());
        assertArrayEquals(new int[]{6, 10}, turn(game, move(game, DUCCIO, "Non Mi Hai Fatto Niente", "b"), rest(game, "b")));
        assertArrayEquals(new int[]{8, 15}, turn(game, move(game, DUCCIO, "Non Mi Hai Fatto Niente", "b"), rest(game, "b")));
    }

    @Test
    void nocchePaysFifteenHealthBeforeItsTwentyHit() {
        assertHealthAttack(NOCCHE, "Nocche Sbucciate", 15, 20);
    }

    @Test
    void craniataPaysThirtyHealthBeforeItsTwentyFiveHit() {
        assertHealthAttack(CRANIATA, "Craniata Patriottica", 30, 25);
    }

    @Test
    void testaDuraPaysThirtyFiveHealthBeforeItsThirtyHit() {
        assertHealthAttack(TESTA, "Testa Dura", 35, 30);
    }

    private static void assertHealthAttack(String binding, String name, int cost, int damage) {
        Card action = card(binding);
        Game insufficient = game(duccio(action), b());
        ch(insufficient, DUCCIO).getResources().put(HEALTH, cost);
        assertEquals(Map.of(HEALTH, cost), action.getCost());
        assertFalse(action.isLastBlow());
        assertThrows(IllegalMoveException.class, () -> insufficient.submitMove(move(insufficient, DUCCIO, name, "b")));

        Game accepted = game(duccio(card(binding)), b());
        ch(accepted, DUCCIO).getResources().put(HEALTH, cost + 1);
        assertArrayEquals(new int[]{cost, damage}, turn(accepted, move(accepted, DUCCIO, name, "b"), rest(accepted, "b")));
        assertEquals(1, health(accepted, DUCCIO));
    }

    @Test
    void stoicoHealsFourAndHalvesOnlyHitForTheRestOfTheTurn() {
        Game game = game(duccio(card(STOIC_AS_A_BRONZE_BUST)), b(hit("Tre danni", 1, null, "HIT 7", "CUT 7", "POISON 7")));
        ch(game, DUCCIO).getResources().put(HEALTH, 70);
        assertArrayEquals(new int[]{13, 0}, turn(game, move(game, DUCCIO, "Stoico come un Busto di Bronzo", "SELF"),
                move(game, "b", "Tre danni", DUCCIO)), "3 HIT, 7 CUT e 7 POISON meno la cura di 4");
        assertTrue(ch(game, DUCCIO).getStatuses().isEmpty());
    }

    @Test
    void eAlloraPaysTenHealthHalvesIncomingHitAndDealsEightHit() {
        Game game = game(duccio(card(SO_WHAT)), b(hit("Tre danni", 1, null, "HIT 7", "CUT 7", "POISON 7")));
        assertArrayEquals(new int[]{27, 8}, turn(game, move(game, DUCCIO, "E Allora...?", "b"), move(game, "b", "Tre danni", DUCCIO)));
        assertTrue(ch(game, DUCCIO).getStatuses().isEmpty());
    }

    @Test
    void laStoriaDealsFourAndAnnouncesCraniataOrDrawsNormallyWithDifferentHealing() {
        String story = HISTORY_IS_WRITTEN_BY_THE_VICTORS;
        String name = "La Storia la Scrivono i Vincitori";
        Card found = card(CRANIATA);
        Player actor = player(draft.character(DUCCIO), List.of(card(story)), List.of(card(TESTA), found), null);
        Game game = game(actor, b());
        assertArrayEquals(new int[]{-6, 4}, turn(game, move(game, DUCCIO, name, "b"), rest(game, "b")));
        assertSame(found, actor.getShownRevealed().get(0).getCard());
        assertEquals(3, tokens(game, DUCCIO).size());

        Card normal = hit("Pesca normale", 0, null, "HIT 1");
        Player noMatch = player(draft.character(DUCCIO), List.of(card(story)), List.of(normal), null);
        Game missed = game(noMatch, b());
        assertArrayEquals(new int[]{-2, 4}, turn(missed, move(missed, DUCCIO, name, "b"), rest(missed, "b")));
        assertTrue(noMatch.holds(normal));
        assertTrue(tokens(missed, DUCCIO).isEmpty());
    }
}
