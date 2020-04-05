
import { isArray, isBoolean, isObject, isString } from '../../stealth/source/BASE.mjs';
import { console                                } from '../../stealth/source/console.mjs';



const flatten_tests = (review) => {

	let array = [];

	if (review.before !== null) {
		array.push(review.before);
	}

	if (review.tests.length > 0) {
		review.tests.forEach((test) => {
			array.push(test);
		});
	}

	if (review.after !== null) {
		array.push(review.after);
	}

	return array;

};

const indent = (data) => {

	let dummy = '';

	if (isArray(data)) {

		data.forEach((value) => {

			if (value.length > dummy.length) {
				dummy = new Array(value.length).fill(' ').join('');
			}

		});

	}

	return function(str) {

		if (isString(str)) {
			return dummy.substr(0, dummy.length - str.length);
		}

		return '';

	};

};

const render_complete = function(review, is_current) {

	is_current = isBoolean(is_current) ? is_current : false;


	if (review.state === null) {

		if (is_current === true) {
			console.blink('review/' + review.id + '.mjs:');
		} else {
			console.log('review/' + review.id + '.mjs:');
		}

	} else if (review.state === 'okay') {
		console.info('review/' + review.id + '.mjs:');
	} else if (review.state === 'wait') {
		console.warn('review/' + review.id + '.mjs:');
	} else if (review.state === 'fail') {
		console.error('review/' + review.id + '.mjs:');
	}


	let action  = this.settings.action || null;
	let tests   = flatten_tests(review);
	let current = tests.find((test) => test.state === null) || null;
	let div1    = indent(tests.map((test) => test.name));
	let div2    = indent(tests.map((test) => test.results.render()));

	tests.forEach((test) => {

		let message = '>';

		message += ' ' + test.name;
		message += ' ' + div1(test.name);

		if (action === 'scan') {

			message += test.results.render();

		} else if (action === 'time') {

			message += test.timeline.render();

		} else if (action === 'watch') {

			let str1 = test.results.render();
			let str2 = test.timeline.render();

			message += str1;
			message += div2(str1);
			message += str2;

		}

		if (
			is_current === true
			&& (test === current || test.state === null)
		) {
			console.blink(message);
		} else if (test.state === null) {
			console.log(message);
		} else if (test.state === 'okay') {
			console.info(message);
		} else if (test.state === 'wait') {
			console.warn(message);
		} else if (test.state === 'fail') {
			console.error(message);
		}

	});


	if (review.state === null) {

		if (is_current === true) {
			console.blink('running ...');
		} else {
			console.log('what?');
		}

	} else if (review.state === 'okay') {
		console.info('okay.');
	} else if (review.state === 'wait') {
		console.warn('wait ...');
	} else if (review.state === 'fail') {
		console.error('fail!');
	}

};

const render_partial = function(reviews, prev_state, curr_state) {

	let candidates         = [];
	let unrendered_reviews = [];
	let unrendered_tests   = [];

	if (prev_state.review === null && curr_state.review !== null) {

		let index1 = 0;
		let index2 = reviews.indexOf(curr_state.review);

		if (index1 !== -1 && index2 !== -1) {
			candidates = reviews.slice(index1, index2 + 1);
		}

	} else if (prev_state.review !== null && curr_state.review !== null) {

		let index1 = reviews.indexOf(prev_state.review);
		let index2 = reviews.indexOf(curr_state.review);
		if (index1 !== -1 && index2 !== -1) {
			candidates = reviews.slice(index1, index2 + 1);
		}

	}


	if (candidates.length > 0) {

		candidates.forEach((review) => {

			let tests  = flatten_tests(review);
			let index1 = -1;
			let index2 = -1;

			if (prev_state.test !== null) {

				let check = tests.indexOf(prev_state.test);
				if (check !== -1) {
					index1 = tests.indexOf(prev_state.test);
				} else {
					index1 = 0;
				}

			} else {
				index1 = 0;
			}

			if (curr_state.test !== null) {

				let check = tests.indexOf(curr_state.test);
				if (check !== -1) {
					index2 = check + 1;
				} else {
					index2 = tests.length;
				}

			} else {

				let current = tests.find((test) => test.state === null) || null;
				if (current !== null) {
					index2 = tests.indexOf(current) + 1;
				} else {
					index2 = tests.length;
				}

			}


			if (index1 !== -1 && index2 !== -1) {

				tests.slice(index1, index2).forEach((test) => {
					unrendered_reviews.push(review);
					unrendered_tests.push(test);
				});

			}

		});

	}


	if (unrendered_reviews.length > 0 && unrendered_tests.length > 0) {

		let action      = this.settings.action || null;
		let last_review = prev_state.review    || null;
		let last_test   = prev_state.test      || null;
		let last_result = prev_state.result    || null;

		unrendered_tests.forEach((test, t) => {

			let review = unrendered_reviews[t] || null;
			if (review !== last_review) {

				if (review.state === null) {
					console.log('review/' + review.id + '.mjs:');
				} else if (review.state === 'okay') {
					console.info('review/' + review.id + '.mjs:');
				} else if (review.state === 'wait') {
					console.warn('review/' + review.id + '.mjs:');
				} else if (review.state === 'fail') {
					console.error('review/' + review.id + '.mjs:');
				}

				last_review = review;

			}

			let result = test.results.current();

			if (
				test !== last_test
				|| (test === last_test && result !== last_result)
			) {

				let message = '>';

				message += ' ' + test.name;
				message += ' ';

				if (action === 'scan') {

					message += test.results.render();

				} else if (action === 'time') {

					message += test.timeline.render();

				} else if (action === 'watch') {

					let str1 = test.results.render();
					let str2 = test.timeline.render();

					message += str1;
					message += ' ';
					message += str2;

				}

				if (test.state === null) {
					console.log(message);
				} else if (test.state === 'okay') {
					console.info(message);
				} else if (test.state === 'wait') {
					console.warn(message);
				} else if (test.state === 'fail') {
					console.error(message);
				}

			}

		});


		prev_state.review = curr_state.review;
		prev_state.test   = curr_state.test;
		prev_state.result = curr_state.test.results.current();

	}

};

