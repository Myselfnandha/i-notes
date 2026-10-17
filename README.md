---
title: NovaSync — Notes, Reminders & Instant Link Saver
emoji: ⚡
colorFrom: green
colorTo: blue
sdk: static
pinned: false
---

# ⚡ NovaSync — Enterprise-Grade Productivity & Cross-Device Sync

> Unified, ultra-fast application for **Markdown Notes**, **Smart Reminders**, and **Instant Link / Instagram Reel Collection** with bidirectional real-time synchronization across phones, tablets, and computers worldwide.

---

## 🌟 Key Features

### 1. 📝 Markdown Notes & Checklists
- Full interactive checklists with live completion progress bar (`3 of 5 done (60%)`).
- Real-time word counter and reading time estimates.
- Color themes (Slate, Emerald, Cyan, Amber, Rose, Violet) for visual organization.
- Pin notes to the top of your feed.

### 2. ⏰ Smart Reminders & Harmonics
- Priority levels: 🔴 High (Urgent), 🟡 Medium, 🟢 Low.
- Recurrence rules: One-time, Daily, Weekdays, Weekly, Monthly.
- Relative countdown badges: *Due in 15 mins*, *Overdue by 1h*, *Today at 4 PM*.
- Web Audio API harmonic alert chime with synthesized multi-frequency chime.
- One-click Snooze dropdown: *+15m*, *+1h*, *Tomorrow*.
- Native browser Web Notifications.

### 3. 📸 Instagram Reels & Link Scraper (Hoarder / Karakeep Benchmark)
- Auto-detects Instagram Reels and Posts, automatically stripping tracking parameters (`?igsh=...`, `utm_source=...`).
- Direct preview player and one-click "Open in Instagram App".
- OpenGraph metadata scraper (Cheerio) fetching page title, description, favicon, and rich thumbnails.

### 4. ⚡ 24/7 Worldwide Sync & Offline-First
- **Static Frontend**: Hosted 24/7 on Hugging Face at `https://nandhaalagesan248-novasync.static.hf.space`.
- **Cloudflare HTTPS Tunnel**: Zero open router ports, instant worldwide pairing via mobile camera QR code.
- **Offline Mutation Queue**: If offline, actions are saved locally and automatically synced to the server upon reconnection!
- **Multi-Device Presence**: Live roster of connected phones, tablets, and desktop computers in the room.

---

## 📱 Mobile PWA & Web Share Target

1. Open **NovaSync** on your phone in Chrome or Safari.
2. Tap **"Install App"** / **"Add to Home Screen"**.
3. Now in Instagram or your web browser, tap **Share → NovaSync**: your reel or link is captured and synced across all your devices in milliseconds!

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Lucide React, Web Audio API, Service Worker PWA.
- **Backend**: Node.js, Express, `node:sqlite` (WAL Mode), WebSocket (`ws`), Cheerio OpenGraph scraper, QRCode generator.
- **Network**: Cloudflare Public HTTPS Tunnel (`cloudflared`).
- **Cloud**: Hugging Face Spaces (Static 24/7 free tier).
