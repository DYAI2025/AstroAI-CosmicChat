# Repository Analyse & Iterativer Fortsetzungsplan
**Datum**: 2026-01-03
**Branch**: `claude/analyze-repo-planning-IPWlA`
**Analyst**: Claude Code

---

## 1. PROJEKT-ÜBERSICHT

### Projekt-Identität
**Name**: QuizzMe - Das lebendige, digitale Selbst
**Typ**: Full-Stack Psychological Profiling Application
**Repository**: AstroAI-CosmicChat

### Projekt-Auftrag
QuizzMe ist eine psychologische Profiling-Anwendung, die durch interaktive Quizzes ein dynamisches, digitales Persönlichkeitsprofil erstellt. Das System kombiniert:

1. **Client-seitige Psychologie**: Isomorphe Trait Engine basierend auf dem Big Five Persönlichkeitsmodell
2. **Marker-System**: Quiz-Antworten generieren Marker, die auf psychologische Eigenschaften abbilden
3. **Astrologische Insights** *(geplant)*: Server-seitige astrologische Berechnungen (Western + BaZi)
4. **Dashboard-Visualisierung**: AstroSheet zeigt integriertes Persönlichkeitsprofil

### Architektur-Philosophie
- **Dual Build Modes**:
  - Static Export (offline-first, LocalStorage)
  - Server Deploy (Supabase, API routes, Cloud-Engine)
- **Monorepo**: pnpm workspaces + Turborepo
- **Clean Architecture**: Domain Logic unabhängig von Storage/UI

---

## 2. TECHNOLOGIE-STACK

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Sprache**: TypeScript 5.8 (strict mode)
- **Styling**: Tailwind CSS 3.4
- **State**: React Context API
- **Icons**: Lucide React

### Backend (geplant)
- **Auth & Storage**: Supabase
- **Astro Compute**: Python FastAPI (cloud-engine)
- **Orchestration**: Node.js Cosmic Bridge

### Build & Development
- **Package Manager**: pnpm 9.15.0
- **Build System**: Turborepo 2.3
- **Bundler**: tsup 8.0
- **Testing**: Vitest 3.0

### Deployment
- **Static**: Vercel/Netlify
- **Server**: Vercel (Next.js) + Railway (Python)

---

## 3. REPOSITORY-STRUKTUR

