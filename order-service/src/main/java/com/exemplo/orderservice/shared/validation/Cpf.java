package com.exemplo.orderservice.shared.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = CpfValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface Cpf {
    String message() default "CPF invalido";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
