'use client';
//criada para poder gerenciar as requisicoes e facilitar o uso do token generalizando as chamadas a api, evitando repeticao de codigo e centralizando o tratamento de erros e respostas.

import { useCallback, useMemo } from 'react';
import axios, { type AxiosError } from 'axios';
import { useAuth } from '@/features/auth/AuthContext';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiRequestOptions {
  endpoint: string;
  method?: HttpMethod;
  body?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  baseUrl?: string;
}

export interface ApiResponse<T = unknown> {
  sucesso?: boolean;
  mensagem?: string;
  erro?: string;
  message?: string;
  dados?: T;
  data?: T;
}

export function useRequests() {
  const { token } = useAuth();
  const baseUrlPadrao = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

  const buildQueryString = useCallback((params?: Record<string, unknown>): string => {
    if (!params || Object.keys(params).length === 0) return '';
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return;
        searchParams.append(key, trimmed);
        return;
      }
      if (typeof value === 'number' || typeof value === 'boolean') {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    return qs ? `?${qs}` : '';
  }, []);

  const request = useCallback(
    async <T = unknown>(options: ApiRequestOptions): Promise<T> => {
      const {
        endpoint,
        method = 'GET',
        body,
        params,
        headers: customHeaders = {},
        baseUrl = baseUrlPadrao,
      } = options;

      const url = `${baseUrl}${endpoint}${buildQueryString(params)}`;

      const headers: Record<string, string> = { ...customHeaders };

      if (token && headers.Authorization === undefined) {
        headers.Authorization = `Bearer ${token}`;
      }

      const hasBody =
        body !== undefined && (method === 'POST' || method === 'PUT' || method === 'PATCH');
      if (hasBody && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }

      try {
        const { data } = await axios.request<T>({
          url,
          method,
          data: hasBody ? body : undefined,
          headers,
        });
        return data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error(
          `[useRequests] ${method} ${endpoint} falhou`,
          axiosError.response?.status,
          axiosError.message,
        );
        throw error;
      }
    },
    [token, baseUrlPadrao, buildQueryString],
  );

  const get = useCallback(
    <T = unknown>(endpoint: string, options?: Partial<ApiRequestOptions>): Promise<T> =>
      request<T>({ endpoint, method: 'GET', ...options }),
    [request],
  );

  const post = useCallback(
    <T = unknown>(
      endpoint: string,
      body?: unknown,
      options?: Partial<ApiRequestOptions>,
    ): Promise<T> => request<T>({ endpoint, method: 'POST', body, ...options }),
    [request],
  );

  const put = useCallback(
    <T = unknown>(
      endpoint: string,
      body?: unknown,
      options?: Partial<ApiRequestOptions>,
    ): Promise<T> => request<T>({ endpoint, method: 'PUT', body, ...options }),
    [request],
  );

  const patch = useCallback(
    <T = unknown>(
      endpoint: string,
      body?: unknown,
      options?: Partial<ApiRequestOptions>,
    ): Promise<T> => request<T>({ endpoint, method: 'PATCH', body, ...options }),
    [request],
  );

  const del = useCallback(
    <T = unknown>(endpoint: string, options?: Partial<ApiRequestOptions>): Promise<T> =>
      request<T>({ endpoint, method: 'DELETE', ...options }),
    [request],
  );

  const normalizarListaResposta = useCallback(<T = unknown>(data: unknown): T[] => {
    if (Array.isArray(data)) return data as T[];
    if (data && typeof data === 'object') {
      const dados = (data as { dados?: unknown }).dados;
      if (Array.isArray(dados)) return dados as T[];
      if (dados !== undefined && dados !== null) return [dados as T];
    }
    return [];
  }, []);

  const normalizarItemResposta = useCallback(<T = unknown>(data: unknown): T | null => {
    if (data && typeof data === 'object') {
      const dados = (data as { dados?: unknown }).dados;
      if (Array.isArray(dados) && dados.length > 0) return dados[0] as T;
      if (dados && !Array.isArray(dados)) return dados as T;
      if (!Array.isArray(data)) return data as T;
    }
    return null;
  }, []);

  return useMemo(
    () => ({
      request,
      get,
      post,
      put,
      patch,
      delete: del,
      buildQueryString,
      normalizarListaResposta,
      normalizarItemResposta,
    }),
    [
      request,
      get,
      post,
      put,
      patch,
      del,
      buildQueryString,
      normalizarListaResposta,
      normalizarItemResposta,
    ],
  );
}
