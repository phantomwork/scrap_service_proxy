
import { after, before, describe, finish                      } from '../../source/Review.mjs';
import { connect as srv_connect, disconnect as srv_disconnect } from '../Server.mjs';
import { connect as cli_connect, disconnect as cli_disconnect } from '../Client.mjs';



before(srv_connect);
describe(cli_connect);

describe('client.services.cache.save', function(assert) {

	assert(this.client !== null);
	assert(typeof this.client.services.cache.save === 'function');

	this.client.services.cache.save({
		domain: 'example.com',
		path:   '/review/client/cache.json',
		headers: {
			'x-test': 'save'
		},
		payload: {
			foo: 'bar'
		}
	}, (response) => {
		assert(response === true);
	});

});

describe('client.services.cache.info', function(assert) {

	assert(this.client !== null);
	assert(typeof this.client.services.cache.info === 'function');

	this.client.services.cache.info({
		domain: 'example.com',
		path:   '/review/client/cache.json'
	}, (response) => {

		assert(response !== null && response.headers.size > 0);
		assert(response !== null && response.headers.time !== null);

		assert(response !== null && response.payload.size > 0);
		assert(response !== null && response.payload.time !== null);

	});

});

describe('client.services.cache.read', function(assert) {

	assert(this.client !== null);
	assert(typeof this.client.services.cache.read === 'function');

	this.client.services.cache.read({
		domain: 'example.com',
		path:   '/review/client/cache.json'
	}, (response) => {

		assert(response !== null && response.headers['x-test'] === 'save');
		assert(response !== null && response.payload !== null);

		let data = null;
		let temp = response.payload || null;
		if (temp !== null) {

			try {
				data = JSON.parse(temp.toString('utf8'));
			} catch (err) {
				data = null;
			}

		}

		assert(data !== null && typeof data === 'object');
		assert(data !== null && data.foo === 'bar');

	});

});

describe('client.services.cache.remove', function(assert) {

	assert(this.client !== null);
	assert(typeof this.client.services.cache.remove === 'function');

	this.client.services.cache.remove({
		domain: 'example.com',
		path:   '/review/client/cache.json'
	}, (response) => {
		assert(response === true);
	});

});

describe('server.services.cache.save', function(assert) {

	assert(this.server !== null);
	assert(typeof this.server.services.cache.save === 'function');

	this.server.services.cache.save({
		domain: 'example.com',
		path:   '/review/client/cache.json',
		headers: {
			'x-test': 'save'
		},
		payload: {
			foo: 'bar'
		}
	}, (response) => {
		assert(response !== null && response.payload === true);
	});

});

describe('server.services.cache.remove', function(assert) {

	assert(this.server !== null);
	assert(typeof this.server.services.cache.remove === 'function');

	this.server.services.cache.remove({
		domain: 'example.com',
		path:   '/review/client/cache.json'
	}, (response) => {
		assert(response !== null && response.payload === true);
	});

});

describe(cli_disconnect);
after(srv_disconnect);



export default finish('client/Cache');

