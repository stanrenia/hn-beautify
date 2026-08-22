/* Service worker — HN Moderne */
const VERSION = "hn-moderne-v4";
const SHELL_CACHE = `${VERSION}-shell`;
const DATA_CACHE = `${VERSION}-data`;

const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(SHELL_CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;

  // API HN : réseau d'abord, repli sur le cache (lecture hors ligne des derniers résultats)
  if (url.hostname === "hn.algolia.com") {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(DATA_CACHE).then((c) => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Polices Google : cache d'abord (immuables)
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(
      caches.match(e.request).then(
        (hit) =>
          hit ||
          fetch(e.request).then((res) => {
            const copy = res.clone();
            caches.open(DATA_CACHE).then((c) => c.put(e.request, copy));
            return res;
          })
      )
    );
    return;
  }

  // App shell (même origine) : cache d'abord, repli réseau, repli index.html
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(e.request).then(
        (hit) => hit || fetch(e.request).catch(() => caches.match("./index.html"))
      )
    );
  }
});
