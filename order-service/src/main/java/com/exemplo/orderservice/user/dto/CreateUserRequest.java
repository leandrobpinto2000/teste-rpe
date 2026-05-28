package com.exemplo.orderservice.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Schema(description = "Payload para criacao de um novo usuario")
public record CreateUserRequest(

        @Schema(example = "joao.silva", description = "Login unico do usuario")
        @NotBlank(message = "login e obrigatorio")
        @Size(min = 3, max = 100, message = "login deve ter entre 3 e 100 caracteres")
        String login,

        @Schema(example = "MinhaSenh@123", description = "Senha forte (min 8, 1 letra, 1 numero)")
        @NotBlank(message = "senha e obrigatoria")
        @Size(min = 8, max = 100, message = "senha deve ter entre 8 e 100 caracteres")
        @Pattern(
                regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
                message = "senha deve conter ao menos uma letra e um numero"
        )
        String senha
) {
}
