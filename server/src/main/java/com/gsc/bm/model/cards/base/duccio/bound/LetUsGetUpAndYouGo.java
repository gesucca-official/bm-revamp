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
 * «Rialziamoci e Partite!», slot ROC-BO2 del Set Base, legata a Duccio Braccio Teso: la scheda è quella del documento del set. Se alla
 * risoluzione l'autore ha da {@code healthAtLeast} a {@code healthAtMost} H, guadagna {@code heal} H; altrimenti niente. Si gioca su
 * di sé, quindi si risolve anche a terra. Numeri, costo, priorità e rarità sono nel file del set; ognuno è obbligatorio. Lo scarto di
 * R02 lo fa {@link AbstractCharacterBoundCard}.
 */
public class MiRialzo extends AbstractCharacterBoundCard implements PrintedEffects.Source {

    /** La H guadagnata. */
    @Tunable
    private int heal;
    /** La H minima per guadagnare. */
    @Tunable
    private int healthAtLeast;
    /** La H massima per guadagnare. */
    @Tunable
    private int healthAtMost;

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

    /** +{@code heal} HEALTH to the author, only with {@code healthAtLeast} to {@code healthAtMost} HEALTH when it applies. */
    @Override
    public PrintedEffects printedEffects() {
        return new PrintedEffects(List.of(PrintedEffects.Step.builder().kind(PrintedEffects.Kind.GAIN).resource(Resource.HEALTH)
                .base(heal).healthAtLeast(healthAtLeast).healthAtMost(healthAtMost).build()));
    }
}
