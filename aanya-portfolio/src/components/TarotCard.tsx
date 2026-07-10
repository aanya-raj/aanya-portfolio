import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Tag } from '@/components/ui/Badge';
import type { Project } from '@/types';

interface TarotCardProps {
  project: Project;
  index: number;
  isVisible: boolean;
}

export function TarotCard({ project, index, isVisible }: TarotCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: 'easeOut' }}
      className="perspective-1000 cursor-pointer group"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full aspect-[3/4] md:aspect-[2/3]"
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden border border-[var(--border)]
            bg-gradient-to-b from-[var(--bg-elevated)] to-[var(--bg-secondary)]
            flex flex-col items-center justify-center p-6 text-center
            group-hover:border-electric/30 transition-colors duration-300"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Holographic shimmer on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
              bg-gradient-to-br from-lavender/5 via-electric/5 to-pink-accent/5"
          />

          {/* Decorative top line */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <span className="font-mono text-xs text-[var(--text-muted)]">
              {project.number}
            </span>
            <span className="font-mono text-xs text-[var(--text-muted)]">✦</span>
          </div>

          {/* Card number - large */}
          <span className="font-display text-6xl md:text-7xl text-electric/20 mb-4">
            {project.number}
          </span>

          {/* Title */}
          <h3 className="font-display text-xl md:text-2xl text-[var(--text-primary)] mb-2 relative z-10">
            {project.title}
          </h3>

          {/* Category */}
          <Tag variant="category">{project.category.replace('-', ' / ')}</Tag>

          {/* Decorative bottom */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <span className="font-hand text-sm text-[var(--text-muted)]">
              hover to reveal ✦
            </span>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-electric/20 rounded-tl-md" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-electric/20 rounded-tr-md" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-electric/20 rounded-bl-md" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-electric/20 rounded-br-md" />
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden border border-electric/30
            bg-[var(--bg-secondary)] flex flex-col justify-between p-6"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {/* Gradient accent top bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-oracle" />

          <div>
            <span className="font-mono text-xs text-electric mb-2 block">
              {project.number}
            </span>
            <h3 className="font-display text-xl text-[var(--text-primary)] mb-3">
              {project.title}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              {project.summary}
            </p>

            {/* Key metric */}
            {project.metrics[0] && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
                bg-electric/10 border border-electric/20">
                <span className="font-mono text-lg text-electric font-medium">
                  {project.metrics[0].value}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {project.metrics[0].label}
                </span>
              </div>
            )}
          </div>

          {/* Tech tags + CTA */}
          <div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tech.slice(0, 4).map((t) => (
                <Tag key={t} variant="tech">{t}</Tag>
              ))}
            </div>
            <Link
              to={`/projects/${project.slug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-electric
                hover:gap-3 transition-all duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              Read case study <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
