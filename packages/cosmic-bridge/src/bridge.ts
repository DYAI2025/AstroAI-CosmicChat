import type {
  CosmicBridgeConfig,
  ComputeRequest,
  ComputeResponse,
  BridgeStatus,
} from './types';

/**
 * Cosmic Bridge instance interface
 */
export interface CosmicBridge {
  /** Compute astrological data from birth information */
  compute(request: ComputeRequest): Promise<ComputeResponse>;
  /** Get current bridge status */
  getStatus(): BridgeStatus;
  /** Check if bridge is healthy */
  isHealthy(): Promise<boolean>;
  /** Disconnect and cleanup */
  disconnect(): void;
}

/**
 * Create a new Cosmic Bridge instance
 *
 * ITERATION 0: This is a stub implementation that returns mock data.
 * Full implementation will be added in Iteration 4.
 *
 * @param config - Bridge configuration
 * @returns CosmicBridge instance
 */
export function createCosmicBridge(config: CosmicBridgeConfig): CosmicBridge {
  let status: BridgeStatus = 'unknown';

  return {
    async compute(request: ComputeRequest): Promise<ComputeResponse> {
      // STUB: Will call Python Cloud Engine in Iteration 4
      console.log('[CosmicBridge] Compute requested:', request.birthData);

      // Return stub response indicating feature is not yet implemented
      return {
        success: false,
        error:
          'Cosmic computation not yet implemented. Available in Server Deploy mode (Iteration 4).',
      };
    },

    getStatus(): BridgeStatus {
      return status;
    },

    async isHealthy(): Promise<boolean> {
      // STUB: Will ping Cloud Engine in Iteration 4
      try {
        // Attempt to check cloud engine health
        const healthUrl = new URL('/health', config.cloudEngineUrl);
        const response = await fetch(healthUrl.toString(), {
          method: 'GET',
          signal: AbortSignal.timeout(config.timeout ?? 5000),
        });

        status = response.ok ? 'connected' : 'degraded';
        return response.ok;
      } catch {
        status = 'disconnected';
        return false;
      }
    },

    disconnect(): void {
      status = 'disconnected';
      console.log('[CosmicBridge] Disconnected');
    },
  };
}
