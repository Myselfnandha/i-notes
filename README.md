# i Notes — Warm Editorial Archival System (PWA)

A fullstack Progressive Web Application faithfully implementing the Warm Editorial design system from `stitch_modern_notes_app_ui` and `warm_editorial_notes/DESIGN.md`.

Live deployment on Hugging Face Spaces: [https://nandhaalagesan248-i-notes.static.hf.space](https://nandhaalagesan248-i-notes.static.hf.space)

---

## Features

- **Tactile Editorial Aesthetics**: Built according to `warm_editorial_notes/DESIGN.md` using `Newsreader` (optical serif) and `Plus Jakarta Sans`, tactile paper card surfaces, resting paper shadows, and 6 subtle category wash tints (white, cream, sage, peach, chamois, lavender).
- **All 4 Design Screens**:
  1. **Notes Feed (`folio_all_notes`)**: Pill search bar, category chips, pinned notes/checklists, responsive 2-3 column masonry feed, and thumb-docked floating action bar.
  2. **Folders & Vault (`folders_organization`)**: Multi-segment storage meter, 2x2 smart filter tiles (Pinned, Reminders, Audio, Locked), expandable nested folders tree, tags cloud, and archive/trash maintenance drawers.
  3. **Note Editor (`note_editor`)**: Full-bleed distraction-free drafting canvas powered by Tiptap/ProseMirror with optical Newsreader headings, blockquotes with warm ochre margins, inline checklists, callout cards, photo attachments, and a 6-color paper wash dock.
  4. **Checklists & Tasks (`checklists_tasks`)**: Scheduled reminder card, dynamic progress calculation bar, HTML5/touch drag-and-drop task reordering, priority badges (`⚑ High`), dry-run tags, and inline audio rehearsal clips (`0:42`).
- **Real Voice Dictation & Audio**: Live microphone recording via browser `MediaRecorder` API with a real-time Web Audio API frequency visualizer and scrubbable playback.
- **Offline-First Resilience**: IndexedDB (`idb`) client storage ensures all notes and checklists work with zero network latency and complete offline persistence.
- **Vault Archival Manager**: One-click JSON export and import for local backups, plus background synchronization with the Hugging Face backend.
- **PWA Ready**: Offline caching service worker (`sw.js`), web manifest, standalone display mode, and custom install prompt.

---

## Getting Started Locally

### 1. Frontend Development

```bash
npm install
npm run dev
# Vite dev server runs at http://localhost:5173
```

### 2. Backend Server (FastAPI + SQLite)

```bash
python run.py
# FastAPI backend runs at http://localhost:7860
```

### 3. Production Build

```bash
npm run build
# Compiles TypeScript and creates optimized static assets in dist/
```

---

## Deployment to Hugging Face Spaces

The app is deployed to:
- Space URL: `https://huggingface.co/spaces/nandhaalagesan248/i-notes`
- Live App: `https://nandhaalagesan248-i-notes.static.hf.space`

To deploy updates:
```bash
npm run build
hf upload nandhaalagesan248/i-notes ./dist . --repo-type space --commit-message "Update i Notes PWA"
```
