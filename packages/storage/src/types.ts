/**
 * Storage Provider Interface
 *
 * Defines the contract for all storage implementations.
 * This abstraction allows business logic to remain agnostic
 * about WHERE data is stored (localStorage, Supabase, etc.)
 */
export interface StorageProvider {
  /**
   * Retrieve a value by key
   * @param key - The storage key
   * @returns The stored value or null if not found
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Store a value with the given key
   * @param key - The storage key
   * @param value - The value to store
   */
  set<T>(key: string, value: T): Promise<void>;

  /**
   * Delete a value by key
   * @param key - The storage key to delete
   */
  delete(key: string): Promise<void>;

  /**
   * Clear all storage (respects prefix if configured)
   */
  clear(): Promise<void>;
}

/**
 * Storage Configuration Options
 */
export interface StorageConfig {
  /**
   * Optional prefix for all keys (useful for namespacing)
   * Example: "quizzme:" would make key "user" become "quizzme:user"
   */
  prefix?: string;

  /**
   * Custom serialization function
   * @default JSON.stringify
   */
  serialize?: (value: unknown) => string;

  /**
   * Custom deserialization function
   * @default JSON.parse
   */
  deserialize?: (value: string) => unknown;
}
