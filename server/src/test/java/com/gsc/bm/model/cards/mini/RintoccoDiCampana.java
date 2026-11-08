package com.gsc.bm.model.cards.mini;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.Tunable;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * SB-6b, mini-espansione di prova (set {@code mini}): solo per provare che un set nuovo porta una carta Java parametrica senza
 * toccare il motore. Non è una carta del Set Base e non raggiunge la partita viva.
 * <p>
 * Infligge al bersaglio HIT pari a {@code base} più {@code perItem} per ogni oggetto vicino al bersaglio. Il conteggio degli
 * oggetti non si esprime coi passi a dati, per questo è in Java. Costo e priorità arrivano dalla bozza.
 */
public class RintoccoDiCampana extends AbstractCard {

    /** Il danno fisso. */
    @Tunable
    private int base = 4;
    /** Il danno in più per ogni oggetto vicino al bersaglio. */
    @Tunable
    private int perItem = 3;

    public RintoccoDiCampana() {
        super();
        setCanTarget(Set.of(CardTarget.OPPONENT));
        setCost(Map.of());
    }

    @Override
    public void applyOtherUnfathomableLogic(Game g, Move m) {
    }

    @Override
    public List<String> applyEffectOnSelf(Character self) {
        return null;
    }

    @Override
    public List<String> applyEffectOnTarget(Character self, Character target) {
        return List.of(self.inflictDamage(target, new Damage(Damage.DamageType.HIT, base + perItem * target.getItems().size())));
    }
}
