package com.gsc.bm.model.cards.base.pino;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.PrintedEffects;
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
public class GoingBerserk extends AbstractCard implements PrintedEffects.Source {

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

    /** SB-16i («Rincara», L'ultimo giro): extra HIT to the target and to self for the current play; none here. */
    protected int extraBase() { return 0; }

    protected int extraSelf() { return 0; }

    /** SB-16i: the «Rincara» increments printed on the card, to the target and to self; none here. */
    protected int perPlayTarget() { return 0; }

    protected int perPlaySelf() { return 0; }

    @Override
    public List<String> applyEffectOnSelf(Character self) {
        List<String> report = new ArrayList<>();
        int hit = selfHit + extraSelf();
        if (hit > 0) report.add(self.inflictDamage(self, new Damage(Damage.DamageType.HIT, hit)));
        report.add(self.emptyResource(Resource.ALCOHOL));
        return report;
    }

    @Override
    public List<String> applyEffectOnTarget(Character self, Character target) {
        return List.of(self.inflictDamage(target, new Damage(Damage.DamageType.HIT, base + alcohol + extraBase())));
    }

    /** D76: self HIT if any and ALCOHOL emptied; HIT of base plus the ALCOHOL read after costs, before the self effects. */
    @Override
    public PrintedEffects printedEffects() {
        List<PrintedEffects.Step> steps = new ArrayList<>();
        if (selfHit > 0) steps.add(PrintedEffects.Step.builder().kind(PrintedEffects.Kind.DAMAGE).onTarget(false)
                .damageType(Damage.DamageType.HIT).base(selfHit).perPlay(perPlaySelf()).build());
        steps.add(PrintedEffects.Step.builder().kind(PrintedEffects.Kind.EMPTY).resource(Resource.ALCOHOL).build());
        steps.add(PrintedEffects.Step.builder().kind(PrintedEffects.Kind.DAMAGE).onTarget(true).damageType(Damage.DamageType.HIT)
                .base(base).of(Resource.ALCOHOL).atStart(true).perPlay(perPlayTarget()).build());
        return new PrintedEffects(List.copyOf(steps));
    }
}
