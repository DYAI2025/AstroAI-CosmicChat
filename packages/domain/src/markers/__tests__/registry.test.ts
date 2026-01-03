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
