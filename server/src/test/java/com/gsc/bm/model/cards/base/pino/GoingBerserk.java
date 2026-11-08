package com.gsc.bm.model.cards.base.pino;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.Tunable;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * SB-14, PIN-AR2 del Set Base («Estasi da Coca Etilene», GoingBerserk riprogettata): spende tutta la L residua.
 * <p>
 * R04 applica gli effetti su sé prima di quelli sul bersaglio, quindi con i passi dati l'azzeramento arriverebbe prima del danno.
 * Come {@code ToxicBloodDrain} con la T (decisione B1 della griglia), la classe memorizza la L dell'autore nella logica speciale,
 * dopo i costi; poi, su sé, infligge {@code selfHit} HIT se positivo e azzera la L; infine infligge al bersaglio HIT pari a
 * {@code base} più la L memorizzata.
 * <p>
 * Vive nei sorgenti di test: la partita viva non la conosce (SB-28). Costo e priorità arrivano dalla bozza.
 */
public class GoingBerserk extends AbstractCard {

    /** Il danno fisso, a cui si somma la L residua. */
    @Tunable
    private int base = 3;
    /** Il danno a sé (la last resort): 0 per non infliggerne. */
    @Tunable
    private int selfHit = 0;

    /** La L dell'autore letta alla risoluzione, prima di azzerarla. */
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
        List<String> report = new ArrayList<>();
        if (selfHit > 0) report.add(self.inflictDamage(self, new Damage(Damage.DamageType.HIT, selfHit)));
        report.add(self.emptyResource(Resource.ALCOHOL));
        return report;
    }

    @Override
    public List<String> applyEffectOnTarget(Character self, Character target) {
        return List.of(self.inflictDamage(target, new Damage(Damage.DamageType.HIT, base + alcohol)));
    }
}
