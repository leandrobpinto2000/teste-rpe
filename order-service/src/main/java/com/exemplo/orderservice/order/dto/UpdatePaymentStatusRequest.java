package com.exemplo.orderservice.order.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.OffsetDateTime;
import java.util.UUID;

public record UpdatePaymentStatusRequest(
        @JsonProperty("id_ordem") UUID idOrdem,
        @JsonProperty("status_pagamento") String statusPagamento,
        @JsonProperty("data_pagamento") OffsetDateTime dataPagamento
) {}
