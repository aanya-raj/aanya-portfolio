import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, ChevronDown, Wand2 } from 'lucide-react';
import { OracleChat } from '@/components/OracleChat';
import { TarotSpread } from '@/components/TarotSpread';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function Playground() {
  const { ref: oracleRef, isVisible: oracleVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.05 });
  const { ref: tipsRef, isVisible: tipsVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
  const [showFullOracle, setShowFullOracle] = useState(false);

  // Parallax for the oracle icon
  const iconRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: iconRef, offset: ['start start', 'end start'] });
  const iconY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════ HEADER ═══════════════════════ */}
      <section className="pt-20 pb-8 px-6" ref={iconRef}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            style={{ y: iconY }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-oracle
                flex items-center justify-center shadow-glow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <h1 className="font-display text-display-md md:text-display-lg text-[var(--text-primary)] mb-3">
              The Card Reader
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-lg mx-auto mb-2">
              Paste a job description. The deck has met Aanya, knows her stack and
              her gaps, and it will deal you an honest three-card reading: the match,
              the growth edges, the verdict.
            </p>
            <p className="font-hand text-xl text-pink-accent rotate-[-0.5deg]">
              no API keys were harmed, it all happens in your browser ✦
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ THE READING ═══════════════════════ */}
      <section className="px-6 pb-12" ref={oracleRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={oracleVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <TarotSpread />
        </motion.div>
      </section>

      {/* ═══════════════════════ HOW IT WORKS ═══════════════════════ */}
      <section className="px-6 pb-12" ref={tipsRef}>
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={tipsVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 md:p-8">
              <h3 className="font-display text-lg text-[var(--text-primary)] mb-5">
                How the deck works
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-electric/10 flex items-center
                    justify-center flex-shrink-0">
                    <span className="font-mono text-sm text-electric">01</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)] mb-0.5">
                      Paste any job description
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      The requirements section alone is enough for a reading
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-lavender/10 flex items-center
                    justify-center flex-shrink-0">
                    <span className="font-mono text-sm text-lavender">02</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)] mb-0.5">
                      Weighted skill matching, right here in your browser
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      The JD is scored against her actual stack: core daily-drivers count
                      more, named gaps count against. No server, no tokens, no tracking.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-pink-accent/10 flex items-center
                    justify-center flex-shrink-0">
                    <span className="font-mono text-sm text-pink-accent">03</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)] mb-0.5">
                      Three cards, no fluff
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      The match, the honest growth edges, and a verdict. The same way
                      she evaluates roles herself
                    </p>
                  </div>
                </div>
              </div>

              {/* Tech note */}
              <div className="mt-6 pt-5 border-t border-[var(--border)]">
                <div className="flex items-start gap-3">
                  <Brain className="w-4 h-4 text-[var(--text-muted)] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    <span className="text-[var(--text-secondary)] font-medium">Why no LLM?</span>{' '}
                    Deliberate. A portfolio demo should work for every visitor, instantly,
                    at zero cost. So this one is a hand-tuned lexicon matcher: about 40
                    weighted skills, honest gap detection, deterministic scoring. Knowing
                    when <em>not</em> to use an LLM is also the job.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ OPTIONAL: FULL LLM ORACLE ═══════════════════════ */}
      <section className="px-6 pb-section">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setShowFullOracle(!showFullOracle)}
            className="w-full rounded-2xl border border-dashed border-[var(--border)] p-6 text-center
              hover:border-electric/30 transition-colors group"
          >
            <Wand2 className="w-5 h-5 text-[var(--text-muted)] group-hover:text-electric mx-auto mb-2 transition-colors" />
            <p className="text-sm text-[var(--text-secondary)] mb-1">
              Want the full LLM Oracle instead?
            </p>
            <p className="text-xs text-[var(--text-muted)] mb-2">
              Bring your own free HuggingFace token and a real language model reads
              the cards. Your token never leaves your browser.
            </p>
            <ChevronDown
              className={`w-4 h-4 text-[var(--text-muted)] mx-auto transition-transform ${showFullOracle ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {showFullOracle && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-8">
                  <OracleChat />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
