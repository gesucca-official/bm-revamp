package com.gsc.bm.model.cards.bruiser;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;

import java.util.List;
import java.util.Map;
import java.util.Set;

public class YouStop extends AbstractCard implements PrintedEffects.Source {

    private boolean countered = false;

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
            return List.of("Countered Target's own Move");
        else
            return List.of("You were too slow and didn't countered anything.");
    }

    /** D76: voids the target's later move. SB-28 (SB-27 list): the ALERTNESS the target gained in Set Base 0.1 is gone with that set. */
    @Override
    public PrintedEffects printedEffects() {
        return new PrintedEffects(List.of(PrintedEffects.Step.builder().kind(PrintedEffects.Kind.COUNTER_TARGET).onTarget(true).build()));
    }
}
