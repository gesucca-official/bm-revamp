package com.gsc.bm.model.cards.base.com;

import com.gsc.bm.model.Character;

import java.util.List;

/**
 * SB-19 Fase B1, GEN-04 del Set Base «Elemosina molesta» ({@code BeggingMoney}, riprogettata, D129): la copia di un oggetto casuale
 * del bersaglio vicino a sé è quella della carta viva; della riprogettazione resta il solo costo (10 A invece di 25 T, scritto nella
 * bozza) e manca l'effetto sul bersaglio, il −10 A, che la griglia toglie. È una sottoclasse della bozza per non toccare la carta
 * viva; costo e priorità arrivano dalla bozza. Nessun testo stampato: i bot la leggono dal testo della bozza (ruolo ITEMS, nessun
 * danno), come leggono {@code Steal}. Solo bozza del Set Base (SB-28).
 */
public class BeggingMoney extends com.gsc.bm.model.cards.junkie.BeggingMoney {

    /** GEN-04: niente −A al bersaglio. */
    @Override
    public List<String> applyEffectOnTarget(Character self, Character target) {
        return null;
    }
}
