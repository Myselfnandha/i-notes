# Codebase Summary: tool

## Overview
- **Scan Date:** 2026-10-17 14:04:35
- **Source Folder:** `/home/nandha/Desktop/tool`
- **Total Text Files:** 27
- **Estimated Token Count:** 93,585

## File Summaries

- `AGENTS.md` — ZeroGravity OS (AGENTS.md) (7 lines)
- `index.html` — HTML file: 22 lines
- `novasync.service` — SERVICE file: 13 lines
- `package-lock.json` — Lockfile manifest: 202 resolved dependencies
- `package.json` — package.json
- `public/app.css` — ========================================================================== (1836 lines)
- `public/app.js` — Test suite: 9 test blocks, test
- `public/icons/icon.svg` — SVG file: 37 lines
- `public/index.html` — HTML file: 488 lines
- `public/manifest.webmanifest` — WEBMANIFEST file: 29 lines
- `public/sw.js` — HTTP calls
- `server.js` — Test suite: 3 test blocks, test
- `src/App.tsx` — Test suite: 7 test blocks, test
- `src/components/Header.tsx` — React component: Header
- `src/components/ItemCard.tsx` — React component: ItemCard
- `src/components/ItemModal.tsx` — Test suite: 1 test blocks, test
- `src/components/QuickAddBar.tsx` — Test suite: 1 test blocks, test
- `src/components/SyncBanner.tsx` — React component: SyncBanner
- `src/components/SyncModal.tsx` — React component: SyncModal; hooks: useState
- `src/components/Toast.tsx` — React component: ToastContainer
- `src/main.tsx` — TypeScript module: 0 exports, 0 functions, 10 lines
- `src/services/api.ts` — exports: getBaseApiUrl, fetchUrlMetadataApi, setCustomServerUrl, fetchItemsApi +4 more; HTTP calls
- `src/services/audio.ts` — exports: playReminderChime
- `src/styles/app.css` — ========================================================================== (1836 lines)
- `src/types/index.ts` — Type definitions: ChecklistTask, UrlMetadata, Item, DeviceInfo +6 more
- `tsconfig.json` — tsconfig.json
- `vite.config.ts` — TypeScript module: 1 exports, 0 functions, 22 lines

## Directory Tree
```text
tool/
├── AGENTS.md
├── bin/
│   └── cloudflared
├── data/
│   ├── novasync.db
│   ├── novasync.db-shm
│   └── novasync.db-wal
├── index.html
├── novasync.service
├── package-lock.json
├── package.json
├── public/
│   ├── app.css
│   ├── app.js
│   ├── icons/
│   │   └── icon.svg
│   ├── index.html
│   ├── manifest.webmanifest
│   └── sw.js
├── server.js
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── ItemCard.tsx
│   │   ├── ItemModal.tsx
│   │   ├── QuickAddBar.tsx
│   │   ├── SyncBanner.tsx
│   │   ├── SyncModal.tsx
│   │   └── Toast.tsx
│   ├── main.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── audio.ts
│   ├── styles/
│   │   └── app.css
│   └── types/
│       └── index.ts
├── tsconfig.json
└── vite.config.ts
```

## File Contents

### File: `AGENTS.md`
- **Summary:** ZeroGravity OS (AGENTS.md) (7 lines)
- **Path:** `AGENTS.md`
- **Estimated Tokens:** 217
- **mtime:** 1792223906.714

```markdown
# ZeroGravity OS (AGENTS.md)

Autonomous Supercoding Engine. 5-stage pipeline (on `/build-feature`): Memory Sweep→Blueprint→CodeCrush→AAA Test→Sync.
Anti-patterns inlined in `.agents/rules/core.md`. Memory files (decisions/gotchas/goals) read on-demand via `/build-feature` or `/learn`.

## Tooling
- MCPs: zero-default, on-demand (`npx @nandhaalagesan/zerogravity mcp enable <name>` or `zg mcp enable <name>`). 13 verified servers + 2,600+ searchable catalog.
- CLI: `npx @nandhaalagesan/zerogravity` / `zg` (install|update|mcp)
- Slash: /build-feature /mcp /effort /effort-low /effort-mid /effort-high /effort-ultra /brainstorm /plan /create /debug /test /deploy /teach-concept /enhance /spec-driven-dev /design-ui /codebase-design /domain-model /prd-workflow /orchestrate /focus /humanize-text /compress-tokens /skill /yagni-simplify /audit-agent /react-components
```

---

### File: `index.html`
- **Summary:** HTML file: 22 lines
- **Path:** `index.html`
- **Estimated Tokens:** 302
- **mtime:** 1792225639.295

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>NovaSync — Notes, Reminders & Instant Link Saver</title>
  <meta name="description" content="All-in-one productivity hub for notes taking, smart reminders, and automatic Instagram & web link bookmarking with real-time cross-device sync.">
  <meta name="theme-color" content="#090d16">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="icon" type="image/svg+xml" href="/icons/icon.svg">
  <link rel="apple-touch-icon" href="/icons/icon.svg">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

---

### File: `novasync.service`
- **Summary:** SERVICE file: 13 lines
- **Path:** `novasync.service`
- **Estimated Tokens:** 89
- **mtime:** 1792225298.094

```
[Unit]
Description=NovaSync - Permanent Realtime Sync Engine for Notes, Reminders and Links
After=network.target

[Service]
Type=simple
WorkingDirectory=/home/nandha/Desktop/tool
ExecStart=/usr/bin/node /home/nandha/Desktop/tool/server.js
Restart=always
RestartSec=5
Environment=PORT=3000
Environment=NODE_ENV=production

[Install]
WantedBy=default.target
```

---

### File: `package-lock.json`
- **Summary:** Lockfile manifest: 202 resolved dependencies
- **Path:** `package-lock.json`
- **Estimated Tokens:** 1,731
- **mtime:** 1792225606.774

> [!NOTE]
> **Compact Dependency Manifest**: Extracted 202 resolved packages from `package-lock.json`.
> Full cryptographic integrity hashes and raw lock metadata omitted to preserve context window.

| Package | Resolved Version |
| :--- | :--- |
| `@oxc-project/types` | `0.154.0` |
| `@rolldown/binding-android-arm-eabi` | `1.2.14` |
| `@rolldown/binding-android-arm64` | `1.2.14` |
| `@rolldown/binding-darwin-arm64` | `1.2.14` |
| `@rolldown/binding-darwin-x64` | `1.2.14` |
| `@rolldown/binding-freebsd-x64` | `1.2.14` |
| `@rolldown/binding-linux-arm-gnueabihf` | `1.2.14` |
| `@rolldown/binding-linux-arm64-gnu` | `1.2.14` |
| `@rolldown/binding-linux-arm64-musl` | `1.2.14` |
| `@rolldown/binding-linux-ppc64-gnu` | `1.2.14` |
| `@rolldown/binding-linux-s390x-gnu` | `1.2.14` |
| `@rolldown/binding-linux-x64-gnu` | `1.2.14` |
| `@rolldown/binding-linux-x64-musl` | `1.2.14` |
| `@rolldown/binding-openharmony-arm64` | `1.2.14` |
| `@rolldown/binding-win32-arm64-msvc` | `1.2.14` |
| `@rolldown/binding-win32-x64-msvc` | `1.2.14` |
| `@rolldown/pluginutils` | `1.0.1` |
| `@types/body-parser` | `1.19.6` |
| `@types/connect` | `3.4.38` |
| `@types/express` | `5.0.6` |
| `@types/express-serve-static-core` | `5.1.3` |
| `@types/http-errors` | `2.0.5` |
| `@types/node` | `26.6.5` |
| `@types/qs` | `6.15.1` |
| `@types/range-parser` | `1.2.7` |
| `@types/react` | `19.3.0` |
| `@types/react-dom` | `19.3.0` |
| `@types/send` | `1.2.1` |
| `@types/serve-static` | `2.2.0` |
| `@types/ws` | `8.18.2` |
| `@typescript/typescript-aix-ppc64` | `7.0.2` |
| `@typescript/typescript-darwin-arm64` | `7.0.2` |
| `@typescript/typescript-darwin-x64` | `7.0.2` |
| `@typescript/typescript-freebsd-arm64` | `7.0.2` |
| `@typescript/typescript-freebsd-x64` | `7.0.2` |
| `@typescript/typescript-linux-arm` | `7.0.2` |
| `@typescript/typescript-linux-arm64` | `7.0.2` |
| `@typescript/typescript-linux-loong64` | `7.0.2` |
| `@typescript/typescript-linux-mips64el` | `7.0.2` |
| `@typescript/typescript-linux-ppc64` | `7.0.2` |
| `@typescript/typescript-linux-riscv64` | `7.0.2` |
| `@typescript/typescript-linux-s390x` | `7.0.2` |
| `@typescript/typescript-linux-x64` | `7.0.2` |
| `@typescript/typescript-netbsd-arm64` | `7.0.2` |
| `@typescript/typescript-netbsd-x64` | `7.0.2` |
| `@typescript/typescript-openbsd-arm64` | `7.0.2` |
| `@typescript/typescript-openbsd-x64` | `7.0.2` |
| `@typescript/typescript-sunos-x64` | `7.0.2` |
| `@typescript/typescript-win32-arm64` | `7.0.2` |
| `@typescript/typescript-win32-x64` | `7.0.2` |
| `@vitejs/plugin-react` | `6.1.2` |
| `accepts` | `1.3.8` |
| `ansi-regex` | `5.0.1` |
| `ansi-styles` | `4.3.0` |
| `array-flatten` | `1.1.1` |
| `body-parser` | `1.20.8` |
| `body-parser/iconv-lite` | `0.4.24` |
| `boolbase` | `1.0.0` |
| `bytes` | `3.1.2` |
| `call-bind-apply-helpers` | `1.0.2` |
| `call-bound` | `1.0.4` |
| `camelcase` | `5.3.1` |
| `cheerio` | `1.2.0` |
| `cheerio-select` | `2.1.0` |
| `cliui` | `6.0.0` |
| `color-convert` | `2.0.1` |
| `color-name` | `1.1.4` |
| `content-disposition` | `0.5.4` |
| `content-type` | `1.0.5` |
| `cookie` | `0.7.2` |
| `cookie-signature` | `1.0.7` |
| `css-select` | `5.2.2` |
| `css-what` | `6.2.2` |
| `csstype` | `3.2.3` |
| `debug` | `2.6.9` |
| `decamelize` | `1.2.0` |
| `depd` | `2.0.0` |
| `destroy` | `1.2.0` |
| `detect-libc` | `2.1.2` |
| `dijkstrajs` | `1.0.3` |
| `dom-serializer` | `2.0.0` |
| `domelementtype` | `2.3.0` |
| `domhandler` | `5.0.3` |
| `domutils` | `3.2.2` |
| `dunder-proto` | `1.0.1` |
| `ee-first` | `1.1.1` |
| `emoji-regex` | `8.0.0` |
| `encodeurl` | `2.0.0` |
| `encoding-sniffer` | `0.2.1` |
| `entities` | `4.5.0` |
| `es-define-property` | `1.0.1` |
| `es-errors` | `1.3.0` |
| `es-object-atoms` | `1.1.2` |
| `escape-html` | `1.0.3` |
| `etag` | `1.8.1` |
| `express` | `4.22.3` |
| `fdir` | `6.5.0` |
| `finalhandler` | `1.3.2` |
| `find-up` | `4.1.0` |
| `forwarded` | `0.2.0` |
| `fresh` | `0.5.2` |
| `fsevents` | `2.3.3` |
| `function-bind` | `1.1.2` |
| `get-caller-file` | `2.0.5` |
| `get-intrinsic` | `1.3.0` |
| `get-proto` | `1.0.1` |
| `gopd` | `1.2.0` |
| `has-symbols` | `1.1.0` |
| `hasown` | `2.0.4` |
| `htmlparser2` | `10.1.0` |
| `htmlparser2/entities` | `7.0.1` |
| `http-errors` | `2.0.1` |
| `iconv-lite` | `0.6.3` |
| `inherits` | `2.0.4` |
| `ipaddr.js` | `1.9.1` |
| `is-fullwidth-code-point` | `3.0.0` |
| `lightningcss` | `1.33.0` |
| `lightningcss-android-arm64` | `1.33.0` |
| `lightningcss-darwin-arm64` | `1.33.0` |
| `lightningcss-darwin-x64` | `1.33.0` |
| `lightningcss-freebsd-x64` | `1.33.0` |
| `lightningcss-linux-arm-gnueabihf` | `1.33.0` |
| `lightningcss-linux-arm64-gnu` | `1.33.0` |
| `lightningcss-linux-arm64-musl` | `1.33.0` |
| `lightningcss-linux-x64-gnu` | `1.33.0` |
| `lightningcss-linux-x64-musl` | `1.33.0` |
| `lightningcss-win32-arm64-msvc` | `1.33.0` |
| `lightningcss-win32-x64-msvc` | `1.33.0` |
| `locate-path` | `5.0.0` |
| `lucide-react` | `1.59.0` |
| `math-intrinsics` | `1.1.0` |
| `media-typer` | `0.3.0` |
| `merge-descriptors` | `1.0.3` |
| `methods` | `1.1.2` |
| `mime` | `1.6.0` |
| `mime-db` | `1.52.0` |
| `mime-types` | `2.1.35` |
| `ms` | `2.0.0` |
| `nanoid` | `3.3.20` |
| `negotiator` | `0.6.3` |
| `nth-check` | `2.1.1` |
| `object-inspect` | `1.13.4` |
| `on-finished` | `2.4.1` |
| `p-limit` | `2.3.0` |
| `p-locate` | `4.1.0` |
| `p-try` | `2.2.0` |
| `parse5` | `7.3.0` |
| `parse5-htmlparser2-tree-adapter` | `7.1.0` |
| `parse5-parser-stream` | `7.1.2` |
| `parse5/entities` | `6.0.1` |
| `parseurl` | `1.3.3` |
| `path-exists` | `4.0.0` |
| `path-to-regexp` | `0.1.13` |
| `picocolors` | `1.1.1` |
| `picomatch` | `4.0.7` |
| `pngjs` | `5.0.0` |
| `postcss` | `8.5.30` |
| `proxy-addr` | `2.0.8` |
| `qrcode` | `1.5.4` |
| `qs` | `6.16.1` |
| `range-parser` | `1.2.1` |
| `raw-body` | `2.5.3` |
| `raw-body/iconv-lite` | `0.4.24` |
| `react` | `19.3.1` |
| `react-dom` | `19.3.1` |
| `require-directory` | `2.1.1` |
| `require-main-filename` | `2.0.0` |
| `rolldown` | `1.2.14` |
| `safe-buffer` | `5.2.1` |
| `safer-buffer` | `2.1.2` |
| `scheduler` | `0.28.0` |
| `send` | `0.19.2` |
| `send/ms` | `2.1.3` |
| `serve-static` | `1.16.3` |
| `set-blocking` | `2.0.0` |
| `setprototypeof` | `1.2.0` |
| `side-channel` | `1.1.1` |
| `side-channel-list` | `1.0.1` |
| `side-channel-map` | `1.0.1` |
| `side-channel-weakmap` | `1.0.2` |
| `source-map-js` | `1.2.2` |
| `statuses` | `2.0.2` |
| `string-width` | `4.2.3` |
| `strip-ansi` | `6.0.1` |
| `tinyglobby` | `0.2.17` |
| `toidentifier` | `1.0.1` |
| `type-is` | `1.6.18` |
| `typescript` | `7.0.2` |
| `undici` | `7.30.1` |
| `undici-types` | `8.9.0` |
| `unpipe` | `1.0.0` |
| `utils-merge` | `1.0.1` |
| `vary` | `1.1.2` |
| `vite` | `8.3.4` |
| `whatwg-encoding` | `3.1.1` |
| `whatwg-mimetype` | `4.0.0` |
| `which-module` | `2.0.1` |
| `wrap-ansi` | `6.2.0` |
| `ws` | `8.22.0` |
| `y18n` | `4.0.3` |
| `yargs` | `15.4.1` |
| `yargs-parser` | `18.1.3` |

---

### File: `package.json`
- **Summary:** package.json
- **Path:** `package.json`
- **Estimated Tokens:** 328
- **mtime:** 1792226067.348

