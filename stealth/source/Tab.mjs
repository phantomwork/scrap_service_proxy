
import { isArray, isBoolean, isNumber, isObject, isString } from './BASE.mjs';
import { URL                                              } from './parser/URL.mjs';



const isConfig = function(config) {

	if (isObject(config) === true) {

		if (isString(config.domain) === true && isObject(config.mode) === true) {

			if (
				isBoolean(config.mode.text) === true
				&& isBoolean(config.mode.image) === true
				&& isBoolean(config.mode.audio) === true
				&& isBoolean(config.mode.video) === true
				&& isBoolean(config.mode.other) === true
			) {

				return true;

			}

		}

	}


	return false;

};

const isRequest = function(request) {
	return Object.prototype.toString.call(request) === '[object Request]';
};

const search = function(url) {

	url = isString(url) ? url : null;


	if (url !== null) {

		let found = null;

		for (let h = 0, hl = this.history.length; h < hl; h++) {

			let event = this.history[h];
			if (event.url === url) {
				found = event;
				break;
			}

		}

		return found;

	}


	return null;

};



let CURRENT_ID = 0;

const Tab = function(data) {

	let settings = Object.assign({}, data);


	this.id       = settings.id || ('' + CURRENT_ID++);
	this.history  = [];
	this.config   = {
		domain: null,
		mode: {
			text:  false,
			image: false,
			audio: false,
			video: false,
			other: false
		}
	};
	this.ref      = null;
	this.requests = [];
	this.url      = null;


	let cfg = isConfig(settings.config) ? settings.config : null;
	if (cfg !== null) {
		this.config = cfg;
	}


	let ref = URL.isURL(settings.ref) ? settings.ref : null;
	let url = isString(settings.url)  ? settings.url : null;

	if (ref !== null) {
		this.navigate(ref.url);
	} else if (url !== null) {
		this.navigate(url);
	}

};


Tab.from = function(json) {

	json = isObject(json) ? json : null;


	if (json !== null) {

		let type = json.type === 'Tab' ? json.type : null;
		let data = isObject(json.data) ? json.data : null;

		if (type !== null && data !== null) {

			let tab = new Tab();

			if (isString(data.id) === true) {
				tab.id = data.id;
			}

			if (isConfig(data.config) === true) {
				tab.config = data.config;
			}

			if (isArray(data.history) === true) {

				data.history.forEach((event) => {

					if (
						isNumber(event.time) === true
						&& isString(event.url) === true
					) {
						tab.history.push(event);
					}

				});

			}

			if (isArray(data.requests) === true) {
				// Do nothing
			}

			if (isString(data.url) === true) {
				tab.navigate(data.url);
			}

		}

	}


	return null;

};


Tab.merge = function(target, source) {

	target = target instanceof Tab ? target : null;
	source = source instanceof Tab ? source : null;


	if (target !== null && source !== null) {

		if (isString(source.id) === true) {
			target.id = source.id;
		}

		if (isConfig(source.config) === true) {
			target.config = source.config;
		}

		if (isArray(source.history) === true) {

			source.history.forEach((event) => {

				if (
					isNumber(event.time) === true
					&& isString(event.url) === true
				) {
					target.history.push(event);
				}

			});

		}

		if (isArray(source.requests) === true) {

			source.requests.forEach((request) => {

				if (isRequest(request) === true) {
					target.track(request);
				}

			});

		}

		if (isString(source.url) === true) {
			target.navigate(source.url);
		}

	}


	return target;

};


