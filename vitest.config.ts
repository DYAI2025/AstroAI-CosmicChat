import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['packages/**/*.test.ts', 'packages/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['packages/**/src/**/*.ts'],
      exclude: [
        '**/node_modules/**',
        '**/__tests__/**',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/index.ts',
      ],
    },
    reporters: ['default', 'verbose'],
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      '@quizzme/storage': resolve(__dirname, './packages/storage/src'),
      '@quizzme/domain': resolve(__dirname, './packages/domain/src'),
      '@quizzme/api-contracts': resolve(__dirname, './packages/api-contracts/src'),
    },
  },
});
