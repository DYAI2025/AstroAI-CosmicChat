# Quiz Integration & AstroSheet Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate all QuizzMe quizzes and the AstroSheet dashboard into the monorepo, with markers mapped to Big Five traits.

**Architecture:** Dashboard-first approach where AstroSheet becomes the main `/` route post-login. Quizzes are organized into 5 clusters (Identity, Social/EQ, Life Path, Relationship, Personality Core), migrated in phases. Marker-based scoring from quizzes maps to Big Five traits via explicit mapping table.

**Tech Stack:** Next.js 14 App Router, React Context, TypeScript, Tailwind CSS, pnpm monorepo

---

## Phase 1: Foundation

### Task 1: Create Marker Registry

**Files:**
- Create: `packages/domain/src/markers/types.ts`
- Create: `packages/domain/src/markers/registry.ts`
- Test: `packages/domain/src/markers/__tests__/registry.test.ts`

**Step 1: Write the failing test**

```typescript
// packages/domain/src/markers/__tests__/registry.test.ts
import { describe, it, expect } from 'vitest';
import { MARKERS, isValidMarkerId, getMarkerCategory } from '../registry';

describe('Marker Registry', () => {
  it('should have social markers', () => {
    expect(MARKERS.social).toContain('dominance');
    expect(MARKERS.social).toContain('extroversion');
  });

  it('should validate marker IDs', () => {
    expect(isValidMarkerId('marker.social.dominance')).toBe(true);
    expect(isValidMarkerId('marker.invalid.foo')).toBe(false);
  });

  it('should extract marker category', () => {
    expect(getMarkerCategory('marker.social.dominance')).toBe('social');
    expect(getMarkerCategory('marker.eq.empathy')).toBe('eq');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @quizzme/domain test -- --run src/markers/__tests__/registry.test.ts`
Expected: FAIL with "Cannot find module '../registry'"

**Step 3: Create types file**

```typescript
// packages/domain/src/markers/types.ts
export type MarkerCategory =
  | 'social'
  | 'eq'
  | 'aura'
  | 'values'
  | 'lifestyle'
  | 'cognition'
  | 'love'
  | 'skills';

export interface MarkerWeight {
  id: string;
  weight: number;
}

export interface MarkerContribution {
  markerId: string;
  value: number;
  source: string; // quiz ID
  timestamp: number;
}
```

**Step 4: Write minimal implementation**

```typescript
// packages/domain/src/markers/registry.ts
import type { MarkerCategory } from './types';

export const MARKERS: Record<MarkerCategory, readonly string[]> = {
  social: ['dominance', 'extroversion', 'introversion', 'reserve'],
  eq: ['empathy', 'self_awareness', 'self_regulation', 'motivation', 'social_skill'],
  aura: ['warmth', 'intensity', 'mystery'],
  values: ['achievement', 'connection', 'autonomy', 'security', 'conformity'],
  lifestyle: ['spontaneity', 'structure'],
  cognition: ['system_thinking', 'creativity'],
  love: ['attachment_secure', 'attachment_anxious'],
  skills: ['creativity', 'analysis'],
} as const;

export function isValidMarkerId(id: string): boolean {
  const match = id.match(/^marker\.(\w+)\.(\w+)$/);
  if (!match) return false;

  const [, category, name] = match;
  const categoryMarkers = MARKERS[category as MarkerCategory];
  return categoryMarkers ? categoryMarkers.includes(name) : false;
}

export function getMarkerCategory(id: string): MarkerCategory | null {
  const match = id.match(/^marker\.(\w+)\./);
  if (!match) return null;

  const category = match[1] as MarkerCategory;
  return MARKERS[category] ? category : null;
}
```

**Step 5: Run test to verify it passes**

Run: `pnpm --filter @quizzme/domain test -- --run src/markers/__tests__/registry.test.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add packages/domain/src/markers/
git commit -m "feat(domain): add marker registry with validation"
```

---

### Task 2: Create Marker-to-Big-Five Mapping

