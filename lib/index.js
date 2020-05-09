/* --------------------
 * @overlook/plugin-match module
 * Entry point
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin'),
	{DEBUG_ZONE} = require('@overlook/route'),
	{isObject, isBoolean} = require('is-it-type');

// Imports
const pkg = require('../package.json');

// Exports

const matchPlugin = new Plugin(
	pkg,
	{symbols: ['MATCH', 'HANDLE_MATCH', 'HANDLE_ROUTE', 'HANDLE_CHILDREN']},
	extend
);

module.exports = matchPlugin;

const {MATCH, HANDLE_MATCH, HANDLE_ROUTE, HANDLE_CHILDREN} = matchPlugin;

function extend(Route) {
	return class extends Route {
		handle(req) {
			return this[DEBUG_ZONE](() => {
				// Allow super method to handle first
				const res = super.handle(req);
				if (res !== undefined) return res;

				// Determine if route matches
				const match = this[MATCH](req);
				if (match == null) return match;
				if (!isObject(match) || !isBoolean(match.exact)) {
					throw new Error(
						'[MATCH]() must return an object with boolean `.exact` property, undefined or null'
					);
				}

				// Handle route
				return this[HANDLE_MATCH](req, match);
			});
		}

		// Intended to be overidden by subclasses
		[MATCH]() { // eslint-disable-line class-methods-use-this
			return undefined;
		}

		// Should NOT be extended by subclasses
		[HANDLE_MATCH](req, match) {
			if (match.exact) return this[HANDLE_ROUTE](req);
			return this[HANDLE_CHILDREN](req);
		}

		// Intended to be overidden by subclasses
		[HANDLE_ROUTE]() { // eslint-disable-line class-methods-use-this
			return undefined;
		}

		// Can be extended by subclasses
		[HANDLE_CHILDREN](req) {
			for (const route of this.children) {
				const res = route[DEBUG_ZONE](() => route.handle(req));
				if (res !== undefined) return res;
			}

			// Route not found
			// TODO Work out how to treat not found
			return undefined;
		}
	};
}
