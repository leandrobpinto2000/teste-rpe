'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/cn';

type Size = 'sm' | 'md' | 'lg';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: Size;
  children: ReactNode;
};

const sizeClasses: Record<Size, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-3xl',
};

export function Modal({ open, onClose, title, description, size = 'md', children }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/60 px-4 py-6 backdrop-blur-sm"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={cn(
          'relative w-full overflow-hidden rounded-2xl bg-white shadow-card',
          sizeClasses[size],
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 border-b border-navy-100 px-6 py-5">
            <div>
              {title ? (
                <h2 id="modal-title" className="text-lg font-semibold text-navy-800">
                  {title}
                </h2>
              ) : null}
              {description ? (
                <p className="mt-1 text-sm text-navy-500">{description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="rounded-md p-1 text-navy-400 transition-colors hover:bg-navy-100 hover:text-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400"
            >
              <svg
                aria-hidden
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
