package com.gsc.bm.service.account;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.repo.external.*;
import com.gsc.bm.repo.internal.CardsGuiRepository;
import com.gsc.bm.repo.internal.CharactersGuiRepository;
import com.gsc.bm.service.account.model.UserAccountInfo;
import com.gsc.bm.service.account.model.UserCollection;
import com.gsc.bm.service.account.model.UserGuiDeck;
import com.gsc.bm.service.catalog.CatalogSource;
import com.gsc.bm.service.catalog.SqliteCatalogSource;
import com.gsc.bm.service.factories.CardFactoryService;
import com.gsc.bm.service.factories.CharacterFactoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserAccountServiceImpl implements UserAccountService {

    private final UserCredentialsRepository userCredentialsRepo;
    private final UserDecksRepository userDecksRepo;
    // SB-8: collection and deck checks read the catalog source (SQLite, or the set draft with the development profile).
    private final CatalogSource catalog;
    private final CardFactoryService cardFactoryService;
    private final CharacterFactoryService characterFactoryService;

    public UserAccountServiceImpl(UserCredentialsRepository userCredentialsRepo,
                                  UserDecksRepository userDecksRepo,
                                  CardsGuiRepository cardsGuiRepo,
                                  CharactersGuiRepository charactersGuiRepo,
                                  CardFactoryService cardFactoryService,
                                  CharacterFactoryService characterFactoryService) {
        this(userCredentialsRepo, userDecksRepo, new SqliteCatalogSource(cardsGuiRepo, charactersGuiRepo),
                cardFactoryService, characterFactoryService);
    }

    @Autowired
    public UserAccountServiceImpl(UserCredentialsRepository userCredentialsRepo,
                                  UserDecksRepository userDecksRepo,
                                  CatalogSource catalog,
                                  CardFactoryService cardFactoryService,
                                  CharacterFactoryService characterFactoryService) {
        this.userCredentialsRepo = userCredentialsRepo;
        this.userDecksRepo = userDecksRepo;
        this.catalog = catalog;
        this.cardFactoryService = cardFactoryService;
        this.characterFactoryService = characterFactoryService;
    }

    @Override
    public UserAccountInfo loadUserAccountInfo(String username) {
        Optional<UserCredentialsRecord> rec = userCredentialsRepo.findById(username);
        return rec.map(userCredentialsRecord ->
                new UserAccountInfo(
                        userCredentialsRecord.getUsername(),
                        userCredentialsRecord.getEmail(),
                        userCredentialsRecord.getRole(),
                        getUserDecks(username),
                        getUserCardCollection()))
                .orElse(null);
    }

    @Override
    public void addUserDeck(String username, UserGuiDeck deck) {
        validateDeck(deck);
        requireOwnDeckId(deck);
        userDecksRepo.save(
                new UserDecksRecord(username, deck.getDeckId(), fromGuiToStoredDeck(deck))
        );
    }

    @Override
    public void deleteUserDeck(String username, UserGuiDeck deck) {
        if (deck == null || deck.getDeckId() == null || deck.getDeckId().isBlank())
            throw new IllegalArgumentException("Deck identifier required");
        requireOwnDeckId(deck);
        userDecksRepo.deleteById(new UserDeckRecordKey(username, deck.getDeckId()));
    }

    /** SB-8: a ready deck of the catalog is read-only; never true in the live catalog, which has none. */
    private void requireOwnDeckId(UserGuiDeck deck) {
        if (catalog.readyDecks().containsKey(deck.getDeckId()))
            throw new IllegalArgumentException("Deck identifier reserved for a ready deck");
    }

    private Card catalogCard(Card input) {
        if (input == null || input.getBindingName() == null || !catalog.hasCard(input.getBindingName()))
            throw new IllegalArgumentException("Unknown or missing card");
        return cardFactoryService.craftCard(input.getBindingName());
    }

    private void validateDeck(UserGuiDeck deck) {
        if (deck == null || deck.getDeckId() == null || deck.getDeckId().isBlank()
                || deck.getCharacter() == null || deck.getCharacter().getBindingName() == null
                || !catalog.hasCharacter(deck.getCharacter().getBindingName()))
            throw new IllegalArgumentException("Deck identifier and catalog character required");
        // R02 1.8: the identifier is a path segment of the open join destination.
        if (deck.getDeckId().contains("/"))
            throw new IllegalArgumentException("Deck identifier cannot contain /");
        // R02 1.12: every reference is resolved in the catalog; subtypes and ownership come from there, not from the client.
        DeckRules.check(deck.getCharacter().getBindingName(),
                catalogCard(deck.getBasicActionCard()),
                deck.getCharacterBoundCards() == null ? null
                        : deck.getCharacterBoundCards().stream().map(this::catalogCard).collect(Collectors.toList()),
                catalogCard(deck.getLastResortCard()),
                deck.getRegularCards() == null ? null
                        : deck.getRegularCards().stream().map(this::catalogCard).collect(Collectors.toList()));
    }

    // for now everyone has all the cards
    private UserCollection getUserCardCollection() {
        return new UserCollection(
                catalog.characterBindings()
                        .stream()
                        .map(characterFactoryService::craftCharacterView)
                        .collect(Collectors.toSet()),
                catalog.cardBindings()
                        .stream()
                        .map(cardFactoryService::craftCard)
                        .collect(Collectors.toSet())
        );
    }

    private Set<UserGuiDeck> getUserDecks(String username) {
        if (catalog.readyDecks().isEmpty())
            return userDecksRepo.findAllByUsername(username)
                    .stream()
                    .map(d -> fromStoredToGuiDeck(d.getDeck(), d.getDeckId()))
                    .collect(Collectors.toSet());
        // SB-8, profile bozza only: the ready decks first, then the saved ones.
        Set<UserGuiDeck> decks = new LinkedHashSet<>();
        catalog.readyDecks().forEach((id, deck) -> decks.add(fromStoredToGuiDeck(deck, id)));
        userDecksRepo.findAllByUsername(username)
                .stream()
                .map(d -> fromStoredToGuiDeck(d.getDeck(), d.getDeckId()))
                .forEach(decks::add);
        return decks;
    }

    private UserGuiDeck fromStoredToGuiDeck(UserDecksRecord.UserStoredDeck deck, String deckId) {
        return new UserGuiDeck(
                deckId,
                characterFactoryService.craftCharacterView(deck.getCharacterClazz()),
                cardFactoryService.craftCard(deck.getBasicActionCardClazz()),
                cardFactoryService.craftCard(deck.getLastResortCardClazz()),
                deck.getCharacterBoundCardsClazz().stream().map(cardFactoryService::craftCard).collect(Collectors.toList()),
                deck.getRegularCardsClazz().stream().map(cardFactoryService::craftCard).collect(Collectors.toList())
        );
    }

    private UserDecksRecord.UserStoredDeck fromGuiToStoredDeck(UserGuiDeck deck) {
        return new UserDecksRecord.UserStoredDeck(
                deck.getCharacter().getBindingName(),
                deck.getBasicActionCard().getBindingName(),
                deck.getLastResortCard().getBindingName(),
                deck.getCharacterBoundCards().stream().map(Card::getBindingName).collect(Collectors.toList()),
                deck.getRegularCards().stream().map(Card::getBindingName).collect(Collectors.toList())
        );
    }
}
