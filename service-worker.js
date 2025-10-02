const CACHE = 'memory-match-v1';

// базовые статические ресурсы
const STATIC_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  // основные картинки/звуки
  'assets/leo_mascot.png',
  'assets/ui/wrong_overlay.png',
  'assets/sfx/scroll.wav',
  'assets/sfx/correct.wav',
  'assets/sfx/wrong_user.mp3',
  'assets/sfx/finish.wav',
  'assets/sfx/drop.wav',
  'assets/sounds/triumf.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Сетевой приоритет для JSON-списков, кэш как fallback
  if (request.url.includes('/assets/images/images.json') ||
      request.url.includes('/assets/words/words.json')) {
    event.respondWith(
      fetch(request).then((r) => {
        const copy = r.clone();
        caches.open(CACHE).then((c) => c.put(request, copy));
        return r;
      }).catch(() => caches.match(request))
    );
  } else {
    // Cache-first для всего остального
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
  }
});
