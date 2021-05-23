const CACHE_STATIC = "static-v1";
const CACHE_DYNAMIC = "dynamic-v1";
const assets = [
  "/",
  "/index.html",
  "/src/style.css",
  "/src/script.js",
]

self.addEventListener("install", installEvent => {
  console.log('Installing service worker...', installEvent);
  installEvent.waitUntil(
    caches.open(CACHE_STATIC).then(cache => {
      cache.addAll(assets);
    })
  );
})

self.addEventListener('activate', e => {
  console.log('Activating Service worker...', e);
  return self.clients.claim();
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})
