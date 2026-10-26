package com.gsc.bm;

import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import java.nio.file.Files;
import java.nio.file.Path;
import java.io.IOException;

@ActiveProfiles("test")
public abstract class SqliteContextSupport {
    protected static final Path DATABASE = temporaryDatabase();
    private static Path temporaryDatabase() {
        try {
            Path target = Path.of("target", "test-databases");
            Files.createDirectories(target);
            return Files.createTempDirectory(target, "context-").resolve("application.sqlite").toAbsolutePath();
        } catch (IOException e) { throw new IllegalStateException(e); }
    }
    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("app.database.path", () -> DATABASE.toString());
    }
}
