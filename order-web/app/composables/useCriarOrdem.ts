'use client';

import { useCallback, useState } from 'react';
import { useRequests } from './useRequests';
import { extractApiErrorMessage } from '@/lib/api-error';
import type { CreateOrderInput, CreateOrderResponse } from '@/features/orders/orders.types';

export function useCriarOrdem() {
  const { post } = useRequests();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const criarOrdem = useCallback(
    async (input: CreateOrderInput): Promise<CreateOrderResponse | null> => {
      setError(null);
      setIsPending(true);
      try {
        return await post<CreateOrderResponse>('/api/orders', input);
      } catch (err) {
        setError(extractApiErrorMessage(err, 'Falha ao criar ordem.'));
        return null;
      } finally {
        setIsPending(false);
      }
    },
    [post],
  );

  const limparErro = useCallback(() => setError(null), []);

  return { criarOrdem, error, isPending, limparErro };
}
