import type { MarkerWeight } from '@quizzme/domain';

// Re-export for convenience
export type { MarkerWeight } from '@quizzme/domain';

export interface QuizMeta {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cluster: 'identity' | 'social' | 'life-path' | 'relationship' | 'personality';
  estimatedMinutes: number;
  questionCount: number;
  disclaimer?: string;
}

export interface QuizOption {
  id: string;
  text: string;
  markers: MarkerWeight[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  scenario?: string;
  options: QuizOption[];
}

export interface QuizProfile {
  id: string;
  title: string;
  icon: string;
  tagline: string;
  description: string;
  stats: { label: string; value: number }[];
  markers: MarkerWeight[];
}

export interface QuizDefinition {
  meta: QuizMeta;
  questions: QuizQuestion[];
  profiles: QuizProfile[];
}
