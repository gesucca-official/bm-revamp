package com.gsc.bm.bozza;

import com.gsc.bm.model.Character;
import com.gsc.bm.service.factories.CharacterFactoryService;
import com.gsc.bm.service.view.ViewExtractorService;
import com.gsc.bm.service.view.model.deck.CharacterCardView;
import com.gsc.bm.sim.DraftSource;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

/** SB-8: characters of the set draft, described as data (resources, items, immunities); views as for live characters. */
@Service
@Primary
@Profile("bozza")
public class BozzaCharacterFactory implements CharacterFactoryService {

    private final DraftSource draft;
    private final ViewExtractorService views;

    public BozzaCharacterFactory(BozzaDraft bozza, ViewExtractorService views) {
        this.draft = bozza.draft();
        this.views = views;
    }

    @Override
    public Character craftCharacter(String id) {
        if (id == null || !draft.characterIds().contains(id))
            throw new IllegalArgumentException("Cannot load character binding: " + id);
        return draft.character(id);
    }

    @Override
    public CharacterCardView craftCharacterView(String id) {
        return views.extractDeckBuildingView(craftCharacter(id));
    }
}
