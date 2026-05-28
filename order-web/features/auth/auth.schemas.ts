import { z } from 'zod';

export const loginSchema = z.object({
  login: z.string().min(1, 'Informe o login'),
  senha: z.string().min(1, 'Informe a senha'),
});

export const createUserSchema = z.object({
  login: z
    .string()
    .min(3, 'Login deve ter ao menos 3 caracteres')
    .max(60, 'Login muito longo'),
  senha: z
    .string()
    .min(8, 'Senha deve ter ao menos 8 caracteres')
    .regex(/[A-Za-z]/, 'Senha deve conter ao menos uma letra')
    .regex(/[0-9]/, 'Senha deve conter ao menos um numero'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
