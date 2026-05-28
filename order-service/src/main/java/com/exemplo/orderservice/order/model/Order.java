package com.exemplo.orderservice.order.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "orders")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    private UUID id;

    @Column(name = "id_item", nullable = false)
    private UUID idItem;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal valor;

    @Enumerated(EnumType.STRING)
    @Column(name = "meio_pagamento", nullable = false, length = 20)
    private PaymentMethod meioPagamento;

    @Column(name = "nome_comprador", nullable = false)
    private String nomeComprador;

    @Column(name = "cpf_comprador", nullable = false, length = 14)
    private String cpfComprador;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OrderStatus status;

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private OffsetDateTime dataCriacao;

    @Column(name = "data_pagamento")
    private OffsetDateTime dataPagamento;
}
