/* --------------------
 * @overlook/plugin-match module
 * Tests
 * Test function to ensure all exports present
 * ------------------*/

/* eslint-disable jest/no-export */

'use strict';

// Exports

module.exports = function itExports(plugin) {
	it.each([
		'MATCH',
		'HANDLE_MATCH',
		'HANDLE_ROUTE',
		'HANDLE_CHILDREN'
	])('%s', (key) => {
		expect(typeof plugin[key]).toBe('symbol');
	});
};
