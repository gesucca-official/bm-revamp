package com.gsc.bm.service.account;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.cards.LoadableCard;
import com.gsc.bm.repo.external.UserCredentialsRepository;
import com.gsc.bm.repo.external.UserDecksRepository;
import com.gsc.bm.repo.internal.CardsGuiRepository;
import com.gsc.bm.repo.internal.CharactersGuiRepository;
import com.gsc.bm.service.account.model.UserGuiDeck;
import com.gsc.bm.service.factories.CardFactoryService;
import com.gsc.bm.service.factories.CharacterFactoryService;
import com.gsc.bm.service.view.model.deck.CharacterCardView;
import com.gsc.bm.model.cards.base.SetBaseIds;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.UnaryOperator;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static com.gsc.bm.model.cards.base.SetBaseIds.*;

class UserAccountServiceImplTest {
    private static final String BRUISER = SetBaseIds.SPAZIENZIO, JUNKIE = SetBaseIds.CELESTINA;
    // The catalog column C_EXCLUSIVE_TO (regulation 1.12 R02): each basic is reserved to its character, Struggle is generic.
    private static final Map<String, String> RESERVED = Map.of(LET_US_USE_YOU, BRUISER, UNCONTROLLABLE_CRAVING, JUNKIE);
    // Ten different regular cards, two copies each: the 20 regular cards of R02 1.12 (two of them are items).
    private static final List<String> TEN = List.of(PATIENCE_OVER, STUN_YOU_I_SAID, GARGANTUAN_IMPACT_ON_YOU, THATS_ENOUGH,
            DONT_PLAY_WITH_THE_KNIFE, SetBaseIds.GRAB, SLEIGHT_OF_HAND_THEFT, "com.ShuffleFeet", WARM_BLONDE_66, NEGRONI_FOUND_ON_THE_FLOOR);

    private final UserDecksRepository decks = mock(UserDecksRepository.class);
    private UserAccountServiceImpl service(Map<String, String> reserved) {
        CharactersGuiRepository characters = mock(CharactersGuiRepository.class);
        when(characters.existsById(BRUISER)).thenReturn(true);
        when(characters.existsById(JUNKIE)).thenReturn(true);
        CardsGuiRepository cards = mock(CardsGuiRepository.class);
        when(cards.existsById(anyString())).thenAnswer(call -> !((String) call.getArgument(0)).startsWith("missing."));
        // Real card classes, crafted like CardFactoryServiceImpl does; only the reserved column is set.
        CardFactoryService factory = mock(CardFactoryService.class);
        when(factory.craftCard(anyString())).thenAnswer(call -> {
            String binding = call.getArgument(0);
            LoadableCard card = (LoadableCard) com.gsc.bm.model.cards.CardClasses.forId(binding).getConstructor().newInstance();
            card.setGuiName(binding);
            card.setGuiExclusiveTo(reserved.get(binding));
            return card;
        });
        return new UserAccountServiceImpl(mock(UserCredentialsRepository.class), decks, cards, characters, factory,
                mock(CharacterFactoryService.class));
    }

