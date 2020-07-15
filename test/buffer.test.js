const assert = require('assert');
const { split } = require('../src/buffer');

describe('buffer', () => {
  describe('split', () => {
    const parent = Buffer.from('1234567890'.repeat(10));
    const result = split(parent, '01');

    it('正常工作', () => {
      assert(result.length === 10);
      assert(result[0].toString() === '123456789');
    });
  });
});
