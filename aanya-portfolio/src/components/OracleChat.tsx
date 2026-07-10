import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, AlertCircle, Key, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Badge';
import { queryOracle } from '@/lib/huggingface';

interface OracleMessage {
  role: 'user' | 'oracle';
  content: string;
}

// Parse oracle response to extract structured sections
function parseOracleResponse(content: string) {
  const sections: { compatibility?: string; reading?: string; matches?: string[]; edges?: string[]; vibe?: string; raw: string } = { raw: content };

  // Try to extract compatibility score
  const scoreMatch = content.match(/(\d{1,3})\s*[/%\/]?\s*(?:out of\s*)?100|compatibility[:\s]*(\d{1,3})/i);
  if (scoreMatch) {
    sections.compatibility = scoreMatch[1] || scoreMatch[2];
  }

  return sections;
}

export function OracleChat() {
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<OracleMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmitKey = () => {
    if (apiKey.trim()) {
      setShowKeyInput(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const result = await queryOracle(userMessage, apiKey);

    if (result.error) {
      setError(result.error);
    } else {
      setMessages((prev) => [...prev, { role: 'oracle', content: result.content }]);
    }

    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([]);
    setError(null);
    setInput('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* API Key Input */}
      <AnimatePresence>
        {showKeyInput && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-8"
          >
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-electric/10 flex items-center justify-center">
                  <Key className="w-5 h-5 text-electric" />
                </div>
                <div>
                  <h3 className="font-display text-base text-[var(--text-primary)]">
                    Connect to The Oracle
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Free HuggingFace API token required
                  </p>
                </div>
              </div>

              <p className="text-sm text-[var(--text-secondary)] mb-4">
                The Oracle uses a free LLM via HuggingFace. Get your token at{' '}
                <a
                  href="https://huggingface.co/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-electric hover:underline"
                >
                  huggingface.co/settings/tokens
                </a>
                {' '}(it's free and takes 30 seconds).
              </p>

              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitKey()}
                  placeholder="hf_xxxxxxxxxxxx"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]
                    text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                    focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/20
                    font-mono transition-all"
                />
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSubmitKey}
                  disabled={!apiKey.trim()}
                >
                  Connect
                </Button>
              </div>

              <p className="text-xs text-[var(--text-muted)] mt-3">
                ✦ Your token stays in your browser. Never stored, never sent anywhere except HuggingFace.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      {!showKeyInput && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Messages */}
          <div className="space-y-4 mb-4">
            {messages.length === 0 && !isLoading && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 text-center">
                <Sparkles className="w-8 h-8 text-electric mx-auto mb-3" />
                <p className="text-[var(--text-secondary)] text-sm mb-2">
                  Paste a job description and I'll read your compatibility with Aanya.
                </p>
                <p className="font-hand text-base text-pink-accent">
                  or just ask me anything about her work ✦
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {msg.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-br-md px-5 py-3
                      bg-electric/10 border border-electric/20 text-sm text-[var(--text-primary)]">
                      <p className="whitespace-pre-wrap line-clamp-6">{msg.content}</p>
                      {msg.content.length > 300 && (
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          {msg.content.length} characters
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <OracleResponse content={msg.content} />
                )}
              </motion.div>
            ))}

            {/* Loading state */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-4 px-5 py-5 rounded-2xl
                    border border-[var(--border)] bg-[var(--bg-secondary)]"
                >
                  {/* Mini card shuffle */}
                  <div className="relative w-10 h-14 flex-shrink-0">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          rotate: [0, ((i - 1) * 15), ((i - 1) * -10), 0],
                          x: [0, (i - 1) * 8, (i - 1) * -5, 0],
                          y: [i * -2, -6 + i * -3, i * -1, i * -2],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: i * 0.08,
                        }}
                        className="absolute inset-0 rounded-md border border-electric/20
                          bg-gradient-to-b from-[var(--bg-elevated)] to-[var(--bg-secondary)]"
                        style={{ zIndex: 3 - i }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-electric/30 text-xs">✦</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Reading the cards...
                    </p>
                    <p className="font-hand text-xs text-pink-accent">
                      the oracle is shuffling ✦
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error state */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-3 px-5 py-4 rounded-2xl
                    border border-pink-accent/30 bg-pink-accent/5"
                >
                  <AlertCircle className="w-5 h-5 text-pink-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-[var(--text-primary)]">{error}</p>
                    <button
                      onClick={() => setShowKeyInput(true)}
                      className="text-xs text-electric hover:underline mt-1"
                    >
                      Change API token
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input area */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]
            overflow-hidden focus-within:border-electric/40 focus-within:shadow-glow transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste a job description here..."
              rows={4}
              className="w-full px-5 py-4 bg-transparent text-sm text-[var(--text-primary)]
                placeholder:text-[var(--text-muted)] resize-none focus:outline-none"
            />
            <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]
                    flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
                <button
                  onClick={() => setShowKeyInput(true)}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]
                    flex items-center gap-1 transition-colors"
                >
                  <Key className="w-3 h-3" />
                  Token
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-muted)]">
                  ⌘+Enter to send
                </span>
                <Button
                  variant="oracle"
                  size="sm"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={!input.trim() || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Read My Cards
                </Button>
              </div>
            </div>
          </div>

          {/* Sample prompts */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2 justify-center"
            >
              {[
                'What are Aanya\'s strongest skills?',
                'Tell me about her RAG experience',
                'What kind of roles suit her best?',
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="px-3 py-1.5 rounded-full text-xs border border-[var(--border)]
                    bg-[var(--bg-elevated)] text-[var(--text-muted)]
                    hover:text-[var(--text-primary)] hover:border-electric/30
                    transition-all duration-200"
                >
                  {prompt}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ─── Oracle Response Renderer ───────────────────────────────
function OracleResponse({ content }: { content: string }) {
  // Simple markdown-like rendering
  const lines = content.split('\n');

  return (
    <div className="rounded-2xl border border-electric/20 bg-[var(--bg-secondary)] overflow-hidden">
      {/* Oracle header bar */}
      <div className="px-5 py-2.5 bg-gradient-oracle flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-white" />
        <span className="text-sm font-medium text-white">The Oracle speaks</span>
      </div>

      <div className="px-5 py-4 space-y-3">
        {lines.map((line, i) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={i} className="h-2" />;

          // Headers (** bold **)
          if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
            return (
              <h4 key={i} className="font-display text-base text-[var(--text-primary)] mt-3">
                {trimmed.replace(/\*\*/g, '')}
              </h4>
            );
          }

          // Section headers with colons
          if (trimmed.match(/^\*\*[^*]+\*\*:?/)) {
            const text = trimmed.replace(/\*\*/g, '');
            return (
              <h4 key={i} className="font-display text-base text-[var(--text-primary)] mt-3">
                {text}
              </h4>
            );
          }

          // Bullet points
          if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.match(/^\d+\./)) {
            const text = trimmed.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '');
            return (
              <div key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span className="text-electric mt-0.5 flex-shrink-0">✦</span>
                <span>{renderInlineFormatting(text)}</span>
              </div>
            );
          }

          // Score line
          if (trimmed.match(/\d{2,3}\s*[/%]/)) {
            const scoreMatch = trimmed.match(/(\d{2,3})/);
            if (scoreMatch) {
              const score = parseInt(scoreMatch[1]);
              return (
                <div key={i} className="flex items-center gap-3 py-2">
                  <div className="text-3xl font-mono font-bold text-electric">
                    {score}%
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                      className="h-full rounded-full bg-gradient-oracle"
                    />
                  </div>
                </div>
              );
            }
          }

          // Regular paragraph
          return (
            <p key={i} className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {renderInlineFormatting(trimmed)}
            </p>
          );
        })}
      </div>
    </div>
  );
}

function renderInlineFormatting(text: string): React.ReactNode {
  // Simple bold rendering
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-[var(--text-primary)] font-medium">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
