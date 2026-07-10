import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Award, BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import { deckPulls } from '@/data/deck-pulls';
import { PersonalityCard } from '@/components/PersonalityCard';
import { Timeline } from '@/components/Timeline';
import { HobbyShelf } from '@/components/HobbyShelf';
import { StickerElement } from '@/components/StickerElement';
import { Button } from '@/components/ui/Button';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useContent } from '@/hooks/useContent';
import { Link } from 'react-router-dom';

// ─── Rotating scrapbook note ───────────────────────────────
function DeckPullNote() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * deckPulls.length));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, rotate: -1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: -1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="max-w-lg mx-auto mt-10"
    >
      <div className="relative rounded-xl border-2 border-dashed border-[var(--border)]
        bg-[var(--bg-primary)] px-6 py-5 shadow-sticker">
        <span className="absolute -top-4 left-6 text-2xl rotate-[15deg] select-none">🖇️</span>
        <p className="font-hand text-2xl text-[var(--text-primary)] mb-2">pulled from my deck</p>
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-sm text-[var(--text-secondary)] leading-relaxed min-h-[3rem]"
        >
          {deckPulls[idx]}
        </motion.p>
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={() => setIdx((i) => (i + 1 + Math.floor(Math.random() * (deckPulls.length - 1))) % deckPulls.length)}
            className="text-xs text-[var(--text-muted)] hover:text-electric transition-colors"
          >
            ↻ pull another
          </button>
          <span className="font-hand text-lg text-pink-accent rotate-[2deg]">✦ new one each visit</span>
        </div>
      </div>
    </motion.div>
  );
}

