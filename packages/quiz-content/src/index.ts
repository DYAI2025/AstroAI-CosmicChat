export * from './types';

// Identity Cluster
export { krafttierQuiz, IDENTITY_QUIZZES } from './clusters/identity';

// Cluster registry
export const CLUSTERS = {
  identity: ['quiz.krafttier'] as const,
  social: [] as string[],
  'life-path': [] as string[],
  relationship: [] as string[],
  personality: [] as string[],
};
