'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRequests } from './useRequests';
import { extractApiErrorMessage } from '@/lib/api-error';
import type { OrderStatusResponse } from '@/features/orders/orders.types';

const MAX_TENTATIVAS = 10;
const INTERVALO_MS = 1000;

export function useListagemOrdens() {
  const { get } = useRequests();

  const [ordens, setOrdens] = useState<OrderStatusResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [ultimoCpf, setUltimoCpf] = useState<string | null>(null);
  const [pollingTentativas, setPollingTentativas] = useState(0);

  const tentativasRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const refetch = useCallback(
    async (cpf: string): Promise<OrderStatusResponse[]> => {
      const resposta = await get<OrderStatusResponse[]>('/api/orders', {
        params: { cpf_comprador: cpf },
      });
      setOrdens(resposta);
      return resposta;
    },
    [get],
  );

  const buscarOrdens = useCallback(
    async (cpf: string): Promise<void> => {
      tentativasRef.current = 0;
      setPollingTentativas(0);
      setError(null);
      setIsPending(true);
      try {
        await refetch(cpf);
        setUltimoCpf(cpf);
      } catch (err) {
        setError(extractApiErrorMessage(err, 'Falha ao buscar ordens.'));
        setOrdens([]);
      } finally {
        setIsPending(false);
      }
    },
    [refetch],
  );

  useEffect(() => {
    clearPolling();

    const temPendente = ordens.some((o) => o.status === 'PENDENTE_PAGAMENTO');
    if (!temPendente || !ultimoCpf || tentativasRef.current >= MAX_TENTATIVAS) {
      return;
    }

    intervalRef.current = setInterval(async () => {
      tentativasRef.current += 1;
      setPollingTentativas(tentativasRef.current);
      if (tentativasRef.current > MAX_TENTATIVAS) {
        clearPolling();
        return;
      }
      try {
        await refetch(ultimoCpf);
      } catch (err) {
        setError(extractApiErrorMessage(err, 'Falha ao atualizar ordens.'));
        clearPolling();
      }
    }, INTERVALO_MS);

    return () => {
      clearPolling();
    };
  }, [ordens, ultimoCpf, refetch, clearPolling]);

  useEffect(() => () => clearPolling(), [clearPolling]);

  return {
    buscarOrdens,
    ordens,
    error,
    isPending,
    ultimoCpf,
    pollingTentativas,
    pollingMax: MAX_TENTATIVAS,
  };
}
