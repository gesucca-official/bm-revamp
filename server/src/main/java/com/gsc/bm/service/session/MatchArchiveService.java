package com.gsc.bm.service.session;

import com.fasterxml.jackson.databind.*;
import com.gsc.bm.model.game.*;
import com.gsc.bm.repo.external.MatchEventRepository;
import com.gsc.bm.repo.external.MatchEventRepository.Entry;
import com.gsc.bm.service.session.model.ActionLog;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.*;
import static com.gsc.bm.service.session.MatchSnapshot.fields;

/** Post-commit recording with immutable recovery batches. Never restores playable games. */
@Service
@Log4j2
public class MatchArchiveService {
    private static final class Stream {
        final Set<String> humans = new HashSet<>();
        final List<Entry> entries = new ArrayList<>();
        boolean failed, over;
        int persisted, journaled;
        boolean terminal;
        String failureAt;
    }
    private final Map<String, Stream> streams = new HashMap<>();
    private final MatchEventRepository repository;
    private final ObjectMapper mapper;
    private final MatchVersions versions;
    private final MatchRecoveryJournal recovery;
    public MatchArchiveService(MatchEventRepository repository, ObjectMapper mapper, MatchVersions versions) {
        this(repository, mapper, versions, null);
    }
    @org.springframework.beans.factory.annotation.Autowired
    public MatchArchiveService(MatchEventRepository repository, ObjectMapper mapper, MatchVersions versions, MatchRecoveryJournal recovery) {
        this.repository = repository; this.mapper = mapper; this.versions = versions; this.recovery = recovery;
        if (recovery != null) {
            try {
                for (var saved : recovery.read().entrySet()) {
                    Stream stream = new Stream(); stream.entries.addAll(saved.getValue());
                    stream.journaled = stream.entries.size();
                    describe(stream); streams.put(saved.getKey(), stream);
                }
            } catch (java.io.IOException e) { throw new IllegalStateException("Cannot verify match recovery journal", e); }
            retryPending();
        }
    }
    public synchronized void start(Game game) {
        Stream stream = new Stream();
        game.getPlayers().values().stream().filter(p -> !(p instanceof ComPlayer)).forEach(p -> stream.humans.add(p.getPlayerId()));
        if (streams.putIfAbsent(game.getGameId(), stream) != null) { throw new IllegalStateException("Match already recorded"); }
        record(game, List.of(new ActionLog("INITIAL", game)));
    }
    /** Runs before this bean is published and before the server accepts commands.
     * Recovery may contain a real OUTCOME: persist it before consulting the active registry. */
    @javax.annotation.PostConstruct
    public synchronized void finalizeInterruptedMatches() {
        retryPending();
        if (streams.values().stream().anyMatch(s -> s.failed || s.persisted < s.entries.size())) {
            throw new IllegalStateException("Cannot recover archive before restart finalization");
        }
        for (String id : repository.activeMatchIds()) {
            repository.finalizeInterrupted(id);
            Stream stream = streams.computeIfAbsent(id, key -> new Stream());
            durable(id, stream);
            persist(id, stream);
            if (stream.failed || !stream.terminal) { throw new IllegalStateException("Cannot finalize interrupted match"); }
            log.info("MATCH_RESTART_DRAW game={} durableEvents={}", id, stream.persisted);
        }
    }
    /** A private result receipt, never a reconstructed playable view. Explicit archives remain exportable by ID. */
    public synchronized Object latestRestartOutcome(String user) {
        var id = repository.latestMatchForHuman(user);
        if (id.isEmpty()) { return fields("status", "none"); }
        var entries = repository.read(id.get());
        if (entries.isEmpty()) { return fields("status", "none"); }
        try {
            var last = mapper.readTree(entries.get(entries.size() - 1).getJson());
            var data = last.path("data");
            if (!last.path("kind").asText().equals("OUTCOME") || !data.path("outcomeReason").asText().equals("riavvio server")) {
                return fields("status", "none");
            }
            return fields("status", "finished", "gameId", id.get(), "archived", true,
                    "outcome", fields("over", true, "result", "draw", "winner", null, "reason", "riavvio server"));
        } catch (java.io.IOException e) { throw new IllegalStateException("Invalid restart outcome", e); }
    }
    public synchronized void record(Game game, List<ActionLog> events) {
        Stream stream = streams.get(game.getGameId());
        if (stream == null) { throw new IllegalStateException("Missing match recording"); }
        if (stream.terminal) { persist(game.getGameId(), stream); return; }
        int first = stream.entries.size();
        stream.over = game.isOver();
        try {
            for (ActionLog event : events) {
                Object data = event.getData();
                if (data instanceof Game) { data = MatchSnapshot.state((Game) data); }
                else if (data instanceof Move) { data = MatchSnapshot.move((Move) data); }
                if (event.getWhat().equals("INITIAL")) {
                    data = fields("versions", versions.get(), "configuration", fields("handSize", Player.CARDS_IN_HAND,
                            "deckOrder", "next draw first", "playerOrder", "insertion", "botPolicy", "random",
                            "scope", "quick1vCom/quick1v1/quickFFA/open1vCom engine events; no UI telemetry"), "state", data);
                }
                int sequence = stream.entries.size();
                String previous = sequence == 0 ? "" : stream.entries.get(sequence - 1).getHash();
                String json = mapper.writeValueAsString(fields("kind", event.getWhat(), "recordedAt", Instant.now().toString(), "data", data));
                stream.entries.add(new Entry(game.getGameId(), sequence, previous, json));
                if (event.getWhat().equals("OUTCOME")) { stream.terminal = true; break; }
            }
            persist(game.getGameId(), stream);
        } catch (Exception failure) {
            stream.failed = true; stream.failureAt = Instant.now().toString();
            // Safe diagnostic; database exception messages may contain paths or payloads.
            log.error("MATCH_ARCHIVE_WRITE_FAILED game={} firstSequence={} durableEvents={} observedEvents={} failureType={}",
                    game.getGameId(), first, stream.persisted, stream.entries.size(), failure.getClass().getSimpleName());
        }
    }
    private void describe(Stream stream) throws java.io.IOException {
        if (stream.entries.isEmpty()) { return; }
        var initial = mapper.readTree(stream.entries.get(0).getJson());
        if (!initial.path("kind").asText().equals("INITIAL")) { throw new IllegalStateException("Missing recovery INITIAL"); }
        for (var player : initial.path("data").path("state").path("players")) {
            if (player.path("controller").asText().equals("human")) { stream.humans.add(player.path("playerId").asText()); }
        }
        stream.terminal = mapper.readTree(stream.entries.get(stream.entries.size()-1).getJson()).path("kind").asText().equals("OUTCOME");
        stream.over |= stream.terminal;
    }
    private List<Entry> durable(String id, Stream stream) {
        List<Entry> saved = repository.read(id);
        if (stream != null) {
            for (int i=0; i<Math.min(saved.size(), stream.entries.size()); i++) {
                if (!saved.get(i).getHash().equals(stream.entries.get(i).getHash())) { throw new IllegalStateException("Conflicting durable match prefix"); }
            }
            if (saved.size() > stream.entries.size()) { stream.entries.addAll(saved.subList(stream.entries.size(), saved.size())); }
            stream.persisted = saved.size();
            try { describe(stream); } catch (java.io.IOException e) { throw new IllegalStateException("Invalid match JSON", e); }
        }
        return saved;
    }
    private void persist(String id, Stream stream) {
        if (recovery != null && stream.journaled < stream.entries.size()) {
            try {
                recovery.store(id, List.copyOf(stream.entries.subList(stream.journaled, stream.entries.size())));
                stream.journaled = stream.entries.size();
            } catch (Exception failure) {
                log.error("MATCH_ARCHIVE_RECOVERY_WRITE_FAILED game={} firstSequence={} failureType={}", id,
                        stream.journaled, failure.getClass().getSimpleName());
            }
        }
        try {
            if (stream.persisted < stream.entries.size()) {
                repository.commit(id, List.copyOf(stream.entries.subList(stream.persisted, stream.entries.size())));
            }
            durable(id, stream);
            if (stream.failed) { log.info("MATCH_ARCHIVE_RECOVERED game={} durableEvents={}", id, stream.persisted); }
            stream.failed = false; stream.failureAt = null;
        } catch (Exception failure) {
            if (!stream.failed) { stream.failureAt = Instant.now().toString(); }
            stream.failed = true;
            log.error("MATCH_ARCHIVE_WRITE_FAILED game={} firstSequence={} durableEvents={} observedEvents={} failureType={}",
                    id, stream.persisted, stream.persisted, stream.entries.size(), failure.getClass().getSimpleName());
        }
    }
    @org.springframework.scheduling.annotation.Scheduled(fixedDelayString = "${app.archive.retry-ms:1000}")
    public synchronized void retryPending() {
        streams.forEach((id, stream) -> {
            if (stream.failed || stream.persisted < stream.entries.size() || (recovery != null && stream.journaled < stream.entries.size())) {
                persist(id, stream);
            }
        });
    }
    private List<Entry> authorize(String gameId, String user) {
        Stream stream = streams.get(gameId);
        if (stream != null) {
            if (!stream.over || !stream.humans.contains(user)) { throw new AccessDeniedException("Completed participant match required"); }
            persist(gameId, stream);
            return durable(gameId, stream);
        }
        List<Entry> saved = repository.read(gameId);
        if (saved.isEmpty()) { throw new AccessDeniedException("Completed participant match required"); }
        try {
            JsonNode initial = mapper.readTree(saved.get(0).getJson()).path("data").path("state");
            boolean human = false;
            for (JsonNode player : initial.path("players")) {
                human |= player.path("playerId").asText().equals(user) && player.path("controller").asText().equals("human");
            }
            if (!human || !mapper.readTree(saved.get(saved.size() - 1).getJson()).path("kind").asText().equals("OUTCOME")) {
                throw new AccessDeniedException("Completed participant match required");
            }
        } catch (java.io.IOException e) { throw new IllegalStateException("Invalid archived match", e); }
        return saved;
    }
    public synchronized void requireExport(String gameId, String user) { authorize(gameId, user); }
    public synchronized Object export(String gameId, String user) {
        List<Entry> saved = authorize(gameId, user);
        Stream stream = streams.get(gameId);
        boolean failed = stream != null && stream.failed;
        List<Entry> pending = stream == null ? List.of() : List.copyOf(stream.entries.subList(stream.persisted, stream.entries.size()));
        boolean terminal;
        try { terminal = !saved.isEmpty() && mapper.readTree(saved.get(saved.size() - 1).getJson()).path("kind").asText().equals("OUTCOME"); }
        catch (java.io.IOException e) { throw new IllegalStateException("Invalid archived match", e); }
        return fields("schemaVersion", 1, "gameId", gameId, "events", saved, "unpersistedEvents", pending,
                "integrity", fields("algorithm", "SHA-256(gameId + LF + sequence + LF + previousHash + LF + json UTF-8)",
                        "verified", true, "persistedEvents", saved.size(), "headHash", saved.isEmpty() ? "" : saved.get(saved.size() - 1).getHash()),
                "recording", fields("status", failed ? "WRITE_FAILED" : "OK", "failureAt", stream == null ? null : stream.failureAt,
                        "observedEvents", stream == null ? saved.size() : stream.entries.size(),
                        "complete", !failed && pending.isEmpty() && terminal));
    }
}
