package com.exemplo.orderservice.user.exception;

public class UserAlreadyExistsException extends RuntimeException {

    public UserAlreadyExistsException(String login) {
        super("Ja existe um usuario com o login '" + login + "'");
    }
}
