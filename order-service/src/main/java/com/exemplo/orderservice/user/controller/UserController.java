package com.exemplo.orderservice.user.controller;

import com.exemplo.orderservice.shared.exception.ErrorResponse;
import com.exemplo.orderservice.user.dto.CreateUserRequest;
import com.exemplo.orderservice.user.dto.CreateUserResponse;
import com.exemplo.orderservice.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "Operacoes de cadastro de usuario")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @SecurityRequirements
    @Operation(summary = "Cria um novo usuario")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Usuario criado"),
            @ApiResponse(responseCode = "400", description = "Payload invalido",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Login ja em uso",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<CreateUserResponse> create(@Valid @RequestBody CreateUserRequest request) {
        CreateUserResponse response = userService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
