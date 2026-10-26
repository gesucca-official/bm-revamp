package com.gsc.bm.service.session;

import com.fasterxml.jackson.databind.*;
import com.gsc.bm.repo.external.MatchEventRepository;
import com.gsc.bm.repo.external.MatchEventRepository.Entry;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.*;
import java.util.*;

/** Immutable analysis batches on the local filesystem; no executable checkpoints or retention. */
@Component
public class MatchRecoveryJournal {
    private final Path directory;
    private final ObjectMapper mapper;
    @Autowired
    public MatchRecoveryJournal(@Value("${app.database.path}") String database, ObjectMapper mapper) {
        this(Path.of(database).toAbsolutePath().resolveSibling(Path.of(database).getFileName() + ".match-recovery"), mapper);
    }
    public MatchRecoveryJournal(Path directory, ObjectMapper mapper) { this.directory = directory; this.mapper = mapper; }

    public void store(String gameId, List<Entry> entries) throws IOException {
        if (entries.isEmpty()) { return; }
        byte[] bytes = mapper.writeValueAsBytes(MatchSnapshot.fields("gameId", gameId, "entries", entries));
        Files.createDirectories(directory);
        Path target = directory.resolve(MatchEventRepository.sha256(bytes) + ".json");
        if (Files.exists(target)) {
            if (!Arrays.equals(bytes, Files.readAllBytes(target))) { throw new IOException("Recovery batch conflict"); }
            return;
        }
        Path staging = Files.createTempFile(directory, "batch-", ".tmp");
        try (FileChannel channel = FileChannel.open(staging, StandardOpenOption.WRITE)) {
            ByteBuffer buffer = ByteBuffer.wrap(bytes);
            while (buffer.hasRemaining()) { channel.write(buffer); }
            channel.force(true);
        }
        // Refuse non-atomic filesystems. Interrupted staging files are never treated as committed.
        Files.move(staging, target, StandardCopyOption.ATOMIC_MOVE);
    }

    public Map<String, List<Entry>> read() throws IOException {
        Map<String, TreeMap<Integer, Entry>> matches = new TreeMap<>();
        if (!Files.exists(directory)) { return Map.of(); }
        try (var paths = Files.list(directory)) {
            for (Path path : (Iterable<Path>) paths.filter(p -> p.getFileName().toString().endsWith(".json"))::iterator) {
                byte[] bytes = Files.readAllBytes(path);
                if (!path.getFileName().toString().equals(MatchEventRepository.sha256(bytes) + ".json")) {
                    throw new IOException("Recovery batch integrity failure");
                }
                JsonNode batch = mapper.readTree(bytes);
                String gameId = batch.path("gameId").asText();
                if (gameId.isEmpty() || !batch.path("entries").isArray() || batch.path("entries").isEmpty()) {
                    throw new IOException("Invalid recovery batch");
                }
                TreeMap<Integer, Entry> entries = matches.computeIfAbsent(gameId, id -> new TreeMap<>());
                for (JsonNode row : batch.path("entries")) {
                    Entry entry = new Entry(gameId, row.path("sequence").asInt(-1), row.path("previousHash").asText(), row.path("json").asText());
                    if (!entry.getHash().equals(row.path("hash").asText())) { throw new IOException("Recovery entry integrity failure"); }
                    Entry existing = entries.putIfAbsent(entry.getSequence(), entry);
                    if (existing != null && !existing.getHash().equals(entry.getHash())) { throw new IOException("Conflicting recovery sequence"); }
                }
            }
        }
        Map<String, List<Entry>> result = new LinkedHashMap<>();
        for (var match : matches.entrySet()) {
            String previous = ""; int next = 0;
            for (Entry entry : match.getValue().values()) {
                if (entry.getSequence() != next++ || !entry.getPreviousHash().equals(previous)) { throw new IOException("Recovery sequence gap"); }
                previous = entry.getHash();
            }
            result.put(match.getKey(), List.copyOf(match.getValue().values()));
        }
        return result;
    }
}
