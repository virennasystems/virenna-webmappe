const CACHE_NAME = 'virenna-cache-v2';
const OFFLINE_URL = 'offline.html';

const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/deckblatt.PNG',
  '/van.PNG',
  '/himalaya.PNG',
  '/VIRENNA_Siegel_Transparent.png',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

// Installation – Assets in Cache speichern
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    }).catch((err) => console.error('Cache-Fehler beim Installieren:', err))
  );
  self.skipWaiting();
});

// Aktivierung – alte Caches löschen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

// Fetch – Netzwerk + Fallback bei Navigationsanfragen
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(OFFLINE_URL)
      )
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) =>
        response || fetch(event.request)
      )
    );
  }
});
