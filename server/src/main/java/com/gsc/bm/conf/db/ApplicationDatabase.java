package com.gsc.bm.conf.db;

import org.apache.commons.codec.binary.Hex;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.transaction.support.TransactionTemplate;
import org.sqlite.SQLiteConfig;

import javax.sql.DataSource;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;

public final class ApplicationDatabase {
    private static final List<String> MIGRATIONS = List.of("db/application/V001__initial.sql", "db/application/V002__match_events.sql",
            "db/application/V003__match_registry.sql");
    private ApplicationDatabase() { }

    public static DataSource open(Path file) {
        Path absolute = file.toAbsolutePath().normalize();
        try {
            Files.createDirectories(absolute.getParent());
        } catch (IOException e) {
            throw new IllegalStateException("Cannot create application database directory", e);
        }
        SQLiteConfig config = new SQLiteConfig();
        config.enforceForeignKeys(true);
        config.setBusyTimeout(5000);
        config.setSynchronous(SQLiteConfig.SynchronousMode.FULL);
        // Explicit application transactions are write scopes (migration/archive append).
        // Reserve the writer before reading the journal head: concurrent web logging must
        // wait rather than invalidate a deferred read snapshot during reconnect.
        config.setTransactionMode(SQLiteConfig.TransactionMode.IMMEDIATE);
        DriverManagerDataSource source = new DriverManagerDataSource();
        source.setDriverClassName("org.sqlite.JDBC");
        source.setUrl("jdbc:sqlite:" + absolute);
        source.setConnectionProperties(config.toProperties());
        initialize(source);
        return source;
    }

    private static void initialize(DataSource source) {
        JdbcTemplate jdbc = new JdbcTemplate(source);
        List<String> tables = jdbc.queryForList(
                "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'", String.class);
        boolean fresh = tables.isEmpty();
        // Refuse existing catalogs/unmanaged files before any persistent changes.
        if (!fresh && !tables.contains("BM_SCHEMA_VERSION")) {
            throw new IllegalStateException("Not a managed BM application database; refusing to modify it");
        }
        List<String> checksums = MIGRATIONS.stream().map(ApplicationDatabase::checksum).collect(java.util.stream.Collectors.toList());
        int installed = 0;
        if (!fresh) {
            List<String> versions = jdbc.query("SELECT version, checksum FROM BM_SCHEMA_VERSION ORDER BY version",
                    (rs, row) -> rs.getInt(1) + ":" + rs.getString(2));
            installed = versions.size();
            if (installed == 0 || installed > MIGRATIONS.size()) {
                throw new IllegalStateException("Unsupported application schema version");
            }
            for (int i = 0; i < installed; i++) {
                if (!versions.get(i).equals((i + 1) + ":" + checksums.get(i))) {
                    throw new IllegalStateException("Unsupported or modified application schema version");
                }
            }
            for (String expected : List.of("USR001_CREDENTIALS", "USR002_DECKS", "LOG001_GAMES", "LOG002_WEB_CLIENT")) {
                if (!tables.contains(expected)) { throw new IllegalStateException("Missing application table: " + expected); }
            }
            if (installed >= 2 && !tables.contains("LOG003_MATCH_EVENTS")) {
                throw new IllegalStateException("Missing match events table");
            }
            if (installed >= 3 && !tables.contains("LOG004_MATCH_REGISTRY")) {
                throw new IllegalStateException("Missing match registry table");
            }
        }
        String mode = jdbc.queryForObject("PRAGMA journal_mode=WAL", String.class);
        if (!"wal".equalsIgnoreCase(mode)) {
            throw new IllegalStateException("Application database requires WAL on a local writable filesystem");
        }
        final int previous = installed;
        new TransactionTemplate(new DataSourceTransactionManager(source)).execute(status -> {
            for (int i = previous; i < MIGRATIONS.size(); i++) {
                ResourceDatabasePopulator populator = new ResourceDatabasePopulator(new ClassPathResource(MIGRATIONS.get(i)));
                if (i >= 1) { populator.setSeparator(";;"); }
                populator.execute(source);
                jdbc.update("INSERT INTO BM_SCHEMA_VERSION(version,checksum,applied_at) VALUES (?,?,CURRENT_TIMESTAMP)", i + 1, checksums.get(i));
            }
            return null;
        });
    }

    private static String checksum(String path) {
        try (java.io.InputStream in = new ClassPathResource(path).getInputStream()) {
            String sql = new String(in.readAllBytes(), StandardCharsets.UTF_8).replace("\r\n", "\n");
            return Hex.encodeHexString(MessageDigest.getInstance("SHA-256").digest(sql.getBytes(StandardCharsets.UTF_8)));
        } catch (IOException | NoSuchAlgorithmException e) {
            throw new IllegalStateException("Cannot read schema migration", e);
        }
    }
}
