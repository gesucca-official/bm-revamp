package com.gsc.bm.sim;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.cards.base.SetBaseIds;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.stream.Stream;

import static com.gsc.bm.model.Resource.*;
import static com.gsc.bm.sim.Sb27Table.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.params.provider.Arguments.arguments;
import static com.gsc.bm.model.cards.base.SetBaseIds.*;

/** Risorse, capacità, immunità e azione base delle sette schede personaggio. */
class Sb27CharacterSheetsTest {
    private static Draft draft;

    @BeforeAll
    static void loadDraft() throws Exception {
        load();
        draft = Draft.fromClasspath("/set-base/bozza.json");
    }

    static Stream<Arguments> sheets() {
        return Stream.of(
                arguments("PG-SPA", SetBaseIds.SPAZIENZIO, STARTER_SPAZIENZIO, "ADOPERIAMOTI", 70, 20, 25, 0, 0, 1, false),
                arguments("PG-MAR", SetBaseIds.MARA, STARTER_MARA, "Requisire al Volo", 65, 45, 0, 0, 0, 2, false),
                arguments("PG-TOS", SetBaseIds.CELESTINA, STARTER_CELESTINA, "Desiderio Incontrollabile", 65, 35, 0, 20, 0, 2, true),
                arguments("PG-PIN", SetBaseIds.PIERA, STARTER_PIERA, "Fino all'Ultima Goccia", 80, 15, 0, 0, 15, 2, false),
                arguments("PG-GIG", SetBaseIds.BEPPE, STARTER_BEPPE, "Questo Torna Utile", 75, 25, 25, 0, 0, 3, false),
                arguments("PG-CES", SetBaseIds.SERGIO, "prova-sergio", "Messo in Conto", 85, 35, 10, 0, 0, 2, false),
                arguments("PG-ROC", SetBaseIds.DUCCIO, "prova-duccio", "Prima gli Italiani", 115, 15, 0, 0, 0, 2, false));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("sheets")
    void aStartingPlayerHasTheSheetResourcesTheFixedBasicAndTheSheetItemCapacity(
            String slot, String binding, String deck, String basic, int h, int a, int v, int t, int l, int capacity, boolean immuneToT) {
        Player player = draft.player(deck, "personaggio", new Random(1), null);
        Character character = player.getCharacter();
        assertEquals(binding, character.getBindingName());
        assertEquals(Map.of(HEALTH, h, ALERTNESS, a, VIOLENCE, v, TOXICITY, t, ALCOHOL, l), character.getResources());
        assertEquals(immuneToT ? Set.of(TOXICITY) : Set.of(), character.getImmunities());
        assertEquals(List.of(basic), names(player.getCardsInHand().stream().filter(Card::isBasicAction).collect(java.util.stream.Collectors.toList())));

        Character withItems = draft.character(binding);
        List<Card> additions = List.of(card(WARM_BLONDE_66), card(VENDING_MACHINE_ESPRESSO),
                card(SITE_HELMET), card(WORKSHOP_GLOVES));
        for (Card item : additions) withItems.getItems().add(item);
        assertEquals(names(additions.subList(4 - capacity, 4)), names(withItems.getItems()),
                slot + ": alla capienza si perde il più vecchio");
    }

    @Test
    void celestinaIsImmuneToPeriodicPoisonButNotToPoisonDamage() {
        String binding = SetBaseIds.CELESTINA;
        Player celestina = player(draft.character(binding), List.of(), fillers(10), null);
        Game game = game(celestina, b(hit("POISON di prova", 1, null, "POISON 7")));
        assertArrayEquals(new int[]{7, 0}, turn(game, rest(game, binding), move(game, "b", "POISON di prova", binding)));
        assertEquals(20, res(game, binding, TOXICITY));
        assertEquals(58, health(game, binding));
    }
}
