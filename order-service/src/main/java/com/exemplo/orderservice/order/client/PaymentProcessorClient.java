package com.exemplo.orderservice.order.client;

import com.exemplo.orderservice.order.dto.ProcessPaymentRequest;
import com.exemplo.orderservice.order.dto.ProcessPaymentResponse;
import com.exemplo.orderservice.order.dto.UpdatePaymentStatusRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.UUID;

@FeignClient(name = "payment-processor", url = "${app.payment-processor.url}")
public interface PaymentProcessorClient {

    @PostMapping("/payments")
    ProcessPaymentResponse process(@RequestBody ProcessPaymentRequest request);

    @PatchMapping("/payments/{idOrdem}/status")
    void atualizarStatus(@PathVariable("idOrdem") UUID idOrdem,
                         @RequestBody UpdatePaymentStatusRequest body);
}
