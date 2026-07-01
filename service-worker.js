// MonyGist Subscription Manager
// Service Worker v1

const CACHE_NAME = "monygist-v7";

const FILES_TO_CACHE = [
  "./",
  "./index.html",        // ← ADD THIS LINE. Critical for calculator updates
  "./manager.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  // Optional: cache the Google Font CSS so it works offline
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap"
];

// Install - cache all core files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Caching files');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // Activate immediately
});

// Activate - delete old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Service Worker: Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control immediately
});

// Fetch - serve from cache, fallback to network
self.addEventListener("fetch", event => {
  // Skip non-GET requests and chrome-extension requests
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached version or fetch from network
      return response || fetch(event.request).then(fetchRes => {
        // Optional: cache new requests dynamically
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchRes.clone());
          return fetchRes;
        });
      });
    }).catch(() => {
      // Optional: return offline page if both cache + network fail
      if (event.request.destination === 'document') {
        return caches.match('./index.html');
      }
    })
  );
});
