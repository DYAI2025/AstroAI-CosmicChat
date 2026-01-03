/**
 * Health check utilities for Cloud Engine connectivity
 */

/**
 * Health status response
 */
export interface HealthStatus {
  /** Whether the service is healthy */
  healthy: boolean;
  /** Service name */
  service: string;
  /** Version if available */
  version?: string;
  /** Latency in milliseconds */
  latencyMs?: number;
  /** Error message if unhealthy */
  error?: string;
  /** Timestamp of the check */
  timestamp: string;
}

/**
 * Check the health of the Python Cloud Engine
 *
 * @param cloudEngineUrl - Base URL of the Cloud Engine
 * @param timeout - Request timeout in milliseconds
 * @returns Health status of the Cloud Engine
 */
export async function checkCloudEngineHealth(
  cloudEngineUrl: string,
  timeout = 5000
): Promise<HealthStatus> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  try {
    const healthUrl = new URL('/health', cloudEngineUrl);
    const response = await fetch(healthUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(timeout),
    });

    const latencyMs = Date.now() - startTime;

    if (response.ok) {
      const data = (await response.json()) as { version?: string };
      return {
        healthy: true,
        service: 'cloud-engine',
        version: data.version ?? 'unknown',
        latencyMs,
        timestamp,
      };
    }

    return {
      healthy: false,
      service: 'cloud-engine',
      latencyMs,
      error: `HTTP ${response.status}: ${response.statusText}`,
      timestamp,
    };
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    return {
      healthy: false,
      service: 'cloud-engine',
      latencyMs,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp,
    };
  }
}
