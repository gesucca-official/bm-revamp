package com.gsc.bm.bozza;

import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/** SB-8: the profile bozza starts only for development and only with a valid draft and settings. */
class BozzaDraftTest {
    static final String DRAFT = "src/test/resources/set-base/bozza.json";

    private static MockEnvironment profiles(String... active) {
        MockEnvironment env = new MockEnvironment();
        env.setActiveProfiles(active);
        return env;
    }

    @Test
    void onlyWithLocalOrTestAndNeverHeroku() {
        BozzaDraft.requireDevelopment(profiles("local", "bozza"));
        BozzaDraft.requireDevelopment(profiles("test", "bozza"));
        for (String[] refused : List.of(new String[]{"bozza"}, new String[]{"local", "heroku", "bozza"}, new String[]{"heroku", "bozza"})) {
            IllegalStateException error = assertThrows(IllegalStateException.class, () -> BozzaDraft.requireDevelopment(profiles(refused)));
            assertTrue(error.getMessage().startsWith("Il profilo bozza richiede il profilo local"), error.getMessage());
        }
        assertThrows(IllegalStateException.class, () -> new BozzaDraft(profiles("bozza"), DRAFT, "", "pool", "risorse"));
    }

    @Test
    void theSetBaseDraftWithItsFiveStarters() throws Exception {
        BozzaDraft bozza = new BozzaDraft(profiles("local", "bozza"), DRAFT, "", "pool", "risorse");
        assertEquals(List.of("starter-spazienzio", "starter-mara", "starter-tossico", "starter-pino", "starter-gigi"), bozza.pool());
        assertNotNull(bozza.newPolicy());
        Map<String, Object> identity = bozza.describe();
        @SuppressWarnings("unchecked") var sources = (List<Map<String, Object>>) identity.get("sources");
        assertEquals(DRAFT, sources.get(0).get("source"));
        assertEquals(com.gsc.bm.repo.external.MatchEventRepository.sha256(Files.readAllBytes(Path.of(DRAFT))), sources.get(0).get("sha256"));
        @SuppressWarnings("unchecked") var sets = (Map<String, Map<String, String>>) identity.get("sets");
        assertEquals("bozza", sets.get("base").get("version"));
        assertNull(new BozzaDraft(profiles("test", "bozza"), DRAFT, "starter-mara, starter-pino", "starter-mara", "casuale").newPolicy());
    }

    @Test
    void wrongSettingsOrDraftStopTheStart() throws Exception {
        var env = profiles("local", "bozza");
        assertTrue(assertThrows(IllegalStateException.class, () -> new BozzaDraft(env, DRAFT, "starter-nessuno", "pool", "risorse"))
                .getMessage().startsWith("app.bozza.pool: mazzo assente"));
        assertTrue(assertThrows(IllegalStateException.class, () -> new BozzaDraft(env, DRAFT, "", "starter-nessuno", "risorse"))
                .getMessage().startsWith("app.bozza.com"));
        assertTrue(assertThrows(IllegalStateException.class, () -> new BozzaDraft(env, DRAFT, "", "pool", "fortissimo"))
                .getMessage().startsWith("app.bozza.bot"));
        Path broken = Files.createTempFile("sb8-", ".json");
        try {
            Files.writeString(broken, "{\"format\": \"sb-6a/1\"}");
            Exception error = assertThrows(IllegalArgumentException.class, () -> new BozzaDraft(env, broken.toString(), "", "pool", "risorse"));
            assertTrue(error.getMessage().contains(broken.getFileName().toString()), error.getMessage());
        } finally {
            Files.deleteIfExists(broken);
        }
    }
}
