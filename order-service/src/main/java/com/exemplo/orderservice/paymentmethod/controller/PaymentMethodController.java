package com.exemplo.orderservice.paymentmethod.controller;

import com.exemplo.orderservice.paymentmethod.dto.PaymentMethodResponse;
import com.exemplo.orderservice.paymentmethod.service.PaymentMethodService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
@Tag(name = "Payment Methods", description = "Listagem de meios de pagamento")
public class PaymentMethodController {

    private final PaymentMethodService service;

    public PaymentMethodController(PaymentMethodService service) {
        this.service = service;
    }

    @GetMapping
    @SecurityRequirements
    @Operation(summary = "Lista todos os meios de pagamento disponiveis")
    @ApiResponse(responseCode = "200", description = "Lista de meios de pagamento")
    public ResponseEntity<List<PaymentMethodResponse>> list() {
        return ResponseEntity.ok(service.listAll());
    }
}
