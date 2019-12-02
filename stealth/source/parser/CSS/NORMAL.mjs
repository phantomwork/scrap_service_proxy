
import { console } from '../../console.mjs';

import { clone, filter, match, parse_chunk, parse_value, shift, split } from '../CSS.mjs';
import { STYLES                                                       } from './STYLES.mjs';



const comma_values = function(property, search, limit, values, result) {

	let tmp = split.call(values, { 'val': [ ',' ] });
	if (tmp.length > 0) {

		result[property] = [];

		tmp.forEach((values) => {

			if (values.length === 1) {

				let value = values[0];
				if (match.call(value, search) === true) {
					result[property].push(value);
				}

			}

		});

	}

};

const single_value = function(property, search, values, result) {

	let tmp = shift.call(values, search, { min: 1, max: 1 });
	if (tmp.length > 0) {
		result[property] = tmp[0];
	}

};

const multi_values = function(property, search, limit, values, result) {

	let tmp = shift.call(values, search, limit);
	if (tmp.length > 0) {
		result[property] = tmp;
	}

};



// XXX: Identical structure as parse_value(val)
// but ES2016 imports are fucked, so we have to
// do this separately via this helper method.
const create = (val) => ({
	ext: null,
	raw: val,
	typ: 'other',
	val: val
});

const DISPLAY_MODEL = {

	'contents': {
		'display': create('contents')
	},

	'none': {
		'display': create('none')
	},

	'block': {
		'display':         create('block'),
		'display-outside': create('block'),
		'display-inside':  create('flow')
	},

	'flex': {
		'display':         create('flex'),
		'display-outside': create('block'),
		'display-inside':  create('flex')
	},

	'flow-root': {
		'display':         create('flow-root'),
		'display-outside': create('block'),
		'display-inside':  create('flow-root')
	},

	'inline': {
		'display':         create('inline'),
		'display-outside': create('inline'),
		'display-inside':  create('flow')
	},

	'inline-block': {
		'display':         create('inline-block'),
		'display-outside': create('inline'),
		'display-inside':  create('flow-root')
	},

	'inline-flex': {
		'display':         create('inline-flex'),
		'display-outside': create('inline'),
		'display-inside':  create('flex')
	},

	'inline-list-item': {
		'display':         create('inline-list-item'),
		'display-outside': create('inline'),
		'display-inside':  create('flow')
	},

	'inline-table': {
		'display':         create('inline-table'),
		'display-outside': create('inline'),
		'display-inside':  create('table')
	},

	'list-item': {
		'display':         create('list-item'),
		'display-outside': create('block'),
		'display-inside':  create('flow')
	},

	'table': {
		'display':         create('table'),
		'display-outside': create('block'),
		'display-inside':  create('table')
	},

	// TODO: Verify behaviour of table-caption
	'table-caption': {
		'display':         create('table-caption'),
		'display-outside': create('inherit'),
		'display-inside':  create('flow-root')
	},

	'table-cell': {
		'display':         create('table-cell'),
		'display-outside': create('table-cell'),
		'display-inside':  create('flow')
	},

	'table-column': {
		// TODO: table-column
	},

	'table-column-group': {
		// TODO: table-column-group
	},

	'table-footer-group': {
		'display':         create('table-footer-group'),
		'display-outside': create('table-footer-group'),
		'display-inside':  create('table-row')
	},

	'table-header-group': {
		'display':         create('table-header-group'),
		'display-outside': create('table-header-group'),
		'display-inside':  create('table-row')
	},

	'table-row': {
		'display':         create('table-row'),
		'display-outside': create('table-row'),
		'display-inside':  create('table-cell')
	},

	'table-row-group': {
		'display':         create('table-row-group'),
		'display-outside': create('table-row-group'),
		'display-inside':  create('table-row')
	}

};



