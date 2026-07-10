import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import type { Theme } from '@/types';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="relative w-10 h-10 rounded-full flex items-center justify-center
        hover:bg-[var(--bg-elevated)] transition-colors duration-200"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div
        key={theme}
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 90 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {theme === 'dark' ? (
          <Moon className="w-5 h-5 text-lavender" />
        ) : (
          <Sun className="w-5 h-5 text-electric" />
        )}
      </motion.div>
    </button>
  );
}
