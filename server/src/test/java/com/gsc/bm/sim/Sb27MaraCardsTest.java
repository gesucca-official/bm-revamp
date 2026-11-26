package com.gsc.bm.sim;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.base.beppe.Disassemble;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.cards.base.SetBaseIds;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static com.gsc.bm.model.Resource.*;
import static com.gsc.bm.model.cards.Card.CardTarget.*;
import static com.gsc.bm.sim.Sb27Table.*;
import static org.junit.jupiter.api.Assertions.*;
import static com.gsc.bm.model.cards.base.SetBaseIds.*;

/** Schede MAR del Set Base 1.0 candidato, con attesi scritti dal testo completo. */
class Sb27MaraCardsTest {
    private static final String MARA = SetBaseIds.MARA;
    private static final String REQUISIRE = REQUISITION_ON_THE_FLY;
    private static final String SVENTARE = FOIL_THE_ASSASSINATION;
    private static final String SEMAFORO = RED_LIGHT;
    private static final String TAGLIARE = CUT_OFF;
    private static final String LAZO = RIDERS_LASSO;
    private static final String SGOMMATA = BURNOUT;
    private static final String AGILITA = UNNATURAL_AGILITY;
    private static final String UNTA = GREASY_AND_GRIMY;
    private static final String ESPRESSO = VENDING_MACHINE_ESPRESSO;
    private static Draft draft;

    @BeforeAll
    static void loadDraft() throws Exception {
        load();
        draft = Draft.fromClasspath("/set-base/bozza.json");
    }

    private static final class EarlyRemoval extends Disassemble {
        EarlyRemoval() {
            setPriority(3);
            setGuiName("Rimozione di prova");
        }
    }

    private static Player mara(int alertness, Card... hand) {
        Character character = draft.character(MARA);
        character.getResources().put(ALERTNESS, alertness);
        return player(character, List.of(hand), fillers(10), null);
    }

    @Test
    void requisireLosesAlertnessBeforeConsumingTheChosenItem() {
        Card action = card(REQUISIRE);
        Game game = game(mara(3, action), b());
        ch(game, MARA).getItems().addAll(List.of(card(WARM_BLONDE_66), card(ESPRESSO)));
        turn(game, onItem(game, MARA, "Requisire al Volo", MARA, "Espresso della Macchinetta"), rest(game, "b"));

        assertTrue(action.isBasicAction());
        assertEquals(Set.of(NEAR_ITEM), action.getCanTarget());
        assertEquals(Map.of(), action.getCost());
        assertEquals(2, action.getPriority());
        assertEquals(15, res(game, MARA, ALERTNESS), "3 A scendono a 0, poi l'espresso dà 15 A");
        assertEquals(List.of("Bionda da 66, Calda"), items(game, MARA));
        assertTrue(inHand(game, MARA, "Requisire al Volo"));
    }

    @Test
    void requisireStillLosesFiveWhenTheChosenItemWasDestroyed() {
        Card earlyRemoval = new EarlyRemoval();
        Player opponent = b(earlyRemoval);
        opponent.getCharacter().getResources().put(VIOLENCE, 10);
        Game game = game(mara(45, card(REQUISIRE)), opponent);
        ch(game, MARA).getItems().add(card(ESPRESSO));
        turn(game, onItem(game, MARA, "Requisire al Volo", MARA, "Espresso della Macchinetta"),
                onItem(game, "b", earlyRemoval.getName(), MARA, "Espresso della Macchinetta"));

        assertEquals(40, res(game, MARA, ALERTNESS));
        assertTrue(items(game, MARA).isEmpty());
    }

    @Test
    void sventareRoundsDownBothQuartersAndDealsTwoCutThroughAlcoholArmour() {
        Card action = card(SVENTARE);
        Game game = game(mara(45, action), b());
        ch(game, MARA).getResources().put(TOXICITY, 15);
        ch(game, MARA).getResources().put(ALCOHOL, 15);
        ch(game, "b").getResources().put(ALCOHOL, 20);
        assertArrayEquals(new int[]{6, 2}, turn(game, bound(game, MARA, "Sventare l'Assassinio", "b"), rest(game, "b")));
        assertEquals(1, action.getPriority());
        assertEquals(Set.of(OPPONENT), action.getCanTarget());
        assertEquals(Map.of(), action.getCost());
        assertEquals(12, res(game, MARA, TOXICITY));
        assertEquals(5, res(game, MARA, ALCOHOL));
        assertTrue(inHand(game, MARA, "Sventare l'Assassinio"));
    }

