import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Code2, Sparkles } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { Experience } from '@/types';

interface TimelineProps {
  experiences: Experience[];
}

const iconMap: Record<string, React.ReactNode> = {
  'Dürr Group': <Briefcase className="w-4 h-4" />,
  'Flex Data Private Limited': <Code2 className="w-4 h-4" />,
  'Freelance': <Sparkles className="w-4 h-4" />,
  'MJPRU, Bareilly': <GraduationCap className="w-4 h-4" />,
};

const stickerEmojis = ['⚡', '🔮', '💫', '🎓'];

function TimelineItem({ experience, index, isLast }: { experience: Experience; index: number; isLast: boolean }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div ref={ref} className="relative flex items-start gap-6 md:gap-8">
      {/* Timeline dot + line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={isVisible ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1, type: 'spring', stiffness: 200 }}
          className={`w-10 h-10 rounded-full flex items-center justify-center
            border-2 transition-colors duration-300 z-10
            ${experience.type === 'current'
              ? 'border-electric bg-electric/20 text-electric'
              : 'border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-muted)]'
            }`}
        >
          {iconMap[experience.company] || <Briefcase className="w-4 h-4" />}
        </motion.div>
        {/* Connecting line */}
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isVisible ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-px h-full min-h-[40px] bg-[var(--border)] origin-top"
          />
        )}
      </div>

      {/* Content card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 pb-10"
      >
        <div className={`relative rounded-xl border bg-[var(--bg-secondary)] p-5 md:p-6
          transition-all duration-300
          ${experience.type === 'current'
            ? 'border-electric/20 hover:border-electric/40 hover:shadow-glow'
            : 'border-[var(--border)] hover:border-lavender/30'
          }`}
        >
          {/* Current badge */}
          {experience.type === 'current' && (
            <div className="absolute -top-2.5 right-4">
              <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-mono
                uppercase tracking-widest bg-electric text-white">
                Current
              </span>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-3">
            <div>
              <h3 className="font-display text-lg text-[var(--text-primary)]">
                {experience.role}
              </h3>
              <p className="text-sm text-lavender font-medium">
                {experience.company}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <span className="font-mono">{experience.period}</span>
              <span>·</span>
              <span>{experience.location}</span>
            </div>
          </div>

          {/* Highlights */}
          <ul className="space-y-1.5">
            {experience.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span className="text-electric mt-1 flex-shrink-0 text-xs">✦</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>

          {/* Sticker decoration */}
          <div
            className="absolute -bottom-3 -right-2 text-2xl select-none pointer-events-none opacity-30"
            style={{ transform: `rotate(${(index * 7) - 5}deg)` }}
          >
            {stickerEmojis[index] || '✦'}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function Timeline({ experiences }: TimelineProps) {
  return (
    <div className="relative">
      {experiences.map((exp, i) => (
        <TimelineItem key={exp.company} experience={exp} index={i} isLast={i === experiences.length - 1} />
      ))}
    </div>
  );
}
