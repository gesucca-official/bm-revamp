package com.gsc.bm;

import com.gsc.bm.conf.DevelopmentAccounts;
import com.gsc.bm.conf.db.ApplicationDatabase;
import com.gsc.bm.repo.external.UserCredentialsRecord;
import com.gsc.bm.repo.external.UserCredentialsRepository;
import com.gsc.bm.service.session.AuthServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.boot.DefaultApplicationArguments;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.nio.file.Path;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DevelopmentAccountsTest {
    @TempDir Path directory;
    private final PasswordEncoder encoder = new BCryptPasswordEncoder();

    @Test void provisionAuthenticateAndReopenWithoutEmail() {
        Path path = directory.resolve("accounts.sqlite");
        UserCredentialsRepository users = new UserCredentialsRepository(new JdbcTemplate(ApplicationDatabase.open(path)));
        DevelopmentAccounts seeder = new DevelopmentAccounts(users, encoder, "127.0.0.1");
        seeder.run(new DefaultApplicationArguments());
        String hash = users.findById("devAlice").orElseThrow().getSaltedHash();
        assertNotEquals("local-alice", hash);
        assertNull(users.findById("devAlice").orElseThrow().getEmail());
        seeder.run(new DefaultApplicationArguments());
        UserCredentialsRepository reopened = new UserCredentialsRepository(new JdbcTemplate(ApplicationDatabase.open(path)));
        assertEquals(hash, reopened.findById("devAlice").orElseThrow().getSaltedHash());
        JavaMailSender mail = mock(JavaMailSender.class);
        AuthServiceImpl auth = new AuthServiceImpl(mail, encoder, reopened);
        assertEquals("devAlice", auth.getAuthTokenOrFail("devAlice", "local-alice").getName());
        assertEquals("devBob", auth.getAuthTokenOrFail("devBob", "local-bob").getName());
        assertThrows(BadCredentialsException.class, () -> auth.getAuthTokenOrFail("devAlice", "wrong"));
        assertThrows(BadCredentialsException.class, () -> auth.getAuthTokenOrFail("unknown", "wrong"));
        verifyNoInteractions(mail);
    }

    @Test void duplicateIdentityPreservesEveryExistingField() {
        UserCredentialsRepository users = new UserCredentialsRepository(new JdbcTemplate(ApplicationDatabase.open(directory.resolve("duplicate.sqlite"))));
        users.save(new UserCredentialsRecord("devAlice", "synthetic@example.invalid", "original-hash", "CUSTOM"));
        new DevelopmentAccounts(users, encoder, "127.0.0.1").run(new DefaultApplicationArguments());
        UserCredentialsRecord existing = users.findById("devAlice").orElseThrow();
        assertEquals("original-hash", existing.getSaltedHash());
        assertEquals("synthetic@example.invalid", existing.getEmail());
        assertEquals("CUSTOM", existing.getRole());
    }

    @Test void provisioningRequiresExplicitLocalProfileAndFlag() {
        ApplicationContextRunner context = new ApplicationContextRunner()
                .withUserConfiguration(DevelopmentAccounts.class)
                .withBean(UserCredentialsRepository.class, () -> mock(UserCredentialsRepository.class))
                .withBean(PasswordEncoder.class, () -> encoder);
        context.withPropertyValues("spring.profiles.active=local").run(c -> assertEquals(0, c.getBeansOfType(DevelopmentAccounts.class).size()));
        context.withPropertyValues("spring.profiles.active=test", "app.dev.seed-accounts=true").run(c -> assertEquals(0, c.getBeansOfType(DevelopmentAccounts.class).size()));
        context.withPropertyValues("spring.profiles.active=local", "app.dev.seed-accounts=true", "server.address=127.0.0.1")
                .run(c -> assertNotNull(c.getBean(DevelopmentAccounts.class)));
    }

    @Test void publicBindingFailsBeforeAnyDatabaseWrite() {
        UserCredentialsRepository users = mock(UserCredentialsRepository.class);
        assertThrows(IllegalStateException.class, () -> new DevelopmentAccounts(users, encoder, "0.0.0.0").run(new DefaultApplicationArguments()));
        verifyNoInteractions(users);
    }
}
