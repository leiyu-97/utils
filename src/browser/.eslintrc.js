const base = require('../../.eslintrc.js');

module.exports = {
  ...base,
  env: {
    ...base.env,
    browser: true
  }
}