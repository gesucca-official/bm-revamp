package com.gsc.bm;

import com.gsc.bm.repo.external.*;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.nio.file.*;
import java.time.*;
import java.util.*;

/** Test-process entry point only. No fault switch or shutdown endpoint in production. */
public class RestartServerProcess {
    @TestConfiguration
    public static class Controls {
        @Bean @Primary public Clock frozenClock() { return Clock.fixed(Instant.ofEpochMilli(1_000_000), ZoneOffset.UTC); }
        @Bean @Primary public MatchEventRepository controlledRepository(@Qualifier("applicationJdbc") JdbcTemplate jdbc) {
            return new MatchEventRepository(jdbc) {
                int outcomes;
                @Override public synchronized void append(String id, List<Entry> entries) {
                    super.append(id, entries);
                    if (entries.stream().anyMatch(e -> e.getJson().contains("\"kind\":\"OUTCOME\""))
                            && ++outcomes == Integer.parseInt(System.getenv().getOrDefault("BM_I24_PAUSE", "0"))) {
                        try {
                            // append has inserted the event, but the outer commit has not fixed the registry.
                            Files.writeString(Path.of(System.getenv("BM_I24_CONTROL"), "paused"), id);
                            while (true) { Thread.sleep(1000); }
                        } catch (Exception e) { throw new IllegalStateException(e); }
                    }
                }
            };
        }
    }
    public static void main(String[] args) throws Exception {
        var context = new SpringApplication(BmServerApplication.class, Controls.class).run(args);
        var users=context.getBean(UserCredentialsRepository.class);var encoder=context.getBean(PasswordEncoder.class);
        for(String user:List.of("restartQuick","restartOpen","restartDuelA","restartDuelB","restartFfaA","restartFfaB","restartDone","restartOutsider")) {
            users.createIfAbsent(new UserCredentialsRecord(user,null,encoder.encode("synthetic"),"USER"));
        }
        Files.writeString(Path.of(System.getenv("BM_I24_CONTROL"),"ready"),context.getEnvironment().getProperty("local.server.port"));
        try (var input=new java.util.Scanner(System.in)) { if(input.hasNextLine()) { input.nextLine(); } }
        context.close();
    }
}
