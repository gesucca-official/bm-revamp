package com.gsc.bm.model.game.bot;

import java.util.List;
import java.util.Objects;
import java.util.Random;

/**
 * D76, playground rules only: a bot aware of the lethal hit of the current turn, around any style. With the public view and no
 * plan beyond this turn ({@link TurnForecast}), it keeps only the moves that avoid being brought down by a hit an opponent shows
 * and can pay, and among them only those that surely bring an opponent down, when there are any; then the wrapped policy chooses
 * among the moves kept as it always does. In every other case, and always with the live rules, it is the wrapped policy.
 * It draws nothing from the Random itself.
 */
public final class LethalAwarePolicy implements BotPolicy {

    private final BotPolicy inner;

    public LethalAwarePolicy(BotPolicy inner) { this.inner = Objects.requireNonNull(inner); }

    public BotPolicy inner() { return inner; }

    /** For the match archive: the wrapped policy's name inside this one's. */
    public String archiveName() {
        String name = inner instanceof SoughtHitPolicy ? ((SoughtHitPolicy) inner).archiveName() : inner.getClass().getSimpleName();
        return "LethalAwarePolicy(" + name + ")";
    }

    @Override
    public LegalMove choose(BotView view, List<LegalMove> legalMoves, Random random) {
        if (!view.getRuleset().playground()) return inner.choose(view, legalMoves, random);
        return inner.choose(view, TurnForecast.prefer(view, legalMoves), random);
    }
}
