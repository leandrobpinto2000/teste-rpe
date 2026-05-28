package com.exemplo.orderservice.shared.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class JwtService {

    private final JwtProperties properties;
    private final SecretKey secretKey;

    public JwtService(JwtProperties properties) {
        this.properties = properties;
        this.secretKey = Keys.hmacShaKeyFor(properties.secret().getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String subject, Collection<String> roles) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(properties.expiration());

        return Jwts.builder()
                .issuer(properties.issuer())
                .subject(subject)
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .claims(Map.of("roles", List.copyOf(roles)))
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }

    public Claims parse(String token) throws JwtException {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public long expirationSeconds() {
        return properties.expiration();
    }
}
