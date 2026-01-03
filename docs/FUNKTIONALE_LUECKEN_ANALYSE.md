# Funktionale Lücken-Analyse - AstroAI-CosmicChat
**Datum**: 2026-01-03
**Fokus**: Produktions-kritische Funktionalität

---

## KRITISCHE ERKENNTNIS

Die App ist aktuell **NUR ein Browser-Demo** ohne echte Backend-Funktionalität:
- ❌ Keine Datenbank
- ❌ Keine Server-Persistierung
- ❌ Keine Multi-User Fähigkeit
- ❌ Keine echte Authentication
- ❌ Daten gehen bei Browser-Clear verloren

---

## 1. AUTHENTIFIZIERUNG - KOMPLETT FEHLT

### Status Quo
```typescript
// apps/web/lib/auth-context.tsx
// NUR anonymous LocalStorage user!
function createAnonymousUser(): AnonymousUser {
  return {
    id: `anon_${Date.now()}_${Math.random()}`,  // ⚠️ Lokale ID
    isAnonymous: true,
    displayName: 'Anonymer Nutzer',
  };
}
```

### Was FEHLT
1. ❌ **Supabase Auth SDK** - nicht installiert
2. ❌ **Email/Password Sign Up**
3. ❌ **Email/Password Sign In**
4. ❌ **OAuth Providers** (Google, GitHub)
5. ❌ **Session Management** (JWT tokens)
6. ❌ **Password Reset Flow**
7. ❌ **Email Verification**
8. ❌ **Protected Routes** (echte Auth-Checks)

### Funktionale Impact
- **User kann kein Konto erstellen**
- **User kann nicht einloggen**
- **Keine Identität über Browser hinaus**
- **Keine Daten-Portabilität**

### Lösung
```bash
# BENÖTIGT:
1. pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs
2. Supabase Projekt erstellen
3. Auth Provider konfigurieren
4. Sign Up/In Flows implementieren
5. Session Handling
```

---

## 2. DATENBANK & PERSISTIERUNG - KOMPLETT FEHLT

### Status Quo
```typescript
// packages/storage/src/supabase-storage.ts
async get<T>(_key: string): Promise<T | null> {
  throw new Error('Server mode not configured');  // ⚠️ Nicht implementiert!
}
```

### Was FEHLT
1. ❌ **Supabase Client Konfiguration**
2. ❌ **Datenbank Schema** (Tabellen)
3. ❌ **Row-Level Security Policies**
4. ❌ **Profile Storage Implementation**
5. ❌ **Quiz Results Storage**
6. ❌ **User Settings Storage**
7. ❌ **Migration Scripts**

### Aktuelles Verhalten
- ✅ `LocalStorage.setItem('profile', ...)` - NUR im Browser
- ❌ Kein Server
- ❌ Keine Datenbank
- ❌ Daten weg bei Browser-Wechsel/Clear

### Benötigtes Schema
```sql
-- FEHLT KOMPLETT!

-- Tabelle: profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabelle: profile_snapshots
CREATE TABLE profile_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabelle: quiz_results
CREATE TABLE quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  quiz_id TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  markers JSONB NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- etc.
```

### Lösung
```bash
# BENÖTIGT:
1. Supabase Projekt Setup
2. Schema Migration erstellen
3. RLS Policies definieren
4. SupabaseStorage implementieren
5. ProfileContext zu Server-Storage migrieren
```

---

## 3. API ROUTES - KOMPLETT FEHLT

### Status Quo
```bash
$ find apps/web/app/api
# KEIN Output - KEINE API Routes!
```

### Was FEHLT
1. ❌ **Profile API** (`/api/profiles`)
   - GET /api/profiles - list user profiles
   - GET /api/profiles/[id] - fetch profile
   - POST /api/profiles - create profile
   - PATCH /api/profiles/[id] - update profile
   - DELETE /api/profiles/[id] - delete profile

2. ❌ **Quiz Results API** (`/api/quiz-results`)
   - POST /api/quiz-results - submit quiz result
   - GET /api/quiz-results - list user quiz results
   - GET /api/quiz-results/[id] - fetch specific result

3. ❌ **Sync API** (`/api/sync`)
   - POST /api/sync/upload - upload local data
   - GET /api/sync/download - download server data
   - POST /api/sync/merge - merge conflicts

