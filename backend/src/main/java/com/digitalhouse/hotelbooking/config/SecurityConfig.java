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
                        .requestMatchers("/actuator/health", "/actuator/health/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/email/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/rooms/**", "/api/categories/**", "/api/features/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/rooms/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_OWNER", "ROOMS_CREATE")
                        .requestMatchers(HttpMethod.PUT, "/api/rooms/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_OWNER", "ROOMS_EDIT")
                        .requestMatchers(HttpMethod.POST, "/api/categories/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_OWNER", "CATEGORIES_CREATE")
                        .requestMatchers(HttpMethod.PUT, "/api/categories/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_OWNER", "CATEGORIES_EDIT")
                        .requestMatchers(HttpMethod.POST, "/api/features/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_OWNER", "FEATURES_CREATE")
                        .requestMatchers(HttpMethod.PUT, "/api/features/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_OWNER", "FEATURES_EDIT")
                        .requestMatchers(HttpMethod.DELETE, "/api/rooms/**", "/api/categories/**", "/api/features/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_OWNER")
                        .requestMatchers("/api/favorites/**").authenticated()
                        .requestMatchers("/api/admin/users/**").hasAuthority("ROLE_OWNER")
                        .requestMatchers("/api/admin/bookings/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_OWNER")
                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_OWNER")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
