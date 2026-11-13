package com.gsc.bm.model.game;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.status.Status;
import com.gsc.bm.model.game.status.Vulnerability;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.codec.binary.Hex;

import java.io.Serializable;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.function.BiConsumer;
import java.util.function.Consumer;
import java.util.stream.Collectors;

@Log4j2
@Getter
@ToString
public class Game implements Serializable {

    // TODO move this in its own file?
    public static class LoggingList extends ArrayList<String> implements Serializable {

        private final boolean printLogs;

        public LoggingList(boolean printLogs) {
            this.printLogs = printLogs;
        }

        @Override
        public boolean add(String s) {
            if (printLogs)
                log.info(s);
            return super.add(s);
        }
    }

    private String gameId;
    private final Map<String, Player> players;

    private final List<Move> pendingMoves = new ArrayList<>();

    private final List<Move> resolvedMoves = new ArrayList<>();
    private final Map<String, List<String>> timeBasedEffects = new HashMap<>();

    private final Map<String, String> forfeits = new LinkedHashMap<>();
    private final Map<String, Long> moveDeadlines = new LinkedHashMap<>();
    private final Map<String, Long> reconnectDeadlines = new LinkedHashMap<>();
    private String outcomeReason;
    /** SB-16c: {@link Ruleset#LIVE} (regulation 1.13) unless the profile bozza or the runner choose the playground rules. */
    @JsonIgnore
    @ToString.Exclude
    private Ruleset ruleset = Ruleset.LIVE;
    /** SB-16g 2a, playground only: the last id given to a vulnerability or to a copy found by a search (D58, D65). */
    @JsonIgnore
    @ToString.Exclude
    private int revealSerial = 0;

    /** Chooses the rules of this match, before its first turn; every character follows them too. */
    public void useRuleset(Ruleset ruleset) {
        if (turn != 0 || !resolvedMoves.isEmpty()) throw new IllegalStateException("rules are chosen before the first turn");
        this.ruleset = Objects.requireNonNull(ruleset);
        for (Player p : players.values()) p.getCharacter().useRuleset(ruleset);
    }

    public boolean isEliminated(String playerId) {
        return forfeits.containsKey(playerId) || players.get(playerId).getCharacter().isDead();
    }

    public void forfeit(String playerId, String reason) {
        if (!isEliminated(playerId)) {
            forfeits.putIfAbsent(playerId, reason);
            pendingMoves.removeIf(m -> playerId.equals(m.getPlayerId()));
            // SB-16g 2a: an eliminated player holds no face-up copy and no vulnerability past its minimum.
            dropRevealed(players.get(playerId));
            if (isOver()) for (Player p : players.values()) dropRevealed(p);
        }
    }

    public void noteOutcome(String reason) { if (outcomeReason == null) { outcomeReason = reason; } }

    private int turn = 0; // why keeping it here? client could use it
    @JsonIgnore
    private final String type;
    @JsonIgnore
    private final LoggingList loggedTurnEvents;

    @JsonProperty
    public boolean isOver() {
        int dead = 0;
        for (String playerId : players.keySet())
            if (isEliminated(playerId))
                dead++;
        return dead >= players.size() - 1;
    }

    @JsonProperty
    public Optional<String> getWinner() {
        if (isOver())
            for (String playerId : players.keySet())
                if (!isEliminated(playerId))
                    return Optional.of(players.get(playerId).getPlayerId());
        return Optional.empty();
    }

    public Game(List<Player> players, String type, boolean printLogs) {
        generateGameId(players);
        this.type = type;
        // rearrange players in a map
        this.players = new LinkedHashMap<>(players.size());
        for (Player p : players)
            this.players.put(p.getPlayerId(), p);

        loggedTurnEvents = new LoggingList(printLogs);
    }

    /** Restore a coherent object graph after a failed service transaction. */
    public void restoreFrom(Game snapshot) {
        players.clear(); players.putAll(snapshot.players);
        pendingMoves.clear(); pendingMoves.addAll(snapshot.pendingMoves);
        resolvedMoves.clear(); resolvedMoves.addAll(snapshot.resolvedMoves);
        timeBasedEffects.clear(); timeBasedEffects.putAll(snapshot.timeBasedEffects);
        loggedTurnEvents.clear(); loggedTurnEvents.addAll(snapshot.loggedTurnEvents);
        turn = snapshot.turn;
        forfeits.clear(); forfeits.putAll(snapshot.forfeits);
        moveDeadlines.clear(); moveDeadlines.putAll(snapshot.moveDeadlines);
        reconnectDeadlines.clear(); reconnectDeadlines.putAll(snapshot.reconnectDeadlines);
        outcomeReason = snapshot.outcomeReason;
        ruleset = snapshot.ruleset;
        revealSerial = snapshot.revealSerial;
    }

