/*
 * MEDULA service worker — offline app shell.
 * Registered ONLY in production builds (dev serves fresh chunks every edit,
 * and a caching SW would resurrect stale bundles).
 *
 * Strategies:
 *  - Navigations:        network-first, offline fallback → cached shell "/"
 *  - Immutable statics:  cache-first  (/_next/static, /icons, /scenes, favicon)
 *  - API routes (/api/*): network-only  (live study data must stay fresh)
 *  - Everything else:    network (no explicit caching)
 */
const VERSION = 'medula-sky-v2' // v2: forced sky-blue light theme (purges any cached dark shell)
const SHELL = '/'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) =>
        cache.addAll([
          SHELL,
          '/manifest.webmanifest',
          '/favicon.png',
          '/icons/icon-192.png',
          '/icons/icon-512.png',
        ]),
      )
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/')) return // network-only

  // Immutable static assets → cache-first
  const isStatic =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/scenes/') ||
    url.pathname === '/favicon.png' ||
    url.pathname === '/manifest.webmanifest'
  if (isStatic) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            const copy = res.clone()
            caches.open(VERSION).then((c) => c.put(req, copy))
            return res
          }),
      ),
    )
    return
  }

  // Document navigations → network-first, cached shell as the offline fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(VERSION).then((c) => c.put(SHELL, copy))
          return res
        })
        .catch(() => caches.match(SHELL)),
    )
  }
})
