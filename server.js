const express = require('express');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { spawn } = require('child_process');
const { DatabaseSync } = require('node:sqlite');
const { WebSocketServer, WebSocket } = require('ws');
const cheerio = require('cheerio');
const QRCode = require('qrcode');

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

let publicHttpsUrl = null;
let tunnelProcess = null;

// Ensure data folder exists
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize SQLite database
const dbPath = path.join(DATA_DIR, 'novasync.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode for high concurrency
db.exec('PRAGMA journal_mode = WAL;');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    sync_room TEXT NOT NULL,
    type TEXT NOT NULL, /* note, reminder, link, instagram */
    title TEXT NOT NULL,
    content TEXT DEFAULT '',
    url TEXT DEFAULT '',
    metadata TEXT DEFAULT '{}',
    tags TEXT DEFAULT '[]',
    color TEXT DEFAULT 'slate',
    is_pinned INTEGER DEFAULT 0,
    is_completed INTEGER DEFAULT 0,
    due_date TEXT DEFAULT NULL,
    reminder_recurrence TEXT DEFAULT 'none',
    priority TEXT DEFAULT 'medium',
    checklist TEXT DEFAULT '[]',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_items_room ON items(sync_room);
  CREATE INDEX IF NOT EXISTS idx_items_type ON items(type);
  CREATE INDEX IF NOT EXISTS idx_items_updated ON items(updated_at DESC);
`);

// Universal CORS Middleware for Hugging Face and remote clients
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve production React build from dist if available, else public
const staticDir = fs.existsSync(path.join(__dirname, 'dist'))
  ? path.join(__dirname, 'dist')
  : path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Network helper: Get primary LAN IPv4
function getLocalIpAddress() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

// WebSocket Rooms & Presence
const rooms = new Map(); // roomCode -> Set of ws clients

function getRoomClients(roomCode) {
  if (!rooms.has(roomCode)) {
    rooms.set(roomCode, new Set());
  }
  return rooms.get(roomCode);
}

function broadcastToRoom(roomCode, message, excludeWs = null) {
  const clients = rooms.get(roomCode);
  if (!clients) return;
  const payload = typeof message === 'string' ? message : JSON.stringify(message);
  for (const client of clients) {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

function broadcastPresence(roomCode) {
  const clients = rooms.get(roomCode);
  if (!clients) return;
  const devices = [];
  for (const client of clients) {
    if (client.deviceInfo) {
      devices.push(client.deviceInfo);
    }
  }
  broadcastToRoom(roomCode, {
    action: 'presence_update',
    room: roomCode,
    activeCount: clients.size,
    devices
  });
}

wss.on('connection', (ws, req) => {
  ws.roomCode = 'main';
  ws.deviceInfo = {
    id: 'dev_' + Math.random().toString(36).substring(2, 9),
    name: 'Web Browser',
    platform: 'Desktop'
  };

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());

      if (msg.action === 'join_room') {
        // Leave previous room if any
        if (ws.roomCode && rooms.has(ws.roomCode)) {
          rooms.get(ws.roomCode).delete(ws);
          broadcastPresence(ws.roomCode);
        }

        ws.roomCode = (msg.room || 'main').trim().toUpperCase();
        if (msg.deviceInfo) {
          ws.deviceInfo = { ...ws.deviceInfo, ...msg.deviceInfo };
        }

        const roomSet = getRoomClients(ws.roomCode);
        roomSet.add(ws);

        ws.send(JSON.stringify({
          action: 'joined_room',
          room: ws.roomCode,
          activeCount: roomSet.size
        }));

        broadcastPresence(ws.roomCode);
      } else if (msg.action === 'ping') {
        ws.send(JSON.stringify({ action: 'pong' }));
      }
    } catch (e) {
      console.error('WS parse error:', e.message);
    }
  });

  ws.on('close', () => {
    if (ws.roomCode && rooms.has(ws.roomCode)) {
      rooms.get(ws.roomCode).delete(ws);
      broadcastPresence(ws.roomCode);
      if (rooms.get(ws.roomCode).size === 0) {
        rooms.delete(ws.roomCode);
      }
    }
  });
});

// Helper: Extract URL from arbitrary text (e.g. from mobile share sheet)
function extractUrl(text) {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
}

// Helper: Inspect & extract metadata from URL
async function fetchUrlMetadata(rawUrl) {
  let targetUrl = rawUrl.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = 'https://' + targetUrl;
  }

  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch (err) {
    return {
      title: rawUrl,
      description: 'Invalid URL',
      image: '',
      siteName: '',
      favicon: '',
      isInstagram: false
    };
  }

  const host = parsed.hostname.toLowerCase();
  const isInstagram = host.includes('instagram.com');

  // Clean tracking params
  const cleanUrl = new URL(targetUrl);
  cleanUrl.searchParams.delete('igsh');
  cleanUrl.searchParams.delete('utm_source');
  cleanUrl.searchParams.delete('utm_medium');
  cleanUrl.searchParams.delete('utm_campaign');
  cleanUrl.searchParams.delete('utm_content');
  cleanUrl.searchParams.delete('utm_term');

  // Instagram special handling
  if (isInstagram) {
    let igType = 'post';
    let shortcode = '';
    const pathname = cleanUrl.pathname;

    const reelMatch = pathname.match(/\/(?:reels|reel)\/([a-zA-Z0-9_-]+)/);
    const postMatch = pathname.match(/\/p\/([a-zA-Z0-9_-]+)/);
    const tvMatch = pathname.match(/\/tv\/([a-zA-Z0-9_-]+)/);
    const storyMatch = pathname.match(/\/stories\/([a-zA-Z0-9_.]+)\/([0-9]+)/);

    if (reelMatch) {
      igType = 'reel';
      shortcode = reelMatch[1];
    } else if (postMatch) {
      igType = 'post';
      shortcode = postMatch[1];
    } else if (tvMatch) {
      igType = 'video';
      shortcode = tvMatch[1];
    } else if (storyMatch) {
      igType = 'story';
      shortcode = storyMatch[2];
    }

    const embedUrl = shortcode ? `https://www.instagram.com/p/${shortcode}/embed` : '';

    return {
      title: igType === 'reel' ? `Instagram Reel (${shortcode || 'Video'})` : `Instagram Post (${shortcode || 'Photo'})`,
      description: `Saved from Instagram • View post or reel`,
      image: 'https://www.instagram.com/static/images/ico/favicon-192.png/68d99ba29cc8.png',
      siteName: 'Instagram',
      favicon: 'https://www.instagram.com/favicon.ico',
      isInstagram: true,
      igType,
      shortcode,
      embedUrl,
      cleanUrl: cleanUrl.toString()
    };
  }

  // Generic website OpenGraph extraction
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    const resp = await fetch(cleanUrl.toString(), {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });
    clearTimeout(timeout);

    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }

    const html = await resp.text();
    const $ = cheerio.load(html);

    const title = $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text().trim() ||
      parsed.hostname;

    const description = $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      '';

    let image = $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      '';

    if (image && !image.startsWith('http')) {
      try {
        image = new URL(image, cleanUrl.toString()).toString();
      } catch (e) {
        image = '';
      }
    }

    const siteName = $('meta[property="og:site_name"]').attr('content') ||
      parsed.hostname.replace(/^www\./, '');

    let favicon = $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      $('link[rel="apple-touch-icon"]').attr('href') ||
      '';

    if (favicon && !favicon.startsWith('http')) {
      try {
        favicon = new URL(favicon, cleanUrl.toString()).toString();
      } catch (e) {
        favicon = '';
      }
    }

    if (!favicon) {
      favicon = `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=128`;
    }

    return {
      title: title.slice(0, 150),
      description: description.slice(0, 300),
      image,
      siteName,
      favicon,
      isInstagram: false,
      cleanUrl: cleanUrl.toString()
    };
  } catch (err) {
    // Graceful fallback on network/timeout errors
    return {
      title: parsed.hostname,
      description: 'Saved link: ' + cleanUrl.toString(),
      image: '',
      siteName: parsed.hostname,
      favicon: `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=128`,
      isInstagram: false,
      cleanUrl: cleanUrl.toString()
    };
  }
}

