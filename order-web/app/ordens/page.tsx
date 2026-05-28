'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CpfInput } from '@/components/ui/CpfInput';
import { DataTable } from '@/components/DataTable/DataTable';
import type { ColumnDef } from '@/components/DataTable/types';
import { useAuth } from '@/features/auth/AuthContext';
import { useListagemOrdens } from '@/app/composables/useListagemOrdens';
import { useCriarOrdem } from '@/app/composables/useCriarOrdem';
import { ModalCriarOrdem } from '@/features/orders/ModalCriarOrdem';
import { cleanCpf } from '@/lib/cpf';
import { cn } from '@/lib/cn';
import type { OrderStatus, OrderStatusResponse } from '@/features/orders/orders.types';

const buscaSchema = z.object({
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve ter 11 digitos'),
});

type BuscaInput = z.infer<typeof buscaSchema>;

const statusColors: Record<OrderStatus, string> = {
  PAGO: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  PENDENTE_PAGAMENTO: 'bg-amber-100 text-amber-700 ring-amber-200',
  CANCELADO: 'bg-red-100 text-red-700 ring-red-200',
  RECUSADO: 'bg-red-100 text-red-700 ring-red-200',
};

const statusLabels: Record<OrderStatus, string> = {
  PAGO: 'Pago',
  PENDENTE_PAGAMENTO: 'Pendente',
  CANCELADO: 'Cancelado',
  RECUSADO: 'Recusado',
};

export default function OrdensPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();
  const { buscarOrdens, ordens, error, isPending, ultimoCpf } = useListagemOrdens();
  const {
    criarOrdem,
    error: criarError,
    isPending: criarPending,
  } = useCriarOrdem();

  const [modalAberto, setModalAberto] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BuscaInput>({
    resolver: zodResolver(buscaSchema),
    defaultValues: { cpf: '' },
  });

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isHydrated, router]);

  const columns = useMemo<ColumnDef<OrderStatusResponse, unknown>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID da ordem',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-navy-600" title={row.original.id}>
            {row.original.id.slice(0, 8)}…
          </span>
        ),
      },
      {
        accessorKey: 'nomeComprador',
        header: 'Comprador',
        cell: ({ row }) => <span className="font-medium">{row.original.nomeComprador}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
                statusColors[status],
              )}
            >
              {statusLabels[status]}
            </span>
          );
        },
      },
    ],
    [],
  );

  if (!isHydrated || !isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-navy-50 text-navy-500">
        <p className="text-sm">Carregando…</p>
      </main>
    );
  }

  const emptyMessage =
    ultimoCpf === null
      ? 'Use o campo acima para buscar ordens por CPF.'
      : 'Nenhuma ordem encontrada para o CPF informado.';

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-navy-800">Ordens</h1>
          <p className="text-sm text-navy-500">
            Busque ordens pelo CPF do comprador ou crie uma nova ordem.
          </p>
        </div>

        <Card className="mb-6">
          <form
            onSubmit={handleSubmit((values) => buscarOrdens(cleanCpf(values.cpf)))}
            className="flex flex-col gap-4 md:flex-row md:items-end"
            noValidate
          >
            <div className="flex-1">
              <CpfInput
                control={control}
                name="cpf"
                label="CPF do comprador"
                error={errors.cpf?.message}
              />
            </div>
            <Button type="submit" isLoading={isPending} className="md:w-32">
              Buscar
            </Button>
          </form>
        </Card>

        {error ? (
          <div
            role="alert"
            className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
          >
            {error}
          </div>
        ) : null}

        <Card className="p-0">
          <div className="border-b border-navy-100 px-6 py-5">
            <CardHeader
              title="Resultados"
              description={
                ultimoCpf
                  ? `${ordens.length} ordem(ns) encontrada(s).`
                  : 'Faca uma busca para ver os resultados.'
              }
              className="mb-0"
              action={<Button onClick={() => setModalAberto(true)}>+ Nova ordem</Button>}
            />
          </div>
          <div className="p-6">
            <DataTable<OrderStatusResponse>
              columns={columns}
              data={ordens}
              emptyMessage={emptyMessage}
              isLoading={isPending}
            />
          </div>
        </Card>
      </main>

      <ModalCriarOrdem
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        criarOrdem={criarOrdem}
        isPending={criarPending}
        error={criarError}
        onCriado={(_ordem, cpfComprador) => {
          setValue('cpf', cpfComprador);
          buscarOrdens(cpfComprador);
        }}
      />
    </>
  );
}
