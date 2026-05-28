package com.exemplo.orderservice.paymentmethod.service;

import com.exemplo.orderservice.paymentmethod.dto.PaymentMethodResponse;
import com.exemplo.orderservice.paymentmethod.repository.PaymentMethodRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentMethodService {

    public static final String CACHE_NAME = "payment-methods";

    private static final Logger log = LoggerFactory.getLogger(PaymentMethodService.class);

    private final PaymentMethodRepository repository;

    public PaymentMethodService(PaymentMethodRepository repository) {
        this.repository = repository;
    }

    @Cacheable(value = CACHE_NAME, key = "'all'")
    public List<PaymentMethodResponse> listAll() {
        log.info("Consultando meios de pagamento no banco (cache miss)");
        return repository.findAll().stream()
                .map(p -> new PaymentMethodResponse(p.getId(), p.getDescricao()))
                .toList();
    }
}