```json
{
  "name": "novasync",
  "version": "1.0.0",
  "description": "Unified Notes, Reminders, and Instant Link Collector with Realtime Cross-Device Sync",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "vite",
    "build": "vite build && cp public/manifest.webmanifest dist/ && cp public/sw.js dist/ && cp -r public/icons dist/",
    "deploy:hf": "npm run build && hf upload nandhaalagesan248/novasync dist . --type space --commit-message 'Deploy to Hugging Face Space'",
    "service:enable": "systemctl --user enable --now novasync.service",
    "service:status": "systemctl --user status novasync.service",
    "service:restart": "systemctl --user restart novasync.service",
    "service:stop": "systemctl --user stop novasync.service",
    "service:logs": "journalctl --user -u novasync.service -f"
  },
  "dependencies": {
    "cheerio": "^1.0.0",
    "express": "^4.21.2",
    "lucide-react": "^1.59.0",
    "qrcode": "^1.5.4",
    "react": "^19.3.1",
    "react-dom": "^19.3.1",
    "ws": "^8.18.0"
  },
  "devDependencies": {
    "@types/express": "^5.0.6",
    "@types/node": "^26.6.5",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "@types/ws": "^8.18.2",
    "@vitejs/plugin-react": "^6.1.2",
    "typescript": "^7.0.2",
    "vite": "^8.3.4"
  }
}
```

---

### File: `public/app.css`
- **Summary:** ========================================================================== (1836 lines)
- **Path:** `public/app.css`
- **Estimated Tokens:** 10,347
- **mtime:** 1792225184.172

```css
/* ==========================================================================
   NovaSync — Premium Design System & Stylesheet
   Modern Glassmorphism, Responsive Grid & Curated Palettes
   ========================================================================== */

:root {
  /* Color Tokens - Dark Mode (Default) */
  --bg-primary: #090d16;
  --bg-secondary: #0f172a;
  --bg-tertiary: #131d33;
  --bg-glass: rgba(15, 23, 42, 0.75);
  --bg-card: #111a2e;
  --bg-card-hover: #16223b;
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-focus: #06b6d4;

  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --text-subtle: #64748b;

  /* Accent Colors */
  --accent-emerald: #10b981;
  --accent-emerald-glow: rgba(16, 185, 129, 0.25);
  --accent-cyan: #06b6d4;
  --accent-cyan-glow: rgba(6, 182, 212, 0.25);
  --accent-amber: #f59e0b;
  --accent-amber-glow: rgba(245, 158, 11, 0.25);
  --accent-rose: #f43f5e;
  --accent-rose-glow: rgba(244, 63, 94, 0.25);
  --accent-violet: #8b5cf6;
  --accent-violet-glow: rgba(139, 92, 246, 0.25);

  /* Instagram Gradient */
  --instagram-grad: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);

  /* Typography */
  --font-main: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Elevation & Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.35);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.45);
  --shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.6);
  --shadow-glow: 0 0 24px var(--accent-cyan-glow);

  /* Radii */
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-full: 9999px;

  /* Transitions */
  --trans-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --trans-smooth: 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Light Theme Mode */
[data-theme="light"] {
  --bg-primary: #f8fafc;
  --bg-secondary: #f1f5f9;
  --bg-tertiary: #e2e8f0;
  --bg-glass: rgba(255, 255, 255, 0.85);
  --bg-card: #ffffff;
  --bg-card-hover: #f8fafc;
  --border-subtle: rgba(15, 23, 42, 0.09);
  --border-focus: #0284c7;

  --text-main: #0f172a;
  --text-muted: #475569;
  --text-subtle: #94a3b8;

  --shadow-sm: 0 2px 8px rgba(15, 23, 42, 0.05);
  --shadow-md: 0 8px 24px rgba(15, 23, 42, 0.08);
  --shadow-lg: 0 16px 40px rgba(15, 23, 42, 0.12);
}

/* Base Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  min-height: 100vh;
  font-family: var(--font-main);
  background-color: var(--bg-primary);
  color: var(--text-main);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* Links & Buttons */
a {
  color: var(--accent-cyan);
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}

button, input, select, textarea {
  font-family: inherit;
  color: inherit;
  outline: none;
}

/* ==========================================================================
   Header & Navigation
   ========================================================================== */

.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-subtle);
  padding: 10px 24px;
  transition: all var(--trans-smooth);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand-group {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.brand-logo {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px var(--accent-emerald-glow);
}

.brand-icon {
  width: 22px;
  height: 22px;
  color: #041014;
}

.pulse-indicator {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #34d399;
  border: 2px solid var(--bg-primary);
  animation: pulsePing 2s infinite;
}

@keyframes pulsePing {
  0% { transform: scale(0.9); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.5; }
  100% { transform: scale(0.9); opacity: 1; }
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-main);
  line-height: 1.1;
}

.brand-name span {
  color: var(--accent-cyan);
}

.brand-badge {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--accent-emerald);
  text-transform: uppercase;
}

/* Search Bar */
.search-wrapper {
  flex: 1;
  max-width: 520px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  pointer-events: none;
}

.search-wrapper input {
  width: 100%;
  height: 42px;
  padding: 0 65px 0 42px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  font-size: 0.9rem;
  transition: all var(--trans-fast);
}

.search-wrapper input:focus {
  border-color: var(--border-focus);
  background: var(--bg-tertiary);
  box-shadow: 0 0 0 3px var(--accent-cyan-glow);
}

.clear-btn {
  position: absolute;
  right: 48px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  font-size: 0.85rem;
}

.kbd-shortcut {
  position: absolute;
  right: 12px;
  padding: 2px 6px;
  font-size: 0.72rem;
  font-family: var(--font-mono);
  background: var(--bg-tertiary);
  color: var(--text-muted);
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  pointer-events: none;
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border-radius: var(--radius-full);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--trans-fast);
  border: 1px solid transparent;
}

.pill-btn.small {
  height: 32px;
  padding: 0 12px;
  font-size: 0.8rem;
}

.pill-btn.primary {
  background: var(--accent-cyan);
  color: #04141c;
  box-shadow: 0 2px 8px var(--accent-cyan-glow);
}
.pill-btn.primary:hover {
  background: #22d3ee;
  transform: translateY(-1px);
}

.pill-btn.secondary {
  background: var(--bg-tertiary);
  color: var(--text-main);
  border-color: var(--border-subtle);
}
.pill-btn.secondary:hover {
  background: var(--bg-card-hover);
  border-color: var(--text-muted);
}

.pill-btn.success {
  background: var(--accent-emerald);
  color: #022013;
}
.pill-btn.success:hover {
  background: #34d399;
}

.sync-btn {
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: var(--accent-emerald);
}
.sync-btn:hover {
  background: rgba(16, 185, 129, 0.22);
  transform: translateY(-1px);
}

.sync-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-emerald);
}

.sync-dot.live {
  box-shadow: 0 0 10px var(--accent-emerald);
  animation: pulseDot 2s infinite;
}

.sync-dot.offline {
  background: var(--accent-rose);
  box-shadow: none;
  animation: none;
}

@keyframes pulseDot {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.6; }
  100% { transform: scale(1); opacity: 1; }
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border-radius: var(--radius-md);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--trans-fast);
  border: none;
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.action-btn.primary-btn {
  background: linear-gradient(135deg, #06b6d4 0%, #10b981 100%);
  color: #03141c;
  box-shadow: 0 4px 14px var(--accent-cyan-glow);
}
.action-btn.primary-btn:hover {
  transform: translateY(-1.5px);
  box-shadow: 0 6px 20px var(--accent-cyan-glow);
}

.action-btn.icon-btn {
  background: var(--bg-secondary);
  color: var(--text-main);
  border: 1px solid var(--border-subtle);
}
.action-btn.icon-btn:hover {
  background: var(--bg-tertiary);
  border-color: var(--accent-cyan);
}

.icon-toggle-btn {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--trans-fast);
}

.icon-toggle-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-main);
}

.icon-toggle-btn svg {
  width: 18px;
  height: 18px;
}

.bell-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-amber);
  box-shadow: 0 0 6px var(--accent-amber);
}

/* ==========================================================================
   Main Layout & Banners
   ========================================================================== */

.main-layout {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

/* Sync Banner */
.sync-banner {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: var(--radius-md);
  padding: 12px 20px;
  margin-bottom: 24px;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.banner-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
}

.banner-pill {
  background: var(--accent-cyan);
  color: #041620;
  font-weight: 700;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: var(--radius-full);
}

.banner-text strong {
  color: var(--accent-cyan);
}

.banner-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.banner-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 14px;
  border-radius: var(--radius-full);
  background: var(--accent-cyan);
  color: #02161f;
  font-size: 0.82rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all var(--trans-fast);
}
.banner-btn:hover {
  transform: translateY(-1px);
  background: #22d3ee;
}

.banner-btn.secondary {
  background: var(--bg-tertiary);
  color: var(--text-main);
  border: 1px solid var(--border-subtle);
}
.banner-btn.secondary:hover {
  background: var(--bg-card-hover);
  border-color: var(--text-muted);
}

.banner-btn svg {
  width: 15px;
  height: 15px;
}

/* Urgent Alert Banner */
.urgent-alert {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(244, 63, 94, 0.15) 100%);
  border: 1px solid var(--accent-amber);
  border-radius: var(--radius-md);
  padding: 14px 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  animation: pulseAmber 3s infinite;
}

@keyframes pulseAmber {
  0%, 100% { box-shadow: 0 0 12px var(--accent-amber-glow); }
  50% { box-shadow: 0 0 24px rgba(245, 158, 11, 0.4); }
}

.urgent-icon {
  font-size: 1.6rem;
}

.urgent-info {
  flex: 1;
}

.urgent-info h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main);
}

.urgent-info p {
  font-size: 0.85rem;
  color: var(--accent-amber);
}

.urgent-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ==========================================================================
   Quick Add Section
   ========================================================================== */

.quick-add-section {
  margin-bottom: 28px;
}

.quick-add-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  box-shadow: var(--shadow-sm);
  transition: all var(--trans-smooth);
}

.quick-add-card:focus-within {
  border-color: var(--border-focus);
  box-shadow: 0 8px 30px var(--accent-cyan-glow);
}

.quick-add-input-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.quick-type-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-secondary);
  padding: 4px;
  border-radius: var(--radius-full);
}

.type-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 14px;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--text-muted);
  border: none;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--trans-fast);
}

.type-chip svg {
  width: 14px;
  height: 14px;
}

.type-chip:hover {
  color: var(--text-main);
}

.type-chip.active {
  background: var(--bg-tertiary);
  color: var(--accent-cyan);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.quick-input-box {
  flex: 1;
  min-width: 280px;
  position: relative;
  display: flex;
  align-items: center;
}

.quick-input-box input {
  width: 100%;
  height: 44px;
  padding: 0 50px 0 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  font-size: 0.94rem;
  transition: all var(--trans-fast);
}

.quick-input-box input:focus {
  border-color: var(--accent-cyan);
  background: var(--bg-tertiary);
}

.quick-btn-go {
  position: absolute;
  right: 6px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent-cyan);
  color: #03141c;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--trans-fast);
}

.quick-btn-go:hover {
  transform: scale(1.08);
  background: #22d3ee;
}

.quick-btn-go svg {
  width: 16px;
  height: 16px;
}

/* Detected Link Bar */
.quick-detected-bar {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.85rem;
}

.detected-badge {
  background: rgba(244, 63, 94, 0.15);
  color: var(--accent-rose);
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 0.78rem;
}

.detected-url {
  flex: 1;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--font-mono);
}

.save-link-btn {
  background: var(--accent-rose);
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
}
.save-link-btn:hover {
  background: #fb7185;
}

/* ==========================================================================
   Categories Nav & Tags Filter
   ========================================================================== */

.categories-nav {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tabs-list {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}
.tabs-list::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 18px;
  border-radius: var(--radius-full);
  background: var(--bg-secondary);
  color: var(--text-muted);
  border: 1px solid var(--border-subtle);
  font-size: 0.88rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: all var(--trans-fast);
}

.tab-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-main);
  border-color: rgba(255, 255, 255, 0.15);
}

.tab-btn.active {
  background: var(--text-main);
  color: var(--bg-primary);
  border-color: var(--text-main);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.15);
  font-size: 0.75rem;
  font-weight: 700;
}

.tab-btn.active .tab-count {
  background: var(--bg-primary);
  color: var(--text-main);
}

/* Tags Filter Bar */
.tags-filter-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 0.82rem;
}

.tags-label {
  color: var(--text-subtle);
  font-weight: 600;
  margin-right: 4px;
}

.tag-pill {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  background: var(--bg-secondary);
  color: var(--text-muted);
  border: 1px solid var(--border-subtle);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all var(--trans-fast);
}

.tag-pill:hover {
  color: var(--text-main);
  border-color: var(--accent-cyan);
}

.tag-pill.active {
  background: rgba(6, 182, 212, 0.15);
  color: var(--accent-cyan);
  border-color: var(--accent-cyan);
  font-weight: 600;
}

/* ==========================================================================
   Items Section & Cards Grid
   ========================================================================== */

.items-section {
  min-height: 400px;
}

.section-subheader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.active-filter-title {
  font-weight: 600;
}

.sort-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.82rem;
  cursor: pointer;
}
.sort-btn:hover {
  color: var(--text-main);
}
.sort-btn svg {
  width: 14px;
  height: 14px;
}

/* Cards Grid: Masonry-style 3 columns */
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
  align-items: start;
}

/* ==========================================================================
   Universal Item Card Style
   ========================================================================== */

.item-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  transition: all var(--trans-smooth);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.item-card:hover {
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

/* Card Color Accents */
.item-card.color-slate { border-left: 4px solid var(--text-subtle); }
.item-card.color-emerald { border-left: 4px solid var(--accent-emerald); }
.item-card.color-cyan { border-left: 4px solid var(--accent-cyan); }
.item-card.color-amber { border-left: 4px solid var(--accent-amber); }
.item-card.color-rose { border-left: 4px solid var(--accent-rose); }
.item-card.color-violet { border-left: 4px solid var(--accent-violet); }

/* Card Header */
.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  color: var(--text-muted);
}

.card-badge.type-note {
  color: var(--accent-cyan);
  background: rgba(6, 182, 212, 0.12);
}

.card-badge.type-reminder {
  color: var(--accent-amber);
  background: rgba(245, 158, 11, 0.12);
}

.card-badge.type-instagram {
  color: #fff;
  background: var(--instagram-grad);
}

.card-badge.type-link {
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.12);
}

.card-top-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-icon-btn {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  background: transparent;
  border: none;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--trans-fast);
}

.card-icon-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-main);
}

.card-icon-btn svg {
  width: 15px;
  height: 15px;
}

.card-icon-btn.pinned {
  color: var(--accent-amber);
}

/* Card Title & Content */
.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.35;
  color: var(--text-main);
  word-break: break-word;
}

.card-content {
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Checklists inside Notes/Reminders */
.card-checklist {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

.checklist-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  cursor: pointer;
  user-select: none;
}

.checklist-checkbox {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid var(--text-subtle);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  position: relative;
  transition: all var(--trans-fast);
  flex-shrink: 0;
}

.checklist-checkbox:checked {
  background: var(--accent-emerald);
  border-color: var(--accent-emerald);
}

.checklist-checkbox:checked::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 5px;
  width: 4px;
  height: 8px;
  border: solid #022013;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checklist-text {
  color: var(--text-main);
  transition: all var(--trans-fast);
}

.checklist-row.done .checklist-text {
  text-decoration: line-through;
  color: var(--text-subtle);
}

/* ==========================================================================
   Specialized Card Styles: Instagram & Link Bookmarks
   ========================================================================== */

/* Instagram Card */
.instagram-card-body {
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-secondary);
  border: 1px solid rgba(225, 48, 108, 0.25);
  margin: 4px 0;
}

.ig-media-thumb {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #020617;
}

.ig-media-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--trans-smooth);
}

.item-card:hover .ig-media-thumb img {
  transform: scale(1.04);
}

.ig-play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
}

.ig-play-circle {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
}

.ig-play-circle svg {
  width: 20px;
  height: 20px;
  fill: #000;
  margin-left: 2px;
}

.ig-caption-box {
  padding: 12px;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.ig-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: var(--bg-tertiary);
  border-top: 1px solid var(--border-subtle);
}

.open-ig-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--instagram-grad);
  color: #fff !important;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  text-decoration: none !important;
  box-shadow: 0 2px 8px rgba(225, 48, 108, 0.3);
}

.open-ig-btn:hover {
  transform: translateY(-1px);
}

.copy-url-btn {
  background: transparent;
  border: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-size: 0.78rem;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  cursor: pointer;
}
.copy-url-btn:hover {
  color: var(--text-main);
  border-color: var(--text-muted);
}

/* Website Bookmark Card */
.link-card-body {
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  margin: 4px 0;
}

.link-thumb {
  width: 100%;
  height: 160px;
  overflow: hidden;
  background: #020617;
}

.link-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--trans-smooth);
}

.item-card:hover .link-thumb img {
  transform: scale(1.04);
}

.link-info {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.link-domain {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--text-subtle);
  font-weight: 600;
}

.domain-favicon {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

.link-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ==========================================================================
   Specialized Card Styles: Reminders
   ========================================================================== */

.reminder-status-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  font-size: 0.82rem;
}

.due-countdown {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.due-countdown.urgent {
  color: var(--accent-rose);
  animation: pulsePing 2s infinite;
}

.due-countdown.today {
  color: var(--accent-amber);
}

.due-countdown.upcoming {
  color: var(--accent-emerald);
}

.due-countdown.completed {
  color: var(--text-subtle);
  text-decoration: line-through;
}

.reminder-quick-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.snooze-btn {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-size: 0.75rem;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
}
.snooze-btn:hover {
  color: var(--text-main);
  border-color: var(--accent-amber);
}

/* Card Tags & Footer */
.card-tags {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.card-tag {
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: var(--bg-secondary);
  color: var(--text-muted);
  border: 1px solid var(--border-subtle);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid var(--border-subtle);
  font-size: 0.76rem;
  color: var(--text-subtle);
}

.card-footer-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-card-action {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 0.78rem;
}
.btn-card-action:hover {
  color: var(--text-main);
  background: var(--bg-tertiary);
}

.btn-card-action.danger:hover {
  color: var(--accent-rose);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  max-width: 480px;
  margin: 0 auto;
}

.empty-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px auto;
  color: var(--text-subtle);
}

.empty-icon-wrap svg {
  width: 36px;
  height: 36px;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 24px;
}

/* ==========================================================================
   Modals
   ========================================================================== */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(4, 8, 16, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-card {
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 24px;
  animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.modal-header h3 {
  font-size: 1.2rem;
  font-weight: 800;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
}
.modal-close:hover {
  color: var(--text-main);
  background: var(--bg-tertiary);
}

/* Modal Type Switcher */
.modal-type-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  background: var(--bg-secondary);
  padding: 4px;
  border-radius: var(--radius-md);
  margin-bottom: 20px;
}

.modal-tab {
  height: 36px;
  border-radius: var(--radius-sm);
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--trans-fast);
}

.modal-tab.active {
  background: var(--bg-tertiary);
  color: var(--text-main);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* Modal Form Controls */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.flex-1 { flex: 1; }

.form-group label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 14px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  transition: all var(--trans-fast);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--border-focus);
  background: var(--bg-tertiary);
}

.url-fetch-wrap {
  display: flex;
  gap: 8px;
}

.url-fetch-wrap input {
  flex: 1;
}

.fetch-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 42px;
  padding: 0 16px;
  background: var(--accent-cyan);
  color: #03141c;
  font-size: 0.85rem;
  font-weight: 700;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
}
.fetch-btn:hover {
  background: #22d3ee;
}

.url-preview-box {
  margin-top: 10px;
  padding: 10px;
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  display: flex;
  gap: 12px;
}

.preview-thumb-wrap {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: #020617;
  flex-shrink: 0;
}

.preview-thumb-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview-site {
  font-size: 0.72rem;
  color: var(--accent-cyan);
  font-weight: 700;
}

.preview-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.2;
}

.preview-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Color Radios */
.color-picker-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
}

.color-radio input {
  display: none;
}

.color-dot {
  display: block;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all var(--trans-fast);
}

.color-slate { background: #64748b; }
.color-emerald { background: var(--accent-emerald); }
.color-cyan { background: var(--accent-cyan); }
.color-amber { background: var(--accent-amber); }
.color-rose { background: var(--accent-rose); }
.color-violet { background: var(--accent-violet); }

.color-radio input:checked + .color-dot {
  transform: scale(1.2);
  border-color: #fff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  cursor: pointer;
  user-select: none;
}

/* Interactive checklist inside form */
.checklist-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
}

.checklist-form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
}

.checklist-del-btn {
  background: transparent;
  border: none;
  color: var(--text-subtle);
  cursor: pointer;
}
.checklist-del-btn:hover {
  color: var(--accent-rose);
}

.checklist-add-row {
  display: flex;
  gap: 8px;
}

.add-sub-btn {
  height: 38px;
  padding: 0 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  color: var(--text-main);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

/* ==========================================================================
   Sync Modal & QR Code Styles
   ========================================================================== */

.sync-modal-card {
  max-width: 620px;
}

.sync-modal-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-icon-badge {
  font-size: 1.8rem;
}

.sync-modal-title-group h3 {
  font-size: 1.15rem;
  font-weight: 800;
}

.sync-modal-title-group p {
  font-size: 0.82rem;
  color: var(--text-muted);
}

.sync-modal-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.qr-showcase {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
}

.qr-frame {
  width: 140px;
  height: 140px;
  background: #ffffff;
  padding: 8px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
}

.qr-frame img {
  width: 100%;
  height: 100%;
  display: block;
}

.qr-loading {
  position: absolute;
  font-size: 0.75rem;
  color: #000;
  text-align: center;
}

.qr-caption {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.88rem;
}

.qr-caption strong {
  font-size: 1rem;
  color: var(--accent-emerald);
}

.qr-caption span {
  color: var(--text-muted);
  line-height: 1.4;
}

.sync-link-box label,
.room-switcher-box label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.copy-url-row,
.room-input-row {
  display: flex;
  gap: 8px;
}

.copy-url-row input,
.room-input-row input {
  flex: 1;
  height: 38px;
  padding: 0 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-family: var(--font-mono);
}

.room-hint {
  display: block;
  margin-top: 6px;
  font-size: 0.75rem;
  color: var(--text-subtle);
}

/* Connected Devices */
.connected-devices-box {
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: 14px;
}

.devices-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.devices-header h4 {
  font-size: 0.85rem;
  font-weight: 700;
}

.live-tag {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--accent-emerald);
}

.devices-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.device-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  color: var(--text-main);
  border: 1px solid var(--border-subtle);
}

.device-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-emerald);
}

/* Share Guide */
.share-sheet-guide {
  padding: 12px 16px;
  background: rgba(225, 48, 108, 0.08);
  border: 1px solid rgba(225, 48, 108, 0.2);
  border-radius: var(--radius-md);
  font-size: 0.82rem;
}

.share-sheet-guide h4 {
  font-size: 0.88rem;
  color: #fb7185;
  margin-bottom: 6px;
}

.share-sheet-guide ol {
  padding-left: 20px;
  color: var(--text-muted);
  line-height: 1.5;
}

/* ==========================================================================
   Mobile Bottom Navigation (Responsive Touch Support)
   ========================================================================== */

.mobile-bottom-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 65px;
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid var(--border-subtle);
  z-index: 90;
  padding: 0 16px;
  align-items: center;
  justify-content: space-around;
}

.mobile-nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.7rem;
  min-width: 48px;
  min-height: 48px;
  cursor: pointer;
}

.mobile-nav-btn svg {
  width: 20px;
  height: 20px;
}

.mobile-nav-btn.active {
  color: var(--accent-cyan);
}

.mobile-fab {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #06b6d4 0%, #10b981 100%);
  color: #03141c;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px var(--accent-cyan-glow);
  transform: translateY(-12px);
  cursor: pointer;
}

.mobile-fab svg {
  width: 24px;
  height: 24px;
}

/* ==========================================================================
   Toast Notifications
   ========================================================================== */

.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  min-width: 280px;
  max-width: 380px;
  padding: 12px 18px;
  border-radius: var(--radius-md);
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.88rem;
  animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  transition: all var(--trans-fast);
}

@keyframes toastSlideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.toast.toast-success { border-left: 4px solid var(--accent-emerald); }
.toast.toast-info { border-left: 4px solid var(--accent-cyan); }
.toast.toast-warning { border-left: 4px solid var(--accent-amber); }
.toast.toast-error { border-left: 4px solid var(--accent-rose); }

.toast-icon {
  font-size: 1.2rem;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 700;
  color: var(--text-main);
  font-size: 0.88rem;
}

.toast-desc {
  font-size: 0.78rem;
  color: var(--text-muted);
}

/* Spinner */
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ==========================================================================
   Responsive Breakpoints
   ========================================================================== */

@media (max-width: 900px) {
  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 680px) {
  .app-header {
    padding: 10px 14px;
  }

  .header-actions .btn-label,
  .kbd-shortcut {
    display: none;
  }

  .search-wrapper input {
    padding-right: 32px;
  }

  .main-layout {
    padding: 16px 12px 80px 12px; /* space for bottom bar */
  }

  .items-grid {
    grid-template-columns: 1fr;
  }

  .mobile-bottom-bar {
    display: flex;
  }

  .banner-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .qr-showcase {
    flex-direction: column;
    text-align: center;
  }
}

/* Worldwide Sync Mode Badge */
.sync-mode-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: var(--accent-emerald);
  font-size: 0.76rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  margin-top: 4px;
}

/* Offline sync pending badge */
.offline-pending-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(245, 158, 11, 0.15);
  color: var(--accent-amber);
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-weight: 600;
}

/* Safe area insets for modern mobile screens (iPhone notch & Android gesture bar) */
@supports (padding: max(0px)) {
  .mobile-bottom-bar {
    padding-bottom: max(0px, env(safe-area-inset-bottom));
    height: calc(60px + max(0px, env(safe-area-inset-bottom)));
  }
}

```

