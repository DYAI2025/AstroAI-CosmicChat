/**
 * @quizzme/storage
 *
 * Storage abstraction layer for QuizzMe.
 *
 * This package provides a unified interface for storage operations,
 * allowing business logic to remain agnostic about WHERE data is stored.
 *
 * Currently supported:
 * - LocalStorage (browser) with SSR fallback
 *
 * Coming in Iteration 3:
 * - Supabase (server-side)
 *
 * @example
 * ```typescript
 * import { createLocalStorage } from '@quizzme/storage';
 *
 * const storage = createLocalStorage({ prefix: 'quizzme:' });
 *
 * // Store data
 * await storage.set('user', { name: 'Alice', score: 100 });
 *
 * // Retrieve data
 * const user = await storage.get<User>('user');
 *
 * // Delete data
 * await storage.delete('user');
 *
 * // Clear all prefixed data
 * await storage.clear();
 * ```
 */

// Types
export type { StorageProvider, StorageConfig } from './types.js';

// LocalStorage implementation
export { LocalStorageProvider, createLocalStorage } from './local-storage.js';

// Supabase placeholder (coming in Iteration 3)
export { SupabaseStorageProvider, createSupabaseStorage } from './supabase-storage.js';