    @Test
    void semaforoGainsFiveAndReducesAllThreeDamageTypesThroughEndOfTurn() {
        Card action = card(SEMAFORO);
        Game game = game(mara(45, action), b(hit("Tre danni", 1, null, "HIT 7", "CUT 7", "POISON 7")));
        ch(game, MARA).getResources().put(TOXICITY, 10);
        assertArrayEquals(new int[]{18, 0}, turn(game, bound(game, MARA, "Semaforo Rosso", "SELF"),
                move(game, "b", "Tre danni", MARA)), "5 per tipo e 3 dal veleno periodico");
        assertEquals(2, action.getPriority());
        assertEquals(Set.of(SELF), action.getCanTarget());
        assertEquals(50, res(game, MARA, ALERTNESS));
        assertTrue(ch(game, MARA).getStatuses().isEmpty());
    }

    @Test
    void semaforoAffectsOnlyLaterDamageAndStacksInAcquisitionOrder() {
        Game game = game(mara(45, card(SEMAFORO)), b(hit("Tardi", 1, null, "HIT 7")),
                c(hit("Presto", 2, null, "HIT 7")));
        apply(status("Corazza di prova", 0.5, false), ch(game, MARA));
        assertArrayEquals(new int[]{5, 0, 0}, turn(game, bound(game, MARA, "Semaforo Rosso", "SELF"),
                move(game, "b", "Tardi", MARA), move(game, "c", "Presto", MARA)), "3 prima e 2 dopo");
    }

    @Test
    void tagliareRemovesFourAlertnessOnlyFromTheLaterTarget() {
        Game game = game(mara(45, card(TAGLIARE)), b(), c());
        turn(game, bound(game, MARA, "Tagliare la Strada", "b"), rest(game, "b"), rest(game, "c"));
        assertEquals(6, res(game, "b", ALERTNESS));
        assertEquals(90, res(game, "c", ALERTNESS));
        assertTrue(inHand(game, MARA, "Tagliare la Strada"));
    }

    @Test
    void tagliareDoesNotCountEarlierInsertionInTheSameSpeedGroupAsAhead() {
        Game game = game(mara(45, card(TAGLIARE)), player("b", 45, hit("Pari", 2, null, "CUT 1")));
        turn(game, bound(game, MARA, "Tagliare la Strada", "b"), move(game, "b", "Pari", MARA));
        assertEquals(45, res(game, "b", ALERTNESS));
    }

    @Test
    void tagliareWorksEvenWhenTheLaterTargetMoveWillBeCanceled() {
        Player canceller = player("c", 40, card(THATS_ENOUGH));
        canceller.getCharacter().getResources().put(VIOLENCE, 5);
        Game game = game(mara(45, card(TAGLIARE)), player("b", 3), canceller);
        turn(game, bound(game, MARA, "Tagliare la Strada", "b"), rest(game, "b"), move(game, "c", "FAI BASTA", "b"));
        assertTrue(voided(game, "b"));
        assertEquals(0, res(game, "b", ALERTNESS));
    }

    @Test
    void lazoPaysTwentyReadsTheRemainingAlertnessAndAddsFiveCutWhenAhead() {
        Card action = card(LAZO);
        Game game = game(mara(61, action), b());
        ch(game, "b").getResources().put(ALCOHOL, 20);
        assertArrayEquals(new int[]{0, 45}, turn(game, move(game, MARA, "Lazo del Rider", "b"), rest(game, "b")),
                "20 più metà di 41, poi 5 CUT separati, senza corazza");
        assertEquals(Map.of(ALERTNESS, 20), action.getCost());
        assertEquals(41, res(game, MARA, ALERTNESS));
        assertEquals(1, action.getPriority());
    }

    @Test
    void lazoGetsNoBonusWhenTheCostMakesTheSpeedGroupsEqual() {
        Game game = game(mara(61, card(LAZO)), player("b", 41, hit("Pari", 1, null, "HIT 1")));
        assertArrayEquals(new int[]{1, 40}, turn(game, move(game, MARA, "Lazo del Rider", "b"),
                move(game, "b", "Pari", MARA)));
    }

    @Test
    void sgommataPaysFifteenDealsTwentyFiveCutAndReducesEveryKindOfOutgoingDamage() {
        Game game = game(mara(45, card(SGOMMATA)), b(hit("Tre danni", 0, null, "HIT 7", "CUT 7", "POISON 7")));
        assertArrayEquals(new int[]{15, 25}, turn(game, move(game, MARA, "Sgommata", "b"),
                move(game, "b", "Tre danni", MARA)));
        assertEquals(30, res(game, MARA, ALERTNESS));
        assertTrue(ch(game, "b").getStatuses().isEmpty(), "lo stato è scaduto");
    }

