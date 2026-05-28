package com.exemplo.orderservice.user.service;

import com.exemplo.orderservice.user.dto.CreateUserRequest;
import com.exemplo.orderservice.user.dto.CreateUserResponse;
import com.exemplo.orderservice.user.exception.UserAlreadyExistsException;
import com.exemplo.orderservice.user.mapper.UserMapper;
import com.exemplo.orderservice.user.model.Role;
import com.exemplo.orderservice.user.model.User;
import com.exemplo.orderservice.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public CreateUserResponse create(CreateUserRequest request) {
        if (userRepository.existsByLogin(request.login())) {
            throw new UserAlreadyExistsException(request.login());
        }

        User user = User.builder()
                .id(UUID.randomUUID())
                .login(request.login())
                .password(passwordEncoder.encode(request.senha()))
                .createdAt(OffsetDateTime.now())
                .roles(Set.of(Role.ROLE_ORDER_CREATOR))
                .build();

        User saved = userRepository.save(user);
        log.info("Usuario criado id={} login={}", saved.getId(), saved.getLogin());

        return UserMapper.toCreateResponse(saved);
    }
}
