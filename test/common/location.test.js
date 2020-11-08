const assert = require('assert');
const { computeDistance } = require('../../src/common/location');

describe('location', () => {
  describe('computeDistance', () => {
    const A = [22.627205, 113.812085]; // 深圳机场
    const B = [22.59628, 113.841105]; // 南昌公园
    it('模糊模式距离计算正确', () => {
      const distance = Math.round(computeDistance(A, B));
      assert(distance < 5000 && distance > 4000);
    });

    it('精确模式距离计算正确', () => {
      const distance = Math.round(computeDistance(A, B, true));
      assert(distance < 5000 && distance > 4000);
    });
  });
});
