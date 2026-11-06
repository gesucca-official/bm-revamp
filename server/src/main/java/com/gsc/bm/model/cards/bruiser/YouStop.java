package com.gsc.bm.model.cards.bruiser;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.cards.Tunable;

import java.util.List;
import java.util.Map;
import java.util.Set;

public class YouStop extends AbstractCard {

    private boolean countered = false;
    @Tunable
    private int alertnessToTarget = 10;

    public YouStop() {
        super();
        setCanTarget(Set.of(CardTarget.OPPONENT));
        setCost(Map.of(Resource.VIOLENCE, 5));
        setPriority(2);
    }

    @Override
    public void applyOtherUnfathomableLogic(Game g, Move m) {
        g.getPendingMoveOfTargetIfMovesAfterPlayer(m.getPlayerId(), m.getTargetId())
                .ifPresent(move -> {
                    move.setVoid(true);
                    countered = true;
                });
    }

    @Override
    public List<String> applyEffectOnSelf(Character self) {
        return null;
    }

    @Override
    public List<String> applyEffectOnTarget(Character self, Character target) {
        if (countered)
            return List.of("Countered Target's own Move",
                    target.gainResource(Resource.ALERTNESS, alertnessToTarget));
        else
            return List.of("You were too slow and didn't countered anything.");
    }
}
