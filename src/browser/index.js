const lazyLoad = require('./lazyLoad');
const dom = require('./dom');
const page = require('./page');

module.exports = { lazyLoad, ...dom, ...page };
