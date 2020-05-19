# Changelog

## 0.8.2

Refactor:

* Shorten code

## 0.8.1

Dependencies:

* Update `@overlook/route` + `@overlook/plugin` dependencies

Dev:

* Update dev dependencies

## 0.8.0

Breaking changes:

* Treat `null` as definitive no match

Features:

* ESM export

Refactor:

* Use `invariant`

Dependencies:

* Update `@overlook/route` + `@overlook/plugin` dependencies
* Update `is-it-type` dependency

Dev:

* Update dev dependencies

## 0.7.1

Refactor:

* Fully specify require file paths

Dependencies:

* Update dependencies

No code:

* Config file header comments

Tests:

* Run tests in dev mode
* Import from package name [refactor]
* Rename vars [refactor]

Dev:

* Update dev dependencies
* Run tests on CI on Node v14
* Replace `.npmignore` with `files` list in `package.json`
* `.editorconfig` config
* ESLint lint dot files
* Remove unnecessary line from `.gitignore`
* Simplify Jest config

## 0.7.0

Breaking changes:

* Rename module `@overlook/plugin-match`
* Return instance of `@overlook/plugin`
* Drop support for Node v8

No code:

* NPM ignore `.DS_Store` files

Dependencies:

* Switch `core-util-is` for `is-it-type`

Tests:

* Remove unhandled rejection handling

Dev:

* Run tests on CI on Node v13
* Update dev dependencies
* ESLint ignore coverage dir
* Reformat Jest config
* Remove `sudo` from Travis CI config

Docs:

* README update
* Versioning policy
* NPM keywords
* Update license year

## 0.6.3

Features:

* Add debugging instrumentation to `.handle`

Bug fixes:

* Allow super `.handle` method to handle first

Misc:

* Throw error if `[MATCH]` returns invalid result

Tests:

* Remove `jest-each` dependency [refactor]
* Rename tests [nocode]

Dev:

* Update `@overlook/route` dev dependency

Docs:

* Document all features

## 0.6.2

Docs:

* Fix missing Changelog entry

## 0.6.1

Dev:

* Replace `@overlook/core` dev dependency with `@overlook/route`

Docs:

* Readme update

## 0.6.0

Breaking changes:

* Route extension identifier located at `.IDENTIFIER`

## 0.5.0

Breaking changes:

* Rename identifier symbol property to `.identifier`

Tests:

* Tests for all features
* Tests: Rename `utils` to `support` [refactor]

Dev:

* Add `package-lock.json`
* Travis CI cache npm modules

## 0.4.0

Breaking changes:

* Export function for use with `Route.extend`

## 0.3.0

Breaking changes:

* `.handle` returns `null` as default

## 0.2.0

Features:

* `[HANDLE_MATCH]` method

## 0.1.0

* Initial release