    public void submitMove(Move move) throws IllegalMoveException {
        Move.MoveCheckResult moveCheckResult = move.isValidFor(this);
        if (moveCheckResult.isValid())
            pendingMoves.add(move);
        else {
            loggedTurnEvents.add("An Invalid Move has been Submitted: " + move);
            throw new IllegalMoveException(move.getPlayerId(), moveCheckResult.getComment());
        }
    }

    @JsonIgnore
    public boolean isReadyToResolveMoves() {
        autoSubmitDeadPlayersMove();
        autoSubmitComPlayersMove();
        return !isOver() && pendingMoves.size() == players.size();
    }

    public void resolveMoves(Consumer<Game> endChainCallback, BiConsumer<Integer, List<String>> turnEventsLogDrain) {
        resolveMoves(endChainCallback, turnEventsLogDrain, (stage, game) -> {});
    }

    /** Observes complete round boundaries; does not affect ordering or decisions. */
    public void resolveMoves(Consumer<Game> endChainCallback, BiConsumer<Integer, List<String>> turnEventsLogDrain,
                             BiConsumer<String, Game> observer) {
        if (!isReadyToResolveMoves())
            throw new RuntimeException("Trying to Resolve Moves when Game is not Ready!");

        observer.accept("ROUND_READY", this);

        pendingMoves.removeAll(
                pendingMoves.stream().filter(Move::isVoid).collect(Collectors.toList())
        );

        for (Move m : pendingMoves)
            m.applyCostTo(this);

        pendingMoves.sort(
                Comparator.comparingInt(
                        m -> {
                            Move move = (Move) m; // I am not sure why I have to downcast here
                            return -getCardFromHand(move.getPlayerId(), move.getPlayedCardName()).getPriority();
                        }
                ).thenComparingInt(
                        m -> -getSelf((Move) m).getCharacter().getResources().get(Resource.ALERTNESS)
                ).thenComparingInt(m -> new ArrayList<>(players.keySet()).indexOf(((Move)m).getPlayerId())));

        // D50, point 1 (playground only): speed group = same priority and same ALERTNESS after costs, fixed with the order.
        Map<Move, Long> speed = new IdentityHashMap<>();
        if (ruleset.playground())
            for (Move m : pendingMoves)
                speed.put(m, ((long) getCardFromHand(m.getPlayerId(), m.getPlayedCardName()).getPriority() << 32)
                        + (getSelf(m).getCharacter().getResources().get(Resource.ALERTNESS) & 0xffffffffL));
        Long group = null;
        Set<String> downAtGroupStart = new HashSet<>();

        for (Move m : pendingMoves) {
            if (ruleset.playground()) {
                if (!speed.get(m).equals(group)) {
                    // SB-16g 2a: a copy that left a hand in the group just ended releases its vulnerability now, so that inside
                    // a group moves stay simultaneous (D50, point 1) whatever their order.
                    releaseCopiesLeft();
                    group = speed.get(m);
                    downAtGroupStart.clear();
                    for (Player p : players.values()) if (p.getCharacter().isDead()) downAtGroupStart.add(p.getPlayerId());
                }
                voidIfDown(m, downAtGroupStart);
            }
            m.applyEffectTo(this);
            Player self = getSelf(m);
            // A search step runs only if the move resolved; a voided move draws normally.
            String search = self.getCharacter().takeRequestedSearch();
            Vulnerability vulnerability = self.getCharacter().takeRequestedVulnerability();
            // SB-16g 2a (D59, D64): the vulnerability of a charge starts when the charge resolves, found or not.
            Integer exposure = null;
            if (ruleset.playground() && vulnerability != null && !m.isVoid()) {
                exposure = ++revealSerial;
                self.getCharacter().getStatuses().addAll(vulnerability.statuses(exposure));
                loggedTurnEvents.add("Player " + m.getPlayerId() + " is vulnerable: x" + vulnerability.factor + " " + vulnerability.damage);
            }
            self.discardCard(getCardFromHand(m.getPlayerId(), m.getPlayedCardName()));
            if (self.getCardsInHand().size() < Player.CARDS_IN_HAND) {
                if (ruleset.playground() && search != null && !m.isVoid()) {
                    Card found = self.searchCard(search);
                    Integer copy = found != null && self.holds(found) ? reveal(self, found, exposure) : null;
                    m.recordSearch(search, found, copy);
                    loggedTurnEvents.add("Player " + m.getPlayerId() + " searched the deck for " + search + ": "
                            + (found != null ? "found " + found.getName() : "not in the deck, normal draw"));
                } else self.drawCard();
            }
        }
        if (ruleset.playground()) releaseCopiesLeft();

        resolvedMoves.clear();
        resolvedMoves.addAll(pendingMoves);
        pendingMoves.clear();

        timeBasedEffects.clear();
        for (String playerId : players.keySet())
            if (!isEliminated(playerId))
                timeBasedEffects.put(playerId, players.get(playerId).getCharacter().resolveTimeBasedEffects());
        // SB-16g 2a: at the end of the match, and for an eliminated player, no copy stays face up and no vulnerability is held.
        for (Player p : players.values())
            if (isOver() || isEliminated(p.getPlayerId())) dropRevealed(p);

        loggedTurnEvents.add("Turn " + turn + " has been Resolved.");
        turnEventsLogDrain.accept(turn, loggedTurnEvents);
        turn++;
        observer.accept("ROUND_COMMITTED", this);

        if (!isOver() && isReadyToResolveMoves())
            resolveMoves(endChainCallback, turnEventsLogDrain, observer);
        else endChainCallback.accept(this);
    }

