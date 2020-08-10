/* eslint-env browser, mocha */
/* global Mocha */
Mocha.reporters.Base.prototype.epilogue = () => null;
mocha.setup({ ui: 'bdd', reporter: 'spec', color: true });
