package com.gsc.bm.service.session;

import com.gsc.bm.model.game.*;
import com.gsc.bm.service.session.model.ActionLog;
import com.gsc.bm.service.view.ViewExtractorService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@Log4j2
public class GameSessionServiceImpl implements GameSessionService {

    private final Map<Game, Set<String>> _GAMES = new ConcurrentHashMap<>();

    private final ConnectionsService connectionsService;
    private final GameLoggingService gameLoggingService;
    private final ViewExtractorService viewExtractorService;
    private final java.time.Clock clock;
    private final Map<String, String> current = new java.util.HashMap<>();
    // One latest receipt per account, in memory only. Logs have their own durable lifecycle.
    private final Map<String, Game> receipts = new java.util.HashMap<>();
    private final Set<String> awaitingOutcome = new java.util.HashSet<>();
    private final Set<String> finalized = new java.util.HashSet<>();
    private final Set<String> multiplayer = new java.util.HashSet<>();
    private java.util.function.Consumer<String> updates = id -> {};

    public GameSessionServiceImpl(ConnectionsService connections, GameLoggingService logging, ViewExtractorService views) {
        this(connections, logging, views, java.time.Clock.systemUTC());
    }

    @Autowired
    public void notifications(org.springframework.messaging.simp.SimpMessagingTemplate transport) {
        updates = id -> transport.convertAndSend("/topic/game/" + id + "/update", id);
    }

    @Autowired
    public GameSessionServiceImpl(ConnectionsService connectionsService,
                                  GameLoggingService gameLoggingService,
                                  ViewExtractorService viewExtractorService, java.time.Clock clock) {
        this.connectionsService = connectionsService;
        this.gameLoggingService = gameLoggingService;
        this.viewExtractorService = viewExtractorService;
        this.clock = clock;
    }

    @Override
    public synchronized String newGame(Game game) {
        for (Player player : game.getPlayers().values()) {
            if (!(player instanceof ComPlayer)) { checkAvailable(player.getPlayerId()); }
        }
        Set<String> usersSubscribed = game.getPlayers().values()
                .stream()
                .filter(p -> !(p instanceof ComPlayer))
                .map(Player::getPlayerId)
                .peek(p -> connectionsService.userActivityChanged(
                        p, "Playing against "
                                + game.getOpponents(p).stream().map(Player::getPlayerId).collect(Collectors.joining(","))))
                .collect(Collectors.toSet());

        _GAMES.put(game, usersSubscribed);
        for (String user : usersSubscribed) { current.put(user, game.getGameId()); receipts.remove(user); awaitingOutcome.remove(user); }
        if (usersSubscribed.size() >= 2) { multiplayer.add(game.getGameId()); }
        startMoveClocks(game);
        log.info("Created Game " + game.getGameId() + " with users subscribed: " + usersSubscribed);
        gameLoggingService.log(
                game, GameLoggingService.STARTED,
                new ActionLog("Created Game", viewExtractorService.extractGlobalSlimView(game)));

        return game.getGameId(); // return the id just for convenience
    }

    @Override
    public synchronized Game getGame(String gameId) {
        for (Game g : _GAMES.keySet())
            if (g.getGameId().equals(gameId))
                return g;
        throw new IllegalArgumentException(gameId);
    }

    @Override
    public synchronized void leaveGame(String gameId, String playerId) {
        Game game;
        try { game = getGame(gameId); }
        catch (IllegalArgumentException missing) {
            if (canLeave(gameId, playerId)) { awaitingOutcome.remove(playerId); return; }
            throw missing;
        }
        if (!game.getPlayers().containsKey(playerId) || game.getPlayers().get(playerId) instanceof ComPlayer) {
            throw new IllegalArgumentException("Not a participant");
        }
        expireDue();
        if (!_GAMES.containsKey(game)) { awaitingOutcome.remove(playerId); return; }
        boolean subscribed = _GAMES.get(game).remove(playerId);
        if (!subscribed && !gameId.equals(current.get(playerId))) { return; }
        game.getReconnectDeadlines().remove(playerId);
        if (!game.isOver() && !game.isEliminated(playerId)) {
            game.forfeit(playerId, "leave");
            game.getMoveDeadlines().remove(playerId);
            lifecycle(game, "FORFEIT", MatchSnapshot.fields("playerId", playerId, "reason", "leave"));
            advanceAfterForfeit(game, "leave");
        }
        receipts.put(playerId, copy(game));
        awaitingOutcome.remove(playerId);
        current.remove(playerId, gameId);
        connectionsService.userActivityChanged(playerId, "Free");
        notifyUpdate(game);
        cleanup(game);
    }

    @Override
    public synchronized void checkAvailable(String user) {
        String id = current.get(user);
        if (id != null) { throw new IllegalArgumentException("Leave or resume the current game first"); }
    }

