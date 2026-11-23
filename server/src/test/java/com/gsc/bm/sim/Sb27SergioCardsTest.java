package com.gsc.bm.sim;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.List;

import static com.gsc.bm.model.Resource.*;
import static com.gsc.bm.sim.Sb27Table.*;
import static org.junit.jupiter.api.Assertions.*;

/** Attesi dalle schede di Sergio Sommerso del Set Base 1.0 candidato. */
class Sb27SergioCardsTest {
    private static final String SERGIO = "base.character.Cesira";
    private static final String MESSO = "base.cesira.LoMettoInConto";
    private static final String ESPRESSO = "base.items.EspressoDelDistributore";
    private static final String CONTO = "base.cesira.ContoSalato";
    private static final String SEGRETO = "base.cesira.LoSannoTutti";
    private static final String FIUTO = "base.cesira.LoRivendo";
    private static Draft draft;

    @BeforeAll
    static void loadDraft() throws Exception {
        load();
        draft = Draft.fromClasspath("/set-base/bozza.json");
    }

    private static Player sergio(Card... hand) {
        return player(draft.character(SERGIO), List.of(hand), fillers(10), null);
    }

    @Test
    void messoInContoGainsEightAndConsumesTheChosenItem() {
        Game game = game(sergio(card(MESSO)), b());
        ch(game, SERGIO).getItems().addAll(List.of(card(ESPRESSO), card("com.items.RottenBeer")));
        turn(game, onItem(game, SERGIO, "Messo in Conto", SERGIO, "Espresso della Macchinetta"), rest(game, "b"));
        assertEquals(58, res(game, SERGIO, ALERTNESS));
        assertEquals(List.of("Bionda da 66, Calda"), items(game, SERGIO));
        assertTrue(inHand(game, SERGIO, "Messo in Conto"));
    }

    @Test
    void messoInContoRetainsTheGainWhenTheObjectHasDisappeared() {
        Player destroyer = player("b", 90, card("bruiser.BreakYourToy"));
        destroyer.getCharacter().getResources().put(VIOLENCE, 5);
        Game game = game(sergio(card(MESSO)), destroyer);
        ch(game, SERGIO).getItems().add(card(ESPRESSO));
        turn(game, onItem(game, SERGIO, "Messo in Conto", SERGIO, "Espresso della Macchinetta"),
                onItem(game, "b", "Disassemblare", SERGIO, "Espresso della Macchinetta"));
        assertEquals(43, res(game, SERGIO, ALERTNESS));
        assertTrue(items(game, SERGIO).isEmpty());
    }

    @Test
    void tecnicaManipolatoriaLosesRoundedQuartersOfTAndLThenDealsTwoHit() {
        Game game = game(sergio(card("base.cesira.bound.Battutina")), b());
        ch(game, SERGIO).getResources().put(TOXICITY, 15);
        ch(game, SERGIO).getResources().put(ALCOHOL, 15);
        assertArrayEquals(new int[]{6, 2}, turn(game, bound(game, SERGIO, "Tecnica Manipolatoria", "b"), rest(game, "b")));
        assertEquals(12, res(game, SERGIO, TOXICITY));
        assertEquals(5, res(game, SERGIO, ALCOHOL));
        assertTrue(inHand(game, SERGIO, "Tecnica Manipolatoria"));
    }

    @Test
    void fareIlVagoProtectsAgainstThreeDamageTypesIncludingTheEndOfTurn() {
        Game game = game(sergio(card("base.cesira.bound.FareIlVago")), b(hit("Tre danni", 1, null, "HIT 7", "CUT 7", "POISON 7")));
        ch(game, SERGIO).getResources().put(TOXICITY, 10);
        assertArrayEquals(new int[]{18, 0}, turn(game, bound(game, SERGIO, "Fare il Vago", "SELF"),
                move(game, "b", "Tre danni", SERGIO)));
        assertTrue(ch(game, SERGIO).getStatuses().isEmpty());
    }

