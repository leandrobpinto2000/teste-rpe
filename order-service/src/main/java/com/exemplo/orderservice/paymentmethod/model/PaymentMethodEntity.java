package com.exemplo.orderservice.paymentmethod.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Table(name = "payment_methods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMethodEntity implements Serializable {

    @Id
    @Column(length = 20)
    private String id;

    @Column(nullable = false, length = 100)
    private String descricao;
}
