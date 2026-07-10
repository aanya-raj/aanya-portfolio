import { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Sparkles } from 'lucide-react';

const fortunes = [
  "You just found the engineer you've been looking for. 🥠",
  "Good code and good taste. A rare combination awaits. ✦",
  "The next great AI system has your name on it. 🌙",
  "She ships fast and thinks deep. Lucky you. ⚡",
  "A portfolio this good? The stars aligned. ✨",
  "Production-grade code with a creative soul. That's the fortune. 🔮",
  "20M tokens a day keeps the boring away. 🥠",
];

export function Footer() {
  const [fortune, setFortune] = useState('');

  useEffect(() => {
    setFortune(fortunes[Math.floor(Math.random() * fortunes.length)]);
  }, []);

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Fortune cookie */}
        <div className="text-center mb-8">
          <p className="font-hand text-xl text-pink-accent rotate-[-0.5deg]">
            {fortune}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-electric" />
            <span className="font-display text-base text-[var(--text-primary)]">
              Aanya Raj Singh
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="mailto:aanya.rajsingh@yahoo.in"
              className="w-10 h-10 rounded-lg flex items-center justify-center
                text-[var(--text-muted)] hover:text-electric
                hover:bg-[var(--bg-elevated)] transition-all"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/aanyarajsingh"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg flex items-center justify-center
                text-[var(--text-muted)] hover:text-electric
                hover:bg-[var(--bg-elevated)] transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/aanya-raj"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg flex items-center justify-center
                text-[var(--text-muted)] hover:text-electric
                hover:bg-[var(--bg-elevated)] transition-all"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-[var(--text-muted)]">
            © {new Date().getFullYear()} · Built with intention ✦
          </p>
        </div>
      </div>
    </footer>
  );
}
