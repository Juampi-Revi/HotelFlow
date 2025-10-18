package com.digitalhouse.hotelbooking.security;

import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                DecodedJWT jwt = jwtService.validate(token);
                List<String> roles = jwt.getClaim("roles").asList(String.class);
                List<String> perms = jwt.getClaim("permissions").asList(String.class);

                var authorities = new java.util.ArrayList<org.springframework.security.core.GrantedAuthority>();
                if (roles != null && !roles.isEmpty()) {
                    authorities.addAll(
                            roles.stream()
                                    .map(r -> new SimpleGrantedAuthority("ROLE_" + r))
                                    .collect(Collectors.toList())
                    );
                }
                if (perms != null && !perms.isEmpty()) {
                    authorities.addAll(
                            perms.stream()
                                    .map(SimpleGrantedAuthority::new)
                                    .collect(Collectors.toList())
                    );
                }

                if (!authorities.isEmpty()) {
                    // Prefer email as principal for service lookups
                    String principal = jwt.getClaim("email").asString();
                    if (principal == null || principal.isBlank()) {
                        principal = jwt.getSubject();
                    }
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            principal, null, authorities);
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception ignored) {
            }
        }
        filterChain.doFilter(request, response);
    }
}