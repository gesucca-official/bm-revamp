package com.gsc.bm;

import com.gsc.bm.model.Character;
import com.gsc.bm.repo.external.UserCredentialsRecord;
import com.gsc.bm.repo.external.UserDecksRecord;
import com.gsc.bm.repo.external.UserDecksRecord.UserStoredDeck;
import com.gsc.bm.repo.external.UserDecksRepository;
import com.gsc.bm.repo.external.UserCredentialsRepository;
import com.gsc.bm.service.account.DeckRules;
import com.gsc.bm.service.account.InvalidDeckException;
import com.gsc.bm.service.account.UserAccountService;
import com.gsc.bm.service.factories.CardFactoryService;
import com.gsc.bm.service.factories.DeckFactoryService;
import com.gsc.bm.service.factories.PlayerFactoryService;
import com.gsc.bm.model.cards.base.SetBaseIds;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static com.gsc.bm.model.cards.base.SetBaseIds.*;

/** Regulation 1.12 R02 on the real catalog and factories: starters conform, saved decks under older rules are kept but not played. */
@SpringBootTest
@Tag("context")
class DeckRulesContextTest extends SqliteContextSupport {
    @Autowired CardFactoryService cards;
    @Autowired DeckFactoryService starters;
    @Autowired PlayerFactoryService players;
    @Autowired UserDecksRepository decks;
    @Autowired UserCredentialsRepository users;
    @Autowired UserAccountService accounts;

    @Test
    void everyStarterFollowsTheDeckRules() {
        // SB-28, D184 (1): the characters are those of the live set (Set Base 1.0), and so are the five starters.
        for (String starter : LiveFixtures.set().starters()) {
            Character character = LiveFixtures.character(LiveFixtures.set().characterOf(starter));
            String binding = character.getBindingName();
            DeckRules.check(binding, starters.craftBasicActionStarterCard(character), starters.craftCharacterBoundStarterCards(character),
                    starters.craftLastResortStarterCard(character), starters.craftCharacterStarterDeck(binding));
        }
    }

    @Test
    void catalogReservesEachBasicToItsCharacterAndStruggleIsGeneric() {
        assertEquals(SetBaseIds.SPAZIENZIO, cards.craftCard(LET_US_USE_YOU).getExclusiveToCharacter());
        assertEquals(SetBaseIds.CELESTINA, cards.craftCard(UNCONTROLLABLE_CRAVING).getExclusiveToCharacter());
        assertNull(cards.craftCard(AT_HIM).getExclusiveToCharacter());
        assertNull(cards.craftCard(PATIENCE_OVER).getExclusiveToCharacter());
        assertEquals(SetBaseIds.SPAZIENZIO, cards.craftCard(WAKE_UP_BUT_NOT_YOU).getBoundToCharacter());
    }

    @Test
    void savedDeckUnderOlderRulesIsListedButNotPlayed() {
        String user = "sb1-" + java.util.UUID.randomUUID();
        users.save(new UserCredentialsRecord(user, null, "synthetic-hash", "USER"));
        // SB-28: «Shuffle Feet» left the set with the 0.1; a live card of the Set Base 1.0 takes its place.
        List<String> twenty = new ArrayList<>();
        for (String card : List.of(PATIENCE_OVER, STUN_YOU_I_SAID, GARGANTUAN_IMPACT_ON_YOU, THATS_ENOUGH, DONT_PLAY_WITH_THE_KNIFE,
                SetBaseIds.GRAB, SLEIGHT_OF_HAND_THEFT, SHIP_YOU_TO_OUCHIO, SEAGULL_SO_LET_US_FLY_YOU, NOW_LET_US_HEAL_YOU))
            twenty.addAll(Collections.nCopies(2, card));
        List<String> bound = List.of(WAKE_UP_BUT_NOT_YOU, SLIGHT_ANNOYANCE);
        // Saved before 1.12 (straight into the repository): one regular card, valid under 1.11.
        decks.save(new UserDecksRecord(user, "old", new UserStoredDeck(SetBaseIds.SPAZIENZIO, LET_US_USE_YOU,
                AT_HIM, List.of(), List.of(SHIP_YOU_TO_OUCHIO))));
        decks.save(new UserDecksRecord(user, "foreign-bound", new UserStoredDeck(SetBaseIds.SPAZIENZIO, LET_US_USE_YOU,
                AT_HIM, List.of(WAKE_UP_BUT_NOT_YOU, ASHTRAY_BOTTOM), twenty)));
        decks.save(new UserDecksRecord(user, "valid", new UserStoredDeck(SetBaseIds.SPAZIENZIO, LET_US_USE_YOU,
                AT_HIM, bound, twenty)));

        assertEquals(3, accounts.loadUserAccountInfo(user).getDecks().size(), "D20: nothing is deleted, the decks stay visible");
        var old = assertThrows(InvalidDeckException.class, () -> players.craftOpenPlayer(user, "old"));
        assertEquals("Two different bound cards of the character required, found 0", old.getMessage());
        var foreign = assertThrows(InvalidDeckException.class, () -> players.craftOpenPlayer(user, "foreign-bound"));
        assertEquals("Bound card of another character: junkie.character.PatheticBlade", foreign.getMessage());
        var player = players.craftOpenPlayer(user, "valid");
        assertEquals(6, player.getCardsInHand().size());
        assertEquals(3, player.getInitialSpecialCards().size(), "R02 1.12: always three initial cards");
        assertEquals(20, player.getDeckSize() + player.getCardsInHand().size() - 3 + player.getCharacter().getItems().size());
    }
}
