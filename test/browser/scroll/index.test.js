const assert = require('assert');
const { getScrollLeft, getScrollTop } = require('../../../src/browser/dom');

describe('dom', () => {
  const target = document.getElementById('target');
  const div1 = document.getElementById('div1');
  const div2 = document.getElementById('div2');
  const div3 = document.getElementById('div3');

  describe('getScrollLeft', () => {
    it('简单场景', () => {
      div1.scrollTo(500, 0);
      assert(getScrollLeft(target) === 500);
      div1.scrollTo(0, 0);
    });

    it('多重滚动', () => {
      div1.scrollTo(500, 0);
      div2.scrollTo(400, 0);
      assert(getScrollLeft(target) === 900);
      div1.scrollTo(0, 0);
      div2.scrollTo(0, 0);
    });

    it('endpoint', () => {
      div1.scrollTo(500, 0);
      div2.scrollTo(400, 0);
      div3.scrollTo(300, 0);
      assert(getScrollLeft(target, div2) === 700);
      div1.scrollTo(0, 0);
      div2.scrollTo(0, 0);
      div3.scrollTo(0, 0);
    });
  });

  describe('getScrollTop', () => {
    it('简单场景', () => {
      div1.scrollTo(0, 500);
      assert(getScrollTop(target) === 500);
      div1.scrollTo(0, 0);
    });

    it('多重滚动', () => {
      div1.scrollTo(0, 500);
      div2.scrollTo(0, 400);
      assert(getScrollTop(target) === 900);
      div1.scrollTo(0, 0);
      div2.scrollTo(0, 0);
    });

    it('endpoint', () => {
      div1.scrollTo(0, 500);
      div2.scrollTo(0, 400);
      div3.scrollTo(0, 300);
      assert(getScrollTop(target, div2) === 700);
      div1.scrollTo(0, 0);
      div2.scrollTo(0, 0);
      div3.scrollTo(0, 0);
    });
  });
});
