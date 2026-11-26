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

/** Attesi dalle schede di Beppe Bulletta del Set Base 1.0 candidato. */
class Sb27BeppeCardsTest {
    private static final String BEPPE = SetBaseIds.BEPPE;
    private static final String BASIC = THIS_COMES_IN_HANDY;
    private static final String LIMA = SHARPEN_THE_TOOLS;
    private static final String CHIAVE = THIRTEEN_WRENCH;
    private static final String LAVORO = JOB_WELL_DONE;
    private static final String ESPRESSO = VENDING_MACHINE_ESPRESSO;
    private static Draft draft;

    @BeforeAll
    static void loadDraft() throws Exception {
        load();
        draft = Draft.fromClasspath("/set-base/bozza.json");
    }

    private static Player beppe(Card... hand) {
        return player(draft.character(BEPPE), List.of(hand), fillers(10), null);
    }

    @Test
    void questoTornaUtileGainsFourAndConsumesTheSelectedItem() {
        Game game = game(beppe(card(BASIC)), b());
        ch(game, BEPPE).getItems().addAll(List.of(card(ESPRESSO), card(WARM_BLONDE_66)));
        turn(game, onItem(game, BEPPE, "Questo Torna Utile", BEPPE, "Espresso della Macchinetta"), rest(game, "b"));
        assertEquals(29, res(game, BEPPE, VIOLENCE));
        assertEquals(40, res(game, BEPPE, ALERTNESS));
        assertEquals(List.of("Bionda da 66, Calda"), items(game, BEPPE));
        assertTrue(inHand(game, BEPPE, "Questo Torna Utile"));
    }

    @Test
    void questoTornaUtileRetainsTheGainWhenItCannotConsumeTheDestroyedItem() {
        Player opponent = b(card(DISASSEMBLE));
        opponent.getCharacter().getResources().put(VIOLENCE, 5);
        Game game = game(beppe(card(BASIC)), opponent);
        ch(game, BEPPE).getItems().add(card(ESPRESSO));
        turn(game, onItem(game, BEPPE, "Questo Torna Utile", BEPPE, "Espresso della Macchinetta"),
                onItem(game, "b", "Disassemblare", BEPPE, "Espresso della Macchinetta"));
        assertEquals(29, res(game, BEPPE, VIOLENCE));
        assertEquals(25, res(game, BEPPE, ALERTNESS));
        assertTrue(items(game, BEPPE).isEmpty());
    }

    @Test
    void cuffieGainsFiveVAndReducesAllDamageIncludingThePeriodicPoison() {
        Game game = game(beppe(card(HEADPHONES_AND_HEAD_DOWN)), b(hit("Tre danni", 1, null, "HIT 7", "CUT 7", "POISON 7")));
        ch(game, BEPPE).getResources().put(TOXICITY, 10);
        assertArrayEquals(new int[]{18, 0}, turn(game, bound(game, BEPPE, "Cuffie e Testa Bassa", "SELF"),
                move(game, "b", "Tre danni", BEPPE)));
        assertEquals(30, res(game, BEPPE, VIOLENCE));
        assertTrue(ch(game, BEPPE).getStatuses().isEmpty());
        assertTrue(inHand(game, BEPPE, "Cuffie e Testa Bassa"));
    }

    @Test
    void cacciaviteGainsTwoVAndDealsTwoHit() {
        Game game = game(beppe(card(SCREWDRIVER_HIT)), b());
        assertArrayEquals(new int[]{0, 2}, turn(game, bound(game, BEPPE, "Colpo col Cacciavite", "b"), rest(game, "b")));
        assertEquals(27, res(game, BEPPE, VIOLENCE));
        assertTrue(inHand(game, BEPPE, "Colpo col Cacciavite"));
    }

    @Test
    void affilareConvertsRoundedHitToCutThroughNextTurnAndBypassesAlcoholArmour() {
        Card attack = hit("Colpo di prova", 0, null, "HIT 7");
        Player actor = player(draft.character(BEPPE), List.of(card(LIMA), attack), List.of(attack, filler()), null);
        Player opponent = player(character("b", 10, 3, ALCOHOL), List.of(), fillers(10), null);
        opponent.getCharacter().getResources().put(ALCOHOL, 12);
        Game game = game(actor, opponent);

        turn(game, bound(game, BEPPE, "Affilare gli Utensili", "SELF"), rest(game, "b"));
        assertEquals(1, ch(game, BEPPE).getStatuses().size());
        assertEquals(5, turn(game, move(game, BEPPE, "Colpo di prova", "b"), rest(game, "b"))[1]);
        assertTrue(ch(game, BEPPE).getStatuses().isEmpty());
        assertEquals(4, turn(game, move(game, BEPPE, "Colpo di prova", "b"), rest(game, "b"))[1],
                "dopo la scadenza sono 7 HIT, meno 3 di corazza");
    }

