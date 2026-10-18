import {
  dbGetNotes, dbGetChecklists, dbGetFolders, dbGetTags,
  dbSaveNote, dbSaveChecklist, dbSaveFolder, dbSaveTag
} from '../db';
import { apiCheckHealth, apiSyncVault } from './api';

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

type Listener = (status: SyncStatus, label: string) => void;
const listeners: Set<Listener> = new Set();

let currentStatus: SyncStatus = 'synced';
let currentLabel: string = typeof navigator !== 'undefined' && navigator.onLine ? 'Local Vault Active' : 'Offline (Local Vault)';

export function subscribeSyncStatus(listener: Listener) {
  listeners.add(listener);
  listener(currentStatus, currentLabel);
  return () => {
    listeners.delete(listener);
  };
}

function notify(status: SyncStatus, label?: string) {
  currentStatus = status;
  if (label) currentLabel = label;
  listeners.forEach(cb => cb(currentStatus, currentLabel));
}

export async function triggerVaultSync(): Promise<boolean> {
  const isServerAvailable = await apiCheckHealth();
  if (!isServerAvailable) {
    const isBrowserOnline = typeof navigator !== 'undefined' && navigator.onLine;
    notify(isBrowserOnline ? 'synced' : 'offline', isBrowserOnline ? 'Local Vault Active' : 'Offline (Local Vault)');
    return false;
  }

  try {
    notify('syncing', 'Syncing...');
    const [notes, checklists, folders, tags] = await Promise.all([
      dbGetNotes(),
      dbGetChecklists(),
      dbGetFolders(),
      dbGetTags(),
    ]);

    const result = await apiSyncVault({ notes, checklists, folders, tags });

    // Reconcile server delta into local IndexedDB
    for (const n of result.notes) await dbSaveNote(n);
    for (const c of result.checklists) await dbSaveChecklist(c);
    for (const f of result.folders) await dbSaveFolder(f);
    for (const t of result.tags) await dbSaveTag(t);

    notify('synced', 'Synced with Cloud');
    return true;
  } catch (err) {
    console.warn('Sync notice:', err);
    notify('synced', 'Local Vault Active');
    return false;
  }
}
