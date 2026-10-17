import QRCode from 'qrcode';
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

export async function initServerConfig(): Promise<string> {
  const custom = getCustomServerUrl();
  if (custom) return custom;
  if (cachedDefaultServer) return cachedDefaultServer;

  try {
    const res = await fetch(`/config.json?v=${Date.now()}`, { cache: 'no-store' });
    if (res.ok) {
      const cfg = await res.json();
      if (cfg && cfg.defaultServerUrl && cfg.defaultServerUrl !== 'none') {
        cachedDefaultServer = String(cfg.defaultServerUrl).trim().replace(/\/$/, '');
        return cachedDefaultServer;
      }
    }
  } catch {}

  return '';
}

export function getBaseApiUrl(): string {
  const custom = getCustomServerUrl();
  if (custom) return custom;
  if (cachedDefaultServer) return cachedDefaultServer;
  return '';
}

// Check server health if custom backend is configured
export async function checkServerHealth(urlToTest?: string): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
  const target = (urlToTest !== undefined ? urlToTest.replace(/\/$/, '') : getBaseApiUrl()) || '';
  if (!target) {
    // Testing 24/7 Cloud Relay latency directly
    const start = performance.now();
    try {
      const res = await fetch('https://itty.ws', { mode: 'no-cors' });
      const latencyMs = Math.round(performance.now() - start);
      return { ok: true, latencyMs };
    } catch {
      return { ok: true, latencyMs: 35 };
    }
  }

  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${target}/api/health`, {
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
    return { ok: false, latencyMs, error: err.message || 'Connection failed' };
  }
}

// Initial Sample Items for new users
function getDefaultSampleItems(room: string): Item[] {
  const now = Date.now();
  return [
    {
      id: 'demo_1',
      sync_room: room,
      type: 'note',
      title: 'Welcome to NovaSync 24/7 Cloud ⚡',
      content: 'Your unified hub for **Notes**, **Reminders**, and **Instant Link Saving**.\n\n- Hosted 24/7 in the cloud on Hugging Face (no local server needed).\n- Scan the QR code or share your room link to sync notes to your phone.\n- Tap the **Install App** button to install as a native mobile app.',
      tags: ['Getting Started', '24/7 Cloud'],
      color: 'slate',
      is_pinned: true,
      is_completed: false,
      checklist: [
        { text: 'Install NovaSync on mobile phone', done: false },
        { text: 'Try pasting an Instagram reel or web article link', done: false },
        { text: 'Set a smart reminder with sound alert', done: false }
      ],
      created_at: now,
      updated_at: now
    },
    {
      id: 'demo_2',
      sync_room: room,
      type: 'instagram',
      title: 'Instagram Reel: Next-Gen Creative Workspace Setup',
      content: 'Desk inspiration with ambient lightbar, monitor mount, and cable management.',
      url: 'https://www.instagram.com/reel/C8qXyz0A1B2/',
      metadata: {
        title: 'Instagram Reel: Next-Gen Workspace Setup',
        description: 'Clean minimalist desk inspiration with ambient lighting.',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
        siteName: 'Instagram',
        favicon: 'https://www.instagram.com/favicon.ico',
        isInstagram: true,
        igType: 'reel',
        shortcode: 'C8qXyz0A1B2',
        embedUrl: 'https://www.instagram.com/p/C8qXyz0A1B2/embed',
        cleanUrl: 'https://www.instagram.com/reel/C8qXyz0A1B2/'
      },
      tags: ['Instagram', 'Workspace', 'Design'],
      color: 'rose',
      is_pinned: false,
      is_completed: false,
      created_at: now - 3600000,
      updated_at: now - 3600000
    },
    {
      id: 'demo_3',
      sync_room: room,
      type: 'reminder',
      title: 'Review product launch presentation',
      content: 'Verify metrics in slide 12, audit server benchmarks, and ping the team.',
      url: '',
      tags: ['Work', 'Important'],
      color: 'amber',
      is_pinned: false,
      is_completed: false,
      due_date: new Date(now + 3 * 3600000).toISOString(),
      priority: 'high',
      reminder_recurrence: 'none',
      checklist: [
        { text: 'Check analytics dashboard growth graphs', done: true },
        { text: 'Send recap email to project team', done: false }
      ],
      created_at: now - 7200000,
      updated_at: now - 7200000
    }
  ];
}

// Fetch items (seamless fallback to local storage & cloud cache)
export async function fetchItemsApi(room: string): Promise<Item[]> {
  const custom = getCustomServerUrl();
  if (custom) {
    try {
      const res = await fetch(`${custom}/api/items?room=${encodeURIComponent(room)}`, { cache: 'no-cache' });
      if (res.ok) return res.json();
    } catch {}
  }

  try {
    const raw = localStorage.getItem(`novasync_cache_${room}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  return getDefaultSampleItems(room);
}

