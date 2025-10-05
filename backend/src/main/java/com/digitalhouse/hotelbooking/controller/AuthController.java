package com.digitalhouse.hotelbooking.controller;

import com.digitalhouse.hotelbooking.dto.request.LoginRequestDTO;
import com.digitalhouse.hotelbooking.dto.request.RegisterRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.AuthResponseDTO;
import com.digitalhouse.hotelbooking.dto.response.UserResponseDTO;
import com.digitalhouse.hotelbooking.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        UserResponseDTO response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        AuthResponseDTO response = authService.authenticate(request);
        return ResponseEntity.ok(response);
    }
}