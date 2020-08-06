/* eslint-env browser */
const { $consoleLog, $consoleWarn, $consoleError } = window;

console.log = $consoleLog;
console.warn = $consoleWarn;
console.error = $consoleError;
