import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, Linkedin, Github, Send, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StickerElement } from '@/components/StickerElement';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // mailto fallback — no backend needed
    const subject = encodeURIComponent(`Portfolio Contact from ${formState.name}`);
    const body = encodeURIComponent(
      `Hi Aanya,\n\n${formState.message}\n\n— ${formState.name}\n${formState.email}`
    );
    window.open(`mailto:aanya.rajsingh@yahoo.in?subject=${subject}&body=${body}`);
    setSubmitted(true);
  };

  const { ref: socialsRef, isVisible: socialsVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });

  // Parallax for header
  const headerParallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: headerParallaxRef, offset: ['start start', 'end start'] });
  const headerY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════ HEADER ═══════════════════════ */}
      <section className="pt-20 pb-8 px-6" ref={headerParallaxRef}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            style={{ y: headerY }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-display-md md:text-display-lg text-[var(--text-primary)] mb-3">
              Let's talk.
            </h1>
            <p className="font-hand text-2xl text-pink-accent rotate-[-0.5deg] mb-4">
              or just say hi. I don't bite. ✦
            </p>
            <p className="text-base text-[var(--text-secondary)] max-w-md mx-auto">
              Open to senior remote roles in AI/ML engineering, any timezone.
              If you're building something interesting with LLMs, I want to hear about it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ CONTACT FORM ═══════════════════════ */}
      <section className="px-6 pb-12">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 md:p-8"
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]
                      text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                      focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/20
                      transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]
                      text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                      focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/20
                      transition-all"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]
                      text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                      focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/20
                      resize-none transition-all"
                    placeholder="What are you building? What role are you hiring for? Or just say hi..."
                  />
                </div>

                <Button variant="primary" size="md" className="w-full">
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>

                <p className="text-xs text-[var(--text-muted)] text-center">
                  Opens your email client with a pre-filled message ✦
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <CheckCircle2 className="w-12 h-12 text-mint mx-auto mb-4" />
                <h3 className="font-display text-xl text-[var(--text-primary)] mb-2">
                  Message ready!
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Your email client should have opened with the message.
                  If it didn't, you can reach me directly:
                </p>
                <a
                  href="mailto:aanya.rajsingh@yahoo.in"
                  className="text-electric hover:underline text-sm font-mono"
                >
                  aanya.rajsingh@yahoo.in
                </a>
                <p className="font-hand text-base text-pink-accent mt-4">
                  looking forward to hearing from you ✦
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormState({ name: '', email: '', message: '' });
                  }}
                  className="mt-4 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]
                    transition-colors"
                >
                  Send another message
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ SOCIAL LINKS ═══════════════════════ */}
      <section className="px-6 pb-12" ref={socialsRef}>
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={socialsVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <p className="font-hand text-xl text-pink-accent">
              or find me here ✦
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Email */}
            <motion.a
              href="mailto:aanya.rajsingh@yahoo.in"
              initial={{ opacity: 0, y: 10 }}
              animate={socialsVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 px-5 py-4 rounded-xl border border-[var(--border)]
                bg-[var(--bg-secondary)] hover:border-electric/30 hover:shadow-glow
                transition-all duration-300 group"
            >
              <Mail className="w-5 h-5 text-[var(--text-muted)] group-hover:text-electric transition-colors" />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Email</p>
                <p className="text-xs text-[var(--text-muted)]">Direct line</p>
              </div>
            </motion.a>

            {/* LinkedIn */}
            <motion.a
              href="https://www.linkedin.com/in/aanyarajsingh"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={socialsVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 px-5 py-4 rounded-xl border border-[var(--border)]
                bg-[var(--bg-secondary)] hover:border-electric/30 hover:shadow-glow
                transition-all duration-300 group"
            >
              <Linkedin className="w-5 h-5 text-[var(--text-muted)] group-hover:text-electric transition-colors" />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">LinkedIn</p>
                <p className="text-xs text-[var(--text-muted)]">Let's connect</p>
              </div>
            </motion.a>

            {/* GitHub */}
            <motion.a
              href="https://github.com/aanya-raj"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={socialsVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 px-5 py-4 rounded-xl border border-[var(--border)]
                bg-[var(--bg-secondary)] hover:border-electric/30 hover:shadow-glow
                transition-all duration-300 group"
            >
              <Github className="w-5 h-5 text-[var(--text-muted)] group-hover:text-electric transition-colors" />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">GitHub</p>
                <p className="text-xs text-[var(--text-muted)]">See the code</p>
              </div>
            </motion.a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ LOCATION + AVAILABILITY ═══════════════════════ */}
      <section className="px-6 pb-section">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-5 py-3 rounded-full
              border border-[var(--border)] bg-[var(--bg-secondary)]"
          >
            <MapPin className="w-4 h-4 text-electric" />
            <span className="text-sm text-[var(--text-secondary)]">
              Noida, India
            </span>
            <span className="text-[var(--text-muted)]">·</span>
            <span className="text-sm text-[var(--text-secondary)]">
              Open to Remote / Hybrid
            </span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-mint" />
            </span>
          </motion.div>

          {/* Sticker decorations */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <StickerElement rotation={-5} variant="shadow">
              <span className="inline-block text-2xl p-2 rounded-lg bg-[var(--bg-secondary)]
                border border-[var(--border)]">
                💬
              </span>
            </StickerElement>
            <StickerElement rotation={3} variant="shadow">
              <span className="inline-block text-2xl p-2 rounded-lg bg-[var(--bg-secondary)]
                border border-[var(--border)]">
                🤝
              </span>
            </StickerElement>
            <StickerElement rotation={-2} variant="shadow">
              <span className="inline-block text-2xl p-2 rounded-lg bg-[var(--bg-secondary)]
                border border-[var(--border)]">
                ✦
              </span>
            </StickerElement>
          </div>
        </div>
      </section>
    </div>
  );
}
