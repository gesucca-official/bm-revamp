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
 * «Ultimo Giro», slot LR-PIN del Set Base, l'ultima risorsa di Piera Pinot: la scheda è quella del documento del set. Nell'ordine: si
 * legge la L all'inizio della risoluzione (la L spesa); l'autore subisce {@code selfHit} HIT, prima di spendere la L; spende tutta la
 * L; l'avversario subisce HIT pari a {@code base} più la L spesa.
 * <p>
 * Rincara {@code perPlay} ({@code perPlaySelf} a te): per ogni giocata precedente della carta da parte del suo autore, anche annullata,
 * i HIT all'avversario crescono di {@code perPlay} e quelli a sé di {@code perPlaySelf}. Il contatore lo tiene la partita, solo con le
 * regole del playground. Numeri, costo e priorità sono nel file del set; ognuno è obbligatorio.
 */
public class UltimoGiro extends AbstractCard implements PrintedEffects.Source {

    /** Il danno fisso all'avversario. */
    @Tunable
    private int base;
    /** Il danno a sé. */
    @Tunable
    private int selfHit;
    /** Rincara: i HIT in più all'avversario per giocata precedente. */
    @Tunable
    private int perPlay;
    /** Rincara: i HIT in più a sé per giocata precedente. */
    @Tunable
    private int perPlaySelf;

    /** La L spesa: quella dell'autore all'inizio della risoluzione. */
    private int alcohol;
    /** Le giocate precedenti della carta da parte del suo autore, lette all'inizio della risoluzione. */
    private int plays;

    public UltimoGiro() {
        super();
        setCanTarget(Set.of(CardTarget.OPPONENT));
        setCost(Map.of());
        setLastResort(true);
    }

    @Override
    public void applyOtherUnfathomableLogic(Game g, Move m) {
        Character self = g.getSelf(m).getCharacter();
        alcohol = Math.max(0, self.getResources().getOrDefault(Resource.ALCOHOL, 0));
        plays = g.getRuleset().playground() ? self.playsOf(getName()) : 0;
    }

    @Override
    public List<String> applyEffectOnSelf(Character self) {
        return List.of(
                self.inflictDamage(self, new Damage(Damage.DamageType.HIT, selfHit + perPlaySelf * plays)),
                self.emptyResource(Resource.ALCOHOL));
    }

    @Override
    public List<String> applyEffectOnTarget(Character self, Character target) {
        return List.of(self.inflictDamage(target, new Damage(Damage.DamageType.HIT, base + alcohol + perPlay * plays)));
    }

    /** Self HIT, ALCOHOL emptied, HIT of base plus the ALCOHOL read at the start of the resolution; «Rincara» on both damages. */
    @Override
    public PrintedEffects printedEffects() {
        return new PrintedEffects(List.of(
                PrintedEffects.Step.builder().kind(PrintedEffects.Kind.DAMAGE).onTarget(false).damageType(Damage.DamageType.HIT)
                        .base(selfHit).perPlay(perPlaySelf).build(),
                PrintedEffects.Step.builder().kind(PrintedEffects.Kind.EMPTY).resource(Resource.ALCOHOL).build(),
                PrintedEffects.Step.builder().kind(PrintedEffects.Kind.DAMAGE).onTarget(true).damageType(Damage.DamageType.HIT)
                        .base(base).of(Resource.ALCOHOL).atStart(true).perPlay(perPlay).build()));
    }
}
