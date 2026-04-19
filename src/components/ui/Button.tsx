import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export function Button({ href, children, variant = 'primary', className }: { href: string; children: ReactNode; variant?: 'primary' | 'secondary'; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5',
        variant === 'primary'
          ? 'bg-accent-blue text-bg shadow-glow hover:bg-accent-cyan'
          : 'border border-line bg-white/5 text-text hover:border-accent-blue hover:text-accent-blue',
        className,
      )}
    >
      {children}
    </Link>
  );
}
