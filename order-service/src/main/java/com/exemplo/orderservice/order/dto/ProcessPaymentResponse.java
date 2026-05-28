package com.exemplo.orderservice.order.dto;

import com.exemplo.orderservice.order.model.OrderStatus;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.OffsetDateTime;

public record ProcessPaymentResponse(
        @JsonProperty("status") OrderStatus status,
        @JsonProperty("data_pagamento") OffsetDateTime dataPagamento
) {}
