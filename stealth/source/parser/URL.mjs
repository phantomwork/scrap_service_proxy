
import { isObject, isString } from '../POLYFILLS.mjs';
import { IP                 } from './IP.mjs';



const _TOPLEVELDOMAINS = [
	'aba.ae',
	'ac.id',
	'ac.in',
	'ac.th',
	'adv.br',
	'at.ua',
	'az.pl',
	'cn.com',
	'co.at',
	'co.cc',
	'co.cr',
	'co.id',
	'co.il',
	'co.in',
	'co.jp',
	'co.ke',
	'co.kr',
	'co.ls',
	'co.mz',
	'co.nf',
	'co.nz',
	'co.rs',
	'co.th',
	'co.tv',
	'co.tz',
	'co.ua',
	'co.ug',
	'co.uk',
	'co.vu',
	'co.za',
	'co.zw',
	'com.ar',
	'com.au',
	'com.bd',
	'com.bo',
	'com.br',
	'com.cn',
	'com.co',
	'com.cy',
	'com.de',
	'com.do',
	'com.ec',
	'com.eg',
	'com.es',
	'com.gt',
	'com.hk',
	'com.kh',
	'com.lb',
	'com.mk',
	'com.mx',
	'com.my',
	'com.ng',
	'com.np',
	'com.pe',
	'com.ph',
	'com.pk',
	'com.pl',
	'com.pt',
	'com.py',
	'com.ru',
	'com.sa',
	'com.sg',
	'com.sv',
	'com.tr',
	'com.tw',
	'com.ua',
	'com.uy',
	'com.ve',
	'com.vn',
	'cz.cc',
	'da.ru',
	'de.vu',
	'do.am',
	'dol.ru',
	'dp.ua',
	'edu.ar',
	'edu.au',
	'edu.bd',
	'edu.br',
	'edu.cn',
	'edu.co',
	'edu.in',
	'edu.mx',
	'edu.my',
	'edu.ng',
	'edu.np',
	'edu.pe',
	'edu.pk',
	'edu.pl',
	'edu.tw',
	'edu.vn',
	'eng.br',
	'esy.es',
	'far.ru',
	'flu.cc',
	'fr.am',
	'gen.tr',
	'go.com',
	'go.id',
	'go.ro',
	'go.th',
	'gob.mx',
	'gob.pe',
	'gov.bd',
	'gov.br',
	'gov.cn',
	'gov.it',
	'gov.ph',
	'had.su',
	'hol.es',
	'hop.ru',
	'in.th',
	'in.ua',
	'ind.br',
	'inf.br',
	'me.uk',
	'mm.am',
	'ne.jp',
	'net.au',
	'net.br',
	'net.cn',
	'net.in',
	'net.nz',
	'net.pk',
	'net.pl',
	'net.ru',
	'net.ua',
	'nl.am',
	'nut.cc',
	'or.id',
	'or.jp',
	'or.ke',
	'or.kr',
	'org.ar',
	'org.au',
	'org.bd',
	'org.br',
	'org.il',
	'org.in',
	'org.mx',
	'org.my',
	'org.ng',
	'org.np',
	'org.nz',
	'org.pe',
	'org.pk',
	'org.pl',
	'org.rs',
	'org.ru',
	'org.tr',
	'org.tw',
	'org.ua',
	'org.uk',
	'org.ve',
	'org.za',
	'pe.hu',
	'pp.ru',
	'pp.ua',
	'prv.pl',
	'qc.ca',
	'rr.nu',
	'sh.cn',
	'spb.ru',
	'tbn.ru',
	'tur.br',
	'vi.net',
	'waw.pl',
	'wz.cz',
	'xt.pl',
	'yi.org',
	'za.net',
	'za.pl',
	'zyr.su',
	'zz.mu'
];


const DEFAULT = {
	ext:    null,
	type:   'other',
	binary: true,
	format: 'application/octet-stream'
};

