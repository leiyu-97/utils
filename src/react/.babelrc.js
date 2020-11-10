const config = require('../../.babelrc');

module.exports = {
  ...config,
  presets: [...config.presets, '@babel/react'],
};
