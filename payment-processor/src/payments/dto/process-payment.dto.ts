import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { PaymentMethod } from '../schemas/payment.schema';

export class ProcessPaymentDto {
  @Expose({ name: 'id_ordem' })
  @IsUUID()
  id_ordem!: string;

  @Expose({ name: 'id_item' })
  @IsUUID()
  id_item!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valor!: number;

  @Expose({ name: 'meio_pagamento' })
  @IsEnum(['PIX', 'CREDITO', 'DEBITO'])
  meio_pagamento!: PaymentMethod;

  @Expose({ name: 'nome_comprador' })
  @IsString()
  @IsNotEmpty()
  nome_comprador!: string;

  @Expose({ name: 'cpf_comprador' })
  @IsString()
  @IsNotEmpty()
  cpf_comprador!: string;
}