    /**
     * D50, point 1: the move of an author already down when its speed group starts is voided, unless it targets the author or
     * one of its near items, or its card has «Ultimo colpo». Within a group moves stay simultaneous (D48's save stays).
     */
    private void voidIfDown(Move m, Set<String> downAtGroupStart) {
        if (m.isVoid() || !downAtGroupStart.contains(m.getPlayerId())) return;
        Card card = getCardFromHand(m.getPlayerId(), m.getPlayedCardName());
        boolean onSelf = "SELF".equalsIgnoreCase(m.getTargetId()) || m.getPlayerId().equals(m.getTargetId());
        if (onSelf || card.isLastBlow()) return;
        m.setVoid(true);
        m.setVoidReason(Move.DOWN);
        loggedTurnEvents.add("Player " + m.getPlayerId() + "'s Move " + m.getPlayedCardName() + " is voided: " + Move.DOWN);
    }

    @JsonIgnore
    public List<Player> getOpponents(String playerId) {
        List<Player> opponents = new ArrayList<>(players.size());
        players.values().forEach(p -> {
            if (!p.getPlayerId().equals(playerId) && !p.getCharacter().isDead())
                opponents.add(p);
        });
        return opponents;
    }

    /**
     * SB-16g 2a (D58, D65): the copy found by a search stays face up in the hand with a new id; the vulnerability of the same charge,
     * if any, is held by it. Returns the id.
     */
    private int reveal(Player self, Card found, Integer exposure) {
        int id = exposure != null ? exposure : ++revealSerial;
        self.getRevealed().add(new Player.Revealed(id, found, turn));
        if (exposure != null)
            for (Status s : self.getCharacter().getStatuses())
                if (exposure.equals(s.getExposure())) s.setHeldBy(id);
        return id;
    }

    /** SB-16g 2a (D65): every face-up copy no longer in its owner's hand releases its vulnerability. */
    private void releaseCopiesLeft() {
        for (Player p : players.values())
            for (Iterator<Player.Revealed> it = p.getRevealed().iterator(); it.hasNext(); ) {
                Player.Revealed r = it.next();
                if (p.holds(r.getCard())) continue;
                it.remove();
                release(p, r.getId());
                loggedTurnEvents.add("Player " + p.getPlayerId() + "'s card " + r.getCard().getName() + " found by a search has left the hand");
            }
    }

    /** SB-16g 2a: no face-up copy and no held vulnerability left (end of the match, eliminated player). */
    private void dropRevealed(Player p) {
        if (p == null) return;
        for (Player.Revealed r : p.getRevealed()) release(p, r.getId());
        p.getRevealed().clear();
    }

    /**
     * SB-16g 2a (D59, D65): the vulnerability held by the copy is no longer held. If its minimum (the charge's turn and the next)
     * is over it ends now; otherwise it ends with its minimum.
     */
    private static void release(Player p, int id) {
        for (Iterator<Status> it = p.getCharacter().getStatuses().iterator(); it.hasNext(); ) {
            Status s = it.next();
            if (!Objects.equals(s.getHeldBy(), id)) continue;
            s.setHeldBy(null);
            if (s.minimumSpent()) it.remove();
        }
    }

