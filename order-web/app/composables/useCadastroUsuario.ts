'use client';

import { useCallback, useState } from 'react';
import { useRequests } from './useRequests';
import { extractApiErrorMessage } from '@/lib/api-error';
import type { CreateUserResponse, SessionUser } from '@/features/auth/auth.types';
import type { CreateUserInput } from '@/features/auth/auth.schemas';

export function useCadastroUsuario() {
  const { post } = useRequests();

  const [usuariosSessao, setUsuariosSessao] = useState<SessionUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const criarUsuario = useCallback(
    async (input: CreateUserInput): Promise<CreateUserResponse | null> => {
      setError(null);
      setSuccess(null);
      setIsPending(true);
      try {
        const criado = await post<CreateUserResponse>('/api/users', input);
        setUsuariosSessao((prev) => [criado, ...prev]);
        setSuccess(`Usuario "${criado.login}" criado com sucesso.`);
        return criado;
      } catch (err) {
        setError(extractApiErrorMessage(err, 'Falha ao criar usuario.'));
        return null;
      } finally {
        setIsPending(false);
      }
    },
    [post],
  );

  const limparMensagens = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return { criarUsuario, usuariosSessao, error, success, isPending, limparMensagens };
}
