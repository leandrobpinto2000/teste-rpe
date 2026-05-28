package com.exemplo.orderservice.user.exception;

public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException() {
        super("Credenciais invalidas");
    }
}