    @Override
    public synchronized boolean canLeave(String gameId, String user) {
        try { return getGame(gameId).getPlayers().containsKey(user); }
        catch (IllegalArgumentException e) {
            return receipts.containsKey(user) && receipts.get(user).getGameId().equals(gameId);
        }
    }

    @Override
    public synchronized void logout(String user) {
        String id = current.get(user);
        if (id != null) { leaveGame(id, user); }
        awaitingOutcome.remove(user);
    }

    @Override
    public synchronized void disconnected(String user) {
        String id = current.get(user);
        if (id == null) { return; }
        Game game = getGame(id);
        if (!game.isOver() && !game.isEliminated(user) && !game.getReconnectDeadlines().containsKey(user)) {
            game.getReconnectDeadlines().put(user, clock.millis() + 30_000);
            lifecycle(game, "DISCONNECTED", MatchSnapshot.fields("playerId", user, "deadline", game.getReconnectDeadlines().get(user)));
            notifyUpdate(game);
        }
        _GAMES.get(game).remove(user);
        cleanup(game);
    }

    @Override
    public synchronized Object resume(String user) {
        expireDue();
        String id = current.get(user);
        Game game = id == null ? (awaitingOutcome.contains(user) ? receipts.get(user) : null) : getGame(id);
        if (game == null) { return MatchSnapshot.fields("status", "none"); }
        boolean terminal = game.isOver() || game.isEliminated(user);
        if (id != null && !terminal) {
            if (game.getReconnectDeadlines().remove(user) != null) {
                lifecycle(game, "RECONNECTED", MatchSnapshot.fields("playerId", user));
            }
            _GAMES.get(game).add(user);
            connectionsService.userActivityChanged(user, "Playing");
            notifyUpdate(game);
        }
        return MatchSnapshot.fields("status", terminal ? "finished" : "resumed", "gameId", game.getGameId(),
                "view", viewExtractorService.extractViewFor(copy(game), user));
    }

    private void startMoveClocks(Game game) {
        game.getMoveDeadlines().clear();
        game.getReconnectDeadlines().keySet().removeIf(game::isEliminated);
        if (multiplayer.contains(game.getGameId()) && !game.isOver()) {
            long deadline = clock.millis() + 30_000;
            game.getPlayers().values().stream().filter(p -> !(p instanceof ComPlayer) && !game.isEliminated(p.getPlayerId()))
                    .forEach(p -> game.getMoveDeadlines().put(p.getPlayerId(), deadline));
        }
    }

    @Override
    public synchronized void expireDue() {
        long now = clock.millis();
        for (Game game : new java.util.ArrayList<>(_GAMES.keySet())) {
            while (!game.isOver()) {
                long deadline = java.util.stream.Stream.concat(game.getMoveDeadlines().values().stream(),
                        game.getReconnectDeadlines().values().stream()).mapToLong(Long::longValue).min().orElse(Long.MAX_VALUE);
                if (deadline > now) { break; }
                Map<String, String> due = new java.util.LinkedHashMap<>();
                game.getPlayers().keySet().forEach(user -> {
                    if (java.util.Objects.equals(game.getMoveDeadlines().get(user), deadline)) { due.put(user, "move timeout"); }
                    if (java.util.Objects.equals(game.getReconnectDeadlines().get(user), deadline)) { due.putIfAbsent(user, "reconnect timeout"); }
                });
                // Batch the same absolute deadline before counting survivors.
                due.forEach((user, reason) -> {
                    game.getMoveDeadlines().remove(user); game.getReconnectDeadlines().remove(user);
                    if (!game.isEliminated(user)) { game.forfeit(user, reason); }
                });
                lifecycle(game, "FORFEIT", MatchSnapshot.fields("deadline", deadline, "players", due));
                advanceAfterForfeit(game, "timeout");
                notifyUpdate(game);
            }
            cleanup(game);
        }
    }

    private void advanceAfterForfeit(Game game, String reason) {
        Game beforeResolution = copy(game);
        java.util.List<ActionLog> eventsToRecord = new java.util.ArrayList<>();
        try {
            if (!game.isOver() && game.isReadyToResolveMoves()) {
                game.resolveMoves(g -> {}, (turn, events) -> {
                    eventsToRecord.add(new ActionLog("ENGINE_REPORT", new java.util.ArrayList<>(events))); events.clear();
                }, (stage, snapshot) -> eventsToRecord.add(new ActionLog(stage, copy(snapshot))));
                startMoveClocks(game);
            }
        } catch (RuntimeException failure) {
            game.restoreFrom(beforeResolution);
            eventsToRecord.clear();
            log.error("Lifecycle round failed; forfeits retained, round restored for {}", game.getGameId(), failure);
        }
        for (ActionLog event : eventsToRecord) { lifecycle(game, event.getWhat(), event.getData()); }
        finalizeOnce(game, reason);
        lifecycle(game, "LIFECYCLE_COMMITTED", game);
        if (game.isOver()) { recordOutcome(game); }
    }

