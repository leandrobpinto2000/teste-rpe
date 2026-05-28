package com.exemplo.orderservice.order.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

public record PaymentPixStatusMessage(
        @JsonProperty("id_ordem") UUID idOrdem,
        @JsonProperty("status") String status
) {}
