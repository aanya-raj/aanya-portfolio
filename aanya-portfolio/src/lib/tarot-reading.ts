// ─── The Card Reader ──────────────────────────────────────────
// A fully client-side "compatibility reading" — no LLM, no API key,
// no tokens burned. Deliberate choice: a portfolio feature should
// work for every visitor, instantly, forever. It matches a pasted
// job description against Aanya's real skill profile with weighted
// keyword matching, then dresses the result in tarot.

export interface SkillMatch {
  skill: string;
  count: number;
  weight: number;
}

export interface GrowthEdge {
  skill: string;
  note: string;
}

export interface Reading {
  kind: 'reading';
  score: number;
  arcana: string; // name of the "card" drawn for the verdict
  verdict: string;
  matches: SkillMatch[];
  edges: GrowthEdge[];
  vibe: string;
}

export interface Rejection {
  kind: 'not-a-jd';
  message: string;
}

export type ReadingResult = Reading | Rejection;

// ─── Skill lexicon: what Aanya actually works with ─────────────
// weight 3 = core daily-driver · 2 = strong · 1 = working knowledge
const SKILLS: { skill: string; aliases: string[]; weight: number }[] = [
  { skill: 'Python', aliases: ['python'], weight: 3 },
  { skill: 'LLM Systems', aliases: ['llm', 'llms', 'large language model', 'large language models', 'genai', 'gen ai', 'generative ai', 'foundation model', 'foundation models'], weight: 3 },
  { skill: 'RAG', aliases: ['rag', 'retrieval augmented', 'retrieval-augmented', 'retrieval pipeline', 'retrieval pipelines', 'grounding', 'knowledge retrieval'], weight: 3 },
  { skill: 'Azure OpenAI', aliases: ['azure openai', 'azure open ai'], weight: 3 },
  { skill: 'Azure', aliases: ['azure', 'azure ai', 'azure cloud'], weight: 3 },
  { skill: 'OpenAI APIs', aliases: ['openai', 'gpt-4', 'gpt4', 'gpt-4o', 'chatgpt api', 'o1', 'reasoning models'], weight: 3 },
  { skill: 'LangChain', aliases: ['langchain'], weight: 3 },
  { skill: 'LangGraph', aliases: ['langgraph'], weight: 3 },
  { skill: 'Agentic AI', aliases: ['agent', 'agents', 'agentic', 'multi-agent', 'tool calling', 'tool-calling', 'function calling', 'function-calling', 'mcp'], weight: 3 },
  { skill: 'Prompt Engineering', aliases: ['prompt engineering', 'prompt design', 'prompting', 'prompt'], weight: 3 },
  { skill: 'Vector Search', aliases: ['vector', 'embedding', 'embeddings', 'pinecone', 'faiss', 'qdrant', 'weaviate', 'chroma', 'milvus', 'pgvector', 'hnsw', 'semantic search', 'similarity search', 'vector database', 'vector db'], weight: 3 },
  { skill: 'Hybrid Search', aliases: ['hybrid search', 'bm25', 'keyword search', 'reranking', 'reranker', 're-ranking'], weight: 2 },
  { skill: 'FastAPI', aliases: ['fastapi', 'fast api'], weight: 3 },
  { skill: 'Backend APIs', aliases: ['rest api', 'rest apis', 'restful', 'api development', 'api design', 'backend', 'back-end', 'microservice', 'microservices'], weight: 3 },
  { skill: 'Async Python', aliases: ['asyncio', 'async', 'concurrency', 'concurrent'], weight: 2 },
  { skill: 'WebSockets / Streaming', aliases: ['websocket', 'websockets', 'streaming', 'sse', 'server-sent'], weight: 2 },
  { skill: 'Celery / Redis', aliases: ['celery', 'redis', 'task queue', 'message queue', 'job queue'], weight: 2 },
  { skill: 'Docker', aliases: ['docker', 'container', 'containers', 'containerization', 'containerisation'], weight: 2 },
  { skill: 'Kubernetes', aliases: ['kubernetes', 'k8s', 'aks', 'eks', 'gke'], weight: 2 },
  { skill: 'CI/CD', aliases: ['ci/cd', 'cicd', 'ci cd', 'continuous integration', 'continuous deployment', 'azure devops', 'github actions', 'pipelines'], weight: 2 },
  { skill: 'MLOps / LLMOps', aliases: ['mlops', 'llmops', 'ml ops', 'model deployment', 'model serving', 'model monitoring', 'drift'], weight: 2 },
  { skill: 'Observability', aliases: ['observability', 'opentelemetry', 'telemetry', 'tracing', 'monitoring', 'logging', 'grafana', 'prometheus'], weight: 2 },
  { skill: 'Evals', aliases: ['eval', 'evals', 'evaluation', 'benchmarks', 'benchmark', 'a/b test', 'offline evaluation', 'llm-as-judge', 'quality metrics'], weight: 3 },
  { skill: 'Fine-tuning', aliases: ['fine-tuning', 'fine tuning', 'finetuning', 'lora', 'qlora', 'peft', 'instruction tuning', 'sft'], weight: 2 },
  { skill: 'NLP', aliases: ['nlp', 'natural language processing', 'text classification', 'ner', 'sentiment', 'summarization', 'summarisation', 'text mining'], weight: 2 },
  { skill: 'PyTorch', aliases: ['pytorch', 'torch'], weight: 2 },
  { skill: 'TensorFlow', aliases: ['tensorflow', 'keras'], weight: 2 },
  { skill: 'scikit-learn', aliases: ['scikit', 'sklearn', 'scikit-learn'], weight: 2 },
  { skill: 'Hugging Face', aliases: ['hugging face', 'huggingface', 'transformers'], weight: 2 },
  { skill: 'Classical ML', aliases: ['machine learning', 'ml model', 'ml models', 'xgboost', 'random forest', 'classification', 'regression', 'clustering', 'feature engineering', 'supervised'], weight: 2 },
  { skill: 'SQL / Databases', aliases: ['sql', 'postgres', 'postgresql', 'mysql', 'database', 'databases', 'sqlalchemy'], weight: 2 },
  { skill: 'Elasticsearch', aliases: ['elasticsearch', 'elastic search', 'opensearch'], weight: 2 },
  { skill: 'Spark / PySpark', aliases: ['spark', 'pyspark', 'databricks'], weight: 2 },
  { skill: 'ETL / Data Pipelines', aliases: ['etl', 'data pipeline', 'data pipelines', 'data engineering', 'ingestion'], weight: 2 },
  { skill: 'Document Intelligence', aliases: ['document intelligence', 'ocr', 'document processing', 'pdf processing', 'document understanding', 'idp', 'document ai'], weight: 2 },
  { skill: 'TypeScript', aliases: ['typescript'], weight: 1 },
  { skill: 'Load Testing', aliases: ['locust', 'load test', 'load testing', 'performance testing', 'stress testing'], weight: 1 },
  { skill: 'Power BI / Dashboards', aliases: ['power bi', 'powerbi', 'tableau', 'dashboard', 'dashboards', 'plotly', 'data visualization', 'data visualisation'], weight: 1 },
  { skill: 'Git', aliases: ['git', 'github', 'bitbucket', 'version control'], weight: 1 },
];

