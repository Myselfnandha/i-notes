import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Item,
  ItemType,
  NetworkInfo,
  DeviceInfo,
  ToastMessage,
  SyncState,
  SortOption
} from './types';
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
import { QuickAddBar } from './components/QuickAddBar';
import { ItemCard } from './components/ItemCard';
import { ItemModal } from './components/ItemModal';
import { SyncModal } from './components/SyncModal';
import { FloatingActionDock } from './components/FloatingActionDock';
import { FoldersView } from './components/FoldersView';
import { ToastContainer } from './components/Toast';
import './styles/app.css';

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

const DEFAULT_EDITORIAL_NOTES: Item[] = [
  {
    id: 'sample_note_1',
    sync_room: 'MAIN',
    type: 'note',
    title: 'Autumn Essay Outline',
    deck: 'On the transition of morning light & silent walks',
    content:
      'The quiet shift begins not with the falling leaves, but in the colder tint of amber across the study floor at dawn. Gathering fragments of observation from the northern pond trail...',
    tags: ['writing'],
    color: 'paper',
    folderId: 'Personal',
    is_pinned: true,
    is_completed: false,
    created_at: Date.now() - 7200000,
    updated_at: Date.now() - 7200000
  },
  {
    id: 'sample_note_2',
    sync_room: 'MAIN',
    type: 'checklist',
    title: 'Weekend Market List',
    deck: 'Produce Row & Hearth Bakery',
    content: '',
    tags: ['groceries', 'personal'],
    color: 'ochre',
    folderId: 'Personal',
    is_pinned: true,
    is_completed: false,
    checklist: [
      { text: 'Chanterelle mushrooms (250g)', done: true },
      { text: 'Country sourdough from Hearth & Crust', done: true },
      { text: 'Salted French butter & flaky sea salt', done: false }
    ],
    created_at: Date.now() - 14400000,
    updated_at: Date.now() - 14400000
  },
  {
    id: 'sample_note_3',
    sync_room: 'MAIN',
    type: 'note',
    title: 'Coffee Ritual',
    deck: 'V60 Ethiopian Single Origin',
    content:
      '• 18g washed Ethiopia\n• 300g water at 93°C\n• 45s bloom (50g)\n• Target: 2m 45s finish',
    tags: ['recipes', 'coffee'],
    color: 'oat',
    folderId: 'Recipes',
    is_pinned: false,
    is_completed: false,
    created_at: Date.now() - 86400000,
    updated_at: Date.now() - 86400000
  },
  {
    id: 'sample_note_4',
    sync_room: 'MAIN',
    type: 'audio',
    title: 'Design Sync Notes',
    deck: 'Tactile Parchment Warmth',
    content:
      '“Realign tactile card elevations so parchment warmth leads visual priority over synthetic drop shadows...”',
    audio_duration: '01:42',
    tags: ['ideas', 'design'],
    color: 'paper',
    folderId: 'Work & Drafts',
    is_pinned: false,
    is_completed: false,
    created_at: Date.now() - 18000000,
    updated_at: Date.now() - 18000000
  },
  {
    id: 'sample_note_5',
    sync_room: 'MAIN',
    type: 'note',
    title: 'Book Shelf & Reading',
    deck: 'Curated Bibliography',
    content:
      "• The Creative Act — Rick Rubin\n• In Praise of Shadows — Jun'ichirō Tanizaki\n• The Timeless Way of Building — Christopher Alexander",
    tags: ['reading', 'inspiration'],
    color: 'sage',
    folderId: 'Book Ideas',
    is_pinned: false,
    is_completed: false,
    created_at: Date.now() - 172800000,
    updated_at: Date.now() - 172800000
  }
];

