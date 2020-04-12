
import { describe, finish } from '../index.mjs';
import { Results          } from '../source/Results.mjs';



const TEMPLATE = function(assert) {

	let bar = 132;

	assert(bar, 123);

	setTimeout(() => {
		assert(true);
	}, 1000);

};


describe('Results.from', function(assert) {

	let results1 = Results.from(null);
	let results2 = Results.from(5);
	let results3 = Results.from(TEMPLATE);


	assert(results1.index === 0);
	assert(results2.index === 0);
	assert(results3.index === 0);

	assert(results1.length === 0);
	assert(results2.length === 5);
	assert(results3.length === 2);

});

describe('results.assert/Array', function(assert) {

	let date1   = new Date('01.02.20 13:37');
	let date2   = new Date('13.01.37 20:02');
	let regexp1 = new RegExp('/foo/bar', 'g');
	let regexp2 = new RegExp('/bar/foo', 'g');
	let results = Results.from(29);

	results.assert([]);

	results.assert([ true,  true  ], [ true,  true  ]);
	results.assert([ false, false ], [ false, false ]);

	results.assert([ true,  false ], [ true,  false ]);
	results.assert([ false, true  ], [ true,  false ]);
	results.assert([ true,  false ], [ false, true  ]);
	results.assert([ false, true  ], [ false, true  ]);

	results.assert([ 13, 37 ], [ 13, 37 ]);
	results.assert([ 13, 37 ], [ 37, 13 ]);
	results.assert([ 37, 13 ], [ 13, 37 ]);
	results.assert([ 37, 13 ], [ 37, 13 ]);

	results.assert([ date1, date1 ], [ date1, date1 ]);
	results.assert([ date2, date2 ], [ date2, date2 ]);

	results.assert([ date1, date2 ], [ date1, date2 ]);
	results.assert([ date2, date1 ], [ date1, date2 ]);
	results.assert([ date1, date2 ], [ date2, date1 ]);
	results.assert([ date2, date1 ], [ date2, date1 ]);

	results.assert([ regexp1, regexp1 ], [ regexp1, regexp1 ]);
	results.assert([ regexp2, regexp2 ], [ regexp2, regexp2 ]);

	results.assert([ regexp1, regexp2 ], [ regexp1, regexp2 ]);
	results.assert([ regexp2, regexp1 ], [ regexp1, regexp2 ]);
	results.assert([ regexp1, regexp2 ], [ regexp2, regexp1 ]);
	results.assert([ regexp2, regexp1 ], [ regexp2, regexp1 ]);

	results.assert([ 'foo', 'foo' ], [ 'foo', 'foo' ]);
	results.assert([ 'bar', 'bar' ], [ 'bar', 'bar' ]);

	results.assert([ 'foo', 'bar' ], [ 'foo', 'bar' ]);
	results.assert([ 'bar', 'foo' ], [ 'foo', 'bar' ]);
	results.assert([ 'foo', 'bar' ], [ 'bar', 'foo' ]);
	results.assert([ 'bar', 'foo' ], [ 'bar', 'foo' ]);


	assert(results.data[0], null);

	assert(results.data[1], true);
	assert(results.data[2], true);

	assert(results.data[3], true);
	assert(results.data[4], false);
	assert(results.data[5], false);
	assert(results.data[6], true);

	assert(results.data[7],  true);
	assert(results.data[8],  false);
	assert(results.data[9],  false);
	assert(results.data[10], true);

	assert(results.data[11], true);
	assert(results.data[12], true);

	assert(results.data[13], true);
	assert(results.data[14], false);
	assert(results.data[15], false);
	assert(results.data[16], true);

	assert(results.data[17], true);
	assert(results.data[18], true);

	assert(results.data[19], true);
	assert(results.data[20], false);
	assert(results.data[21], false);
	assert(results.data[22], true);

	assert(results.data[23], true);
	assert(results.data[24], true);

	assert(results.data[25], true);
	assert(results.data[26], false);
	assert(results.data[27], false);
	assert(results.data[28], true);

});

describe('results.assert/Boolean', function(assert) {

	let results = Results.from(6);

	results.assert(true);
	results.assert(false);

	results.assert(true, true);
	results.assert(true, false);
	results.assert(false, true);
	results.assert(false, false);


	assert(results.data[0], true);
	assert(results.data[1], false);

	assert(results.data[2], true);
	assert(results.data[3], false);
	assert(results.data[4], false);
	assert(results.data[5], true);

});

