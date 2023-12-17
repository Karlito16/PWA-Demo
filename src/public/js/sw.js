import {
    del,
    entries
} from "https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm";


const staticCacheName = "static-cache-v1";
let filesToCache = [
    "https://code.jquery.com/jquery-3.3.1.slim.min.js",
    "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css",
    "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js",
    "https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm",
    "/",
    "/404",
    "/about",
    "/home", 
    "/offline"
];


self.addEventListener("install", event => {
    console.log("Attempting to install service worker and cache static assets");
    event.waitUntil(
        caches.open(staticCacheName).then(async cache => {
            const response = await fetch("/static");
            if (response.ok) {
                const staticFiles = await response.json();
                filesToCache = filesToCache.concat(staticFiles);
            }
            return cache.addAll(filesToCache);
        })
    );
});


self.addEventListener("activate", event => {
    console.log("Activating new service worker...");

    const cacheWhiteList = [staticCacheName];
    event.waitUntil(
        caches.keys().then(cacheNames => Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhiteList.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );
});


self.addEventListener("fetch", event => {
    console.log("Fetching...", event.request.url);
    event.respondWith(
        caches
            .match(event.request)
            .then(response => {
                if (response) {
                    console.log("Cache found: " + event.request.url);
                    return response;
                }
                console.log("Cache not found: " + event.request.url);

                return fetch(event.request).then(response => {
                    if (response.status === 404) {
                        return caches.match("/404");
                    }
                    // Dynamic content is not cached
                    return response;
                });
            })
            .catch(error => {
                console.log("Error: ", event.request.url, error);
                return caches.match("/offline");
            })
    );
});


self.addEventListener("sync", event => {
    console.log("Background sync!", event);
    entries().then(entries => 
        entries.forEach(entry => {
            let imageData = entry[1];
            let formData = new FormData();
            formData.append("image", imageData.image, imageData.time + ".upload");
            fetch("/uploads", { 
                method: "POST", 
                body: formData
            })
                .then(res => {
                    if (res.ok) {
                        console.log("Deleting from idb: ", imageData.time);
                        del(imageData.time);
                    } else {
                        // TODO: See what to do in this case
                        console.log(res);
                    }
                })
                .catch(error => console.log(error));
        })
    );
})