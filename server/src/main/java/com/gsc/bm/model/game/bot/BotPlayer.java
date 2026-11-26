package com.gsc.bm.model.game.bot;

import com.gsc.bm.model.Character;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.ComPlayer;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;

import java.util.List;
import java.util.Objects;
import java.util.Random;

/**
 * A computer player whose choices go through a policy that sees only BotView. SB-30a (R03 2.2, D203): the computer of the live
 * game, at the level it was created with; the playground and the profile bozza create it without a level.
 */
public class BotPlayer extends ComPlayer {

    private final BotPolicy policy;
    /** SB-30a: the level of a live computer, fixed at the start (R03 2.2); null outside the live game. */
    private final ComLevel level;

    public BotPlayer(String id, Character character, Card basicActionCard, List<Card> characterBoundCards,
                     Card lastResortCard, List<Card> deck, Random rng, BotPolicy policy) {
        this(id, character, basicActionCard, characterBoundCards, lastResortCard, deck, rng, policy, null);
    }

    public BotPlayer(String id, Character character, Card basicActionCard, List<Card> characterBoundCards,
                     Card lastResortCard, List<Card> deck, Random rng, BotPolicy policy, ComLevel level) {
        super(id, character, basicActionCard, characterBoundCards, lastResortCard, deck, rng);
        this.policy = Objects.requireNonNull(policy);
        this.level = level;
    }

    /** SB-30a: the level, for the match archive; null outside the live game. Not a bean property: views never carry it. */
    public ComLevel level() { return level; }

    /** The policy's class name, for the match archive (SB-8). Not a bean property: views never carry it. */
    public String policyName() {
        if (policy instanceof LethalAwarePolicy) return ((LethalAwarePolicy) policy).archiveName();
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
