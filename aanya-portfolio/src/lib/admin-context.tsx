import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi, contentApi, stickersApi } from '@/lib/api-client';
import { projects as defaultProjects } from '@/data/projects';
import { experiences as defaultExperiences } from '@/data/experience';
import { personalities as defaultPersonalities } from '@/data/personality';
import { hobbies as defaultHobbies } from '@/data/hobbies';
import type { Project, Experience, Personality, Hobby } from '@/types';

// ─── Types ─────────────────────────────────────────────
export interface PlacedSticker {
  sticker_id: string;
  src: string;
  type: 'image' | 'emoji';
  x: number;
  y: number;
  rotation: number;
  scale: number;
  page: string;
  zIndex: number;
}

export interface SkillNode {
  name: string;
  category: string;
  level: 'core' | 'proficient' | 'familiar';
}

export interface HeroContent {
  subtitles: string[];
  tagline: string;
  description: string;
  avatarUrl?: string;
}

interface AdminState {
  projects: Project[];
  experiences: Experience[];
  personalities: Personality[];
  hobbies: Hobby[];
  skills: SkillNode[];
  hero: HeroContent;
  oraclePrompt: string;
  stickers: PlacedSticker[];
}

interface AdminContextType {
  isAdmin: boolean;
  isEditMode: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  toggleEditMode: () => void;
  state: AdminState;
  saveContent: (key: string, data: any) => Promise<boolean>;
  addSticker: (sticker: Omit<PlacedSticker, 'sticker_id'>) => Promise<void>;
  updateSticker: (id: string, updates: Partial<PlacedSticker>) => Promise<void>;
  removeSticker: (id: string) => Promise<void>;
  uploadStickerImage: (file: File) => Promise<string | null>;
  exportAll: () => Promise<string>;
  importAll: (json: string) => Promise<boolean>;
  resetToDefaults: () => Promise<void>;
  refreshContent: () => Promise<void>;
}

// ─── Defaults ──────────────────────────────────────────
const defaultSkills: SkillNode[] = [
  { name: 'Azure OpenAI', category: 'ai-llm', level: 'core' },
  { name: 'GPT-4o', category: 'ai-llm', level: 'core' },
  { name: 'LangChain', category: 'ai-llm', level: 'core' },
  { name: 'RAG Systems', category: 'ai-llm', level: 'core' },
  { name: 'Prompt Engineering', category: 'ai-llm', level: 'core' },
  { name: 'LangGraph', category: 'ai-llm', level: 'proficient' },
  { name: 'Vector DBs', category: 'ai-llm', level: 'core' },
  { name: 'Agentic Workflows', category: 'ai-llm', level: 'core' },
  { name: 'LoRA / QLoRA', category: 'ai-llm', level: 'proficient' },
  { name: 'FastAPI', category: 'backend', level: 'core' },
  { name: 'Python', category: 'backend', level: 'core' },
  { name: 'TypeScript', category: 'backend', level: 'proficient' },
  { name: 'WebSockets', category: 'backend', level: 'core' },
  { name: 'Celery / Redis', category: 'backend', level: 'core' },
  { name: 'PostgreSQL', category: 'backend', level: 'proficient' },
  { name: 'REST APIs', category: 'backend', level: 'core' },
  { name: 'Azure AI Foundry', category: 'cloud', level: 'core' },
  { name: 'Docker', category: 'cloud', level: 'proficient' },
  { name: 'Kubernetes', category: 'cloud', level: 'proficient' },
  { name: 'CI/CD', category: 'cloud', level: 'core' },
  { name: 'OpenTelemetry', category: 'cloud', level: 'proficient' },
  { name: 'PyTorch', category: 'ml-nlp', level: 'proficient' },
  { name: 'TensorFlow', category: 'ml-nlp', level: 'proficient' },
  { name: 'Hugging Face', category: 'ml-nlp', level: 'proficient' },
  { name: 'scikit-learn', category: 'ml-nlp', level: 'core' },
  { name: 'Text Classification', category: 'ml-nlp', level: 'core' },
  { name: 'Semantic Search', category: 'ml-nlp', level: 'core' },
  { name: 'PySpark', category: 'data', level: 'proficient' },
  { name: 'ETL Pipelines', category: 'data', level: 'core' },
  { name: 'Elasticsearch', category: 'data', level: 'proficient' },
  { name: 'Power BI', category: 'data', level: 'proficient' },
];

const defaultHero: HeroContent = {
  subtitles: ['Senior AI Engineer', 'LLM Systems Architect', 'RAG Engineer', 'Production Thinker', 'The Intuitive ✦'],
  tagline: 'eval-driven iteration, not hype ✦',
  description: 'I build AI systems that ship, then I stay to make them fast, reliable, and worth caring about. Four years of production LLMs, retrieval pipelines, and automation that real people use every day.',
  avatarUrl: `${import.meta.env.BASE_URL}avatar.png`,
};

