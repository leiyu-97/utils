const base = require('../.eslintrc.js');

module.exports = {
  ...base,
  env: {
    mocha: true,
    node: true
  }
}