package com.gsc.bm.sim;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.cards.base.SetBaseIds;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.gsc.bm.model.Resource.*;
import static com.gsc.bm.sim.Sb27Table.*;
import static org.junit.jupiter.api.Assertions.*;
import static com.gsc.bm.model.cards.base.SetBaseIds.*;

/** Le clausole di Annuncia si ripetono sulle dodici schede. Ogni scheda usa la propria carta della bozza. */
class Sb27AnnounceClausesTest {
    private static final String IMPACT = GARGANTUAN_IMPACT_ON_YOU;
    private static final String OHIO = SHIP_YOU_TO_OUCHIO;
    private static final String LAZO = RIDERS_LASSO;
    private static final String SGOMMATA = BURNOUT;
    private static final String TOSSICONE = PHLEGMY_COUGH;
    private static final String TUNNEL = DRAG_INTO_THE_TUNNEL;
    private static final String GOCCIA = DOWN_IN_ONE;
    private static final String RUTTO = POINT_BLANK_BURP;
    private static final String CHIAVE = THIRTEEN_WRENCH;
    private static final String LAVORO = JOB_WELL_DONE;
    private static final String SEGRETO = OPEN_SECRET;
    private static final String CONTO = STEEP_BILL;
    private static final String CRANIATA = PATRIOTIC_HEADBUTT;
    private static final String TESTA = HARDHEAD;
    private static final String DISCARD = "Scarto di prova";
    private static final String CUT = "CUT di prova";
    private static Draft draft;

    static final class Sheet {
        final String slot;
        final String actor;
        final String binding;
        final String name;
        final String first;
        final String second;
        final String target;
        final int paidA;
        final int[] foundResources;

        Sheet(String slot, String actor, String binding, String name, String first, String second, String target,
              int paidA, int h, int a, int v, int t, int l) {
            this.slot = slot;
            this.actor = actor;
            this.binding = binding;
            this.name = name;
            this.first = first;
            this.second = second;
            this.target = target;
            this.paidA = paidA;
            this.foundResources = new int[]{h, a, v, t, l};
        }

        @Override public String toString() { return slot; }
    }

    @BeforeAll
    static void loadDraft() throws Exception {
        load();
        draft = Draft.fromClasspath("/set-base/bozza.json");
    }