    // What a client sends: only the binding name is read; everything else comes from the catalog.
    private static Card ref(String binding) {
        Card card = mock(Card.class);
        when(card.getBindingName()).thenReturn(binding);
        return card;
    }
    private static List<Card> refs(List<String> bindings) {
        List<Card> out = new ArrayList<>();
        bindings.forEach(b -> out.add(ref(b)));
        return out;
    }
    private static List<String> twice(List<String> bindings) {
        List<String> out = new ArrayList<>();
        bindings.forEach(b -> out.addAll(Collections.nCopies(2, b)));
        return out;
    }
    private static UserGuiDeck bruiser() {
        return new UserGuiDeck("Botte", CharacterCardView.builder().bindingName(BRUISER).build(), ref(LET_US_USE_YOU),
                ref(AT_HIM), refs(List.of(WAKE_UP_BUT_NOT_YOU, SLIGHT_ANNOYANCE)), refs(twice(TEN)));
    }
    private static UserGuiDeck with(UnaryOperator<UserGuiDeck> change) { return change.apply(bruiser()); }
    private static UserGuiDeck regular(List<String> bindings) {
        UserGuiDeck d = bruiser();
        return new UserGuiDeck(d.getDeckId(), d.getCharacter(), d.getBasicActionCard(), d.getLastResortCard(), d.getCharacterBoundCards(), refs(bindings));
    }
    private static UserGuiDeck bound(String... bindings) {
        UserGuiDeck d = bruiser();
        return new UserGuiDeck(d.getDeckId(), d.getCharacter(), d.getBasicActionCard(), d.getLastResortCard(), refs(List.of(bindings)), d.getRegularCards());
    }

    private void refused(UserAccountServiceImpl service, UserGuiDeck deck, String message) {
        var error = assertThrows(IllegalArgumentException.class, () -> service.addUserDeck("devAlice", deck));
        assertTrue(error.getMessage().contains(message), error.getMessage());
        verify(decks, never()).save(any());
    }

    // R02 1.8: the open join destination carries the identifier as one path segment.
    @Test void deckIdentifierWithSlashIsRejectedBeforeSaving() {
        UserDecksRepository decks = mock(UserDecksRepository.class);
        CharactersGuiRepository characters = mock(CharactersGuiRepository.class);
        when(characters.existsById(SetBaseIds.SPAZIENZIO)).thenReturn(true);
        var service = new UserAccountServiceImpl(mock(UserCredentialsRepository.class), decks, mock(CardsGuiRepository.class),
                characters, mock(CardFactoryService.class), mock(CharacterFactoryService.class));
        var character = CharacterCardView.builder().bindingName(SetBaseIds.SPAZIENZIO).build();
        var error = assertThrows(IllegalArgumentException.class,
                () -> service.addUserDeck("devAlice", new UserGuiDeck("a/b", character, null, null, List.of(), List.of())));
        assertTrue(error.getMessage().contains("/"));
        verify(decks, never()).save(any());
    }

    // R02 1.12: own basic, two different own bound cards, generic last resort, 20 regular cards with at most 2 copies.
    @Test void deckFollowingTheDeckRulesIsSaved() {
        service(RESERVED).addUserDeck("devAlice", bruiser());
        verify(decks).save(any());
    }

    @Test void regularCardsMustBeExactlyTwenty() {
        var service = service(RESERVED);
        List<String> nineteen = new ArrayList<>(twice(TEN)); nineteen.remove(0);
        List<String> twentyOne = new ArrayList<>(twice(TEN)); twentyOne.add(PHLEGMY_COUGH);
        refused(service, regular(nineteen), "Exactly 20 regular cards required, found 19");
        refused(service, regular(twentyOne), "Exactly 20 regular cards required, found 21");
        refused(service, regular(List.of()), "Exactly 20 regular cards required, found 0");
        refused(service, with(d -> new UserGuiDeck(d.getDeckId(), d.getCharacter(), d.getBasicActionCard(), d.getLastResortCard(),
                d.getCharacterBoundCards(), null)), "Exactly 20 regular cards required, found 0");
    }

    @Test void aThirdCopyIsRefusedForActionsAndItems() {
        var service = service(RESERVED);
        List<String> glare = new ArrayList<>(twice(TEN)); glare.set(glare.indexOf(STUN_YOU_I_SAID), PATIENCE_OVER);
        List<String> beer = new ArrayList<>(twice(TEN)); beer.set(beer.indexOf(STUN_YOU_I_SAID), WARM_BLONDE_66);
        refused(service, regular(glare), "At most 2 copies per card: bruiser.Glare has 3");
        refused(service, regular(beer), "At most 2 copies per card: com.items.RottenBeer has 3");
    }

