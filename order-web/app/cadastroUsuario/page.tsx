'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/DataTable/DataTable';
import type { ColumnDef } from '@/components/DataTable/types';
import { ModalCadastroUsuario } from '@/features/auth/ModalCadastroUsuario';
import type { SessionUser } from '@/features/auth/auth.types';
import { useCadastroUsuario } from '@/app/composables/useCadastroUsuario';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

export default function CadastroUsuarioPage() {
  const router = useRouter();
  const { criarUsuario, usuariosSessao, error, success, isPending } = useCadastroUsuario();
  const [modalAberto, setModalAberto] = useState(false);

  const columns = useMemo<ColumnDef<SessionUser, unknown>[]>(
    () => [
      {
        accessorKey: 'login',
        header: 'Login',
        cell: ({ row }) => <span className="font-medium">{row.original.login}</span>,
      },
      {
        accessorKey: 'createdAt',
        header: 'Criado em',
        cell: ({ row }) => (
          <span className="text-navy-600">
            {dateFormatter.format(new Date(row.original.createdAt))}
          </span>
        ),
      },
      {
        accessorKey: 'roles',
        header: 'Perfis',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.roles.map((role) => (
              <span
                key={role}
                className="rounded-full bg-navy-100 px-2 py-0.5 text-xs font-semibold text-navy-700"
              >
                {role.replace('ROLE_', '')}
              </span>
            ))}
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-navy-800">Cadastro de usuarios</h1>
          <p className="text-sm text-navy-500">
            Os usuarios criados nesta sessao ficam listados abaixo. A API nao expoe GET /users, entao a lista zera ao recarregar.
          </p>
        </div>

        {success ? (
          <div
            role="status"
            className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700"
          >
            {success}
          </div>
        ) : null}

        <Card className="p-0">
          <div className="border-b border-navy-100 px-6 py-5">
            <CardHeader
              title="Usuarios criados nesta sessao"
              description={`${usuariosSessao.length} usuario(s) na lista.`}
              className="mb-0"
              action={
                <Button onClick={() => setModalAberto(true)}>+ Adicionar novo usuario</Button>
              }
            />
          </div>
          <div className="p-6">
            <DataTable<SessionUser>
              columns={columns}
              data={usuariosSessao}
              emptyMessage="Nenhum usuario criado nesta sessao."
              actions={(row) => (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => router.push(`/login?login=${encodeURIComponent(row.login)}`)}
                >
                  Ir para login
                </Button>
              )}
            />
          </div>
        </Card>
      </main>

      <ModalCadastroUsuario
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        criarUsuario={criarUsuario}
        isPending={isPending}
        error={error}
      />
    </>
  );
}
