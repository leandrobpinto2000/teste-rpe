package com.exemplo.orderservice.shared.exception;

import com.exemplo.orderservice.order.exception.OrderAlreadyExistsException;
import com.exemplo.orderservice.order.exception.OrderNotFoundException;
import com.exemplo.orderservice.user.exception.InvalidCredentialsException;
import com.exemplo.orderservice.user.exception.UserAlreadyExistsException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.OffsetDateTime;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex,
                                                          HttpServletRequest request) {
        List<FieldErrorItem> fields = ex.getBindingResult().getFieldErrors().stream()
                .map(this::toFieldError)
                .toList();

        return build(HttpStatus.BAD_REQUEST, "Campos invalidos", request, fields);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleUserExists(UserAlreadyExistsException ex,
                                                          HttpServletRequest request) {
        return build(HttpStatus.CONFLICT, ex.getMessage(), request, null);
    }

    @ExceptionHandler(OrderAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleOrderExists(OrderAlreadyExistsException ex, HttpServletRequest request) {
        return build(HttpStatus.CONFLICT, ex.getMessage(), request, null);
    }

    @ExceptionHandler(OrderNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleOrderNotFound(OrderNotFoundException ex, HttpServletRequest request) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), request, null);
    }

    @ExceptionHandler({InvalidCredentialsException.class, BadCredentialsException.class, AuthenticationException.class})
    public ResponseEntity<ErrorResponse> handleAuthentication(Exception ex, HttpServletRequest request) {
        return build(HttpStatus.UNAUTHORIZED, "Credenciais invalidas", request, null);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        return build(HttpStatus.FORBIDDEN, "Acesso negado", request, null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex, HttpServletRequest request) {
        log.error("Erro nao tratado em {}", request.getRequestURI(), ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno inesperado", request, null);
    }

    private FieldErrorItem toFieldError(FieldError fe) {
        return new FieldErrorItem(fe.getField(), fe.getDefaultMessage());
    }

    private ResponseEntity<ErrorResponse> build(HttpStatus status,
                                                String message,
                                                HttpServletRequest request,
                                                List<FieldErrorItem> fields) {
        ErrorResponse body = ErrorResponse.builder()
                .statusCode(status.value())
                .message(message)
                .timestamp(OffsetDateTime.now())
                .path(request.getRequestURI())
                .fields(fields == null || fields.isEmpty() ? null : fields)
                .build();
        return ResponseEntity.status(status).body(body);
    }
}
