package com.gsc.bm.repo.external;

import com.gsc.bm.service.session.model.ActionLog;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class GameLogRecord {

    private String gameId;

    private String players;

    private String type;

    private String date;

    private String status;

    private List<ActionLog> fullLog;

}
