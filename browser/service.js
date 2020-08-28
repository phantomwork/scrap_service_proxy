
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
	'design/backdrop/Tabs.css',
	'design/backdrop/Tabs.mjs',
	'design/backdrop/Webview.css',
	'design/backdrop/Webview.mjs',
	'design/card/Beacon.css',
	'design/card/Beacon.mjs',
	'design/card/Host.css',
	'design/card/Host.mjs',
	'design/card/Interface.css',
	'design/card/Interface.mjs',
	'design/card/Internet.css',
	'design/card/Internet.mjs',
	'design/card/Mode.css',
	'design/card/Mode.mjs',
	'design/card/Peer.css',
	'design/card/Peer.mjs',
	'design/card/Redirect.css',
	'design/card/Redirect.mjs',
	'design/common/crystalline-bold.woff',
	'design/common/crystalline-light.woff',
	'design/common/crystalline-medium.woff',
	'design/common/crystalline-regular.woff',
	'design/common/elements.css',
	'design/common/icon.woff',
	'design/common/index.css',
	'design/common/layout.css',
	'design/common/museo-medium.woff',
	'design/common/museo-regular.woff',
	'design/common/stealth-apple.png',
	'design/common/stealth.ico',
	'design/common/stealth.png',
	'design/common/stealth.svg',
	'design/common/theme.css',
	'design/common/tholian.svg',
	'design/common/vera-mono.woff',
	'design/index.css',
	'design/index.mjs',
	'design/menu/Context.css',
	'design/menu/Context.mjs',
	'design/menu/Help.css',
	'design/menu/Help.mjs',
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
	'internal/blank.html',
	'internal/debug.html',
	'internal/debug.mjs',
	'internal/fix-host.html',
	'internal/fix-mode.html',
	'internal/fix-request.css',
	'internal/fix-request.html',
	'internal/fix-request.mjs',
	'internal/settings.html',
	'internal/settings.mjs',
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

				if (new URL(response.url).origin !== window.location.origin) {

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

