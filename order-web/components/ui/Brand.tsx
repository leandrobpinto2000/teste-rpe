import { cn } from '@/lib/cn';

type Props = {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  className?: string;
};

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-4xl',
};

export function Brand({ size = 'md', variant = 'dark', className }: Props) {
  return (
    <div
      className={cn(
        'inline-flex items-baseline gap-1 font-extrabold tracking-tight',
        sizeClasses[size],
        className,
      )}
    >
      <span className={cn(variant === 'light' ? 'text-white' : 'text-navy-700')}>RP</span>
      <span className="text-brand-500">E</span>
    </div>
  );
}