    @JsonIgnore
    public Card getCardFromHand(String playerId, String cardName) {
        // SB-16g 2a (D58, D65), playground only: among copies with the same name the face-up one leaves first (the oldest found),
        // so that playing or discarding it ends what it holds. A hidden copy with the same name stays hidden and holds nothing.
        Player owner = players.get(playerId);
        if (ruleset.playground() && owner != null)
            for (Player.Revealed r : owner.getRevealed())
                if (r.getCard().getName().equalsIgnoreCase(cardName) && owner.holds(r.getCard())) return r.getCard();
        // getting this card also checks if it is in that player's hand adn throws exception accordingly
        return players.get(playerId).getCardsInHand().stream()
                .filter(c -> c.getName().equalsIgnoreCase(cardName))
                .findAny()
                .orElseThrow(() -> {
                    loggedTurnEvents.add("Player " + playerId + " is trying to get an Illegal Card from Hand: " + cardName);
                    return new IllegalMoveException(playerId, "don't have that card in hand");
                });
    }

    @JsonIgnore
    public Card getItem(String playerId, String itemCardName) {
        if (!players.containsKey(playerId))
            throw new IllegalMoveException(playerId, "there's no such player");
        for (Card item : players.get(playerId).getCharacter().getItems())
            if (item.getName().equals(itemCardName))
                return item;
        loggedTurnEvents.add("Someone is trying to get an Illegal Item Card from " + playerId + " Items: " + itemCardName);
        throw new IllegalMoveException(playerId, "don't have that item");
    }

    @JsonIgnore
    public Player getSelf(Move move) {
        return players.get(move.getPlayerId());
    }

    @JsonIgnore
    public Player getTarget(Move move) {
        if (move.getTargetId().equalsIgnoreCase("SELF"))
            return players.get(move.getPlayerId());
        else
            return players.get(move.getTargetId());
    }

    @JsonIgnore
    public Optional<Move> getPendingMoveOfTargetIfMovesAfterPlayer(String playerId, String targetId) {
        loggedTurnEvents.add("Player " + playerId + "'s Move has queried for the Successive Move of " + targetId);
        // this is called by cards when they resolves, so pending moves are already sorted in resolution order
        for (int i = 0; i < pendingMoves.size(); i++) {
            if (pendingMoves.get(i).getPlayerId().equals(playerId))
                for (int j = i + 1; j < pendingMoves.size(); j++)
                    if (pendingMoves.get(j).getPlayerId().equals(targetId)) {
                        loggedTurnEvents.add("Successive Move found: " + pendingMoves.get(j));
                        return Optional.of(pendingMoves.get(j));
                    }
            // those nested cycles, those indexes... god that smells bad
        }
        loggedTurnEvents.add("Found nothing! This should not have happened.");
        loggedTurnEvents.add(pendingMoves.toString());
        return Optional.empty();
    }

    private void generateGameId(List<Player> players) {
        try {
            final MessageDigest digest = MessageDigest.getInstance("SHA3-256");
            final byte[] hashBytes = digest.digest(
                    (players.toString() + System.currentTimeMillis())
                            .getBytes(StandardCharsets.UTF_8));
            this.gameId = Hex.encodeHexString(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            this.gameId = players.toString() + System.currentTimeMillis();
        }
    }

    private void autoSubmitComPlayersMove() {
        // is a player is an AI player, automatically submit its move
        for (Player p : getPlayers().values())
            if (p instanceof ComPlayer && !isEliminated(p.getPlayerId()) && pendingMoves.stream().noneMatch(m -> m.getPlayerId().equals(p.getPlayerId()))) {
                Move comMove = ((ComPlayer) p).chooseMove(this);
                loggedTurnEvents.add("Player " + p.getPlayerId() + " auto submit Move: " + comMove);
                submitMove(comMove);
            }
    }

    private void autoSubmitDeadPlayersMove() {
        // dead players do nothing by default
        players.values().forEach(p -> {
            if (isEliminated(p.getPlayerId()) && pendingMoves.stream().noneMatch(m -> m.getPlayerId().equals(p.getPlayerId()))) {
                loggedTurnEvents.add("Player " + p.getPlayerId() + " is dead and is auto submitting an Empty Move");
                submitMove(Move.voidMove(p.getPlayerId()));
            }
        });
    }
}
