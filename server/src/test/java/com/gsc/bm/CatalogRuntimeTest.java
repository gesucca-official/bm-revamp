package com.gsc.bm;
import com.gsc.bm.repo.internal.CardsGuiRepository;
import com.gsc.bm.service.factories.*;
import com.gsc.bm.model.game.Player;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.util.stream.Stream;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Tag("context")
class CatalogRuntimeTest extends SqliteContextSupport {
    @Autowired CardsGuiRepository catalog;
    @Autowired CardFactoryService cards;
    @Autowired CharacterFactoryService characters;
    @Autowired DeckFactoryService decks;
    @TestFactory Stream<DynamicTest> everyCatalogBindingLoads() {
        assertEquals(37, catalog.count());
        return catalog.findAll().stream().map(row -> DynamicTest.dynamicTest(row.getClazz(), () -> {
            var card = cards.craftCard(row.getClazz());
            assertNotNull(card.getName()); assertNotNull(row.getGuiImage());
            assertNotNull(card.getEffect());
            assertNotSame(card, cards.craftCard(row.getClazz()));
            // R07a descriptive role and gains travel from SQLite to the card JSON.
            var loaded = (com.gsc.bm.model.cards.AbstractCard) card;
            assertEquals(row.getGuiRole(), loaded.getRole()); assertEquals(row.getGuiGains(), loaded.getGains());
            assertTrue(java.util.Set.of("DAMAGE","DEFENSE","RESOURCES","COUNTER","DISRUPT","ITEMS","OTHER").contains(loaded.getRole()));
            // R07a 1.9 nominal damage travels the same way.
            assertEquals(row.getGuiDamage(), loaded.getDamage());
            assertTrue(loaded.getDamage().matches("—|(HIT|CUT|POISON)(, (HIT|CUT|POISON))*"), loaded.getDamage());
        }));
    }
    @ParameterizedTest @ValueSource(strings = {"bruiser.character.BigBadBruiser", "junkie.character.ToxicJunkie"})
    void startersAndOpeningHand(String binding) {
        var character = characters.craftCharacter(binding);
        var deck = decks.craftCharacterStarterDeck(binding);
        assertEquals(20, deck.size()); assertTrue(deck.stream().noneMatch(java.util.Objects::isNull));
        var basic = decks.craftBasicActionStarterCard(character);
        var bound = decks.craftCharacterBoundStarterCards(character);
        var last = decks.craftLastResortStarterCard(character);
        assertTrue(basic.isBasicAction()); assertEquals(2, bound.size());
        assertTrue(bound.stream().allMatch(c -> c.isCharacterBound())); assertTrue(last.isLastResort());
        var player = new Player("synthetic", character, basic, bound, last, deck);
        assertEquals(6, player.getCardsInHand().size());
        assertTrue(player.getCardsInHand().contains(basic)); assertTrue(player.getCardsInHand().containsAll(bound));
        assertTrue(player.getCardsInHand().stream().noneMatch(c -> c.isItem()));
        assertTrue(character.getItems().size() <= character.getItemsSize());
    }
    @Test void invalidBindingsFailExplicitly() {
        assertThrows(IllegalArgumentException.class, () -> cards.craftCard("missing.NoSuchCard"));
        assertThrows(IllegalArgumentException.class, () -> characters.craftCharacter("com.Grab"));
        assertThrows(IllegalArgumentException.class, () -> cards.craftCard("bruiser.character.BigBadBruiser"));
    }
}
