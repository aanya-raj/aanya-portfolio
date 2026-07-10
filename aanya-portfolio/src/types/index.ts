export interface Project {
  slug: string;
  number: string;
  title: string;
  category: 'llm-systems' | 'ml-nlp' | 'automation' | 'research';
  tagline: string;
  summary: string;
  tech: string[];
  metrics: { label: string; value: string }[];
  caseStudy: {
    problem: string;
    approach: string;
    build: string;
    result: string;
  };
  icon: string;
  accentColor: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
  type: 'current' | 'past';
}

export interface Skill {
  name: string;
  category: 'ai-llm' | 'backend' | 'cloud' | 'ml-nlp' | 'data' | 'devops';
  level: 'core' | 'proficient' | 'familiar';
}

export interface Personality {
  archetype: string;
  title: string;
  description: string;
  emoji: string;
}

export interface Hobby {
  label: string;
  icon: string;
  color: string;
}

export interface Metric {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
}

export type Theme = 'light' | 'dark';
