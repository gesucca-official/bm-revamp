package com.gsc.bm.model.cards.base.rocco.bound;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCharacterBoundCard;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.cards.Tunable;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;

import java.util.List;
import java.util.Set;

/**
 * SB-21h (D159 (1c), D160 (1)), ROC-BO2 del Set Base, nome di lavoro «Mi rialzo dal marciapiede»: bound variante di Duccio. Se alla
 * risoluzione Duccio ha da {@code healthAtLeast} a {@code healthAtMost} HEALTH, recupera {@code heal} HEALTH; altrimenti nulla. Sempre giocabile. Le op a
 * dati non esprimono la condizione, quindi è una classe Java (proposta della Fase A, «Motore e dati»). Solo bozza del Set Base (SB-28).
 * Costo, priorità e rarità arrivano dalla bozza; lo scarto R02 lo fa {@link AbstractCharacterBoundCard}.
 */
public class MiRialzo extends AbstractCharacterBoundCard implements PrintedEffects.Source {

    @Tunable
    private int heal = 4;
    @Tunable
    private int healthAtLeast = 1;
    @Tunable
    private int healthAtMost = 30;

    public MiRialzo() {
        super(Character.class);
        setCanTarget(Set.of(CardTarget.SELF));
        setPriority(0);
        setBoundToCharacter("base.character.Rocco");
    }

    @Override
    public void applyOtherUnfathomableLogic(Game g, Move m) {
    }

    @Override
    public List<String> applyEffectOnSelf(Character self) {
        int health = self.getResources().get(Resource.HEALTH);
        if (health < healthAtLeast || health > healthAtMost) return List.of("Nothing to recover");
        return List.of(self.gainResource(Resource.HEALTH, heal));
    }

    @Override
    public List<String> applyEffectOnTarget(Character self, Character target) {
        return null;
    }

    /** SB-21h: +{@code heal} HEALTH to the author, only with {@code healthAtLeast} to {@code healthAtMost} HEALTH when it applies. */
    @Override
    public PrintedEffects printedEffects() {
        return new PrintedEffects(List.of(PrintedEffects.Step.builder().kind(PrintedEffects.Kind.GAIN).resource(Resource.HEALTH)
                .base(heal).healthAtLeast(healthAtLeast).healthAtMost(healthAtMost).build()));
    }
}
