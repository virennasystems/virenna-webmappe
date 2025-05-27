const CACHE_NAME = 'virenna-cache-v2';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './deckblatt.PNG',
  './van.PNG',
  './himalaya.PNG',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-144.png',
  './icon-256.png',
  './offline.html',
  './VIRENNA_Siegel_Transparent.png',
  './pattern.svg'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

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

self.addEventListener('fetch', (evt) => {
  if (evt.request.method !== 'GET') return;

  evt.respondWith(
    caches.match(evt.request).then((response) => {
      return response || fetch(evt.request).catch(() => {
        return caches.match('./offline.html');
      });
    })
  );
});
