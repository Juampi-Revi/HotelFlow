package com.digitalhouse.hotelbooking.service;

import com.digitalhouse.hotelbooking.dto.request.EmailRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.EmailResponseDTO;
import com.digitalhouse.hotelbooking.model.Booking;

public interface EmailService {
    
    /**
     * Envía un email de confirmación de registro
     * @param emailRequest Datos del email a enviar
     * @return EmailResponseDTO con el resultado del envío
     */
    EmailResponseDTO sendRegistrationConfirmationEmail(EmailRequestDTO emailRequest);
    
    /**
     * Reenvía un email de confirmación de registro
     * @param userEmail Email del usuario al que reenviar
     * @param userName Nombre del usuario
     * @return EmailResponseDTO con el resultado del reenvío
     */
    EmailResponseDTO resendRegistrationConfirmationEmail(String userEmail, String userName);

    EmailResponseDTO sendBookingConfirmationEmail(Booking booking);
    
    /**
     * Envía un email genérico
     * @param to Destinatario
     * @param subject Asunto
     * @param htmlContent Contenido HTML
     * @param textContent Contenido de texto plano (fallback)
     * @return EmailResponseDTO con el resultado del envío
     */
    EmailResponseDTO sendEmail(String to, String subject, String htmlContent, String textContent);
}
