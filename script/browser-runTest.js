/* eslint-env browser */
const { mocha, $endTest } = window;

const runner = mocha.run();

let passed = true;
runner.once('fail', () => { passed = false; });
runner.once('end', () => $endTest({ coverage: window.__coverage__, passed }));
