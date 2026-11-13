package com.gsc.bm.model.cards.base.gigi;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.Damage;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.PrintedEffects;
import com.gsc.bm.model.cards.Tunable;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * SB-15, GIG-AR5 del Set Base («Lavoro fatto bene», la rara di Gigi): HIT pari a {@code base} più {@code perItem} per ogni oggetto
 * proprio sul campo.
 * <p>
 * I passi dati leggono una risorsa dell'autore, non il numero dei suoi oggetti (decisione D35 della griglia: «una classe Java nuova per
 * la rara di Gigi»). La classe conta gli oggetti nella logica speciale, dopo i costi e prima degli effetti (R04), e poi colpisce. Contano
 * gli oggetti ancora sul campo, token compresi; gli equip sono oggetti già consumati e sono stati, non oggetti, quindi non contano.
 * <p>
 * Vive nei sorgenti di test: la partita viva non la conosce (SB-28). Costo e priorità arrivano dalla bozza.
 */
public class LavoroFattoBene extends AbstractCard implements PrintedEffects.Source {

    /** Il danno fisso, a tavolo vuoto. */
    @Tunable
    private int base = 6;
    /** Il danno in più per ogni oggetto proprio sul campo. */
    @Tunable
    private int perItem = 4;

    /** Gli oggetti dell'autore contati alla risoluzione. */
    private int items;

    public LavoroFattoBene() {
        super();
        setCanTarget(Set.of(CardTarget.OPPONENT));
        setCost(Map.of());
    }

    @Override
    public void applyOtherUnfathomableLogic(Game g, Move m) {
        items = g.getSelf(m).getCharacter().getItems().size();
    }

    @Override
    public List<String> applyEffectOnSelf(Character self) {
        return null;
    }

    @Override
    public List<String> applyEffectOnTarget(Character self, Character target) {
        return List.of(self.inflictDamage(target, new Damage(Damage.DamageType.HIT, base + perItem * items)));
    }

    /** D76: HIT of base plus perItem for each own item counted after costs. */
    @Override
    public PrintedEffects printedEffects() {
        return new PrintedEffects(List.of(PrintedEffects.Step.builder().kind(PrintedEffects.Kind.DAMAGE).onTarget(true)
                .damageType(Damage.DamageType.HIT).base(base).perItem(perItem).atStart(true).build()));
    }
}
