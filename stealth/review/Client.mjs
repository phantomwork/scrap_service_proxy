
import { after, before, describe, finish                              } from '../../covert/index.mjs';
import { Client, isClient                                             } from '../../stealth/source/Client.mjs';
import { connect as connect_stealth, disconnect as disconnect_stealth } from './Stealth.mjs';



before(connect_stealth);

export const connect = before('Client.prototype.connect()', function(assert) {

	this.client = new Client({
		host: '127.0.0.1'
	});

	this.client.once('connect', () => {

		this.client.services['mockup'] = null;
		assert(true);

	});

	assert(this.client.connect());

});

describe('new Client()', function(assert) {

	let client = new Client({
		host: '127.0.0.3'
	});

	assert(client._settings.host,   '127.0.0.3');

	assert(Client.isClient(client), true);
	assert(isClient(client),        true);

});

describe('Client.isClient()', function(assert) {

	assert(typeof Client.isClient, 'function');

	assert(Client.isClient(this.client), true);

});

describe('isClient()', function(assert) {

	assert(typeof isClient, 'function');

	assert(isClient(this.client), true);

});

describe('Client.prototype.is()', function(assert) {

	assert(this.client.is('connected'), true);

});

describe('Client.prototype.send()/event', function(assert) {

	this.client.once('response', (response) => {
		assert(response.headers.service, 'mockup');
		assert(response.headers.event,   'event');
		assert(response.payload,         'payload');
	});

	this.client.send({
		headers: {
			service: 'mockup',
			event:   'event'
		},
		payload: 'payload'
	});

});

describe('Client.prototype.send()/method', function(assert) {

	this.client.once('response', (response) => {
		assert(response.headers.service, 'mockup');
		assert(response.headers.method,  'method');
		assert(response.payload,         'payload');
	});

	this.client.send({
		headers: {
			service: 'mockup',
			method:  'method'
		},
		payload: 'payload'
	});

});

export const disconnect = after('Client.prototype.disconnect()', function(assert) {

	this.client.once('disconnect', () => {

		this.client = null;

		assert(true);

	});

	assert(this.client.disconnect(), true);

});

after(disconnect_stealth);


export default finish('stealth/Client');

