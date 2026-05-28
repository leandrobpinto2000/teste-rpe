import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { ProcessPaymentResponseDto } from './dto/process-payment-response.dto';
import { AtualizarStatusDto } from './dto/atualizar-status.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  process(@Body() dto: ProcessPaymentDto): Promise<ProcessPaymentResponseDto> {
    return this.paymentsService.process(dto);
  }

  @Patch(':idOrdem/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async atualizarStatus(
    @Param('idOrdem') idOrdem: string,
    @Body() dto: AtualizarStatusDto,
  ): Promise<void> {
    await this.paymentsService.atualizarStatus(
      idOrdem,
      dto.status_pagamento,
      dto.data_pagamento ?? null,
    );
  }
}
