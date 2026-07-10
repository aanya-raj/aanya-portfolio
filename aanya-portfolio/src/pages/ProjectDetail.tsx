import { useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { CaseStudySection } from '@/components/CaseStudySection';
import { StickerElement } from '@/components/StickerElement';
import { Tag } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useContent } from '@/hooks/useContent';

// Map project icons to emoji for sticker strip (avoids importing all lucide dynamically)
const projectEmoji: Record<string, string[]> = {
  'genai-chat-platform': ['💬', '🤖', '⚡', '🔗', '📡'],
  'rag-document-intelligence': ['🔍', '📄', '🧠', '📊', '🎯'],
  'ai-translation-tool': ['🌐', '🔤', '⚙️', '📝', '💰'],
  'salesforce-ticket-routing': ['🎫', '📬', '🛤️', '📈', '⏱️'],
  'code-documentation-generator': ['📖', '💻', '✍️', '📦', '🔄'],
  'healthcare-chatbot': ['🏥', '💊', '🩺', '💬', '📋'],
};

export function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { projects } = useContent();

  const projectIndex = projects.findIndex((p) => p.slug === slug);
  const project = projects[projectIndex];

  // Parallax for project hero (hooks must run before any early return)
  const detailRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: detailRef, offset: ['start start', 'end start'] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  if (!project) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-display-sm text-[var(--text-primary)] mb-4">
            Card not found
          </h1>
          <p className="font-hand text-xl text-pink-accent mb-6">
            this card seems to be missing from the deck ✦
          </p>
          <Link to="/projects">
            <Button variant="secondary">Back to all cards</Button>
          </Link>
        </div>
      </div>
    );
  }

  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;
  const emojis = projectEmoji[project.slug] || ['✦', '⚡', '🔮', '💫', '🌙'];

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="pt-20 pb-12 px-6" ref={detailRef}>
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)]
                hover:text-[var(--text-primary)] transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all cards
            </Link>
          </motion.div>

          {/* Card number + category */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="font-display text-4xl text-electric/30">{project.number}</span>
            <Tag variant="category">{project.category.replace('-', ' / ')}</Tag>
          </motion.div>

          {/* Title with parallax */}
          <motion.h1
            style={{ y: titleY, opacity: titleOpacity }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-display-sm md:text-display-md text-[var(--text-primary)] mb-4"
          >
            {project.title}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed mb-6"
          >
            {project.tagline}
          </motion.p>

          {/* Tech stack tags */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {project.tech.map((t) => (
              <Tag key={t} variant="tech">{t}</Tag>
            ))}
          </motion.div>

          {/* Gradient divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-px bg-gradient-oracle origin-left"
          />
        </div>
      </section>

      {/* ═══════════════════════ CASE STUDY SECTIONS ═══════════════════════ */}
      <section className="px-6 pb-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <CaseStudySection
            variant="problem"
            content={project.caseStudy.problem}
          />
          <CaseStudySection
            variant="approach"
            content={project.caseStudy.approach}
          />
          <CaseStudySection
            variant="build"
            content={project.caseStudy.build}
          />
          <CaseStudySection
            variant="result"
            content={project.caseStudy.result}
            metrics={project.metrics}
          />
        </div>
      </section>

      {/* ═══════════════════════ STICKER STRIP ═══════════════════════ */}
      <section className="py-8 px-6 overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-4 md:gap-6"
          >
            {emojis.map((emoji, i) => (
              <StickerElement
                key={i}
                rotation={(i % 3 - 1) * 4}
                variant="shadow"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -20 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08, type: 'spring', stiffness: 200 }}
                  className="inline-block text-3xl md:text-4xl p-2 md:p-3 rounded-xl
                    bg-[var(--bg-secondary)] border border-[var(--border)]"
                >
                  {emoji}
                </motion.span>
              </StickerElement>
            ))}
          </motion.div>

          {/* Handwritten reflection */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-hand text-lg text-pink-accent text-center mt-6 rotate-[-0.5deg]"
          >
            {project.slug === 'genai-chat-platform' && 'the system that taught me what "production" really means ✦'}
            {project.slug === 'rag-document-intelligence' && 'measure first, build second. always ✦'}
            {project.slug === 'ai-translation-tool' && 'the best tool is the one that pays for itself ✦'}
            {project.slug === 'salesforce-ticket-routing' && '117 queues, one model. constraints breed creativity ✦'}
            {project.slug === 'code-documentation-generator' && 'automate the boring, protect the important ✦'}
            {project.slug === 'healthcare-chatbot' && 'where it all started. my first published work ✦'}
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════ NAVIGATION ═══════════════════════ */}
      <section className="px-6 pb-section">
        <div className="max-w-3xl mx-auto">
          <div className="border-t border-[var(--border)] pt-8">
            <div className="flex items-center justify-between">
              {/* Previous */}
              <div className="flex-1">
                {prevProject ? (
                  <Link
                    to={`/projects/${prevProject.slug}`}
                    className="group inline-flex flex-col items-start"
                  >
                    <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1
                      flex items-center gap-1">
                      <ArrowLeft className="w-3 h-3" /> Previous
                    </span>
                    <span className="font-display text-base text-[var(--text-secondary)]
                      group-hover:text-[var(--text-primary)] transition-colors">
                      {prevProject.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
              </div>

              {/* Center: card number */}
              <div className="flex-shrink-0 px-4">
                <span className="font-display text-2xl text-electric/30">
                  {project.number}
                </span>
              </div>

              {/* Next */}
              <div className="flex-1 text-right">
                {nextProject ? (
                  <Link
                    to={`/projects/${nextProject.slug}`}
                    className="group inline-flex flex-col items-end"
                  >
                    <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1
                      flex items-center gap-1">
                      Next <ArrowRight className="w-3 h-3" />
                    </span>
                    <span className="font-display text-base text-[var(--text-secondary)]
                      group-hover:text-[var(--text-primary)] transition-colors">
                      {nextProject.title}
                    </span>
                  </Link>
                ) : (
                  <Link
                    to="/projects"
                    className="group inline-flex flex-col items-end"
                  >
                    <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1
                      flex items-center gap-1">
                      Back <ArrowRight className="w-3 h-3" />
                    </span>
                    <span className="font-display text-base text-[var(--text-secondary)]
                      group-hover:text-[var(--text-primary)] transition-colors">
                      All Cards
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
