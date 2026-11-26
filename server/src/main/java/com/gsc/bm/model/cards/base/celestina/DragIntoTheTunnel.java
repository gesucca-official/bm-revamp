package com.gsc.bm.model.cards.base.celestina;

import com.gsc.bm.model.cards.CardId;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Timer;
import com.gsc.bm.model.cards.Tunable;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

@CardId("junkie.ToxicBloodDrain")
public class DragIntoTheTunnel extends AbstractCard implements PrintedEffects.Source {

    int toxicity;
    @Tunable
    private int turns = 1;
    /**
     * SB-16g passo 3 (D84): POISON dealt to the target after the transfer. SB-28 (SB-27 list): no longer optional, every draft writes
     * it; 0, read only in the historical drafts written before D84, deals none, so their measurements stay as they were.
     */
    @Tunable
    private int poison = 10;

    public DragIntoTheTunnel() {
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
        List<String> report = new ArrayList<>();
        report.add(target.gainResource(Resource.TOXICITY, toxicity));
        if (poison > 0) report.add(self.inflictDamage(target, new Damage(Damage.DamageType.POISON, poison)));
        return report;
    }

    /** D76: the author's TOXICITY, read after costs, moves to the target (its immunity lifted for a while); D84: then POISON (none at 0). */
    @Override
    public PrintedEffects printedEffects() {
        List<PrintedEffects.Step> steps = new ArrayList<>(List.of(
                PrintedEffects.Step.builder().kind(PrintedEffects.Kind.NOT_IMMUNE).onTarget(true).resource(Resource.TOXICITY).build(),
                PrintedEffects.Step.builder().kind(PrintedEffects.Kind.LOSE).resource(Resource.TOXICITY).of(Resource.TOXICITY).atStart(true).build(),
                PrintedEffects.Step.builder().kind(PrintedEffects.Kind.GAIN).onTarget(true).resource(Resource.TOXICITY)
                        .of(Resource.TOXICITY).atStart(true).build()));
        if (poison > 0) steps.add(PrintedEffects.damage(true, Damage.DamageType.POISON, poison));
        // SB-19 B2a (D133): the timer of applyEffectOnTarget, written apart as data for the bots' table: the author gets TOXICITY immunity back.
        return new PrintedEffects(List.copyOf(steps), List.of(), List.of(PrintedEffects.TimerText.builder().name("Blood Drain").turns(turns)
                .grants(List.of(Resource.TOXICITY)).build()));
    }
}
