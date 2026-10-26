package com.gsc.bm;

import com.gsc.bm.conf.ws.SubscriptionReceiptInterceptor;
import org.junit.jupiter.api.Test;
import org.springframework.messaging.*;
import org.springframework.messaging.simp.broker.SimpleBrokerMessageHandler;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.messaging.simp.user.UserDestinationMessageHandler;
import org.springframework.messaging.support.MessageBuilder;
import org.mockito.ArgumentCaptor;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SubscriptionReceiptTest {
    Message<?> subscribe(String destination) {
        var h = StompHeaderAccessor.create(StompCommand.SUBSCRIBE);
        h.setSessionId("alice-session"); h.setSubscriptionId("sub");
        h.setDestination(destination); h.setReceipt("ready");
        return MessageBuilder.createMessage(new byte[0], h.getMessageHeaders());
    }
    @Test void confirmsOnlyAfterTheHandlerThatRegistersTheSubscription() {
        var outbound = mock(MessageChannel.class);
        var interceptor = new SubscriptionReceiptInterceptor(outbound);
        var broker = mock(SimpleBrokerMessageHandler.class);
        var users = mock(UserDestinationMessageHandler.class);
        var message = subscribe("/user/queue/account/data");
        interceptor.afterMessageHandled(message, null, broker, null);
        verifyNoInteractions(outbound);
        interceptor.afterMessageHandled(message, null, users, null);
        var capture = ArgumentCaptor.forClass(Message.class);
        verify(outbound).send(capture.capture());
        var receipt = StompHeaderAccessor.wrap(capture.getValue());
        assertEquals(StompCommand.RECEIPT, receipt.getCommand());
        assertEquals("alice-session", receipt.getSessionId());
        assertEquals("ready", receipt.getReceiptId());
    }
    @Test void topicReceiptRequiresSuccessfulBrokerRegistration() {
        var outbound = mock(MessageChannel.class);
        var interceptor = new SubscriptionReceiptInterceptor(outbound);
        var broker = mock(SimpleBrokerMessageHandler.class);
        var message = subscribe("/topic/connections/users");
        interceptor.afterMessageHandled(message, null, broker, new IllegalStateException());
        interceptor.afterMessageHandled(message, null, mock(UserDestinationMessageHandler.class), null);
        verifyNoInteractions(outbound);
        interceptor.afterMessageHandled(message, null, broker, null);
        verify(outbound).send(any());
    }
}
