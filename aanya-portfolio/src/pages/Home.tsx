import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SparkleField } from '@/components/SparkleField';
import { MetricsBar } from '@/components/MetricsBar';
import { TarotCard } from '@/components/TarotCard';
import { TechConstellation } from '@/components/TechConstellation';
import { StickerElement } from '@/components/StickerElement';
import { Button } from '@/components/ui/Button';
import { useTypewriter } from '@/hooks/useTypewriter';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useContent } from '@/hooks/useContent';

const featuredSlugs = [
  'genai-chat-platform',
  'rag-document-intelligence',
  'salesforce-ticket-routing',
];

export function Home() {
  const { projects, hero } = useContent();
  const typedText = useTypewriter(hero.subtitles, 90, 50, 2200);
  const featuredProjects = projects.filter((p) => featuredSlugs.includes(p.slug));
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const { ref: teaserRef, isVisible: teaserVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.3 });

  // Parallax for hero section
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroScroll, [0, 1], [0, 150]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const orbY1 = useTransform(heroScroll, [0, 1], [0, -80]);
  const orbY2 = useTransform(heroScroll, [0, 1], [0, -120]);
  const orbScale = useTransform(heroScroll, [0, 1], [1, 1.3]);

  return (
    <div>
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section ref={heroRef} className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
        {/* Sparkle background */}
        <SparkleField count={35} speed={0.25} />

        {/* Parallax gradient orbs */}
        <motion.div style={{ y: orbY1, scale: orbScale }} className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric/5 rounded-full blur-[120px] pointer-events-none" />
        <motion.div style={{ y: orbY2, scale: orbScale }} className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Pre-title sticker */}
          <motion.div
            initial={{ opacity: 0, y: -10, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: -3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <StickerElement rotation={-2} variant="shadow">
              <span className="inline-block px-4 py-1.5 rounded-full bg-electric/10
                border border-electric/20 font-mono text-xs text-electric">
                AI Engineer · Noida, IN
              </span>
            </StickerElement>
          </motion.div>

          {/* Main name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="font-display text-[clamp(2.5rem,8vw,5rem)] leading-[1.05] tracking-[-0.02em]
              text-[var(--text-primary)] mb-4"
          >
            Aanya Raj Singh
          </motion.h1>

          {/* Typewriter subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="h-10 flex items-center justify-center mb-6"
          >
            <span className="font-display text-xl md:text-2xl text-lavender italic">
              {typedText}
            </span>
            <span className="inline-block w-[2px] h-6 bg-electric ml-1 animate-pulse" />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {hero.description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/projects">
              <Button variant="primary" size="lg">
                View Projects
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/playground">
              <Button variant="oracle" size="lg">
                <Sparkles className="w-4 h-4" />
                Ask the Oracle
              </Button>
            </Link>
          </motion.div>

          {/* Handwritten note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="mt-8 font-hand text-lg text-pink-accent rotate-[-1deg]"
          >
            {hero.tagline}
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border-2 border-[var(--text-muted)]/30 flex justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-[var(--text-muted)]/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════ METRICS ═══════════════════════ */}
      <section className="border-t border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <MetricsBar />
      </section>

      {/* ═══════════════════════ FEATURED PROJECTS ═══════════════════════ */}
      <section className="py-section px-6" ref={cardsRef}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={cardsVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-display-sm md:text-display-md text-[var(--text-primary)] mb-3">
              Selected Works
            </h2>
            <p className="font-hand text-xl text-pink-accent rotate-[-0.5deg]">
              flip a card to see the story ✦
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-10">
            {featuredProjects.map((project, i) => (
              <TarotCard
                key={project.slug}
                project={project}
                index={i}
                isVisible={cardsVisible}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={cardsVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center"
          >
            <Link to="/projects">
              <Button variant="ghost" size="md">
                See all projects <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ TECH CONSTELLATION ═══════════════════════ */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <TechConstellation />
      </section>

      {/* ═══════════════════════ ABOUT TEASER ═══════════════════════ */}
      <section className="py-section px-6" ref={teaserRef}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={teaserVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)]
              p-8 md:p-12 overflow-hidden"
          >
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-electric/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-accent/5 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-oracle
                    flex items-center justify-center text-5xl
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
                </motion.div>
              </div>

              <div className="text-center md:text-left">
                <h3 className="font-hand text-3xl text-pink-accent mb-2 rotate-[-0.5deg]">
                  hi, I'm Aanya
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-4 text-base md:text-lg">
                  Four years ago I was freelancing my way through every ML problem
                  the internet would pay me to solve. Now I architect LLM platforms
                  for a global engineering group. The common thread: I like hard
                  problems, pretty interfaces, and systems that don't fall over at 2am.
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                  {['📚 Non-fiction', '🚗 Cars & driving', '👗 Fashion', '🧠 Hyperfocus', '🔍 Problem solver'].map(
                    (hobby, i) => (
                      <StickerElement key={hobby} rotation={(i % 3) - 1} variant="shadow">
                        <span
                          className="inline-block px-3 py-1.5 rounded-full text-sm
                            bg-[var(--bg-elevated)] border border-[var(--border)]
                            text-[var(--text-secondary)]"
                        >
                          {hobby}
                        </span>
                      </StickerElement>
                    )
                  )}
                </div>
                <Link to="/about">
                  <Button variant="secondary" size="sm">
                    More about me <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Sticker decoration */}
            <div className="absolute -bottom-2 -right-2 font-hand text-6xl opacity-10
              select-none pointer-events-none rotate-12">
              ✦
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ FINAL CTA ═══════════════════════ */}
      <section
        ref={ctaRef}
        className="py-section px-6 border-t border-[var(--border)] bg-[var(--bg-secondary)]"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ctaVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="font-display text-display-sm md:text-display-md text-[var(--text-primary)] mb-4">
            The next card is unwritten.
          </h2>
          <p className="text-[var(--text-secondary)] mb-8 text-lg">
            I'm looking for a senior remote role where I own AI systems end to end.
            Real problems, high standards, any timezone. If that sounds like your
            team, the deck already likes you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="mailto:aanya.rajsingh@yahoo.in">
              <Button variant="primary" size="lg">
                Get in touch
              </Button>
            </a>
            <Link to="/playground">
              <Button variant="secondary" size="lg">
                <Sparkles className="w-4 h-4" />
                Check compatibility
              </Button>
            </Link>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={ctaVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="mt-6 font-hand text-lg text-pink-accent rotate-[-0.5deg]"
          >
            the right abstraction changes everything ✦
          </motion.p>
        </motion.div>
      </section>
    </div>
  );
}