function getDefaultState(): AdminState {
  return {
    projects: defaultProjects,
    experiences: defaultExperiences,
    personalities: defaultPersonalities,
    hobbies: defaultHobbies,
    skills: defaultSkills,
    hero: defaultHero,
    oraclePrompt: '',
    stickers: [],
  };
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState<AdminState>(getDefaultState);

  // ─── Load content from API on mount ────────────────
  const refreshContent = useCallback(async () => {
    try {
      const [contentRes, stickersRes] = await Promise.all([
        contentApi.getAll(),
        stickersApi.getAll(),
      ]);

      const defaults = getDefaultState();
      const content = contentRes.data || {};

      // Use defaults when API returns empty arrays or missing data
      const hasItems = (arr: unknown) => Array.isArray(arr) && arr.length > 0;

      setState({
        projects: hasItems(content.projects) ? content.projects : defaults.projects,
        experiences: hasItems(content.experiences) ? content.experiences : defaults.experiences,
        personalities: hasItems(content.personalities) ? content.personalities : defaults.personalities,
        hobbies: hasItems(content.hobbies) ? content.hobbies : defaults.hobbies,
        skills: hasItems(content.skills) ? content.skills : defaults.skills,
        hero: content.hero && content.hero.subtitles ? content.hero : defaults.hero,
        oraclePrompt: content.oracle_prompt || '',
        stickers: stickersRes.data || [],
      });
    } catch {
      // API unreachable — use defaults (static site still works)
      setState(getDefaultState());
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── Check existing auth on mount ──────────────────
  useEffect(() => {
    const checkAuth = async () => {
      if (authApi.isLoggedIn()) {
        const res = await authApi.verify();
        if (res.data?.valid) {
          setIsAdmin(true);
        } else {
          authApi.logout();
        }
      }
    };
    checkAuth();
    refreshContent();
  }, [refreshContent]);

  // ─── Auth ──────────────────────────────────────────
  const login = useCallback(async (username: string, password: string) => {
    const res = await authApi.login(username, password);
    if (res.data?.token) {
      setIsAdmin(true);
      return { success: true };
    }
    return { success: false, error: res.error || 'Login failed' };
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setIsAdmin(false);
    setIsEditMode(false);
  }, []);

  const toggleEditMode = useCallback(() => setIsEditMode((v) => !v), []);

  // ─── Content CRUD ──────────────────────────────────
  const saveContent = useCallback(async (key: string, data: any) => {
    const res = await contentApi.update(key, data);
    if (!res.error) {
      // Update local state immediately
      setState((s) => {
        const keyMap: Record<string, keyof AdminState> = {
          projects: 'projects',
          experiences: 'experiences',
          personalities: 'personalities',
          hobbies: 'hobbies',
          skills: 'skills',
          hero: 'hero',
          oracle_prompt: 'oraclePrompt',
        };
        const stateKey = keyMap[key];
        if (stateKey) {
          return { ...s, [stateKey]: data };
        }
        return s;
      });
      return true;
    }
    return false;
  }, []);

  // ─── Sticker CRUD ──────────────────────────────────
  const addSticker = useCallback(async (sticker: Omit<PlacedSticker, 'sticker_id'>) => {
    const res = await stickersApi.create(sticker);
    if (res.data?.sticker) {
      setState((s) => ({ ...s, stickers: [...s.stickers, res.data.sticker] }));
    }
  }, []);

  const updateSticker = useCallback(async (id: string, updates: Partial<PlacedSticker>) => {
    await stickersApi.update(id, updates);
    setState((s) => ({
      ...s,
      stickers: s.stickers.map((st) => (st.sticker_id === id ? { ...st, ...updates } : st)),
    }));
  }, []);

  const removeSticker = useCallback(async (id: string) => {
    await stickersApi.remove(id);
    setState((s) => ({ ...s, stickers: s.stickers.filter((st) => st.sticker_id !== id) }));
  }, []);

  const uploadStickerImage = useCallback(async (file: File): Promise<string | null> => {
    const res = await stickersApi.uploadImage(file);
    return res.data?.url || null;
  }, []);

  // ─── Import/Export ─────────────────────────────────
  const exportAll = useCallback(async () => {
    const res = await contentApi.exportAll();
    if (res.data) {
      return JSON.stringify({ ...res.data, stickers: state.stickers }, null, 2);
    }
    // Fallback to local state
    return JSON.stringify(state, null, 2);
  }, [state]);

  const importAll = useCallback(async (json: string) => {
    try {
      const parsed = JSON.parse(json);
      const content = parsed.content || parsed;
      const res = await contentApi.importAll(content);
      if (!res.error) {
        // Also import stickers if present
        if (parsed.stickers) {
          await stickersApi.bulkUpdate(parsed.stickers);
        }
        await refreshContent();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [refreshContent]);

  const resetToDefaults = useCallback(async () => {
    await contentApi.reset();
    setState(getDefaultState());
  }, []);

  return (
    <AdminContext.Provider
      value={{
        isAdmin, isEditMode, isLoading, login, logout, toggleEditMode,
        state, saveContent,
        addSticker, updateSticker, removeSticker, uploadStickerImage,
        exportAll, importAll, resetToDefaults, refreshContent,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
