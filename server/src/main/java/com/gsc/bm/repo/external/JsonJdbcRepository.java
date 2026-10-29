package com.gsc.bm.repo.external;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.dao.DataRetrievalFailureException;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.jdbc.core.JdbcTemplate;

abstract class JsonJdbcRepository {
    protected final JdbcTemplate jdbc;
    private final ObjectMapper mapper;
    JsonJdbcRepository(JdbcTemplate jdbc, ObjectMapper mapper) { this.jdbc = jdbc; this.mapper = mapper; }
    protected String json(Object value) {
        try { return mapper.writeValueAsString(value); }
        catch (JsonProcessingException e) { throw new InvalidDataAccessApiUsageException("Cannot encode application JSON", e); }
    }
    protected <T> T read(String value, TypeReference<T> type) {
        try { return mapper.readValue(value, type); }
        catch (JsonProcessingException e) { throw new DataRetrievalFailureException("Cannot decode persisted application JSON", e); }
    }
}