// ─── Honest gaps: things JDs ask for that aren't her stack ─────
const EDGES: { skill: string; aliases: string[]; note: string }[] = [
  { skill: 'Go', aliases: ['golang', ' go,', ' go ', ' go.', '(go)'], note: 'not her daily driver, but systems people cross that bridge quickly' },
  { skill: 'Rust', aliases: ['rust'], note: 'admired from a respectful distance. the instincts transfer' },
  { skill: 'Java', aliases: ['java ', 'java,', 'java.', 'java/'], note: 'she reads it fine, writes Python by choice' },
  { skill: 'C++', aliases: ['c++'], note: 'not in the current toolkit, and the deck will not pretend otherwise' },
  { skill: '.NET / C#', aliases: ['.net', 'c#', 'dotnet'], note: 'she lives on the Python side of Azure' },
  { skill: 'AWS depth', aliases: ['aws', 'sagemaker', 'bedrock', 'lambda'], note: 'her production depth is Azure. the concepts map one to one' },
  { skill: 'GCP depth', aliases: ['gcp', 'google cloud', 'vertex'], note: 'has touched it, ships on Azure' },
  { skill: 'Frontend-heavy React', aliases: ['react', 'next.js', 'nextjs', 'vue', 'angular', 'frontend', 'front-end'], note: 'she builds working UIs (this site included) but the backend is where she is lethal' },
  { skill: 'Computer Vision', aliases: ['computer vision', 'cv ', 'opencv', 'image recognition', 'object detection', 'yolo'], note: 'solid PyTorch and TensorFlow base, different domain' },
  { skill: 'Reinforcement Learning', aliases: ['reinforcement learning', 'rlhf', ' rl '], note: 'theory yes, production not yet' },
  { skill: 'Kafka', aliases: ['kafka'], note: 'she runs Celery and Redis queues. same patterns, different broker' },
  { skill: 'Airflow / dbt', aliases: ['airflow', 'dbt', 'dagster', 'prefect'], note: 'her ETL miles are Spark flavored, the orchestration concepts carry over' },
  { skill: 'Recommender Systems', aliases: ['recommender', 'recommendation system', 'recommendation engine'], note: 'adjacent retrieval instincts, new domain' },
  { skill: 'Snowflake', aliases: ['snowflake'], note: 'warehouse-agnostic SQL, no Snowflake miles yet' },
];

