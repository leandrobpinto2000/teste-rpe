'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    if (!isHydrated) return;
    router.replace(isAuthenticated ? '/home' : '/login');
  }, [isAuthenticated, isHydrated, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-900 text-navy-50">
      <p className="text-sm">Carregando…</p>
    </main>
  );
}
