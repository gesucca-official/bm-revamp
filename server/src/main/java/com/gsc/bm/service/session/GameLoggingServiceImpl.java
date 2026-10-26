package com.gsc.bm.service.session;

import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.repo.external.GameLogRecord;
import com.gsc.bm.repo.external.GameLogRepository;
import com.gsc.bm.service.session.model.ActionLog;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Repository
public class GameLoggingServiceImpl implements GameLoggingService {

    private static final Map<String, List<ActionLog>> GAMES_LOG = new ConcurrentHashMap<>();
    private static final ExecutorService SAVE_QUEUE = Executors.newSingleThreadExecutor();

    private final Environment environment;
    private final GameLogRepository repo;
    private final MatchArchiveService archive;

    public GameLoggingServiceImpl(Environment environment, GameLogRepository repo, MatchArchiveService archive) {
        this.environment = environment;
        this.repo = repo;
        this.archive = archive;
    }

    @Override
    public void log(Game game, String status, ActionLog actionLog) {
        if ((game.getType().startsWith("quick") || game.getType().equals("open1vCom"))) {
            if (STARTED.equals(status)) { archive.start(game); }
            return;
        }
        GAMES_LOG.computeIfAbsent(game.getGameId(), k -> new LinkedList<>());
        GAMES_LOG.get(game.getGameId()).add(actionLog);
        updateLogTable(game, status, GAMES_LOG.get(game.getGameId()));
    }

    @Override
    public void flush(Game game) {
        if ((game.getType().startsWith("quick") || game.getType().equals("open1vCom"))) { return; }
        updateLogTable(game, GameLoggingService.ENDED, GAMES_LOG.get(game.getGameId()));
        GAMES_LOG.remove(game.getGameId());
    }

    @Override
    public void committed(Game game, List<ActionLog> events) { archive.record(game, events); }

    private void updateLogTable(Game game, String status, List<ActionLog> log) {
        String players = game.getPlayers().values()
                .stream()
                .map(Player::getPlayerId)
                .reduce((p1, p2) -> p1 + ", " + p2)
                .orElse("Error reducing PlayerIds");
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        if (Objects.equals(environment.getProperty("log.db"), "Y"))
            SAVE_QUEUE.submit(() -> repo.save(new GameLogRecord(game.getGameId(), players, game.getType(), date, status, log)));
    }

}
