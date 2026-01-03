'use client';

/**
 * Client-side providers wrapper
 */

import { AuthProvider } from '../lib/auth-context';
import { ProfileProvider } from '../lib/profile-context';
import { SyncProvider } from '../lib/sync-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SyncProvider>
        <ProfileProvider>{children}</ProfileProvider>
      </SyncProvider>
    </AuthProvider>
  );
}
