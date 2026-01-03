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

  const category = match[1];
  const name = match[2];
  if (!category || !name) return false;

  const categoryMarkers = MARKERS[category as MarkerCategory];
  return categoryMarkers ? categoryMarkers.includes(name) : false;
}

export function getMarkerCategory(id: string): MarkerCategory | null {
  const match = id.match(/^marker\.(\w+)\./);
  if (!match) return null;

  const category = match[1] as MarkerCategory;
  return MARKERS[category] ? category : null;
}
