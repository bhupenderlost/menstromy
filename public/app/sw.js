
const OFFLINE_VERSION = 1
const CACHE_NAME = 'offline'
const OFFLINE_URL = 'offline.html'

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME)
    await cache.add(new Request(OFFLINE_URL, { cache: 'reload'}))
  })())
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable()
    }
  })())
  self.clients.claim()
})

var CACHE_NAME_NEW = 'my-pwa-cache-v1';
var urlsToCache = [
  '/',
  '/manifest.json',
  '/index.html'
]
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME_NEW)
      .then(function(cache) {
        // Open a cache and cache our files
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResponse = await event.preloadResponse
        if (preloadResponse) {
          return preloadResponse
        }
        const networkResponse = await fetch(event.request)
        return networkResponse
      } catch (error) {
        console.log('Fetch failed returning offline page instead.', error)
        const cache = await caches.open(CACHE_NAME)
        const cachedResponse = await cache.match(OFFLINE_URL)
        return cachedResponse
      }
    })())
  }

})