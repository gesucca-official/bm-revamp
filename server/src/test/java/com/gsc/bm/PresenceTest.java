package com.gsc.bm;
import com.gsc.bm.service.session.ConnectionsServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.web.socket.messaging.*;
import org.springframework.web.socket.CloseStatus;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
class PresenceTest {
    @Test void duplicateEventsAndDisconnectUseSessionIdentity() {
        var transport = mock(SimpMessagingTemplate.class);
        var presence = new ConnectionsServiceImpl(transport);
        var h = StompHeaderAccessor.create(StompCommand.CONNECT); h.setSessionId("session-a");
        var m = MessageBuilder.createMessage(new byte[0], h.getMessageHeaders());
        var event = new SessionConnectEvent(this, m, () -> "alice");
        presence.userConnected(event); presence.userConnected(event);
        h = StompHeaderAccessor.create(StompCommand.CONNECT); h.setSessionId("session-b");
        var b = MessageBuilder.createMessage(new byte[0], h.getMessageHeaders());
        presence.userConnected(new SessionConnectEvent(this, b, () -> "bob"));
        presence.userActivityChanged("alice", "Free");
        var capture = org.mockito.ArgumentCaptor.forClass(Object.class);
        verify(transport).convertAndSend(eq("/topic/connections/users"), capture.capture());
        String json;
        try { json = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(capture.getValue()); }
        catch (Exception e) { throw new RuntimeException(e); }
        assertFalse(json.contains("session-a")); assertFalse(json.contains("sessionId"));
        assertEquals(2, ((java.util.Collection<?>)capture.getValue()).size());
        var disconnect = new SessionDisconnectEvent(this, m, "session-a", CloseStatus.NORMAL);
        assertEquals("alice", presence.userDisconnected(disconnect));
        assertNull(presence.userDisconnected(disconnect));
        assertEquals(java.util.Set.of("bob"), presence.getAllConnectedUsers());
    }
}