    // Risorse della fixture prima di Annuncia: 500 H, 60 A, 30 V, 20 T, 10 L, immunità ai soli periodici.
    static Stream<Sheet> sheets() {
        return Stream.of(
                new Sheet("SPA-AR3", SetBaseIds.SPAZIENZIO, PATIENCE_OVER, "PAZIENZA: FINITA",
                        IMPACT, OHIO, "SELF", 0, 500, 75, 55, 20, 10),
                new Sheet("SPA-AR6", SetBaseIds.SPAZIENZIO, LET_US_CLEAR_YOU_OUT, "SGOMBERIAMOVI",
                        OHIO, IMPACT, "SELF", 0, 500, 75, 45, 20, 10),
                new Sheet("MAR-AR5", SetBaseIds.MARA, APPROACH_SLALOM, "Slalom d'Avvicinamento",
                        SGOMMATA, LAZO, "SELF", 0, 500, 75, 30, 20, 10),
                new Sheet("MAR-AR6", SetBaseIds.MARA, UNPREDICTABLE_TRAJECTORY, "Traiettoria Imprevedibile",
                        LAZO, SGOMMATA, "SELF", 0, 500, 80, 30, 20, 10),
                new Sheet("TOS-AR1", SetBaseIds.CELESTINA, TAKE_INVENTORY, "Fare l'Inventario",
                        TOSSICONE, TUNNEL, "SELF", 0, 500, 65, 30, 30, 10),
                new Sheet("TOS-AR6", SetBaseIds.CELESTINA, JUST_A_TASTE, "Un Assaggino",
                        TUNNEL, TOSSICONE, "SELF", 0, 500, 60, 30, 40, 10),
                new Sheet("PIN-AR4", SetBaseIds.PIERA, ONE_MORE_AND_IM_COMING, "Un Altro e Arrivo",
                        GOCCIA, RUTTO, "SELF", 0, 500, 95, 30, 20, 25),
                new Sheet("PIN-AR6", SetBaseIds.PIERA, ANOTHER_LITTLE_GRAPPA, "Un Altro... Grappino...",
                        RUTTO, GOCCIA, "SELF", 0, 500, 95, 30, 20, 25),
                new Sheet("GIG-AR3", SetBaseIds.BEPPE, PREPARE_THE_JOB, "Preparare il Lavoro",
                        CHIAVE, LAVORO, "b", 0, 500, 60, 45, 20, 10),
                new Sheet("GIG-AR6", SetBaseIds.BEPPE, EMPIRICAL_METHOD, "Metodo Empirico",
                        LAVORO, CHIAVE, "b", 0, 500, 60, 40, 20, 10),
                new Sheet("CES-AR1", SetBaseIds.SERGIO, TIMELY_DISTRACTION, "Opportuna Distrazione",
                        SEGRETO, CONTO, "b", 5, 500, 70, 30, 20, 10),
                new Sheet("ROC-AR5", SetBaseIds.DUCCIO, HISTORY_IS_WRITTEN_BY_THE_VICTORS, "La Storia la Scrivono i Vincitori",
                        CRANIATA, TESTA, "b", 0, 506, 60, 30, 20, 10));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("sheets")
    void explicitSecondChoiceUsesTheSameRewardAndLinksOnlyThatName(Sheet sheet) {
        Card first = card(sheet.first);
        Card chosen = card(sheet.second);
        Player actor = actor(sheet, List.of(card(sheet.binding)), List.of(first, chosen));
        Game game = game(actor, b());
        Move announcement = announce(game, sheet);
        announcement.setSearchChoice(sheet.second);
        turn(game, announcement, rest(game, "b"));

        assertShown(game, sheet, actor, chosen);
        assertFalse(actor.holds(first));
        assertArrayEquals(sheet.foundResources, resources(game, sheet.actor));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("sheets")
    void findsTheSecondNameAutomaticallyWhenItIsTheOnlyCopyInTheDeck(Sheet sheet) {
        Card chosen = card(sheet.second);
        Player actor = actor(sheet, List.of(card(sheet.binding), card(sheet.first)), List.of(filler(), chosen));
        Game game = game(actor, b());
        turn(game, announce(game, sheet), rest(game, "b"));

        assertShown(game, sheet, actor, chosen);
        assertArrayEquals(sheet.foundResources, resources(game, sheet.actor));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("sheets")
    void cancellationPaysTheCostButDrawsNormallyWithoutEffectRewardOrSearch(Sheet sheet) {
        Card normal = hit("Pesca ordinaria", 0, null, "HIT 1");
        Card available = card(sheet.first);
        Player actor = actor(sheet, List.of(card(sheet.binding)), List.of(normal, available));
        Player canceller = player("b", 90, card(THATS_ENOUGH));
        canceller.getCharacter().getResources().put(VIOLENCE, 5);
        Game game = game(actor, canceller);
        turn(game, announce(game, sheet), move(game, "b", "FAI BASTA", sheet.actor));

        assertTrue(voided(game, sheet.actor));
        assertTrue(actor.holds(normal));
        assertFalse(actor.holds(available));
        assertTrue(actor.getShownRevealed().isEmpty());
        assertTrue(tokens(game, sheet.actor).isEmpty());
        assertArrayEquals(new int[]{500, 60 - sheet.paidA, 30, 20, 10}, resources(game, sheet.actor));
        assertEquals(500, health(game, "b"));
        assertEquals(90, res(game, "b", ALERTNESS));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("sheets")
    void discardingTheAnnouncementItselfNeverSearches(Sheet sheet) {
        Card charge = card(sheet.binding);
        Card normal = hit("Pesca ordinaria", 0, null, "HIT 1");
        Card available = card(sheet.first);
        Player actor = actor(sheet, List.of(charge, discardAction(sheet)), List.of(normal, available));
        Game game = game(actor, b());
        turn(game, discard(game, sheet, sheet.name), rest(game, "b"));

        assertFalse(actor.holds(charge));
        assertTrue(actor.holds(normal));
        assertFalse(actor.holds(available));
        assertTrue(actor.getShownRevealed().isEmpty());
        assertTrue(tokens(game, sheet.actor).isEmpty());
        assertArrayEquals(new int[]{500, 60, 31, 20, 10}, resources(game, sheet.actor));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("sheets")
    void discardingTheLastAnnouncedCopyConcealsItButVulnerabilityLastsThroughTheFollowingTurn(Sheet sheet) {
        Card found = card(sheet.first);
        Player actor = actor(sheet, List.of(card(sheet.binding), discardAction(sheet)), List.of(found, filler(), filler(), filler()));
        Card attack = hit(CUT, -1, null, "CUT 7");
        Player opponent = player(character("b", 10, 3), List.of(attack), List.of(attack, attack, filler()), null);
        Game game = game(actor, opponent);
        turn(game, announce(game, sheet), rest(game, "b"));
        assertShown(game, sheet, actor, found);

        assertEquals(10, turn(game, discard(game, sheet, found.getName()), move(game, "b", CUT, sheet.actor))[0]);
        assertFalse(actor.holds(found));
        assertTrue(actor.getShownRevealed().isEmpty());
        assertEquals(3, tokens(game, sheet.actor).size(), "lo scarto non soddisfa il gettone");
        assertEquals(10, turn(game, rest(game, sheet.actor), move(game, "b", CUT, sheet.actor))[0]);
        assertTrue(tokens(game, sheet.actor).isEmpty(), "scade dopo il turno successivo");
        assertEquals(7, turn(game, rest(game, sheet.actor), move(game, "b", CUT, sheet.actor))[0]);
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("sheets")
    void playingTheAnnouncedNameKeepsVulnerabilityThroughTheEndOfThatTurn(Sheet sheet) {
        Card found = card(sheet.first);
        Player actor = actor(sheet, List.of(card(sheet.binding)), List.of(found, filler(), filler()));
        Card attack = hit(CUT, -1, null, "CUT 7");
        Game game = game(actor, b(), c(attack));
        turn(game, announce(game, sheet), rest(game, "b"), rest(game, "c"));
        assertShown(game, sheet, actor, found);

        int healthLost = CRANIATA.equals(sheet.first) ? 40 : 10; // Craniata paga anche 30 H.
        assertEquals(healthLost, turn(game, move(game, sheet.actor, found.getName(), "b"), rest(game, "b"),
                move(game, "c", CUT, sheet.actor))[0]);
        assertTrue(actor.getShownRevealed().isEmpty());
        assertTrue(tokens(game, sheet.actor).isEmpty());
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("sheets")
    void playingTheAnnouncedNameSatisfiesVulnerabilityEvenWhenCanceled(Sheet sheet) {
        Card found = card(sheet.first);
        Player actor = actor(sheet, List.of(card(sheet.binding)), List.of(found, filler()));
        Player canceller = player("b", 90, card(THATS_ENOUGH));
        canceller.getCharacter().getResources().put(VIOLENCE, 5);
        Game game = game(actor, canceller);
        turn(game, announce(game, sheet), rest(game, "b"));
        assertShown(game, sheet, actor, found);

        turn(game, move(game, sheet.actor, found.getName(), "b"), move(game, "b", "FAI BASTA", sheet.actor));
        assertTrue(voided(game, sheet.actor));
        assertTrue(actor.getShownRevealed().isEmpty());
        assertTrue(tokens(game, sheet.actor).isEmpty());
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("sheets")
    void shufflesAfterBothFoundAndMissedSearches(Sheet sheet) {
        for (boolean found : List.of(true, false)) {
            List<Card> remaining = new ArrayList<>();
            for (int i = 1; i <= 8; i++) remaining.add(hit("Carta " + i, 0, null, "HIT 1"));
            Card drawn = found ? card(sheet.first) : hit("Pesca ordinaria", 0, null, "HIT 1");
            List<Card> deck = new ArrayList<>(remaining);
            deck.add(0, drawn);
            Player actor = actor(sheet, List.of(card(sheet.binding)), deck);
            Game game = game(actor, b());
            turn(game, announce(game, sheet), rest(game, "b"));

            assertTrue(actor.holds(drawn));
            List<String> unshuffled = new ArrayList<>(names(remaining));
            Collections.reverse(unshuffled);
            List<String> shuffled = names(actor.getDeck());
            assertEquals(8, shuffled.size());
            assertEquals(unshuffled.stream().sorted().collect(Collectors.toList()), shuffled.stream().sorted().collect(Collectors.toList()));
            assertNotEquals(unshuffled, shuffled, "con il seme del banco RP-24 cambia l'ordine");
        }
    }

    private static Player actor(Sheet sheet, List<Card> hand, List<Card> deck) {
        Character actor = draft.character(sheet.actor);
        actor.getResources().putAll(Map.of(HEALTH, 500, ALERTNESS, 60, VIOLENCE, 30, TOXICITY, 20, ALCOHOL, 10));
        actor.getImmunities().addAll(List.of(TOXICITY, ALCOHOL));
        return player(actor, hand, deck, null);
    }

    private static Move announce(Game game, Sheet sheet) {
        return move(game, sheet.actor, sheet.name, sheet.target);
    }

    private static Card discardAction(Sheet sheet) {
        return data(DISCARD, "{'binding':'t.Scarto','kind':'BOUND','boundTo':'" + sheet.actor + "','targets':['SELF'],"
                + "'self':[{'op':'gain','resource':'VIOLENCE','amount':1}]}");
    }

    private static Move discard(Game game, Sheet sheet, String discarded) {
        return new Move(DISCARD, sheet.actor, "SELF", game.getGameId(), Map.of(Move.AdditionalAction.DISCARD_ONE, discarded));
    }

    private static void assertShown(Game game, Sheet sheet, Player actor, Card found) {
        assertTrue(actor.holds(found));
        assertEquals(1, actor.getShownRevealed().size());
        assertSame(found, actor.getShownRevealed().get(0).getCard());
        assertEquals(3, tokens(game, sheet.actor).size());
        assertTrue(tokens(game, sheet.actor).stream().allMatch(token -> found.getName().equals(token.getUntilPlayed())));
    }

    private static int[] resources(Game game, String actor) {
        return new int[]{health(game, actor), res(game, actor, ALERTNESS), res(game, actor, VIOLENCE),
                res(game, actor, TOXICITY), res(game, actor, ALCOHOL)};
    }
}
