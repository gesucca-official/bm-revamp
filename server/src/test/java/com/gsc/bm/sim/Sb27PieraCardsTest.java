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

/** Attesi dalle schede di Piera Pinot del Set Base 1.0 candidato. */
class Sb27PieraCardsTest {
    private static final String PIERA = SetBaseIds.PIERA;
    private static final String GOCCIA = TO_THE_LAST_DROP;
    private static final String WATER = FLAT_MINERAL_WATER;
    private static final String ALLA_GOCCIA = DOWN_IN_ONE;
    private static final String RUTTO = POINT_BLANK_BURP;
    private static Draft draft;

    @BeforeAll
    static void loadDraft() throws Exception {
        load();
        draft = Draft.fromClasspath("/set-base/bozza.json");
    }

    private static Player piera(Card... hand) {
        return player(draft.character(PIERA), List.of(hand), fillers(10), null);
    }

    @Test
    void finoAllUltimaGocciaAddsFifteenLBeforeConsumingWaterThatEmptiesIt() {
        Game beerGame = game(piera(card(GOCCIA)), b());
        ch(beerGame, PIERA).getItems().add(card(WARM_BLONDE_66));
        turn(beerGame, onItem(beerGame, PIERA, "Fino all'Ultima Goccia", PIERA, "Bionda da 66, Calda"), rest(beerGame, "b"));
        assertEquals(19, res(beerGame, PIERA, ALCOHOL), "15 + 15 + 10 L prima di R06");
        assertTrue(inHand(beerGame, PIERA, "Fino all'Ultima Goccia"));

        Game waterGame = game(piera(card(GOCCIA)), b());
        ch(waterGame, PIERA).getItems().add(card(WATER));
        turn(waterGame, onItem(waterGame, PIERA, "Fino all'Ultima Goccia", PIERA, "Acqua Minerale Sgasata"), rest(waterGame, "b"));
        assertEquals(0, res(waterGame, PIERA, ALCOHOL), "l'acqua azzera anche la L appena guadagnata");
        assertEquals(35, res(waterGame, PIERA, ALERTNESS));
        assertTrue(items(waterGame, PIERA).isEmpty());
    }

    @Test
    void finoAllUltimaGocciaStillAddsFifteenLWhenTheItemHasDisappeared() {
        Player opponent = b(card(DISASSEMBLE));
        opponent.getCharacter().getResources().put(VIOLENCE, 5);
        Game game = game(piera(card(GOCCIA)), opponent);
        ch(game, PIERA).getItems().add(card(WATER));
        turn(game, onItem(game, PIERA, "Fino all'Ultima Goccia", PIERA, "Acqua Minerale Sgasata"),
                onItem(game, "b", "Disassemblare", PIERA, "Acqua Minerale Sgasata"));
        assertEquals(14, res(game, PIERA, ALCOHOL));
        assertEquals(0, res(game, PIERA, ALERTNESS));
        assertTrue(items(game, PIERA).isEmpty());
    }

    @Test
    void postoFissoAddsFiveLAndReducesAllDamageAndThePeriodicPoison() {
        Game game = game(piera(card(REGULAR_SPOT)), b(hit("Tre danni", 1, null, "HIT 9", "CUT 9", "POISON 9")));
        ch(game, PIERA).getResources().put(TOXICITY, 6);
        assertArrayEquals(new int[]{15, 0}, turn(game, bound(game, PIERA, "Posto Fisso", "SELF"), move(game, "b", "Tre danni", PIERA)),
                "1 HIT dopo corazza, 6 CUT, 6 POISON e 2 POISON periodici");
        assertEquals(9, res(game, PIERA, ALCOHOL));
        assertEquals(5, res(game, PIERA, ALERTNESS));
        assertTrue(ch(game, PIERA).getStatuses().isEmpty());
    }

    @Test
    void seltzLosesARoundedQuarterOfTAndDealsTwoHitSubjectToAlcoholArmour() {
        Game game = game(piera(card(VIOLENT_SELTZER_SPRAY)), b());
        ch(game, PIERA).getResources().put(TOXICITY, 5);
        ch(game, "b").getResources().put(ALCOHOL, 4);
        assertArrayEquals(new int[]{2, 1}, turn(game, bound(game, PIERA, "Violenta Spruzzata di Seltz", "b"), rest(game, "b")));
        assertEquals(4, res(game, PIERA, TOXICITY));
        assertTrue(inHand(game, PIERA, "Violenta Spruzzata di Seltz"));
    }

