package com.exemplo.orderservice.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

@Schema(description = "Resposta do cadastro de usuario")
public record CreateUserResponse(
        UUID id,
        String login,
        OffsetDateTime createdAt,
        Set<String> roles
) {
}
