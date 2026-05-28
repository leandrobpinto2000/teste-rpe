import type { ReactNode } from 'react';
import { Brand } from '@/components/ui/Brand';

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthLayout({ title, subtitle, children, footer }: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy-700 via-navy-800 to-navy-900 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center">
          <Brand size="lg" variant="light" />
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-card">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-navy-800">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-navy-500">{subtitle}</p> : null}
          </div>
          {children}
        </div>
        {footer ? <div className="mt-6 text-center text-sm text-navy-100">{footer}</div> : null}
      </div>
    </main>
  );
}