4. ❌ **Auth API** (Supabase handles this, but custom flows needed)
   - POST /api/auth/signup
   - POST /api/auth/callback

### Funktionale Impact
- **Keine Server-seitige Logik**
- **Keine Daten-Validierung**
- **Keine Business Rules Enforcement**
- **Keine Cross-Device Sync**

### Lösung
```bash
# BENÖTIGT:
1. Create apps/web/app/api/profiles/route.ts
2. Create apps/web/app/api/profiles/[id]/route.ts
3. Create apps/web/app/api/quiz-results/route.ts
4. Create apps/web/app/api/sync/route.ts
5. Implement CRUD operations mit Supabase
6. Error handling & validation
```

---

## 4. ENVIRONMENT CONFIGURATION - FEHLT

### Status Quo
```bash
$ ls -la **/.env*
# KEINE .env Dateien!
```

### Was FEHLT
```env
# .env.local - FEHLT KOMPLETT!

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Build Mode
NEXT_PUBLIC_BUILD_MODE=server

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Lösung
```bash
# BENÖTIGT:
1. Create .env.local
2. Create .env.example (template)
3. Supabase Projekt Credentials eintragen
4. Update apps/web/lib/supabase.ts
```

---

## 5. PROFILE SYNCHRONISATION - FEHLT

### Status Quo
```typescript
// apps/web/lib/profile-context.tsx
// Speichert NUR in LocalStorage
await storage.set(storageKey, serializeProfile(updatedProfile));
// ⚠️ KEINE Server-Sync!
```

### Was FEHLT
1. ❌ **Conflict Resolution** - was wenn Server & Local unterschiedlich?
2. ❌ **Offline Queue** - Änderungen während offline
3. ❌ **Background Sync** - automatische Sync
4. ❌ **Optimistic Updates** - UI update vor Server confirm
5. ❌ **Error Recovery** - retry bei Netzwerk-Fehler
6. ❌ **Merge Strategy** - wie mergen wir Deltas?

### Aktuelles Verhalten
```
User macht Quiz → LocalStorage
User wechselt Browser → DATEN WEG ❌
User cleared Browser → DATEN WEG ❌
User auf Mobile → DATEN WEG ❌
```

### Benötigtes Verhalten
```
User macht Quiz → LocalStorage + Server Queue
Background Sync → Upload zu Supabase
User wechselt Browser → Download von Supabase
Offline → Queue Operations
Online → Flush Queue mit Conflict Resolution
```

### Lösung
```typescript
// BENÖTIGT: apps/web/lib/sync-engine.ts

interface SyncOperation {
  id: string;
  type: 'profile_update' | 'quiz_submit' | 'marker_add';
  payload: unknown;
  timestamp: number;
  status: 'pending' | 'synced' | 'failed';
}

class SyncEngine {
  async queueOperation(op: SyncOperation): Promise<void>;
  async flushQueue(): Promise<void>;
  async syncFromServer(): Promise<void>;
  async resolveConflicts(): Promise<void>;
}
```

---

## 6. MULTI-USER SUPPORT - FEHLT

### Status Quo
```typescript
// ALLE Users teilen sich:
localStorage.setItem('quizzme_profile', ...);
// ⚠️ KEINE User-Isolation!
```

### Aktuelles Problem
```
User A macht Quiz → localStorage
User B loggt ein (gleicher Browser) → SIEHT User A Daten ❌
User A loggt aus → Daten bleiben ❌
```

### Was FEHLT
1. ❌ **User-scoped Storage Keys**
2. ❌ **Data Isolation per User**
3. ❌ **Profile Switching**
4. ❌ **Multi-Account Support**

### Lösung
```typescript
// BENÖTIGT:
const storageKey = `${userId}_profile`;  // User-scoped
await supabase.from('profiles').select('*').eq('user_id', userId);
```

---

## 7. QUIZ RESULTS PERSISTIERUNG - TEILWEISE FEHLT

### Status Quo
```typescript
// apps/web/lib/profile-context.tsx
const submitMarkers = async (markers, source) => {
  // Aggregiert zu Big Five Deltas ✅
  const deltas = aggregateMarkers(markers);

  // Speichert NUR in LocalStorage ⚠️
  await storage.set(storageKey, profile);

  // FEHLT:
  // - Server Persistierung ❌
  // - Quiz Result History ❌
  // - Individual Marker Storage ❌
  // - Timestamp Tracking ❌
};
```

### Was FEHLT
1. ❌ **Quiz Results Tabelle** - historische Results
2. ❌ **Marker History** - welche Marker wann hinzugefügt
3. ❌ **Quiz Completion Tracking** - welche Quizzes gemacht
4. ❌ **Result Comparison** - Entwicklung über Zeit

### Benötigt
```typescript
interface QuizResult {
  id: string;
  userId: string;
  quizId: string;           // 'quiz.krafttier.v1'
  profileId: string;        // 'wolf'
  markers: MarkerWeight[];  // alle Marker aus Quiz
  bigFiveDeltas: BigFiveDeltas;
  completedAt: number;
}

