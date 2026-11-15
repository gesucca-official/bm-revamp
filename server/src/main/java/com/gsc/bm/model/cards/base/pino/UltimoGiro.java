package com.gsc.bm.model.cards.base.pino;

import com.gsc.bm.model.cards.Tunable;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;

/**
 * SB-14, LR-PIN del Set Base («L'ultimo giro»): la last resort di Pino, con la stessa logica di {@link GoingBerserk} (decisione B1).
 * Esiste come sottoclasse perché la bozza lega una carta Java al nome della sua classe e prende dalla classe l'essere last resort;
 * i numeri ({@code base 6}, {@code selfHit 5}) arrivano dalla bozza.
 * <p>
 * SB-16i («Rincara X (Y a sé)», D95, D97): per ogni giocata precedente della carta da parte del suo autore, +{@code perPlay} HIT al
 * bersaglio e +{@code perPlaySelf} HIT a sé. Parametri facoltativi, 0 se la bozza non li scrive: le bozze storiche restano uguali.
 * Il contatore lo tiene la partita, solo con le regole del playground.
 */
public class UltimoGiro extends GoingBerserk {

    @Tunable(optional = true)
    private int perPlay = 0;
    @Tunable(optional = true)
    private int perPlaySelf = 0;

    /** The earlier plays of this card by its author, read when the move starts resolving. */
    private int plays;

    public UltimoGiro() {
        super();
        setLastResort(true);
    }

    @Override
    public void applyOtherUnfathomableLogic(Game g, Move m) {
        super.applyOtherUnfathomableLogic(g, m);
        plays = g.getRuleset().playground() ? g.getSelf(m).getCharacter().playsOf(getName()) : 0;
    }

    @Override protected int extraBase() { return perPlay * plays; }

    @Override protected int extraSelf() { return perPlaySelf * plays; }

    @Override protected int perPlayTarget() { return perPlay; }

    @Override protected int perPlaySelf() { return perPlaySelf; }
}
