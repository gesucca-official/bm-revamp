package com.gsc.bm.repo.external;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class UserDecksRepository extends JsonJdbcRepository {
    private static final TypeReference<UserDecksRecord.UserStoredDeck> DECK = new TypeReference<>() { };
    private final RowMapper<UserDecksRecord> row = (r, n) -> new UserDecksRecord(
            r.getString("C_USERNAME"), r.getString("C_DECK_ID"), read(r.getString("J_DECK"), DECK));
    public UserDecksRepository(@Qualifier("applicationJdbc") JdbcTemplate jdbc, ObjectMapper mapper) { super(jdbc, mapper); }
    public Optional<UserDecksRecord> findById(UserDeckRecordKey key) {
        return jdbc.query("SELECT * FROM USR002_DECKS WHERE C_USERNAME=? AND C_DECK_ID=?", row,
                key.getUsername(), key.getDeckId()).stream().findFirst();
    }
    public List<UserDecksRecord> findAllByUsername(String username) {
        return jdbc.query("SELECT * FROM USR002_DECKS WHERE C_USERNAME=? ORDER BY C_DECK_ID", row, username);
    }
    public UserDecksRecord save(UserDecksRecord r) {
        jdbc.update("INSERT INTO USR002_DECKS(C_USERNAME,C_DECK_ID,J_DECK) VALUES (?,?,?) " +
                "ON CONFLICT(C_USERNAME,C_DECK_ID) DO UPDATE SET J_DECK=excluded.J_DECK",
                r.getUsername(), r.getDeckId(), json(r.getDeck()));
        return r;
    }
    public void deleteById(UserDeckRecordKey key) {
        jdbc.update("DELETE FROM USR002_DECKS WHERE C_USERNAME=? AND C_DECK_ID=?", key.getUsername(), key.getDeckId());
    }
}
