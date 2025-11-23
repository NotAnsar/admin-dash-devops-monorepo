package org.example.api.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender emailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public boolean sendPasswordResetEmail(String toEmail, String token) {
        try {
            String resetLink = frontendUrl + "/auth/update-password?token=" + token;


            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Password Reset Request");
            message.setText("To reset your password, click the link below:\n\n" + resetLink +
                    "\n\nIf you did not request a password reset, please ignore this email." +
                    "\n\nThis link will expire in 1 hour.");

            emailSender.send(message);
            log.info("Password reset email sent to: {}", toEmail);
            return true;
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", toEmail, e);
            return false;
        }
    }
}