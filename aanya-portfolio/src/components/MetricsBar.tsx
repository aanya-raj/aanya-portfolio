import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useCountUp } from '@/hooks/useCountUp';

interface MetricItemProps {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  isVisible: boolean;
  delay: number;
}

function MetricItem({ value, suffix, prefix, label, isVisible, delay }: MetricItemProps) {
  const count = useCountUp(value, isVisible, 2200);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <div className="font-mono text-3xl md:text-4xl font-medium text-electric mb-1">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-sm text-[var(--text-muted)] uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );
}

const metrics = [
  { value: 70, suffix: 'K', label: 'Requests / Month', prefix: '' },
  { value: 20, suffix: 'M', label: 'Tokens / Day', prefix: '' },
  { value: 60, suffix: '%', label: 'Retrieval Accuracy ↑', prefix: '+' },
  { value: 850, suffix: 'K+', label: 'Events Processed', prefix: '' },
  { value: 1700, suffix: '', label: 'Hours / Year Saved', prefix: '' },
];

export function MetricsBar() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div ref={ref} className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="font-hand text-xl text-pink-accent text-center mb-10 rotate-[-0.5deg]"
        >
          numbers that actually mean something ✦
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4">
          {metrics.map((metric, i) => (
            <MetricItem
              key={metric.label}
              {...metric}
              isVisible={isVisible}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
