package com.gsc.bm.service.factories;

import com.gsc.bm.model.game.bot.BotPlayer;
import com.gsc.bm.model.game.bot.ComLevel;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.repo.external.UserDecksRepository;
import com.gsc.bm.repo.internal.CardKeywordsRecord;
import com.gsc.bm.repo.internal.CardKeywordsRepository;
import com.gsc.bm.service.catalog.LiveSet;
import com.gsc.bm.service.session.model.QueuedPlayer;
import com.gsc.bm.service.view.ViewExtractorService;
import org.junit.jupiter.api.Test;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * SB-28 (D182 (1)): quick deals one of the five starters of the live set at random, to every human and to the computer.
 * SB-29 (R01 2.1, D190): the human may choose a category, the starter is drawn inside it, the computer of the quick against the
 * computer follows; without a category, any of the five. The expectations come from the categories of the set file, not from
 * names written here.
 */
class QuickStartersTest {

    private final LiveSet live;

    QuickStartersTest() throws Exception { live = new LiveSet(); }

    private PlayerFactoryServiceImpl players(long seed) {
        CardKeywordsRepository keywords = mock(CardKeywordsRepository.class);
        CardKeywordsRecord keyword = mock(CardKeywordsRecord.class);
        when(keyword.getHtml()).thenReturn("keyword");
        when(keywords.findById(anyString())).thenReturn(Optional.of(keyword));
        CardFactoryServiceImpl cards = new CardFactoryServiceImpl(live, keywords);
        return new PlayerFactoryServiceImpl(live, new CharacterFactoryServiceImpl(live, mock(ViewExtractorService.class)),
                mock(UserDecksRepository.class), cards, new Random(seed));
    }

    private Set<String> startersOf(String category) {
        return live.starters().stream().filter(d -> category.equals(live.set().deckCategory(d))).collect(Collectors.toSet());
    }

    private Set<String> categories() {
        return live.starters().stream().map(live.set()::deckCategory).collect(Collectors.toCollection(TreeSet::new));
    }

    private String deckOf(Player p) {
        String character = p.getCharacter().getBindingName();
        return live.starters().stream().filter(d -> live.set().characterOf(d).equals(character)).findFirst().orElseThrow();
    }

    @Test
    void quickDealsEveryOneOfTheFiveStartersWithItsWholeDeck() {
        PlayerFactoryServiceImpl players = players(1);
        Set<String> dealt = new HashSet<>();
        for (int i = 0; i < 400; i++) dealt.add(players.randomStarter(null));
        assertEquals(Set.copyOf(live.starters()), dealt, "no category: in 400 deals every starter comes out and no other");
        assertEquals(5, dealt.size());

        Set<String> characters = new HashSet<>();
        for (int i = 0; i < 200; i++) {
            Player human = players.craftRandomPlayer("umano", null);
            Player com = players.craftComPlayer(null, ComLevel.FACILE);
            assertTrue(com instanceof BotPlayer); // SB-30a (D203 (3)): the live computer is a BotPlayer, no more the random ComPlayer
            assertTrue(com.getPlayerId().startsWith("ComPlayer_"), com.getPlayerId());
            for (Player p : List.of(human, com)) {
                String character = p.getCharacter().getBindingName();
                characters.add(character);
                String deck = deckOf(p);
                List<String> special = new ArrayList<>(List.of(live.set().basicOf(deck)));
                special.addAll(live.set().boundOf(deck));
                assertEquals(special, p.getInitialSpecialCards(), character);
                assertEquals(live.set().lastResortOf(deck), p.getLastResortCard().getBindingName());
                List<String> regular = new ArrayList<>(p.getInitialDeckDrawOrder());
                List<String> expected = new ArrayList<>(live.set().regularOf(deck));
                Collections.sort(regular);
                Collections.sort(expected);
                assertEquals(20, regular.size(), character);
                assertEquals(expected, regular, character);
            }
        }
        assertEquals(5, characters.size(), "the five characters of the starters: " + characters);
    }

    @Test
    void aCategoryDealsExactlyItsOwnStartersAndAllOfThem() {
        assertTrue(categories().size() >= 2, "the set has more than one category: " + categories());
        PlayerFactoryServiceImpl players = players(7);
        for (String category : categories()) {
            Set<String> expected = startersOf(category);
            assertFalse(expected.isEmpty(), category);
            Set<String> dealt = new HashSet<>();
            for (int i = 0; i < 400; i++) dealt.add(players.randomStarter(category));
            assertEquals(expected, dealt, category + ": all its starters come out and no other");
            Set<String> humans = new HashSet<>(), coms = new HashSet<>();
            for (int i = 0; i < 400; i++) {
                humans.add(deckOf(players.craftRandomPlayer("umano", category)));
                coms.add(deckOf(players.craftComPlayer(category, ComLevel.NORMALE)));
            }
            assertEquals(expected, humans, category + " (human)");
            assertEquals(expected, coms, category + " (computer)");
        }
    }

    @Test
    void theDrawInsideACategoryIsUniform() {
        PlayerFactoryServiceImpl players = players(11);
        for (String category : categories()) {
            Map<String, Integer> counts = new HashMap<>();
            int n = 3000;
            for (int i = 0; i < n; i++) counts.merge(players.randomStarter(category), 1, Integer::sum);
            double share = 1.0 / startersOf(category).size();
            for (var e : counts.entrySet())
                assertEquals(share, e.getValue() / (double) n, 0.05, category + " " + e.getKey());
        }
    }

    @Test
    void anUnknownCategoryIsRefusedNotFolded() {
        PlayerFactoryServiceImpl players = players(3);
        for (String bad : List.of("esperto", "Base", "AVANZATO", " base", "base ")) {
            assertThrows(IllegalArgumentException.class, () -> players.randomStarter(bad), bad);
            assertThrows(IllegalArgumentException.class, () -> players.craftRandomPlayer("umano", bad), bad);
            assertThrows(IllegalArgumentException.class, () -> players.craftComPlayer(bad, ComLevel.FACILE), bad);
            assertThrows(IllegalArgumentException.class, () -> players.checkCategory(bad), bad);
        }
        assertNull(players.checkCategory(null), "no category");
        assertNull(players.checkCategory(""), "empty header is no category");
        assertNull(players.checkCategory("  "), "blank header is no category");
        for (String category : categories()) assertEquals(category, players.checkCategory(category));
    }

    @Test
    void theSeedMakesTheDrawRepeatable() {
        List<String> first = new ArrayList<>(), second = new ArrayList<>();
        PlayerFactoryServiceImpl a = players(42), b = players(42);
        for (int i = 0; i < 50; i++) { first.add(a.randomStarter(null)); second.add(b.randomStarter(null)); }
        assertEquals(first, second);
    }

    @Test
    void theCategoryOfAQueuedPlayerIsNotItsIdentity() {
        // leaveAllQueues rebuilds the player without it (SessionLifecycleController, ActiveSessions, PresenceEventListener).
        QueuedPlayer chosen = new QueuedPlayer("umano", true, categories().iterator().next());
        assertEquals(new QueuedPlayer("umano", true), chosen);
        assertEquals(new QueuedPlayer("umano", true).hashCode(), chosen.hashCode());
        assertNotEquals(new QueuedPlayer("altro", true), chosen);
    }
}
