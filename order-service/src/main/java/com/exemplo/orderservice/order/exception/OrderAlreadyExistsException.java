package com.exemplo.orderservice.order.exception;

public class OrderAlreadyExistsException extends RuntimeException {
    public OrderAlreadyExistsException(String id) {
        super("Ordem com id " + id + " ja existe");
    }
}
