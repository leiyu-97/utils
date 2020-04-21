const path = require("path");

module.exports = {
  extends: ["airbnb-base"],
  plugins: ["import"],
  rules: {
    "no-param-reassign": [2, { props: false }],
    "no-nested-ternary": 0,
    "no-console": 1,
    "radix": 0,
    "no-restricted-syntax": 0,
    "guard-for-in": 0,
    "no-plusplus": 0,
    "no-param-reassign": 0,
    "func-names": 0
  },
  env: {
    node: true,
    mocha: true
  }
};