    @Test
    void opportunaDistrazionePaysFiveLowersOpponentAAndHitsInBothSearchOutcomes() {
        Card secret = card(SEGRETO);
        Player actor = player(draft.character(SERGIO), List.of(card("base.cesira.OhGuardaLa")), List.of(card(CONTO), secret), null);
        Game found = game(actor, player("b", 20));
        assertArrayEquals(new int[]{0, 4}, turn(found, move(found, SERGIO, "Opportuna Distrazione", "b"), rest(found, "b")));
        assertEquals(10, res(found, "b", ALERTNESS));
        assertEquals(45, res(found, SERGIO, ALERTNESS));
        assertSame(secret, actor.getShownRevealed().get(0).getCard());
        assertEquals(3, tokens(found, SERGIO).size());

        Game missed = game(sergio(card("base.cesira.OhGuardaLa")), player("b", 2));
        assertArrayEquals(new int[]{0, 4}, turn(missed, move(missed, SERGIO, "Opportuna Distrazione", "b"), rest(missed, "b")));
        assertEquals(0, res(missed, "b", ALERTNESS));
        assertEquals(35, res(missed, SERGIO, ALERTNESS));
        assertTrue(tokens(missed, SERGIO).isEmpty());
    }

    @Test
    void contoSalatoPaysFiveAndDealsEightWithoutVulnerability() {
        Game game = game(sergio(card(CONTO)), b());
        assertArrayEquals(new int[]{0, 8}, turn(game, move(game, SERGIO, "Conto Salato", "b"), rest(game, "b")));
        assertEquals(30, res(game, SERGIO, ALERTNESS));
    }

    @Test
    void contoSalatoAddsSixWhileTheTargetPlaysTheAnnouncedName() {
        Player opponent = player(character("b", 10, 3), List.of(card("bruiser.Glare")),
                List.of(card("bruiser.SuperImpact"), filler()), null);
        Game game = game(sergio(card(CONTO)), opponent);
        turn(game, rest(game, SERGIO), move(game, "b", "PAZIENZA: FINITA", "SELF"));
        assertEquals(3, tokens(game, "b").size());
        assertArrayEquals(new int[]{35, 21}, turn(game, move(game, SERGIO, "Conto Salato", "b"),
                move(game, "b", "GARGANTUESCO IMPATTO SUL TU", SERGIO)), "12 HIT più 9 HIT sul bersaglio Vulnerabile");
        assertTrue(tokens(game, "b").isEmpty());
    }

    @Test
    void segretoPaysFifteenAndDealsTwentyFiveHitWithAlcoholArmourAfterwards() {
        Game game = game(sergio(card(SEGRETO)), b());
        ch(game, "b").getResources().put(ALCOHOL, 12);
        assertArrayEquals(new int[]{0, 22}, turn(game, move(game, SERGIO, "Segreto di Pulcinella", "b"), rest(game, "b")));
        assertEquals(20, res(game, SERGIO, ALERTNESS));
    }

    @Test
    void scherzoPaysTenAndUsesTheRoundedHalfOfTheRemainingAForBothEffects() {
        Game game = game(sergio(card("base.cesira.Malelingue")), b());
        assertArrayEquals(new int[]{0, 17}, turn(game, move(game, SERGIO, "Scherzo Oltre il Limite", "b"), rest(game, "b")));
        assertEquals(25, res(game, SERGIO, ALERTNESS));
        assertEquals(0, res(game, "b", ALERTNESS));
    }

    @Test
    void fiutoRemovesTheObjectWithoutItsConsumptionOrInPlayEffectAndHealsEight() {
        Game game = game(sergio(card(FIUTO)), b());
        ch(game, SERGIO).getItems().add(card("base.items.ContoDelTavoloSei"));
        ch(game, SERGIO).getResources().put(HEALTH, 50);
        assertArrayEquals(new int[]{-8, 0}, turn(game, onItem(game, SERGIO, "Fiuto per gli Affari", SERGIO, "Conto del Tavolo Sei"),
                rest(game, "b")));
        assertTrue(items(game, SERGIO).isEmpty());
        assertEquals(35, res(game, SERGIO, ALERTNESS), "nessuna perdita In campo");
        assertEquals(10, res(game, SERGIO, VIOLENCE), "nessun premio del consumo");
    }

    @Test
    void fiutoDoesNotHealWhenTheChosenItemIsGone() {
        Player destroyer = player("b", 90, card("bruiser.BreakYourToy"));
        destroyer.getCharacter().getResources().put(VIOLENCE, 5);
        Game game = game(sergio(card(FIUTO)), destroyer);
        ch(game, SERGIO).getItems().add(card(ESPRESSO));
        ch(game, SERGIO).getResources().put(HEALTH, 50);
        turn(game, onItem(game, SERGIO, "Fiuto per gli Affari", SERGIO, "Espresso della Macchinetta"),
                onItem(game, "b", "Disassemblare", SERGIO, "Espresso della Macchinetta"));
        assertEquals(50, health(game, SERGIO));
        assertTrue(items(game, SERGIO).isEmpty());
    }
}
