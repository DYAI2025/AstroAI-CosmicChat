// Types
export type { MarkerCategory, MarkerWeight, MarkerContribution } from './types';

// Registry
export { MARKERS, isValidMarkerId, getMarkerCategory } from './registry';

// Mapping
export type { BigFiveTrait, TraitWeight } from './mapping';
export { MARKER_TO_BIG_FIVE, getTraitWeights } from './mapping';

// Aggregator
export type { MarkerInput, BigFiveDeltas } from './aggregator';
export { aggregateMarkers } from './aggregator';
