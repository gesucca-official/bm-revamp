package com.gsc.bm;

import com.fasterxml.jackson.databind.*;
import com.gsc.bm.conf.db.ApplicationDatabase;
import com.gsc.bm.model.game.*;
import com.gsc.bm.repo.external.MatchEventRepository;
import com.gsc.bm.service.session.*;
import com.gsc.bm.service.session.model.ActionLog;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.AccessDeniedException;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;
import static org.junit.jupiter.api.Assertions.*;

class MatchRestartTest {
    @TempDir Path directory;
    final ObjectMapper json = new ObjectMapper();
    JdbcTemplate db() { return new JdbcTemplate(ApplicationDatabase.open(directory.resolve("isolated.sqlite"))); }
    MatchArchiveService open(MatchEventRepository repo) {
        return new MatchArchiveService(repo, json, new MatchVersions(), new MatchRecoveryJournal(directory.resolve("journal"), json));
    }
    Game game(String human) {
        var fixture = new MatchArchiveTest();
        return new Game(List.of(fixture.player(human), fixture.player("b")), "quick1v1", false);
    }
    List<String> bytes(MatchEventRepository repo, String id) {
        return repo.read(id).stream().map(MatchEventRepository.Entry::getJson).collect(java.util.stream.Collectors.toList());
    }
    @Test void closesOnlyRegisteredActivesPreservingEveryPreviousByteAndCompletedOutcome() throws Exception {
        var jdbc=db(); var repo=new MatchEventRepository(jdbc);var first=open(repo);
        var a=game("alice");var b=game("bob");var done=game("done");
        first.start(a);first.start(b);first.start(done);
        done.getPlayers().get("b").getResources().put(com.gsc.bm.model.Resource.HEALTH,0);
        first.record(done,List.of(new ActionLog("OUTCOME",done)));
        var before=bytes(repo,done.getGameId());var prefix=bytes(repo,a.getGameId());
        // An unregistered historical prefix must never be silently enrolled/finalized.
        repo.append("historical",List.of(new MatchEventRepository.Entry("historical",0,"","{}")));
        for(int restart=0;restart<3;restart++) {
            var fresh=open(new MatchEventRepository(db()));fresh.finalizeInterruptedMatches();
            assertTrue(repo.activeMatchIds().isEmpty());assertEquals(before,bytes(repo,done.getGameId()));
            assertEquals(prefix,bytes(repo,a.getGameId()).subList(0,prefix.size()));
            for(var g:List.of(a,b)) {
                var export=json.valueToTree(fresh.export(g.getGameId(),g==a?"alice":"bob"));
                assertTrue(export.path("recording").path("complete").asBoolean());assertEquals(2,export.path("events").size());
                var outcome=json.readTree(repo.read(g.getGameId()).get(1).getJson()).path("data");
                assertEquals("riavvio server",outcome.path("outcomeReason").asText());
                assertEquals("draw",outcome.path("outcome").path("result").asText());assertTrue(outcome.path("outcome").path("winner").isNull());
                assertFalse(outcome.has("players"));assertFalse(outcome.has("pendingMoves"));
            }
            assertEquals(1,repo.read("historical").size());
            assertThrows(AccessDeniedException.class,()->fresh.export(a.getGameId(),"outsider"));
            assertEquals("none",json.valueToTree(fresh.latestRestartOutcome("outsider")).path("status").asText());
            assertEquals("finished",json.valueToTree(fresh.latestRestartOutcome("alice")).path("status").asText());
        }
        assertFalse(a.isOver());assertFalse(b.isOver()); // No runtime was mutated/restored.
        assertEquals("ok",jdbc.queryForObject("PRAGMA integrity_check",String.class));
        assertTrue(jdbc.queryForList("PRAGMA foreign_key_check").isEmpty());
    }
    @Test void interruptedTerminalTransactionRollsBackAndNextStartupCompletesExactlyOnce() {
        var jdbc=db();var repo=new MatchEventRepository(jdbc);var first=open(repo);var g=game("alice");first.start(g);
        jdbc.execute("CREATE TRIGGER fail_restart BEFORE UPDATE ON LOG004_MATCH_REGISTRY BEGIN SELECT RAISE(ABORT,'synthetic'); END");
        assertThrows(RuntimeException.class,()->open(repo).finalizeInterruptedMatches());
        assertEquals(1,repo.read(g.getGameId()).size());assertEquals(List.of(g.getGameId()),repo.activeMatchIds());
        jdbc.execute("DROP TRIGGER fail_restart");
        open(new MatchEventRepository(db())).finalizeInterruptedMatches();
        assertEquals(2,repo.read(g.getGameId()).size());assertTrue(repo.activeMatchIds().isEmpty());
    }
    @Test void recoversAlreadyDurableRealOutcomeBeforeSelectingRestartDraws() {
        var jdbc=db();var repo=new MatchEventRepository(jdbc);var first=open(repo);var g=game("alice");first.start(g);
        jdbc.execute("CREATE TRIGGER outage BEFORE INSERT ON LOG003_MATCH_EVENTS WHEN NEW.N_SEQUENCE>0 BEGIN SELECT RAISE(ABORT,'synthetic'); END");
        g.getPlayers().get("b").getResources().put(com.gsc.bm.model.Resource.HEALTH,0);
        first.record(g,List.of(new ActionLog("OUTCOME",g)));
        var batch=json.valueToTree(first.export(g.getGameId(),"alice")).path("unpersistedEvents").get(0);
        assertThrows(IllegalStateException.class,()->open(repo).finalizeInterruptedMatches());
        jdbc.execute("DROP TRIGGER outage");var restarted=open(new MatchEventRepository(db()));restarted.finalizeInterruptedMatches();
        assertEquals(batch,json.valueToTree(repo.read(g.getGameId()).get(1)));
        assertTrue(repo.read(g.getGameId()).get(1).getJson().contains("\"result\":\"win\""));
        assertEquals("none",json.valueToTree(restarted.latestRestartOutcome("alice")).path("status").asText());
    }
    @Test void competingClosuresUseOneTerminalTransactionAndNewAdmissionsSupersedeOldReceipts() throws Exception {
        var repo=new MatchEventRepository(db());var first=open(repo);var g=game("alice");first.start(g);
        var other=new MatchEventRepository(db());var pool=Executors.newFixedThreadPool(2);
        try {
            var a=pool.submit(()->repo.finalizeInterrupted(g.getGameId()));var b=pool.submit(()->other.finalizeInterrupted(g.getGameId()));
            a.get(10,TimeUnit.SECONDS);b.get(10,TimeUnit.SECONDS);
        } finally {pool.shutdownNow();}
        assertEquals(2,repo.read(g.getGameId()).size());
        var restarted=open(other);assertEquals("finished",json.valueToTree(restarted.latestRestartOutcome("alice")).path("status").asText());
        restarted.start(game("alice"));assertEquals("none",json.valueToTree(restarted.latestRestartOutcome("alice")).path("status").asText());
        assertTrue(json.valueToTree(restarted.export(g.getGameId(),"alice")).path("recording").path("complete").asBoolean());
    }
}
