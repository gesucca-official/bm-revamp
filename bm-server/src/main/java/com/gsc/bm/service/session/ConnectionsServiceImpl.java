package com.gsc.bm.service.session;

import com.gsc.bm.service.session.model.UserSessionInfo;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Log4j2
public class ConnectionsServiceImpl implements ConnectionsService {

    private final Set<UserSessionInfo> _USERS = new HashSet<>();

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public ConnectionsServiceImpl(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public synchronized void broadcastUsersStatus() {
        messagingTemplate.convertAndSend("/topic/connections/users", _USERS.stream()
                .map(u -> java.util.Map.of("userLogin", u.getUserLogin(), "activity", u.getActivity()))
                .collect(Collectors.toList()));
    }

    @Override
    public synchronized Set<String> getAllConnectedUsers() {
        return _USERS.stream().map(UserSessionInfo::getUserLogin).collect(Collectors.toSet());
    }

    @Override
    public synchronized void userConnected(SessionConnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String userLoginName = event.getUser() == null ? null : event.getUser().getName();
        String sessionId = accessor.getSessionId();
        log.info("User Connected! " + userLoginName + " with simpSessionId " + sessionId);
        if (userLoginName == null) { return; }
        if (_USERS.stream().anyMatch(u -> u.getSessionId().equals(sessionId))) { return; }
        _USERS.add(new UserSessionInfo(userLoginName, sessionId, "Free"));
    }

    @Override
    public synchronized String userDisconnected(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = event.getSessionId();
        String userLoginName = _USERS.stream().filter(u -> u.getSessionId().equals(sessionId)).map(UserSessionInfo::getUserLogin).findFirst().orElse(null);
        _USERS.stream()
                .filter(userSessionInfo -> userSessionInfo.getSessionId().equals(sessionId))
                .findAny()
                .ifPresentOrElse(
                        userSessionInfo -> {
                            log.info("User Disconnected: " + userSessionInfo.getUserLogin() + " with simpSessionId: " + sessionId);
                            _USERS.remove(userSessionInfo);
                        },
                        () -> log.info("An User not known as attempted Disconnection!")
                );
        return userLoginName;
    }

    @Override
    public synchronized void userActivityChanged(String userId, String activity) {
        _USERS.stream()
                .filter(userSessionInfo -> userSessionInfo.getUserLogin().equals(userId))
                .findAny()
                .ifPresentOrElse(
                        userSessionInfo -> userSessionInfo.setActivity(activity),
                        () -> log.info("An User not known as attempted to change Activity!")
                );
        broadcastUsersStatus();
    }

}
