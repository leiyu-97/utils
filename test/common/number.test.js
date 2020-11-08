const assert = require('assert');
const { isEqual } = require('../../src/common/number');

describe('number', () => {
  describe('isEqual', () => {
    it('正常返回', () => {
      assert(isEqual(0.1 + 0.2, 0.3));
    });
  });
});