const render_summary = function(review, is_current) {

	is_current = isBoolean(is_current) ? is_current : false;


	if (review.state === 'okay') {

		console.info('review/' + review.id + '.mjs: okay.');

	} else if (
		review.state === null
		|| review.state === 'wait'
		|| review.state === 'fail'
	) {

		if (review.state === null) {

			if (is_current === true) {
				console.blink('review/' + review.id + '.mjs:');
			} else {
				console.log('review/' + review.id + '.mjs:');
			}

		} else if (review.state === 'wait') {
			console.warn('review/' + review.id + '.mjs:');
		} else if (review.state === 'fail') {
			console.error('review/' + review.id + '.mjs:');
		}


		let action  = this.settings.action || null;
		let tests   = flatten_tests(review).filter((test) => test.state !== 'okay');
		let current = tests.find((test) => test.state === null) || null;
		let div1    = indent(tests.map((test) => test.name));
		let div2    = indent(tests.map((test) => test.results.render()));

		tests.forEach((test) => {

			let message = '>';

			message += ' ' + test.name;
			message += ' ' + div1(test.name);

			if (action === 'scan') {

				message += test.results.render();

			} else if (action === 'time') {

				message += test.timeline.render();

			} else if (action === 'watch') {

				let str1 = test.results.render();
				let str2 = test.timeline.render();

				message += str1;
				message += div2(str1);
				message += str2;

			}

			if (
				is_current === true
				&& (test === current || test.state === null)
			) {
				console.blink(message);
			} else if (test.state === null) {
				console.log(message);
			} else if (test.state === 'wait') {
				console.warn(message);
			} else if (test.state === 'fail') {
				console.error(message);
			}

		});

		if (review.state === null) {

			if (is_current === true) {
				console.blink('running ...');
			} else {
				console.log('what?');
			}

		} else if (review.state === 'wait') {
			console.warn('wait ...');
		} else if (review.state === 'fail') {
			console.error('fail!');
		}

	}

};



export const Renderer = function(settings) {

	this.settings = Object.assign({
		action: null,  // 'scan', 'time' or 'watch'
		debug:  false
	}, settings);

	this.__state  = {
		review: null,
		test:   null,
		result: null
	};

};


Renderer.prototype = {

	render: function(data, mode) {

		mode = isString(mode) ? mode : 'complete';


		if (isArray(data) === true) {

			let debug   = this.settings.debug || false;
			let reviews = data;
			let state   = {
				review: this.__state.review,
				test:   this.__state.test,
				result: this.__state.result
			};

			if (reviews.length > 0) {

				let tmp = reviews.find((review) => review.state === null) || null;
				if (tmp !== null) {
					state.review = tmp;
				}

			}

			if (state.review !== null) {

				let tmp = flatten_tests(state.review).find((test) => test.state === null) || null;
				if (tmp !== null) {
					state.test = tmp;
				}

			}


			if (debug === true) {

				render_partial.call(this, reviews, this.__state, state);

			} else {

				console.clear();


				if (reviews.length === 1) {

					render_complete.call(this, reviews[0], state.review === reviews[0]);

				} else {

					let last_state = null;

					reviews.forEach((review, r) => {

						if (r > 0) {

							if (review.state === null && last_state === null) {
								console.log('');
							} else if (review.state !== last_state) {
								console.log('');
							}

						}


						if (mode === 'complete') {

							if (state.review === review) {
								render_complete.call(this, review, true);
							} else {
								render_summary.call(this, review);
							}

						} else if (mode === 'summary') {

							render_summary.call(this, review);

						}

						last_state = review.state;

					});

				}

			}

		} else if (isObject(data) === true) {

			if (mode === 'complete') {
				render_complete.call(this, data);
			} else if (mode === 'summary') {
				render_summary.call(this, data);
			}

		}

	}

};

