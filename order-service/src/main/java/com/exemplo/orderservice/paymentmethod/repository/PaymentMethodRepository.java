package com.exemplo.orderservice.paymentmethod.repository;

import com.exemplo.orderservice.paymentmethod.model.PaymentMethodEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethodEntity, String> {
}
