
import { isObject, isString } from './POLYFILLS.mjs';

import { console } from './console.mjs';
import { IP      } from './parser/IP.mjs';
import { Request } from './Request.mjs';



const remove_request = function(request) {

	let history = {};

	for (let tid in this.tabs) {

		let tab = this.tabs[tid];

		for (let t = 0; t < tab.length; t++) {

			if (tab[t] === request) {

				if (request.flags.webview === true) {

					let entries = history[tid] || null;
					if (entries === null) {
						entries = history[tid] = [];
					}

					entries.push(request.toJSON());

				}

				tab.splice(t, 1);
				t--;

			}

		}

	}

	Object.keys(history).forEach((tab) => {

		history[tab].forEach((request) => {

			let entries = this.history[tab] || null;
			if (entries === null) {
				entries = this.history[tab] = [];
			}

			entries.push(request);

		});

	});

};



let _id = 1;

const Session = function(headers) {

	headers = isObject(headers) ? headers : {};


	this.id      = '' + _id++;
	this.browser = 'Unknown';
	this.history = {};
	this.system  = 'Unknown';
	this.tabs    = {};
	this.warning = 0;


	let address = headers['@remote'] || null;
	if (address !== null) {

		let ip = IP.parse(address);
		if (ip.type !== null) {
			this.id = IP.render(ip);
		}

	}


	let agent = headers['user-agent'] || null;
	if (agent !== null) {

		if (/crios/.test(agent)) {
			this.browser = 'Chrome for iOS';
		} else if (/edge/.test(agent)) {
			this.browser = 'Edge';
		} else if (/android/.test(agent) && /silk\//.test(agent)) {
			this.browser = 'Silk';
		} else if (/chrome/.test(agent)) {
			this.browser = 'Chrome';
		} else if (/firefox/.test(agent)) {
			this.browser = 'Firefox';
		} else if (/android/.test(agent)) {
			this.browser = 'AOSP';
		} else if (/msie|trident/.test(agent)) {
			this.browser = 'IE';
		} else if (/safari\//.test(agent)) {
			this.browser = 'Safari';
		} else if (/applewebkit/.test(agent)) {
			this.browser = 'WebKit';
		}

		if (/android/.test(agent)) {
			this.system = 'Android';
		} else if (/iphone|ipad|ipod/.test(agent)) {
			this.system = 'iOS';
		} else if (/windows/.test(agent)) {
			this.system = 'Windows';
		} else if (/mac os x/.test(agent)) {
			this.system = 'Mac OS';
		} else if (/cros/.test(agent)) {
			this.system = 'Chrome OS';
		} else if (/linux/.test(agent)) {
			this.system = 'Linux';
		} else if (/firefox/.test(agent)) {
			this.system = 'Firefox OS';
		}

	}

};


Session.prototype = {

	toJSON: function() {

		let data = {
			id:      this.id,
			browser: this.browser,
			history: {},
			system:  this.system,
			tabs:    {},
			warning: this.warning
		};

		Object.keys(this.history).forEach((tab) => {
			data.history[tab] = this.history[tab];
		});

		Object.keys(this.tabs).forEach((tab) => {

			let requests = this.tabs[tab].filter((req) => req.flags.webview === true);
			if (requests.length > 0) {
				data.tabs[tab] = requests.map((req) => req.toJSON());
			}

		});

		return {
			type: 'Session',
			data: data
		};

	},

	get: function(url) {

		url = isString(url) ? url : null;


		if (url !== null) {

			let found = null;

			for (let id in this.tabs) {

				let requests = this.tabs[id];

				for (let r = 0, rl = requests.length; r < rl; r++) {

					let request = requests[r];
					if (request.url === url) {
						found = request;
						break;
					}

				}

				if (found !== null) {
					break;
				}

			}

			return found;

		}


		return null;

	},

	init: function() {

		console.log('session #' + this.id + ' connected.');

	},

	track: function(request, tab) {

		request = request instanceof Request ? request : null;
		tab     = isString(tab)              ? tab     : '0';


		if (request !== null && tab !== null) {

			let cache = this.tabs[tab] || null;
			if (cache === null) {
				cache = this.tabs[tab] = [];
			}

			if (cache.includes(request) === false) {

				request.on('connect', () => {
					console.log('session #' + this.id + ' tab #' + tab + ' requests ' + request.url);
				});

				request.on('progress', (response, progress) => {
					console.step('session #' + this.id + ' tab #' + tab + ' requests ' + request.url + ' (' + progress.bytes + '/' + progress.length + ')');
				});

				request.on('error',    () => remove_request.call(this, request));
				request.on('redirect', () => remove_request.call(this, request));
				request.on('response', () => remove_request.call(this, request));

				cache.push(request);

			}

		}

	},

	warn: function(service, method, event) {

		service = isString(service) ? service : null;
		method  = isString(method)  ? method  : null;
		event   = isString(event)   ? event   : null;


		this.warning++;


		if (service !== null) {

			if (method !== null) {
				console.warn('session #' + this.id + ' received warning #' + this.warning + ' for ' + service + '.' + method + '() call.');
			} else if (event !== null) {
				console.warn('session #' + this.id + ' received warning #' + this.warning + ' for ' + service + '@' + event + ' call.');
			} else {
				console.warn('session #' + this.id + ' received warning #' + this.warning + ' for ' + service + ' abuse.');
			}

		} else {
			console.warn('session #' + this.id + ' received warning #' + this.warning + '.');
		}


		if (this.warning >= 3) {
			this.kill();
		}

	},

	kill: function() {

		for (let tab in this.tabs) {

			this.tabs[tab].forEach((request) => {
				console.log('session #' + this.id + ' tab #' + tab + ' remains ' + request.url);
			});

		}

		console.log('session #' + this.id + ' disconnected.');

	}

};


export { Session };