    @Test
    void schiarirsiGainsHalfTheCurrentLInABeforeLosingTheSameRoundedHalf() {
        Game game = game(piera(card(CLEAR_THE_HEAD)), b());
        turn(game, bound(game, PIERA, "Schiarirsi le Idee", "SELF"), rest(game, "b"));
        assertEquals(18, res(game, PIERA, ALERTNESS), "15 + 7, poi -4 a fine turno");
        assertEquals(3, res(game, PIERA, ALCOHOL), "15 - 7, poi -5 a fine turno");
    }

    @Test
    void scompensoPaysFiveLBeforeTheFiveSelfHitAndThirtyFiveOpponentHit() {
        Card action = card(LAST_ROUND_CRASH);
        Game game = game(piera(action), b());
        ch(game, PIERA).getResources().put(ALCOHOL, 20);
        assertArrayEquals(new int[]{2, 35}, turn(game, move(game, PIERA, "Scompenso da Ultimo Giro", "b"), rest(game, "b")),
                "dopo il costo, 15 L assorbono solo 3 dei 5 HIT a sé");
        assertEquals(Map.of(ALCOHOL, 5), action.getCost());
        assertEquals(7, res(game, PIERA, ALCOHOL));
        assertEquals(8, res(game, PIERA, ALERTNESS));
    }

    @Test
    void avampostoAddsFiveLReducesHitToThreeQuartersAndHalvesPoisonButLeavesCut() {
        Game game = game(piera(card(FORTIFIED_BAR_OUTPOST)), b(hit("Tre danni", 1, null, "HIT 9", "CUT 9", "POISON 9")));
        ch(game, PIERA).getResources().put(TOXICITY, 6);
        assertArrayEquals(new int[]{15, 0}, turn(game, move(game, PIERA, "Avamposto Fortificato al Bancone", "SELF"),
                move(game, "b", "Tre danni", PIERA)), "1 HIT dopo corazza, 9 CUT, 4 POISON e 1 POISON periodico");
        assertEquals(9, res(game, PIERA, ALCOHOL));
        assertTrue(ch(game, PIERA).getStatuses().isEmpty());
    }

    @Test
    void unAltroEArrivoAnnouncesAllaGocciaByDefaultWithFullOrFallbackGains() {
        assertAnnouncement(ONE_MORE_AND_IM_COMING, "Un Altro e Arrivo", ALLA_GOCCIA, RUTTO);
    }

    @Test
    void unAltroGrappinoAnnouncesRuttoByDefaultWithFullOrFallbackGains() {
        assertAnnouncement(ANOTHER_LITTLE_GRAPPA, "Un Altro... Grappino...", RUTTO, ALLA_GOCCIA);
    }

    private static void assertAnnouncement(String binding, String name, String first, String second) {
        Card found = card(first);
        Player actor = player(draft.character(PIERA), List.of(card(binding)), List.of(card(second), found), null);
        Game game = game(actor, b());
        turn(game, move(game, PIERA, name, "SELF"), rest(game, "b"));
        assertEquals(14, res(game, PIERA, ALCOHOL), "15 + 15 L prima del decadimento");
        assertEquals(35, res(game, PIERA, ALERTNESS), "15 + 35 A, poi -15 per 30 L");
        assertEquals(3, tokens(game, PIERA).size());
        assertSame(found, actor.getShownRevealed().get(0).getCard());

        Card normal = hit("Pesca normale", 0, null, "HIT 1");
        Player noMatch = player(draft.character(PIERA), List.of(card(binding)), List.of(normal), null);
        Game missed = game(noMatch, b());
        turn(missed, move(missed, PIERA, name, "SELF"), rest(missed, "b"));
        assertEquals(9, res(missed, PIERA, ALCOHOL), "15 + 5 L prima del decadimento");
        assertEquals(15, res(missed, PIERA, ALERTNESS), "15 + 10 A, poi -10 per 20 L");
        assertTrue(noMatch.holds(normal));
        assertTrue(tokens(missed, PIERA).isEmpty());
        assertTrue(noMatch.getShownRevealed().isEmpty());
    }
}
