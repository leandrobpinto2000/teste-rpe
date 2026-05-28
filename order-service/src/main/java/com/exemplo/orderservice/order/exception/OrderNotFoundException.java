package com.exemplo.orderservice.order.exception;

import java.util.UUID;

public class OrderNotFoundException extends RuntimeException {
    public OrderNotFoundException(UUID id) {
        super("Ordem nao encontrada: " + id);
    }
}
