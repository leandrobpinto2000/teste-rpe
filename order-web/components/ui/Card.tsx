import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-navy-100 bg-white p-6 shadow-card',
        className,
      )}
      {...rest}
    />
  );
}

type CardHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function CardHeader({ title, description, action, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-5 flex items-start justify-between gap-3', className)}>
      <div>
        <h2 className="text-lg font-semibold text-navy-800">{title}</h2>
        {description ? <p className="mt-1 text-sm text-navy-500">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