---

### File: `public/app.js`
- **Summary:** Test suite: 9 test blocks, test
- **Path:** `public/app.js`
- **Estimated Tokens:** 14,292
- **mtime:** 1792225273.63

```javascript
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
```

---

### File: `public/icons/icon.svg`
- **Summary:** SVG file: 37 lines
- **Path:** `public/icons/icon.svg`
- **Estimated Tokens:** 539
- **mtime:** 1792224319.236

```
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0f19" />
      <stop offset="50%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#022c22" />
    </linearGradient>
    <linearGradient id="glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="50%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#10b981" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Background rounded squircle -->
  <rect width="512" height="512" rx="128" fill="url(#bg-grad)" />
  <rect width="504" height="504" x="4" y="4" rx="124" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="4" />

  <!-- Central Emblem: Synced Note & Pulse -->
  <g filter="url(#shadow)" transform="translate(106, 106)">
    <!-- Main Card Body -->
    <rect x="20" y="20" width="260" height="260" rx="36" fill="#131e33" stroke="url(#glow-grad)" stroke-width="6" />

    <!-- Note lines -->
    <line x1="60" y1="75" x2="170" y2="75" stroke="#38bdf8" stroke-width="8" stroke-linecap="round" />
    <line x1="60" y1="115" x2="230" y2="115" stroke="#94a3b8" stroke-width="7" stroke-linecap="round" />
    <line x1="60" y1="150" x2="200" y2="150" stroke="#64748b" stroke-width="7" stroke-linecap="round" />

    <!-- Sync Nodes / Links -->
    <circle cx="210" cy="210" r="32" fill="#10b981" />
    <path d="M200 205 L210 215 L225 198" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Pulse rings -->
    <path d="M70 215 C90 190, 130 190, 155 215" fill="none" stroke="#06b6d4" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 8" />
  </g>

  <!-- Notification Bell Accent -->
  <circle cx="390" cy="115" r="30" fill="#f59e0b" filter="url(#shadow)" />
  <circle cx="390" cy="115" r="14" fill="#ffffff" />
</svg>
```

---

### File: `public/index.html`
- **Summary:** HTML file: 488 lines
- **Path:** `public/index.html`
- **Estimated Tokens:** 6,291
- **mtime:** 1792225164.037

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>NovaSync — Notes, Reminders & Instant Link Saver</title>
  <meta name="description" content="All-in-one productivity hub for notes taking, smart reminders, and automatic Instagram & web link bookmarking with real-time cross-device sync.">
  <meta name="theme-color" content="#090d16">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="icon" type="image/svg+xml" href="/icons/icon.svg">
  <link rel="apple-touch-icon" href="/icons/icon.svg">

  <!-- Google Fonts: Plus Jakarta Sans & JetBrains Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="/app.css">
