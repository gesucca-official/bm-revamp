package com.gsc.bm.model.game.bot;

import java.io.Serializable;
import java.util.List;
import java.util.Random;

/**
 * A way of playing. It sees only the view, and picks one of the legal moves, never empty when called.
 * Keep it stateless: the engine copies games with Java serialization. Use the given Random for every random choice.
 */
public interface BotPolicy extends Serializable {
    LegalMove choose(BotView view, List<LegalMove> legalMoves, Random random);
}
