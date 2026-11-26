package com.gsc.bm.service.factories;

import com.gsc.bm.bozza.BozzaDraft;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.ComPlayer;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.model.game.bot.BotPlayer;
import com.gsc.bm.model.game.bot.BotView;
import com.gsc.bm.model.game.bot.ComLevel;
import com.gsc.bm.model.game.bot.ComPolicies;
import com.gsc.bm.repo.external.UserDecksRepository;
import com.gsc.bm.repo.internal.CardKeywordsRecord;
import com.gsc.bm.repo.internal.CardKeywordsRepository;
import com.gsc.bm.service.catalog.LiveSet;
import com.gsc.bm.service.session.model.QueuedPlayer;
import com.gsc.bm.service.view.ViewExtractorService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.support.StaticListableBeanFactory;
import org.springframework.mock.env.MockEnvironment;

import java.io.*;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * SB-30a B2 (proposal §5, R03 and R08 2.2), always on: «no hidden information» on the live path. Positions from real games of the
 * live set with {@link Ruleset#LIVE}, played by computers that the live factory ({@link PlayerFactoryServiceImpl#craftComPlayer})
 * creates over the five starters: 60 positions of two seats (mixed levels) and 20 of three seats, created by the live FFA path
 * ({@link GameFactoryServiceImpl#craftQuickMultiPlayerGame}). For each, a copy of the game where only what a player cannot see
 * changes: the covered hand of every opponent (cards swapped with deck cards of another name), the order of every deck, a move an
 * opponent has already sent, the generators of the opponents. The views of the deciding computer must be equal, and the
 * {@link Move} of {@link BotPlayer#chooseMove(Game)} must be the same on both copies: for the computer the factory created, and
 * for a computer of the same seat at every level with every style of the live factory's policies.
 */
class LiveNoHiddenInformationTest {

    static LiveSet live;
    static final List<String> STYLES = List.copyOf(ComPolicies.STYLES.keySet());

    /** The policies of the live factory, with the styles of the set file. */
    static ComPolicies livePolicies;

    @BeforeAll static void load() throws Exception {
        livePolicies = players(0).policies();
    }

    /** The live factory with a seeded generator (also for {@link ComLevelFactoryTest}). */
    static PlayerFactoryServiceImpl players(long seed) {
        if (live == null) {
            try { live = new LiveSet(); } catch (Exception e) { throw new IllegalStateException(e); }
        }
        CardKeywordsRepository keywords = mock(CardKeywordsRepository.class);
        CardKeywordsRecord keyword = mock(CardKeywordsRecord.class);
        when(keyword.getHtml()).thenReturn("keyword");
        when(keywords.findById(anyString())).thenReturn(Optional.of(keyword));
        return new PlayerFactoryServiceImpl(live, new CharacterFactoryServiceImpl(live, mock(ViewExtractorService.class)),
                mock(UserDecksRepository.class), new CardFactoryServiceImpl(live, keywords), new Random(seed));
    }

    static GameFactoryServiceImpl games(PlayerFactoryServiceImpl players) {
        return new GameFactoryServiceImpl(new MockEnvironment(), players,
                new StaticListableBeanFactory().getBeanProvider(BozzaDraft.class));
    }

    /** A position: the game as bytes, and the computer that decides next. */
    static final class Point {
        final byte[] game;
        final String decider;

        Point(byte[] game, String decider) {
            this.game = game;
            this.decider = decider;
        }
    }

    private static final class TurnLimit extends RuntimeException { }

    /** Plays the game to the end, all computers, and keeps a position every third turn, deciding seat in turn. */
    static void play(Game game, List<Point> points, int wanted) {
        try {
            game.resolveMoves(g -> {}, (turn, events) -> events.clear(), (stage, g) -> {
                if (!stage.equals("ROUND_COMMITTED")) return;
                if (g.getTurn() > 200) throw new TurnLimit();
                if (g.isOver() || g.getTurn() % 3 != 1 || points.size() >= wanted) return;
                List<String> alive = g.getPlayers().keySet().stream().filter(id -> !g.isEliminated(id)).collect(Collectors.toList());
                points.add(new Point(bytes(g), alive.get(points.size() % alive.size())));
            });
        } catch (TurnLimit ignored) { /* the positions taken stay */ }
    }

    /** Two seats: two computers of the live factory, any starter, levels mixed across games. */
    static List<Point> duelPoints(int wanted, long seed) {
        PlayerFactoryServiceImpl players = players(seed);
        List<Point> points = new ArrayList<>();
        for (int g = 0; points.size() < wanted; g++) {
            ComLevel a = g % 2 == 0 ? ComLevel.NORMALE : ComLevel.FACILE, b = (g / 2) % 2 == 0 ? ComLevel.NORMALE : ComLevel.FACILE;
            Game game = new Game(List.of(players.craftComPlayer(null, a), players.craftComPlayer(null, b)), "quick1vCom", false);
            if (game.getPlayers().size() < 2) continue; // two equal ids: the factory draws them like the old ComPlayer
            game.useRuleset(Ruleset.LIVE);
            play(game, points, Math.min(wanted, points.size() + 4)); // at most four positions per game: many games
        }
        return points;
    }

    /** Three seats, by the live FFA path: three computers added to the queue, at Normale. */
    static List<Point> ffaPoints(int wanted, long seed) {
        PlayerFactoryServiceImpl players = players(seed);
        GameFactoryServiceImpl games = games(players);
        List<Point> points = new ArrayList<>();
        while (points.size() < wanted) {
            List<QueuedPlayer> queue = List.of(new QueuedPlayer("QueuedComPlayer", false), new QueuedPlayer("QueuedComPlayer", false),
                    new QueuedPlayer("QueuedComPlayer", false));
            Game game = games.craftQuickMultiPlayerGame(queue, "quickFFA");
            if (game.getPlayers().size() < 3) continue;
            play(game, points, Math.min(wanted, points.size() + 3));
        }
        return points;
    }

    static final class Counts {
        int checked, handChanged, everyOpponentChanged, pendingSent, withShown, choices, severalMoves;
        final Set<String> characters = new TreeSet<>();
        final Set<String> levels = new TreeSet<>();
    }

    @Test
    void duelsHiddenChangesLeaveViewAndMoveUnchanged() {
        Counts c = check(duelPoints(60, 30_100_000L), 1_000);
        System.out.println("sb30a hidden, two seats: checked " + c.checked + ", covered hand changed " + c.handChanged
                + ", opponent move already sent " + c.pendingSent + ", with shown cards " + c.withShown + ", with two legal moves or more "
                + c.severalMoves + ", moves compared "
                + c.choices + ", characters " + c.characters + ", levels " + c.levels);
        assertEquals(60, c.checked);
        assertTrue(c.handChanged >= 50, "covered hand changed: " + c.handChanged);
        assertEquals(60, c.pendingSent);
        assertTrue(c.withShown >= 5, "positions with a shown card: " + c.withShown);
        assertTrue(c.severalMoves >= 50, "positions with a choice: " + c.severalMoves);
        assertEquals(live.starters().stream().map(live.set()::characterOf).collect(Collectors.toCollection(TreeSet::new)),
                c.characters, "the deciding computers play all five starters");
        assertEquals(Set.of("FACILE", "NORMALE"), c.levels);
    }

    @Test
    void ffaHiddenChangesLeaveViewAndMoveUnchanged() {
        Counts c = check(ffaPoints(20, 30_200_000L), 2_000);
        System.out.println("sb30a hidden, three seats: checked " + c.checked + ", covered hand changed " + c.handChanged
                + ", every opponent changed " + c.everyOpponentChanged + ", opponent move already sent " + c.pendingSent
                + ", with two legal moves or more " + c.severalMoves
                + ", moves compared " + c.choices + ", characters " + c.characters + ", levels " + c.levels);
        assertEquals(20, c.checked);
        assertTrue(c.everyOpponentChanged >= 12, "both opponents' covered hands changed: " + c.everyOpponentChanged);
        assertEquals(20, c.pendingSent);
        assertTrue(c.severalMoves >= 15, "positions with a choice: " + c.severalMoves);
        assertEquals(Set.of("NORMALE"), c.levels, "the FFA computers play at Normale");
    }

    static Counts check(List<Point> points, long salt) {
        Counts c = new Counts();
        for (int i = 0; i < points.size(); i++) {
            Point p = points.get(i);
            Game same = game(p.game), other = game(p.game);
            Random random = new Random(salt + i);
            List<Player> foes = other.getOpponents(p.decider).stream().filter(f -> !other.isEliminated(f.getPlayerId()))
                    .collect(Collectors.toList());
            assertFalse(foes.isEmpty(), "punto " + i);
            int changed = 0;
            for (Player foe : foes) {
                List<String> before = names(foe.getCardsInHand());
                swapCoveredHand(foe, random);
                if (!before.equals(names(foe.getCardsInHand()))) changed++;
            }
            if (changed > 0) c.handChanged++;
            if (changed == foes.size()) c.everyOpponentChanged++;
            for (Player player : other.getPlayers().values()) Collections.shuffle(player.getDeck(), random);
            // A move an opponent has already sent (a human can send before the computer), then the generators moved on.
            Player first = foes.get(0);
            assertTrue(first instanceof ComPlayer);
            other.submitMove(((ComPlayer) first).chooseMove(other));
            c.pendingSent++;
            for (Player foe : foes) for (int k = random.nextInt(50) + 1; k > 0; k--) foe.random().nextInt();

            BotView v1 = BotView.of(same, p.decider), v2 = BotView.of(other, p.decider);
            assertEquals(v1, v2, "la vista pubblica deve restare la stessa, punto " + i);
            if (v1.getOpponents().stream().anyMatch(o -> !o.getRevealed().isEmpty())) c.withShown++;
            if (v1.legalMoves().size() >= 2) c.severalMoves++;

            // The computer the live factory created, with its own generator (equal in both copies).
            BotPlayer created = (BotPlayer) same.getPlayers().get(p.decider);
            c.characters.add(created.getCharacter().getBindingName());
            c.levels.add(created.level().name());
            assertEquals(key(created.chooseMove(same)), key(other.getPlayers().get(p.decider) instanceof BotPlayer
                    ? ((BotPlayer) other.getPlayers().get(p.decider)).chooseMove(other) : null), "computer creato, punto " + i);
            c.choices++;
            // The same seat at every level, with every style of the live factory's policies.
            String character = created.getCharacter().getBindingName();
            for (ComLevel level : List.of(ComLevel.FACILE, ComLevel.NORMALE)) {
                for (String style : level == ComLevel.FACILE ? List.of("-") : STYLES) {
                    ComPolicies policies = level == ComLevel.FACILE ? livePolicies : new ComPolicies(Map.of(character, style));
                    long seed = 42L * i + STYLES.indexOf(style) + 7L * level.ordinal();
                    Move m1 = seat(same, p.decider, policies, level, seed).chooseMove(same);
                    Move m2 = seat(other, p.decider, policies, level, seed).chooseMove(other);
                    assertEquals(key(m1), key(m2), level + " " + style + ", punto " + i);
                    c.choices++;
                }
            }
            c.checked++;
        }
        return c;
    }

    /**
     * A computer of the live policies in the seat of {@code id}: same id, so it decides from the view of that seat. Its own cards
     * are placeholders (it is not in the game): the decision reads hand and table from the game.
     */
    static BotPlayer seat(Game game, String id, ComPolicies policies, ComLevel level, long seed) {
        Player in = game.getPlayers().get(id);
        return new BotPlayer(id, in.getCharacter(), in.getLastResortCard(), List.of(), in.getLastResortCard(), List.of(),
                new Random(seed), policies.policyFor(level, in.getCharacter().getBindingName()), level);
    }

    /** Covered cards of the hand swapped with deck cards of another name: shown, bound, basic and last resort stay. */
    static void swapCoveredHand(Player foe, Random random) {
        List<Card> shown = new ArrayList<>();
        foe.getShownRevealed().forEach(r -> shown.add(r.getCard()));
        for (int h = 0; h < foe.getCardsInHand().size(); h++) {
            Card card = foe.getCardsInHand().get(h);
            if (card.isCharacterBound() || card.isBasicAction() || card.isLastResort() || shown.stream().anyMatch(x -> x == card)) continue;
            List<Integer> swappable = new ArrayList<>();
            for (int d = 0; d < foe.getDeck().size(); d++)
                if (!foe.getDeck().get(d).isItem() && !foe.getDeck().get(d).getName().equals(card.getName())) swappable.add(d);
            if (swappable.isEmpty()) continue;
            int d = swappable.get(random.nextInt(swappable.size()));
            Card fromDeck = foe.getDeck().get(d);
            foe.getDeck().set(d, card);
            foe.getCardsInHand().set(h, fromDeck);
        }
    }

    /** What a move says: card, author, target, game, discard and item, void, the name chosen for «Annuncia X o Y». */
    static List<Object> key(Move m) {
        if (m == null) return null;
        return Arrays.asList(m.getPlayedCardName(), m.getPlayerId(), m.getTargetId(), m.getGameId(), m.getChoices(), m.isVoid(),
                m.getSearchChoice());
    }

    private static List<String> names(List<Card> cards) {
        return cards.stream().map(Card::getName).sorted().collect(Collectors.toList());
    }

    static byte[] bytes(Game g) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            try (ObjectOutputStream o = new ObjectOutputStream(out)) { o.writeObject(g); }
            return out.toByteArray();
        } catch (IOException e) { throw new UncheckedIOException(e); }
    }

    static Game game(byte[] bytes) {
        try (ObjectInputStream in = new ObjectInputStream(new ByteArrayInputStream(bytes))) { return (Game) in.readObject(); }
        catch (Exception e) { throw new IllegalStateException(e); }
    }
}
