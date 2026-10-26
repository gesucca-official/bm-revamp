package com.gsc.bm.repo.external;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public class WebClientLogRepository {
    private final JdbcTemplate jdbc;
    private static final RowMapper<WebClientLogRecord> ROW = (r, n) -> new WebClientLogRecord(
            r.getString("C_TIMESTAMP"), r.getString("T_ADDITIONAL"), r.getString("T_MESSAGE"));
    public WebClientLogRepository(@Qualifier("applicationJdbc") JdbcTemplate jdbc) { this.jdbc = jdbc; }
    public WebClientLogRecord save(WebClientLogRecord r) {
        jdbc.update("INSERT INTO LOG002_WEB_CLIENT(C_TIMESTAMP,T_ADDITIONAL,T_MESSAGE) VALUES (?,?,?) " +
                "ON CONFLICT(C_TIMESTAMP) DO UPDATE SET T_ADDITIONAL=excluded.T_ADDITIONAL,T_MESSAGE=excluded.T_MESSAGE",
                r.getTimestamp(), r.getAdditional(), r.getMessage());
        return r;
    }
    public long count() { return jdbc.queryForObject("SELECT COUNT(*) FROM LOG002_WEB_CLIENT", Long.class); }
    public List<WebClientLogRecord> findAll() { return jdbc.query("SELECT * FROM LOG002_WEB_CLIENT ORDER BY C_TIMESTAMP", ROW); }
    @Transactional("externalDbTransactionManager")
    public void deleteAll(Iterable<WebClientLogRecord> records) {
        for (WebClientLogRecord r : records) { jdbc.update("DELETE FROM LOG002_WEB_CLIENT WHERE C_TIMESTAMP=?", r.getTimestamp()); }
    }
}
