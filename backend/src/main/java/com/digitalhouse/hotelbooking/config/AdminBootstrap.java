package com.digitalhouse.hotelbooking.config;

import com.digitalhouse.hotelbooking.model.User;
import com.digitalhouse.hotelbooking.model.enums.Role;
import com.digitalhouse.hotelbooking.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
public class AdminBootstrap {

    @Bean
    public CommandLineRunner createDefaultAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String email = "admin@hotelflow.local";
            if (!userRepository.existsByEmail(email)) {
                User admin = new User();
                admin.setFirstName("Default");
                admin.setLastName("Admin");
                admin.setEmail(email);
                admin.setPasswordHash(passwordEncoder.encode("Admin123!"));
                admin.setIsActive(true);
                admin.setRoles(Set.of(Role.OWNER, Role.ADMIN, Role.USER));
                userRepository.save(admin);
            }
        };
    }
}