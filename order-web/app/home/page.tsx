'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated || !isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-navy-50 text-navy-500">
        <p className="text-sm">Carregando…</p>
      </main>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto flex max-w-4xl flex-col items-center justify-center px-6 py-20">
        <Card className="w-full text-center">
          <h1 className="text-4xl font-bold text-navy-800">Bem-vindo</h1>
          <p className="mt-3 text-navy-500">
            Use o menu acima para navegar pelas funcionalidades do portal RPE.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/cadastroUsuario">
              <Button>Cadastrar novo usuario</Button>
            </Link>
          </div>
        </Card>
      </main>
    </>
  );
}
