/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import', 'boundaries'],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['./tsconfig.json', './apps/*/tsconfig.json', './packages/*/tsconfig.json'],
      },
    },
    'boundaries/include': ['apps/**/*', 'packages/**/*'],
    'boundaries/elements': [
      // Layer 0: API Contracts (foundation - no dependencies on other packages)
      {
        type: 'api-contracts',
        pattern: 'packages/api-contracts/**/*',
        capture: ['category', 'elementName'],
      },
      // Layer 1: Domain (depends only on api-contracts)
      {
        type: 'domain',
        pattern: 'packages/domain/**/*',
        capture: ['category', 'elementName'],
      },
      // Layer 2: Storage (depends on api-contracts)
      {
        type: 'storage',
        pattern: 'packages/storage/**/*',
        capture: ['category', 'elementName'],
      },
      // Layer 3: UI (depends on api-contracts, can use domain types but NOT domain logic)
      {
        type: 'ui',
        pattern: 'packages/ui/**/*',
        capture: ['category', 'elementName'],
      },
      // Layer 4: Cosmic Bridge (orchestration - can depend on domain, storage, api-contracts)
      {
        type: 'cosmic-bridge',
        pattern: 'packages/cosmic-bridge/**/*',
        capture: ['category', 'elementName'],
      },
      // Layer 5: Web App (can depend on all packages)
      {
        type: 'web',
        pattern: 'apps/web/**/*',
        capture: ['category', 'elementName'],
      },
    ],
  },
  rules: {
    // TypeScript rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',

    // Import rules
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/no-cycle': 'error',
    'import/no-unresolved': 'error',

    // LAYER BOUNDARY RULES - Critical for architecture
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        rules: [
          // api-contracts: foundation layer, no dependencies on other packages
          {
            from: 'api-contracts',
            allow: [],
            message: 'api-contracts is the foundation layer and cannot import from other packages',
          },
          // domain: can only depend on api-contracts (NEVER on UI, storage, or web)
          {
            from: 'domain',
            allow: ['api-contracts'],
            message: 'domain can only import from api-contracts. It must remain pure and UI-agnostic.',
          },
          // storage: can depend on api-contracts only
          {
            from: 'storage',
            allow: ['api-contracts'],
            message: 'storage can only import from api-contracts',
          },
          // ui: can depend on api-contracts (for types), but NOT domain logic
          {
            from: 'ui',
            allow: ['api-contracts'],
            message: 'ui can only import types from api-contracts. Do not import domain logic directly.',
          },
          // cosmic-bridge: orchestration layer, can use domain, storage, api-contracts
          {
            from: 'cosmic-bridge',
            allow: ['api-contracts', 'domain', 'storage'],
            message: 'cosmic-bridge orchestrates domain and storage, but cannot import UI',
          },
          // web: application layer, can use all packages
          {
            from: 'web',
            allow: ['api-contracts', 'domain', 'storage', 'ui', 'cosmic-bridge'],
          },
        ],
      },
    ],
  },
  overrides: [
    // Next.js specific rules for web app
    {
      files: ['apps/web/**/*.{ts,tsx}'],
      extends: ['next/core-web-vitals'],
      rules: {
        '@next/next/no-html-link-for-pages': 'off',
      },
    },
    // React component rules for UI package
    {
      files: ['packages/ui/**/*.{ts,tsx}'],
      extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
      },
    },
    // Test files
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
  ignorePatterns: [
    'node_modules',
    'dist',
    '.next',
    'out',
    'coverage',
    '*.config.js',
    '*.config.mjs',
  ],
};
