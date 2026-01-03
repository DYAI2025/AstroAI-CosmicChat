import type { BirthData, AstrologicalProfile } from '@quizzme/api-contracts';

/**
 * Configuration for the Cosmic Bridge
 */
export interface CosmicBridgeConfig {
  /** URL of the Python Cloud Engine service */
  cloudEngineUrl: string;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Whether to use cached results */
  enableCache?: boolean;
  /** API key for authentication (optional) */
  apiKey?: string;
}

/**
 * Request to compute astrological data
 */
export interface ComputeRequest {
  /** Birth data for the computation */
  birthData: BirthData;
  /** Optional: specific computations to perform */
  computations?: ComputationType[];
  /** Optional: hash of previous computation for cache check */
  previousHash?: string;
}

/**
 * Types of astrological computations available
 */
export type ComputationType =
  | 'natal_chart'
  | 'planetary_positions'
  | 'house_cusps'
  | 'aspects'
  | 'chinese_year'
  | 'full_profile';

/**
 * Response from the compute endpoint
 */
export interface ComputeResponse {
  /** Whether computation was successful */
  success: boolean;
  /** Computed astrological profile */
  profile?: AstrologicalProfile;
  /** Error message if computation failed */
  error?: string;
  /** Hash of this computation for caching */
  computeHash?: string;
  /** Whether result was from cache */
  fromCache?: boolean;
  /** Computation duration in milliseconds */
  durationMs?: number;
}

/**
 * Status of the bridge connection
 */
export type BridgeStatus =
  | 'connected'
  | 'disconnected'
  | 'degraded'
  | 'unknown';
