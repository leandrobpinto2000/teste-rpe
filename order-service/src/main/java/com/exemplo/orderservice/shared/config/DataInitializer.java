package com.exemplo.orderservice.shared.config;

import com.exemplo.orderservice.user.model.Role;
import com.exemplo.orderservice.user.model.User;
import com.exemplo.orderservice.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

@Component
public class DataInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private static final String DEFAULT_ADMIN_LOGIN = "admin";
    private static final String DEFAULT_ADMIN_PASSWORD = "123";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.existsByLogin(DEFAULT_ADMIN_LOGIN)) {
            log.info("Usuario padrao ja existe login={}", DEFAULT_ADMIN_LOGIN);
            return;
        }

        User admin = User.builder()
                .id(UUID.randomUUID())
                .login(DEFAULT_ADMIN_LOGIN)
                .password(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD))
                .createdAt(OffsetDateTime.now())
                .roles(Set.of(Role.ROLE_ADMIN, Role.ROLE_ORDER_CREATOR))
                .build();

        userRepository.save(admin);
        log.info("Usuario padrao criado login={} (senha: {})", DEFAULT_ADMIN_LOGIN, DEFAULT_ADMIN_PASSWORD);
    }
}
