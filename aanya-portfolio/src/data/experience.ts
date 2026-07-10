import type { Experience } from '@/types';

export const experiences: Experience[] = [
  {
    company: 'Dürr Group',
    role: 'Machine Learning Engineer / AI Engineer',
    period: 'Apr 2023 — Present',
    location: 'Noida, IN (Hybrid)',
    type: 'current',
    highlights: [
      'Co-architected multi-model AI chat platform (70K req/mo, 20M tokens/day)',
      'Owned production LLM features: RAG, summarization, agentic search, structured outputs',
      'Built eval-driven RAG pipeline, retrieval accuracy up 60%',
      'Shipped AI Translation tool replacing DeepL, 850K+ events processed',
      'Built ML ticket routing for Salesforce, projected 1,700 h/yr savings',
    ],
  },
  {
    company: 'Flex Data Private Limited',
    role: 'Data Analyst',
    period: 'May 2022 — Mar 2023',
    location: 'Remote, IN',
    type: 'past',
    highlights: [
      'Built PySpark ETL pipelines, 20% faster ingestion',
      'EDA on 200+ GB structured & unstructured data',
      'Trained e-commerce color classification model (90% accuracy)',
      'NLP models improving search ranking by 15%',
    ],
  },
  {
    company: 'Freelance',
    role: 'Freelance Data Scientist',
    period: 'Oct 2021 — Apr 2023',
    location: 'Remote, IN',
    type: 'past',
    highlights: [
      '20+ AI/ML projects across healthcare, finance, e-commerce',
      'End-to-end: data engineering → modeling → deployment',
      '4.9-star average rating on Fiverr',
    ],
  },
  {
    company: 'MJPRU, Bareilly',
    role: 'B.Tech — Computer Science & IT',
    period: 'Aug 2018 — Jun 2022',
    location: 'Bareilly, IN',
    type: 'past',
    highlights: [
      'Published healthcare chatbot research in Springer LNNS (Vol. 425)',
    ],
  },
];
