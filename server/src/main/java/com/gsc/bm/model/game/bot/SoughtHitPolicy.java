package com.gsc.bm.model.game.bot;

import java.util.*;
import java.util.stream.Collectors;

/** D74: a public-information decision about the announced hit, independent of the underlying style. */
public final class SoughtHitPolicy implements BotPolicy {
    public enum Timing { ALWAYS, HOLD_IF_DEFENDED, RANDOM }
    private final BotPolicy style;
    private final Timing timing;

    public SoughtHitPolicy(BotPolicy style, Timing timing) {
        this.style = Objects.requireNonNull(style); this.timing = Objects.requireNonNull(timing);
    }

    public String archiveName() { return "SoughtHitPolicy(" + timing + "," + style.getClass().getSimpleName() + ")"; }

    @Override public LegalMove choose(BotView view, List<LegalMove> legal, Random random) {
        if (!view.getRuleset().playground()) return style.choose(view, legal, random);
        Set<String> names = view.getSelf().getSeat().getStatuses().stream()
                .filter(s -> s.getExposure() != null && s.getUntilPlayed() != null)
                .map(BotView.StatusSeen::getUntilPlayed).collect(Collectors.toSet());
        List<LegalMove> hits = legal.stream().filter(m -> names.contains(m.getCard().getName())).collect(Collectors.toList());
        boolean defended = view.getLastRound().stream().anyMatch(m -> !m.isVoided()
                && !m.getPlayerId().equals(view.getSelf().getSeat().getPlayerId())
                && ("DEFENSE".equals(m.getRole()) || "COUNTER".equals(m.getRole()))
                && view.getOpponents().stream().anyMatch(o -> o.getSeat().getPlayerId().equals(m.getPlayerId())
                        && !o.getSeat().isDead() && !o.getSeat().isForfeited()));
        List<LegalMove> pool = legal;
        if (!hits.isEmpty()) {
            boolean play = timing == Timing.ALWAYS || (timing == Timing.HOLD_IF_DEFENDED && !defended)
                    || (timing == Timing.RANDOM && random.nextBoolean());
            if (play) pool = hits;
            else {
                List<LegalMove> other = legal.stream().filter(m -> !names.contains(m.getCard().getName())).collect(Collectors.toList());
                if (!other.isEmpty()) pool = other;
            }
        }
        // Avoid discarding the only held answer to a token when another regular discard exists.
        List<LegalMove> safe = pool.stream().filter(m -> m.getDiscard() == null || !names.contains(m.getDiscard())
                || view.getSelf().getHand().stream().filter(c -> c.getName().equals(m.getDiscard())).count() > 1).collect(Collectors.toList());
        if (!safe.isEmpty()) pool = safe;
        LegalMove chosen = style.choose(view, pool, random);
        if (chosen.getCard().nominalDamage() <= 0 || "SELF".equals(chosen.getTargetId())) return chosen;
        // For the same attack and discard, prefer the exposed target; no pending choice is consulted.
        LegalMove best = chosen;
        double factor = factor(view, chosen.getTargetId());
        for (LegalMove move : pool) if (move.getCard().equals(chosen.getCard())
                && Objects.equals(move.getDiscard(), chosen.getDiscard()) && Objects.equals(move.getItem(), chosen.getItem())) {
            double f = factor(view, move.getTargetId());
            if (f > factor) { best = move; factor = f; }
        }
        return best;
    }

    private static double factor(BotView view, String id) {
        return view.getOpponents().stream().filter(o -> o.getSeat().getPlayerId().equals(id)).findFirst().map(o -> {
            Map<Integer, Float> tokens = new HashMap<>();
            o.getSeat().getStatuses().stream().filter(s -> s.getExposure() != null && s.getFactor() != null)
                    .forEach(s -> tokens.put(s.getExposure(), s.getFactor()));
            return tokens.values().stream().mapToDouble(Float::doubleValue).reduce(1, (a, b) -> a * b);
        }).orElse(1.0);
    }
}
