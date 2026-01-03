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
