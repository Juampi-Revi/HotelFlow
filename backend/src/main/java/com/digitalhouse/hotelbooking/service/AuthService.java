package com.digitalhouse.hotelbooking.service;

import com.digitalhouse.hotelbooking.dto.request.LoginRequestDTO;
import com.digitalhouse.hotelbooking.dto.request.RegisterRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.AuthResponseDTO;
import com.digitalhouse.hotelbooking.dto.response.UserResponseDTO;
import com.digitalhouse.hotelbooking.exception.DuplicateEmailException;
import com.digitalhouse.hotelbooking.exception.InvalidCredentialsException;
import com.digitalhouse.hotelbooking.model.User;
import com.digitalhouse.hotelbooking.repository.UserRepository;
import com.digitalhouse.hotelbooking.security.JwtService;
import com.digitalhouse.hotelbooking.model.enums.Role;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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