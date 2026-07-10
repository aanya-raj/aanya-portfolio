import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface SkillNode {
  name: string;
  category: string;
  level: 'core' | 'proficient' | 'familiar';
}

const categories: Record<string, { label: string; color: string; emoji: string }> = {
  'ai-llm': { label: 'AI / LLMs', color: '#7c5cff', emoji: '🧠' },
  backend: { label: 'Backend', color: '#a9e8d0', emoji: '⚡' },
  cloud: { label: 'Cloud & MLOps', color: '#e8a9c8', emoji: '☁️' },
  'ml-nlp': { label: 'ML & NLP', color: '#b8a9e8', emoji: '🔬' },
  data: { label: 'Data', color: '#e8d5a9', emoji: '📊' },
};

const skills: SkillNode[] = [
  // AI/LLM - core
  { name: 'Azure OpenAI', category: 'ai-llm', level: 'core' },
  { name: 'GPT-4o', category: 'ai-llm', level: 'core' },
  { name: 'LangChain', category: 'ai-llm', level: 'core' },
  { name: 'RAG Systems', category: 'ai-llm', level: 'core' },
  { name: 'Prompt Engineering', category: 'ai-llm', level: 'core' },
  { name: 'LangGraph', category: 'ai-llm', level: 'proficient' },
  { name: 'Vector DBs', category: 'ai-llm', level: 'core' },
  { name: 'Agentic Workflows', category: 'ai-llm', level: 'core' },
  { name: 'LoRA / QLoRA', category: 'ai-llm', level: 'proficient' },
  // Backend
  { name: 'FastAPI', category: 'backend', level: 'core' },
  { name: 'Python', category: 'backend', level: 'core' },
  { name: 'TypeScript', category: 'backend', level: 'proficient' },
  { name: 'WebSockets', category: 'backend', level: 'core' },
  { name: 'Celery / Redis', category: 'backend', level: 'core' },
  { name: 'PostgreSQL', category: 'backend', level: 'proficient' },
  { name: 'REST APIs', category: 'backend', level: 'core' },
  // Cloud
  { name: 'Azure AI Foundry', category: 'cloud', level: 'core' },
  { name: 'Docker', category: 'cloud', level: 'proficient' },
  { name: 'Kubernetes', category: 'cloud', level: 'proficient' },
  { name: 'CI/CD', category: 'cloud', level: 'core' },
  { name: 'OpenTelemetry', category: 'cloud', level: 'proficient' },
  // ML/NLP
  { name: 'PyTorch', category: 'ml-nlp', level: 'proficient' },
  { name: 'TensorFlow', category: 'ml-nlp', level: 'proficient' },
  { name: 'Hugging Face', category: 'ml-nlp', level: 'proficient' },
  { name: 'scikit-learn', category: 'ml-nlp', level: 'core' },
  { name: 'Text Classification', category: 'ml-nlp', level: 'core' },
  { name: 'Semantic Search', category: 'ml-nlp', level: 'core' },
  // Data
  { name: 'PySpark', category: 'data', level: 'proficient' },
  { name: 'ETL Pipelines', category: 'data', level: 'core' },
  { name: 'Elasticsearch', category: 'data', level: 'proficient' },
  { name: 'Power BI', category: 'data', level: 'proficient' },
];

export function TechConstellation() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  const filteredSkills = activeCategory
    ? skills.filter((s) => s.category === activeCategory)
    : skills;

  return (
    <div ref={ref} className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-display-sm md:text-display-md text-[var(--text-primary)] mb-3">
            The Stack
          </h2>
          <p className="font-hand text-xl text-pink-accent rotate-[-0.5deg]">
            tools I think with ✦
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${!activeCategory
                ? 'bg-electric text-white shadow-glow'
                : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
          >
            All
          </button>
          {Object.entries(categories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(activeCategory === key ? null : key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${activeCategory === key
                  ? 'text-white shadow-glow'
                  : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              style={activeCategory === key ? { backgroundColor: cat.color } : {}}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Skill nodes */}
        <motion.div
          layout
          className="flex flex-wrap justify-center gap-2.5"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, i) => {
              const cat = categories[skill.category];
              return (
                <motion.div
                  key={skill.name}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: i * 0.02 }}
                  className="group relative"
                >
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-medium
                      border transition-all duration-300 cursor-default
                      hover:shadow-glow hover:scale-105
                      ${skill.level === 'core'
                        ? 'border-current/30 font-semibold'
                        : 'border-[var(--border)] text-[var(--text-secondary)]'
                      }`}
                    style={{
                      color: skill.level === 'core' ? cat.color : undefined,
                      borderColor: skill.level === 'core' ? `${cat.color}40` : undefined,
                      backgroundColor: skill.level === 'core' ? `${cat.color}10` : undefined,
                    }}
                  >
                    {skill.name}
                  </div>

                  {/* Tooltip */}
                  <div
                    className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0
                      group-hover:opacity-100 transition-opacity duration-200
                      px-2 py-1 rounded text-xs font-mono whitespace-nowrap
                      bg-[var(--bg-elevated)] border border-[var(--border)]
                      text-[var(--text-muted)] pointer-events-none z-10"
                  >
                    {cat.label} · {skill.level}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
