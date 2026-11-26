package com.gsc.bm.sim;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.List;
import java.util.stream.Stream;

import static com.gsc.bm.model.Resource.*;
import static com.gsc.bm.sim.Sb27Table.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.params.provider.Arguments.arguments;
import static com.gsc.bm.model.cards.base.SetBaseIds.*;

/** Attesi dalle schede degli oggetti a dati del Set Base 1.0 candidato. */
class Sb27ItemCardsTest {
    private static final String CONTO = TABLE_SIX_BILL;
    private static final String SIGARETTA = LIT_CIGARETTE;
    private static final String GUANTI = WORKSHOP_GLOVES;
    private static final String GIUBBOTTO = FAKE_LEATHER_JACKET;
    private static final String CASCO = SITE_HELMET;
    private static final String POSACENERE = GLASS_ASHTRAY;

    @BeforeAll
    static void loadDraft() throws Exception { load(); }

    // T e L prima del consumo, poi H, A, V, T, L dopo la mossa e R06.
    static Stream<Arguments> resources() {
        return Stream.of(
                arguments("Negroni Trovato per Terra", NEGRONI_FOUND_ON_THE_FLOOR, 0, 0, 499, 55, 10, 2, 4),
                arguments("Bionda da 66, Calda", WARM_BLONDE_66, 0, 0, 500, 55, 0, 0, 4),
                arguments("Amaro nel Bicchiere di Plastica", AMARO_IN_A_PLASTIC_CUP, 0, 0, 500, 45, 0, 0, 9),
                arguments("Espresso della Macchinetta", VENDING_MACHINE_ESPRESSO, 0, 0, 500, 75, 0, 0, 0),
                arguments("Kebab Abbandonato", ABANDONED_KEBAB, 0, 0, 509, 60, 0, 2, 0),
                arguments("Acqua Minerale Sgasata", FLAT_MINERAL_WATER, 0, 20, 500, 80, 0, 0, 0),
                arguments("Pasticca Abbandonata", ABANDONED_PILL, 0, 0, 495, 60, 0, 10, 0),
                arguments("Ghiaccio nel Tovagliolo", ICE_IN_A_NAPKIN, 15, 0, 510, 60, 0, 0, 0),
                arguments("Grappa della Casa", HOUSE_GRAPPA, 0, 0, 500, 43, 0, 0, 12));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("resources")
    void anItemDrawnGoesStraightToTheFieldAndGrantsItsResourcesOnlyWhenConsumed(
            String name, String binding, int startingT, int startingL, int h, int a, int v, int t, int l) {
        Card item = card(binding);
        Card normal = hit("Pesca normale", 0, null, "HIT 1");
        Player actor = player(character("s", 60, 3), List.of(consume()), List.of(item, normal), null);
        assertTrue(item.isItem());
        actor.drawCard();
        Game game = game(actor, b());
        assertEquals(List.of(name), items(game, "s"));
        assertTrue(actor.holds(normal));
        assertFalse(actor.holds(item));
        assertEquals(500, health(game, "s"));
        assertEquals(60, res(game, "s", ALERTNESS));
        assertEquals(0, res(game, "s", VIOLENCE));
        assertEquals(0, res(game, "s", TOXICITY));
        assertEquals(0, res(game, "s", ALCOHOL));

        ch(game, "s").getResources().put(TOXICITY, startingT);
        ch(game, "s").getResources().put(ALCOHOL, startingL);
        consumeItem(game, name);
        assertTrue(items(game, "s").isEmpty());
        assertEquals(h, health(game, "s"));
        assertEquals(a, res(game, "s", ALERTNESS));
        assertEquals(v, res(game, "s", VIOLENCE));
        assertEquals(t, res(game, "s", TOXICITY));
        assertEquals(l, res(game, "s", ALCOHOL));
    }

    static Stream<Arguments> incomingEquipment() {
        return Stream.of(arguments("Giubbotto di Finta Pelle", GIUBBOTTO, 14), arguments("Casco da Cantiere", CASCO, 13));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("incomingEquipment")
    void armourReducesOnlyItsNamedDamageTypeThroughTheThirdTurn(String name, String binding, int mitigated) {
        Card attack = hit("Due tipi", 0, null, "HIT 9", "CUT 7");
        Player opponent = player(character("b", 10, 3), List.of(attack), List.of(attack, attack, attack), null);
        Game game = game(s(consume()), opponent);
        ch(game, "s").getItems().add(card(binding));

        assertEquals(mitigated, turn(game, onItem(game, "s", "Consuma", "s", name), move(game, "b", "Due tipi", "s"))[0]);
        assertEquals(mitigated, turn(game, rest(game, "s"), move(game, "b", "Due tipi", "s"))[0]);
        assertEquals(mitigated, turn(game, rest(game, "s"), move(game, "b", "Due tipi", "s"))[0]);
        assertEquals(16, turn(game, rest(game, "s"), move(game, "b", "Due tipi", "s"))[0]);
    }

    @Test
    void guantiAmplifyOnlyHitInTurnsTwoAndThreeThenExpire() {
        Card attack = hit("Due tipi", 0, null, "HIT 9", "CUT 7");
        Player actor = player(character("s", 60, 3), List.of(consume(), attack), List.of(attack, attack, filler()), null);
        Game game = game(actor, b());
        ch(game, "s").getItems().add(card(GUANTI));
        consumeItem(game, "Guanti da Officina");
        assertEquals(18, turn(game, move(game, "s", "Due tipi", "b"), rest(game, "b"))[1]);
        assertEquals(18, turn(game, move(game, "s", "Due tipi", "b"), rest(game, "b"))[1]);
        assertEquals(16, turn(game, move(game, "s", "Due tipi", "b"), rest(game, "b"))[1]);
    }

    @Test
    void posacenereWaitsForHitMagnifiesEveryHitThatTurnAndThenExpires() {
        Card attack = hit("Doppio HIT", 0, null, "HIT 7", "HIT 5");
        Player actor = player(character("s", 60, 3), List.of(consume(), attack), List.of(filler(), filler(), attack), null);
        Player opponent = player(character("b", 10, 3, ALCOHOL), List.of(), fillers(10), null);
        opponent.getCharacter().getResources().put(ALCOHOL, 12);
        Game game = game(actor, opponent);
        ch(game, "s").getItems().add(card(POSACENERE));
        consumeItem(game, "Posacenere di Vetro");
        turn(game, rest(game, "s"), rest(game, "b"));
        assertEquals(1, ch(game, "s").getStatuses().size());
        assertEquals(11, turn(game, move(game, "s", "Doppio HIT", "b"), rest(game, "b"))[1], "7 e 4 HIT dopo la corazza");
        assertTrue(ch(game, "s").getStatuses().isEmpty());
        assertEquals(6, turn(game, move(game, "s", "Doppio HIT", "b"), rest(game, "b"))[1]);
    }

    static Stream<Arguments> equipment() {
        return Stream.of(arguments("Guanti da Officina", GUANTI), arguments("Giubbotto di Finta Pelle", GIUBBOTTO),
                arguments("Casco da Cantiere", CASCO), arguments("Posacenere di Vetro", POSACENERE));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("equipment")
    void permessoRemovesTheEquipmentProducedByConsumption(String name, String binding) {
        Player opponent = b(card(EXCUSE_ME_SORRY_CAN_YOU_STOP));
        opponent.getCharacter().getResources().put(VIOLENCE, 5);
        Game game = game(s(consume()), opponent);
        ch(game, "s").getItems().add(card(binding));
        consumeItem(game, name);
        assertEquals(1, ch(game, "s").getStatuses().size());
        assertArrayEquals(new int[]{8, 0}, turn(game, rest(game, "s"),
                move(game, "b", "PERMESSO SCUSA PUOI SMETTERLA", "s")));
        assertTrue(ch(game, "s").getStatuses().isEmpty());
    }

    @Test
    void contoActsInTheTurnDrawnWithoutChangingHealthAndStopsWhenConsumed() {
        Player actor = player(character("s", 3, 3), List.of(consume()), List.of(card(CONTO), filler()), null);
        Game game = game(actor, b());
        assertArrayEquals(new int[]{0, 0}, turn(game, rest(game, "s"), rest(game, "b")));
        assertEquals(List.of("Conto del Tavolo Sei"), items(game, "s"));
        assertEquals(0, res(game, "s", ALERTNESS));
        ch(game, "s").getResources().put(ALERTNESS, 10);
        consumeItem(game, "Conto del Tavolo Sei");
        assertEquals(10, res(game, "s", ALERTNESS));
        assertEquals(16, res(game, "s", VIOLENCE), "1 dal riempitivo e 15 dall'oggetto");
        assertTrue(items(game, "s").isEmpty());
    }

    @Test
    void copiedContoActsOnBothOwnersAtTheEndOfItsArrivalTurn() {
        Game game = game(s(card(GOT_ANY_SPARE_CHANGE)), b());
        ch(game, "b").getItems().add(card(CONTO));
        turn(game, move(game, "s", "Ce l'Hai Due Spicci?", "b"), rest(game, "b"));
        assertEquals(List.of("Conto del Tavolo Sei"), items(game, "s"));
        assertEquals(List.of("Conto del Tavolo Sei"), items(game, "b"));
        assertEquals(56, res(game, "s", ALERTNESS));
        assertEquals(6, res(game, "b", ALERTNESS));
    }

    @Test
    void sigarettaAddsTAfterPeriodicPoisonAndStopsAddingItOnConsumption() {
        Player actor = player(character("s", 60, 3), List.of(consume()), List.of(card(SIGARETTA), filler(), filler()), null);
        Game game = game(actor, b());
        assertEquals(0, turn(game, rest(game, "s"), rest(game, "b"))[0]);
        assertEquals(2, res(game, "s", TOXICITY));
        assertEquals(1, turn(game, rest(game, "s"), rest(game, "b"))[0]);
        assertEquals(4, res(game, "s", TOXICITY));
        assertEquals(2, consumeItem(game, "Sigaretta Accesa")[0]);
        assertEquals(4, res(game, "s", TOXICITY));
        assertEquals(70, res(game, "s", ALERTNESS));
    }

    @Test
    void sigarettaAlsoAddsTToTheImmunePlayerWhoStealsIt() {
        Player actor = player(character("s", 60, 3, TOXICITY), List.of(card(SLEIGHT_OF_HAND_THEFT)), fillers(10), null);
        Game game = game(actor, b());
        ch(game, "b").getItems().add(card(SIGARETTA));

        assertArrayEquals(new int[]{0, 0}, turn(game, onItem(game, "s", "Furto con Destrezza", "b", "Sigaretta Accesa"), rest(game, "b")));
        assertEquals(2, res(game, "s", TOXICITY));
        assertEquals(0, res(game, "b", TOXICITY));
        assertArrayEquals(new int[]{0, 0}, turn(game, rest(game, "s"), rest(game, "b")));
        assertEquals(4, res(game, "s", TOXICITY));
    }

    private static int[] consumeItem(Game game, String name) {
        return turn(game, onItem(game, "s", "Consuma", "s", name), rest(game, "b"));
    }
}
