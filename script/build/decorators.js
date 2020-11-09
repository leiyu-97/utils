const { declare } = require('@babel/helper-plugin-utils');

module.exports = declare(() => ({
  manipulateOptions({ parserOpts }) {
    parserOpts.plugins.push(['decorators-legacy']);
  },
}));
