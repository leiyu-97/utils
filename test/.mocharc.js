const path = require('path')

module.exports = {
  slow: 75,
  recursive: true,
  require: [path.resolve(__dirname, './babel-register')],
  spec: ["test/**/*.test.js", "test/**/*.test.ts"],
  exclude: ["test/browser/**/*.js", "test/react/**/*.js"],
  extension: ["js", "jsx", "ts", "tsx"],
};