```
/home/user/AstroAI-CosmicChat/
├── apps/
│   └── web/                          # Next.js 14 App
│       ├── app/
│       │   ├── (dashboard)/          # ✅ Auth-geschützte Routen
│       │   │   ├── layout.tsx        # ✅ Auth Guard implementiert
│       │   │   ├── page.tsx          # ⚠️ Placeholder Dashboard
│       │   │   └── quiz/[quizId]/    # ✅ Dynamische Quiz-Routes
│       │   │       └── page.tsx
│       │   ├── (public)/             # ✅ Öffentliche Routen
│       │   │   ├── login/            # ⚠️ Auth Skeleton only
│       │   │   ├── page.tsx
│       │   │   └── layout.tsx
│       │   └── layout.tsx            # ✅ Root Layout
│       ├── components/
│       │   ├── quiz/                 # ✅ Quiz-Komponenten
│       │   │   ├── QuizRunner.tsx    # ✅ DONE
│       │   │   ├── QuizQuestion.tsx  # ✅ DONE
│       │   │   └── QuizResult.tsx    # ✅ DONE
│       │   ├── Quiz.tsx              # ⚠️ Legacy
│       │   ├── AstroSheet.tsx        # ⚠️ Basic only
│       │   ├── Providers.tsx         # ✅ Context wrapper
│       │   └── SyncStatus.tsx        # ⚠️ Skeleton
│       └── lib/
│           ├── auth-context.tsx      # ⚠️ Skeleton
│           ├── profile-context.tsx   # ✅ DONE + submitMarkers
│           └── sync-context.tsx      # ⚠️ Skeleton
│
├── packages/
│   ├── domain/                       # ✅ Core Business Logic
│   │   └── src/
│   │       ├── trait-engine/         # ✅ TraitEngine implementiert
│   │       ├── profile/              # ✅ Profile State Management
│   │       └── markers/              # ✅ Marker System COMPLETE
│   │           ├── types.ts          # ✅ DONE
│   │           ├── registry.ts       # ✅ DONE (8 Kategorien)
│   │           ├── mapping.ts        # ✅ DONE (Marker→BigFive)
│   │           ├── aggregator.ts     # ✅ DONE
│   │           └── index.ts          # ✅ DONE
│   │
│   ├── quiz-content/                 # ✅ Quiz Content Package
│   │   └── src/
│   │       ├── types.ts              # ✅ DONE
│   │       ├── clusters/
│   │       │   └── identity/
│   │       │       └── krafttier/    # ✅ MIGRIERT
│   │       │           ├── questions.ts
│   │       │           ├── profiles.ts
│   │       │           └── index.ts
│   │       └── index.ts              # ✅ DONE
│   │
│   ├── storage/                      # ✅ Storage Abstraction
│   │   └── src/
│   │       ├── types.ts              # ✅ Store Interface
│   │       ├── local-storage.ts      # ✅ LocalStorage impl
│   │       └── profile/
│   │           ├── local-profile-storage.ts    # ✅ DONE
│   │           └── api-profile-storage.ts      # ⚠️ Stub
│   │
│   ├── api-contracts/                # ✅ Shared Types
│   ├── cosmic-bridge/                # ⚠️ Minimal health check
│   └── ui/                           # ❌ NOT STARTED
│
├── services/
│   └── cloud-engine/                 # ⚠️ Python FastAPI Scaffold
│
└── docs/
    ├── adr/                          # ✅ 3 ADRs dokumentiert
    ├── plans/
    │   └── 2026-01-03-quiz-integration-astrosheet-dashboard.md  # ✅
    ├── iteration-0-notes.md          # ✅
    └── migration-analysis.md         # ✅ Dashboard Components

Legende:
✅ Vollständig implementiert
⚠️ Teilweise / Skeleton
❌ Nicht begonnen
```

---

## 4. FORTSCHRITTS-ANALYSE

### 4.1 Abgeschlossene Arbeiten (Iterationen 0-2)

#### ✅ Iteration 0: Bootstrapping (COMPLETE)
- Monorepo Setup (pnpm + Turborepo)
- Next.js 14 App Router Grundgerüst
- TypeScript + ESLint + Vitest Konfiguration
- Storage Interface Definition
- 3 Architecture Decision Records (ADRs)

#### ✅ Iteration 1: Quiz MVP with Trait Engine (COMPLETE)
- TraitEngine Core Implementation
- Big Five Trait Model
- ProfileContext mit React State Management
- Quiz Component (Legacy)
- Profile Serialization/Deserialization

#### ✅ Iteration 2: Storage Abstraction (COMPLETE)
- Abstract Store Interface
- LocalStorageStore Implementation
- Profile Storage Providers (local + API-ready)
- User-scoped Storage Keys

#### ⚠️ Iteration 3: User Authentication (SKELETON ONLY)
- AuthContext Grundgerüst
- Login Route erstellt
- **FEHLT**: Supabase Integration, echte Auth-Flows

#### ⚠️ Iteration 4: Real-time Sync (SKELETON ONLY)
- SyncContext Grundgerüst
- SyncStatus Component
- **FEHLT**: Operation Queue, Sync-Logik

### 4.2 Aktuelle Phase: Quiz Integration & Marker System