**Files:**
- Create: `packages/domain/src/markers/mapping.ts`
- Test: `packages/domain/src/markers/__tests__/mapping.test.ts`

**Step 1: Write the failing test**

```typescript
// packages/domain/src/markers/__tests__/mapping.test.ts
import { describe, it, expect } from 'vitest';
import { MARKER_TO_BIG_FIVE, getTraitWeights } from '../mapping';

describe('Marker to Big Five Mapping', () => {
  it('should map aura.warmth to agreeableness and extraversion', () => {
    const weights = getTraitWeights('marker.aura.warmth');
    expect(weights).toContainEqual({ trait: 'agreeableness', weight: 0.6 });
    expect(weights).toContainEqual({ trait: 'extraversion', weight: 0.4 });
  });

  it('should return empty array for unknown marker', () => {
    const weights = getTraitWeights('marker.unknown.foo');
    expect(weights).toEqual([]);
  });

  it('should have mappings for all aura markers', () => {
    expect(MARKER_TO_BIG_FIVE['marker.aura.warmth']).toBeDefined();
    expect(MARKER_TO_BIG_FIVE['marker.aura.intensity']).toBeDefined();
    expect(MARKER_TO_BIG_FIVE['marker.aura.mystery']).toBeDefined();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @quizzme/domain test -- --run src/markers/__tests__/mapping.test.ts`
Expected: FAIL with "Cannot find module '../mapping'"

**Step 3: Write minimal implementation**

```typescript
// packages/domain/src/markers/mapping.ts
export type BigFiveTrait =
  | 'openness'
  | 'conscientiousness'
  | 'extraversion'
  | 'agreeableness'
  | 'neuroticism';

export interface TraitWeight {
  trait: BigFiveTrait;
  weight: number; // -1 to 1, negative = inverse correlation
}

export const MARKER_TO_BIG_FIVE: Record<string, TraitWeight[]> = {
  // Aura markers
  'marker.aura.warmth': [
    { trait: 'agreeableness', weight: 0.6 },
    { trait: 'extraversion', weight: 0.4 },
  ],
  'marker.aura.intensity': [
    { trait: 'extraversion', weight: 0.5 },
    { trait: 'openness', weight: 0.3 },
    { trait: 'neuroticism', weight: 0.2 },
  ],
  'marker.aura.mystery': [
    { trait: 'openness', weight: 0.6 },
    { trait: 'extraversion', weight: -0.3 },
  ],

  // Social markers
  'marker.social.dominance': [
    { trait: 'extraversion', weight: 0.5 },
    { trait: 'conscientiousness', weight: 0.3 },
    { trait: 'agreeableness', weight: -0.2 },
  ],
  'marker.social.extroversion': [
    { trait: 'extraversion', weight: 0.9 },
  ],
  'marker.social.introversion': [
    { trait: 'extraversion', weight: -0.8 },
    { trait: 'openness', weight: 0.2 },
  ],
  'marker.social.reserve': [
    { trait: 'extraversion', weight: -0.5 },
    { trait: 'neuroticism', weight: 0.2 },
  ],

  // EQ markers
  'marker.eq.empathy': [
    { trait: 'agreeableness', weight: 0.7 },
    { trait: 'openness', weight: 0.3 },
  ],
  'marker.eq.self_awareness': [
    { trait: 'openness', weight: 0.5 },
    { trait: 'conscientiousness', weight: 0.3 },
    { trait: 'neuroticism', weight: -0.2 },
  ],
  'marker.eq.self_regulation': [
    { trait: 'conscientiousness', weight: 0.6 },
    { trait: 'neuroticism', weight: -0.4 },
  ],
  'marker.eq.motivation': [
    { trait: 'conscientiousness', weight: 0.5 },
    { trait: 'extraversion', weight: 0.3 },
  ],
  'marker.eq.social_skill': [
    { trait: 'extraversion', weight: 0.5 },
    { trait: 'agreeableness', weight: 0.4 },
  ],

  // Values markers
  'marker.values.achievement': [
    { trait: 'conscientiousness', weight: 0.6 },
    { trait: 'extraversion', weight: 0.2 },
  ],
  'marker.values.connection': [
    { trait: 'agreeableness', weight: 0.6 },
    { trait: 'extraversion', weight: 0.3 },
  ],
  'marker.values.autonomy': [
    { trait: 'openness', weight: 0.4 },
    { trait: 'agreeableness', weight: -0.3 },
  ],
  'marker.values.security': [
    { trait: 'conscientiousness', weight: 0.5 },
    { trait: 'neuroticism', weight: 0.3 },
    { trait: 'openness', weight: -0.2 },
  ],
  'marker.values.conformity': [
    { trait: 'agreeableness', weight: 0.4 },
    { trait: 'conscientiousness', weight: 0.3 },
    { trait: 'openness', weight: -0.3 },
  ],

  // Lifestyle markers
  'marker.lifestyle.spontaneity': [
    { trait: 'openness', weight: 0.5 },
    { trait: 'extraversion', weight: 0.3 },
    { trait: 'conscientiousness', weight: -0.3 },
  ],
  'marker.lifestyle.structure': [
    { trait: 'conscientiousness', weight: 0.7 },
    { trait: 'openness', weight: -0.2 },
  ],

  // Cognition markers
  'marker.cognition.system_thinking': [
    { trait: 'openness', weight: 0.5 },
    { trait: 'conscientiousness', weight: 0.4 },
  ],
  'marker.cognition.creativity': [
    { trait: 'openness', weight: 0.8 },
    { trait: 'extraversion', weight: 0.1 },
  ],

  // Love markers
  'marker.love.attachment_secure': [
    { trait: 'agreeableness', weight: 0.4 },
    { trait: 'neuroticism', weight: -0.4 },
    { trait: 'extraversion', weight: 0.2 },
  ],
  'marker.love.attachment_anxious': [
    { trait: 'neuroticism', weight: 0.6 },
    { trait: 'agreeableness', weight: 0.2 },
  ],
};

export function getTraitWeights(markerId: string): TraitWeight[] {
  return MARKER_TO_BIG_FIVE[markerId] ?? [];
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm --filter @quizzme/domain test -- --run src/markers/__tests__/mapping.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add packages/domain/src/markers/
git commit -m "feat(domain): add marker-to-Big-Five mapping table"
```

