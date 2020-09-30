const assert = require('assert');
const { memorize, throttle, debounce } = require('../../src/function');
const { wait } = require('../../src/promise');
const { slow: defaultSlow } = require('../.mocharc');

describe('function', () => {
  describe('memorize', () => {
    it('可以正常缓存', () => {
      let counter = 0;
      const sum = memorize((a, b) => {
        counter++;
        return a + b;
      });

      sum(1, 2);
      sum(2, 1);
      sum(1, 2);
      sum(1, 2);
      assert(counter === 2);
    });

    it('自定义 getKey 方法', () => {
      let counter = 0;
      const sum = memorize((a, b) => {
        counter++;
        return a + b;
      }, { getKey: (a, b) => JSON.stringify(a > b ? [a, b] : [b, a]) });

      sum(1, 2);
      sum(2, 1);
      sum(1, 2);
      sum(1, 2);
      assert(counter === 1);
    });
  });

  describe('throttle', () => {
    it('函数调用正常', () => {
      let counter = 0;
      const innerFunc = () => counter++;
      const func = throttle(innerFunc, 50);
      func();
      assert(counter === 1);
    });

    it('节流功能正常', async function () {
      this.slow(defaultSlow + 200);
      let counter = 0;
      const innerFunc = () => counter++;
      const func = throttle(innerFunc, 50);

      const startTime = Date.now();
      while (Date.now() - startTime < 190) {
        func();
        await wait(0); // eslint-disable-line
      }

      assert(counter === 4);
    });
  });

  describe('debounce', () => {
    it('函数调用正常', async function () {
      this.slow(defaultSlow + 60);
      let counter = 0;
      const innerFunc = () => counter++;
      const func = debounce(innerFunc, 50);
      func();
      await wait(60);
      assert(counter === 1);
    });

    it('防抖功能正常', async function () {
      this.slow(defaultSlow + 250);
      let counter = 0;
      const innerFunc = () => counter++;
      const func = debounce(innerFunc, 50);

      const startTime = Date.now();
      while (Date.now() - startTime < 190) {
        func();
        await wait(0); // eslint-disable-line
      }

      await wait(60);

      assert(counter === 1);
    });
  });
});
