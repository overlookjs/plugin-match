/* --------------------
 * @overlook/plugin-match module
 * Tests
 * CJS export
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin'),
	matchPlugin = require('@overlook/plugin-match');

// Imports
const itExports = require('./exports.js');

// Tests

describe('CJS export', () => { // eslint-disable-line jest/lowercase-name
	it('is an instance of Plugin class', () => {
		expect(matchPlugin).toBeInstanceOf(Plugin);
	});

	describe('has properties', () => {
		itExports(matchPlugin);
	});
});
