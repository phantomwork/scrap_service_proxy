
import { Element } from '../Element.mjs';
import { Widget  } from '../Widget.mjs';
import { isArray } from '../../extern/base.mjs';



const Host = function(browser, actions) {

	this.actions = isArray(actions) ? actions : [ 'refresh', 'remove', 'save' ];
	this.element = new Element('browser-card-host', [
		'<h3 title="Domain" data-key="domain">example.com</h3>',
		'<button title="Toggle visibility of this card" data-action="toggle"></button>',
		'<browser-card-host-article>',
		'<textarea title="List of IPv4/IPv6 addresses" data-key="hosts" data-map="IP"></textarea>',
		'</browser-card-host-article>',
		'<browser-card-host-footer>',
		'<button title="Create Host" data-action="create"></button>',
		'<button title="Refresh Host" data-action="refresh"></button>',
		'<button title="Remove Host" data-action="remove"></button>',
		'<button title="Save Host" data-action="save"></button>',
		'</browser-card-host-footer>'
	]);

	this.buttons = {
		create:  this.element.query('button[data-action="create"]'),
		refresh: this.element.query('button[data-action="refresh"]'),
		remove:  this.element.query('button[data-action="remove"]'),
		save:    this.element.query('button[data-action="save"]'),
		toggle:  this.element.query('button[data-action="toggle"]')
	};

	this.model = {
		domain: this.element.query('[data-key="domain"]'),
		hosts:  this.element.query('[data-key="hosts"]')
	};

	Widget.call(this);


	this.element.on('show', () => {

		this.element.state('active');

		if (this.buttons.toggle !== null) {
			this.buttons.toggle.state('active');
		}

	});

	this.element.on('hide', () => {

		this.element.state('');

		if (this.buttons.toggle !== null) {
			this.buttons.toggle.state('');
		}

	});

	this.element.on('update', () => {

		this.buttons.create.erase();
		this.buttons.refresh.erase();
		this.buttons.remove.erase();
		this.buttons.save.erase();


		let article = this.element.query('browser-card-host-article');
		let footer  = this.element.query('browser-card-host-footer');
		let h3      = this.element.query('h3');

		if (this.actions.includes('create')) {

			if (this.model.domain.type === 'h3') {

				let input = new Element('input');

				input.attr('type',     'text');
				input.attr('data-key', 'domain');
				h3.attr('data-key',    '');

				input.value(h3.value());
				h3.value('');

				input.render(h3);

				this.model.domain = input;

			}

		} else {

			if (this.model.domain.type === 'input') {

				let input = this.model.domain;

				h3.attr('data-key', 'domain');
				h3.value(input.value());

				input.erase();

				this.model.domain = h3;

			}

		}


		if (this.actions.includes('create') || this.actions.includes('save')) {

			if (this.model.hosts.type === 'span') {

				let span     = this.model.hosts;
				let textarea = new Element('textarea');

				textarea.attr('title',    'List of IPv4/IPv6 addresses');
				textarea.attr('data-key', 'hosts');
				textarea.attr('data-map', 'IP');

				span.erase();

				textarea.value(span.value());
				textarea.render(article);

				this.model.hosts = textarea;

			}

		} else {

			if (this.model.hosts.type === 'textarea') {

				let span     = new Element('span');
				let textarea = this.model.hosts;

				span.attr('title',    'List of IPv4/IPv6 addresses');
				span.attr('data-key', 'hosts');
				span.attr('data-map', 'IP');

				textarea.erase();

				span.value(textarea.value());
				span.render(article);

				this.model.hosts = span;

			}

		}


		if (this.actions.includes('create')) {

			if (this.actions.includes('refresh')) {
				this.buttons.refresh.render(footer);
			}

			this.buttons.create.render(footer);

		} else if (this.actions.includes('save')) {

			if (this.actions.includes('refresh')) {
				this.buttons.refresh.render(footer);
			}

			if (this.actions.includes('remove')) {
				this.buttons.remove.render(footer);
			}

			this.buttons.save.render(footer);

		}

	});

	if (this.buttons.create !== null) {

		this.buttons.create.on('click', () => {

			let value = this.value();

			browser.client.services['host'].save(value, (result) => {

				if (result === true) {

					browser.settings['hosts'].removeEvery((h) => h.domain === value.domain);
					browser.settings['hosts'].push(value);


					if (this.actions.includes('create') === true) {
						this.actions.remove('create');
					}

					if (this.actions.includes('save') === false) {
						this.actions.push('save');
					}

					this.element.emit('update');

				}

			});

		});

	}

	if (this.buttons.refresh !== null) {

		this.buttons.refresh.on('click', () => {

			browser.client.services['host'].refresh(this.value(), (value) => {

				if (value !== null) {

					browser.settings['hosts'].removeEvery((h) => h.domain === value.domain);
					browser.settings['hosts'].push(value);

					this.value(value);


					if (this.actions.includes('create') === true) {
						this.actions.remove('create');
					}

					if (this.actions.includes('save') === false) {
						this.actions.push('save');
					}

					this.element.emit('update');

				}

			});

		});

	}

	if (this.buttons.remove !== null) {

		this.buttons.remove.on('click', () => {

			let value = this.value();

			browser.client.services['host'].remove(value, (result) => {

				if (result === true) {

					browser.settings['hosts'].removeEvery((h) => h.domain === value.domain);
					this.element.erase();

				}

			});

		});

	}

	if (this.buttons.save !== null) {

		this.buttons.save.on('click', () => {

			let value = this.value();

			browser.client.services['host'].save(value, (result) => {

				if (result === true) {

					browser.settings['hosts'].removeEvery((h) => h.domain === value.domain);
					browser.settings['hosts'].push(value);

				}

			});

		});

	}

	if (this.buttons.toggle !== null) {

		this.buttons.toggle.on('click', () => {

			if (this.element.state() === 'active') {
				this.element.emit('hide');
			} else {
				this.element.emit('show');
			}

		});

	}

	this.element.emit('update');

};


Host.prototype = Object.assign({}, Widget.prototype);


export { Host };

