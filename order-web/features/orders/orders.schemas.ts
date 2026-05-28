import { z } from 'zod';

export const createOrderSchema = z.object({
  id: z.string().uuid('id deve ser UUID valido'),
  idItem: z.string().uuid('idItem deve ser UUID valido'),
  valor: z.coerce
    .number({ invalid_type_error: 'valor deve ser numerico' })
    .positive('valor deve ser maior que zero'),
  meioPagamento: z.enum(['PIX', 'CREDITO', 'DEBITO']),
  nomeComprador: z
    .string()
    .min(4, 'nome deve ter ao menos 4 caracteres')
    .max(120, 'nome muito longo'),
  cpfComprador: z.string().regex(/^\d{11}$/, 'CPF deve ter 11 digitos'),
});

export type CreateOrderFormInput = z.infer<typeof createOrderSchema>;
