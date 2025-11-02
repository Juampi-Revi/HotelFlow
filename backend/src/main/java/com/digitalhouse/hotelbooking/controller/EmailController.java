package com.digitalhouse.hotelbooking.controller;

import com.digitalhouse.hotelbooking.dto.response.EmailResponseDTO;
import com.digitalhouse.hotelbooking.model.User;
import com.digitalhouse.hotelbooking.repository.UserRepository;
import com.digitalhouse.hotelbooking.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5180"})
public class EmailController {
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/resend-confirmation")
    public ResponseEntity<?> resendConfirmationEmail(@RequestParam String email) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new EmailResponseDTO(false, "User not found for the provided email", email));
            }
            
            User user = userOptional.get();
            
            EmailResponseDTO response = emailService.resendRegistrationConfirmationEmail(
                user.getEmail(), 
                user.getFirstName() + " " + user.getLastName()
            );
            
            if (response.isSent()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.internalServerError().body(response);
            }
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(EmailResponseDTO.failure(email, "Internal server error: " + e.getMessage()));
        }
    }
}