</head>
<body>

  <!-- Top Navigation Bar -->
  <header class="app-header">
    <div class="header-container">
      <div class="brand-group">
        <div class="brand-logo">
          <svg class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            <circle cx="12" cy="12" r="9" stroke-width="2" />
          </svg>
          <span class="pulse-indicator"></span>
        </div>
        <div class="brand-text">
          <h1 class="brand-name">Nova<span>Sync</span></h1>
          <span class="brand-badge">PRO REALTIME</span>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="search-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" id="searchInput" placeholder="Search notes, reminders, Instagram reels, tags... (Ctrl+K)" autocomplete="off">
        <button id="clearSearchBtn" class="clear-btn" aria-label="Clear search" style="display: none;">✕</button>
        <kbd class="kbd-shortcut">⌘K</kbd>
      </div>

      <!-- Action Buttons -->
      <div class="header-actions">
        <!-- Live Sync Status Button -->
        <button id="syncModalBtn" class="pill-btn sync-btn" title="Click to pair with your phone or another laptop">
          <span class="sync-dot live" id="syncDot"></span>
          <span class="sync-text" id="syncStatusText">Connecting...</span>
        </button>

        <!-- Install App Button (Auto-shows when installable on Android/iOS/Desktop) -->
        <button id="installAppBtn" class="pill-btn primary" title="Install NovaSync as Native Mobile App" style="display: none;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span class="btn-label">Install App</span>
        </button>

        <!-- Quick Paste Link Button -->
        <button id="quickPasteBtn" class="action-btn icon-btn" title="Paste Instagram or Web Link from Clipboard">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          <span class="btn-label">Paste Link</span>
        </button>

        <!-- New Item Primary Button -->
        <button id="newItemBtn" class="action-btn primary-btn" title="Create Note, Reminder, or Bookmark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>New Item</span>
        </button>

        <!-- Notification Bell Toggle -->
        <button id="notifToggleBtn" class="icon-toggle-btn" title="Enable browser reminder alerts & sounds">
          <svg id="bellIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span id="bellBadge" class="bell-badge" style="display: none;">!</span>
        </button>

        <!-- Theme Toggle -->
        <button id="themeToggleBtn" class="icon-toggle-btn" title="Toggle Dark/Light Mode">
          <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <main class="main-layout">

    <!-- Secondary Banner / Sync Strip -->
    <section class="sync-banner" id="syncBanner">
      <div class="banner-content">
        <div class="banner-info">
          <span class="banner-pill">⚡ Instant Cross-Device Sync</span>
          <span class="banner-text">Room: <strong id="bannerRoomName">MAIN</strong> • Real-time across all your phones, tablets & laptops.</span>
        </div>
        <div class="banner-actions">
          <button id="bannerQrBtn" class="banner-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>Scan QR Code to Pair Phone</span>
          </button>
          <button id="bannerCopyLinkBtn" class="banner-btn secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy Device Link</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Urgent Reminder Alert (Shows when reminders are due soon) -->
    <div id="urgentAlertContainer" class="urgent-alert" style="display: none;">
      <div class="urgent-icon">🔔</div>
      <div class="urgent-info">
        <h4 id="urgentTitle">Reminder Due Soon</h4>
        <p id="urgentTime">in 15 minutes</p>
      </div>
      <div class="urgent-actions">
        <button id="urgentSnoozeBtn" class="pill-btn small">Snooze 15m</button>
        <button id="urgentDoneBtn" class="pill-btn small success">Complete</button>
      </div>
    </div>

    <!-- Quick Add Bar -->
    <section class="quick-add-section">
      <div class="quick-add-card">
        <div class="quick-add-input-row">
          <div class="quick-type-selector">
            <button class="type-chip active" data-type="note" title="Write a Note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              <span>Note</span>
            </button>
            <button class="type-chip" data-type="reminder" title="Set a Reminder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Reminder</span>
            </button>
            <button class="type-chip" data-type="link" title="Save Instagram or Web Link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              <span>Link / Reel</span>
            </button>
          </div>

          <div class="quick-input-box">
            <input type="text" id="quickInput" placeholder="Quickly jot a note, reminder, or paste an Instagram link (e.g. instagram.com/reel/...)..." autocomplete="off">
            <button id="quickSubmitBtn" class="quick-btn-go" title="Save Immediately">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <!-- Detected link preview row -->
        <div id="quickLinkDetected" class="quick-detected-bar" style="display: none;">
          <span class="detected-badge">✨ Link Detected</span>
          <span id="detectedUrlText" class="detected-url"></span>
          <button id="quickSaveDetectedBtn" class="save-link-btn">Save With Full Preview</button>
        </div>
      </div>
    </section>

    <!-- Filter & Categories Tabs -->
    <nav class="categories-nav">
      <div class="tabs-list">
        <button class="tab-btn active" data-tab="all">
          <span class="tab-label">All Items</span>
          <span class="tab-count" id="countAll">0</span>
        </button>
        <button class="tab-btn" data-tab="note">
          <span class="tab-icon">📝</span>
          <span class="tab-label">Notes</span>
          <span class="tab-count" id="countNotes">0</span>
        </button>
        <button class="tab-btn" data-tab="reminder">
          <span class="tab-icon">⏰</span>
          <span class="tab-label">Reminders</span>
          <span class="tab-count" id="countReminders">0</span>
        </button>
        <button class="tab-btn" data-tab="instagram">
          <span class="tab-icon">📸</span>
          <span class="tab-label">Instagram</span>
          <span class="tab-count" id="countInstagram">0</span>
        </button>
        <button class="tab-btn" data-tab="link">
          <span class="tab-icon">🌐</span>
          <span class="tab-label">Saved Links</span>
          <span class="tab-count" id="countLinks">0</span>
        </button>
      </div>

      <!-- Tag Filters Pills -->
      <div class="tags-filter-bar" id="tagsFilterContainer">
        <span class="tags-label">Tags:</span>
        <button class="tag-pill active" data-tag="ALL">All</button>
        <!-- Dynamic tags injected here -->
      </div>
    </nav>

    <!-- Grid / Feed Section -->
    <section class="items-section">
      <!-- Section subheader -->
      <div class="section-subheader">
        <div class="active-filter-title" id="activeFilterTitle">Showing All Items</div>
        <div class="view-controls">
          <button id="sortToggleBtn" class="sort-btn" title="Sort order">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
            <span id="sortLabel">Newest First</span>
          </button>
        </div>
      </div>

      <!-- Items Grid -->
      <div class="items-grid" id="itemsGrid">
        <!-- Rendered items here -->
      </div>

      <!-- Empty State -->
      <div class="empty-state" id="emptyState" style="display: none;">
        <div class="empty-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <h3 id="emptyTitle">No items yet</h3>
        <p id="emptyDesc">Write your first note, schedule a reminder, or paste an Instagram/website link above.</p>
        <button id="emptyCreateBtn" class="action-btn primary-btn">+ Create First Item</button>
      </div>
    </section>

  </main>

  <!-- Floating Mobile Action Bar (for touch screens) -->
  <div class="mobile-bottom-bar">
    <button class="mobile-nav-btn active" data-tab="all">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
      <span>Home</span>
    </button>
    <button class="mobile-nav-btn" data-tab="note">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
      <span>Notes</span>
    </button>
    <button class="mobile-fab" id="mobileFabBtn" title="Create Item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    </button>
    <button class="mobile-nav-btn" data-tab="reminder">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
      <span>Alerts</span>
    </button>
    <button class="mobile-nav-btn" data-tab="instagram">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
      <span>Links</span>
    </button>
    <button class="mobile-nav-btn" id="mobileInstallBtn" title="Install App to Home Screen">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
      <span>Install</span>
    </button>
  </div>

  <!-- MODAL: Create / Edit Item -->
  <div class="modal-overlay" id="itemModalOverlay" style="display: none;">
    <div class="modal-card" id="itemModalCard">
      <div class="modal-header">
        <h3 id="modalTitle">Create New Item</h3>
        <button id="modalCloseBtn" class="modal-close" aria-label="Close modal">✕</button>
      </div>

      <!-- Type Switcher Tabs inside Modal -->
      <div class="modal-type-tabs">
        <button class="modal-tab active" data-mod-type="note">
          <span>📝 Note</span>
        </button>
        <button class="modal-tab" data-mod-type="reminder">
          <span>⏰ Reminder</span>
        </button>
        <button class="modal-tab" data-mod-type="link">
          <span>🔗 Link / Instagram</span>
        </button>
      </div>

      <form id="itemForm" class="modal-form">
        <input type="hidden" id="formItemId" value="">
        <input type="hidden" id="formItemType" value="note">

        <!-- URL Input (shown for link & instagram) -->
        <div class="form-group" id="urlGroup" style="display: none;">
          <label for="formUrl">Link URL (Instagram Reel, Post, or Website)</label>
          <div class="url-fetch-wrap">
            <input type="url" id="formUrl" placeholder="https://www.instagram.com/reel/... or https://example.com">
            <button type="button" id="fetchMetaBtn" class="fetch-btn">
              <span id="fetchBtnSpinner" class="spinner" style="display: none;"></span>
              <span>Fetch Preview</span>
            </button>
          </div>
          <!-- Live Preview Box -->
          <div id="urlPreviewBox" class="url-preview-box" style="display: none;">
            <div class="preview-thumb-wrap">
              <img id="prevImg" src="" alt="Thumbnail preview">
            </div>
            <div class="preview-details">
              <span id="prevSite" class="preview-site">Site</span>
              <h5 id="prevTitle" class="preview-title">Title</h5>
              <p id="prevDesc" class="preview-desc">Description</p>
            </div>
          </div>
        </div>

        <!-- Title -->
        <div class="form-group">
          <label for="formTitle">Title</label>
          <input type="text" id="formTitle" placeholder="e.g. Project brainstorm / Meeting at 3 PM / Instagram Reel" required>
        </div>

        <!-- Content / Notes Textarea -->
        <div class="form-group">
          <label for="formContent">Content / Description (Markdown supported)</label>
          <textarea id="formContent" rows="4" placeholder="Add detailed thoughts, links, or notes..."></textarea>
        </div>

        <!-- Interactive Checklist Manager (for notes & reminders) -->
        <div class="form-group" id="checklistGroup">
          <label>Checklist Tasks</label>
          <div class="checklist-items" id="formChecklistContainer">
            <!-- Dynamic checklist items -->
          </div>
          <div class="checklist-add-row">
            <input type="text" id="newChecklistInput" placeholder="Add checklist task...">
            <button type="button" id="addChecklistBtn" class="add-sub-btn">+ Add Task</button>
          </div>
        </div>

        <!-- Reminder Controls (shown only when type=reminder) -->
        <div class="reminder-fields" id="reminderGroup" style="display: none;">
          <div class="form-row">
            <div class="form-group flex-1">
              <label for="formDueDate">Due Date & Time</label>
              <input type="datetime-local" id="formDueDate">
            </div>
            <div class="form-group flex-1">
              <label for="formPriority">Priority</label>
              <select id="formPriority">
                <option value="low">🟢 Low</option>
                <option value="medium" selected>🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="formRecurrence">Repeat Reminder</label>
            <select id="formRecurrence">
              <option value="none">Does not repeat</option>
              <option value="daily">Every Day</option>
              <option value="weekdays">Every Weekday (Mon-Fri)</option>
              <option value="weekly">Every Week</option>
              <option value="monthly">Every Month</option>
            </select>
          </div>
        </div>

        <!-- Color Theme & Tags -->
        <div class="form-row">
          <div class="form-group flex-1">
            <label>Color Accent</label>
            <div class="color-picker-row">
              <label class="color-radio"><input type="radio" name="colorAccent" value="slate" checked><span class="color-dot color-slate"></span></label>
              <label class="color-radio"><input type="radio" name="colorAccent" value="emerald"><span class="color-dot color-emerald"></span></label>
              <label class="color-radio"><input type="radio" name="colorAccent" value="cyan"><span class="color-dot color-cyan"></span></label>
              <label class="color-radio"><input type="radio" name="colorAccent" value="amber"><span class="color-dot color-amber"></span></label>
              <label class="color-radio"><input type="radio" name="colorAccent" value="rose"><span class="color-dot color-rose"></span></label>
              <label class="color-radio"><input type="radio" name="colorAccent" value="violet"><span class="color-dot color-violet"></span></label>
            </div>
          </div>

          <div class="form-group flex-1">
            <label for="formTags">Tags (comma separated)</label>
            <input type="text" id="formTags" placeholder="Work, Ideas, Recipe, Instagram">
          </div>
        </div>

        <!-- Pin & Status Options -->
        <div class="form-options-row">
          <label class="checkbox-label">
            <input type="checkbox" id="formIsPinned">
            <span>📌 Pin to top of feed</span>
          </label>
        </div>

        <!-- Actions -->
        <div class="modal-footer">
          <button type="button" id="modalCancelBtn" class="pill-btn secondary">Cancel</button>
          <button type="submit" id="modalSaveBtn" class="pill-btn primary">Save Item</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: Cross-Device Sync & QR Code -->
  <div class="modal-overlay" id="syncModalOverlay" style="display: none;">
    <div class="modal-card sync-modal-card">
      <div class="modal-header">
        <div class="sync-modal-title-group">
          <div class="modal-icon-badge">📱↔️💻</div>
          <div>
            <h3>Cross-Device Real-Time Sync</h3>
            <p>Connect your phone, tablet, or another computer instantly</p>
          </div>
        </div>
        <button id="syncModalCloseBtn" class="modal-close" aria-label="Close modal">✕</button>
      </div>

      <div class="sync-modal-body">
        <!-- QR Code Section -->
        <div class="qr-showcase">
          <div class="qr-frame">
            <img id="syncQrImage" src="" alt="Scan QR Code to open NovaSync on your phone">
            <div id="qrLoading" class="qr-loading">Generating QR Code...</div>
          </div>
          <div class="qr-caption">
            <strong>Scan with Phone Camera (4G/5G/Wi-Fi)</strong>
            <span>Secured via HTTPS. Works from anywhere in the world on mobile data or Wi-Fi. Syncs live across all your devices in milliseconds!</span>
            <div class="sync-mode-badge" id="syncModeBadge">🌍 Worldwide Cloud Sync Active</div>
          </div>
        </div>

        <!-- Sync Link Copy Box -->
        <div class="sync-link-box">
          <label>Worldwide Public Sync Link (Open on Any Phone):</label>
          <div class="copy-url-row">
            <input type="text" id="syncUrlDisplay" readonly value="">
            <button id="copySyncUrlBtn" class="pill-btn primary small">Copy Link</button>
          </div>
        </div>

        <!-- Local LAN Fallback Link -->
        <div class="sync-link-box" id="lanLinkBox">
          <label>Home Wi-Fi LAN Fallback:</label>
          <div class="copy-url-row">
            <input type="text" id="lanUrlDisplay" readonly value="">
            <button id="copyLanUrlBtn" class="pill-btn secondary small">Copy LAN</button>
          </div>
        </div>

        <!-- Room Switcher -->
        <div class="room-switcher-box">
          <label>Sync Room Code:</label>
          <div class="room-input-row">
            <input type="text" id="roomCodeInput" placeholder="Enter Room (e.g. MAIN, HOME, WORK)">
            <button id="switchRoomBtn" class="pill-btn secondary small">Switch Room</button>
          </div>
          <span class="room-hint">Devices sharing the same Room Code will automatically sync notes, reminders, and shared links.</span>
        </div>

        <!-- Connected Devices Presence -->
        <div class="connected-devices-box">
          <div class="devices-header">
            <h4>Connected Devices in Room (<span id="connectedCount">1</span>)</h4>
            <span class="live-tag">● Live WebSocket</span>
          </div>
          <div class="devices-list" id="devicesList">
            <!-- Dynamic device pills -->
          </div>
        </div>

        <!-- PWA / Share Target Instructions -->
        <div class="share-sheet-guide">
          <h4>📲 How to Share Directly from Instagram:</h4>
          <ol>
            <li>Open this link on your phone in Chrome / Safari.</li>
            <li>Tap <strong>"Add to Home Screen"</strong> / <strong>"Install App"</strong>.</li>
            <li>Now in Instagram, tap <strong>Share → NovaSync</strong>: your reel or post saves automatically!</li>
          </ol>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast Notifications Container -->
  <div class="toast-container" id="toastContainer"></div>

  <!-- Audio Context Chime Generator (No external audio file needed!) -->
  <script src="/app.js"></script>
</body>
</html>
```

---

### File: `public/manifest.webmanifest`
- **Summary:** WEBMANIFEST file: 29 lines
- **Path:** `public/manifest.webmanifest`
- **Estimated Tokens:** 171
- **mtime:** 1792224330.665

```
{
  "name": "NovaSync - Notes, Reminders & Links",
  "short_name": "NovaSync",
  "description": "Unified Notes, Reminders, and Instant Link Collector with Realtime Cross-Device Sync",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#090d16",
  "theme_color": "#090d16",
  "icons": [
    {
      "src": "/icons/icon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ],
  "share_target": {
    "action": "/share",
    "method": "GET",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url"
    }
  },
  "categories": ["productivity", "utilities"]
}
```

---

### File: `public/sw.js`
- **Summary:** HTTP calls
- **Path:** `public/sw.js`
- **Estimated Tokens:** 303
- **mtime:** 1792224339.302

```javascript
const CACHE_NAME = 'novasync-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/app.css',
  '/app.js',
  '/manifest.webmanifest',
  '/icons/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Network-first for API and WebSocket
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/ws') || url.pathname.startsWith('/share')) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});
```

---

### File: `server.js`
- **Summary:** Test suite: 3 test blocks, test
- **Path:** `server.js`
- **Estimated Tokens:** 7,278
- **mtime:** 1792225934.411

```javascript
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
```

---

### File: `src/App.tsx`
- **Summary:** Test suite: 7 test blocks, test
- **Path:** `src/App.tsx`
- **Estimated Tokens:** 6,870
- **mtime:** 1792225889.684

```typescript
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Item, ItemType, NetworkInfo, DeviceInfo, ToastMessage } from './types';
import {
  fetchItemsApi,
  createItemApi,
  updateItemApi,
  deleteItemApi,
  fetchNetworkInfoApi,
  fetchUrlMetadataApi,
  getBaseApiUrl
} from './services/api';
import { playReminderChime } from './services/audio';
import { Header } from './components/Header';
import { SyncBanner } from './components/SyncBanner';
import { QuickAddBar } from './components/QuickAddBar';
import { ItemCard } from './components/ItemCard';
import { ItemModal } from './components/ItemModal';
import { SyncModal } from './components/SyncModal';
import { ToastContainer } from './components/Toast';
import { FileText, Clock, Link as LinkIcon, Sparkles, Home } from 'lucide-react';
import './styles/app.css';

