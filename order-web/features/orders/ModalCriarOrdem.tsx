'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CpfInput } from '@/components/ui/CpfInput';
import { createOrderSchema, type CreateOrderFormInput } from './orders.schemas';
import type { CreateOrderInput, CreateOrderResponse, PaymentMethod } from './orders.types';

type Props = {
  open: boolean;
  onClose: () => void;
  criarOrdem: (input: CreateOrderInput) => Promise<CreateOrderResponse | null>;
  isPending: boolean;
  error: string | null;
  onCriado: (ordem: CreateOrderResponse, cpfComprador: string) => void;
};

const meiosPagamento: { value: PaymentMethod; label: string }[] = [
  { value: 'PIX', label: 'PIX' },
  { value: 'CREDITO', label: 'Cartao de credito' },
  { value: 'DEBITO', label: 'Cartao de debito' },
];

export function ModalCriarOrdem({
  open,
  onClose,
  criarOrdem,
  isPending,
  error,
  onCriado,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateOrderFormInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      id: '',
      idItem: '',
      valor: 0,
      meioPagamento: 'PIX',
      nomeComprador: '',
      cpfComprador: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        id: crypto.randomUUID(),
        idItem: crypto.randomUUID(),
        valor: 0,
        meioPagamento: 'PIX',
        nomeComprador: '',
        cpfComprador: '',
      });
    }
  }, [open, reset]);

  async function onSubmit(values: CreateOrderFormInput) {
    const criada = await criarOrdem(values);
    if (criada) {
      onCriado(criada, values.cpfComprador);
      onClose();
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nova ordem"
      description="Preencha os dados da ordem."
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <input type="hidden" {...register('id')} />
        <input type="hidden" {...register('idItem')} />

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Valor (R$)"
            type="text"
            inputMode="decimal"
            placeholder="100.00"
            {...register('valor')}
            error={errors.valor?.message}
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="meioPagamento" className="text-sm font-medium text-navy-700">
              Meio de pagamento
            </label>
            <select
              id="meioPagamento"
              {...register('meioPagamento')}
              className="h-11 rounded-md border border-navy-200 bg-white px-3 text-sm text-navy-900 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-300"
            >
              {meiosPagamento.map((mp) => (
                <option key={mp.value} value={mp.value}>
                  {mp.label}
                </option>
              ))}
            </select>
            {errors.meioPagamento?.message ? (
              <p role="alert" className="text-xs font-medium text-red-600">
                {errors.meioPagamento.message}
              </p>
            ) : null}
          </div>
        </div>

        <Input
          label="Nome do comprador"
          placeholder="Joao Silva"
          {...register('nomeComprador')}
          error={errors.nomeComprador?.message}
        />

        <CpfInput
          control={control}
          name="cpfComprador"
          label="CPF do comprador"
          error={errors.cpfComprador?.message}
        />

        {error ? (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
          >
            {error}
          </div>
        ) : null}

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isPending}>
            Criar ordem
          </Button>
        </div>
      </form>
    </Modal>
  );
}
