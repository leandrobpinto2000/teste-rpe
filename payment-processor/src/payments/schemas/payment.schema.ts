import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PaymentMethod = 'PIX' | 'CREDITO' | 'DEBITO';
export type PaymentStatus = 'PENDENTE_PAGAMENTO' | 'PAGO' | 'CANCELADO' | 'RECUSADO';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ collection: 'payments' })
export class Payment {
  @Prop({ required: true, index: true })
  id_ordem!: string;

  @Prop({ required: true })
  id_item!: string;

  @Prop({ required: true })
  valor!: number;

  @Prop({ required: true, enum: ['PIX', 'CREDITO', 'DEBITO'] })
  meio_pagamento!: PaymentMethod;

  @Prop({ required: true })
  nome_comprador!: string;

  @Prop({ required: true })
  cpf_comprador!: string;

  @Prop({
    required: true,
    enum: ['PENDENTE_PAGAMENTO', 'PAGO', 'CANCELADO', 'RECUSADO'],
    default: 'PENDENTE_PAGAMENTO',
  })
  status_pagamento!: PaymentStatus;

  @Prop({ required: true })
  data_processamento!: Date;

  @Prop({ type: Date, default: null })
  data_pagamento!: Date | null;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
