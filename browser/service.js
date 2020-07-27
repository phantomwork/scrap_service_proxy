
/*
 * WARNING: This file is generated by /bin/generate-service.sh
 */

const VERSION = 'X0:2020-03';
const ASSETS  = [
	'app/electron.js',
	'app/gjs.js',
	'browser.mjs',
	'design/Element.mjs',
	'design/Widget.mjs',
	'design/appbar/Address.css',
	'design/appbar/Address.mjs',
	'design/appbar/History.css',
	'design/appbar/History.mjs',
	'design/appbar/Mode.css',
	'design/appbar/Mode.mjs',
	'design/appbar/Settings.css',
	'design/appbar/Settings.mjs',
	'design/appbar/Splitter.css',
	'design/appbar/Splitter.mjs',
	'design/backdrop/Help.css',
	'design/backdrop/Help.mjs',
	'design/backdrop/Tabs.css',
	'design/backdrop/Tabs.mjs',
	'design/backdrop/Webview.css',
	'design/backdrop/Webview.mjs',
	'design/card/Host.css',
	'design/card/Host.mjs',
	'design/card/Mode.css',
	'design/card/Mode.mjs',
	'design/common/android-chrome-192x192.png',
	'design/common/android-chrome-256x256.png',
	'design/common/apple-touch-icon-120x120.png',
	'design/common/apple-touch-icon-152x152.png',
	'design/common/apple-touch-icon-180x180.png',
	'design/common/apple-touch-icon-60x60.png',
	'design/common/apple-touch-icon-76x76.png',
	'design/common/apple-touch-icon.png',
	'design/common/browserconfig.xml',
	'design/common/elements.css',
	'design/common/favicon-16x16.png',
	'design/common/favicon-32x32.png',
	'design/common/favicon.ico',
	'design/common/favicon.png',
	'design/common/icon.woff',
	'design/common/index.css',
	'design/common/layout.css',
	'design/common/mstile-150x150.png',
	'design/common/museo-bold.woff',
	'design/common/museo.woff',
	'design/common/safari-pinned-tab.svg',
	'design/common/theme.css',
	'design/common/vera-mono.woff',
	'design/index.css',
	'design/index.mjs',
	'design/menu/Context.css',
	'design/menu/Context.mjs',
	'design/sheet/Console.css',
	'design/sheet/Console.mjs',
	'design/sheet/Session.css',
	'design/sheet/Session.mjs',
	'design/sheet/Site.css',
	'design/sheet/Site.mjs',
	'extern/base.mjs',
	'index.html',
	'index.mjs',
	'index.webmanifest',
	'internal/fix-host.css',
	'internal/fix-host.html',
	'internal/fix-host.mjs',
	'internal/fix-mode.css',
	'internal/fix-mode.html',
	'internal/fix-mode.mjs',
	'internal/fix-request.css',
	'internal/fix-request.html',
	'internal/fix-request.mjs',
	'internal/welcome.css',
	'internal/welcome.html',
	'service.js',
	'source/Browser.mjs',
	'source/Client.mjs',
	'source/ENVIRONMENT.mjs',
	'source/Tab.mjs',
	'source/client/Beacon.mjs',
	'source/client/Blocker.mjs',
	'source/client/Cache.mjs',
	'source/client/Host.mjs',
	'source/client/Mode.mjs',
	'source/client/Peer.mjs',
	'source/client/Redirect.mjs',
	'source/client/Session.mjs',
	'source/client/Settings.mjs',
	'source/client/Stash.mjs',
	'source/parser/CSS.mjs',
	'source/parser/CSS/COLORS.mjs',
	'source/parser/CSS/NORMAL.mjs',
	'source/parser/CSS/RULE.mjs',
	'source/parser/CSS/SHORTHAND.mjs',
	'source/parser/CSS/STYLES.mjs',
	'source/parser/HOSTS.mjs',
	'source/parser/IP.mjs',
	'source/parser/UA.mjs',
	'source/parser/URL.mjs'
];

const autofetch = (request) => {

	if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
		return null;
	} else {

		return fetch(request).then((response) => {

			let url = response.url || null;
			if (url !== null) {

				if (new URL(response.url).origin !== location.origin) {

					return response;

				} else {

					return caches.open(VERSION).then((cache) => {
						cache.put(request, response.clone());
						return response;
					});

				}

			} else {
				return response;
			}

		});

	}

};



self.addEventListener('activate', (event) => {

	event.waitUntil(caches.keys().then((keys) => {

		return Promise.all(keys.map((key) => {

			if (key !== VERSION) {
				return caches.delete(key);
			}

		}));

	}));

});

self.addEventListener('fetch', (event) => {

	event.respondWith(caches.open(VERSION).then((cache) => {

		return cache.match(event.request, {
			ignoreMethod: true,
			ignoreSearch: true
		}).then((response) => {

			if (response) {
				return response;
			} else {
				return autofetch(event.request);
			}

		});

	}));

});

self.addEventListener('install', (event) => {

	event.waitUntil(caches.open(VERSION).then((cache) => {

		return cache.addAll(ASSETS).catch((err) => {
			console.error(err);
		});

	}).catch((err) => {
		console.error(err);
	}));

});

