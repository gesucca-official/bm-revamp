package com.gsc.bm.sim;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static com.gsc.bm.model.Resource.*;
import static com.gsc.bm.model.cards.Card.CardTarget.*;
import static com.gsc.bm.sim.Sb27Table.*;
import static org.junit.jupiter.api.Assertions.*;

/** Attesi dalle schede SPA del documento del Set Base 1.0 candidato, con regole d50. */
class Sb27SpazienzioCardsTest {
    @BeforeAll
    static void loadDraft() throws Exception { load(); }

    private static final String GRAB = "com.basic.BruiserGrab";
    private static final String RAGE = "bruiser.character.LittleRage";
    private static final String SMACK = "bruiser.character.LittleSmack";
    private static final String HEAD = "base.spazienzio.bound.TestaAlMuro";
    private static final String IMPACT = "bruiser.SuperImpact";
    private static final String OHIO = "bruiser.ExtremelyViolentBlow";
    private static final String STONE = "bruiser.MadeOfStone";
    private static final String BEER = "com.items.RottenBeer";
    private static final String COCKTAIL = "com.items.CocktailOnTheGround";

    @Test
    void adoperiamotiConsumesOnlyTheChosenItemAndStaysInHand() {
        Card grab = card(GRAB);
        Game game = game(s(grab), b());
        ch(game, "s").getItems().addAll(List.of(card(COCKTAIL), card(BEER)));
        turn(game, onItem(game, "s", "ADOPERIAMOTI", "s", "Bionda da 66, Calda"), rest(game, "b"));
        assertAll(
                () -> assertTrue(grab.isBasicAction()),
                () -> assertEquals(-1, grab.getPriority()),
                () -> assertEquals(Map.of(), grab.getCost()),
                () -> assertEquals(Set.of(NEAR_ITEM), grab.getCanTarget()),
                () -> assertEquals(List.of("Negroni Trovato per Terra"), items(game, "s")),
                () -> assertEquals(4, res(game, "s", ALCOHOL), "10 L prima di R06, poi ne perde 6"),
                () -> assertEquals(0, res(game, "s", VIOLENCE)),
                () -> assertTrue(inHand(game, "s", "ADOPERIAMOTI")));
    }

    @Test
    void adoperiamotiDoesNotConsumeAnItemTakenBeforeItResolves() {
        Card steal = card("com.Steal");
        Game game = game(s(card(GRAB)), player("b", 20, steal));
        ch(game, "s").getItems().addAll(List.of(card(COCKTAIL), card(BEER)));
        turn(game, onItem(game, "s", "ADOPERIAMOTI", "s", "Bionda da 66, Calda"),
                onItem(game, "b", steal.getName(), "s", "Bionda da 66, Calda"));
        assertEquals(List.of("Bionda da 66, Calda"), items(game, "b"));
        assertEquals(List.of("Negroni Trovato per Terra"), items(game, "s"));
        assertEquals(0, res(game, "s", ALCOHOL));
    }

    @Test
    void lieveFastidioGainsFiveViolenceAndRoundsEachReceivedDamageDown() {
        Card rage = card(RAGE);
        Game game = game(s(rage), b(hit("Colpo misto", 1, null, "HIT 7", "CUT 7", "POISON 7")));
        ch(game, "s").getResources().put(TOXICITY, 10);
        assertArrayEquals(new int[]{18, 0}, turn(game, bound(game, "s", "LIEVE FASTIDIO", "SELF"),
                move(game, "b", "Colpo misto", "s")), "5 per tipo e 3 POISON periodici");
        assertAll(
                () -> assertTrue(rage.isCharacterBound()),
                () -> assertEquals("bruiser.character.BigBadBruiser", rage.getBoundToCharacter()),
                () -> assertEquals(2, rage.getPriority()),
                () -> assertEquals(Map.of(), rage.getCost()),
                () -> assertEquals(Set.of(SELF), rage.getCanTarget()),
                () -> assertEquals(5, res(game, "s", VIOLENCE)),
                () -> assertTrue(inHand(game, "s", "LIEVE FASTIDIO")),
                () -> assertTrue(ch(game, "s").getStatuses().isEmpty(), "scade dopo il turno di giocata"));
    }

    @Test
    void lieveFastidioDoesNotReduceAnEarlierHitAndStacksWithAnExistingStatus() {
        Game game = game(s(card(RAGE)), b(hit("Colpo tardi", 1, null, "HIT 7")), c(hit("Colpo presto", 2, null, "HIT 7")));
        apply(status("Corazza di prova", 0.5, false), ch(game, "s"));
        assertEquals(5, turn(game, bound(game, "s", "LIEVE FASTIDIO", "SELF"),
                move(game, "b", "Colpo tardi", "s"), move(game, "c", "Colpo presto", "s"))[0],
                "3 prima di LIEVE FASTIDIO e 2 dopo");
    }

