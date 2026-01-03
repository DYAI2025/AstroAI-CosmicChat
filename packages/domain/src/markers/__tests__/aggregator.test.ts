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
