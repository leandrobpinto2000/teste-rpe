package com.exemplo.orderservice.user.mapper;

import com.exemplo.orderservice.user.dto.CreateUserResponse;
import com.exemplo.orderservice.user.model.Role;
import com.exemplo.orderservice.user.model.User;

import java.util.stream.Collectors;

public final class UserMapper {

    private UserMapper() {
    }

    public static CreateUserResponse toCreateResponse(User user) {
        return new CreateUserResponse(
                user.getId(),
                user.getLogin(),
                user.getCreatedAt(),
                user.getRoles().stream().map(Role::name).collect(Collectors.toSet())
        );
    }
}
