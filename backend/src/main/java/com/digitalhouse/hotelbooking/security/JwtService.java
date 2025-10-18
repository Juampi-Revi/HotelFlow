package com.digitalhouse.hotelbooking.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.digitalhouse.hotelbooking.model.User;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
public class JwtService {

    private final String secret;
    private final String issuer;
    private final int expirationMinutes;

    public JwtService(
            @Value("${security.jwt.secret}") String secret,
            @Value("${security.jwt.issuer}") String issuer,
            @Value("${security.jwt.expirationMinutes}") int expirationMinutes
    ) {
        this.secret = secret;
        this.issuer = issuer;
        this.expirationMinutes = expirationMinutes;
    }

    public String generateToken(User user) {
        Instant now = Instant.now();
        Algorithm algorithm = Algorithm.HMAC256(secret);
        String[] roles = user.getRoles().stream().map(Enum::name).toArray(String[]::new);
        String[] permissions = (user.getPermissions() == null)
                ? new String[0]
                : user.getPermissions().stream().map(Enum::name).toArray(String[]::new);

        return JWT.create()
                .withIssuer(issuer)
                .withIssuedAt(Date.from(now))
                .withExpiresAt(Date.from(now.plus(expirationMinutes, ChronoUnit.MINUTES)))
                .withSubject(user.getId().toString())
                .withClaim("email", user.getEmail())
                .withClaim("firstName", user.getFirstName())
                .withClaim("lastName", user.getLastName())
                .withArrayClaim("roles", roles)
                .withArrayClaim("permissions", permissions)
                .sign(algorithm);
    }

    public DecodedJWT validate(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secret);
        return JWT.require(algorithm)
                .withIssuer(issuer)
                .build()
                .verify(token);
    }
}