package com.gsc.bm;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.conf.db.ApplicationDatabase;
import com.gsc.bm.model.game.*;
import com.gsc.bm.model.cards.AbstractCard;
import com.gsc.bm.model.cards.bruiser.character.*;
import com.gsc.bm.model.cards.com.basic.BruiserGrab;
import com.gsc.bm.model.cards.com.last.Struggle;
import com.gsc.bm.repo.external.MatchEventRepository;
import com.gsc.bm.repo.external.MatchEventRepository.Entry;
import com.gsc.bm.service.session.*;
import com.gsc.bm.service.session.model.ActionLog;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.access.AccessDeniedException;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MatchArchiveTest {
    @TempDir Path directory;
    final ObjectMapper mapper = new ObjectMapper();
    JdbcTemplate jdbc(Path file) { return new JdbcTemplate(ApplicationDatabase.open(file)); }
    MatchArchiveService archive(MatchEventRepository repository) { return new MatchArchiveService(repository, mapper, new MatchVersions()); }
    static <T extends AbstractCard> T named(T card, String name) { card.setGuiName(name); return card; }
    Player player(String name) {
        return new Player(name, new BigBadBruiser(), named(new BruiserGrab(), "basic"),
                List.of(named(new LittleSmack(), "bound"), named(new LittleRage(), "rage")),
                named(new Struggle(), "struggle"), List.of(named(new Struggle(), "regular")));
    }
    @Test void migratesOnlyAnIsolatedCopyOfV1PreservingEveryLegacyTableAndChecksum() throws Exception {
        Path original = directory.resolve("v1.sqlite"), copy = directory.resolve("copy.sqlite");
        var old = new DriverManagerDataSource("jdbc:sqlite:" + original);
        new ResourceDatabasePopulator(new ClassPathResource("db/application/V001__initial.sql")).execute(old);
        var legacy = new JdbcTemplate(old);
        String sql = new String(new ClassPathResource("db/application/V001__initial.sql").getInputStream().readAllBytes(), java.nio.charset.StandardCharsets.UTF_8).replace("\r\n", "\n");
        String checksum = MatchEventRepository.sha256(sql.getBytes(java.nio.charset.StandardCharsets.UTF_8));
        legacy.update("INSERT INTO BM_SCHEMA_VERSION VALUES (1,?,'synthetic')", checksum);
        legacy.update("INSERT INTO USR001_CREDENTIALS VALUES ('fixture',NULL,'synthetic-hash','USER')");
        legacy.update("INSERT INTO USR002_DECKS VALUES ('fixture','deck','{\"preserve\":true}')");
        legacy.update("INSERT INTO LOG001_GAMES VALUES ('old','fixture','legacy','date','ENDED','[]')");
        legacy.update("INSERT INTO LOG002_WEB_CLIENT VALUES ('time','additional','message')");
        byte[] before = Files.readAllBytes(original); Files.copy(original, copy);
        var migrated = jdbc(copy);
        assertArrayEquals(before, Files.readAllBytes(original));
        assertEquals(3, migrated.queryForObject("SELECT COUNT(*) FROM BM_SCHEMA_VERSION", Integer.class));
        assertEquals(checksum, migrated.queryForObject("SELECT checksum FROM BM_SCHEMA_VERSION WHERE version=1", String.class));
        for (String table : List.of("USR001_CREDENTIALS", "USR002_DECKS", "LOG001_GAMES", "LOG002_WEB_CLIENT")) {
            assertEquals(legacy.queryForList("SELECT * FROM " + table), migrated.queryForList("SELECT * FROM " + table));
        }
        assertEquals("ok", jdbc(copy).queryForObject("PRAGMA integrity_check", String.class));
        assertEquals(0, migrated.queryForList("PRAGMA foreign_key_check").size());
    }
    @Test void appendIsAtomicImmutableOrderedDurableAndRejectsGapsDuplicatesAndCorruption() {
        Path file = directory.resolve("events.sqlite"); var jdbc = jdbc(file); var repo = new MatchEventRepository(jdbc);
        Entry initial = new Entry("match", 0, "", "{\"initial\":true}"); repo.append("match", List.of(initial));
        Entry next = new Entry("match", 1, initial.getHash(), "{\"round\":1}");
        Entry gap = new Entry("match", 3, next.getHash(), "{}");
        assertThrows(IllegalStateException.class, () -> repo.append("match", List.of(next, gap)));
        assertEquals(1, repo.read("match").size());
        assertThrows(RuntimeException.class, () -> repo.append("match", List.of(initial)));
        jdbc.execute("CREATE TRIGGER synthetic_failure BEFORE INSERT ON LOG003_MATCH_EVENTS WHEN NEW.N_SEQUENCE=2 BEGIN SELECT RAISE(ABORT,'synthetic'); END");
        Entry third = new Entry("match", 2, next.getHash(), "{}");
        assertThrows(RuntimeException.class, () -> repo.append("match", List.of(next, third)));
        assertEquals(1, repo.read("match").size()); jdbc.execute("DROP TRIGGER synthetic_failure");
        repo.append("match", List.of(next, third));
        assertThrows(RuntimeException.class, () -> jdbc.update("UPDATE LOG003_MATCH_EVENTS SET J_EVENT='{}'"));
        assertThrows(RuntimeException.class, () -> jdbc.update("DELETE FROM LOG003_MATCH_EVENTS"));
        var reopened = new MatchEventRepository(jdbc(file)); assertEquals(third.getHash(), reopened.read("match").get(2).getHash());
        jdbc.execute("DROP TRIGGER LOG003_NO_UPDATE"); jdbc.update("UPDATE LOG003_MATCH_EVENTS SET J_EVENT='tampered' WHERE N_SEQUENCE=1");
        assertThrows(IllegalStateException.class, () -> reopened.read("match"));
    }
    @Test void concurrentWritersCannotDuplicateOrInterleaveTheSameSequence() throws Exception {
        Path file = directory.resolve("concurrent.sqlite"); var first = new MatchEventRepository(jdbc(file));
        var second = new MatchEventRepository(jdbc(file)); var pool = Executors.newFixedThreadPool(2); var start = new CountDownLatch(1);
        Callable<Boolean> write = () -> { start.await(); try { first.append("race", List.of(new Entry("race",0,"","one"))); return true; } catch(RuntimeException e) { return false; } };
        try {
            Future<Boolean> a = pool.submit(write);
            Future<Boolean> b = pool.submit(() -> { start.await(); try { second.append("race",List.of(new Entry("race",0,"","two"))); return true; } catch(RuntimeException e) { return false; } });
            start.countDown(); assertNotEquals(a.get(10,TimeUnit.SECONDS), b.get(10,TimeUnit.SECONDS));
            assertEquals(1, first.read("race").size());
        } finally { pool.shutdownNow(); }
    }
    @Test void legacyLogWritingBetweenArchiveReadAndAppendLosesNeitherLog() throws Exception {
        var jdbc=jdbc(directory.resolve("legacy-contention.sqlite"));
        var readDone=new CountDownLatch(1); var release=new CountDownLatch(1);
        var pause=new java.util.concurrent.atomic.AtomicBoolean(true);
        var repo=new MatchEventRepository(jdbc) {
            @Override public List<Entry> read(String id) {
                var rows=super.read(id);
                if(pause.getAndSet(false)) {
                    readDone.countDown();
                    try { if(!release.await(5,TimeUnit.SECONDS)) { throw new IllegalStateException("Test coordination timeout"); } }
                    catch(InterruptedException e) { Thread.currentThread().interrupt(); throw new IllegalStateException(e); }
                }
                return rows;
            }
        };
        var pool=Executors.newFixedThreadPool(2);
        try {
            var archiveWrite=pool.submit(()->repo.append("contention",List.of(new Entry("contention",0,"","{}"))));
            assertTrue(readDone.await(3,TimeUnit.SECONDS));
            var legacyWrite=pool.submit(()->jdbc.update("INSERT INTO LOG002_WEB_CLIENT VALUES ('concurrent','fixture','preserve')"));
            // A concurrent writer may finish or wait for the archive transaction, but neither may lose its log.
            try { legacyWrite.get(200,TimeUnit.MILLISECONDS); } catch(TimeoutException expectedWaitingWriter) { }
            release.countDown();
            assertDoesNotThrow(()->archiveWrite.get(6,TimeUnit.SECONDS));
            assertEquals(1,legacyWrite.get(6,TimeUnit.SECONDS));
            assertEquals(1,repo.read("contention").size());
            assertEquals(1,jdbc.queryForObject("SELECT COUNT(*) FROM LOG002_WEB_CLIENT",Integer.class));
        } finally { release.countDown(); pool.shutdownNow(); }
    }
    @Test void fullInitialDeckIsCapturedBeforeDealingAndCannotBeEdited() {
        Player player = player("fixture");
        assertEquals(List.of("com.last.Struggle"), player.getInitialDeckDrawOrder());
        assertTrue(player.getDeck().isEmpty());
        assertThrows(UnsupportedOperationException.class, () -> player.getInitialDeckDrawOrder().clear());
        assertEquals(3, player.getInitialSpecialCards().size());
    }
    @Test void snapshotsExportAndRereadAreDetachedAndDoNotRequireLiveGameOrSession() throws Exception {
        Path file = directory.resolve("snapshot.sqlite"); var repo = new MatchEventRepository(jdbc(file)); var archive = archive(repo);
        Player a = player("a"), b = player("b"); var game = new Game(List.of(a,b), "quick1v1", false);
        archive.start(game); String initial = repo.read(game.getGameId()).get(0).getJson();
        assertThrows(AccessDeniedException.class, () -> archive.export(game.getGameId(), "a"));
        b.getResources().put(com.gsc.bm.model.Resource.HEALTH, 0);
        archive.record(game, List.of(new ActionLog("OUTCOME", game)));
        var exported = mapper.valueToTree(archive.export(game.getGameId(), "a"));
        assertTrue(exported.path("recording").path("complete").asBoolean());
        a.getCardsInHand().clear(); a.getResources().clear();
        assertEquals(initial, repo.read(game.getGameId()).get(0).getJson());
        var reread = archive(new MatchEventRepository(jdbc(file)));
        assertEquals(exported, mapper.valueToTree(reread.export(game.getGameId(), "a")));
        assertThrows(AccessDeniedException.class, () -> reread.export(game.getGameId(), "stranger"));
        assertThrows(AccessDeniedException.class, () -> reread.export("missing", "a"));
        var initialTree = mapper.readTree(initial).path("data");
        assertEquals("1.8", initialTree.path("versions").path("rulesVersion").asText());
        for (String hash : List.of("codeSha256","rulesSha256","catalogSha256","rulesCatalogSha256")) {
            assertTrue(initialTree.path("versions").path(hash).asText().matches("[0-9a-f]{64}"));
        }
        assertEquals(100, initialTree.path("state").path("players").get(1).path("resources").path("HEALTH").asInt());
    }
    @Test void failedInitialAndLaterWritesRetainImmutableEvidenceAndRemainPendingForRetry() {
        var repo = mock(MatchEventRepository.class); doThrow(new IllegalStateException("synthetic")).when(repo).commit(anyString(),anyList());
        when(repo.read(anyString())).thenReturn(List.of()); var archive = archive(repo);
        var game = new Game(List.of(player("a"),player("b")),"quick1v1",false);
        assertDoesNotThrow(() -> archive.start(game));
        game.getPlayers().get("b").getResources().put(com.gsc.bm.model.Resource.HEALTH,0);
        assertDoesNotThrow(() -> archive.record(game, List.of(new ActionLog("OUTCOME",game))));
        var exported = mapper.valueToTree(archive.export(game.getGameId(),"a"));
        assertEquals("WRITE_FAILED", exported.path("recording").path("status").asText());
        assertFalse(exported.path("recording").path("complete").asBoolean());
        assertEquals(2, exported.path("unpersistedEvents").size());
        assertEquals(2, exported.path("recording").path("observedEvents").asInt());
        verify(repo,times(3)).commit(anyString(),anyList());
    }
    @Test void mutableStatusesTimersItemsAndDrawOutcomeRemainFrozenInTheArchive() throws Exception {
        var repo = new MatchEventRepository(jdbc(directory.resolve("states.sqlite"))); var archive = archive(repo);
        var a = player("a"); var b = player("b");
        new com.gsc.bm.model.cards.bruiser.MadeOfStone().applyEffectOnSelf(a.getCharacter());
        new com.gsc.bm.model.cards.com.tokens.BrokenBeerBottle().applyEffectOnSelf(a.getCharacter());
        a.getCharacter().getTimers().add(new com.gsc.bm.model.game.Timer("synthetic timer", c -> {}, 3));
        a.getCharacter().getImmunities().add(com.gsc.bm.model.Resource.TOXICITY);
        a.getCharacter().getItems().add(named(new com.gsc.bm.model.cards.com.items.RottenBeer(),"beer"));
        var game = new Game(List.of(a,b),"quick1v1",false); archive.start(game);
        String frozen = repo.read(game.getGameId()).get(0).getJson();
        a.getCharacter().getStatuses().get(0).aTurnIsPassed(); a.getCharacter().getTimers().iterator().next().timeTick();
        a.getCharacter().getItems().clear();
        for (Player p : game.getPlayers().values()) { p.getResources().put(com.gsc.bm.model.Resource.HEALTH,0); }
        archive.record(game,List.of(new ActionLog("OUTCOME",game)));
        var initial = mapper.readTree(frozen).path("data").path("state").path("players").get(0);
        assertEquals(3,initial.path("statuses").get(0).path("lastsForTurns").asInt());
        assertTrue(initial.path("statuses").get(1).path("singleUse").asBoolean());
        assertTrue(initial.path("statuses").get(1).path("equip").asBoolean());
        assertEquals("OUTPUT",initial.path("statuses").get(1).path("flow").asText());
        assertEquals(3,initial.path("timers").get(0).path("remaining").asInt());
        assertEquals("TOXICITY",initial.path("immunities").get(0).asText()); assertEquals(1,initial.path("items").size());
        var outcome = mapper.readTree(repo.read(game.getGameId()).get(1).getJson()).path("data").path("outcome");
        assertEquals("draw",outcome.path("result").asText()); assertTrue(outcome.path("winner").isNull());
        assertTrue(mapper.valueToTree(archive.export(game.getGameId(),"a")).path("recording").path("complete").asBoolean());
    }
    static class FaultCard extends AbstractCard {
        FaultCard() { setGuiName("fault"); setCanTarget(Set.of(com.gsc.bm.model.cards.Card.CardTarget.SELF)); setPriority(2); }
        public void applyOtherUnfathomableLogic(Game g,Move m) { }
        public List<String> applyEffectOnSelf(com.gsc.bm.model.Character self) {
            self.loseResource(com.gsc.bm.model.Resource.HEALTH,99); throw new IllegalStateException("synthetic effect failure");
        }
        public List<String> applyEffectOnTarget(com.gsc.bm.model.Character self,com.gsc.bm.model.Character target) { return null; }
    }
    @Test void failedRoundAddsNoArchiveEventsAndRetryPreservesEarlierAcceptedMove() {
        var repo = new MatchEventRepository(jdbc(directory.resolve("rollback.sqlite"))); var archive = archive(repo);
        var logger = new GameLoggingServiceImpl(mock(org.springframework.core.env.Environment.class),mock(com.gsc.bm.repo.external.GameLogRepository.class),archive);
        var service = new GameSessionServiceImpl(mock(ConnectionsService.class),logger,mock(com.gsc.bm.service.view.ViewExtractorService.class));
        var a=player("a"); a.getCardsInHand().add(new FaultCard());
        var game=new Game(List.of(a,player("b")),"quick1v1",false); service.newGame(game);
        service.submitMoveToGame(new Move("struggle","b","a",game.getGameId(),null),()->fail("not ready"));
        var before=repo.read(game.getGameId()); assertEquals(3,before.size());
        assertThrows(IllegalMoveException.class,()->service.submitMoveToGame(new Move("fault","a","SELF",game.getGameId(),null),()->fail("failed round")));
        assertEquals(before.size(),repo.read(game.getGameId()).size());
        assertEquals(before.get(2).getHash(),repo.read(game.getGameId()).get(2).getHash());
        assertEquals(100,game.getPlayers().get("a").getResources().get(com.gsc.bm.model.Resource.HEALTH));
        assertEquals(1,game.getPendingMoves().size());
        service.submitMoveToGame(new Move("struggle","a","b",game.getGameId(),null),()->{});
        assertEquals(1,game.getTurn()); assertEquals(8,repo.read(game.getGameId()).size());
    }
}
