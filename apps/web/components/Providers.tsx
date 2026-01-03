'use client';

/**
 * Client-side providers wrapper
 */

import { ProfileProvider } from '../lib/profile-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ProfileProvider>{children}</ProfileProvider>;
}
