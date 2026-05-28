package com.exemplo.orderservice.user.service;

import com.exemplo.orderservice.user.dto.CreateUserRequest;
import com.exemplo.orderservice.user.dto.CreateUserResponse;
import com.exemplo.orderservice.user.exception.UserAlreadyExistsException;
import com.exemplo.orderservice.user.model.Role;
import com.exemplo.orderservice.user.model.User;
import com.exemplo.orderservice.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void deveCadastrarUsuarioComSenhaEncriptadaERoleDefault() {
        CreateUserRequest request = new CreateUserRequest("joao", "Senha@123");

        when(userRepository.existsByLogin("joao")).thenReturn(false);
        when(passwordEncoder.encode("Senha@123")).thenReturn("ENCODED");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        CreateUserResponse response = userService.create(request);

        assertThat(response.login()).isEqualTo("joao");
        assertThat(response.id()).isNotNull();
        assertThat(response.roles()).containsExactly("ROLE_ORDER_CREATOR");

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        User saved = captor.getValue();
        assertThat(saved.getPassword()).isEqualTo("ENCODED");
        assertThat(saved.getRoles()).containsExactly(Role.ROLE_ORDER_CREATOR);
    }

    @Test
    void deveLancarExceptionQuandoLoginJaExiste() {
        CreateUserRequest request = new CreateUserRequest("joao", "Senha@123");
        when(userRepository.existsByLogin("joao")).thenReturn(true);

        assertThatThrownBy(() -> userService.create(request))
                .isInstanceOf(UserAlreadyExistsException.class);

        verify(userRepository, never()).save(any());
    }
}
