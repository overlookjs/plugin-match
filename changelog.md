# Changelog

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
