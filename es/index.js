/* --------------------
 * @overlook/plugin-match module
 * ESM entry point
 * Re-export CJS with named exports
 * ------------------*/

// Exports

import matchPlugin from '../lib/index.js';

export default matchPlugin;
export const {
	MATCH,
	HANDLE_MATCH,
	HANDLE_ROUTE,
	HANDLE_CHILDREN
} = matchPlugin;
