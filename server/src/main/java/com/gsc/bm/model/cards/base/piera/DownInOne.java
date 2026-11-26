package com.gsc.bm.model.cards.base.pino;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.cards.Tunable;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * «Alla Goccia», slot PIN-AR2 del Set Base: la scheda è quella del documento del set. Si legge la L all'inizio della risoluzione (la L
 * spesa), la si spende tutta, poi l'avversario subisce HIT pari a {@code base} più {@code perAlcohol} volte la L spesa.
 * <p>
 * Gli effetti su sé vengono prima di quelli sul bersaglio (regolamento, R04): per questo la L si legge nella logica speciale, dopo i
 * costi e prima dell'azzeramento. Numeri, costo e priorità sono nel file del set; ognuno è obbligatorio.
 */
public class GoingBerserk extends AbstractCard implements PrintedEffects.Source {

    /** Il danno fisso. */
    @Tunable
    private int base;
    /** Il danno per ogni punto di L spesa. */
    @Tunable
    private int perAlcohol;

    /** La L spesa: quella dell'autore all'inizio della risoluzione. */
    private int alcohol;

    public GoingBerserk() {
        super();
        setCanTarget(Set.of(CardTarget.OPPONENT));
        setCost(Map.of());
    }

    @Override
    public void applyOtherUnfathomableLogic(Game g, Move m) {
        alcohol = Math.max(0, g.getSelf(m).getCharacter().getResources().getOrDefault(Resource.ALCOHOL, 0));
    }

    @Override
    public List<String> applyEffectOnSelf(Character self) {
        return List.of(self.emptyResource(Resource.ALCOHOL));
    }

    @Override
    public List<String> applyEffectOnTarget(Character self, Character target) {
        return List.of(self.inflictDamage(target, new Damage(Damage.DamageType.HIT, base + perAlcohol * alcohol)));
    }

    /** ALCOHOL emptied; HIT of base plus perAlcohol times the ALCOHOL read at the start of the resolution. */
    @Override
    public PrintedEffects printedEffects() {
        return new PrintedEffects(List.of(
                PrintedEffects.Step.builder().kind(PrintedEffects.Kind.EMPTY).resource(Resource.ALCOHOL).build(),
                PrintedEffects.Step.builder().kind(PrintedEffects.Kind.DAMAGE).onTarget(true).damageType(Damage.DamageType.HIT)
                        .base(base).of(Resource.ALCOHOL).times(perAlcohol).atStart(true).build()));
    }
}
