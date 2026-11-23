package com.gsc.bm.service.factories;

import com.gsc.bm.model.Character;
import com.gsc.bm.service.catalog.LiveSet;
import com.gsc.bm.service.view.ViewExtractorService;
import com.gsc.bm.service.view.model.deck.CharacterCardView;
import com.gsc.bm.sim.DraftSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/** The characters of the live game. SB-28: described as data in the live set file (resources, items, immunities). */
@Service
public class CharacterFactoryServiceImpl implements CharacterFactoryService {

    private final DraftSource set;
    private final ViewExtractorService viewService;

    @Autowired
    public CharacterFactoryServiceImpl(LiveSet live, ViewExtractorService viewService) {
        this.set = live.set();
        this.viewService = viewService;
    }

    @Override
    public Character craftCharacter(String characterClazz) {
        if (characterClazz == null || !set.characterIds().contains(characterClazz))
            throw new IllegalArgumentException("Cannot load character binding: " + characterClazz);
        return set.character(characterClazz);
    }

    @Override
    public CharacterCardView craftCharacterView(String characterClazz) {
        return viewService.extractDeckBuildingView(craftCharacter(characterClazz));
    }

}
