import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useContent } from '@/hooks/useContent';

const expressions = ['◕‿◕', '◕ᴗ◕', '◕‿◕✦', '◕ω◕', '✦◕‿◕'];

export function KawaiiMascot() {
  const [expression, setExpression] = useState(0);
  const { scrollYProgress } = useScroll();
  const { hero } = useContent();

  // Change expression based on scroll position
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      const idx = Math.min(Math.floor(v * expressions.length), expressions.length - 1);
      setExpression(idx);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <motion.div
      style={{ opacity }}
      className="fixed bottom-6 right-6 z-40 hidden lg:block pointer-events-none select-none"
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        {/* Body */}
        <div className="w-14 h-14 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]
          shadow-float flex items-center justify-center relative overflow-hidden">
          {hero.avatarUrl ? (
            <>
              <img src={hero.avatarUrl} alt="" className="w-full h-full object-cover" />
              {/* Overlay expression */}
              <div className="absolute inset-0 flex items-end justify-center pb-0.5 bg-gradient-to-t from-black/20 to-transparent">
                <span className="text-[8px] font-mono text-white leading-none tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  {expressions[expression]}
                </span>
              </div>
            </>
          ) : (
            <>
              {/* Face */}
              <span className="text-[10px] font-mono text-electric leading-none tracking-tight">
                {expressions[expression]}
              </span>
              {/* Blush */}
              <div className="absolute bottom-2 left-1.5 w-2 h-1 rounded-full bg-pink-accent/30" />
              <div className="absolute bottom-2 right-1.5 w-2 h-1 rounded-full bg-pink-accent/30" />
            </>
          )}
        </div>

        {/* Speech bubble on first section */}
        {expression === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-9 -left-16 px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)]
              border border-[var(--border)] shadow-card whitespace-nowrap"
          >
            <span className="font-hand text-xs text-pink-accent">scroll ↓ ✦</span>
            {/* Arrow */}
            <div className="absolute -bottom-1 right-3 w-2 h-2 rotate-45
              bg-[var(--bg-secondary)] border-r border-b border-[var(--border)]" />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
