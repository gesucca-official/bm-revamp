package com.gsc.bm.api.ws;

import com.gsc.bm.service.session.*;
import com.gsc.bm.service.session.model.QueuedPlayer;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import java.security.Principal;

@Controller
public class SessionLifecycleController {
    private final GameSessionService games;
    private final QueueService queues;
    private final MatchArchiveService archive;
    public SessionLifecycleController(GameSessionService games, QueueService queues, MatchArchiveService archive) {
        this.games = games; this.queues = queues; this.archive = archive;
    }
    @MessageMapping("/session/resume")
    @SendToUser("/queue/session/resume")
    public Object resume(Principal user) {
        Object live = games.resume(user.getName());
        if ("none".equals(((java.util.Map<?, ?>) live).get("status"))) { return archive.latestRestartOutcome(user.getName()); }
        return live;
    }

    @MessageMapping("/session/logout")
    @SendToUser("/queue/session/logout")
    public boolean logout(Principal user) {
        queues.leaveAllQueues(new QueuedPlayer(user.getName(), true));
        games.logout(user.getName());
        return true;
    }
    @MessageMapping("/session/queue/leave")
    @SendToUser("/queue/session/queue/leave")
    public boolean leaveQueue(Principal user) {
        queues.leaveAllQueues(new QueuedPlayer(user.getName(), true));
        return true;
    }
}
