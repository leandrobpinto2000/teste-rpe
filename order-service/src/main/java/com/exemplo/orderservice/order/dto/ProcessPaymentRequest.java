package com.exemplo.orderservice.order.dto;

import com.exemplo.orderservice.order.model.PaymentMethod;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.UUID;

public record ProcessPaymentRequest(
        @JsonProperty("id_ordem") UUID idOrdem,
        @JsonProperty("id_item") UUID idItem,
        @JsonProperty("valor") BigDecimal valor,
        @JsonProperty("meio_pagamento") PaymentMethod meioPagamento,
        @JsonProperty("nome_comprador") String nomeComprador,
        @JsonProperty("cpf_comprador") String cpfComprador
) {}
