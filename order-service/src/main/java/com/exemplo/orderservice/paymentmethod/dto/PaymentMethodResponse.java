package com.exemplo.orderservice.paymentmethod.dto;

import java.io.Serializable;

public record PaymentMethodResponse(String id, String descricao) implements Serializable {
}
