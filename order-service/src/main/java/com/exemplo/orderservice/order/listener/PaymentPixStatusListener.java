package com.exemplo.orderservice.order.listener;

import com.exemplo.orderservice.order.dto.PaymentPixStatusMessage;
import com.exemplo.orderservice.order.service.OrderService;
import io.awspring.cloud.sqs.annotation.SqsListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class PaymentPixStatusListener {

    private static final Logger log = LoggerFactory.getLogger(PaymentPixStatusListener.class);

    private final OrderService orderService;

    public PaymentPixStatusListener(OrderService orderService) {
        this.orderService = orderService;
    }

    @SqsListener("${app.sqs.pix-status-queue}")
    public void onMessage(PaymentPixStatusMessage payload) {
        log.info("Recebida mensagem pagamento-pix-status idOrdem={} status={}",
                payload.idOrdem(), payload.status());
        orderService.atualizarStatusPix(payload);
    }
}
