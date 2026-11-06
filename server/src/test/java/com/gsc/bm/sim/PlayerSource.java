package com.gsc.bm.sim;

import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.bot.BotPolicy;

import java.util.Random;

/** Chi prepara i giocatori del runner: il catalogo di oggi (SB-3) o una bozza del playground (SB-6a). */
interface PlayerSource {
    /** Il mazzo indicato, con l'ID e il generatore dati. Senza policy gioca l'attuale ComPlayer casuale. */
    Player player(String deck, String id, Random random, BotPolicy policy) throws Exception;
}
