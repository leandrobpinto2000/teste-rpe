'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createUserSchema, type CreateUserInput } from './auth.schemas';
import type { CreateUserResponse } from './auth.types';

type Props = {
  open: boolean;
  onClose: () => void;
  criarUsuario: (input: CreateUserInput) => Promise<CreateUserResponse | null>;
  isPending: boolean;
  error: string | null;
};

export function ModalCadastroUsuario({ open, onClose, criarUsuario, isPending, error }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { login: '', senha: '' },
  });

  useEffect(() => {
    if (!open) {
      reset({ login: '', senha: '' });
    }
  }, [open, reset]);

  async function onSubmit(values: CreateUserInput) {
    const criado = await criarUsuario(values);
    if (criado) {
      onClose();
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Novo usuario"
      description="Login unico. Senha precisa de letras e numeros, minimo 8 caracteres."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <Input
          label="Login"
          placeholder="joao.silva"
          autoComplete="username"
          {...register('login')}
          error={errors.login?.message}
        />
        <Input
          label="Senha"
          type="password"
          placeholder="MinhaSenha123"
          autoComplete="new-password"
          {...register('senha')}
          error={errors.senha?.message}
          hint="Pelo menos 1 letra e 1 numero."
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
            Criar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
