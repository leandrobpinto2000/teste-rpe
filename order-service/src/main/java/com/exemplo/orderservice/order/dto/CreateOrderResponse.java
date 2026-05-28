package com.exemplo.orderservice.order.dto;

import com.exemplo.orderservice.order.model.OrderStatus;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CreateOrderResponse(
        UUID id,
        OrderStatus status,
        OffsetDateTime dataCriacao
) {}
