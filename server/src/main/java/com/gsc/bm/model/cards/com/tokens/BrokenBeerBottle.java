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

/** «Bottiglia Spaccata», token del Set Base (slot TOKEN): nome e testo breve sono quelli della scheda, D168 (4) applicata in SB-28. */
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
        setGuiName("Bottiglia Spaccata");
        setGuiEffectDescription("Quando lo consumi: i tuoi [[HIT]] diventano [[CUT]] e ne infliggi una volta e mezza (equipaggiamento). Dopo il primo uso dura solo fino a fine turno.");
        // Not in the SQLite catalog: role and gains are declared here like the name (regulation 1.7 R07a).
        setGuiRole("OTHER", "—");
        // It converts the holder's hits but deals no damage itself (regulation 1.9 R07a).
        setGuiDamage("—");
        setGuiDamageAmount("—");
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
