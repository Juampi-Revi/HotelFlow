package com.digitalhouse.hotelbooking.service;

import com.digitalhouse.hotelbooking.dto.request.LoginRequestDTO;
import com.digitalhouse.hotelbooking.dto.request.RegisterRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.AuthResponseDTO;
import com.digitalhouse.hotelbooking.dto.response.UserResponseDTO;
import com.digitalhouse.hotelbooking.exception.DuplicateEmailException;
import com.digitalhouse.hotelbooking.exception.InvalidCredentialsException;
import com.digitalhouse.hotelbooking.model.User;
import com.digitalhouse.hotelbooking.model.enums.Role;
import com.digitalhouse.hotelbooking.repository.UserRepository;
import com.digitalhouse.hotelbooking.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private EmailService emailService;

    @InjectMocks
    private AuthService authService;

    private RegisterRequestDTO registerRequest;
    private LoginRequestDTO loginRequest;

    @BeforeEach
    void setup() {
        registerRequest = new RegisterRequestDTO();
        registerRequest.setFirstName("Juan");
        registerRequest.setLastName("Perez");
        registerRequest.setEmail("USER@Example.com");
        registerRequest.setPassword("Aa123456");

        loginRequest = new LoginRequestDTO();
        loginRequest.setEmail("user@example.com");
        loginRequest.setPassword("Aa123456");
    }

    @Test
    void register_success_createsUserAndReturnsDTO() {
        when(userRepository.existsByEmail("user@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Aa123456")).thenReturn("hashed");
        when(emailService.sendRegistrationConfirmationEmail(any())).thenReturn(com.digitalhouse.hotelbooking.dto.response.EmailResponseDTO.success("user@example.com"));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            // simulate DB assigned id
            java.lang.reflect.Field idField;
            try {
                idField = User.class.getDeclaredField("id");
                idField.setAccessible(true);
                idField.set(u, 1L);
            } catch (Exception ignored) {}
            return u;
        });

        UserResponseDTO response = authService.register(registerRequest);

        assertNotNull(response.getId());
        assertEquals("user@example.com", response.getEmail());
        assertEquals("Juan", response.getFirstName());
        assertEquals("Perez", response.getLastName());

        // verify saved user
        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        User saved = captor.getValue();
        assertEquals("user@example.com", saved.getEmail());
        assertEquals("hashed", saved.getPasswordHash());
        assertTrue(saved.getIsActive());
        assertTrue(saved.getRoles().contains(Role.USER));
    }

    @Test
    void register_duplicateEmail_throwsException() {
        when(userRepository.existsByEmail("user@example.com")).thenReturn(true);
        assertThrows(DuplicateEmailException.class, () -> authService.register(registerRequest));
    }

    @Test
    void authenticate_success_returnsToken() {
        User user = new User();
        user.setEmail("user@example.com");
        user.setPasswordHash("hashed");
        user.setIsActive(true);
        user.setRoles(Set.of(Role.USER));

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("Aa123456", "hashed")).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("token123");

        AuthResponseDTO auth = authService.authenticate(loginRequest);
        assertEquals("user@example.com", auth.getEmail());
        assertEquals("token123", auth.getToken());
        assertTrue(auth.getRoles().contains("USER"));
    }

    @Test
    void authenticate_invalidPassword_throwsException() {
        User user = new User();
        user.setEmail("user@example.com");
        user.setPasswordHash("hashed");
        user.setIsActive(true);

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("Aa123456", "hashed")).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> authService.authenticate(loginRequest));
    }
}