package com.gsc.bm.model.game;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.Character;
import com.gsc.bm.model.cards.Card;
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
    /** SB-16g 2a, playground only: the last id given to a vulnerability token or to a card found by a search (D58, D69). */
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
            // SB-16g 2a: an eliminated player keeps no face-up card and no vulnerability token.
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
        // SB-16g 2a (D69): the cards played in the current speed group, by player, in order.
        List<Map.Entry<Player, String>> played = new ArrayList<>();

        for (Move m : pendingMoves) {
            if (ruleset.playground()) {
                if (!speed.get(m).equals(group)) {
                    // SB-16g 2a (D69): the tokens satisfied in the group just ended go now, so that inside a group moves stay
                    // simultaneous (D50, point 1) whatever their order.
                    settleGroup(played);
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
            Card card = getCardFromHand(m.getPlayerId(), m.getPlayedCardName());
            // SB-16g 2a (D69): a card played satisfies the oldest token bound to its name, even if the move is voided.
            if (ruleset.playground()) played.add(new AbstractMap.SimpleEntry<>(self, card.getName()));
            self.discardCard(card);
            Card found = null;
            boolean searched = false;
            if (self.getCardsInHand().size() < Player.CARDS_IN_HAND) {
                if (ruleset.playground() && search != null && !m.isVoid()) {
                    found = self.searchCard(search);
                    searched = true;
                    loggedTurnEvents.add("Player " + m.getPlayerId() + " searched the deck for " + search + ": "
                            + (found != null ? "found " + found.getName() : "not in the deck, normal draw"));
                } else self.drawCard();
            }
            // SB-16g 2a (D69): the card found goes to the hand (an object found goes to the field and leaves no mark).
            Card inHand = found != null && self.holds(found) ? found : null;
            Integer copy = ruleset.playground() && !m.isVoid() && (vulnerability != null || inHand != null)
                    ? mark(self, inHand, vulnerability) : null;
            if (searched) m.recordSearch(search, found, copy);
        }
        if (ruleset.playground()) settleGroup(played);

        resolvedMoves.clear();
        resolvedMoves.addAll(pendingMoves);
        pendingMoves.clear();

        timeBasedEffects.clear();
        for (String playerId : players.keySet())
            if (!isEliminated(playerId))
                timeBasedEffects.put(playerId, players.get(playerId).getCharacter().resolveTimeBasedEffects());
        // SB-16g 2a: at the end of the match, and for an eliminated player, no card stays face up and no token is left.
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
     * SB-16g 2a (D58, D69): what a resolved charge leaves on its author, with a new id. A card found by the search and gone to the
     * hand becomes a mark bound to its name, shown face up while it is in hand, and the vulnerability token, if any, is bound to
     * that name with no timer. Without a card in hand the token is bound to nothing and lasts as a normal status. Returns the id
     * of the mark, or null if there is none.
     */
    private Integer mark(Player self, Card found, Vulnerability vulnerability) {
        int id = ++revealSerial;
        if (vulnerability != null) {
            self.getCharacter().getStatuses().addAll(vulnerability.statuses(id, found != null ? found.getName() : null));
            loggedTurnEvents.add("Player " + self.getPlayerId() + " is vulnerable: x" + vulnerability.factor + " " + vulnerability.damage
                    + (found != null ? " until " + found.getName() + " is played" : " for " + vulnerability.turnsIfNotFound + " turns"));
        }
        if (found == null) return null;
        self.getRevealed().add(new Player.Revealed(id, found, turn));
        return id;
    }

    /**
     * SB-16g 2a (D69), end of a speed group: each card played ends the oldest mark bound to its name, with its token, whichever
     * copy was played; a token of a failed search is bound to nothing and is not ended by a play. A card found that left the hand
     * otherwise (discarded) is no longer shown face up, and its token stays until a card with its name is played.
     */
    private void settleGroup(List<Map.Entry<Player, String>> played) {
        for (Map.Entry<Player, String> e : played) {
            Player p = e.getKey();
            for (Player.Revealed r : p.getRevealed())
                if (r.getCard().getName().equalsIgnoreCase(e.getValue())) {
                    p.getRevealed().remove(r);
                    p.getCharacter().getStatuses().removeIf(s -> Objects.equals(s.getExposure(), r.getId()));
                    loggedTurnEvents.add("Player " + p.getPlayerId() + " played " + e.getValue() + ": the mark of its search ends");
                    break;
                }
        }
        played.clear();
        // A mark whose copy left the hand is no longer shown; it is kept only while it has a token, to know which name ends it.
        for (Player p : players.values())
            p.getRevealed().removeIf(r -> !p.holds(r.getCard())
                    && p.getCharacter().getStatuses().stream().noneMatch(s -> Objects.equals(s.getExposure(), r.getId())));
    }

    /** SB-16g 2a: no face-up card and no vulnerability token left (end of the match, eliminated player). */
    private void dropRevealed(Player p) {
        if (p == null) return;
        p.getRevealed().clear();
        p.getCharacter().getStatuses().removeIf(s -> s.getExposure() != null);
    }

    @JsonIgnore
    public Card getCardFromHand(String playerId, String cardName) {
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
