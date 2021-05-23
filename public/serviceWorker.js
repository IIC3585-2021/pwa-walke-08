const staticDevCoffee = "dev-coffee-site-v1"
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "https://raw.githubusercontent.com/ibrahima92/pwa-with-vanilla-js/master/images/coffee1.jpg",
  "https://raw.githubusercontent.com/ibrahima92/pwa-with-vanilla-js/master/images/coffee2.jpg",
  "https://raw.githubusercontent.com/ibrahima92/pwa-with-vanilla-js/master/images/coffee3.jpg",
  "https://raw.githubusercontent.com/ibrahima92/pwa-with-vanilla-js/master/images/coffee4.jpg",
  "https://raw.githubusercontent.com/ibrahima92/pwa-with-vanilla-js/master/images/coffee5.jpg",
  "https://raw.githubusercontent.com/ibrahima92/pwa-with-vanilla-js/master/images/coffee6.jpg",
  "https://raw.githubusercontent.com/ibrahima92/pwa-with-vanilla-js/master/images/coffee7.jpg",
  "https://raw.githubusercontent.com/ibrahima92/pwa-with-vanilla-js/master/images/coffee8.jpg",
  "https://raw.githubusercontent.com/ibrahima92/pwa-with-vanilla-js/master/images/coffee9.jpg",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDevCoffee).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})
