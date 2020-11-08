const path = require('path')

module.exports = {
  slow: 75,
  recursive: true,
  require: [path.resolve(__dirname, './babel-register')],
  spec: ["test/node/**/*.test.js", "test/node/**/*.test.ts"],
  extension: ["js", "ts"],
};
