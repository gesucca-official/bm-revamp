package com.gsc.bm;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.bruiser.character.BigBadBruiser;
import com.gsc.bm.model.cards.junkie.character.ToxicJunkie;
import com.gsc.bm.model.game.ComPlayer;
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

/**
 * SB-8: with the normal profile no card, character or deck of the set draft is reachable, and the catalog seam answers exactly
 * as SQLite did. The draft classes moved to the jar ({@code com.gsc.bm.sim}, {@code model.cards.base}) exist but are dead:
 * every entry point goes through the SQLite catalog first.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Tag("context")
class BozzaProfileOffContextTest extends SqliteContextSupport {
    private static final List<String> DRAFT_CARDS = List.of("base.pino.UltimoGiro", "base.pino.GoingBerserk", "base.pino.RuttoADistanzaSociale", "base.gigi.LavoroFattoBene",
            "base.mara.Sgommata", "base.mara.PresoAlVolo", "mini.CalcioAlBidone", "mini.RintoccoDiCampana");
    private static final List<String> DRAFT_CHARACTERS = List.of("base.character.Mara", "base.character.Pino", "base.character.Gigi");

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
        for (String binding : shownCards) assertFalse(binding.startsWith("base.") || binding.startsWith("mini."), binding);
        for (String binding : shownCharacters) assertFalse(binding.startsWith("base."), binding);
        assertTrue(info.getDecks().isEmpty(), "no ready deck in the live catalog");
        assertTrue(catalog.readyDecks().isEmpty());
    }

    @Test
    void draftCardsCharactersAndDecksAreUnreachable() throws Exception {
        // The classes are in the jar since SB-8: present, but no factory crafts them without a SQLite row.
        Class.forName("com.gsc.bm.model.cards.base.pino.UltimoGiro");
        for (String binding : DRAFT_CARDS) {
            assertThrows(IllegalArgumentException.class, () -> cards.craftCard(binding), binding);
            assertFalse(catalog.hasCard(binding), binding);
        }
        for (String id : DRAFT_CHARACTERS) {
            assertThrows(IllegalArgumentException.class, () -> characters.craftCharacter(id), id);
            assertFalse(catalog.hasCharacter(id), id);
            assertTrue(catalog.characterGui(id).isEmpty(), id);
        }
        users.createIfAbsent(new UserCredentialsRecord("sb8Saver", null, encoder.encode("synthetic"), "USER"));
        // A deck that is valid with the live cards except one draft card: refused as an unknown card.
        Card draft = mock(Card.class);
        when(draft.getBindingName()).thenReturn("base.mara.Sgommata");
        List<Card> regular = new ArrayList<>();
        for (String binding : List.of("bruiser.Glare", "bruiser.StunningBlow", "bruiser.SuperImpact", "bruiser.YouStop", "bruiser.MadeOfStone",
                "bruiser.SeagullFly", "bruiser.HealingBlow", "com.ShuffleFeet", "com.Grab"))
            for (int i = 0; i < 2; i++) regular.add(cards.craftCard(binding));
        regular.add(draft);
        regular.add(draft);
        UserGuiDeck deck = new UserGuiDeck("sb8-draft", characters.craftCharacterView("bruiser.character.BigBadBruiser"),
                cards.craftCard("com.basic.BruiserGrab"), cards.craftCard("com.last.Struggle"),
                List.of(cards.craftCard("bruiser.character.LittleSmack"), cards.craftCard("bruiser.character.LittleRage")), regular);
        IllegalArgumentException refused = assertThrows(IllegalArgumentException.class, () -> accounts.addUserDeck("sb8Saver", deck));
        assertEquals("Unknown or missing card", refused.getMessage());
        for (String ready : List.of("starter-mara", "starter-pino", "starter-gigi", "starter-spazienzio", "starter-tossico"))
            assertThrows(ValueNotFoundException.class, () -> players.craftOpenPlayer("sb8Saver", ready), ready);
    }

    @Test
    void quickPlayersComeFromSqlite() {
        Set<String> live = liveCards();
        for (int i = 0; i < 50; i++) {
            for (Player player : List.of(players.craftRandomPlayer("sb8Quick"), players.craftRandomComPlayer())) {
                assertTrue(player.getCharacter() instanceof BigBadBruiser || player.getCharacter() instanceof ToxicJunkie);
                List<Card> all = new ArrayList<>(player.getCardsInHand());
                all.addAll(player.getDeck());
                all.add(player.getLastResortCard());
                for (Card card : all) assertTrue(live.contains(card.getBindingName()), card.getBindingName());
            }
            assertEquals(ComPlayer.class, players.craftRandomComPlayer().getClass(), "live computer: the random ComPlayer");
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