---

### Task 3: Create Marker Aggregator

**Files:**
- Create: `packages/domain/src/markers/aggregator.ts`
- Test: `packages/domain/src/markers/__tests__/aggregator.test.ts`

**Step 1: Write the failing test**

```typescript
// packages/domain/src/markers/__tests__/aggregator.test.ts
import { describe, it, expect } from 'vitest';
import { aggregateMarkers, MarkerInput } from '../aggregator';

describe('Marker Aggregator', () => {
  it('should convert markers to Big Five deltas', () => {
    const markers: MarkerInput[] = [
      { id: 'marker.aura.warmth', weight: 0.5 },
      { id: 'marker.social.extroversion', weight: 0.8 },
    ];

    const deltas = aggregateMarkers(markers);

    expect(deltas.extraversion).toBeGreaterThan(0);
    expect(deltas.agreeableness).toBeGreaterThan(0);
  });

  it('should handle empty markers', () => {
    const deltas = aggregateMarkers([]);

    expect(deltas.openness).toBe(0);
    expect(deltas.conscientiousness).toBe(0);
    expect(deltas.extraversion).toBe(0);
    expect(deltas.agreeableness).toBe(0);
    expect(deltas.neuroticism).toBe(0);
  });

  it('should normalize deltas to -1 to 1 range', () => {
    const markers: MarkerInput[] = [
      { id: 'marker.social.extroversion', weight: 1.0 },
      { id: 'marker.aura.intensity', weight: 1.0 },
      { id: 'marker.eq.motivation', weight: 1.0 },
    ];

    const deltas = aggregateMarkers(markers);

    expect(deltas.extraversion).toBeLessThanOrEqual(1);
    expect(deltas.extraversion).toBeGreaterThanOrEqual(-1);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter @quizzme/domain test -- --run src/markers/__tests__/aggregator.test.ts`
