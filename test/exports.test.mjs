/* --------------------
 * @overlook/plugin-match module
 * Tests
 * ESM export
 * ------------------*/

// Modules
import Plugin from '@overlook/plugin';
import matchPlugin, * as namedExports from '@overlook/plugin-match/es';

// Imports
import itExports from './exports.js';

// Tests

describe('ESM export', () => {
	it('default export is an instance of Plugin class', () => {
		expect(matchPlugin).toBeInstanceOf(Plugin);
	});

	describe('default export has properties', () => {
		itExports(matchPlugin);
	});

	describe('named exports', () => {
		itExports(namedExports);
	});
});
