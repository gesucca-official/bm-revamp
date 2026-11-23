package com.gsc.bm.conf.db;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;

import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * SB-28 (D182 (3)): at the switch to the Set Base 1.0 the saved custom decks that contain a card of the Set Base 0.1 that left the
 * set are deleted, wherever the card is (basic, bound, last resort, regular); every other deck stays as it was, even one that R02
 * now refuses (D20), and so does every other table.
 */
class SetBaseDecksMigrationTest {
    @TempDir Path directory;

    private static final String KEPT_01 = "{\"characterClazz\":\"bruiser.character.BigBadBruiser\",\"basicActionCardClazz\":\"com.basic.BruiserGrab\","
            + "\"lastResortCardClazz\":\"com.last.Struggle\",\"characterBoundCardsClazz\":[\"bruiser.character.LittleRage\",\"bruiser.character.LittleSmack\"],"
            + "\"regularCardsClazz\":[\"bruiser.Glare\",\"bruiser.Glare\",\"com.Steal\"]}";

    private static String with(String field, String value) {
        return KEPT_01.replace("\"bruiser.Glare\",\"bruiser.Glare\"", field.equals("regular") ? "\"bruiser.Glare\",\"" + value + "\"" : "\"bruiser.Glare\",\"bruiser.Glare\"")
                .replace("\"com.basic.BruiserGrab\"", field.equals("basic") ? "\"" + value + "\"" : "\"com.basic.BruiserGrab\"")
                .replace("\"com.last.Struggle\"", field.equals("last") ? "\"" + value + "\"" : "\"com.last.Struggle\"")
                .replace("\"bruiser.character.LittleSmack\"]", field.equals("bound") ? "\"" + value + "\"]" : "\"bruiser.character.LittleSmack\"]");
    }

    private static String checksum(String path) throws Exception {
        String sql = new String(new ClassPathResource(path).getInputStream().readAllBytes(), StandardCharsets.UTF_8).replace("\r\n", "\n");
        StringBuilder hex = new StringBuilder();
        for (byte b : MessageDigest.getInstance("SHA-256").digest(sql.getBytes(StandardCharsets.UTF_8))) hex.append(String.format("%02x", b));
        return hex.toString();
    }

    @Test
    void onlyTheDecksWithCardsThatLeftTheSetAreDeleted() throws Exception {
        Path file = directory.resolve("v3.sqlite");
        var source = new DriverManagerDataSource("jdbc:sqlite:" + file);
        List<String> before = List.of("db/application/V001__initial.sql", "db/application/V002__match_events.sql",
                "db/application/V003__match_registry.sql");
        for (int i = 0; i < before.size(); i++) {
            ResourceDatabasePopulator populator = new ResourceDatabasePopulator(new ClassPathResource(before.get(i)));
            if (i >= 1) populator.setSeparator(";;");
            populator.execute(source);
        }
        JdbcTemplate legacy = new JdbcTemplate(source);
        for (int i = 0; i < before.size(); i++)
            legacy.update("INSERT INTO BM_SCHEMA_VERSION(version,checksum,applied_at) VALUES (?,?,'synthetic')", i + 1, checksum(before.get(i)));
        legacy.update("INSERT INTO USR001_CREDENTIALS VALUES ('fixture',NULL,'synthetic-hash','USER')");
        String[][] decks = {
                {"kept-01", KEPT_01},
                {"kept-unreadable", "{\"preserve\":true}"},
                {"kept-other-character", KEPT_01.replace("bruiser.character.BigBadBruiser", "base.character.Mara")},
                {"regular-shuffle", with("regular", "com.ShuffleFeet")},
                {"regular-whatcha", with("regular", "bruiser.WhatchaDoin")},
                {"regular-badtrip", with("regular", "junkie.BadTrip")},
                {"regular-everything", with("regular", "junkie.EverythingIsDrug")},
                {"regular-berserk", with("regular", "junkie.GoingBerserk")},
                {"basic-begging", with("basic", "junkie.BeggingMoney")},
                {"bound-begging", with("bound", "junkie.BeggingMoney")},
                {"last-whatcha", with("last", "bruiser.WhatchaDoin")},
                {"kept-new-classes", with("regular", "base.com.ShuffleFeet").replace("\"com.Steal\"", "\"base.com.BeggingMoney\"")},
        };
        for (String[] deck : decks) legacy.update("INSERT INTO USR002_DECKS VALUES ('fixture',?,?)", deck[0], deck[1]);
        legacy.update("INSERT INTO LOG002_WEB_CLIENT VALUES ('time','additional','preserve')");
        var logBefore = legacy.queryForList("SELECT * FROM LOG002_WEB_CLIENT");

        JdbcTemplate migrated = new JdbcTemplate(ApplicationDatabase.open(file));
        assertEquals(4, migrated.queryForObject("SELECT COUNT(*) FROM BM_SCHEMA_VERSION", Integer.class));
        assertEquals(List.of("kept-01", "kept-new-classes", "kept-other-character", "kept-unreadable"),
                migrated.queryForList("SELECT C_DECK_ID FROM USR002_DECKS ORDER BY C_DECK_ID", String.class));
        assertEquals(KEPT_01, migrated.queryForObject("SELECT J_DECK FROM USR002_DECKS WHERE C_DECK_ID='kept-01'", String.class));
        assertEquals(1, migrated.queryForObject("SELECT COUNT(*) FROM USR001_CREDENTIALS", Integer.class));
        assertEquals(logBefore, migrated.queryForList("SELECT * FROM LOG002_WEB_CLIENT"));

        // Reopening applies nothing again.
        JdbcTemplate reopened = new JdbcTemplate(ApplicationDatabase.open(file));
        assertEquals(4, reopened.queryForObject("SELECT COUNT(*) FROM USR002_DECKS", Integer.class));
        assertEquals(4, reopened.queryForObject("SELECT COUNT(*) FROM BM_SCHEMA_VERSION", Integer.class));
    }
}
