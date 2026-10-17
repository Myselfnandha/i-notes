import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Item, ItemType, NetworkInfo, DeviceInfo, ToastMessage, SyncState, SortOption } from './types';
import {
  fetchItemsApi,
  createItemApi,
  updateItemApi,
  deleteItemApi,
  fetchNetworkInfoApi,
  getBaseApiUrl,
  initServerConfig
} from './services/api';
import { playReminderChime } from './services/audio';
import { Header } from './components/Header';
import { SyncBanner } from './components/SyncBanner';
import { QuickAddBar } from './components/QuickAddBar';
import { ItemCard } from './components/ItemCard';
import { ItemModal } from './components/ItemModal';
import { SyncModal } from './components/SyncModal';
import { ToastContainer } from './components/Toast';
import { FileText, Clock, Link as LinkIcon, Sparkles, Home, Pin, ArrowDownUp, Cloud } from 'lucide-react';
import './styles/app.css';

const InstagramIcon: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 18, style }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" style={style}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// Device detector for presence
function detectDeviceInfo(): DeviceInfo {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  let platform = 'Desktop';
  let name = 'Web Browser';

  if (/android/i.test(ua)) {
    platform = 'Android';
    name = 'Android Phone';
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    platform = 'iOS';
    name = 'iPhone / iPad';
  } else if (/macintosh|mac os x/i.test(ua)) {
    platform = 'macOS';
    name = 'Mac Desktop';
  } else if (/windows/i.test(ua)) {
    platform = 'Windows';
    name = 'Windows PC';
  } else if (/linux/i.test(ua)) {
    platform = 'Linux';
    name = 'Linux Station';
  }

  return {
    id: 'dev_' + Math.random().toString(36).substring(2, 8),
    name,
    platform
  };
}