Tab.prototype = {

	[Symbol.toStringTag]: 'Tab',

	toJSON: function() {

		let data = {
			id:       this.id,
			config:   {
				domain: this.config.domain,
				mode:   {
					text:  this.config.mode.text,
					image: this.config.mode.image,
					audio: this.config.mode.audio,
					video: this.config.mode.video,
					other: this.config.mode.other
				}
			},
			history:  this.history.map((event) => ({
				time: event.time,
				url:  event.url
			})),
			requests: this.requests.map((request) => request.toJSON()),
			url:      this.url
		};


		return {
			type: 'Tab',
			data: data
		};

	},

	back: function() {

		let event = search.call(this, this.url);
		if (event !== null) {

			let index = this.history.indexOf(event);
			if (index > 0) {

				let tmp = this.history[index - 1] || null;
				if (tmp !== null) {

					this.url = tmp.url;
					this.ref = URL.parse(tmp.url);

					return true;

				}

			}

		}


		return false;

	},

	can: function(action) {

		action = isString(action) ? action : null;


		if (action === 'back') {

			let event = search.call(this, this.url);
			if (event !== null) {

				let index = this.history.indexOf(event);
				if (index > 0) {
					return true;
				}

			}

		} else if (action === 'next') {

			let event = search.call(this, this.url);
			if (event !== null) {

				let index = this.history.indexOf(event);
				if (index < this.history.length - 1) {
					return true;
				}

			}

		} else if (action === 'pause') {

			let loading = this.requests.find((request) => {

				if (
					request.timeline.init !== null
					&& request.timeline.error === null
					&& request.timeline.redirect === null
					&& request.timeline.response === null
				) {
					return true;
				}

				return false;

			}) || null;
			if (loading !== null) {
				return true;
			}

		}


		return false;

	},

	forget: function(until) {

		until = isString(until) ? until : null;


		let limit = null;

		if (until === 'stealth') {
			limit = Date.now();
		} else if (until === 'day') {
			limit = Date.now() - (1000 * 60 * 60 * 24);
		} else if (until === 'week') {
			limit = Date.now() - (1000 * 60 * 60 * 24 * 7);
		} else if (until === 'forever') {
			limit = null;
		}

		if (limit !== null) {

			for (let h = 0, hl = this.history.length; h < hl; h++) {

				let event = this.history[h];
				if (event.time < limit) {
					this.history.splice(h, 1);
					hl--;
					h--;
				}

			}

			return true;

		}


		return false;

	},

	includes: function(request) {

		request = isRequest(request) ? request : null;


		if (request !== null) {

			if (this.requests.includes(request) === true) {
				return true;
			}

		}


		return false;

	},

	kill: function() {

		this.requests.forEach((request) => {
			request.kill();
		});


		this.config = {
			domain: null,
			mode: {
				text:  false,
				image: false,
				audio: false,
				video: false,
				other: false
			}
		};

		this.history  = [];
		this.ref      = null;
		this.requests = [];
		this.url      = null;

	},

	navigate: function(url) {

		url = isString(url) ? url : null;


		if (url !== null) {

			if (url.includes('./') || url.includes('../')) {
				url = URL.resolve(this.url, url).url;
			}

			if (this.url !== url) {

				let event1 = search.call(this, this.url);
				if (event1 !== null) {

					let index1 = this.history.indexOf(event1);
					if (index1 < this.history.length - 1) {
						this.history.splice(index1 + 1);
					}

				}

				this.url = url;
				this.ref = URL.parse(url);

				let event2 = search.call(this, url);
				if (event2 !== null) {

					let index2 = this.history.indexOf(event2);
					if (index2 !== -1) {
						this.history.splice(index2, 1);
					}

				}

				this.history.push({
					time: Date.now(),
					url:  url
				});

				return true;

			}

		}


		return false;

	},

	next: function() {

		let event = search.call(this, this.url);
		if (event !== null) {

			let index = this.history.indexOf(event);
			if (index < this.history.length - 1) {

				let tmp = this.history[index + 1] || null;
				if (tmp !== null) {

					this.url = tmp.url;
					this.ref = URL.parse(tmp.url);

					return true;

				}

			}

		}


		return false;

	},

	pause: function() {

		let requests = this.requests.filter((request) => {

			if (
				request.timeline.init !== null
				&& request.timeline.error === null
				&& request.timeline.redirect === null
				&& request.timeline.response === null
			) {

				return true;

			}

			return false;

		});


		if (requests.length > 0) {

			requests.forEach((request) => {
				request.kill();
			});

			return true;

		}


		return false;

	},

	remove: function(request) {

		request = isRequest(request) ? request : null;


		if (request !== null) {

			for (let r = 0, rl = this.requests.length; r < rl; r++) {

				if (this.requests[r] === request) {
					this.requests.splice(r, 1);
					rl--;
					r--;
				}

			}

			return true;

		}


		return false;

	},

	track: function(request) {

		request = isRequest(request) ? request : null;


		if (request !== null) {

			if (this.requests.includes(request) === false) {
				this.requests.push(request);
			}

			return true;

		}


		return false;

	}

};


export { Tab };

