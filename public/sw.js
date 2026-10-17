const CACHE_NAME = 'novasync-v4';
const STATIC_ASSETS = [
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        STATIC_ASSETS.map((asset) => {
          return fetch(asset, { cache: 'reload' })
            .then((res) => {
              if (res.ok) return cache.put(asset, res);
            })
            .catch((err) => console.warn('Cache asset skip:', asset, err));
        })
      );
    })
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

  // Exclude WebSockets, config.json, and external APIs
  if (
    url.pathname === '/config.json' ||
    url.protocol.startsWith('ws') ||
    url.hostname.includes('itty.ws') ||
    url.hostname.includes('microlink.io') ||
    event.request.method !== 'GET'
  ) {
    return;
  }

  // Navigation requests: serve /index.html (SPA Fallback)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html');
      })
    );
    return;
  }

  // Cache-first with network fallback for static assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        if (res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
        }
        return res;
      });
    })
  );
});