    @Test
    void sgommataReducesLaterSelfDamageAndLeavesSameGroupAttacksUnchanged() {
        Game selfDamage = game(mara(45, card(SGOMMATA)), b(card(VIOLENTIZATION)));
        assertArrayEquals(new int[]{0, 28}, turn(selfDamage, move(selfDamage, MARA, "Sgommata", "b"),
                bound(selfDamage, "b", "VIOLENZAZIONE", "SELF")), "25 CUT e 3 HIT a sé");
        Game sameGroup = game(mara(45, card(SGOMMATA)), player("b", 30, hit("Pari", 1, null, "HIT 7")));
        assertArrayEquals(new int[]{7, 25}, turn(sameGroup, move(sameGroup, MARA, "Sgommata", "b"),
                move(sameGroup, "b", "Pari", MARA)));
    }

    @Test
    void agilitaDealsFourCutAndRemovesEightAlertnessWithAConditionalSelfGain() {
        Game earlier = game(mara(45, card(AGILITA)), b());
        assertArrayEquals(new int[]{0, 4}, turn(earlier, move(earlier, MARA, "Agilità Innaturale", "b"), rest(earlier, "b")));
        assertEquals(49, res(earlier, MARA, ALERTNESS));
        assertEquals(2, res(earlier, "b", ALERTNESS));

        Game later = game(mara(2, card(AGILITA)), player("b", 3, hit("Presto", 2, null, "HIT 1")));
        assertArrayEquals(new int[]{1, 4}, turn(later, move(later, MARA, "Agilità Innaturale", "b"),
                move(later, "b", "Presto", MARA)));
        assertEquals(2, res(later, MARA, ALERTNESS));
        assertEquals(0, res(later, "b", ALERTNESS));
    }

    @Test
    void untaPaysThenReturnsFiveAlertnessAndHalvesOnlyLaterHitAndCut() {
        Card action = card(UNTA);
        Game game = game(mara(45, action), b(hit("Tre danni", 1, null, "HIT 7", "CUT 7", "POISON 7")));
        assertArrayEquals(new int[]{13, 0}, turn(game, move(game, MARA, "Unta e Bisunta", "SELF"),
                move(game, "b", "Tre danni", MARA)));
        assertEquals(Map.of(ALERTNESS, 5), action.getCost());
        assertEquals(45, res(game, MARA, ALERTNESS));
        assertTrue(ch(game, MARA).getStatuses().isEmpty());

        Game earlier = game(mara(45, card(UNTA)), player("b", 42, hit("Presto", 2, null, "HIT 7")));
        assertArrayEquals(new int[]{7, 0}, turn(earlier, move(earlier, MARA, "Unta e Bisunta", "SELF"),
                move(earlier, "b", "Presto", MARA)), "il costo fa agire Mara dopo");
    }

    @Test
    void slalomAndTraiettoriaUseTheirPrintedOrderAndGiveDifferentRewards() {
        assertAnnouncement(APPROACH_SLALOM, "Slalom d'Avvicinamento", SGOMMATA, LAZO, 60);
        assertAnnouncement(UNPREDICTABLE_TRAJECTORY, "Traiettoria Imprevedibile", LAZO, SGOMMATA, 65);
    }

    private static void assertAnnouncement(String binding, String name, String first, String second, int foundAlertness) {
        Card found = card(first);
        Player mara = player(draft.character(MARA), List.of(card(binding)), List.of(card(second), found), null);
        Game game = game(mara, b());
        turn(game, move(game, MARA, name, "SELF"), rest(game, "b"));
        assertEquals(1, mara.getShownRevealed().size());
        assertSame(found, mara.getShownRevealed().get(0).getCard());
        assertEquals(3, tokens(game, MARA).size());
        assertEquals(foundAlertness, res(game, MARA, ALERTNESS));

        Card ordinary = hit("Pesca normale", 0, null, "HIT 1");
        Player noMatch = player(draft.character(MARA), List.of(card(binding)), List.of(ordinary), null);
        Game missed = game(noMatch, b());
        turn(missed, move(missed, MARA, name, "SELF"), rest(missed, "b"));
        assertTrue(noMatch.holds(ordinary));
        assertTrue(noMatch.getShownRevealed().isEmpty());
        assertTrue(tokens(missed, MARA).isEmpty());
        assertEquals(50, res(missed, MARA, ALERTNESS));
    }
}
