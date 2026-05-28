'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequests } from './useRequests';
import { useAuth } from '@/features/auth/AuthContext';
import { extractApiErrorMessage } from '@/lib/api-error';
import type { TokenResponse } from '@/features/auth/auth.types';
import type { LoginInput } from '@/features/auth/auth.schemas';

export function useLogin() {
  const { post } = useRequests();
  const { setToken } = useAuth();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const efetuarLogin = useCallback(
    async (input: LoginInput): Promise<void> => {
      setError(null);
      setIsPending(true);
      try {
        const response = await post<TokenResponse>('/api/auth/login', input);
        setToken(response.accessToken);
        router.replace('/home');
      } catch (err) {
        setError(extractApiErrorMessage(err, 'Login ou senha invalidos'));
      } finally {
        setIsPending(false);
      }
    },
    [post, setToken, router],
  );

  const limparErro = useCallback(() => setError(null), []);

  return { efetuarLogin, error, isPending, limparErro };
}
