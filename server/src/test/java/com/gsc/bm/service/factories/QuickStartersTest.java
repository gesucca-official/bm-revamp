package com.gsc.bm.service.factories;

import com.gsc.bm.model.game.ComPlayer;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.repo.external.UserDecksRepository;
import com.gsc.bm.repo.internal.CardKeywordsRecord;
import com.gsc.bm.repo.internal.CardKeywordsRepository;
import com.gsc.bm.service.catalog.LiveSet;
import com.gsc.bm.service.view.ViewExtractorService;
import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/** SB-28 (D182 (1)): quick deals one of the five starters of the live set at random, to every human and to the computer. */
class QuickStartersTest {

    @Test
    void quickDealsEveryOneOfTheFiveStartersWithItsWholeDeck() throws Exception {
        LiveSet live = new LiveSet();
        CardKeywordsRepository keywords = mock(CardKeywordsRepository.class);
        CardKeywordsRecord keyword = mock(CardKeywordsRecord.class);
        when(keyword.getHtml()).thenReturn("keyword");
        when(keywords.findById(anyString())).thenReturn(Optional.of(keyword));
        CardFactoryServiceImpl cards = new CardFactoryServiceImpl(live, keywords);
        PlayerFactoryServiceImpl players = new PlayerFactoryServiceImpl(live,
                new CharacterFactoryServiceImpl(live, mock(ViewExtractorService.class)), mock(UserDecksRepository.class), cards);

        Set<String> dealt = new HashSet<>();
        for (int i = 0; i < 400 && dealt.size() < 5; i++) dealt.add(players.randomStarter());
        assertEquals(Set.copyOf(live.starters()), dealt, "in 400 deals every starter comes out");

        Set<String> characters = new HashSet<>();
        for (int i = 0; i < 200; i++) {
            Player human = players.craftRandomPlayer("umano");
            Player com = players.craftRandomComPlayer();
            assertTrue(com instanceof ComPlayer);
            for (Player p : java.util.List.of(human, com)) {
                String character = p.getCharacter().getBindingName();
                characters.add(character);
                String deck = live.starters().stream().filter(d -> live.set().characterOf(d).equals(character)).findFirst().orElseThrow();
                java.util.List<String> special = new java.util.ArrayList<>(java.util.List.of(live.set().basicOf(deck)));
                special.addAll(live.set().boundOf(deck));
                assertEquals(special, p.getInitialSpecialCards(), character);
                assertEquals(live.set().lastResortOf(deck), p.getLastResortCard().getBindingName());
                java.util.List<String> regular = new java.util.ArrayList<>(p.getInitialDeckDrawOrder());
                java.util.List<String> expected = new java.util.ArrayList<>(live.set().regularOf(deck));
                java.util.Collections.sort(regular);
                java.util.Collections.sort(expected);
                assertEquals(20, regular.size(), character);
                assertEquals(expected, regular, character);
            }
        }
        assertEquals(5, characters.size(), "the five characters of the starters: " + characters);
    }
}
