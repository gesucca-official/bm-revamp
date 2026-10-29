package com.gsc.bm.conf;

import com.gsc.bm.repo.external.UserCredentialsRecord;
import com.gsc.bm.repo.external.UserCredentialsRepository;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** Explicit, local-only synthetic identities; never reset existing data. */
@Component
@Profile("local")
@ConditionalOnProperty(name = "app.dev.seed-accounts", havingValue = "true")
public class DevelopmentAccounts implements ApplicationRunner {
    private final UserCredentialsRepository users;
    private final PasswordEncoder encoder;
    private final String address;

    public DevelopmentAccounts(UserCredentialsRepository users, PasswordEncoder encoder,
                               @Value("${server.address:}") String address) {
        this.users = users;
        this.encoder = encoder;
        this.address = address;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!"127.0.0.1".equals(address)) {
            throw new IllegalStateException("Development account provisioning requires server.address=127.0.0.1");
        }
        seed("devAlice", "local-alice");
        seed("devBob", "local-bob");
        seed("devCarol", "local-carol");
        seed("devDave", "local-dave");
        seed("devErin", "local-erin");
    }

    private void seed(String username, String password) {
        boolean created = users.createIfAbsent(new UserCredentialsRecord(
                username, null, encoder.encode(password), "USER"));
        LoggerFactory.getLogger(DevelopmentAccounts.class).info("Development account {}: {}", username,
                created ? "created" : "already exists, preserved (password unchanged)");
    }
}
