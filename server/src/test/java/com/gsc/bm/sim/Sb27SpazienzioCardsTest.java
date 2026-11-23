package com.gsc.bm.sim;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
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

    @Test
    void patienceEndsTheRevealWhenTheOtherCopyIsPlayed() throws Exception {
        Draft draft = Draft.fromClasspath("/set-base/bozza.json");
        String actor = "bruiser.character.BigBadBruiser";
        Card patience = card("bruiser.Glare");
        Card alreadyHeld = card("bruiser.SuperImpact");
        Card found = card("bruiser.SuperImpact");
        Player spazienzio = player(draft.character(actor), List.of(patience, alreadyHeld),
                List.of(filler(), found, filler()), null);
        Game game = game(spazienzio, b());

        turn(game, move(game, actor, "PAZIENZA: FINITA", "SELF"), rest(game, "b"));
        assertEquals(50, res(game, actor, VIOLENCE));
        assertEquals(35, res(game, actor, ALERTNESS));
        assertEquals(1, spazienzio.getShownRevealed().size());
        assertSame(found, spazienzio.getShownRevealed().get(0).getCard());
        assertSame(alreadyHeld, game.getCardFromHand(actor, "GARGANTUESCO IMPATTO SUL TU"));

        assertArrayEquals(new int[]{0, 35}, turn(game, move(game, actor, "GARGANTUESCO IMPATTO SUL TU", "b"), rest(game, "b")));
        assertFalse(spazienzio.holds(alreadyHeld), "è stata giocata la copia già in mano");
        assertTrue(spazienzio.holds(found), "la copia annunciata è rimasta in mano");
        assertTrue(tokens(game, actor).isEmpty(), "giocare il nome chiude Vulnerabile");
        assertEquals(0, spazienzio.getShownRevealed().size(), "D178: il promemoria cade insieme a Vulnerabile");
    }

    @Test
    void patienceKeepsTheFoundCopyShownWhenMescoloneRemovesVulnerability() throws Exception {
        Draft draft = Draft.fromClasspath("/set-base/bozza.json");
        String actor = "bruiser.character.BigBadBruiser";
        Card patience = card("bruiser.Glare");
        Card found = card("bruiser.SuperImpact");
        Card mescolone = card("com.items.MarvelousCocktail");
        Player spazienzio = player(draft.character(actor), List.of(patience, consume()),
                List.of(filler(), found, filler(), filler(), filler(), filler(), filler()), null);
        Game game = game(spazienzio, b());
        ch(game, actor).getItems().add(mescolone);

        turn(game, move(game, actor, "PAZIENZA: FINITA", "SELF"), rest(game, "b"));
        assertSame(found, spazienzio.getShownRevealed().get(0).getCard());
        assertFalse(tokens(game, actor).isEmpty());

        turn(game, onItem(game, actor, "Consuma", actor, "Mescolone Micidiale"), rest(game, "b"));
        for (int turnAfterConsuming = 1; turnAfterConsuming <= 3; turnAfterConsuming++) {
            turn(game, rest(game, actor), rest(game, "b"));
        }
        assertEquals(70, res(game, actor, HEALTH));
        assertFalse(tokens(game, actor).isEmpty());
        assertSame(found, spazienzio.getShownRevealed().get(0).getCard());

        turn(game, rest(game, actor), rest(game, "b"));
        assertEquals(50, res(game, actor, HEALTH), "il timer di quinto turno è scattato e ha inflitto 20 POISON");
        assertTrue(tokens(game, actor).isEmpty(), "RP-29: il timer rimuove Vulnerabile");
        assertTrue(spazienzio.holds(found), "la copia annunciata non è stata giocata o scartata");
        assertEquals(1, spazienzio.getShownRevealed().size(), "D179: il timer lascia il promemoria");
        assertSame(found, spazienzio.getShownRevealed().get(0).getCard());
    }

    @Test
    void matchingPlayEndsTheOnlyRemainingVulnerabilityAfterMescolone() throws Exception {
        Draft draft = Draft.fromClasspath("/set-base/bozza.json");
        String actor = "bruiser.character.BigBadBruiser";
        Card first = card("bruiser.SuperImpact");
        Card second = card("bruiser.SuperImpact");
        List<Card> deck = new ArrayList<>(fillers(12));
        deck.add(0, first);
        deck.add(2, second); // Col seme del banco resta nel mazzo fino al secondo annuncio.
        Player spazienzio = player(draft.character(actor),
                List.of(card("bruiser.Glare"), consume(), card("base.bruiser.TiFaccioSpazio")), deck, null);
        Game game = game(spazienzio, b());
        ch(game, actor).getItems().add(card("com.items.MarvelousCocktail"));

        turn(game, move(game, actor, "PAZIENZA: FINITA", "SELF"), rest(game, "b"));
        assertSame(first, spazienzio.getShownRevealed().get(0).getCard());
        assertEquals(3, tokens(game, actor).size());

        turn(game, onItem(game, actor, "Consuma", actor, "Mescolone Micidiale"), rest(game, "b"));
        for (int afterConsumption = 1; afterConsumption <= 4; afterConsumption++) {
            turn(game, rest(game, actor), rest(game, "b"));
        }
        assertTrue(tokens(game, actor).isEmpty(), "RP-29: il primo Vulnerabile è finito");
        assertSame(first, spazienzio.getShownRevealed().get(0).getCard(), "D179: il primo promemoria è ancora mostrato");
        assertTrue(spazienzio.getDeck().stream().anyMatch(copy -> copy == second));

        turn(game, move(game, actor, "SGOMBERIAMOVI", "SELF"), rest(game, "b"));
        assertEquals(2, spazienzio.getShownRevealed().size());
        assertSame(second, spazienzio.getShownRevealed().get(1).getCard());
        assertEquals(3, tokens(game, actor).size(), "c'è un solo gettone, del secondo annuncio");
        assertSame(first, game.getCardFromHand(actor, "GARGANTUESCO IMPATTO SUL TU"));

        turn(game, move(game, actor, "GARGANTUESCO IMPATTO SUL TU", "b"), rest(game, "b"));
        assertFalse(spazienzio.holds(first));
        assertTrue(spazienzio.holds(second));
        assertTrue(tokens(game, actor).isEmpty(), "D180: giocare il nome soddisfa l'unico Vulnerabile presente");
        assertTrue(spazienzio.getShownRevealed().isEmpty(), "entrambi i promemoria chiudono a fine turno");
    }

    @Test
    void matchingPlayClosesTheStaleReminderEvenWhenItsCopyStaysInHand() throws Exception {
        Draft draft = Draft.fromClasspath("/set-base/bozza.json");
        String actor = "bruiser.character.BigBadBruiser";
        Card alreadyHeld = card(IMPACT);
        Card found = card(IMPACT);
        Player spazienzio = player(draft.character(actor), List.of(card("bruiser.Glare"), consume(), alreadyHeld),
                List.of(filler(), found, filler(), filler(), filler(), filler(), filler()), null);
        Game game = game(spazienzio, b());
        ch(game, actor).getItems().add(card("com.items.MarvelousCocktail"));

        turn(game, move(game, actor, "PAZIENZA: FINITA", "SELF"), rest(game, "b"));
        assertSame(found, spazienzio.getShownRevealed().get(0).getCard());
        turn(game, onItem(game, actor, "Consuma", actor, "Mescolone Micidiale"), rest(game, "b"));
        for (int afterConsumption = 1; afterConsumption <= 4; afterConsumption++) {
            turn(game, rest(game, actor), rest(game, "b"));
        }
        assertTrue(tokens(game, actor).isEmpty());
        assertEquals(1, spazienzio.getShownRevealed().size());
        assertSame(found, spazienzio.getShownRevealed().get(0).getCard());
        assertSame(alreadyHeld, game.getCardFromHand(actor, "GARGANTUESCO IMPATTO SUL TU"));

        turn(game, move(game, actor, "GARGANTUESCO IMPATTO SUL TU", "b"), rest(game, "b"));
        assertFalse(spazienzio.holds(alreadyHeld));
        assertTrue(spazienzio.holds(found));
        assertEquals(0, spazienzio.getShownRevealed().size(), "D180: la giocata omonima fa cadere il promemoria senza gettone");
    }
}
