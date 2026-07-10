import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Lock, Save, Plus, Trash2, GripVertical, ChevronDown, ChevronUp,
  Briefcase, Sparkles, BookOpen, Palette, Zap, MessageSquare, Home,
  Image, Upload,
} from 'lucide-react';
import { useAdmin, type SkillNode, type HeroContent } from '@/lib/admin-context';
import { Button } from '@/components/ui/Button';
import type { Project, Experience, Personality, Hobby } from '@/types';

// ─── Login Gate ────────────────────────────────────────────
function AdminLogin() {
  const { login } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(username, password);
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-electric/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-electric" />
          </div>
          <h1 className="font-display text-2xl text-[var(--text-primary)] mb-1">Admin Access</h1>
          <p className="font-hand text-lg text-pink-accent">only the oracle keeper may enter ✦</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoFocus
            className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border text-sm
              text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
              focus:outline-none transition-all
              ${error ? 'border-pink-accent' : 'border-[var(--border)] focus:border-electric/50'}`}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border text-sm
              text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
              focus:outline-none transition-all font-mono
              ${error ? 'border-pink-accent' : 'border-[var(--border)] focus:border-electric/50'}`}
          />
          <Button variant="primary" size="md" className="w-full" disabled={loading}>
            {loading ? 'Authenticating...' : 'Enter'}
          </Button>
          {error && (
            <p className="text-center text-sm text-pink-accent">{error} ✦</p>
          )}
        </form>
      </motion.div>
    </div>
  );
}

// ─── Section Wrapper ───────────────────────────────────────
function Section({
  title, icon, children, defaultOpen = false,
}: {
  title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[var(--bg-elevated)] transition-colors"
      >
        {icon}
        <span className="font-display text-base text-[var(--text-primary)] flex-1 text-left">{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />}
      </button>
      {isOpen && <div className="px-5 pb-5 border-t border-[var(--border)] pt-4">{children}</div>}
    </div>
  );
}

// ─── Input Helpers ─────────────────────────────────────────
const inputClass = "w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-electric/50 transition-all";
const labelClass = "block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1";
const textareaClass = `${inputClass} resize-none`;

