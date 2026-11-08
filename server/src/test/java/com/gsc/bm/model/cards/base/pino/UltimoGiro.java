package com.gsc.bm.model.cards.base.pino;

/**
 * SB-14, LR-PIN del Set Base («L'ultimo giro»): la last resort di Pino, con la stessa logica di {@link GoingBerserk} (decisione B1).
 * Esiste come sottoclasse perché la bozza lega una carta Java al nome della sua classe e prende dalla classe l'essere last resort;
 * i numeri ({@code base 6}, {@code selfHit 5}) arrivano dalla bozza.
 */
public class UltimoGiro extends GoingBerserk {

    public UltimoGiro() {
        super();
        setLastResort(true);
    }
}