#### ✅ Phase 1: Foundation (COMPLETE - 10/10 Commits)
| Task | Status | Commit |
|------|--------|--------|
| 1. Marker Registry | ✅ DONE | `10a3750` |
| 2. Marker-to-Big-Five Mapping | ✅ DONE | `31ae939` |
| 3. Marker Aggregator | ✅ DONE | `ffb8be1` |
| 4. Export Markers Module | ✅ DONE | `d547f63` |
| 5. Quiz-Content Package Scaffold | ✅ DONE | `fa4ec9c` |
| 6. Dashboard Route Group Setup | ✅ DONE | `9894f8a` |

#### ✅ Phase 2: Identity Cluster (COMPLETE - 4/4 Tasks)
| Task | Status | Commit |
|------|--------|--------|
| 7. Krafttier Quiz Migration | ✅ DONE | `8f9066e` |
| 8. QuizRunner Components | ✅ DONE | `0a58369` |
| 9. ProfileContext.submitMarkers | ✅ DONE | `1c4c163` |
| 10. Quiz Route | ✅ DONE | `74ad9ea` (HEAD) |

**Aktueller Commit**: `74ad9ea` - feat(web): add quiz route with QuizRunner integration

---

## 5. FUNKTIONALITÄTS-BEWERTUNG

### Was funktioniert ✅

**Domain Layer - 95% Complete**
- ✅ TraitEngine verarbeitet Quiz-Antworten
- ✅ Marker System: 8 Kategorien, 30+ Marker
- ✅ Marker-to-Big-Five Mapping mit Gewichtungen
- ✅ Aggregator konvertiert Marker zu Trait-Deltas
- ✅ Profile State: Serialization, History, Snapshots

**Quiz System - 70% Complete**
- ✅ Krafttier Quiz vollständig migriert
- ✅ QuizRunner zeigt Fragen und Optionen
- ✅ QuizResult zeigt Ergebnis-Profil
- ✅ Marker-basierte Auswertung
- ✅ ProfileContext speichert Ergebnisse in LocalStorage
- ❌ Nur 1 von ~10 Quizzes migriert

**Web Application - 60% Complete**
- ✅ Route Groups (dashboard/public) eingerichtet
- ✅ Auth Guard Layout (funktional)
- ✅ Quiz Route `/quiz/[quizId]` dynamisch
- ✅ ProfileContext als zentraler State
- ⚠️ Dashboard zeigt nur JSON-Dump
- ⚠️ Keine visuellen Dashboard-Komponenten

**Storage & State - 80% Complete**
- ✅ LocalStorage funktioniert
- ✅ Profile-Persistierung
- ✅ User-scoped Keys
- ❌ Keine Supabase-Integration
- ❌ Kein Server-seitiges Storage

### Was fehlt ❌

**Server-Funktionen (0% Complete)**
- ❌ Supabase Auth & Storage Integration
- ❌ API Routes
- ❌ Cosmic Bridge (nur Health Check)
- ❌ Cloud Engine (Python Service nur Scaffold)
- ❌ Astrologische Berechnungen

**Dashboard UI (10% Complete)**
- ❌ AstroSheet Dashboard-Komponenten
- ❌ Sidebar Navigation
- ❌ IdentityBadges
- ❌ StatsCard
- ❌ DailyQuest
- ❌ QuizzesCard
- ❌ Trait-Visualisierungen

**Quiz Content (10% Complete)**
- ✅ Identity Cluster: Krafttier (1/3 Quizzes)
- ❌ Identity Cluster: Blumenwesen, Energiestein
- ❌ Social/EQ Cluster: SocialRole, EQ, Charme
- ❌ Life Path Cluster: CareerDNA, Destiny, Spotlight
- ❌ Relationship Cluster: LoveLanguages, Soulmate, Party
- ❌ Personality Core Cluster: Personality, RpgIdentity

**Testing (20% Complete)**
- ✅ Unit Tests für domain/markers
- ❌ Integration Tests
- ❌ E2E Tests
- ❌ Component Tests

---

## 6. LÜCKEN-ANALYSE