// API Call
await supabase.from('quiz_results').insert({
  user_id: userId,
  quiz_id: 'quiz.krafttier.v1',
  profile_id: 'wolf',
  markers: JSON.stringify(markers),
  completed_at: new Date().toISOString(),
});
```

---

## 8. REAL-TIME SYNC - FEHLT

### Status Quo
```typescript
// apps/web/lib/sync-context.tsx
// NUR Skeleton - KEINE Implementierung!
export function SyncProvider({ children }) {
  return <SyncContext.Provider value={null}>{children}</SyncContext.Provider>;
}
```

### Was FEHLT
1. ❌ **Realtime Subscriptions** (Supabase Realtime)
2. ❌ **Cross-Tab Sync** - Änderungen in Tab A → sichtbar in Tab B
3. ❌ **Live Updates** - Server changes → Auto-refresh
4. ❌ **Presence** - welche Devices sind online

### Lösung
```typescript
// BENÖTIGT: Supabase Realtime Channel
const channel = supabase
  .channel('profile-changes')
  .on('postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'profile_snapshots',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      // Update local state
      updateProfile(payload.new);
    }
  )
  .subscribe();
```

---

## 9. ERROR HANDLING & RESILIENCE - MINIMAL

### Was FEHLT
1. ❌ **Network Error Recovery** - retry logic
2. ❌ **Offline Detection** - `navigator.onLine` handling
3. ❌ **Graceful Degradation** - fallback zu LocalStorage
4. ❌ **User Feedback** - loading states, error messages
5. ❌ **Logging & Monitoring** - Sentry, LogRocket
6. ❌ **Rate Limiting** - zu viele Requests protection

---

## 10. SECURITY - BASICS FEHLEN

### Was FEHLT
1. ❌ **Input Validation** - XSS protection
2. ❌ **CSRF Protection** - Next.js defaults nur
3. ❌ **SQL Injection Protection** - Supabase hilft, aber RLS policies fehlen
4. ❌ **Rate Limiting** - API abuse prevention
5. ❌ **Secure Headers** - CSP, HSTS, etc.
6. ❌ **Data Encryption** - sensitive data at rest

---

## ZUSAMMENFASSUNG - KRITISCHE LÜCKEN

### Tier 1: BLOCKER (App ist nicht nutzbar ohne diese)
1. ✅ **Supabase Projekt Setup**
2. ✅ **Database Schema & Migrations**
3. ✅ **Supabase Auth Integration**
4. ✅ **SupabaseStorage Implementation**
5. ✅ **API Routes für Profile & Quiz Results**

### Tier 2: WICHTIG (App ist nutzbar, aber fehleranfällig)
6. ✅ **Environment Configuration**
7. ✅ **Sync Engine mit Offline Queue**
8. ✅ **Conflict Resolution**
9. ✅ **Error Handling & Retry Logic**

### Tier 3: ENHANCEMENT (App funktioniert, aber suboptimal)
10. ✅ **Realtime Sync**
11. ✅ **Cross-Tab Communication**
12. ✅ **Monitoring & Logging**
13. ✅ **Performance Optimization**

---

## AKTIONSPLAN - PRIORITÄTEN

### PHASE 1: Backend Foundation (KRITISCH)
**Aufwand**: 16-24 Stunden

#### Task 1: Supabase Projekt Setup
- [ ] Supabase Account erstellen
- [ ] Neues Projekt anlegen
- [ ] Credentials kopieren
- [ ] `.env.local` erstellen

**Deliverable**: Funktionierende Supabase Verbindung

---

#### Task 2: Database Schema
- [ ] Schema SQL schreiben (`schema.sql`)
- [ ] Migrationen erstellen
- [ ] Tables: `profiles`, `profile_snapshots`, `quiz_results`
- [ ] RLS Policies definieren
- [ ] Execute Migration

**Deliverable**: Datenbank-Tabellen mit RLS

---

#### Task 3: Supabase Client Setup
- [ ] `pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs`
- [ ] Create `apps/web/lib/supabase.ts`
- [ ] Client Factory Functions
- [ ] Server Component Client
- [ ] Browser Client

**Deliverable**: Typsichere Supabase Clients

---

#### Task 4: Auth Implementation
- [ ] Update `auth-context.tsx`
- [ ] Implement `signUp(email, password)`
- [ ] Implement `signIn(email, password)`
- [ ] Implement `signOut()`
- [ ] Session Management
- [ ] Auth Callback Route

**Deliverable**: Funktionierende Email/Password Auth

---

#### Task 5: Storage Implementation
- [ ] Implement `SupabaseStorageProvider`
- [ ] CRUD operations
- [ ] Error handling
- [ ] Unit tests

**Deliverable**: Funktionierende Server-Persistierung

---

#### Task 6: Profile API Routes
- [ ] `GET /api/profiles` - list
- [ ] `GET /api/profiles/[id]` - fetch
- [ ] `POST /api/profiles` - create
- [ ] `PATCH /api/profiles/[id]` - update
- [ ] Validation & Error Handling

**Deliverable**: REST API für Profiles

---

#### Task 7: Quiz Results API
- [ ] `POST /api/quiz-results` - submit
- [ ] `GET /api/quiz-results` - list
- [ ] Marker storage
- [ ] History tracking

**Deliverable**: Quiz Results Persistierung

---

#### Task 8: ProfileContext Migration
- [ ] Update `submitMarkers` → call API
- [ ] Update `loadProfile` → fetch from Supabase
- [ ] Offline Queue implementation
- [ ] Error states & retry

**Deliverable**: ProfileContext nutzt Supabase

---

### PHASE 2: Sync & Resilience (WICHTIG)
**Aufwand**: 12-18 Stunden

#### Task 9: Offline Queue
- [ ] SyncEngine Klasse
- [ ] Operation Queue (IndexedDB)
- [ ] Background Sync
- [ ] Flush on Online

---

#### Task 10: Conflict Resolution
- [ ] Last-Write-Wins Strategy
- [ ] Vector Clock (optional)
- [ ] User Prompt bei Konflikten
- [ ] Merge Logic

---

#### Task 11: Error Handling
- [ ] Network error detection
- [ ] Retry with exponential backoff
- [ ] User feedback (Toast notifications)
- [ ] Logging

---

### PHASE 3: Realtime & Polish (ENHANCEMENT)
**Aufwand**: 8-12 Stunden

#### Task 12: Realtime Subscriptions
- [ ] Supabase Realtime Channel
- [ ] Profile Updates Subscription
- [ ] Cross-Tab Sync
- [ ] Presence

---

#### Task 13: Monitoring
- [ ] Error Tracking (Sentry)
- [ ] Analytics
- [ ] Performance Monitoring

---

## GESAMT-AUFWAND

| Phase | Aufwand | Priorität |
|-------|---------|-----------|
| Phase 1: Backend Foundation | 16-24h | KRITISCH ⚠️ |
| Phase 2: Sync & Resilience | 12-18h | WICHTIG |
| Phase 3: Realtime & Polish | 8-12h | ENHANCEMENT |

**TOTAL**: 36-54 Stunden (4.5-7 Arbeitstage)

---

## NÄCHSTER SCHRITT

**START MIT TASK 1**: Supabase Projekt Setup

```bash
# 1. Gehe zu https://supabase.com
# 2. Create New Project
# 3. Kopiere URL + anon key
# 4. Erstelle .env.local:

cat > apps/web/.env.local <<EOF
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_BUILD_MODE=server
EOF

# 5. Install dependencies
pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs
```

**Bereit zum Start?**
