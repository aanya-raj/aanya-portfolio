import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { readTheCards, type ReadingResult } from '@/lib/tarot-reading';

type Phase = 'input' | 'shuffling' | 'revealed';

const SAMPLE_JD = `Senior AI Engineer — LLM Platform (Remote)
We're looking for an engineer with 3+ years of experience building production LLM systems. You'll own our RAG pipeline end-to-end: retrieval quality, evals, latency, and cost. Requirements: strong Python, FastAPI or similar async backend experience, vector search (FAISS/Pinecone), LangChain or LangGraph, Azure or AWS, Docker/Kubernetes, CI/CD. Nice to have: fine-tuning experience, observability (OpenTelemetry), streaming UX.`;

export function TarotSpread() {
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<Phase>('input');
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [revealedCards, setRevealedCards] = useState(0);

  const handleRead = () => {
    if (!input.trim()) return;
    const reading = readTheCards(input);
    setResult(reading);
    if (reading.kind === 'not-a-jd') {
      setPhase('revealed');
      setRevealedCards(0);
      return;
    }
    setPhase('shuffling');
    setRevealedCards(0);
    // deal the three cards one by one
    setTimeout(() => { setPhase('revealed'); setRevealedCards(1); }, 1400);
    setTimeout(() => setRevealedCards(2), 2100);
    setTimeout(() => setRevealedCards(3), 2800);
  };

  const handleReset = () => {
    setPhase('input');
    setResult(null);
    setInput('');
    setRevealedCards(0);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* ── Input ── */}
      {phase === 'input' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]
            overflow-hidden focus-within:border-electric/40 focus-within:shadow-glow transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste a job description here. The requirements section alone is enough..."
              rows={7}
              className="w-full px-5 py-4 bg-transparent text-sm text-[var(--text-primary)]
                placeholder:text-[var(--text-muted)] resize-none focus:outline-none"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-t border-[var(--border)]">
              <button
                onClick={() => setInput(SAMPLE_JD)}
                className="text-xs text-[var(--text-muted)] hover:text-electric transition-colors"
              >
                no JD handy? try a sample ✦
              </button>
              <Button
                variant="oracle"
                size="sm"
                onClick={handleRead}
                disabled={!input.trim()}
                className={!input.trim() ? 'opacity-50 cursor-not-allowed' : ''}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Read My Cards
              </Button>
            </div>
          </div>
          <p className="text-xs text-[var(--text-muted)] text-center mt-3">
            Runs entirely in your browser. No AI tokens burned, nothing sent anywhere, nothing stored.
          </p>
        </motion.div>
      )}

      {/* ── Shuffle animation ── */}
      <AnimatePresence>
        {phase === 'shuffling' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-16"
          >
            <div className="relative w-24 h-36 mb-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    rotate: [0, (i - 1) * 18, (i - 1) * -12, 0],
                    x: [0, (i - 1) * 30, (i - 1) * -18, 0],
                    y: [i * -3, -14 + i * -4, i * -2, i * -3],
                  }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.09 }}
                  className="absolute inset-0 rounded-xl border border-electric/25
                    bg-gradient-to-b from-[var(--bg-elevated)] to-[var(--bg-secondary)] shadow-card"
                  style={{ zIndex: 3 - i }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-electric/40 text-xl">✦</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="font-hand text-xl text-pink-accent">reading the spread... ✦</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Not a JD ── */}
      {phase === 'revealed' && result?.kind === 'not-a-jd' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-pink-accent/30 bg-pink-accent/5 p-6 text-center"
        >
          <p className="text-sm text-[var(--text-primary)] mb-4">{result.message}</p>
          <Button variant="secondary" size="sm" onClick={handleReset}>
            <RotateCcw className="w-3.5 h-3.5" /> Try again
          </Button>
        </motion.div>
      )}

      {/* ── The three-card spread ── */}
      {phase === 'revealed' && result?.kind === 'reading' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 items-stretch">
            {/* Card I — The Match */}
            <SpreadCard revealed={revealedCards >= 1} numeral="I" title="The Match" accent="#7c5cff" delay={0}>
              <div className="flex items-baseline gap-2 mb-3">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={revealedCards >= 1 ? { opacity: 1 } : {}}
                  transition={{ duration: 0.8 }}
                  className="font-mono text-4xl font-bold text-electric"
                >
                  {result.score}%
                </motion.span>
                <span className="text-xs text-[var(--text-muted)]">compatibility</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={revealedCards >= 1 ? { width: `${result.score}%` } : {}}
                  transition={{ duration: 1.1, ease: 'easeOut', delay: 0.2 }}
                  className="h-full rounded-full bg-gradient-oracle"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.matches.map((m) => (
                  <span
                    key={m.skill}
                    className={`px-2 py-0.5 rounded-full text-[11px] border
                      ${m.weight === 3
                        ? 'border-electric/30 bg-electric/10 text-electric font-medium'
                        : 'border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]'}`}
                  >
                    {m.skill}
                  </span>
                ))}
                {result.matches.length === 0 && (
                  <span className="text-xs text-[var(--text-muted)]">the overlap is hiding between the lines</span>
                )}
              </div>
            </SpreadCard>

            {/* Card II — The Growth Edge */}
            <SpreadCard revealed={revealedCards >= 2} numeral="II" title="The Growth Edge" accent="#e8a9c8" delay={0.1}>
              {result.edges.length > 0 ? (
                <ul className="space-y-2.5">
                  {result.edges.map((e) => (
                    <li key={e.skill} className="text-xs leading-relaxed">
                      <span className="text-[var(--text-primary)] font-medium">{e.skill}</span>
                      <span className="text-[var(--text-muted)]">: {e.note}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  No named gaps in this one. Either the role was written for her,
                  or it is keeping its secrets. Ask her directly, she will tell you.
                </p>
              )}
            </SpreadCard>

            {/* Card III — The Verdict */}
            <SpreadCard revealed={revealedCards >= 3} numeral="III" title={result.arcana} accent="#a9e8d0" delay={0.2}>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                {result.verdict}
              </p>
              <p className="font-hand text-sm text-pink-accent leading-snug">
                {result.vibe}
              </p>
            </SpreadCard>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={revealedCards >= 3 ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
          >
            <Link to="/contact">
              <Button variant="primary" size="md">
                The cards say talk to her <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="md" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" /> Read another
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ─── Single card with flip reveal ───────────────────────────────
function SpreadCard({
  revealed, numeral, title, accent, delay, children,
}: {
  revealed: boolean;
  numeral: string;
  title: string;
  accent: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <div style={{ perspective: '1200px' }}>
      <motion.div
        initial={{ rotateY: 180, opacity: 0, y: 20 }}
        animate={revealed ? { rotateY: 0, opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
        className="h-full rounded-2xl border bg-[var(--bg-secondary)] p-5 relative overflow-hidden shadow-card"
      >
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: accent }} />
        <div className="flex items-center justify-between mb-3 mt-1">
          <span className="font-display text-2xl" style={{ color: `${accent}70` }}>{numeral}</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">{title}</span>
        </div>
        {children}
        <div className="absolute bottom-2 right-3 select-none pointer-events-none text-sm" style={{ color: `${accent}50` }}>✦</div>
      </motion.div>
    </div>
  );
}
