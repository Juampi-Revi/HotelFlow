package com.digitalhouse.hotelbooking.service;

import com.digitalhouse.hotelbooking.dto.request.EmailRequestDTO;
import com.digitalhouse.hotelbooking.dto.request.LoginRequestDTO;
import com.digitalhouse.hotelbooking.dto.request.RegisterRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.AuthResponseDTO;
import com.digitalhouse.hotelbooking.dto.response.EmailResponseDTO;
import com.digitalhouse.hotelbooking.dto.response.UserResponseDTO;
import com.digitalhouse.hotelbooking.exception.DuplicateEmailException;
import com.digitalhouse.hotelbooking.exception.InvalidCredentialsException;
import com.digitalhouse.hotelbooking.model.User;
import com.digitalhouse.hotelbooking.repository.UserRepository;
import com.digitalhouse.hotelbooking.security.JwtService;
import com.digitalhouse.hotelbooking.model.enums.Role;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                      JwtService jwtService, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    @Transactional
    public UserResponseDTO register(RegisterRequestDTO request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateEmailException("Email already registered");
        }

        User user = new User();
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setIsActive(true);
        user.setRoles(java.util.Set.of(Role.USER));

        User saved = userRepository.save(user);

        // Enviar email de confirmación de registro
        try {
            String fullName = saved.getFirstName() + " " + saved.getLastName();
            EmailRequestDTO emailRequest = new EmailRequestDTO(
                saved.getEmail(),
                "Welcome to HotelFlow - Registration Confirmation",
                fullName,
                "registration-confirmation"
            );
            
            EmailResponseDTO emailResponse = emailService.sendRegistrationConfirmationEmail(emailRequest);
            
            if (emailResponse.isSent()) {
                logger.info("Registration confirmation email sent successfully to: {}", saved.getEmail());
            } else {
                logger.warn("Failed to send registration confirmation email to: {}. Error: {}",
                           saved.getEmail(), emailResponse.getMessage());
            }
        } catch (Exception e) {
            logger.error("Error sending registration confirmation email for user {}: {}",
                        saved.getEmail(), e.getMessage());
            // No lanzamos excepción para no afectar el registro del usuario
        }

        return new UserResponseDTO(
                saved.getId(),
                saved.getFirstName(),
                saved.getLastName(),
                saved.getEmail(),
                saved.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
    public AuthResponseDTO authenticate(LoginRequestDTO request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
        if (!passwordMatches || Boolean.FALSE.equals(user.getIsActive())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                token,
                user.getRoles() != null ?
                        user.getRoles().stream().map(Role::name).collect(java.util.stream.Collectors.toList()) :
                        java.util.Collections.emptyList()
        );
    }
}