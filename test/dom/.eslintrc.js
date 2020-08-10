const base = require('../.eslintrc.js');

const { globals = {} } = base;

module.exports = {
  ...base,
  globals: {
    ...globals,
    page: true,
    browser: true
  }
}