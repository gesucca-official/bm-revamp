package com.gsc.bm.conf.ws;

import com.gsc.bm.service.session.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

@Component
public class AuthChannelInterceptorAdapter implements org.springframework.messaging.support.ExecutorChannelInterceptor {

    private final AuthService authService;
    private final ActiveSessions sessions;
    private final DestinationPolicy policy;

    @Autowired
    public AuthChannelInterceptorAdapter(AuthService authService, ActiveSessions sessions, DestinationPolicy policy) {
        this.authService = authService;
        this.sessions = sessions;
        this.policy = policy;
    }

    @Override
    public Message<?> beforeHandle(Message<?> message, MessageChannel channel, org.springframework.messaging.MessageHandler handler) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        if (accessor.getCommand() == StompCommand.SEND || accessor.getCommand() == StompCommand.SUBSCRIBE) {
            if (accessor.getUser() == null) {
                throw new org.springframework.security.access.AccessDeniedException("Stale session");
            }
            sessions.beginCommand(accessor.getUser().getName(), accessor.getSessionId());
        }
        return message;
    }

    @Override
    public void afterMessageHandled(Message<?> message, MessageChannel channel,
                                    org.springframework.messaging.MessageHandler handler, Exception failure) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        if (accessor.getCommand() == StompCommand.SEND || accessor.getCommand() == StompCommand.SUBSCRIBE) {
            sessions.endCommand();
        }
    }

    @Override
    public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) throws AuthenticationException {
        final StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor == null) { throw new org.springframework.security.access.AccessDeniedException("Invalid frame"); }
        if (StompCommand.CONNECT == accessor.getCommand()) {
            final String username = accessor.getLogin();
            final String password = accessor.getPasscode();
            accessor.setNativeHeader("passcode", null);
            try {
                final UsernamePasswordAuthenticationToken user = authService.getAuthTokenOrFail(username, password);
                sessions.claim(user.getName(), accessor.getSessionId());
                accessor.setUser(user);
            } catch (AuthenticationException e) {
                throw new org.springframework.security.access.AccessDeniedException("Authentication failed");
            }
        } else if (accessor.getCommand() == StompCommand.SEND || accessor.getCommand() == StompCommand.SUBSCRIBE) {
            var user = accessor.getUser();
            if (user == null || !sessions.owns(user.getName(), accessor.getSessionId())) {
                throw new org.springframework.security.access.AccessDeniedException("Authentication required");
            }
            policy.check(user.getName(), accessor.getDestination(), accessor.getCommand() == StompCommand.SUBSCRIBE, message.getPayload());
        }
        return message;
    }
}