export const NORMAL = {

	/*
	 * UNSUPPORTED
	 */

	'box-decoration-break': () => {},
	'box-shadow':           () => {},
	'clip':                 () => {},
	'filter':               () => {},
	'font-variant':         () => {},
	'inset-block':          () => {},
	'inset-block-end':      () => {},
	'inset-block-start':    () => {},
	'inset-inline':         () => {},
	'inset-inline-end':     () => {},
	'inset-inline-start':   () => {},
	'isolation':            () => {},
	'mix-blend-mode':       () => {},
	'text-shadow':          () => {},


	/*
	 * SUPPORTED
	 */

	'background-position': (values, result) => {

		let position = shift.call(values, STYLES['background-position'], { min: 1, max: 2 });
		if (position.length === 2) {

			result['background-position-x'] = position[0];
			result['background-position-y'] = position[1];

		} else if (position.length === 1) {

			let val = position[0].val;
			let typ = position[0].typ;
			if (val === 'top') {
				result['background-position-x'] = parse_chunk('50%');
				result['background-position-y'] = parse_chunk('top');
			} else if (val === 'right') {
				result['background-position-x'] = parse_chunk('right');
				result['background-position-y'] = parse_chunk('50%');
			} else if (val === 'bottom') {
				result['background-position-x'] = parse_chunk('50%');
				result['background-position-y'] = parse_chunk('bottom');
			} else if (val === 'left') {
				result['background-position-x'] = parse_chunk('left');
				result['background-position-y'] = parse_chunk('50%');
			} else if (typ === 'length' || typ === 'percentage') {
				result['background-position-x'] = position[0];
				result['background-position-y'] = parse_chunk('50%');
			}

		}

	},

	'background-repeat': (values, result) => {

		let repeat = shift.call(values, STYLES['background-repeat'], { min: 1, max: 2 });
		if (repeat.length > 0) {

			if (repeat.length === 2) {

				result['background-repeat-x'] = repeat[0];
				result['background-repeat-y'] = repeat[1];

			} else if (repeat.length === 1) {

				let val = repeat[0].val;
				if (val === 'repeat-x') {
					result['background-repeat-x'] = parse_chunk('repeat');
					result['background-repeat-y'] = parse_chunk('no-repeat');
				} else if (val === 'repeat-y') {
					result['background-repeat-x'] = parse_chunk('no-repeat');
					result['background-repeat-y'] = parse_chunk('repeat');
				} else if (val === 'repeat') {
					result['background-repeat-x'] = parse_chunk('repeat');
					result['background-repeat-y'] = parse_chunk('repeat');
				} else if (val === 'space') {
					result['background-repeat-x'] = parse_chunk('space');
					result['background-repeat-y'] = parse_chunk('space');
				} else if (val === 'round') {
					result['background-repeat-x'] = parse_chunk('round');
					result['background-repeat-y'] = parse_chunk('round');
				} else if (val === 'no-repeat') {
					result['background-repeat-x'] = parse_chunk('no-repeat');
					result['background-repeat-y'] = parse_chunk('no-repeat');
				}

			}

		}

	},

	'background-size': (values, result) => {

		let size = shift.call(values, STYLES['background-size'], { min: 1, max: 2 });
		if (size.length > 0) {

			if (size.length === 2) {

				result['background-size-x'] = size[0];
				result['background-size-y'] = size[1];

			} else if (size.length === 1) {

				// TODO: Two modes: keywords or values
				// If length or percentage, value represents width and height is auto

				let val = size[0].val;
				let typ = size[0].typ;
				if (val === 'contain') {
					result['background-size-x'] = parse_chunk('contain');
					result['background-size-y'] = parse_chunk('contain');
				} else if (val === 'cover') {
					result['background-size-x'] = parse_chunk('cover');
					result['background-size-y'] = parse_chunk('cover');
				} else if (val === 'auto') {
					result['background-size-x'] = parse_chunk('auto');
					result['background-size-y'] = parse_chunk('auto');
				} else if (typ === 'length' || typ === 'percentage') {
					result['background-size-x'] = size[0];
					result['background-size-y'] = parse_chunk('auto');
				}

			}

		}

	},

	'border-spacing': (values, result) => {

		let spacing = shift.call(values, STYLES['border-spacing'], { min: 1, max: 2 });
		if (spacing.length === 2) {
			result['border-spacing-x'] = spacing[0];
			result['border-spacing-y'] = spacing[1];
		} else if (spacing.length === 1) {
			result['border-spacing-x'] = spacing[0];
			result['border-spacing-y'] = spacing[0];
		}

	},

	'display': (values, result) => {

		// display: run-in model is dropped
		// display: ruby model is unsupported
		// display: grid, inside-grid are unsupported

		let display = shift.call(values, {
			'val': Object.keys(DISPLAY_MODEL).concat([
				'flow'
			])
		}, { min: 1, max: 3});

		if (display.length > 0) {

			let model = DISPLAY_MODEL[display[0].val] || null;
			if (model !== null) {

				Object.keys(model).forEach((key) => {
					result[key] = clone(model[key]);
				});


				if (model['display'].val === 'list-item') {

					let outside = filter.call(display, {
						'val': [ 'block', 'inline' ]
					});
					if (outside.length > 0) {
						result['display-outside'] = outside[0];
					}

					let inside = filter.call(display, {
						'val': [ 'flow', 'flow-root' ]
					});
					if (inside.length > 0) {
						result['display-inside'] = inside[0];
					}

				}

			} else {

				result['display']         = display[0];
				result['display-outside'] = parse_value('block');
				result['display-inside']  = parse_value('flow');

			}

		}

	},

	'opacity': (values, result) => {

		let opacity = shift.call(values, STYLES['opacity']);
		if (opacity.length > 0) {

			if (opacity[0].val >= 0.0 && opacity[0].val <= 1.0) {
				result['opacity'] = opacity[0];
			}

		}

	},

	'quotes': (values, result) => {

		let quotes = shift.call(values, STYLES['quotes'], { min: 1, max: 2 });
		if (quotes.length > 1 && quotes.length % 2 === 0) {

			if (match.call(quotes, { 'typ': 'string' }) === true) {
				result['quotes'] = quotes;
			}

		} else if (quotes.length === 1) {

			if (quotes[0].val === 'auto' || quotes[0].val === 'none') {
				result['quotes'] = quotes[0];
			}

		}

	},

	'text-emphasis-style': (values, result) => {

		let style = shift.call(values, STYLES['text-emphasis-style']);
		if (style.length > 0) {

			if (style[0].typ === 'string' && style[0].val.length > 1) {
				style[0] = parse_value(style[0].val.charAt(0));
			}

			result['text-emphasis-style'] = style[0];

		}

	},



	/*
	 * SPECIAL SYNTAX
	 */

	'animation-delay':            comma_values.bind(null, 'animation-delay',            STYLES['animation-delay'],            { min: 1, max: 16 }),
	'animation-direction':        comma_values.bind(null, 'animation-direction',        STYLES['animation-direction'],        { min: 1, max: 16 }),
	'animation-duration':         comma_values.bind(null, 'animation-duration',         STYLES['animation-duration'],         { min: 1, max: 16 }),
	'animation-fill-mode':        comma_values.bind(null, 'animation-fill-mode',        STYLES['animation-fill-mode'],        { min: 1, max: 16 }),
	'animation-iteration-count':  comma_values.bind(null, 'animation-iteration-count',  STYLES['animation-iteration-count'],  { min: 1, max: 16 }),
	'animation-name':             comma_values.bind(null, 'animation-name',             STYLES['animation-name'],             { min: 1, max: 16 }),
	'animation-play-state':       comma_values.bind(null, 'animation-play-state',       STYLES['animation-play-state'],       { min: 1, max: 16 }),
	'animation-timing-function':  comma_values.bind(null, 'animation-timing-function',  STYLES['animation-timing-function'],  { min: 1, max: 16 }),

	'border-bottom-left-radius':  multi_values.bind(null, 'border-bottom-left-radius',  STYLES['border-radius'],              { min: 1, max:  2 }),
	'border-bottom-right-radius': multi_values.bind(null, 'border-bottom-right-radius', STYLES['border-radius'],              { min: 1, max:  2 }),
	'border-top-left-radius':     multi_values.bind(null, 'border-top-left-radius',     STYLES['border-radius'],              { min: 1, max:  2 }),
	'border-top-right-radius':    multi_values.bind(null, 'border-top-right-radius',    STYLES['border-radius'],              { min: 1, max:  2 }),

	'font-family':                comma_values.bind(null, 'font-family',                STYLES['font-family'],                { min: 1, max: 16 }),

	'transition-delay':           comma_values.bind(null, 'transition-delay',           STYLES['transition-delay'],           { min: 1, max: 16 }),
	'transition-duration':        comma_values.bind(null, 'transition-duration',        STYLES['transition-duration'],        { min: 1, max: 16 }),
	'transition-timing-function': comma_values.bind(null, 'transition-timing-function', STYLES['transition-timing-function'], { min: 1, max: 16 }),
	'transition-property':        comma_values.bind(null, 'transition-property',        STYLES['transition-property'],        { min: 1, max: 16 }),



	/*
	 * SINGLE SYNTAX
	 */

	'align-content':              single_value.bind(null, 'align-content',              STYLES['align-content']),
	'align-items':                single_value.bind(null, 'align-items',                STYLES['align-items']),
	'align-self':                 single_value.bind(null, 'align-self',                 STYLES['align-self']),

	'break-after':                single_value.bind(null, 'break-after',                STYLES['break-after']),
	'break-before':               single_value.bind(null, 'break-before',               STYLES['break-before']),
	'break-inside':               single_value.bind(null, 'break-inside',               STYLES['break-inside']),
	'backface-visibility':        single_value.bind(null, 'backface-visibility',        STYLES['backface-visibility']),
	'background-attachment':      single_value.bind(null, 'background-attachment',      STYLES['background-attachment']),
	'background-clip':            single_value.bind(null, 'background-clip',            STYLES['background-clip']),
	'background-color':           single_value.bind(null, 'background-color',           STYLES['background-color']),
	'background-image':           single_value.bind(null, 'background-image',           STYLES['background-image']),
	'background-origin':          single_value.bind(null, 'background-origin',          STYLES['background-origin']),
	'border-top-color':           single_value.bind(null, 'border-top-color',           STYLES['border-color']),
	'border-top-style':           single_value.bind(null, 'border-top-style',           STYLES['border-style']),
	'border-top-width':           single_value.bind(null, 'border-top-width',           STYLES['border-width']),
	'border-right-color':         single_value.bind(null, 'border-right-color',         STYLES['border-color']),
	'border-right-style':         single_value.bind(null, 'border-right-style',         STYLES['border-style']),
	'border-right-width':         single_value.bind(null, 'border-right-width',         STYLES['border-width']),
	'border-bottom-color':        single_value.bind(null, 'border-bottom-color',        STYLES['border-color']),
	'border-bottom-style':        single_value.bind(null, 'border-bottom-style',        STYLES['border-style']),
	'border-bottom-width':        single_value.bind(null, 'border-bottom-width',        STYLES['border-width']),
	'border-left-color':          single_value.bind(null, 'border-left-color',          STYLES['border-color']),
	'border-left-style':          single_value.bind(null, 'border-left-style',          STYLES['border-style']),
	'border-left-width':          single_value.bind(null, 'border-left-width',          STYLES['border-width']),
	'bottom':                     single_value.bind(null, 'bottom',                     STYLES['bottom']),
	'box-sizing':                 single_value.bind(null, 'box-sizing',                 STYLES['box-sizing']),

	'caption-side':               single_value.bind(null, 'caption-side',               STYLES['caption-side']),
	'caret-color':                single_value.bind(null, 'caret-color',                STYLES['caret-color']),
	'clear':                      single_value.bind(null, 'clear',                      STYLES['clear']),
	'color':                      single_value.bind(null, 'color',                      STYLES['color']),
	'color-adjust':               single_value.bind(null, 'color-adjust',               STYLES['color-adjust']),
	'column-count':               single_value.bind(null, 'column-count',               STYLES['column-count']),
	'column-fill':                single_value.bind(null, 'column-fill',                STYLES['column-fill']),
	'column-gap':                 single_value.bind(null, 'column-gap',                 STYLES['column-gap']),
	'column-rule-color':          single_value.bind(null, 'column-rule-color',          STYLES['border-color']),
	'column-rule-style':          single_value.bind(null, 'column-rule-style',          STYLES['border-style']),
	'column-rule-width':          single_value.bind(null, 'column-rule-width',          STYLES['border-width']),
	'column-span':                single_value.bind(null, 'column-span',                STYLES['column-span']),
	'column-width':               single_value.bind(null, 'column-width',               STYLES['column-width']),
	'cursor':                     single_value.bind(null, 'cursor',                     STYLES['cursor']),

	'direction':                  single_value.bind(null, 'direction',                  STYLES['direction']),

	'empty-cells':                single_value.bind(null, 'empty-cells',                STYLES['empty-cells']),

	'flex-basis':                 single_value.bind(null, 'flex-basis',                 STYLES['flex-basis']),
	'flex-direction':             single_value.bind(null, 'flex-direction',             STYLES['flex-direction']),
	'flex-grow':                  single_value.bind(null, 'flex-grow',                  STYLES['flex-grow']),
	'flex-shrink':                single_value.bind(null, 'flex-shrink',                STYLES['flex-shrink']),
	'flex-wrap':                  single_value.bind(null, 'flex-wrap',                  STYLES['flex-wrap']),
	'float':                      single_value.bind(null, 'float',                      STYLES['float']),
	'font-kerning':               single_value.bind(null, 'font-kerning',               STYLES['font-kerning']),
	'font-stretch':               single_value.bind(null, 'font-stretch',               STYLES['font-stretch']),
	'font-size':                  single_value.bind(null, 'font-size',                  STYLES['font-size']),
	'font-size-adjust':           single_value.bind(null, 'font-size-adjust',           STYLES['font-size-adjust']),
	'font-style':                 single_value.bind(null, 'font-style',                 STYLES['font-style']),
	'font-weight':                single_value.bind(null, 'font-weight',                STYLES['font-weight']),

	'height':                     single_value.bind(null, 'height',                     STYLES['height']),
	'hyphens':                    single_value.bind(null, 'hyphens',                    STYLES['hyphens']),

	'inline-size':                single_value.bind(null, 'inline-size',                STYLES['inline-size']),

	'justify-content':            single_value.bind(null, 'justify-content',            STYLES['justify-content']),
	'justify-items':              single_value.bind(null, 'justify-items',              STYLES['justify-items']),
	'justify-self':               single_value.bind(null, 'justify-self',               STYLES['justify-self']),

	'left':                       single_value.bind(null, 'left',                       STYLES['left']),
	'line-height':                single_value.bind(null, 'line-height',                STYLES['line-height']),
	'list-style-image':           single_value.bind(null, 'list-style-image',           STYLES['list-style-image']),
	'list-style-position':        single_value.bind(null, 'list-style-position',        STYLES['list-style-position']),
	'list-style-type':            single_value.bind(null, 'list-style-type',            STYLES['list-style-type']),

	'margin-top':                 single_value.bind(null, 'margin-top',                 STYLES['margin']),
	'margin-right':               single_value.bind(null, 'margin-right',               STYLES['margin']),
	'margin-bottom':              single_value.bind(null, 'margin-bottom',              STYLES['margin']),
	'margin-left':                single_value.bind(null, 'margin-left',                STYLES['margin']),
	'max-height':                 single_value.bind(null, 'max-height',                 STYLES['max-height']),
	'max-width':                  single_value.bind(null, 'max-width',                  STYLES['max-width']),
	'min-height':                 single_value.bind(null, 'min-height',                 STYLES['min-height']),
	'min-width':                  single_value.bind(null, 'min-width',                  STYLES['min-width']),

	'order':                      single_value.bind(null, 'order',                      STYLES['order']),
	'outline-color':              single_value.bind(null, 'outline-color',              STYLES['outline-color']),
	'outline-offset':             single_value.bind(null, 'outline-offset',             STYLES['outline-offset']),
	'outline-style':              single_value.bind(null, 'outline-style',              STYLES['outline-style']),
	'outline-width':              single_value.bind(null, 'outline-width',              STYLES['outline-width']),
	'overflow-x':                 single_value.bind(null, 'overflow-x',                 STYLES['overflow']),
	'overflow-y':                 single_value.bind(null, 'overflow-y',                 STYLES['overflow']),

	'padding-top':                single_value.bind(null, 'padding-top',                STYLES['padding']),
	'padding-right':              single_value.bind(null, 'padding-right',              STYLES['padding']),
	'padding-bottom':             single_value.bind(null, 'padding-bottom',             STYLES['padding']),
	'padding-left':               single_value.bind(null, 'padding-left',               STYLES['padding']),
	'position':                   single_value.bind(null, 'position',                   STYLES['position']),

	'right':                      single_value.bind(null, 'right',                      STYLES['right']),

	'tab-size':                   single_value.bind(null, 'tab-size',                   STYLES['tab-size']),
	'text-decoration-color':      single_value.bind(null, 'text-decoration-color',      STYLES['text-decoration-color']),
	'text-decoration-line':       single_value.bind(null, 'text-decoration-line',       STYLES['text-decoration-line']),
	'text-decoration-style':      single_value.bind(null, 'text-decoration-style',      STYLES['text-decoration-style']),
	'text-emphasis-color':        single_value.bind(null, 'text-emphasis-color',        STYLES['text-emphasis-color']),
	'text-indent':                single_value.bind(null, 'text-indent',                STYLES['text-indent']),
	'top':                        single_value.bind(null, 'top',                        STYLES['top']),

	'visibility':                 single_value.bind(null, 'visibility',                 STYLES['visibility']),

	'width':                      single_value.bind(null, 'width',                      STYLES['width']),
	'writing-mode':               single_value.bind(null, 'writing-mode',               STYLES['writing-mode']),
	'word-spacing':               single_value.bind(null, 'word-spacing',               STYLES['word-spacing']),

	'z-index':                    single_value.bind(null, 'z-index',                    STYLES['z-index']),
	'zoom':                       single_value.bind(null, 'zoom',                       STYLES['zoom']),

};



export default { NORMAL };

