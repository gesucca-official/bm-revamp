package com.gsc.bm.conf;

import com.gsc.bm.service.session.GameSessionService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import java.time.Clock;

@Configuration
@EnableScheduling
public class GameClockConfiguration {
    @Bean public Clock gameClock() { return Clock.systemUTC(); }

    // Correctness also checks absolute deadlines on commands; cadence is only notification latency.
    @Bean public DeadlinePoller deadlinePoller(GameSessionService games) { return new DeadlinePoller(games); }
    public static class DeadlinePoller {
        private final GameSessionService games;
        public DeadlinePoller(GameSessionService games) { this.games = games; }
        @Scheduled(fixedDelayString = "${app.game.deadline-poll-ms:100}")
        public void poll() { games.expireDue(); }
    }
}
