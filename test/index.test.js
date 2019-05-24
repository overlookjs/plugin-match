/* --------------------
 * @overlook/router-match module
 * Tests
 * ------------------*/

'use strict';

// Modules
const {Route} = require('@overlook/core'),
	each = require('jest-each').default,
	routerMatch = require('../index'),
	{MATCH, HANDLE_MATCH, HANDLE_ROUTE, HANDLE_CHILDREN} = routerMatch;

// Init
require('./utils');

const spy = jest.fn;

// Tests

describe('Extension', () => { // eslint-disable-line jest/lowercase-name
	it('is a function', () => {
		expect(routerMatch).toBeFunction();
	});

	it('returns a subclass of input', () => {
		const RouteMatch = routerMatch(Route);
		expect(RouteMatch).toBeFunction();
		expect(Object.getPrototypeOf(RouteMatch)).toBe(Route);
		expect(Object.getPrototypeOf(RouteMatch.prototype)).toBe(Route.prototype);
	});

	describe('when passed to `Route.extend()`', () => {
		it('returns subclass of Route', () => {
			const RouteMatch = Route.extend(routerMatch);
			expect(RouteMatch).toBeFunction();
			expect(Object.getPrototypeOf(RouteMatch)).toBe(Route);
			expect(Object.getPrototypeOf(RouteMatch.prototype)).toBe(Route.prototype);
		});
	});

	describe('exports symbols', () => {
		each([['symbol'], ['MATCH'], ['HANDLE_MATCH'], ['HANDLE_ROUTE'], ['HANDLE_CHILDREN']]).it(
			'%s',
			(key) => {
				expect(typeof routerMatch[key]).toBe('symbol');
			}
		);
	});
});

describe('Methods', () => { // eslint-disable-line jest/lowercase-name
	let route;
	beforeEach(() => {
		const RouteMatch = Route.extend(routerMatch);
		route = new RouteMatch();
	});

	describe('.handle', () => {
		describe('calls [MATCH]', () => {
			let req;
			beforeEach(() => {
				route[MATCH] = spy();
				req = {};
				route.handle(req);
			});

			it('once', () => {
				expect(route[MATCH]).toHaveBeenCalledTimes(1);
			});

			it('with request', () => {
				expect(route[MATCH]).toHaveBeenCalledWith(req);
			});
		});

		it('if [MATCH] returns null, does not call [HANDLE_MATCH]', () => {
			route[MATCH] = () => null;
			route[HANDLE_MATCH] = spy();
			route.handle();
			expect(route[HANDLE_MATCH]).not.toHaveBeenCalled();
		});

		describe('if [MATCH] returns object, calls [HANDLE_MATCH]', () => {
			let req, match, ret, res;
			beforeEach(() => {
				match = {};
				route[MATCH] = () => match;
				route[HANDLE_MATCH] = spy(() => res);
				req = {};
				ret = route.handle(req);
			});

			it('once', () => {
				expect(route[HANDLE_MATCH]).toHaveBeenCalledTimes(1);
			});

			it('with request and match', () => {
				expect(route[HANDLE_MATCH]).toHaveBeenCalledWith(req, match);
			});

			it('and returns return value of [HANDLE_MATCH]', () => {
				expect(ret).toBe(res);
			});
		});
	});

	describe('[HANDLE_MATCH]', () => {
		describe('if called with match object with truthy `.exact` property', () => {
			let req, ret, res;
			beforeEach(() => {
				res = {};
				route[HANDLE_ROUTE] = spy(() => res);
				route[HANDLE_CHILDREN] = spy();
				req = {};
				ret = route[HANDLE_MATCH](req, {exact: true});
			});

			describe('calls [HANDLE_ROUTE]', () => {
				it('once', () => {
					expect(route[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
				});

				it('with request', () => {
					expect(route[HANDLE_ROUTE]).toHaveBeenCalledWith(req);
				});
			});

			it('does not call [HANDLE_CHILDREN]', () => {
				expect(route[HANDLE_CHILDREN]).not.toHaveBeenCalled();
			});

			it('returns return value of [HANDLE_ROUTE]', () => {
				expect(ret).toBe(res);
			});
		});

		describe('if called with match object with falsy `.exact` property', () => {
			let req, ret, res;
			beforeEach(() => {
				res = {};
				route[HANDLE_ROUTE] = spy();
				route[HANDLE_CHILDREN] = spy(() => res);
				req = {};
				ret = route[HANDLE_MATCH](req, {exact: false});
			});

			describe('calls [HANDLE_CHILDREN]', () => {
				it('once', () => {
					expect(route[HANDLE_CHILDREN]).toHaveBeenCalledTimes(1);
				});

				it('with request', () => {
					expect(route[HANDLE_CHILDREN]).toHaveBeenCalledWith(req);
				});
			});

			it('does not call [HANDLE_ROUTE]', () => {
				expect(route[HANDLE_ROUTE]).not.toHaveBeenCalled();
			});

			it('returns return value of [HANDLE_CHILDREN]', () => {
				expect(ret).toBe(res);
			});
		});
	});

	describe('[HANDLE_ROUTE]', () => {
		it('returns null', () => {
			const ret = route[HANDLE_ROUTE]({});
			expect(ret).toBeNull();
		});
	});

	describe('[HANDLE_CHILDREN]', () => {
		describe("calls 1st child's .handle method", () => {
			let child, req;
			beforeEach(() => {
				child = new Route({handle: spy()});
				route.attachChild(child);

				req = {};
				route[HANDLE_CHILDREN](req);
			});

			it('once', () => {
				expect(child.handle).toHaveBeenCalledTimes(1);
			});

			it('with request', () => {
				expect(child.handle).toHaveBeenCalledWith(req);
			});
		});

		describe("if 1st child's .handle method returns non-null value", () => {
			let child, res;
			beforeEach(() => {
				res = {};
				child = new Route({handle: () => res});
				route.attachChild(child);
			});

			it('returns this value', () => {
				const ret = route[HANDLE_CHILDREN]();
				expect(ret).toBe(res);
			});

			it('does not call later children', () => {
				const child2 = new Route({handle: spy()});
				route.attachChild(child2);

				route[HANDLE_CHILDREN]();

				expect(child2.handle).not.toHaveBeenCalled();
			});
		});

		describe("if 1st child's .handle method returns null", () => {
			let child1, child2, req, res, ret;
			beforeEach(() => {
				child1 = new Route({handle: () => null});
				route.attachChild(child1);

				res = {};
				child2 = new Route({handle: spy(() => res)});
				route.attachChild(child2);

				req = {};
				ret = route[HANDLE_CHILDREN](req);
			});

			describe("calls 2nd child's .handle method", () => {
				it('once', () => {
					expect(child2.handle).toHaveBeenCalledTimes(1);
				});

				it('with request', () => {
					expect(child2.handle).toHaveBeenCalledWith(req);
				});
			});

			it("returns 2nd child's .handle method's return value", () => {
				expect(ret).toBe(res);
			});
		});

		it('if no children, returns null', () => {
			const ret = route[HANDLE_CHILDREN]();
			expect(ret).toBeNull();
		});

		it("if all childrens' .handle methods return null, returns null", () => {
			const child1 = new Route({handle: () => null});
			route.attachChild(child1);

			const child2 = new Route({handle: () => null});
			route.attachChild(child2);

			const ret = route[HANDLE_CHILDREN]();
			expect(ret).toBeNull();
		});
	});
});
