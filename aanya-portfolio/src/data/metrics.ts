import type { Metric } from '@/types';

export const heroMetrics: Metric[] = [
  { label: 'Requests / Month', value: 70, suffix: 'K' },
  { label: 'Tokens / Day', value: 20, suffix: 'M' },
  { label: 'Retrieval Accuracy ↑', value: 60, suffix: '%', prefix: '+' },
  { label: 'Events Processed', value: 850, suffix: 'K+' },
  { label: 'Hours / Year Saved', value: 1700, suffix: '' },
];
