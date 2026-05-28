import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { ProcessPaymentResponseDto } from './dto/process-payment-response.dto';
import { Payment, PaymentStatus } from './schemas/payment.schema';
import { SqsService } from '../sqs/sqs.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private cardRequestCounter = 0;

  private readonly pixPendenteQueue =
    process.env.SQS_PIX_PENDENTE_QUEUE ?? 'pagamento-pix-pendente.fifo';

  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    private readonly sqs: SqsService,
  ) {}

  async process(dto: ProcessPaymentDto): Promise<ProcessPaymentResponseDto> {
    const dataProcessamento = new Date();
    const { status, dataPagamento } = this.resolveStatus(dto.meio_pagamento);

    await this.paymentModel.create({
      id_ordem: dto.id_ordem,
      id_item: dto.id_item,
      valor: dto.valor,
      meio_pagamento: dto.meio_pagamento,
      nome_comprador: dto.nome_comprador,
      cpf_comprador: dto.cpf_comprador,
      status_pagamento: status,
      data_processamento: dataProcessamento,
      data_pagamento: dataPagamento,
    });

    this.logger.log(
      `Pagamento processado idOrdem=${dto.id_ordem} metodo=${dto.meio_pagamento} status=${status}`,
    );

    if (dto.meio_pagamento === 'PIX') {
      await this.sqs.sendMessage(
        this.pixPendenteQueue,
        { id_ordem: dto.id_ordem },
        dto.id_ordem,
      );
      this.logger.log(`PIX enfileirado em ${this.pixPendenteQueue} idOrdem=${dto.id_ordem}`);
    }

    return {
      status,
      data_pagamento: dataPagamento ? dataPagamento.toISOString() : null,
    };
  }

  async atualizarStatus(
    idOrdem: string,
    statusPagamento: PaymentStatus,
    dataPagamento: string | null,
  ): Promise<void> {
    const update: Partial<Payment> = {
      status_pagamento: statusPagamento,
      data_pagamento: dataPagamento ? new Date(dataPagamento) : null,
    };

    const result = await this.paymentModel.findOneAndUpdate(
      { id_ordem: idOrdem },
      update,
      { new: true },
    );

    if (!result) {
      throw new NotFoundException(`Pagamento com id_ordem=${idOrdem} nao encontrado`);
    }

    this.logger.log(`Pagamento atualizado idOrdem=${idOrdem} status=${statusPagamento}`);
  }

  private resolveStatus(meioPagamento: string): {
    status: PaymentStatus;
    dataPagamento: Date | null;
  } {
    if (meioPagamento === 'PIX') {
      return { status: 'PENDENTE_PAGAMENTO', dataPagamento: null };
    }

    this.cardRequestCounter += 1;
    const isFailureSlot = this.cardRequestCounter % 5 === 0;

    if (isFailureSlot) {
      const failure: PaymentStatus = Math.random() < 0.5 ? 'RECUSADO' : 'CANCELADO';
      return { status: failure, dataPagamento: null };
    }

    return { status: 'PAGO', dataPagamento: new Date() };
  }
}