const InstagramIcon: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 18, style }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" style={style}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// Device detector
function detectDeviceInfo(): DeviceInfo {
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

  const [activeTab, setActiveTab] = useState<ItemType | 'all'>('all');
  const [activeTag, setActiveTag] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
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

  // WebSocket Ref
  const wsRef = useRef<WebSocket | null>(null);
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
  const addToast = (type: ToastMessage['type'], title: string, desc?: string, duration = 4000) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, desc, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  // --- Initial Network Info & Service Worker ---
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => console.warn('SW register:', err));
    }

    // Check incoming share
    const params = new URLSearchParams(window.location.search);
    if (params.get('shared') === 'success') {
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

    return () => window.removeEventListener('beforeinstallprompt', installHandler);
  }, []);

  // --- Network Info Fetch ---
  const loadNetworkInfo = async () => {
    try {
      const data = await fetchNetworkInfoApi(room);
      setNetworkInfo(data);
    } catch (err) {
      console.warn('Network info unavailable (offline or standalone):', err);
    }
  };

  useEffect(() => {
    loadNetworkInfo();
  }, [room]);

  // --- Load Items ---
  const loadItems = async () => {
    try {
      const data = await fetchItemsApi(room);
      setItems(data);
    } catch (err) {
      console.warn('Using local cache items:', err);
    }
  };

  useEffect(() => {
    loadItems();
  }, [room]);

  // --- WebSocket Connection ---
  useEffect(() => {
    let active = true;
    const base = getBaseApiUrl();
    let wsUrl = '';

    if (base && base.startsWith('http')) {
      wsUrl = base.replace(/^http/, 'ws') + '/ws';
    } else {
      const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      wsUrl = `${proto}//${window.location.host}/ws`;
    }

    let socket: WebSocket;
    try {
      socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        if (!active) return;
        setWsConnected(true);
        socket.send(
          JSON.stringify({
            action: 'join_room',
            room,
            deviceInfo
          })
        );
      };

      socket.onmessage = (event) => {
        if (!active) return;
        try {
          const msg = JSON.parse(event.data);
          if (msg.action === 'presence_update') {
            setConnectedDevices(msg.devices || []);
          } else if (msg.action === 'item_created') {
            setItems((prev) => {
              if (prev.some((i) => i.id === msg.item.id)) return prev;
              return [msg.item, ...prev];
            });
            addToast('info', 'Synced from Device', `"${msg.item.title.slice(0, 30)}..." added.`);
          } else if (msg.action === 'item_updated') {
            setItems((prev) => prev.map((i) => (i.id === msg.item.id ? msg.item : i)));
          } else if (msg.action === 'item_deleted') {
            setItems((prev) => prev.filter((i) => i.id !== msg.id));
            addToast('info', 'Item Removed', 'Deleted on another device.');
          } else if (msg.action === 'tunnel_update') {
            loadNetworkInfo();
            addToast('info', 'Worldwide Sync Ready', 'Cloud HTTPS tunnel connected!');
          }
        } catch (e) {
          console.warn('WS message parse error:', e);
        }
      };

      socket.onclose = () => {
        if (!active) return;
        setWsConnected(false);
      };

      socket.onerror = () => {
        if (!active) return;
        setWsConnected(false);
      };
    } catch (e) {
      console.warn('WebSocket connection error:', e);
    }

    return () => {
      active = false;
      if (wsRef.current) wsRef.current.close();
    };
  }, [room]);

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
  }, [items]);

  // --- Item Operations ---
  const handleSaveItem = async (itemData: Partial<Item>) => {
    const isEdit = Boolean(itemData.id);
    try {
      let saved: Item;
      if (isEdit) {
        saved = await updateItemApi(itemData.id!, itemData);
        setItems((prev) => prev.map((i) => (i.id === saved.id ? saved : i)));
        addToast('success', 'Updated', 'Changes saved and synced.');
      } else {
        saved = await createItemApi({ ...itemData, sync_room: room });
        setItems((prev) => {
          if (prev.some((i) => i.id === saved.id)) return prev;
          return [saved, ...prev];
        });
        addToast('success', 'Created', 'Saved and synced.');
      }
      setIsItemModalOpen(false);
    } catch (err: any) {
      // Optimistic offline fallback
      const offlineItem: Item = {
        id: itemData.id || 'offline_' + Date.now(),
        sync_room: room,
        type: itemData.type || 'note',
        title: itemData.title || 'Untitled',
        content: itemData.content || '',
        url: itemData.url || '',
        tags: itemData.tags || [],
        color: itemData.color || 'slate',
        is_pinned: itemData.is_pinned || false,
        is_completed: itemData.is_completed || false,
        due_date: itemData.due_date || null,
        reminder_recurrence: itemData.reminder_recurrence || 'none',
        priority: itemData.priority || 'medium',
        checklist: itemData.checklist || [],
        created_at: Date.now(),
        updated_at: Date.now(),
        _offline_pending: true
      };

      setItems((prev) => [offlineItem, ...prev]);
      setIsItemModalOpen(false);
      addToast('warning', 'Saved Locally', 'Saved offline. Will sync when connected.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteItemApi(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      addToast('info', 'Deleted', 'Item removed.');
    } catch {
      setItems((prev) => prev.filter((i) => i.id !== id));
      addToast('info', 'Deleted Locally', 'Removed from local cache.');
    }
  };

  const handleTogglePin = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const nextPin = !item.is_pinned;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, is_pinned: nextPin } : i)));
    try {
      await updateItemApi(id, { is_pinned: nextPin });
    } catch (e) {
      console.warn('Pin sync error:', e);
    }
  };

  const handleToggleComplete = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const nextComp = !item.is_completed;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, is_completed: nextComp } : i)));
    try {
      await updateItemApi(id, { is_completed: nextComp });
    } catch (e) {
      console.warn('Complete sync error:', e);
    }
  };

  const handleToggleChecklist = async (itemId: string, index: number) => {
    const item = items.find((i) => i.id === itemId);
    if (!item || !item.checklist || !item.checklist[index]) return;

    const nextChecklist = [...item.checklist];
    nextChecklist[index].done = !nextChecklist[index].done;

    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, checklist: nextChecklist } : i)));
    try {
      await updateItemApi(itemId, { checklist: nextChecklist });
    } catch (e) {
      console.warn('Checklist sync error:', e);
    }
  };

  const handleSnooze = async (id: string, mins: number) => {
    const newDueDate = new Date(Date.now() + mins * 60000).toISOString();
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, due_date: newDueDate, is_completed: false } : i))
    );
    triggeredReminderIds.current.delete(id);
    setUrgentReminder(null);
    addToast('info', 'Snoozed', `Reminder snoozed for ${mins} minutes.`);
    try {
      await updateItemApi(id, { due_date: newDueDate, is_completed: false });
    } catch (e) {
      console.warn('Snooze sync error:', e);
    }
  };

  const handleQuickSubmit = async (text: string, type: ItemType, detectedUrl: string | null) => {
    const itemData: Partial<Item> = {
      type,
      title: text.slice(0, 100),
      content: text,
      url: detectedUrl || '',
      color: type === 'instagram' ? 'rose' : (type === 'link' ? 'cyan' : 'slate')
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
      return sortOrder === 'newest' ? b.updated_at - a.updated_at : a.updated_at - b.updated_at;
    });

    return list;
  }, [items, activeTab, activeTag, searchQuery, sortOrder]);

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
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        theme={theme}
        wsConnected={wsConnected}
        connectedCount={connectedDevices.length || 1}
        installPromptAvailable={installPromptAvailable}
        onTriggerInstall={handleTriggerInstall}
      />

      {/* Main Layout */}
      <main className="main-layout">
        {/* Sync Banner */}
        <SyncBanner
          room={room}
          syncUrl={networkInfo?.syncUrl || ''}
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
                Complete
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
              {activeTab === 'all' && 'Showing All Items'}
              {activeTab === 'note' && 'Showing Notes'}
              {activeTab === 'reminder' && 'Showing Reminders'}
              {activeTab === 'instagram' && 'Showing Instagram Reels & Posts'}
              {activeTab === 'link' && 'Showing Saved Links'}
              {activeTag !== 'ALL' && ` • #${activeTag}`}
              {searchQuery && ` • Search: "${searchQuery}"`}
            </div>
            <button
              className="sort-btn"
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            >
              <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>

          {/* Cards Grid */}
          {filteredItems.length > 0 ? (
            <div className="items-grid">
              {filteredItems.map((item) => (
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
          ) : (
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

      {/* Mobile Bottom Navigation */}
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
        onCopyUrl={(u) => {
          navigator.clipboard.writeText(u);
          addToast('success', 'Copied!', 'Link copied.');
        }}
        onServerConfigChanged={() => {
          loadItems();
          loadNetworkInfo();
          addToast('info', 'Server Config Saved', 'Reconnecting to sync endpoint.');
        }}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} />
    </div>
  );
};
```

---

### File: `src/components/Header.tsx`
- **Summary:** React component: Header
- **Path:** `src/components/Header.tsx`
- **Estimated Tokens:** 952
- **mtime:** 1792225701.383

```typescript
import React from 'react';
import { Search, Plus, Link, Bell, Sun, Moon, Download } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenSyncModal: () => void;
  onOpenCreateModal: () => void;
  onQuickPaste: () => void;
  onRequestNotifications: () => void;
  onToggleTheme: () => void;
  theme: 'dark' | 'light';
  wsConnected: boolean;
  connectedCount: number;
  installPromptAvailable: boolean;
  onTriggerInstall: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenSyncModal,
  onOpenCreateModal,
  onQuickPaste,
  onRequestNotifications,
  onToggleTheme,
  theme,
  wsConnected,
  connectedCount,
  installPromptAvailable,
  onTriggerInstall
}) => {
  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand Group */}
        <div className="brand-group" onClick={onOpenSyncModal}>
          <div className="brand-logo">
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#041014' }}>⚡</span>
            <span className="pulse-indicator"></span>
          </div>
          <div className="brand-text">
            <h1 className="brand-name">Nova<span>Sync</span></h1>
            <span className="brand-badge">PRO REALTIME</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            id="searchInput"
            placeholder="Search notes, reminders, Instagram reels, tags... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            autoComplete="off"
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => onSearchChange('')}>
              ✕
            </button>
          )}
          <kbd className="kbd-shortcut">⌘K</kbd>
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Live Sync Pill */}
          <button className="pill-btn sync-btn" onClick={onOpenSyncModal} title="Pair device or switch sync room">
            <span className={`sync-dot ${wsConnected ? 'live' : 'offline'}`}></span>
            <span className="sync-text">
              {wsConnected ? `Synced (${connectedCount} online)` : 'Offline'}
            </span>
          </button>

          {/* Install Mobile PWA Button */}
          {installPromptAvailable && (
            <button className="pill-btn primary" onClick={onTriggerInstall} title="Install NovaSync as Native Mobile App">
              <Download size={16} />
              <span className="btn-label">Install App</span>
            </button>
          )}

          {/* Quick Paste Button */}
          <button className="action-btn icon-btn" onClick={onQuickPaste} title="Paste Instagram or Web Link from Clipboard">
            <Link size={16} />
            <span className="btn-label">Paste Link</span>
          </button>

          {/* New Item Button */}
          <button className="action-btn primary-btn" onClick={onOpenCreateModal} title="Create Note, Reminder, or Link">
            <Plus size={18} />
            <span>New Item</span>
          </button>

          {/* Notification Alert Bell */}
          <button className="icon-toggle-btn" onClick={onRequestNotifications} title="Enable browser alerts & sound">
            <Bell size={18} />
          </button>

          {/* Dark / Light Mode Toggle */}
          <button className="icon-toggle-btn" onClick={onToggleTheme} title="Toggle Dark/Light Mode">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};
