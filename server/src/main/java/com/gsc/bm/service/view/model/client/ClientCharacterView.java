package com.gsc.bm.service.view.model.client;

import com.gsc.bm.model.Resource;
import com.gsc.bm.model.cards.Card;
import com.gsc.bm.model.game.Timer;
import com.gsc.bm.model.game.status.Status;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;

@Builder
@Getter
public class ClientCharacterView {
    private final String name;
    private final String bindingName;
    private final boolean dead;
    private final int itemsSize;
    private final Queue<Card> items;
    private final Map<Resource, Integer> resources;
    private final List<Status> statuses;
    private final Set<Resource> immunities;
    private final Set<Timer> timers;

    private final String sprite;
    /**
     * SB-16i («Rincara», D97), playground rules only: how many times this character played each card in the match, voided plays
     * included, by card name in lower case. Public, as every play is. Always present with these rules (empty before the first
     * play, so the client can say «never played»); absent with the live rules.
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private final Map<String, Integer> plays;
}
