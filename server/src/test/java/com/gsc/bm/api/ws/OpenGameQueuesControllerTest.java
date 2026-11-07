package com.gsc.bm.api.ws;

import com.gsc.bm.service.account.InvalidDeckException;
import com.gsc.bm.service.factories.GameFactoryService;
import com.gsc.bm.service.factories.ValueNotFoundException;
import com.gsc.bm.service.session.GameSessionService;
import com.gsc.bm.service.session.QueueService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

class OpenGameQueuesControllerTest {
    private final OpenGameQueuesController controller = new OpenGameQueuesController(mock(GameFactoryService.class),
            mock(GameSessionService.class), mock(QueueService.class));

    // R02 1.12: a deck saved under older rules names the broken rule; a missing deck keeps the I16 text.
    @Test void savedDeckBreakingTheDeckRulesNamesTheRule() {
        assertEquals("Invalid deck: Exactly 20 regular cards required, found 1. Edit or delete it in your collection.",
                controller.deckUnavailable(new InvalidDeckException("Exactly 20 regular cards required, found 1")));
        assertEquals("Deck unavailable. Choose a saved deck from your account and retry.",
                controller.deckUnavailable(new ValueNotFoundException("Deck unavailable")));
        assertEquals("Deck unavailable. Choose a saved deck from your account and retry.",
                controller.deckUnavailable(new IllegalArgumentException("Cannot load card binding: missing.Card")));
    }
}
