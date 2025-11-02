package com.digitalhouse.hotelbooking.dto.response;

import java.time.LocalDateTime;

public class EmailResponseDTO {
    
    private boolean sent;
    private String message;
    private String recipientEmail;
    private LocalDateTime sentAt;
    
    // Constructors
    public EmailResponseDTO() {}
    
    public EmailResponseDTO(boolean sent, String message, String recipientEmail) {
        this.sent = sent;
        this.message = message;
        this.recipientEmail = recipientEmail;
        this.sentAt = sent ? LocalDateTime.now() : null;
    }
    
    // Static factory methods
    public static EmailResponseDTO success(String recipientEmail) {
        return new EmailResponseDTO(true, "Email de confirmación enviado exitosamente", recipientEmail);
    }
    
    public static EmailResponseDTO failure(String recipientEmail, String errorMessage) {
        return new EmailResponseDTO(false, "Error al enviar email: " + errorMessage, recipientEmail);
    }
    
    // Getters and Setters
    public boolean isSent() {
        return sent;
    }
    
    public void setSent(boolean sent) {
        this.sent = sent;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getRecipientEmail() {
        return recipientEmail;
    }
    
    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }
    
    public LocalDateTime getSentAt() {
        return sentAt;
    }
    
    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
}