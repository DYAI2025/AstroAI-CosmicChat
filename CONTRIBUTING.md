# Contributing to QuizzMe

## Development Workflow

### Branch Strategy

1. Create a feature branch from `main`
2. Make changes and commit
3. Run build and tests locally
4. Create a pull request

### Commit Messages

Follow the Conventional Commits specification:

```
feat: add new trait calculation
fix: correct score aggregation
docs: update README
refactor: simplify profile context
```

## Code Style

### TypeScript

- Use strict mode (`strict: true`)
- No unused variables or parameters
- Prefer explicit types over inference for public APIs

### React

- Use functional components with hooks
- Keep components small and focused
- Use React Context for cross-cutting concerns

### Imports

Follow this import order (enforced by ESLint):
1. Type imports (with `type` keyword)
2. External packages (React, Next.js, etc.)
3. Internal packages (@quizzme/*)
4. Relative imports

```typescript
import type { TraitScore } from '@quizzme/domain';

import React, { useState, useEffect } from 'react';

import { useProfile } from '../lib/profile-context';
```

## Package Structure

### Adding a New Package

1. Create directory in `packages/`
2. Add `package.json` with proper naming (`@quizzme/package-name`)
3. Configure `tsconfig.json` extending root config
4. Add to Turborepo pipeline if needed

### Package Dependencies

- Keep circular dependencies checked
- Use `api-contracts` for shared types
- Domain logic stays in `domain` package

## Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter @quizzme/domain test

# Run tests in watch mode
pnpm --filter @quizzme/domain test -- --watch
```

## Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @quizzme/domain build

# Clean and rebuild
pnpm clean && pnpm build
```
