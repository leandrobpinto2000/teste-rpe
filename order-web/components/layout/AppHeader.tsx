'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Brand } from '@/components/ui/Brand';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { useAuth } from '@/features/auth/AuthContext';

type NavItem = { href: string; label: string };

const navItems: NavItem[] = [
  { href: '/home', label: 'Home' },
  { href: '/cadastroUsuario', label: 'Cadastrar usuario' },
  { href: '/ordens', label: 'Ordens' },
];

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <header className="border-b-2 border-brand-500 bg-navy-800">
      <div className="mx-auto flex h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-6">
        <div className="flex items-center gap-8">
          <Brand size="md" variant="light" />
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative inline-flex h-16 items-center px-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-brand-400'
                      : 'text-navy-100 hover:text-white',
                  )}
                >
                  {item.label}
                  {isActive ? (
                    <span
                      aria-hidden
                      className="absolute inset-x-2 -bottom-[2px] h-[3px] rounded-t-sm bg-brand-500"
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
        {isAuthenticated ? (
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Sair
          </Button>
        ) : null}
      </div>
    </header>
  );
}
