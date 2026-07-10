import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { Hobby } from '@/types';

interface HobbyShelfProps {
  hobbies: Hobby[];
}

export function HobbyShelf({ hobbies }: HobbyShelfProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div ref={ref} className="overflow-hidden">
      <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 px-1
        scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none]
        [&::-webkit-scrollbar]:hidden">
        {hobbies.map((hobby, i) => {
          const rotation = ((i % 5) - 2) * 1.5;
          return (
            <motion.div
              key={hobby.label}
              initial={{ opacity: 0, scale: 0.8, rotate: rotation * 2 }}
              animate={isVisible ? { opacity: 1, scale: 1, rotate: rotation } : {}}
              transition={{
                duration: 0.5,
                delay: i * 0.07,
                type: 'spring',
                stiffness: 150,
              }}
              whileHover={{ rotate: 0, scale: 1.08, y: -3 }}
              className="flex-shrink-0 cursor-default"
            >
              <div
                className="flex items-center gap-2.5 px-5 py-3 rounded-full
                  border border-[var(--border)] bg-[var(--bg-secondary)]
                  hover:border-opacity-50 transition-all duration-300
                  shadow-sticker hover:shadow-float"
                style={{
                  borderColor: `${hobby.color}30`,
                }}
              >
                <span className="text-xl">{hobby.icon}</span>
                <span className="text-sm font-medium text-[var(--text-secondary)] whitespace-nowrap">
                  {hobby.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
