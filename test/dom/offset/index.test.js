/* eslint-env browser */
const assert = require('assert');
const { getOffsetLeft, getOffsetTop } = require('../../../src/dom/utils');

describe('dom', () => {
  const target = document.getElementById('target');
  const div1 = document.getElementById('div1');
  const div2 = document.getElementById('div2');
  const div3 = document.getElementById('div3');

  describe('getOffsetLeft', () => {
    it('简单场景', () => {
      div1.style.left = 500;
      assert(getOffsetLeft(target) === 500);
      div1.style.left = 0;
    });

    it('复杂场景', () => {
      div1.style.left = 500;
      div2.style.left = 400;
      div3.style.left = 300;
      assert(getOffsetLeft(target) === 1200);
      div1.style.left = 0;
      div2.style.left = 0;
      div3.style.left = 0;
    });

    it('endpoint', () => {
      div1.style.left = 500;
      div2.style.left = 400;
      div3.style.left = 300;
      assert(getOffsetLeft(target, div2) === 300);
      div1.style.left = 0;
      div2.style.left = 0;
      div3.style.left = 0;
    });
  });

  describe('getOffsetTop', () => {
    it('简单场景', () => {
      div1.style.top = 500;
      assert(getOffsetTop(target) === 500);
      div1.style.top = 0;
    });

    it('复杂场景', () => {
      div1.style.top = 500;
      div2.style.top = 400;
      div3.style.top = 300;
      assert(getOffsetTop(target) === 1200);
      div1.style.top = 0;
      div2.style.top = 0;
      div3.style.top = 0;
    });

    it('endpoint', () => {
      div1.style.top = 500;
      div2.style.top = 400;
      div3.style.top = 300;
      assert(getOffsetTop(target, div2) === 300);
      div1.style.top = 0;
      div2.style.top = 0;
      div3.style.top = 0;
    });
  });
});