### Kritische Lücken (Blocker für Production)
1. **Kein visuelles Dashboard**: AstroSheet zeigt nur JSON
2. **Nur 1 Quiz migriert**: Fehlende Content-Migration
3. **Keine Auth**: Skeleton-Implementierung nicht funktional
4. **Keine Server-Features**: Supabase, API Routes fehlen komplett

### Mittlere Lücken (Feature-Einschränkungen)
5. **Kein Sync**: Offline-First nicht implementiert
6. **Keine Astro-Berechnungen**: Cloud Engine nur Scaffold
7. **Keine Tests**: Nur Domain-Logic getestet

### Kleine Lücken (Nice-to-Have)
8. **Kein UI Package**: Shared Components nicht extrahiert
9. **Keine ESLint Boundary Rules**: Layer-Grenzen nicht erzwungen
10. **Keine CI/CD**: Build-Validierung fehlt

---

## 7. ITERATIVER FORTSETZUNGSPLAN

### Priorisierung
**Strategie**: Feature-First (funktionierende Features vor Infrastruktur)

1. **Phase 3: Dashboard Polish** (HÖCHSTE PRIORITÄT)
   - User sieht visuelles Feedback für Quiz-Ergebnisse
   - Macht App nutzbar und testbar

2. **Phase 4-6: Quiz Content Migration**
   - Mehr Content → Mehr Testbarkeit
   - Validiert Marker-System mit realen Daten

3. **Phase 7: Authentication & Server**
   - Erst wenn Client-Features stabil
   - Ermöglicht Multi-User und Sync

4. **Phase 8: Astrological Features**
   - Letzte Priorität (komplexeste Integration)

---

### PHASE 3: Dashboard Polish 🎯 NEXT

**Ziel**: Visuelles Dashboard mit migrierten Komponenten aus astro-character-dashboard

#### Task 11: Port Sidebar Component
**Dateien**:
- Create: `apps/web/components/dashboard/Sidebar.tsx`

**Schritte**:
1. Kopiere Sidebar aus QuizzMe/astro-character-dashboard
2. Adaptiere zu Next.js App Router Navigation
3. Verwende Lucide Icons statt Heroicons
4. Wire zu ProfileContext für User-Info
5. Test in Browser
6. Commit: `feat(web): add Sidebar navigation component`

**Aufwand**: 2-3h

---

#### Task 12: Port StatsCard Component
**Dateien**:
- Create: `apps/web/components/dashboard/StatsCard.tsx`

**Schritte**:
1. Kopiere StatsCard
2. Adaptiere Props für Big Five Traits
3. Füge Trait-Visualisierung hinzu (Progress Bars)
4. Wire zu ProfileContext.snapshot
5. Test mit Mock-Daten
6. Commit: `feat(web): add StatsCard for trait visualization`

**Aufwand**: 2-3h

---

#### Task 13: Port IdentityBadges Component
**Dateien**:
- Create: `apps/web/components/dashboard/IdentityBadges.tsx`

**Schritte**:
1. Kopiere IdentityBadges
2. Adaptiere für Quiz-Profile (Krafttier)
3. Zeige Icon + Titel aus QuizProfile
4. Wire zu ProfileContext (quiz results)
5. Test mit Krafttier-Ergebnis
6. Commit: `feat(web): add IdentityBadges for quiz results`

**Aufwand**: 2-3h

---

#### Task 14: Port QuizzesCard Component
**Dateien**:
- Create: `apps/web/components/dashboard/QuizzesCard.tsx`

**Schritte**:
1. Kopiere QuizzesCard
2. Liste verfügbare Quizzes aus quiz-content
3. Zeige Completion-Status
4. Link zu `/quiz/[quizId]`
5. Test Navigation
6. Commit: `feat(web): add QuizzesCard for quiz discovery`

**Aufwand**: 2-3h

---

#### Task 15: Integrate Dashboard Components
**Dateien**:
- Modify: `apps/web/app/(dashboard)/page.tsx`

