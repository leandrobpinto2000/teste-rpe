package com.exemplo.orderservice.user.service;

import com.exemplo.orderservice.shared.security.JwtService;
import com.exemplo.orderservice.user.dto.LoginRequest;
import com.exemplo.orderservice.user.dto.TokenResponse;
import com.exemplo.orderservice.user.exception.InvalidCredentialsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public TokenResponse login(LoginRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.login(), request.senha())
            );

            List<String> roles = auth.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();

            String token = jwtService.generateToken(auth.getName(), roles);
            log.info("Login efetuado login={}", auth.getName());

            return TokenResponse.bearer(token, jwtService.expirationSeconds());
        } catch (AuthenticationException ex) {
            log.warn("Falha de autenticacao login={} motivo={}", request.login(), ex.getClass().getSimpleName());
            throw new InvalidCredentialsException();
        }
    }
}
