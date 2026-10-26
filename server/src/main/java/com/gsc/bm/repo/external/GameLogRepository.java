package com.gsc.bm.repo.external;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gsc.bm.service.session.model.ActionLog;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public class GameLogRepository extends JsonJdbcRepository {
    private static final TypeReference<List<ActionLog>> LOG = new TypeReference<>() { };
    private final RowMapper<GameLogRecord> row = (r, n) -> new GameLogRecord(r.getString("C_GAME_ID"),
            r.getString("T_PLAYERS"), r.getString("T_TYPE"), r.getString("T_DATE"), r.getString("T_STATUS"),
            read(r.getString("J_FULL_LOG"), LOG));
    public GameLogRepository(@Qualifier("applicationJdbc") JdbcTemplate jdbc, ObjectMapper mapper) { super(jdbc, mapper); }
    public GameLogRecord save(GameLogRecord r) {
        jdbc.update("INSERT INTO LOG001_GAMES(C_GAME_ID,T_PLAYERS,T_TYPE,T_DATE,T_STATUS,J_FULL_LOG) VALUES (?,?,?,?,?,?) " +
                "ON CONFLICT(C_GAME_ID) DO UPDATE SET T_PLAYERS=excluded.T_PLAYERS,T_TYPE=excluded.T_TYPE," +
                "T_DATE=excluded.T_DATE,T_STATUS=excluded.T_STATUS,J_FULL_LOG=excluded.J_FULL_LOG",
                r.getGameId(), r.getPlayers(), r.getType(), r.getDate(), r.getStatus(), json(r.getFullLog()));
        return r;
    }
    public long count() { return jdbc.queryForObject("SELECT COUNT(*) FROM LOG001_GAMES", Long.class); }
    public List<GameLogRecord> findAll() { return jdbc.query("SELECT * FROM LOG001_GAMES ORDER BY C_GAME_ID", row); }
    public List<GameLogRecord> findAllByStatus(String status) {
        return jdbc.query("SELECT * FROM LOG001_GAMES WHERE T_STATUS=? ORDER BY C_GAME_ID", row, status);
    }
    @Transactional("externalDbTransactionManager")
    public void deleteAll(Iterable<GameLogRecord> records) {
        for (GameLogRecord r : records) { jdbc.update("DELETE FROM LOG001_GAMES WHERE C_GAME_ID=?", r.getGameId()); }
    }
}
