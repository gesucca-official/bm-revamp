package com.gsc.bm.model.cards.com.items;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractItemCard;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Timer;
import com.gsc.bm.model.cards.Tunable;

import java.util.List;

public class MarvelousCocktail extends AbstractItemCard {

    @Tunable
    private int alcohol = 20;
    @Tunable
    private int toxicity = 20;
    @Tunable
    private int turns = 5;
    @Tunable
    private int poison = 20;

    @Override
    public void applyOtherUnfathomableLogic(Game g, Move m) {
    }

    @Override
    public List<String> applyEffectOnSelf(Character self) {
        final int poison = this.poison; // the timer keeps the value, not the card
        self.getImmunities().add(Resource.TOXICITY);
        self.getImmunities().add(Resource.ALCOHOL);
        self.getTimers().add(
                new Timer(
                        "Marvelous Cocktail",
                        c -> {
                            c.getImmunities().clear();
                            c.getStatuses().clear();
                            c.takeDamage(new Damage(Damage.DamageType.POISON, poison));
                        }, turns)
        );
        return List.of(
                "Gained a temporary Chemical Immunity",
                "Metabolism definitively corrupted!!",
                self.gainResource(Resource.ALCOHOL, alcohol),
                self.gainResource(Resource.TOXICITY, toxicity)
        );
    }
}
