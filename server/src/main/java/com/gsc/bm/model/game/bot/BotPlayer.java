package com.gsc.bm.model.game.bot;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.ComPlayer;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;

import java.util.List;
import java.util.Objects;
import java.util.Random;

/** A computer player whose choices go through a policy that sees only BotView. Not used by live matches yet (SB-30). */
public class BotPlayer extends ComPlayer {

    private final BotPolicy policy;

    public BotPlayer(String id, Character character, Card basicActionCard, List<Card> characterBoundCards,
                     Card lastResortCard, List<Card> deck, Random rng, BotPolicy policy) {
        super(id, character, basicActionCard, characterBoundCards, lastResortCard, deck, rng);
        this.policy = Objects.requireNonNull(policy);
    }

    /** The policy's class name, for the match archive (SB-8). Not a bean property: views never carry it. */
    public String policyName() {
        return policy instanceof SoughtHitPolicy ? ((SoughtHitPolicy) policy).archiveName() : policy.getClass().getSimpleName();
    }

    @Override
    public Move chooseMove(Game game) {
        BotView view = BotView.of(game, getPlayerId());
        List<LegalMove> legal = view.legalMoves();
        if (legal.isEmpty()) return Move.voidMove(getPlayerId());
        LegalMove chosen = policy.choose(view, legal, random());
        if (!legal.contains(chosen))
            throw new IllegalStateException(policy.getClass().getSimpleName() + " chose a move that is not legal: " + chosen);
        return chosen.toMove(getPlayerId(), game.getGameId());
    }
}
