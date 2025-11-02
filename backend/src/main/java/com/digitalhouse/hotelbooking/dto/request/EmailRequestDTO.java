package com.digitalhouse.hotelbooking.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class EmailRequestDTO {
    
    @NotBlank(message = "El email del destinatario es obligatorio")
    @Email(message = "El formato del email no es válido")
    private String to;
    
    @NotBlank(message = "El asunto del email es obligatorio")
    private String subject;
    
    @NotBlank(message = "El nombre del usuario es obligatorio")
    private String userName;
    
    private String templateName;
    
    // Constructors
    public EmailRequestDTO() {}
    
    public EmailRequestDTO(String to, String subject, String userName, String templateName) {
        this.to = to;
        this.subject = subject;
        this.userName = userName;
        this.templateName = templateName;
    }
    
    // Getters and Setters
    public String getTo() {
        return to;
    }
    
    public void setTo(String to) {
        this.to = to;
    }
    
    public String getSubject() {
        return subject;
    }
    
    public void setSubject(String subject) {
        this.subject = subject;
    }
    
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public String getTemplateName() {
        return templateName;
    }
    
    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }
}