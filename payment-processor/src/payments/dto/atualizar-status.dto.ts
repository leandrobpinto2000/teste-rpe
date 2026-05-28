import { IsDateString, IsEnum, IsOptional, ValidateIf } from 'class-validator';
import type { PaymentStatus } from '../schemas/payment.schema';

const STATUSES: PaymentStatus[] = [
  'PENDENTE_PAGAMENTO',
  'PAGO',
  'CANCELADO',
  'RECUSADO',
];

export class AtualizarStatusDto {
  @IsEnum(STATUSES)
  status_pagamento!: PaymentStatus;

  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsDateString()
  data_pagamento?: string | null;
}
