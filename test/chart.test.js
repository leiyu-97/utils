const assert = require('assert');
const { linearInterpolation, cubicHermiteInterpolation, fade } = require('../src/chart');
const { isEqual } = require('../src/number');
const { repeat } = require('../src/base');

describe('chart', () => {
  describe('linearInterpolation', () => {
    it('正常返回', () => {
      assert(linearInterpolation([1, 1], [3, 3])(2));
    });

    it('返回值正确', () => {
      assert(linearInterpolation([1, 1], [3, 3])(2) === 2);
    });

    it('随机交叉验证', () => {
      repeat(() => {
        const x1 = Math.random();
        const x2 = Math.random() + 4;
        const x = Math.random() + 2;
        const y1 = Math.random();
        const y2 = Math.random();
        const y = linearInterpolation([x1, y1], [x2, y2])(x);
        assert(isEqual(linearInterpolation([x, y], [x1, y1])(x2), y2, 6));
        assert(isEqual(linearInterpolation([x, y], [x2, y2])(x1), y1, 6));
      }, 100);
    });
  });
});
