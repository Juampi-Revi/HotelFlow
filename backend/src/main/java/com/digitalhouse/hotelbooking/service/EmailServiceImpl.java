package com.digitalhouse.hotelbooking.service;

import com.digitalhouse.hotelbooking.dto.request.EmailRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.EmailResponseDTO;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${app.notifications.ownerEmail:}")
    private String ownerEmail;
    
    @Override
    public EmailResponseDTO sendRegistrationConfirmationEmail(EmailRequestDTO emailRequest) {
        try {
            String htmlContent = buildRegistrationConfirmationHtml(emailRequest.getUserName(), emailRequest.getTo());
            String textContent = buildRegistrationConfirmationText(emailRequest.getUserName(), emailRequest.getTo());
            
            return sendEmail(emailRequest.getTo(), emailRequest.getSubject(), htmlContent, textContent);
            
        } catch (Exception e) {
            logger.error("Error sending registration confirmation email to {}: {}", 
                        emailRequest.getTo(), e.getMessage());
            return EmailResponseDTO.failure(emailRequest.getTo(), e.getMessage());
        }
    }
    
    @Override
    public EmailResponseDTO resendRegistrationConfirmationEmail(String userEmail, String userName) {
        EmailRequestDTO emailRequest = new EmailRequestDTO(
            userEmail,
            "¡Bienvenido a HotelFlow! - Confirmación de Registro",
            userName,
            "registration-confirmation"
        );
        
        return sendRegistrationConfirmationEmail(emailRequest);
    }
    
    @Override
    public EmailResponseDTO sendEmail(String to, String subject, String htmlContent, String textContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            if (ownerEmail != null && !ownerEmail.isBlank() && !ownerEmail.equalsIgnoreCase(to)) {
                helper.addCc(ownerEmail);
            }
            helper.setSubject(subject);
            helper.setText(textContent, htmlContent);
            
            mailSender.send(message);
            
            logger.info("Email sent successfully to: {}", to);
            return EmailResponseDTO.success(to);
            
        } catch (MessagingException e) {
            logger.error("Error sending email to {}: {}", to, e.getMessage());
            return EmailResponseDTO.failure(to, e.getMessage());
        }
    }
    
    private String buildRegistrationConfirmationHtml(String userName, String userEmail) {
        return String.format("""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to HotelFlow</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Welcome to HotelFlow</h1>
                    <p>Your account has been created successfully.</p>
                </div>
                <div class="content">
                    <h2>Hello %s,</h2>
                    <p>We created your account using the email <strong>%s</strong>.</p>
                    <p>You can sign in using the following link:</p>
                    <a class="button" href="%s/login" target="_blank" rel="noopener">Go to Login</a>
                    <p>If you did not receive the email or need to resend it, use the "Resend Confirmation" option on the registration page.</p>
                </div>
                <div class="footer">
                    <p>If you have questions, simply reply to this email.</p>
                    <p>&copy; HotelFlow</p>
                </div>
            </body>
            </html>
            """, userName, userEmail, frontendUrl);
    }
    
    private String buildRegistrationConfirmationText(String userName, String userEmail) {
        return String.format("Hello %s,\n\nYour account has been created successfully with email %s.\nSign in: %s/login\nIf you need to resend the confirmation email, use the 'Resend Confirmation' option on the registration page.\n\nHotelFlow Team", 
            userName, userEmail, frontendUrl);
    }
}