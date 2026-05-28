import axios from 'axios';

type ApiErrorBody = {
  statusCode?: number;
  message?: string | string[];
  fields?: Array<{ field: string; message: string }>;
};

export function extractApiErrorMessage(error: unknown, fallback = 'Erro inesperado'): string {
  if (axios.isAxiosError<ApiErrorBody>(error) && error.response?.data) {
    const { message } = error.response.data;
    if (Array.isArray(message)) return message.join(', ');
    if (typeof message === 'string' && message.length > 0) return message;
  }
  return fallback;
}
