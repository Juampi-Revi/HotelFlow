package com.digitalhouse.hotelbooking.service;

import com.digitalhouse.hotelbooking.dto.request.EmailRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.EmailResponseDTO;
import com.digitalhouse.hotelbooking.model.Booking;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
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
    public EmailResponseDTO sendBookingConfirmationEmail(Booking booking) {
        if (booking == null || booking.getUser() == null || booking.getRoom() == null) {
            return EmailResponseDTO.failure("", "Invalid booking data");
        }
        String to = booking.getUser().getEmail();
        String userName = (booking.getUser().getFirstName() == null ? "" : booking.getUser().getFirstName()) +
                (booking.getUser().getLastName() == null ? "" : " " + booking.getUser().getLastName());

        try {
            String subject = "Confirmación de reserva - HotelFlow";
            String htmlContent = buildBookingConfirmationHtml(userName.trim(), booking);
            String textContent = buildBookingConfirmationText(userName.trim(), booking);
            return sendEmail(to, subject, htmlContent, textContent);
        } catch (Exception e) {
            logger.error("Error sending booking confirmation email to {}: {}", to, e.getMessage());
            return EmailResponseDTO.failure(to, e.getMessage());
        }
    }
    
    @Override
    public EmailResponseDTO sendEmail(String to, String subject, String htmlContent, String textContent) {
        try {
            if (fromEmail == null || fromEmail.isBlank()) {
                return EmailResponseDTO.failure(to, "Email is not configured");
            }
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
        } catch (MailException e) {
            logger.error("Mail transport error to {}: {}", to, e.getMessage());
            return EmailResponseDTO.failure(to, e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error sending email to {}: {}", to, e.getMessage());
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

    private String buildBookingConfirmationHtml(String userName, Booking booking) {
        String hotelName = booking.getRoom().getHotelName() == null ? "Hotel" : booking.getRoom().getHotelName();
        String city = booking.getRoom().getCity() == null ? "" : booking.getRoom().getCity();
        String country = booking.getRoom().getCountry() == null ? "" : booking.getRoom().getCountry();
        String address = booking.getRoom().getAddress() == null ? "" : booking.getRoom().getAddress();
        String contact = (ownerEmail == null || ownerEmail.isBlank()) ? "-" : ownerEmail;
        String createdAt = booking.getCreatedAt() == null ? "-" : booking.getCreatedAt().toString();
        String checkIn = booking.getCheckInDate() == null ? "-" : booking.getCheckInDate().toString();
        String checkOut = booking.getCheckOutDate() == null ? "-" : booking.getCheckOutDate().toString();
        String guests = booking.getNumberOfGuests() == null ? "-" : booking.getNumberOfGuests().toString();
        String total = booking.getTotalPrice() == null ? "-" : booking.getTotalPrice().toString();
        String requests = booking.getSpecialRequests() == null || booking.getSpecialRequests().isBlank() ? "-" : booking.getSpecialRequests();

        return String.format("""
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Confirmación de reserva</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a; max-width: 640px; margin: 0 auto; padding: 20px; background: #f8fafc; }
                    .card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
                    .header { background: linear-gradient(135deg, #2563eb 0%%, #06b6d4 100%%); color: white; padding: 24px; }
                    .content { padding: 22px; }
                    .grid { width: 100%%; border-collapse: collapse; margin-top: 12px; }
                    .grid td { padding: 10px 0; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
                    .label { color: #475569; width: 40%%; }
                    .value { color: #0f172a; font-weight: 600; }
                    .footer { padding: 18px 22px; color: #64748b; font-size: 13px; background: #f8fafc; border-top: 1px solid #e2e8f0; }
                    a { color: #2563eb; }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="header">
                        <h1 style="margin:0; font-size: 22px;">Reserva confirmada</h1>
                        <p style="margin:6px 0 0;">%s, tu reserva se registró correctamente.</p>
                    </div>
                    <div class="content">
                        <table class="grid" role="presentation">
                            <tr><td class="label">Producto</td><td class="value">%s</td></tr>
                            <tr><td class="label">Ubicación</td><td class="value">%s%s%s</td></tr>
                            <tr><td class="label">Dirección</td><td class="value">%s</td></tr>
                            <tr><td class="label">Fecha y hora de la reserva</td><td class="value">%s</td></tr>
                            <tr><td class="label">Fechas</td><td class="value">%s → %s</td></tr>
                            <tr><td class="label">Huéspedes</td><td class="value">%s</td></tr>
                            <tr><td class="label">Total</td><td class="value">%s</td></tr>
                            <tr><td class="label">Peticiones especiales</td><td class="value">%s</td></tr>
                            <tr><td class="label">Contacto del proveedor</td><td class="value">%s</td></tr>
                        </table>
                        <p style="margin-top:16px; color:#334155;">
                            Podés ver más detalles desde la aplicación: <a href="%s/bookings" target="_blank" rel="noopener">Mis reservas</a>
                        </p>
                    </div>
                    <div class="footer">
                        Si tenés dudas, respondé este correo o contactanos.
                    </div>
                </div>
            </body>
            </html>
            """,
                userName,
                hotelName,
                city,
                (city.isBlank() || country.isBlank()) ? "" : ", ",
                country,
                address.isBlank() ? "-" : address,
                createdAt,
                checkIn,
                checkOut,
                guests,
                total,
                requests,
                contact,
                frontendUrl
        );
    }

    private String buildBookingConfirmationText(String userName, Booking booking) {
        String hotelName = booking.getRoom().getHotelName() == null ? "Hotel" : booking.getRoom().getHotelName();
        String city = booking.getRoom().getCity() == null ? "" : booking.getRoom().getCity();
        String country = booking.getRoom().getCountry() == null ? "" : booking.getRoom().getCountry();
        String address = booking.getRoom().getAddress() == null ? "" : booking.getRoom().getAddress();
        String contact = (ownerEmail == null || ownerEmail.isBlank()) ? "-" : ownerEmail;
        String createdAt = booking.getCreatedAt() == null ? "-" : booking.getCreatedAt().toString();
        String checkIn = booking.getCheckInDate() == null ? "-" : booking.getCheckInDate().toString();
        String checkOut = booking.getCheckOutDate() == null ? "-" : booking.getCheckOutDate().toString();
        String guests = booking.getNumberOfGuests() == null ? "-" : booking.getNumberOfGuests().toString();
        String total = booking.getTotalPrice() == null ? "-" : booking.getTotalPrice().toString();
        String requests = booking.getSpecialRequests() == null || booking.getSpecialRequests().isBlank() ? "-" : booking.getSpecialRequests();

        return String.format(
                "Hola %s,\n\nTu reserva se registró correctamente.\n\nProducto: %s\nUbicación: %s%s%s\nDirección: %s\nFecha y hora de la reserva: %s\nFechas: %s -> %s\nHuéspedes: %s\nTotal: %s\nPeticiones especiales: %s\nContacto del proveedor: %s\n\nVer mis reservas: %s/bookings\n\nHotelFlow",
                userName,
                hotelName,
                city,
                (city.isBlank() || country.isBlank()) ? "" : ", ",
                country,
                address.isBlank() ? "-" : address,
                createdAt,
                checkIn,
                checkOut,
                guests,
                total,
                requests,
                contact,
                frontendUrl
        );
    }
}
