package com.gsc.bm.conf.ws;

import org.springframework.stereotype.Component;
import org.springframework.context.event.EventListener;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.security.access.AccessDeniedException;
import java.util.HashMap;
import java.util.Map;

@Component
public class ActiveSessions {
    @org.springframework.beans.factory.annotation.Autowired
    private @org.springframework.context.annotation.Lazy com.gsc.bm.service.session.GameSessionService games;
    @org.springframework.beans.factory.annotation.Autowired
    private @org.springframework.context.annotation.Lazy com.gsc.bm.service.session.QueueService queues;
    private final Map<String, String> sessions = new HashMap<>();
    private final java.util.concurrent.locks.ReentrantLock gate = new java.util.concurrent.locks.ReentrantLock();
    public void claim(String user, String session) {
        gate.lock();
        try {
        if (session == null || sessions.containsKey(user) || sessions.containsValue(session)) {
            throw new AccessDeniedException("Session unavailable");
        }
        sessions.put(user, session);
        } finally { gate.unlock(); }
    }
    public boolean owns(String user, String session) {
        gate.lock();
        try { return session != null && session.equals(sessions.get(user)); }
        finally { gate.unlock(); }
    }
    /** Keep identity valid throughout command handling, including queued frames. */
    public void beginCommand(String user, String session) {
        gate.lock();
        if (!owns(user, session)) { gate.unlock(); throw new AccessDeniedException("Stale session"); }
    }
    public void endCommand() { gate.unlock(); }
    @EventListener
    public void disconnected(SessionDisconnectEvent event) {
        gate.lock();
        try {
        String user = sessions.entrySet().stream().filter(e -> e.getValue().equals(event.getSessionId()))
                .map(Map.Entry::getKey).findFirst().orElse(null);
        if (user != null) {
            if (queues != null) { queues.leaveAllQueues(new com.gsc.bm.service.session.model.QueuedPlayer(user, true)); }
            sessions.remove(user);
            if (games != null) { games.disconnected(user); }
        }
        } finally { gate.unlock(); }
    }
}