```

---

### File: `src/components/ItemCard.tsx`
- **Summary:** React component: ItemCard
- **Path:** `src/components/ItemCard.tsx`
- **Estimated Tokens:** 2,250
- **mtime:** 1792225742.637

```typescript
import React from 'react';
import { Item } from '../types';
import { Pin, Edit3, Trash2, ExternalLink, Play, Copy, Check, Clock } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onToggleChecklist: (itemId: string, index: number) => void;
  onSnooze: (id: string, mins: number) => void;
  onTagClick: (tag: string) => void;
  onCopyUrl: (url: string) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleComplete,
  onToggleChecklist,
  onSnooze,
  onTagClick,
  onCopyUrl
}) => {
  // Format relative time
  const formatTime = (ts: number): string => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Reminder countdown logic
  const getReminderCountdown = () => {
    if (!item.due_date) return { text: 'No due date', urgency: 'upcoming' };
    const now = Date.now();
    const due = new Date(item.due_date).getTime();
    const diffMins = Math.round((due - now) / 60000);

    if (item.is_completed) {
      return { text: 'Completed ✓', urgency: 'completed' };
    }
    if (diffMins < 0) {
      return { text: `Overdue by ${Math.abs(diffMins)}m`, urgency: 'urgent' };
    }
    if (diffMins <= 60) {
      return { text: `Due in ${diffMins} mins`, urgency: 'urgent' };
    }
    if (diffMins <= 1440) {
      const timeStr = new Date(due).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return { text: `Today at ${timeStr}`, urgency: 'today' };
    }
    return {
      text: new Date(due).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      urgency: 'upcoming'
    };
  };

  const reminderInfo = item.type === 'reminder' ? getReminderCountdown() : null;

  return (
    <article className={`item-card color-${item.color || 'slate'} type-${item.type}`}>
      {/* Top Header: Badge + Actions */}
      <div className="card-top">
        {item.type === 'note' && <span className="card-badge type-note">📝 Note</span>}
        {item.type === 'reminder' && <span className="card-badge type-reminder">⏰ Reminder</span>}
        {item.type === 'instagram' && (
          <span className="card-badge type-instagram">
            📸 Instagram {item.metadata?.igType === 'reel' ? 'Reel' : 'Post'}
          </span>
        )}
        {item.type === 'link' && <span className="card-badge type-link">🌐 Link</span>}

        <div className="card-top-actions">
          {item._offline_pending && (
            <span className="offline-pending-badge" title="Pending sync to cloud">
              ⏳ Offline
            </span>
          )}

          <button
            className={`card-icon-btn ${item.is_pinned ? 'pinned' : ''}`}
            title={item.is_pinned ? 'Unpin' : 'Pin to top'}
            onClick={() => onTogglePin(item.id)}
          >
            <Pin size={15} fill={item.is_pinned ? 'currentColor' : 'none'} />
          </button>
          <button className="card-icon-btn" title="Edit Item" onClick={() => onEdit(item)}>
            <Edit3 size={15} />
          </button>
          <button className="card-icon-btn danger" title="Delete" onClick={() => onDelete(item.id)}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="card-title">{item.title}</h3>

      {/* Instagram Media Card */}
      {item.type === 'instagram' && (
        <div className="instagram-card-body">
          <div className="ig-media-thumb">
            <img
              src={item.metadata?.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'}
              alt="Instagram Preview"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
              }}
            />
            {item.metadata?.igType === 'reel' && (
              <div className="ig-play-overlay">
                <div className="ig-play-circle">
                  <Play size={18} fill="#000" />
                </div>
              </div>
            )}
          </div>
          <div className="ig-action-bar">
            <a
              href={item.metadata?.cleanUrl || item.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="open-ig-btn"
            >
              <ExternalLink size={14} />
              <span>Open in Instagram</span>
            </a>
            {item.url && (
              <button className="copy-url-btn" onClick={() => onCopyUrl(item.url!)}>
                Copy Link
              </button>
            )}
          </div>
        </div>
      )}

      {/* Website Link Bookmark Card */}
      {item.type === 'link' && (
        <div className="link-card-body">
          {item.metadata?.image && (
            <div className="link-thumb">
              <img src={item.metadata.image} alt="Site Thumbnail" loading="lazy" />
            </div>
          )}
          <div className="link-info">
            <div className="link-domain">
              {item.metadata?.favicon && (
                <img
                  className="domain-favicon"
                  src={item.metadata.favicon}
                  alt="Favicon"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              )}
              <span>{item.metadata?.siteName || (item.url ? new URL(item.url).hostname : 'Web Link')}</span>
            </div>
            {item.metadata?.description && <p className="link-desc">{item.metadata.description}</p>}
          </div>
          <div className="ig-action-bar">
            <a
              href={item.metadata?.cleanUrl || item.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="pill-btn primary small"
            >
              Visit Website ↗
            </a>
            {item.url && (
              <button className="copy-url-btn" onClick={() => onCopyUrl(item.url!)}>
                Copy URL
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reminder Strip */}
      {item.type === 'reminder' && reminderInfo && (
        <div className="reminder-status-strip">
          <div className={`due-countdown ${reminderInfo.urgency}`}>
            <Clock size={15} />
            <span>{reminderInfo.text}</span>
          </div>
          <div className="reminder-quick-actions">
            {!item.is_completed && (
              <button className="snooze-btn" onClick={() => onSnooze(item.id, 15)}>
                +15m
              </button>
            )}
            <button
              className={`pill-btn small ${item.is_completed ? 'secondary' : 'success'}`}
              onClick={() => onToggleComplete(item.id)}
            >
              {item.is_completed ? 'Undo' : 'Done'}
            </button>
          </div>
        </div>
      )}

      {/* Content / Markdown Text */}
      {item.content && <div className="card-content">{item.content}</div>}

      {/* Interactive Checklist */}
      {Array.isArray(item.checklist) && item.checklist.length > 0 && (
        <div className="card-checklist">
          {item.checklist.map((task, index) => (
            <label key={index} className={`checklist-row ${task.done ? 'done' : ''}`}>
              <input
                type="checkbox"
                className="checklist-checkbox"
                checked={task.done}
                onChange={() => onToggleChecklist(item.id, index)}
              />
              <span className="checklist-text">{task.text}</span>
            </label>
          ))}
        </div>
      )}

      {/* Tags */}
      {Array.isArray(item.tags) && item.tags.length > 0 && (
        <div className="card-tags">
          {item.tags.map((tag) => (
            <span key={tag} className="card-tag" onClick={() => onTagClick(tag)}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="card-footer">
        <span>Updated {formatTime(item.updated_at)}</span>
        <div className="card-footer-actions">
          {item.url && (
            <button className="btn-card-action" onClick={() => onCopyUrl(item.url!)}>
              <Copy size={13} style={{ display: 'inline', marginRight: 4 }} />
              Copy
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
```

---

### File: `src/components/ItemModal.tsx`
- **Summary:** Test suite: 1 test blocks, test
- **Path:** `src/components/ItemModal.tsx`
- **Estimated Tokens:** 3,233
- **mtime:** 1792225766.217

```typescript
import React, { useState, useEffect } from 'react';
import { Item, ItemType, ColorAccent, PriorityLevel, RecurrenceRule, ChecklistTask, UrlMetadata } from '../types';
import { fetchUrlMetadataApi } from '../services/api';
import { X, Loader2 } from 'lucide-react';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Partial<Item>) => void;
  editingItem: Item | null;
  defaultType?: ItemType;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  defaultType = 'note'
}) => {
  const [type, setType] = useState<ItemType>(defaultType);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [color, setColor] = useState<ColorAccent>('slate');
  const [isPinned, setIsPinned] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [recurrence, setRecurrence] = useState<RecurrenceRule>('none');
  const [checklist, setChecklist] = useState<ChecklistTask[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [metadata, setMetadata] = useState<UrlMetadata | null>(null);
  const [fetchingMeta, setFetchingMeta] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setType(editingItem.type);
      setTitle(editingItem.title);
      setContent(editingItem.content || '');
      setUrl(editingItem.url || '');
      setTagsStr((editingItem.tags || []).join(', '));
      setColor(editingItem.color || 'slate');
      setIsPinned(editingItem.is_pinned);
      setChecklist(editingItem.checklist || []);
      setMetadata(editingItem.metadata || null);

      if (editingItem.due_date) {
        const d = new Date(editingItem.due_date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        setDueDate(d.toISOString().slice(0, 16));
      } else {
        setDueDate('');
      }
      setPriority(editingItem.priority || 'medium');
      setRecurrence(editingItem.reminder_recurrence || 'none');
    } else {
      setType(defaultType);
      setTitle('');
      setContent('');
      setUrl('');
      setTagsStr('');
      setColor(defaultType === 'instagram' ? 'rose' : (defaultType === 'link' ? 'cyan' : 'slate'));
      setIsPinned(false);
      setChecklist([]);
      setMetadata(null);

      // Default due date to 2 hours from now
      const nextDate = new Date(Date.now() + 2 * 3600000);
      nextDate.setMinutes(nextDate.getMinutes() - nextDate.getTimezoneOffset());
      setDueDate(nextDate.toISOString().slice(0, 16));
      setPriority('medium');
      setRecurrence('none');
    }
  }, [editingItem, defaultType, isOpen]);

  if (!isOpen) return null;

  const handleFetchPreview = async () => {
    if (!url.trim()) return;
    setFetchingMeta(true);
    try {
      const meta = await fetchUrlMetadataApi(url);
      setMetadata(meta);
      if (!title.trim() && meta.title) {
        setTitle(meta.title);
      }
      if (/instagram\.com/i.test(url)) {
        setType('instagram');
      }
    } catch (e) {
      console.warn('Metadata preview error:', e);
    } finally {
      setFetchingMeta(false);
    }
  };

  const handleAddChecklistTask = () => {
    if (!newChecklistText.trim()) return;
    setChecklist([...checklist, { text: newChecklistText.trim(), done: false }]);
    setNewChecklistText('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const itemData: Partial<Item> = {
      id: editingItem?.id,
      type,
      title: title.trim(),
      content: content.trim(),
      url: url.trim(),
      metadata: metadata || undefined,
      tags,
      color,
      is_pinned: isPinned,
      checklist
    };

    if (type === 'reminder') {
      itemData.due_date = dueDate ? new Date(dueDate).toISOString() : null;
      itemData.priority = priority;
      itemData.reminder_recurrence = recurrence;
    }

    onSave(itemData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editingItem ? 'Edit Item' : 'Create New Item'}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Type Switcher Tabs */}
        <div className="modal-type-tabs">
          <button
            type="button"
            className={`modal-tab ${type === 'note' ? 'active' : ''}`}
            onClick={() => setType('note')}
          >
            <span>📝 Note</span>
          </button>
          <button
            type="button"
            className={`modal-tab ${type === 'reminder' ? 'active' : ''}`}
            onClick={() => setType('reminder')}
          >
            <span>⏰ Reminder</span>
          </button>
          <button
            type="button"
            className={`modal-tab ${type === 'link' || type === 'instagram' ? 'active' : ''}`}
            onClick={() => setType('link')}
          >
            <span>🔗 Link / Instagram</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* URL Input (for Link and Instagram) */}
          {(type === 'link' || type === 'instagram') && (
            <div className="form-group">
              <label htmlFor="formUrl">Link URL (Instagram Reel, Post, or Web Page)</label>
              <div className="url-fetch-wrap">
                <input
                  type="url"
                  id="formUrl"
                  placeholder="https://www.instagram.com/reel/... or https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  autoFocus
                />
                <button type="button" className="fetch-btn" onClick={handleFetchPreview} disabled={fetchingMeta}>
                  {fetchingMeta ? <Loader2 size={16} className="spinner" /> : <span>Fetch Preview</span>}
                </button>
              </div>

              {metadata && (
                <div className="url-preview-box">
                  {metadata.image && (
                    <div className="preview-thumb-wrap">
                      <img src={metadata.image} alt="Preview" />
                    </div>
                  )}
                  <div className="preview-details">
                    <span className="preview-site">{metadata.siteName || 'Link Preview'}</span>
                    <h5 className="preview-title">{metadata.title}</h5>
                    {metadata.description && <p className="preview-desc">{metadata.description}</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Title */}
          <div className="form-group">
            <label htmlFor="formTitle">Title</label>
            <input
              type="text"
              id="formTitle"
              placeholder="e.g. Project brainstorm / Meeting at 3 PM / Instagram Reel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Content / Markdown Textarea */}
          <div className="form-group">
            <label htmlFor="formContent">Content / Description (Markdown supported)</label>
            <textarea
              id="formContent"
              rows={4}
              placeholder="Add detailed thoughts, links, or notes..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Checklist Manager */}
          <div className="form-group">
            <label>Checklist Tasks</label>
            <div className="checklist-items">
              {checklist.map((item, idx) => (
                <div key={idx} className="checklist-form-item">
                  <span>{item.text}</span>
                  <button
                    type="button"
                    className="checklist-del-btn"
                    onClick={() => setChecklist(checklist.filter((_, i) => i !== idx))}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="checklist-add-row">
              <input
                type="text"
                placeholder="Add checklist task..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistTask();
                  }
                }}
              />
              <button type="button" className="add-sub-btn" onClick={handleAddChecklistTask}>
                + Add Task
              </button>
            </div>
          </div>

          {/* Reminder Specific Fields */}
          {type === 'reminder' && (
            <div className="reminder-fields">
              <div className="form-row">
                <div className="form-group flex-1">
                  <label htmlFor="formDueDate">Due Date & Time</label>
                  <input
                    type="datetime-local"
                    id="formDueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <div className="form-group flex-1">
                  <label htmlFor="formPriority">Priority</label>
                  <select
                    id="formPriority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="formRecurrence">Repeat Reminder</label>
                <select
                  id="formRecurrence"
                  value={recurrence}
                  onChange={(e) => setRecurrence(e.target.value as RecurrenceRule)}
                >
                  <option value="none">Does not repeat</option>
                  <option value="daily">Every Day</option>
                  <option value="weekdays">Every Weekday (Mon-Fri)</option>
                  <option value="weekly">Every Week</option>
                  <option value="monthly">Every Month</option>
                </select>
              </div>
            </div>
          )}

          {/* Color & Tags */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label>Color Accent</label>
              <div className="color-picker-row">
                {(['slate', 'emerald', 'cyan', 'amber', 'rose', 'violet'] as ColorAccent[]).map((c) => (
                  <label key={c} className="color-radio">
                    <input
                      type="radio"
                      name="colorAccent"
                      value={c}
                      checked={color === c}
                      onChange={() => setColor(c)}
                    />
                    <span className={`color-dot color-${c}`} />
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group flex-1">
              <label htmlFor="formTags">Tags (comma separated)</label>
              <input
                type="text"
                id="formTags"
                placeholder="Work, Ideas, Recipe, Instagram"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
              />
            </div>
          </div>

          {/* Pin Option */}
          <div className="form-options-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
              />
              <span>📌 Pin to top of feed</span>
            </label>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button type="button" className="pill-btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="pill-btn primary">
              Save Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
```

---

### File: `src/components/QuickAddBar.tsx`
- **Summary:** Test suite: 1 test blocks, test
- **Path:** `src/components/QuickAddBar.tsx`
- **Estimated Tokens:** 838
- **mtime:** 1792225721.128

```typescript
import React, { useState } from 'react';
import { FileText, Clock, Link as LinkIcon, ArrowRight, Sparkles } from 'lucide-react';
import { ItemType } from '../types';

interface QuickAddBarProps {
  onQuickSubmit: (text: string, type: ItemType, detectedUrl: string | null) => void;
  onOpenWithUrl: (url: string) => void;
}

export const QuickAddBar: React.FC<QuickAddBarProps> = ({ onQuickSubmit, onOpenWithUrl }) => {
  const [activeType, setActiveType] = useState<ItemType>('note');
  const [text, setText] = useState('');

  const extractUrl = (str: string): string | null => {
    const match = str.match(/(https?:\/\/[^\s]+)/i);
    return match ? match[0] : null;
  };

  const detectedUrl = extractUrl(text);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    let finalType = activeType;
    if (detectedUrl) {
      finalType = /instagram\.com/i.test(detectedUrl) ? 'instagram' : 'link';
    }

    onQuickSubmit(text.trim(), finalType, detectedUrl);
    setText('');
  };

  return (
    <section className="quick-add-section">
      <div className="quick-add-card">
        <form onSubmit={handleSubmit} className="quick-add-input-row">
          <div className="quick-type-selector">
            <button
              type="button"
              className={`type-chip ${activeType === 'note' ? 'active' : ''}`}
              onClick={() => setActiveType('note')}
            >
              <FileText size={14} />
              <span>Note</span>
            </button>
            <button
              type="button"
              className={`type-chip ${activeType === 'reminder' ? 'active' : ''}`}
              onClick={() => setActiveType('reminder')}
            >
              <Clock size={14} />
              <span>Reminder</span>
            </button>
            <button
              type="button"
              className={`type-chip ${activeType === 'link' || activeType === 'instagram' ? 'active' : ''}`}
              onClick={() => setActiveType('link')}
            >
              <LinkIcon size={14} />
              <span>Link / Reel</span>
            </button>
          </div>

          <div className="quick-input-box">
            <input
              type="text"
              placeholder="Quickly jot a note, reminder, or paste an Instagram link (e.g. instagram.com/reel/...)..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" className="quick-btn-go" title="Save Immediately">
              <ArrowRight size={16} />
            </button>
          </div>
        </form>

        {detectedUrl && (
          <div className="quick-detected-bar">
            <span className="detected-badge">
              <Sparkles size={12} style={{ display: 'inline', marginRight: 4 }} />
              Link Detected
            </span>
            <span className="detected-url">{detectedUrl}</span>
            <button
              type="button"
              className="save-link-btn"
              onClick={() => {
                onOpenWithUrl(detectedUrl);
                setText('');
              }}
            >
              Save With Full Preview
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
```

---

### File: `src/components/SyncBanner.tsx`
- **Summary:** React component: SyncBanner
- **Path:** `src/components/SyncBanner.tsx`
- **Estimated Tokens:** 281
- **mtime:** 1792225709.917

```typescript
import React from 'react';
import { QrCode, Copy } from 'lucide-react';

interface SyncBannerProps {
  room: string;
  syncUrl: string;
  onOpenSyncModal: () => void;
  onCopySyncLink: () => void;
}

export const SyncBanner: React.FC<SyncBannerProps> = ({
  room,
  onOpenSyncModal,
  onCopySyncLink
}) => {
  return (
    <section className="sync-banner">
      <div className="banner-content">
        <div className="banner-info">
          <span className="banner-pill">⚡ Instant Cross-Device Sync</span>
          <span className="banner-text">
            Room: <strong>{room}</strong> • Real-time across all your phones, tablets & laptops worldwide.
          </span>
        </div>
        <div className="banner-actions">
          <button className="banner-btn" onClick={onOpenSyncModal}>
            <QrCode size={16} />
            <span>Scan QR Code to Pair Phone</span>
          </button>
          <button className="banner-btn secondary" onClick={onCopySyncLink}>
            <Copy size={16} />
            <span>Copy Device Link</span>
          </button>
        </div>
      </div>
    </section>
  );
};
```

---

### File: `src/components/SyncModal.tsx`
- **Summary:** React component: SyncModal; hooks: useState
- **Path:** `src/components/SyncModal.tsx`
- **Estimated Tokens:** 2,027
- **mtime:** 1792225784.469

```typescript
import React, { useState } from 'react';
import { NetworkInfo, DeviceInfo } from '../types';
import { setCustomServerUrl, getBaseApiUrl } from '../services/api';
import { X, Copy, Server, Smartphone } from 'lucide-react';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  networkInfo: NetworkInfo | null;
  room: string;
  onSwitchRoom: (newRoom: string) => void;
  connectedCount: number;
  devices: DeviceInfo[];
  onCopyUrl: (url: string) => void;
  onServerConfigChanged: () => void;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  onClose,
  networkInfo,
  room,
  onSwitchRoom,
  connectedCount,
  devices,
  onCopyUrl,
  onServerConfigChanged
}) => {
  const [inputRoom, setInputRoom] = useState(room);
  const [customServerInput, setCustomServerInput] = useState(getBaseApiUrl());
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!isOpen) return null;

  const handleRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRoom.trim()) {
      onSwitchRoom(inputRoom.trim().toUpperCase());
    }
  };

  const handleSaveCustomServer = () => {
    setCustomServerUrl(customServerInput.trim());
    onServerConfigChanged();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card sync-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="sync-modal-title-group">
            <div className="modal-icon-badge">📱↔️💻</div>
            <div>
              <h3>Cross-Device Real-Time Sync</h3>
              <p>Connect your phone, tablet, or another computer instantly</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="sync-modal-body">
          {/* QR Code Section */}
          <div className="qr-showcase">
            <div className="qr-frame">
              {networkInfo?.qrDataUrl ? (
                <img src={networkInfo.qrDataUrl} alt="Scan QR Code to open NovaSync on your phone" />
              ) : (
                <div className="qr-loading">Generating QR Code...</div>
              )}
            </div>
            <div className="qr-caption">
              <strong>Scan with Phone Camera (4G/5G/Wi-Fi)</strong>
              <span>
                Secured via HTTPS. Works from anywhere in the world on mobile data or Wi-Fi. Syncs live across all your devices in milliseconds!
              </span>
              <div className="sync-mode-badge">
                🌍 Worldwide Cloud Sync Active
              </div>
            </div>
          </div>

          {/* Worldwide Public Sync Link */}
          <div className="sync-link-box">
            <label>Worldwide Public Sync Link (Open on Any Phone):</label>
            <div className="copy-url-row">
              <input type="text" readOnly value={networkInfo?.syncUrl || ''} />
              <button
                type="button"
                className="pill-btn primary small"
                onClick={() => networkInfo?.syncUrl && onCopyUrl(networkInfo.syncUrl)}
              >
                <Copy size={13} style={{ display: 'inline', marginRight: 4 }} />
                Copy Link
              </button>
            </div>
          </div>

          {/* Local LAN Fallback Link */}
          {networkInfo?.lanSyncUrl && (
            <div className="sync-link-box">
              <label>Home Wi-Fi LAN Fallback:</label>
              <div className="copy-url-row">
                <input type="text" readOnly value={networkInfo.lanSyncUrl} />
                <button
                  type="button"
                  className="pill-btn secondary small"
                  onClick={() => onCopyUrl(networkInfo.lanSyncUrl!)}
                >
                  <Copy size={13} style={{ display: 'inline', marginRight: 4 }} />
                  Copy LAN
                </button>
              </div>
            </div>
          )}

          {/* Room Switcher */}
          <div className="room-switcher-box">
            <label>Sync Room Code:</label>
            <form onSubmit={handleRoomSubmit} className="room-input-row">
              <input
                type="text"
                placeholder="Enter Room (e.g. MAIN, HOME, WORK)"
                value={inputRoom}
                onChange={(e) => setInputRoom(e.target.value.toUpperCase())}
              />
              <button type="submit" className="pill-btn secondary small">
                Switch Room
              </button>
            </form>
            <span className="room-hint">
              Devices sharing the same Room Code will automatically sync notes, reminders, and shared links.
            </span>
          </div>

          {/* Connected Devices Presence */}
          <div className="connected-devices-box">
            <div className="devices-header">
              <h4>Connected Devices in Room ({connectedCount})</h4>
              <span className="live-tag">● Live WebSocket</span>
            </div>
            <div className="devices-list">
              {devices.length > 0 ? (
                devices.map((dev) => (
                  <span key={dev.id} className="device-pill">
                    <span className="device-dot"></span>
                    <span>{dev.name} ({dev.platform})</span>
                  </span>
                ))
              ) : (
                <span className="device-pill">
                  <span className="device-dot"></span>
                  <span>This Device</span>
                </span>
              )}
            </div>
          </div>

          {/* Mobile Share Target & PWA Guide */}
          <div className="share-sheet-guide">
            <h4>
              <Smartphone size={16} style={{ display: 'inline', marginRight: 6 }} />
              How to Share Directly from Instagram on Mobile:
            </h4>
            <ol>
              <li>Open this link on your phone in Chrome / Safari.</li>
              <li>Tap <strong>"Install App"</strong> / <strong>"Add to Home Screen"</strong>.</li>
              <li>Now in Instagram, tap <strong>Share → NovaSync</strong>: your reel or post saves automatically!</li>
            </ol>
          </div>

          {/* Advanced Sync Server Option (for Hugging Face / Remote deployment) */}
          <div style={{ marginTop: 10, borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
            <button
              type="button"
              className="btn-card-action"
              style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Server size={13} style={{ display: 'inline', marginRight: 4 }} />
              {showAdvanced ? 'Hide Custom Server Settings' : 'Custom Sync Server / Cloud URL (Optional)'}
            </button>

            {showAdvanced && (
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Backend Sync Server (e.g. Cloudflare tunnel or VPS URL):
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    placeholder="https://your-tunnel.trycloudflare.com (leave empty for auto)"
                    value={customServerInput}
                    onChange={(e) => setCustomServerInput(e.target.value)}
                    style={{ flex: 1, padding: '6px 10px', fontSize: '0.82rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 6 }}
                  />
                  <button type="button" className="pill-btn primary small" onClick={handleSaveCustomServer}>
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

### File: `src/components/Toast.tsx`
- **Summary:** React component: ToastContainer
- **Path:** `src/components/Toast.tsx`
- **Estimated Tokens:** 245
- **mtime:** 1792225688.953

```typescript
import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = Info;
        if (toast.type === 'success') Icon = CheckCircle2;
        if (toast.type === 'warning') Icon = AlertTriangle;
        if (toast.type === 'error') Icon = XCircle;

        return (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span className="toast-icon">
              <Icon size={20} />
            </span>
            <div className="toast-content">
              <h5 className="toast-title">{toast.title}</h5>
              {toast.desc && <p className="toast-desc">{toast.desc}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
```

---

### File: `src/main.tsx`
- **Summary:** TypeScript module: 0 exports, 0 functions, 10 lines
- **Path:** `src/main.tsx`
- **Estimated Tokens:** 54
- **mtime:** 1792225839.955

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

### File: `src/services/api.ts`
- **Summary:** exports: getBaseApiUrl, fetchUrlMetadataApi, setCustomServerUrl, fetchItemsApi +4 more; HTTP calls
- **Path:** `src/services/api.ts`
- **Estimated Tokens:** 635
- **mtime:** 1792225680.238

```typescript
import { Item, NetworkInfo, UrlMetadata } from '../types';

function getCustomServerUrl(): string {
  const saved = localStorage.getItem('novasync_custom_server');
  if (saved && saved.trim()) {
    return saved.trim().replace(/\/$/, '');
  }
  return '';
}

export function setCustomServerUrl(url: string): void {
  if (!url) {
    localStorage.removeItem('novasync_custom_server');
  } else {
    localStorage.setItem('novasync_custom_server', url.trim().replace(/\/$/, ''));
  }
}

export function getBaseApiUrl(): string {
  const custom = getCustomServerUrl();
  return custom ? custom : '';
}

export async function fetchItemsApi(room: string): Promise<Item[]> {
  const base = getBaseApiUrl();
  const res = await fetch(`${base}/api/items?room=${encodeURIComponent(room)}`);
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
  const res = await fetch(`${base}/api/network-info?room=${encodeURIComponent(room)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```

---

### File: `src/services/audio.ts`
- **Summary:** exports: playReminderChime
- **Path:** `src/services/audio.ts`
- **Estimated Tokens:** 434
- **mtime:** 1792225668.443

```typescript
let audioCtx: AudioContext | null = null;

export function playReminderChime(): void {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // C5 (523.25 Hz)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    // E5 (659.25 Hz)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, now + 0.15);
    gain2.gain.setValueAtTime(0.28, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.7);

    // G5 (783.99 Hz)
    const osc3 = audioCtx.createOscillator();
    const gain3 = audioCtx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(783.99, now + 0.3);
    gain3.gain.setValueAtTime(0.3, now + 0.3);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
    osc3.connect(gain3);
    gain3.connect(audioCtx.destination);
    osc3.start(now + 0.3);
    osc3.stop(now + 0.95);
  } catch (err) {
    console.warn('Audio chime playback issue:', err);
  }
}
```

---

### File: `src/styles/app.css`
- **Summary:** ========================================================================== (1836 lines)
- **Path:** `src/styles/app.css`
- **Estimated Tokens:** 10,347
- **mtime:** 1792225659.062

```css
/* ==========================================================================
   NovaSync — Premium Design System & Stylesheet
   Modern Glassmorphism, Responsive Grid & Curated Palettes
   ========================================================================== */

:root {
  /* Color Tokens - Dark Mode (Default) */
  --bg-primary: #090d16;
  --bg-secondary: #0f172a;
  --bg-tertiary: #131d33;
  --bg-glass: rgba(15, 23, 42, 0.75);
  --bg-card: #111a2e;
  --bg-card-hover: #16223b;
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-focus: #06b6d4;

  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --text-subtle: #64748b;

  /* Accent Colors */
  --accent-emerald: #10b981;
  --accent-emerald-glow: rgba(16, 185, 129, 0.25);
  --accent-cyan: #06b6d4;
  --accent-cyan-glow: rgba(6, 182, 212, 0.25);
  --accent-amber: #f59e0b;
  --accent-amber-glow: rgba(245, 158, 11, 0.25);
  --accent-rose: #f43f5e;
  --accent-rose-glow: rgba(244, 63, 94, 0.25);
  --accent-violet: #8b5cf6;
  --accent-violet-glow: rgba(139, 92, 246, 0.25);

  /* Instagram Gradient */
  --instagram-grad: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);

  /* Typography */
  --font-main: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Elevation & Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.35);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.45);
  --shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.6);
  --shadow-glow: 0 0 24px var(--accent-cyan-glow);

  /* Radii */
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-full: 9999px;

  /* Transitions */
  --trans-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --trans-smooth: 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Light Theme Mode */
[data-theme="light"] {
  --bg-primary: #f8fafc;
  --bg-secondary: #f1f5f9;
  --bg-tertiary: #e2e8f0;
  --bg-glass: rgba(255, 255, 255, 0.85);
  --bg-card: #ffffff;
  --bg-card-hover: #f8fafc;
  --border-subtle: rgba(15, 23, 42, 0.09);
  --border-focus: #0284c7;

  --text-main: #0f172a;
  --text-muted: #475569;
  --text-subtle: #94a3b8;

  --shadow-sm: 0 2px 8px rgba(15, 23, 42, 0.05);
  --shadow-md: 0 8px 24px rgba(15, 23, 42, 0.08);
  --shadow-lg: 0 16px 40px rgba(15, 23, 42, 0.12);
}

/* Base Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  min-height: 100vh;
  font-family: var(--font-main);
  background-color: var(--bg-primary);
  color: var(--text-main);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* Links & Buttons */
a {
  color: var(--accent-cyan);
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}

button, input, select, textarea {
  font-family: inherit;
  color: inherit;
  outline: none;
}

/* ==========================================================================
   Header & Navigation
   ========================================================================== */

.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-subtle);
  padding: 10px 24px;
  transition: all var(--trans-smooth);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand-group {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.brand-logo {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px var(--accent-emerald-glow);
}

.brand-icon {
  width: 22px;
  height: 22px;
  color: #041014;
}

.pulse-indicator {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #34d399;
  border: 2px solid var(--bg-primary);
  animation: pulsePing 2s infinite;
}

@keyframes pulsePing {
  0% { transform: scale(0.9); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.5; }
  100% { transform: scale(0.9); opacity: 1; }
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-main);
  line-height: 1.1;
}

.brand-name span {
  color: var(--accent-cyan);
}

.brand-badge {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--accent-emerald);
  text-transform: uppercase;
}

/* Search Bar */
.search-wrapper {
  flex: 1;
  max-width: 520px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  pointer-events: none;
}

.search-wrapper input {
  width: 100%;
  height: 42px;
  padding: 0 65px 0 42px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  font-size: 0.9rem;
  transition: all var(--trans-fast);
}

.search-wrapper input:focus {
  border-color: var(--border-focus);
  background: var(--bg-tertiary);
  box-shadow: 0 0 0 3px var(--accent-cyan-glow);
}

.clear-btn {
  position: absolute;
  right: 48px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  font-size: 0.85rem;
}

.kbd-shortcut {
  position: absolute;
  right: 12px;
  padding: 2px 6px;
  font-size: 0.72rem;
  font-family: var(--font-mono);
  background: var(--bg-tertiary);
  color: var(--text-muted);
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  pointer-events: none;
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border-radius: var(--radius-full);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--trans-fast);
  border: 1px solid transparent;
}

.pill-btn.small {
  height: 32px;
  padding: 0 12px;
  font-size: 0.8rem;
}

.pill-btn.primary {
  background: var(--accent-cyan);
  color: #04141c;
  box-shadow: 0 2px 8px var(--accent-cyan-glow);
}
.pill-btn.primary:hover {
  background: #22d3ee;
  transform: translateY(-1px);
}

.pill-btn.secondary {
  background: var(--bg-tertiary);
  color: var(--text-main);
  border-color: var(--border-subtle);
}
.pill-btn.secondary:hover {
  background: var(--bg-card-hover);
  border-color: var(--text-muted);
}

.pill-btn.success {
  background: var(--accent-emerald);
  color: #022013;
}
.pill-btn.success:hover {
  background: #34d399;
}

.sync-btn {
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: var(--accent-emerald);
}
.sync-btn:hover {
  background: rgba(16, 185, 129, 0.22);
  transform: translateY(-1px);
}

.sync-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-emerald);
}

.sync-dot.live {
  box-shadow: 0 0 10px var(--accent-emerald);
  animation: pulseDot 2s infinite;
}

.sync-dot.offline {
  background: var(--accent-rose);
  box-shadow: none;
  animation: none;
}

@keyframes pulseDot {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.6; }
  100% { transform: scale(1); opacity: 1; }
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border-radius: var(--radius-md);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--trans-fast);
  border: none;
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.action-btn.primary-btn {
  background: linear-gradient(135deg, #06b6d4 0%, #10b981 100%);
  color: #03141c;
  box-shadow: 0 4px 14px var(--accent-cyan-glow);
}
.action-btn.primary-btn:hover {
  transform: translateY(-1.5px);
  box-shadow: 0 6px 20px var(--accent-cyan-glow);
}

.action-btn.icon-btn {
  background: var(--bg-secondary);
  color: var(--text-main);
  border: 1px solid var(--border-subtle);
}
.action-btn.icon-btn:hover {
  background: var(--bg-tertiary);
  border-color: var(--accent-cyan);
}

.icon-toggle-btn {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--trans-fast);
}

.icon-toggle-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-main);
}

.icon-toggle-btn svg {
  width: 18px;
  height: 18px;
}

.bell-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-amber);
  box-shadow: 0 0 6px var(--accent-amber);
}

/* ==========================================================================
   Main Layout & Banners
   ========================================================================== */

.main-layout {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

/* Sync Banner */
.sync-banner {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: var(--radius-md);
  padding: 12px 20px;
  margin-bottom: 24px;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.banner-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
}

.banner-pill {
  background: var(--accent-cyan);
  color: #041620;
  font-weight: 700;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: var(--radius-full);
}

.banner-text strong {
  color: var(--accent-cyan);
}

.banner-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.banner-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 14px;
  border-radius: var(--radius-full);
  background: var(--accent-cyan);
  color: #02161f;
  font-size: 0.82rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all var(--trans-fast);
}
.banner-btn:hover {
  transform: translateY(-1px);
  background: #22d3ee;
}

.banner-btn.secondary {
  background: var(--bg-tertiary);
  color: var(--text-main);
  border: 1px solid var(--border-subtle);
}
.banner-btn.secondary:hover {
  background: var(--bg-card-hover);
  border-color: var(--text-muted);
}

.banner-btn svg {
  width: 15px;
  height: 15px;
}

/* Urgent Alert Banner */
.urgent-alert {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(244, 63, 94, 0.15) 100%);
  border: 1px solid var(--accent-amber);
  border-radius: var(--radius-md);
  padding: 14px 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  animation: pulseAmber 3s infinite;
}

@keyframes pulseAmber {
  0%, 100% { box-shadow: 0 0 12px var(--accent-amber-glow); }
  50% { box-shadow: 0 0 24px rgba(245, 158, 11, 0.4); }
}

.urgent-icon {
  font-size: 1.6rem;
}

.urgent-info {
  flex: 1;
}

.urgent-info h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main);
}

.urgent-info p {
  font-size: 0.85rem;
  color: var(--accent-amber);
}

.urgent-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ==========================================================================
   Quick Add Section
   ========================================================================== */

.quick-add-section {
  margin-bottom: 28px;
}

.quick-add-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  box-shadow: var(--shadow-sm);
  transition: all var(--trans-smooth);
}

.quick-add-card:focus-within {
  border-color: var(--border-focus);
  box-shadow: 0 8px 30px var(--accent-cyan-glow);
}

.quick-add-input-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.quick-type-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-secondary);
  padding: 4px;
  border-radius: var(--radius-full);
}

.type-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 14px;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--text-muted);
  border: none;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--trans-fast);
}

.type-chip svg {
  width: 14px;
  height: 14px;
}

.type-chip:hover {
  color: var(--text-main);
}

.type-chip.active {
  background: var(--bg-tertiary);
  color: var(--accent-cyan);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.quick-input-box {
  flex: 1;
  min-width: 280px;
  position: relative;
  display: flex;
  align-items: center;
}

.quick-input-box input {
  width: 100%;
  height: 44px;
  padding: 0 50px 0 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  font-size: 0.94rem;
  transition: all var(--trans-fast);
}

.quick-input-box input:focus {
  border-color: var(--accent-cyan);
  background: var(--bg-tertiary);
}

.quick-btn-go {
  position: absolute;
  right: 6px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent-cyan);
  color: #03141c;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--trans-fast);
}

.quick-btn-go:hover {
  transform: scale(1.08);
  background: #22d3ee;
}

.quick-btn-go svg {
  width: 16px;
  height: 16px;
}

/* Detected Link Bar */
.quick-detected-bar {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.85rem;
}

.detected-badge {
  background: rgba(244, 63, 94, 0.15);
  color: var(--accent-rose);
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 0.78rem;
}

.detected-url {
  flex: 1;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--font-mono);
}

