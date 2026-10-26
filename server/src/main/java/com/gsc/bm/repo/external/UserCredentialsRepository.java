package com.gsc.bm.repo.external;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class UserCredentialsRepository {
    private final JdbcTemplate jdbc;
    private static final RowMapper<UserCredentialsRecord> ROW = (r, n) -> new UserCredentialsRecord(
            r.getString("C_USERNAME"), r.getString("T_EMAIL"), r.getString("T_SALTED_HASH"), r.getString("T_ROLE"));
    public UserCredentialsRepository(@Qualifier("applicationJdbc") JdbcTemplate jdbc) { this.jdbc = jdbc; }
    public Optional<UserCredentialsRecord> findById(String username) {
        return jdbc.query("SELECT * FROM USR001_CREDENTIALS WHERE C_USERNAME=?", ROW, username).stream().findFirst();
    }
    public List<UserCredentialsRecord> findAllByEmail(String email) {
        return jdbc.query("SELECT * FROM USR001_CREDENTIALS WHERE T_EMAIL=?", ROW, email);
    }
    public UserCredentialsRecord save(UserCredentialsRecord r) {
        jdbc.update("INSERT INTO USR001_CREDENTIALS(C_USERNAME,T_EMAIL,T_SALTED_HASH,T_ROLE) VALUES (?,?,?,?) " +
                "ON CONFLICT(C_USERNAME) DO UPDATE SET T_EMAIL=excluded.T_EMAIL,T_SALTED_HASH=excluded.T_SALTED_HASH,T_ROLE=excluded.T_ROLE",
                r.getUsername(), r.getEmail(), r.getSaltedHash(), r.getRole());
        return r;
    }
    /** Development provisioning must never replace an existing identity or password. */
    public boolean createIfAbsent(UserCredentialsRecord r) {
        return jdbc.update("INSERT INTO USR001_CREDENTIALS(C_USERNAME,T_EMAIL,T_SALTED_HASH,T_ROLE) VALUES (?,?,?,?) " +
                "ON CONFLICT(C_USERNAME) DO NOTHING", r.getUsername(), r.getEmail(), r.getSaltedHash(), r.getRole()) == 1;
    }
}
