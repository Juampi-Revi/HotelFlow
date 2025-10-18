package com.digitalhouse.hotelbooking.config;

import com.digitalhouse.hotelbooking.security.JwtAuthenticationFilter;
import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/rooms/**", "/api/categories/**").permitAll()
                        // Create and edit guarded by specific roles or permissions
                        .requestMatchers(HttpMethod.POST, "/api/rooms/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_OWNER", "ROOMS_CREATE")
                        .requestMatchers(HttpMethod.PUT, "/api/rooms/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_OWNER", "ROOMS_EDIT")
                        .requestMatchers(HttpMethod.POST, "/api/categories/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_OWNER", "CATEGORIES_CREATE")
                        .requestMatchers(HttpMethod.PUT, "/api/categories/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_OWNER", "CATEGORIES_EDIT")
                        .requestMatchers(HttpMethod.DELETE, "/api/rooms/**", "/api/categories/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_OWNER")
                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_OWNER")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}