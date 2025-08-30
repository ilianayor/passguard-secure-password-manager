package com.secure.passguard.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String resetUrl) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset Request");

        String body = """
                Hello,

                We received a request to reset your password. 
                If this was you, please click the secure link below to set a new password:

                %s

                For your security, this link will expire in 24 hours. 
                If you did not request a password reset, please ignore this email.

                Do not share this link with anyone. Only use it to reset your password securely.

                Best regards,
                The PassGuard Team
                """.formatted(resetUrl);

        message.setText(body);
        mailSender.send(message);
    }
}
