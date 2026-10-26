package com.gsc.bm;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.conf.db.ApplicationDatabase;
import com.gsc.bm.repo.external.*;
import com.gsc.bm.repo.external.UserDecksRecord.UserStoredDeck;
import com.gsc.bm.repo.internal.CardsGuiRepository;
import com.gsc.bm.service.factories.CardFactoryService;
import com.gsc.bm.service.factories.DeckFactoryService;
import com.gsc.bm.service.account.UserAccountService;
import com.gsc.bm.service.session.model.ActionLog;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Tag("context")
class ApplicationPersistenceTest extends SqliteContextSupport {
    @Autowired UserCredentialsRepository users;
    @Autowired UserDecksRepository decks;
    @Autowired GameLogRepository games;
    @Autowired WebClientLogRepository webLogs;
    @Autowired CardsGuiRepository cards;
    @Autowired CardFactoryService cardFactory;
    @Autowired DeckFactoryService deckFactory;
    @Autowired UserAccountService accountService;
    @Autowired ObjectMapper mapper;
    @Autowired PasswordEncoder encoder;
    @Autowired JavaMailSender mail;
    @Autowired @Qualifier("applicationJdbc") JdbcTemplate jdbc;
    @Autowired @Qualifier("externalDbTransactionManager") PlatformTransactionManager transactions;
    @Autowired @Qualifier("dataSourceInternalDB") javax.sql.DataSource catalog;

    private String id() { return "synthetic-" + UUID.randomUUID(); }
    private UserCredentialsRecord account(String username) {
        return users.save(new UserCredentialsRecord(username, username + "@example.invalid",
                encoder.encode("synthetic-password"), "USER"));
    }
    private UserStoredDeck deck(String card) {
        return new UserStoredDeck("bruiser.character.BigBadBruiser", "com.basic.BruiserGrab", "com.last.Struggle",
                List.of("bruiser.character.LittleSmack", "bruiser.character.LittleRage"), List.of(card, card));
    }

    @Test
    void accountsAndDecksSurviveReopenWithCompositeIdentity() {
        String alice = id(), bob = id();
        account(alice); account(bob);
        decks.save(new UserDecksRecord(alice, "one", deck("bruiser.SuperImpact")));
        decks.save(new UserDecksRecord(alice, "two", deck("com.Grab")));
        decks.save(new UserDecksRecord(bob, "one", deck("com.Steal")));
        decks.save(new UserDecksRecord(alice, "one", deck("com.ShuffleFeet")));

        JdbcTemplate reopened = new JdbcTemplate(ApplicationDatabase.open(DATABASE));
        UserCredentialsRepository reopenedUsers = new UserCredentialsRepository(reopened);
        UserDecksRepository reopenedDecks = new UserDecksRepository(reopened, mapper);
        assertTrue(encoder.matches("synthetic-password", reopenedUsers.findById(alice).orElseThrow().getSaltedHash()));
        assertEquals(1, reopenedUsers.findAllByEmail(alice + "@example.invalid").size());
        assertEquals(2, reopenedDecks.findAllByUsername(alice).size());
        assertEquals(deck("com.ShuffleFeet"), reopenedDecks.findById(new UserDeckRecordKey(alice, "one")).orElseThrow().getDeck());
        assertEquals(deck("com.Steal"), reopenedDecks.findById(new UserDeckRecordKey(bob, "one")).orElseThrow().getDeck());
        assertEquals(2, accountService.loadUserAccountInfo(alice).getDecks().size());
        assertEquals(2, accountService.loadUserAccountInfo(alice).getCollection().getCharacters().size());
        reopenedDecks.deleteById(new UserDeckRecordKey(alice, "one"));
        assertTrue(decks.findById(new UserDeckRecordKey(alice, "one")).isEmpty());
        assertTrue(decks.findById(new UserDeckRecordKey(bob, "one")).isPresent());
    }

