package com.exemplo.orderservice.user.service;

import com.exemplo.orderservice.shared.security.JwtService;
import com.exemplo.orderservice.user.dto.LoginRequest;
import com.exemplo.orderservice.user.dto.TokenResponse;
import com.exemplo.orderservice.user.exception.InvalidCredentialsException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void deveRetornarTokenParaCredenciaisValidas() {
        LoginRequest request = new LoginRequest("joao", "Senha@123");
        UsernamePasswordAuthenticationToken authenticated = new UsernamePasswordAuthenticationToken(
                "joao", null, List.of(new SimpleGrantedAuthority("ROLE_ORDER_CREATOR"))
        );

        when(authenticationManager.authenticate(any())).thenReturn(authenticated);
        when(jwtService.generateToken(eq("joao"), any())).thenReturn("token-jwt");
        when(jwtService.expirationSeconds()).thenReturn(3600L);

        TokenResponse response = authService.login(request);

        assertThat(response.accessToken()).isEqualTo("token-jwt");
        assertThat(response.tokenType()).isEqualTo("Bearer");
        assertThat(response.expiresIn()).isEqualTo(3600L);
    }

    @Test
    void deveLancarInvalidCredentialsQuandoAuthenticationFalha() {
        LoginRequest request = new LoginRequest("joao", "errada");
        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("bad"));

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class);
    }
}
