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
 * SB-16g passo 3 (proposta 1.4, D82, D84), PIN-AR5 del Set Base («Rutto a distanza sociale»): spende tutta la L residua.
 * <p>
 * Con i passi dati l'azzeramento su sé arriverebbe prima degli effetti sul bersaglio e il «doppio» della L non si scrive. Come
 * {@link GoingBerserk}, la classe memorizza la L dell'autore nella logica speciale, dopo il costo; poi, su sé, azzera la L; infine il
 * bersaglio perde A pari alla L memorizzata e subisce HIT pari a {@code base} più {@code perAlcohol} volte la stessa L.
 * <p>
 * Solo nella bozza del Set Base: la partita viva non la conosce (SB-28). Costo e priorità arrivano dalla bozza.
 */
public class RuttoADistanzaSociale extends AbstractCard implements PrintedEffects.Source {

    /** Il danno fisso. */
    @Tunable
    private int base = 14;
    /** Il danno per ogni punto di L spesa. */
    @Tunable
    private int perAlcohol = 2;

    /** La L dell'autore letta alla risoluzione, dopo il costo e prima di azzerarla. */
    private int alcohol;

    public RuttoADistanzaSociale() {
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
        return List.of(
                target.loseResource(Resource.ALERTNESS, alcohol),
                self.inflictDamage(target, new Damage(Damage.DamageType.HIT, base + perAlcohol * alcohol)));
    }

    /** D84: ALCOHOL emptied; the target loses ALERTNESS equal to the ALCOHOL read after costs, then HIT of base plus perAlcohol times it. */
    @Override
    public PrintedEffects printedEffects() {
        return new PrintedEffects(List.of(
                PrintedEffects.Step.builder().kind(PrintedEffects.Kind.EMPTY).resource(Resource.ALCOHOL).build(),
                PrintedEffects.Step.builder().kind(PrintedEffects.Kind.LOSE).onTarget(true).resource(Resource.ALERTNESS)
                        .of(Resource.ALCOHOL).atStart(true).build(),
                PrintedEffects.Step.builder().kind(PrintedEffects.Kind.DAMAGE).onTarget(true).damageType(Damage.DamageType.HIT)
                        .base(base).of(Resource.ALCOHOL).times(perAlcohol).atStart(true).build()));
    }
}