    @Test
    void logsRoundTripNestedPayloadTimestampAndUpdates() {
        String gameId = id(), stamp = id();
        ActionLog action = new ActionLog("synthetic turn", Map.of("HEALTH", 85, "cards", List.of("a", "b")));
        games.save(new GameLogRecord(gameId, "alice,bob", "test", "synthetic-date", "STARTED", List.of(action)));
        games.save(new GameLogRecord(gameId, "alice,bob", "test", "synthetic-date", "ENDED", List.of(action)));
        webLogs.save(new WebClientLogRecord(stamp, "synthetic-session", "synthetic-message"));
        GameLogRepository reopened = new GameLogRepository(new JdbcTemplate(ApplicationDatabase.open(DATABASE)), mapper);
        GameLogRecord stored = reopened.findAllByStatus("ENDED").stream().filter(g -> g.getGameId().equals(gameId)).findFirst().orElseThrow();
        assertEquals(1, stored.getFullLog().size());
        assertEquals(action.getWhen(), stored.getFullLog().get(0).getWhen());
        assertEquals(action.getWhat(), stored.getFullLog().get(0).getWhat());
        assertEquals(mapper.valueToTree(action.getData()), mapper.valueToTree(stored.getFullLog().get(0).getData()));
        assertEquals(1, reopened.findAll().stream().filter(g -> g.getGameId().equals(gameId)).count());
        assertTrue(webLogs.findAll().stream().anyMatch(w -> w.getTimestamp().equals(stamp) && w.getMessage().equals("synthetic-message")));
        assertTrue(games.count() >= 1);
        assertTrue(webLogs.count() >= 1);
    }

    @Test
    void constraintFailureRollsBackAllWritesInTransaction() {
        String username = id();
        assertThrows(DataAccessException.class, () -> new TransactionTemplate(transactions).execute(status -> {
            account(username);
            decks.save(new UserDecksRecord("missing-" + username, "deck", deck("com.Grab")));
            return null;
        }));
        assertTrue(users.findById(username).isEmpty());
        assertEquals(1, jdbc.queryForObject("PRAGMA foreign_keys", Integer.class));
        assertEquals(5000, jdbc.queryForObject("PRAGMA busy_timeout", Integer.class));
        assertEquals(2, jdbc.queryForObject("PRAGMA synchronous", Integer.class));
        assertEquals("wal", jdbc.queryForObject("PRAGMA journal_mode", String.class));
    }

    @Test
    void invalidStoredJsonIsReportedInsteadOfReturningAnEmptyDeck() {
        String username = id();
        account(username);
        jdbc.update("INSERT INTO USR002_DECKS VALUES (?,?,'not-json')", username, "broken");
        assertThrows(DataAccessException.class, () -> decks.findById(new UserDeckRecordKey(username, "broken")));
    }

    @Test
    void concurrentShortWritesUseIndependentConnectionsWithoutLosingAccounts() throws Exception {
        String prefix = id();
        var executor = Executors.newFixedThreadPool(4);
        try {
            List<Callable<Void>> jobs = new ArrayList<>();
            for (int i = 0; i < 12; i++) {
                String name = prefix + i;
                jobs.add(() -> { users.save(new UserCredentialsRecord(name, null, "synthetic-hash", "USER")); return null; });
            }
            for (var future : executor.invokeAll(jobs)) { future.get(10, TimeUnit.SECONDS); }
            for (int i = 0; i < 12; i++) { assertTrue(users.findById(prefix + i).isPresent()); }
        } finally { executor.shutdownNow(); }
    }

    @Test
    void realCatalogLoadsAndCannotBeWritten() {
        assertEquals(37, cards.count());
        assertEquals(20, deckFactory.craftCharacterStarterDeck("bruiser.character.BigBadBruiser").size());
        assertEquals(20, deckFactory.craftCharacterStarterDeck("junkie.character.ToxicJunkie").size());
        cards.findAll().forEach(record -> assertNotNull(cardFactory.craftCard(record.getClazz()).getName()));
        assertThrows(DataAccessException.class, () -> new JdbcTemplate(catalog).update(
                "UPDATE CRD001_GUI SET T_GUI_NAME='should-never-write' WHERE C_REF_CLASS='com.Grab'"));
    }

    @Test
    void emailIsDisabledWithoutOpeningSmtpConnection() {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("synthetic@example.invalid");
        message.setText("synthetic");
        assertThrows(MailSendException.class, () -> mail.send(message));
    }
}
