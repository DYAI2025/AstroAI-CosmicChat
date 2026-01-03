# Iteration 0 Notes - Bootstrapping

**Date**: 2026-01-03
**Status**: In Progress

## Objectives

- Establish monorepo structure with pnpm + Turborepo
- Create skeleton Next.js app with App Router
- Set up TypeScript, ESLint, and testing harness
- Implement placeholder pages (Home, Quiz Index, AstroSheet)
- Define Storage interface with LocalStorage implementation
- Validate static export build pipeline

## What Was Built

### Repository Structure

```
AstroQuizz-CosmicChat/
  apps/
    web/                    # Next.js App Router application
  packages/
    domain/                 # Trait Engine, Profile State
    storage/                # Store interface + LocalStorage impl
    api-contracts/          # Shared types/DTOs
    ui/                     # Reusable components
    cosmic-bridge/          # Node orchestration (stub)
  services/
    cloud-engine/           # Python microservice (planned)
  docs/
    adr/                    # Architecture Decision Records
  turbo.json               # Turborepo configuration
  pnpm-workspace.yaml      # Workspace definition
```

### Skeleton Pages

| Route | Purpose | Status |
|-------|---------|--------|
| `/` | Home/Landing | Placeholder |
| `/verticals/quiz` | Quiz Index | Placeholder |
| `/astrosheet` | Profile Dashboard | Placeholder |

### Storage Layer

- `Store` interface defined in `/packages/storage`
- `LocalStorageStore` implementation for static mode
- No Supabase integration yet (Iteration 3)

## How to Run

### Development Mode

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
# or from apps/web:
pnpm --filter @quizzme/web dev
```

### Static Export Build

```bash
# Build static version
pnpm build:static

# Preview static build
pnpm preview:static
```

### Server Build (Planned)

```bash
# Build for server deployment
pnpm build:server

# Start server
pnpm start
```

## Tests

```bash
# Run all tests
pnpm test

# Run specific package tests
pnpm --filter @quizzme/domain test

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## Known Gaps

1. **No actual quiz logic**: Pages are skeleton only
2. **No Trait Engine implementation**: Domain package is placeholder
3. **No Supabase integration**: Server storage not implemented
4. **No auth flow**: Login/callback routes not wired
5. **No API routes**: Server endpoints not created
6. **No E2E tests**: Only unit test scaffolding
7. **ESLint layer rules not enforced**: Need to add boundary-checking plugins

## Architecture Decisions Made

- **ADR-001**: Monorepo with pnpm workspaces + Turborepo
- **ADR-002**: Dual build modes (static + server)
- **ADR-003**: Storage abstraction pattern

## Next Iteration Tasks (Iteration 1)

1. **Implement Trait Engine core**
   - Quiz answer types and validation
   - Profile state calculation from answers
   - State management (Zustand or context)

2. **Create first Quiz Vertical**
   - "Fat Component" pattern
   - Thin route, logic in component
   - Form handling and validation

3. **Implement contribute-client flow**
   - Validate answers
   - Calculate profile update
   - Persist via LocalStorage Store
   - Return snapshot

4. **AstroSheet displays psyche data**
   - Fetch from storage
   - Render profile traits
   - Handle empty state

5. **Add CI checks**
   - Static build validation
   - Type checking
   - Unit tests

6. **ESLint boundary rules**
   - Prevent domain importing from UI
   - Enforce package import restrictions

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | 14.x | App framework |
| React | 18.x | UI library |
| TypeScript | 5.x | Type safety |
| pnpm | 8.x | Package manager |
| Turborepo | 1.x | Build system |
| Vitest | 1.x | Testing framework |

## Environment Variables

```env
# Static mode (default)
NEXT_PUBLIC_BUILD_MODE=static

# Server mode
NEXT_PUBLIC_BUILD_MODE=server
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Notes

- All ADRs are in `/docs/adr/`
- Keep pages thin, logic in components/libs
- No fake clickable buttons - hide unavailable features
- Static build must never require API routes
