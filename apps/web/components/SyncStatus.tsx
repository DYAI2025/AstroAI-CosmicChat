'use client';

/**
 * Sync Status Component
 *
 * Displays the current sync status with visual indicators.
 */

import { useSync, useSyncStatus } from '../lib/sync-context';

interface SyncStatusProps {
  /** Show detailed status */
  detailed?: boolean;
  /** Custom class name */
  className?: string;
}

export function SyncStatus({ detailed = false, className = '' }: SyncStatusProps) {
  const { state, pendingCount, sync, isPaused, resume } = useSync();

  // Get status icon and color
  const getStatusDisplay = () => {
    switch (state.status) {
      case 'syncing':
        return {
          icon: '↻',
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          label: 'Synchronisiere...',
          animate: true,
        };
      case 'synced':
        return {
          icon: '✓',
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          label: 'Synchronisiert',
          animate: false,
        };
      case 'offline':
        return {
          icon: '⚡',
          color: 'text-amber-500',
          bgColor: 'bg-amber-50',
          label: 'Offline',
          animate: false,
        };
      case 'error':
        return {
          icon: '!',
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          label: 'Fehler',
          animate: false,
        };
      case 'conflict':
        return {
          icon: '⚠',
          color: 'text-orange-500',
          bgColor: 'bg-orange-50',
          label: 'Konflikt',
          animate: false,
        };
      default:
        return {
          icon: '○',
          color: 'text-gray-400',
          bgColor: 'bg-gray-50',
          label: 'Bereit',
          animate: false,
        };
    }
  };

  const display = getStatusDisplay();

  // Format last sync time
  const formatLastSync = () => {
    if (!state.lastSyncAt) return 'Nie';

    const diff = Date.now() - state.lastSyncAt;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Gerade eben';
    if (minutes < 60) return `Vor ${minutes} Min.`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Vor ${hours} Std.`;

    const days = Math.floor(hours / 24);
    return `Vor ${days} Tag${days > 1 ? 'en' : ''}`;
  };

  // Compact view
  if (!detailed) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${display.bgColor} ${display.color} ${className}`}
        title={display.label}
      >
        <span className={display.animate ? 'animate-spin' : ''}>
          {display.icon}
        </span>
        {pendingCount > 0 && (
          <span className="font-medium">{pendingCount}</span>
        )}
      </div>
    );
  }

  // Detailed view
  return (
    <div className={`p-4 rounded-lg ${display.bgColor} ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`text-lg ${display.color} ${display.animate ? 'animate-spin' : ''}`}
          >
            {display.icon}
          </span>
          <span className={`font-medium ${display.color}`}>{display.label}</span>
        </div>

        {!state.isOnline && (
          <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded">
            Offline
          </span>
        )}
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p>Letzte Synchronisation: {formatLastSync()}</p>
        {pendingCount > 0 && (
          <p>
            {pendingCount} Änderung{pendingCount > 1 ? 'en' : ''} ausstehend
          </p>
        )}
      </div>

      {state.error && (
        <p className="mt-2 text-sm text-red-600">{state.error}</p>
      )}

      {/* Actions */}
      <div className="mt-3 flex gap-2">
        {pendingCount > 0 && state.isOnline && (
          <button
            onClick={() => sync()}
            disabled={state.status === 'syncing'}
            className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            Jetzt synchronisieren
          </button>
        )}

        {isPaused ? (
          <button
            onClick={resume}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Fortsetzen
          </button>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Compact sync indicator for header/navbar
 */
export function SyncIndicator() {
  const status = useSyncStatus();

  if (status.status === 'idle' && status.pendingChanges === 0) {
    return null;
  }

  return <SyncStatus />;
}
