import type { StorageProvider } from './types.js';

/**
 * Supabase Storage Provider - Placeholder
 *
 * This will be implemented in Iteration 3 to provide
 * server-side storage backed by Supabase.
 *
 * For now, it throws an error indicating server mode
 * is not yet configured.
 */
export class SupabaseStorageProvider implements StorageProvider {
  constructor() {
    // Configuration will be added in Iteration 3
  }

  async get<T>(_key: string): Promise<T | null> {
    throw new Error('Server mode not configured. Supabase storage will be available in Iteration 3.');
  }

  async set<T>(_key: string, _value: T): Promise<void> {
    throw new Error('Server mode not configured. Supabase storage will be available in Iteration 3.');
  }

  async delete(_key: string): Promise<void> {
    throw new Error('Server mode not configured. Supabase storage will be available in Iteration 3.');
  }

  async clear(): Promise<void> {
    throw new Error('Server mode not configured. Supabase storage will be available in Iteration 3.');
  }
}

/**
 * Create a Supabase storage provider
 *
 * Note: This is a placeholder. Full implementation coming in Iteration 3.
 */
export function createSupabaseStorage(): StorageProvider {
  return new SupabaseStorageProvider();
}
