package com.exemplo.orderservice.order.controller;

import com.exemplo.orderservice.order.dto.CreateOrderRequest;
import com.exemplo.orderservice.order.dto.CreateOrderResponse;
import com.exemplo.orderservice.order.dto.OrderStatusResponse;
import com.exemplo.orderservice.order.service.OrderService;
import com.exemplo.orderservice.shared.exception.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "Gerenciamento de ordens")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ORDER_CREATOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Cria uma nova ordem de servico")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Ordem criada"),
            @ApiResponse(responseCode = "400", description = "Payload invalido",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Token ausente ou invalido",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Sem permissao",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Ordem ja existe",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<CreateOrderResponse> create(@Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.create(request));
    }

    @GetMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Lista ordens de um comprador pelo CPF")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de ordens"),
            @ApiResponse(responseCode = "401", description = "Token ausente ou invalido",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<List<OrderStatusResponse>> listByCpf(
            @Parameter(description = "CPF do comprador", required = true)
            @RequestParam("cpf_comprador") String cpfComprador) {
        return ResponseEntity.ok(orderService.findByCpf(cpfComprador));
    }
}
