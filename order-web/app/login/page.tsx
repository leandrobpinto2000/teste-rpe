'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/features/auth/AuthContext';
import { loginSchema, type LoginInput } from '@/features/auth/auth.schemas';
import { useLogin } from '@/app/composables/useLogin';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isHydrated } = useAuth();
  const { efetuarLogin, error, isPending } = useLogin();

  const prefilledLogin = searchParams.get('login') ?? '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: prefilledLogin, senha: '' },
  });

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, isHydrated, router]);

  return (
    <AuthLayout
      title="Acessar"
      subtitle="Entre com seu login e senha para continuar"
      footer={
        <span>
          Nao tem conta?{' '}
          <Link href="/cadastroUsuario" className="font-semibold text-brand-400 hover:text-brand-300">
            Cadastre-se
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit(efetuarLogin)} className="flex flex-col gap-4" noValidate>
        <Input
          label="Login"
          placeholder="seu.login"
          autoComplete="username"
          {...register('login')}
          error={errors.login?.message}
        />
        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          {...register('senha')}
          error={errors.senha?.message}
        />

        {error ? (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
          >
            {error}
          </div>
        ) : null}

        <Button type="submit" isLoading={isPending} className="mt-2">
          Entrar
        </Button>
      </form>
    </AuthLayout>
  );
}
