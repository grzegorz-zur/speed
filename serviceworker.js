self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open("speed").then((cache) => {
			return cache.addAll([
				"/",
				"/manifest.webmanifest",
				"/style.css",
				"/script.js",
				"/serviceworker.js",
				"/icon.svg",
				"/icon.png"				
			]);
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		fetch(event.request).catch(function() {
			return caches.match(event.request);
		})
	);
});