describe('results.assert/Date', function(assert) {

	let date1   = new Date('01.02.20 13:37');
	let date2   = new Date('01.02.20 13:37');
	let date3   = new Date('13.01.37 20:02');
	let results = Results.from(9);

	results.assert(date1);

	results.assert(date1, date1);
	results.assert(date1, date2);
	results.assert(date2, date1);
	results.assert(date2, date2);

	results.assert(date2, date2);
	results.assert(date2, date3);
	results.assert(date3, date2);
	results.assert(date3, date3);


	assert(results.data[0], null);

	assert(results.data[1], true);
	assert(results.data[2], true);
	assert(results.data[3], true);
	assert(results.data[4], true);

	assert(results.data[5], true);
	assert(results.data[6], false);
	assert(results.data[7], false);
	assert(results.data[8], true);

});

describe('results.assert/Function', function(assert) {

	let callback1 = function() {
		console.log('foo');
	};

	let callback2 = function() {
		console.log('foo');
	};

	let callback3 = function() {
		console.log('bar');
	};

	let results = Results.from(9);

	results.assert(callback1);

	results.assert(callback1, callback1);
	results.assert(callback1, callback2);
	results.assert(callback2, callback1);
	results.assert(callback2, callback2);

	results.assert(callback2, callback2);
	results.assert(callback2, callback3);
	results.assert(callback3, callback2);
	results.assert(callback3, callback3);


	assert(results.data[0], null);

	assert(results.data[1], true);
	assert(results.data[2], true);
	assert(results.data[3], true);
	assert(results.data[4], true);

	assert(results.data[5], true);
	assert(results.data[6], false);
	assert(results.data[7], false);
	assert(results.data[8], true);

});

describe('results.assert/Number', function(assert) {

	let results = Results.from(10);

	results.assert(13);
	results.assert(13.37);

	results.assert(13, 13);
	results.assert(13, 37);
	results.assert(37, 13);
	results.assert(37, 37);

	results.assert(13.37, 13.37);
	results.assert(13.37, 37.13);
	results.assert(37.13, 13.37);
	results.assert(37.13, 37.13);


	assert(results.data[0], null);
	assert(results.data[1], null);

	assert(results.data[2], true);
	assert(results.data[3], false);
	assert(results.data[4], false);
	assert(results.data[5], true);

	assert(results.data[6], true);
	assert(results.data[7], false);
	assert(results.data[8], false);
	assert(results.data[9], true);

});

describe('results.assert/Object', function(assert) {

	let date1   = new Date('01.02.20 13:37');
	let date2   = new Date('13.01.37 20:02');
	let regexp1 = new RegExp('/foo/bar', 'g');
	let regexp2 = new RegExp('/bar/foo', 'g');
	let results = Results.from(21);


	results.assert({});

	results.assert({ foo: true  }, { foo: true  });
	results.assert({ foo: true  }, { foo: false });
	results.assert({ foo: false }, { foo: true  });
	results.assert({ foo: false }, { foo: false });

	results.assert({ bar: 13 }, { bar: 13 });
	results.assert({ bar: 13 }, { bar: 37 });
	results.assert({ bar: 37 }, { bar: 13 });
	results.assert({ bar: 37 }, { bar: 37 });

	results.assert({ qux: date1 }, { qux: date1 });
	results.assert({ qux: date1 }, { qux: date2 });
	results.assert({ qux: date2 }, { qux: date1 });
	results.assert({ qux: date2 }, { qux: date2 });

	results.assert({ bar: regexp1 }, { bar: regexp1 });
	results.assert({ bar: regexp1 }, { bar: regexp2 });
	results.assert({ bar: regexp2 }, { bar: regexp1 });
	results.assert({ bar: regexp2 }, { bar: regexp2 });

	results.assert({ foo: 'foo' }, { foo: 'foo' });
	results.assert({ foo: 'foo' }, { foo: 'bar' });
	results.assert({ foo: 'bar' }, { foo: 'foo' });
	results.assert({ foo: 'bar' }, { foo: 'bar' });


	assert(results.data[0], null);

	assert(results.data[1], true);
	assert(results.data[2], false);
	assert(results.data[3], false);
	assert(results.data[4], true);

	assert(results.data[5], true);
	assert(results.data[6], false);
	assert(results.data[7], false);
	assert(results.data[8], true);

	assert(results.data[9],  true);
	assert(results.data[10], false);
	assert(results.data[11], false);
	assert(results.data[12], true);

	assert(results.data[13], true);
	assert(results.data[14], false);
	assert(results.data[15], false);
	assert(results.data[16], true);

	assert(results.data[17], true);
	assert(results.data[18], false);
	assert(results.data[19], false);
	assert(results.data[20], true);

});

