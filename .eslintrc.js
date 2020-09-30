const path = require("path");

module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "airbnb-base",
  ],
  rules: {
    "no-param-reassign": [2, { props: false }],
    "no-nested-ternary": 0,
    "no-console": 1,
    radix: 0,
    "no-restricted-syntax": 0,
    "guard-for-in": 0,
    "no-plusplus": 0,
    "no-param-reassign": 0,
    "func-names": 0,
    "implicit-arrow-linebreak": 0,
    "valid-jsdoc": 2,
    "no-underscore-dangle": 0,
    "no-bitwise": 0,
    "no-constant-condition": 0,
    "import/prefer-default-export": 0,
    "import/no-extraneous-dependencies": [
      2,
      { devDependencies: ["test/**/*", "script/**/*"] },
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "@typescript-eslint/no-explicit-any": [1, { ignoreRestArgs: true }],
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  env: {
    node: true,
  },
};
