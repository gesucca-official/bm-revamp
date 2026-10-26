package com.gsc.bm;

import com.gsc.bm.conf.db.ApplicationDatabase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import java.nio.file.Files;
import java.nio.file.Path;
import static org.junit.jupiter.api.Assertions.*;

class ApplicationSchemaTest {
    @TempDir Path directory;

    @Test
    void migrationIsIdempotentAndNewerSchemaIsRejectedWithoutReplacingIt() {
        Path file = directory.resolve("application.sqlite");
        JdbcTemplate jdbc = new JdbcTemplate(ApplicationDatabase.open(file));
        jdbc.update("INSERT INTO USR001_CREDENTIALS VALUES ('synthetic',NULL,'hash','USER')");
        JdbcTemplate reopened = new JdbcTemplate(ApplicationDatabase.open(file));
        String originalChecksum = reopened.queryForObject("SELECT checksum FROM BM_SCHEMA_VERSION WHERE version=1", String.class);
        assertEquals(1, reopened.queryForObject("SELECT COUNT(*) FROM USR001_CREDENTIALS", Integer.class));
        reopened.update("UPDATE BM_SCHEMA_VERSION SET checksum='modified' WHERE version=1");
        assertThrows(IllegalStateException.class, () -> ApplicationDatabase.open(file));
        assertEquals("modified", reopened.queryForObject("SELECT checksum FROM BM_SCHEMA_VERSION WHERE version=1", String.class));
        assertEquals(3, reopened.queryForObject("SELECT COUNT(*) FROM BM_SCHEMA_VERSION", Integer.class));
        reopened.update("UPDATE BM_SCHEMA_VERSION SET version=99, checksum=? WHERE version=1", originalChecksum);
        assertThrows(IllegalStateException.class, () -> ApplicationDatabase.open(file));
        assertEquals(99, reopened.queryForObject("SELECT MAX(version) FROM BM_SCHEMA_VERSION", Integer.class));
        assertEquals(1, reopened.queryForObject("SELECT COUNT(*) FROM USR001_CREDENTIALS", Integer.class));
    }

    @Test
    void unmanagedDatabaseIsNotChanged() throws Exception {
        Path file = directory.resolve("unmanaged.sqlite");
        JdbcTemplate jdbc = new JdbcTemplate(new DriverManagerDataSource("jdbc:sqlite:" + file));
        jdbc.execute("CREATE TABLE existing_data(value TEXT)");
        jdbc.update("INSERT INTO existing_data VALUES ('preserve')");
        byte[] original = Files.readAllBytes(file);
        assertThrows(IllegalStateException.class, () -> ApplicationDatabase.open(file));
        assertArrayEquals(original, Files.readAllBytes(file));
        assertEquals("preserve", jdbc.queryForObject("SELECT value FROM existing_data", String.class));
    }
}
