package com.gsc.bm.service.factories;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.ComPlayer;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.repo.external.UserDeckRecordKey;
import com.gsc.bm.repo.external.UserDecksRepository;
import com.gsc.bm.service.account.DeckRules;
import com.gsc.bm.service.catalog.LiveSet;
import com.gsc.bm.sim.DraftSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

/**
 * Players of the live game. SB-28 (D182 (1)): quick deals one of the five starters of the live set at random, base and advanced,
 * to every human and to the computer; open plays a deck the account saved.
 */
@Service
public class PlayerFactoryServiceImpl implements PlayerFactoryService {

    private final DraftSource set;
    private final List<String> starters;
    private final CharacterFactoryService characterFactoryService;
    private final UserDecksRepository userDecksRepo;
    private final CardFactoryService cards;

    @Autowired
    public PlayerFactoryServiceImpl(LiveSet live, CharacterFactoryService characterFactoryService, UserDecksRepository userDecksRepo,
                                    CardFactoryService cards) {
        this.set = live.set();
        this.starters = live.starters();
        this.characterFactoryService = characterFactoryService;
        this.userDecksRepo = userDecksRepo;
        this.cards = cards;
    }

    @Override
    public Player craftRandomComPlayer() {
        Starter s = new Starter(randomStarter());
        return new ComPlayer(s.character, s.basic, s.bound, s.lastResort, s.regular);
    }

    @Override
    public Player craftRandomPlayer(String playerId) {
        Starter s = new Starter(randomStarter());
        return new Player(playerId, s.character, s.basic, s.bound, s.lastResort, s.regular);
    }

    @Override
    public Player craftOpenPlayer(String username, String deckId) {
        // One persisted snapshot; all runtime objects are newly crafted from its bindings.
        var deck = userDecksRepo.findById(new UserDeckRecordKey(username, deckId))
                .orElseThrow(() -> new ValueNotFoundException("Deck unavailable")).getDeck();
        var basic = cards.craftCard(deck.getBasicActionCardClazz());
        var bound = deck.getCharacterBoundCardsClazz().stream().map(cards::craftCard).collect(Collectors.toList());
        var lastResort = cards.craftCard(deck.getLastResortCardClazz());
        var regular = deck.getRegularCardsClazz().stream().map(cards::craftCard).collect(Collectors.toList());
        // R02 1.12: a deck saved under older rules stays in the account but is not used to play (D20).
        DeckRules.check(deck.getCharacterClazz(), basic, bound, lastResort, regular);
        return new Player(username, characterFactoryService.craftCharacter(deck.getCharacterClazz()),
                basic, bound, lastResort, regular);
    }

    /** D182 (1): one of the starters of the live set, all with the same chance. */
    String randomStarter() {
        return starters.get(ThreadLocalRandom.current().nextInt(starters.size()));
    }

    private final class Starter {
        final Character character;
        final Card basic, lastResort;
        final List<Card> bound, regular;

        Starter(String deck) {
            character = characterFactoryService.craftCharacter(set.characterOf(deck));
            basic = cards.craftCard(set.basicOf(deck));
            bound = set.boundOf(deck).stream().map(cards::craftCard).collect(Collectors.toList());
            lastResort = cards.craftCard(set.lastResortOf(deck));
            regular = set.regularOf(deck).stream().map(cards::craftCard).collect(Collectors.toList());
        }
    }
}