export const App: React.FC = () => {
  // --- State ---
  const [room, setRoom] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) return roomParam.toUpperCase();
    return (localStorage.getItem('novasync_room') || 'MAIN').toUpperCase();
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('novasync_theme') as 'dark' | 'light') || 'dark';
  });

  const [items, setItems] = useState<Item[]>(() => {
    try {
      const cached = localStorage.getItem(`novasync_cache_${room}`);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const itemsRef = useRef<Item[]>(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const [activeTab, setActiveTab] = useState<ItemType | 'all'>('all');
  const [activeTag, setActiveTag] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOption>('newest');

  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [syncState, setSyncState] = useState<SyncState>('connecting');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [connectedDevices, setConnectedDevices] = useState<DeviceInfo[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [modalDefaultType, setModalDefaultType] = useState<ItemType>('note');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Urgent reminder
  const [urgentReminder, setUrgentReminder] = useState<Item | null>(null);

  // PWA Install Prompt
  const deferredPromptRef = useRef<any>(null);
  const [installPromptAvailable, setInstallPromptAvailable] = useState(false);

  // Server bootstrap & WebSocket Ref
  const [serverReady, setServerReady] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);
  const heartbeatIntervalRef = useRef<any>(null);
  const pingTimestampRef = useRef<number>(0);
  const triggeredReminderIds = useRef<Set<string>>(new Set());
  const deviceInfo = useMemo(() => detectDeviceInfo(), []);

  // --- Theme Sync ---
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('novasync_theme', theme);
  }, [theme]);

  // --- Local Cache Sync ---
  useEffect(() => {
    try {
      localStorage.setItem(`novasync_cache_${room}`, JSON.stringify(items));
    } catch (e) {
      console.warn('Cache write issue:', e);
    }
  }, [items, room]);

  // --- Toast Trigger ---
  const addToast = useCallback((type: ToastMessage['type'], title: string, desc?: string, duration = 4000) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, desc, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  // --- Service Worker & Web Share Target Listener ---
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => console.warn('SW register:', err));
    }

    // Check incoming share from Android / iOS Web Share Target or query params
    const params = new URLSearchParams(window.location.search);
    const sharedUrl = params.get('url');
    const sharedText = params.get('text');
    const sharedTitle = params.get('title');

    if (sharedUrl || sharedText) {
      const detectedUrl = sharedUrl || (sharedText?.match(/https?:\/\/[^\s]+/i)?.[0]) || '';
      const content = sharedText || '';
      const isIg = /instagram\.com/i.test(detectedUrl);
      const title = sharedTitle || (isIg ? 'Shared Instagram Reel' : detectedUrl ? 'Shared Bookmark' : 'Shared Note');

      setTimeout(() => {
        handleSaveItem({
          type: isIg ? 'instagram' : detectedUrl ? 'link' : 'note',
          title,
          content: content !== detectedUrl ? content : '',
          url: detectedUrl,
          tags: ['Shared', isIg ? 'Instagram' : 'Mobile'],
          color: isIg ? 'rose' : detectedUrl ? 'cyan' : 'emerald'
        });
        addToast('success', 'Shared Content Saved!', `"${title}" captured from mobile share.`);
      }, 600);

      window.history.replaceState({}, document.title, window.location.pathname + (room !== 'MAIN' ? `?room=${room}` : ''));
    } else if (params.get('shared') === 'success') {
      addToast('success', 'Shared Content Saved!', 'New item automatically captured and synced across your devices.');
      window.history.replaceState({}, document.title, window.location.pathname + (room !== 'MAIN' ? `?room=${room}` : ''));
    }

    // PWA Install listener
    const installHandler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      setInstallPromptAvailable(true);
    };
    window.addEventListener('beforeinstallprompt', installHandler);

    // Global keyboard shortcut (⌘K or Ctrl+K for search)
    const keyHandler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const input = document.getElementById('searchInput') as HTMLInputElement;
        if (input) input.focus();
      } else if (e.key === 'Escape') {
        setIsItemModalOpen(false);
        setIsSyncModalOpen(false);
      }
    };
    window.addEventListener('keydown', keyHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', installHandler);
      window.removeEventListener('keydown', keyHandler);
    };
  }, [room, addToast]);

  // --- Items & Network Info Loaders ---
  const loadNetworkInfo = useCallback(async () => {
    try {
      const data = await fetchNetworkInfoApi(room);
      setNetworkInfo(data);
    } catch (err) {
      console.warn('Network info unavailable:', err);
    }
  }, [room]);

  const loadItems = useCallback(async () => {
    try {
      const data = await fetchItemsApi(room);
      setItems(data);
    } catch (err) {
      console.warn('Using local cache items:', err);
    }
  }, [room]);

  // --- Boot Server Config ---
  useEffect(() => {
    async function boot() {
      await initServerConfig();
      setServerReady(true);
      await loadNetworkInfo();
      await loadItems();
    }
    boot();
  }, [room, loadNetworkInfo, loadItems]);

  // --- 24/7 Cloud WebSocket Sync Engine (Zero Local Server Required) ---
  useEffect(() => {
    if (!serverReady) return;
    let isDisposed = false;

    const connectWebSocket = () => {
      if (isDisposed) return;
      setSyncState((prev) => (prev === 'connected' ? 'connected' : 'connecting'));

      const customBase = getBaseApiUrl();
      let wsUrl = '';

      if (customBase && customBase.startsWith('http')) {
        // Custom self-hosted server
        wsUrl = customBase.replace(/^https:\/\//, 'wss://').replace(/^http:\/\//, 'ws://') + '/ws';
      } else {
        // 24/7 Global Cloud Relay (Zero local server needed, free worldwide channel)
        wsUrl = `wss://itty.ws/c/novasync_${encodeURIComponent(room).toLowerCase()}`;
      }

      let socket: WebSocket;
      try {
        socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
          if (isDisposed) return;
          setSyncState('connected');

          // 1. Join room
          socket.send(
            JSON.stringify({
              action: 'join_room',
              room,
              deviceInfo
            })
          );

          // 2. Request state from any peer device currently online in the room
          socket.send(
            JSON.stringify({
              action: 'request_state',
              room,
              from: deviceInfo.id
            })
          );

          // 3. Ping for latency calculation
          pingTimestampRef.current = performance.now();
          socket.send(JSON.stringify({ action: 'ping' }));
        };

        socket.onmessage = (event) => {
          if (isDisposed) return;
          try {
            const raw = JSON.parse(event.data);
            const msg = raw.message || raw;

            if (msg.action === 'pong' || raw.type === 'pong') {
              const diff = Math.round(performance.now() - pingTimestampRef.current);
              setLatencyMs(diff);
            } else if (msg.action === 'presence_update') {
              setConnectedDevices(msg.devices || []);
            } else if (raw.type === 'join') {
              // itty.ws join event: update presence count
              setConnectedDevices((prev) => {
                if (prev.some((d) => d.id === deviceInfo.id)) return prev;
                return [deviceInfo, ...prev];
              });
              // Send current state to newly joined device
              if (itemsRef.current && itemsRef.current.length > 0) {
                socket.send(JSON.stringify({ action: 'sync_state', room, items: itemsRef.current }));
              }
            } else if (msg.action === 'request_state') {
              // A peer requested our state
              if (itemsRef.current && itemsRef.current.length > 0) {
                socket.send(JSON.stringify({ action: 'sync_state', room, items: itemsRef.current }));
              }
            } else if (msg.action === 'sync_state' && Array.isArray(msg.items)) {
              // Reconcile and merge state with peer
              setItems((prev) => {
                const map = new Map<string, Item>();
                prev.forEach((i) => map.set(i.id, i));
                msg.items.forEach((inc: Item) => {
                  const existing = map.get(inc.id);
                  if (!existing || inc.updated_at > existing.updated_at) {
                    map.set(inc.id, inc);
                  }
                });
                return Array.from(map.values());
              });
            } else if (msg.action === 'item_created') {
              setItems((prev) => {
                if (prev.some((i) => i.id === msg.item.id)) return prev;
                return [msg.item, ...prev];
              });
              addToast('info', 'Synced from Cloud', `"${msg.item.title.slice(0, 30)}..." added.`);
            } else if (msg.action === 'item_updated') {
              setItems((prev) => prev.map((i) => (i.id === msg.item.id ? msg.item : i)));
            } else if (msg.action === 'item_deleted') {
              setItems((prev) => prev.filter((i) => i.id !== msg.id));
              addToast('info', 'Item Removed', 'Deleted on paired device.');
            }
          } catch (e) {
            console.warn('WS message parse error:', e);
          }
        };

        socket.onclose = () => {
          if (isDisposed) return;
          setSyncState('reconnecting');
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
        };

        socket.onerror = () => {
          if (isDisposed) return;
          setSyncState('offline');
        };
      } catch (e) {
        console.warn('WebSocket setup exception:', e);
        setSyncState('offline');
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 4000);
      }
    };

    connectWebSocket();

    // Heartbeat every 25 seconds
    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        pingTimestampRef.current = performance.now();
        wsRef.current.send(JSON.stringify({ action: 'ping' }));
      }
    }, 25000);

    return () => {
      isDisposed = true;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [room, serverReady, deviceInfo, addToast]);

  // --- Reminders Daemon Loop ---
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let urgent: Item | null = null;

      for (const item of items) {
        if (item.type !== 'reminder' || item.is_completed || !item.due_date) continue;
        const due = new Date(item.due_date).getTime();
        const diff = due - now;

        if (diff <= 60000 && !triggeredReminderIds.current.has(item.id)) {
          triggeredReminderIds.current.add(item.id);
          playReminderChime();

          if ('Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification(`⏰ Reminder: ${item.title}`, {
                body: item.content || 'Your scheduled reminder is due now.',
                icon: '/icons/icon.svg'
              });
            } catch (e) {
              console.warn('Notification error:', e);
            }
          }
          addToast('warning', `⏰ Reminder Due: ${item.title}`, item.content || 'Due now!');
        }

        if (diff > -3600000 && diff <= 1800000) {
          urgent = item;
        }
      }

      setUrgentReminder(urgent);
    }, 10000);

    return () => clearInterval(interval);
  }, [items, addToast]);

  // --- Item Operations ---
  const handleSaveItem = async (itemData: Partial<Item>) => {
    const isEdit = Boolean(itemData.id);
    const saved = isEdit
      ? await updateItemApi(itemData.id!, itemData)
      : await createItemApi({ ...itemData, sync_room: room });

    if (isEdit) {
      setItems((prev) => prev.map((i) => (i.id === saved.id ? saved : i)));
    } else {
      setItems((prev) => [saved, ...prev]);
    }
    setIsItemModalOpen(false);

    // Broadcast over WebSocket to all other devices in the room
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          action: isEdit ? 'item_updated' : 'item_created',
          item: saved
        })
      );
    }

    addToast('success', isEdit ? 'Changes Saved' : 'Created', 'Saved and synced across your devices.');
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    await deleteItemApi(id);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: 'item_deleted', id }));
    }

    addToast('info', 'Deleted', 'Item removed.');
  };

  const handleTogglePin = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const nextPin = !item.is_pinned;
    const updated = { ...item, is_pinned: nextPin, updated_at: Date.now() };
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    await updateItemApi(id, { is_pinned: nextPin });

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: 'item_updated', item: updated }));
    }
  };

  const handleToggleComplete = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const nextComp = !item.is_completed;
    const updated = { ...item, is_completed: nextComp, updated_at: Date.now() };
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    await updateItemApi(id, { is_completed: nextComp });

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: 'item_updated', item: updated }));
    }
  };

  const handleToggleChecklist = async (itemId: string, index: number) => {
    const item = items.find((i) => i.id === itemId);
    if (!item || !item.checklist || !item.checklist[index]) return;

    const nextChecklist = [...item.checklist];
    nextChecklist[index].done = !nextChecklist[index].done;
    const updated = { ...item, checklist: nextChecklist, updated_at: Date.now() };

    setItems((prev) => prev.map((i) => (i.id === itemId ? updated : i)));
    await updateItemApi(itemId, { checklist: nextChecklist });

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: 'item_updated', item: updated }));
    }
  };

  const handleSnooze = async (id: string, mins: number) => {
    const newDueDate = new Date(Date.now() + mins * 60000).toISOString();
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const updated = { ...item, due_date: newDueDate, is_completed: false, updated_at: Date.now() };

    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    triggeredReminderIds.current.delete(id);
    setUrgentReminder(null);
    await updateItemApi(id, { due_date: newDueDate, is_completed: false });

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: 'item_updated', item: updated }));
    }

    addToast('info', 'Snoozed', `Reminder snoozed for ${mins} minutes.`);
  };

  const handleQuickSubmit = async (text: string, type: ItemType, detectedUrl: string | null) => {
    const itemData: Partial<Item> = {
      type,
      title: text.slice(0, 100),
      content: text,
      url: detectedUrl || '',
      color: type === 'instagram' ? 'rose' : type === 'link' ? 'cyan' : 'slate'
    };

    if (type === 'reminder') {
      itemData.due_date = new Date(Date.now() + 2 * 3600000).toISOString();
    }

    await handleSaveItem(itemData);
  };

  const handleQuickPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const match = text.match(/(https?:\/\/[^\s]+)/i);
      const url = match ? match[0] : null;

      if (url) {
        setEditingItem(null);
        setModalDefaultType(/instagram\.com/i.test(url) ? 'instagram' : 'link');
        setIsItemModalOpen(true);
        addToast('info', 'Pasted Link', 'Fetching preview...');
      } else {
        setEditingItem(null);
        setModalDefaultType('note');
        setIsItemModalOpen(true);
      }
    } catch {
      setEditingItem(null);
      setModalDefaultType('link');
      setIsItemModalOpen(true);
    }
  };

  const handleTriggerInstall = () => {
    if (deferredPromptRef.current) {
      deferredPromptRef.current.prompt();
      deferredPromptRef.current.userChoice.then((choice: any) => {
        if (choice.outcome === 'accepted') {
          addToast('success', 'Installing App...', 'NovaSync added to your device Home Screen!');
        }
        deferredPromptRef.current = null;
        setInstallPromptAvailable(false);
      });
    } else {
      alert(
        'To install NovaSync on Mobile:\n\n📱 Android: Tap the 3 dots (⋮) in Chrome → Tap "Install app" or "Add to Home screen".\n\n🍎 iOS / iPhone: Tap the Share icon at the bottom of Safari → Tap "Add to Home Screen".'
      );
    }
  };

  const handleImportItems = (imported: Item[]) => {
    setItems((prev) => {
      const existingIds = new Set(prev.map((i) => i.id));
      const newItems = imported.filter((i) => !existingIds.has(i.id));
      const combined = [...newItems, ...prev];
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ action: 'sync_state', room, items: combined }));
      }
      return combined;
    });
  };

  // --- Filtering & Sorting ---
  const allTags = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => {
      (i.tags || []).forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [items]);

  const filteredItems = useMemo(() => {
    let list = [...items];

    if (activeTab !== 'all') {
      list = list.filter((i) => i.type === activeTab);
    }

    if (activeTag !== 'ALL') {
      list = list.filter((i) => (i.tags || []).includes(activeTag));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((i) => {
        const title = (i.title || '').toLowerCase();
        const content = (i.content || '').toLowerCase();
        const url = (i.url || '').toLowerCase();
        const tags = (i.tags || []).join(' ').toLowerCase();
        return title.includes(q) || content.includes(q) || url.includes(q) || tags.includes(q);
      });
    }

    list.sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
      if (sortOrder === 'newest') return b.updated_at - a.updated_at;
      if (sortOrder === 'oldest') return a.updated_at - b.updated_at;
      if (sortOrder === 'due') {
        const dueA = a.due_date ? new Date(a.due_date).getTime() : Infinity;
        const dueB = b.due_date ? new Date(b.due_date).getTime() : Infinity;
        return dueA - dueB;
      }
      if (sortOrder === 'priority') {
        const pOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
        return (pOrder[b.priority || 'medium'] || 2) - (pOrder[a.priority || 'medium'] || 2);
      }
      if (sortOrder === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return list;
  }, [items, activeTab, activeTag, searchQuery, sortOrder]);

  const pinnedItems = useMemo(() => filteredItems.filter((i) => i.is_pinned), [filteredItems]);
  const otherItems = useMemo(() => filteredItems.filter((i) => !i.is_pinned), [filteredItems]);

  return (
    <div className="app-root">
      {/* Top Navbar */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenCreateModal={() => {
          setEditingItem(null);
          setModalDefaultType('note');
          setIsItemModalOpen(true);
        }}
        onQuickPaste={handleQuickPaste}
        onRequestNotifications={() => {
          if ('Notification' in window) {
            Notification.requestPermission().then((p) => {
              if (p === 'granted') addToast('success', 'Notifications Active', 'Browser alerts enabled.');
            });
          }
        }}
        onTestSound={() => {
          playReminderChime();
          addToast('info', 'Harmonic Alert Chime', 'Sound synthesizer test successful.');
        }}
        onOpenBackupModal={() => setIsSyncModalOpen(true)}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        theme={theme}
        syncState={syncState}
        connectedCount={connectedDevices.length || 1}
        latencyMs={latencyMs}
        pendingOfflineCount={0}
        installPromptAvailable={installPromptAvailable}
        onTriggerInstall={handleTriggerInstall}
      />

      {/* Main Layout */}
      <main className="main-layout">
        {/* Unified 24/7 Cloud Sync Banner */}
        <SyncBanner
          room={room}
          syncUrl={networkInfo?.syncUrl || ''}
          syncState={syncState}
          latencyMs={latencyMs}
          connectedCount={connectedDevices.length || 1}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          onCopySyncLink={() => {
            if (networkInfo?.syncUrl) {
              navigator.clipboard.writeText(networkInfo.syncUrl);
              addToast('success', 'Link Copied!', 'Device sync link copied.');
            } else {
              setIsSyncModalOpen(true);
            }
          }}
        />

        {/* Urgent Reminder Alert */}
        {urgentReminder && (
          <div className="urgent-alert">
            <div className="urgent-icon">🔔</div>
            <div className="urgent-info">
              <h4>Reminder: {urgentReminder.title}</h4>
              <p>Due now or imminent! Click to complete or snooze.</p>
            </div>
            <div className="urgent-actions">
              <button className="pill-btn small" onClick={() => handleSnooze(urgentReminder.id, 15)}>
                Snooze 15m
              </button>
              <button className="pill-btn small success" onClick={() => handleToggleComplete(urgentReminder.id)}>
                Complete ✓
              </button>
            </div>
          </div>
        )}

        {/* Quick Add Bar */}
        <QuickAddBar
          onQuickSubmit={handleQuickSubmit}
          onOpenWithUrl={(url) => {
            setEditingItem(null);
            setModalDefaultType(/instagram\.com/i.test(url) ? 'instagram' : 'link');
            setIsItemModalOpen(true);
          }}
        />

        {/* Navigation Categories Tabs */}
        <nav className="categories-nav">
          <div className="tabs-list">
            <button
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              <span className="tab-label">All Items</span>
              <span className="tab-count">{items.length}</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'note' ? 'active' : ''}`}
              onClick={() => setActiveTab('note')}
            >
              <FileText size={15} style={{ marginRight: 4 }} />
              <span className="tab-label">Notes</span>
              <span className="tab-count">{items.filter((i) => i.type === 'note').length}</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'reminder' ? 'active' : ''}`}
              onClick={() => setActiveTab('reminder')}
            >
              <Clock size={15} style={{ marginRight: 4 }} />
              <span className="tab-label">Reminders</span>
              <span className="tab-count">{items.filter((i) => i.type === 'reminder').length}</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'instagram' ? 'active' : ''}`}
              onClick={() => setActiveTab('instagram')}
            >
              <InstagramIcon size={15} style={{ marginRight: 4 }} />
              <span className="tab-label">Instagram</span>
              <span className="tab-count">{items.filter((i) => i.type === 'instagram').length}</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'link' ? 'active' : ''}`}
              onClick={() => setActiveTab('link')}
            >
              <LinkIcon size={15} style={{ marginRight: 4 }} />
              <span className="tab-label">Saved Links</span>
              <span className="tab-count">{items.filter((i) => i.type === 'link').length}</span>
            </button>
          </div>

          {/* Tags Filter */}
          <div className="tags-filter-bar">
            <span className="tags-label">Tags:</span>
            <button
              className={`tag-pill ${activeTag === 'ALL' ? 'active' : ''}`}
              onClick={() => setActiveTag('ALL')}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`tag-pill ${activeTag === tag ? 'active' : ''}`}
                onClick={() => setActiveTag(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        </nav>

        {/* Items Section */}
        <section className="items-section">
          <div className="section-subheader">
            <div className="active-filter-title">
              {activeTab === 'all' && 'All Items'}
              {activeTab === 'note' && 'Notes'}
              {activeTab === 'reminder' && 'Reminders'}
              {activeTab === 'instagram' && 'Instagram Reels & Posts'}
              {activeTab === 'link' && 'Saved Links'}
              {activeTag !== 'ALL' && ` • #${activeTag}`}
              {searchQuery && ` • Search: "${searchQuery}"`}
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                ({filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'})
              </span>
            </div>

            {/* Sort Selector Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ArrowDownUp size={14} style={{ color: 'var(--text-muted)' }} />
              <select
                className="sort-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOption)}
                aria-label="Sort items"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="due">Due Date</option>
                <option value="priority">Priority</option>
                <option value="alphabetical">Title A-Z</option>
              </select>
            </div>
          </div>

          {/* Pinned Items Section */}
          {pinnedItems.length > 0 && (
            <div className="pinned-section">
              <div className="section-divider-label">
                <Pin size={13} style={{ display: 'inline', marginRight: 4 }} />
                PINNED ITEMS ({pinnedItems.length})
              </div>
              <div className="items-grid">
                {pinnedItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onEdit={(it) => {
                      setEditingItem(it);
                      setIsItemModalOpen(true);
                    }}
                    onDelete={handleDeleteItem}
                    onTogglePin={handleTogglePin}
                    onToggleComplete={handleToggleComplete}
                    onToggleChecklist={handleToggleChecklist}
                    onSnooze={handleSnooze}
                    onTagClick={(t) => setActiveTag(t)}
                    onCopyUrl={(u) => {
                      navigator.clipboard.writeText(u);
                      addToast('success', 'Copied!', 'Link copied to clipboard.');
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other Items Section */}
          {otherItems.length > 0 && (
            <div className="other-items-section" style={{ marginTop: pinnedItems.length > 0 ? 20 : 0 }}>
              {pinnedItems.length > 0 && (
                <div className="section-divider-label">
                  OTHER ITEMS ({otherItems.length})
                </div>
              )}
              <div className="items-grid">
                {otherItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onEdit={(it) => {
                      setEditingItem(it);
                      setIsItemModalOpen(true);
                    }}
                    onDelete={handleDeleteItem}
                    onTogglePin={handleTogglePin}
                    onToggleComplete={handleToggleComplete}
                    onToggleChecklist={handleToggleChecklist}
                    onSnooze={handleSnooze}
                    onTagClick={(t) => setActiveTag(t)}
                    onCopyUrl={(u) => {
                      navigator.clipboard.writeText(u);
                      addToast('success', 'Copied!', 'Link copied to clipboard.');
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon-wrap">
                <Sparkles size={36} />
              </div>
              <h3>No items found</h3>
              <p>Jot a note, schedule a reminder, or paste an Instagram link above.</p>
              <button
                className="action-btn primary-btn"
                onClick={() => {
                  setEditingItem(null);
                  setModalDefaultType('note');
                  setIsItemModalOpen(true);
                }}
              >
                + Create First Item
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-bar">
        <button
          className={`mobile-nav-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <Home size={20} />
          <span>Home</span>
        </button>
        <button
          className={`mobile-nav-btn ${activeTab === 'note' ? 'active' : ''}`}
          onClick={() => setActiveTab('note')}
        >
          <FileText size={20} />
          <span>Notes</span>
        </button>
        <button
          className="mobile-fab"
          onClick={() => {
            setEditingItem(null);
            setModalDefaultType('note');
            setIsItemModalOpen(true);
          }}
          title="New Item"
        >
          +
        </button>
        <button
          className={`mobile-nav-btn ${activeTab === 'reminder' ? 'active' : ''}`}
          onClick={() => setActiveTab('reminder')}
        >
          <Clock size={20} />
          <span>Alerts</span>
        </button>
        <button
          className={`mobile-nav-btn ${activeTab === 'instagram' ? 'active' : ''}`}
          onClick={() => setActiveTab('instagram')}
        >
          <InstagramIcon size={20} />
          <span>Links</span>
        </button>
      </div>

      {/* Create / Edit Modal */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        editingItem={editingItem}
        defaultType={modalDefaultType}
      />

      {/* Sync Modal */}
      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        networkInfo={networkInfo}
        room={room}
        onSwitchRoom={(newRoom) => {
          setRoom(newRoom);
          localStorage.setItem('novasync_room', newRoom);
          window.history.replaceState({}, document.title, `?room=${newRoom}`);
          setIsSyncModalOpen(false);
          addToast('success', 'Room Switched', `Now in room "${newRoom}".`);
        }}
        connectedCount={connectedDevices.length || 1}
        devices={connectedDevices}
        syncState={syncState}
        latencyMs={latencyMs}
        items={items}
        onImportItems={handleImportItems}
        onCopyUrl={(u) => {
          navigator.clipboard.writeText(u);
          addToast('success', 'Copied!', 'Link copied.');
        }}
        onServerConfigChanged={() => {
          loadItems();
          loadNetworkInfo();
          addToast('info', 'Server Config Applied', 'Reconnected to sync endpoint.');
        }}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} />
    </div>
  );
};
