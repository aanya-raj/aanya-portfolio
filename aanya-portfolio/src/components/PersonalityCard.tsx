import { motion } from 'framer-motion';
import type { Personality } from '@/types';

interface PersonalityCardProps {
  personality: Personality;
  index: number;
  isVisible: boolean;
}

const cardGradients = [
  'from-[#7c5cff]/10 to-[#b8a9e8]/5',
  'from-[#a9e8d0]/10 to-[#e8a9c8]/5',
  'from-[#e8a9c8]/10 to-[#e8d5a9]/5',
];

const borderAccents = [
  'hover:border-electric/40',
  'hover:border-mint/40',
  'hover:border-pink-accent/40',
];

export function PersonalityCard({ personality, index, isVisible }: PersonalityCardProps) {
  const rotation = (index - 1) * 2; // -2, 0, 2

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: rotation * 2 }}
      animate={isVisible ? { opacity: 1, y: 0, rotate: rotation } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, type: 'spring', stiffness: 120 }}
      whileHover={{ rotate: 0, scale: 1.03, y: -4 }}
      className="cursor-default"
    >
      <div
        className={`relative rounded-2xl border border-[var(--border)] ${borderAccents[index]}
          bg-gradient-to-br ${cardGradients[index]} bg-[var(--bg-secondary)]
          p-6 md:p-8 transition-all duration-300 overflow-hidden
          shadow-sticker hover:shadow-float`}
      >
        {/* Corner decorations */}
        <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-electric/15 rounded-tl" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-electric/15 rounded-tr" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-electric/15 rounded-bl" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-electric/15 rounded-br" />

        {/* Emoji */}
        <div className="text-4xl mb-4">{personality.emoji}</div>

        {/* Archetype name */}
        <h3 className="font-display text-xl md:text-2xl text-[var(--text-primary)] mb-1">
          {personality.archetype}
        </h3>

        {/* Subtitle */}
        <p className="font-mono text-xs text-electric uppercase tracking-widest mb-4">
          {personality.title}
        </p>

        {/* Description */}
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {personality.description}
        </p>

        {/* Bottom sparkle */}
        <div className="absolute bottom-2 right-3 font-hand text-sm text-[var(--text-muted)]/40">
          ✦
        </div>
      </div>
    </motion.div>
  );
}
