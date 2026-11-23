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
 * «Lavoro Fatto Bene», slot GIG-AR5 del Set Base: la scheda è quella del documento del set. L'avversario subisce HIT pari a
 * {@code base} più {@code perItem} per ogni oggetto che l'autore ha in campo.
 * <p>
 * Gli oggetti si contano nella logica speciale, all'inizio della risoluzione e dopo i costi (regolamento, R04): contano anche i token;
 * gli equipaggiamenti no, perché sono stati e non oggetti. Numeri, costo e priorità sono nel file del set; ognuno è obbligatorio.
 */
public class LavoroFattoBene extends AbstractCard implements PrintedEffects.Source {

    /** Il danno fisso, senza oggetti. */
    @Tunable
    private int base;
    /** Il danno in più per ogni oggetto proprio sul campo. */
    @Tunable
    private int perItem;

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

    /** HIT of base plus perItem for each own item counted after costs. */
    @Override
    public PrintedEffects printedEffects() {
        return new PrintedEffects(List.of(PrintedEffects.Step.builder().kind(PrintedEffects.Kind.DAMAGE).onTarget(true)
                .damageType(Damage.DamageType.HIT).base(base).perItem(perItem).atStart(true).build()));
    }
}