export function About() {
  const { personalities, experiences, hobbies, hero } = useContent();
  const { ref: introRef, isVisible: introVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const { ref: personalityRef, isVisible: personalityVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  // Parallax for the intro/avatar area
  const avatarParallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: avatarScroll } = useScroll({
    target: avatarParallaxRef,
    offset: ['start end', 'end start'],
  });
  const avatarY = useTransform(avatarScroll, [0, 1], [40, -40]);
  const stickersY = useTransform(avatarScroll, [0, 1], [20, -60]);
  const { ref: timelineRef, isVisible: timelineVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.05 });
  const { ref: hobbyRef, isVisible: hobbyVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
  const { ref: credRef, isVisible: credVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════ INTRO / AVATAR ═══════════════════════ */}
      <section className="pt-20 pb-16 px-6" ref={introRef}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={introVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center text-center"
          >
            {/* Kawaii Avatar with Parallax */}
            <div ref={avatarParallaxRef} className="relative mb-8">
              <motion.div
                style={{ y: avatarY }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <div className="w-40 h-40 md:w-52 md:h-52 rounded-3xl bg-gradient-oracle
                  flex items-center justify-center text-6xl md:text-7xl
                  shadow-glow-lg relative overflow-hidden"
                >
                  {hero.avatarUrl ? (
                    <img src={hero.avatarUrl} alt="Aanya" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
                      <span className="relative z-10">✦</span>
                    </>
                  )}
                </div>

                {/* Floating stickers around avatar - parallax offset */}
                <motion.div
                  style={{ y: stickersY }}
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-3 -right-3"
                >
                  <StickerElement rotation={12} variant="shadow">
                    <span className="inline-block px-2 py-1 rounded-lg bg-[var(--bg-secondary)]
                      border border-[var(--border)] text-sm">
                      🧠
                    </span>
                  </StickerElement>
                </motion.div>

                <motion.div
                  style={{ y: stickersY }}
                  animate={{ rotate: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -bottom-2 -left-3"
                >
                  <StickerElement rotation={-8} variant="shadow">
                    <span className="inline-block px-2 py-1 rounded-lg bg-[var(--bg-secondary)]
                      border border-[var(--border)] text-sm">
                      ⚡
                    </span>
                  </StickerElement>
                </motion.div>

                <motion.div
                  style={{ y: stickersY }}
                  animate={{ rotate: [0, 6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute top-1/2 -right-5"
                >
                  <StickerElement rotation={6} variant="shadow">
                    <span className="inline-block px-2 py-1 rounded-lg bg-[var(--bg-secondary)]
                      border border-[var(--border)] text-sm">
                      🎨
                    </span>
                  </StickerElement>
                </motion.div>
              </motion.div>
            </div>

            {/* Name + intro */}
            <h1 className="font-hand text-4xl md:text-5xl text-pink-accent mb-4 rotate-[-0.5deg]">
              hi, I'm Aanya
            </h1>

            <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl mb-3">
              I think in systems, design with intuition, and ship with intensity.
            </p>

            <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl mb-6">
              By day I architect LLM platforms and retrieval pipelines at Dürr Group.
              Four years in, I've learned that getting AI to production is 20% modeling
              and 80% caring about unglamorous things: evals, latency, failover, and
              whether the person using it can actually tell what's happening. I care
              a lot. It shows.
            </p>

            <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl">
              Off the clock I'm reading non-fiction at 2am, planning outfits like
              they're system architectures, or deep in a hyperfocus session where six
              hours pass like twenty minutes. I never separated the analytical side
              from the aesthetic one. They built this site together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ PERSONALITY CARDS ═══════════════════════ */}
      <section className="py-16 px-6 bg-[var(--bg-secondary)] border-t border-[var(--border)]" ref={personalityRef}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={personalityVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-display-sm text-[var(--text-primary)] mb-2">
              How I Work
            </h2>
            <p className="font-hand text-xl text-pink-accent rotate-[-0.5deg]">
              three cards, three qualities ✦
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {personalities.map((p, i) => (
              <PersonalityCard
                key={p.archetype}
                personality={p}
                index={i}
                isVisible={personalityVisible}
              />
            ))}
          </div>

          {/* INTP note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={personalityVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="text-center mt-8"
          >
            <StickerElement rotation={-1} variant="shadow">
              <span className="inline-block px-4 py-2 rounded-full
                bg-[var(--bg-elevated)] border border-[var(--border)]
                font-mono text-xs text-[var(--text-muted)]">
                INTP · The Logician — pattern recognition meets system thinking
              </span>
            </StickerElement>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ EXPERIENCE TIMELINE ═══════════════════════ */}
      <section className="py-section px-6" ref={timelineRef}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={timelineVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-display-sm text-[var(--text-primary)] mb-2">
              The Journey
            </h2>
            <p className="font-hand text-xl text-pink-accent rotate-[-0.5deg]">
              from freelance experiments to enterprise AI systems ✦
            </p>
          </motion.div>

          <Timeline experiences={experiences} />
        </div>
      </section>

      {/* ═══════════════════════ HOBBY SHELF ═══════════════════════ */}
      <section className="py-16 px-6 bg-[var(--bg-secondary)] border-t border-[var(--border)]" ref={hobbyRef}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={hobbyVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="font-display text-display-sm text-[var(--text-primary)] mb-2">
              Beyond the Code
            </h2>
            <p className="font-hand text-xl text-pink-accent rotate-[-0.5deg]">
              the things that make the work better ✦
            </p>
          </motion.div>

          <HobbyShelf hobbies={hobbies} />

          {/* Rotating scrapbook note */}
          <DeckPullNote />
        </div>
      </section>

      {/* ═══════════════════════ CREDENTIALS (Publication + Award) ═══════════════════════ */}
      <section className="py-section px-6" ref={credRef}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={credVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-display-sm text-[var(--text-primary)] mb-2">
              Credentials
            </h2>
            <p className="font-hand text-xl text-pink-accent rotate-[-0.5deg]">
              proof of work ✦
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Publication */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={credVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="md:col-span-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]
                p-6 hover:border-lavender/30 hover:shadow-glow transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-lavender/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-lavender" />
                </div>
                <div>
                  <p className="font-mono text-xs text-electric uppercase tracking-wider mb-1">
                    Publication
                  </p>
                  <h3 className="font-display text-base text-[var(--text-primary)] mb-1">
                    Healthcare Chatbot for Diabetic Patients Using Classification
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-2">
                    Springer · Lecture Notes in Networks and Systems (Vol. 425)
                  </p>
                  <p className="font-hand text-sm text-pink-accent">
                    where the journey started ✦
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Award */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={credVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]
                p-6 hover:border-sparkle/30 hover:shadow-glow transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-sparkle/10 flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-sparkle" />
                </div>
                <div>
                  <p className="font-mono text-xs text-electric uppercase tracking-wider mb-1">
                    Award · Apr 2025
                  </p>
                  <h3 className="font-display text-base text-[var(--text-primary)] mb-1">
                    Employee Spotlight Award
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-2">
                    Dürr Group · Global IT — Recognized for delivery reliability, leadership
                    across enterprise AI initiatives, rapid MVP execution and API development.
                  </p>
                  <p className="font-hand text-sm text-pink-accent">
                    the work speaks ✦
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Super Squad Award */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={credVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]
                p-6 hover:border-mint/30 hover:shadow-glow transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-mint/10 flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-mint" />
                </div>
                <div>
                  <p className="font-mono text-xs text-electric uppercase tracking-wider mb-1">
                    Award · Q1 2026
                  </p>
                  <h3 className="font-display text-base text-[var(--text-primary)] mb-1">
                    Super Squad Award
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-2">
                    Schenck RoTec / Dürr Group — for delivering Salesforce ML routing and
                    lead-time prediction; cited for "exceptional leadership and technical expertise."
                  </p>
                  <p className="font-hand text-sm text-pink-accent">
                    team wins are the best wins ✦
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ BOTTOM CTA ═══════════════════════ */}
      <section className="pb-section px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]
              p-8 md:p-10"
          >
            <p className="font-display text-2xl text-[var(--text-primary)] mb-3">
              Want to see if we'd work well together?
            </p>
            <p className="text-[var(--text-secondary)] mb-6">
              The Oracle reads job descriptions and tells you our compatibility.
              It's optimistic — but honest.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/playground">
                <Button variant="oracle" size="md">
                  <Sparkles className="w-4 h-4" />
                  Ask the Oracle
                </Button>
              </Link>
              <a href="mailto:aanya.rajsingh@yahoo.in">
                <Button variant="secondary" size="md">
                  Or just say hi
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
