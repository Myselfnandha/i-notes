# Codebase Patches: tool

## 2026-10-17 14:04:35 (19 files changed)
- `index.html` — HTML file: 22 lines
- `package-lock.json` — Lockfile manifest: 202 resolved dependencies
- `package.json` — package.json
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

## 2026-10-17 13:52:30 (6 files changed)
- `novasync.service` — SERVICE file: 13 lines
- `package.json` — package.json
- `public/app.css` — ========================================================================== (1836 lines)
- `public/app.js` — Test suite: 9 test blocks, test
- `public/index.html` — HTML file: 488 lines
- `server.js` — Test suite: 3 test blocks, test

## 2026-10-17 13:42:46 (8 files changed)
- `package.json` — package.json
- `public/app.css` — ========================================================================== (1803 lines)
- `public/app.js` — Test suite: 9 test blocks, test
- `public/icons/icon.svg` — SVG file: 37 lines
- `public/index.html` — HTML file: 466 lines
- `public/manifest.webmanifest` — WEBMANIFEST file: 29 lines
- `public/sw.js` — HTTP calls
- `server.js` — Test suite: 3 test blocks, test

## 2026-10-17 13:31:56 (1 file changed)
- `AGENTS.md` — ZeroGravity OS (AGENTS.md) (7 lines)

## 2026-10-15 19:51:08 (5 files changed)
- `AGENTS.md` — ZeroGravity OS (AGENTS.md) (7 lines)
- `CONTRIBUTING.md` — Contributing to Antigravity Supercoder OS (60 lines)
- `openhands_config.toml` — TOML config: core, agent, llm
- `package.json` — package.json
- `tests/test_all.py` — Tests for ScriptImportability, CLIHelpExits, JSONDataSchemas: 14 test functions/methods

## 2026-10-14 13:25:47 (57 files changed)
- `.github/ISSUE_TEMPLATE/knowledge_submission.yml` — YAML config: name, description, title, labels, body
- `.github/skills/brandkit/SKILL.md` — - (30 lines)
- `.github/skills/design-system/SKILL.md` — - (79 lines)
- `.github/skills/design-system/data/chart-types.md` — Chart and data-viz database (52 lines)
- `.github/skills/design-system/data/layouts.md` — Layout archetypes (28 lines)
- `.github/skills/design-system/data/motion-presets.md` — Motion preset database (46 lines)
- `.github/skills/design-system/data/palettes.md` — Palette database (143 lines)
- `.github/skills/design-system/data/styles.md` — Style database (71 lines)
- `.github/skills/design-system/data/tech-stacks.md` — Tech-stack database (102 lines)
- `.github/skills/design-system/data/type-pairings.md` — Type-pairing database (80 lines)
- `.github/skills/design-system/reference/color.md` — Building a committed palette and the light/dark map (22 lines)
- `.github/skills/design-system/reference/dna.md` — House design DNA (32 lines)
- `.github/skills/design-system/reference/glass.md` — Liquid glass and surface recipes (78 lines)
- `.github/skills/design-system/reference/icons.md` — Icons: a 3-tier system, never emoji (43 lines)
- `.github/skills/design-system/reference/rules.md` — Hard rules: locks and bans (31 lines)
- `.github/skills/design-system/reference/typography.md` — Choosing a distinctive type pairing (24 lines)
- `.github/skills/design-system/templates/CLAUDE.md` — Design System: {{BRAND}} · Brand rules for generating UI (36 lines)
- `.github/skills/design-system/templates/storybook.html` — HTML file: 65 lines
- `.github/skills/design-system/templates/tailwind.config.js` — JavaScript module: 1 exports, 0 functions, 50 lines
- `.github/skills/design-system/templates/tokens.css` — ========================================================================== (157 lines)
- `.github/skills/fluid/SKILL.md` — - (72 lines)
- `.github/skills/fluid/components/AmbientField.tsx` — React component: DEFAULT_BLOBS, AmbientField; hooks: useRef, useEffect
- `.github/skills/fluid/components/Marquee.tsx` — React component: Marquee
- `.github/skills/fluid/components/Odometer.tsx` — Test suite: 1 test blocks, test
- `.github/skills/fluid/components/Reveal.tsx` — React component: Reveal
- `.github/skills/fluid/components/ScrollContext.tsx` — React component: ScrollProvider; hooks: useContext
- `.github/skills/fluid/components/ScrollProgress.tsx` — React component: ScrollProgress
- `.github/skills/fluid/components/SmoothScroll.tsx` — React component: SmoothScroll; hooks: useState, useEffect
- `.github/skills/fluid/components/marquee.css` — CSS file: 28 lines
- `.github/skills/fluid/detector/README.md` — fluid detector (24 lines)
- `.github/skills/fluid/detector/core.mjs` — fluid detector core: the importable scan engine behind detect.mjs and the fluid-skills ... (116 lines)
- `.github/skills/fluid/detector/deep.mjs` — fluid detector, Tier 3 (--deep): DOM-aware checks that the regex core cannot see. Runs ... (195 lines)
- `.github/skills/fluid/detector/detect.mjs` — fluid detector: a deterministic scanner for motion and generic-look anti-patterns. Run ... (32 lines)
- `.github/skills/fluid/detector/rules.mjs` — Deterministic anti-pattern rules for the `fluid` detector. No API calls. Each rule: { i... (204 lines)
- `.github/skills/fluid/reference/anti-patterns.md` — Anti-patterns checklist (56 lines)
- `.github/skills/fluid/reference/easings-and-durations.md` — Easings and durations (42 lines)
- `.github/skills/fluid/reference/principles.md` — Principles, condensed to rules (33 lines)
- `.github/skills/output/SKILL.md` — - (21 lines)
- `.github/skills/redesign/SKILL.md` — - (23 lines)
- `.github/skills/refine/SKILL.md` — - (57 lines)
- `.github/skills/refine/reference/commands.md` — Refine commands (121 lines)
- `.github/workflows/ci.yml` — GitHub Actions workflow
- `.github/workflows/ingest_knowledge.yml` — GitHub Actions workflow
- `.gitignore` — ============================================================================== Git Igno... (42 lines)
- `.npmignore` — Development files & scripts (22 lines)
- `AGENTS.md` — ZeroGravity OS (AGENTS.md) (7 lines)
- `CONTRIBUTING.md` — Contributing to Antigravity Supercoder OS (60 lines)
- `LICENSE` — Text file: 17 lines
- `Makefile` — ============================================================================== 🌌 ZeroGr... (64 lines)
- `README.md` — 🌌 ZeroGravity OS ## *Autonomous Supercoder OS • Zero-Default MCPs • 28 Workflows* (155 lines)
- `bin/cli.js` — functions: main, printBanner, parseArgs, copyDirSync
- `install_agy_staff.py` — Python module (0 functions, 0 classes)
- `openhands_config.toml` — TOML config: core, agent, llm
- `pack.sh` — Shell script (env); functions: print_banner, usage, check_cmd
- `package.json` — package.json
- `tests/test_all.py` — Tests for ScriptImportability, CLIHelpExits, JSONDataSchemas: 13 test functions/methods
- `unpack-plugins.sh` — Shell script (env)

