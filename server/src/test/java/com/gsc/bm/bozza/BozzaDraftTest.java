package com.gsc.bm.bozza;

import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static com.gsc.bm.model.cards.base.SetBaseIds.*;

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
        // SB-17t: with an empty app.bozza.pool the pool is the five starters; prova-sergio is a test deck, not in the pool.
        assertEquals(List.of(STARTER_SPAZIENZIO, STARTER_MARA, STARTER_CELESTINA, STARTER_PIERA, STARTER_BEPPE), bozza.pool());
        assertNotNull(bozza.newPolicy());
        Map<String, Object> identity = bozza.describe();
        @SuppressWarnings("unchecked") var sources = (List<Map<String, Object>>) identity.get("sources");
        assertEquals(DRAFT, sources.get(0).get("source"));
        assertEquals(com.gsc.bm.repo.external.MatchEventRepository.sha256(Files.readAllBytes(Path.of(DRAFT))), sources.get(0).get("sha256"));
        @SuppressWarnings("unchecked") var sets = (Map<String, Map<String, String>>) identity.get("sets");
        assertEquals("1.7", sets.get("base").get("version"));
        // D76: in d50 the computer is aware of the lethal hit, around the D74 timing (the random style too).
        var policy = new BozzaDraft(profiles("test", "bozza"), DRAFT, "starter-mara, starter-pino", STARTER_MARA, "casuale").newPolicy();
        assertTrue(policy instanceof com.gsc.bm.model.game.bot.LethalAwarePolicy, "D76: il computer d50 vede il colpo letale");
        assertTrue(((com.gsc.bm.model.game.bot.LethalAwarePolicy) policy).inner() instanceof com.gsc.bm.model.game.bot.SoughtHitPolicy,
                "D74: anche il casuale d50 legge il gettone");
        assertEquals(true, identity.get("lethalAware"));
        assertNull(new BozzaDraft(profiles("test", "bozza"), DRAFT, "starter-mara, starter-pino", STARTER_MARA, "casuale", "1.13").newPolicy());
    }

    @Test
    void aTestDeckIsChosenExplicitly() throws Exception {
        var env = profiles("local", "bozza");
        BozzaDraft pooled = new BozzaDraft(env, DRAFT, "prova-sergio, starter-mara", "pool", "risorse");
        assertEquals(List.of("prova-sergio", STARTER_MARA), pooled.pool());
        BozzaDraft computer = new BozzaDraft(env, DRAFT, "", "prova-sergio", "risorse");
        assertEquals("prova-sergio", computer.com());
        assertEquals(5, computer.pool().size());
        assertTrue(computer.draft().deckIds().contains("prova-sergio"));
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
