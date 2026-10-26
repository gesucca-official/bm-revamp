package com.gsc.bm.model.cards.com.tokens;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.cards.AbstractItemCard;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.status.Status;
import com.gsc.bm.model.game.status.StatusFlow;
import com.gsc.bm.model.game.status.StatusType;

import java.util.List;

public class BrokenBeerBottle extends AbstractItemCard {

    public static Status newStatus() { return Status.builder()
            .name("BROKEN BEER")
            .description("Hit Damage dealt x1.5 and turned to Cut Damage")
            .type(StatusType.GOOD)
            .flow(StatusFlow.OUTPUT)
            .impactedProperty(Damage.DamageType.HIT)
            .amountFunction(damageDone -> damageDone * 1.5f)
            .typeFunction(damageType -> damageType == Damage.DamageType.HIT ? Damage.DamageType.CUT : damageType)
            .equip(true)
            .singleUse(true)
            .build();
    }

    public BrokenBeerBottle() {
        super();
        setGuiName("Broken Beer Bottle");
        setGuiEffectDescription("Equip: Hit Damage x1.5, converted to Cut. Removed at turn end after use; may apply again that turn. Independent status per application: regulation 1.1 R05.");
    }

    @Override
    public void applyOtherUnfathomableLogic(Game g, Move m) {

    }

    @Override
    public List<String> applyEffectOnSelf(Character self) {
        self.getStatuses().add(newStatus());
        return List.of("Equipped status: BROKEN BEER");
    }
}
