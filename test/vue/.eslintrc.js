const base = require('../.eslintrc.js');

module.exports = {
  ...base,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    allowImportExportEverywhere: true,
    codeFrame: false,
  },
  extends: [...base.extends, 'plugin:vue/recommended'],
  rules: {
    ...base.rules,
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 3,
        multiline: {
          max: 1,
          allowFirstLine: false,
        },
      },
    ],
  },
};
