
import { isArray, isObject      } from '../../extern/base.mjs';
import { Element                } from '../../internal/index.mjs';
import { IP                     } from '../../source/parser/IP.mjs';
import { update as update_hosts } from './hosts.mjs';



const ELEMENTS = {
	input: {
		domain:     Element.query('#peers table tfoot *[data-key="domain"]'),
		connection: Element.query('#peers table tfoot *[data-key="connection"]'),
		button:     Element.query('#peers table tfoot *[data-action]')
	},
	label:  Element.query('#peers-filter label'),
	output: Element.query('#peers table tbody'),
	search: Element.query('#peers-filter input')
};

export const listen = function(settings, callback) {

	let domain = ELEMENTS.input.domain || null;
	if (domain !== null) {

		domain.on('change', () => {

			ELEMENTS.input.connection.value('offline');
			ELEMENTS.input.connection.state('disabled');

			ELEMENTS.input.button.attr('data-action', 'info');
			ELEMENTS.input.button.state('enabled');
			ELEMENTS.input.button.state('');

		});

	}

	let button = ELEMENTS.input.button || null;
	if (button !== null) {

		button.on('click', () => {

			if (button.attr('data-action') === 'info') {

				if (button.state() !== 'disabled') {

					button.state('disabled');
					button.state('busy');

					callback('info', {
						'domain': ELEMENTS.input.domain.value() || null
					}, (result, peer) => {

						if (isObject(peer)) {

							let domain = peer.domain || null;
							if (domain !== null) {

								if (ELEMENTS.input.domain.value() !== domain) {
									ELEMENTS.input.domain.value(domain);
								}

							}

							let connection = peer.connection || null;
							if (connection !== null) {
								ELEMENTS.input.connection.value(connection);
							} else {
								ELEMENTS.input.connection.value('offline');
							}

						} else {
							ELEMENTS.input.connection.value('offline');
						}


						if (result === true) {

							button.attr('data-action', 'confirm');
							button.state('enabled');
							button.state('');

						} else {

							ELEMENTS.input.connection.value('offline');

							button.attr('data-action', 'info');
							button.state('enabled');
							button.state('');

						}

					});

				}

			} else if (button.attr('data-action') === 'confirm') {

				if (button.state() !== 'disabled') {

					button.state('disabled');
					button.state('busy');

					callback('save', {
						'domain':     ELEMENTS.input.domain.value()     || null,
						'connection': ELEMENTS.input.connection.value() || 'offline'
					}, () => {

						ELEMENTS.input.connection.value('offline');

						button.attr('data-action', 'info');
						button.state('enabled');
						button.state('');

					});

				}

			}

		});

	}

	let output = ELEMENTS.output || null;
	if (output !== null) {

		output.on('click', (e) => {

			let target = e.target;
			let type   = target.tagName.toLowerCase();

			if (type === 'button') {

				let button  = Element.from(target, null, false);
				let action  = button.attr('data-action');
				let dataset = button.parent('tr');

				if (action !== null) {

					button.state('disabled');
					button.state('busy');

					callback(action, {
						'domain':     dataset.query('*[data-key="domain"]').value()     || null,
						'connection': dataset.query('*[data-key="connection"]').value() || null
					}, (result) => {

						button.state('enabled');
						button.state(result === true ? '' : 'error');

					});

				}

			}

		});

	}

	let search = ELEMENTS.search || null;
	if (search !== null) {

		search.on('change', () => {
			update(settings);
		});

	}

};

const render = (peer, actions, visible) => `
<tr data-visible="${visible}">
	<td data-key="domain">${peer.domain}</td>
	<td><button data-key="connection" data-val="${peer.connection}" disabled></button></td>
	<td>${actions.map((action) => '<button data-action="' + action + '"></button>').join('')}</td>
</tr>
`;

export const reset = () => {

	let domain = ELEMENTS.input.domain || null;
	if (domain !== null) {
		domain.value(null);
	}

	let connection = ELEMENTS.input.connection || null;
	if (connection !== null) {
		connection.value('offline');
		connection.state('disabled');
	}

	let button = ELEMENTS.input.button || null;
	if (button !== null) {
		button.attr('data-action', 'info');
		button.state('enabled');
		button.state('');
	}

};

const search = () => {

	let search = ELEMENTS.search || null;
	if (search !== null) {
		return search.value() || '';
	}

	return null;

};

