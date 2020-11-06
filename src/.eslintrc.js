/* eslint-disable */
const base = require('../.eslintrc.js');

const basePlugins = base.plugins || [];
const baseExtends = base.extends || [];
const baseRules = base.rules || {};

module.exports = {
  ...base,
  parser: '@typescript-eslint/parser',
  plugins: [...basePlugins, '@typescript-eslint'],
  extends: [
    ...baseExtends,
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    ...baseRules,
    '@typescript-eslint/no-explicit-any': [1, { ignoreRestArgs: true }],
  },
};
