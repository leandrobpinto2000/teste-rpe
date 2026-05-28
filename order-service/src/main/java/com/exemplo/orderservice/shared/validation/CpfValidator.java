package com.exemplo.orderservice.shared.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CpfValidator implements ConstraintValidator<Cpf, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) return false;

        String digits = value.replaceAll("[^0-9]", "");
        if (digits.length() != 11) return false;
        if (digits.chars().distinct().count() == 1) return false;

        return checkDigit(digits, 9) && checkDigit(digits, 10);
    }

    private boolean checkDigit(String digits, int position) {
        int sum = 0;
        for (int i = 0; i < position; i++) {
            sum += (digits.charAt(i) - '0') * (position + 1 - i);
        }
        int remainder = (sum * 10) % 11;
        if (remainder == 10) remainder = 0;
        return remainder == (digits.charAt(position) - '0');
    }
}
