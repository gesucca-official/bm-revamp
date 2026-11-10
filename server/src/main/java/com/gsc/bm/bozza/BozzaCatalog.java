package com.gsc.bm.bozza;

import com.gsc.bm.repo.external.UserDecksRecord;
import com.gsc.bm.service.catalog.CatalogSource;
import com.gsc.bm.sim.DraftSource;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * SB-8: the collection of the development server is the set draft, so that the clients find names, costs and starting resources
 * of the cards they see. The draft's decks are offered to every account as read-only ready decks (open 1vCom).
 */
@Service
@Primary
@Profile("bozza")
public class BozzaCatalog implements CatalogSource {

    private final DraftSource draft;
    private final Map<String, UserDecksRecord.UserStoredDeck> ready;

    public BozzaCatalog(BozzaDraft bozza) {
        this.draft = bozza.draft();
        Map<String, UserDecksRecord.UserStoredDeck> decks = new LinkedHashMap<>();
        for (String deck : draft.deckIds())
            decks.put(deck, new UserDecksRecord.UserStoredDeck(draft.characterOf(deck), draft.basicOf(deck), draft.lastResortOf(deck),
                    List.copyOf(draft.boundOf(deck)), List.copyOf(draft.regularOf(deck))));
        this.ready = Collections.unmodifiableMap(decks);
    }

    @Override
    public List<String> cardBindings() { return new ArrayList<>(draft.cardBindings()); }

    @Override
    public List<String> characterBindings() { return new ArrayList<>(draft.characterIds()); }

    @Override
    public boolean hasCard(String binding) { return draft.cardBindings().contains(binding); }

    @Override
    public boolean hasCharacter(String binding) { return draft.characterIds().contains(binding); }

    /** The draft has no sprites: the web client draws characters from its atlas by binding, with a placeholder. */
    @Override
    public Optional<CharacterGui> characterGui(String binding) {
        if (!hasCharacter(binding)) return Optional.empty();
        return Optional.of(new CharacterGui(draft.characterName(binding), null));
    }

    @Override
    public Map<String, UserDecksRecord.UserStoredDeck> readyDecks() { return ready; }
}
