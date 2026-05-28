package com.exemplo.orderservice.order.dto;

import com.exemplo.orderservice.order.model.OrderStatus;

import java.util.UUID;

public record OrderStatusResponse(
        UUID id,
        String nomeComprador,
        OrderStatus status
) {}
