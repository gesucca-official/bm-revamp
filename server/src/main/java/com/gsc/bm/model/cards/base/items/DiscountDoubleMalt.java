package com.gsc.bm.model.cards.base.items;

import com.gsc.bm.model.cards.CardId;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.base.tokens.BrokenBottle;
import com.gsc.bm.model.cards.Tunable;

import java.util.List;

@CardId("com.items.AnotherRottenBeer")
public class DiscountDoubleMalt extends WarmBlonde66 {

    @Tunable
    private int alcohol = 10;

    @Override
    public List<String> applyEffectOnSelf(Character self) {
        self.getItems().add(new BrokenBottle());

        return List.of(
                "Spawned BROKEN BEER BOTTLE Token near You",
                self.gainResource(Resource.ALCOHOL, alcohol)
        );
    }
}
