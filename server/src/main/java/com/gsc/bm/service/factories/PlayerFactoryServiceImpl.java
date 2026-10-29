package com.gsc.bm.service.factories;

import com.gsc.bm.model.cards.bruiser.character.BigBadBruiser;
import com.gsc.bm.model.cards.junkie.character.ToxicJunkie;
import com.gsc.bm.model.game.ComPlayer;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.Character;
import com.gsc.bm.repo.external.UserDeckRecordKey;
import com.gsc.bm.repo.external.UserDecksRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class PlayerFactoryServiceImpl implements PlayerFactoryService {

    private final DeckFactoryService deckFactoryService;
    private final CharacterFactoryService characterFactoryService;
    private final UserDecksRepository userDecksRepo;
    private final CardFactoryService cards;

    @Autowired
    public PlayerFactoryServiceImpl(DeckFactoryService deckFactoryService, CharacterFactoryService characterFactoryService, UserDecksRepository userDecksRepo, CardFactoryService cards) {
        this.deckFactoryService = deckFactoryService;
        this.characterFactoryService = characterFactoryService;
        this.userDecksRepo = userDecksRepo;
        this.cards = cards;
    }

    @Override
    public Player craftRandomComPlayer() {
        Character chosenChar = randomPlayer();
        return new ComPlayer(chosenChar,
                deckFactoryService.craftBasicActionStarterCard(chosenChar),
                deckFactoryService.craftCharacterBoundStarterCards(chosenChar),
                deckFactoryService.craftLastResortStarterCard(chosenChar),
                deckFactoryService.craftCharacterStarterDeck(chosenChar.getClass().getName()));
    }

    @Override
    public Player craftRandomPlayer(String playerId) {
        Character chosenChar = randomPlayer();
        return new Player(playerId,
                chosenChar,
                deckFactoryService.craftBasicActionStarterCard(chosenChar),
                deckFactoryService.craftCharacterBoundStarterCards(chosenChar),
                deckFactoryService.craftLastResortStarterCard(chosenChar),
                deckFactoryService.craftCharacterStarterDeck(chosenChar.getClass().getName()));
    }

    @Override
    public Player craftOpenPlayer(String username, String deckId) {
        // One persisted snapshot; all runtime objects are newly crafted from its bindings.
        var deck = userDecksRepo.findById(new UserDeckRecordKey(username, deckId))
                .orElseThrow(() -> new ValueNotFoundException("Deck unavailable")).getDeck();
        return new Player(username,
                characterFactoryService.craftCharacter(deck.getCharacterClazz()),
                cards.craftCard(deck.getBasicActionCardClazz()),
                deck.getCharacterBoundCardsClazz().stream().map(cards::craftCard).collect(Collectors.toList()),
                cards.craftCard(deck.getLastResortCardClazz()),
                deck.getRegularCardsClazz().stream().map(cards::craftCard).collect(Collectors.toList()));
    }

    private Character randomPlayer() {
        int random = (int) ((Math.random() * 100) % 2);
        if (random == 1)
            return new BigBadBruiser();
        else return new ToxicJunkie();
    }
}
