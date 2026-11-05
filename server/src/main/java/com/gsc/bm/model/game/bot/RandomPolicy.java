package com.gsc.bm.model.game.bot;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

/** The random player on the limited view: a random playable card, copies counting, then a random way to play it. */
public class RandomPolicy implements BotPolicy {

    @Override
    public LegalMove choose(BotView view, List<LegalMove> legalMoves, Random random) {
        List<BotView.CardSeen> hand = new ArrayList<>(view.getSelf().getHand());
        Collections.shuffle(hand, random);
        for (BotView.CardSeen card : hand) {
            List<LegalMove> ways = legalMoves.stream()
                    .filter(move -> move.getCard().getName().equals(card.getName()))
                    .collect(Collectors.toList());
            if (!ways.isEmpty()) return ways.get(random.nextInt(ways.size()));
        }
        throw new IllegalArgumentException("No legal move for any card in hand");
    }
}
