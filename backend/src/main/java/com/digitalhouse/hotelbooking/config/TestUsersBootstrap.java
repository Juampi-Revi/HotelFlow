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
public class TestUsersBootstrap {

    @Bean
    public CommandLineRunner createTestUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Usuarios normales para pruebas
            createIfMissing(userRepository, passwordEncoder,
                    "User", "One", "user1@hotelflow.local", "User123!", Set.of(Role.USER));
            createIfMissing(userRepository, passwordEncoder,
                    "User", "Two", "user2@hotelflow.local", "User123!", Set.of(Role.USER));
            createIfMissing(userRepository, passwordEncoder,
                    "User", "Three", "user3@hotelflow.local", "User123!", Set.of(Role.USER));
        };
    }

    private void createIfMissing(UserRepository repo, PasswordEncoder encoder,
                                 String firstName, String lastName, String email, String rawPassword, Set<Role> roles) {
        if (!repo.existsByEmail(email)) {
            User u = new User();
            u.setFirstName(firstName);
            u.setLastName(lastName);
            u.setEmail(email.trim().toLowerCase());
            u.setPasswordHash(encoder.encode(rawPassword));
            u.setIsActive(true);
            u.setRoles(roles);
            repo.save(u);
        }
    }
}