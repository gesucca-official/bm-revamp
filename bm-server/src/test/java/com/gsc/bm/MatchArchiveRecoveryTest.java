package com.gsc.bm;

import com.fasterxml.jackson.databind.*;
import com.gsc.bm.conf.db.ApplicationDatabase;
import com.gsc.bm.model.Resource;
import com.gsc.bm.model.game.*;
import com.gsc.bm.repo.external.*;
import com.gsc.bm.service.session.*;
import com.gsc.bm.service.session.model.ActionLog;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.AccessDeniedException;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MatchArchiveRecoveryTest {
    @TempDir Path directory;
    final ObjectMapper mapper = new ObjectMapper();
    JdbcTemplate jdbc(Path path) { return new JdbcTemplate(ApplicationDatabase.open(path)); }
    Game game() { var fixture = new MatchArchiveTest(); return new Game(List.of(fixture.player("a"), fixture.player("b")), "quick1v1", false); }
    MatchArchiveService archive(MatchEventRepository repository, Path journal) {
        return new MatchArchiveService(repository, mapper, new MatchVersions(), new MatchRecoveryJournal(journal, mapper));
    }
    JsonNode export(MatchArchiveService archive, Game game) { return mapper.valueToTree(archive.export(game.getGameId(), "a")); }
    List<String> kinds(List<MatchEventRepository.Entry> entries) throws Exception {
        List<String> kinds = new ArrayList<>();
        for (int i=0; i<entries.size(); i++) {
            assertEquals(i, entries.get(i).getSequence());
            kinds.add(mapper.readTree(entries.get(i).getJson()).path("kind").asText());
        }
        return kinds;
    }
    void finish(Game game) { game.getPlayers().get("b").getResources().put(Resource.HEALTH, 0); }

    @Test void migratesAnIsolatedV2CopyWithoutChangingAnyLegacyEventOrChecksum() throws Exception {
        Path original=directory.resolve("v2.sqlite"), copy=directory.resolve("copy.sqlite");
        var source=new org.springframework.jdbc.datasource.DriverManagerDataSource("jdbc:sqlite:"+original);
        var old=new JdbcTemplate(source);
        for(int version=1;version<=2;version++) {
            String path=version==1?"db/application/V001__initial.sql":"db/application/V002__match_events.sql";
            var resource=new org.springframework.core.io.ClassPathResource(path);
            var populator=new org.springframework.jdbc.datasource.init.ResourceDatabasePopulator(resource);
            if(version==2) populator.setSeparator(";;");populator.execute(source);
            String sql=new String(resource.getInputStream().readAllBytes(),java.nio.charset.StandardCharsets.UTF_8).replace("\r\n","\n");
            old.update("INSERT INTO BM_SCHEMA_VERSION VALUES (?,?,'synthetic')",version,MatchEventRepository.sha256(sql.getBytes(java.nio.charset.StandardCharsets.UTF_8)));
        }
        old.update("INSERT INTO USR001_CREDENTIALS VALUES ('fixture',NULL,'synthetic-hash','USER')");
        old.update("INSERT INTO USR002_DECKS VALUES ('fixture','deck','{}')");
        old.update("INSERT INTO LOG001_GAMES VALUES ('legacy','fixture','old','date','ENDED','[]')");
        old.update("INSERT INTO LOG002_WEB_CLIENT VALUES ('time','additional','preserve')");
        var event=new MatchEventRepository.Entry("historical",0,"","{\"kind\":\"INITIAL\"}");
        old.update("INSERT INTO LOG003_MATCH_EVENTS VALUES (?,?,?,?,?)","historical",0,"",event.getHash(),event.getJson());
        byte[] before=Files.readAllBytes(original);Files.copy(original,copy);var upgraded=jdbc(copy);
        assertArrayEquals(before,Files.readAllBytes(original));
        for(String table:List.of("USR001_CREDENTIALS","USR002_DECKS","LOG001_GAMES","LOG002_WEB_CLIENT","LOG003_MATCH_EVENTS"))
            assertEquals(old.queryForList("SELECT * FROM "+table),upgraded.queryForList("SELECT * FROM "+table));
        assertEquals(old.queryForList("SELECT * FROM BM_SCHEMA_VERSION"),upgraded.queryForList("SELECT * FROM BM_SCHEMA_VERSION WHERE version<=2"));
        assertEquals(3,upgraded.queryForObject("SELECT COUNT(*) FROM BM_SCHEMA_VERSION",Integer.class));
        assertTrue(new MatchEventRepository(upgraded).activeMatchIds().isEmpty()); // no invented historical activity
        assertEquals(event.getHash(),new MatchEventRepository(jdbc(copy)).read("historical").get(0).getHash());
        assertEquals("ok",upgraded.queryForObject("PRAGMA integrity_check",String.class));
    }

    @Test void failedFinalizationRollsBackBothTablesAndRecoversAfterStorageAndServiceRestart() throws Exception {
        Path file = directory.resolve("atomic.sqlite"), journal = directory.resolve("recovery");
        var db = jdbc(file); var repo = new MatchEventRepository(db); var archive = archive(repo, journal); var game = game();
        archive.start(game); String id = game.getGameId();
        assertEquals(List.of(id), repo.activeMatchIds());
        db.execute("CREATE TRIGGER synthetic_finalization_failure BEFORE UPDATE ON LOG004_MATCH_REGISTRY BEGIN SELECT RAISE(ABORT,'synthetic'); END");
        finish(game); archive.record(game, List.of(new ActionLog("OUTCOME", game)));
        var failed = export(archive, game);
        assertEquals("WRITE_FAILED", failed.path("recording").path("status").asText());
        assertEquals(1, repo.read(id).size()); assertEquals(1, failed.path("unpersistedEvents").size());
        assertEquals(List.of(id), new MatchEventRepository(jdbc(file)).activeMatchIds());
        db.execute("DROP TRIGGER synthetic_finalization_failure");
        // The original service is discarded. Only immutable disk batches and SQLite survive.
        var reopened = new MatchEventRepository(jdbc(file)); var recovered = archive(reopened, journal);
        var result = export(recovered, game);
        assertTrue(result.path("recording").path("complete").asBoolean());
        assertEquals(List.of("INITIAL", "OUTCOME"), kinds(reopened.read(id)));
        assertEquals(failed.path("events").get(0), result.path("events").get(0));
        assertEquals(failed.path("unpersistedEvents").get(0), result.path("events").get(1));
        assertEquals(List.of(), reopened.activeMatchIds());
        for (int i=0; i<3; i++) { recovered.record(game, List.of(new ActionLog("OUTCOME", game))); recovered.retryPending(); archive.retryPending(); }
        assertEquals(result, export(recovered, game));
        assertEquals(result, mapper.valueToTree(new MatchArchiveService(new MatchEventRepository(jdbc(file)), mapper, new MatchVersions()).export(id, "a")));
        assertThrows(RuntimeException.class, () -> db.update("DELETE FROM LOG004_MATCH_REGISTRY"));
        assertThrows(RuntimeException.class, () -> db.update("UPDATE LOG004_MATCH_REGISTRY SET N_OUTCOME_SEQUENCE=NULL,T_OUTCOME_HASH=NULL"));
        assertThrows(RuntimeException.class, () -> reopened.append(id, List.of(new MatchEventRepository.Entry(id, 2, reopened.read(id).get(1).getHash(), "{}"))));
        assertEquals("ok", db.queryForObject("PRAGMA integrity_check", String.class));
        assertTrue(db.queryForList("PRAGMA foreign_key_check").isEmpty());
    }

    @Test void initialFailureAndLaterEventsSurviveRecorderRestartWithoutInventingAnOutcomeOrPlayableRestore() throws Exception {
        Path file = directory.resolve("initial.sqlite"), journal = directory.resolve("recovery");
        var db = jdbc(file); var repo = new MatchEventRepository(db);
        db.execute("CREATE TRIGGER synthetic_initial_failure BEFORE INSERT ON LOG003_MATCH_EVENTS BEGIN SELECT RAISE(ABORT,'synthetic'); END");
        var archive = archive(repo, journal); var game = game(); String id = game.getGameId(); archive.start(game);
        archive.record(game, List.of(new ActionLog("DISCONNECTED", MatchSnapshot.fields("playerId", "a", "deadline", 123))));
        assertTrue(repo.read(id).isEmpty()); assertTrue(repo.activeMatchIds().isEmpty());
        var disk = new MatchRecoveryJournal(journal, mapper).read().get(id);
        assertEquals(List.of("INITIAL", "DISCONNECTED"), kinds(disk));
        db.execute("DROP TRIGGER synthetic_initial_failure");
        var restarted = archive(new MatchEventRepository(jdbc(file)), journal);
        assertEquals(List.of(id), new MatchEventRepository(jdbc(file)).activeMatchIds());
        assertEquals(List.of("INITIAL", "DISCONNECTED"), kinds(repo.read(id)));
        assertEquals(disk.get(1).getHash(), repo.read(id).get(1).getHash());
        assertThrows(AccessDeniedException.class, () -> restarted.export(id, "a"));
        var runtime = new GameSessionServiceImpl(mock(ConnectionsService.class), mock(GameLoggingService.class), mock(com.gsc.bm.service.view.ViewExtractorService.class));
        assertThrows(IllegalArgumentException.class, () -> runtime.getGame(id));
        assertEquals(0, game.getTurn()); assertFalse(game.isOver());
    }

    @Test void lostCommitAcknowledgementAndConcurrentRetriesNeverDuplicateAnOutcomeOrRepeatTheRound() throws Exception {
        Path file = directory.resolve("ack.sqlite"), journal = directory.resolve("recovery"); var db = jdbc(file);
        var loseAck = new AtomicBoolean(true);
        var repo = new MatchEventRepository(db) {
            @Override public synchronized void commit(String id, List<Entry> batch) {
                super.commit(id, batch);
                if (batch.stream().anyMatch(e -> e.getJson().contains("\"kind\":\"OUTCOME\"")) && loseAck.getAndSet(false)) {
                    throw new IllegalStateException("synthetic lost acknowledgement");
                }
            }
        };
        var archive = archive(repo, journal); var game = game(); game.getPlayers().get("b").getResources().put(Resource.HEALTH,10);
        var logger = new GameLoggingServiceImpl(mock(org.springframework.core.env.Environment.class), mock(GameLogRepository.class), archive);
        var runtime = new GameSessionServiceImpl(mock(ConnectionsService.class), logger, mock(com.gsc.bm.service.view.ViewExtractorService.class));
        runtime.newGame(game); String id = game.getGameId(); var notified = new java.util.concurrent.atomic.AtomicInteger();
        runtime.submitMoveToGame(new Move("struggle","a","b",id,null), notified::incrementAndGet);
        runtime.submitMoveToGame(new Move("struggle","b","a",id,null), notified::incrementAndGet);
        assertEquals(1, notified.get()); assertEquals(1, game.getTurn());
        assertEquals(85, game.getPlayers().get("a").getResources().get(Resource.HEALTH));
        assertEquals(-5, game.getPlayers().get("b").getResources().get(Resource.HEALTH));
        var bytes = repo.read(id).stream().map(MatchEventRepository.Entry::getJson).collect(java.util.stream.Collectors.toList());
        assertEquals(List.of("INITIAL","MOVE_ACCEPTED","COMMAND_COMMITTED","MOVE_ACCEPTED","ROUND_READY","ENGINE_REPORT","ROUND_COMMITTED","COMMAND_COMMITTED","OUTCOME"), kinds(repo.read(id)));
        var pool = Executors.newFixedThreadPool(3); var gate = new CountDownLatch(1);
        try {
            List<Future<?>> futures = new ArrayList<>();
            for (int n=0; n<3; n++) futures.add(pool.submit(() -> { gate.await();
                var competing = archive(new MatchEventRepository(jdbc(file)), journal);
                for (int i=0;i<3;i++) { competing.retryPending(); archive.retryPending(); export(competing,game); }
                return null;
            }));
            gate.countDown(); for (var future:futures) future.get(15,TimeUnit.SECONDS);
        } finally { pool.shutdownNow(); }
        assertEquals(bytes, repo.read(id).stream().map(MatchEventRepository.Entry::getJson).collect(java.util.stream.Collectors.toList()));
        assertTrue(export(archive,game).path("recording").path("complete").asBoolean());
        assertEquals(1, db.queryForObject("SELECT COUNT(*) FROM LOG004_MATCH_REGISTRY WHERE N_OUTCOME_SEQUENCE IS NOT NULL", Integer.class));
        assertEquals(1, game.getTurn()); assertEquals(1, notified.get());
        var conflict = new MatchEventRepository.Entry(id,8,repo.read(id).get(7).getHash(),"{\"kind\":\"OUTCOME\",\"different\":true}");
        assertThrows(IllegalStateException.class, () -> repo.commit(id,List.of(conflict)));
        assertEquals(9, repo.read(id).size());
    }

    @Test void recoveryJournalFailureFallsBackToSqliteAndRetriesWithoutLosingThePrefix() throws Exception {
        Path file=directory.resolve("fallback.sqlite"), journal=directory.resolve("recovery"); var repo=new MatchEventRepository(jdbc(file));
        var unavailable=new AtomicBoolean(true);
        var disk=new MatchRecoveryJournal(journal,mapper) {
            @Override public void store(String id,List<MatchEventRepository.Entry> batch) throws java.io.IOException {
                if(unavailable.get()) throw new java.io.IOException("synthetic disk failure");
                super.store(id,batch);
            }
        };
        var archive=new MatchArchiveService(repo,mapper,new MatchVersions(),disk); var game=game(); archive.start(game);
        assertEquals(1,repo.read(game.getGameId()).size()); unavailable.set(false);
        finish(game); archive.record(game,List.of(new ActionLog("OUTCOME",game)));
        assertEquals(List.of("INITIAL","OUTCOME"),kinds(disk.read().get(game.getGameId())));
        assertTrue(export(archive(repo,journal),game).path("recording").path("complete").asBoolean());
        // A malformed committed file fails closed; unrelated staging files are ignored.
        Files.writeString(journal.resolve("interrupted.tmp"),"partial"); assertEquals(1,disk.read().size());
        Files.writeString(journal.resolve("tampered.json"),"{}");
        assertThrows(IllegalStateException.class,()->archive(repo,journal));
    }

    @Test void simultaneousSinkFailureRemainsExplicitlyIncompleteUntilBothAreAvailable() throws Exception {
        Path file=directory.resolve("both.sqlite"),journal=directory.resolve("recovery");var db=jdbc(file);var repo=new MatchEventRepository(db);
        var unavailable=new AtomicBoolean(true);
        var disk=new MatchRecoveryJournal(journal,mapper) {
            @Override public void store(String id,List<MatchEventRepository.Entry> batch) throws java.io.IOException {
                if(unavailable.get()) throw new java.io.IOException("synthetic");super.store(id,batch);
            }
        };
        var archive=new MatchArchiveService(repo,mapper,new MatchVersions(),disk);var game=game();archive.start(game);
        db.execute("CREATE TRIGGER synthetic_outage BEFORE INSERT ON LOG003_MATCH_EVENTS BEGIN SELECT RAISE(ABORT,'synthetic'); END");
        finish(game);archive.record(game,List.of(new ActionLog("OUTCOME",game)));
        var pending=export(archive,game);assertFalse(pending.path("recording").path("complete").asBoolean());
        assertEquals(1,pending.path("events").size());assertEquals(1,pending.path("unpersistedEvents").size());
        assertTrue(disk.read().isEmpty());assertTrue(game.isOver());
        unavailable.set(false);archive.retryPending(); // disk recovers first, DB is still unavailable
        assertEquals(2,disk.read().get(game.getGameId()).size());
        db.execute("DROP TRIGGER synthetic_outage");
        var recovered=archive(new MatchEventRepository(jdbc(file)),journal);
        assertTrue(export(recovered,game).path("recording").path("complete").asBoolean());
        assertEquals(List.of("INITIAL","OUTCOME"),kinds(repo.read(game.getGameId())));
        assertEquals(pending.path("unpersistedEvents").get(0),export(recovered,game).path("events").get(1));
    }

    @Test void sqliteAheadOfTheRecoveryFilesIsReconciledAfterRestart() throws Exception {
        Path file=directory.resolve("ahead.sqlite"),journal=directory.resolve("recovery");var repo=new MatchEventRepository(jdbc(file));
        var unavailable=new AtomicBoolean(false);
        var disk=new MatchRecoveryJournal(journal,mapper) {
            @Override public void store(String id,List<MatchEventRepository.Entry> batch) throws java.io.IOException {
                if(unavailable.get()) throw new java.io.IOException("synthetic");super.store(id,batch);
            }
        };
        var archive=new MatchArchiveService(repo,mapper,new MatchVersions(),disk);var game=game();archive.start(game);
        unavailable.set(true);finish(game);archive.record(game,List.of(new ActionLog("OUTCOME",game)));
        assertEquals(1,disk.read().get(game.getGameId()).size());
        var before=export(archive,game);assertTrue(before.path("recording").path("complete").asBoolean());
        var restarted=archive(new MatchEventRepository(jdbc(file)),journal);restarted.retryPending();
        assertEquals(before,export(restarted,game));assertEquals(2,disk.read().get(game.getGameId()).size());
        assertEquals(2,repo.read(game.getGameId()).size());
    }

    @Test void conflictingConcurrentFinalizationsChooseExactlyOneDurableOutcome() throws Exception {
        Path file=directory.resolve("race.sqlite");var repo=new MatchEventRepository(jdbc(file));
        var archive=new MatchArchiveService(repo,mapper,new MatchVersions());var game=game();archive.start(game);String id=game.getGameId();
        String previous=repo.read(id).get(0).getHash();
        var first=new MatchEventRepository.Entry(id,1,previous,"{\"kind\":\"OUTCOME\",\"data\":{\"winner\":\"a\"}}");
        var second=new MatchEventRepository.Entry(id,1,previous,"{\"kind\":\"OUTCOME\",\"data\":{\"winner\":\"b\"}}");
        var other=new MatchEventRepository(jdbc(file));var pool=Executors.newFixedThreadPool(2);var gate=new CountDownLatch(1);
        try {
            var a=pool.submit(()->{gate.await();try{repo.commit(id,List.of(first));return true;}catch(IllegalStateException conflict){return false;}});
            var b=pool.submit(()->{gate.await();try{other.commit(id,List.of(second));return true;}catch(IllegalStateException conflict){return false;}});
            gate.countDown();assertNotEquals(a.get(10,TimeUnit.SECONDS),b.get(10,TimeUnit.SECONDS));
            var saved=repo.read(id);assertEquals(2,saved.size());assertEquals(List.of(),other.activeMatchIds());
            var terminal=jdbc(file).queryForMap("SELECT N_OUTCOME_SEQUENCE,T_OUTCOME_HASH FROM LOG004_MATCH_REGISTRY WHERE C_GAME_ID=?",id);
            assertEquals(1,((Number)terminal.get("N_OUTCOME_SEQUENCE")).intValue());assertEquals(saved.get(1).getHash(),terminal.get("T_OUTCOME_HASH"));
        } finally {pool.shutdownNow();}
    }
}
