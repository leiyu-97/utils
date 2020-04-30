const assert = require('assert');
const {
  accurate, isEqual, unscientific, accurateStringify,
} = require('../src/number');

describe('number', () => {
  describe('accurate', () => {
    it('负精确度', () => {
      assert(accurate(123.456, -2) === 123.46);
    });

    it('正精确度', () => {
      assert(accurate(123.456, 2) === 100);
    });

    it('零精确度', () => {
      assert(accurate(123.456, 0) === 123);
    });

    const extremeInteger = 9007199254740990;
    const extremeFraction = 0.0000000000000002220446049250313;
    it('正极端数正精确度', () => {
      assert(accurate(extremeInteger, 2) === 9007199254741000);
      assert(accurate(extremeInteger, 10) === 9007200000000000);
    });

    it('负极端数正精确度', () => {
      assert(accurate(-extremeInteger, 2) === -9007199254741000);
      assert(accurate(-extremeInteger, 10) === -9007200000000000);
    });

    it('正极端数负精确度', () => {
      assert(
        accurate(extremeFraction, -31) === 0.0000000000000002220446049250313,
      );
      assert(accurate(extremeFraction, -24) === 0.000000000000000222044605);
      assert(accurate(extremeFraction, -16) === 0.0000000000000002);
      assert(accurate(extremeFraction, -1) === 0);
    });

    it('负极端数负精确度', () => {
      assert(
        accurate(-extremeFraction, -31) === -0.0000000000000002220446049250313,
      );
      assert(accurate(-extremeFraction, -24) === -0.000000000000000222044605);
      assert(accurate(-extremeFraction, -16) === -0.0000000000000002);
      assert(accurate(-extremeFraction, -1) === 0);
    });
  });

  describe('isEqual', () => {
    it('正常返回', () => {
      assert(isEqual(0.1 + 0.2, 0.3));
    });
  });

  describe('unscientific', () => {
    it('正常数', () => {
      assert(unscientific(12345) === '12345');
    });

    it('大数', () => {
      assert(unscientific(1e16) === '10000000000000000');
      assert(unscientific(1e32) === '100000000000000000000000000000000');
    });

    it('小数', () => {
      assert(unscientific(1.234567890e-5) === '0.0000123456789');
    });
  });

  describe('accurateStringify', () => {
    it('负精确度', () => {
      assert(accurateStringify(123.4567, -3) === '123.457');
      assert(accurateStringify(123.45, -4) === '123.4500');
    });

    it('正精确度', () => {
      assert(accurateStringify(12345000, 3) === '12345000');
      assert(accurateStringify(12345000, 5) === '12300000');
    });
  });
});
