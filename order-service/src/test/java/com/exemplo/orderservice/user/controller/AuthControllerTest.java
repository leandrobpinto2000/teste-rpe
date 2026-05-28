package com.exemplo.orderservice.user.controller;

import com.exemplo.orderservice.shared.exception.GlobalExceptionHandler;
import com.exemplo.orderservice.user.dto.LoginRequest;
import com.exemplo.orderservice.user.dto.TokenResponse;
import com.exemplo.orderservice.user.exception.InvalidCredentialsException;
import com.exemplo.orderservice.user.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthControllerTest {

    private MockMvc mockMvc;
    private AuthService authService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        authService = Mockito.mock(AuthService.class);
        AuthController controller = new AuthController(authService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void deveRetornar200ComToken() throws Exception {
        when(authService.login(any())).thenReturn(TokenResponse.bearer("token-jwt", 3600L));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest("joao", "Senha@123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("token-jwt"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.expiresIn").value(3600));
    }

    @Test
    void deveRetornar401EmCredencialInvalida() throws Exception {
        when(authService.login(any())).thenThrow(new InvalidCredentialsException());

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest("joao", "errada"))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.statusCode").value(401));
    }
}
