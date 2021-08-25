const base = require('../.eslintrc.js');
const baseExtends = base.extends || [];
const baseRules = base.rules || {};
const basePlugins = base.plugins || [];

module.exports = {
  ...base,
  "plugins": [ "react" ...basePlugins],
  extends: [...base.extends, 'plugin:react/recommended'],
  rules: {
    ...baseRules,
    'react/prop-types': 0
  }
}