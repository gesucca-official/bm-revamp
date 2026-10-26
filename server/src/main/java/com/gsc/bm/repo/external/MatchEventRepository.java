package com.gsc.bm.repo.external;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.support.TransactionTemplate;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;

/** Append-only analysis data, deliberately independent of legacy LOG001. */
@Repository
public class MatchEventRepository {
    private static final com.fasterxml.jackson.databind.ObjectMapper JSON = new com.fasterxml.jackson.databind.ObjectMapper();
    @Getter
    public static final class Entry {
        private final int sequence;
        private final String previousHash, hash, json;
        public Entry(String gameId, int sequence, String previousHash, String json) {
            this(sequence, previousHash, hash(gameId, sequence, previousHash, json), json);
        }
        private Entry(int sequence, String previousHash, String hash, String json) {
            this.sequence = sequence; this.previousHash = previousHash; this.hash = hash; this.json = json;
        }
    }
    private final JdbcTemplate jdbc;
    private final TransactionTemplate transaction;
    public MatchEventRepository(@Qualifier("applicationJdbc") JdbcTemplate jdbc) {
        this.jdbc = jdbc;
        this.transaction = new TransactionTemplate(new DataSourceTransactionManager(Objects.requireNonNull(jdbc.getDataSource())));
    }
    public synchronized void append(String gameId, List<Entry> entries) {
        if (entries.isEmpty()) { return; }
        transaction.execute(status -> {
            List<Entry> saved = read(gameId);
            int next = saved.size(); String previous = next == 0 ? "" : saved.get(next - 1).hash;
            for (Entry entry : entries) {
                if (entry.sequence != next || !entry.previousHash.equals(previous) ||
                        !entry.hash.equals(hash(gameId, next, previous, entry.json))) {
                    throw new IllegalStateException("Non-contiguous match event batch");
                }
                jdbc.update("INSERT INTO LOG003_MATCH_EVENTS VALUES (?,?,?,?,?)", gameId, next, previous, entry.hash, entry.json);
                next++; previous = entry.hash;
            }
            return null;
        });
    }
    /** Retry the exact immutable bytes, including after a commit whose acknowledgement was lost.
     * Event suffix, registration and terminal marker share one IMMEDIATE transaction. */
    public synchronized void commit(String gameId, List<Entry> entries) {
        if (entries.isEmpty()) { return; }
        transaction.execute(status -> {
            List<Entry> saved = read(gameId);
            List<Entry> suffix = new ArrayList<>();
            int next = entries.get(0).sequence;
            for (Entry entry : entries) {
                if (entry.sequence != next++) { throw new IllegalStateException("Non-contiguous retry"); }
                if (entry.sequence < saved.size()) {
                    Entry existing = saved.get(entry.sequence);
                    if (!existing.hash.equals(entry.hash) || !existing.json.equals(entry.json)
                            || !existing.previousHash.equals(entry.previousHash)) {
                        throw new IllegalStateException("Conflicting match retry");
                    }
                } else { suffix.add(entry); }
            }
            List<Entry> all = new ArrayList<>(saved); all.addAll(suffix);
            try {
                if (all.isEmpty() || !JSON.readTree(all.get(0).json).path("kind").asText().equals("INITIAL")) {
                    throw new IllegalStateException("Missing INITIAL");
                }
                Integer outcome = null;
                for (int i = 1; i < all.size(); i++) {
                    String kind = JSON.readTree(all.get(i).json).path("kind").asText();
                    if (outcome != null || kind.equals("INITIAL")) { throw new IllegalStateException("Event after terminal or duplicate INITIAL"); }
                    if (kind.equals("OUTCOME")) { outcome = i; }
                }
                append(gameId, suffix);
                var initial = JSON.readTree(all.get(0).json).path("data").path("state");
                List<String> humans = new ArrayList<>();
                for (var player : initial.path("players")) {
                    if (player.path("controller").asText().equals("human")) { humans.add(player.path("playerId").asText()); }
                }
                String humansJson = JSON.writeValueAsString(humans);
                var registrations = jdbc.queryForList("SELECT * FROM LOG004_MATCH_REGISTRY WHERE C_GAME_ID=?", gameId);
                if (registrations.isEmpty()) {
                    jdbc.update("INSERT INTO LOG004_MATCH_REGISTRY(C_GAME_ID,T_MODE,J_HUMANS,T_INITIAL_HASH) VALUES (?,?,?,?)",
                            gameId, initial.path("mode").asText(), humansJson, all.get(0).hash);
                } else {
                    var registration = registrations.get(0);
                    if (!all.get(0).hash.equals(registration.get("T_INITIAL_HASH"))
                            || !humansJson.equals(registration.get("J_HUMANS"))
                            || !initial.path("mode").asText().equals(registration.get("T_MODE"))) {
                        throw new IllegalStateException("Conflicting match registration");
                    }
                }
                if (outcome != null) {
                    jdbc.update("UPDATE LOG004_MATCH_REGISTRY SET N_OUTCOME_SEQUENCE=?,T_OUTCOME_HASH=? WHERE C_GAME_ID=? AND N_OUTCOME_SEQUENCE IS NULL",
                            outcome, all.get(outcome).hash, gameId);
                    var terminal = jdbc.queryForMap("SELECT N_OUTCOME_SEQUENCE,T_OUTCOME_HASH FROM LOG004_MATCH_REGISTRY WHERE C_GAME_ID=?", gameId);
                    if (((Number) terminal.get("N_OUTCOME_SEQUENCE")).intValue() != outcome || !all.get(outcome).hash.equals(terminal.get("T_OUTCOME_HASH"))) {
                        throw new IllegalStateException("Conflicting match finalization");
                    }
                }
            } catch (java.io.IOException e) { throw new IllegalStateException("Invalid match JSON", e); }
            return null;
        });
    }
    /** Durable manifest only; never used to reconstruct a playable Game. */
    public List<String> activeMatchIds() {
        return jdbc.queryForList("SELECT C_GAME_ID FROM LOG004_MATCH_REGISTRY WHERE N_OUTCOME_SEQUENCE IS NULL ORDER BY C_GAME_ID", String.class);
    }
    /** Startup only: the event and terminal marker commit together, without loading a Game.
     * Recheck under the write transaction so an interrupted/repeated closure is harmless. */
    public synchronized void finalizeInterrupted(String gameId) {
        transaction.execute(status -> {
            var registration = jdbc.queryForMap("SELECT * FROM LOG004_MATCH_REGISTRY WHERE C_GAME_ID=?", gameId);
            if (registration.get("N_OUTCOME_SEQUENCE") != null) { return null; }
            List<Entry> saved = read(gameId);
            if (saved.isEmpty() || !saved.get(0).hash.equals(registration.get("T_INITIAL_HASH"))) {
                throw new IllegalStateException("Invalid active match prefix");
            }
            Entry head = saved.get(saved.size() - 1);
            try {
                String json = JSON.writeValueAsString(com.gsc.bm.service.session.MatchSnapshot.fields(
                        "kind", "OUTCOME", "recordedAt", java.time.Instant.now().toString(),
                        "data", com.gsc.bm.service.session.MatchSnapshot.fields(
                                "gameId", gameId, "mode", registration.get("T_MODE"), "outcomeReason", "riavvio server",
                                "outcome", com.gsc.bm.service.session.MatchSnapshot.fields("over", true, "result", "draw", "winner", null),
                                "interruptedPrefix", com.gsc.bm.service.session.MatchSnapshot.fields("sequence", head.sequence, "hash", head.hash))));
                commit(gameId, List.of(new Entry(gameId, saved.size(), head.hash, json)));
            } catch (java.io.IOException e) { throw new IllegalStateException("Cannot encode restart outcome", e); }
            return null;
        });
    }
    /** Latest admission, not latest finalization: a newer match supersedes an old receipt. */
    public Optional<String> latestMatchForHuman(String user) {
        for (var registration : jdbc.queryForList("SELECT C_GAME_ID,J_HUMANS FROM LOG004_MATCH_REGISTRY ORDER BY rowid DESC")) {
            try {
                for (var human : JSON.readTree((String) registration.get("J_HUMANS"))) {
                    if (human.asText().equals(user)) { return Optional.of((String) registration.get("C_GAME_ID")); }
                }
            } catch (java.io.IOException e) { throw new IllegalStateException("Invalid match participants", e); }
        }
        return Optional.empty();
    }
    public List<Entry> read(String gameId) {
        List<Entry> entries = jdbc.query("SELECT * FROM LOG003_MATCH_EVENTS WHERE C_GAME_ID=? ORDER BY N_SEQUENCE",
                (r, n) -> new Entry(r.getInt("N_SEQUENCE"), r.getString("T_PREVIOUS_HASH"), r.getString("T_HASH"), r.getString("J_EVENT")), gameId);
        String previous = ""; int sequence = 0;
        for (Entry entry : entries) {
            if (entry.sequence != sequence || !entry.previousHash.equals(previous) ||
                    !entry.hash.equals(hash(gameId, sequence, previous, entry.json))) {
                throw new IllegalStateException("Match event integrity check failed");
            }
            previous = entry.hash; sequence++;
        }
        return Collections.unmodifiableList(entries);
    }
    public static String hash(String gameId, int sequence, String previous, String json) {
        return sha256((gameId + "\n" + sequence + "\n" + previous + "\n" + json).getBytes(StandardCharsets.UTF_8));
    }
    public static String sha256(byte[] bytes) {
        try { return org.apache.commons.codec.binary.Hex.encodeHexString(MessageDigest.getInstance("SHA-256").digest(bytes)); }
        catch (java.security.NoSuchAlgorithmException e) { throw new IllegalStateException(e); }
    }
}
