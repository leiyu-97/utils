const path = require('path');
const base = require('../.eslintrc.js');

const basePlugins = base.plugins || [];
const baseExtends = base.extends || [];
const baseRules = base.rules || {};
const baseEnv = base.env || {};

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
  env: {
    mocha: true,
    node: true,
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', path.resolve(__dirname, '../src')],
        ],
        extensions: ['.ts', '.js', '.jsx', '.jsx', '.json', '.vue'],
      },
    },
  },
};