export const sort = (a, b) => {

	let a_domains = a.domain.split('.').reverse();
	let b_domains = b.domain.split('.').reverse();

	let max = Math.max(a_domains.length, b_domains.length);

	for (let d = 0; d < max; d++) {

		let a_domain = a_domains[d] || null;
		let b_domain = b_domains[d] || null;

		if (a_domain === null) {

			if (b_domain === null) {
				return 0;
			} else {
				return -1;
			}

		} else if (b_domain === null) {
			return 1;
		}

		if (a_domain > b_domain) return  1;
		if (b_domain > a_domain) return -1;

	}

	return 0;

};

export const update = (settings, actions) => {

	settings = isObject(settings) ? settings : {};
	actions  = isArray(actions)   ? actions  : [ 'info', 'refresh', 'remove', 'save' ];


	if (isArray(settings['peers']) === true) {

		let visible = 0;
		let total   = settings['peers'].length;
		let value   = search();

		if (value === null) {

			ELEMENTS.output.value(settings['peers'].sort(sort).map((peer) => {
				visible++;
				return render(peer, actions, true);
			}));

		} else if (value !== '') {

			ELEMENTS.output.value(settings['peers'].sort(sort).map((peer) => {

				if (peer.domain.includes(value)) {
					visible++;
					return render(peer, actions, true);
				} else {
					return render(peer, actions, false);
				}

			}));

		} else {

			ELEMENTS.output.value(settings['peers'].sort(sort).map((peer) => {

				if (peer.domain.includes('.') === false) {
					visible++;
					return render(peer, actions, true);
				} else {
					return render(peer, actions, false);
				}

			}));

		}

		let label = ELEMENTS.label || null;
		if (label !== null) {
			label.value(visible + ' out of ' + total + ' Peers.');
		}

	}

};



export const init = (browser, settings, actions) => {

	actions  = isArray(actions)   ? actions  : [ 'info', 'refresh', 'remove', 'save' ];
	settings = isObject(settings) ? settings : browser.settings;


	if (isArray(settings['hosts']) === false) {
		settings['hosts'] = [];
	}

	if (isArray(settings['peers']) === false) {
		settings['peers'] = [];
	}


	listen(settings, (action, data, done) => {

		if (action === 'info') {

			let host_ip = IP.parse(data.domain);
			if (host_ip.type !== null) {

				browser.client.services.peer.proxy({
					host:    host_ip.ip,
					headers: {
						service: 'peer',
						method:  'info'
					},
					payload: null
				}, (peer) => {

					if (peer !== null) {

						let cache = settings['hosts'].find((h) => h.domain === peer.domain) || null;
						if (cache !== null) {

							let check = cache.hosts.find((h) => h.ip === host_ip.ip) || null;
							if (check !== null) {
								done(true, peer);
							} else {

								cache.hosts.push(host_ip);

								browser.client.services.host.save(cache, (result) => {

									if (result === true) {
										update_hosts(settings, actions);
									}

									done(result, peer);

								});

							}

						} else {

							browser.client.services.host.save({
								domain: peer.domain,
								hosts:  [ host_ip ]
							}, (result) => {
								done(result, peer);
							});

						}

					} else {
						done(false);
					}

				});

			} else {

				browser.client.services.host.read(data, (host) => {

					if (host !== null) {

						let cache = settings['hosts'].find((h) => h.domain === host.domain) || null;
						if (cache !== null) {
							cache.hosts = host.hosts;
						}

						update_hosts(settings, actions);

						browser.client.services.peer.proxy({
							domain:  host.domain,
							headers: {
								service: 'peer',
								method:  'info'
							},
							payload: null
						}, (peer) => {
							done(peer !== null, peer);
						});

					} else {
						done(false);
					}

				});

			}

		} else if (action === 'refresh') {

			browser.client.services.peer.refresh(data, (peer) => {

				if (peer !== null) {

					let cache = settings['peers'].find((p) => p.domain === peer.domain) || null;
					if (cache !== null) {
						cache.connection = data.connection;
					}

					update(settings, actions);

				}

				done(peer !== null);

			});

		} else if (action === 'remove') {

			browser.client.services.peer.remove(data, (result) => {

				if (result === true) {

					let cache = settings['peers'].find((p) => p.domain === data.domain) || null;
					if (cache !== null) {
						settings['peers'].remove(cache);
						update(settings, actions);
					}

				}

				done(result);

			});

		} else if (action === 'save') {

			browser.client.services.peer.save(data, (result) => {

				if (result === true) {

					let cache = settings['peers'].find((p) => p.domain === data.domain) || null;
					if (cache !== null) {
						cache.connection = data.connection;
					} else {
						settings['peers'].push(data);
					}

					update(settings, actions);

				}

				done(result);

			});

		} else {
			done(false);
		}

	});

	reset();

	update(settings, actions);

};

