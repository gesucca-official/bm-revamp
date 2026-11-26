package com.gsc.bm.sim;

import com.gsc.bm.model.Resource;
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
import static com.gsc.bm.model.cards.base.SetBaseIds.*;

/** RP-27 sulla carta effettiva, attraverso tutte le transizioni di proprietà e uscita scritte nelle due schede. */
class Sb27InPlayClausesTest {
    private static final String ESPRESSO = VENDING_MACHINE_ESPRESSO;

    @BeforeAll
    static void loadDraft() throws Exception { load(); }

    static Stream<Arguments> sheets() {
        return Stream.of(
                arguments("OGG-17", TABLE_SIX_BILL, "Conto del Tavolo Sei", ALERTNESS, 60, 10, 56, 6, 46),
                arguments("OGG-18", LIT_CIGARETTE, "Sigaretta Accesa", TOXICITY, 0, 0, 2, 2, 2));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("sheets")
    void theftSwapAndCopySelectTheHolderAtTheEndOfTheTurn(String slot, String binding, String name, Resource resource,
                                                          int baseS, int baseB, int activeS, int activeB, int stolenS) {
        Game theft = game(s(card(SLEIGHT_OF_HAND_THEFT)), b());
        ch(theft, "b").getItems().add(card(binding));
        turn(theft, onItem(theft, "s", "Furto con Destrezza", "b", name), rest(theft, "b"));
        assertEquals(List.of(name), items(theft, "s"));
        assertEquals(stolenS, res(theft, "s", resource), slot);
        assertEquals(baseB, res(theft, "b", resource));

        Game swap = game(s(card(SUDDEN_DASH)), b());
        ch(swap, "s").getItems().add(card(binding));
        turn(swap, move(swap, "s", "Scatto Repentino", "b"), rest(swap, "b"));
        assertEquals(List.of(), items(swap, "s"));
        assertEquals(List.of(name), items(swap, "b"));
        assertEquals(baseS, res(swap, "s", resource));
        assertEquals(activeB, res(swap, "b", resource));

        Game copy = game(s(card(GOT_ANY_SPARE_CHANGE)), b());
        ch(copy, "b").getItems().add(card(binding));
        turn(copy, move(copy, "s", "Ce l'Hai Due Spicci?", "b"), rest(copy, "b"));
        assertEquals(List.of(name), items(copy, "s"));
        assertEquals(List.of(name), items(copy, "b"));
        assertEquals(activeS, res(copy, "s", resource));
        assertEquals(activeB, res(copy, "b", resource));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("sheets")
    void saleDestructionAndOverflowStopTheInPlayEffect(
            String slot, String binding, String name, Resource resource, int baseS, int baseB, int activeS, int activeB, int stolenS) {
        Game sale = game(s(card(NOSE_FOR_BUSINESS)), b());
        ch(sale, "s").getItems().add(card(binding));
        assertArrayEquals(new int[]{-8, 0}, turn(sale, onItem(sale, "s", "Fiuto per gli Affari", "s", name), rest(sale, "b")));
        assertEquals(baseS, res(sale, "s", resource), slot);
        assertTrue(items(sale, "s").isEmpty());

        Player destroyer = b(card(DISASSEMBLE));
        destroyer.getCharacter().getResources().put(VIOLENCE, 5);
        Game destruction = game(s(), destroyer);
        ch(destruction, "s").getItems().add(card(binding));
        turn(destruction, rest(destruction, "s"), onItem(destruction, "b", "Disassemblare", "s", name));
        assertEquals(baseS, res(destruction, "s", resource));
        assertTrue(items(destruction, "s").isEmpty());

        Player collector = player(character("s", 60, 1), List.of(), List.of(card(ESPRESSO), filler()), null);
        Game overflow = game(collector, b());
        ch(overflow, "s").getItems().add(card(binding));
        turn(overflow, rest(overflow, "s"), rest(overflow, "b"));
        assertEquals(List.of("Espresso della Macchinetta"), items(overflow, "s"));
        assertEquals(baseS, res(overflow, "s", resource));
    }
}
