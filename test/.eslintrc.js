'use strict';

module.exports = {
	extends: [
		'@overlookmotel/eslint-config-jest'
	],
	rules: {
		'import/no-unresolved': ['error', {ignore: ['^@overlook/plugin-match$']}],
		'node/no-missing-require': ['error', {allowModules: ['@overlook/plugin-match']}]
	}
};
