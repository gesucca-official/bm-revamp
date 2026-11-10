package com.gsc.bm;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.bozza.BozzaDraft;
import com.gsc.bm.repo.external.MatchEventRepository;
import com.gsc.bm.repo.external.UserCredentialsRecord;
import com.gsc.bm.repo.external.UserCredentialsRepository;
import com.gsc.bm.service.session.GameSessionService;
import com.gsc.bm.service.session.MatchArchiveService;
import com.gsc.bm.service.session.MatchVersions;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

/**
 * SB-8: real matches with the set draft through the CLI (scripts/cli-draft-complete-test.cjs), on Spring with the profiles test and
 * bozza and a temporary SQLite. Open 1vCom with Pino and Gigi (Java cards that exist only in the draft), quick 1vCom, quick 1v1.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("bozza")
@Tag("context")
class BozzaCliTest extends SqliteContextSupport {
    @LocalServerPort int port;
    @Autowired UserCredentialsRepository users;
    @Autowired PasswordEncoder encoder;
    @Autowired BozzaDraft bozza;
    @Autowired GameSessionService games;
    @Autowired MatchVersions versions;
    @Autowired ObjectMapper mapper;
    @Autowired @Qualifier("applicationJdbc") JdbcTemplate jdbc;

    @Test
    void draftMatchesCompleteThroughTheCli() throws Exception {
        @SuppressWarnings("unchecked") var draft = (Map<String, Object>) versions.get().get("draft");
        assertNotNull(draft, "versions.draft with the profile");
        assertEquals(bozza.describe(), draft);
        String user = "sb8Human", other = "sb8Other";
        for (String name : List.of(user, other))
            users.createIfAbsent(new UserCredentialsRecord(name, null, encoder.encode("synthetic"), "USER"));
        Path root = Path.of("..").toAbsolutePath().normalize();
        Path output = Files.createTempFile(Path.of("target"), "sb8-cli-", ".json");
        ProcessBuilder pb = new ProcessBuilder(root.resolve(".tools/node-v12.22.12-win-x64/node.exe").toString(),
                root.resolve("scripts/cli-draft-complete-test.cjs").toString());
        pb.environment().put("BM_URL", "http://127.0.0.1:" + port + "/api");
        pb.environment().put("BM_USER", user);
        pb.environment().put("BM_OTHER", other);
        pb.environment().put("BM_PASSWORD", "synthetic");
        pb.environment().put("BM_DECKS", mapper.writeValueAsString(bozza.draft().deckIds()));
        pb.environment().put("BM_CHARACTERS", mapper.writeValueAsString(bozza.draft().characterIds()));
        pb.environment().put("BM_DRAFT_SHA", MatchEventRepository.sha256(Files.readAllBytes(Path.of("src/test/resources/set-base/bozza.json"))));
        Process process = pb.redirectErrorStream(true).redirectOutput(output.toFile()).start();
        try {
            assertTrue(process.waitFor(240, TimeUnit.SECONDS), "CLI stalled; runner deadline is not a game rule");
            assertEquals(0, process.exitValue(), Files.readString(output));
            var result = mapper.readTree(Files.readString(output));
            assertTrue(result.path("ok").asBoolean());
            assertEquals(4, result.path("exports").size());
            var reread = new MatchArchiveService(new MatchEventRepository(jdbc), mapper, versions);
            for (var exported : result.path("exports")) {
                String id = exported.path("gameId").asText();
                assertEquals(exported, mapper.valueToTree(reread.export(id, user)));
                assertThrows(IllegalArgumentException.class, () -> games.getGame(id));
            }
            assertFalse(Files.readString(output).contains("synthetic"));
            Files.createDirectories(root.resolve(".build-logs"));
            Files.copy(output, root.resolve(".build-logs/sb-8-cli.json"), StandardCopyOption.REPLACE_EXISTING);
        } finally {
            process.destroyForcibly();
        }
    }
}