// REST API Endpoints

// 0. Lightweight Health & Latency Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.round(process.uptime()),
    timestamp: Date.now(),
    roomCount: rooms.size,
    publicHttpsUrl: publicHttpsUrl || null
  });
});

// 1. Fetch metadata for URL preview
app.get('/api/metadata', async (req, res) => {
  const rawUrl = req.query.url;
  if (!rawUrl) {
    return res.status(400).json({ error: 'URL query parameter required' });
  }
  const meta = await fetchUrlMetadata(rawUrl);
  res.json(meta);
});

// 2. Network & Sync Pairing Info
app.get('/api/network-info', async (req, res) => {
  const room = (req.query.room || 'MAIN').toUpperCase();
  const localIp = getLocalIpAddress();
  const port = PORT;
  const lanSyncUrl = `http://${localIp}:${port}/?room=${encodeURIComponent(room)}`;
  // Prioritize public HTTPS URL for QR code and mobile sync if available
  const activeSyncUrl = publicHttpsUrl ? `${publicHttpsUrl}/?room=${encodeURIComponent(room)}` : lanSyncUrl;

  let qrDataUrl = '';
  try {
    qrDataUrl = await QRCode.toDataURL(activeSyncUrl, {
      margin: 2,
      width: 280,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
  } catch (e) {
    console.error('QR code generation error:', e);
  }

  res.json({
    localIp,
    port,
    syncUrl: activeSyncUrl,
    publicHttpsUrl: publicHttpsUrl ? `${publicHttpsUrl}/?room=${encodeURIComponent(room)}` : null,
    lanSyncUrl,
    room,
    qrDataUrl
  });
});

// 3. Get Items for a Room
app.get('/api/items', (req, res) => {
  const room = (req.query.room || 'MAIN').toUpperCase();
  try {
    const stmt = db.prepare(`
      SELECT * FROM items 
      WHERE sync_room = ? 
      ORDER BY is_pinned DESC, updated_at DESC
    `);
    const rows = stmt.all(room);

    // Parse JSON fields
    const items = rows.map(r => ({
      ...r,
      metadata: JSON.parse(r.metadata || '{}'),
      tags: JSON.parse(r.tags || '[]'),
      checklist: JSON.parse(r.checklist || '[]'),
      is_pinned: Boolean(r.is_pinned),
      is_completed: Boolean(r.is_completed)
    }));

    res.json(items);
  } catch (err) {
    console.error('Failed to get items:', err);
    res.status(500).json({ error: 'Failed to query items' });
  }
});

// 4. Create an Item
app.post('/api/items', async (req, res) => {
  try {
    const body = req.body;
    const room = (body.sync_room || 'MAIN').toUpperCase();
    const id = body.id || 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const now = Date.now();

    let type = body.type || 'note';
    let url = (body.url || '').trim();
    let title = (body.title || '').trim();
    let content = body.content || '';
    let metadata = body.metadata || {};

    // Auto-detect URL from title or content if link type or url empty
    if (!url) {
      const extracted = extractUrl(title) || extractUrl(content);
      if (extracted) {
        url = extracted;
      }
    }

    // Auto-detect Instagram or Web link
    if (url) {
      if (/instagram\.com/i.test(url)) {
        type = 'instagram';
      } else if (type === 'note') {
        type = 'link';
      }

      // If metadata not already provided, fetch it
      if (!metadata || Object.keys(metadata).length === 0) {
        metadata = await fetchUrlMetadata(url);
        if (!title || title === url) {
          title = metadata.title || url;
        }
      }
    }

    if (!title) {
      title = type === 'instagram' ? 'Instagram Reel/Post' : (type === 'reminder' ? 'Reminder' : 'Untitled Note');
    }

    const tags = Array.isArray(body.tags) ? body.tags : [];
    // Auto-tag instagram links if not already present
    if (type === 'instagram' && !tags.includes('Instagram')) {
      tags.push('Instagram');
    } else if (type === 'link' && !tags.includes('Bookmark')) {
      tags.push('Bookmark');
    }

    const checklist = Array.isArray(body.checklist) ? body.checklist : [];

    const stmt = db.prepare(`
      INSERT INTO items (
        id, sync_room, type, title, content, url, metadata, tags, color,
        is_pinned, is_completed, due_date, reminder_recurrence, priority, checklist,
        created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);

    stmt.run(
      id,
      room,
      type,
      title,
      content,
      url,
      JSON.stringify(metadata),
      JSON.stringify(tags),
      body.color || 'slate',
      body.is_pinned ? 1 : 0,
      body.is_completed ? 1 : 0,
      body.due_date || null,
      body.reminder_recurrence || 'none',
      body.priority || 'medium',
      JSON.stringify(checklist),
      now,
      now
    );

    const savedItem = {
      id,
      sync_room: room,
      type,
      title,
      content,
      url,
      metadata,
      tags,
      color: body.color || 'slate',
      is_pinned: Boolean(body.is_pinned),
      is_completed: Boolean(body.is_completed),
      due_date: body.due_date || null,
      reminder_recurrence: body.reminder_recurrence || 'none',
      priority: body.priority || 'medium',
      checklist,
      created_at: now,
      updated_at: now
    };

    // Real-time broadcast to all devices in the room
    broadcastToRoom(room, {
      action: 'item_created',
      item: savedItem
    });

    res.status(201).json(savedItem);
  } catch (err) {
    console.error('Failed to create item:', err);
    res.status(500).json({ error: err.message });
  }
});

// 5. Update an Item
app.put('/api/items/:id', (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const now = Date.now();

    // Check existing
    const existingStmt = db.prepare('SELECT * FROM items WHERE id = ?');
    const existing = existingStmt.get(id);

    if (!existing) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const room = existing.sync_room;
    const title = body.title !== undefined ? body.title : existing.title;
    const content = body.content !== undefined ? body.content : existing.content;
    const url = body.url !== undefined ? body.url : existing.url;
    const color = body.color !== undefined ? body.color : existing.color;
    const is_pinned = body.is_pinned !== undefined ? (body.is_pinned ? 1 : 0) : existing.is_pinned;
    const is_completed = body.is_completed !== undefined ? (body.is_completed ? 1 : 0) : existing.is_completed;
    const due_date = body.due_date !== undefined ? body.due_date : existing.due_date;
    const reminder_recurrence = body.reminder_recurrence !== undefined ? body.reminder_recurrence : existing.reminder_recurrence;
    const priority = body.priority !== undefined ? body.priority : existing.priority;
    const tags = body.tags !== undefined ? JSON.stringify(body.tags) : existing.tags;
    const checklist = body.checklist !== undefined ? JSON.stringify(body.checklist) : existing.checklist;
    const metadata = body.metadata !== undefined ? JSON.stringify(body.metadata) : existing.metadata;

    const updateStmt = db.prepare(`
      UPDATE items SET
        title = ?,
        content = ?,
        url = ?,
        metadata = ?,
        tags = ?,
        color = ?,
        is_pinned = ?,
        is_completed = ?,
        due_date = ?,
        reminder_recurrence = ?,
        priority = ?,
        checklist = ?,
        updated_at = ?
      WHERE id = ?
    `);

    updateStmt.run(
      title,
      content,
      url,
      metadata,
      tags,
      color,
      is_pinned,
      is_completed,
      due_date,
      reminder_recurrence,
      priority,
      checklist,
      now,
      id
    );

    const updatedItem = {
      id,
      sync_room: room,
      type: existing.type,
      title,
      content,
      url,
      metadata: JSON.parse(metadata || '{}'),
      tags: JSON.parse(tags || '[]'),
      color,
      is_pinned: Boolean(is_pinned),
      is_completed: Boolean(is_completed),
      due_date,
      reminder_recurrence,
      priority,
      checklist: JSON.parse(checklist || '[]'),
      created_at: existing.created_at,
      updated_at: now
    };

    // Real-time broadcast
    broadcastToRoom(room, {
      action: 'item_updated',
      item: updatedItem
    });

    res.json(updatedItem);
  } catch (err) {
    console.error('Failed to update item:', err);
    res.status(500).json({ error: err.message });
  }
});

// 6. Delete an Item
app.delete('/api/items/:id', (req, res) => {
  try {
    const id = req.params.id;
    const checkStmt = db.prepare('SELECT sync_room FROM items WHERE id = ?');
    const existing = checkStmt.get(id);

    if (!existing) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const room = existing.sync_room;
    const delStmt = db.prepare('DELETE FROM items WHERE id = ?');
    delStmt.run(id);

    // Real-time broadcast
    broadcastToRoom(room, {
      action: 'item_deleted',
      id,
      room
    });

    res.json({ success: true, id });
  } catch (err) {
    console.error('Failed to delete item:', err);
    res.status(500).json({ error: err.message });
  }
});

// 7. Web Share Target Handler (GET & POST)
// When user uses mobile native "Share" from Instagram or browser, it opens this endpoint!
async function handleIncomingShare(req, res) {
  try {
    const query = req.query || {};
    const body = req.body || {};
    const room = (query.room || body.room || 'MAIN').toUpperCase();
    const rawUrl = (query.url || body.url || '').trim();
    const rawTitle = (query.title || body.title || '').trim();
    const rawText = (query.text || body.text || '').trim();

    // Instagram or browser share might put link in text or title
    const fullText = `${rawUrl} ${rawText} ${rawTitle}`.trim();
    const extractedUrl = extractUrl(fullText) || rawUrl;

    if (!extractedUrl && !rawText && !rawTitle) {
      return res.redirect('/?shared=empty');
    }

    const id = 'share_' + Date.now();
    let type = 'link';
    let title = rawTitle || 'Shared Content';
    let content = rawText || '';
    let metadata = {};
    const tags = ['Shared'];

    if (extractedUrl) {
      if (/instagram\.com/i.test(extractedUrl)) {
        type = 'instagram';
        tags.push('Instagram');
      } else {
        tags.push('Bookmark');
      }
      metadata = await fetchUrlMetadata(extractedUrl);
      if (!rawTitle || rawTitle === extractedUrl) {
        title = metadata.title || extractedUrl;
      }
    } else {
      type = 'note';
    }

    const now = Date.now();
    const stmt = db.prepare(`
      INSERT INTO items (
        id, sync_room, type, title, content, url, metadata, tags, color,
        is_pinned, is_completed, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      room,
      type,
      title,
      content,
      extractedUrl || '',
      JSON.stringify(metadata),
      JSON.stringify(tags),
      type === 'instagram' ? 'rose' : 'cyan',
      0,
      0,
      now,
      now
    );

    const savedItem = {
      id,
      sync_room: room,
      type,
      title,
      content,
      url: extractedUrl || '',
      metadata,
      tags,
      color: type === 'instagram' ? 'rose' : 'cyan',
      is_pinned: false,
      is_completed: false,
      created_at: now,
      updated_at: now
    };

    // Real-time broadcast to all devices in the room immediately!
    broadcastToRoom(room, {
      action: 'item_created',
      item: savedItem
    });

    // Redirect to main UI with notification toast flag
    res.redirect(`/?shared=success&room=${encodeURIComponent(room)}&type=${type}&id=${id}`);
  } catch (err) {
    console.error('Error handling share target:', err);
    res.redirect('/?shared=error');
  }
}

app.get('/share', handleIncomingShare);
app.post('/share', handleIncomingShare);

// Initial Seed Data if empty
function seedDemoDataIfEmpty() {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM items WHERE sync_room = ?').get('MAIN');
  if (countRow && countRow.count > 0) return;

  const now = Date.now();

  const demoItems = [
    {
      id: 'demo_1',
      sync_room: 'MAIN',
      type: 'note',
      title: 'Welcome to NovaSync 🚀',
      content: 'Your all-in-one hub for **Notes**, **Reminders**, and **Instant Link Saving** with real-time cross-device sync.\n\n- Tap the **Pair Device** button in the header to get a QR code or sync link for your phone/tablet.\n- Any update made on one device instantly reflects on all others!',
      url: '',
      metadata: '{}',
      tags: JSON.stringify(['Getting Started', 'Tips']),
      color: 'slate',
      is_pinned: 1,
      is_completed: 0,
      due_date: null,
      reminder_recurrence: 'none',
      priority: 'high',
      checklist: JSON.stringify([
        { text: 'Scan QR code with phone camera to pair devices', done: false },
        { text: 'Try pasting an Instagram reel or web article link', done: false },
        { text: 'Set a reminder and enable browser notifications', done: false }
      ]),
      created_at: now - 3600000,
      updated_at: now - 3600000
    },
    {
      id: 'demo_2',
      sync_room: 'MAIN',
      type: 'reminder',
      title: 'Review team product launch presentation',
      content: 'Check slides 14-22 for metrics, finish sprint review notes, and ping Sarah before the 4 PM call.',
      url: '',
      metadata: '{}',
      tags: JSON.stringify(['Work', 'High Priority']),
      color: 'amber',
      is_pinned: 0,
      is_completed: 0,
      due_date: new Date(Date.now() + 2 * 3600000).toISOString(),
      reminder_recurrence: 'none',
      priority: 'high',
      checklist: JSON.stringify([
        { text: 'Audit slide 14 user growth stats', done: true },
        { text: 'Verify server benchmarks in appendix', done: false }
      ]),
      created_at: now - 1800000,
      updated_at: now - 1800000
    },
    {
      id: 'demo_3',
      sync_room: 'MAIN',
      type: 'instagram',
      title: 'Instagram Reel: Next-Gen Creative Workspace Setup',
      content: 'Clean minimalist desk inspiration with magnetic cable management and ambient lightbar.',
      url: 'https://www.instagram.com/reel/C8qXyz0A1B2/',
      metadata: JSON.stringify({
        title: 'Instagram Reel: Next-Gen Creative Workspace Setup',
        description: 'Clean minimalist desk inspiration with magnetic cable management and ambient lightbar.',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
        siteName: 'Instagram',
        favicon: 'https://www.instagram.com/favicon.ico',
        isInstagram: true,
        igType: 'reel',
        shortcode: 'C8qXyz0A1B2',
        embedUrl: 'https://www.instagram.com/p/C8qXyz0A1B2/embed'
      }),
      tags: JSON.stringify(['Instagram', 'Workspace', 'Design']),
      color: 'rose',
      is_pinned: 0,
      is_completed: 0,
      due_date: null,
      reminder_recurrence: 'none',
      priority: 'medium',
      checklist: JSON.stringify([]),
      created_at: now - 900000,
      updated_at: now - 900000
    },
    {
      id: 'demo_4',
      sync_room: 'MAIN',
      type: 'link',
      title: 'Building Modern Realtime Web Applications with WebSockets',
      content: 'A comprehensive architecture guide covering low-latency bidirectional state sync, reconnection backoff, and local-first data caching.',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API',
      metadata: JSON.stringify({
        title: 'The WebSocket API (WebSockets) - MDN Web Docs',
        description: 'The WebSocket API is an advanced technology that makes it possible to open a two-way interactive communication session between the user\'s browser and a server.',
        image: 'https://developer.mozilla.org/mdn-social-share.cd6c4a5a.png',
        siteName: 'developer.mozilla.org',
        favicon: 'https://developer.mozilla.org/favicon-48x48.png',
        isInstagram: false
      }),
      tags: JSON.stringify(['Architecture', 'WebDev']),
      color: 'cyan',
      is_pinned: 0,
      is_completed: 0,
      due_date: null,
      reminder_recurrence: 'none',
      priority: 'low',
      checklist: JSON.stringify([]),
      created_at: now - 300000,
      updated_at: now - 300000
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO items (
      id, sync_room, type, title, content, url, metadata, tags, color,
      is_pinned, is_completed, due_date, reminder_recurrence, priority, checklist,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const item of demoItems) {
    stmt.run(
      item.id,
      item.sync_room,
      item.type,
      item.title,
      item.content,
      item.url,
      item.metadata,
      item.tags,
      item.color,
      item.is_pinned,
      item.is_completed,
      item.due_date,
      item.reminder_recurrence,
      item.priority,
      item.checklist,
      item.created_at,
      item.updated_at
    );
  }
}

seedDemoDataIfEmpty();

// Start Cloudflare Tunnel for Worldwide Public HTTPS Access
function startCloudflareTunnel() {
  const bin = path.join(__dirname, 'bin', 'cloudflared');
  if (!fs.existsSync(bin)) {
    console.log('ℹ️ cloudflared binary not found; running in LAN mode.');
    return;
  }

  try {
    tunnelProcess = spawn(bin, ['tunnel', '--url', `http://localhost:${PORT}`]);

    tunnelProcess.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
      if (match && match[0] !== publicHttpsUrl) {
        publicHttpsUrl = match[0];
        console.log(`\n=================================================`);
        console.log(`🌍 Cloudflare Public HTTPS Tunnel Active!`);
        console.log(`• Worldwide HTTPS URL: ${publicHttpsUrl}`);
        console.log(`• Mobile PWA & Share:  ${publicHttpsUrl}/?room=MAIN`);
        console.log(`=================================================\n`);

        try {
          const cfg = JSON.stringify({ defaultServerUrl: publicHttpsUrl }, null, 2);
          fs.writeFileSync(path.join(__dirname, 'public', 'config.json'), cfg);
          if (fs.existsSync(path.join(__dirname, 'dist'))) {
            fs.writeFileSync(path.join(__dirname, 'dist', 'config.json'), cfg);
          }
        } catch (e) {
          console.warn('Failed to write config.json:', e);
        }

        // Broadcast to all connected clients
        for (const [roomCode] of rooms.entries()) {
          broadcastToRoom(roomCode, {
            action: 'tunnel_update',
            publicHttpsUrl: `${publicHttpsUrl}/?room=${encodeURIComponent(roomCode)}`
          });
        }
      }
    });

    tunnelProcess.on('close', (code) => {
      console.log(`Cloudflare tunnel exited with code ${code}. Reconnecting in 5s...`);
      publicHttpsUrl = null;
      setTimeout(startCloudflareTunnel, 5000);
    });
  } catch (err) {
    console.error('Failed to start Cloudflare tunnel:', err.message);
  }
}

// SPA HTML fallback for React client router
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/ws') || req.path.startsWith('/share')) {
    return next();
  }
  const indexFile = path.join(staticDir, 'index.html');
  if (fs.existsSync(indexFile)) {
    return res.sendFile(indexFile);
  }
  next();
});

// Start Server
server.listen(PORT, '0.0.0.0', () => {
  const localIp = getLocalIpAddress();
  console.log(`\n=================================================`);
  console.log(`🚀 NovaSync Server running!`);
  console.log(`• Localhost:       http://localhost:${PORT}`);
  console.log(`• Local Network:   http://${localIp}:${PORT}`);
  console.log(`• WebSocket Path:  ws://${localIp}:${PORT}/ws`);
  console.log(`• Share Target:    http://${localIp}:${PORT}/share`);
  console.log(`=================================================\n`);

  startCloudflareTunnel();
});