Expected: FAIL with "Cannot find module '../aggregator'"

**Step 3: Write minimal implementation**

```typescript
// packages/domain/src/markers/aggregator.ts
import type { BigFiveTrait } from './mapping';
import { getTraitWeights } from './mapping';

export interface MarkerInput {
  id: string;
  weight: number; // 0 to 1
}

export interface BigFiveDeltas {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export function aggregateMarkers(markers: MarkerInput[]): BigFiveDeltas {
  const accumulator: BigFiveDeltas = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
  };

  if (markers.length === 0) return accumulator;

  // Accumulate weighted contributions
  for (const marker of markers) {
    const traitWeights = getTraitWeights(marker.id);

    for (const { trait, weight } of traitWeights) {
      accumulator[trait] += marker.weight * weight;
    }
  }

  // Normalize to -1 to 1 range
  const traits = Object.keys(accumulator) as BigFiveTrait[];
  for (const trait of traits) {
    accumulator[trait] = Math.max(-1, Math.min(1, accumulator[trait]));
  }

  return accumulator;
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm --filter @quizzme/domain test -- --run src/markers/__tests__/aggregator.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add packages/domain/src/markers/
git commit -m "feat(domain): add marker aggregator for Big Five deltas"
```

---

### Task 4: Export Markers Module

**Files:**
- Create: `packages/domain/src/markers/index.ts`
- Modify: `packages/domain/src/index.ts`

**Step 1: Create markers index**

```typescript
// packages/domain/src/markers/index.ts
export * from './types';
export * from './registry';
export * from './mapping';
export * from './aggregator';
```

**Step 2: Add to domain package exports**

```typescript
// packages/domain/src/index.ts (add these lines)
export * from './markers';
```

**Step 3: Verify build**

Run: `pnpm --filter @quizzme/domain build`
Expected: Build success

**Step 4: Commit**

```bash
git add packages/domain/src/
git commit -m "feat(domain): export markers module"
```

---

### Task 5: Create quiz-content Package Scaffold

**Files:**
- Create: `packages/quiz-content/package.json`
- Create: `packages/quiz-content/tsconfig.json`
- Create: `packages/quiz-content/src/index.ts`
- Create: `packages/quiz-content/src/types.ts`

**Step 1: Create package.json**

```json
{
  "name": "@quizzme/quiz-content",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "lint": "eslint src/",
    "test": "vitest run"
  },
  "dependencies": {
    "@quizzme/domain": "workspace:*"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.6.0"
  }
}
```

**Step 2: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

**Step 3: Create types**

```typescript
// packages/quiz-content/src/types.ts
import type { MarkerWeight } from '@quizzme/domain';

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
```

**Step 4: Create index**

```typescript
// packages/quiz-content/src/index.ts
export * from './types';

// Cluster exports will be added as we migrate quizzes
export const CLUSTERS = {
  identity: [] as string[],
  social: [] as string[],
  'life-path': [] as string[],
  relationship: [] as string[],
  personality: [] as string[],
};
```

**Step 5: Install dependencies**

Run: `pnpm install`

**Step 6: Verify build**

Run: `pnpm --filter @quizzme/quiz-content build`
Expected: Build success

**Step 7: Commit**

```bash
git add packages/quiz-content/
git commit -m "feat(quiz-content): create quiz content package scaffold"
```

---

### Task 6: Set Up Dashboard Route Group

**Files:**
- Create: `apps/web/app/(dashboard)/layout.tsx`
- Create: `apps/web/app/(dashboard)/page.tsx`
- Rename: `apps/web/app/page.tsx` → `apps/web/app/(public)/page.tsx`
- Create: `apps/web/app/(public)/layout.tsx`

