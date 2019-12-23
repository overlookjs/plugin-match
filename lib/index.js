/* --------------------
 * @overlook/router-match module
 * Entry point
 * ------------------*/

'use strict';

// Modules
const {isObject, isBoolean} = require('is-it-type');

// Imports
const symbols = require('./symbols'),
	{MATCH, HANDLE_MATCH, HANDLE_ROUTE, HANDLE_CHILDREN} = symbols;

// Exports
function extend(Route) {
	return class RouteMatch extends Route {
		handle(req) {
			return this.debugZone(() => {
				// Allow super method to handle first
				const res = super.handle(req);
				if (res != null) return res;

				// Determine if route matches
				const match = this[MATCH](req);
				if (match == null) return null;
				if (!isObject(match) || !isBoolean(match.exact)) {
					throw new Error('[MATCH]() must return an object with boolean `.exact` property or null');
				}

				// Handle route
				return this[HANDLE_MATCH](req, match);
			});
		}

		[MATCH]() { // eslint-disable-line class-methods-use-this
			// Intended to be overidden by subclasses
			return null;
		}

		[HANDLE_MATCH](req, match) {
			if (match.exact) return this[HANDLE_ROUTE](req);
			return this[HANDLE_CHILDREN](req);
		}

		[HANDLE_ROUTE]() { // eslint-disable-line class-methods-use-this
			// Intended to be overidden by subclasses
			return null;
		}

		[HANDLE_CHILDREN](req) {
			for (const route of this.children) {
				const res = route.debugZone(() => route.handle(req));
				if (res != null) return res;
			}

			// Route not found
			// TODO Work out how to treat not found
			return null;
		}
	};
}

// Expose symbols
Object.assign(extend, symbols);

module.exports = extend;
