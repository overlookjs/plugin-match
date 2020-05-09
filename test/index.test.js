/* --------------------
 * @overlook/plugin-match module
 * Tests
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	Plugin = require('@overlook/plugin'),
	matchPlugin = require('@overlook/plugin-match'),
	{MATCH, HANDLE_MATCH, HANDLE_ROUTE, HANDLE_CHILDREN} = matchPlugin;

// Init
const spy = jest.fn;

// Tests

describe('Plugin', () => { // eslint-disable-line jest/lowercase-name
	it('is an instance of Plugin class', () => {
		expect(matchPlugin).toBeInstanceOf(Plugin);
	});

	describe('when passed to `Route.extend()`', () => {
		let MatchRoute;
		beforeEach(() => {
			MatchRoute = Route.extend(matchPlugin);
		});

		it('returns subclass of Route', () => {
			expect(MatchRoute).toBeFunction();
			expect(Object.getPrototypeOf(MatchRoute)).toBe(Route);
			expect(Object.getPrototypeOf(MatchRoute.prototype)).toBe(Route.prototype);
		});
	});

	describe('exports symbols', () => {
		it.each([['MATCH'], ['HANDLE_MATCH'], ['HANDLE_ROUTE'], ['HANDLE_CHILDREN']])(
			'%s',
			(key) => {
				expect(typeof matchPlugin[key]).toBe('symbol');
			}
		);
	});
});

describe('Methods', () => { // eslint-disable-line jest/lowercase-name
	let route;
	beforeEach(() => {
		const MatchRoute = Route.extend(matchPlugin);
		route = new MatchRoute();
	});

	describe('`.handle()`', () => {
		describe('calls `[MATCH]()`', () => {
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

		it('if `[MATCH]()` returns null, does not call `[HANDLE_MATCH]()`', () => {
			route[MATCH] = () => null;
			route[HANDLE_MATCH] = spy();
			route.handle();
			expect(route[HANDLE_MATCH]).not.toHaveBeenCalled();
		});

		it('if `[MATCH]()` returns undefined, does not call `[HANDLE_MATCH]()`', () => {
			route[MATCH] = () => undefined;
			route[HANDLE_MATCH] = spy();
			route.handle();
			expect(route[HANDLE_MATCH]).not.toHaveBeenCalled();
		});

		describe('throw error if `[MATCH]()` returns', () => {
			it.each([
				['not object', true],
				['object without `.exact` property', {}],
				['object with non-boolean `.exact` property', {exact: 1}]
			])('%s', (name, val) => {
				route[MATCH] = () => val;
				expect(() => (
					route.handle()
				)).toThrowWithMessage(
					Error,
					'[MATCH]() must return an object with boolean `.exact` property, undefined or null (router path /)'
				);
			});
		});

		describe('if `[MATCH]()` returns object, calls `[HANDLE_MATCH]()`', () => {
			let req, match, ret, res;
			beforeEach(() => {
				match = {exact: true};
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

			it('and returns return value of `[HANDLE_MATCH]()`', () => {
				expect(ret).toBe(res);
			});
		});

		describe('tags error with debug info if thrown in', () => {
			it('`[MATCH]()`', () => {
				route[MATCH] = () => { throw new Error('xyz'); };
				expect(
					() => route.handle()
				).toThrowWithMessage(Error, 'xyz (router path /)');
			});

			it('`[HANDLE_MATCH]()`', () => {
				route[MATCH] = () => ({exact: true});
				route[HANDLE_MATCH] = () => { throw new Error('xyz'); };
				expect(
					() => route.handle()
				).toThrowWithMessage(Error, 'xyz (router path /)');
			});

			it('`[HANDLE_ROUTE]()`', () => {
				route[MATCH] = () => ({exact: true});
				route[HANDLE_ROUTE] = () => { throw new Error('xyz'); };
				expect(
					() => route.handle()
				).toThrowWithMessage(Error, 'xyz (router path /)');
			});

			it('`[HANDLE_CHILDREN]()`', () => {
				route[MATCH] = () => ({exact: false});
				route[HANDLE_CHILDREN] = () => { throw new Error('xyz'); };
				expect(
					() => route.handle()
				).toThrowWithMessage(Error, 'xyz (router path /)');
			});

			it("child's `.handle()` method", () => {
				route[MATCH] = () => ({exact: false});
				const child = new Route({name: 'abc'});
				child.handle = () => { throw new Error('xyz'); };
				route.attachChild(child);

				expect(
					() => route.handle()
				).toThrowWithMessage(Error, 'xyz (router path /abc)');
			});
		});
	});

	describe('`[HANDLE_MATCH]()`', () => {
		describe('if called with match object with truthy `.exact` property', () => {
			let req, ret, res;
			beforeEach(() => {
				res = {};
				route[HANDLE_ROUTE] = spy(() => res);
				route[HANDLE_CHILDREN] = spy();
				req = {};
				ret = route[HANDLE_MATCH](req, {exact: true});
			});

			describe('calls `[HANDLE_ROUTE]()`', () => {
				it('once', () => {
					expect(route[HANDLE_ROUTE]).toHaveBeenCalledTimes(1);
				});

				it('with request', () => {
					expect(route[HANDLE_ROUTE]).toHaveBeenCalledWith(req);
				});
			});

			it('does not call `[HANDLE_CHILDREN]()`', () => {
				expect(route[HANDLE_CHILDREN]).not.toHaveBeenCalled();
			});

			it('returns return value of `[HANDLE_ROUTE]()`', () => {
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

			describe('calls `[HANDLE_CHILDREN]()`', () => {
				it('once', () => {
					expect(route[HANDLE_CHILDREN]).toHaveBeenCalledTimes(1);
				});

				it('with request', () => {
					expect(route[HANDLE_CHILDREN]).toHaveBeenCalledWith(req);
				});
			});

			it('does not call `[HANDLE_ROUTE]()`', () => {
				expect(route[HANDLE_ROUTE]).not.toHaveBeenCalled();
			});

			it('returns return value of `[HANDLE_CHILDREN]()`', () => {
				expect(ret).toBe(res);
			});
		});
	});

	describe('`[MATCH]()`', () => {
		it('returns undefined', () => {
			const ret = route[MATCH]({});
			expect(ret).toBeUndefined();
		});
	});

	describe('`[HANDLE_ROUTE]()`', () => {
		it('returns undefined', () => {
			const ret = route[HANDLE_ROUTE]({});
			expect(ret).toBeUndefined();
		});
	});

	describe('`[HANDLE_CHILDREN]()`', () => {
		describe("calls 1st child's `.handle()` method", () => {
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

		describe("if 1st child's `.handle()` method returns non-null value", () => {
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

		describe("if 1st child's `.handle()` method returns undefined", () => {
			let child1, child2, req, res, ret;
			beforeEach(() => {
				child1 = new Route({handle: () => undefined});
				route.attachChild(child1);

				res = {};
				child2 = new Route({handle: spy(() => res)});
				route.attachChild(child2);

				req = {};
				ret = route[HANDLE_CHILDREN](req);
			});

			describe("calls 2nd child's `.handle()` method", () => {
				it('once', () => {
					expect(child2.handle).toHaveBeenCalledTimes(1);
				});

				it('with request', () => {
					expect(child2.handle).toHaveBeenCalledWith(req);
				});
			});

			it("returns 2nd child's `.handle()` method's return value", () => {
				expect(ret).toBe(res);
			});
		});

		it('if no children, returns undefined', () => {
			const ret = route[HANDLE_CHILDREN]();
			expect(ret).toBeUndefined();
		});

		it("if all childrens' `.handle()` methods return undefined, returns undefined", () => {
			const child1 = new Route({handle: () => undefined});
			route.attachChild(child1);

			const child2 = new Route({handle: () => undefined});
			route.attachChild(child2);

			const ret = route[HANDLE_CHILDREN]();
			expect(ret).toBeUndefined();
		});
	});
});
