package com.exemplo.orderservice.user.controller;

import com.exemplo.orderservice.shared.exception.GlobalExceptionHandler;
import com.exemplo.orderservice.user.dto.CreateUserRequest;
import com.exemplo.orderservice.user.dto.CreateUserResponse;
import com.exemplo.orderservice.user.exception.UserAlreadyExistsException;
import com.exemplo.orderservice.user.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class UserControllerTest {

    private MockMvc mockMvc;
    private UserService userService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        userService = Mockito.mock(UserService.class);
        UserController controller = new UserController(userService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void deveRetornar201NoHappyPath() throws Exception {
        UUID id = UUID.randomUUID();
        when(userService.create(any())).thenReturn(
                new CreateUserResponse(id, "joao", OffsetDateTime.now(), Set.of("ROLE_ORDER_CREATOR"))
        );

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreateUserRequest("joao", "Senha@123"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(id.toString()))
                .andExpect(jsonPath("$.login").value("joao"));
    }

    @Test
    void deveRetornar400EmPayloadInvalido() throws Exception {
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreateUserRequest("", "123"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.statusCode").value(400))
                .andExpect(jsonPath("$.fields").isArray());
    }

    @Test
    void deveRetornar409QuandoLoginDuplicado() throws Exception {
        when(userService.create(any())).thenThrow(new UserAlreadyExistsException("joao"));

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreateUserRequest("joao", "Senha@123"))))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.statusCode").value(409));
    }
}
