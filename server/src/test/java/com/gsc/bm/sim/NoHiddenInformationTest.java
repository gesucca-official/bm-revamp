package com.gsc.bm.sim;

import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.ComPlayer;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.bot.*;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

/**
 * SB-30b B5b, §4 of the design, part 2, always on: «no hidden information» for the Normale and the Difficile. Positions from
 * real d50 games of the draft (Normale against Normale, mixed styles and decks, the probe's {@link Sb30bProbeTest#points}); for
 * each, a copy of the game where only what cannot be seen changes: the opponent's covered hand (cards swapped with deck cards of
 * another name), the order of both decks, a move the opponent has already sent, the state of the opponent's generator. The two
 * views must be equal; with the same seed both levels must choose the same move, and the Difficile must give the same value to
 * every move.
 */
class NoHiddenInformationTest {

    static Draft draft;
    static Map<String, BotView.CardSeen> catalog;
    static final List<BotPolicy> STYLES = List.of(new AggressivePolicy(), new PrudentPolicy(), new ResourceAwarePolicy());

    @BeforeAll static void load() throws Exception {
        draft = Draft.fromClasspath(Sb30bProbeTest.DRAFT);
        catalog = PublicCatalog.of(draft);
    }

    static BotPolicy sought(BotPolicy style) { return new SoughtHitPolicy(style, SoughtHitPolicy.Timing.ALWAYS); }

    @Test
    void hiddenChangesLeaveViewChoiceAndValuesUnchanged() throws Exception {
        List<Sb30bProbeTest.Point> points = Sb30bProbeTest.points(draft, 60, 7_400_000L, true);
        int checked = 0, handChanged = 0, pendingSent = 0, withThreats = 0, withRestriction = 0;
        for (int i = 0; i < points.size(); i++) {
            Sb30bProbeTest.Point p = points.get(i);
            Game same = Sb30bProbeTest.game(p.game), other = Sb30bProbeTest.game(p.game);
            Random random = new Random(1_000 + i);
            Player foe = other.getPlayers().get("seat-2"), mine = other.getPlayers().get("seat-1");
            List<String> before = names(foe.getCardsInHand());
            List<Card> shown = new ArrayList<>();
            foe.getShownRevealed().forEach(r -> shown.add(r.getCard()));
            for (int h = 0; h < foe.getCardsInHand().size(); h++) {
                Card c = foe.getCardsInHand().get(h);
                if (c.isCharacterBound() || c.isBasicAction() || c.isLastResort() || shown.stream().anyMatch(x -> x == c)) continue;
                List<Integer> swappable = new ArrayList<>();
                for (int d = 0; d < foe.getDeck().size(); d++)
                    if (!foe.getDeck().get(d).isItem() && !foe.getDeck().get(d).getName().equals(c.getName())) swappable.add(d);
                if (swappable.isEmpty()) continue;
                int d = swappable.get(random.nextInt(swappable.size()));
                Card fromDeck = foe.getDeck().get(d);
                foe.getDeck().set(d, c);
                foe.getCardsInHand().set(h, fromDeck);
            }
            Collections.shuffle(foe.getDeck(), random);
            Collections.shuffle(mine.getDeck(), random);
            if (!before.equals(names(foe.getCardsInHand()))) handChanged++;
            // A move the opponent has already sent (a human can send before the computer), then its generator moved on.
            if (foe instanceof ComPlayer) {
                other.submitMove(((ComPlayer) foe).chooseMove(other));
                pendingSent++;
            }
            for (int k = random.nextInt(50) + 1; k > 0; k--) foe.random().nextInt();

            BotView v1 = BotView.of(same, "seat-1"), v2 = BotView.of(other, "seat-1");
            assertEquals(v1, v2, "la vista pubblica deve restare la stessa, punto " + i);
            List<LegalMove> legal1 = v1.legalMoves(), legal2 = v2.legalMoves();
            if (legal1.size() < 2) continue;
            if (!v1.getOpponents().get(0).getRevealed().isEmpty()) withThreats++;
            for (int s = 0; s < STYLES.size(); s++) {
                long seed = 42L * i + s;
                BotPolicy normale = new LethalAwarePolicy(sought(STYLES.get(s)));
                assertEquals(normale.choose(v1, legal1, new Random(seed)), normale.choose(v2, legal2, new Random(seed)),
                        "Normale, punto " + i + " stile " + s);
                DifficilePolicy difficile = new DifficilePolicy(sought(STYLES.get(s)), catalog);
                Map<LegalMove, Double> values1 = difficile.values(v1, legal1), values2 = difficile.values(v2, legal2);
                assertEquals(values1, values2, "Difficile, valori, punto " + i);
                if (s == 0 && values1.size() < legal1.size()) withRestriction++;
                assertEquals(difficile.choose(v1, legal1, new Random(seed)), difficile.choose(v2, legal2, new Random(seed)),
                        "Difficile, punto " + i + " stile " + s);
            }
            checked++;
        }
        System.out.println("b5b hidden: points " + points.size() + ", checked " + checked + ", covered hand changed " + handChanged
                + ", opponent move already sent " + pendingSent + ", with shown cards " + withThreats
                + ", restricted by the Normale " + withRestriction);
        assertTrue(checked >= 40 && handChanged >= 40 && pendingSent == points.size(),
                checked + " " + handChanged + " " + pendingSent);
    }

    private static List<String> names(List<Card> cards) {
        return cards.stream().map(Card::getName).sorted().collect(Collectors.toList());
    }
}