.save-link-btn {
  background: var(--accent-rose);
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
}
.save-link-btn:hover {
  background: #fb7185;
}

/* ==========================================================================
   Categories Nav & Tags Filter
   ========================================================================== */

.categories-nav {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tabs-list {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}
.tabs-list::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 18px;
  border-radius: var(--radius-full);
  background: var(--bg-secondary);
  color: var(--text-muted);
  border: 1px solid var(--border-subtle);
  font-size: 0.88rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: all var(--trans-fast);
}

.tab-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-main);
  border-color: rgba(255, 255, 255, 0.15);
}

.tab-btn.active {
  background: var(--text-main);
  color: var(--bg-primary);
  border-color: var(--text-main);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.15);
  font-size: 0.75rem;
  font-weight: 700;
}

.tab-btn.active .tab-count {
  background: var(--bg-primary);
  color: var(--text-main);
}

/* Tags Filter Bar */
.tags-filter-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 0.82rem;
}

.tags-label {
  color: var(--text-subtle);
  font-weight: 600;
  margin-right: 4px;
}

.tag-pill {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  background: var(--bg-secondary);
  color: var(--text-muted);
  border: 1px solid var(--border-subtle);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all var(--trans-fast);
}

.tag-pill:hover {
  color: var(--text-main);
  border-color: var(--accent-cyan);
}