**Step 1: Create dashboard layout with auth guard**

```typescript
// apps/web/app/(dashboard)/layout.tsx
'use client';

import { useAuth } from '../../lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F3EE]">
        <div className="animate-spin text-2xl">↻</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

**Step 2: Create placeholder dashboard page**

```typescript
// apps/web/app/(dashboard)/page.tsx
'use client';

import { useAuth } from '../../lib/auth-context';
import { useProfile } from '../../lib/profile-context';

export default function DashboardPage() {
  const { user } = useAuth();
  const { snapshot } = useProfile();

  return (
    <div className="min-h-screen bg-[#F6F3EE] p-8">
      <h1 className="text-4xl font-light mb-4">Dein Character Sheet</h1>
      <p className="text-gray-600 mb-8">
        Welcome, {user?.displayName || 'Traveler'}
      </p>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-medium mb-4">Profile Snapshot</h2>
        <pre className="text-sm bg-gray-50 p-4 rounded overflow-auto">
          {JSON.stringify(snapshot, null, 2)}
        </pre>
      </div>

      <p className="mt-8 text-sm text-gray-500">
        AstroSheet dashboard components coming soon...
      </p>
    </div>
  );
}
```

**Step 3: Create public layout**

```typescript
// apps/web/app/(public)/layout.tsx
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

**Step 4: Move existing home to public**

```bash
mv apps/web/app/page.tsx apps/web/app/(public)/page.tsx
mv apps/web/app/login apps/web/app/(public)/login
```

**Step 5: Verify build**

Run: `pnpm build`
Expected: Build success with new routes

**Step 6: Commit**

```bash
git add apps/web/app/
git commit -m "feat(web): set up dashboard and public route groups"
```

---

## Phase 2: Identity Cluster

### Task 7: Migrate Krafttier Quiz Data

**Files:**
- Create: `packages/quiz-content/src/clusters/identity/krafttier/index.ts`
- Create: `packages/quiz-content/src/clusters/identity/krafttier/questions.ts`
- Create: `packages/quiz-content/src/clusters/identity/krafttier/profiles.ts`
- Create: `packages/quiz-content/src/clusters/identity/index.ts`

**Step 1: Copy and adapt questions from QuizzMe**

```typescript
// packages/quiz-content/src/clusters/identity/krafttier/questions.ts
import type { QuizQuestion } from '../../../types';

export const questions: QuizQuestion[] = [
  {
    id: 'kt_q1',
    text: 'Wenn du in der Natur bist, was zieht dich am meisten an?',
    options: [
      {
        id: 'kt_q1_a',
        text: 'Die Weite des Himmels',
        markers: [{ id: 'marker.aura.mystery', weight: 0.1 }],
      },
      {
        id: 'kt_q1_b',
        text: 'Der tiefe Wald',
        markers: [{ id: 'marker.values.security', weight: 0.1 }],
      },
      {
        id: 'kt_q1_c',
        text: 'Das offene Feld',
        markers: [{ id: 'marker.lifestyle.spontaneity', weight: 0.1 }],
      },
      {
        id: 'kt_q1_d',
        text: 'Das fließende Wasser',
        markers: [{ id: 'marker.eq.empathy', weight: 0.1 }],
      },
    ],
  },
  // ... remaining 9-14 questions adapted from QuizzMe/src/components/quizzes/krafttier/
];
```

**Step 2: Create profiles**

