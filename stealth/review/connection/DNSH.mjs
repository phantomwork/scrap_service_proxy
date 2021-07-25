
import { isFunction       } from '../../../base/index.mjs';
import { describe, finish } from '../../../covert/index.mjs';
import { DNSH             } from '../../../stealth/source/connection/DNSH.mjs';
import { IP               } from '../../../stealth/source/parser/IP.mjs';
import { URL              } from '../../../stealth/source/parser/URL.mjs';



const CLOUDFLARE = Object.assign(URL.parse('https://cloudflare-dns.com:443/dns-query'), {
	hosts: [
		IP.parse('1.1.1.1'),
		IP.parse('2606:4700:4700::1111'),
		IP.parse('1.0.0.1'),
		IP.parse('2606:4700:4700::1001')
	]
});

const GOOGLE = Object.assign(URL.parse('https://dns.google:443/dns-query'), {
	hosts: [
		IP.parse('8.8.4.4'),
		IP.parse('2001:4860:4860::8844'),
		IP.parse('8.8.8.8'),
		IP.parse('2001:4860:4860::8888')
	]
});



describe('DNSH.send()/client/A/cloudflare', function(assert) {

	assert(isFunction(DNSH.send), true);

	let connection = DNSH.connect(CLOUDFLARE);

	connection.once('response', (response) => {

		assert(response, {
			headers: {
				'@id':       13337,
				'@type':     'response',
				'@status':   200,
				'@transfer': {
					'encoding': 'identity',
					'length':   45,
					'range':    [ 0, 44 ]
				}
			},
			payload: {
				questions: [{
					domain: 'example.com',
					type:   'A',
					value:  null
				}],
				answers: [{
					domain: 'example.com',
					type:   'A',
					value:  IP.parse('93.184.216.34')
				}]
			}
		});

	});

	connection.once('@connect', () => {

		DNSH.send(connection, {
			headers: {
				'@id': 13337
			},
			payload: {
				questions: [{
					domain: 'example.com',
					type:   'A',
					value:  null
				}]
			}
		}, (result) => {

			assert(result, true);

		});

	});

});

describe('DNSH.send()/client/A/google', function(assert) {

	assert(isFunction(DNSH.send), true);

	let connection = DNSH.connect(GOOGLE);

	connection.once('response', (response) => {

		assert(response, {
			headers: {
				'@id':       13337,
				'@type':     'response',
				'@status':   200,
				'@transfer': {
					'encoding': 'identity',
					'length':   45,
					'range':    [ 0, 44 ]
				}
			},
			payload: {
				questions: [{
					domain: 'example.com',
					type:   'A',
					value:  null
				}],
				answers: [{
					domain: 'example.com',
					type:   'A',
					value:  IP.parse('93.184.216.34')
				}]
			}
		});

	});

	connection.once('@connect', () => {

		DNSH.send(connection, {
			headers: {
				'@id': 13337
			},
			payload: {
				questions: [{
					domain: 'example.com',
					type:   'A',
					value:  null
				}]
			}
		}, (result) => {

			assert(result, true);

		});

	});

});


export default finish('stealth/connection/DNSH', {
	internet: true,
	network:  false,
	ports:    [ 443 ]
});

