import { PaymentStatus } from '../schemas/payment.schema';

export class ProcessPaymentResponseDto {
  status!: PaymentStatus;
  data_pagamento!: string | null;
}