**Schritte**:
1. Import alle neuen Dashboard-Komponenten
2. Layout Grid erstellen (Sidebar + Main Area)
3. Platziere StatsCard, IdentityBadges, QuizzesCard
4. Responsive Design testen
5. Commit: `feat(web): integrate dashboard components into main view`

**Aufwand**: 1-2h

---

#### Task 16: Polish AstroSheet Styling
**Dateien**:
- Modify: `apps/web/components/AstroSheet.tsx`

**Schritte**:
1. Ersetze JSON-Dump durch strukturierte Ansicht
2. Füge Trait-Charts hinzu (Big Five Radar)
3. Zeige Marker-Breakdown
4. Color Scheme konsistent
5. Commit: `feat(web): polish AstroSheet with trait charts`

**Aufwand**: 3-4h

**Phase 3 Gesamt-Aufwand**: 12-18 Stunden

---

### PHASE 4: Social/EQ Cluster Migration

#### Task 17: Migrate SocialRole Quiz
**Pattern**: Wie Task 7 (Krafttier)
- Create: `packages/quiz-content/src/clusters/social/social-role/`
- Adaptiere Questions + Profiles
- Map zu social/eq Markers
- Commit: `feat(quiz-content): migrate SocialRole quiz to social cluster`

#### Task 18: Migrate EQ Quiz
**Pattern**: Wie Task 7
- Create: `packages/quiz-content/src/clusters/social/eq/`
- Commit: `feat(quiz-content): migrate EQ quiz to social cluster`

#### Task 19: Migrate Charme Quiz
**Pattern**: Wie Task 7
- Create: `packages/quiz-content/src/clusters/social/charme/`
- Commit: `feat(quiz-content): migrate Charme quiz to social cluster`

**Phase 4 Gesamt-Aufwand**: 6-9 Stunden

---

### PHASE 5: Life Path Cluster Migration

#### Task 20-22: Migrate CareerDNA, Destiny, Spotlight
**Pattern**: Wie Phase 4
- Create: `packages/quiz-content/src/clusters/life-path/`
- 3 Quizzes × 2-3h = 6-9h

**Phase 5 Gesamt-Aufwand**: 6-9 Stunden

---

### PHASE 6: Relationship & Personality Clusters

#### Task 23-27: Migrate Remaining Quizzes
- LoveLanguages, CelebritySoulmate, Party (Relationship)
- Personality, RpgIdentity (Personality Core)
- 5 Quizzes × 2-3h = 10-15h

**Phase 6 Gesamt-Aufwand**: 10-15 Stunden

---

### PHASE 7: Authentication & Server Integration

#### Task 28: Implement Supabase Auth
**Dateien**:
- Modify: `apps/web/lib/auth-context.tsx`
- Create: `apps/web/lib/supabase.ts`

**Schritte**:
1. Install @supabase/supabase-js
2. Setup Supabase Client
3. Implement signIn/signOut/signUp
4. Add Session Management
5. Test Auth Flow
6. Commit: `feat(web): implement Supabase authentication`

**Aufwand**: 4-6h

---

#### Task 29: Implement Server Storage
**Dateien**:
- Implement: `packages/storage/src/supabase-storage.ts`
- Create: Supabase Schema/Migrations

**Schritte**:
1. Define profiles table schema
2. Implement SupabaseStore
3. Add Row-Level Security policies
4. Migrate ProfileContext zu Server Storage
5. Test Sync zwischen LocalStorage → Supabase
6. Commit: `feat(storage): implement Supabase storage provider`

**Aufwand**: 6-8h

---

#### Task 30: API Routes for Profile Sync
**Dateien**:
- Create: `apps/web/app/api/profiles/route.ts`
- Create: `apps/web/app/api/profiles/[id]/route.ts`

