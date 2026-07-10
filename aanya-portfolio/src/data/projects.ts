import type { Project } from '@/types';

export const projects: Project[] = [
  {
    slug: 'genai-chat-platform',
    number: 'I',
    title: 'Enterprise GenAI Chat Platform',
    category: 'llm-systems',
    tagline: 'The AI platform an entire company talks to. 70K requests a month, 5 LLMs, zero patience for downtime.',
    summary:
      'I co-architected the backend that handles 20M tokens a day: streaming answers, document intelligence, agentic search. Built for messy enterprise reality, not a demo video.',
    tech: ['FastAPI', 'WebSocket', 'Celery/Redis', 'Azure OpenAI', 'Azure AD', 'OpenTelemetry'],
    metrics: [
      { label: 'requests/month', value: '70K' },
      { label: 'tokens/day', value: '20M' },
      { label: 'models integrated', value: '5' },
    ],
    caseStudy: {
      problem:
        'The company needed one AI interface for very different jobs: Q&A over internal documents, summarization, web research, structured data workflows. It had to route across multiple LLMs, respect enterprise auth, and stay debuggable at 2am. Off-the-shelf tools failed on security, cost, or customization. Usually all three.',
      approach:
        'I designed the backend so every capability (RAG, summarization, web search, CSV analysis) is a composable module behind one routing layer. FastAPI for async performance, WebSocket streaming so answers feel alive, Celery and Redis for the heavy jobs, Azure AD OAuth2 for auth. OpenTelemetry went in on day one, because debugging a black box is not a hobby I wanted.',
      build:
        'The routing layer dispatches to 5 different models based on task type and user preference. Streaming token delivery makes responses feel instant even when the model is thinking hard. Every feature module deploys independently. I load tested with Locust and built multi-endpoint retry and failover, because Azure OpenAI has moods and users should never meet them.',
      result:
        '70K requests a month and 20M tokens a day, in production, today. Streaming cut perceived latency by about 70%. Failover pushed Azure OpenAI uptime to 99.8%. Teams across the company use it daily for document Q&A, research, and analysis. That last part is the metric I actually care about.',
    },
    icon: 'MessageSquare',
    accentColor: '#7c5cff',
  },
  {
    slug: 'rag-document-intelligence',
    number: 'II',
    title: 'RAG + Document Intelligence Pipeline',
    category: 'llm-systems',
    tagline: 'Retrieval accuracy up 60%, latency cut in half. The eval framework came first, the pipeline second.',
    summary:
      'An evaluation-first RAG pipeline: Azure Document Intelligence for parsing, HNSW hybrid search, metadata filtering. Measured before built, which is why it worked.',
    tech: ['Azure Document Intelligence', 'HNSW', 'Hybrid Search', 'Metadata Filtering', 'Python'],
    metrics: [
      { label: 'retrieval accuracy ↑', value: '+60%' },
      { label: 'latency reduction', value: '50%' },
    ],
    caseStudy: {
      problem:
        'Enterprise PDFs are gremlins. Scans, tables, layouts designed by someone who hates you. Basic text extraction mangled them, retrieval returned confidently wrong chunks, and nobody could say how bad it really was because no evaluation existed. The system was being judged on vibes.',
      approach:
        'I built the eval set before touching the pipeline. Known-good retrieval pairs first, opinions second. Then the stack: Azure Document Intelligence for high-fidelity parsing that keeps tables and headers intact, HNSW vector index for fast similarity, BM25 for keyword precision, metadata filters to scope by document type, date, and department.',
      build:
        'Hybrid search blends dense and sparse retrieval with learned weighting. Metadata pre-filtering shrinks the search space before vectors run, so a query like "Q3 finance reports" stays scoped and fast. Chunking respects document structure: tables stay whole, header hierarchy survives. Then eval, tune, repeat, until the numbers moved and kept moving.',
      result:
        'Retrieval accuracy up 60% on the offline eval set. Latency down 50%, mostly from pre-filtering. The eval framework became the team standard for judging any RAG change since. Nobody ships blind anymore, and I consider that the real deliverable.',
    },
    icon: 'Search',
    accentColor: '#b8a9e8',
  },
  {
    slug: 'ai-translation-tool',
    number: 'III',
    title: 'AI Translation Workflow Tool',
    category: 'automation',
    tagline: 'Replaced DeepL with a tool we already had the ingredients for. 850K+ events, licensing bill gone.',
    summary:
      'A small in-house translation app (FastAPI, PyQt, Azure Cognitive Services) that replaced a paid third-party tool, processed 850K+ events, and made the licensing line item disappear.',
    tech: ['FastAPI', 'PyQt', 'Azure Cognitive Services', 'Python'],
    metrics: [
      { label: 'events processed', value: '850K+' },
      { label: 'licensing cost', value: 'Eliminated' },
    ],
    caseStudy: {
      problem:
        'We were paying real licensing money for DeepL while sitting on an Azure contract that could do the same job. The paid tool also could not handle our domain terminology, did not integrate with our systems, and the per-seat pricing scaled with every new hire. The math stopped mathing.',
      approach:
        'Build the boring version, fast. Azure Cognitive Services for translation, since we already paid for it. A FastAPI backend for systems that need an API, a PyQt desktop app for humans who need drag-and-drop. Plus a QA layer for German and English documents, because numbers and dates love to break in translation and nobody notices until it matters.',
      build:
        'Batch processing, async translation calls, caching for repeated content. The desktop app has drag-and-drop files and progress tracking, nothing clever, everything reliable. The QA module scans translated PDFs for number and date mismatches between DE and EN, then generates Excel audit reports with the problems highlighted.',
      result:
        '850K+ translation events processed and counting. DeepL license fully retired. The QA audits catch formatting errors the paid tool never flagged, and save the localization team hours of manual review per batch. My favorite kind of project: small, unglamorous, pays for itself forever.',
    },
    icon: 'Languages',
    accentColor: '#a9e8d0',
  },
  {
    slug: 'salesforce-ticket-routing',
    number: 'IV',
    title: 'ML-Based Ticket Routing',
    category: 'ml-nlp',
    tagline: '95K tickets, 117 queues, and a routing model agents actually trust.',
    summary:
      'Priority and queue-routing models for 95K+ Salesforce support tickets. Routing accuracy went from 43% to 61%, with a projected 1,700 hours a year handed back to the support team.',
    tech: ['TF-IDF', 'LLM Features', 'scikit-learn', 'Undersampling', 'Salesforce'],
    metrics: [
      { label: 'priority accuracy', value: '66→70%' },
      { label: 'routing accuracy', value: '43→61%' },
      { label: 'top-2 routing', value: '78%' },
      { label: 'projected savings', value: '1,700 h/yr' },
    ],
    caseStudy: {
      problem:
        'Support agents were hand-routing 95K+ tickets a year across 117 specialized queues. Mis-routed tickets bounced between teams for days while customers waited. Priority classification was roulette: the same ticket could be urgent or routine depending on who triaged it that morning.',
      approach:
        'I framed it as two linked classification problems, priority and queue. Features came from both worlds: TF-IDF for the classic text signal, LLM-extracted features (intent, urgency, product mentions) for the nuance TF-IDF misses. Aggressive undersampling to survive the class imbalance that 117 queues guarantees.',
      build:
        'Separate models for priority (4 classes) and queue routing (117 classes). The design choice that made it land: top-N suggestions. When the model is not confident about its first pick, it offers the top 2 or 3 queues and lets the agent decide. Agents stopped treating it like a rival and started treating it like a colleague.',
      result:
        'Priority accuracy went from 66% to 70%. Queue routing jumped from 43% to 61%, and the right queue is in the top 2 suggestions 78% of the time. Projected 1,700 hours a year returned to the support team. The top-N design was the difference between a model people use and a model people quietly ignore.',
    },
    icon: 'Route',
    accentColor: '#e8a9c8',
  },
  {
    slug: 'code-documentation-generator',
    number: 'V',
    title: 'Automated Code Documentation',
    category: 'automation',
    tagline: 'Point it at a repository, get real documentation back. Days of writing became minutes.',
    summary:
      'A pipeline that turns entire repositories into structured technical docs: prompt templates, token-aware chunking, async LLM calls, clean Markdown and DOCX out the other side.',
    tech: ['Async Python', 'LLM APIs', 'Prompt Templates', 'Token Chunking', 'Markdown/DOCX'],
    metrics: [
      { label: 'output formats', value: 'MD + DOCX' },
      { label: 'scope', value: 'Single file → Full repo' },
    ],
    caseStudy: {
      problem:
        'The internal docs were outdated everywhere, writing them was nobody\'s favorite job, and onboarding a new engineer meant archaeology. Every team knew it. Every team deprioritized fixing it. The gap grew with the codebase.',
      approach:
        'Read the code, chunk it within token limits without ever splitting a function in half, run each chunk through prompt templates built for the job, assemble the outputs into actual documentation. Async LLM calls to parallelize across files, because waiting is a choice.',
      build:
        'Token-aware chunking that respects function and class boundaries. Prompt templates at three zoom levels: function docstrings, module summaries, repo-wide architecture overviews. Rate-limited async processing to stay inside API quotas. Exports Markdown for Git and DOCX for everyone who lives in Word.',
      result:
        'Documentation time went from days to minutes per repository. The output lands as a strong first draft that engineers refine instead of writing from zero, which is the difference between docs existing and docs not existing. Multiple internal teams adopted it for onboarding.',
    },
    icon: 'FileCode',
    accentColor: '#e8d5a9',
  },
  {
    slug: 'healthcare-chatbot',
    number: 'VI',
    title: 'Healthcare Chatbot for Diabetic Patients',
    category: 'research',
    tagline: 'My first published work. Springer, Lecture Notes in Networks and Systems, Vol. 425.',
    summary:
      'A classification-based chatbot for diabetic patient support, designed during my degree and published by Springer. This is where the whole journey started.',
    tech: ['Classification Models', 'NLP', 'Healthcare ML', 'Python'],
    metrics: [
      { label: 'publication', value: 'Springer LNNS' },
      { label: 'volume', value: '425' },
    ],
    caseStudy: {
      problem:
        'Diabetic patients have a constant stream of small questions about symptoms, medication, diet, and monitoring. Most do not need a doctor visit. All of them need reliable answers. Generic chatbots gave generic responses, and generic is dangerous when the topic is medication.',
      approach:
        'Intent classification first: route every patient query into a medical category, then answer from a curated response base reviewed by professionals. Supervised training on labeled medical Q&A data, so the routing had ground truth instead of guesses.',
      build:
        'A multi-class text classifier covering symptoms, medication, diet, emergencies, and lifestyle, wired to a professionally reviewed response database, with clear escalation paths for anything complex. Evaluated on standard classification metrics and validated against medical guidelines.',
      result:
        'Accepted and published in Springer\'s Lecture Notes in Networks and Systems, Volume 425. The finding that stuck with me: classification can carry reliable first-line support for chronic disease, as long as the system knows exactly when to hand off to a human. I have been building around that principle ever since.',
    },
    icon: 'HeartPulse',
    accentColor: '#e8a9c8',
  },
];

export const featuredSlugs = [
  'genai-chat-platform',
  'rag-document-intelligence',
  'salesforce-ticket-routing',
];