```typescript
// packages/quiz-content/src/clusters/identity/krafttier/profiles.ts
import type { QuizProfile } from '../../../types';

export const profiles: QuizProfile[] = [
  {
    id: 'wolf',
    title: 'Der Wolf',
    icon: '🐺',
    tagline: 'Loyal, intuitiv, ein natürlicher Anführer des Rudels.',
    description: 'Du bist der Wolf – ein Wesen, das Stärke mit tiefer Loyalität verbindet...',
    stats: [
      { label: 'Intuition', value: 92 },
      { label: 'Loyalität', value: 95 },
      { label: 'Führung', value: 88 },
    ],
    markers: [
      { id: 'marker.social.dominance', weight: 0.4 },
      { id: 'marker.values.connection', weight: 0.4 },
    ],
  },
  {
    id: 'adler',
    title: 'Der Adler',
    icon: '🦅',
    tagline: 'Visionär, frei, mit dem Blick für das große Ganze.',
    description: 'Du bist der Adler – du siehst weiter als andere...',
    stats: [
      { label: 'Vision', value: 96 },
      { label: 'Freiheit', value: 94 },
      { label: 'Klarheit', value: 90 },
    ],
    markers: [
      { id: 'marker.cognition.system_thinking', weight: 0.5 },
      { id: 'marker.values.autonomy', weight: 0.3 },
    ],
  },
  // ... remaining profiles (Bär, Fuchs, Delfin, etc.)
];
```

**Step 3: Create quiz definition**

```typescript
// packages/quiz-content/src/clusters/identity/krafttier/index.ts
import type { QuizDefinition } from '../../../types';
import { questions } from './questions';
import { profiles } from './profiles';

export const krafttierQuiz: QuizDefinition = {
  meta: {
    id: 'quiz.krafttier.v1',
    title: 'Dein Krafttier',
    subtitle: 'Welches Tier verkörpert deine Essenz?',
    description: 'Entdecke dein spirituelles Krafttier und seine Botschaft für dich.',
    cluster: 'identity',
    estimatedMinutes: 5,
    questionCount: questions.length,
    disclaimer: 'Dieser Test dient der spielerischen Selbstreflexion.',
  },
  questions,
  profiles,
};
```

**Step 4: Create identity cluster index**

```typescript
// packages/quiz-content/src/clusters/identity/index.ts
export { krafttierQuiz } from './krafttier';
// Will add: blumenwesenQuiz, energiesteinQuiz

export const IDENTITY_QUIZZES = ['quiz.krafttier.v1'] as const;
```

**Step 5: Update main index**

```typescript
// packages/quiz-content/src/index.ts
export * from './types';
export * from './clusters/identity';

export const CLUSTERS = {
  identity: ['quiz.krafttier.v1'],
  social: [] as string[],
  'life-path': [] as string[],
  relationship: [] as string[],
  personality: [] as string[],
};
```

**Step 6: Verify build**

Run: `pnpm --filter @quizzme/quiz-content build`
Expected: Build success

**Step 7: Commit**

```bash
git add packages/quiz-content/
git commit -m "feat(quiz-content): migrate Krafttier quiz to identity cluster"
```

---

### Task 8: Create QuizRunner Component

**Files:**
- Create: `apps/web/components/quiz/QuizRunner.tsx`
- Create: `apps/web/components/quiz/QuizQuestion.tsx`
- Create: `apps/web/components/quiz/QuizResult.tsx`

**Step 1: Create QuizQuestion component**

```typescript
// apps/web/components/quiz/QuizQuestion.tsx
'use client';

import type { QuizQuestion as QuizQuestionType, QuizOption } from '@quizzme/quiz-content';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (option: QuizOption) => void;
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}: QuizQuestionProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-sm text-gray-500 mb-2">
        Frage {questionNumber} von {totalQuestions}
      </div>

      {question.scenario && (
        <p className="text-gray-600 italic mb-4">{question.scenario}</p>
      )}

      <h2 className="text-2xl font-medium mb-8">{question.text}</h2>

      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onAnswer(option)}
            className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Create QuizResult component**

```typescript
// apps/web/components/quiz/QuizResult.tsx
'use client';

import type { QuizProfile } from '@quizzme/quiz-content';

interface QuizResultProps {
  profile: QuizProfile;
  onContinue: () => void;
}

