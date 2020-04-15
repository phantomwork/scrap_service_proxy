
import { after, before, describe, finish                              } from '../../../covert/index.mjs';
import { connect as connect_stealth, disconnect as disconnect_stealth } from '../Stealth.mjs';
import { connect as connect_client, disconnect as disconnect_client   } from '../Client.mjs';



before(connect_stealth);
describe(connect_client);

describe('client.services.stash.save', function(assert) {

	assert(this.client !== null);
	assert(typeof this.client.services.stash.save === 'function');

	this.client.services.stash.save({
		domain: 'example.com',
		path:   '/review/client/stash.json',
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

describe('server.services.stash.save', function(assert) {

	assert(this.server !== null);
	assert(typeof this.server.services.stash.save === 'function');

	this.server.services.stash.save({
		domain: 'example.com',
		path:   '/review/client/stash.json',
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

describe('client.services.stash.info', function(assert) {

	assert(this.client !== null);
	assert(typeof this.client.services.stash.info === 'function');

	this.client.services.stash.info({
		domain: 'example.com',
		path:   '/review/client/stash.json'
	}, (response) => {

		assert(response !== null && response.headers.size > 0);
		assert(response !== null && response.headers.time !== null);

		assert(response !== null && response.payload.size > 0);
		assert(response !== null && response.payload.time !== null);

	});

});

describe('client.services.stash.read', function(assert) {

	assert(this.client !== null);
	assert(typeof this.client.services.stash.read === 'function');

	this.client.services.stash.read({
		domain: 'example.com',
		path:   '/review/client/stash.json'
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

describe('client.services.stash.remove', function(assert) {

	assert(this.client !== null);
	assert(typeof this.client.services.stash.remove === 'function');

	this.client.services.stash.remove({
		domain: 'example.com',
		path:   '/review/client/stash.json'
	}, (response) => {
		assert(response === true);
	});

});

describe('server.services.stash.remove', function(assert) {

	assert(this.server !== null);
	assert(typeof this.server.services.stash.remove === 'function');

	this.server.services.stash.remove({
		domain: 'example.com',
		path:   '/review/client/stash.json'
	}, (response) => {
		assert(response !== null && response.payload === false);
	});

});

describe(disconnect_client);
after(disconnect_stealth);


export default finish('stealth/client/Stash');

