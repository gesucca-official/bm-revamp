package com.gsc.bm.conf.ws;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.*;
import org.springframework.messaging.simp.broker.SimpleBrokerMessageHandler;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.messaging.simp.user.UserDestinationMessageHandler;
import org.springframework.messaging.support.*;
import org.springframework.stereotype.Component;

/** Acknowledge SUBSCRIBE only after the synchronous simple broker registered it. */
@Component
public class SubscriptionReceiptInterceptor implements ExecutorChannelInterceptor {
    private final MessageChannel outbound;

    public SubscriptionReceiptInterceptor(@Lazy @Qualifier("clientOutboundChannel") MessageChannel outbound) {
        this.outbound = outbound;
    }

    @Override
    public void afterMessageHandled(Message<?> message, MessageChannel channel,
                                    MessageHandler handler, Exception failure) {
        var request = StompHeaderAccessor.wrap(message);
        if (failure != null || request.getCommand() != StompCommand.SUBSCRIBE
                || request.getReceipt() == null || request.getDestination() == null) return;
        // User destinations are translated and registered through brokerChannel
        // synchronously. The simple broker ignores their original /user frame.
        boolean userDestination = request.getDestination().startsWith("/user/");
        if (userDestination ? !(handler instanceof UserDestinationMessageHandler)
                            : !(handler instanceof SimpleBrokerMessageHandler)) return;
        var receipt = StompHeaderAccessor.create(StompCommand.RECEIPT);
        receipt.setSessionId(request.getSessionId());
        receipt.setReceiptId(request.getReceipt());
        outbound.send(MessageBuilder.createMessage(new byte[0], receipt.getMessageHeaders()));
    }
}
