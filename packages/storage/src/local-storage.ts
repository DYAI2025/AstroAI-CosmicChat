import type { StorageProvider, StorageConfig } from './types.js';

/**
 * Check if localStorage is available
 * Handles SSR environments and private browsing modes
 */
function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    // Test actual availability (some browsers block in private mode)
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * In-memory fallback storage for SSR or when localStorage is unavailable
 */
class MemoryStorage {
  private store: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  key(index: number): string | null {
    const keys = Array.from(this.store.keys());
    return keys[index] ?? null;
  }

  get length(): number {
    return this.store.size;
  }
}

/**
 * LocalStorage Implementation of StorageProvider
 *
 * Features:
 * - JSON serialization/deserialization
 * - Prefix support for namespacing
 * - Graceful fallback to in-memory storage for SSR
 * - Custom serialization support
 */
export class LocalStorageProvider implements StorageProvider {
  private storage: Storage | MemoryStorage;
  private prefix: string;
  private serialize: (value: unknown) => string;
  private deserialize: (value: string) => unknown;
  private isSSR: boolean;

  constructor(config: StorageConfig = {}) {
    this.isSSR = !isLocalStorageAvailable();
    this.storage = this.isSSR ? new MemoryStorage() : window.localStorage;
    this.prefix = config.prefix ?? '';
    this.serialize = config.serialize ?? JSON.stringify;
    this.deserialize = config.deserialize ?? JSON.parse;
  }

  /**
   * Get the prefixed key
   */
  private getKey(key: string): string {
    return this.prefix ? `${this.prefix}${key}` : key;
  }

  /**
   * Check if a key belongs to this storage instance (matches prefix)
   */
  private belongsToPrefix(key: string): boolean {
    return this.prefix ? key.startsWith(this.prefix) : true;
  }

  /**
   * Retrieve a value by key
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const prefixedKey = this.getKey(key);
      const item = this.storage.getItem(prefixedKey);

      if (item === null) {
        return null;
      }

      return this.deserialize(item) as T;
    } catch (error) {
      console.warn(`[Storage] Failed to get key "${key}":`, error);
      return null;
    }
  }

  /**
   * Store a value with the given key
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const prefixedKey = this.getKey(key);
      const serialized = this.serialize(value);
      this.storage.setItem(prefixedKey, serialized);
    } catch (error) {
      // Handle QuotaExceededError
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error(`[Storage] Storage quota exceeded when setting key "${key}"`);
      }
      throw error;
    }
  }

  /**
   * Delete a value by key
   */
  async delete(key: string): Promise<void> {
    const prefixedKey = this.getKey(key);
    this.storage.removeItem(prefixedKey);
  }

  /**
   * Clear all storage that belongs to this prefix
   * If no prefix is set, clears all localStorage
   */
  async clear(): Promise<void> {
    if (!this.prefix) {
      // No prefix - clear everything
      this.storage.clear();
      return;
    }

    // Clear only keys matching our prefix
    const keysToRemove: string[] = [];

    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && this.belongsToPrefix(key)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => this.storage.removeItem(key));
  }

  /**
   * Check if running in SSR mode (using memory fallback)
   */
  isServerSide(): boolean {
    return this.isSSR;
  }
}

/**
 * Create a LocalStorage provider with optional configuration
 */
export function createLocalStorage(config?: StorageConfig): StorageProvider {
  return new LocalStorageProvider(config);
}
