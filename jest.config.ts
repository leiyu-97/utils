export default {
  moduleFileExtensions: [
    "js",
    "json",
    "jsx",
    "ts",
    "tsx",
    "vue"
  ],
  testEnvironment: "node",
  testPathIgnorePatterns: [
    "/node_modules/"
  ],
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      babelConfig: {
        presets: ['power-assert']
      }
    }
  },
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx,vue}", "!**/node_modules/**", "!**/.*.js", "!src/dom/*"],
  coverageDirectory: './.nyc_output',
  coverageReporters: ['json'],
  transform: {"\\.[jt]sx?$": "babel-jest"},
  projects: [
    {
      testMatch: ["**/test/common/**/*.test.*"],
    },
      {
      testMatch: ["**/test/node/**/*.test.*"],
    },
    {
      testMatch: ["**/test/react/**/*.test.*"],
      setupFiles: ["./test/react/setup.js"],
      testEnvironment: "node",
    },
    {
      testMatch: ["**/test/vue/**/*.test.*"],
      setupFiles: ["./test/vue/setup.js"],
      testEnvironment: "node",
      transform: {
        ".*\\.(vue)$": "vue-jest",
        "\\.[jt]sx?$": "babel-jest"
      },
    }
  ]
};