    @Test
    void svegliamociLosesRoundedQuartersAtResolutionThenDealsTwoHit() {
        Card smack = card(SMACK);
        Card give = data("Regalo precoce",
                "{'binding':'t.RegaloPresto','kind':'ACTION','priority':2,'targets':['OPPONENT'],"
                        + "'target':[{'op':'gain','resource':'TOXICITY','amount':10}]}");
        Game game = game(s(smack), player("b", 90, give));
        ch(game, "s").getResources().put(TOXICITY, 5);
        ch(game, "s").getResources().put(ALCOHOL, 15);
        assertArrayEquals(new int[]{6, 2}, turn(game, bound(game, "s", "SVEGLIAMOCI - MA TU NO", "b"),
                move(game, "b", give.getName(), "s")), "restano 12 T, poi 6 POISON periodici");
        assertAll(
                () -> assertEquals(1, smack.getPriority()),
                () -> assertEquals(Set.of(OPPONENT), smack.getCanTarget()),
                () -> assertEquals(Map.of(), smack.getCost()),
                () -> assertEquals(12, res(game, "s", TOXICITY)),
                () -> assertEquals(5, res(game, "s", ALCOHOL), "12 L dopo la mossa, poi ne perde 7"),
                () -> assertEquals(54, res(game, "s", ALERTNESS)),
                () -> assertTrue(inHand(game, "s", "SVEGLIAMOCI - MA TU NO")));
    }

    @Test
    void violenzazioneDealsFourToSelfAndGainsEightViolence() {
        Card head = card(HEAD);
        Game game = game(s(head), b());
        assertArrayEquals(new int[]{4, 0}, turn(game, bound(game, "s", "VIOLENZAZIONE", "SELF"), rest(game, "b")));
        assertAll(
                () -> assertEquals(Map.of(), head.getCost()),
                () -> assertEquals(0, head.getPriority()),
                () -> assertEquals(Set.of(SELF), head.getCanTarget()),
                () -> assertEquals(8, res(game, "s", VIOLENCE)),
                () -> assertTrue(inHand(game, "s", "VIOLENZAZIONE")));
    }

    @Test
    void gargantuescoCostsTwentyFiveAndHitsTheSelectedOpponentForThirtyFive() {
        Card impact = card(IMPACT);
        Game game = game(s(impact), b(), c());
        ch(game, "s").getResources().put(VIOLENCE, 25);
        assertArrayEquals(new int[]{0, 0, 35}, turn(game, move(game, "s", "GARGANTUESCO IMPATTO SUL TU", "c"),
                rest(game, "b"), rest(game, "c")));
        assertAll(
                () -> assertEquals(Map.of(VIOLENCE, 25), impact.getCost()),
                () -> assertEquals(0, impact.getPriority()),
                () -> assertEquals(Set.of(OPPONENT), impact.getCanTarget()),
                () -> assertEquals(0, res(game, "s", VIOLENCE)));
    }

    @Test
    void spediamotiHalvesTheViolenceLeftAfterPayingTheCost() {
        Card ohio = card(OHIO);
        Game game = game(s(ohio), b());
        ch(game, "s").getResources().put(VIOLENCE, 23);
        assertArrayEquals(new int[]{0, 12}, turn(game, move(game, "s", "SPEDIAMOTI DUNQUE IN O-AHIO", "b"), rest(game, "b")));
        assertAll(
                () -> assertEquals(Map.of(VIOLENCE, 10), ohio.getCost()),
                () -> assertEquals(1, ohio.getPriority()),
                () -> assertEquals(Set.of(OPPONENT), ohio.getCanTarget()),
                () -> assertEquals(13, res(game, "s", VIOLENCE)));
    }

    @Test
    void nonGiocareHalvesCutForExactlyFourTurns() {
        Card stone = card(STONE);
        Card question = hit("Prova CUT", -1, null, "CUT 7", "HIT 2");
        Game game = game(s(stone), b(question));
        for (int i = 0; i < 4; i++) game.getPlayers().get("b").getDeck().add(question);
        assertEquals(5, turn(game, move(game, "s", "NON GIOCARE COL COLTELLO NO", "SELF"), move(game, "b", "Prova CUT", "s"))[0]);
        assertEquals(10, res(game, "s", VIOLENCE));
        for (int i = 0; i < 3; i++) {
            assertEquals(5, turn(game, rest(game, "s"), move(game, "b", "Prova CUT", "s"))[0]);
        }
        assertEquals(9, turn(game, rest(game, "s"), move(game, "b", "Prova CUT", "s"))[0]);
    }
}
