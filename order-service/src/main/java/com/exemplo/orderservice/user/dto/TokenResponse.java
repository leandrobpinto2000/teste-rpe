package com.exemplo.orderservice.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Token JWT emitido apos login")
public record TokenResponse(

        @Schema(description = "JWT a ser enviado no header Authorization: Bearer <token>")
        String accessToken,

        @Schema(example = "Bearer")
        String tokenType,

        @Schema(description = "Tempo de expiracao em segundos", example = "3600")
        long expiresIn
) {

    public static TokenResponse bearer(String accessToken, long expiresIn) {
        return new TokenResponse(accessToken, "Bearer", expiresIn);
    }
}
