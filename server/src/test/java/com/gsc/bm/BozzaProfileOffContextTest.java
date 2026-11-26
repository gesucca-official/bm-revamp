package com.gsc.bm;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.repo.external.UserCredentialsRecord;
import com.gsc.bm.repo.external.UserCredentialsRepository;
import com.gsc.bm.repo.internal.CardsGuiRecord;
import com.gsc.bm.repo.internal.CharactersGuiRecord;
import com.gsc.bm.repo.internal.CardsGuiRepository;
import com.gsc.bm.repo.internal.CharactersGuiRepository;
import com.gsc.bm.service.account.UserAccountService;
import com.gsc.bm.service.account.model.UserAccountInfo;
import com.gsc.bm.service.account.model.UserGuiDeck;
import com.gsc.bm.service.catalog.CatalogSource;
import com.gsc.bm.service.catalog.LiveSet;
import com.gsc.bm.service.catalog.SqliteCatalogSource;
import com.gsc.bm.service.factories.*;
import com.gsc.bm.service.session.MatchVersions;
import com.gsc.bm.service.view.ViewExtractorService;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.aop.support.AopUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.Profiles;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static com.gsc.bm.model.cards.base.SetBaseIds.*;

/**
 * SB-8: with the normal profile no bean of the draft profile is active, and the catalog seam answers exactly as SQLite does.
 * SB-28 (D182, D183): the normal profile plays the live Set Base 1.0, so the cards and characters of the set are reachable; what
 * stays unreachable without the draft profile is what is not in the live set: the cards of the 0.1 that left it, the cards of the
 * measures only, the test decks and the ready decks of the draft profile. Every entry point still goes through the SQLite catalog.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Tag("context")
class BozzaProfileOffContextTest extends SqliteContextSupport {
    /** SB-28: cards of the 0.1 that left the set (their classes are among the test sources) and cards of the measures only. */
    private static final List<String> OUT_OF_THE_LIVE_SET = List.of("com.ShuffleFeet", "junkie.BadTrip", "junkie.GoingBerserk", "junkie.EverythingIsDrug",
            "junkie.BeggingMoney", "bruiser.WhatchaDoin", "bitch.SoberUp", "mini.CalcioAlBidone", "mini.RintoccoDiCampana");

    @Autowired ApplicationContext context;
    @Autowired UserAccountService accounts;
    @Autowired UserCredentialsRepository users;
    @Autowired PasswordEncoder encoder;
    @Autowired PlayerFactoryService players;
    @Autowired CardFactoryService cards;
    @Autowired CharacterFactoryService characters;
    @Autowired CatalogSource catalog;
    @Autowired ViewExtractorService views;
    @Autowired MatchVersions versions;
    @Autowired CardsGuiRepository cardRows;
    @Autowired CharactersGuiRepository characterRows;
    @Autowired LiveSet live;

    private Set<String> liveCards() { return cardRows.findAll().stream().map(CardsGuiRecord::getClazz).collect(Collectors.toSet()); }

    @Test
    void noDraftBeanWithoutTheProfile() {
        assertFalse(context.getEnvironment().acceptsProfiles(Profiles.of("bozza")));
        for (String name : context.getBeanDefinitionNames()) {
            Class<?> type = context.getType(name);
            if (type == null) continue;
            assertFalse(type.getName().startsWith("com.gsc.bm.bozza.") || type.getName().startsWith("com.gsc.bm.sim."), name);
        }
        assertTrue(context.getBeansOfType(MatchVersions.DraftIdentity.class).isEmpty());
        assertEquals(SqliteCatalogSource.class, AopUtils.getTargetClass(catalog));
        assertEquals(CardFactoryServiceImpl.class, AopUtils.getTargetClass(cards));
        assertEquals(CharacterFactoryServiceImpl.class, AopUtils.getTargetClass(characters));
        assertEquals(PlayerFactoryServiceImpl.class, AopUtils.getTargetClass(players));
    }

    @Test
    void collectionIsTheSqliteCatalog() {
        users.createIfAbsent(new UserCredentialsRecord("sb8Live", null, encoder.encode("synthetic"), "USER"));
        UserAccountInfo info = accounts.loadUserAccountInfo("sb8Live");
        Set<String> shownCards = info.getCollection().getCards().stream().map(Card::getBindingName).collect(Collectors.toSet());
        Set<String> shownCharacters = info.getCollection().getCharacters().stream().map(c -> c.getBindingName()).collect(Collectors.toSet());
        assertEquals(liveCards(), shownCards);
        assertEquals(characterRows.findAll().stream().map(CharactersGuiRecord::getClazz).collect(Collectors.toSet()), shownCharacters);
        // SB-28: the SQLite catalog is the live set file, card by card and character by character.
        assertEquals(Set.copyOf(live.set().cardBindings()), shownCards);
        assertEquals(Set.copyOf(live.set().characterIds()), shownCharacters);
        assertTrue(info.getDecks().isEmpty(), "no ready deck in the live catalog");
        assertTrue(catalog.readyDecks().isEmpty());
    }

    @Test
    void whatIsNotInTheLiveSetIsUnreachable() throws Exception {
        // SB-28: the classes of the 0.1 cards that left the set moved to the test sources; with the cards of the measures, no
        // factory crafts them without a row of the live catalog.
        for (String binding : OUT_OF_THE_LIVE_SET) {
            assertThrows(IllegalArgumentException.class, () -> cards.craftCard(binding), binding);
            assertFalse(catalog.hasCard(binding), binding);
        }
        users.createIfAbsent(new UserCredentialsRecord("sb8Saver", null, encoder.encode("synthetic"), "USER"));
        // A deck that is valid with the live cards except one card out of the set: refused as an unknown card. The starter
        // «Spazienzio» with its last regular card replaced.
        DraftSourceDeck spazienzio = new DraftSourceDeck(live, STARTER_SPAZIENZIO);
        Card out = mock(Card.class);
        when(out.getBindingName()).thenReturn("com.ShuffleFeet");
        List<Card> regular = new ArrayList<>();
        List<String> bindings = spazienzio.regular;
        for (int i = 0; i < bindings.size(); i++)
            regular.add(bindings.get(i).equals(bindings.get(bindings.size() - 1)) ? out : cards.craftCard(bindings.get(i)));
        UserGuiDeck deck = new UserGuiDeck("sb8-out", characters.craftCharacterView(spazienzio.character),
                cards.craftCard(spazienzio.basic), cards.craftCard(spazienzio.lastResort),
                spazienzio.bound.stream().map(cards::craftCard).collect(Collectors.toList()), regular);
        IllegalArgumentException refused = assertThrows(IllegalArgumentException.class, () -> accounts.addUserDeck("sb8Saver", deck));
        assertEquals("Unknown or missing card", refused.getMessage());
        // Open plays saved decks only: the starters and the test decks are not ready decks of the live game.
        for (String ready : List.of(STARTER_MARA, STARTER_PIERA, STARTER_BEPPE, STARTER_SPAZIENZIO, STARTER_CELESTINA, "prova-sergio", "prova-duccio"))
            assertThrows(ValueNotFoundException.class, () -> players.craftOpenPlayer("sb8Saver", ready), ready);
    }

    /** A deck of the live set file, by binding. */
    private static final class DraftSourceDeck {
        final String character, basic, lastResort;
        final List<String> bound, regular;

        DraftSourceDeck(LiveSet live, String id) {
            var set = live.set();
            character = set.characterOf(id);
            basic = set.basicOf(id);
            lastResort = set.lastResortOf(id);
            bound = set.boundOf(id);
            regular = set.regularOf(id);
        }
    }

    @Test
    void quickPlayersComeFromSqlite() {
        Set<String> catalogCards = liveCards();
        for (int i = 0; i < 50; i++) {
            for (Player player : List.of(players.craftRandomPlayer("sb8Quick",null), players.craftComPlayer(null, com.gsc.bm.model.game.bot.ComLevel.FACILE))) {
                // SB-28 (D182 (1)): one of the five starters of the live set.
                assertTrue(live.starters().stream().map(live.set()::characterOf).anyMatch(player.getCharacter().getBindingName()::equals),
                        player.getCharacter().getBindingName());
                List<Card> all = new ArrayList<>(player.getCardsInHand());
                all.addAll(player.getDeck());
                all.add(player.getLastResortCard());
                for (Card card : all) assertTrue(catalogCards.contains(card.getBindingName()), card.getBindingName());
            }
            // SB-30a (D203 (3)): the live computer is a BotPlayer on the BotView; at Facile its policy is RandomPolicy.
            Player computer = players.craftComPlayer(null, com.gsc.bm.model.game.bot.ComLevel.FACILE);
            assertEquals(com.gsc.bm.model.game.bot.BotPlayer.class, computer.getClass(), "live computer: a BotPlayer");
            assertEquals("RandomPolicy", ((com.gsc.bm.model.game.bot.BotPlayer) computer).policyName(), "live computer at Facile");
        }
    }

    @Test
    void versionsHaveNoDraft() {
        assertFalse(versions.get().containsKey("draft"));
        assertEquals(new MatchVersions().get(), versions.get());
    }

    @Test
    void characterTextsByBindingAreTheSqliteRows() {
        // The view now looks characters up by binding: for every live class it is the old key, the class name without the package.
        for (CharactersGuiRecord row : characterRows.findAll()) {
            var character = characters.craftCharacter(row.getClazz());
            assertEquals(row.getClazz(), character.getBindingName());
            var view = views.extractDeckBuildingView(character);
            assertEquals(row.getGuiName(), view.getName());
            assertEquals(row.getGuiImage(), view.getSprite());
        }
    }
}