// ─── Hero Editor ───────────────────────────────────────────
function HeroEditor() {
  const { state, saveContent, uploadStickerImage } = useAdmin();
  const [hero, setHero] = useState<HeroContent>(state.hero);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  const save = async () => {
    const ok = await saveContent('hero', hero);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 1500); }
  };

  const handleAvatarUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setUploading(true);
      const url = await uploadStickerImage(file);
      if (url) {
        setHero({ ...hero, avatarUrl: url });
      }
      setUploading(false);
    };
    input.click();
  };

  return (
    <Section title="Hero Section" icon={<Home className="w-4 h-4 text-electric" />} defaultOpen>
      <div className="space-y-4">
        {/* Avatar Upload */}
        <div>
          <label className={labelClass}>Avatar / Profile Image</label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-oracle flex items-center justify-center overflow-hidden border border-[var(--border)]">
              {hero.avatarUrl ? (
                <img src={hero.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">✦</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleAvatarUpload}
                disabled={uploading}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] text-xs text-[var(--text-secondary)] hover:border-electric/30 hover:text-electric transition-all disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
              <div className="flex gap-2 items-center">
                <input
                  value={hero.avatarUrl || ''}
                  onChange={(e) => setHero({ ...hero, avatarUrl: e.target.value || undefined })}
                  placeholder="Or paste image URL..."
                  className={`${inputClass} text-xs flex-1`}
                />
                {hero.avatarUrl && (
                  <button
                    onClick={() => setHero({ ...hero, avatarUrl: undefined })}
                    className="text-xs text-pink-accent hover:text-pink-accent/80 whitespace-nowrap"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>Rotating Subtitles (one per line)</label>
          <textarea
            value={hero.subtitles.join('\n')}
            onChange={(e) => setHero({ ...hero, subtitles: e.target.value.split('\n').filter(Boolean) })}
            rows={5}
            className={textareaClass}
          />
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            value={hero.description}
            onChange={(e) => setHero({ ...hero, description: e.target.value })}
            rows={3}
            className={textareaClass}
          />
        </div>
        <div>
          <label className={labelClass}>Handwritten Tagline</label>
          <input
            value={hero.tagline}
            onChange={(e) => setHero({ ...hero, tagline: e.target.value })}
            className={inputClass}
          />
        </div>
        <button onClick={save} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-electric text-white text-sm font-medium hover:bg-electric/90 transition-colors">
          <Save className="w-3.5 h-3.5" />
          {saved ? 'Saved ✦' : 'Save Hero'}
        </button>
      </div>
    </Section>
  );
}

// ─── Projects Editor ───────────────────────────────────────
function ProjectsEditor() {
  const { state, saveContent } = useAdmin();
  const [projects, setProjects] = useState<Project[]>(state.projects);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    const ok = await saveContent('projects', projects);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 1500); }
  };

  const updateProject = (idx: number, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p, i) => i === idx ? { ...p, ...updates } : p));
  };

  const addProject = () => {
    const num = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    const newP: Project = {
      slug: `project-${Date.now()}`,
      number: num[projects.length] || `${projects.length + 1}`,
      title: 'New Project',
      category: 'automation',
      tagline: '',
      summary: '',
      tech: [],
      metrics: [],
      caseStudy: { problem: '', approach: '', build: '', result: '' },
      icon: 'Sparkles',
      accentColor: '#7c5cff',
    };
    setProjects([...projects, newP]);
    setEditingIdx(projects.length);
  };

  const removeProject = (idx: number) => {
    if (confirm(`Delete "${projects[idx].title}"?`)) {
      setProjects((prev) => prev.filter((_, i) => i !== idx));
      setEditingIdx(null);
    }
  };

  return (
    <Section title={`Projects (${projects.length})`} icon={<Sparkles className="w-4 h-4 text-lavender" />}>
      <div className="space-y-2 mb-4">
        {projects.map((p, idx) => (
          <div key={p.slug} className="rounded-xl border border-[var(--border)] overflow-hidden">
            <button
              onClick={() => setEditingIdx(editingIdx === idx ? null : idx)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-elevated)] transition-colors"
            >
              <GripVertical className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span className="font-mono text-xs text-electric">{p.number}</span>
              <span className="text-sm text-[var(--text-primary)] flex-1 text-left">{p.title}</span>
              <span className="text-xs text-[var(--text-muted)]">{p.category}</span>
            </button>

            {editingIdx === idx && (
              <div className="px-4 pb-4 border-t border-[var(--border)] pt-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Title</label>
                    <input value={p.title} onChange={(e) => updateProject(idx, { title: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Slug</label>
                    <input value={p.slug} onChange={(e) => updateProject(idx, { slug: e.target.value })} className={`${inputClass} font-mono`} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Number</label>
                    <input value={p.number} onChange={(e) => updateProject(idx, { number: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Category</label>
                    <select value={p.category} onChange={(e) => updateProject(idx, { category: e.target.value as Project['category'] })} className={inputClass}>
                      <option value="llm-systems">LLM Systems</option>
                      <option value="ml-nlp">ML / NLP</option>
                      <option value="automation">Automation</option>
                      <option value="research">Research</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Accent Color</label>
                    <input type="color" value={p.accentColor} onChange={(e) => updateProject(idx, { accentColor: e.target.value })} className="w-full h-9 rounded-lg cursor-pointer" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Tagline</label>
                  <input value={p.tagline} onChange={(e) => updateProject(idx, { tagline: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Summary (card back)</label>
                  <textarea value={p.summary} onChange={(e) => updateProject(idx, { summary: e.target.value })} rows={2} className={textareaClass} />
                </div>
                <div>
                  <label className={labelClass}>Tech Stack (comma-separated)</label>
                  <input value={p.tech.join(', ')} onChange={(e) => updateProject(idx, { tech: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className={inputClass} />
                </div>

                {/* Case Study */}
                <div className="rounded-lg border border-[var(--border)] p-3 space-y-3">
                  <p className="text-xs font-medium text-electric">Case Study</p>
                  {(['problem', 'approach', 'build', 'result'] as const).map((key) => (
                    <div key={key}>
                      <label className={labelClass}>The {key.charAt(0).toUpperCase() + key.slice(1)}</label>
                      <textarea
                        value={p.caseStudy[key]}
                        onChange={(e) => updateProject(idx, {
                          caseStudy: { ...p.caseStudy, [key]: e.target.value }
                        })}
                        rows={3}
                        className={textareaClass}
                      />
                    </div>
                  ))}
                </div>

                <button onClick={() => removeProject(idx)} className="flex items-center gap-2 text-xs text-pink-accent hover:text-pink-accent/80 transition-colors">
                  <Trash2 className="w-3 h-3" /> Delete project
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={addProject} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-[var(--border)] text-sm text-[var(--text-muted)] hover:border-electric/30 hover:text-electric transition-all">
          <Plus className="w-3.5 h-3.5" /> Add Project
        </button>
        <button onClick={save} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-electric text-white text-sm font-medium hover:bg-electric/90 transition-colors">
          <Save className="w-3.5 h-3.5" /> {saved ? 'Saved ✦' : 'Save Projects'}
        </button>
      </div>
    </Section>
  );
}

// ─── Experience Editor ─────────────────────────────────────
function ExperienceEditor() {
  const { state, saveContent } = useAdmin();
  const [exps, setExps] = useState<Experience[]>(state.experiences);
  const [saved, setSaved] = useState(false);

  const save = async () => { const ok = await saveContent('experiences', exps); if (ok) { setSaved(true); setTimeout(() => setSaved(false), 1500); } };

  const updateExp = (idx: number, updates: Partial<Experience>) => {
    setExps((prev) => prev.map((e, i) => i === idx ? { ...e, ...updates } : e));
  };

  const addExp = () => {
    setExps([...exps, { company: 'New Company', role: 'Role', period: '', location: '', type: 'past', highlights: [] }]);
  };

  return (
    <Section title={`Experience (${exps.length})`} icon={<Briefcase className="w-4 h-4 text-mint" />}>
      <div className="space-y-4 mb-4">
        {exps.map((exp, idx) => (
          <div key={idx} className="rounded-lg border border-[var(--border)] p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div><label className={labelClass}>Company</label><input value={exp.company} onChange={(e) => updateExp(idx, { company: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Role</label><input value={exp.role} onChange={(e) => updateExp(idx, { role: e.target.value })} className={inputClass} /></div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div><label className={labelClass}>Period</label><input value={exp.period} onChange={(e) => updateExp(idx, { period: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Location</label><input value={exp.location} onChange={(e) => updateExp(idx, { location: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Type</label>
                <select value={exp.type} onChange={(e) => updateExp(idx, { type: e.target.value as 'current' | 'past' })} className={inputClass}>
                  <option value="current">Current</option><option value="past">Past</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Highlights (one per line)</label>
              <textarea value={exp.highlights.join('\n')} onChange={(e) => updateExp(idx, { highlights: e.target.value.split('\n').filter(Boolean) })} rows={3} className={textareaClass} />
            </div>
            <button onClick={() => setExps(exps.filter((_, i) => i !== idx))} className="text-xs text-pink-accent flex items-center gap-1"><Trash2 className="w-3 h-3" /> Remove</button>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={addExp} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-[var(--border)] text-sm text-[var(--text-muted)] hover:border-electric/30 hover:text-electric transition-all"><Plus className="w-3.5 h-3.5" /> Add</button>
        <button onClick={save} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-electric text-white text-sm font-medium hover:bg-electric/90 transition-colors"><Save className="w-3.5 h-3.5" /> {saved ? 'Saved ✦' : 'Save'}</button>
      </div>
    </Section>
  );
}

// ─── Skills Editor ─────────────────────────────────────────
function SkillsEditor() {
  const { state, saveContent } = useAdmin();
  const [skills, setSkills] = useState<SkillNode[]>(state.skills);
  const [saved, setSaved] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'ai-llm', level: 'proficient' as const });

  const save = async () => { const ok = await saveContent('skills', skills); if (ok) { setSaved(true); setTimeout(() => setSaved(false), 1500); } };

  const addSkill = () => {
    if (newSkill.name.trim()) {
      setSkills([...skills, { ...newSkill, name: newSkill.name.trim() }]);
      setNewSkill({ name: '', category: 'ai-llm', level: 'proficient' });
    }
  };

  const categories = ['ai-llm', 'backend', 'cloud', 'ml-nlp', 'data'];

  return (
    <Section title={`Skills (${skills.length})`} icon={<Zap className="w-4 h-4 text-sparkle" />}>
      {/* Add new skill */}
      <div className="flex gap-2 mb-4">
        <input value={newSkill.name} onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })} placeholder="Skill name" className={`flex-1 ${inputClass}`} onKeyDown={(e) => e.key === 'Enter' && addSkill()} />
        <select value={newSkill.category} onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })} className={inputClass} style={{ width: '140px' }}>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={newSkill.level} onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as any })} className={inputClass} style={{ width: '120px' }}>
          <option value="core">Core</option><option value="proficient">Proficient</option><option value="familiar">Familiar</option>
        </select>
        <button onClick={addSkill} className="px-3 py-2 rounded-lg bg-electric/10 text-electric text-sm hover:bg-electric/20 transition-colors"><Plus className="w-4 h-4" /></button>
      </div>

      {/* Skills by category */}
      {categories.map((cat) => {
        const catSkills = skills.filter((s) => s.category === cat);
        if (catSkills.length === 0) return null;
        return (
          <div key={cat} className="mb-3">
            <p className="text-xs font-mono text-electric uppercase tracking-wider mb-2">{cat}</p>
            <div className="flex flex-wrap gap-1.5">
              {catSkills.map((skill) => (
                <div key={skill.name} className="group flex items-center gap-1 px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] text-xs">
                  <span className={skill.level === 'core' ? 'font-semibold text-electric' : 'text-[var(--text-secondary)]'}>{skill.name}</span>
                  <button onClick={() => setSkills(skills.filter((s) => s.name !== skill.name))} className="opacity-0 group-hover:opacity-100 text-pink-accent transition-opacity"><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <button onClick={save} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-electric text-white text-sm font-medium hover:bg-electric/90 transition-colors mt-3"><Save className="w-3.5 h-3.5" /> {saved ? 'Saved ✦' : 'Save Skills'}</button>
    </Section>
  );
}

// ─── Simple List Editors ───────────────────────────────────
function PersonalityEditor() {
  const { state, saveContent } = useAdmin();
  const [items, setItems] = useState<Personality[]>(state.personalities);
  const [saved, setSaved] = useState(false);

  const save = async () => { const ok = await saveContent('personalities', items); if (ok) { setSaved(true); setTimeout(() => setSaved(false), 1500); } };
  const update = (idx: number, updates: Partial<Personality>) => setItems((prev) => prev.map((p, i) => i === idx ? { ...p, ...updates } : p));

  return (
    <Section title="Personality Cards" icon={<Palette className="w-4 h-4 text-pink-accent" />}>
      <div className="space-y-3 mb-4">
        {items.map((p, idx) => (
          <div key={idx} className="rounded-lg border border-[var(--border)] p-3 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div><label className={labelClass}>Archetype</label><input value={p.archetype} onChange={(e) => update(idx, { archetype: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Title</label><input value={p.title} onChange={(e) => update(idx, { title: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Emoji</label><input value={p.emoji} onChange={(e) => update(idx, { emoji: e.target.value })} className={inputClass} /></div>
            </div>
            <div><label className={labelClass}>Description</label><textarea value={p.description} onChange={(e) => update(idx, { description: e.target.value })} rows={2} className={textareaClass} /></div>
          </div>
        ))}
      </div>
      <button onClick={save} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-electric text-white text-sm font-medium hover:bg-electric/90 transition-colors"><Save className="w-3.5 h-3.5" /> {saved ? 'Saved ✦' : 'Save'}</button>
    </Section>
  );
}

function HobbiesEditor() {
  const { state, saveContent } = useAdmin();
  const [items, setItems] = useState<Hobby[]>(state.hobbies);
  const [saved, setSaved] = useState(false);

  const save = async () => { const ok = await saveContent('hobbies', items); if (ok) { setSaved(true); setTimeout(() => setSaved(false), 1500); } };

  return (
    <Section title={`Hobbies (${items.length})`} icon={<BookOpen className="w-4 h-4 text-lavender" />}>
      <div className="space-y-2 mb-4">
        {items.map((h, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input value={h.icon} onChange={(e) => setItems(items.map((x, i) => i === idx ? { ...x, icon: e.target.value } : x))} className={`${inputClass} w-14 text-center`} />
            <input value={h.label} onChange={(e) => setItems(items.map((x, i) => i === idx ? { ...x, label: e.target.value } : x))} className={`${inputClass} flex-1`} />
            <input type="color" value={h.color} onChange={(e) => setItems(items.map((x, i) => i === idx ? { ...x, color: e.target.value } : x))} className="w-8 h-8 rounded cursor-pointer" />
            <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="text-pink-accent"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={() => setItems([...items, { label: 'New', icon: '✦', color: '#7c5cff' }])} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-[var(--border)] text-sm text-[var(--text-muted)] hover:border-electric/30 hover:text-electric transition-all"><Plus className="w-3.5 h-3.5" /> Add</button>
        <button onClick={save} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-electric text-white text-sm font-medium hover:bg-electric/90 transition-colors"><Save className="w-3.5 h-3.5" /> {saved ? 'Saved ✦' : 'Save'}</button>
      </div>
    </Section>
  );
}

function OraclePromptEditor() {
  const { state, saveContent } = useAdmin();
  const [prompt, setPrompt] = useState(state.oraclePrompt);
  const [saved, setSaved] = useState(false);

  const save = async () => { const ok = await saveContent('oracle_prompt', prompt); if (ok) { setSaved(true); setTimeout(() => setSaved(false), 1500); } };

  return (
    <Section title="Oracle System Prompt" icon={<MessageSquare className="w-4 h-4 text-electric" />}>
      <p className="text-xs text-[var(--text-muted)] mb-3">Override the default Oracle system prompt. Leave empty to use the built-in default.</p>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={10} className={`${textareaClass} font-mono text-xs`} placeholder="Leave empty for default prompt..." />
      <button onClick={save} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-electric text-white text-sm font-medium hover:bg-electric/90 transition-colors mt-3"><Save className="w-3.5 h-3.5" /> {saved ? 'Saved ✦' : 'Save'}</button>
    </Section>
  );
}

// ─── Tiny X component for skills ───────────────────────────
function X({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M2 2l8 8M10 2l-8 8" />
    </svg>
  );
}

// ─── Main Admin Page ───────────────────────────────────────
export function Admin() {
  const { isAdmin } = useAdmin();

  if (!isAdmin) return <AdminLogin />;

  return (
    <div className="min-h-screen pt-20 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-display-sm text-[var(--text-primary)] mb-1">Content Editor</h1>
          <p className="font-hand text-xl text-pink-accent">edit everything from here — no code needed ✦</p>
        </motion.div>

        <div className="space-y-4">
          <HeroEditor />
          <ProjectsEditor />
          <ExperienceEditor />
          <SkillsEditor />
          <PersonalityEditor />
          <HobbiesEditor />
          <OraclePromptEditor />
        </div>
      </div>
    </div>
  );
}
