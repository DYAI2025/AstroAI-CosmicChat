import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStorageProvider, createLocalStorage } from '../local-storage.js';
import type { StorageProvider } from '../types.js';

/**
 * LocalStorageProvider Tests
 *
 * Since we're running in Node.js (not browser), the LocalStorageProvider
 * will automatically fall back to the in-memory MemoryStorage implementation.
 * This allows us to test the full functionality without needing jsdom.
 */
describe('LocalStorageProvider', () => {
  let storage: LocalStorageProvider;

  beforeEach(() => {
    // Create a fresh storage instance for each test
    storage = new LocalStorageProvider();
  });

  describe('Basic CRUD Operations', () => {
    it('should store and retrieve values', async () => {
      const testData = { name: 'Test User', score: 100 };

      await storage.set('user', testData);
      const retrieved = await storage.get<typeof testData>('user');

      expect(retrieved).toEqual(testData);
    });

    it('should handle missing keys', async () => {
      const result = await storage.get('nonexistent-key');

      expect(result).toBeNull();
    });

    it('should delete values', async () => {
      await storage.set('toDelete', { value: 'temporary' });
      await storage.delete('toDelete');
      const result = await storage.get('toDelete');

      expect(result).toBeNull();
    });

    it('should overwrite existing values', async () => {
      await storage.set('key', { version: 1 });
      await storage.set('key', { version: 2 });
      const result = await storage.get<{ version: number }>('key');

      expect(result?.version).toBe(2);
    });
  });

  describe('Prefix Support', () => {
    it('should respect prefix when storing values', async () => {
      const prefixedStorage = new LocalStorageProvider({ prefix: 'quizzme:' });
      const unprefixedStorage = new LocalStorageProvider();

      await prefixedStorage.set('user', { id: 1 });

      // The prefixed storage should find it
      const prefixedResult = await prefixedStorage.get('user');
      expect(prefixedResult).toEqual({ id: 1 });

      // The unprefixed storage should NOT find it under the same key
      // (it would need to look for 'quizzme:user' directly)
      const unprefixedResult = await unprefixedStorage.get('user');
      expect(unprefixedResult).toBeNull();
    });

    it('should clear only prefixed keys when using prefix', async () => {
      const prefixedStorage = new LocalStorageProvider({ prefix: 'app:' });
      const otherPrefixedStorage = new LocalStorageProvider({ prefix: 'other:' });

      await prefixedStorage.set('data1', 'value1');
      await prefixedStorage.set('data2', 'value2');
      await otherPrefixedStorage.set('data3', 'value3');

      // Clear only 'app:' prefixed storage
      await prefixedStorage.clear();

      // app: prefixed values should be cleared
      expect(await prefixedStorage.get('data1')).toBeNull();
      expect(await prefixedStorage.get('data2')).toBeNull();

      // other: prefixed values should still exist
      expect(await otherPrefixedStorage.get('data3')).toBe('value3');
    });
  });

  describe('Data Types', () => {
    it('should handle string values', async () => {
      await storage.set('string', 'hello world');
      expect(await storage.get('string')).toBe('hello world');
    });

    it('should handle number values', async () => {
      await storage.set('number', 42);
      expect(await storage.get('number')).toBe(42);
    });

    it('should handle boolean values', async () => {
      await storage.set('bool', true);
      expect(await storage.get('bool')).toBe(true);
    });

    it('should handle array values', async () => {
      const array = [1, 2, 3, 'four', { five: 5 }];
      await storage.set('array', array);
      expect(await storage.get('array')).toEqual(array);
    });

    it('should handle nested object values', async () => {
      const nested = {
        level1: {
          level2: {
            level3: { value: 'deep' },
          },
        },
      };
      await storage.set('nested', nested);
      expect(await storage.get('nested')).toEqual(nested);
    });

    it('should handle null values', async () => {
      await storage.set('nullValue', null);
      expect(await storage.get('nullValue')).toBeNull();
    });
  });

  describe('Custom Serialization', () => {
    it('should use custom serialize function', async () => {
      const customSerialize = vi.fn((value: unknown) => JSON.stringify(value));
      const customStorage = new LocalStorageProvider({
        serialize: customSerialize,
      });

      await customStorage.set('test', { data: 'value' });

      expect(customSerialize).toHaveBeenCalledWith({ data: 'value' });
    });

    it('should use custom deserialize function', async () => {
      const customDeserialize = vi.fn((value: string) => JSON.parse(value));
      const customStorage = new LocalStorageProvider({
        deserialize: customDeserialize,
      });

      await customStorage.set('test', { data: 'value' });
      await customStorage.get('test');

      expect(customDeserialize).toHaveBeenCalled();
    });
  });

  describe('SSR Mode Detection', () => {
    it('should report running in server-side mode in Node environment', () => {
      // In Node.js environment (no window.localStorage), should be SSR
      expect(storage.isServerSide()).toBe(true);
    });
  });

  describe('Factory Function', () => {
    it('should create storage instance via factory function', async () => {
      const factoryStorage = createLocalStorage({ prefix: 'factory:' });

      await factoryStorage.set('test', 'value');
      const result = await factoryStorage.get('test');

      expect(result).toBe('value');
    });

    it('should implement StorageProvider interface', () => {
      const provider: StorageProvider = createLocalStorage();

      expect(typeof provider.get).toBe('function');
      expect(typeof provider.set).toBe('function');
      expect(typeof provider.delete).toBe('function');
      expect(typeof provider.clear).toBe('function');
    });
  });

  describe('Clear Operations', () => {
    it('should clear all values when no prefix is set', async () => {
      await storage.set('key1', 'value1');
      await storage.set('key2', 'value2');
      await storage.set('key3', 'value3');

      await storage.clear();

      expect(await storage.get('key1')).toBeNull();
      expect(await storage.get('key2')).toBeNull();
      expect(await storage.get('key3')).toBeNull();
    });
  });
});
