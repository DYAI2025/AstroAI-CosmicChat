# QuizzMe - Das lebendige, digitale Selbst

A full-stack monorepo application for psychological profiling through quizzes, integrated with astrological insights.

## Architecture

This project uses a **pnpm + Turborepo** monorepo architecture with the following packages:

```
.
├── apps/
│   └── web/                    # Next.js 14 App Router application
├── packages/
│   ├── api-contracts/          # Shared TypeScript types and API contracts
│   ├── domain/                 # Core business logic (TraitEngine, Profile)
│   ├── storage/                # Storage abstraction layer
│   ├── cosmic-bridge/          # Astrological computation utilities
│   └── ui/                     # Shared UI components
```

## Features

### Iteration 1 - Quiz MVP with Trait Engine
- Big Five personality trait model implementation
- TraitEngine for processing quiz answers
- ProfileContext for React state management
- Quiz and AstroSheet components

### Iteration 2 - Storage Abstraction
- Adapter pattern for storage providers
- LocalProfileStorageProvider for browser storage
- API-ready storage interface

### Iteration 3 - User Authentication
- Anonymous authentication flow
- AuthContext for auth state management
- User-scoped profile storage

### Iteration 4 - Real-time Sync
- Offline-first sync architecture
- Operation queue with localStorage persistence
- SyncProvider and SyncStatus components

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start development server
pnpm dev
```

### Development Commands

```bash
# Run all tests
pnpm test

# Lint all packages
pnpm lint

# Type check all packages
pnpm typecheck

# Build specific package
pnpm --filter @quizzme/domain build
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Build**: Turborepo + tsup
- **Testing**: Vitest
- **Package Manager**: pnpm

## Architecture Decisions

See `/docs/adr/` for Architecture Decision Records:
- ADR-001: Monorepo Structure
- ADR-002: Trait Engine Design
- ADR-003: Storage Abstraction

## License

Private - All rights reserved.