    @Test void boundCardsMustBeTwoDifferentOfTheCharacter() {
        var service = service(RESERVED);
        refused(service, bound(WAKE_UP_BUT_NOT_YOU, ASHTRAY_BOTTOM),
                "Bound card of another character: junkie.character.PatheticBlade");
        refused(service, bound(WAKE_UP_BUT_NOT_YOU, WAKE_UP_BUT_NOT_YOU),
                "Bound cards must be different: bruiser.character.LittleSmack");
        refused(service, bound(WAKE_UP_BUT_NOT_YOU), "Two different bound cards of the character required, found 1");
        refused(service, bound(), "Two different bound cards of the character required, found 0");
        refused(service, bound(WAKE_UP_BUT_NOT_YOU, SLIGHT_ANNOYANCE, WAKE_UP_BUT_NOT_YOU),
                "Two different bound cards of the character required, found 3");
        refused(service, bound(WAKE_UP_BUT_NOT_YOU, SetBaseIds.GRAB), "Bound card required");
        refused(service, with(d -> new UserGuiDeck(d.getDeckId(), d.getCharacter(), d.getBasicActionCard(), d.getLastResortCard(),
                null, d.getRegularCards())), "Two different bound cards of the character required, found 0");
    }

    @Test void basicMustBeTheCharacterOwn() {
        var service = service(RESERVED);
        refused(service, with(d -> new UserGuiDeck(d.getDeckId(), d.getCharacter(), ref(UNCONTROLLABLE_CRAVING), d.getLastResortCard(),
                d.getCharacterBoundCards(), d.getRegularCards())), "Basic of another character: com.basic.ToxicGrab");
        refused(service, with(d -> new UserGuiDeck(d.getDeckId(), d.getCharacter(), ref(SetBaseIds.GRAB), d.getLastResortCard(),
                d.getCharacterBoundCards(), d.getRegularCards())), "Basic and last resort required");
    }

    @Test void lastResortIsRequiredAndGenericOrOwn() {
        var service = service(RESERVED);
        refused(service, with(d -> new UserGuiDeck(d.getDeckId(), d.getCharacter(), d.getBasicActionCard(), null,
                d.getCharacterBoundCards(), d.getRegularCards())), "Unknown or missing card");
        refused(service, with(d -> new UserGuiDeck(d.getDeckId(), d.getCharacter(), d.getBasicActionCard(), ref(SetBaseIds.GRAB),
                d.getCharacterBoundCards(), d.getRegularCards())), "Basic and last resort required");
        // No catalog last resort is reserved yet (D29): a catalog where Struggle belongs to the Junkie stands in for one.
        var reservedStruggle = new java.util.HashMap<>(RESERVED);
        reservedStruggle.put(AT_HIM, JUNKIE);
        refused(service(reservedStruggle), bruiser(), "Last resort reserved to another character: com.last.Struggle");
        UserGuiDeck junkie = new UserGuiDeck("Tossico", CharacterCardView.builder().bindingName(JUNKIE).build(), ref(UNCONTROLLABLE_CRAVING),
                ref(AT_HIM), refs(List.of(CUT_THE_DOSE, ASHTRAY_BOTTOM)), refs(twice(TEN)));
        service(reservedStruggle).addUserDeck("devAlice", junkie);
        verify(decks).save(any());
    }

    @Test void specialCardsStayOutOfTheRegularCardsAndUnknownCardsAreRefused() {
        var service = service(RESERVED);
        for (String special : List.of(WAKE_UP_BUT_NOT_YOU, LET_US_USE_YOU, AT_HIM)) {
            List<String> cards = new ArrayList<>(twice(TEN)); cards.set(0, special);
            refused(service, regular(cards), "Regular card required");
        }
        List<String> missing = new ArrayList<>(twice(TEN)); missing.set(0, "missing.Card");
        refused(service, regular(missing), "Unknown or missing card");
    }
}