    private void finalizeOnce(Game game, String reason) {
        if (!game.isOver() || !finalized.add(game.getGameId())) { return; }
        game.noteOutcome(reason);
        game.getMoveDeadlines().clear(); game.getReconnectDeadlines().clear();
    }

    private final Set<String> outcomesRecorded = new java.util.HashSet<>();
    private void recordOutcome(Game game) {
        if (outcomesRecorded.add(game.getGameId())) { lifecycle(game, "OUTCOME", game); }
    }

    private void lifecycle(Game game, String kind, Object data) {
        try { gameLoggingService.committed(game, java.util.List.of(new ActionLog(kind, data))); }
        catch (RuntimeException failure) { log.error("Post-commit lifecycle recording failed for game {}", game.getGameId(), failure); }
    }

    private void notifyUpdate(Game game) {
        try { updates.accept(game.getGameId()); }
        catch (RuntimeException failure) { log.error("Post-commit notification failed for game {}", game.getGameId(), failure); }
    }

    private void cleanup(Game game) {
        if (!game.isOver() || !_GAMES.getOrDefault(game, java.util.Set.of()).isEmpty()) { return; }
        for (Player p : game.getPlayers().values()) {
            String user = p.getPlayerId();
            if (!(p instanceof ComPlayer) && game.getGameId().equals(current.get(user))) {
                receipts.put(user, copy(game)); current.remove(user);
                awaitingOutcome.add(user);
            }
        }
        gameLoggingService.flush(game);
        _GAMES.remove(game); multiplayer.remove(game.getGameId());
        finalized.remove(game.getGameId()); outcomesRecorded.remove(game.getGameId());
    }

    @Override
    public synchronized Game snapshotGame(String gameId) {
        expireDue();
        return copy(getGame(gameId));
    }

    private Game copy(Game game) {
        return (Game) org.springframework.util.SerializationUtils.deserialize(
                org.springframework.util.SerializationUtils.serialize(game));
    }

    @Override
    public synchronized void submitMoveToGame(Move move, Runnable callback) throws IllegalMoveException {
        expireDue();
        Game game = getGame(move.getGameId());
        if (game.isOver() || game.isEliminated(move.getPlayerId())) {
            throw new IllegalMoveException(move.getPlayerId(), "Game is over or player eliminated");
        }
        Game before = copy(game);
        java.util.List<ActionLog> completedTurns = new java.util.ArrayList<>();
        java.util.List<ActionLog> archiveEvents = new java.util.ArrayList<>();
        boolean archive = (game.getType().startsWith("quick") || game.getType().equals("open1vCom"));
        boolean resolved;
        try {
            game.submitMove(move);
            game.getMoveDeadlines().remove(move.getPlayerId());
            if (archive) { archiveEvents.add(new ActionLog("MOVE_ACCEPTED", move)); }
            resolved = game.isReadyToResolveMoves();
            if (resolved) {
                game.resolveMoves(g -> {}, (turn, events) -> {
                    completedTurns.add(new ActionLog("Turn " + turn + " internal Game Logs", new java.util.ArrayList<>(events)));
                    if (archive) { archiveEvents.add(new ActionLog("ENGINE_REPORT", new java.util.ArrayList<>(events))); }
                    events.clear();
                }, (stage, snapshot) -> {
                    if (archive) { archiveEvents.add(new ActionLog(stage, snapshot)); }
                });
            }
        } catch (RuntimeException failure) {
            game.restoreFrom(before);
            if (failure instanceof IllegalMoveException) { throw failure; }
            log.error("Round resolution failed for game {}", game.getGameId(), failure);
            throw new IllegalMoveException(move.getPlayerId(), "Round resolution failed; state restored, please retry");
        }
        if (resolved) { startMoveClocks(game); }
        finalizeOnce(game, "combat");
        // State has committed. Diagnostics failures must not roll back an already completed round.
        try {
            if (archive) {
                archiveEvents.add(new ActionLog("COMMAND_COMMITTED", game));
                if (game.isOver() && outcomesRecorded.add(game.getGameId())) { archiveEvents.add(new ActionLog("OUTCOME", game)); }
                gameLoggingService.committed(game, archiveEvents);
            }
            gameLoggingService.log(game, GameLoggingService.IN_PROGRESS,
                    new ActionLog("Human Player " + move.getPlayerId() + " submitted a Move", move));
            for (ActionLog event : completedTurns) { gameLoggingService.log(game, GameLoggingService.IN_PROGRESS, event); }
            if (resolved) {
                gameLoggingService.log(game, GameLoggingService.IN_PROGRESS,
                        new ActionLog("Game Updated after Moves Resolutions Chain", viewExtractorService.extractGlobalSlimView(game)));
            }
        } catch (RuntimeException failure) { log.error("Post-commit logging failed for game {}", game.getGameId(), failure); }
        if (resolved) {
            try { callback.run(); }
            catch (RuntimeException failure) { log.error("Post-commit notification failed for game {}", game.getGameId(), failure); }
        }
    }

}
