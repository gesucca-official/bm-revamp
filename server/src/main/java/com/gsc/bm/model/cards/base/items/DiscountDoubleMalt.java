package com.gsc.bm.model.cards.com.items;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.com.tokens.BrokenBeerBottle;
import com.gsc.bm.model.cards.Tunable;

import java.util.List;

public class AnotherRottenBeer extends RottenBeer {

    @Tunable
    private int alcohol = 10;

    @Override
    public List<String> applyEffectOnSelf(Character self) {
        self.getItems().add(new BrokenBeerBottle());

        return List.of(
                "Spawned BROKEN BEER BOTTLE Token near You",
                self.gainResource(Resource.ALCOHOL, alcohol)
        );
    }
}
