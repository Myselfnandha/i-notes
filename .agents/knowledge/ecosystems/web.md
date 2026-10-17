# 🌐 Web Frontend & UI Architecture Knowledge

Architectural invariants, state management patterns, and performance recipes for modern web applications.

---

## 🏗️ Core Stack Standards

### 1. React & Next.js (App Router)
- **Server Components by Default**: Keep data fetching, database access, and heavy libraries on the server (`'use server'`). Add `'use client'` only at the leaf interactive components.
- **Route Handlers**: Use standard `NextRequest` and `NextResponse` with explicit HTTP status codes and Zod schema validation.
- **Suspense & Streaming**: Wrap slow asynchronous boundary components in `<Suspense fallback={<Skeleton />}>` to avoid blocking First Contentful Paint.

### 2. Styling & Design Systems
- **Vanilla CSS & Tailwind**: Use design tokens defined in CSS custom properties (`:root`) for colors, typography, and spacing.
- **Micro-Animations**: Use CSS hardware-accelerated properties (`transform`, `opacity`) with durations under 250ms and standard easing (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Responsive Layouts**: Fluid container scaling with CSS Grid and Flexbox. Never hardcode fixed pixel widths on parent containers.

### 3. State Management & Data Fetching
- **Server State vs Client State**: Prefer server queries or SWR/TanStack Query over global Redux/Zustand stores for remote data.
- **Optimistic Updates**: For high-frequency user actions (likes, toggles, task completion), update the UI optimistically with rollback on failure.

---

## 🛡️ Web Platform Gotchas
- **Layout Shift (CLS)**: Always provide explicit `width` and `height` or aspect-ratio on images and video embeds.
- **Hydration Mismatch**: Avoid rendering browser-dependent APIs (`localStorage`, `window.innerWidth`, timestamps) during initial SSR pass; defer to `useEffect` or mount state.
- **Bundle Bloat**: Dynamic-import heavy third-party visualization or editor libraries (`next/dynamic` or `React.lazy`).
