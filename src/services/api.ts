import { Item, NetworkInfo, UrlMetadata } from '../types';

let cachedDefaultServer = '';

export function getCustomServerUrl(): string {
  try {
    const saved = localStorage.getItem('novasync_custom_server');
    if (saved && saved.trim()) {
      return saved.trim().replace(/\/$/, '');
    }
  } catch {}
  return '';
}

export function setCustomServerUrl(url: string): void {
  try {
    if (!url || !url.trim()) {
      localStorage.removeItem('novasync_custom_server');
    } else {
      localStorage.setItem('novasync_custom_server', url.trim().replace(/\/$/, ''));
    }
  } catch {}
}

export function getCachedDefaultServer(): string {
  return cachedDefaultServer;
}

export async function initServerConfig(force = false): Promise<string> {
  const custom = getCustomServerUrl();
  if (custom) return custom;
  if (cachedDefaultServer && !force) return cachedDefaultServer;

  try {
    // Fetch with cache-busting to always get active tunnel URL
    const res = await fetch(`/config.json?v=${Date.now()}`, { cache: 'no-store' });
    if (res.ok) {
      const cfg = await res.json();
      if (cfg && cfg.defaultServerUrl) {
        cachedDefaultServer = String(cfg.defaultServerUrl).trim().replace(/\/$/, '');
        return cachedDefaultServer;
      }
    }
  } catch (e) {
    console.warn('Config fetch issue (using local/current host):', e);
  }

  return '';
}

export function getBaseApiUrl(): string {
  const custom = getCustomServerUrl();
  if (custom) return custom;
  if (cachedDefaultServer) return cachedDefaultServer;
  return '';
}

export async function checkServerHealth(urlToTest?: string): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
  const base = (urlToTest !== undefined ? urlToTest.replace(/\/$/, '') : getBaseApiUrl()) || '';
  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${base}/api/health`, {
      signal: controller.signal,
      cache: 'no-store'
    });
    clearTimeout(timeout);
    const latencyMs = Math.round(performance.now() - start);
    if (res.ok) {
      return { ok: true, latencyMs };
    }
    return { ok: false, latencyMs, error: `HTTP ${res.status}` };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - start);
    return { ok: false, latencyMs, error: err.name === 'AbortError' ? 'Connection timed out' : (err.message || 'Network error') };
  }
}

export async function fetchItemsApi(room: string): Promise<Item[]> {
  const base = getBaseApiUrl();
  const res = await fetch(`${base}/api/items?room=${encodeURIComponent(room)}`, {
    cache: 'no-cache'
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createItemApi(item: Partial<Item>): Promise<Item> {
  const base = getBaseApiUrl();
  const res = await fetch(`${base}/api/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function updateItemApi(id: string, updates: Partial<Item>): Promise<Item> {
  const base = getBaseApiUrl();
  const res = await fetch(`${base}/api/items/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function deleteItemApi(id: string): Promise<void> {
  const base = getBaseApiUrl();
  const res = await fetch(`${base}/api/items/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function fetchUrlMetadataApi(url: string): Promise<UrlMetadata> {
  const base = getBaseApiUrl();
  const res = await fetch(`${base}/api/metadata?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchNetworkInfoApi(room: string): Promise<NetworkInfo> {
  const base = getBaseApiUrl();
  const res = await fetch(`${base}/api/network-info?room=${encodeURIComponent(room)}`, {
    cache: 'no-cache'
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// --- Offline-First Mutation Queue ---
export interface OfflineMutation {
  id: string;
  action: 'create' | 'update' | 'delete';
  itemId: string;
  data?: any;
  timestamp: number;
}

const OFFLINE_QUEUE_KEY = 'novasync_offline_mutations';

export function getOfflineQueue(): OfflineMutation[] {
  try {
    const val = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export function queueOfflineMutation(action: 'create' | 'update' | 'delete', itemId: string, data?: any): void {
  try {
    const queue = getOfflineQueue();
    // Collapse redundant updates for the same item if possible
    if (action === 'delete') {
      const filtered = queue.filter(m => m.itemId !== itemId);
      filtered.push({ id: 'mut_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6), action, itemId, timestamp: Date.now() });
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(filtered));
      return;
    }
    queue.push({
      id: 'mut_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      action,
      itemId,
      data,
      timestamp: Date.now()
    });
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.warn('Queue write error:', e);
  }
}

export async function processOfflineQueue(onSynced?: (count: number) => void): Promise<number> {
  const queue = getOfflineQueue();
  if (queue.length === 0) return 0;

  const remaining: OfflineMutation[] = [];
  let syncedCount = 0;

  for (const mut of queue) {
    try {
      if (mut.action === 'create') {
        await createItemApi(mut.data);
        syncedCount++;
      } else if (mut.action === 'update') {
        await updateItemApi(mut.itemId, mut.data);
        syncedCount++;
      } else if (mut.action === 'delete') {
        await deleteItemApi(mut.itemId);
        syncedCount++;
      }
    } catch (err) {
      console.warn('Failed syncing offline mutation, will keep in queue:', mut, err);
      remaining.push(mut);
    }
  }

  try {
    if (remaining.length > 0) {
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remaining));
    } else {
      localStorage.removeItem(OFFLINE_QUEUE_KEY);
    }
  } catch {}

  if (syncedCount > 0 && onSynced) {
    onSynced(syncedCount);
  }

  return syncedCount;
}
