package com.gsc.bm.model.cards.com.basic;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.com.Grab;
import com.gsc.bm.model.cards.Tunable;

import java.util.List;

public class ToxicGrab extends Grab {

    @Tunable
    private int alertnessDivisor = 2;

    public ToxicGrab() {
        setBasicAction(true);
    }

    @Override
    public List<String> applyEffectOnSelf(Character self) {
        return super.mergeList(
                List.of(self.loseResource(Resource.ALERTNESS, self.getResources().get(Resource.ALERTNESS) / alertnessDivisor)),
                super.applyEffectOnSelf(self)
        );
    }
}