**Schritte**:
1. GET /api/profiles (list user profiles)
2. GET /api/profiles/[id] (fetch profile)
3. POST /api/profiles (create profile)
4. PATCH /api/profiles/[id] (update profile)
5. Test mit Postman/curl
6. Commit: `feat(api): add profile management API routes`

**Aufwand**: 4-6h

**Phase 7 Gesamt-Aufwand**: 14-20 Stunden

---

### PHASE 8: Astrological Features (Optional)

#### Task 31: Implement Cosmic Bridge
**Dateien**:
- Implement: `packages/cosmic-bridge/src/bridge.ts`
- Implement: `packages/cosmic-bridge/src/compute.ts`

**Schritte**:
1. Define Astro Compute API Contract
2. Implement Birth Chart Request
3. Add Chart Caching
4. Error Handling & Retry Logic
5. Commit: `feat(cosmic-bridge): implement astro computation orchestration`

**Aufwand**: 8-12h

---

#### Task 32: Build Python Cloud Engine
**Dateien**:
- Implement: `services/cloud-engine/src/astro/`
- Implement: `services/cloud-engine/src/models/`

**Schritte**:
1. Western Chart Calculation (PySwissEph)
2. BaZi (Chinese) Chart Calculation
3. FastAPI Endpoints
4. Deploy zu Railway/Heroku
5. Integration Tests
6. Commit: `feat(cloud-engine): implement astrological computation service`

**Aufwand**: 16-24h

**Phase 8 Gesamt-Aufwand**: 24-36 Stunden

---

## 8. AUFWANDS-ZUSAMMENFASSUNG

| Phase | Tasks | Aufwand | Priorität | Status |
|-------|-------|---------|-----------|--------|
| 1: Foundation | 1-6 | - | CRITICAL | ✅ DONE |
| 2: Identity Cluster | 7-10 | - | CRITICAL | ✅ DONE |
| 3: Dashboard Polish | 11-16 | 12-18h | **HIGH** | 🎯 NEXT |
| 4: Social/EQ Cluster | 17-19 | 6-9h | MEDIUM | ⏳ TODO |
| 5: Life Path Cluster | 20-22 | 6-9h | MEDIUM | ⏳ TODO |
| 6: Relationship/Personality | 23-27 | 10-15h | MEDIUM | ⏳ TODO |
| 7: Auth & Server | 28-30 | 14-20h | LOW | ⏳ TODO |
| 8: Astro Features | 31-32 | 24-36h | OPTIONAL | ⏳ TODO |

**Gesamt-Restaufwand**: 72-107 Stunden (~9-13 Arbeitstage)

---

## 9. RISIKEN & DEPENDENCIES

### Technische Risiken
1. **Marker-Mapping-Qualität**: Psychologische Validität der Marker→BigFive Gewichtungen nicht wissenschaftlich validiert
2. **Astro-Berechnung Komplexität**: PySwissEph Integration kann Probleme bereiten
3. **Storage Migration**: LocalStorage → Supabase Sync komplex

### Externe Dependencies
1. **Supabase Account**: Benötigt für Phase 7
2. **Python Hosting**: Railway/Heroku für Cloud Engine
3. **Original QuizzMe Code**: Zugriff nötig für Component Migration

### Blockers
- **Phase 3**: Benötigt astro-character-dashboard Komponenten-Code
- **Phase 7**: Benötigt Supabase Projekt-Setup
- **Phase 8**: Benötigt Python Environment + PySwissEph

---

## 10. EMPFEHLUNGEN

### Sofort (Diese Woche)
1. ✅ **Phase 3 starten**: Dashboard Components migrieren
2. ✅ **Task 11-16 abschließen**: Macht App demo-fähig
3. ✅ **Test-User Flow**: Krafttier Quiz → Dashboard → Ergebnis sichtbar

### Kurzfristig (Nächste 2 Wochen)
4. **Phase 4-6**: Quiz Content Migration abschließen
5. **Testing**: Integration Tests für Quiz-Flows
6. **Dokumentation**: User Guide + Developer Guide

