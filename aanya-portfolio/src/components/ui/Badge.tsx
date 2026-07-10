import { cn } from '@/lib/utils';

interface TagProps {
  children: React.ReactNode;
  variant?: 'tech' | 'category' | 'match' | 'partial';
  className?: string;
}

const tagVariants = {
  tech: 'font-mono text-xs bg-[var(--bg-elevated)] text-lavender px-3 py-1 rounded-full',
  category: 'text-xs uppercase tracking-wider bg-pink-accent/15 text-pink-accent px-3 py-1 rounded-full',
  match: 'text-xs bg-mint/15 text-mint-dark dark:text-mint px-3 py-1 rounded-full flex items-center gap-1',
  partial: 'text-xs border border-sparkle/30 text-sparkle px-3 py-1 rounded-full',
};

export function Tag({ children, variant = 'tech', className }: TagProps) {
  return (
    <span className={cn(tagVariants[variant], className)}>
      {variant === 'match' && <span>✓</span>}
      {children}
    </span>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
        'bg-electric/10 text-electric border border-electric/20',
        className
      )}
    >
      {children}
    </span>
  );
}
