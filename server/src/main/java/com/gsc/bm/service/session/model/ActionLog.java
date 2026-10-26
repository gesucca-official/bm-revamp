package com.gsc.bm.service.session.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.ToString;
import org.springframework.util.SerializationUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@ToString
public class ActionLog {

    private final String when;

    private final String what;
    private final Object data;

    @JsonCreator
    private ActionLog(@JsonProperty("when") String when,
                      @JsonProperty("what") String what,
                      @JsonProperty("data") Object data) {
        this.when = when;
        this.what = what;
        this.data = data;
    }

    public ActionLog(String what, Object data) {
        this.when = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        this.what = what;
        this.data = SerializationUtils.deserialize(SerializationUtils.serialize(data)); // is this really necessary?
    }
}