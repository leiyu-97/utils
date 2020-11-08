const path = require('path')

module.exports = {
  slow: 75,
  recursive: true,
  require: [path.resolve(__dirname, './babel-register')],
  spec: ["test/common/**/*.test.js", "test/common/**/*.test.ts"],
  extension: ["js", "ts"],
};
