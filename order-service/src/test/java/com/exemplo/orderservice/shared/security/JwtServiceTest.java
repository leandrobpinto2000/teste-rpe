package com.exemplo.orderservice.shared.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {

    private static final String SECRET = "secret-de-256-bits-no-minimo-para-hs256-funcionar-okk";

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(new JwtProperties(SECRET, 3600L, "order-service"));
    }

    @Test
    void deveFazerRoundTripGenerateEParse() {
        String token = jwtService.generateToken("joao", List.of("ROLE_ORDER_CREATOR"));

        Claims claims = jwtService.parse(token);

        assertThat(claims.getSubject()).isEqualTo("joao");
        assertThat(claims.getIssuer()).isEqualTo("order-service");
        assertThat(claims.get("roles", List.class)).containsExactly("ROLE_ORDER_CREATOR");
    }

    @Test
    void deveRejeitarTokenExpirado() {
        JwtService curtaDuracao = new JwtService(new JwtProperties(SECRET, -10L, "order-service"));
        String expirado = curtaDuracao.generateToken("joao", List.of("ROLE_ORDER_CREATOR"));

        assertThatThrownBy(() -> jwtService.parse(expirado))
                .isInstanceOf(ExpiredJwtException.class);
    }

    @Test
    void deveRejeitarTokenComAssinaturaInvalida() {
        JwtService outro = new JwtService(new JwtProperties(
                "OUTRO-secret-tambem-com-256-bits-de-tamanho-suficiente-okk", 3600L, "order-service"));
        String tokenOutraChave = outro.generateToken("joao", List.of("ROLE_ORDER_CREATOR"));

        assertThatThrownBy(() -> jwtService.parse(tokenOutraChave))
                .isInstanceOf(SignatureException.class);
    }
}
