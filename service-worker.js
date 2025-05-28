const CACHE_NAME = 'virenna-cache-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './deckblatt.PNG',
  './van.PNG',
  './himalaya.PNG',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Installation – Dateien cachen
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Aktivierung – veraltete Caches löschen
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Abrufe abfangen – zuerst Cache, dann Netz
self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request)
      .then((response) => response || fetch(evt.request))
  );
});
