package com.gsc.bm.sim;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.List;
import java.util.stream.Stream;

import static com.gsc.bm.model.Resource.*;
import static com.gsc.bm.sim.Sb27Table.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.params.provider.Arguments.arguments;

/** Rincara è del singolo giocatore e conta anche le mosse annullate. */
class Sb27RincaraClausesTest {
    @BeforeAll
    static void loadDraft() throws Exception { load(); }

    static Stream<Arguments> sheets() {
        return Stream.of(
                arguments("LR-TOS", "junkie.LethalHeroinDose", "L'Ultimo Tiro", 0, 2, 8, 2, 13),
                arguments("LR-PIN", "base.pino.UltimoGiro", "Ultimo Giro", 3, 2, 13, 4, 17),
                arguments("LR-ROC", "base.rocco.NeHoPreseDiPeggio", "Non Mi Hai Fatto Niente", 0, 6, 10, 8, 15),
                arguments("LR-STR", "com.last.Struggle", "Addosso!!!", 0, 5, 10, 7, 15));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("sheets")
    void aCanceledPlayCountsButTheOpponentPlayDoesNot(
            String slot, String binding, String name, int startingL, int firstSelf, int firstTarget, int secondSelf, int secondTarget) {
        Player s = lastResort("s", 60, startingL, card(binding), List.of());
        Player b = lastResort("b", 90, startingL, card(binding), List.of(card("bruiser.YouStop")));
        b.getCharacter().getResources().put(VIOLENCE, 5);
        Game game = game(s, b);

        turn(game, rest(game, "s"), move(game, "b", name, "s"));
        assertArrayEquals(new int[]{0, 0}, turn(game, move(game, "s", name, "b"), move(game, "b", "FAI BASTA", "s")));
        assertTrue(voided(game, "s"), slot);
        assertArrayEquals(new int[]{secondSelf, secondTarget}, turn(game, move(game, "s", name, "b"), rest(game, "b")));

        Game onlyOpponentPlayed = game(lastResort("s", 60, startingL, card(binding), List.of()),
                lastResort("b", 90, startingL, card(binding), List.of()));
        turn(onlyOpponentPlayed, rest(onlyOpponentPlayed, "s"), move(onlyOpponentPlayed, "b", name, "s"));
        assertArrayEquals(new int[]{firstSelf, firstTarget}, turn(onlyOpponentPlayed,
                move(onlyOpponentPlayed, "s", name, "b"), rest(onlyOpponentPlayed, "b")));
    }

    private static Player lastResort(String id, int a, int l, Card last, List<Card> hand) {
        Player player = player(character(id, a, 3, ALCOHOL, TOXICITY), hand, List.of(), last);
        player.getCharacter().getResources().put(ALCOHOL, l);
        return player;
    }
}
