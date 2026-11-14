const CACHE_NAME = 'latoxa-cache-v1'; // Cambia la versión (ej. v2, v3) cada vez que actualices juegos

// Instalar el Service Worker y guardar en caché los archivos base
self.addEventListener('install', event => {
  self.skipWaiting(); // Fuerza a que la nueva versión se active inmediatamente
});

// Activar y limpiar cachés viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // Borra las versiones de caché obsoletas
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar peticiones para buscar siempre contenido nuevo en la red
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request)) // Si no hay internet, usa el caché
  );
});
