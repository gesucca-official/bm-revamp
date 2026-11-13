package com.gsc.bm.model.cards.junkie;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Timer;
import com.gsc.bm.model.cards.Tunable;

import java.util.List;
import java.util.Map;
import java.util.Set;

public class ToxicBloodDrain extends AbstractCard implements PrintedEffects.Source {

    int toxicity;
    @Tunable
    private int turns = 1;

    public ToxicBloodDrain() {
        super();
        setCanTarget(Set.of(CardTarget.OPPONENT));
        setCost(Map.of(Resource.TOXICITY, 10));
    }

    @Override
    public void applyOtherUnfathomableLogic(Game g, Move m) {
        toxicity = g.getSelf(m).getCharacter().getResources().get(Resource.TOXICITY);
    }

    @Override
    public List<String> applyEffectOnSelf(Character self) {
        return List.of(
                self.loseResource(Resource.TOXICITY, toxicity)
        );
    }

    @Override
    public List<String> applyEffectOnTarget(Character self, Character target) {
        target.getImmunities().remove(Resource.TOXICITY);
        self.getTimers().add(new Timer("Blood Drain", c -> c.getImmunities().add(Resource.TOXICITY), turns));
        return List.of(
                target.gainResource(Resource.TOXICITY, toxicity)
        );
    }

    /** D76: the author's TOXICITY, read after costs, moves to the target (its immunity lifted for a while). */
    @Override
    public PrintedEffects printedEffects() {
        return new PrintedEffects(List.of(
                PrintedEffects.Step.builder().kind(PrintedEffects.Kind.NOT_IMMUNE).onTarget(true).resource(Resource.TOXICITY).build(),
                PrintedEffects.Step.builder().kind(PrintedEffects.Kind.LOSE).resource(Resource.TOXICITY).of(Resource.TOXICITY).atStart(true).build(),
                PrintedEffects.Step.builder().kind(PrintedEffects.Kind.GAIN).onTarget(true).resource(Resource.TOXICITY)
                        .of(Resource.TOXICITY).atStart(true).build()));
    }
}
