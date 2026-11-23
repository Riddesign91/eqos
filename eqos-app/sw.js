const CACHE_NAME = 'eqos-v2'; // Incrementamos la versión para forzar actualización
const ASSETS = [
  '/',
  '/index.html',
  '/preguntas.js', // El archivo externo con las 366 preguntas
  '/manifest.json',
  '/pluma_eqos.png',
  '/logo_eqos.png'
];

// Instalación: Guardamos los archivos en la caché del dispositivo
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cacheando refugio Eqos...');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación: Limpiamos versiones antiguas de la caché
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});

// Estrategia de carga: Intentar red, si falla usar caché
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});