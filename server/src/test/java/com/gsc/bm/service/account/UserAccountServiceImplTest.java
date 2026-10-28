package com.gsc.bm.service.account;

import com.gsc.bm.repo.external.UserCredentialsRepository;
import com.gsc.bm.repo.external.UserDecksRepository;
import com.gsc.bm.repo.internal.CardsGuiRepository;
import com.gsc.bm.repo.internal.CharactersGuiRepository;
import com.gsc.bm.service.account.model.UserGuiDeck;
import com.gsc.bm.service.factories.CardFactoryService;
import com.gsc.bm.service.factories.CharacterFactoryService;
import com.gsc.bm.service.view.model.deck.CharacterCardView;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserAccountServiceImplTest {
    // R02 1.8: the open join destination carries the identifier as one path segment.
    @Test void deckIdentifierWithSlashIsRejectedBeforeSaving() {
        UserDecksRepository decks = mock(UserDecksRepository.class);
        CharactersGuiRepository characters = mock(CharactersGuiRepository.class);
        when(characters.existsById("bruiser.character.BigBadBruiser")).thenReturn(true);
        var service = new UserAccountServiceImpl(mock(UserCredentialsRepository.class), decks, mock(CardsGuiRepository.class),
                characters, mock(CardFactoryService.class), mock(CharacterFactoryService.class));
        var character = CharacterCardView.builder().bindingName("bruiser.character.BigBadBruiser").build();
        var error = assertThrows(IllegalArgumentException.class,
                () -> service.addUserDeck("devAlice", new UserGuiDeck("a/b", character, null, null, List.of(), List.of())));
        assertTrue(error.getMessage().contains("/"));
        verify(decks, never()).save(any());
    }
}
