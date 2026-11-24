package com.gsc.bm.service.session.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@EqualsAndHashCode
public class QueuedPlayer {
    private final String playerId;
    private final boolean isHuman;
    /**
     * SB-29 (D190): the starter category the human chose, null for any (computers, and humans who did not choose). Not part of
     * the identity ({@code leaveAllQueues} compares with a player rebuilt without it) and not published with the queue.
     */
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private final String category;

    public QueuedPlayer(String playerId, boolean isHuman) { this(playerId, isHuman, null); }

    public QueuedPlayer(String playerId, boolean isHuman, String category) {
        this.playerId = playerId;
        this.isHuman = isHuman;
        this.category = category;
    }
}
