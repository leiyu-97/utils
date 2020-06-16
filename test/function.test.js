const assert = require('assert');
const { memorize } = require('../src/function');

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
});