### Mittelfristig (1 Monat)
7. **Phase 7**: Supabase Integration für Multi-User
8. **CI/CD**: GitHub Actions für Builds + Tests
9. **Deployment**: Vercel Deploy für Static Mode

### Langfristig (2-3 Monate)
10. **Phase 8**: Astrological Features (falls gewünscht)
11. **Performance**: Bundle Size Optimization
12. **Accessibility**: A11y Audit + Fixes

---

## 11. ERFOLGS-METRIKEN

### Definition of Done (Minimum Viable Product)
- ✅ Phase 1-2: Foundation + Identity Cluster (**DONE**)
- 🎯 Phase 3: Dashboard zeigt visuelles Profil (**IN PROGRESS**)
- ⏳ Mindestens 5 Quizzes migriert (aktuell: 1/5)
- ⏳ LocalStorage funktioniert vollständig
- ⏳ Static Build Deploy auf Vercel
- ⏳ User kann Quiz nehmen → Ergebnis sehen → Dashboard erkunden

### Definition of Complete (Full Feature Set)
- Alle 10+ Quizzes migriert
- Supabase Auth + Storage
- Cloud Engine deployed
- Astrologische Berechnungen funktionieren
- E2E Tests coverage >80%
- Production Deploy mit Monitoring

---

## 12. NÄCHSTE SCHRITTE (Actionable)

### Jetzt sofort:
```bash
# 1. Branch bestätigen
git status

# 2. Phase 3 Task 11 starten
# → Sidebar Component migrieren
```

### Heute:
- Task 11: Sidebar Component (2-3h)
- Task 12: StatsCard Component (2-3h)

### Diese Woche:
- Task 13-16: Restliche Dashboard Components
- Phase 3 abschließen
- Test + Demo-Video

### Nächste Woche:
- Phase 4 starten: Social/EQ Cluster Migration

---

## ANHANG A: Marker-Kategorien Übersicht

```typescript
// 8 Kategorien, 30+ Marker definiert
MARKERS = {
  social: ['dominance', 'extroversion', 'introversion', 'reserve'],
  eq: ['empathy', 'self_awareness', 'self_regulation', 'motivation', 'social_skill'],
  aura: ['warmth', 'intensity', 'mystery'],
  values: ['achievement', 'connection', 'autonomy', 'security', 'conformity'],
  lifestyle: ['spontaneity', 'structure'],
  cognition: ['system_thinking', 'creativity'],
  love: ['attachment_secure', 'attachment_anxious'],
  skills: ['creativity', 'analysis'],
}
```

## ANHANG B: Big Five Trait Mapping

```typescript
// Trait Definitionen
BigFive = {
  openness: 'Offenheit für Erfahrungen',
  conscientiousness: 'Gewissenhaftigkeit',
  extraversion: 'Extraversion',
  agreeableness: 'Verträglichkeit',
  neuroticism: 'Neurotizismus'
}

// Beispiel Mapping
'marker.aura.warmth' → [
  { trait: 'agreeableness', weight: 0.6 },
  { trait: 'extraversion', weight: 0.4 }
]
```

## ANHANG C: Quiz Cluster Planung

```
Identity (3 Quizzes)
  ✅ Krafttier
  ❌ Blumenwesen
  ❌ Energiestein

Social/EQ (3 Quizzes)
  ❌ SocialRole
  ❌ EQ
  ❌ Charme

Life Path (3 Quizzes)
  ❌ CareerDNA
  ❌ Destiny
  ❌ Spotlight

Relationship (3 Quizzes)
  ❌ LoveLanguages
  ❌ CelebritySoulmate
  ❌ Party

Personality Core (2 Quizzes)
  ❌ Personality
  ❌ RpgIdentity
```

---

**Ende der Analyse**
**Nächster Schritt**: Phase 3, Task 11 - Sidebar Component Migration
