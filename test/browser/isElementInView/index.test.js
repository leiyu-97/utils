const assert = require('assert');
const { isElementInView } = require('../../../src/browser/dom');

window.isElementInView = isElementInView;

describe('isElementInView', () => {
  const target = document.getElementById('target');
  const div1 = document.getElementById('div1');
  const div2 = document.getElementById('div2');
  const div3 = document.getElementById('div3');
  describe('getScrollLeft', () => {
    it('在视口外', () => {
      assert(!isElementInView(target));
    });

    it('在视口内', () => {
      div1.scrollTo(500, 500);
      div2.scrollTo(500, 500);
      div3.scrollTo(500, 500);
      assert(isElementInView(target));
      div1.scrollTo(0, 0);
      div2.scrollTo(0, 0);
      div3.scrollTo(0, 0);
    });

    it('外层滚出视口', () => {
      div1.scrollTo(750, 500);
      div2.scrollTo(500, 500);
      div3.scrollTo(500, 500);
      assert(!isElementInView(target));
      div1.scrollTo(0, 0);
      div2.scrollTo(0, 0);
      div3.scrollTo(0, 0);
    });

    it('内层滚出视口', () => {
      div1.scrollTo(500, 500);
      div2.scrollTo(500, 500);
      div3.scrollTo(750, 500);
      assert(!isElementInView(target));
      div1.scrollTo(0, 0);
      div2.scrollTo(0, 0);
      div3.scrollTo(0, 0);
    });

    it('横向滚出视口', () => {
      div1.scrollTo(500, 500);
      div2.scrollTo(500, 500);
      div3.scrollTo(750, 500);
      assert(!isElementInView(target));
      div1.scrollTo(0, 0);
      div2.scrollTo(0, 0);
      div3.scrollTo(0, 0);
    });

    it('纵向滚出视口', () => {
      div1.scrollTo(500, 500);
      div2.scrollTo(500, 500);
      div3.scrollTo(500, 750);
      assert(!isElementInView(target));
      div1.scrollTo(0, 0);
      div2.scrollTo(0, 0);
      div3.scrollTo(0, 0);
    });

    it('位置在视口中，但由于父窗口不可见而不可见', () => {
      div1.scrollTo(500, 500);
      div2.scrollTo(1000, 500);
      div3.scrollTo(0, 500);
      assert(!isElementInView(target));
      div1.scrollTo(0, 0);
      div2.scrollTo(0, 0);
      div3.scrollTo(0, 0);
    });
  });
});
