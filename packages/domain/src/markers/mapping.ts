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
