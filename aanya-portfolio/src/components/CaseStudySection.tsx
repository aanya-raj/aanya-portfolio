import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useCountUp } from '@/hooks/useCountUp';

interface CaseStudySectionProps {
  variant: 'problem' | 'approach' | 'build' | 'result';
  content: string;
  metrics?: { label: string; value: string }[];
}

const washiColors: Record<string, string> = {
  problem: 'rgba(232, 169, 200, 0.35)',
  approach: 'rgba(184, 169, 232, 0.35)',
  build: 'rgba(124, 92, 255, 0.28)',
  result: 'rgba(169, 232, 208, 0.4)',
};

const variantConfig = {
  problem: {
    label: '01',
    title: 'The Problem',
    emoji: '🔍',
    accentColor: 'text-pink-accent',
    borderColor: 'border-pink-accent/20',
    bgGlow: 'bg-pink-accent/5',
  },
  approach: {
    label: '02',
    title: 'The Approach',
    emoji: '🧭',
    accentColor: 'text-lavender',
    borderColor: 'border-lavender/20',
    bgGlow: 'bg-lavender/5',
  },
  build: {
    label: '03',
    title: 'The Build',
    emoji: '⚡',
    accentColor: 'text-electric',
    borderColor: 'border-electric/20',
    bgGlow: 'bg-electric/5',
  },
  result: {
    label: '04',
    title: 'The Result',
    emoji: '✦',
    accentColor: 'text-mint',
    borderColor: 'border-mint/20',
    bgGlow: 'bg-mint/5',
  },
};

function MetricDisplay({ label, value, isVisible }: { label: string; value: string; isVisible: boolean }) {
  // Try to extract number for animation
  const numMatch = value.match(/^[\+]?(\d+)/);
  const numValue = numMatch ? parseInt(numMatch[1]) : null;
  const prefix = value.startsWith('+') ? '+' : '';
  const suffix = numMatch ? value.slice(numMatch[0].length - (prefix ? 1 : 0) + (prefix ? 1 : 0)) : '';
  const animatedNum = useCountUp(numValue ?? 0, isVisible && numValue !== null, 1800);

  return (
    <div className="text-center p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
      <div className="font-mono text-2xl md:text-3xl font-medium text-electric mb-1">
        {numValue !== null ? `${prefix}${animatedNum}${suffix.replace(prefix,'')}` : value}
      </div>
      <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

export function CaseStudySection({ variant, content, metrics }: CaseStudySectionProps) {
  const config = variantConfig[variant];
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="relative"
    >
      {/* Washi tape strip holding the card down */}
      <div
        aria-hidden="true"
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-7 z-10 rotate-[-2deg]
          backdrop-blur-[1px] shadow-sm"
        style={{
          backgroundColor: washiColors[variant],
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.25) 0 6px, transparent 6px 12px)',
          clipPath: 'polygon(2% 0, 98% 4%, 100% 96%, 0 100%)',
        }}
      />

      {/* Section card */}
      <div className={`relative rounded-2xl border ${config.borderColor} bg-[var(--bg-secondary)] p-6 md:p-8 overflow-hidden`}>
        {/* Background glow */}
        <div className={`absolute -top-12 -right-12 w-40 h-40 ${config.bgGlow} rounded-full blur-[60px] pointer-events-none`} />

        {/* Label row */}
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <span className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest">
            {config.label}
          </span>
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="text-lg">{config.emoji}</span>
        </div>

        {/* Title */}
        <h3 className={`font-display text-2xl md:text-3xl ${config.accentColor} mb-4 relative z-10`}>
          {config.title}
        </h3>

        {/* Content */}
        <p className="text-[var(--text-secondary)] leading-relaxed text-base md:text-lg relative z-10">
          {content}
        </p>

        {/* Metrics grid for result section */}
        {variant === 'result' && metrics && metrics.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 relative z-10">
            {metrics.map((m) => (
              <MetricDisplay key={m.label} label={m.label} value={m.value} isVisible={isVisible} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
