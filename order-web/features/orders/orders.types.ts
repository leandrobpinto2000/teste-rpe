export type OrderStatus = 'PENDENTE_PAGAMENTO' | 'PAGO' | 'CANCELADO' | 'RECUSADO';

export type PaymentMethod = 'PIX' | 'CREDITO' | 'DEBITO';

export type OrderStatusResponse = {
  id: string;
  nomeComprador: string;
  status: OrderStatus;
};

export type CreateOrderInput = {
  id: string;
  idItem: string;
  valor: number;
  meioPagamento: PaymentMethod;
  nomeComprador: string;
  cpfComprador: string;
};

export type CreateOrderResponse = {
  id: string;
  status: OrderStatus;
  dataCriacao: string;
};
