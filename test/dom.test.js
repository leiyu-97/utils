const jsdom = require('jsdom');
const assert = require('assert');
const { isChildOf, isParentOf } = require('../src/dom');

const { JSDOM } = jsdom;

const domStr = `
<div id="parent">
  <div id="target">
    <div id="child"></div>
  </div>
  <div id="sibling"></div>
</div>
`;

const dom = new JSDOM(domStr);
const { document } = dom.window;
const parent = document.getElementById('parent');
const child = document.getElementById('child');
const sibling = document.getElementById('sibling');
const target = document.getElementById('target');


describe('dom', () => {
  describe('isChildOf', () => {
    it('结果正确', () => {
      assert(isChildOf(target, parent));
      assert(!isChildOf(target, child));
      assert(!isChildOf(target, sibling));
    });
  });

  describe('isParentOf', () => {
    it('结果正确', () => {
      assert(!isParentOf(target, parent));
      assert(isParentOf(target, child));
      assert(!isParentOf(target, sibling));
    });
  });
});
