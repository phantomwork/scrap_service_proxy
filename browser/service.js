
/*
 * WARNING: This file is autogenerated by "/browser/make.mjs build"
 */

const VERSION = 'X0:2021-11-11';
const ASSETS  = [
	'design/Assistant.mjs',
	'design/Element.mjs',
	'design/Widget.mjs',
	'design/appbar/Address.blur.wav',
	'design/appbar/Address.css',
	'design/appbar/Address.focus.wav',
	'design/appbar/Address.mjs',
	'design/appbar/Address.navigate.wav',
	'design/appbar/History.back.wav',
	'design/appbar/History.css',
	'design/appbar/History.mjs',
	'design/appbar/History.next.wav',
	'design/appbar/History.open.wav',
	'design/appbar/History.pause.wav',
	'design/appbar/History.refresh.wav',
	'design/appbar/Mode.click.wav',
	'design/appbar/Mode.css',
	'design/appbar/Mode.mjs',
	'design/appbar/Settings.browser.wav',
	'design/appbar/Settings.css',
	'design/appbar/Settings.hide.wav',
	'design/appbar/Settings.mjs',
	'design/appbar/Settings.show.wav',
	'design/appbar/Splitter.css',
	'design/appbar/Splitter.mjs',
	'design/backdrop/Tabs.close.wav',
	'design/backdrop/Tabs.css',
	'design/backdrop/Tabs.mjs',
	'design/backdrop/Tabs.select.wav',
	'design/backdrop/Webview.css',
	'design/backdrop/Webview.mjs',
	'design/card/Beacon.css',
	'design/card/Beacon.mjs',
	'design/card/Blocker.css',
	'design/card/Blocker.mjs',
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
	'design/card/Policy.css',
	'design/card/Policy.mjs',
	'design/card/Redirect.css',
	'design/card/Redirect.mjs',
	'design/card/Session.css',
	'design/card/Session.mjs',
	'design/card/Settings.css',
	'design/card/Settings.mjs',
	'design/card/Tab.css',
	'design/card/Tab.mjs',
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
	'design/common/theme-dark-element-select-default.svg',
	'design/common/theme-dark-element-select-focus.svg',
	'design/common/theme-light-element-select-default.svg',
	'design/common/theme-light-element-select-focus.svg',
	'design/common/theme.css',
	'design/common/tholian-android.png',
	'design/common/tholian-apple.png',
	'design/common/tholian.ico',
	'design/common/tholian.svg',
	'design/common/vera-mono.woff',
	'design/index.css',
	'design/index.mjs',
	'design/menu/Context.css',
	'design/menu/Context.hide.wav',
	'design/menu/Context.mjs',
	'design/menu/Context.select.wav',
	'design/menu/Context.show.wav',
	'design/menu/Help.css',
	'design/menu/Help.mjs',
	'design/sheet/Console.css',
	'design/sheet/Console.hide.wav',
	'design/sheet/Console.mjs',
	'design/sheet/Console.show.wav',
	'design/sheet/Session.css',
	'design/sheet/Session.mjs',
	'design/sheet/Site.css',
	'design/sheet/Site.mjs',
	'design/widget/Audio.css',
	'design/widget/Audio.mjs',
	'design/widget/Image.css',
	'design/widget/Image.mjs',
	'design/widget/Video.css',
	'design/widget/Video.mjs',
	'extern/base.mjs',
	'index.html',
	'index.mjs',
	'index.webmanifest',
	'internal/blank.html',
	'internal/debug.html',
	'internal/debug.mjs',
	'internal/debug/Browser.css',
	'internal/debug/Browser.mjs',
	'internal/fix-connection.html',
	'internal/fix-host.html',
	'internal/fix-mode.html',
	'internal/media.html',
	'internal/media.mjs',
	'internal/media/Media.css',
	'internal/media/Media.mjs',
	'internal/search.html',
	'internal/search.mjs',
	'internal/search/Search.css',
	'internal/search/Search.mjs',
	'internal/settings.html',
	'internal/settings.mjs',
	'internal/welcome.html',
	'service.js',
	'source/Browser.mjs',
	'source/Client.mjs',
	'source/ENVIRONMENT.mjs',
	'source/Session.mjs',
	'source/Tab.mjs',
	'source/client/service/Beacon.mjs',
	'source/client/service/Blocker.mjs',
	'source/client/service/Cache.mjs',
	'source/client/service/Host.mjs',
	'source/client/service/Mode.mjs',
	'source/client/service/Peer.mjs',
	'source/client/service/Policy.mjs',
	'source/client/service/Redirect.mjs',
	'source/client/service/Session.mjs',
	'source/client/service/Settings.mjs',
	'source/parser/CSS.mjs',
	'source/parser/DATETIME.mjs',
	'source/parser/HOSTS.mjs',
	'source/parser/HTML.mjs',
	'source/parser/IP.mjs',
	'source/parser/NET.mjs',
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

				if (new URL(response.url).origin !== self.location.origin) {

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