const TYPES = [

	// Media-Types are compliant with IANA assignments
	// https://www.iana.org/assignments/media-types

	// application
	{ ext: 'abw',   type: 'other', binary: true,  format: 'application/x-abiword'                                                     },
	{ ext: 'azw',   type: 'other', binary: true,  format: 'application/vnd.amazon.ebook'                                              },
	{ ext: 'bin',   type: 'other', binary: true,  format: 'application/octet-stream'                                                  },
	{ ext: 'csh',   type: 'text',  binary: false, format: 'application/x-csh'                                                         },
	{ ext: 'doc',   type: 'other', binary: true,  format: 'application/msword'                                                        },
	{ ext: 'docx',  type: 'other', binary: true,  format: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'   },
	{ ext: 'eot',   type: 'font',  binary: true,  format: 'application/vnd.ms-fontobject'                                             },
	{ ext: 'js',    type: 'text',  binary: false, format: 'application/javascript'                                                    },
	{ ext: 'json',  type: 'text',  binary: false, format: 'application/json'                                                          },
	{ ext: 'mjs',   type: 'text',  binary: false, format: 'application/javascript'                                                    },
	{ ext: 'odp',   type: 'other', binary: true,  format: 'application/vnd.oasis.opendocument.presentation'                           },
	{ ext: 'ods',   type: 'other', binary: true,  format: 'application/vnd.oasis.opendocument.spreadsheet'                            },
	{ ext: 'odt',   type: 'other', binary: true,  format: 'application/vnd.oasis.opendocument.text'                                   },
	{ ext: 'ogx',   type: 'video', binary: true,  format: 'application/ogg'                                                           },
	{ ext: 'pdf',   type: 'other', binary: true,  format: 'application/pdf'                                                           },
	{ ext: 'ppt',   type: 'other', binary: true,  format: 'application/vnd.ms-powerpoint'                                             },
	{ ext: 'pptx',  type: 'other', binary: true,  format: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
	{ ext: 'rtf',   type: 'other', binary: true,  format: 'application/rtf'                                                           },
	{ ext: 'sh',    type: 'text',  binary: false, format: 'application/x-sh'                                                          },
	{ ext: 'ts',    type: 'text',  binary: false, format: 'application/typescript'                                                    },
	{ ext: 'vsd',   type: 'other', binary: true,  format: 'application/vnd.visio'                                                     },
	{ ext: 'xhtml', type: 'text',  binary: false, format: 'application/xhtml+xml'                                                     },
	{ ext: 'xls',   type: 'other', binary: true,  format: 'application/vnd.ms-excel'                                                  },
	{ ext: 'xlsx',  type: 'other', binary: true,  format: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'         },
	{ ext: 'xml',   type: 'text',  binary: false, format: 'application/xml'                                                           },
	{ ext: 'xul',   type: 'text',  binary: false, format: 'application/vnd.mozilla.xul+xml'                                           },

	// audio
	{ ext: '3gp',  type: 'audio', binary: true, format: 'audio/3gpp' },
	{ ext: '3gpp', type: 'audio', binary: true, format: 'audio/3gpp' },
	{ ext: 'aac',  type: 'audio', binary: true, format: 'audio/aac'  },
	{ ext: 'ac3',  type: 'audio', binary: true, format: 'audio/ac3'  },
	{ ext: 'mid',  type: 'audio', binary: true, format: 'audio/midi' },
	{ ext: 'mp3',  type: 'audio', binary: true, format: 'audio/mp3'  },
	{ ext: 'oga',  type: 'audio', binary: true, format: 'audio/ogg'  },
	{ ext: 'ogg',  type: 'audio', binary: true, format: 'audio/ogg'  },
	{ ext: 'wav',  type: 'audio', binary: true, format: 'audio/wav'  },
	{ ext: 'weba', type: 'audio', binary: true, format: 'audio/webm' },

	// font
	{ ext: 'otf',   type: 'other', binary: true, format: 'font/otf'   },
	{ ext: 'sfnt',  type: 'other', binary: true, format: 'font/sfnt'  },
	{ ext: 'ttf',   type: 'other', binary: true, format: 'font/ttf'   },
	{ ext: 'woff',  type: 'other', binary: true, format: 'font/woff'  },
	{ ext: 'woff2', type: 'other', binary: true, format: 'font/woff2' },

	// image
	{ ext: 'bmp',  type: 'image', binary: true, format: 'image/bmp'     },
	{ ext: 'emf',  type: 'image', binary: true, format: 'image/emf'     },
	{ ext: 'gif',  type: 'image', binary: true, format: 'image/gif'     },
	{ ext: 'ico',  type: 'image', binary: true, format: 'image/x-icon'  },
	{ ext: 'jp2',  type: 'image', binary: true, format: 'image/jp2'     },
	{ ext: 'jpeg', type: 'image', binary: true, format: 'image/jpeg'    },
	{ ext: 'jpg',  type: 'image', binary: true, format: 'image/jpeg'    },
	{ ext: 'png',  type: 'image', binary: true, format: 'image/png'     },
	{ ext: 'tif',  type: 'image', binary: true, format: 'image/tiff'    },
	{ ext: 'tiff', type: 'image', binary: true, format: 'image/tiff'    },
	{ ext: 'svg',  type: 'image', binary: true, format: 'image/svg+xml' },
	{ ext: 'webp', type: 'image', binary: true, format: 'image/webp'    },
	{ ext: 'wmf',  type: 'image', binary: true, format: 'image/wmf'     },

	// text
	{ ext: 'appcache', type: 'text', binary: false, format: 'text/cache-manifest' },
	{ ext: 'css',      type: 'text', binary: false, format: 'text/css'            },
	{ ext: 'csv',      type: 'text', binary: false, format: 'text/csv'            },
	{ ext: 'htm',      type: 'text', binary: false, format: 'text/html'           },
	{ ext: 'html',     type: 'text', binary: false, format: 'text/html'           },
	{ ext: 'ical',     type: 'text', binary: false, format: 'text/calendar'       },
	{ ext: 'md',       type: 'text', binary: false, format: 'text/x-markdown'     },
	{ ext: 'mf',       type: 'text', binary: false, format: 'text/cache-manifest' },
	{ ext: 'txt',      type: 'text', binary: false, format: 'text/plain'          },

	// video
	{ ext: 'avi',  type: 'video', binary: true, format: 'video/x-msvideo' },
	{ ext: 'mpeg', type: 'video', binary: true, format: 'video/mpeg'      },
	{ ext: 'ogv',  type: 'video', binary: true, format: 'video/ogg'       },
	{ ext: 'webm', type: 'video', binary: true, format: 'video/webm'      },

	// other
	{ ext: '7z',   type: 'other', binary: true, format: 'application/x-7z-compressed'  },
	{ ext: 'bz',   type: 'other', binary: true, format: 'application/x-bzip'           },
	{ ext: 'bz2',  type: 'other', binary: true, format: 'application/x-bzip2'          },
	{ ext: 'epub', type: 'other', binary: true, format: 'application/epub+zip'         },
	{ ext: 'gz',   type: 'other', binary: true, format: 'application/x-gzip'           },
	{ ext: 'jar',  type: 'other', binary: true, format: 'application/jar-archive'      },
	{ ext: 'rar',  type: 'other', binary: true, format: 'application/x-rar-compressed' },
	{ ext: 'tar',  type: 'other', binary: true, format: 'application/x-tar'            },
	{ ext: 'zip',  type: 'other', binary: true, format: 'application/zip'              }

];



const URL = {

	isURL: function(data) {

		data = isObject(data) ? data : null;


		if (data !== null) {

			let invalid = [];

			[
				data.domain    || null,
				data.hash      || null,
				data.host      || null,
				data.path      || null,
				data.port      || null,
				data.protocol  || null,
				data.query     || null,
				data.subdomain || null,
				data.url       || null,
			].filter((v) => v !== null && isString(v) === false).forEach((v) => {
				invalid.push(v);
			});


			[
				data.headers || null,
				data.payload || null
			].filter((v) => v !== null && isObject(v) === false).forEach((v) => {
				invalid.push(v);
			});

			(data.hosts || []).filter((v) => IP.isIP(v) === false).forEach((v) => {
				invalid.push(v);
			});


			if (invalid.length === 0) {

				let mime = data.mime || null;
				if (mime !== null) {

					if (TYPES.includes(mime) || mime === DEFAULT) {
						return true;
					}

				}

			}

		}


		return false;

	},

	parse: function(url) {

		url = isString(url) ? url : '';


		let protocol  = null;
		let domain    = null;
		let hash      = null;
		let host      = null;
		let hosts     = [];
		let mime      = null;
		let path      = null;
		let port      = null;
		let query     = null;
		let subdomain = null;


		let tmp1 = url.split('?')[0] || '';
		let tmp2 = url.split('?')[1] || '';

		if (url.startsWith('//')) {

			protocol = 'https';
			domain   = tmp1.substr(2).split('/')[0];
			path     = '/' + tmp1.substr(2).split('/').slice(1).join('/');
			query    = tmp2 !== '' ? tmp2 : null;

		} else if (url.includes('://')) {

			protocol = tmp1.substr(0, tmp1.indexOf('://'));
			domain   = tmp1.substr(protocol.length + 3).split('/')[0];
			path     = '/' + tmp1.substr(protocol.length + 3).split('/').slice(1).join('/');
			query    = tmp2 !== '' ? tmp2 : null;

		} else if (url.startsWith('stealth:')) {

			protocol = 'stealth';
			domain   = tmp1.substr(protocol.length + 1).split('/')[0];
			path     = '/' + tmp1.substr(protocol.length + 1).split('/').slice(1).join('/');
			query    = tmp2 !== '' ? tmp2 : null;

		} else if (url.startsWith('/')) {

			protocol = 'file';
			domain   = null;
			host     = null;
			path     = tmp1;
			query    = tmp2 !== '' ? tmp2 : null;

		} else if (url.startsWith('..')) {

			path     = tmp1;
			query    = tmp2 !== '' ? tmp2 : null;

		} else if (url.startsWith('.')) {

			path     = tmp1;
			query    = tmp2 !== '' ? tmp2 : null;

		} else {

			domain   = tmp1.split('/')[0];
			path     = '/' + tmp1.split('/').slice(1).join('/');

		}


		if (domain !== null && /^([a-zA-z0-9.:-]+)$/.test(domain) === false) {
			domain = null;
		}

		if (path !== null && path.includes('#')) {
			hash = path.split('#').slice(1).join('#');
			path = path.split('#').shift();
		}


		let check_ipv6 = false;
		let check_ipv4 = false;

		if (domain !== null && domain.includes(':')) {
			check_ipv6 = domain.split(':').length > 2;
		}

		if (domain !== null && domain.includes('.')) {
			check_ipv4 = /^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/g.test(domain.split(':')[0]);
		}

		if (check_ipv6 === true) {

			if (domain.startsWith('[')) {
				domain = domain.substr(1);
			}

			if (domain.includes(']:')) {

				let tmp1 = domain.split(']:');
				let tmp2 = parseInt(tmp1[1], 10);

				domain = tmp1[0];

				if (Number.isNaN(tmp2) === false && tmp2 > 0 && tmp2 < 65535) {
					port = tmp2;
				}

			} else if (domain.includes(']')) {
				domain = domain.split(']').join('');
			}


			let ip = IP.parse(domain);
			if (ip.type === 'v6') {

				domain = null;
				host   = ip.ip;
				hosts.push(ip);

			}

		} else if (check_ipv4 === true) {

			if (domain.includes('[')) {
				domain = domain.split('[').join('');
			}

			if (domain.includes(']')) {
				domain = domain.split(']').join('');
			}

			if (domain.includes(':')) {

				let tmp1 = domain.split(':');
				let tmp2 = parseInt(tmp1[1], 10);

				domain = tmp1[0];

				if (Number.isNaN(tmp2) === false && tmp2 > 0 && tmp2 < 65535) {
					port = tmp2;
				}

			}


			let ip = IP.parse(domain);
			if (ip.type === 'v4') {

				domain = null;
				host   = ip.ip;
				hosts.push(ip);

			}

		} else if (domain !== null && domain.includes('.')) {

			if (domain.includes(':')) {

				let tmp1 = domain.split(':');
				let tmp2 = parseInt(tmp1[1], 10);

				domain = tmp1[0];

				if (Number.isNaN(tmp2) === false && tmp2 > 0 && tmp2 < 65535) {
					port = tmp2;
				}

			}


			let tmp_tld = domain.split('.').slice(-2).join('.');
			let tmp_sub = domain.split('.').slice(0, -2);

			if (_TOPLEVELDOMAINS.includes(tmp_tld) === true && tmp_sub.length > 0) {

				domain = tmp_sub.pop() + '.' + tmp_tld;

				if (tmp_sub.length > 0) {
					subdomain = tmp_sub.join('.');
				} else {
					subdomain = null;
				}

			} else if (tmp_sub.length > 0) {
				domain    = tmp_tld;
				subdomain = tmp_sub.join('.');
			} else {
				domain    = tmp_tld;
				subdomain = null;
			}

			if (domain.startsWith('-')) {
				domain = null;
			}

		} else if (domain !== null) {

			if (domain.includes(':')) {

				let tmp1 = domain.split(':');
				let tmp2 = parseInt(tmp1[1], 10);

				domain = tmp1[0];

				if (Number.isNaN(tmp2) === false && tmp2 > 0 && tmp2 < 65535) {
					port = tmp2;
				}

			}

		}


		if (path !== null && path.includes('.')) {

			let ext  = path.split('.').pop();
			let type = TYPES.find((t) => t.ext === ext) || null;

			if (type !== null) {
				mime = type;
			} else {
				mime = DEFAULT;
			}

		} else {

			// assume text/html by default
			mime = TYPES.find((t) => t.ext === 'html') || null;

		}

		if (protocol !== null && port === null) {

			if (protocol === 'https') {
				port = 443;
			} else if (protocol === 'http') {
				port = 80;
			}

		}


		let san_url = '';

		if (protocol !== null) {

			if (protocol === 'stealth') {
				san_url += protocol + ':';
			} else {
				san_url += protocol + '://';
			}

		}

		if (domain !== null) {

			if (subdomain !== null) {
				san_url += subdomain + '.' + domain;
			} else {
				san_url += domain;
			}

		} else if (host !== null) {

			if (host.includes(':')) {
				san_url += '[' + host + ']';
			} else {
				san_url += host;
			}

		}

		if (protocol === 'https' && port !== 443) {
			san_url += ':' + port;
		} else if (protocol === 'http' && port !== 80) {
			san_url += ':' + port;
		}

		if (protocol !== 'stealth') {
			san_url += path;
		}

		if (query !== null) {
			san_url += '?' + query;
		}


		return {

			domain:    domain,
			hash:      hash,
			host:      host,
			mime:      mime,
			path:      path,
			port:      port,
			protocol:  protocol,
			query:     query,
			subdomain: subdomain,
			url:       san_url,

			// DNS API
			hosts:     hosts,

			// Service API
			headers:   null,
			payload:   null

		};

	}

};


export const isURL = URL.isURL;
export const parse = URL.parse;

export { URL };

