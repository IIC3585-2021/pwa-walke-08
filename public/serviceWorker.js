const CACHE_STATIC = "static-v1";
const CACHE_DYNAMIC = "dynamic-v1";
const assets = [
  "/",
  "/index.html",
  "/src/style.css",
  "/src/script.js",
  "https://code.getmdl.io/1.3.0/material.indigo-pink.min.css",
  "https://code.getmdl.io/1.3.0/material.min.js",
  "https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
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

function isInArray(string, array) {
  for (let i=0; i < array.length; i++) {
    if (array[i] === string) {
      return true;
    }
  }
  return false;
}

self.addEventListener("fetch", fetchEvent => {
  if (isInArray(fetchEvent.request.url, assets)) {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request)
    )
  } else {
    fetchEvent.respondWith(
      fetch(fetchEvent.request)
        .then(res => {
          return caches.open(CACHE_DYNAMIC)
            .then(cache => {
              cache.put(fetchEvent.request.url, res.clone())
              return res;
            })
        })
        .catch(err => {
          return caches.match(fetchEvent.request)
        })
    )
  }
})

self.addEventListener('push', e => {
  let data = {title: "New", content: "Something new happened!"};
  if(e.data) {
    data = JSON.parse(e.data.text());
  }

  const options = {
    body: data.content,
    icon: "/src/images/android-icon-48-48.png",
    badge: "/src/images/android-icon-48-48.png",
  }

  e.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
