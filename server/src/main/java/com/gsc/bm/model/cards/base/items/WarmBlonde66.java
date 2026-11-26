package com.gsc.bm.model.cards.base.items;

import com.gsc.bm.model.cards.CardId;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractItemCard;
import com.gsc.bm.model.cards.base.tokens.BrokenBottle;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;

import java.util.List;

@CardId("com.items.RottenBeer")
public class WarmBlonde66 extends AbstractItemCard {

    @Override
    public void applyOtherUnfathomableLogic(Game g, Move m) {
        g.getSelf(m).getCharacter().getStatuses().add(BrokenBottle.newStatus());
    }

    @Override
    public List<String> applyEffectOnSelf(Character self) {
        return List.of(
                "Consumed Rotten Beer (no equip through Grab)",
                self.gainResource(Resource.ALCOHOL, 5)
        );
    }

}