.tag-pill.active {
  background: rgba(6, 182, 212, 0.15);
  color: var(--accent-cyan);
  border-color: var(--accent-cyan);
  font-weight: 600;
}

/* ==========================================================================
   Items Section & Cards Grid
   ========================================================================== */

.items-section {
  min-height: 400px;
}

.section-subheader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.active-filter-title {
  font-weight: 600;
}

.sort-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.82rem;
  cursor: pointer;
}
.sort-btn:hover {
  color: var(--text-main);
}
.sort-btn svg {
  width: 14px;
  height: 14px;
}

/* Cards Grid: Masonry-style 3 columns */
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
  align-items: start;
}

/* ==========================================================================
   Universal Item Card Style
   ========================================================================== */

.item-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  transition: all var(--trans-smooth);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.item-card:hover {
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

/* Card Color Accents */
.item-card.color-slate { border-left: 4px solid var(--text-subtle); }
.item-card.color-emerald { border-left: 4px solid var(--accent-emerald); }
.item-card.color-cyan { border-left: 4px solid var(--accent-cyan); }
.item-card.color-amber { border-left: 4px solid var(--accent-amber); }
.item-card.color-rose { border-left: 4px solid var(--accent-rose); }
.item-card.color-violet { border-left: 4px solid var(--accent-violet); }

/* Card Header */
.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  color: var(--text-muted);
}

.card-badge.type-note {
  color: var(--accent-cyan);
  background: rgba(6, 182, 212, 0.12);
}

.card-badge.type-reminder {
  color: var(--accent-amber);
  background: rgba(245, 158, 11, 0.12);
}

.card-badge.type-instagram {
  color: #fff;
  background: var(--instagram-grad);
}

.card-badge.type-link {
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.12);
}

.card-top-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-icon-btn {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  background: transparent;
  border: none;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--trans-fast);
}

.card-icon-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-main);
}

.card-icon-btn svg {
  width: 15px;
  height: 15px;
}

.card-icon-btn.pinned {
  color: var(--accent-amber);
}

/* Card Title & Content */
.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.35;
  color: var(--text-main);
  word-break: break-word;
}

.card-content {
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Checklists inside Notes/Reminders */
.card-checklist {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

.checklist-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  cursor: pointer;
  user-select: none;
}

.checklist-checkbox {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid var(--text-subtle);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  position: relative;
  transition: all var(--trans-fast);
  flex-shrink: 0;
}

.checklist-checkbox:checked {
  background: var(--accent-emerald);
  border-color: var(--accent-emerald);
}

.checklist-checkbox:checked::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 5px;
  width: 4px;
  height: 8px;
  border: solid #022013;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checklist-text {
  color: var(--text-main);
  transition: all var(--trans-fast);
}

.checklist-row.done .checklist-text {
  text-decoration: line-through;
  color: var(--text-subtle);
}

/* ==========================================================================
   Specialized Card Styles: Instagram & Link Bookmarks
   ========================================================================== */

/* Instagram Card */
.instagram-card-body {
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-secondary);
  border: 1px solid rgba(225, 48, 108, 0.25);
  margin: 4px 0;
}

.ig-media-thumb {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #020617;
}

.ig-media-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--trans-smooth);
}

.item-card:hover .ig-media-thumb img {
  transform: scale(1.04);
}

.ig-play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
}

.ig-play-circle {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
}

.ig-play-circle svg {
  width: 20px;
  height: 20px;
  fill: #000;
  margin-left: 2px;
}

.ig-caption-box {
  padding: 12px;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.ig-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: var(--bg-tertiary);
  border-top: 1px solid var(--border-subtle);
}

.open-ig-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--instagram-grad);
  color: #fff !important;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  text-decoration: none !important;
  box-shadow: 0 2px 8px rgba(225, 48, 108, 0.3);
}

.open-ig-btn:hover {
  transform: translateY(-1px);
}

.copy-url-btn {
  background: transparent;
  border: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-size: 0.78rem;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  cursor: pointer;
}
.copy-url-btn:hover {
  color: var(--text-main);
  border-color: var(--text-muted);
}

/* Website Bookmark Card */
.link-card-body {
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  margin: 4px 0;
}

.link-thumb {
  width: 100%;
  height: 160px;
  overflow: hidden;
  background: #020617;
}

.link-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--trans-smooth);
}

.item-card:hover .link-thumb img {
  transform: scale(1.04);
}

.link-info {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.link-domain {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--text-subtle);
  font-weight: 600;
}

.domain-favicon {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

.link-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ==========================================================================
   Specialized Card Styles: Reminders
   ========================================================================== */

.reminder-status-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  font-size: 0.82rem;
}

.due-countdown {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.due-countdown.urgent {
  color: var(--accent-rose);
  animation: pulsePing 2s infinite;
}

.due-countdown.today {
  color: var(--accent-amber);
}

.due-countdown.upcoming {
  color: var(--accent-emerald);
}

.due-countdown.completed {
  color: var(--text-subtle);
  text-decoration: line-through;
}

.reminder-quick-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.snooze-btn {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-size: 0.75rem;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
}
.snooze-btn:hover {
  color: var(--text-main);
  border-color: var(--accent-amber);
}

/* Card Tags & Footer */
.card-tags {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.card-tag {
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: var(--bg-secondary);
  color: var(--text-muted);
  border: 1px solid var(--border-subtle);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid var(--border-subtle);
  font-size: 0.76rem;
  color: var(--text-subtle);
}

.card-footer-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-card-action {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 0.78rem;
}
.btn-card-action:hover {
  color: var(--text-main);
  background: var(--bg-tertiary);
}

.btn-card-action.danger:hover {
  color: var(--accent-rose);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  max-width: 480px;
  margin: 0 auto;
}

.empty-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px auto;
  color: var(--text-subtle);
}

.empty-icon-wrap svg {
  width: 36px;
  height: 36px;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 24px;
}

/* ==========================================================================
   Modals
   ========================================================================== */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(4, 8, 16, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-card {
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 24px;
  animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.modal-header h3 {
  font-size: 1.2rem;
  font-weight: 800;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
}
.modal-close:hover {
  color: var(--text-main);
  background: var(--bg-tertiary);
}

/* Modal Type Switcher */
.modal-type-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  background: var(--bg-secondary);
  padding: 4px;
  border-radius: var(--radius-md);
  margin-bottom: 20px;
}

.modal-tab {
  height: 36px;
  border-radius: var(--radius-sm);
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--trans-fast);
}

.modal-tab.active {
  background: var(--bg-tertiary);
  color: var(--text-main);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* Modal Form Controls */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.flex-1 { flex: 1; }

.form-group label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 14px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  transition: all var(--trans-fast);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--border-focus);
  background: var(--bg-tertiary);
}

.url-fetch-wrap {
  display: flex;
  gap: 8px;
}

.url-fetch-wrap input {
  flex: 1;
}

.fetch-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 42px;
  padding: 0 16px;
  background: var(--accent-cyan);
  color: #03141c;
  font-size: 0.85rem;
  font-weight: 700;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
}
.fetch-btn:hover {
  background: #22d3ee;
}

.url-preview-box {
  margin-top: 10px;
  padding: 10px;
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  display: flex;
  gap: 12px;
}

.preview-thumb-wrap {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: #020617;
  flex-shrink: 0;
}

.preview-thumb-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview-site {
  font-size: 0.72rem;
  color: var(--accent-cyan);
  font-weight: 700;
}

.preview-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.2;
}

.preview-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Color Radios */
.color-picker-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
}

.color-radio input {
  display: none;
}

.color-dot {
  display: block;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all var(--trans-fast);
}

.color-slate { background: #64748b; }
.color-emerald { background: var(--accent-emerald); }
.color-cyan { background: var(--accent-cyan); }
.color-amber { background: var(--accent-amber); }
.color-rose { background: var(--accent-rose); }
.color-violet { background: var(--accent-violet); }

.color-radio input:checked + .color-dot {
  transform: scale(1.2);
  border-color: #fff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  cursor: pointer;
  user-select: none;
}

/* Interactive checklist inside form */
.checklist-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
}

.checklist-form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
}

.checklist-del-btn {
  background: transparent;
  border: none;
  color: var(--text-subtle);
  cursor: pointer;
}
.checklist-del-btn:hover {
  color: var(--accent-rose);
}

.checklist-add-row {
  display: flex;
  gap: 8px;
}

.add-sub-btn {
  height: 38px;
  padding: 0 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  color: var(--text-main);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

/* ==========================================================================
   Sync Modal & QR Code Styles
   ========================================================================== */

.sync-modal-card {
  max-width: 620px;
}

.sync-modal-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-icon-badge {
  font-size: 1.8rem;
}

.sync-modal-title-group h3 {
  font-size: 1.15rem;
  font-weight: 800;
}

.sync-modal-title-group p {
  font-size: 0.82rem;
  color: var(--text-muted);
}

.sync-modal-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.qr-showcase {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
}

.qr-frame {
  width: 140px;
  height: 140px;
  background: #ffffff;
  padding: 8px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
}

.qr-frame img {
  width: 100%;
  height: 100%;
  display: block;
}

.qr-loading {
  position: absolute;
  font-size: 0.75rem;
  color: #000;
  text-align: center;
}

.qr-caption {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.88rem;
}

.qr-caption strong {
  font-size: 1rem;
  color: var(--accent-emerald);
}

.qr-caption span {
  color: var(--text-muted);
  line-height: 1.4;
}

.sync-link-box label,
.room-switcher-box label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.copy-url-row,
.room-input-row {
  display: flex;
  gap: 8px;
}

.copy-url-row input,
.room-input-row input {
  flex: 1;
  height: 38px;
  padding: 0 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-family: var(--font-mono);
}

.room-hint {
  display: block;
  margin-top: 6px;
  font-size: 0.75rem;
  color: var(--text-subtle);
}

/* Connected Devices */
.connected-devices-box {
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: 14px;
}

.devices-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.devices-header h4 {
  font-size: 0.85rem;
  font-weight: 700;
}

.live-tag {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--accent-emerald);
}

.devices-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.device-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  color: var(--text-main);
  border: 1px solid var(--border-subtle);
}

.device-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-emerald);
}

/* Share Guide */
.share-sheet-guide {
  padding: 12px 16px;
  background: rgba(225, 48, 108, 0.08);
  border: 1px solid rgba(225, 48, 108, 0.2);
  border-radius: var(--radius-md);
  font-size: 0.82rem;
}

.share-sheet-guide h4 {
  font-size: 0.88rem;
  color: #fb7185;
  margin-bottom: 6px;
}

.share-sheet-guide ol {
  padding-left: 20px;
  color: var(--text-muted);
  line-height: 1.5;
}

/* ==========================================================================
   Mobile Bottom Navigation (Responsive Touch Support)
   ========================================================================== */

.mobile-bottom-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 65px;
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid var(--border-subtle);
  z-index: 90;
  padding: 0 16px;
  align-items: center;
  justify-content: space-around;
}

.mobile-nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.7rem;
  min-width: 48px;
  min-height: 48px;
  cursor: pointer;
}

.mobile-nav-btn svg {
  width: 20px;
  height: 20px;
}

.mobile-nav-btn.active {
  color: var(--accent-cyan);
}

.mobile-fab {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #06b6d4 0%, #10b981 100%);
  color: #03141c;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px var(--accent-cyan-glow);
  transform: translateY(-12px);
  cursor: pointer;
}

.mobile-fab svg {
  width: 24px;
  height: 24px;
}

/* ==========================================================================
   Toast Notifications
   ========================================================================== */

.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  min-width: 280px;
  max-width: 380px;
  padding: 12px 18px;
  border-radius: var(--radius-md);
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.88rem;
  animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  transition: all var(--trans-fast);
}

@keyframes toastSlideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.toast.toast-success { border-left: 4px solid var(--accent-emerald); }
.toast.toast-info { border-left: 4px solid var(--accent-cyan); }
.toast.toast-warning { border-left: 4px solid var(--accent-amber); }
.toast.toast-error { border-left: 4px solid var(--accent-rose); }

.toast-icon {
  font-size: 1.2rem;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 700;
  color: var(--text-main);
  font-size: 0.88rem;
}

.toast-desc {
  font-size: 0.78rem;
  color: var(--text-muted);
}

/* Spinner */
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ==========================================================================
   Responsive Breakpoints
   ========================================================================== */

@media (max-width: 900px) {
  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 680px) {
  .app-header {
    padding: 10px 14px;
  }

  .header-actions .btn-label,
  .kbd-shortcut {
    display: none;
  }

  .search-wrapper input {
    padding-right: 32px;
  }

  .main-layout {
    padding: 16px 12px 80px 12px; /* space for bottom bar */
  }

  .items-grid {
    grid-template-columns: 1fr;
  }

  .mobile-bottom-bar {
    display: flex;
  }

  .banner-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .qr-showcase {
    flex-direction: column;
    text-align: center;
  }
}

/* Worldwide Sync Mode Badge */
.sync-mode-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: var(--accent-emerald);
  font-size: 0.76rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  margin-top: 4px;
}

/* Offline sync pending badge */
.offline-pending-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(245, 158, 11, 0.15);
  color: var(--accent-amber);
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-weight: 600;
}

/* Safe area insets for modern mobile screens (iPhone notch & Android gesture bar) */
@supports (padding: max(0px)) {
  .mobile-bottom-bar {
    padding-bottom: max(0px, env(safe-area-inset-bottom));
    height: calc(60px + max(0px, env(safe-area-inset-bottom)));
  }
}

```

---

### File: `src/types/index.ts`
- **Summary:** Type definitions: ChecklistTask, UrlMetadata, Item, DeviceInfo +6 more
- **Path:** `src/types/index.ts`
- **Estimated Tokens:** 375
- **mtime:** 1792225650.979

```typescript
export type ItemType = 'note' | 'reminder' | 'link' | 'instagram';

export type PriorityLevel = 'low' | 'medium' | 'high';

export type RecurrenceRule = 'none' | 'daily' | 'weekdays' | 'weekly' | 'monthly';

export type ColorAccent = 'slate' | 'emerald' | 'cyan' | 'amber' | 'rose' | 'violet';

export interface ChecklistTask {
  text: string;
  done: boolean;
}

export interface UrlMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
  isInstagram?: boolean;
  igType?: 'reel' | 'post' | 'video' | 'story';
  shortcode?: string;
  embedUrl?: string;
  cleanUrl?: string;
}

export interface Item {
  id: string;
  sync_room: string;
  type: ItemType;
  title: string;
  content: string;
  url?: string;
  metadata?: UrlMetadata;
  tags: string[];
  color: ColorAccent;
  is_pinned: boolean;
  is_completed: boolean;
  due_date?: string | null;
  reminder_recurrence?: RecurrenceRule;
  priority?: PriorityLevel;
  checklist?: ChecklistTask[];
  created_at: number;
  updated_at: number;
  _offline_pending?: boolean;
}

export interface DeviceInfo {
  id: string;
  name: string;
  platform: string;
}

export interface NetworkInfo {
  localIp: string;
  port: number;
  syncUrl: string;
  publicHttpsUrl?: string | null;
  lanSyncUrl?: string;
  room: string;
  qrDataUrl: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  desc?: string;
  duration?: number;
}
```

---

### File: `tsconfig.json`
- **Summary:** tsconfig.json
- **Path:** `tsconfig.json`
- **Estimated Tokens:** 127
- **mtime:** 1792225629.337

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": false,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

---

### File: `vite.config.ts`
- **Summary:** TypeScript module: 1 exports, 0 functions, 22 lines
- **Path:** `vite.config.ts`
- **Estimated Tokens:** 101
- **mtime:** 1792225620.331

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
      '/ws': {
        target: 'ws://localhost:3000',
        ws: true
      },
      '/share': 'http://localhost:3000'
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
```

---