export function QuizResult({ profile, onContinue }: QuizResultProps) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="text-6xl mb-4">{profile.icon}</div>
      <h2 className="text-3xl font-light mb-2">{profile.title}</h2>
      <p className="text-lg text-gray-600 mb-6">{profile.tagline}</p>

      <p className="text-gray-700 mb-8">{profile.description}</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {profile.stats.map((stat) => (
          <div key={stat.label} className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-medium text-indigo-600">
              {stat.value}%
            </div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Zurück zum Dashboard
      </button>
    </div>
  );
}
```

**Step 3: Create QuizRunner component**

```typescript
// apps/web/components/quiz/QuizRunner.tsx
'use client';

import { useState, useCallback } from 'react';
import type { QuizDefinition, QuizOption, MarkerWeight } from '@quizzme/quiz-content';
import { QuizQuestion } from './QuizQuestion';
import { QuizResult } from './QuizResult';

interface QuizRunnerProps {
  quiz: QuizDefinition;
  onComplete: (markers: MarkerWeight[], profileId: string) => void;
}

export function QuizRunner({ quiz, onComplete }: QuizRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizOption[]>([]);
  const [result, setResult] = useState<typeof quiz.profiles[0] | null>(null);

  const handleAnswer = useCallback((option: QuizOption) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate result
      const allMarkers = newAnswers.flatMap((a) => a.markers);

      // Simple scoring: count markers per profile
      const profileScores = quiz.profiles.map((profile) => {
        const score = profile.markers.reduce((sum, pm) => {
          const matchingMarkers = allMarkers.filter((m) => m.id === pm.id);
          return sum + matchingMarkers.reduce((s, m) => s + m.weight, 0);
        }, 0);
        return { profile, score };
      });

      // Get highest scoring profile
      const winner = profileScores.reduce((best, current) =>
        current.score > best.score ? current : best
      );

      setResult(winner.profile);
      onComplete(allMarkers, winner.profile.id);
    }
  }, [answers, currentIndex, quiz, onComplete]);

  if (result) {
    return (
      <QuizResult
        profile={result}
        onContinue={() => window.location.href = '/'}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F3EE] py-12 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-light">{quiz.meta.title}</h1>
        <p className="text-gray-600">{quiz.meta.subtitle}</p>
      </div>

      <QuizQuestion
        question={quiz.questions[currentIndex]}
        questionNumber={currentIndex + 1}
        totalQuestions={quiz.questions.length}
        onAnswer={handleAnswer}
      />
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add apps/web/components/quiz/
git commit -m "feat(web): create QuizRunner component with question and result views"
```

---

### Task 9: Extend ProfileContext with Marker Submission

**Files:**
- Modify: `apps/web/lib/profile-context.tsx`

**Step 1: Add submitMarkers method**

Add to `ProfileContextActions` interface:

```typescript
/** Submit markers from quiz and update Big Five traits */
submitMarkers: (markers: MarkerWeight[], source: string) => Promise<void>;
```

**Step 2: Implement submitMarkers**

Add inside `ProfileProvider`:

```typescript
import { aggregateMarkers, type MarkerWeight } from '@quizzme/domain';

// ... inside ProfileProvider

const submitMarkers = useCallback(
  async (markers: MarkerWeight[], source: string) => {
    if (!state.profile || !user) {
      throw new Error('Profile not initialized');
    }

    // Convert MarkerWeight[] to MarkerInput[] for aggregator
    const markerInputs = markers.map((m) => ({
      id: m.id,
      weight: m.weight,
    }));

    // Get Big Five deltas from markers
    const deltas = aggregateMarkers(markerInputs);

    // Create trait scores from deltas
    const traitScores = [
      { traitId: 'trait.openness', score: 50 + deltas.openness * 50 },
      { traitId: 'trait.conscientiousness', score: 50 + deltas.conscientiousness * 50 },
      { traitId: 'trait.extraversion', score: 50 + deltas.extraversion * 50 },
      { traitId: 'trait.agreeableness', score: 50 + deltas.agreeableness * 50 },
      { traitId: 'trait.neuroticism', score: 50 + deltas.neuroticism * 50 },
    ];

    // Update profile using existing engine
    const updatedProfile = engine.updateProfile(state.profile, traitScores);

    // Save to storage
    const storageKey = `${user.id}_${PROFILE_STORAGE_KEY}`;
    await storage.set(storageKey, serializeProfile(updatedProfile));

    // Update snapshot
    const newSnapshot = engine.getSnapshot(updatedProfile);

    setState((prev) => ({
      ...prev,
      profile: updatedProfile,
      snapshot: newSnapshot,
    }));
  },
  [state.profile, user]
);
```

**Step 3: Add to context value**

```typescript
const contextValue: ProfileContextValue = {
  ...state,
  submitQuizAnswers,
  submitMarkers,  // Add this
  // ... rest
};
```

**Step 4: Verify build**

Run: `pnpm build`
Expected: Build success

**Step 5: Commit**

```bash
git add apps/web/lib/profile-context.tsx
git commit -m "feat(web): add submitMarkers to ProfileContext for marker-based quiz results"
```

---

### Task 10: Create Quiz Route

**Files:**
- Create: `apps/web/app/(dashboard)/quiz/[quizId]/page.tsx`

**Step 1: Create quiz page**

```typescript
// apps/web/app/(dashboard)/quiz/[quizId]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { krafttierQuiz } from '@quizzme/quiz-content';
import { QuizRunner } from '../../../../components/quiz/QuizRunner';
import { useProfile } from '../../../../lib/profile-context';
import type { MarkerWeight } from '@quizzme/quiz-content';

const QUIZZES: Record<string, typeof krafttierQuiz> = {
  'quiz.krafttier.v1': krafttierQuiz,
};

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { submitMarkers } = useProfile();

  const quizId = params.quizId as string;
  const quiz = QUIZZES[quizId];

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Quiz nicht gefunden</p>
      </div>
    );
  }

  const handleComplete = async (markers: MarkerWeight[], profileId: string) => {
    await submitMarkers(markers, quizId);
    console.log(`Quiz completed: ${quizId}, Profile: ${profileId}`);
  };

  return <QuizRunner quiz={quiz} onComplete={handleComplete} />;
}
```

**Step 2: Add quiz-content dependency to web app**

```bash
pnpm --filter @quizzme/web add @quizzme/quiz-content@workspace:*
```

**Step 3: Verify build**

Run: `pnpm build`
Expected: Build success

**Step 4: Commit**

```bash
git add apps/web/app/(dashboard)/quiz/ apps/web/package.json pnpm-lock.yaml
git commit -m "feat(web): create quiz route with QuizRunner integration"
```

---

## Phase 3: Dashboard Polish

### Task 11-15: Port Dashboard Components

*(Similar pattern for each component: Sidebar, IdentityBadges, StatsCard, DailyQuest, QuizzesCard)*

**Files per component:**
- Create: `apps/web/components/dashboard/[ComponentName].tsx`
- Adapt styling from QuizzMe originals
- Wire to ProfileContext data

**Step pattern:**
1. Copy component from QuizzMe
2. Adapt imports to use local context hooks
3. Simplify/remove unneeded dependencies
4. Test in browser
5. Commit

---

## Phase 4-6: Remaining Clusters

*(Follow same pattern as Task 7 for each quiz migration)*

**Social/EQ Cluster:**
- SocialRole, EQ, Charme

**Life Path Cluster:**
- CareerDNA, Destiny, Spotlight

**Relationship Cluster:**
- LoveLanguages, CelebritySoulmate, Party

**Personality Core Cluster:**
- Personality, RpgIdentity

---

## Summary

**Total Tasks:** ~25 tasks across 6 phases
**Estimated commits:** 25+
**Key integration points:**
1. Marker registry → enables validation
2. Marker mapping → connects quizzes to Big Five
3. ProfileContext.submitMarkers → updates profile from quizzes
4. Route groups → separates auth flows

**Testing strategy:**
- Unit tests for marker logic (registry, mapping, aggregator)
- Manual testing for quiz flows
- Build verification after each task
