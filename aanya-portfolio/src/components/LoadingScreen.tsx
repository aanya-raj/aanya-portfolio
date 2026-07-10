import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  isLoading: boolean;
}

const CARD_COUNT = 6;
const CARD_COLORS = ['#7c5cff', '#b8a9e8', '#e8a9c8', '#a9e8d0', '#e8d5a9', '#d4629e'];
const CARD_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI'];

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: 'blur(8px)',
            transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center
            bg-[var(--bg-primary)] overflow-hidden"
        >
          {/* Background gradient orbs */}
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-electric/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-pink-accent/5 rounded-full blur-[80px]" />

          {/* Card deck area */}
          <div className="relative w-40 h-56 md:w-48 md:h-64 mb-8">
            {Array.from({ length: CARD_COUNT }).map((_, i) => (
              <TarotShuffleCard key={i} index={i} total={CARD_COUNT} />
            ))}
          </div>

          {/* Name reveal */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="font-display text-2xl md:text-3xl text-[var(--text-primary)] mb-2"
          >
            Aanya Raj Singh
          </motion.h1>

          {/* Shuffling text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0.7, 1] }}
            transition={{ delay: 0.3, duration: 1.5 }}
            className="font-hand text-lg text-pink-accent"
          >
            shuffling the deck... ✦
          </motion.p>

          {/* Loading bar */}
          <motion.div
            className="mt-4 h-[2px] rounded-full bg-gradient-oracle overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: 140 }}
            transition={{ delay: 0.4, duration: 1.8, ease: [0.23, 1, 0.32, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TarotShuffleCard({ index, total }: { index: number; total: number }) {
  // Phase 1 (0–0.4s): Cards start stacked, then fan out
  // Phase 2 (0.4–1.2s): Cards shuffle (move around, rotate)
  // Phase 3 (1.2–1.8s): Cards collect back into a neat stack

  const baseDelay = index * 0.06;
  const fanAngle = ((index - (total - 1) / 2) / total) * 40; // -20 to +20 degrees
  const fanX = ((index - (total - 1) / 2) / total) * 100; // horizontal spread

  return (
    <motion.div
      className="absolute inset-0"
      initial={{
        rotate: 0,
        x: 0,
        y: index * -2,
        scale: 1,
        zIndex: index,
      }}
      animate={{
        // Keyframed: fan out → shuffle → collect
        rotate: [
          0,                           // 0: stacked
          fanAngle,                     // 1: fan out
          fanAngle + (Math.random() - 0.5) * 30,  // 2: shuffle jitter
          (Math.random() - 0.5) * 15,  // 3: mid shuffle
          fanAngle * 0.3,              // 4: collecting
          0,                           // 5: stacked
        ],
        x: [
          0,                           // 0: stacked
          fanX,                        // 1: fan out
          (Math.random() - 0.5) * 80,  // 2: shuffle
          (Math.random() - 0.5) * 60,  // 3: mid shuffle
          fanX * 0.2,                  // 4: collecting
          0,                           // 5: stacked
        ],
        y: [
          index * -2,                  // 0: stacked
          -20 + index * -3,            // 1: fan lifts up
          (Math.random() - 0.5) * 40,  // 2: shuffle scatter
          (Math.random() - 0.5) * 30,  // 3: mid shuffle
          index * -2,                  // 4: collecting
          index * -1.5,                // 5: neat stack
        ],
        scale: [1, 1, 0.95, 1.02, 1, 1],
        zIndex: [
          index,
          index,
          total - index, // reverse order mid-shuffle
          Math.floor(Math.random() * total),
          index,
          total - index,
        ],
      }}
      transition={{
        duration: 2,
        delay: baseDelay,
        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        ease: 'easeInOut',
        repeat: 0,
      }}
    >
      {/* Card face */}
      <div
        className="w-full h-full rounded-xl border relative overflow-hidden"
        style={{
          borderColor: `${CARD_COLORS[index]}40`,
          background: `linear-gradient(145deg, var(--bg-elevated), var(--bg-secondary))`,
          boxShadow: `0 4px 20px rgba(0,0,0,0.15), 0 0 15px ${CARD_COLORS[index]}10`,
        }}
      >
        {/* Card inner border decoration */}
        <div className="absolute inset-2 rounded-lg border border-[var(--border)]/50" />

        {/* Top corner */}
        <div className="absolute top-3 left-3">
          <span
            className="font-display text-xs"
            style={{ color: CARD_COLORS[index] }}
          >
            {CARD_NUMERALS[index]}
          </span>
        </div>

        {/* Center symbol */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
            className="font-display text-3xl md:text-4xl"
            style={{ color: `${CARD_COLORS[index]}30` }}
          >
            ✦
          </motion.span>
        </div>

        {/* Bottom corner (inverted) */}
        <div className="absolute bottom-3 right-3 rotate-180">
          <span
            className="font-display text-xs"
            style={{ color: CARD_COLORS[index] }}
          >
            {CARD_NUMERALS[index]}
          </span>
        </div>

        {/* Holographic shimmer line */}
        <motion.div
          animate={{ x: ['-200%', '200%'] }}
          transition={{
            duration: 1.5,
            delay: 0.5 + index * 0.15,
            repeat: 1,
            ease: 'easeInOut',
          }}
          className="absolute inset-0"
          style={{
            background: `linear-gradient(105deg, transparent 40%, ${CARD_COLORS[index]}15 48%, ${CARD_COLORS[index]}25 50%, ${CARD_COLORS[index]}15 52%, transparent 60%)`,
          }}
        />
      </div>
    </motion.div>
  );
}
