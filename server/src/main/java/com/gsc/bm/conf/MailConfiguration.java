package com.gsc.bm.conf;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import javax.mail.internet.MimeMessage;

@Configuration
public class MailConfiguration {
    @Bean
    @ConditionalOnProperty(name = "app.mail.enabled", havingValue = "false", matchIfMissing = true)
    public JavaMailSender disabledMailSender() {
        return new JavaMailSenderImpl() {
            @Override
            protected void doSend(MimeMessage[] messages, Object[] originals) {
                throw new MailSendException("Email is disabled; configure app.mail.enabled and SMTP explicitly");
            }
        };
    }
}
