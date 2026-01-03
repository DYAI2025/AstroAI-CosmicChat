import type { QuizDefinition } from '../../../types';

import { profiles } from './profiles';
import { questions } from './questions';

export const krafttierQuiz: QuizDefinition = {
  meta: {
    id: 'quiz.krafttier',
    title: 'Welches Krafttier führt dich?',
    subtitle: 'Eine Reise zu deinem spirituellen Begleiter',
    description:
      '12 mystische Szenarien enthüllen, welches Tier deine Seele am tiefsten widerspiegelt.',
    cluster: 'identity',
    estimatedMinutes: 5,
    questionCount: 12,
    disclaimer:
      'Dieser Test dient der spielerischen Selbstreflexion und stellt keine psychologische Diagnose dar.',
  },
  questions,
  profiles,
};

export { questions } from './questions';
export { profiles } from './profiles';
