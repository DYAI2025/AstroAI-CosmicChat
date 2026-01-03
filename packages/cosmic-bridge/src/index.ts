/**
 * @quizzme/cosmic-bridge - Node Bridge & Orchestration Layer
 *
 * This package provides the server-side orchestration for QuizzMe's
 * cosmic (astrological) computation features. It acts as a bridge
 * between the Next.js frontend and the Python Cloud Engine.
 *
 * ARCHITECTURE NOTE:
 * - This package is SERVER-ONLY (runs in Node.js, not browser)
 * - Used exclusively in Server Deploy mode
 * - Static Export mode should not import from this package
 */

// Export types
export type {
  CosmicBridgeConfig,
  ComputeRequest,
  ComputeResponse,
  BridgeStatus,
} from './types';

// Export bridge functions
export { createCosmicBridge, type CosmicBridge } from './bridge';

// Export health check utilities
export { checkCloudEngineHealth, type HealthStatus } from './health';
