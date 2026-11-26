package com.gsc.bm.sim;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Stream;

import static com.gsc.bm.model.Resource.*;
import static com.gsc.bm.sim.Sb27Table.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.params.provider.Arguments.arguments;
import static com.gsc.bm.model.cards.base.SetBaseIds.*;

/** Rami con una mossa bersaglio assente, già annullata o più lenta (RP-1 e sezione 4). */
class Sb27OpponentTimingTest {
    @BeforeAll
    static void loadDraft() throws Exception { load(); }

    static Stream<Arguments> withoutTargetMove() {
        return Stream.of(
                arguments("SPA-AR5", THATS_ENOUGH, "FAI BASTA", 60, 20, 10, 0),
                arguments("CES-BO1", LET_US_DISCUSS_IN_PRIVATE, "Discutiamone in Privato", 60, 25, 10, 0),
                arguments("CES-AR2", GOOD_OLD_BLACKMAIL, "Buon Vecchio Ricatto", 45, 25, 10, 0),
                arguments("CES-AR3", SEEN_THAT_SCRIPT, "Copione Già Visto", 50, 25, 10, 0),
                arguments("MAR-BO3", CUT_OFF, "Tagliare la Strada", 60, 25, 10, 0),
                arguments("MAR-AR1", RIDERS_LASSO, "Lazo del Rider", 40, 25, 10, 40),
                arguments("MAR-AR2", BURNOUT, "Sgommata", 45, 25, 10, 25),
                arguments("MAR-AR3", UNNATURAL_AGILITY, "Agilità Innaturale", 60, 25, 2, 4));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("withoutTargetMove")
    void aMissingTargetMoveNeverTriggersACounterOrAnAheadEffect(
            String slot, String binding, String name, int actorA, int actorV, int targetA, int damage) {
        Card action = card(binding);
        Player actor = s(action);
        actor.getCharacter().getResources().put(VIOLENCE, 25);
        Game game = game(actor, b(), c());
        Move play = action.isCharacterBound() ? bound(game, "s", name, "b") : move(game, "s", name, "b");
        assertArrayEquals(new int[]{0, damage, 0}, turn(game, play, Move.voidMove("b"), rest(game, "c")));
        assertEquals(actorA, res(game, "s", ALERTNESS));
        assertEquals(actorV, res(game, "s", VIOLENCE));
        assertEquals(targetA, res(game, "b", ALERTNESS));
        assertFalse(game.getResolvedMoves().stream().anyMatch(move -> move.getPlayerId().equals("b")),
                slot + ": la mossa vuota non entra nella risoluzione");
        if (slot.startsWith("MAR-")) assertEquals(Boolean.FALSE, play.getAhead());
    }

    static Stream<Arguments> laterMove() {
        return Stream.of(
                arguments("MAR-BO3", CUT_OFF, "Tagliare la Strada", 60, 6, 0),
                arguments("MAR-AR1", RIDERS_LASSO, "Lazo del Rider", 40, 10, 45),
                arguments("MAR-AR2", BURNOUT, "Sgommata", 45, 10, 25),
                arguments("MAR-AR3", UNNATURAL_AGILITY, "Agilità Innaturale", 64, 2, 4));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("laterMove")
    void aheadStillAppliesIfTheLaterTargetMoveIsCanceled(
            String slot, String binding, String name, int actorA, int targetA, int damage) {
        Card action = card(binding);
        LateCancel cancel = new LateCancel();
        Game game = game(s(action), b(), player("c", 20, cancel));
        Move play = action.isCharacterBound() ? bound(game, "s", name, "b") : move(game, "s", name, "b");
        Move cancellation = move(game, "c", cancel.getName(), "b");
        assertArrayEquals(new int[]{0, damage, 0}, turn(game, play, rest(game, "b"), cancellation));
        assertEquals(Boolean.TRUE, play.getAhead(), slot);
        assertTrue(voided(game, "b"));
        assertEquals(actorA, res(game, "s", ALERTNESS));
        assertEquals(targetA, res(game, "b", ALERTNESS));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("laterMove")
    void aheadStillAppliesIfTheTargetIsAlreadyDownWithItsMovePending(
            String slot, String binding, String name, int actorA, int targetA, int ignoredDamage) {
        Card action = card(binding);
        Player target = b(hit("Spinta", 0, null, "HIT 5"));
        target.getCharacter().getResources().put(HEALTH, 1);
        Game game = game(s(action), target, c(hit("Colpaccio", 3, null, "CUT 10")));
        Move play = action.isCharacterBound() ? bound(game, "s", name, "b") : move(game, "s", name, "b");
        assertArrayEquals(new int[]{0, 1, 0}, turn(game, play, move(game, "b", "Spinta", "c"), move(game, "c", "Colpaccio", "b")));
        assertEquals(Boolean.TRUE, play.getAhead(), slot);
        assertTrue(voided(game, "b"));
        assertEquals(actorA, res(game, "s", ALERTNESS));
        assertEquals(targetA, res(game, "b", ALERTNESS));
    }

    @Test
    void riflessiSkipsAnAbsentMoveAndStillCancelsTheOtherAttacker() {
        Player actor = s(card(SPEED_BOOSTED_REFLEXES));
        actor.getCharacter().getResources().put(TOXICITY, 10);
        Game game = game(actor, b(), c(hit("Colpaccio", 1, null, "HIT 9")));
        assertArrayEquals(new int[]{0, 0, 0}, turn(game, move(game, "s", "Riflessi Aumentati dalla Speed", "SELF"),
                Move.voidMove("b"), move(game, "c", "Colpaccio", "s")));
        assertEquals(0, res(game, "s", TOXICITY));
        assertTrue(voided(game, "c"));
    }

    @Test
    void copioneLeavesAnAlreadyResolvedTargetMoveAlone() {
        Card copione = card(SEEN_THAT_SCRIPT);
        Game game = game(s(copione), b(hit("Colpaccio", 3, null, "CUT 9")));
        assertArrayEquals(new int[]{9, 0}, turn(game, move(game, "s", copione.getName(), "b"),
                move(game, "b", "Colpaccio", "s")));
        assertFalse(voided(game, "b"));
        assertEquals(50, res(game, "s", ALERTNESS));
    }

    private static final class LateCancel extends AbstractCard {
        LateCancel() {
            setGuiName("Annulla dopo");
            setCanTarget(Set.of(Card.CardTarget.OPPONENT));
            setPriority(1);
            setCost(Map.of());
        }

        @Override
        public void applyOtherUnfathomableLogic(Game game, Move move) {
            assertTrue(game.getPendingMoveOfTargetIfMovesAfterPlayer(move.getPlayerId(), "s").isEmpty());
            game.getPendingMoveOfTargetIfMovesAfterPlayer(move.getPlayerId(), move.getTargetId())
                    .ifPresent(pending -> pending.setVoid(true));
        }
        @Override public List<String> applyEffectOnSelf(Character self) { return List.of(); }

        @Override public List<String> applyEffectOnTarget(Character self, Character target) { return List.of(); }
    }
}
