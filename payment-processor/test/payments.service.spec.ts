import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PaymentsService } from '../src/payments/payments.service';
import { Payment } from '../src/payments/schemas/payment.schema';
import { ProcessPaymentDto } from '../src/payments/dto/process-payment.dto';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let createMock: jest.Mock;

  beforeEach(async () => {
    createMock = jest.fn().mockResolvedValue({});
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getModelToken(Payment.name),
          useValue: { create: createMock },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  const baseDto = (overrides: Partial<ProcessPaymentDto> = {}): ProcessPaymentDto => ({
    id_ordem: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    id_item: '660e8400-e29b-41d4-a716-446655440001',
    valor: 150,
    meio_pagamento: 'CREDITO',
    nome_comprador: 'Joao Silva',
    cpf_comprador: '19193412770',
    ...overrides,
  });

  it('PIX sempre retorna PENDENTE_PAGAMENTO com data_pagamento nula', async () => {
    const result = await service.process(baseDto({ meio_pagamento: 'PIX' }));
    expect(result.status).toBe('PENDENTE_PAGAMENTO');
    expect(result.data_pagamento).toBeNull();
    expect(createMock).toHaveBeenCalledTimes(1);
  });

  it('Cartao: 4 primeiras retornam PAGO e a 5a retorna falha (regra 1-em-5)', async () => {
    const statuses: string[] = [];
    for (let i = 0; i < 5; i += 1) {
      const result = await service.process(baseDto({ meio_pagamento: 'CREDITO' }));
      statuses.push(result.status);
    }

    expect(statuses.slice(0, 4)).toEqual(['PAGO', 'PAGO', 'PAGO', 'PAGO']);
    expect(['RECUSADO', 'CANCELADO']).toContain(statuses[4]);
  });

  it('Cartao PAGO preenche data_pagamento', async () => {
    const result = await service.process(baseDto({ meio_pagamento: 'DEBITO' }));
    expect(result.status).toBe('PAGO');
    expect(result.data_pagamento).not.toBeNull();
  });

  it('Persiste documento com data_processamento', async () => {
    await service.process(baseDto({ meio_pagamento: 'PIX' }));
    const arg = createMock.mock.calls[0][0];
    expect(arg.id_ordem).toBe('3fa85f64-5717-4562-b3fc-2c963f66afa6');
    expect(arg.status_pagamento).toBe('PENDENTE_PAGAMENTO');
    expect(arg.data_processamento).toBeInstanceOf(Date);
    expect(arg.data_pagamento).toBeNull();
  });
});
