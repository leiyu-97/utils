const base = require('../.eslintrc.js');

module.exports = {
  ...base,
  parser: "babel-eslint",
  "plugins": [ "react" ],
  extends: [...base.extends, 'plugin:react/recommended'],
  env: {
    mocha: true,
    node: true
  },
  rules: {
    ...base.rules,
    'react/prop-types': 0
  }
}