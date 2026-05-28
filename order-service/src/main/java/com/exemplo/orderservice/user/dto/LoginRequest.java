package com.exemplo.orderservice.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Payload para autenticacao")
public record LoginRequest(

        @Schema(example = "joao.silva")
        @NotBlank(message = "login e obrigatorio")
        String login,

        @Schema(example = "MinhaSenh@123")
        @NotBlank(message = "senha e obrigatoria")
        String senha
) {
}
