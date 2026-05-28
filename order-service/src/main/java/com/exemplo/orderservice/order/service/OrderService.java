package com.exemplo.orderservice.order.service;

import com.exemplo.orderservice.order.client.PaymentProcessorClient;
import com.exemplo.orderservice.order.dto.CreateOrderRequest;
import com.exemplo.orderservice.order.dto.CreateOrderResponse;
import com.exemplo.orderservice.order.dto.OrderStatusResponse;
import com.exemplo.orderservice.order.dto.PaymentPixStatusMessage;
import com.exemplo.orderservice.order.dto.ProcessPaymentRequest;
import com.exemplo.orderservice.order.dto.ProcessPaymentResponse;
import com.exemplo.orderservice.order.dto.UpdatePaymentStatusRequest;
import com.exemplo.orderservice.order.exception.OrderAlreadyExistsException;
import com.exemplo.orderservice.order.exception.OrderNotFoundException;
import com.exemplo.orderservice.order.model.Order;
import com.exemplo.orderservice.order.model.OrderStatus;
import com.exemplo.orderservice.order.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final PaymentProcessorClient paymentProcessorClient;

    public OrderService(OrderRepository orderRepository, PaymentProcessorClient paymentProcessorClient) {
        this.orderRepository = orderRepository;
        this.paymentProcessorClient = paymentProcessorClient;
    }

    @Transactional
    public CreateOrderResponse create(CreateOrderRequest request) {
        if (orderRepository.existsById(request.id())) {
            throw new OrderAlreadyExistsException(request.id().toString());
        }

        Order order = Order.builder()
                .id(request.id())
                .idItem(request.idItem())
                .valor(request.valor())
                .meioPagamento(request.meioPagamento())
                .nomeComprador(request.nomeComprador())
                .cpfComprador(request.cpfComprador())
                .status(OrderStatus.PENDENTE_PAGAMENTO)
                .dataCriacao(OffsetDateTime.now())
                .build();

        orderRepository.save(order);
        log.info("Ordem criada id={} metodo={}", order.getId(), order.getMeioPagamento());

        ProcessPaymentResponse payment = paymentProcessorClient.process(new ProcessPaymentRequest(
                order.getId(),
                order.getIdItem(),
                order.getValor(),
                order.getMeioPagamento(),
                order.getNomeComprador(),
                order.getCpfComprador()
        ));

        if (payment.status() != OrderStatus.PENDENTE_PAGAMENTO) {
            order.setStatus(payment.status());
            order.setDataPagamento(payment.dataPagamento());
            orderRepository.save(order);
            log.info("Ordem id={} atualizada para status={}", order.getId(), payment.status());
        }

        return new CreateOrderResponse(order.getId(), order.getStatus(), order.getDataCriacao());
    }

    @Transactional(readOnly = true)
    public List<OrderStatusResponse> findByCpf(String cpf) {
        return orderRepository.findByCpfComprador(cpf).stream()
                .map(o -> new OrderStatusResponse(o.getId(), o.getNomeComprador(), o.getStatus()))
                .toList();
    }

    @Transactional
    public void atualizarStatusPix(PaymentPixStatusMessage msg) {
        Order order = orderRepository.findById(msg.idOrdem())
                .orElseThrow(() -> new OrderNotFoundException(msg.idOrdem()));

        OrderStatus novoStatus = mapearStatus(msg.status());
        OffsetDateTime dataPagamento = novoStatus == OrderStatus.PAGO ? OffsetDateTime.now() : null;

        order.setStatus(novoStatus);
        order.setDataPagamento(dataPagamento);
        orderRepository.save(order);
        log.info("Ordem id={} atualizada via fila PIX para status={}", order.getId(), novoStatus);

        try {
            paymentProcessorClient.atualizarStatus(
                    order.getId(),
                    new UpdatePaymentStatusRequest(order.getId(), novoStatus.name(), dataPagamento)
            );
        } catch (Exception e) {
            log.error("Falha ao notificar payment-processor sobre atualizacao de status idOrdem={}",
                    order.getId(), e);
        }
    }

    private OrderStatus mapearStatus(String status) {
        return switch (status.toUpperCase()) {
            case "PAGO" -> OrderStatus.PAGO;
            case "CANCELADO" -> OrderStatus.CANCELADO;
            case "REPROVADO", "RECUSADO" -> OrderStatus.RECUSADO;
            default -> throw new IllegalArgumentException("Status invalido: " + status);
        };
    }
}