export const App: React.FC = () => {
  // --- State ---
  const [room, setRoom] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) return roomParam.toUpperCase();
    return (localStorage.getItem('novasync_room') || 'MAIN').toUpperCase();
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('novasync_theme') as 'dark' | 'light') || 'light';
  });

  const [items, setItems] = useState<Item[]>(() => {
    try {
      const cached = localStorage.getItem(`novasync_cache_${room}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_EDITORIAL_NOTES;
    } catch {
      return DEFAULT_EDITORIAL_NOTES;
    }
  });

  const itemsRef = useRef<Item[]>(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const [activeTab, setActiveTab] = useState<string>('all');
  const [activeTag, setActiveTag] = useState<string>('ALL');
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
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
  const addToast = useCallback(
    (type: ToastMessage['type'], title: string, desc?: string, duration = 3500) => {
      const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
      setToasts((prev) => [...prev, { id, type, title, desc, duration }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

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
      const detectedUrl = sharedUrl || sharedText?.match(/https?:\/\/[^\s]+/i)?.[0] || '';
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
          color: isIg ? 'terracotta' : detectedUrl ? 'ochre' : 'sage'
        });
        addToast('success', 'Shared Content Saved!', `"${title}" captured from mobile share.`);
      }, 500);

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname + (room !== 'MAIN' ? `?room=${room}` : '')
      );
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
        wsUrl = customBase.replace(/^https:\/\//, 'wss://').replace(/^http:\/\//, 'ws://') + '/ws';
      } else {
        wsUrl = `wss://itty.ws/c/novasync_${encodeURIComponent(room).toLowerCase()}`;
      }

      let socket: WebSocket;
      try {
        socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
          if (isDisposed) return;
          setSyncState('connected');

          socket.send(
            JSON.stringify({
              action: 'join_room',
              room,
              deviceInfo
            })
          );

          socket.send(
            JSON.stringify({
              action: 'request_state',
              room,
              from: deviceInfo.id
            })
          );

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
              setConnectedDevices((prev) => {
                if (prev.some((d) => d.id === deviceInfo.id)) return prev;
                return [deviceInfo, ...prev];
              });
              if (itemsRef.current && itemsRef.current.length > 0) {
                socket.send(JSON.stringify({ action: 'sync_state', room, items: itemsRef.current }));
              }
            } else if (msg.action === 'request_state') {
              if (itemsRef.current && itemsRef.current.length > 0) {
                socket.send(JSON.stringify({ action: 'sync_state', room, items: itemsRef.current }));
              }
            } else if (msg.action === 'sync_state' && Array.isArray(msg.items)) {
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

  const handleTriggerInstall = () => {
    if (deferredPromptRef.current) {
      deferredPromptRef.current.prompt();
      deferredPromptRef.current.userChoice.then((choice: any) => {
        if (choice.outcome === 'accepted') {
          addToast('success', 'Installing App...', 'Folio added to your device Home Screen!');
        }
        deferredPromptRef.current = null;
        setInstallPromptAvailable(false);
      });
    } else {
      alert(
        'To install Folio on Mobile:\n\n📱 Android: Tap the 3 dots (⋮) in Chrome → Tap "Install app" or "Add to Home screen".\n\n🍎 iOS / iPhone: Tap the Share icon at the bottom of Safari → Tap "Add to Home Screen".'
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

    if (activeTab === 'pinned') {
      list = list.filter((i) => i.is_pinned);
    } else if (activeTab === 'checklists') {
      list = list.filter((i) => (i.checklist?.length || 0) > 0 || i.type === 'checklist');
    } else if (activeTab === 'reminders') {
      list = list.filter((i) => i.type === 'reminder' || Boolean(i.due_date));
    } else if (activeTab === 'links') {
      list = list.filter((i) => i.type === 'link' || i.type === 'instagram');
    } else if (activeTab === 'audio') {
      list = list.filter((i) => i.type === 'audio');
    }

    if (activeFolder) {
      list = list.filter((i) => i.folderId === activeFolder);
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
  }, [items, activeTab, activeFolder, activeTag, searchQuery, sortOrder]);

  const pinnedItems = useMemo(() => filteredItems.filter((i) => i.is_pinned), [filteredItems]);
  const otherItems = useMemo(() => filteredItems.filter((i) => !i.is_pinned), [filteredItems]);

  return (
    <div className="font-body" style={{ minHeight: '100dvh', background: 'var(--surface)' }}>
      {/* Editorial Top Masthead */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSync={() => setIsSyncModalOpen(true)}
        onOpenCreate={() => {
          setEditingItem(null);
          setModalDefaultType('note');
          setIsItemModalOpen(true);
        }}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        theme={theme}
        syncState={syncState}
        room={room}
        connectedCount={connectedDevices.length || 1}
        onOpenBackup={() => setIsSyncModalOpen(true)}
        onTestSound={playReminderChime}
        installPromptAvailable={installPromptAvailable}
        onTriggerInstall={handleTriggerInstall}
      />

      {/* Search & Quick Discovery Bar */}
      <QuickAddBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onQuickSubmit={() => {}}
        onOpenWithUrl={() => {}}
      />

      {/* Horizontal Filter Chips */}
      <div className="filter-chips-scroll">
        <button
          type="button"
          className={`editorial-chip ${activeTab === 'all' && !activeFolder && activeTag === 'ALL' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('all');
            setActiveFolder(null);
            setActiveTag('ALL');
          }}
        >
          All Notes
          <span className="chip-count">{items.length}</span>
        </button>

        <button
          type="button"
          className={`editorial-chip ${activeTab === 'pinned' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('pinned');
            setActiveFolder(null);
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            push_pin
          </span>
          Pinned
          <span className="chip-count">{items.filter((i) => i.is_pinned).length}</span>
        </button>

        <button
          type="button"
          className={`editorial-chip ${activeTab === 'checklists' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('checklists');
            setActiveFolder(null);
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            checklist
          </span>
          Checklists
          <span className="chip-count">
            {items.filter((i) => (i.checklist?.length || 0) > 0 || i.type === 'checklist').length}
          </span>
        </button>

        <button
          type="button"
          className={`editorial-chip ${activeTab === 'reminders' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('reminders');
            setActiveFolder(null);
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            alarm
          </span>
          Reminders
          <span className="chip-count">
            {items.filter((i) => i.type === 'reminder' || Boolean(i.due_date)).length}
          </span>
        </button>

        <button
          type="button"
          className={`editorial-chip ${activeTab === 'links' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('links');
            setActiveFolder(null);
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            link
          </span>
          Links & Reels
          <span className="chip-count">
            {items.filter((i) => i.type === 'link' || i.type === 'instagram').length}
          </span>
        </button>

        <button
          type="button"
          className={`editorial-chip ${activeTab === 'folders' ? 'active' : ''}`}
          onClick={() => setActiveTab('folders')}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            folder
          </span>
          Folders & Vault
        </button>

        {allTags.slice(0, 6).map((tag) => (
          <button
            key={tag}
            type="button"
            className={`editorial-chip ${activeTag === tag ? 'active' : ''}`}
            onClick={() => {
              setActiveTag(activeTag === tag ? 'ALL' : tag);
              setActiveTab('all');
            }}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Main Canvas View */}
      <main className="app-main-canvas">
        {activeTab === 'folders' ? (
          <FoldersView
            items={items}
            activeFolder={activeFolder}
            onSelectFolder={(f) => {
              setActiveFolder(f);
              if (f) setActiveTab('all');
            }}
            onSelectTag={(t) => {
              setActiveTag(t);
              setActiveTab('all');
            }}
            onOpenCreate={() => {
              setEditingItem(null);
              setModalDefaultType('note');
              setIsItemModalOpen(true);
            }}
            onSelectQuickFilter={(qf) => {
              if (qf === 'pinned') setActiveTab('pinned');
              else if (qf === 'reminders') setActiveTab('reminders');
              else if (qf === 'audio') setActiveTab('audio');
              else setActiveTab('all');
            }}
          />
        ) : (
          <>
            {/* Feed Section Header with Sorting */}
            <div className="feed-section-header">
              <div className="feed-section-title">
                {activeFolder ? (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--primary)' }}>
                      folder_open
                    </span>
                    <span>{activeFolder}</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--primary)' }}>
                      notes
                    </span>
                    <span>Recent Notes</span>
                  </>
                )}
                <span style={{ color: 'var(--outline)', fontWeight: 400, marginLeft: 4 }}>
                  ({filteredItems.length})
                </span>
              </div>

              {/* Sort Dropdown */}
              <div className="sort-dropdown">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  sort
                </span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as SortOption)}
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    cursor: 'pointer'
                  }}
                  aria-label="Sort notes"
                >
                  <option value="newest">Sort by Date</option>
                  <option value="oldest">Oldest First</option>
                  <option value="due">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="alphabetical">Title A-Z</option>
                </select>
              </div>
            </div>

            {/* Pinned Section */}
            {pinnedItems.length > 0 && activeTab !== 'pinned' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                    push_pin
                  </span>
                  <span>Pinned ({pinnedItems.length})</span>
                </div>
                <div className="masonry-grid">
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
                        addToast('success', 'Copied!', 'Link copied.');
                      }}
                      onPlayChime={playReminderChime}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other / All Recent Notes Masonry Grid */}
            {otherItems.length > 0 && (
              <div className="masonry-grid">
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
                      addToast('success', 'Copied!', 'Link copied.');
                    }}
                    onPlayChime={playReminderChime}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredItems.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '48px 16px',
                  borderRadius: 'var(--radius-card)',
                  background: 'var(--surface-container-low)',
                  border: '1px dashed var(--card-hairline)',
                  marginTop: 16
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '38px', color: 'var(--primary)', opacity: 0.8 }}>
                  auto_awesome
                </span>
                <h3 className="font-headline" style={{ fontSize: '1.25rem', marginTop: 8, color: 'var(--on-surface)' }}>
                  No entries found
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--outline)', marginTop: 4, maxWidth: 360, marginInline: 'auto' }}>
                  Write a thought, build a checklist, schedule a reminder, or paste a link below.
                </p>
                <button
                  type="button"
                  className="editorial-chip active"
                  style={{ marginTop: 16, padding: '8px 18px', fontSize: '0.84rem' }}
                  onClick={() => {
                    setEditingItem(null);
                    setModalDefaultType('note');
                    setIsItemModalOpen(true);
                  }}
                >
                  + Create First Thought
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Tactile Floating Action Dock (Above Bottom Safe Area) */}
      <FloatingActionDock
        onOpenCreate={(type) => {
          setEditingItem(null);
          setModalDefaultType(type);
          setIsItemModalOpen(true);
        }}
        onQuickSaveText={(text, type) => {
          handleSaveItem({
            type,
            title: text.slice(0, 80),
            content: text,
            color: type === 'reminder' ? 'ochre' : 'paper'
          });
        }}
      />

      {/* Note Editor Modal */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        editingItem={editingItem}
        defaultType={modalDefaultType}
      />

      {/* Sync & Device Pairing Modal */}
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
