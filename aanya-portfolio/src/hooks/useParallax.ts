import { useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';

interface UseParallaxOptions {
  offset?: [string, string];
  speed?: number;
}

export function useParallax({ offset = ['start end', 'end start'], speed = 0.3 }: UseParallaxOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any,
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * -100, speed * 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);

  return { ref, y, opacity, scrollYProgress };
}

export function useParallaxLayer(scrollYProgress: MotionValue<number>, speed: number) {
  return useTransform(scrollYProgress, [0, 1], [speed * -100, speed * 100]);
}
