import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { TarotCard } from '@/components/TarotCard';
import { StickerElement } from '@/components/StickerElement';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useContent } from '@/hooks/useContent';

type Category = 'all' | 'llm-systems' | 'ml-nlp' | 'automation' | 'research';

const categories: { key: Category; label: string; emoji: string }[] = [
  { key: 'all', label: 'All', emoji: '✦' },
  { key: 'llm-systems', label: 'LLM Systems', emoji: '🧠' },
  { key: 'ml-nlp', label: 'ML / NLP', emoji: '🔬' },
  { key: 'automation', label: 'Automation', emoji: '⚡' },
  { key: 'research', label: 'Research', emoji: '📄' },
];

export function Projects() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const { projects } = useContent();
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.05 });

  // Parallax for header
  const parallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ['start start', 'end start'] });
  const headerY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const filtered = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════ HEADER ═══════════════════════ */}
      <section className="pt-20 pb-8 px-6" ref={(el) => { (headerRef as any).current = el; (parallaxRef as any).current = el; }}>
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            style={{ y: headerY }}
            initial={{ opacity: 0, y: 20 }}
            animate={headerVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative sticker */}
            <StickerElement rotation={-3} variant="shadow" className="mb-4 inline-block">
              <span className="inline-block px-4 py-1.5 rounded-full bg-electric/10
                border border-electric/20 font-mono text-xs text-electric">
                {projects.length} cards · 4 years of shipping
              </span>
            </StickerElement>

            <h1 className="font-display text-display-md md:text-display-lg text-[var(--text-primary)] mb-4">
              The Cards
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto mb-2">
              Six cards, four years. Each one cost her some sleep and taught her
              something a tutorial never could.
            </p>
            <p className="font-hand text-xl text-pink-accent rotate-[-0.5deg]">
              the deck insists you flip one ✦
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ FILTERS ═══════════════════════ */}
      <section className="px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${activeCategory === cat.key
                    ? 'bg-electric text-white shadow-glow'
                    : 'bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-electric/30'
                  }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ CARD GRID ═══════════════════════ */}
      <section className="px-6 pb-section" ref={gridRef}>
        <div className="max-w-6xl mx-auto">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <motion.div
                  key={project.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <TarotCard
                    project={project}
                    index={i}
                    isVisible={gridVisible}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="font-hand text-2xl text-pink-accent">
                no cards in this suit... yet ✦
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════════════════════ BOTTOM DECORATION ═══════════════════════ */}
      <section className="pb-12 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block border-t border-[var(--border)] pt-8">
            <p className="font-hand text-lg text-[var(--text-muted)]">
              every system I build teaches me something I couldn't learn any other way ✦
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
