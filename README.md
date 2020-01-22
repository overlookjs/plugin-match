[![NPM version](https://img.shields.io/npm/v/@overlook/plugin-match.svg)](https://www.npmjs.com/package/@overlook/plugin-match)
[![Build Status](https://img.shields.io/travis/overlookjs/plugin-match/master.svg)](http://travis-ci.org/overlookjs/plugin-match)
[![Dependency Status](https://img.shields.io/david/overlookjs/plugin-match.svg)](https://david-dm.org/overlookjs/plugin-match)
[![Dev dependency Status](https://img.shields.io/david/dev/overlookjs/plugin-match.svg)](https://david-dm.org/overlookjs/plugin-match)
[![Greenkeeper badge](https://badges.greenkeeper.io/overlookjs/plugin-match.svg)](https://greenkeeper.io/)
[![Coverage Status](https://img.shields.io/coveralls/overlookjs/plugin-match/master.svg)](https://coveralls.io/r/overlookjs/plugin-match)

# Overlook framework match router

Part of the [Overlook framework](https://overlookjs.github.io/).

## Abstract

Route class extension which delegates handling of request either to this route, or children, based on matching the request.

This is the base building block of conditional routing.

This module does not include logic for determining which route should handle a request. It only provides the mechanism for delegation to that route once the route-matching decision is made.

An example of a module which builds on this one is [@overlook/router-path](https://www.npmjs.com/package/@overlook/router-path), which routes requests depending on request path.

## Usage

### Handling

This extension extends `.handle()` method to call `[MATCH]()` to determine if this request matches the route. It then calls other methods, depending on the matching result.

### Matching logic

User should define matching logic by overriding `[MATCH]()` method.

`[MATCH]( req )`:

* Is called with request object
* Should return an object if the request matches this route
* Should return `null` if it doesn't

Object returned in case of a match should have a property `.exact` which is:

* `true` if is an exact match
* `false` if is a match but not exact (i.e. should be delegated to children)

The object can have any other custom properties desired.

```js
const Route = require('@overlook/route');
const matchExtension = require('@overlook/plugin-match');
const {MATCH} = matchExtension;
const RouteMatch = Route.extend( matchExtension );

class MyMatchRoute extends RouteMatch {
  [MATCH](req) => {
    const {path} = req;
    if (path === '/abc' || path === '/abc/') return {exact: true};
    if (path.slice(0, 5) === '/abc/') return {exact: false};
    return null;
  }
}
```

The above example says:

* if request path is '/abc', handle it with this route
* if request path is '/abc/*', delegate handling to children
* otherwise, do not handle - throw it back to this route's parent

### Handling match

#### `[HANDLE_MATCH]( req, match )`

In the case of a match, `[HANDLE_MATCH]()` is called.

`[HANDLE_MATCH]()` will:

* Be called with request object and match object (i.e. the object returned by `[MATCH]()`)
* Call `[HANDLE_ROUTE]()` if exact match
* Call `[HANDLE_CHILDREN]()` if non-exact match

If you want to take any action before/after handling, extend `[HANDLE_MATCH]()`.

#### `[HANDLE_ROUTE]( req )`

`[HANDLE_ROUTE]()` by default does nothing. It returns `null`.

`[HANDLE_ROUTE]()` should be extended by user to handle the request.

It is called with the request object.

#### `[HANDLE_CHILDREN]( req )`

`[HANDLE_CHILDREN]()` calls each of the route's childrens' `.handle()` methods with the request object until one returns a non-null value. It returns this value to `.handle()` which in turn returns it.

i.e. First child to say it has handled the request gets it.

### Tree of match routes

If you create a tree of match routes, a request can be given to `.handle()` of root route, and it will propagate up the tree to the appropriate route to handle.

This is a more efficient routing algorithm than e.g. Express, which uses a flat array of handlers, which it has to loop through.

The result returned from `root.handle()` will be the result from whichever route handled the request. So if the route handler returns a promise, it can be awaited to know if the request was handled successfully.

## Tests

Use `npm test` to run the tests. Use `npm run cover` to check coverage.

## Changelog

See [changelog.md](https://github.com/overlookjs/plugin-match/blob/master/changelog.md)

## Issues

If you discover a bug, please raise an issue on Github. https://github.com/overlookjs/plugin-match/issues

## Contribution

Pull requests are very welcome. Please:

* ensure all tests pass before submitting PR
* add tests for new features
* document new functionality/API additions in README
* do not add an entry to Changelog (Changelog is created when cutting releases)
