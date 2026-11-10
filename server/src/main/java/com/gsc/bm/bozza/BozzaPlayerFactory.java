package com.gsc.bm.bozza;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.ComPlayer;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.bot.BotPlayer;
import com.gsc.bm.model.game.bot.BotPolicy;
import com.gsc.bm.service.account.DeckRules;
import com.gsc.bm.service.factories.CardFactoryService;
import com.gsc.bm.service.factories.CharacterFactoryService;
import com.gsc.bm.service.factories.PlayerFactoryService;
import com.gsc.bm.service.factories.PlayerFactoryServiceImpl;
import com.gsc.bm.sim.DraftSource;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

/**
 * SB-8: players of the development server. Quick and FFA deal a starter of the pool; the computer plays the configured deck with
 * the configured style; open 1vCom plays a ready deck of the draft, or a deck the account saved with the draft's cards (same
 * checks as the live factory, which this class reuses).
 */
@Service
@Primary
@Profile("bozza")
public class BozzaPlayerFactory implements PlayerFactoryService {

    private final BozzaDraft bozza;
    private final DraftSource draft;
    private final CardFactoryService cards;
    private final CharacterFactoryService characters;
    private final PlayerFactoryServiceImpl saved;

    public BozzaPlayerFactory(BozzaDraft bozza, CardFactoryService cards, CharacterFactoryService characters,
                              PlayerFactoryServiceImpl saved) {
        this.bozza = bozza;
        this.draft = bozza.draft();
        this.cards = cards;
        this.characters = characters;
        this.saved = saved;
    }

    @Override
    public Player craftRandomComPlayer() {
        String deck = BozzaDraft.FROM_POOL.equals(bozza.com()) ? fromPool() : bozza.com();
        Deck d = deck(deck);
        BotPolicy policy = bozza.newPolicy();
        if (policy == null) return new ComPlayer(d.character, d.basic, d.bound, d.lastResort, d.regular);
        return new BotPlayer("ComPlayer_" + ThreadLocalRandom.current().nextInt(10000), d.character, d.basic, d.bound,
                d.lastResort, d.regular, new Random(), policy);
    }

    @Override
    public Player craftRandomPlayer(String playerId) {
        Deck d = deck(fromPool());
        return new Player(playerId, d.character, d.basic, d.bound, d.lastResort, d.regular);
    }

    @Override
    public Player craftOpenPlayer(String username, String deckId) {
        if (!draft.deckIds().contains(deckId)) return saved.craftOpenPlayer(username, deckId);
        Deck d = deck(deckId);
        DeckRules.check(d.character.getBindingName(), d.basic, d.bound, d.lastResort, d.regular);
        return new Player(username, d.character, d.basic, d.bound, d.lastResort, d.regular);
    }

    private String fromPool() {
        List<String> pool = bozza.pool();
        return pool.get(ThreadLocalRandom.current().nextInt(pool.size()));
    }

    private Deck deck(String id) {
        return new Deck(characters.craftCharacter(draft.characterOf(id)), cards.craftCard(draft.basicOf(id)),
                draft.boundOf(id).stream().map(cards::craftCard).collect(Collectors.toList()), cards.craftCard(draft.lastResortOf(id)),
                draft.regularOf(id).stream().map(cards::craftCard).collect(Collectors.toList()));
    }

    private static final class Deck {
        final Character character;
        final Card basic, lastResort;
        final List<Card> bound, regular;

        Deck(Character character, Card basic, List<Card> bound, Card lastResort, List<Card> regular) {
            this.character = character;
            this.basic = basic;
            this.bound = bound;
            this.lastResort = lastResort;
            this.regular = regular;
        }
    }
}
