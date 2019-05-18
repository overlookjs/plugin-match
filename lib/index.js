/* --------------------
 * @overlook/router-match module
 * Entry point
 * ------------------*/

'use strict';

// Modules
const memoize = require('@overlook/util-memoize');

// Imports
const symbols = require('./symbols'),
	{MATCH_ROUTER, MATCH, HANDLE_MATCH, HANDLE_ROUTE, HANDLE_CHILDREN} = symbols;

// Exports
const extend = memoize((Route) => {
	class RouteMatch extends Route {
		handle(req) {
			// Determine if route matches
			const match = this[MATCH](req);
			if (!match) return false;

			// Handle route
			return this[HANDLE_MATCH](req, match);
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
			return false;
		}

		[HANDLE_CHILDREN](req) {
			for (const route of this.children) {
				const res = route.handle(req);
				if (res) return res;
			}

			// Route not found
			// TODO Work out how to treat not found
			return false;
		}
	}

	RouteMatch[MATCH_ROUTER] = true;
	RouteMatch.prototype[MATCH_ROUTER] = true;

	return RouteMatch;
});

// Expose symbols
Object.assign(extend, symbols);

module.exports = extend;
