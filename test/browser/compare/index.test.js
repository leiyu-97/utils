const assert = require('assert');
const { isChildOf, isParentOf } = require('../../../src/browser/dom');

describe('dom', () => {
  describe('isChildOf', () => {
    it('结果正确', () => {
      const parent = document.getElementById('parent');
      const child = document.getElementById('child');
      const sibling = document.getElementById('sibling');
      const target = document.getElementById('target');
      assert(isChildOf(target, parent));
      assert(!isChildOf(target, child));
      assert(!isChildOf(target, sibling));
    });
  });

  describe('isParentOf', () => {
    it('结果正确', () => {
      const parent = document.getElementById('parent');
      const child = document.getElementById('child');
      const sibling = document.getElementById('sibling');
      const target = document.getElementById('target');
      assert(!isParentOf(target, parent));
      assert(isParentOf(target, child));
      assert(!isParentOf(target, sibling));
    });
  });
});