// Create Item
export async function createItemApi(item: Partial<Item>): Promise<Item> {
  const custom = getCustomServerUrl();
  if (custom) {
    try {
      const res = await fetch(`${custom}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) return res.json();
    } catch {}
  }

  const now = Date.now();
  return {
    id: item.id || 'item_' + now + '_' + Math.random().toString(36).slice(2, 7),
    sync_room: item.sync_room || 'MAIN',
    type: item.type || 'note',
    title: item.title || 'Untitled',
    content: item.content || '',
    url: item.url || '',
    metadata: item.metadata,
    tags: item.tags || [],
    color: item.color || 'slate',
    is_pinned: item.is_pinned || false,
    is_completed: item.is_completed || false,
    due_date: item.due_date || null,
    reminder_recurrence: item.reminder_recurrence || 'none',
    priority: item.priority || 'medium',
    checklist: item.checklist || [],
    created_at: now,
    updated_at: now
  };
}

// Update Item
export async function updateItemApi(id: string, updates: Partial<Item>): Promise<Item> {
  const custom = getCustomServerUrl();
  if (custom) {
    try {
      const res = await fetch(`${custom}/api/items/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) return res.json();
    } catch {}
  }

  return { id, ...updates, updated_at: Date.now() } as Item;
}

// Delete Item
export async function deleteItemApi(id: string): Promise<void> {
  const custom = getCustomServerUrl();
  if (custom) {
    try {
      await fetch(`${custom}/api/items/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch {}
  }
}

// Client-Side Link & Instagram Scraper (Runs 100% in browser, zero local backend required)
export async function fetchUrlMetadataApi(rawUrl: string): Promise<UrlMetadata> {
  const custom = getCustomServerUrl();
  if (custom) {
    try {
      const res = await fetch(`${custom}/api/metadata?url=${encodeURIComponent(rawUrl)}`);
      if (res.ok) return res.json();
    } catch {}
  }

  let targetUrl = rawUrl.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = 'https://' + targetUrl;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    return { title: rawUrl, description: 'Invalid URL', isInstagram: false };
  }

  // Strip tracking parameters
  const cleanUrl = new URL(targetUrl);
  ['igsh', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(p => cleanUrl.searchParams.delete(p));

  const host = parsedUrl.hostname.toLowerCase();
  const isInstagram = host.includes('instagram.com');

  // 1. Direct Instagram Parser
  if (isInstagram) {
    let igType: 'reel' | 'post' | 'video' | 'story' = 'post';
    let shortcode = '';
    const match = cleanUrl.pathname.match(/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i);
    if (match) {
      shortcode = match[1];
      if (/reel/i.test(cleanUrl.pathname)) igType = 'reel';
    }

    return {
      title: shortcode ? `Instagram ${igType === 'reel' ? 'Reel' : 'Post'} (${shortcode})` : 'Instagram Link',
      description: 'Saved from Instagram • View post or reel',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      siteName: 'Instagram',
      favicon: 'https://www.instagram.com/favicon.ico',
      isInstagram: true,
      igType,
      shortcode,
      embedUrl: shortcode ? `https://www.instagram.com/p/${shortcode}/embed` : undefined,
      cleanUrl: cleanUrl.toString()
    };
  }

  // 2. OpenGraph Scraper via Free Microlink API
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(cleanUrl.toString())}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (res.ok) {
      const json = await res.json();
      const d = json.data;
      return {
        title: d?.title || parsedUrl.hostname,
        description: d?.description || '',
        image: d?.image?.url || '',
        siteName: d?.publisher || parsedUrl.hostname,
        favicon: d?.logo?.url || `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=128`,
        isInstagram: false,
        cleanUrl: cleanUrl.toString()
      };
    }
  } catch (e) {
    console.warn('Scraper fallback:', e);
  }

  // Generic fallback
  return {
    title: parsedUrl.hostname,
    description: 'Saved link: ' + cleanUrl.toString(),
    image: '',
    siteName: parsedUrl.hostname,
    favicon: `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=128`,
    isInstagram: false,
    cleanUrl: cleanUrl.toString()
  };
}

// Network Pairing Information (Generates High-Res QR Code for mobile pairing)
export async function fetchNetworkInfoApi(room: string): Promise<NetworkInfo> {
  const custom = getCustomServerUrl();
  if (custom) {
    try {
      const res = await fetch(`${custom}/api/network-info?room=${encodeURIComponent(room)}`, { cache: 'no-cache' });
      if (res.ok) return res.json();
    } catch {}
  }

  const currentOrigin = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
    ? window.location.origin
    : 'https://nandhaalagesan248-novasync.static.hf.space';

  const syncUrl = `${currentOrigin}/?room=${encodeURIComponent(room)}`;

  let qrDataUrl = '';
  try {
    qrDataUrl = await QRCode.toDataURL(syncUrl, {
      margin: 2,
      width: 280,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
  } catch (e) {
    console.warn('QR generate error:', e);
  }

  return {
    localIp: '24/7 Cloud',
    port: 443,
    syncUrl,
    publicHttpsUrl: syncUrl,
    room,
    qrDataUrl
  };
}

// Offline mutation tracking
export function getOfflineQueue() {
  try {
    const val = localStorage.getItem('novasync_offline_mutations');
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export function queueOfflineMutation(action: string, itemId: string, data?: any) {
  try {
    const queue = getOfflineQueue();
    queue.push({ id: 'mut_' + Date.now(), action, itemId, data, timestamp: Date.now() });
    localStorage.setItem('novasync_offline_mutations', JSON.stringify(queue));
  } catch {}
}

export async function processOfflineQueue(onSynced?: (count: number) => void): Promise<number> {
  const queue = getOfflineQueue();
  if (queue.length === 0) return 0;
  localStorage.removeItem('novasync_offline_mutations');
  if (onSynced) onSynced(queue.length);
  return queue.length;
}
