package com.gsc.bm.model.cards.base.common;

import com.gsc.bm.model.cards.CardId;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.status.Status;
import com.gsc.bm.model.cards.Tunable;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@CardId("bruiser.BadEducation")
public class ExcuseMeSorryCanYouStop extends AbstractCard {

    @Tunable
    private int hitDamage = 8;

    public ExcuseMeSorryCanYouStop() {
        super();
        setCanTarget(Set.of(CardTarget.OPPONENT));
        setCost(Map.of(Resource.VIOLENCE, 5));
    }

    @Override
    public void applyOtherUnfathomableLogic(Game g, Move m) {
    }

    @Override
    public List<String> applyEffectOnSelf(Character self) {
        return null;
    }

    @Override
    public List<String> applyEffectOnTarget(Character self, Character target) {
        List<Status> destroyedEquips = new ArrayList<>();  // concurrent access problem with foreach
        for (Status status : target.getStatuses()) {
            if (status.isEquip())
                destroyedEquips.add(status);
        }
        target.getStatuses().removeAll(destroyedEquips);
        return mergeList(
                destroyedEquips.stream().map(s -> "Removed " + s.getName() + " status!").collect(Collectors.toList()),
                List.of(
                        self.inflictDamage(target, new Damage(Damage.DamageType.HIT, hitDamage))
                )
        );
    }
}
