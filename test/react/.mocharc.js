const path = require("path");
module.exports = {
  recursive: true,
  require: [
    path.resolve(__dirname, "./babel-register"),
    path.resolve(__dirname, "./setup.js"),
  ],
  extension: ["jsx"],
};
