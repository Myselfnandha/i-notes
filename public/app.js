/**
 * NovaSync — Client Application Engine
 * Unified Notes, Smart Reminders, and Real-Time Cross-Device Sync
 */

(function () {
  'use strict';

  // --- State ---
  const state = {
    items: [],
    activeTab: 'all',
    activeTag: 'ALL',
    searchQuery: '',
    sortOrder: 'newest', // 'newest' | 'oldest'
    currentRoom: getInitialRoom(),
    networkInfo: null,
    ws: null,
    wsConnected: false,
    reconnectAttempts: 0,
    triggeredReminderIds: new Set(),
    audioContext: null,
    soundMuted: false,
    deviceInfo: detectDeviceInfo()
  };

  // Helper: Detect room from URL query or localStorage
  function getInitialRoom() {
    const params = new URLSearchParams(window.location.search);
    const roomFromUrl = params.get('room');
    if (roomFromUrl && roomFromUrl.trim()) {
      const clean = roomFromUrl.trim().toUpperCase();
      localStorage.setItem('novasync_room', clean);
      return clean;
    }
    return (localStorage.getItem('novasync_room') || 'MAIN').toUpperCase();
  }

  // Helper: Detect device name & platform for presence
  function detectDeviceInfo() {
    const ua = navigator.userAgent;
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

  // --- DOM Elements ---
  const el = {
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    syncModalBtn: document.getElementById('syncModalBtn'),
    syncDot: document.getElementById('syncDot'),
    syncStatusText: document.getElementById('syncStatusText'),
    bannerRoomName: document.getElementById('bannerRoomName'),
    bannerQrBtn: document.getElementById('bannerQrBtn'),
    bannerCopyLinkBtn: document.getElementById('bannerCopyLinkBtn'),
    quickPasteBtn: document.getElementById('quickPasteBtn'),
    newItemBtn: document.getElementById('newItemBtn'),
    emptyCreateBtn: document.getElementById('emptyCreateBtn'),
    notifToggleBtn: document.getElementById('notifToggleBtn'),
    bellBadge: document.getElementById('bellBadge'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    urgentAlertContainer: document.getElementById('urgentAlertContainer'),
    urgentTitle: document.getElementById('urgentTitle'),
    urgentTime: document.getElementById('urgentTime'),
    urgentSnoozeBtn: document.getElementById('urgentSnoozeBtn'),
    urgentDoneBtn: document.getElementById('urgentDoneBtn'),
    quickInput: document.getElementById('quickInput'),
    quickSubmitBtn: document.getElementById('quickSubmitBtn'),
    quickLinkDetected: document.getElementById('quickLinkDetected'),
    detectedUrlText: document.getElementById('detectedUrlText'),
    quickSaveDetectedBtn: document.getElementById('quickSaveDetectedBtn'),
    tabsList: document.querySelector('.tabs-list'),
    tagsFilterContainer: document.getElementById('tagsFilterContainer'),
    itemsGrid: document.getElementById('itemsGrid'),
    emptyState: document.getElementById('emptyState'),
    sortToggleBtn: document.getElementById('sortToggleBtn'),
    sortLabel: document.getElementById('sortLabel'),
    activeFilterTitle: document.getElementById('activeFilterTitle'),
    countAll: document.getElementById('countAll'),
    countNotes: document.getElementById('countNotes'),
    countReminders: document.getElementById('countReminders'),
    countInstagram: document.getElementById('countInstagram'),
    countLinks: document.getElementById('countLinks'),
    // Modals
    itemModalOverlay: document.getElementById('itemModalOverlay'),
    itemForm: document.getElementById('itemForm'),
    modalTitle: document.getElementById('modalTitle'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalCancelBtn: document.getElementById('modalCancelBtn'),
    formItemId: document.getElementById('formItemId'),
    formItemType: document.getElementById('formItemType'),
    urlGroup: document.getElementById('urlGroup'),
    formUrl: document.getElementById('formUrl'),
    fetchMetaBtn: document.getElementById('fetchMetaBtn'),
    fetchBtnSpinner: document.getElementById('fetchBtnSpinner'),
    urlPreviewBox: document.getElementById('urlPreviewBox'),
    prevImg: document.getElementById('prevImg'),
    prevSite: document.getElementById('prevSite'),
    prevTitle: document.getElementById('prevTitle'),
    prevDesc: document.getElementById('prevDesc'),
    formTitle: document.getElementById('formTitle'),
    formContent: document.getElementById('formContent'),
    checklistGroup: document.getElementById('checklistGroup'),
    formChecklistContainer: document.getElementById('formChecklistContainer'),
    newChecklistInput: document.getElementById('newChecklistInput'),
    addChecklistBtn: document.getElementById('addChecklistBtn'),
    reminderGroup: document.getElementById('reminderGroup'),
    formDueDate: document.getElementById('formDueDate'),
    formPriority: document.getElementById('formPriority'),
    formRecurrence: document.getElementById('formRecurrence'),
    formTags: document.getElementById('formTags'),
    formIsPinned: document.getElementById('formIsPinned'),
    // Sync Modal
    syncModalOverlay: document.getElementById('syncModalOverlay'),
    syncModalCloseBtn: document.getElementById('syncModalCloseBtn'),
    syncQrImage: document.getElementById('syncQrImage'),
    qrLoading: document.getElementById('qrLoading'),
    syncUrlDisplay: document.getElementById('syncUrlDisplay'),
    copySyncUrlBtn: document.getElementById('copySyncUrlBtn'),
    roomCodeInput: document.getElementById('roomCodeInput'),
    switchRoomBtn: document.getElementById('switchRoomBtn'),
    connectedCount: document.getElementById('connectedCount'),
    devicesList: document.getElementById('devicesList'),
    toastContainer: document.getElementById('toastContainer'),
    mobileFabBtn: document.getElementById('mobileFabBtn'),
    installAppBtn: document.getElementById('installAppBtn'),
    mobileInstallBtn: document.getElementById('mobileInstallBtn'),
    lanUrlDisplay: document.getElementById('lanUrlDisplay'),
    copyLanUrlBtn: document.getElementById('copyLanUrlBtn'),
    syncModeBadge: document.getElementById('syncModeBadge')
  };

  // Temporary in-modal checklist array
  let modalChecklist = [];

  // --- Initialization ---
  function init() {
    registerServiceWorker();
    checkIncomingShareTarget();
    setupTheme();
    setupEventListeners();

    // Instant Offline-First: Render from local cache immediately
    const cached = localStorage.getItem(`novasync_cache_${state.currentRoom}`);
    if (cached) {
      try {
        state.items = JSON.parse(cached);
        renderItems();
      } catch (e) {
        console.warn('Cache parse error:', e);
      }
    }

    fetchNetworkInfo();
    loadItems();
    connectWebSocket();
    startReminderLoop();
    flushOfflineQueue();
  }

  // --- Service Worker & PWA ---
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Service Worker registration skipped:', err);
      });
    }
  }

  // Check if opened via Web Share Target redirect
  function checkIncomingShareTarget() {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('shared');
    const type = params.get('type') || 'item';

    if (shared === 'success') {
      showToast('success', 'Shared Content Saved!', `New ${type} automatically captured and synced across your devices.`);
      // Clean query string
      window.history.replaceState({}, document.title, window.location.pathname + (state.currentRoom !== 'MAIN' ? `?room=${state.currentRoom}` : ''));
    }
  }

  // --- Theme Management ---
  function setupTheme() {
    const saved = localStorage.getItem('novasync_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('novasync_theme', next);
    showToast('info', 'Theme Changed', `Switched to ${next} mode`);
  }

  // --- Audio Synthesizer Chime (Web Audio API) ---
  function playReminderChime() {
    if (state.soundMuted) return;
    try {
      if (!state.audioContext) {
        state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (state.audioContext.state === 'suspended') {
        state.audioContext.resume();
      }

      const ctx = state.audioContext;
      const now = ctx.currentTime;

      // Note 1: C5 (523.25 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.5);

      // Note 2: E5 (659.25 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.15);
      gain2.gain.setValueAtTime(0.28, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.7);

      // Note 3: G5 (783.99 Hz)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(783.99, now + 0.3);
      gain3.gain.setValueAtTime(0.3, now + 0.3);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start(now + 0.3);
      osc3.stop(now + 0.95);
    } catch (e) {
      console.warn('Audio chime playback issue:', e);
    }
  }

  // --- Network & QR Code Info ---
  async function fetchNetworkInfo() {
    try {
      const res = await fetch(`/api/network-info?room=${encodeURIComponent(state.currentRoom)}`);
      if (res.ok) {
        state.networkInfo = await res.json();
        updateSyncModalInfo();
      }
    } catch (err) {
      console.warn('Failed to fetch network info:', err);
    }
  }

  function updateSyncModalInfo() {
    if (!state.networkInfo) return;
    el.bannerRoomName.textContent = state.currentRoom;
    el.roomCodeInput.value = state.currentRoom;
    el.syncUrlDisplay.value = state.networkInfo.syncUrl;

    if (el.lanUrlDisplay && state.networkInfo.lanSyncUrl) {
      el.lanUrlDisplay.value = state.networkInfo.lanSyncUrl;
    }

    if (state.networkInfo.publicHttpsUrl) {
      if (el.syncModeBadge) {
        el.syncModeBadge.style.display = 'inline-flex';
        el.syncModeBadge.textContent = '🌍 Worldwide Cloud Sync Active';
      }
    }

    if (state.networkInfo.qrDataUrl) {
      el.syncQrImage.src = state.networkInfo.qrDataUrl;
      el.syncQrImage.style.display = 'block';
      el.qrLoading.style.display = 'none';
    }
  }

  // --- WebSocket Connection ---
  function connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      state.ws = new WebSocket(wsUrl);

      state.ws.onopen = () => {
        state.wsConnected = true;
        state.reconnectAttempts = 0;
        updateWsStatus(true);

        // Join room with device info
        state.ws.send(JSON.stringify({
          action: 'join_room',
          room: state.currentRoom,
          deviceInfo: state.deviceInfo
        }));
      };

      state.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          handleWebSocketMessage(msg);
        } catch (e) {
          console.error('Failed to parse WS message:', e);
        }
      };

      state.ws.onclose = () => {
        state.wsConnected = false;
        updateWsStatus(false);
        // Exponential backoff reconnect
        const timeout = Math.min(1000 * Math.pow(1.5, state.reconnectAttempts), 10000);
        state.reconnectAttempts++;
        setTimeout(connectWebSocket, timeout);
      };

      state.ws.onerror = () => {
        state.wsConnected = false;
        updateWsStatus(false);
      };
    } catch (e) {
      console.warn('WebSocket init error:', e);
    }
  }

  function updateWsStatus(connected, deviceCount = 1) {
    if (connected) {
      el.syncDot.className = 'sync-dot live';
      el.syncStatusText.textContent = `Synced (${deviceCount} online)`;
    } else {
      el.syncDot.className = 'sync-dot offline';
      el.syncStatusText.textContent = 'Offline (Reconnecting)';
    }
  }

  function handleWebSocketMessage(msg) {
    if (msg.action === 'presence_update') {
      el.connectedCount.textContent = msg.activeCount || 1;
      updateWsStatus(true, msg.activeCount || 1);
      renderDevicesList(msg.devices || []);
    } else if (msg.action === 'item_created') {
      const exists = state.items.some((i) => i.id === msg.item.id);
      if (!exists) {
        state.items.unshift(msg.item);
        renderItems();
        showToast('info', 'Synced from Device', `✨ "${msg.item.title.slice(0, 30)}..." added.`);
      }
    } else if (msg.action === 'item_updated') {
      const idx = state.items.findIndex((i) => i.id === msg.item.id);
      if (idx !== -1) {
        state.items[idx] = msg.item;
        renderItems();
      }
    } else if (msg.action === 'item_deleted') {
      state.items = state.items.filter((i) => i.id !== msg.id);
      saveToLocalCache();
      renderItems();
      showToast('info', 'Item Removed', 'Deleted on another device.');
    } else if (msg.action === 'tunnel_update') {
      if (state.networkInfo) {
        state.networkInfo.syncUrl = msg.publicHttpsUrl;
        state.networkInfo.publicHttpsUrl = msg.publicHttpsUrl;
        updateSyncModalInfo();
      }
      showToast('info', 'Worldwide Sync Ready', 'HTTPS tunnel connected! Ready for mobile install & sync.');
    }
  }

  function renderDevicesList(devices) {
    el.devicesList.innerHTML = '';
    if (!devices || devices.length === 0) {
      el.devicesList.innerHTML = `<span class="device-pill"><span class="device-dot"></span> This Device</span>`;
      return;
    }

    devices.forEach((dev) => {
      const isSelf = dev.id === state.deviceInfo.id;
      const pill = document.createElement('span');
      pill.className = 'device-pill';
      pill.innerHTML = `
        <span class="device-dot"></span>
        <span>${escapeHtml(dev.name)} ${isSelf ? '(This Device)' : ''}</span>
      `;
      el.devicesList.appendChild(pill);
    });
  }

  function saveToLocalCache() {
    try {
      localStorage.setItem(`novasync_cache_${state.currentRoom}`, JSON.stringify(state.items));
    } catch (e) {
      console.warn('Failed to cache items locally:', e);
    }
  }

  // --- REST API & Offline Queue ---
  async function loadItems() {
    try {
      const res = await fetch(`/api/items?room=${encodeURIComponent(state.currentRoom)}`);
      if (res.ok) {
        state.items = await res.json();
        saveToLocalCache();
        renderItems();
      }
    } catch (err) {
      console.warn('Network load failed, using local offline cache:', err);
      // Items are already loaded from cache in init()
    }
  }

  async function flushOfflineQueue() {
    const rawQueue = localStorage.getItem('novasync_offline_queue');
    if (!rawQueue) return;

    let queue = [];
    try { queue = JSON.parse(rawQueue); } catch(e) { return; }
    if (!queue.length) return;

    console.log(`Flushing ${queue.length} offline items to server...`);
    const remaining = [];

    for (const item of queue) {
      try {
        const res = await fetch('/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
        if (!res.ok) remaining.push(item);
      } catch (e) {
        remaining.push(item);
      }
    }

    if (remaining.length) {
      localStorage.setItem('novasync_offline_queue', JSON.stringify(remaining));
    } else {
      localStorage.removeItem('novasync_offline_queue');
      showToast('success', 'Sync Complete', 'All offline items uploaded.');
      loadItems();
    }
  }

  async function saveItem(itemData) {
    const isEdit = Boolean(itemData.id);
    const url = isEdit ? `/api/items/${itemData.id}` : '/api/items';
    const method = isEdit ? 'PUT' : 'POST';

    // If offline, save optimistically to local cache and offline queue
    if (!navigator.onLine) {
      const offlineItem = {
        ...itemData,
        id: itemData.id || 'offline_' + Date.now(),
        sync_room: state.currentRoom,
        created_at: Date.now(),
        updated_at: Date.now(),
        _offline_pending: true
      };

      state.items.unshift(offlineItem);
      saveToLocalCache();
      renderItems();
      closeItemModal();

      // Push to offline queue
      const q = JSON.parse(localStorage.getItem('novasync_offline_queue') || '[]');
      q.push(offlineItem);
      localStorage.setItem('novasync_offline_queue', JSON.stringify(q));

      showToast('warning', 'Saved Offline', 'Will sync automatically when back online.');
      return;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...itemData, sync_room: state.currentRoom })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Server error');
      }

      const saved = await res.json();

      if (isEdit) {
        const idx = state.items.findIndex((i) => i.id === saved.id);
        if (idx !== -1) state.items[idx] = saved;
        showToast('success', 'Updated', 'Changes saved & synced.');
      } else {
        if (!state.items.some((i) => i.id === saved.id)) {
          state.items.unshift(saved);
        }
        showToast('success', 'Created', `Saved and synced.`);
      }

      saveToLocalCache();
      renderItems();
      closeItemModal();
    } catch (err) {
      // Network failure: queue for later
      showToast('warning', 'Saved Offline', 'Connection issue. Saved locally and will sync.');
      itemData.id = itemData.id || 'offline_' + Date.now();
      itemData._offline_pending = true;
      state.items.unshift(itemData);
      saveToLocalCache();
      renderItems();
      closeItemModal();

      const q = JSON.parse(localStorage.getItem('novasync_offline_queue') || '[]');
      q.push(itemData);
      localStorage.setItem('novasync_offline_queue', JSON.stringify(q));
    }
  }

  async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
      if (res.ok) {
        state.items = state.items.filter((i) => i.id !== id);
        renderItems();
        showToast('info', 'Deleted', 'Item removed.');
      }
    } catch (err) {
      showToast('error', 'Delete Failed', err.message);
    }
  }

  async function toggleItemCompleted(id) {
    const item = state.items.find((i) => i.id === id);
    if (!item) return;

    const newCompleted = !item.is_completed;
    item.is_completed = newCompleted;
    renderItems();

    try {
      await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: newCompleted })
      });
    } catch (e) {
      console.warn('Completion toggle sync error:', e);
    }
  }

  async function togglePin(id) {
    const item = state.items.find((i) => i.id === id);
    if (!item) return;

    const newPinned = !item.is_pinned;
    item.is_pinned = newPinned;
    renderItems();

    try {
      await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_pinned: newPinned })
      });
    } catch (e) {
      console.warn('Pin sync error:', e);
    }
  }

  async function toggleChecklistRow(itemId, taskIndex) {
    const item = state.items.find((i) => i.id === itemId);
    if (!item || !Array.isArray(item.checklist) || !item.checklist[taskIndex]) return;

    item.checklist[taskIndex].done = !item.checklist[taskIndex].done;
    renderItems();

    try {
      await fetch(`/api/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checklist: item.checklist })
      });
    } catch (e) {
      console.warn('Checklist sync error:', e);
    }
  }

  async function snoozeReminder(id, minutes = 15) {
    const item = state.items.find((i) => i.id === id);
    if (!item) return;

    const newDueDate = new Date(Date.now() + minutes * 60000).toISOString();
    item.due_date = newDueDate;
    item.is_completed = false;
    state.triggeredReminderIds.delete(id);
    renderItems();
    el.urgentAlertContainer.style.display = 'none';

    showToast('info', 'Reminder Snoozed', `Snoozed for ${minutes} minutes.`);

    try {
      await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ due_date: newDueDate, is_completed: false })
      });
    } catch (e) {
      console.warn('Snooze sync error:', e);
    }
  }

  // --- Reminder Daemon Loop ---
  function startReminderLoop() {
    setInterval(() => {
      checkDueReminders();
    }, 10000);
    // Initial check
    setTimeout(checkDueReminders, 1500);
  }

  function checkDueReminders() {
    const now = Date.now();
    let urgentReminder = null;

    for (const item of state.items) {
      if (item.type !== 'reminder' || item.is_completed || !item.due_date) continue;

      const due = new Date(item.due_date).getTime();
      const diff = due - now;

      // Trigger reminder if due within 0-60 seconds or overdue
      if (diff <= 60000) {
        if (!state.triggeredReminderIds.has(item.id)) {
          state.triggeredReminderIds.add(item.id);
          triggerReminderAlert(item);
        }
      }

      // Track upcoming urgent reminder within next 30 minutes
      if (diff > -3600000 && diff <= 1800000) {
        urgentReminder = item;
      }
    }

    // Render Urgent Banner
    if (urgentReminder) {
      const diffMins = Math.round((new Date(urgentReminder.due_date).getTime() - now) / 60000);
      el.urgentAlertContainer.style.display = 'flex';
      el.urgentTitle.textContent = urgentReminder.title;
      el.urgentTime.textContent = diffMins <= 0 ? `Overdue by ${Math.abs(diffMins)}m` : `Due in ${diffMins} minutes`;
      el.urgentSnoozeBtn.onclick = () => snoozeReminder(urgentReminder.id, 15);
      el.urgentDoneBtn.onclick = () => toggleItemCompleted(urgentReminder.id);
    } else {
      el.urgentAlertContainer.style.display = 'none';
    }
  }

  function triggerReminderAlert(item) {
    // Play harmonic chime
    playReminderChime();

    // Browser Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`⏰ Reminder: ${item.title}`, {
          body: item.content || 'Your scheduled reminder is due now.',
          icon: '/icons/icon.svg',
          badge: '/icons/icon.svg'
        });
      } catch (e) {
        console.warn('Native notification failed:', e);
      }
    }

    // On-screen notification
    showToast('warning', `⏰ Reminder Due: ${item.title}`, item.content || 'Tap to snooze or mark as completed.');
  }

  // --- Filtering & Rendering ---
  function getFilteredItems() {
    let list = [...state.items];

    // Filter by Tab
    if (state.activeTab === 'note') {
      list = list.filter((i) => i.type === 'note');
    } else if (state.activeTab === 'reminder') {
      list = list.filter((i) => i.type === 'reminder');
    } else if (state.activeTab === 'instagram') {
      list = list.filter((i) => i.type === 'instagram');
    } else if (state.activeTab === 'link') {
      list = list.filter((i) => i.type === 'link');
    }

    // Filter by Tag
    if (state.activeTag !== 'ALL') {
      list = list.filter((i) => Array.isArray(i.tags) && i.tags.includes(state.activeTag));
    }

    // Search query filter
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      list = list.filter((i) => {
        const title = (i.title || '').toLowerCase();
        const content = (i.content || '').toLowerCase();
        const url = (i.url || '').toLowerCase();
        const tags = (i.tags || []).join(' ').toLowerCase();
        return title.includes(q) || content.includes(q) || url.includes(q) || tags.includes(q);
      });
    }

    // Sort order: Pinned always first, then by date
    list.sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) {
        return a.is_pinned ? -1 : 1;
      }
      return state.sortOrder === 'newest'
        ? b.updated_at - a.updated_at
        : a.updated_at - b.updated_at;
    });

    return list;
  }

  function renderItems() {
    updateCounts();
    renderTagsFilter();

    const filtered = getFilteredItems();
    el.itemsGrid.innerHTML = '';

    if (filtered.length === 0) {
      el.emptyState.style.display = 'block';
      el.itemsGrid.style.display = 'none';
      return;
    }

    el.emptyState.style.display = 'none';
    el.itemsGrid.style.display = 'grid';

    filtered.forEach((item) => {
      const card = createItemCardElement(item);
      el.itemsGrid.appendChild(card);
    });
  }

  function updateCounts() {
    el.countAll.textContent = state.items.length;
    el.countNotes.textContent = state.items.filter((i) => i.type === 'note').length;
    el.countReminders.textContent = state.items.filter((i) => i.type === 'reminder').length;
    el.countInstagram.textContent = state.items.filter((i) => i.type === 'instagram').length;
    el.countLinks.textContent = state.items.filter((i) => i.type === 'link').length;

    // Subheader text
    let title = 'Showing All Items';
    if (state.activeTab === 'note') title = 'Showing Notes';
    else if (state.activeTab === 'reminder') title = 'Showing Reminders';
    else if (state.activeTab === 'instagram') title = 'Showing Instagram Bookmarks';
    else if (state.activeTab === 'link') title = 'Showing Saved Web Links';

    if (state.activeTag !== 'ALL') title += ` • Tag: #${state.activeTag}`;
    if (state.searchQuery) title += ` • Search: "${state.searchQuery}"`;

    el.activeFilterTitle.textContent = title;
  }

  function renderTagsFilter() {
    const allTags = new Set();
    state.items.forEach((item) => {
      if (Array.isArray(item.tags)) {
        item.tags.forEach((t) => allTags.add(t));
      }
    });

    el.tagsFilterContainer.innerHTML = '<span class="tags-label">Tags:</span>';

    const allBtn = document.createElement('button');
    allBtn.className = `tag-pill ${state.activeTag === 'ALL' ? 'active' : ''}`;
    allBtn.textContent = 'All';
    allBtn.onclick = () => {
      state.activeTag = 'ALL';
      renderItems();
    };
    el.tagsFilterContainer.appendChild(allBtn);

    allTags.forEach((tag) => {
      const btn = document.createElement('button');
      btn.className = `tag-pill ${state.activeTag === tag ? 'active' : ''}`;
      btn.textContent = `#${tag}`;
      btn.onclick = () => {
        state.activeTag = tag;
        renderItems();
      };
      el.tagsFilterContainer.appendChild(btn);
    });
  }

  // --- Card Element Factory ---
  function createItemCardElement(item) {
    const card = document.createElement('article');
    card.className = `item-card color-${item.color || 'slate'} type-${item.type}`;
    card.dataset.id = item.id;

    // Badge Label
    let badgeHtml = '';
    if (item.type === 'note') {
      badgeHtml = `<span class="card-badge type-note">📝 Note</span>`;
    } else if (item.type === 'reminder') {
      badgeHtml = `<span class="card-badge type-reminder">⏰ Reminder</span>`;
    } else if (item.type === 'instagram') {
      badgeHtml = `<span class="card-badge type-instagram">📸 Instagram ${item.metadata?.igType === 'reel' ? 'Reel' : 'Post'}</span>`;
    } else {
      badgeHtml = `<span class="card-badge type-link">🌐 Link</span>`;
    }

    // Top Row: Badge + Actions (Pin, Edit, Delete)
    const topRow = document.createElement('div');
    topRow.className = 'card-top';
    topRow.innerHTML = `
      ${badgeHtml}
      <div class="card-top-actions">
        <button class="card-icon-btn ${item.is_pinned ? 'pinned' : ''}" title="${item.is_pinned ? 'Unpin' : 'Pin to top'}" data-action="pin">
          <svg viewBox="0 0 24 24" fill="${item.is_pinned ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M12 17v5M9 2h6l-1 7h4l-7 8-1-6H6l3-9z"></path>
          </svg>
        </button>
        <button class="card-icon-btn" title="Edit Item" data-action="edit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="card-icon-btn danger" title="Delete" data-action="delete">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `;
    card.appendChild(topRow);

    // Title
    const titleEl = document.createElement('h3');
    titleEl.className = 'card-title';
    titleEl.textContent = item.title;
    card.appendChild(titleEl);

    // Specialized Content by Type
    if (item.type === 'instagram') {
      const igBody = createInstagramBody(item);
      card.appendChild(igBody);
    } else if (item.type === 'link') {
      const linkBody = createLinkBody(item);
      card.appendChild(linkBody);
    } else if (item.type === 'reminder') {
      const remStrip = createReminderStatusStrip(item);
      card.appendChild(remStrip);
    }

    // Notes / Text Content
    if (item.content) {
      const contentEl = document.createElement('div');
      contentEl.className = 'card-content';
      contentEl.textContent = item.content;
      card.appendChild(contentEl);
    }

    // Interactive Checklist
    if (Array.isArray(item.checklist) && item.checklist.length > 0) {
      const checklistEl = createChecklistElement(item);
      card.appendChild(checklistEl);
    }

    // Tags
    if (Array.isArray(item.tags) && item.tags.length > 0) {
      const tagsEl = document.createElement('div');
      tagsEl.className = 'card-tags';
      item.tags.forEach((t) => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'card-tag';
        tagSpan.textContent = `#${t}`;
        tagSpan.onclick = () => {
          state.activeTag = t;
          renderItems();
        };
        tagsEl.appendChild(tagSpan);
      });
      card.appendChild(tagsEl);
    }

    // Footer: Relative time
    const footer = document.createElement('div');
    footer.className = 'card-footer';
    footer.innerHTML = `
      <span>Updated ${formatRelativeTime(item.updated_at)}</span>
      <div class="card-footer-actions">
        ${item.url ? `<button class="btn-card-action" data-action="copy-url">Copy Link</button>` : ''}
      </div>
    `;
    card.appendChild(footer);

    // Card Event Listeners
    card.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;

      if (action === 'delete') {
        deleteItem(item.id);
      } else if (action === 'edit') {
        openEditItemModal(item);
      } else if (action === 'pin') {
        togglePin(item.id);
      } else if (action === 'copy-url' && item.url) {
        navigator.clipboard.writeText(item.url).then(() => {
          showToast('success', 'Copied!', 'Link copied to clipboard.');
        });
      }
    });

    return card;
  }

  // Instagram Card Body
  function createInstagramBody(item) {
    const meta = item.metadata || {};
    const wrap = document.createElement('div');
    wrap.className = 'instagram-card-body';

    const thumbUrl = meta.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
    const cleanUrl = meta.cleanUrl || item.url;
    const isReel = meta.igType === 'reel';

    wrap.innerHTML = `
      <div class="ig-media-thumb">
        <img src="${escapeHtml(thumbUrl)}" alt="Instagram preview" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'">
        ${isReel ? `
          <div class="ig-play-overlay">
            <div class="ig-play-circle">
              <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
          </div>
        ` : ''}
      </div>
      <div class="ig-action-bar">
        <a href="${escapeHtml(cleanUrl)}" target="_blank" rel="noopener noreferrer" class="open-ig-btn">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          <span>Open in Instagram</span>
        </a>
        <button class="copy-url-btn" onclick="navigator.clipboard.writeText('${escapeHtml(cleanUrl)}'); alert('Copied Instagram Link!');">
          Copy Link
        </button>
      </div>
    `;
    return wrap;
  }

  // Website Link Card Body
  function createLinkBody(item) {
    const meta = item.metadata || {};
    const wrap = document.createElement('div');
    wrap.className = 'link-card-body';

    const thumbUrl = meta.image;
    const faviconUrl = meta.favicon || `https://www.google.com/s2/favicons?domain=${new URL(item.url || 'https://example.com').hostname}&sz=64`;
    const cleanUrl = meta.cleanUrl || item.url;

    wrap.innerHTML = `
      ${thumbUrl ? `
        <div class="link-thumb">
          <img src="${escapeHtml(thumbUrl)}" alt="Site thumbnail" loading="lazy" onerror="this.parentElement.style.display='none'">
        </div>
      ` : ''}
      <div class="link-info">
        <div class="link-domain">
          <img class="domain-favicon" src="${escapeHtml(faviconUrl)}" alt="Favicon" onerror="this.style.display='none'">
          <span>${escapeHtml(meta.siteName || new URL(cleanUrl).hostname)}</span>
        </div>
        ${meta.description ? `<p class="link-desc">${escapeHtml(meta.description)}</p>` : ''}
      </div>
      <div class="ig-action-bar">
        <a href="${escapeHtml(cleanUrl)}" target="_blank" rel="noopener noreferrer" class="pill-btn primary small">
          Visit Website ↗
        </a>
        <button class="copy-url-btn" onclick="navigator.clipboard.writeText('${escapeHtml(cleanUrl)}'); alert('Copied Website Link!');">
          Copy URL
        </button>
      </div>
    `;
    return wrap;
  }

  // Reminder Status Strip
  function createReminderStatusStrip(item) {
    const wrap = document.createElement('div');
    wrap.className = 'reminder-status-strip';

    const isDone = Boolean(item.is_completed);
    let dueText = 'No due date';
    let urgencyClass = 'upcoming';

    if (item.due_date) {
      const now = Date.now();
      const due = new Date(item.due_date).getTime();
      const diffMins = Math.round((due - now) / 60000);

      if (isDone) {
        dueText = 'Completed ✓';
        urgencyClass = 'completed';
      } else if (diffMins < 0) {
        dueText = `Overdue by ${formatMins(Math.abs(diffMins))}`;
        urgencyClass = 'urgent';
      } else if (diffMins <= 60) {
        dueText = `Due in ${diffMins} mins`;
        urgencyClass = 'urgent';
      } else if (diffMins <= 1440) {
        const timeStr = new Date(due).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        dueText = `Today at ${timeStr}`;
        urgencyClass = 'today';
      } else {
        const dateStr = new Date(due).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        dueText = dateStr;
        urgencyClass = 'upcoming';
      }
    }

    wrap.innerHTML = `
      <div class="due-countdown ${urgencyClass}">
        <span>${isDone ? '✅' : (urgencyClass === 'urgent' ? '🚨' : '⏰')}</span>
        <span>${escapeHtml(dueText)}</span>
      </div>
      <div class="reminder-quick-actions">
        ${!isDone ? `<button class="snooze-btn" data-snooze="15">+15m</button>` : ''}
        <button class="pill-btn small ${isDone ? 'secondary' : 'success'}" data-toggle-done>
          ${isDone ? 'Undo' : 'Done'}
        </button>
      </div>
    `;

    wrap.querySelector('[data-toggle-done]').onclick = (e) => {
      e.stopPropagation();
      toggleItemCompleted(item.id);
    };

    const snoozeBtn = wrap.querySelector('[data-snooze]');
    if (snoozeBtn) {
      snoozeBtn.onclick = (e) => {
        e.stopPropagation();
        snoozeReminder(item.id, 15);
      };
    }

    return wrap;
  }

  // Interactive Checklist
  function createChecklistElement(item) {
    const wrap = document.createElement('div');
    wrap.className = 'card-checklist';

    item.checklist.forEach((task, index) => {
      const row = document.createElement('label');
      row.className = `checklist-row ${task.done ? 'done' : ''}`;
      row.innerHTML = `
        <input type="checkbox" class="checklist-checkbox" ${task.done ? 'checked' : ''}>
        <span class="checklist-text">${escapeHtml(task.text)}</span>
      `;

      row.querySelector('input').onclick = (e) => {
        e.stopPropagation();
        toggleChecklistRow(item.id, index);
      };

      wrap.appendChild(row);
    });

    return wrap;
  }

  // --- Modal: Create & Edit Items ---
  function openCreateItemModal(defaultType = 'note') {
    state.editingId = null;
    el.modalTitle.textContent = 'Create New Item';
    el.formItemId.value = '';
    el.formItemType.value = defaultType;
    el.formTitle.value = '';
    el.formContent.value = '';
    el.formUrl.value = '';
    el.formTags.value = '';
    el.formIsPinned.checked = false;
    el.urlPreviewBox.style.display = 'none';

    // Default due date to 2 hours from now
    const nextDate = new Date(Date.now() + 2 * 3600000);
    nextDate.setMinutes(nextDate.getMinutes() - nextDate.getTimezoneOffset());
    el.formDueDate.value = nextDate.toISOString().slice(0, 16);
    el.formPriority.value = 'medium';
    el.formRecurrence.value = 'none';

    // Reset color to slate
    const defRadio = document.querySelector('input[name="colorAccent"][value="slate"]');
    if (defRadio) defRadio.checked = true;

    modalChecklist = [];
    renderModalChecklist();

    setModalType(defaultType);
    el.itemModalOverlay.style.display = 'flex';
    el.formTitle.focus();
  }

  function openEditItemModal(item) {
    state.editingId = item.id;
    el.modalTitle.textContent = 'Edit Item';
    el.formItemId.value = item.id;
    el.formItemType.value = item.type;
    el.formTitle.value = item.title || '';
    el.formContent.value = item.content || '';
    el.formUrl.value = item.url || '';
    el.formTags.value = (item.tags || []).join(', ');
    el.formIsPinned.checked = Boolean(item.is_pinned);

    if (item.due_date) {
      const d = new Date(item.due_date);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      el.formDueDate.value = d.toISOString().slice(0, 16);
    }

    el.formPriority.value = item.priority || 'medium';
    el.formRecurrence.value = item.reminder_recurrence || 'none';

    // Set color radio
    const colorRadio = document.querySelector(`input[name="colorAccent"][value="${item.color || 'slate'}"]`);
    if (colorRadio) colorRadio.checked = true;

    // Show preview if metadata exists
    if (item.metadata && (item.metadata.title || item.metadata.image)) {
      showModalPreview(item.metadata);
    } else {
      el.urlPreviewBox.style.display = 'none';
    }

    modalChecklist = Array.isArray(item.checklist) ? [...item.checklist] : [];
    renderModalChecklist();

    setModalType(item.type);
    el.itemModalOverlay.style.display = 'flex';
  }

  function closeItemModal() {
    el.itemModalOverlay.style.display = 'none';
  }

  function setModalType(type) {
    el.formItemType.value = type;

    // Update active tab buttons
    document.querySelectorAll('.modal-tab').forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.modType === type);
    });

    if (type === 'link' || type === 'instagram') {
      el.urlGroup.style.display = 'block';
      el.reminderGroup.style.display = 'none';
    } else if (type === 'reminder') {
      el.urlGroup.style.display = 'none';
      el.reminderGroup.style.display = 'block';
    } else {
      el.urlGroup.style.display = 'none';
      el.reminderGroup.style.display = 'none';
    }
  }

  function renderModalChecklist() {
    el.formChecklistContainer.innerHTML = '';
    modalChecklist.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'checklist-form-item';
      row.innerHTML = `
        <span>${escapeHtml(item.text)}</span>
        <button type="button" class="checklist-del-btn" data-index="${index}">✕</button>
      `;
      row.querySelector('.checklist-del-btn').onclick = () => {
        modalChecklist.splice(index, 1);
        renderModalChecklist();
      };
      el.formChecklistContainer.appendChild(row);
    });
  }

  function showModalPreview(meta) {
    el.prevSite.textContent = meta.siteName || 'Preview';
    el.prevTitle.textContent = meta.title || 'Untitled';
    el.prevDesc.textContent = meta.description || '';
    if (meta.image) {
      el.prevImg.src = meta.image;
      el.prevImg.style.display = 'block';
    } else {
      el.prevImg.style.display = 'none';
    }
    el.urlPreviewBox.style.display = 'flex';
  }

  async function fetchPreviewForUrl(url) {
    if (!url) return;
    el.fetchBtnSpinner.style.display = 'inline-block';
    try {
      const res = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const meta = await res.json();
        showModalPreview(meta);
        if (!el.formTitle.value.trim() && meta.title) {
          el.formTitle.value = meta.title;
        }
        if (/instagram\.com/i.test(url)) {
          el.formItemType.value = 'instagram';
        }
      }
    } catch (e) {
      console.warn('Metadata fetch error:', e);
    } finally {
      el.fetchBtnSpinner.style.display = 'none';
    }
  }

  // --- Modal: Cross-Device Sync ---
  function openSyncModal() {
    fetchNetworkInfo();
    el.syncModalOverlay.style.display = 'flex';
  }

  function closeSyncModal() {
    el.syncModalOverlay.style.display = 'none';
  }

  function switchRoom(newRoom) {
    const clean = (newRoom || '').trim().toUpperCase();
    if (!clean) return;

    state.currentRoom = clean;
    localStorage.setItem('novasync_room', clean);
    window.history.replaceState({}, document.title, `?room=${clean}`);

    // Update websocket room
    if (state.ws && state.ws.readyState === WebSocket.OPEN) {
      state.ws.send(JSON.stringify({
        action: 'join_room',
        room: clean,
        deviceInfo: state.deviceInfo
      }));
    }

    fetchNetworkInfo();
    loadItems();
    closeSyncModal();
    showToast('success', 'Sync Room Switched', `Now in room "${clean}". All devices in this room share notes & links.`);
  }

  // --- Toast System ---
  function showToast(type, title, desc, duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⏰';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <div class="toast-content">
        <h5 class="toast-title">${escapeHtml(title)}</h5>
        ${desc ? `<p class="toast-desc">${escapeHtml(desc)}</p>` : ''}
      </div>
    `;

    el.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }

  // --- Quick Add & Smart Clipboard Input ---
  function extractFirstUrl(text) {
    const match = text.match(/(https?:\/\/[^\s]+)/i);
    return match ? match[0] : null;
  }

  async function handleQuickSubmit() {
    const raw = el.quickInput.value.trim();
    if (!raw) return;

    const detectedUrl = extractFirstUrl(raw);
    const selectedChip = document.querySelector('.type-chip.active');
    let type = selectedChip ? selectedChip.dataset.type : 'note';

    if (detectedUrl) {
      if (/instagram\.com/i.test(detectedUrl)) {
        type = 'instagram';
      } else {
        type = 'link';
      }
    }

    const itemData = {
      type,
      title: raw.slice(0, 100),
      content: raw,
      url: detectedUrl || '',
      color: type === 'instagram' ? 'rose' : (type === 'link' ? 'cyan' : 'slate')
    };

    if (type === 'reminder') {
      itemData.due_date = new Date(Date.now() + 2 * 3600000).toISOString();
    }

    el.quickInput.value = '';
    el.quickLinkDetected.style.display = 'none';

    await saveItem(itemData);
  }

  async function handleClipboardPaste() {
    try {
      const text = await navigator.clipboard.readText();
      const url = extractFirstUrl(text);

      if (url) {
        openCreateItemModal(/instagram\.com/i.test(url) ? 'instagram' : 'link');
        el.formUrl.value = url;
        fetchPreviewForUrl(url);
        showToast('info', 'Link Pasted from Clipboard', 'Fetching rich card preview...');
      } else if (text) {
        openCreateItemModal('note');
        el.formContent.value = text;
        el.formTitle.value = text.slice(0, 40) + '...';
      } else {
        openCreateItemModal('note');
      }
    } catch (err) {
      // If clipboard permission prompt refused, open standard modal
      openCreateItemModal('link');
    }
  }

  // --- Notification Permission ---
  function requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          showToast('success', 'Notifications Enabled', 'You will receive reminders even when in another tab.');
          el.bellBadge.style.display = 'none';
        } else {
          showToast('warning', 'Notifications Blocked', 'Allow notifications in browser settings for audible reminder alerts.');
        }
      });
    }
  }

  // --- Setup Event Listeners ---
  function setupEventListeners() {
    // Header Actions
    el.syncModalBtn.onclick = openSyncModal;
    el.bannerQrBtn.onclick = openSyncModal;
    el.bannerCopyLinkBtn.onclick = () => {
      if (state.networkInfo && state.networkInfo.syncUrl) {
        navigator.clipboard.writeText(state.networkInfo.syncUrl);
        showToast('success', 'Copied!', 'Device sync link copied.');
      } else {
        openSyncModal();
      }
    };
    el.quickPasteBtn.onclick = handleClipboardPaste;
    el.newItemBtn.onclick = () => openCreateItemModal('note');
    el.emptyCreateBtn.onclick = () => openCreateItemModal('note');
    if (el.mobileFabBtn) el.mobileFabBtn.onclick = () => openCreateItemModal('note');
    el.themeToggleBtn.onclick = toggleTheme;
    el.notifToggleBtn.onclick = requestNotificationPermission;

    // Search Bar
    el.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      el.clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
      renderItems();
    });

    el.clearSearchBtn.onclick = () => {
      el.searchInput.value = '';
      state.searchQuery = '';
      el.clearSearchBtn.style.display = 'none';
      renderItems();
      el.searchInput.focus();
    };

    // Keyboard Shortcuts (Ctrl+K or Cmd+K to search, Esc to close modals)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        el.searchInput.focus();
      } else if (e.key === 'Escape') {
        closeItemModal();
        closeSyncModal();
      }
    });

    // Quick Add Bar
    document.querySelectorAll('.quick-type-selector .type-chip').forEach((chip) => {
      chip.onclick = () => {
        document.querySelectorAll('.quick-type-selector .type-chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        el.quickInput.focus();
      };
    });

    el.quickInput.addEventListener('input', (e) => {
      const url = extractFirstUrl(e.target.value);
      if (url) {
        el.detectedUrlText.textContent = url;
        el.quickLinkDetected.style.display = 'flex';
      } else {
        el.quickLinkDetected.style.display = 'none';
      }
    });

    el.quickInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleQuickSubmit();
      }
    });

    el.quickSubmitBtn.onclick = handleQuickSubmit;

    el.quickSaveDetectedBtn.onclick = () => {
      const url = extractFirstUrl(el.quickInput.value);
      if (url) {
        openCreateItemModal(/instagram\.com/i.test(url) ? 'instagram' : 'link');
        el.formUrl.value = url;
        fetchPreviewForUrl(url);
        el.quickInput.value = '';
        el.quickLinkDetected.style.display = 'none';
      }
    };

    // Tabs List
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.onclick = () => {
        document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeTab = btn.dataset.tab;
        renderItems();
      };
    });

    // Mobile Bottom Nav
    document.querySelectorAll('.mobile-nav-btn').forEach((btn) => {
      btn.onclick = () => {
        document.querySelectorAll('.mobile-nav-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeTab = btn.dataset.tab;
        // Sync desktop tabs
        document.querySelectorAll('.tab-btn').forEach((b) => {
          b.classList.toggle('active', b.dataset.tab === btn.dataset.tab);
        });
        renderItems();
      };
    });

    // Sort Toggle
    el.sortToggleBtn.onclick = () => {
      state.sortOrder = state.sortOrder === 'newest' ? 'oldest' : 'newest';
      el.sortLabel.textContent = state.sortOrder === 'newest' ? 'Newest First' : 'Oldest First';
      renderItems();
    };

    // Modal Events
    el.modalCloseBtn.onclick = closeItemModal;
    el.modalCancelBtn.onclick = closeItemModal;
    el.itemModalOverlay.onclick = (e) => {
      if (e.target === el.itemModalOverlay) closeItemModal();
    };

    document.querySelectorAll('.modal-tab').forEach((tab) => {
      tab.onclick = () => setModalType(tab.dataset.modType);
    });

    el.fetchMetaBtn.onclick = () => fetchPreviewForUrl(el.formUrl.value);

    // Checklist in modal
    el.addChecklistBtn.onclick = () => {
      const text = el.newChecklistInput.value.trim();
      if (text) {
        modalChecklist.push({ text, done: false });
        el.newChecklistInput.value = '';
        renderModalChecklist();
        el.newChecklistInput.focus();
      }
    };

    el.newChecklistInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        el.addChecklistBtn.click();
      }
    });

    // Modal Form Submit
    el.itemForm.onsubmit = (e) => {
      e.preventDefault();

      const type = el.formItemType.value;
      const title = el.formTitle.value.trim();
      const content = el.formContent.value.trim();
      const url = el.formUrl.value.trim();
      const tags = el.formTags.value
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const color = document.querySelector('input[name="colorAccent"]:checked')?.value || 'slate';
      const is_pinned = el.formIsPinned.checked;

      const itemData = {
        id: el.formItemId.value || undefined,
        type,
        title,
        content,
        url,
        tags,
        color,
        is_pinned,
        checklist: modalChecklist
      };

      if (type === 'reminder') {
        itemData.due_date = el.formDueDate.value ? new Date(el.formDueDate.value).toISOString() : null;
        itemData.priority = el.formPriority.value;
        itemData.reminder_recurrence = el.formRecurrence.value;
      }

      saveItem(itemData);
    };

    // Sync Modal Events
    el.syncModalCloseBtn.onclick = closeSyncModal;
    el.syncModalOverlay.onclick = (e) => {
      if (e.target === el.syncModalOverlay) closeSyncModal();
    };

    el.copySyncUrlBtn.onclick = () => {
      el.syncUrlDisplay.select();
      navigator.clipboard.writeText(el.syncUrlDisplay.value);
      showToast('success', 'Link Copied!', 'Send to another device to sync notes.');
    };

    // PWA Mobile Installation Trigger
    let deferredPrompt = null;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (el.installAppBtn) el.installAppBtn.style.display = 'inline-flex';
      if (el.mobileInstallBtn) el.mobileInstallBtn.style.display = 'flex';
    });

    const triggerInstall = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            showToast('success', 'Installing App...', 'NovaSync added to your device Home Screen!');
          }
          deferredPrompt = null;
        });
      } else {
        alert('To install NovaSync on Mobile:\n\n📱 Android: Tap the 3 dots (⋮) in Chrome → Tap "Install app" or "Add to Home screen".\n\n🍎 iOS / iPhone: Tap the Share icon (square with arrow) at the bottom of Safari → Tap "Add to Home Screen".\n\nOnce added, you can share directly from Instagram to NovaSync!');
      }
    };

    if (el.installAppBtn) el.installAppBtn.onclick = triggerInstall;
    if (el.mobileInstallBtn) el.mobileInstallBtn.onclick = triggerInstall;

    // Online & Reconnection Listener (Flush offline queue)
    window.addEventListener('online', () => {
      showToast('info', 'Online', 'Connection restored. Syncing items...');
      flushOfflineQueue();
      if (!state.wsConnected) connectWebSocket();
    });

    window.addEventListener('offline', () => {
      showToast('warning', 'Offline Mode', 'Working offline. Notes & links will save locally.');
      updateWsStatus(false);
    });

    // Copy LAN URL button
    if (el.copyLanUrlBtn) {
      el.copyLanUrlBtn.onclick = () => {
        if (el.lanUrlDisplay && el.lanUrlDisplay.value) {
          el.lanUrlDisplay.select();
          navigator.clipboard.writeText(el.lanUrlDisplay.value);
          showToast('success', 'Copied LAN URL', 'Local Wi-Fi link copied.');
        }
      };
    }

    el.switchRoomBtn.onclick = () => switchRoom(el.roomCodeInput.value);
    el.roomCodeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') switchRoom(el.roomCodeInput.value);
    });
  }

  // --- Utility Functions ---
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatRelativeTime(timestamp) {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  function formatMins(mins) {
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    const rem = mins % 60;
    return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`;
  }

  // Boot the app
  document.addEventListener('DOMContentLoaded', init);
})();
