/**
 * @module math
 */

/**
 * @static
 * @summary 高斯分布随机
 * @param {Number} mu μ
 * @param {Number} sigma σ
 */
function normalRandom(mu, sigma) {
  // https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
  const u1 = Math.random();
  const u2 = Math.random();

  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
  return z0 * sigma + mu;
}

/**
 * @static
 * @summary 三次 Hermite 插值
 * @param {Array} param0
 * @param {Number} param0.0 x0，该点的 x 坐标
 * @param {Number} param0.1 y0，该点的 y 坐标
 * @param {Number} param0.2 m0，该点的梯度
 * @param {Array} param1
 * @param {Number} param1.0 x1，该点的 x 坐标
 * @param {Number} param1.1 y1，该点的 y 坐标
 * @param {Number} param1.2 m1，该点的梯度
 * @return {Function} 插值函数
 */
function cubicHermiteInterpolation([x0, y0, m0], [x1, y1, m1]) {
  return function (x) {
    return (
      y0 * (1 + 2 * ((x - x0) / (x1 - x0))) * ((x - x1) / (x0 - x1)) ** 2
      + y1 * (1 + 2 * ((x - x1) / (x0 - x1))) * ((x - x0) / (x1 - x0)) ** 2
      + m0 * (x - x0) * ((x - x1) / (x0 - x1)) ** 2
      + m1 * (x - x1) * ((x - x0) / (x1 - x0)) ** 2
    );
  };
}

module.exports = {
  normalRandom,
  cubicHermiteInterpolation,
};
