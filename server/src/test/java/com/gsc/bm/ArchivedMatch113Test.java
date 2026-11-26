package com.gsc.bm;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.conf.db.ApplicationDatabase;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.bruiser.character.BigBadBruiser;
import com.gsc.bm.model.cards.bruiser.character.LittleRage;
import com.gsc.bm.model.cards.bruiser.character.LittleSmack;
import com.gsc.bm.model.cards.com.basic.BruiserGrab;
import com.gsc.bm.model.cards.com.last.Struggle;
import com.gsc.bm.model.game.Game;
import com.gsc.bm.model.game.Move;
import com.gsc.bm.model.game.Player;
import com.gsc.bm.model.game.Ruleset;
import com.gsc.bm.repo.external.GameLogRepository;
import com.gsc.bm.repo.external.MatchEventRepository;
import com.gsc.bm.service.session.ConnectionsService;
import com.gsc.bm.service.session.GameLoggingServiceImpl;
import com.gsc.bm.service.session.GameSessionServiceImpl;
import com.gsc.bm.service.session.MatchArchiveService;
import com.gsc.bm.service.session.MatchSnapshot;
import com.gsc.bm.service.session.MatchVersions;
import com.gsc.bm.model.cards.base.SetBaseIds;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.AccessDeniedException;

import java.nio.file.Path;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * SB-28, D184 (1) and (5): a match played under regulation 1.13 with the Set Base 0.1 stays readable. This is the only fixture that
 * builds a {@link Game} by hand on {@link Ruleset#LEGACY}, and its archive header says 1.13 and Set Base 0.1 (the live header says
 * 2.0 and 1.0: MatchArchiveCliTest, MatchArchiveTest). The archive is JSON: it is written while the match is played and read back
 * by a new service and a new connection, without the match, the session or the cards, so the classes of the Set Base 0.1
 * that left {@code server/src/main} (they stay in the test sources for the historical drafts and the simulator) are not needed
 * to read it.
 */
class ArchivedMatch113Test {
    @TempDir Path directory;
    final ObjectMapper mapper = new ObjectMapper();

    /** The versions the server recorded before SB-28: regulation 1.13, Set Base 0.1. */
    MatchVersions versions113() {
        MatchVersions versions = mock(MatchVersions.class);
        String hash = "0".repeat(64);
        when(versions.get()).thenReturn(MatchSnapshot.fields("codeSha256", hash, "codeFormat", "jar", "rulesVersion", "1.13",
                "rulesSha256", hash, "sets", MatchSnapshot.fields("base", MatchSnapshot.fields("version", "0.1", "sha256", hash)),
                "catalogSha256", hash, "rulesCatalogSha256", hash));
        return versions;
    }

    static <T extends AbstractCard> T named(T card, String name) { card.setGuiName(name); return card; }

    Player player(String id) {
        return new Player(id, new BigBadBruiser(), named(new BruiserGrab(), "basic"),
                List.of(named(new LittleSmack(), "bound"), named(new LittleRage(), "rage")),
                named(new Struggle(), "struggle"), List.of(named(new Struggle(), "regular")));
    }

    @Test void aMatchOfRegulation113IsArchivedAndReadBackWithItsHeader() throws Exception {
        Path file = directory.resolve("archived-1.13.sqlite");
        var repository = new MatchEventRepository(new JdbcTemplate(ApplicationDatabase.open(file)));
        var archive = new MatchArchiveService(repository, mapper, versions113());
        var logger = new GameLoggingServiceImpl(mock(org.springframework.core.env.Environment.class), mock(GameLogRepository.class), archive);
        var service = new GameSessionServiceImpl(mock(ConnectionsService.class), logger, mock(com.gsc.bm.service.view.ViewExtractorService.class));
        Game game = new Game(List.of(player("a"), player("b")), "quick1v1", false);
        game.useRuleset(Ruleset.LEGACY);
        game.getPlayers().get("b").getResources().put(Resource.HEALTH, 10);
        service.newGame(game);
        String id = game.getGameId();
        service.submitMoveToGame(new Move("struggle", "a", "b", id, null), () -> { });
        service.submitMoveToGame(new Move("struggle", "b", "a", id, null), () -> { });
        // Regulation 1.13: the engine lets HEALTH go below zero (-5), and the first player ends at 85.
        assertEquals(85, game.getPlayers().get("a").getResources().get(Resource.HEALTH));
        assertEquals(-5, game.getPlayers().get("b").getResources().get(Resource.HEALTH));
        assertTrue(game.isOver());

        // Read back: a new connection and a new service, no live game, no cards.
        var reread = new MatchArchiveService(new MatchEventRepository(new JdbcTemplate(ApplicationDatabase.open(file))), mapper, versions113());
        JsonNode exported = mapper.valueToTree(reread.export(id, "a"));
        assertTrue(exported.path("recording").path("complete").asBoolean());
        JsonNode initial = mapper.readTree(exported.path("events").get(0).path("json").asText()).path("data");
        assertEquals("1.13", initial.path("versions").path("rulesVersion").asText());
        assertEquals("0.1", initial.path("versions").path("sets").path("base").path("version").asText());
        assertEquals(100, initial.path("state").path("players").get(0).path("resources").path("HEALTH").asInt());
        assertEquals(SetBaseIds.SPAZIENZIO, initial.path("state").path("players").get(0).path("character").asText());
        JsonNode last = mapper.readTree(exported.path("events").get(exported.path("events").size() - 1).path("json").asText());
        assertEquals("OUTCOME", last.path("kind").asText());
        assertEquals("a", last.path("data").path("outcome").path("winner").asText());
        JsonNode committed = null;
        for (JsonNode event : exported.path("events")) {
            JsonNode body = mapper.readTree(event.path("json").asText());
            if ("ROUND_COMMITTED".equals(body.path("kind").asText())) committed = body.path("data");
        }
        assertNotNull(committed);
        assertEquals(85, committed.path("players").get(0).path("resources").path("HEALTH").asInt());
        assertEquals(-5, committed.path("players").get(1).path("resources").path("HEALTH").asInt());
        assertEquals(2, committed.path("resolvedMoves").size());
        assertTrue(exported.path("integrity").has("headHash"));
        assertThrows(AccessDeniedException.class, () -> reread.export(id, "stranger"));
    }
}
