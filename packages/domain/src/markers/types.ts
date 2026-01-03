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
