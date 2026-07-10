import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'oracle';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variants = {
  primary: `bg-electric text-white hover:bg-electric-light shadow-glow
    hover:shadow-glow-lg transition-all duration-300`,
  secondary: `border border-lavender text-lavender hover:bg-lavender/10
    transition-all duration-300`,
  ghost: `text-[var(--text-secondary)] hover:text-[var(--text-primary)]
    relative after:absolute after:bottom-0 after:left-0 after:h-[1px]
    after:w-0 hover:after:w-full after:bg-electric after:transition-all
    after:duration-300`,
  oracle: `bg-gradient-oracle text-white font-medium
    hover:shadow-glow-lg transition-all duration-300
    relative overflow-hidden
    before:absolute before:inset-0 before:bg-gradient-to-r
    before:from-transparent before:via-white/20 before:to-transparent
    before:translate-x-[-200%] hover:before:translate-x-[200%]
    before:transition-transform before:duration-700`,
};

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-2xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'font-body font-medium inline-flex items-center justify-center gap-2',
        variants[variant],
        sizes[size],
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
