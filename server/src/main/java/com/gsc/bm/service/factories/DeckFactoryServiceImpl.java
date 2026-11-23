package com.gsc.bm.service.factories;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.repo.external.UserDeckRecordKey;
import com.gsc.bm.repo.external.UserDecksRecord;
import com.gsc.bm.repo.external.UserDecksRepository;
import com.gsc.bm.service.catalog.LiveSet;
import com.gsc.bm.sim.DraftSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Starter and saved decks as cards. SB-28: the starters are those of the live set file ({@link LiveSet}, D182); a character's
 * starter is the first starter of the file with that character.
 */
@Service
public class DeckFactoryServiceImpl implements DeckFactoryService {

    private final DraftSource set;
    private final List<String> starters;
    private final UserDecksRepository userDecksRepo;
    private final CardFactoryService cardFactoryService;

    @Autowired
    public DeckFactoryServiceImpl(LiveSet live, UserDecksRepository userDecksRepo, CardFactoryService cardFactoryService) {
        this.set = live.set();
        this.starters = live.starters();
        this.userDecksRepo = userDecksRepo;
        this.cardFactoryService = cardFactoryService;
    }

    private String starterOf(String character) {
        String binding = character.replace(CardFactoryService.BASE_CARDS_PKG, "");
        return starters.stream().filter(deck -> set.characterOf(deck).equals(binding)).findFirst()
                .orElseThrow(() -> new ValueNotFoundException(binding));
    }

    @Override
    public List<Card> craftCharacterStarterDeck(String pgClazz) {
        return set.regularOf(starterOf(pgClazz)).stream().map(cardFactoryService::craftCard).collect(Collectors.toList());
    }

    @Override
    public Card craftBasicActionStarterCard(Character character) {
        return cardFactoryService.craftCard(set.basicOf(starterOf(character.getBindingName())));
    }

    @Override
    public List<Card> craftCharacterBoundStarterCards(Character character) {
        return set.boundOf(starterOf(character.getBindingName())).stream().map(cardFactoryService::craftCard)
                .collect(Collectors.toList());
    }

    @Override
    public Card craftLastResortStarterCard(Character character) {
        return cardFactoryService.craftCard(set.lastResortOf(starterOf(character.getBindingName())));
    }

    private UserDecksRecord.UserStoredDeck saved(String username, String deckId) {
        return userDecksRepo.findById(new UserDeckRecordKey(username, deckId))
                .orElseThrow(() -> new ValueNotFoundException(username + "/" + deckId)).getDeck();
    }

    @Override
    public List<Card> craftCharacterOpenDeck(String username, String deckId) {
        return saved(username, deckId).getRegularCardsClazz().stream().map(cardFactoryService::craftCard).collect(Collectors.toList());
    }

    @Override
    public Card craftBasicActionOpenCard(String username, String deckId) {
        return cardFactoryService.craftCard(saved(username, deckId).getBasicActionCardClazz());
    }

    @Override
    public List<Card> craftCharacterBoundOpenCards(String username, String deckId) {
        return saved(username, deckId).getCharacterBoundCardsClazz().stream().map(cardFactoryService::craftCard)
                .collect(Collectors.toList());
    }

    @Override
    public Card craftLastResortOpenCard(String username, String deckId) {
        return cardFactoryService.craftCard(saved(username, deckId).getLastResortCardClazz());
    }

}
