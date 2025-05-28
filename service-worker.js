const CACHE_NAME = 'virenna-map-v2';
const OFFLINE_URL = '/offline.html';

const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/deckblatt.PNG',
  '/van.PNG',
  '/himalaya.PNG',
  '/VIRENNA_Siegel_Transparent.png',
  '/favicon-32x32.png',
  '/manifest.json'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  if (evt.request.mode === 'navigate') {
    evt.respondWith(
      fetch(evt.request).catch(() => caches.match(OFFLINE_URL))
    );
  } else {
    evt.respondWith(
      caches.match(evt.request).then((response) => response || fetch(evt.request))
    );
  }
});
