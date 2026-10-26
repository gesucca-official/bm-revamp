package com.gsc.bm;

import com.fasterxml.jackson.databind.*;
import com.gsc.bm.conf.db.ApplicationDatabase;
import com.gsc.bm.repo.external.MatchEventRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.io.TempDir;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.jdbc.core.JdbcTemplate;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.TimeUnit;
import static org.junit.jupiter.api.Assertions.*;

/** Separate JVMs: graceful close, hard termination, repeated restart and kill inside a SQL transaction. */
@Tag("context")
class RestartCliTest {
    @TempDir Path directory;
    final Path root=Path.of("..").toAbsolutePath().normalize();
    final ObjectMapper mapper=new ObjectMapper();
    final List<Process> processes=new ArrayList<>();
    int launches;
    Path database() {return directory.resolve("application.sqlite");}
    JdbcTemplate db() {return new JdbcTemplate(ApplicationDatabase.open(database()));}
    Map<String,List<Map<String,Object>>> legacy(JdbcTemplate jdbc) {
        Map<String,List<Map<String,Object>>> result=new LinkedHashMap<>();
        for(String table:List.of("BM_SCHEMA_VERSION","USR001_CREDENTIALS","USR002_DECKS","LOG001_GAMES","LOG002_WEB_CLIENT"))
            result.put(table,jdbc.queryForList("SELECT * FROM "+table+" ORDER BY rowid"));
        return result;
    }
    List<String> bytes(MatchEventRepository repo,String id) {
        return repo.read(id).stream().map(MatchEventRepository.Entry::getJson).collect(java.util.stream.Collectors.toList());
    }
    Process server(Path control,int pause) throws Exception {
        Files.createDirectories(control);
        var pb=new ProcessBuilder(Path.of(System.getProperty("java.home"),"bin","java.exe").toString(),
                "-cp",System.getProperty("surefire.test.class.path",System.getProperty("java.class.path")),RestartServerProcess.class.getName(),
                "--spring.profiles.active=test","--server.port=0","--server.address=127.0.0.1",
                "--app.database.path="+database(),"--app.game.deadline-poll-ms=3600000","--app.archive.retry-ms=3600000");
        pb.environment().put("BM_I24_CONTROL",control.toString());pb.environment().put("BM_I24_PAUSE",String.valueOf(pause));
        Process process=pb.redirectErrorStream(true).redirectOutput(directory.resolve("server-"+(launches++)+".log").toFile()).start();
        processes.add(process);awaitFile(control.resolve(pause==0?"ready":"paused"),process);return process;
    }
    void awaitFile(Path path,Process process) throws Exception {
        long end=System.nanoTime()+TimeUnit.SECONDS.toNanos(50);
        while(!Files.exists(path) && process.isAlive() && System.nanoTime()<end)Thread.sleep(20);
        assertTrue(Files.exists(path),"Missing "+path+"; logs in "+directory);
    }
    void stop(Process process,boolean crash) throws Exception {
        if(crash)process.destroyForcibly();else {process.getOutputStream().write("stop\n".getBytes(java.nio.charset.StandardCharsets.UTF_8));process.getOutputStream().flush();}
        assertTrue(process.waitFor(15,TimeUnit.SECONDS),"Server did not stop");
        if(!crash)assertEquals(0,process.exitValue());
    }
    Process cli(Path control,String action,Path output) throws Exception {
        var pb=new ProcessBuilder(root.resolve(".tools/node-v12.22.12-win-x64/node.exe").toString(),root.resolve("scripts/cli-restart-test.cjs").toString());
        pb.environment().put("BM_URL","http://127.0.0.1:"+Files.readString(control.resolve("ready"))+"/api");
        pb.environment().put("BM_I24_ACTION",action);pb.environment().put("BM_I24_FIXTURES",directory.resolve("fixture.json").toString());
        Process process=pb.redirectErrorStream(true).redirectOutput(output.toFile()).start();processes.add(process);return process;
    }
    @ParameterizedTest @ValueSource(strings={"clean","crash","interrupted"})
    void closesActivesAndPreservesConcludedThroughRealServerRestarts(String scenario) throws Exception {
        try {
            Path control=directory.resolve("first");Process running=server(control,0);
            Process preparation=cli(control,"prepare",directory.resolve("prepare.json"));
            awaitFile(directory.resolve("fixture.json"),preparation);
            var fixture=mapper.readTree(Files.readString(directory.resolve("fixture.json")));
            var jdbc=db();var repository=new MatchEventRepository(jdbc);assertEquals(4,repository.activeMatchIds().size());
            stop(running,!scenario.equals("clean"));
            preparation.getOutputStream().write("done\n".getBytes());preparation.getOutputStream().flush();
            assertTrue(preparation.waitFor(10,TimeUnit.SECONDS));assertEquals(0,preparation.exitValue(),Files.readString(directory.resolve("prepare.json")));
            jdbc.update("INSERT INTO LOG001_GAMES(C_GAME_ID,J_FULL_LOG) VALUES (?,?)","historical-log","{\"preserve\":true}");
            jdbc.update("INSERT INTO LOG002_WEB_CLIENT(C_TIMESTAMP,T_MESSAGE) VALUES (?,?)","historical-time","preserve web log");
            // Snapshot after shutdown includes every transport event actually observed at shutdown.
            var previous=legacy(jdbc);Map<String,List<String>> prefixes=new LinkedHashMap<>();
            for(var match:fixture.path("active"))prefixes.put(match.path("id").asText(),bytes(repository,match.path("id").asText()));
            String done=fixture.path("done").path("id").asText();var concluded=bytes(repository,done);
            assertEquals(4,repository.activeMatchIds().size());
            if(scenario.equals("interrupted")) {
                Path mid=directory.resolve("interruption");Process paused=server(mid,2);
                assertFalse(Files.exists(mid.resolve("ready")),"Partially finalized server became operational");
                // First match has committed. Second OUTCOME is inserted but invisible outside its transaction.
                assertEquals(3,repository.activeMatchIds().size());String interrupted=Files.readString(mid.resolve("paused"));
                assertEquals(prefixes.get(interrupted),bytes(repository,interrupted));stop(paused,true);
                assertEquals(prefixes.get(interrupted),bytes(repository,interrupted));assertEquals(3,repository.activeMatchIds().size());
            }
            JsonNode allExports=null;
            for(int restart=0;restart<3;restart++) {
                control=directory.resolve("restart-"+restart);running=server(control,0);
                assertTrue(repository.activeMatchIds().isEmpty());assertEquals(previous,legacy(jdbc));assertEquals(concluded,bytes(repository,done));
                for(var match:fixture.path("active")) {
                    String id=match.path("id").asText();var events=bytes(repository,id);var prefix=prefixes.get(id);
                    assertEquals(prefix,events.subList(0,prefix.size()));assertEquals(prefix.size()+1,events.size());
                    var last=mapper.readTree(events.get(events.size()-1));assertEquals("OUTCOME",last.path("kind").asText());
                    assertEquals("riavvio server",last.path("data").path("outcomeReason").asText());
                }
                Path output=directory.resolve("inspect-"+restart+".json");Process inspection=cli(control,"inspect",output);
                assertTrue(inspection.waitFor(50,TimeUnit.SECONDS),"CLI inspect stalled");assertEquals(0,inspection.exitValue(),Files.readString(output));
                var result=mapper.readTree(Files.readString(output));assertTrue(result.path("ok").asBoolean());
                if(allExports!=null)assertEquals(allExports,result.path("exports"));allExports=result.path("exports");
                stop(running,false);
            }
            assertEquals("ok",jdbc.queryForObject("PRAGMA integrity_check",String.class));assertTrue(jdbc.queryForList("PRAGMA foreign_key_check").isEmpty());
        } finally {
            for(Process process:processes)if(process.isAlive()){process.destroyForcibly();process.waitFor(10,TimeUnit.SECONDS);}
            // Preserve evidence on failure as well as success, including the isolated database.
            Path evidence=root.resolve(".build-logs/i24-"+scenario+"-evidence");Files.createDirectories(evidence);
            try(var files=Files.walk(directory)) {
                for(Path path:(Iterable<Path>)files.filter(Files::isRegularFile)::iterator) {
                    Path target=evidence.resolve(directory.relativize(path));Files.createDirectories(target.getParent());Files.copy(path,target,StandardCopyOption.REPLACE_EXISTING);
                }
            }
        }
    }
}
