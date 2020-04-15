
import process from 'process';



export const action = (() => {

	let value = Array.from(process.argv).slice(2).filter((v) => v.startsWith('--') === false).shift() || '';

	if (/^([check]{5})$/g.test(value)) {
		return 'check';
	} else if (/^([watch]{5})$/g.test(value)) {
		return 'watch';
	} else if (/^([scan]{4})$/g.test(value)) {
		return 'scan';
	} else if (/^([time]{4})$/g.test(value)) {
		return 'time';
	}

	return 'help';

})();

export const flags = (() => {

	let flags = {
		debug:    false,
		internet: true,
		network:  null
	};

	Array.from(process.argv).slice(2).filter((v) => v.startsWith('--') === true).forEach((flag) => {

		let tmp = flag.substr(2).split('=').map((v) => v.trim());
		if (tmp.length === 2) {

			let key = tmp[0];
			let val = tmp[1];

			let num = parseInt(val, 10);
			if (!isNaN(num) && (num).toString() === val) {
				val = num;
			} else if (val === 'true') {
				val = true;
			} else if (val === 'false') {
				val = false;
			} else if (val === 'null') {
				val = null;
			}

			flags[key] = val;

		}

	});

	return flags;

})();

export const patterns = (() => {

	let patterns = [];

	Array.from(process.argv).slice(2).filter((v) => v.startsWith('--') === false).slice(1).forEach((pattern) => {
		patterns.push(pattern);
	});

	return patterns;

})();

export const root = (() => {

	let pwd = process.env.PWD || null;
	if (pwd !== null) {
		return pwd;
	}

	let cwd = process.cwd();
	if (cwd.includes('\\')) {
		cwd = cwd.split('\\').join('/');
	}

	if (cwd.endsWith('/')) {
		cwd = cwd.substr(0, cwd.length - 1);
	}

	return cwd;

})();



const ENVIRONMENT = {

	action:   action,
	flags:    flags,
	patterns: patterns,
	root:     root

};


export { ENVIRONMENT };

