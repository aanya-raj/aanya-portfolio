import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

// Original mini-arcana. One per draw, engineer edition.
const dailyCards = [
  { name: 'The Debugger', emoji: '🔍', meaning: 'a problem you have been avoiding will fall to one well-placed print statement. today is the day.' },
  { name: 'The Refactor', emoji: '🌀', meaning: 'something you built in a hurry wants a second look. it will thank you later.' },
  { name: 'The Shipment', emoji: '🚀', meaning: 'stop polishing. it is ready. send it.' },
  { name: 'The Hyperfocus', emoji: '🧠', meaning: 'guard the next six hours with your life. silence the phone.' },
  { name: 'The Rubber Duck', emoji: '🦆', meaning: 'say the problem out loud. yes, out loud. watch what happens.' },
  { name: 'The Merge Conflict', emoji: '⚔️', meaning: 'two truths cannot both be main. choose gently, commit firmly.' },
  { name: 'The Golden Hour', emoji: '🌇', meaning: 'log off early enough to actually see it. the code will keep.' },
  { name: 'The Cache', emoji: '💾', meaning: 'the answer you seek was already computed. check before you recompute.' },
];

export function NotFound() {
  const [drawn, setDrawn] = useState<(typeof dailyCards)[number] | null>(null);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-7xl mb-6"
        >
          🔮
        </motion.div>

        <h1 className="font-display text-display-md text-[var(--text-primary)] mb-3">
          404
        </h1>
        <p className="font-hand text-2xl text-pink-accent mb-2 rotate-[-0.5deg]">
          this card isn't in the deck ✦
        </p>
        <p className="text-[var(--text-secondary)] mb-8">
          The page you're looking for doesn't exist or has been moved.
          But since you're here, the deck owes you something.
        </p>

        {/* Draw today's card */}
        <div className="mb-8" style={{ perspective: '1000px' }}>
          {!drawn ? (
            <motion.button
              onClick={() => setDrawn(dailyCards[Math.floor(Math.random() * dailyCards.length)])}
              whileHover={{ y: -6, rotate: 0 }}
              initial={{ rotate: -2 }}
              className="relative w-36 h-52 mx-auto rounded-2xl border border-electric/30
                bg-gradient-to-b from-[var(--bg-elevated)] to-[var(--bg-secondary)]
                shadow-card hover:shadow-glow transition-shadow cursor-pointer"
            >
              <div className="absolute inset-2 rounded-xl border border-[var(--border)]/60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl text-electric/40">✦</span>
              </div>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap
                font-hand text-lg text-pink-accent">
                draw today's card ✦
              </span>
            </motion.button>
          ) : (
            <motion.div
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative w-64 mx-auto rounded-2xl border border-electric/30
                bg-[var(--bg-secondary)] shadow-glow p-6"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-oracle rounded-t-2xl" />
              <div className="text-4xl mb-3 mt-1">{drawn.emoji}</div>
              <h3 className="font-display text-xl text-[var(--text-primary)] mb-2">{drawn.name}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">{drawn.meaning}</p>
              <button
                onClick={() => setDrawn(dailyCards[Math.floor(Math.random() * dailyCards.length)])}
                className="text-xs text-[var(--text-muted)] hover:text-electric transition-colors"
              >
                ↻ draw again
              </button>
            </motion.div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          <Link to="/">
            <Button variant="primary" size="md">
              <ArrowLeft className="w-4 h-4" />
              Back home
            </Button>
          </Link>
          <Link to="/playground">
            <Button variant="secondary" size="md">
              Visit the Card Reader
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