// JD-shaped words — used to decide whether the input is a job description
const JD_SIGNALS = [
  'experience', 'responsibilities', 'requirements', 'qualifications', 'role',
  'you will', "you'll", 'we are looking', "we're looking", 'candidate',
  'skills', 'salary', 'benefits', 'team', 'position', 'job', 'hiring',
  'engineer', 'developer', 'scientist', 'remote', 'hybrid', 'about you',
  'must have', 'nice to have', 'preferred', 'years',
];

const VERDICT_ARCANA: { min: number; arcana: string; verdict: string }[] = [
  { min: 85, arcana: 'The Star', verdict: 'The deck rarely glows like this. Most of this role is work she has already shipped to production. The rest is a short walk from where she stands.' },
  { min: 70, arcana: 'The Magician', verdict: 'A strong hand. The core of this role sits inside things she has already built, broken, and rebuilt. The new parts are the fun parts.' },
  { min: 55, arcana: 'The Chariot', verdict: 'Enough overlap to be useful in week one, enough new ground to stay interesting. She tends to pick roles with exactly this ratio.' },
  { min: 0, arcana: 'The Moon', verdict: 'The direct overlap is thinner here, and the deck will not lie to you. But fundamentals travel, and hers are solid. Worth a conversation if the role rewards fast learners.' },
];

function detectVibe(text: string): string {
  const t = text.toLowerCase();
  if (/(remote|distributed|async culture|work from anywhere|global team)/.test(t))
    return 'Remote and distributed. That is exactly the setup she wants, timezone flexible and all.';
  if (/(fast-paced|startup|early-stage|scrappy|wear many hats|0 to 1|zero to one)/.test(t))
    return 'Fast moving and high ownership. She does her best work when a system is fully hers, and the hyperfocus is very real.';
  if (/(enterprise|stakeholder|cross-functional|compliance|governance)/.test(t))
    return 'Enterprise scale with real stakeholders. Familiar terrain. She has spent years making AI work inside a global organization, not just in notebooks.';
  if (/(research|publication|paper|novel|state-of-the-art|sota)/.test(t))
    return 'Research flavored. She is Springer published and keeps one foot in the literature, though production has her heart.';
  return 'The honest read: she thrives where ownership is real, quality is non negotiable, and someone cares how the thing feels to use.';
}

function countOccurrences(haystack: string, needle: string): number {
  // word-ish boundary matching, case-insensitive
  const escaped = needle.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = /^[a-z0-9]/i.test(needle.trim())
    ? new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`, 'gi')
    : new RegExp(escaped, 'gi');
  return (haystack.match(pattern) || []).length;
}

export function readTheCards(input: string): ReadingResult {
  const text = ` ${input.replace(/\s+/g, ' ').trim().toLowerCase()} `;

  if (text.trim().length < 60) {
    return {
      kind: 'not-a-jd',
      message: 'The cards need more than that. Paste a full job description, or at least the requirements section, and the deck will do its thing ✦',
    };
  }

  const signalHits = JD_SIGNALS.filter((s) => text.includes(s)).length;

  // ── Match her skills ──
  const matches: SkillMatch[] = [];
  for (const s of SKILLS) {
    let count = 0;
    for (const a of s.aliases) count += countOccurrences(text, a);
    if (count > 0) matches.push({ skill: s.skill, count, weight: s.weight });
  }
  matches.sort((a, b) => b.weight * b.count - a.weight * a.count || b.weight - a.weight);

  if (signalHits < 2 && matches.length < 2) {
    return {
      kind: 'not-a-jd',
      message: 'Hmm. This does not read like a job description. The deck only knows how to read roles, not minds. Paste one in and try again ✦',
    };
  }

  // ── Find honest edges ──
  const edges: GrowthEdge[] = [];
  for (const e of EDGES) {
    if (e.aliases.some((a) => text.includes(a))) {
      edges.push({ skill: e.skill, note: e.note });
    }
  }

  // ── Score ──
  // Coverage of core skills mentioned in the JD, penalized by edge count.
  const matchedWeight = matches.reduce((sum, m) => sum + m.weight + Math.min(m.count - 1, 2) * 0.25, 0);
  const coreMatched = matches.filter((m) => m.weight === 3).length;
  const raw =
    40 +
    Math.min(matchedWeight * 2.2, 44) + // breadth of overlap
    Math.min(coreMatched * 2.5, 15) - // depth on core stack
    Math.min(edges.length * 3.5, 18); // honest penalty for gaps
  // small deterministic "mystique" wobble so identical JDs always read the same
  let hash = 0;
  for (let i = 0; i < input.length; i++) hash = (hash * 31 + input.charCodeAt(i)) | 0;
  const wobble = (Math.abs(hash) % 5) - 2;
  const score = Math.max(35, Math.min(97, Math.round(raw + wobble)));

  const band = VERDICT_ARCANA.find((v) => score >= v.min)!;

  return {
    kind: 'reading',
    score,
    arcana: band.arcana,
    verdict: band.verdict,
    matches: matches.slice(0, 8),
    edges: edges.slice(0, 3),
    vibe: detectVibe(text),
  };
}
