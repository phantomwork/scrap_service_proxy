
import { isArray, isFunction } from '../../extern/base.mjs';
import { URL                 } from '../parser/URL.mjs';



const Blocker = {

	check: function(blockers, ref, callback) {

		blockers = isArray(blockers)    ? blockers : null;
		ref      = URL.isURL(ref)       ? ref      : null;
		callback = isFunction(callback) ? callback : null;


		if (ref !== null && callback !== null) {

			let blocked = false;

			if (blockers.length > 0) {

				for (let b = 0, bl = blockers.length; b < bl; b++) {

					let host = blockers[b];
					if (host.domain === ref.domain) {
						blocked = true;
						break;
					}

				}

			}

			callback(blocked);

		} else if (callback !== null) {
			// Blocked by default
			callback(true);
		}

	}

};


export { Blocker };

