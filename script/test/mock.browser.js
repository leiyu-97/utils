/* eslint-env browser */
const {
  $consoleLog, $consoleWarn, $consoleError, $execPageCommand, $execBrowserCommand,
} = window;

const consoleLog = console.log;
const consoleWarn = console.warn;
const consoleError = console.error;

console.log = function (...args) {
  $consoleLog(...args);
  consoleLog.call(console, ...args);
};
console.warn = function (...args) {
  $consoleWarn(...args);
  consoleWarn.call(console, ...args);
};
console.error = function (...args) {
  $consoleError(...args);
  consoleError.call(console, ...args);
};

window.page = new Proxy({}, {
  get(target, name) {
    return function (...args) {
      $execPageCommand.call(this, { name, args });
    };
  },
});

window.browser = new Proxy({}, {
  get(target, name) {
    return function (...args) {
      $execBrowserCommand.call(this, { name, args });
    };
  },
});