    @Test
    void affilareConvertsSelfDamageAndOnlyLaterCutModifiersApply() {
        Card self = data("Colpo a sé",
                "{'binding':'t.ColpoASe','kind':'ACTION','targets':['SELF'],'self':[{'op':'damage','type':'HIT','amount':9}]}");
        Game game = game(beppe(card(LIMA), self), b());
        turn(game, bound(game, BEPPE, "Affilare gli Utensili", "SELF"), rest(game, "b"));
        Card laterModifiers = data("Modificatori",
                "{'binding':'t.Modificatori','kind':'ACTION','targets':['SELF'],'self':["
                        + "{'op':'status','name':'più HIT','description':'prova','statusType':'GOOD','flow':'OUTPUT','property':'HIT','factor':2,'turns':1},"
                        + "{'op':'status','name':'meno CUT','description':'prova','statusType':'BAD','flow':'OUTPUT','property':'CUT','factor':0.5,'turns':1}]}");
        apply(laterModifiers, ch(game, BEPPE));
        assertEquals(3, turn(game, move(game, BEPPE, "Colpo a sé", "SELF"), rest(game, "b"))[0],
                "9 HIT diventano 6 CUT, poi il fattore CUT li porta a 3");
    }

    @Test
    void affilareIsAnEquipmentThatPermessoRemovesBeforeTheHit() {
        Card attack = hit("Colpo di prova", 0, null, "HIT 7");
        Player remover = b(card(EXCUSE_ME_SORRY_CAN_YOU_STOP));
        remover.getCharacter().getResources().put(VIOLENCE, 5);
        Game game = game(beppe(card(LIMA), attack), remover);
        turn(game, bound(game, BEPPE, "Affilare gli Utensili", "SELF"), rest(game, "b"));
        assertArrayEquals(new int[]{8, 7}, turn(game, move(game, BEPPE, "Colpo di prova", "b"),
                move(game, "b", "PERMESSO SCUSA PUOI SMETTERLA", BEPPE)));
    }

    @Test
    void chiavePaysTenAndDealsTwentyCutThroughAlcoholArmour() {
        Card attack = card(CHIAVE);
        Game game = game(beppe(attack), b());
        ch(game, "b").getResources().put(ALCOHOL, 20);
        assertArrayEquals(new int[]{0, 20}, turn(game, move(game, BEPPE, "Chiave da Tredici", "b"), rest(game, "b")));
        assertEquals(Map.of(VIOLENCE, 10), attack.getCost());
        assertEquals(15, res(game, BEPPE, VIOLENCE));
    }

    @Test
    void secondoBagagliaioPaysFiveAndAppliesDifferentHitAndCutFactorsBeforeItsGains() {
        Game game = game(beppe(card(SECOND_TRUNK)), b(hit("Tre danni", 1, null, "HIT 7", "CUT 7", "POISON 7")));
        assertArrayEquals(new int[]{15, 0}, turn(game, move(game, BEPPE, "Secondo Bagagliaio", "SELF"),
                move(game, "b", "Tre danni", BEPPE)), "3 HIT, 5 CUT e 7 POISON");
        assertEquals(25, res(game, BEPPE, VIOLENCE));
        assertEquals(30, res(game, BEPPE, ALERTNESS));
        assertTrue(ch(game, BEPPE).getStatuses().isEmpty());
    }

    @Test
    void preparareHitsForFourAndAnnouncesChiaveWithFullOrFallbackGain() {
        assertAnnouncement(PREPARE_THE_JOB, "Preparare il Lavoro", CHIAVE, LAVORO, 40);
    }

    @Test
    void metodoEmpiricoHitsForFourAndAnnouncesLavoroWithFullOrFallbackGain() {
        assertAnnouncement(EMPIRICAL_METHOD, "Metodo Empirico", LAVORO, CHIAVE, 35);
    }

    private static void assertAnnouncement(String binding, String name, String first, String second, int foundV) {
        Card found = card(first);
        Player actor = player(draft.character(BEPPE), List.of(card(binding)), List.of(card(second), found), null);
        Game game = game(actor, b());
        assertArrayEquals(new int[]{0, 4}, turn(game, move(game, BEPPE, name, "b"), rest(game, "b")));
        assertEquals(foundV, res(game, BEPPE, VIOLENCE));
        assertSame(found, actor.getShownRevealed().get(0).getCard());
        assertEquals(3, tokens(game, BEPPE).size());

        Card normal = hit("Pesca normale", 0, null, "HIT 1");
        Player noMatch = player(draft.character(BEPPE), List.of(card(binding)), List.of(normal), null);
        Game missed = game(noMatch, b());
        assertArrayEquals(new int[]{0, 4}, turn(missed, move(missed, BEPPE, name, "b"), rest(missed, "b")));
        assertEquals(30, res(missed, BEPPE, VIOLENCE));
        assertTrue(noMatch.holds(normal));
        assertTrue(noMatch.getShownRevealed().isEmpty());
        assertTrue(tokens(missed, BEPPE).isEmpty());
    }
}