describe('results.assert/String', function(assert) {

	let results = Results.from(5);

	results.assert('example');

	results.assert('foo', 'foo');
	results.assert('foo', 'bar');
	results.assert('bar', 'foo');
	results.assert('bar', 'bar');


	assert(results.data[0], null);

	assert(results.data[1], true);
	assert(results.data[2], false);
	assert(results.data[3], false);
	assert(results.data[4], true);

});

describe('results.assert/RegExp', function(assert) {

	let regexp1 = new RegExp('/foo/bar', 'g');
	let regexp2 = new RegExp('/foo/bar', 'g');
	let regexp3 = new RegExp('/bar/foo', 'g');
	let results = Results.from(9);

	results.assert(regexp1);

	results.assert(regexp1, regexp1);
	results.assert(regexp1, regexp2);
	results.assert(regexp2, regexp1);
	results.assert(regexp2, regexp2);

	results.assert(regexp2, regexp2);
	results.assert(regexp2, regexp3);
	results.assert(regexp3, regexp2);
	results.assert(regexp3, regexp3);


	assert(results.data[0], null);

	assert(results.data[1], true);
	assert(results.data[2], true);
	assert(results.data[3], true);
	assert(results.data[4], true);

	assert(results.data[5], true);
	assert(results.data[6], false);
	assert(results.data[7], false);
	assert(results.data[8], true);

});

describe('results.complete', function(assert) {

	let results = Results.from(4);

	results.assert(true);
	assert(results.complete(), false);

	results.assert(false);
	assert(results.complete(), false);

	results.assert(null);
	assert(results.complete(), false);

	results.assert(null);
	assert(results.complete(), true);

});

describe('results.current', function(assert) {

	let results = Results.from(4);

	assert(results.current(), 0);
	assert(results.index,     0);

	results.assert(true);

	assert(results.current(), 1);
	assert(results.index,     1);

	results.assert(false);

	assert(results.current(), 2);
	assert(results.index,     2);

	results.assert(null);

	assert(results.current(), 3);
	assert(results.index,     3);

	results.assert(null);

	assert(results.current(), 4);
	assert(results.index,     4);

});

describe('results.includes', function(assert) {

	let results1 = Results.from(3);
	let results2 = Results.from(3);
	let results3 = Results.from(3);
	let results4 = Results.from(3);

	results1.assert(true);
	results1.assert(false);
	results1.assert(null);

	results2.assert(true);
	results2.assert(false);
	results2.assert(true);

	results3.assert(true);
	results3.assert(null);
	results3.assert(true);

	results4.assert(false);
	results4.assert(null);
	results4.assert(false);


	assert(results1.includes(true),  true);
	assert(results1.includes(false), true);
	assert(results1.includes(null),  true);

	assert(results2.includes(true),  true);
	assert(results2.includes(false), true);
	assert(results2.includes(null),  false);

	assert(results3.includes(true),  true);
	assert(results3.includes(false), false);
	assert(results3.includes(null),  true);

	assert(results4.includes(true),  false);
	assert(results4.includes(false), true);
	assert(results4.includes(null),  true);

});

describe('results.render', function(assert) {

	let results1 = Results.from(3);
	let results2 = Results.from(3);
	let results3 = Results.from(3);
	let results4 = Results.from(3);
	let results5 = Results.from(3);
	let results6 = Results.from(0);

	results1.assert(true);
	results1.assert(false);
	results1.assert(null);

	results2.assert(true);
	results2.assert(false);
	results2.assert(true);

	results3.assert(true);
	results3.assert(null);
	results3.assert(true);

	results4.assert(false);
	results4.assert(null);
	results4.assert(false);

	results5.assert(true);


	assert(results1.render(), '|+-?|');
	assert(results2.render(), '|+-+|');
	assert(results3.render(), '|+?+|');
	assert(results4.render(), '|-?-|');
	assert(results5.render(), '|+??|');
	assert(results6.render(), '| no assert() calls |');

});

describe('results.reset', function(assert) {

	let results = Results.from(3);

	assert(results.index,   0);
	assert(results.data[0], null);
	assert(results.data[1], null);
	assert(results.data[2], null);
	assert(results.length,  3);

	results.assert(true);
	results.assert(false);
	results.assert(null);

	assert(results.index,   3);
	assert(results.data[0], true);
	assert(results.data[1], false);
	assert(results.data[2], null);
	assert(results.length,  3);

	results.reset();

	assert(results.index,   0);
	assert(results.data[0], null);
	assert(results.data[1], null);
	assert(results.data[2], null);
	assert(results.length,  3);

});


export default finish('covert/Results');

