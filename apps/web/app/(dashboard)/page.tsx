'use client';

import { useAuth } from '../../lib/auth-context';
import { useProfile } from '../../lib/profile-context';

export default function DashboardPage() {
  const { user } = useAuth();
  const { snapshot } = useProfile();

  return (
    <div className="min-h-screen bg-[#F6F3EE] p-8">
      <h1 className="text-4xl font-light mb-4">Dein Character Sheet</h1>
      <p className="text-gray-600 mb-8">
        Welcome, {user?.displayName || 'Traveler'}
      </p>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-medium mb-4">Profile Snapshot</h2>
        <pre className="text-sm bg-gray-50 p-4 rounded overflow-auto">
          {JSON.stringify(snapshot, null, 2)}
        </pre>
      </div>

      <p className="mt-8 text-sm text-gray-500">
        AstroSheet dashboard components coming soon...
      </p>
    </div>
  );
}
