package com.exemplo.orderservice.order.dto;

import com.exemplo.orderservice.order.model.PaymentMethod;
import com.exemplo.orderservice.shared.validation.Cpf;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateOrderRequest(

        @NotNull(message = "id e obrigatorio")
        UUID id,

        @NotNull(message = "id_item e obrigatorio")
        UUID idItem,

        @NotNull(message = "valor e obrigatorio")
        @DecimalMin(value = "0.01", message = "valor deve ser maior que zero")
        BigDecimal valor,

        @NotNull(message = "meio_pagamento e obrigatorio")
        PaymentMethod meioPagamento,

        @NotBlank(message = "nome_comprador e obrigatorio")
        @Size(min = 4, message = "nome_comprador deve ter mais de 3 caracteres")
        String nomeComprador,

        @NotBlank(message = "cpf_comprador e obrigatorio")
        @Cpf
        String cpfComprador
) {}
