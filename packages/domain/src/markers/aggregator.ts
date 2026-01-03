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
