package com.gsc.bm.sim;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.cards.base.SetBaseIds;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Stream;

import static com.gsc.bm.model.Resource.*;
import static com.gsc.bm.model.cards.Card.CardTarget.SELF;
import static com.gsc.bm.sim.Sb27Table.*;
import static org.junit.jupiter.api.Assertions.*;
import static com.gsc.bm.model.cards.base.SetBaseIds.*;

/** Clausole comuni alle due schede Annuncia di SPAZIENZIO. */
class Sb27SpazienzioAnnounceTest {
    private static final String SPAZIENZIO = SetBaseIds.SPAZIENZIO;
    private static final String IMPACT = GARGANTUAN_IMPACT_ON_YOU;
    private static final String OHIO = SHIP_YOU_TO_OUCHIO;
    private static Draft draft;

    static final class Sheet {
        private final String name;
        private final String binding;
        private final String first;
        private final String second;
        private final int violenceAfterSuccess;

        Sheet(String name, String binding, String first, String second, int violenceAfterSuccess) {
            this.name = name;
            this.binding = binding;
            this.first = first;
            this.second = second;
            this.violenceAfterSuccess = violenceAfterSuccess;
        }

        @Override public String toString() { return name; }
    }

    @BeforeAll
    static void loadDraft() throws Exception {
        load();
        draft = Draft.fromClasspath("/set-base/bozza.json");
    }

    static Stream<Sheet> sheets() {
        return Stream.of(
                new Sheet("PAZIENZA: FINITA", PATIENCE_OVER, IMPACT, OHIO, 50),
                new Sheet("SGOMBERIAMOVI", LET_US_CLEAR_YOU_OUT, OHIO, IMPACT, 40));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("sheets")
    void announcesTheFirstListedNameByDefaultAndExposesTheActorToAllThreeDamageTypes(Sheet sheet) {
        Card announcement = card(sheet.binding);
        Card first = card(sheet.first);
        Card second = card(sheet.second);
        Player actor = announcing(announcement, List.of(second, first));
        actor.getCharacter().getResources().put(TOXICITY, 6);
        Game game = game(actor, b(hit("Tre danni", -1, null, "HIT 7", "CUT 7", "POISON 7")));

        assertArrayEquals(new int[]{34, 0}, turn(game, move(game, SPAZIENZIO, sheet.name, "SELF"),
                move(game, "b", "Tre danni", SPAZIENZIO)), "10 per tipo e 4 POISON periodici");
        assertEquals(Map.of(), announcement.getCost());
        assertEquals(Set.of(SELF), announcement.getCanTarget());
        assertEquals(0, announcement.getPriority());
        assertEquals(sheet.violenceAfterSuccess, res(game, SPAZIENZIO, VIOLENCE));
        assertEquals(35, res(game, SPAZIENZIO, ALERTNESS));
        assertTrue(actor.holds(first));
        assertFalse(actor.holds(second), "la ricerca sostituisce la pesca della cima");
        assertEquals(1, actor.getShownRevealed().size());
        assertSame(first, actor.getShownRevealed().get(0).getCard());
        assertEquals(3, tokens(game, SPAZIENZIO).size());
        assertTrue(tokens(game, SPAZIENZIO).stream().allMatch(token -> first.getName().equals(token.getUntilPlayed())));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("sheets")
    void acceptsTheExplicitChoiceOfTheSecondName(Sheet sheet) {
        Card second = card(sheet.second);
        Player actor = announcing(card(sheet.binding), List.of(card(sheet.first), second));
        Game game = game(actor, b());
        Move announcement = move(game, SPAZIENZIO, sheet.name, "SELF");
        announcement.setSearchChoice(sheet.second);

        turn(game, announcement, rest(game, "b"));
        assertEquals(1, actor.getShownRevealed().size());
        assertSame(second, actor.getShownRevealed().get(0).getCard());
        assertEquals(sheet.violenceAfterSuccess, res(game, SPAZIENZIO, VIOLENCE));
        assertEquals(35, res(game, SPAZIENZIO, ALERTNESS));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("sheets")
    void choosesTheOnlyAvailableName(Sheet sheet) {
        Card second = card(sheet.second);
        Player actor = announcing(card(sheet.binding), List.of(filler(), second));
        Game game = game(actor, b());

        turn(game, move(game, SPAZIENZIO, sheet.name, "SELF"), rest(game, "b"));
        assertEquals(1, actor.getShownRevealed().size());
        assertSame(second, actor.getShownRevealed().get(0).getCard());
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("sheets")
    void missesBothNamesDrawsNormallyAndGivesFiveViolenceAndFiveAlertness(Sheet sheet) {
        Card ordinaryDraw = hit("Pesca normale", 0, null, "HIT 1");
        Player actor = announcing(card(sheet.binding), List.of(ordinaryDraw));
        Game game = game(actor, b());

        turn(game, move(game, SPAZIENZIO, sheet.name, "SELF"), rest(game, "b"));
        assertTrue(actor.holds(ordinaryDraw));
        assertEquals(30, res(game, SPAZIENZIO, VIOLENCE));
        assertEquals(25, res(game, SPAZIENZIO, ALERTNESS));
        assertTrue(tokens(game, SPAZIENZIO).isEmpty());
        assertTrue(actor.getShownRevealed().isEmpty());
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("sheets")
    void canceledAnnounceDrawsNormallyWithoutRewardOrVulnerability(Sheet sheet) {
        Card ordinaryDraw = hit("Pesca normale", 0, null, "HIT 1");
        Card available = card(sheet.first);
        Player actor = announcing(card(sheet.binding), List.of(ordinaryDraw, available));
        Player opponent = b(card(THATS_ENOUGH));
        opponent.getCharacter().getResources().put(VIOLENCE, 5);
        Game game = game(actor, opponent);

        turn(game, move(game, SPAZIENZIO, sheet.name, "SELF"), move(game, "b", "FAI BASTA", SPAZIENZIO));
        assertTrue(voided(game, SPAZIENZIO));
        assertTrue(actor.holds(ordinaryDraw));
        assertFalse(actor.holds(available));
        assertEquals(25, res(game, SPAZIENZIO, VIOLENCE));
        assertEquals(20, res(game, SPAZIENZIO, ALERTNESS));
        assertTrue(tokens(game, SPAZIENZIO).isEmpty());
        assertTrue(actor.getShownRevealed().isEmpty());
    }

    private static Player announcing(Card announcement, List<Card> deck) {
        return player(draft.character(SPAZIENZIO), List.of(announcement), deck, null);
    }
}
