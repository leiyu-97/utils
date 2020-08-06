const base = require('../.eslintrc.js');

module.exports = {
  ...base,
  rules: {
    ...base.rules,
    "no-console": 0
  }
}